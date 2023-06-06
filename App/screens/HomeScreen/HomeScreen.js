import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  processColor,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Platform,
  PermissionsAndroid,
  BackHandler,
  Alert,
  DeviceEventEmitter
} from "react-native";
import Icon2 from "react-native-vector-icons/FontAwesome";
import { wp } from "../../themes/Scale";
import {
  Row,
  Col,
  Thumbnail,
  Footer,
  FooterTab,
  Button,
  Item,
  Label,
  Icon,
  Header
} from "native-base";
import { PieChart } from "react-native-charts-wrapper";
import SafeAreaView from "react-native-safe-area-view";
//import { StackNavigator, SafeAreaView } from 'react-navigation';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { bindActionCreators } from 'redux';
import { NavigationEvents } from "react-navigation";
import { getPatientList } from "../../redux/actions/patient_action";
import { getPostList2 } from "../../redux/actions/post_action";
import { getTemplateList } from "../../redux/actions/template_action";
import { getApplyList } from "../../redux/actions/tempapply_action";
import { getTeleList } from "../../redux/actions/tele_action";
import { connect } from "react-redux";
import * as firebase from "react-native-firebase";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import update from "immutability-helper";
import DatePicker from "react-native-datepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Overlay, normalize } from "react-native-elements";
import VersionCheck from "react-native-version-check";
import { APP_PRIMARY_COLOR } from "../../themes/variable";
import getBaseUrl, { getApiUrl, getInstanceType } from "../../config/Config";
import { getCountryCode } from "../../utils/CountryCode";
import { TwilioConnection } from "../../redux/actions/TwilioActions";

import HeAlpha from "../../assets/images/healpha_logo_main.png";
import i18n from "../../../i18n";
import i18next from "i18next";
import {
  getAllVirtualClinicUsers,
  sendNotificationToVirtualClinicUsers
} from "../../services/MyPracticeService";
import {Picker} from '@react-native-picker/picker';

//webrtc connection issue 2022/05/05
// let ws = null;
// ws = new WebSocket('wss://stun.concent.in/websocket');
// ws.onopen = () => {
//   console.log('9 Connected to the signaling server');
// };
// ws.onerror = (err) => {
//   // console.error(err)
// };
// ws.onclose = function clear() {
//   clearTimeout(this.pingTimeout);
// };

// ws.onping = (heartbeat) => {
//   console.log('ping');
// };

// function heartbeat() {
//   clearTimeout(this.pingTimeout);

//   // Use `WebSocket#terminate()`, which immediately destroys the connection,
//   // instead of `WebSocket#close()`, which waits for the close timer.
//   // Delay should be equal to the interval at which your server
//   // sends out pings plus a conservative assumption of the latency.
//   this.pingTimeout = setTimeout(() => {
//     this.terminate();
//   }, 300000 + 1000);
// }
// let connection = null;
// let name = null;
// let otherUsername = null;
// let sendChannel;
// let receiveChannel;
// let sendDataVar;

