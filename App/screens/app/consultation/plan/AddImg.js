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
import { Icon, Input } from "native-base";
import FooterButton from "../../common/FooterButton";
import { Divider } from "react-native-elements";
import SearchPlan from "./SearchPlans";
import { APP_PRIMARY_COLOR } from "../../../../themes/variable";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import {
  getImg,
  createImg,
  getImgData,
  UpdateImg,
  deleteImg
} from "../../../../redux/actions/addImg_action";
import styles from "./AddImgStyles";
import { withTranslation } from "react-i18next";
import { NativeToast } from "../../common/Toaster";
import isArray from "../../../../utils/IsArray";
import { hp } from "../../../../themes/Scale";
import { CONSULTATION } from "../../common/Constants";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
const AddImg = (props) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [imagingData, setImagingData] = useState([]);
  const [img, setImg] = useState([]);
  const [note, setNote] = useState("");
  const { t } = props;
  const { patientList } = props;
  //console.log(imagingData, "hello img data");
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
      let data = await getImg(variables);
      setData(!val ? [] : data.values);
      // setData(!val ? [] : isArray(data?.values) ? data?.values : []);
    }
  };
  const deviceEmit = () => {
    DeviceEventEmitter.emit("getPatientCard", {
      appointmentId: patientList?.appointment?.id
    }),
      DeviceEventEmitter.emit("updateHomeScreen", { date: "" });
    [2000];
  };
  const SaveImg = async (val) => {
    if (img.length < 1)
      return NativeToast({
        text: "Please Select Search Imaging",
        type: "warning"
      });
    const variables = img;
    await createImg(variables, {
      template_id: props.navigation.state.params.templateId
    })
      .then((res) => {
        if (res) {
          DeviceEventEmitter.emit("getImagingData", {
            enc_id: patientList.encounter_id,
            doc_id: patientList.appointment.doc_id,
            hlp_id: patientList.appointment.healpha_id
          });
          NativeToast({ text: res.message, type: "success" });
          props.navigation.navigate("Consultation");
        }
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };

  const OnUpdateImg = async () => {
    imagingData.map((i) => {
      const variables = {
        id: i.id,
        enc_id: patientList.encounter_id,
        doc_id: patientList.appointment.doc_id,
        hlp_id: patientList.appointment.healpha_id,
        description: i.description
      };
      UpdateImg(variables)
        .then(() => {
          deviceEmit();
          DeviceEventEmitter.emit("getLaboratoryData", {
            enc_id: patientList.encounter_id,
            doc_id: patientList.appointment.doc_id,
            hlp_id: patientList.appointment.healpha_id
          });
          NativeToast({ text: "Update Imaging", type: "success" });
          props.navigation.navigate("Consultation");
        })
        .catch((res) => {
          NativeToast({ text: res.message, type: "danger" });
        });
    });
  };
  const getimgdata = async (val) => {
    getImgData(val).then((res) => {
      setImagingData(res.services);
    });
  };
  const GetImagingData = async (val) => {
    const imagingData = await getImgData(val);
    setImagingData(imagingData.services);
  };
  const DeleteImagingData = async (id) => {
    const variable = {
      id,
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };

    await deleteImg(variable)
      .then((res) => {
        GetImagingData({
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id
        });
        DeviceEventEmitter.emit("getImagingData", {
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

    getimgdata(variables);
  }, []);
  return (
    <View style={styles.head}>
      <MyStatusBar
        backgroundColor={APP_PRIMARY_COLOR}
        barStyle="light-content"
      />
      <View style={styles.search}>
        <SearchPlan
          name={t("COMMON.ADD") + " " + t("PLAN.IMAGING")}
          save="Imaging"
          placeholder={t("PLAN.SEARCH") + " " + t("PLAN.IMAGING")}
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
                ?.filter(
                  (x) =>
                    !img
                      .map((vac) => vac.service_master_id)
                      .includes(x.service_master_id)
                )
                .map((i, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={async () => {
                        const practice_id = await AsyncStorage.getItem(
                          "practice_id"
                        );

                        setData([]);
                        const addLab = {
                          ...i,
                          description: "",
                          service_group_id: +i?.service_group_id,
                          encounter_id: patientList.encounter_id,
                          doc_id: patientList.appointment.doc_id,
                          hlp_id: patientList.appointment.healpha_id,
                          practice_id
                        };
                        setImg((prevVal) => [...prevVal, addLab]);
                        setValue("");
                      }}>
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
                    </TouchableOpacity>
                  );
                })}
          </ScrollView>
        </View>
        <View style={styles.gap}></View>
        <ScrollView
          style={[styles.back, { marginBottom: hp(100) }]}
          showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={"padding" }
          onPress={Keyboard.dismiss}>
          <FlatList
            data={img}
            keyExtractor={(item) => item.service_master_id + ""}
            renderItem={({ item, index }) => {
              return (
                <View style={{ top: 0 }}>
                  <View style={styles.brandName}>
                    <View style={styles.row}>
                      <Text style={styles.medicine}
                       testID={item.service_name+"text"}
                       accessibilityLabel={item.service_name+"text"}>{item.service_name}</Text>
                    </View>

                    <View style={styles.row}>
                      <TouchableOpacity
                       testID="deleteIconTouch"
                       accessibilityLabel="deleteIconTouch"
                        onPress={() =>
                          setImg(
                            img.filter(
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
                    <TextInput
                     testID="notesTextInput"
                     accessibilityLabel="notesTextInput"
                      value={item.note}
                      onChangeText={(val) => {
                        const data = [...img];
                        data[index].description = val;
                        setImg(data);
                      }}
                      multiline={true}
                      // numberOfLines={1}
                      style={styles.textinline}
                    />
                  </View>
                  <Divider style={styles.divide} />
                  {(img.length==index+1)&&(
                    <View style={{height:Platform.OS=='ios'?400:0}}></View>
                  )}
                </View>
              );
            }}
          />

          {/* <View style={styles.lab}>
            {imagingData.map((i, index) => (
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
                    <TouchableOpacity onPress={() => DeleteImagingData(i.id)}>
                      <Icon
                        name="delete"
                        type="AntDesign"
                        style={styles.deleteIcon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {imagingData.length - 1 !== index ? (
                  <Divider style={(styles.divide, { marginVertical: 5 })} />
                ) : null}
              </View>
            ))}
          </View>
          <View style={styles.view}></View>
        </View> */}
          <View style={styles.back}>
            {imagingData ? (
              <FlatList
                data={imagingData}
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
                                style={{
                                  width: "80%",
                                  textDecorationLine: "line-through",
                                  textDecorationColor: "red"
                                }}
                                testID={item.service_name+"text"}
                              accessibilityLabel={item.service_name+"text"}>
                                {item.service_name}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.row}>
                              <Text numberOfLines={1} style={{ width: "80%" }}
                              testID={item.service_name+"text"}
                              accessibilityLabel={item.service_name+"text"}>
                                {item.service_name}
                              </Text>
                            </View>
                          )}
                          {item.deleted ? null : (
                            <View style={styles.row}>
                              <TouchableOpacity
                               testID="deleteIconTouch"
                               accessibilityLabel="deleteIconTouch"
                                onPress={() =>
                                  props?.navigation?.state?.params?.edit
                                    ? DeleteImagingData(item.id)
                                    : setImg(
                                        img.filter(
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
                                const data = [...imagingData];
                                data[index].description = note;
                                setImagingData([...data]);
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
                                const data = [...imagingData];
                                data[index].description = note;
                                setImagingData([...data]);
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
                      {(imagingData.length==index+1)&&(
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
      <View style={styles.addbottom}>
        <TouchableOpacity
         testID="updateOrSveImagingTouch"
         accessibilityLabel="updateOrSveImagingText"
          style={styles.generate}
          onPress={() =>
            props?.navigation?.state?.params?.edit ? OnUpdateImg() : SaveImg()
          }>
          <Text style={styles.generatetext}
          testID="updateOrSveImagingText"
          accessibilityLabel="updateOrSveImagingText">
            {props?.navigation?.state?.params?.edit
              ? `${t("COMMON.UPDATE") + " " + t("PLAN.IMAGING")}`
              : `${t("COMMON.SAVE")} ${t("PLAN.IMAGING")}`}
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
export default connect(mapStateToProps, null)(withTranslation()(AddImg));
