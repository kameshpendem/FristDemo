import React, { createRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
  DeviceEventEmitter,
  ScrollView,KeyboardAvoidingView,Keyboard
} from "react-native";
import Modal from "react-native-modal";
import {
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_INVERSE_LIGHT,
  FONT_FAMILY,
  DEFAULT_GREEN_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_DIM_GREEN_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_DANGER_COLOR
} from "../../../themes/variable";
import { Right } from "native-base";
import close from "../../../assets/images/close.png";
import {
  cancelService,
  getServiceGroups
} from "../../../redux/actions/billing_action";

import { Divider } from "react-native-elements";
import { hp, wp } from "../../../themes/Scale";

import AddServices from "../../../assets/images/billingAdd.png";
import importServices from "../../../assets/images/Import.png";
import Header from "../common/Header";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import SelectDropdown from "react-native-select-dropdown";
import { withTranslation } from "react-i18next";

import FooterButton from "../common/FooterButton";
import Delete from "../../../assets/images/delete.png";
import Edit from "../../../assets/images/edit.png";

import ActionSheet from "react-native-actions-sheet";
import AsyncStorage from "@react-native-community/async-storage";
import { getPatient } from "../../../redux/actions/appointment_action";

import { NativeToastTop } from "../common/Toaster";
import Loader from "../common/Loader";
import { getApiUrl } from "../../../config/Config";