// const sendMessage = async (message) => {
//   if (otherUsername) {
//     message.otherUsername = otherUsername;
//   }
//   // alert(JSON.stringify(message));
//   await ws.send(JSON.stringify(message));
// };

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      onlineusers1: [],
      valid: false,
      reason: "",
      confirm_modal: false,
      confirm_modal1: false,
      combo: false,
      refreshing: false,
      visible: false,
      videocall: "",
      videocallstatus: false,
      temp_id: "default",
      temp_name: "default",
      score: "0",
      profile_pic: require("../../assets/images/doc.jpg"),
      value: "",
      mag: true,
      image: "",
      // p_list:true,
      patient: [],
      patient2: [],
      cross: false,
      chosenDate: this.props.navigation.state.params.schedule_date
        ? this.props.navigation.state.params.schedule_date
        : new Date(),
      loading: true,
      aasha: this.props.navigation.state.params.aasha,
      hospital_branch: this.props.navigation.state.params.branch_id
        ? this.props.navigation.state.params.branch_id
        : "",
      prc_name: this.props.navigation.state.params.branch_name
        ? this.props.navigation.state.params.branch_name
        : "",
      legend: {
        enabled: true,
        textSize: 15,
        form: "CIRCLE",
        position: 22,
        horizontalAlignment: "CENTER",
        verticalAlignment: "BOTTOM",
        // orientation: "VERTICAL",
        orientation: "HORIZONTAL",
        wordWrapEnabled: true,
        flag: false
      },
      appointments: [
        {
          time: "10:00 AM",
          Name: "bharathi",
          type: "checkedin"
        },
        {
          time: "10:02 AM",
          Name: "vidya",
          type: "consulting"
        },
        {
          time: "10:03 AM",
          Name: "srikanth1",
          type: "undergoing"
        },
        {
          time: "10:00 AM",
          Name: "srikanth2",
          type: "Appointment Booked"
        },
        {
          time: "10:02 AM",
          Name: "srikanth3",
          type: "completed"
        },
        {
          time: "10:03 AM",
          Name: "srikanth4",
          type: "canceled"
        }
      ],
      appointments1: [
        {
          time: "10:00 AM",
          Name: "bharathi",
          type: "checkedin"
        },
        {
          time: "10:02 AM",
          Name: "vidya",
          type: "consulting"
        },
        {
          time: "10:03 AM",
          Name: "srikanth1",
          type: "undergoing"
        },
        {
          time: "10:00 AM",
          Name: "srikanth2",
          type: "Appointment Booked"
        },
        {
          time: "10:02 AM",
          Name: "srikanth3",
          type: "completed"
        },
        {
          time: "10:03 AM",
          Name: "srikanth4",
          type: "canceled"
        }
      ],

      data: {
        dataSets: [
          {
            values: [
              { value: 0, label: "checkedin" },
              { value: 0, label: "consulting" },
              { value: 0, label: "undergoing" },
              { value: 0, label: "Appointment Booked" },
              { value: 0, label: "completed" },
              { value: 0, label: "canceled" },
              { value: 0, label: "Appointment Recheduled" },
              { value: 0, label: "reconsulting" },
              { value: 0, label: "closed" },
              { value: 0, label: "Confirm" }
            ],
            label: "",
            config: {
              colors: [
                processColor("#00a950"),
                processColor(APP_PRIMARY_COLOR),
                processColor("#58595b"),
                processColor("#166a8f"),
                processColor("#f67019"),
                processColor("#8549ba"),
                processColor("#fae83d"),
                processColor("#d25ba6"),
                processColor("#2f5f8f"),
                processColor("#218080")
              ],
              valueTextSize: 12,
              valueTextColor: processColor("white"),
              sliceSpace: 5,
              selectionShift: 13,
              // xValuePosition: "OUTSIDE_SLICE",
              // yValuePosition: "OUTSIDE_SLICE",
              valueFormatter: "#",
              valueLineColor: processColor("green"),
              valueLinePart1Length: 0.5
            }
          }
        ]
      },
      // highlights: [{x:2}],
      description: {
        text: "",
        textSize: 15,
        textColor: processColor("darkgray")
      },
      open_consult_popup: this.props.navigation.state.params.open_consult_popup
        ? this.props.navigation.state.params.open_consult_popup
        : false,
      hlp_id: this.props.navigation.state.params.hlp_id
        ? this.props.navigation.state.params.hlp_id
        : null,
      enc_id: this.props.navigation.state.params.enc_id
        ? this.props.navigation.state.params.enc_id
        : null,
      init: true,
      isVersionAlert: false,
      selected_appointment: {}
    };
    this.setDate = this.setDate.bind(this);
    // this.api2 = this.api2.bind(this)
    // trucks = [];
    this.handleBackPress = this.handleBackPress.bind(this);
    this.init();
    DeviceEventEmitter.addListener("eventStartConsultation", (e) => {
      console.log("start", e);
      {
        e.selectTemplate == "true"
          ? this.connected("yes")
          : this.connected1("yes");
      }
    });
  }

  init() {
    console.log("twiliohomescreen");
    // {global.twilioconnected && global.twilioviewpdf?
    //   Alert.alert(
    //     'Disconnecting the Healpha Call with',
    //     global.twiliopatienname,
    //     [
    //       {text: 'Yes', onPress: () => {
    //         global.twilioviewpdf= false
    //         global.twilioconnected= false
    //         DeviceEventEmitter.emit('eventTwilioDisconnect', { data: 'disconnect'});
    //       }},
    //     ],
    //     {cancelable: false},
    //   ):null}
    // {global.twilioconnected && global.twilioviewpdf &&(
    //   global.twilioviewpdf= false,
    //   global.twilioconnected= false,
    //   DeviceEventEmitter.emit('eventTwilioDisconnect', { data: 'disconnect'}),
    //   alert('Disconnecting the Healpha Call with '+global.twiliopatienname)
    // )}
    this.props.navigation.addListener("willFocus", this._handleStateChange);
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  versionlinking = () => {
    BackHandler.exitApp();
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.healpha_doctor"
    );
    // this.setState({isVersionAlert:false})
  };
  versionlink = () => {
    Alert.alert(
      "Please Update",
      "You will have to update your app to the latest version to continue using",
      [
        {
          text: "Update",
          onPress: () => this.versionlinking()
        }
      ]
    );
  };
  handleBackPress() {
    this.props.navigation.goBack(null);
    return true;
  }

  _handleStateChange = (state) => {
    if (this.state.init) {
      this.setState({ init: false });
      return;
    }
    if (this.state.open_consult_popup) {
      this.handleBackPress();
    }
  };

  handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null });
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
    }

    let ob = this.state.patient2;
    // this.setState({patient2:this.props.patientList.message})
    if (event.nativeEvent.label != undefined) {
      event.nativeEvent.label == "Checked In"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "checkedin"
            )
          })
        : event.nativeEvent.label == "Consulting"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "consulting"
            )
          })
        : event.nativeEvent.label == "In Process"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "undergoing"
            )
          })
        : event.nativeEvent.label == "Booked"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "Appointment Booked"
            )
          })
        : event.nativeEvent.label == "Completed"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "completed"
            )
          })
        : event.nativeEvent.label == "Cancelled"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "cancelled"
            )
          })
        : event.nativeEvent.label == "Re-Scheduled"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "Appointment Rescheduled"
            )
          })
        : event.nativeEvent.label == "Reconsulting"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "reconsulting"
            )
          })
        : event.nativeEvent.label == "Triage"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "Triage"
            )
          })
        : event.nativeEvent.label == "Confirm" ||
          event.nativeEvent.label == "confirm"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) =>
                item.APPOINTMENT_STATUS === "Confirm" ||
                item.APPOINTMENT_STATUS === "confirm"
            )
          })
        : event.nativeEvent.label == "Closed"
        ? this.setState({
            patient: this.state.patient2.filter(
              (item) => item.APPOINTMENT_STATUS === "closed"
            )
          })
        : null;

      //alert(JSON.stringify(this.state.patient))
    } else {
      this.setState({ patient: ob });
    }
  }
  dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${this.state.p_phone}`;
    } else {
      phoneNumber = `telprompt:${this.state.p_phone}`;
    }

    Linking.openURL(phoneNumber);
  };
  closeOverlay1 = async () => {
    if (this.state.open_consult_popup) {
      this.setState({
        confirm_modal: false,
        confirm_modal1: false
      });
      this.handleBackPress();
      return;
    }

    if (this.state.reason != "") {
      await this.props.getTeleList({
        hlpid: this.state.tmp_hlpid,
        docid: global.doctor_id,
        token: global.token,
        uid: this.state.tmp_uid.replace(/&/g, "."),
        reason: this.state.reason,
        username: this.state.tmp_username
      });
      // if (this.props.patientList.message != 0) {
      //   let obt = [];
      //   this.props.patientList.message
      //     .filter(
      //       (item) =>
      //         (item.APPOINTMENT_TYPE.toLowerCase() === 'telemedicine' ||
      //           item.APPOINTMENT_TYPE.toLowerCase() === 'homecare') &&
      //         (item.APPOINTMENT_STATUS.toLowerCase() === 'confirm' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'consulting' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'reconsulting' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'triage' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'checkedin'),
      //     )
      //     .map((item) => {
      //       obt.push(item.uid.split('&')[2]);
      //     });
      //   sendMessage({
      //     type: 'online_users',
      //     patientList: obt,
      //   });
      // }
      this.setState({ confirm_modal: false });
      this.setState({ confirm_modal1: false });
    } else {
      // if (this.props.patientList.message != 0) {
      //   let obt = [];
      //   this.props.patientList.message
      //     .filter(
      //       (item) =>
      //         (item.APPOINTMENT_TYPE.toLowerCase() === 'telemedicine' ||
      //           item.APPOINTMENT_TYPE.toLowerCase() === 'homecare') &&
      //         (item.APPOINTMENT_STATUS.toLowerCase() === 'confirm' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'consulting' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'reconsulting' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'triage' ||
      //           item.APPOINTMENT_STATUS.toLowerCase() === 'checkedin'),
      //     )
      //     .map((item) => {
      //       obt.push(item.uid.split('&')[2]);
      //     });
      //   sendMessage({
      //     type: 'online_users',
      //     patientList: obt,
      //   });
      // }
      this.setState({
        confirm_modal: false,
        confirm_modal1: false,
        valid: true
      });
    }
    this.state.reason = "";
  };
  connected = async (videocall) => {
    console.log("123456789", videocall);
    await this.props.getTemplateList({
      docid: global.doctor_id,
      token: global.token,
      practice_id: this.state.tmp_branch.split("-")[0],
      branch_id: this.state.tmp_branch,
      encid: this.state.tmp_enc
    });
    // alert(this.state.tmp_uid.replace(/&/g,"."))
    // alert(JSON.stringify(obc))
    this.setState({
      template_list: this.props.templateList.message,
      confirm_modal: false,
      confirm_modal1: false,
      visible: true,
      videocall: videocall
    });
  };
  CreateNewEncounter = async (
    hlp_id,
    doc_id,
    brn_id,
    prac_id,
    app_type,
    uid,
    UID
  ) => {
    console.log("booked");
    // let ob = JSON.stringify({
    //   para_stand: 1,
    //   doc_email: this.props.postList.doc_details[0].email,
    //   uid: uid,
    //   doc_id: doc_id,
    //   doc_name: await AsyncStorage.getItem('doctorname'),
    //   practice_id: prac_id,
    //   branch_id: brn_id,
    //   app_type: app_type,
    //   hlp_id: hlp_id,
    //   passingdate: "",

    // });
    // console.log("ob=",ob);
    // let getdataurl = base_url + "create_newenc_standalone/";
    // fetch(getdataurl
    //   , {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: ob
    //   }
    // )
    //   //   .then((response) => response.json())
    //   //   .then(async (response) => {
    //   //       if(response['message']){
    //   //         console.log(response['message']);

    //   //   this._onRefresh();
    //   //   return response;
    //   //})
    //   .then(async (response) => {
    //     console.log("response",response)
    //     await this.props.getPatientList({
    //       "nh_id": global.doctor_id,
    //       "branch_id": this.state.sa_branch_id,
    //       "passingdate": moment(this.state.chosenDate).format('YYYY-MM-DD'),
    //       "token": this.state.token
    //     })
    //     let newdata = this.props.patientList.message.filter((item) => {
    //       return item.uid == UID
    //     })
    //     console.log("newdata[0]",newdata[0])
    //     this.temp(newdata[0].BRANCH_ID,
    //       newdata[0].uid.split("&")[2],
    //       newdata[0].enc_id,
    //       newdata[0].description,
    //       newdata[0].uid,
    //       newdata[0].template_id,
    //       newdata[0].template_name,
    //       newdata[0].APPOINTMENT_TYPE,
    //       newdata[0].Name,
    //       newdata[0].APPOINTMENT_STATUS,
    //       newdata[0].age,
    //       newdata[0].dob,
    //       newdata[0].person_blood,
    //       newdata[0].person_gender)

    //   })
  };
  sendnotification = async () => {
    const deviceToken = await AsyncStorage.getItem("jwt_token");
    console.log("poiuy", deviceToken);
    if (this.state.reason) {
      let url = getBaseUrl() + "notify_patient/";
      let ocv = JSON.stringify({
        hlp: this.state.tmp_hlpid,
        doc: global.doctor_id,
        token: global.token,
        node_token: deviceToken,
        content: this.state.reason
      });
      console.log("resssssssssssssssss", ocv);
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: ocv
      })
        .then((response) => response.json())
        .then((response) => {
          alert(i18n.t("COVID_MONITORING.SUCC"));
          return response.message;
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          console.error(error);
        });
    } else {
      alert(i18next.t("PATIENTS.ENTER_REASON"));
    }
  };
  connected1 = async (videocall) => {
    // alert(this.state.tmp_uid.replace(/&/g,"."))
    // alert(JSON.stringify(obc))
    this.setState({
      confirm_modal: false,
      confirm_modal1: false,
      visible: false
    });
    {
      this.props.navigation.navigate("Consult", {
        branch: this.state.tmp_branch,
        hspname: this.state.prc_name,
        summary: this.state.tmp_hlpid,
        enc_id: this.state.tmp_enc,
        description: this.state.tmp_chief,
        plist: this.state.tmp_uid,
        template_id: this.state.tmp_templateid,
        template_name: this.state.tmp_templatename,
        appointment_type: this.state.app_type,
        name: this.state.tmp_username,
        appointment_staus: this.state.tmp_status,
        profile_pic: global.profile_image,
        age: this.state.tmp_age,
        gender: this.state.tmp_gender,
        // checkstatus:"consulting",
        dob: this.state.tmp_dob,
        blood: this.state.tmp_blood,
        videocall: videocall == "yes" ? "yes" : "no",
        screen: "dashboard",
        screen2: "consulting",
        aasha: this.state.aasha,
        enc_version: this.state.tmp_enc_version,
        virtual_clinic_branch: this.state.selected_appointment
          ?.virtual_clinic_branch
          ? this.state.selected_appointment
          : false
      });
    }
  };
  reason = (text) => {
    // alert(text)
    this.setState({
      reason: text,
      valid: false
    });
  };
  openOverlay1 = (
    phone,
    branch,
    hlpid,
    enc,
    chief,
    uid,
    template_id,
    template_name,
    app_type,
    username,
    status,
    age,
    dob,
    blood,
    gender,
    salutation,
    person_phcode,
    enc_version
  ) => {
    // let obt = [];
    // obt.push(hlpid);
    // sendMessage({
    //   type: 'online_users',
    //   patientList: obt,
    // });
    // alert(this.state.onlineusers1)
    if (
      (app_type.toLowerCase() == "telemedicine" ||
        app_type.toLowerCase() == "homecare") &&
      (status.toLowerCase() == "confirm" ||
        status.toLowerCase() == "Confirm" ||
        status.toLowerCase() == "triage" ||
        status.toLowerCase() == "Triage" ||
        status.toLowerCase() == "checkedin" ||
        status.toLowerCase() == "appointment rescheduled")
    ) {
      // let videostatus=this.state.onlineusers1.split("@")[1]
      // if(videostatus=="online"){
      //     this.setState({
      //         videocallstatus:true
      //     })
      // }
      // else{
      //     this.setState({
      //         videocallstatus:false
      //     })
      // }
      this.setState({
        confirm_modal: true,
        p_phone: phone,
        tmp_branch: branch,
        tmp_hlpid: hlpid,
        tmp_enc: enc,
        tmp_chief: chief,
        tmp_uid: uid,
        tmp_templateid: template_id,
        tmp_templatename: template_name,
        app_type: app_type,
        tmp_username: username,
        tmp_status: status,
        tmp_age: age,
        tmp_dob: dob,
        tmp_blood: blood,
        tmp_gender: gender,
        p_salutation: salutation,
        person_phcode: person_phcode,
        tmp_enc_version: enc_version
      });
    } else {
      this.setState({
        confirm_modal1: true,
        p_phone: phone,
        tmp_branch: branch,
        tmp_hlpid: hlpid,
        tmp_enc: enc,
        tmp_chief: chief,
        tmp_uid: uid,
        tmp_templateid: template_id,
        tmp_templatename: template_name,
        app_type: app_type,
        tmp_username: username,
        tmp_status: status,
        tmp_age: age,
        tmp_dob: dob,
        tmp_blood: blood,
        tmp_gender: gender,
        p_salutation: salutation,
        person_phcode: person_phcode,
        tmp_enc_version: enc_version
      });
    }
  };
  closeOverlay = () => {
    this.setState({ visible: false });
    // if (this.props.patientList.message != 0) {
    //   let obt = [];
    //   this.props.patientList.message
    //     .filter(
    //       (item) =>
    //         (item.APPOINTMENT_TYPE.toLowerCase() === 'telemedicine' ||
    //           item.APPOINTMENT_TYPE.toLowerCase() === 'homecare') &&
    //         (item.APPOINTMENT_STATUS.toLowerCase() === 'confirm' ||
    //           item.APPOINTMENT_STATUS.toLowerCase() === 'consulting' ||
    //           item.APPOINTMENT_STATUS.toLowerCase() === 'reconsulting' ||
    //           item.APPOINTMENT_STATUS.toLowerCase() === 'triage' ||
    //           item.APPOINTMENT_STATUS.toLowerCase() === 'checkedin'),
    //     )
    //     .map((item) => {
    //       obt.push(item.uid.split('&')[2]);
    //     });
    //   sendMessage({
    //     type: 'online_users',
    //     patientList: obt,
    //   });
    // }
  };
  openOverlay = () => {
    this.setState({
      visible: true
    });
  };

  sendNotificationToVirtualClinic = async () => {
    try {
      const { selected_appointment } = this.state;

      const url =
        getBaseUrl() +
        `v1/virtual-clinic/${selected_appointment?.virtual_clinic_branch}/users/all`;

      const response = await getAllVirtualClinicUsers(url);

      const users = response?.data?.users || [];

      const doctor_name = await AsyncStorage.getItem("doctorname");

      const php_token = await AsyncStorage.getItem("userToken");

      const nodeToken = await AsyncStorage.getItem("jwt_token");

      for (let i = 0; i < users?.length; i++) {
        const element = users[i];
        const payload = {
          action: `Healpha Call@concent@${selected_appointment?.enc_id}_${
            selected_appointment?.enc_version
          }_${getInstanceType()}@concent@${
            selected_appointment?.healpha_id
          }@concent@${selected_appointment?.Name}@concent@${
            selected_appointment?.doc_id
          }@concent@${doctor_name}`,
          content: "Please join the call, Doctor is waiting",
          doc: selected_appointment?.doc_id,
          hlp: element?.nh_id,
          source: "patient",
          token: php_token,
          node_token: nodeToken
        };
        console.log("payloadddddddddddd", payload);
        const notification_url = getBaseUrl() + `notify_healpha_call`;
        console.log("notifyhealphacall", notification_url);
        const ntg_response = await sendNotificationToVirtualClinicUsers(
          notification_url,
          payload
        );
        console.log("reshealpha", ntg_response);
      }
      // this.heAlphaCall();
    } catch (error) {
      console.error(error);
    }
  };

  telemedicinevideocall = async () => {
    this.heAlphaCall();
  };

  heAlphaCall = async () => {
    const { selected_appointment } = this.state;

    if (selected_appointment?.virtual_clinic_branch) {
      await AsyncStorage.setItem("virtual_clinic_flag", "true");
      await AsyncStorage.setItem(
        "virtual_clinic_branch",
        selected_appointment?.virtual_clinic_branch
      );
    } else {
      await AsyncStorage.setItem("virtual_clinic_flag", "false");
    }

    await AsyncStorage.setItem(
      "twilioEncid",
      this.state.tmp_enc + "_" + this.state.tmp_enc_version
    );
    await AsyncStorage.setItem("twilioPerHlpid", this.state.tmp_hlpid);
    await AsyncStorage.setItem("twilioPerName", this.state.tmp_username);
    await AsyncStorage.setItem(
      "selectTemplate",
      this.state.confirm_modal ? "true" : "false"
    );
    await AsyncStorage.setItem(
      "consult",
      this.state.confirm_modal1 ? "true" : "false"
    );
    await AsyncStorage.setItem("fromPage", "homescreen");
    this.setState(
      {
        call: false,
        confirm_modal: false,
        confirm_modal1: false,
        visible: false
      },
      () => this.props.TwilioConnection(true)
    );
  };

  telemedicinevideocall1 = () => {
    console.log("234");
    // this.setState({videocall:"no"})
    alert("Patient is not reachable please enter a reason");
  };

  telemedicinevideocall2 = async () => {
    this.heAlphaCall();

    // const {selected_appointment} = this.state;

    // if (selected_appointment?.virtual_clinic_branch) {
    //   this.sendNotificationToVirtualClinic();
    // } else {

    // }
  };

  telemedicinevideocall11 = () => {
    console.log("456");
    // this.setState({videocall1:"no"})
    alert("Patient is not reachable please enter a reason");
  };

  search = () => {
    // alert("hi")
    if (this.state.mag == true) {
      this.setState({
        cross: true,
        mag: false
      });
    } else {
      this.setState({
        mag: true,
        cross: false
      });
    }
  };

  searchFilterFunction = (text) => {
    this.setState({
      value: text
    });
    let trucks = this.state.patient2;
    let newData;
    if (trucks.length > 0) {
      newData = trucks.filter((item) => {
        // const itemData = item.type.toUpperCase()||item.Name.toUpperCase()||item.time.toUpperCase() ;
        const textData = text.toUpperCase();
        return (
          item.APPOINTMENT_STATUS.toUpperCase().indexOf(textData) > -1 ||
          item.Name.toUpperCase().indexOf(textData) > -1 ||
          item.uid.split("&")[2].toUpperCase().indexOf(textData) > -1
        );
        // ||item.time.toUpperCase().indexOf(textData) > -1 ;
      });
    }
    this.setState({
      patient: newData
    });
  };
  onValueChangehospital = async (value, label) => {
    let newdata = this.props.postList.pract_details.filter((item) => {
      return item.branch_id == value;
    });
    // alert(newdata[0].op_branch_work_timings[0].standalone)
    this.setState({
      hospital_branch: value,
      prc_name: newdata[0].branch_name,
      prc_id: newdata[0].practice_id,
      sa_CITY: newdata[0].CITY,
      stand: newdata[0].op_branch_work_timings[0].standalone,
      sa_slot_timing: newdata[0].slot_timing,
      sa_visit_hours_time: newdata[0].visit_hours_time,
      sa_specialization: newdata[0].specialization,
      sa_branch_id: newdata[0].branch_id
    });
    await this.props.getPatientList({
      nh_id: global.doctor_id,
      branch_id: value,
      passingdate: moment(this.state.chosenDate).format("YYYY-MM-DD"),
      token: this.state.token
    });
    this.list();
    this.setState({
      patient: this.props.patientList.message,
      patient2: this.props.patientList.message
    });

    global.template_practice_id =
      newdata[0].practice_id + "-" + newdata[0].branch_name;
    global.template_branch_id =
      newdata[0].branch_id + "," + newdata[0].branch_name;
    global.template_specialization = newdata[0].specialization;
    console.log(global.template_branch_id + "sandy");
    console.log(global.template_practice_id + "sandy");
    console.log(global.template_specialization);
  };

  setDate = async (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    let obt = [];

    this.props.patientList.message &&
      this.props.patientList.message
        .filter(
          (item) =>
            item.APPOINTMENT_TYPE.toLowerCase() === "telemedicine" ||
            item.APPOINTMENT_TYPE.toLowerCase() === "homecare"
        )
        .map((item) => {
          obt.push(item.uid.split("&")[2]);
        });

    //    let obt=[];
    //    this.props.patientList.message&&this.props.patientList.message.filter(item=> (item.APPOINTMENT_TYPE === "telemedicine" || item.APPOINTMENT_TYPE === "homecare")).map((item)=>{
    //     obt.push(item.uid.split("&")[2])
    // })
    // await sendMessage({
    //     type: 'online_users',
    //     patientList:obt,
    // })
    //await this.setState({ chosenDate: newDate });
    await this.setState({chosenDate: moment(currentDate).format('YYYY-MM-DD')});
    await this.api2();
    this.list();
    this.setState({
      patient: this.props.patientList.message,
      patient2: this.props.patientList.message
    });
  };

  componentDidUpdate = () => {
    // const wsdata = ws;
    // if (ws == null || wsdata._subscriptions.length == 0) {
    //   console.log('11111');
    //   ws = new WebSocket('wss://stun.concent.in/websocket');
    // }
    // ws.onmessage = (msg) => {
    //   console.log('1' + new Date() + 'Got message', msg.data);
    //   const data = JSON.parse(msg.data);
    //   console.log('2' + new Date() + 'online=' + data.onlineusers);
    //   switch (data.type) {
    //     case 'online_users':
    //       this.setState({onlineusers1: data.onlineusers});
    //       // alert(this.state.onlineusers1)
    //       // online_user(data.onlineusers)
    //       break;
    //     case 'close':
    //       this.setState({onlineusers1: data.onlineusers});
    //       // online_user(data.onlineusers)
    //       break;
    //     default:
    //       break;
    //   }
    // };
  };

  componentDidMount = async () => {
    this.Apicallmethod();
    if (Platform.OS === "android") {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]).then((granted) => {
          Object.entries(granted).map(([key, value]) => {
            console.log(key, value);
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    this.getData();
    if (Platform.OS == "android") {
      VersionCheck.getLatestVersion({
        provider: "playStore" // for Android
      }).then((latestVersion) => {
        console.log("latestVersion", latestVersion);
        this.setState({ getLatestVersion1: latestVersion });
        console.log(
          "VersionCheck.getCurrentVersion()",
          VersionCheck.getCurrentVersion()
        );
        this.setState({ currentversion: VersionCheck.getCurrentVersion() });
        if (latestVersion > VersionCheck.getCurrentVersion()) {
          this.setState({ isVersionAlert: true });
        } else {
          this.setState({ isVersionAlert: false });
        }
      });
    }
    // alert(this.state.hospital_branch)
    // this.incrementCount();
    // let data=await getOnlineUsers();
    // alert("online="+JSON.stringify(data))
  };
  // componentDidMount = async () => {
  //   // alert(this.state.hospital_branch)
  //   // this.incrementCount();
  //   // let data=await getOnlineUsers();
  //   // alert("online="+JSON.stringify(data))

  //   this.getData();

  // }

  Apicallmethod = () => {
    let base_url = getBaseUrl();
    let url_base = base_url + "v1/public/country-contact-details";
    let response = fetch(url_base, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          image: response.data.contact_details.portal_header_logo
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getData().then((item) => {
      this.setState({ refreshing: false });
    });
  };
  setflag = async () => {
    this.setState({ flag: true });
  };
  getData = async () => {
    // await this.createNotificationListeners();
    //  await this.temp()
    // alert("aaa")
    this.setState({ flgValue: false });
    this.setState({ videocall: "no" });
    await this.getuser();
    await this.api2();
    this.setState({
      patient: this.props.patientList.message,
      patient2: this.props.patientList.message
    });
    await this.api1();
    await this.list();
    // ws.onmessage = (msg) => {
    //   console.log('4 Got message', msg.data);
    //   const data = JSON.parse(msg.data);
    //   console.log('5 online=' + data.onlineusers);
    //   switch (data.type) {
    //     case 'online_users':
    //       //    alert("online called");
    //       // online_user(data.onlineusers);
    //       break;
    //     case 'close':
    //       //    alert("online called");
    //       // online_user(data.onlineusers);
    //       break;
    //     default:
    //       break;
    //   }
    // };
    //
    // await this.temp()
    //
    this.setState({
      combo: true
    });

    this.setState({ template_list: "" });
    // if (this.props.postList.doc_details[0].profile_image != "" &&
    //   this.props.postList.doc_details[0].profile_image != undefined &&
    //   this.props.postList.doc_details[0].profile_image != null) {
    //   this.setState({
    //     profile_pic: { uri: urldata[0] + "/" + this.props.postList.doc_details[0].profile_image.trim() }
    //   })
    if (
      global.profile_image.trim() != "" &&
      global.profile_image != undefined &&
      global.profile_image != null
    ) {
      console.log("imagepath1", global.profile_image);
      global.profile_image = {
        uri: getApiUrl() + "/" + global.profile_image.trim()
      };
    } else {
      global.profile_image = require("../../assets/images/doc.jpg");
    }
    this.onValueChangehospital(
      this.props.navigation.state.params.branch_id,
      this.props.navigation.state.params.branch_name
    );
  };

  api2 = async () => {
    let branch_id = this.state.hospital_branch;
    if (
      this.state.hospital_branch == "" ||
      this.state.hospital_branch == undefined
    ) {
      this.setState({
        prc_name: this.props.postList.pract_details[0].practice_name
      });
      await this.props.getPatientList({
        nh_id: global.doctor_id,
        branch_id: this.props.postList.pract_details[0].branch_id,
        passingdate: moment(this.state.chosenDate).format("YYYY-MM-DD"),
        token: this.state.token
      });
    } else {
      await this.props.getPatientList({
        nh_id: global.doctor_id,
        branch_id: this.state.hospital_branch,
        passingdate: moment(this.state.chosenDate).format("YYYY-MM-DD"),
        token: this.state.token
      });
    }

    this.setState({ loading: false });
  };

  temp = async (
    branch,
    hlpid,
    enc,
    chief,
    uid,
    template_id,
    template_name,
    app_type,
    username,
    status,
    age,
    dob,
    blood,
    gender,
    enc_version
  ) => {
    await this.props.getTemplateList({
      docid: this.state.docid,
      token: global.token,
      practice_id: branch.split("-")[0],
      branch_id: branch,
      encid: enc
    });

    this.setState({
      template_list: this.props.templateList.message,
      visible: true,
      tmp_hlpid: hlpid,
      tmp_enc: enc,
      tmp_chief: chief,
      tmp_uid: uid,
      tmp_templateid: template_id,
      tmp_templatename: template_name,
      app_type: app_type,
      tmp_username: username,
      tmp_status: status,
      tmp_age: age,
      tmp_dob: dob,
      tmp_blood: blood,
      tmp_gender: gender,
      tmp_enc_version: enc_version
    });
  };
  temp1 = async (
    hlpid,
    enc,
    chief,
    uid,
    template_id,
    template_name,
    app_type,
    username,
    status
  ) => {
    await this.props.getApplyList({
      docid: this.state.docid,
      token: global.token,
      consulting: status,
      hlpid: hlpid,
      enc: enc,
      chief: chief,
      uid: uid.replace(/&/g, "."),
      template_id: template_id,
      template_name: template_name,
      app_type: app_type,
      username: username
    });
  };
  list = async () => {
    console.log(
      "this.props.patientList.message",
      this.props.patientList.message
    );
    if (this.props.patientList.message != 0) {
      let obt = [];
      this.props.patientList.message
        .filter(
          (item) =>
            (item.APPOINTMENT_TYPE.toLowerCase() === "telemedicine" ||
              item.APPOINTMENT_TYPE.toLowerCase() === "homecare") &&
            (item.APPOINTMENT_STATUS.toLowerCase() === "confirm" ||
              item.APPOINTMENT_STATUS.toLowerCase() === "consulting" ||
              item.APPOINTMENT_STATUS.toLowerCase() === "reconsulting" ||
              item.APPOINTMENT_STATUS.toLowerCase() === "triage" ||
              item.APPOINTMENT_STATUS.toLowerCase() === "checkedin")
        )
        .map((item) => {
          obt.push(item.uid.split("&")[2]);
        });
      console.log("sdkhksdhf", obt);
      // console.log('44444444', ws);
      // const wsdata = ws;
      // console.log('55555555', wsdata._subscriptions.length);
      // if (ws == null || wsdata._subscriptions.length == 0) {
      //   console.log('2222222');
      //   ws = new WebSocket('wss://stun.concent.in/websocket');
      // }
      // ws.onopen = () => {
      //   console.log('6 Connected to the signaling server');
      // };
      // ws.onerror = (err) => {
      //   //console.error(err)
      // };
      // ws.onclose = function clear() {
      //   clearTimeout(this.pingTimeout);
      // };

      // ws.onping = (heartbeat) => {
      //   console.log('ping');
      // };

      // function heartbeat() {
      //   clearTimeout(this.pingTimeout);

      //   // Use `WebSocket#terminate()`, which immediately destroys the connection,
      //   // instead of `WebSocket#close()`, which waits for the close timer.
      //   // Delay should be equal to the interval at which your server
      //   // sends out pings plus a conservative assumption of the latency.
      //   this.pingTimeout = setTimeout(() => {
      //     this.terminate();
      //   }, 300000 + 1000);
      // }
      // await sendMessage({
      //   type: 'online_users',
      //   patientList: obt,
      // });
      // //  let doc_book=this.state.patient.filter(item=> item.type === "Appointment Booked",
      // // let obt=[];
      // // this.props.patientList.message.filter(item=> (item.APPOINTMENT_TYPE === "telemedicine"||item.APPOINTMENT_TYPE === "homecare")).map((item)=>{
      // //     obt.push(item.uid.split("&")[2])
      // // })
      // // await sendMessage({
      // //     type: 'online_users',
      // //     patientList:obt,
      // // })
      this.setState({
        score: this.props.patientList.message.length,
        doc_check: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "checkedin"
        ),
        doc_consult: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "consulting"
        ),
        doc_undergo: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "undergoing"
        ),
        doc_book: this.props.patientList.message.filter(
          (item) =>
            item.APPOINTMENT_STATUS.toLowerCase() === "appointment booked"
        ),
        doc_complete: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "completed"
        ),
        doc_cancel: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "cancelled"
        ),
        doc_res: this.props.patientList.message.filter(
          (item) =>
            item.APPOINTMENT_STATUS.toLowerCase() === "appointment rescheduled"
        ),
        doc_reoc: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "reconsulting"
        ),
        doc_triage: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "triage"
        ),
        doc_close: this.props.patientList.message.filter(
          (item) => item.APPOINTMENT_STATUS.toLowerCase() === "closed"
        ),
        doc_confirm: this.props.patientList.message.filter(
          (item) =>
            item.APPOINTMENT_STATUS.toLowerCase() === "Confirm" ||
            item.APPOINTMENT_STATUS.toLowerCase() === "confirm"
        )
      });
      let obj = [];
      let colorsdata = [];
      if (this.state.doc_book.length > 0) {
        obj.push({ value: this.state.doc_book.length, label: "Booked" });
        colorsdata.push(processColor("#166a8f"));
      }
      if (this.state.doc_confirm.length > 0) {
        obj.push({ value: this.state.doc_confirm.length, label: "Confirm" });
        colorsdata.push(processColor("#218080"));
      }
      if (this.state.doc_check.length > 0) {
        obj.push({ value: this.state.doc_check.length, label: "Checked In" });
        colorsdata.push(processColor("#00a950"));
      }
      if (this.state.doc_triage.length > 0) {
        obj.push({ value: this.state.doc_triage.length, label: "Triage" });
        colorsdata.push(processColor("#9f4221"));
      }
      if (this.state.doc_consult.length > 0) {
        obj.push({ value: this.state.doc_consult.length, label: "Consulting" });
        colorsdata.push(processColor(APP_PRIMARY_COLOR));
      }
      if (this.state.doc_undergo.length > 0) {
        obj.push({ value: this.state.doc_undergo.length, label: "In Process" });
        colorsdata.push(processColor("#58595b"));
      }

      if (this.state.doc_complete.length > 0) {
        obj.push({ value: this.state.doc_complete.length, label: "Completed" });
        colorsdata.push(processColor("#f67019"));
      }

      if (this.state.doc_close.length > 0) {
        obj.push({ value: this.state.doc_close.length, label: "Closed" });
        colorsdata.push(processColor("#2f5f8f"));
      }

      if (this.state.doc_res.length > 0) {
        obj.push({ value: this.state.doc_res.length, label: "Re-Scheduled" });
        colorsdata.push(processColor("#fae83d"));
      }

      if (this.state.doc_cancel.length > 0) {
        obj.push({ value: this.state.doc_cancel.length, label: "Cancelled" });
        colorsdata.push(processColor("#8549ba"));
      }

      if (this.state.doc_reoc.length > 0) {
        obj.push({ value: this.state.doc_reoc.length, label: "Reconsulting" });
        colorsdata.push(processColor("#d25ba6"));
      }

      this.setState(
        update(this.state, {
          data: {
            $set: {
              dataSets: [
                {
                  values: obj,
                  label: "",
                  config: {
                    colors: colorsdata,
                    valueTextSize: 12,
                    valueTextColor: processColor("white"),
                    sliceSpace: 7,
                    selectionShift: 13,
                    valueFormatter: "#",
                    valueLineColor: processColor("green"),
                    valueLinePart1Length: 0.5
                  }
                }
              ]
            }
          }
        })
      );
    } else if (this.props.patientList.message.length == undefined) {
      this.setState({
        score: "0"
      });
      let obj = [
        { value: 0, label: i18n.t("PATIENTS.BOOKED") },
        { value: 0, label: i18n.t("PATIENTS.CHECKED_IN") },
        { value: 0, label: i18n.t("PATIENTS.TRIAGE") },
        { value: 0, label: i18n.t("PATIENTS.CONSULTING") },
        { value: 0, label: i18n.t("PATIENTS.IN_PROCESS") },
        { value: 0, label: i18n.t("PATIENTS.COMPLETED") },
        { value: 0, label: i18n.t("PATIENTS.CLOSED") },
        { value: 0, label: i18n.t("PATIENTS.RE_SCHEDULED") },
        { value: 0, label: i18n.t("PATIENTS.CANCELLED") },
        { value: 0, label: i18n.t("PATIENTS.RE_CONSULTING") },
        { value: 0, label: i18n.t("PATIENTS.CONFIRM") }
      ];
      this.setState(
        update(this.state, {
          data: {
            $set: {
              dataSets: [
                {
                  values: obj,

                  label: "",
                  config: {
                    colors: [
                      processColor("#00a950"),
                      processColor(APP_PRIMARY_COLOR),
                      processColor("#58595b"),
                      processColor("#166a8f"),
                      processColor("#f67019"),
                      processColor("#8549ba"),
                      processColor("#fae83d"),
                      processColor("#d25ba6"),
                      processColor("#2f5f8f"),
                      processColor("#218080")
                    ],
                    valueTextSize: 12,
                    valueTextColor: processColor("white"),
                    sliceSpace: 5,
                    selectionShift: 13,
                    // xValuePosition: "OUTSIDE_SLICE",
                    // yValuePosition: "OUTSIDE_SLICE",
                    valueFormatter: "#",
                    valueLineColor: processColor("green"),
                    valueLinePart1Length: 0.5
                  }
                }
              ]
            }
          }
        })
      );
    }

    // }
    // componentWillUnmount() {
    // //  this.notificationOpenedListener();
    // // this.notificationListener();
    // }
    // createNotificationListeners=()=> {

    // /*
    // * Triggered when a particular notification has been received in foreground
    // * */
    // this.notificationListener = firebase.notifications().onNotification((notification) => {
    // const { title, body } = notification;
    // console.log(title+" body2="+body+" "+notification)
    // // alert(body)
    // const channelId = new firebase.notifications.Android.Channel("Default", "Default", firebase.notifications.Android.Importance.High);
    // firebase.notifications().android.createChannel(channelId);

    // let notification_to_be_displayed = new firebase.notifications.Notification({
    // data: notification.data,
    // sound: 'default',
    // show_in_foreground: true,
    // title: notification.title,
    // body: notification.body,
    // action:notification.action
    // });

    // //const action = new firebase.notifications.Android.Action('test_action', 'ic_launcher', 'cancel appointment');
    // //const remoteInput = new firebase.notifications.Android.RemoteInput('inputText')
    // //.setLabel('enter reason');

    // //Add the remote input to the action
    // //action.addRemoteInput(remoteInput);
    // //Add the action to the notification
    // //notification_to_be_displayed.android.addAction(action);
    // if(Platform.OS == "android") {
    // notification_to_be_displayed
    // .android.setPriority(firebase.notifications.Android.Priority.High)
    // .android.setChannelId("Default")
    // .android.setVibrate(1000);
    // }
    // notification.setSound("default");
    // firebase.notifications().displayNotification(notification_to_be_displayed);
    // });

    // /*
    // * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    // * */
    // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    // const { title, body } = notificationOpen.notification;
    // const data = notificationOpen.notification._data;

    // firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId)
    // console.log(title+" body3="+body);
    // });

    // /*
    // * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    // * */
    // // const notificationOpen = await firebase.notifications().getInitialNotification();
    // // if (notificationOpen) {
    // //     const { title, body } = notificationOpen.notification;
    // //     this.showAlert(title, body);
    // // }
    // const notificationOpen= firebase.notifications().getInitialNotification()
    // .then((notificationOpen) => {
    // if (notificationOpen) {
    // // App was opened by a notification
    // const notification= notificationOpen.notification;
    // const data = notificationOpen.notification._data;
    // firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId)
    // }
    // });

    if (this.state.open_consult_popup) {
      const [selectedPatient] = this.state.patient.filter(
        (each) =>
          each.healpha_id === this.state.hlp_id &&
          each.enc_id === this.state.enc_id
      );

      if (!selectedPatient) {
        return;
      }
      console.log("selectedversion", selectedPatient);
      this.openOverlay1(
        selectedPatient.person_phno,
        selectedPatient.BRANCH_ID,
        selectedPatient.uid.split("&")[2],
        selectedPatient.enc_id,
        selectedPatient.description,
        selectedPatient.uid,
        selectedPatient.template_id,
        selectedPatient.template_name,
        selectedPatient.APPOINTMENT_TYPE,
        selectedPatient.Name,
        selectedPatient.APPOINTMENT_STATUS,
        selectedPatient.age,
        selectedPatient.dob,
        selectedPatient.person_blood,
        selectedPatient.person_gender,
        selectedPatient.salutation,
        selectedPatient.person_phcode,
        selectedPatient.enc_version
      );
    }
  };
  // loadDeviceid = async(docid,deviceRegID) => {
  // let url = base_url + "push_notification/";

  // let response = await fetch(url, {
  // method: 'POST',
  // headers: {
  // 'Accept': 'application/json',
  // 'Content-Type': 'application/json'
  // },
  // body: JSON.stringify({
  // hlp:docid,
  // device_id:deviceRegID
  // })

  // })

  // .then((response) => response.json())
  // .then((response)=>{
  // // obj1 = JSON.parse(res._bodyText);
  // console.log("8",response);
  // // this.setState({refresh: true});
  // //return obj1;

  api1 = async () => {
    let docid = this.state.docid;
    await this.props.getPostList2({ doctor_id: docid });
    global.profile_image = this.props.postList.doc_details[0].profile_image;
    global.profile_image1 = this.props.postList.doc_details[0].profile_image;

    // alert()this.props.postList.doc_details[0].salutation+" "this.props.postList.doc_details[0].first_name+" "+this.props.postList.doc_details[0].last_name
    //this.props.postList.pract_details[0].op_branch_work_timings[0].standalone
    await this.setState({
      stand:
        this.props.postList.pract_details[0].op_branch_work_timings[0]
          .standalone
    });
    //  alert("hiwfefkuw"+JSON.stringify(this.props.postList.pract_details))
    // alert("jj"+this.state.stand)
  };
  signOut = async () => {
    AsyncStorage.clear();
    this.props.navigation.navigate("SignIn");
  };
  getuser = async () => {
    try {
      const tokenid = await AsyncStorage.getItem("userToken");

      if (tokenid !== null) {
        this.setState({ token: tokenid });
        global.token = this.state.token;
      }
      const docid = await AsyncStorage.getItem("doctorid");
      if (docid !== null) {
        this.setState({ docid: docid });
        global.doctor_id = this.state.docid;
      }
      const docname = await AsyncStorage.getItem("doctorname");
      if (docname !== null) {
        this.setState({ docname: docname });
        global.docname = this.state.docname;
      }
      const deviceRegID = await AsyncStorage.getItem("deviceRegID");
      global.deviceid = deviceRegID;
      //  alert(deviceRegID);
      this.loadDeviceid(docid, deviceRegID);
    } catch (error) {
      console.log("got error");
    }
  };
  temp_nav() {
    this.setState({
      visible: false
    });
    this.props.navigation.navigate("Consult", {
      hspname: this.state.prc_name,
      summary: this.state.tmp_hlpid,
      enc_id: this.state.tmp_enc,
      description: this.state.tmp_chief,
      plist: this.state.tmp_uid,
      template_id: this.state.temp_id,
      template_name: this.state.temp_name,
      appointment_type: this.state.app_type,
      name: this.state.tmp_username,
      profile_pic: global.profile_image,
      appointment_staus: this.state.tmp_status,
      age: this.state.tmp_age,
      dob: this.state.tmp_dob,
      blood: this.state.tmp_blood,
      gender: this.state.tmp_gender,
      branch: this.state.hospital_branch,
      videocall: this.state.videocall == "yes" ? "yes" : "no",
      screen: "dashboard",
      screen2: "consulting",
      aasha: this.state.aasha,
      enc_version: this.state.tmp_enc_version,
      virtual_clinic_branch: this.state.selected_appointment
        ?.virtual_clinic_branch
        ? this.state.selected_appointment
        : false
    });
  }
  temp_nav1(id, templatename) {
    this.setState({
      visible: false
    });
    this.props.navigation.navigate("Consult", {
      hspname: this.state.prc_name,
      summary: this.state.tmp_hlpid,
      enc_id: this.state.tmp_enc,
      description: this.state.tmp_chief,
      plist: this.state.tmp_uid,
      template_id: id,
      profile_pic: global.profile_image,
      template_name: templatename,
      appointment_type: this.state.app_type,
      age: this.state.tmp_age,
      dob: this.state.tmp_dob,
      blood: this.state.tmp_blood,
      gender: this.state.tmp_gender,
      name: this.state.tmp_username,
      appointment_staus: this.state.tmp_status,
      branch: this.state.hospital_branch,
      videocall: this.state.videocall == "yes" ? "yes" : "no",
      screen: "dashboard",
      screen2: "consulting",
      aasha: this.state.aasha,
      enc_version: this.state.tmp_enc_version,
      virtual_clinic_branch: this.state.selected_appointment
        ?.virtual_clinic_branch
        ? this.state.selected_appointment
        : false
    });
  }

  render() {
    let api_url = getApiUrl();
    let image_url = api_url + this.state.image;
    if (this.state.isVersionAlert) {
      console.log("123");
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
          {this.versionlink()}
          {/* <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} /> */}
        </View>
      );
    }
    const {
      postList,
      isFetching,
      patientList,
      isFetching1,
      isFetching17,
      templateList,
      applyList,
      isFetching19
    } = this.props;
    const uri1 = require("../../assets/images/doc.jpg");
    if (this.state.loading || this.props.isFetching || this.props.isFetching1) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    if (this.state.confirm_modal == true) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}>
          <Overlay isVisible={this.state.confirm_modal} height={265}>
            <ScrollView style={{ marginTop: 15 }}>
              <View>
                <Row>
                  <Col style={{ alignSelf: "center" }}>
                    <View style={{ flexDirection: "row", marginRight: 20 }}>
                      <Text style={{ textAlign: "center" }}>
                        <Text style={{ textTransform: "capitalize" }}>
                          {i18n.t("PATIENTS.DR")}
                          {global.doctor_name}
                        </Text>{" "}
                        {i18n.t("PATIENTS.CALL_PATIENT_TEXT")}{" "}
                        <Text style={{ textTransform: "capitalize" }}>
                          {this.state.p_salutation +
                            " " +
                            this.state.tmp_username}
                        </Text>{" "}
                        {i18n.t("PATIENTS.ON")}
                      </Text>
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <View style={{ flexDirection: "row", marginLeft: 35 }}>
                      <Text
                        style={{
                          marginLeft: "-15%",
                          fontSize: 21,
                          color: "#517fa4",
                          textDecorationLine: "underline"
                        }}
                        onPress={() => this.dialCall()}>
                        {this.state.p_phone}
                      </Text>
                      <TouchableOpacity
                        onPress={async () => {
                          const country_code = await getCountryCode();
                          Linking.openURL(
                            "https://api.whatsapp.com/send?phone=" +
                              // country_code +
                              this.state.person_phcode.split("+")[1] +
                              this.state.p_phone
                          );
                        }}>
                        <Image
                          style={{ height: 25, width: 25, marginLeft: 15 }}
                          source={require("../../assets/images/whatsapp.png")}
                        />
                      </TouchableOpacity>
                      {/* 10-01-2021 charitha not needed now because we go by healpha twilio call*/}
                      {/* {this.state.onlineusers1 &&
                        this.state.onlineusers1.map((item2) =>
                          item2.split('@')[1] == 'online' ? (
                            <TouchableOpacity
                              onPress={() => this.telemedicinevideocall()}>
                              <Icon
                                type="FontAwesome"
                                name="video-camera"
                                style={{
                                  fontSize: 25,
                                  color: 'green',
                                  marginLeft: 15,
                                }}
                              />
                            </TouchableOpacity>
                          ) : item2.split('@')[1] == 'offline' ? (
                            <TouchableOpacity
                              onPress={() => this.telemedicinevideocall1()}>
                              <Icon
                                type="FontAwesome"
                                name="video-camera"
                                style={{
                                  fontSize: 25,
                                  color: 'red',
                                  marginLeft: 15,
                                }}
                              />
                            </TouchableOpacity>
                          ) : null,
                        )} */}
                      <TouchableOpacity
                        onPress={() => this.telemedicinevideocall()}>
                        <Icon
                          type="FontAwesome"
                          name="video-camera"
                          style={{
                            fontSize: 25,
                            color: APP_PRIMARY_COLOR,
                            marginLeft: 15
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Col>
                </Row>
                <Text style={{ textAlign: "center" }}>
                  {i18n.t("PATIENTS.PATIENT_NOT_REACHABLE_TEXT")}
                </Text>
                <Row>
                  <Col>
                    <TextInput
                      allowFontScaling={false}
                      placeholder={i18n.t("PATIENTS.ENTER_REASON_TXT")}
                      // autoFocus='true'
                      placeholderTextColor={"#2D323C"}
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={this.state.reason}
                      style={styles.input}
                      onChangeText={(text) => this.reason(text)}
                    />
                    {this.state.valid && (
                      <Text style={{ fontSize: 12, color: "red" }}>
                        {i18n.t("PATIENTS.ENTER_REASON")}
                      </Text>
                    )}
                  </Col>
                </Row>
              </View>
            </ScrollView>
            {/* <Button
title="Go back"
onPress={() => this.closeOverlay()}
containerStyle={{alignSelf:'center'}}
buttonStyle={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20}}
/> */}
            <Row style={{ marginLeft: "-5%" }}>
              <Col>
                <Button
                  onPress={() => this.sendnotification()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: "center",
                    height: 30,
                    width: 70,
                    marginLeft: 10
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: "white",
                      alignItems: "center"
                    }}>
                    {i18n.t("PATIENTS.SEND")}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.connected()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: "center",
                    height: 30,
                    width: 70,
                    marginLeft: 10
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: "white",
                      alignItems: "center"
                    }}>
                    {i18n.t("PATIENTS.CONNECT")}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.closeOverlay1()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: "center",
                    height: 30,
                    width: 70,
                    marginLeft: 10
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: "white",
                      alignItems: "center"
                    }}>
                    {i18n.t("PATIENTS.BACK")}
                  </Text>
                </Button>
              </Col>
            </Row>
          </Overlay>
        </View>
      );
    }
    if (this.state.confirm_modal1 == true) {
      console.log("12345");
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}>
          {/* <Overlay isVisible={this.state.confirm_modal1} height={350} width={300}> */}
          <Overlay isVisible={this.state.confirm_modal1} height={260}>
            {/* <Text allowFontScaling={false}style={{fontSize:15,fontWeight:"bold",marginLeft:80}}>Select Template</Text> */}
            {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
            <ScrollView style={{ marginTop: 15 }}>
              <View>
                {/* <Row>
<Col style={{backgroundColor:"#dcdcdc",height:1}}></Col>
</Row>
<Row>
<Col style={{marginLeft:30,marginVertical:15}}>
<TouchableOpacity>
<Text allowFontScaling={false}>Default Template</Text>
</TouchableOpacity>
</Col>
</Row>
<Row>
<Col style={{backgroundColor:"#dcdcdc",height:1}}></Col>
</Row> */}
                <Row>
                  <Col style={{ alignSelf: "center" }}>
                    <View style={{ flexDirection: "row", marginRight: 20 }}>
                      <Text style={{ textAlign: "center" }}>
                        <Text style={{ textTransform: "capitalize" }}>
                          {i18n.t("PATIENTS.DR")}
                          {global.doctor_name}
                        </Text>{" "}
                        {i18n.t("PATIENTS.CALL_PATIENT_TEXT")}
                        <Text style={{ textTransform: "capitalize" }}>
                          {this.state.p_salutation +
                            " " +
                            this.state.tmp_username}
                        </Text>{" "}
                        {i18n.t("PATIENTS.ON")}{" "}
                      </Text>
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <View style={{ flexDirection: "row", marginLeft: 1 }}>
                      <Text
                        style={{
                          fontSize: 21,
                          color: "#517fa4",
                          textDecorationLine: "underline"
                        }}
                        onPress={() => this.dialCall()}>
                        {this.state.p_phone}
                      </Text>
                      <TouchableOpacity
                        onPress={async () => {
                          const country_code = await getCountryCode();
                          Linking.openURL(
                            "https://api.whatsapp.com/send?phone=" +
                              // country_code +
                              this.state.person_phcode.split("+")[1] +
                              this.state.p_phone
                          );
                        }}>
                        <Image
                          style={{ height: 25, width: 25, marginLeft: 5 }}
                          source={require("../../assets/images/whatsapp.png")}
                        />
                      </TouchableOpacity>
                      {/* {this.state.onlineusers1 &&
                        this.state.onlineusers1.map((item2) =>
                          item2.split('@')[1] == 'online' ? (
                            <TouchableOpacity
                              onPress={() => this.telemedicinevideocall2()}>
                              <Icon
                                type="FontAwesome"
                                name="video-camera"
                                style={{
                                  fontSize: 25,
                                  color: 'green',
                                  marginLeft: 10,
                                }}
                              />
                            </TouchableOpacity>
                          ) : item2.split('@')[1] == 'offline' ? (
                            <TouchableOpacity
                              onPress={() => this.telemedicinevideocall11()}>
                              <Icon
                                type="FontAwesome"
                                name="video-camera"
                                style={{
                                  fontSize: 25,
                                  color: 'red',
                                  marginLeft: 10,
                                }}
                              />
                            </TouchableOpacity>
                          ) : null,
                        )} */}
                      <TouchableOpacity
                        onPress={() => this.telemedicinevideocall2()}>
                        <Icon
                          type="FontAwesome"
                          name="video-camera"
                          style={{
                            fontSize: 25,
                            color: APP_PRIMARY_COLOR,
                            marginLeft: 10
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </Col>
                </Row>

                <Text style={{ textAlign: "center" }}>
                  {i18next.t("PATIENTS.TXT")}
                </Text>
                <Row>
                  <Col>
                    <TextInput
                      allowFontScaling={false}
                      placeholder={i18next.t("PATIENTS.ENTER_REASON_TXT")}
                      // autoFocus='true'
                      placeholderTextColor={"#2D323C"}
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={this.state.reason}
                      style={styles.input}
                      onChangeText={(text) => this.reason(text)}
                    />
                    {this.state.valid && (
                      <Text style={{ fontSize: 12, color: "red" }}>
                        {i18next.t("PATIENTS.ENTER_REASON")}
                      </Text>
                    )}
                  </Col>
                </Row>
              </View>
            </ScrollView>
            {/* <Button
title="Go back"
onPress={() => this.closeOverlay()}
containerStyle={{alignSelf:'center'}}
buttonStyle={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20}}
/> */}
            <Row style={{ marginLeft: -10 }}>
              <Col>
                <Button
                  onPress={() => this.sendnotification()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: "center",
                    height: 30,
                    width: 70,
                    marginLeft: 10
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: "white",
                      alignItems: "center"
                    }}>
                    {i18next.t("PATIENTS.SEND")}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.connected1()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: "center",
                    height: 30,
                    width: 70,
                    marginLeft: 10
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: "white",
                      alignItems: "center"
                    }}>
                    {i18next.t("PATIENTS.CONNECT")}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.closeOverlay1()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: "center",
                    height: 30,
                    width: 70,
                    marginLeft: 10
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: "white",
                      alignItems: "center"
                    }}>
                    {i18next.t("PATIENTS.BACK")}
                  </Text>
                </Button>
              </Col>
            </Row>
          </Overlay>
        </View>
      );
    }

    if (
      this.state.visible &&
      this.state.template_list != 2 &&
      this.state.template_list != 1 &&
      this.state.template_list != 0
    ) {
      if (this.state.template_list == "review") {
        if (this.state.flgValue == true) {
          this.props.navigation.navigate("Consult", {
            branch: this.state.hospital_branch,
            hspname: this.state.prc_name,
            summary: this.state.tmp_hlpid,
            enc_id: this.state.tmp_enc,
            description: this.state.tmp_chief,
            plist: this.state.tmp_uid,
            template_id: this.state.tmp_templateid,
            template_name: this.state.tmp_templatename,
            appointment_type: this.state.app_type,
            name: this.state.tmp_username,
            appointment_staus: this.state.tmp_status,
            profile_pic: global.profile_image,
            age: this.state.tmp_age,
            gender: this.state.tmp_gender,
            dob: this.state.tmp_dob,
            blood: this.state.tmp_blood,
            videocall: this.state.videocall == "yes" ? "yes" : "no",
            screen: "dashboard",
            screen2: "reconsulting",
            aasha: this.state.aasha,
            enc_version: this.state.tmp_enc_version,
            virtual_clinic_branch: this.state.selected_appointment
              ?.virtual_clinic_branch
              ? this.state.selected_appointment
              : false
          });
        }
      } else {
        return (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Overlay isVisible height={240}>
              <Text
                allowFontScaling={false}
                style={{ fontSize: 15, fontWeight: "bold", marginLeft: 50 }}>
                {i18n.t("PATIENTS.SELECT_TEMP")}
              </Text>
              {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
              <ScrollView style={{ marginTop: 15 }}>
                <View>
                  <Row>
                    <Col
                      style={{ backgroundColor: "#dcdcdc", height: 1 }}></Col>
                  </Row>
                  <Row>
                    <Col style={{ marginLeft: 30, marginVertical: 15 }}>
                      <TouchableOpacity onPress={() => this.temp_nav()}>
                        <Text allowFontScaling={false}>
                          {i18n.t("PATIENTS.SELECT_DEF")}
                        </Text>
                      </TouchableOpacity>
                    </Col>
                  </Row>

                  {this.state.template_list != undefined &&
                    this.state.template_list != "nodata" &&
                    this.state.template_list.map((item) => (
                      <View>
                        <Row>
                          <Col
                            style={{
                              backgroundColor: "#dcdcdc",
                              height: 1
                            }}></Col>
                        </Row>
                        <Row>
                          <Col style={{ marginLeft: 30, marginVertical: 15 }}>
                            <TouchableOpacity
                              onPress={() =>
                                this.temp_nav1(item.id, item.template_name)
                              }>
                              <Text allowFontScaling={false}>
                                {item.template_name}
                              </Text>
                            </TouchableOpacity>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            style={{
                              backgroundColor: "#dcdcdc",
                              height: 1
                            }}></Col>
                        </Row>
                      </View>
                    ))}
                  <Row>
                    <Col
                      style={{ backgroundColor: "#dcdcdc", height: 1 }}></Col>
                  </Row>
                </View>
              </ScrollView>
              {/* <Button
title="Go back"
onPress={() => this.closeOverlay()}
containerStyle={{alignSelf:'center'}}
buttonStyle={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20}}
/> */}
              <Button
                onPress={() => this.closeOverlay()}
                style={{
                  backgroundColor: APP_PRIMARY_COLOR,
                  justifyContent: "center",
                  height: 30,
                  width: 50,
                  marginLeft: 110
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: 12,
                    color: "white",
                    alignItems: "center"
                  }}>
                  {i18n.t("COMMON.CLOSE")}
                </Text>
              </Button>
            </Overlay>
          </View>
        );
      }
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={this.getData} />
        <Header style={{ backgroundColor: "white", height: 90 }}>
          <StatusBar
            backgroundColor={APP_PRIMARY_COLOR}
            barStyle={"dark-content"}
          />
          <Row>
            <Col style={{ height: 90, backgroundColor: "#517fa4" }}>
              <Row>
                <Col style={{ height: 50, backgroundColor: "white" }}>
                  <Image
                    source={require("../../assets/images/healphalogo.jpg")}
                    style={{
                      height: 25,
                      width: 120,
                      marginLeft: 50,
                      marginTop: 15
                    }}
                  />
                  <Row style={{ alignItems: "center" }}>
                    <Col size={20}>
                      <Image
                        source={HeAlpha}
                        style={{
                          height: wp(30),
                          width: wp(160),
                          marginLeft: wp(0),
                          paddingTop: wp(30)
                        }}
                      />
                    </Col>
                    <Col size={70}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginTop: 15,
                          color: "#517fa4",
                          fontWeight: "bold",
                          alignSelf: "flex-end",
                          paddingRight: 10,
                          textTransform: "capitalize"
                        }}>
                        {i18n.t("PATIENTS.DR")}
                        {global.doctor_name}
                      </Text>
                    </Col>
                    <Col size={10}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("Settings")
                        }>
                        <Thumbnail
                          style={{
                            borderRadius: 63,
                            borderWidth: 1,
                            borderColor: "black",
                            alignSelf: "flex-end",
                            marginTop: 10
                          }}
                          small
                          source={global.profile_image}
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: -15 }}>
                <Col size={70} style={{ marginTop: -3 }}>
                  {this.state.cross ? (
                    <TextInput
                      allowFontScaling={false}
                      placeholder={i18n.t(
                        "PATIENTS.SEARCH_PATIENTS_PLACEHOLDER"
                      )}
                      autoFocus={true}
                      placeholderTextColor={"#2D323C"}
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={this.state.value}
                      style={styles.input}
                      onChangeText={(text) => this.searchFilterFunction(text)}
                    />
                  ) : null}
                  {this.state.mag ? (
                    <Picker
                      allowFontScaling={false}
                      style={{ height: 40, marginTop: 15, color: "white" }}
                      iosIcon={
                        <Icon2
                          style={{ top: -5 }}
                          name="sort-down"
                          color="#000000"
                        />
                      }
                      selectedValue={this.state.hospital_branch}
                      onValueChange={this.onValueChangehospital.bind(this)}>
                      {this.props.postList
                        ? this.props.postList.pract_details.map(
                            (item, index) => (
                              <Picker.Item
                                label={item.branch_name}
                                value={item.branch_id}
                                key={index}
                              />
                            )
                          )
                        : null}
                    </Picker>
                  ) : null}
                </Col>
                <Col
                  size={30}
                  style={{
                    alignItems: "flex-end",
                    marginTop: 11,
                    marginRight: 5
                  }}>
                  {this.state.mag ? (
                    <TouchableOpacity
                      onPress={this.search}
                      hitSlop={{
                        left: 50,
                        right: 50
                      }}>
                      <Icon
                        style={{
                          fontSize: 30,
                          marginTop: 5,
                          marginRight: 5,
                          color: "#555b57",
                          backgroundColor: "white",
                          borderRadius: 30
                        }}
                        type="Ionicons"
                        name="search"
                      />
                    </TouchableOpacity>
                  ) : null}
                  {this.state.cross ? (
                    <TouchableOpacity
                      onPress={this.search}
                      hitSlop={{
                        left: 50,
                        right: 50
                      }}>
                      <Icon
                        style={{
                          fontSize: 30,
                          marginTop: 5,
                          marginRight: 5,
                          color: "#555b57",
                          backgroundColor: "white",
                          borderRadius: 30
                        }}
                        type="FontAwesome"
                        name="times"
                      />
                    </TouchableOpacity>
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <Row style={{ marginTop: -30 }}>
            {/* <Col size={65} style={{alignItems:"flex-end",marginLeft:10,marginRight:0}}> */}
            {/* <Thumbnail square source={require("../../assets/images/cal.png")} style={{height:30,width:30,marginTop:8}} /> */}
            {/* </Col> */}

            <Col
              size={35}
              style={{
                alignItems: "flex-start",
                marginHorizontal: 0,
                marginTop: 31
              }}>
              {Platform.OS === "android" ? (
                <DatePicker
                  allowFontScaling={false}
                  date={new Date(this.state.chosenDate)}
                  customStyles={{
                    dateIcon: {
                      height: 20,
                      width: 20,
                      marginLeft: 10
                    },
                    dateInput: {
                      height: 15,
                      //    marginHorizontal:10,
                      borderColor: "white"
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  minDate={new Date(1995, 1, 1)}
                  // maxDate={new Date(2020, 12, 12)}
                  locale={"en"}
                  format="DD-MMM-YYYY"
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"spinner"}
                  showIcon={true}
                  style={{ height: 60 }}
                  // placeHolderText="Select date"
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={this.setDate}
                  disabled={false}
                />
              ) : (
                // <DatePicker
                //   allowFontScaling={false}
                //   date={new Date(this.state.chosenDate)}
                //   customStyles={{
                //     dateIcon: {
                //       height: 20,
                //       width: 20,
                //       marginLeft: 10,
                //     },
                //     dateInput: {
                //       height: 15,
                //       //    marginHorizontal:10,
                //       borderColor: 'white',
                //     },
                //     // ... You can check the source to find the other keys.
                //   }}
                //   minDate={new Date(1995, 1, 1)}
                //   // maxDate={new Date(2020, 12, 12)}
                //   locale={'en'}
                //   format="DD-MMM-YYYY"
                //   timeZoneOffsetInMinutes={undefined}
                //   modalTransparent={false}
                //   animationType={'fade'}
                //   androidMode={'spinner'}
                //   showIcon={true}
                //   style={{height: 60}}
                //   // placeHolderText="Select date"
                //   textStyle={{color: 'green'}}
                //   placeHolderTextStyle={{color: '#d3d3d3'}}
                //   onDateChange={this.setDate}
                //   disabled={false}
                // />
                <DateTimePicker
                  style={{
                    width: 320,
                    backgroundColor: "white",
                    height: 60,
                    marginLeft: -190,
                    marginTop: -5
                  }}
                  testID="dateTimePicker"
                  accessibilityLabel="dateTimePicker"
                  value={new Date(this.state.chosenDate)}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={this.setDate}
                  locale={"en"}
                />
              )}
            </Col>

            <Col
              size={30}
              style={{
                alignItems: "flex-end",
                marginHorizontal: 0,
                marginTop: 31
              }}>
              {this.state.stand != "0" && (
                <Button
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    padding: 10,
                    height: 28,
                    width: 180,
                    marginRight: 10,
                    marginTop: 10
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("Confirmation", {
                      price: "",
                      mail: "",
                      dtime: "",
                      doctorid: this.state.docid,
                      doctorname: this.state.docname,
                      slottime: this.state.sa_slot_timing,
                      city: this.props.postList.doc_details[0].city,
                      branchname: this.state.prc_name,
                      apptype: "",
                      endtime: "",
                      getEncounter: "",
                      data: this.state.docid + " " + this.state.docname,
                      //data:"655 Tony Stark",
                      freebusydata:
                        this.state.sa_branch_id +
                        "," +
                        this.state.sa_visit_hours_time +
                        "," +
                        this.state.sa_slot_timing +
                        "," +
                        this.state.prc_name +
                        "," +
                        this.state.sa_CITY +
                        "," +
                        this.state.prc_id,
                      //freebusydata:"INDTGAAA000059-1,00:00 to 23:59,5,PIMS HOSPITAL,Hyderabad,INDTGAAA000059",
                      specialization: this.state.sa_specialization,
                      imagepath: global.profile_image1,
                      branchid: this.state.sa_branch_id
                    })
                  }>
                  <Text style={{ color: "white", marginLeft: 20 }}>
                    {i18n.t("PATIENTS.BOOK_APPOINTMENT")}
                  </Text>
                </Button>
              )}
            </Col>
          </Row>
          <Row style={{ height: 300, marginTop: -20 }}>
            <Col>
              <PieChart
                style={styles.chart}
                logEnabled={true}
                chartBackgroundColor={processColor("white")}
                chartDescription={this.state.description}
                data={this.state.data}
                legend={this.state.legend}
                highlights={this.state.highlights}
                entryLabelColor={processColor("green")}
                entryLabelTextSize={20}
                drawEntryLabels={false}
                rotationEnabled={false}
                rotationAngle={45}
                // usePercentValues={true}
                styledCenterText={{
                  text: String(this.state.score),
                  color: processColor("pink"),
                  size: 30
                }}
                centerTextRadiusPercent={100}
                holeRadius={40}
                holeColor={processColor("#f0f0f0")}
                transparentCircleRadius={45}
                transparentCircleColor={processColor("#f0f0f088")}
                maxAngle={360}
                onSelect={this.handleSelect.bind(this)}
                // onChange={(event) => console.log(event.nativeEvent)}
              />
            </Col>
          </Row>
          {this.state.combo ? (
            <Row>
              {this.props.patientList.message == 0 ? (
                <Col style={{ alignItems: "center", marginTop: 20 }}>
                  <Text
                    allowFontScaling={false}
                    style={{ fontSize: 30, fontWeight: "bold" }}>
                    {i18n.t("PATIENTS.NO_APPOINTMENT")}
                  </Text>
                </Col>
              ) : (
                <Col>
                  <FlatList
                    style={styles.contentList}
                    columnWrapperStyle={styles.listContainer}
                    data={this.state.patient}
                    keyExtractor={(item) => {
                      return item.id;
                    }}
                    renderItem={({ item }) => {
                      console.log(item, "Helllllllllllllllllllll");
                      return (
                        <View style={styles.card}>
                          <Row>
                            <Col>
                              {/* <TouchableOpacity onPress={()=>{(item.APPOINTMENT_STATUS=='checkedin')?this.temp(item.BRANCH_ID,item.SUMMARY.split(" ")[2],item.enc_id,item.description,item.uid,
item.template_id,item.template_name,item.APPOINTMENT_TYPE,item.Name,item.APPOINTMENT_STATUS):null||(item.APPOINTMENT_STATUS=='consulting')?this.temp1(item.SUMMARY.split(" ")[2],item.enc_id,item.description,item.uid,
item.template_id,item.template_name,item.APPOINTMENT_TYPE,item.Name,item.APPOINTMENT_STATUS):null}}></TouchableOpacity> */}

                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    flgValue: true,
                                    selected_appointment: item
                                  });
                                  let patient = item;
                                  patient.hlpid = item.healpha_id;
                                  global.patient = patient;
                                  (item.APPOINTMENT_TYPE.toLowerCase() ==
                                    "telemedicine" ||
                                    item.APPOINTMENT_TYPE.toLowerCase() ==
                                      "homecare") &&
                                  (item.APPOINTMENT_STATUS.toLowerCase() ==
                                    "Confirm" ||
                                    item.APPOINTMENT_STATUS.toLowerCase() ==
                                      "appointment rescheduled" ||
                                    item.APPOINTMENT_STATUS.toLowerCase() ==
                                      "Triage" ||
                                    item.APPOINTMENT_STATUS.toLowerCase() ==
                                      "triage" ||
                                    item.APPOINTMENT_STATUS.toLowerCase() ==
                                      "confirm" ||
                                    item.APPOINTMENT_STATUS.toLowerCase() ==
                                      "checkedin")
                                    ? this.openOverlay1(
                                        item.person_phno,
                                        item.BRANCH_ID,
                                        item.uid.split("&")[2],
                                        item.enc_id,
                                        item.description,
                                        item.uid,
                                        item.template_id,
                                        item.template_name,
                                        item.APPOINTMENT_TYPE,
                                        item.Name,
                                        item.APPOINTMENT_STATUS,
                                        item.age,
                                        item.dob,
                                        item.person_blood,
                                        item.person_gender,
                                        item.salutation,
                                        item.person_phcode,
                                        item.enc_version
                                      )
                                    : (item.APPOINTMENT_TYPE.toLowerCase() ==
                                        "telemedicine" ||
                                        item.APPOINTMENT_TYPE.toLowerCase() ==
                                          "homecare") &&
                                      (item.APPOINTMENT_STATUS.toLowerCase() ==
                                        "consulting" ||
                                        item.APPOINTMENT_STATUS.toLowerCase() ==
                                          "reconsulting")
                                    ? this.openOverlay1(
                                        item.person_phno,
                                        item.BRANCH_ID,
                                        item.uid.split("&")[2],
                                        item.enc_id,
                                        item.description,
                                        item.uid,
                                        item.template_id,
                                        item.template_name,
                                        item.APPOINTMENT_TYPE,
                                        item.Name,
                                        item.APPOINTMENT_STATUS,
                                        item.age,
                                        item.dob,
                                        item.person_blood,
                                        item.person_gender,
                                        item.salutation,
                                        item.person_phcode,
                                        item.enc_version
                                      )
                                    : // ((item.APPOINTMENT_STATUS.toLowerCase()=='consulting')||
                                    item.APPOINTMENT_STATUS.toLowerCase() ==
                                        "appointment booked" &&
                                      item.APPOINTMENT_STATUS.toLowerCase() !=
                                        "cancelled" &&
                                      item.APPOINTMENT_STATUS.toLowerCase() !=
                                        "closed" &&
                                      this.state.stand != "0" &&
                                      item.temp_person == "No"
                                    ? this.CreateNewEncounter(
                                        item.uid.split("&")[2],
                                        item.uid.split("&")[0],
                                        item.BRANCH_ID,
                                        item.BRANCH_ID.split("-")[0],
                                        item.APPOINTMENT_TYPE,
                                        item.uid.split("&")[0] +
                                          "." +
                                          item.uid.split("&")[1] +
                                          "." +
                                          item.uid.split("&")[2] +
                                          "." +
                                          item.uid.split("&")[3],
                                        item.uid
                                      )
                                    : item.APPOINTMENT_STATUS.toLowerCase() !=
                                        "cancelled" &&
                                      item.APPOINTMENT_STATUS.toLowerCase() !=
                                        "closed" &&
                                      this.state.stand != "0" &&
                                      item.temp_person == "Yes"
                                    ? this.props.navigation.navigate(
                                        "PersonAppointment",
                                        {
                                          first_name: item.Name.split(" ")[0],
                                          last_name: item.Name.split(" ")[1],
                                          uid_temp: item.uid,
                                          temp_to_perm: "Yes",
                                          phone_no: item.PHONE,
                                          email: item.EMAIL,
                                          branchid: item.BRANCH_ID
                                        }
                                      )
                                    : item.APPOINTMENT_STATUS.toLowerCase() ==
                                      "consulting"
                                    ? this.props.navigation.navigate(
                                        "Consult",
                                        {
                                          branch: item.BRANCH_ID,
                                          hspname: this.state.prc_name,
                                          summary: item.uid.split("&")[2],
                                          enc_id: item.enc_id,
                                          description: item.description,
                                          plist: item.uid,
                                          template_id: item.template_id,
                                          template_name: item.template_name,
                                          appointment_type:
                                            item.APPOINTMENT_TYPE,
                                          name: item.Name,
                                          appointment_staus:
                                            item.APPOINTMENT_STATUS,
                                          profile_pic: global.profile_image,
                                          age: item.age,
                                          gender: item.person_gender,
                                          // checkstatus:"consulting",
                                          dob: item.dob,
                                          blood: item.person_blood,
                                          videocall:
                                            this.state.videocall == "yes"
                                              ? "yes"
                                              : "no",
                                          screen: "dashboard",
                                          screen2: "consulting",
                                          aasha: this.state.aasha,
                                          enc_version: item.enc_version,
                                          virtual_clinic_branch: this.state
                                            .selected_appointment
                                            ?.virtual_clinic_branch
                                            ? this.state.selected_appointment
                                            : false
                                        }
                                      )
                                    : item.APPOINTMENT_STATUS.toLowerCase() ==
                                      "reconsulting"
                                    ? this.props.navigation.navigate(
                                        "Consult",
                                        {
                                          branch: item.BRANCH_ID,
                                          hspname: this.state.prc_name,
                                          summary: item.uid.split("&")[2],
                                          enc_id: item.enc_id,
                                          description: item.description,
                                          plist: item.uid,
                                          template_id: item.template_id,
                                          template_name: item.template_name,
                                          appointment_type:
                                            item.APPOINTMENT_TYPE,
                                          name: item.Name,
                                          appointment_staus:
                                            item.APPOINTMENT_STATUS,
                                          profile_pic: global.profile_image,
                                          age: item.age,
                                          gender: item.person_gender,
                                          // checkstatus:"consulting",
                                          dob: item.dob,
                                          blood: item.person_blood,
                                          videocall:
                                            this.state.videocall == "yes"
                                              ? "yes"
                                              : "no",
                                          screen: "dashboard",
                                          screen2: "reconsulting",
                                          aasha: this.state.aasha,
                                          enc_version: item.enc_version,
                                          virtual_clinic_branch: this.state
                                            .selected_appointment
                                            ?.virtual_clinic_branch
                                            ? this.state.selected_appointment
                                            : false
                                        }
                                      )
                                    : item.APPOINTMENT_STATUS.toLowerCase() ==
                                        "checkedin" ||
                                      item.APPOINTMENT_STATUS.toLowerCase() ==
                                        "Triage" ||
                                      item.APPOINTMENT_STATUS.toLowerCase() ==
                                        "triage"
                                    ? this.temp(
                                        item.BRANCH_ID,
                                        item.uid.split("&")[2],
                                        item.enc_id,
                                        item.description,
                                        item.uid,
                                        item.template_id,
                                        item.template_name,
                                        item.APPOINTMENT_TYPE,
                                        item.Name,
                                        item.APPOINTMENT_STATUS,
                                        item.age,
                                        item.dob,
                                        item.person_blood,
                                        item.person_gender,
                                        item.enc_version
                                      )
                                    : item.APPOINTMENT_STATUS.toLowerCase() ==
                                        "completed" ||
                                      item.APPOINTMENT_STATUS.toLowerCase() ===
                                        "undergoing" ||
                                      item.APPOINTMENT_STATUS.toLowerCase() ===
                                        "undergoung" ||
                                      item.APPOINTMENT_STATUS.toLowerCase() ===
                                        "closed"
                                    ? item.pdflink != ""
                                      ? this.props.navigation.navigate(
                                          "ViewPdf",
                                          { link: item.pdflink }
                                        )
                                      : alert("Prescription Not Available")
                                    : null;
                                }}>
                                <Row>
                                  <Col size={20} style={{ marginTop: 10 }}>
                                    <Text
                                      allowFontScaling={false}
                                      style={{ fontSize: 12 }}>
                                      {moment(item.date_start).format(
                                        "hh:mm A"
                                      )}
                                    </Text>
                                  </Col>
                                  <Col size={55} style={{ marginLeft: 30 }}>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        textTransform: "capitalize"
                                      }}>
                                      {item.salutation + " " + item.Name}
                                    </Text>

                                    <View>
                                      {item.virtual_clinic_branch === null ||
                                      item.virtual_clinic_branch === "" ||
                                      item.virtual_clinic_branch ===
                                        undefined ? null : (
                                        <Text
                                          style={{
                                            color: "#09B75A",
                                            backgroundColor: "#E3FFEE",
                                            marginLeft: 200,
                                            width: 40,
                                            fontSize: 13,
                                            marginTop: -20
                                          }}>
                                          {console.log(
                                            "enterd the virtual flag",
                                            item.salutation +
                                              " " +
                                              item.Name +
                                              " " +
                                              item.virtual_clinic_branch
                                          )}
                                          virtual
                                        </Text>
                                      )}
                                    </View>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        fontSize: 12,
                                        color: "#675e5e",
                                        textTransform: "capitalize"
                                      }}>
                                      {item.APPOINTMENT_TYPE} |{" "}
                                      {item.APPOINTMENT_STATUS.toLowerCase() ===
                                      "checkedin"
                                        ? "Checked In"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "consulting"
                                        ? "Consulting"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "undergoing"
                                        ? "In Process"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "undergoung"
                                        ? "In Process"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ==
                                          "appointment booked"
                                        ? "Booked"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "completed"
                                        ? "Completed"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "cancelled"
                                        ? "Cancelled"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "appointment rescheduled"
                                        ? "Re-Scheduled"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "reconsulting"
                                        ? "Reconsulting"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "Confirm"
                                        ? "Confirm"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "confirm"
                                        ? "Confirm"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "triage"
                                        ? "Triage"
                                        : item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "closed"
                                        ? "Closed"
                                        : item.APPOINTMENT_STATUS}
                                    </Text>
                                  </Col>
                                  <Col size={20} style={{ marginRight: -30 }}>
                                    <Row>
                                      <Col>
                                        {(item.APPOINTMENT_STATUS.toLowerCase() ===
                                          "completed" ||
                                          item.APPOINTMENT_STATUS.toLowerCase() ===
                                            "undergoing" ||
                                          item.APPOINTMENT_STATUS.toLowerCase() ===
                                            "undergoung" ||
                                          item.APPOINTMENT_STATUS.toLowerCase() ===
                                            "closed") && (
                                          <Icon
                                            type="FontAwesome"
                                            name="file-pdf-o"
                                            style={{
                                              fontSize: 20,
                                              color: APP_PRIMARY_COLOR,
                                              marginTop: 8
                                            }}
                                          />
                                        )}
                                      </Col>
                                      <Col>
                                        {/* {item.APPOINTMENT_STATUS.toLowerCase()!="cancelled"&&item.APPOINTMENT_STATUS.toLowerCase()!="closed"&&this.state.stand!="0"&&<TouchableOpacity style={{marginLeft:5}} onPress={()=>this.props.navigation.navigate('Service',{email:this.props.postList.doc_details[0].email})}> */}
                                        {item.APPOINTMENT_STATUS.toLowerCase() !=
                                          "cancelled" &&
                                          item.APPOINTMENT_STATUS.toLowerCase() !=
                                            "closed" &&
                                          this.state.stand != "0" &&
                                          item.temp_person == "No" && (
                                            <TouchableOpacity
                                              style={{
                                                height: 40,
                                                width: 40,
                                                marginLeft: 15
                                              }}
                                              onPress={() =>
                                                this.props.navigation.navigate(
                                                  "Service",
                                                  {
                                                    email:
                                                      this.props.postList
                                                        .doc_details[0].email,
                                                    uname:
                                                      this.props.postList
                                                        .doc_details[0]
                                                        .salutation +
                                                      " " +
                                                      this.props.postList
                                                        .doc_details[0]
                                                        .first_name +
                                                      " " +
                                                      this.props.postList
                                                        .doc_details[0]
                                                        .last_name,
                                                    uid: item.uid,
                                                    app_type:
                                                      item.APPOINTMENT_TYPE,
                                                    b_id: item.BRANCH_ID,
                                                    hlpd: item.uid.split("&")[2]
                                                  }
                                                )
                                              }>
                                              {/* <Icon type="FontAwesome" name="sign-out" style={{fontSize:20,color:APP_PRIMARY_COLOR,marginTop:10}} /> */}
                                              <Image
                                                source={require("../../assets/images/bill3.png")}
                                                style={{
                                                  height: 30,
                                                  width: 30,
                                                  marginTop: 5
                                                }}
                                              />
                                            </TouchableOpacity>
                                          )}

                                        {item.APPOINTMENT_STATUS.toLowerCase() !=
                                          "cancelled" &&
                                          item.APPOINTMENT_STATUS.toLowerCase() !=
                                            "closed" &&
                                          this.state.stand != "0" &&
                                          item.temp_person == "Yes" && (
                                            <TouchableOpacity
                                              style={{ marginLeft: 5 }}
                                              onPress={() =>
                                                this.props.navigation.navigate(
                                                  "PersonAppointment",
                                                  {
                                                    first_name:
                                                      item.Name.split(" ")[0],
                                                    last_name:
                                                      item.Name.split(" ")[1],
                                                    uid_temp: item.uid,
                                                    temp_to_perm: "Yes",
                                                    phone_no: item.PHONE,
                                                    email: item.EMAIL,
                                                    branchid: item.BRANCH_ID
                                                  }
                                                )
                                              }>
                                              <Image
                                                source={require("../../assets/images/person_add.png")}
                                                style={{
                                                  height: 25,
                                                  width: 25,
                                                  marginTop: 5
                                                }}
                                              />
                                            </TouchableOpacity>
                                          )}
                                        {/* <Image source={require('../../assets/images/bill3.png')} style={{height:25, width: 25,marginTop:5}}/> */}
                                      </Col>

                                      <Col>{item.uid.split("&")[2] == ""}</Col>
                                    </Row>
                                  </Col>
                                  <Col
                                    size={5}
                                    style={{
                                      justifyContent: "center",
                                      marginLeft: 55
                                    }}>
                                    {/*{this.state.onlineusers1 &&
                                      this.state.onlineusers1.map(
                                        (item2) =>
                                          item2.split('@')[0] ==
                                            item.uid.split('&')[2] &&
                                          (item2.split('@')[1] == 'online' &&
                                          (item.APPOINTMENT_TYPE.toLowerCase() ===
                                            'telemedicine' ||
                                            item.APPOINTMENT_TYPE.toLowerCase() ===
                                              'homecare') &&
                                          (item.APPOINTMENT_STATUS.toLowerCase() ===
                                            'confirm' ||
                                            item.APPOINTMENT_STATUS.toLowerCase() ===
                                              'consulting' ||
                                            item.APPOINTMENT_STATUS.toLowerCase() ===
                                              'reconsulting' ||
                                            item.APPOINTMENT_STATUS.toLowerCase() ===
                                              'triage' ||
                                            item.APPOINTMENT_STATUS.toLowerCase() ===
                                              'checkedin') ? (
                                            <Icon
                                              type="FontAwesome"
                                              name="circle"
                                              style={{
                                                fontSize: 20,
                                                color: 'green',
                                                marginLeft: -10,
                                              }}
                                            />
                                          ) : (
                                            (item.APPOINTMENT_TYPE.toLowerCase() ===
                                              'telemedicine' ||
                                              item.APPOINTMENT_TYPE.toLowerCase() ===
                                                'homecare') &&
                                            (item.APPOINTMENT_STATUS.toLowerCase() ===
                                              'confirm' ||
                                              item.APPOINTMENT_STATUS.toLowerCase() ===
                                                'consulting' ||
                                              item.APPOINTMENT_STATUS.toLowerCase() ===
                                                'reconsulting' ||
                                              item.APPOINTMENT_STATUS.toLowerCase() ===
                                                'triage' ||
                                              item.APPOINTMENT_STATUS.toLowerCase() ===
                                                'checkedin') && (
                                              <Icon
                                                type="FontAwesome"
                                                name="circle"
                                                style={{
                                                  fontSize: 20,
                                                  color: 'red',
                                                  marginLeft: -10,
                                                }}
                                              />
                                            )
                                          )),
                                      )}*/}
                                  </Col>
                                </Row>
                              </TouchableOpacity>
                            </Col>
                          </Row>
                        </View>
                      );
                    }}
                  />
                </Col>
              )}
            </Row>
          ) : null}
          {/* </View> */}
          {/* <View>
<ScrollView></ScrollView>
</View> */}

          {/* <View style={{flex: 1}}>
<Text allowFontScaling={false}>hi</Text>
</View>
<View style={{flex: 1}}>
<Text allowFontScaling={false}>hi</Text>
</View>
<View style={{flex: 1}}>
<Text allowFontScaling={false}>hi</Text>
</View> */}
          {/* </ScrollView> */}
        </ScrollView>
        {/* <Footer>
<FooterTab>
<Button style={{backgroundColor:APP_PRIMARY_COLOR}}  onPress={()=>this.props.navigation.navigate('Report',{docid:this.state.docid,branch_id:this.state.hospital_branch=""?this.state.hospital_branch:this.props.postList.pract_details[0].branch_id})}>
<Icon style={{color:"white"}} type="FontAwesome" name="file" />
</Button>
<Button style={{backgroundColor:APP_PRIMARY_COLOR}}
onPress={()=>this.props.navigation.navigate('OldPatient',{docid:this.state.docid,branch_id:this.state.hospital_branch=""?this.state.hospital_branch:this.props.postList.pract_details[0].branch_id,profile_pic:this.state.profile_pic})}>
<Icon style={{color:"white"}} type="FontAwesome" name="list-ul"/>
</Button> */}
        {/* <Button style={{backgroundColor:APP_PRIMARY_COLOR}} onPress={()=>this.props.navigation.navigate('Settings')}>
<Icon style={{color:"white"}} type="FontAwesome" name="wheelchair"/>
</Button> */}
        {/* <Button style={{backgroundColor:APP_PRIMARY_COLOR}} onPress={()=>this.props.navigation.navigate('Example')}>
<Icon style={{color:"white"}}  type="FontAwesome" name="qrcode" />
</Button> */}
        {/* </FooterTab>
</Footer>*/}
      </SafeAreaView>
    );
  }
}

