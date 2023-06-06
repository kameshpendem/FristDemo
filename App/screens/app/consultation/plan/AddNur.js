import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
  DeviceEventEmitter
} from "react-native";
import { Icon } from "native-base";
import FooterButton from "../../common/FooterButton";
import { Divider } from "react-native-elements";
import SearchPlan from "./SearchPlans";
import { APP_PRIMARY_COLOR } from "../../../../themes/variable";
import AsyncStorage from "@react-native-community/async-storage";
import {
  getNur,
  createNur,
  getNursingData,
  deleteNur
} from "../../../../redux/actions/addNur_action";
import { connect } from "react-redux";
import styles from "./AddVaccineStyles";
import { withTranslation } from "react-i18next";
import { NativeToast } from "../../common/Toaster";
import isArray from "../../../../utils/IsArray";
import { hp } from "../../../../themes/Scale";
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
const AddNursing = (props) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [nursing, setNursing] = useState([]);
  const [nursingData, setNursingData] = useState([]);
  const { patientList } = props;
  const { t } = props;
  const getData = async (val) => {
    setValue(val);
    if (val.length > 2) {
      const branch_id = await AsyncStorage.getItem("branch_id");
      const variables = {
        val,
        branch_id: patientList.appointment.branch_id,
        hlp_id: patientList.appointment.healpha_id
      };
      let data = await getNur(variables);
      setData(!val ? [] : isArray(data?.values) ? data?.values : []);
    }
  };
  const GetNursingData = async () => {
    const variable = {
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };
    const data = await getNursingData(variable);
    setNursingData(data?.services || []);
  };

  const deviceEmit = () => {
    DeviceEventEmitter.emit("getPatientCard", {
      appointmentId: patientList?.appointment?.id
    }),
      DeviceEventEmitter.emit("updateHomeScreen", { date: "" });
    [2000];
  };

  const SaveNur = async (val) => {
    if (nursing.length < 1)
      return NativeToast({
        text: "Please Select Search Nursing",
        type: "warning"
      });

    const variables = nursing;
    await createNur(variables, {
      template_id: props.navigation.state.params.templateId
    })
      .then((res) => {
        deviceEmit();
        DeviceEventEmitter.emit("getNursingData", {
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
  const DeleteNursing = async (id) => {
    const variable = {
      id,
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };
    await deleteNur(variable)
      .then((res) => {
        GetNursingData();
        DeviceEventEmitter.emit("getNursingData", {
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id
        });
        NativeToast({ text: res.message, type: "success" });
        //props.navigation.navigate("Consultation");
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
    // if (data) {
    //   const getData = await getNursingData(variables);
    //   setNursingData(getData?.services || []);
    // }
  };
  useEffect(() => {
    const variables = {
      encounter_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };
    getNursingData(variables).then((res) => {
      setNursingData(res.services);
    });
  }, []);
  useEffect(() => {
    GetNursingData();
  }, []);
  return (
    <View style={styles.head}>
      <MyStatusBar
        backgroundColor={APP_PRIMARY_COLOR}
        barStyle="light-content"
      />
      <View style={styles.search}>
        <SearchPlan
          name={t("COMMON.ADD") + " " + t("PLAN.NURSING")}
          save="Nursing"
          placeholder={t("PLAN.SEARCH") + " " + t("PLAN.NURSING")}
          navigation={props.navigation}
          getData={getData}
          data={data}
          value={value}
        />
        <View style={[styles.data, hp(650)]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always">
            {!!value &&
              data
                ?.filter(
                  (x) =>
                    !nursing
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

                        const addNur = {
                          ...i,
                          service_group_id: +i.service_group_id,
                          encounter_id: patientList.encounter_id,
                          doc_id: patientList.appointment.doc_id,
                          hlp_id: patientList.appointment.healpha_id,
                          practice_id
                        };
                        setNursing((prevVal) => [...prevVal, addNur]);
                        setValue("");
                      }}>
                      <Text style={styles.vaccineName}
                       testID={i.service_name+"text"}
                       accessibilityLabel={i.service_name+"text"}>{i.service_name}</Text>
                    </TouchableOpacity>
                  );
                })}
          </ScrollView>
        </View>
        <View style={styles.gap}></View>

        <View style={styles.back}>
          <FlatList
            data={nursing}
            keyExtractor={(item) => item.service_master_id + ""}
            renderItem={({ item }) => {
              return (
                <View style={styles.brandName}>
                  <View style={styles.row}>
                    <Text style={styles.medicine}
                     testID={item.service_name+"text"}
                     accessibilityLabel={item.service_name+"text"}>{item.service_name}</Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                    testID="deleteTouch"
                    accessibilityLabel="deleteTouch"
                      onPress={() =>
                        setNursing(
                          nursing.filter(
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
              );
            }}
          />
        </View>
        {nursingData?.length ? (
          <View style={styles.lab}>
            {nursingData.map((i, index) => (
              <View style={{ justifyContent: "space-between" }}>
                <View style={styles.medicineview}>
                  <View>
                    {i.deleted ? (
                      <Text
                        style={[
                          styles.medicinetext,
                          {
                            textDecorationLine: "line-through",
                            textDecorationColor: "red"
                          }
                        ]}
                        testID={i.service_name+"text"}
                      accessibilityLabel={i.service_name+"text"}>
                        {i.service_name}
                      </Text>
                    ) : (
                      <Text style={styles.medicinetext}
                      testID={i.service_name+"text"}
                      accessibilityLabel={i.service_name+"text"}>{i.service_name}</Text>
                    )}
                  </View>
                  <View>
                    {i.deleted ? null : (
                      <TouchableOpacity onPress={() => DeleteNursing(i.id)}>
                        <Icon
                        testID="deleteIcon"
                        accessibilityLabel="deleteIcon"
                          name="delete"
                          type="AntDesign"
                          style={[styles.deleteIcon, { marginRight: 5 }]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {nursingData.length - 1 !== index ? (
                  <Divider style={(styles.divide, { marginVertical: 5 })} />
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
        <FooterButton
          label={t("COMMON.SAVE") + " " + t("PLAN.NURSING")}
          onPress={() => SaveNur(nursing)}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList
  };
};
export default connect(mapStateToProps, null)(withTranslation()(AddNursing));
