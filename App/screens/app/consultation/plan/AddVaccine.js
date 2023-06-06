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
  getVaccine,
  createVaccine,
  getVaccineData,
  deleteVaccine
} from "../../../../redux/actions/addVaccine_action";
import { connect } from "react-redux";
import styles from "./AddVaccineStyles";
import { withTranslation } from "react-i18next";
import { NativeToast } from "../../common/Toaster";
import { hp } from "../../../../themes/Scale";

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const AddVaccine = (props) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [vaccineData, setVaccineData] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const { patientList } = props;
  const { t } = props;

  const GetVaccineData = async () => {
    const variable = {
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id,
      pending: false
    };
    const data = await getVaccineData(variable);
    // console.log(vaccineData, 'vaccinedata');
    setVaccineData(data?.services || []);
  };

  const getData = async (val) => {
    setValue(val);
    if (val.length > 2) {
      const branch_id = await AsyncStorage.getItem("branch_id");
      const variables = {
        val,
        branch_id: patientList.appointment.branch_id,
        hlp_id: patientList.appointment.healpha_id
      };

      let data = await getVaccine(variables);
      setData(!val ? [] : data.values);
    }
  };
  //console.log(vaccines, 'vaccines');

  const deviceEmit = () => {
    DeviceEventEmitter.emit("getPatientCard", {
      appointmentId: patientList?.appointment?.id
    }),
      DeviceEventEmitter.emit("updateHomeScreen", { date: "" });
    [2000];
  };
  const SaveVaccine = async () => {
    if (vaccines.length < 1)
      return NativeToast({
        text: "Please Select Search Vaccines",
        type: "warning"
      });
    const variables = vaccines;

    await createVaccine(variables, {
      template_id: props.navigation.state.params.templateId
    })
      .then((res) => {
        deviceEmit();
        DeviceEventEmitter.emit("getVaccineData", {
          enc_id: patientList.encounter_id,
          doc_id: patientList.appointment.doc_id,
          hlp_id: patientList.appointment.healpha_id,
          pending: false
        });
        NativeToast({ text: "Vaccines Added", type: "success" });
        props.navigation.navigate("Consultation");
      })
      .catch((res) => {
        NativeToast({ text: res.message, type: "danger" });
      });
  };
  const DeleteVaccineData = async (id) => {
    const variable = {
      id,
      enc_id: patientList.encounter_id,
      doc_id: patientList.appointment.doc_id,
      hlp_id: patientList.appointment.healpha_id
    };
    await deleteVaccine(variable)
      .then((res) => {
        GetVaccineData();
        DeviceEventEmitter.emit("getVaccineData", {
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
    //   const getData = await getVaccineData(variable);
    //   setVaccineData(getData?.services || []);
    // }
  };

  // console.log(t('PLAN.TIME'),"timw");
  useEffect(() => {
    GetVaccineData();
  }, []);
  return (
    <View style={styles.head}>
      <MyStatusBar
        backgroundColor={APP_PRIMARY_COLOR}
        barStyle="light-content"
      />
      <View style={styles.search}>
        <SearchPlan
          name={t("COMMON.ADD") + " " + t("PLAN.VACCINE")}
          save="Vaccine"
          placeholder={t("PLAN.SEARCH") + " " + t("PLAN.VACCINE")}
          navigation={props.navigation}
          getData={(val) => {
            getData(val);
          }}
          data={data}
          value={value}
        />
        <View style={styles.data}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 2 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always">
            {!!value &&
              data
                ?.filter(
                  (x) =>
                    !vaccines
                      .map((vac) => vac.vaccine_id)
                      .includes(x.vaccine_id)
                )
                .map((i, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const addVacc = {
                          ...i,
                          encounter_id: patientList.encounter_id,
                          doc_id: patientList.appointment.doc_id,
                          hlp_id: patientList.appointment.healpha_id
                        };
                        setVaccines((prevVal) => [...prevVal, addVacc]);
                        setValue("");
                        //SaveVaccine(i);
                      }}>
                      <Text style={styles.vaccineName}
                      testID={i.vaccine_brand_name+"text"}
                      accessibilityLabel={i.vaccine_brand_name+"text"}>
                        {i.vaccine_brand_name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
          </ScrollView>
        </View>
        <View style={styles.gap}></View>

        <View style={styles.back}>
          <FlatList
            data={vaccines}
            keyExtractor={(item) => item.vaccine_id + ""}
            renderItem={({ item }) => {
              return (
                <View style={styles.brandName}>
                  <View style={styles.row}>
                    <Text style={styles.medicine}
                     testID={item.vaccine_brand_name+"text"}
                     accessibilityLabel={item.vaccine_brand_name+"text"}>
                      {item.vaccine_brand_name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                     testID="deleteIconTouch"
                     accessibilityLabel="deleteIconTouch"
                      onPress={() => {
                        setVaccines(
                          vaccines.filter((i) => i.vaccine_id !== i.vaccine_id)
                        );
                      }}>
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
          {vaccineData.length ? (
            <View style={styles.backside}>
              <View style={styles.lab}>
                {vaccineData.map((i, index) => (
                  <View style={styles.flow} key={index}>
                    <View style={styles.medicineview}>
                      <View style={styles.textside}>
                        {i.deleted ? (
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.medicinetext,
                              {
                                textDecorationLine: "line-through",
                                textDecorationColor: "red"
                              }
                            ]}
                            testID={i.vaccine_brand_name+"text"}
                      accessibilityLabel={i.vaccine_brand_name+"text"}>
                            {i.vaccine_details.vaccine_brand_name}
                          </Text>
                        ) : (
                          <Text numberOfLines={1} style={styles.medicinetext}
                          testID={i.vaccine_brand_name+"text"}
                      accessibilityLabel={i.vaccine_brand_name+"text"}>
                            {i.vaccine_details.vaccine_brand_name}
                          </Text>
                        )}
                        {/* <Text style={styles.labtext}>
                          Batch no:1111 ,Date:23 aug 21
                        </Text> */}
                      </View>

                      {i.deleted ? null : (
                        <TouchableOpacity
                          onPress={() => DeleteVaccineData(i.id)}
                          testID="deleteIconTouch"
                      accessibilityLabel="deleteIconTouch">
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

                    {vaccineData.length - 1 !== index ? (
                      <Divider style={(styles.divide, { marginVertical: 5 })} />
                    ) : null}
                  </View>
                ))}
              </View>
              <View style={styles.view}></View>
            </View>
          ) : null}
        </View>
        <FooterButton
          label={t("COMMON.SAVE") + " " + t("PLAN.VACCINE")}
          onPress={() => SaveVaccine(vaccines)}
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
export default connect(mapStateToProps, null)(withTranslation()(AddVaccine));