// const mapStateToProps = state => ({
//   pageList: state.pageList.pageList,
// });
const mapStateToProps = (state) => ({
  postList: state.postList.postList,
  teleList: state.teleList.teleList,
  isFetching: state.postList.isFetching,
  patientList: state.patientList.patientList,
  isFetching1: state.patientList.isFetching1,
  templateList: state.templateList.templateList,
  isFetching17: state.patientList.isFetching17,
  applyList: state.applyList.applyList,
  isFetching19: state.patientList.isFetching19
});

// const ActionCreators = Object.assign(
//   {},
//   pageActions,
// );
// const mapDispatchToProps = dispatch => ({
//   // actions: bindActionCreators(ActionCreators, dispatch),
// });
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {
    marginTop: 15,
    borderColor: "#345D7E",
    borderWidth: 1,
    height: 40,
    backgroundColor: "white",
    marginBottom: 10,
    color: "#4F575C",
    paddingHorizontal: 15
  },
  card: {
    flex: 1,
    shadowColor: "#00000021",
    // shadowOffset: {
    //   width: 0,
    //   height: 6
    // },
    marginHorizontal: 10,
    marginVertical: 5,
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 5,
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    borderRadius: 8
  },
  nameCol: {
    flex: 1
  },
  end: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 270
  },
  time: {
    marginLeft: 5,
    fontWeight: "400",
    color: "#666",
    fontSize: 12,
    paddingTop: 5
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "400",
    color: "#222",
    fontSize: 15
  },
  chart: {
    flex: 1,
    marginTop: 0
    // height:100
    // marginVertical:100
  }
});
export default connect(mapStateToProps, {
  getPostList2,
  getPatientList,
  getTemplateList,
  getApplyList,
  getTeleList,
  TwilioConnection
})(HomeScreen);
