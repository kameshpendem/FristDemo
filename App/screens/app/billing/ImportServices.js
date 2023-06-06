import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
  Platform
} from "react-native";
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_INVERSE_LIGHT,
  DEFAULT_GREY_COLOR
} from "../../../themes/variable";
import { getServicesByEncounter } from "../../../redux/actions/billing_action";
import { hp, wp } from "../../../themes/Scale";
import SimpleHeader from "../common/SimpleHeader";
import { connect } from "react-redux";
import CheckBox from "@react-native-community/checkbox";
import { withTranslation } from "react-i18next";
import FooterButton from "../common/FooterButton";
import { Divider } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { NativeToastTop } from "../common/Toaster";
import Loader from "../common/Loader";

const ImportServices = ({ navigation, patientList, t }) => {
  const [checked, setChecked] = useState([]);
  const [data, setData] = useState([]);
  const [importData, setImportData] = useState({});
  const [loading, setloading] = useState(true);
  const [billingData, setbillingData] = useState([]);

  const getImportServices = async ({ healpha_id, branch_id, encounter_id }) => {
    let prev = await AsyncStorage.getItem("AddService");
    setbillingData(JSON.parse(prev));

    await getServicesByEncounter({
      healpha_id,
      branch_id,
      encounter_id
    })
      .then((res) => {
        setImportData(res?.result || {});
        setloading(false);
      })
      .catch((res) => {
        NativeToastTop({ text: res.message, type: "warning" });
        setTimeout(() => {
          navigation.goBack();
        }, 300);
      });
  };

  const addService = async () => {
    setloading(true);

    let prev = await AsyncStorage.getItem("AddService");

    let newPrev = JSON.parse(prev);

    data?.map((service) => {
      let discountCal =
        global.corporate == true
          ? global.discount_type === "percentage"
            ? (+service?.amount * +global?.discount_amount) / 100
            : +service.amount - +global.discount_amount
          : 0;

      let values = {
        isRegistered: false,
        checked: false,
        service_status: "updated",
        pay_status: "Due", //service?.payment_status,
        editable: service?.editable,
        service_group_name: service?.service_group_name,
        service_master_name: service?.service_master_name,
        service_group_id: service?.service_group_id,
        service_master_id: service?.service_master_id,
        service_group_type: "",
        qty: service?.qty,
        rate: service?.rate,
        amount:
          global.corporate == true
            ? +service?.amount - global.discount_type === "percentage"
              ? (+service?.amount * +global?.discount_amount) / 100
              : +service.amount - +global.discount_amount
            : service?.amount
            ? service?.amount
            : 0,
        value_discount: discountCal,
        percentage_discount:
          global.corporate == true
            ? global.discount_type === "percentage"
              ? +global.discount_amount
              : 0
            : +service?.percentage_discount,
        service_list_id: service?.service_list_id,
        service_consult: "consult",
        discount_given:
          global.corporate == true
            ? global.discount_type === "percentage"
              ? (+service?.amount * +global?.discount_amount) / 100
              : +service.amount - +global.discount_amount
            : service?.discount_given
      };

      if (newPrev?.length > 0) {
        newPrev.push(values);
      } else {
        newPrev = [values];
      }
    });

    await AsyncStorage.setItem("AddService", JSON.stringify(newPrev));
    DeviceEventEmitter.emit("getService");
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  useEffect(() => {
    const variables = {
      healpha_id: patientList?.appointment?.healpha_id,
      branch_id: patientList?.appointment?.branch_id,
      encounter_id: patientList?.encounter_id
    };

    getImportServices(variables);
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: DEFAULT_WHITE_COLOR }}>
      <SimpleHeader title={t("BILLING.IMPORT.TITLE")} navigation={navigation} />
      <ScrollView style={{ marginBottom: hp(85) }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              margin: wp(10)
            }}>
            <View style={{ width: "60%", flexDirection: "row" }}>
              <View>
                <CheckBox
                  boxType="square"
                  style={[
                    Platform.OS === "ios"
                      ? {
                          width: 16,
                          height: 16
                        }
                      : null
                  ]}
                  disabled={false}
                  value={
                    checked.length === importData?.services_in_plan?.length
                      ? true
                      : false
                  }
                  // value={true}
                  onChange={() => {
                    if (
                      checked.length === importData?.services_in_plan?.length
                    ) {
                      console.log("if");
                      setChecked(() => []);
                      setData(() => []);
                    } else {
                      console.log("else");
                      setChecked(() => importData?.services_in_plan || []);
                      setData(() => importData?.services_in_plan || []);
                    }
                  }}
                />
              </View>
              <Text
                style={{
                  marginLeft: wp(10),
                  justifyContent: "center",
                  textAlignVertical: "center"
                }}>
                {t("BILLING.BILLING.SERVICE")}
              </Text>
            </View>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                textAlignVertical: "center"
              }}>
              <Text>{t("BILLING.BILLING.QTY")}</Text>
            </View>
            <View
              style={{
                width: "15%",
                justifyContent: "center",
                textAlignVertical: "center"
              }}>
              <Text>{t("BILLING.BILLING.RATE")}</Text>
            </View>
            <View
              style={{
                width: "15%",
                justifyContent: "center",
                textAlignVertical: "center"
              }}>
              <Text>{t("BILLING.PAYMENT.AMOUNT")}</Text>
            </View>
          </View>
        </View>
        <Divider style={styles.lineStyle} />
        <View>
          {importData?.services_in_plan?.map((i, index) => {
            let filter = billingData.filter(
              // i.service_list_id
              (ii) => ii.service_list_id === i.service_list_id
            );
            if (filter.length === 0) {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    margin: wp(10)
                  }}>
                  <View style={{ width: "60%", flexDirection: "column" }}>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ marginTop: -5 }}>
                        <CheckBox
                          boxType="square"
                          lineWidth={1}
                          // style={{ width: 16, height: 16, margin: 5 }}
                          style={[
                            Platform.OS === "ios"
                              ? {
                                  width: 16,
                                  height: 16
                                }
                              : null
                          ]}
                          disabled={false}
                          value={
                            checked.length ===
                            importData?.services_in_plan?.length
                              ? true
                              : checked.includes(i.service_list_id)
                          }
                          onChange={(newValue) => {
                            if (checked.includes(i.service_list_id)) {
                              setChecked((prev) =>
                                prev.filter((x) => x !== i.service_list_id)
                              );

                              setData(
                                data.filter(
                                  (x) => x.service_list_id !== i.service_list_id
                                )
                              );

                              // let dataChecked = checked;

                              // dataChecked.splice(
                              //   dataChecked.findIndex(function (ii) {
                              //     return ii === i.service_list_id;
                              //   }),
                              //   1
                              // );

                              // setChecked(dataChecked);

                              // let dataData = data;
                              // dataData.splice(
                              //   dataData.findIndex(function (ii) {
                              //     return ii === i;
                              //   }),
                              //   1
                              // );

                              // console.log(dataChecked, dataData, "cccccc");
                              // setData(dataData);
                            } else {
                              setChecked([...checked, i.service_list_id]);
                              setData([...data, i]);
                            }
                          }}
                        />
                      </View>
                      <Text style={{ fontSize: 14, marginLeft: wp(10) }}>
                        {i?.master_name}
                      </Text>
                    </View>
                    <View style={{ paddingLeft: wp(15) }}>
                      <Text
                        style={{
                          color: DEFAULT_GREY_COLOR,
                          marginLeft: wp(30)
                        }}>
                        {i.service_group_name}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>{i?.qty}</Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text>{i?.rate}</Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text>{i?.amount}</Text>
                  </View>
                  <Divider
                    style={(styles.lineStyle, { marginVertical: wp(10) })}
                  />
                </View>
              );
            }
          })}
          <Divider style={styles.lineStyle} />
        </View>
      </ScrollView>
      <FooterButton
        label={t("BILLING.IMPORT.IMPORT_SELECTED")}
        onPress={() => {
          addService();
        }}
      />
    </View>
  );
};
// export default ImportServices;
const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList,
    doctorDetails: state.postList.postList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPatient: (data) => dispatch(getPatient(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ImportServices));

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_INVERSE_LIGHT
  }
});
