import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
  ScrollView,
  DeviceEventEmitter,
  Platform,
  KeyboardAvoidingView,Keyboard
} from "react-native";
import { Icon } from "native-base";
import FooterButton from "../../common/FooterButton";
import { Divider } from "react-native-elements";
import SearchPlan from "./SearchPlans";
import { APP_PRIMARY_COLOR } from "../../../../themes/variable";
import AsyncStorage from "@react-native-community/async-storage";
import {
  getLab,
  createLab,
  getLabData,
  deleteLab,
  UpdateLab
} from "../../../../redux/actions/addLab_action";
import { connect } from "react-redux";
import styles from "./AddImgStyles";
import { withTranslation } from "react-i18next";
import { NativeToast } from "../../common/Toaster";
import { hp } from "../../../../themes/Scale";
import { CONSULTATION } from "../../common/Constants";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
const AddLab = (props) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [labData, setLabData] = useState([]);
  const [lab, setLab] = useState([]);
  const [note, setNote] = useState("");
  const { t } = props;
  const { patientList } = props;

  const getData = async (val) => {
    setValue(val);
    if (val.length > 2) {
      const branch_id = await AsyncStorage.getItem("branch_id");
      const variables = {
        val,
        encounter_id: patientList.encounter_id,
        branch_id: patientList.appointment.branch_id,
        hlp_id: patientList.appointment.healpha_id
      };

      let data = await getLab(variables);
      setData(!val ? [] : data.values);
    }
  };
  //console.log(nursing, 'nursing');
  const deviceEmit = () => {
    DeviceEventEmitter.emit("getPatientCard", {
      appointmentId: patientList?.appointment?.id
    }),
      DeviceEventEmitter.emit("updateHomeScreen", { date: "" });
    [2000];
  };
  const SaveLab = async (val) => {
    if (lab.length < 1)
      return NativeToast({
        text: "Please Select Search Laboratory",
        type: "warning"
      });
    const variables = lab;
    console.log(variables, "variables");
    await createLab(variables, {
      template_id: props.navigation.state.params.templateId
    })
      .then((res) => {
        deviceEmit();
        DeviceEventEmitter.emit("getLaboratoryData", {
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id
        });
        NativeToast({ text: res.message, type: "success" });
        props.navigation.navigate("Consultation");
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const OnUpdateLab = async () => {
    labData.map((i) => {
      const variables = {
        id: i.id,
        enc_id: patientList.encounter_id,
        doc_id: patientList.appointment.doc_id,
        hlp_id: patientList.appointment.healpha_id,
        description: i.description
      };
      UpdateLab(variables)
        .then((res) => {
          deviceEmit();
          DeviceEventEmitter.emit("getLaboratoryData", {
            enc_id: patientList.encounter_id,
            doc_id: patientList.appointment.doc_id,
            hlp_id: patientList.appointment.healpha_id
          });
          NativeToast({ text: res.message, type: "success" });
          props.navigation.navigate("Consultation");
        })
        .catch((res) => {
          NativeToast({ text: res.message, type: "danger" });
        });
    });
  };
  const getlabdata = async (val) => {
    getLabData(val).then((res) => {
      setLabData(res.services);
    });
  };
  const GetLabData = async (val) => {
    const labData = await getLabData(val);
    setLabData(labData.services);
  };
  const DeleteLabData = async (id) => {
    const variable = {
      id,
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };

    await deleteLab(variable)
      .then((res) => {
        GetLabData({
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id
        });
        DeviceEventEmitter.emit("getLaboratoryData", {
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id
        });
        NativeToast({ text: res.message, type: "success" });
        // props.navigation.navigate(CONSULTATION);
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };
  useEffect(() => {
    const variables = {
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };
    getlabdata(variables);
  }, []);
  return (
    <View style={styles.head}>
      <MyStatusBar
        backgroundColor={APP_PRIMARY_COLOR}
        barStyle="light-content"
      />
      <View style={styles.search}>
        <SearchPlan
          name={t("COMMON.ADD") + " " + t("PLAN.LABORATORY")}
          save="Laboratory"
          placeholder={t("PLAN.SEARCH") + " " + t("PLAN.LABORATORY")}
          navigation={props.navigation}
          getData={getData}
          data={data}
          value={value}
        />
        <View style={styles.data}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: data.length > 0 ? hp(630) : null,
              position: Platform.OS === "ios" ? "absolute" : null
              // marginBottom: 100
              // display: data.length > 0 ? "flex" : "none"
            }}
            contentContainerStyle={{ flexGrow: 2 }}
            keyboardShouldPersistTaps="always">
            {!!value &&
              data
                .filter(
                  (x) =>
                    !lab
                      .map((vac) => vac.service_master_id)
                      .includes(x.service_master_id)
                )
                .map((i, index) => {
                  return (
                    <TouchableOpacity
                      // style={{ height: "90%" }}
                      key={index}
                      onPress={async () => {
                        const practice_id = await AsyncStorage.getItem(
                          "practice_id"
                        );
                        setData([]);
                        const addLab = {
                          ...i,
                          description: "",
                          service_group_id: +i.service_group_id,
                          encounter_id: patientList.encounter_id,
                          doc_id: patientList.appointment.doc_id,
                          hlp_id: patientList.appointment.healpha_id,
                          practice_id
                        };
                        setLab((prevVal) => [...prevVal, addLab]);
                        setValue("");
                      }}>
                      <View>
                        <Text style={styles.vaccineName}
                         testID={i.service_name+"text"}
                         accessibilityLabel={i.service_name+"text"}>{i.service_name}</Text>
                        <Divider
                          style={[
                            styles.divide,
                            {
                              width: "85%",
                              alignSelf: "center"
                            }
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
          </ScrollView>
        </View>
        <View style={styles.gap}></View>
        <View>
        {/* <ScrollView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.back, { marginBottom: Platform.OS == "ios" ? 500:hp(100) }]}> */}
        <ScrollView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.back, { marginBottom: hp(100) }]}>
        <KeyboardAvoidingView
            behavior={"padding" }
            // style={{ flex: 1 }}
            // style={{ flex: 1 }}
            onPress={Keyboard.dismiss}>
          <FlatList
            data={lab}
            scrollEnabled={true}
            keyExtractor={(item) => item.service_master_id + ""}
            renderItem={({ item, index }) => {
              return (
                <View style={{ top: 0 }}>
                  <View style={styles.brandName}>
                    <View style={styles.row}>
                      <Text style={{ width: "80%" }}
                       testID={item.service_name+"text"}
                       accessibilityLabel={item.service_name+"text"}>{item.service_name}</Text>
                    </View>

                    <View style={styles.row}>
                      <TouchableOpacity
                      testID="deleteTouch"
                      accessibilityLabel="deleteTouch"
                        onPress={() =>
                          setLab(
                            lab.filter(
                              (i) =>
                                i.service_master_id !== item.service_master_id
                            )
                          )
                        }>
                        <Icon
                        testID="deleteIcon"
                        accessibilityLabel="deleteIcon"
                          name="delete"
                          type="AntDesign"
                          style={styles.deleteIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Divider style={styles.divide} />
                  <View style={styles.inner}>
                    <Text style={styles.headings}
                    testID="notesText"
                    accessibilityLabel="notesText">Notes</Text>

                    {/* <TextInput
                      style={{backgroundColor: 'red', }}
                      editable={true}
                    /> */}
                    <TextInput
                    testID="notesTextInput"
                    accessibilityLabel="notesTextInput"
                      value={item.note}
                      onChangeText={(val) => {
                        const data = [...lab];
                        data[index].description = val;
                        setLab(data);
                      }}
                      multiline={true}
                      // numberOfLines={1}
                      style={styles.textinline}
                    />
                  </View>
                  <Divider style={styles.divide} />
                  {(lab.length==index+1)&&(
                    <View style={{height:Platform.OS=='ios'?400:0}}></View>
                  )}
                </View>
              );
            }}
          />

          {/* <View style={styles.lab}>
            {labData.map((i, index) => (
              <View style={styles.flow}>
                <View style={styles.medicineview}>
                  {i.deleted ? (
                    <View style={styles.textside}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.medicinetext,
                          {
                            textDecorationLine: "line-through",
                            textDecorationColor: "red"
                          }
                        ]}>
                        {i.service_name}
                      </Text>
                      <Text
                        style={[
                          styles.labtext,
                          {
                            textDecorationLine: "line-through",
                            textDecorationColor: "red"
                          }
                        ]}>
                        {i.description}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.textside}>
                      <Text numberOfLines={1} style={styles.medicinetext}>
                        {i.service_name}
                      </Text>
                      <Text style={styles.labtext}>{i.description}</Text>
                    </View>
                  )}

                  {i.deleted ? null : (
                    <TouchableOpacity onPress={() => DeleteLabData(i.id)}>
                      <Icon
                        name="delete"
                        type="AntDesign"
                        style={styles.deleteIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {labData.length - 1 !== index ? (
                  <Divider style={(styles.divide, { marginVertical: 5 })} />
                ) : null}
              </View>
            ))}

          </View> */}
          <View style={styles.back}>
            {labData ? (
              <FlatList
                data={labData}
                scrollEnabled={true}
                keyExtractor={(item) => item.service_master_id + ""}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <View style={{ top: 0 }}>
                        <View style={styles.brandName}>
                          {item.deleted ? (
                            <View style={styles.row}>
                              <Text
                               testID={item.service_name+"text"}
                               accessibilityLabel={item.service_name+"text"}
                                style={{
                                  width: "80%",
                                  textDecorationLine: "line-through",
                                  textDecorationColor: "red"
                                }}>
                                {item.service_name}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.row}>
                              <Text style={{ width: "80%" }}
                              testID={item.service_name+"text"}
                              accessibilityLabel={item.service_name+"text"}>
                                {item.service_name}
                              </Text>
                            </View>
                          )}

                          {item.deleted ? null : (
                            <View style={styles.row}>
                              <TouchableOpacity
                               testID="deleteTouch"
                               accessibilityLabel="deleteTouch"
                                onPress={() =>
                                  props?.navigation?.state?.params?.edit
                                    ? DeleteLabData(item.id)
                                    : setLab(
                                        lab.filter(
                                          (i) =>
                                            i.service_master_id !==
                                            item.service_master_id
                                        )
                                      )
                                }>
                                <Icon
                                 testID="deleteIcon"
                                 accessibilityLabel="deleteIcon"
                                  name="delete"
                                  type="AntDesign"
                                  style={styles.deleteIcon}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                        <Divider style={styles.divide} />
                        <View style={styles.inner}>
                          <Text style={styles.headings}
                           testID="notesText"
                           accessibilityLabel="notesText">Notes</Text>
                          {item.deleted ? (
                            <TextInput
                            testID="notesTextInput"
                            accessibilityLabel="notesTextInput"
                              editable={false}
                              selectTextOnFocus={false}
                              contextMenuHidden={true}
                              defaultValue={item.description}
                              onEndEditing={() => {
                                const data = [...labData];
                                data[index].description = note;
                                setLabData([...data]);
                              }}
                              onChangeText={(val) => setNote(val)}
                              multiline={true}
                              // numberOfLines={1}
                              style={[
                                styles.textinline,
                                {
                                  textDecorationLine: "line-through",
                                  textDecorationColor: "red"
                                }
                              ]}
                            />
                          ) : (
                            <TextInput
                            testID="notesTextInput"
                            accessibilityLabel="notesTextInput"
                              editable={false}
                              selectTextOnFocus={false}
                              contextMenuHidden={true}
                              defaultValue={item.description}
                              onEndEditing={() => {
                                const data = [...labData];
                                data[index].description = note;
                                setLabData([...data]);
                              }}
                              onChangeText={(val) => setNote(val)}
                              multiline={true}
                              // numberOfLines={1}
                              style={styles.textinline}
                            />
                          )}
                        </View>
                        <Divider style={styles.divide} />
                      </View>
                      {(labData.length==index+1)&&(
                          <View style={{height:Platform.OS=='ios'?400:0}}></View>
                        )}
                    </View>
                  );
                }}
              />
            ) : null}
          </View>
          <View style={styles.view}></View>
        </KeyboardAvoidingView>
        </ScrollView>
        </View>
      </View>
      <View style={styles.addbottom}>
        <TouchableOpacity
        testID="updateOrSaveLaboratoryTouch"
        accessibilityLabel="updateOrSaveLaboratoryTouch"
          style={styles.generate}
          onPress={() =>
            props?.navigation?.state?.params?.edit ? OnUpdateLab() : SaveLab()
          }
          //</View> onPress={() => SaveLab(lab)}
        >
          <Text style={styles.generatetext}
          testID="updateOrSaveLaboratory"
          accessibilityLabel="updateOrSaveLaboratory">
            {props?.navigation?.state?.params?.edit
              ? `${t("COMMON.UPDATE") + " " + t("PLAN.LABORATORY")}`
              : `${t("COMMON.SAVE")} ${t("PLAN.LABORATORY")}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList
  };
};
export default connect(mapStateToProps, null)(withTranslation()(AddLab));