const Billing = ({ navigation, patientList, t }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [importService, setImportService] = useState([]);
  const [total, settotal] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [amountPaid, setamountPaid] = useState(0);
  const [netPayable, setnetPayable] = useState(0);
  const [indexofservice, setindexofservice] = useState("");
  const [loading, setloading] = useState(true);
  const [editService, seteditService] = useState(false);
  const [editservicedata, seteditservicedata] = useState({});
  const [objIndex, setobjIndex] = useState("");
  const [encounterPayment, setencounterPayment] = useState({});
  const [url, seturl] = useState("");
  const [avtitle, setavtitle] = useState("");
  const [modalShow, setmodalShow] = useState(false);
  const [refund, setrefund] = useState(false);

  const getService = async () => {
    let datA = await AsyncStorage.getItem("AddService");
    let paymentdetails = await AsyncStorage.getItem("encounterpayment");

    paymentdetails = JSON.parse(paymentdetails);
    console.log(paymentdetails, "data");
    setencounterPayment(paymentdetails);

    setamountPaid(
      isNaN(paymentdetails?.tot_paid) ? 0 : paymentdetails?.tot_paid
    );

    datA = JSON.parse(datA);

    setData(datA);

    let isNotRegistered = datA?.filter((i) => i?.isRegistered === false) || [];

    if (isNotRegistered?.length > 0) {
      setrefund(false);
    } else if (Math.sign(paymentdetails?.tot_due) == -1) {
      setrefund(true);
    }

    const sumall = datA
      ?.map((service) => +service.rate * +service.qty)
      .reduce((prev, curr) => prev + curr, 0);

    settotal(isNaN(sumall) ? 0 : sumall);
    setnetPayable(isNaN(sumall) ? 0 : sumall);

    const sumalldiscount = datA
      ?.map((service) =>
        service.percentage_discount !== 0
          ? (+service?.rate * +service?.qty * service.percentage_discount) / 100
          : Number(service?.discount_given)
      )
      .reduce((prev, curr) => prev + curr, 0);

    console.log(sumalldiscount, "sumalldiscount");

    settotalDiscount(isNaN(+sumalldiscount) ? 0 : Math.round(+sumalldiscount));
    setTimeout(() => {
      setloading(false);
    }, 250);
  };

  const CancelService = async () => {
    let payment = encounterPayment;

    let variables = {
      enc_id: patientList.encounter_id,
      healpha_id: patientList.appointment.healpha_id
    };

    let payload = {
      services: [
        {
          cancel_reason: "App Cancel",
          services_list_id: editservicedata.service_list_id,
          service_master: editservicedata.service_master_name,
          service_group: editservicedata.service_group_name
        }
      ],
      total_amount: amountPaid - +editservicedata?.amount,
      total_due: +payment.tot_due - +editservicedata?.amount,
      total_discount:
        +totalDiscount - +editservicedata?.percentage_discount !== 0
          ? (+editservicedata.rate *
              +editservicedata.qty *
              editservicedata.percentage_discount) /
            100
          :parseInt(editservicedata.discount_given),
      paid_amount: +payment.tot_paid
    };

    await cancelService(variables, payload)
      .then((res) => {
        if (res) {
          DeviceEventEmitter.emit("getPaymentData", {
            healpha_id: patientList?.appointment?.healpha_id,
            doc_id: patientList?.appointment?.doc_id,
            branch_id: patientList?.appointment?.branch_id,
            appointment_type:
              patientList?.appointment?.appointment_type?.toLowerCase()
          });

          DeviceEventEmitter.emit("getImportServices", {
            healpha_id: patientList?.appointment?.healpha_id,
            branch_id: patientList?.appointment?.branch_id,
            encounter_id: patientList?.encounter_id
          });

          NativeToastTop({
            text: t("BILLING.BILLING.CANCEL_SUCCESS"),
            type: "success"
          });

          deleteService(objIndex);

          setTimeout(() => {
            navigation.navigate("ViewPdfFooter", {
              link: getApiUrl() + `${res.data.path}`,
              screenname: "Cancelled service"
            });
          }, 300);
          // addServiceRef.current?.setModalVisible(false);
          setmodalShow(false);
        }
      })
      .catch((res) => {
        // NativeToastTop({ text: "Something went wrong!", type: "warning" });
        NativeToastTop({ text: res.message, type: "warning" });
      });
  };

  useEffect(() => {
    getService();
    let data = patientList;
    if (data) {
      seturl(data?.appointment?.person_details?.person_image);
      setavtitle(data?.appointment?.person_details?.first_name?.slice(0, 1));
    }

    DeviceEventEmitter.addListener("getService", () => {
      setData([]);
      getService();
    });
  }, []);

  const addServiceRef = createRef();

  const ServiceModal = () => {
    const [tab, setTab] = useState(
      editService ? (editservicedata?.percentage_discount !== 0 ? 2 : 1) : 1
    );
    const [price, setprice] = useState(editService ? editservicedata?.rate : 0);
    const [serviceData, setServiceData] = useState({});
    const [discount, setDiscount] = useState(
      editService
        ? editservicedata?.percentage_discount
          ? editservicedata?.percentage_discount
          : editservicedata?.value_discount
        : 0
    );
    const [service_group_name, setservice_group_name] = useState(
      editService ? editservicedata?.service_group_name : ""
    );
    const [service_group_id, setservice_group_id] = useState(
      editService ? editservicedata?.service_group_id : ""
    );
    const [service_master_name, setservice_master_name] = useState(
      editService ? editservicedata?.service_master_name : ""
    );
    const [service_master_id, setservice_master_id] = useState(
      editService ? editservicedata?.service_master_id : ""
    );
    const [qty, setQty] = useState(editService ? editservicedata?.qty : 1);
    const [checked, setchecked] = useState(false);
    const [service_status, setservice_status] = useState(
      editService ? editservicedata?.service_status : "inserted"
    );
    const [pay_status, setpay_status] = useState(
      editService ? editservicedata?.pay_status : "Due"
    );
    const [service_group_type, setservice_group_type] = useState("");
    const [editable, seteditable] = useState("");

    // const [animatePress, setAnimatePress] = useState(new Animated.Value(1));

    // const animateIn = () => {
    //   Animated.timing(animatePress, {
    //     toValue: 0.5,
    //     duration: 500,
    //     useNativeDriver: true, // Add This line
    //   }).start();
    // };

    const getServiceGroupData = async ({ healpha_id, branch_id, group_id }) => {
      await getServiceGroups({
        healpha_id,
        branch_id,
        group_id
      })
        .then((res) => {
          setServiceData(res.services || {});
        })
        .catch((res) => {
          NativeToastTop({ text: t("BILLING.PAYBILL.FAIL"), type: "warning" });
        });

      return null;
    };

    const clearState = () => {
      setpay_status("Due");
      setservice_status("inserted");
      setQty("1");
      setservice_master_id("");
      setservice_master_name("");
      setservice_group_id("");
      setservice_group_name("");
      setDiscount(0);
      setServiceData({});
      setprice(0);
      setTab(1);
    };

    const updateService = async () => {
      let setdata = data;

      let discountCal =
        discount !== 0
          ? tab === 1
            ? discount
            : price * qty * (discount / 100)
          : 0;

      setdata[objIndex].editable = editable;
      setdata[objIndex].isRegistered = false;
      setdata[objIndex].checked = checked;
      setdata[objIndex].service_status = service_status;
      setdata[objIndex].pay_status = pay_status;
      setdata[objIndex].service_group_name = service_group_name;
      setdata[objIndex].service_master_name = service_master_name;
      setdata[objIndex].service_group_id = service_group_id;
      setdata[objIndex].service_master_id = service_master_id;
      setdata[objIndex].service_group_type = service_group_type;
      setdata[objIndex].service_consult = editservicedata.service_consult;
      setdata[objIndex].qty = qty;
      setdata[objIndex].rate = price;
      setdata[objIndex].amount = Number(price * qty - discountCal);
      setdata[objIndex].percentage_discount = tab === 1 ? 0 : +discount;
      setdata[objIndex].value_discount = discountCal;

      setdata[objIndex].discount_given =
        discount !== 0
          ? tab === 1
            ? discount
            : price * qty * (discount / 100)
          : 0;

      await AsyncStorage.setItem("AddService", JSON.stringify(setdata));
      // addServiceRef.current?.setModalVisible(false);
      setmodalShow(false);

      setTimeout(() => {
        getService();
      }, 250);
    };

    const addService = async () => {
      let discountCal =
        discount !== 0
          ? tab === 1
            ? discount
            : price * qty * (discount / 100)
          : 0;

      const services = {
        isRegistered: false,
        editable: editable,
        checked: checked,
        service_status: service_status,
        pay_status: pay_status,
        service_group_name: service_group_name,
        service_master_name: service_master_name,
        service_group_id: service_group_id,
        service_master_id: service_master_id,
        service_group_type: service_group_type,
        service_consult: "consult",
        qty: qty,
        rate: price,
        amount: price * qty - discountCal,
        percentage_discount: tab === 1 ? 0 : +discount,
        value_discount: discountCal,
        discount_given:
          discount !== 0
            ? tab === 1
              ? discount
              : price * qty * (discount / 100)
            : 0
      };

      // setData((prev) => [...prev, services]);
      // addServiceRef.current?.setModalVisible(false);
      setmodalShow(false);
      let prev = await AsyncStorage.getItem("AddService");
      prev = JSON.parse(prev);
      if (prev) {
        AsyncStorage.setItem("AddService", JSON.stringify([...prev, services]));
      } else {
        AsyncStorage.setItem("AddService", JSON.stringify([services]));
      }
      // addServiceRef.current?.setModalVisible(false);
      setmodalShow(false);

      getService();
    };

    const updatedSwitchData = (val) => {
      console.log(val);
      setTab(val);
    };

    useEffect(() => {
      if (global.corporate === true) {
        setDiscount(+global.discount_amount);
        setTab(global.discount_type === "percentage" ? 2 : 1);
      }
      getServiceGroupData({
        healpha_id: patientList?.appointment?.healpha_id,
        branch_id: patientList?.appointment?.branch_id
      });
    }, []);

    return (
      <View style={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ?  "height":"padding" }
            style={{ flex: 1 }}
            onPress={Keyboard.dismiss}>
        <View
          style={{
            // flex: 1,
            backgroundColor: DEFAULT_WHITE_COLOR,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
          }}>
          <View style={[styles.image, { paddingHorizontal: 10 }]}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                fontSize: 18
              }}
              testID="updateOrAddServiceText"
              accessibilityLabel="updateOrAddServiceText">
              {editService
                ? t("BILLING.BILLING.UPDATESERVICE")
                : t("BILLING.BILLING.ADDSERVICE")}
            </Text>
            <Divider style={styles.lineStyle} />
            <Right style={{ marginRight: wp(10) }}>
              <TouchableOpacity
                onPress={() => {
                  // addServiceRef.current?.setModalVisible(false);
                  setmodalShow(false);
                  seteditService(false);
                  clearState();
                }}
                testID="closeTouch"
                accessibilityLabel="closeTouch">
                <Image source={close} style={styles.close} 
                 testID="closeImage"
                 accessibilityLabel="closeImage"/>
              </TouchableOpacity>
            </Right>
          </View>
          <View style={{ flexGrow: 2, paddingBottom: hp(70) }}>
            <View
              style={{
                marginHorizontal: 15,
                marginBottom: 10,
                borderBottomColor: "#C5C5C5",
                borderBottomWidth: 1
              }}></View>

            <View style={{ margin: 5 }}>
              <Text style={styles.text}
               testID="serviceGroupText"
               accessibilityLabel="serviceGroupText">
                {t("BILLING.BILLING.SERVICE_GROUP")}
              </Text>
              <SelectDropdown
               testID="selectServiceGroupDropDown"
               accessibilityLabel="selectServiceGroupDropDown"
                data={serviceData?.groups || []}
                defaultButtonText={
                  service_group_name
                    ? service_group_name
                    : t("BILLING.BILLING.SELECT_SERVICE_GROUP")
                }
                defaultValue={
                  service_group_name
                    ? service_group_name
                    : t("BILLING.BILLING.SELECT_SERVICE_GROUP")
                }
                onSelect={(val) => {
                  setservice_group_name(val?.service_group_name);
                  setservice_group_id(val?.branch_group_id);

                  getServiceGroupData({
                    healpha_id: patientList?.appointment?.healpha_id,
                    branch_id: patientList?.appointment?.branch_id,
                    group_id: val.branch_group_id
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.service_group_name;
                }}
                rowTextForSelection={(item, index) => {
                  return item.service_group_name;
                }}
                buttonStyle={styles.dropdown4BtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Feather
                    testID="arrowIcon"
                    accessibilityLabel="arrowIcon"
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
               testID="serviceText"
               accessibilityLabel="serviceText">{t("BILLING.BILLING.SERVICE")}</Text>
              <SelectDropdown
               testID="selectServiceDropDown"
               accessibilityLabel="selectServiceDropDown"
                data={serviceData?.masters || []}
                disabled={service_group_name ? false : true}
                defaultButtonText={
                  service_master_name
                    ? service_master_name
                    : t("BILLING.BILLING.SELECT_SERVICE")
                }
                defaultValue={
                  service_master_name
                    ? service_master_name
                    : t("BILLING.BILLING.SELECT_SERVICE")
                }
                onSelect={(val) => {
                  seteditable(val?.editable);
                  setservice_master_id(val?.service_master_id);
                  setservice_master_name(val?.service_name);
                  setprice(val.price);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.service_name;
                }}
                rowTextForSelection={(item, index) => {
                  return item.service_name;
                }}
                buttonStyle={styles.dropdown4BtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Feather
                    testID="arrowIcon"
                    accessibilityLabel="arrowIcon"
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

            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={{ margin: 5, width: "25%" }}>
                <Text style={[styles.text, { paddingLeft: wp(4) }]}
                 testID="qtyText"
                 accessibilityLabel="qtyText">
                  {t("BILLING.BILLING.QTY")}
                </Text>
                <TextInput
                 testID="qtyTextInput"
                 accessibilityLabel="qtyTextInput"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                    width: "50%",
                    margin: 5,
                    marginLeft: wp(10),
                    textAlign: "center"
                  }}
                  // value={qty}
                  defaultValue={qty.toString()}
                  onChangeText={(val) => setQty(val)}
                  keyboardType={"number-pad"}
                  returnKeyType='done'
                />
              </View>

              <View style={{ margin: 5, width: "25%" }}>
                <Text style={styles.text}
                 testID="rateText"
                 accessibilityLabel="rateText">{t("BILLING.BILLING.RATE")}</Text>
                <TextInput
                testID="rateTextInput"
                accessibilityLabel="rateTextInput"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                    width: "50%",
                    margin: 5,
                    marginLeft: wp(10),
                    textAlign: "center",
                    color: "black"
                  }}
                  value={price ? price : `${0}`}
                  // defaultValue={qty.toString()}
                  // onChangeText={(val) => setQty(val)}
                  // keyboardType={"number-pad"}
                  editable={false}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                marginTop: 10,
                paddingHorizontal: 10
              }}>
              <View
                style={{
                  height: 44,
                  width: "40%",
                  backgroundColor: DEFAULT_INVERSE_LIGHT,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: DEFAULT_SHADOW_COLOR,
                  flexDirection: "row",
                  justifyContent: "center"
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => updatedSwitchData(1)}
                  style={{
                    flex: 1,
                    backgroundColor:
                      tab == 1 ? APP_PRIMARY_COLOR : DEFAULT_INVERSE_LIGHT,
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  testID="valueTouch"
                  accessibilityLabel="valueTouch">
                  <Text
                    style={{
                      paddingHorizontal: 5,
                      textAlign: "center",
                      color:
                        tab == 1 ? DEFAULT_WHITE_COLOR : DEFAULT_BLACK_COLOR
                    }}
                    testID="valueText"
                    accessibilityLabel="valueText">
                    {t("BILLING.BILLING.VALUE")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  TouchableOpacity
                  activeOpacity={1}
                  onPress={() => updatedSwitchData(2)}
                  style={{
                    flex: 1,
                    backgroundColor:
                      tab == 2 ? APP_PRIMARY_COLOR : DEFAULT_INVERSE_LIGHT,
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  testID="percentageTouch"
                  accessibilityLabel="percentageTouch">
                  <Text
                    numberOfLines={1}
                    style={{
                      paddingHorizontal: 5,
                      color:
                        tab == 2 ? DEFAULT_WHITE_COLOR : DEFAULT_BLACK_COLOR
                    }}
                    testID="percentageText"
                    accessibilityLabel="percentageText">
                    {t("BILLING.BILLING.PERCENTAGE")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    // margin: wp(5),
                    marginLeft: wp(15),
                    color: DEFAULT_GREY_COLOR,
                    alignSelf: "center"
                  }}
                  testID="discountText"
                  accessibilityLabel="discountText">
                  {t("BILLING.BILLING.DISCOUNT")}
                </Text>
                <View
                  style={{
                    borderBottomWidth: wp(1),

                    width: "40%",

                    alignSelf: "center",
                    marginBottom: 50,
                    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR
                  }}>
                  <TextInput
                   testID="discountTextInput"
                   accessibilityLabel="discountTextInput"
                    style={{ textAlign: "center", color: "black" }}
                    editable={global.AuthDiscount ? true : false}
                    keyboardType="numeric"
                    value={discount.toString()}
                    onChangeText={(val) => setDiscount(val)}
                    returnKeyType='done'
                  />
                </View>
              </View>
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    // margin: wp(5),
                    marginLeft: wp(15),
                    color: DEFAULT_GREY_COLOR
                  }}
                  testID="totalAmountTextInput"
                  accessibilityLabel="totalAmountTextInput">
                  {t("BILLING.BILLING.TOTALAMOUNT")}
                </Text>
                <View
                  style={{
                    borderBottomWidth: wp(1),
                    marginTop: wp(10),
                    width: "40%",
                    alignSelf: "center",
                    // marginBottom: 50,
                    borderBottomColor: DEFAULT_LIGHT_GREY_COLOR
                  }}>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 6
                    }}
                    testID="totalAmountText"
                    accessibilityLabel="totalAmountText">
                    {price
                      ? tab === 1
                        ? price * qty - discount
                        : price * qty - (+discount / 100) * price * qty
                      : 0}
                  </Text>
                </View>
              </View>
            </View>

            {editService &&
            editservicedata.isRegistered &&
            global.AuthCancel ? (
              <ScrollView
                keyboardShouldPersistTaps="always"
                style={styles.addbottom}>
                <TouchableOpacity
                 testID="cancelServiceTouch"
                 accessibilityLabel="cancelServiceTouch"
                  style={styles.generate}
                  onPress={() => {
                    editservicedata.isRegistered
                      ? Alert.alert(
                          t("BILLING.BILLING.CANCEL_SERVICE"),
                          t("BILLING.BILLING.CANCEL_SERVICE_MESSAGE"),
                          [
                            {
                              text: t("COMMON.CANCEL"),
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel"
                            },
                            {
                              text: t("COMMON.YES"),
                              onPress: () => CancelService()
                            }
                          ],
                          { cancelable: true }
                        )
                      : NativeToastTop({
                          text: t("BILLING.BILLING.CANT_CANCEL"),
                          type: "warning"
                        });
                  }}>
                  <Text style={styles.generatetext}
                   testID="cancelServiceText"
                   accessibilityLabel="cancelServiceText">
                    {t("BILLING.BILLING.CANCEL_SERVICE")}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}

            <FooterButton
              label={
                editService
                  ? t("BILLING.BILLING.UPDATESERVICE")
                  : t("BILLING.BILLING.ADDSERVICE")
              }
              onPress={() => {
                editservicedata.isRegistered
                  ? NativeToastTop({
                      text: t("BILLING.BILLING.CANT_UPDATE"),
                      type: "warning"
                    })
                  : editService
                  ? updateService()
                  : addService();
              }}
            />
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  };

  const deleteService = async (val) => {
    let data = await AsyncStorage.getItem("AddService");

    data = JSON.parse(data);

    data.splice(val, 1);

    await AsyncStorage.setItem("AddService", JSON.stringify(data));

    setTimeout(() => {
      getService();
    }, 200);
    NativeToastTop({
      text: t("BILLING.BILLING.SUCCESS_REMOVED"),
      type: "success"
    });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: DEFAULT_WHITE_COLOR }}>
      <Header
       testID="serviceText"
       accessibilityLabel="serviceText"
        title={t("BILLING.BILLING.TITLE")}
        navigation={navigation}
        avatartitle={avtitle}
        url={url}
        billing
        avator
      />
      <View style={{ backgroundColor: DEFAULT_SHADOW_COLOR }}>
        <Text
          style={{ margin: 10, fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR }}
          testID="addServicesText"
          accessibilityLabel="addServicesText">
          {t("BILLING.BILLING.ADD_SERVICES")}
        </Text>
      </View>
      <Divider style={styles.lineStyle} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: DEFAULT_WHITE_COLOR
        }}>
        <View style={{ padding: wp(15) }}>
          <TouchableOpacity
           testID="addServicesTTouch"
           accessibilityLabel="addServicesTTouch"
            onPress={() => {
              seteditService(false);
              seteditservicedata({});
              // addServiceRef.current?.setModalVisible(true);
              setmodalShow(true);
            }}
            style={{
              backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
              borderRadius: 5
            }}>
            <View style={styles.vertical}>
              <Image source={AddServices} style={styles.historyicon} 
               testID="addServicesImage"
               accessibilityLabel="addServicesImage"/>
              <Text
                style={[
                  styles.input,
                  styles.textfont,
                  {
                    textAlign: "center",
                    color: APP_PRIMARY_COLOR,

                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
                  }
                ]}
                testID="addServicesText"
                accessibilityLabel="addServicesText">
                {t("BILLING.BILLING.ADDSERVICES")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <ActionSheet
          style={{ maxHeight: "50%" }}
          onClose={() => {
            seteditService(false), seteditservicedata({});
          }}
          ref={addServiceRef}>
          <ServiceModal />
        </ActionSheet> */}

        <Modal
          style={{ padding: 0, margin: 0 }}
          backdropOpacity={0.1}
          onDismiss={() => {
            seteditService(false), seteditservicedata({});
          }}
          isVisible={modalShow}>
          <ServiceModal />
        </Modal>
        <View style={{ padding: wp(15) }}>
          <TouchableOpacity
           testID="importServicesTouch"
           accessibilityLabel="importServicesTouch"
            style={{
              backgroundColor: DEFAULT_DIM_GREEN_COLOR,
              borderRadius: 5
            }}
            onPress={() => {
              navigation.navigate("ImportServices");
            }}>
            <View style={styles.vertical}>
              <Image source={importServices} style={styles.historyicon} 
               testID="importServicesImage"
               accessibilityLabel="importServicesImage"/>
              <Text
                style={[
                  styles.input,
                  styles.textfont,
                  {
                    textAlign: "center",
                    color: DEFAULT_GREEN_COLOR,
                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
                  }
                ]}
                testID="importServicesText"
                accessibilityLabel="importServicesText">
                {t("BILLING.BILLING.IMPORTSERVICES")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ backgroundColor: DEFAULT_SHADOW_COLOR }}>
        <View
          style={{
            flexDirection: "row",
            margin: wp(10)
          }}>
          <View style={{ width: "50%" }}>
            <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR }}
             testID="serviceText"
             accessibilityLabel="serviceText">
              {t("BILLING.BILLING.SERVICE")}
            </Text>
          </View>
          <View style={{ width: "10%" }}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
              }}
              testID="qtyText"
              accessibilityLabel="qtyText">
              {t("BILLING.BILLING.QTY")}
            </Text>
          </View>
          <View style={{ width: "10%" }}>
            <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR }}
             testID="rateText"
             accessibilityLabel="rateText">
              {t("BILLING.BILLING.RATE")}
            </Text>
          </View>
        </View>
      </View>
      <Divider style={styles.lineStyle} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={{ marginBottom: Platform.OS == "ios" ?hp(100):hp(85) }}
        >
        {
          // !data?
          data?.map((i, index) => {
            return (
              <View
                key={index}
                style={{ width: "100%", flexDirection: "column" }}>
                <View
                  style={[
                    {
                      flexDirection: "row",
                      padding: wp(10),
                      paddingHorizontal: wp(10),
                      backgroundColor: i.isRegistered
                        ? DEFAULT_SHADOW_COLOR
                        : DEFAULT_WHITE_COLOR,
                      width: "100%"
                    }
                  ]}>
                  <View style={{ width: "50%" }}>
                    <Text
                     testID={i?.service_master_name+"text"}
                     accessibilityLabel={i?.service_master_name+"text"}>{i?.service_master_name}</Text>
                    <Text
                      style={{ color: DEFAULT_LIGHT_GREY_COLOR, marginTop: 3 }}
                      testID={i?.service_group_name+"text"}
                     accessibilityLabel={i?.service_group_name+"text"}>
                      {i?.service_group_name}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text style={{ textAlign: "center" }}
                      testID={i?.qty+"text"}
                      accessibilityLabel={i?.qty+"text"}>{i?.qty}</Text>
                  </View>
                  <View style={{ width: "15%" }}>
                    <Text
                     testID={i?.rate+"text"}
                     accessibilityLabel={i?.rate+"text"}>{i?.rate}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ width: "10%" }}
                    disabled={
                      i.service_group_name === "Consultation" ? true : false
                    }
                    onPress={() => {
                      seteditservicedata(i);
                      seteditService(true);
                      setobjIndex(index);
                      // addServiceRef.current?.setModalVisible(true);
                      setmodalShow(true);
                    }}
                    testID={i.service_group_name+"touch"}
                    accessibilityLabel={i.service_group_name+"touch"}>
                    <Image
                     testID="editImage"
                     accessibilityLabel="editImage"
                      source={Edit}
                      style={{ width: 20, height: 20, marginLeft: wp(10) }}
                    />
                  </TouchableOpacity>
                  <View style={styles.centeredView}>
                    <Modal
                      isVisible={modalVisible}
                      backdropOpacity={0}
                      style={{ padding: 0, margin: 0 }}>
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}
                           testID="cantRemoveText"
                           accessibilityLabel="cantRemoveText">
                            {t("BILLING.BILLING.CANT_REMOVE")}
                          </Text>
                          <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}
                             testID="backText"
                             accessibilityLabel="backText">
                              {t("BILLING.BILLING.BACK")}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                  </View>
                  <TouchableOpacity
                   testID="serviceGroupNameText"
                   accessibilityLabel="serviceGroupNameText"
                    style={{ width: "10%" }}
                    disabled={
                      i.service_group_name === "Consultation" || i.isRegistered
                        ? true
                        : false
                    }
                    onPress={() => {
                      i.isRegistered
                        ? setModalVisible(true)
                        : deleteService(index);
                    }}>
                    <Image
                     testID="deleteImage"
                     accessibilityLabel="deleteImage"
                      source={Delete}
                      style={{ width: 18, height: 18, marginLeft: wp(10) }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ width: "10%" }}
                    onPress={() => {
                      indexofservice === index
                        ? setindexofservice("")
                        : setindexofservice(index);
                    }}
                    testID="arrowTouch"
                    accessibilityLabel="arrowTouch">
                    <Feather
                     testID="arrowIcon"
                     accessibilityLabel="arrowIcon"
                      name={
                        indexofservice === index ? "chevron-up" : "chevron-down"
                      }
                      color={"#444"}
                      size={18}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={
                    index === indexofservice
                      ? {
                          display: "flex",
                          backgroundColor:
                            i.pay_status === "Paid"
                              ? DEFAULT_SHADOW_COLOR
                              : DEFAULT_SHADOW_COLOR,
                          flexDirection: "row",
                          height: hp(60)
                        }
                      : { display: "none" }
                  }>
                  <View
                    style={{
                      width: "50%",
                      paddingHorizontal: wp(10)
                    }}>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row"
                      }}>
                      <Text style={{ width: "60%" }}
                       testID="totalAmountText"
                       accessibilityLabel="totalAmountText">
                        {t("BILLING.BILLING.TOTALAMOUNT")}
                      </Text>
                      <Text style={{ width: "40%", paddingLeft: wp(10) }}
                       testID={i?.rate * i?.qty+"text"}
                       accessibilityLabel={i?.rate * i?.qty+"text"}>
                        {i?.rate * i?.qty}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        marginTop: 5
                      }}>
                      <Text style={{ width: "60%" }}
                       testID="totalDiscountText"
                       accessibilityLabel="totalDiscountText">
                        {t("BILLING.BILLING.TOTALDISCOUNT")}
                      </Text>
                      <Text
                        style={{
                          width: "40%",
                          paddingLeft: wp(15),
                          color: DEFAULT_DANGER_COLOR
                        }}
                        testID={Number(i?.rate * i?.qty - i?.amount)+"text"}
                        accessibilityLabel={Number(i?.rate * i?.qty - i?.amount)+"text"}>
                        {Number(i?.rate * i?.qty - i?.amount)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "50%", paddingHorizontal: wp(10) }}>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        paddingLeft: wp(10),
                        height: "100%",
                        alignItems: "center"
                      }}>
                      <Text style={{ width: "60%" }}
                       testID="netAmountText"
                       accessibilityLabel="netAmountText">
                        {t("BILLING.BILLING.NETAMOUNT")}
                      </Text>
                      <Text
                        style={{
                          backgroundColor: DEFAULT_WHITE_COLOR,
                          color: APP_PRIMARY_COLOR,
                          textAlign: "center",
                          marginLeft: 20,
                          padding: 2
                        }}
                        testID={i?.amount+"text"}
                        accessibilityLabel={i?.amount+"text"}>
                        {i?.amount}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
          // : <View style={{paddingTop:hp(50), backgroundColor:DEFAULT_WHITE_COLOR}} ><Loader /></View>
        }
        <Divider style={styles.lineStyle} />
        <View
          style={{
            padding: wp(10),
            flexDirection: "row",
            backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
            width: "100%",
            justifyContent: "space-evenly",
            marginTop: hp(450)
          }}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-end",
              width: "48%"
            }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%"
                // justifyContent: "space-between"
              }}>
              <View style={{ width: "60%" }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
                  }}
                  testID="totalAmountText"
                  accessibilityLabel="totalAmountText">
                  {t("BILLING.BILLING.TOTALAMOUNT")}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  width: "40%"
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
                  }}
                  testID={total+"text"}
                  accessibilityLabel={total+"text"}>
                  {total}
                  {/* 12345678 */}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%"
              }}>
              <View
                style={{
                  // flex: 1,
                  width: "70%"
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
                  }}
                  testID="totalDiscountText"
                  accessibilityLabel="totalDiscountText">
                  {t("BILLING.BILLING.TOTALDISCOUNT")}
                </Text>
              </View>
              <View
                style={{
                  // flex: 1,
                  alignItems: "flex-end",
                  width: "30%"
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
                  }}
                  testID={totalDiscount+"text"}
                  accessibilityLabel={totalDiscount+"text"}>
                  {totalDiscount}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              width: "48%",
              alignItems: "flex-end"
              // marginLeft: 20
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%"
              }}>
              <View style={{ width: "60%" }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
                  }}
                  testID="amountPaidText"
                  accessibilityLabel="amountPaidText">
                  {t("BILLING.BILLING.AMOUNTPAID")}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  width: "40%"
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
                  }}
                  testID={amountPaid+"text"}
                  accessibilityLabel={amountPaid+"text"}>
                  {amountPaid}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-between",
                width: "100%"
              }}>
              <View style={{ width: "60%" }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
                  }}
                  testID="netAmountText"
                  accessibilityLabel="netAmountText">
                  {t("BILLING.BILLING.NETAMOUNT")}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  width: "40%"
                }}>
                <Text
                  style={{
                    color: APP_PRIMARY_COLOR,

                    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
                  }}
                  testID="totalNetAmountText"
                  accessibilityLabel="totalNetAmountText">
                  {Number(netPayable) -
                    Number(amountPaid) -
                    Number(totalDiscount)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Divider style={styles.lineStyle} />
      <FooterButton
        // label={t("BILLING.BILLING.SAVE")}
        label={refund ? t("BILLING.PAYMENT.REFUND") : t("BILLING.BILLING.SAVE")}
        onPress={() => {
          navigation.navigate("PaymentDetails");
        }}
      />
    </View>
  );
};
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
)(withTranslation()(Billing));

const styles = StyleSheet.create({
  addbottom: {
    // bottom: Platform.OS === "ios" ? 5 : 0,
    // position: "absolute",
    width: "100%",
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 15
  },
  generate: {
    backgroundColor: DEFAULT_DANGER_COLOR,
    padding: 12,
    borderRadius: 5
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: "center",
    fontFamily: "NunitoSans-Bold",
    fontSize: 18
  },
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_INVERSE_LIGHT
  },
  vertical: {
    //marginVertical: wp(12),
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 5,
    //flex: 1,
    flexDirection: "row",
    paddingHorizontal: wp(10),
    width: wp(180),
    borderRadius: 10
  },
  input: {
    flexDirection: "row",
    marginVertical: wp(8),
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  close: {
    width: 12,
    height: 12
  },
  image: {
    flexDirection: "row",
    margin: wp(10),
    marginBottom: wp(10)
  },
  textfont: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    fontSize: 16
  },
  historyicon: {
    width: 25,
    height: 25,
    marginRight: 5
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
  text: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    color: DEFAULT_GREY_COLOR,
    // margin: wp(5),
    marginLeft: wp(15)
    // marginHorizontal: wp(10)
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
