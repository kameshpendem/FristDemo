import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  DeviceEventEmitter
} from "react-native";
import { wp } from "../../../themes/Scale";
import { Item, Input } from "native-base";
import Feather from "react-native-vector-icons/Feather";
import FooterButton from "../common/FooterButton";
import { getPatient } from "../../../redux/actions/appointment_action";
import {
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_SHADOW_COLOR
} from "../../../themes/variable";
import SelectDropdown from "react-native-select-dropdown";
import {
  getAuthorizations,
  getServicesByEncounter,
  getConsultationData
} from "../../../redux/actions/billing_action";
import { NativeToast, NativeToastTop } from "../common/Toaster";
import SimpleHeader from "../../../screens/app/common/SimpleHeader";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { getPaymentCriteria } from "../../../redux/actions/billing_action";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../common/Loader";
import moment from "moment";
import { isEmpty } from "../../../utils/isEmpty";

const PayBill = ({
  navigation,
  patientList,
  getPatient,
  doctorDetails,
  t,
  ...props
}) => {
  const [tariff, setTariff] = useState("");
  // const [tariffTypes, setTariffTypes] = useState([]);
  const [category, setCategory] = useState("");
  const [referenceType, setReferenceType] = useState("");
  const [referencePerson, setReferencePerson] = useState("");
  const [company, setcompany] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentdetails, setPaymentdetails] = useState({});
  const [loading, setloading] = useState(true);
  const [hlpid, sethlpid] = useState("");
  const [enc_id, setenc_id] = useState("New encounter");
  const [app_type, setapp_type] = useState("");
  const [defaultService, setdefaultService] = useState({});
  const [services_in_registration, setservices_in_registration] = useState([]);
  const [patientData, setpatientData] = useState("");

  const Status = [
    {
      id: 0,
      status: "InActive"
    },
    {
      id: 1,
      status: "Active"
    }
  ];

  const getPatientCard = async () => {
    let appointmentId = navigation.state.params.appointmentId;
    let doctorId = await AsyncStorage.getItem("doctorid");
    let branchId = await AsyncStorage.getItem("branch_id");
    let variables = {
      doctor_id: doctorId,
      branch_id: branchId,
      id: appointmentId
    };

    await getPatient(variables)
      .then(async (res) => {
        if (res) {
          let data = res.person_appointment_details;
          sethlpid(data?.appointment?.healpha_id);
          setpatientData(data);
          if (data?.corporate_flag === true) {
            global.corporate = true;
          } else {
            global.corporate = false;
          }

          if (data?.encounter_id) {
            let encSplit = data?.encounter_id?.split("-");
            setenc_id(encSplit?.pop());

            const variables = {
              healpha_id: data?.appointment?.healpha_id,
              branch_id: data?.appointment?.branch_id,
              encounter_id: data?.encounter_id
            };
            getImportServices(variables);
          }
          setapp_type(data?.appointment?.appointment_type);
          getPaymentData(
            {
              healpha_id: data?.appointment?.healpha_id,
              doc_id: data?.appointment?.doc_id,
              branch_id: data?.appointment?.branch_id,
              appointment_type:
                data?.appointment?.appointment_type?.toLowerCase(),
              is_consult: true
            },
            data
          );
        }
      })
      .catch((res) => {
        NativeToastTop({ text: res.message, type: "warning" });

        setTimeout(() => {
          navigation.goBack();
        }, 250);
      });
  };

  const setService = async (service) => {
    const variables = {
      checked: false,
      service_status: "inserted",
      pay_status: "Due",
      service_group_name: service?.service_group_name,
      service_master_name: service?.service_master_name,
      service_group_id: "",
      service_master_id: "",
      // service_group_type: "Consultaion",
      service_consult: "consult",
      qty: 1,
      rate: service?.service_amount ? service?.service_amount : 0,
      amount:
        global.corporate == true
          ? +service?.service_amount - global.discount_type === "percentage"
            ? (+service?.service_amount * +global?.discount_amount) / 100
            : +service.service_amount - +global.discount_amount
          : service?.service_amount
          ? service?.service_amount
          : 0,
      value_discount:
        global.corporate == true
          ? global.discount_type === "percentage"
            ? (+service?.service_amount * +global?.discount_amount) / 100
            : +global.discount_amount
          : 0,
      percentage_discount:
        global.corporate == true
          ? global.discount_type === "percentage"
            ? +global.discount_amount
            : 0
          : 0,
      discount_given:
        global.corporate == true
          ? global.discount_type === "percentage"
            ? (+service?.service_amount * +global?.discount_amount) / 100
            : +service.service_amount - +global.discount_amount
          : 0,
      editable: 0
    };
    setdefaultService(variables);
  };

  const getConsultation = async (category, data) => {
    let healpha_id = data?.appointment?.healpha_id;
    let branch_id = data?.appointment?.branch_id;
    await getConsultationData(healpha_id, branch_id, {
      appointment_type: data?.appointment?.appointment_type?.toLowerCase(),
      doctor_id: data?.appointment?.doc_id,
      encounter_id: data?.encounter_id,
      appointment_date: moment(data?.appointment?.date_start).format(
        "YYYY-MM-DD"
      ),
      patient_category: category
    })
      .then((res) => {
        if (isEmpty(res?.consultation)) return null;
        setService(res?.consultation);
      })
      .catch((err) => {
        NativeToastTop({ text: err.message, type: "warning" });
      });
  };

  //  getConsultation({
  //    appointment_type: data?.appointment?.appointment_type?.toLowerCase(),
  //    doctor_id: data?.appointment?.doc_id,
  //    encounter_id: data?.encounter_id,
  //    appointment_date: moment(data?.appointment?.date_start).format("YYYY-MM-DD"),
  //    patient_category: ""
  //  });

  const getPaymentData = async (
    { healpha_id, doc_id, branch_id, appointment_type, is_consult },
    patientdata
  ) => {
    const is_appointment = true;
    // const appointment_type = patientList?.appointment?.appointment_type;

    await getPaymentCriteria({
      healpha_id,
      doc_id,
      branch_id,
      is_appointment,
      appointment_type,
      is_consult
    })
      .then((res) => {
        let data = res?.criteria;
        if (res?.criteria) {
          if (global.corporate === true) {
            global.discount_amount =
              data.corporate_company_details[0]?.discount_amount;
            global.discount_by =
              data?.corporate_company_details[0]?.discount_by;
            global.discount_type =
              data?.corporate_company_details[0]?.discount_type;

            setCategory("Corporate");
            setTariff(data?.tarrif[1]?.value);
            setcompany(data?.corporate_company_details[0]?.label);
            getConsultation("Corporate", patientdata);
          } else {
            setCategory("General");
            setTariff("General");
            getConsultation("General", patientdata);
          }
        }

        setPaymentdetails(res || {});
        if (res) {
          setloading(false);
        }
      })
      .catch((res) => {
        navigation.goBack();
        setTimeout(() => {
          NativeToast({ text: res.message, type: "warning" });
        }, 250);
      });
  };

  const saveAppointmentInfo = async () => {
    if (category === "Corporate") {
      if (!company.trim())
        return NativeToastTop({
          text: t("BILLING.PAYBILL.ENTER_COMPANY"),
          type: "warning"
        });
    }
    if (!tariff.trim())
      return NativeToastTop({
        text: t("BILLING.PAYBILL.SELECT_TARIFF"),
        type: "warning"
      });
    if (!category.trim())
      return NativeToastTop({
        text: t("BILLING.PAYBILL.SELECT_CATEGORY"),
        type: "warning"
      });

    const paymentCriteria = {
      tariff: tariff,
      patient_category: category,
      consultation_type: app_type.toLocaleLowerCase(),
      company_name: company,
      reference_type: referenceType,
      reference_name: referencePerson,
      source_type: sourceType,
      notes
    };
    await AsyncStorage.setItem(
      "paymentCriteria",
      JSON.stringify(paymentCriteria)
    );

    let servicesSet = [];

    if (services_in_registration?.length > 0) {
      services_in_registration?.map((service) => {
        let values = {
          isRegistered: true,
          checked: false,
          due_amount: service?.due_amount,
          discount_given: service?.discount_given,
          service_status: "updated",
          pay_status: service?.payment_status,
          editable: service?.editable,
          service_group_name: service?.service_group_name,
          service_master_name: service?.service_master_name,
          service_group_id: service?.service_group_id,
          service_master_id: service?.service_master_id,
          service_group_type: "",
          qty: service?.qty,
          rate: service?.rate,
          amount: service?.amount,
          value_discount: service?.discount_given,
          percentage_discount: service?.percentage_discount,
          service_list_id: service?.service_list_id,
          service_consult: "normal"
        };

        if (servicesSet?.length > 0) {
          servicesSet.push(values);
        } else {
          servicesSet = [values];
        }
      });

      let checkFilter = services_in_registration?.filter(
        (i) =>
          i?.rate === defaultService?.rate &&
          i?.service_group_name === defaultService?.service_group_name &&
          i?.service_master_name === defaultService?.service_master_name
      );

      if (checkFilter.length > 0) {
        await AsyncStorage.setItem("AddService", JSON.stringify(servicesSet));
      } else {
        if (servicesSet?.length > 0) {
          if (!isEmpty(defaultService)) servicesSet.push(defaultService);
        } else {
          servicesSet = [defaultService];
        }

        await AsyncStorage.setItem("AddService", JSON.stringify(servicesSet));
      }
    } else {
      if (isEmpty(defaultService)) return null;
      await AsyncStorage.setItem(
        "AddService",
        JSON.stringify([defaultService])
      );
    }

    setTimeout(() => {
      navigation.navigate("Billing");
    }, 300);
  };

  const getImportServices = async ({ healpha_id, branch_id, encounter_id }) => {
    await getServicesByEncounter({
      healpha_id,
      branch_id,
      encounter_id
    })
      .then(async (res) => {
        await AsyncStorage.setItem(
          "encounterpayment",
          JSON.stringify(res.result.encounter_payment_details)
        );

        if (res?.result?.services_in_registration) {
          setservices_in_registration(res?.result?.services_in_registration);
        }
      })
      .catch((res) => {});
  };

  const clearAsync = async () => {
    await AsyncStorage.removeItem("paymentCriteria");
    await AsyncStorage.removeItem("AddService");
  };

  useEffect(() => {
    getPatientCard();

    DeviceEventEmitter.addListener("getPaymentData", (e) => {
      getPaymentData(e);
    });
    DeviceEventEmitter.addListener("getImportServices", (e) => {
      getImportServices(e);
    });

    // const backAction = () => {
    //   Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //     {
    //       text: "Cancel",
    //       onPress: () => null,
    //       style: "cancel"
    //     },
    //     { text: "YES", onPress: () => {navigation.goBack(); clearAsync();} }
    //   ]);
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );

    // return () => backHandler.remove();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingBottom: 60 }}>
        <SimpleHeader
          title={t("BILLING.PAYBILL.TITLE")}
          navigation={navigation}
        />

        <ScrollView
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={{
            marginBottom: Platform.OS == "ios" ?20:0
          }}
          >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: wp(10)
            }}>
            <View>
              <Text style={{ color: DEFAULT_GREY_COLOR }}
              testID="healphaIdText"
              accessibilityLabel="healphaIdText">
                {t("BILLING.PAYBILL.HEALPHA_ID")}
              </Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                  marginTop: 2
                }}
                testID={hlpid+"text"}
                accessibilityLabel={hlpid+"text"}>
                {hlpid}
              </Text>
            </View>
            <View style={{ marginRight: wp(50) }}>
              <Text style={{ color: DEFAULT_GREY_COLOR }}
              testID="visitIdText"
              accessibilityLabel="visitIdText">
                {t("BILLING.PAYBILL.VISIT_ID")}
              </Text>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                  marginTop: 2
                }}
                numberOfLines={1}
                testID={enc_id+"text"}
                accessibilityLabel={enc_id+"text"}>
                {enc_id}
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: wp(10) }}>
            <Text style={{ color: DEFAULT_GREY_COLOR }}
            testID="consultationText"
            accessibilityLabel="consultationText">
              {t("BILLING.PAYBILL.CONSULTATION_TYPE")}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                marginTop: 2
              }}
              testID={app_type+"text"}
              accessibilityLabel={app_type+"text"}>
              {app_type}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: DEFAULT_SHADOW_COLOR,
              marginVertical: wp(10)
            }}>
            <Text
              style={{
                margin: 10,
                fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD
              }}
              testID="enterInformationText"
              accessibilityLabel="enterInformationText">
              {t("BILLING.PAYBILL.ENTERINFO")}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Text style={styles.text}
            testID="patientCategoryText"
            accessibilityLabel="patientCategoryText">
              {t("BILLING.PAYBILL.PATIENTCATEGORY")}
            </Text>
            <SelectDropdown
            testID="selectCategoryDropDown"
            accessibilityLabel="selectCategoryDropDown"
              data={paymentdetails?.criteria?.patient_category || []}
              defaultButtonText={
                category ? category : t("BILLING.PAYBILL.SELECTCATEGORY")
              }
              defaultValue={category}
              disabled={
                paymentdetails?.criteria?.patient_category > 0 ? true : false
              }
              onSelect={(selectedItem, index) => {
                if (selectedItem.label !== "Corporate") {
                  global.corporate = false;
                } else if (selectedItem.label === "Corporate") {
                  global.corporate = true;
                }
                setCategory(selectedItem.label);
                getConsultation(selectedItem.label, patientData);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Feather
                  testID="arrowIcon1"
                  accessibilityLabel="arrowIcon1"
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>

          <View style={{ margin: 5 }}>
            <Text style={styles.text}
            testID="traffixText"
            accessibilityLabel="trafficText">{t("BILLING.PAYBILL.TARIFF")}</Text>
            <SelectDropdown
            testID="selectTrafficDropDown"
            accessibilityLabel="selectTrafficDropDown"
              data={paymentdetails?.criteria?.tarrif || []}
              defaultButtonText={
                tariff ? tariff : t("BILLING.PAYBILL.SELECTTARIFF")
              }
              defaultValue={tariff}
              onSelect={(selectedItem, index) => {
                setTariff(selectedItem.value);
              }}
              disabled={paymentdetails?.criteria?.tarrif > 0 ? true : false}
              // disabled={false}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.value;
              }}
              rowTextForSelection={(item, index) => {
                return item.value;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Feather
                  testID="arrowIcon2"
            accessibilityLabel="arrowIcon2"
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>
          {category === "Corporate" || global.corporate === true ? (
            <View style={{ margin: 5 }}>
              <Text style={styles.text}
              testID="selectCompanyText"
              accessibilityLabel="selectCompanyText">Select company</Text>
              <SelectDropdown
               testID="selectCompanyDropDown"
               accessibilityLabel="selectCompanyDropDown"
                data={paymentdetails?.criteria?.corporate_company_details || []}
                defaultButtonText={company ? company : "Select Company"}
                defaultValue={company}
                onSelect={(selectedItem, index) => {
                  global.discount_amount = selectedItem.discount_amount;
                  global.discount_by = selectedItem.discount_by;
                  global.discount_type = selectedItem.discount_type;
                  setcompany(selectedItem.label);
                }}
                disabled={
                  paymentdetails?.criteria?.corporate_company_details > 0
                    ? true
                    : false
                }
                // disabled={false}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.label;
                }}
                rowTextForSelection={(item, index) => {
                  return item.label;
                }}
                buttonStyle={styles.dropdown4BtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Feather
                    testID="arrowIcon3"
               accessibilityLabel="arrowIcon3"
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#444"}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                dropdownStyle={styles.dropdown4DropdownStyle}
                rowStyle={styles.dropdown4RowStyle}
                rowTextStyle={styles.dropdown4RowTxtStyle}
              />
            </View>
          ) : // <View
          //   style={{
          //     borderBottomWidth: 1,
          //     borderColor: DEFAULT_BLACK_COLOR
          //   }}>
          //   <TextInput
          //     style={{
          //       marginHorizontal: wp(10)
          //     }}
          //     placeholder="Company Name"
          //     defaultValue={company}
          //     onChangeText={(e) => {
          //       setcompany(e);
          //     }}
          //   />
          // </View>
          null}

          <View style={{ margin: 5 }}>
            <Text style={styles.text}
             testID="doctorText"
             accessibilityLabel="doctorText">{t("BILLING.PAYBILL.DOCTOR")}</Text>
            {/* <SelectDropdown
              data={
                doctorDetails.doc_details[0].salutation +
                ". " +
                doctorDetails.doc_details[0].first_name
              }
              //data={paymentdetails?.criteria?.reference_type || []}
              defaultButtonText={
                doctorDetails.doc_details[0].salutation +
                ". " +
                doctorDetails.doc_details[0].first_name
              }
              defaultValue={referenceType}
              // onSelect={(val) => {
              //   setReferenceType(val.id);
              // }}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem.id);
                setReferenceType(selectedItem.label);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Feather
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            /> */}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: DEFAULT_LIGHT_GREY_COLOR
              }}>
              <Text
                style={{
                  marginLeft: wp(10),
                  lineHeight: 30,
                  fontSize: 16
                }}
                testID={doctorDetails?.doc_details[0]?.first_name+"text"}
                accessibilityLabel={doctorDetails?.doc_details[0]?.first_name+"text"}>
                {doctorDetails?.doc_details[0]?.salutation +
                  ". " +
                  doctorDetails?.doc_details[0]?.first_name}
              </Text>
            </View>
          </View>

          <View style={{ margin: 5 }}>
            <Text style={styles.text}
            testID="referenceTypeText"
            accessibilityLabel="referenceTypeText">
              {t("BILLING.PAYBILL.REFERENCETYPE")}
            </Text>
            <SelectDropdown
            testID="referenceTypeDropDown"
            accessibilityLabel="referenceTypeDropDown"
              data={paymentdetails?.criteria?.reference_type}
              defaultButtonText={t("BILLING.PAYBILL.SELECTREFERENCETYPE")}
              defaultValue={referenceType}
              // onSelect={(val) => {
              //   setReferenceType(val.id);
              // }}
              disabled={
                paymentdetails?.criteria?.reference_type > 0 ? true : false
              }
              onSelect={(selectedItem, index) => {
                setReferenceType(selectedItem.value);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Feather
                  testID="arrowIcon4"
                  accessibilityLabel="arrowIcon4"
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>

          <View style={{ margin: 5 }}>
            <Text style={styles.text}
            testID="referencePersonText"
            accessibilityLabel="referencePersonText">
              {t("BILLING.PAYBILL.REFERENCEPERSON")}
            </Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: DEFAULT_LIGHT_GREY_COLOR
              }}>
              <TextInput
              testID="enterReferencePersonTextInput"
              accessibilityLabel="enterReferencePersonTextInput"
                style={{ marginLeft: wp(10) }}
                value={referencePerson}
                onChangeText={(val) => setReferencePerson(val)}
                placeholder={t("BILLING.PAYBILL.ENTERREFERENCEPERSON")}
              />
            </View>
          </View>

          <View style={{ margin: 5 }}>
            <Text style={styles.text}
            testID="sourceTYpeText"
            accessibilityLabel="sourceTypeText">{t("BILLING.PAYBILL.SOURCETYPE")}</Text>
            <SelectDropdown
            testID="selectSourceTypeDropDown"
            accessibilityLabel="selectSourceTypeDropDown"
              data={paymentdetails?.criteria?.source_type || []}
              defaultButtonText={t("BILLING.PAYBILL.SELECTSOURCETYPE")}
              defaultValue={sourceType}
              disabled={
                paymentdetails?.criteria?.source_type > 0 ? true : false
              }
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem);
                setSourceType(selectedItem.value);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Feather
                  testID="arrowIcon5"
                  accessibilityLabel="arrowIcon5"
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={"#444"}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>
          <View style={{ margin: wp(10) }}>
            <Text style={styles.treatment}
            testID="notesText"
            accessibilityLabel="notesText"> {t("BILLING.PAYBILL.NOTES")}</Text>
            <Item regular style={styles.vertical}>
              <Input
              testID={notes+"text"}
              accessibilityLabel={notes+"text"}
                value={notes}
                multiline={true}
                onChangeText={(val) => setNotes(val)}
              />
              {/* <TextInput */}
            </Item>
          </View>
        </ScrollView>
      </View>
      <FooterButton
        label={t("BILLING.PAYBILL.SAVE")}
        onPress={() => {
          saveAppointmentInfo();
        }}
      />
    </View>
  );
};
// export default PayBill;

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
)(withTranslation()(PayBill));

const styles = StyleSheet.create({
  container: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    flex: 1
  },
  dropdown4BtnStyle: {
    width: "auto",
    height: "auto",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    marginHorizontal: wp(12),
    height: 35
  },
  dropdown4BtnTxtStyle: {
    //color: "#444",
    fontSize: 16,
    textAlign: "left",
    marginLeft: -8,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
  },
  dropdown4DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown4RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5"
  },
  dropdown4RowTxtStyle: { color: "#444", textAlign: "left" },
  treatment: { fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR },
  vertical: { marginVertical: 10 },
  text: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    color: DEFAULT_GREY_COLOR,
    marginHorizontal: wp(10)
  }
});
