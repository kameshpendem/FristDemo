import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Alert,
  PermissionsAndroid,
  Platform,
  BackHandler,
  RefreshControl,
  DeviceEventEmitter,
  Image
} from "react-native";
import {
  Row,
  Col,
  Button,
  Container,
  Content,
  Toast,
  Icon,
  Left,
  Right,
  Body,
  Title,
  Header,
  Card
} from "native-base";
import Autocomplete from "react-native-autocomplete-input";
import { connect } from "react-redux";
import { Overlay } from "react-native-elements";
import moment from "moment";
import { withTranslation } from "react-i18next";

//  redux state Actions
import { getOldList } from "../../../redux/actions/oldpatient_action";
import {
  selectMicroTemplate,
  fetchMicroTemplatesuccess
} from "../../../redux/actions/template_action";

import { fetchPatientSuccess } from "../../../redux/actions/appointment_action";

//  theme colors
import {
  APP_PRIMARY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR
} from "../../../themes/variable";

// APi service
// import API from '../../../services/Api';

// image components
import HistoryImage from "../ImageComponents/HistoryImage";
import CalendarBlack from "../ImageComponents/CalendarBlack";
import CovidMonitoring from "../ImageComponents/CovidMonitoring";
import PatientEdit from "../ImageComponents/PatientEdit";
import PatientPdf from "../ImageComponents/PatientPdf";
import WhatsApp from "../ImageComponents/WhatsApp";
import VideoCamera from "../ImageComponents/VideoCamera";

// components
import PatientSearchCard from "./PatientSearchCard";

//  styles
import styles from "./PatientsStyles";
import getBaseUrl, { getDevelopmentUrl, getApiUrl } from "../../../config/Config";
import { TwilioConnection } from "../../../redux/actions/TwilioActions";
import AsyncStorage from "@react-native-community/async-storage";
import { NativeToast, NativeToastTop } from "../../app/common/Toaster";
import back_arrow from "../../../assets/images/back_arrow.png";
import i18n from "../../../../i18n";

// constants

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

// let otherUsername = null;

// const sendMessage = async (message) => {
//   if (otherUsername) {
//     message.otherUsername = otherUsername;
//   }
//   await ws.send(JSON.stringify(message));
// };

class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docid: this.props.navigation.state.params.docid,
      branch_id: this.props.navigation.state.params.branch_id,
      searchText: "",
      loading: true,
      profile_pic: this.props.navigation.state.params.profile_pic,
      value: "",
      timeline: [],
      personTimeLine: [],
      onlineusers1: [],
      videocall: "",
      timelenedata: [],
      refreshing: false,
      virtual: this.props.navigation.state.params.patient,
      open_consult_popup: this.props.navigation.state.params.open_consult_popup
        ? this.props.navigation.state.params.open_consult_popup
        : false,
      hlpid: this.props.navigation.state.params.hlp_id
        ? this.props.navigation.state.params.hlp_id
        : "select",
      encid: this.props.navigation.state.params.enc_id
        ? this.props.navigation.state.params.enc_id
        : "select",
      enc_id: this.props.navigation.state.params.enc_id
        ? this.props.navigation.state.params.enc_id
        : "select",
      init: true
    };
    this.arrayHolder = [];
    this.handleBackPress = this.handleBackPress.bind(this);
    this.getLatestPatientsData = this.getLatestPatientsData.bind(this);
    this.init();
    DeviceEventEmitter.addListener("eventPatientsStartConsultation", (e) => {
      {
        e.selectTemplate == "true"
          ? this.connectVideoCall("yes")
          : this.connectVideoCall("no");
      }
    });
  }

  getLatestPatientsData = async () => {
    const { t } = this.props;
    try {
      const payload = {
        docid: this.state.docid,
        token: global.token,
        hlpid: "",
        encid: "",
        branch: this.state.branch_id,
        key: "",
        date: ""
      };
      await this.props.getOldList(payload);
      this.setState({
        //personTimeLine: this.props.oldList.message.reverse(),
        personTimeLine: this.props.oldList.message
      });
    } catch (error) {
      Toast.show({
        text:
          (error && error.message) || t("PATIENTS.LATEST_PATIENT_DATA_ERROR"),
        type: "danger",
        duration: 3000
      });
    }
  };

  init = async () => {
    console.log("twiliopatient");
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

    await this.getLatestPatientsData();

    if (!this.state.open_consult_popup) {
      return;
    }

    await this.findTimelineData(this.state.hlpid);

    const [item] = this.state.timelenedata;

    if (!item) {
      return;
    }

    await this.props.getOldList({
      docid: this.state.docid,
      token: global.token,
      hlpid: item.hlpid,
      encid: this.state.enc_id,
      branch: this.state.branch_id,
      key: item.hlpid,
      date: ""
    });

    if (!this.props.oldList.message || this.props.oldList.message.length <= 0) {
      return;
    }

    const [patient] = this.props.oldList.message.filter(
      (each) => each.enc_id === this.state.enc_id
    );
    alert("123");
    this.openOverlay(
      patient.phone_no,
      patient.hlpid,
      patient.enc_id,
      patient.PRACTICE_NAME,
      patient.template_name,
      patient.template_id,
      patient.branch_id,
      patient.gender,
      patient.uid,
      patient.age,
      moment(patient.dob).format("YYYY-MM-DD"),
      patient.blood_group,
      patient.middle_name != "" && patient.middle_name != null
        ? patient.salutation +
            "." +
            patient.first_name +
            " " +
            patient.middle_name +
            " " +
            patient.last_name
        : patient.salutation +
            "." +
            patient.first_name +
            " " +
            patient.last_name,
      patient.hlpid,
      this.state.profile_pic,
      patient.salutation,
      patient.encounter_type,
      patient.phone_code,
      patient.enc_version
    );
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

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

  componentDidUpdate = () => {
    // const wsdata = ws;
    // if (ws == null || wsdata._subscriptions.length == 0) {
    //   ws = new WebSocket('wss://stun.concent.in/websocket');
    // }
    // ws.onmessage = (msg) => {
    //   const data = JSON.parse(msg.data);
    //   switch (data.type) {
    //     case 'online_users':
    //       this.setState({onlineusers1: data.onlineusers});
    //       break;
    //     case 'close':
    //       this.setState({onlineusers1: data.onlineusers});
    //       break;
    //     default:
    //       break;
    //   }
    // };
  };

  dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${this.state.p_phone}`;
    } else {
      phoneNumber = `telprompt:${this.state.p_phone}`;
    }

    Linking.openURL(phoneNumber);
  };

  openOverlay = (
    phone_no,
    hlpid,
    enc_id,
    PRACTICE_NAME,
    template_name,
    template_id,
    branch_id,
    gender,
    uid,
    age,
    dob,
    blood_group,
    name,
    hlpid1,
    profile_pic,
    salutation,
    encounter_type,
    phone_code,
    enc_version
  ) => {
    console.log("openoverlay", enc_version);
    // let obt = [];
    // obt.push(hlpid);
    // sendMessage({
    //   type: 'online_users',
    //   patientList: obt,
    // });
    this.setState({
      confirm_modal: true,
      p_phone: phone_no,
      hlpid: hlpid,
      enc_id: enc_id,
      hspname: PRACTICE_NAME,
      template_name: template_name,
      template_id: template_id,
      branch: branch_id,
      gender: gender,
      plist: uid,
      age: age,
      dob: dob,
      blood: blood_group,
      name: name,
      summary: hlpid1,
      profile_pic: profile_pic,
      p_salutation: salutation,
      encounter_type: encounter_type,
      phone_code: phone_code,
      enc_version: enc_version
    });
  };

  closeOverlay = async () => {
    if (this.state.open_consult_popup) {
      this.setState({
        confirm_modal: false
      });
      this.handleBackPress();
      return;
    }

    if (this.state.reason != "") {
      this.setState({ confirm_modal: false });
    } else {
      this.setState({
        confirm_modal: false,
        reason: true
      });
    }
    this.state.reason = "";
  };
  reason = (text) => {
    // alert(text)
    this.setState({
      reason: text,
      valid: false
    });
  };
  teleMedicineVideoCall = () => {
    // this.connectVideoCall('yes');
    this.heAlphaCall();
  };
  heAlphaCall = async () => {
    console.log("this.state.hlpid", this.state.hlpid);
    await AsyncStorage.setItem(
      "twilioEncid",
      this.state.enc_id + "_" + this.state.enc_version
    );
    await AsyncStorage.setItem("twilioPerHlpid", this.state.hlpid);
    await AsyncStorage.setItem("twilioPerName", this.state.name.split(".")[1]);
    await AsyncStorage.setItem(
      "selectTemplate",
      this.state.confirm_modal ? "true" : "false"
    );
    await AsyncStorage.setItem("consult", "false");
    await AsyncStorage.setItem("fromPage", "patients");
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
  sendNotification = async () => {
    const deviceToken = await AsyncStorage.getItem("jwt_token");
    console.log("poiuy", deviceToken);
    const { t } = this.props;
    if (this.state.reason) {
      let url = getBaseUrl() + "notify_patient/";
      let ocv = JSON.stringify({
        hlp: this.state.hlpid,
        doc: global.doctor_id,
        token: global.token,
        node_token: deviceToken,
        content: this.state.reason
      });
      console.log("urllllllllllllllllllllllll", url);
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
          Toast.show({
            text: t("PATIENTS.NOTIFICATION_SUCCESS"),
            type: "success",
            duration: 3000
          });
          return response.message;
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          Toast.show({
            text: (error && error.message) || t("PATIENTS.NOTIFICATION_ERROR"),
            type: "danger",
            duration: 3000
          });
        });
    } else {
      alert("Please enter a reason");
    }
  };

  connectVideoCall = async (videocall) => {
    this.setState({
      confirm_modal: false
    });
    this.props.navigation.navigate("Consult", {
      hlpid: this.state.hlpid,
      enc_id: this.state.enc_id,
      hspname: this.state.hspname,
      template_name: this.state.template_name,
      template_id: this.state.template_id,
      branch: this.state.branch_id,
      gender: this.state.gender,
      plist: this.state.plist,
      age: this.state.age,
      dob: this.state.dob,
      blood: this.state.blood,
      name: this.state.name,
      summary: this.state.summary,
      profile_pic: this.state.profile_pic,
      videocall: videocall == "yes" ? "yes" : "no",
      appointment_type: this.state.encounter_type,
      screen: "timelene",
      enc_version: this.state.enc_version
    });
  };

  componentDidMount = async () => {
    const { t } = this.props;
    try {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]).then((granted) => {
        Object.entries(granted).map(([key, value]) => {
          console.log(key, value);
        });
      });
    } catch (err) {
      Toast.show({
        text: (error && error.message) || t("PATIENTS.PERMISSION_ERROR"),
        type: "danger",
        duration: 3000
      });
    }

    // ws.onmessage = (msg) => {
    //   const data = JSON.parse(msg.data);
    //   switch (data.type) {
    //     case 'online_users':
    //       this.setState({onlineusers1: data.onlineusers});
    //       break;
    //     case 'close':
    //       this.setState({onlineusers1: data.onlineusers});
    //       break;
    //     default:
    //       break;
    //   }
    // };
    this.setState({ loading: false });
  };

  getPatientData = async (key, hlpid, encid) => {
    const { t } = this.props;
    console.log("encid", encid);
    console.log("payload 3", {
      docid: this.state.docid,
      token: global.token,
      hlpid: hlpid,
      encid: encid,
      branch: this.state.branch_id,
      key: key,
      date: ""
    });
    try {
      await this.props.getOldList({
        docid: this.state.docid,
        token: global.token,
        hlpid: hlpid,
        encid: encid,
        branch: this.state.branch_id,
        key: key,
        date: ""
      });
      if (this.props.oldList.message == 3) {
        Alert.alert(t("PATIENTS.NO_OLD_ENCOUNTER_TEXT"), "", [
          {
            text: t("COMMON.OK"),
            onPress: () => this.props.navigation.navigate("LandingPage")
          }
        ]);
      } else {
        this.setState({
          personTimeLine: this.props.oldList.message.reverse()
        });
      }
      this.setState({ loading: false });
      this.setState({ timelenedata: [] });
    } catch (error) {
      Toast.show({
        text: (error && error.message) || t("PATIENTS.PATIENT_HISTORY_DATA"),
        type: "danger",
        duration: 3000
      });
    }
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getLatestPatientsData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  renderFooter = () => {
    return (
      <View>
        {this.state.timeline.length > 0 && <ActivityIndicator size="large" />}
      </View>
    );
  };

  findTimelineData = async (searchText) => {
    const { t } = this.props;
    if (!searchText) {
      this.setState({ timelenedata: [] });
      this.getLatestPatientsData();
    } else if (searchText.length >= 3) {
      let url = getBaseUrl() + "docapp_timeline_search/";
      let ob = JSON.stringify({
        token: global.token,
        doc_id: global.doctor_id,
        key: searchText
      });

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: ob
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) {
            this.setState({ timelenedata: response.message });
          } else {
            return [];
          }
        })
        .catch((error) => {
          Toast.show({
            text: (error && error.message) || t("PATIENTS.SEARCH_ERROR"),
            type: "danger",
            duration: 3000
          });
        });
    } else {
      this.setState({ timelenedata: [] });
    }
  };

  renderHandleSearch = (text) => {
    this.setState(
      {
        searchText: text
      },
      () => this.findTimelineData(text)
    );
  };

  getPatientsDetails = (item) => {
    // console.log('item', item);
    this.setState(
      {
        searchText:
          item.middle_name == null
            ? item.first_name + " " + item.middle_name + " " + item.last_name
            : item.first_name + " " + item.last_name,
        loading: true,
        salutation: item.salutation,
        first_name: item.first_name,
        last_name: item.last_name
      },
      () => {
        global.search_text = this.state.searchText;
        global.hlpid = item.hlpid;
        this.getPatientData(this.state.searchText, item.hlpid, "null");
      }
    );
  };

  renderStatus = (item) => {
    const { t } = this.props;

    return item.encounter_status.toLowerCase() === "checkedin"
      ? t("PATIENTS.CHECKED_IN")
      : item.encounter_status.toLowerCase() === "consulting"
      ? t("PATIENTS.CONSULTING")
      : item.encounter_status.toLowerCase() === "undergoing"
      ? t("PATIENTS.IN_PROCESS")
      : item.encounter_status.toLowerCase() === "undergoung"
      ? t("PATIENTS.IN_PROCESS")
      : item.encounter_status.toLowerCase() === "appointment booked"
      ? t("PATIENTS.BOOKED")
      : item.encounter_status.toLowerCase() === "completed"
      ? t("PATIENTS.COMPLETED")
      : item.encounter_status.toLowerCase() === "cancelled"
      ? t("PATIENTS.CANCELLED")
      : item.encounter_status.toLowerCase() === "Cancelled"
      ? t("PATIENTS.CANCELLED")
      : item.encounter_status.toLowerCase() === "appointment recheduled"
      ? t("PATIENTS.RE_SCHEDULED")
      : item.encounter_status.toLowerCase() === "Appointment Rescheduled"
      ? t("PATIENTS.RE_SCHEDULED")
      : item.encounter_status.toLowerCase() === "reconsulting"
      ? t("PATIENTS.RE_CONSULTING")
      : item.encounter_status.toLowerCase() === "triage"
      ? t("PATIENTS.TRIAGE")
      : item.encounter_status.toLowerCase() === "Confirm"
      ? t("PATIENTS.CONFIRM")
      : item.encounter_status.toLowerCase() === "confirm"
      ? t("PATIENTS.CONFIRM")
      : item.encounter_status.toLowerCase() === "closed"
      ? t("PATIENTS.CLOSED")
      : item.encounter_status.toLowerCase() === "Closed"
      ? t("PATIENTS.CLOSED")
      : null;
  };

  navigationToOldPatientDetails = (item) => {
    // if (this.renderStatus(item).toLocaleLowerCase() !== 'closed') {
    this.props.navigation.navigate("OldPatientDetails", {
      Id: item.id,
      schedule_date: item.schedule_date,
      enc_id: item.enc_id,
      hlpid: item.hlpid,
      branch_id: item.branch_id,
      encounterdate: item.schedule_date,
      encounter_type: item.encounter_status
    });
    // } else {
    //   return;
    // }
  };

  selectTemplateExist = async (val, item) => {
    await selectMicroTemplate(val)
      .then((res) => {
        if (res.template) {
          this.props.navigation.navigate("Consultation", {
            templateId: val,
            edit: true
          });
          this.props.fetchMicroTemplatesuccess(res.template);
        }
      })
      .catch((res) => {
        // NativeToast({text: res.message, type: 'danger'});
        console.log(res, "error");
      });
  };

  navigateToEdit = (item) => {
    global.hlpid = item.hlpid;
    global.branch_id = item.branch_id;
    global.search_text = this.state.searchText;
    if (item.appointment_id === null) {
      console.log("item nulll");

      // Alert.alert();

      Toast.show({
        text: "No appointment id found",
        type: "warning",
        buttonText: "Okay",
        duration: 5000,
        style: { marginBottom: 60 }
      });
      // // NativeToast({text: 'No appointment id found', type: 'warning'});
    } else {
      this.props.navigation.navigate("PatientCard", {
        virtualBranch: item?.virtual_clinic_branch,
        appointmentId: item?.appointment_id,
        edit: true
      });
    }

    // this.props.fetchPatientSuccess(item);

    // this.selectTemplateExist(item.template_id, item);
    // item.encounter_type == 'telemedicine' || item.encounter_type == 'homecare'
    //   ? this.openOverlay(
    //       item.phone_no,
    //       item.hlpid,
    //       item.enc_id,
    //       item.PRACTICE_NAME,
    //       item.template_name,
    //       item.template_id,
    //       item.branch_id,
    //       item.gender,
    //       item.uid,
    //       item.age,
    //       moment(item.dob).format('YYYY-MM-DD'),
    //       item.blood_group,
    //       item.middle_name != '' && item.middle_name != null
    //         ? item.salutation +
    //             '.' +
    //             item.first_name +
    //             ' ' +
    //             item.middle_name +
    //             ' ' +
    //             item.last_name
    //         : item.salutation + '.' + item.first_name + ' ' + item.last_name,
    //       item.hlpid,
    //       this.state.profile_pic,
    //       item.salutation,
    //       item.encounter_type,
    //       item.phone_code,
    //       item.version
    //     )
    //   : this.props.navigation.navigate('Consult', {
    //       hlpid: item.hlpid,
    //       enc_id: item.enc_id,
    //       hspname: item.PRACTICE_NAME,
    //       template_name: item.template_name,
    //       template_id: item.template_id,
    //       branch: item.branch_id,
    //       gender: item.gender,
    //       plist: item.uid,
    //       age: item.age,
    //       dob: moment(item.dob).format('YYYY-MM-DD'),
    //       blood: item.blood_group,
    //       name:
    //         item.middle_name != '' && item.middle_name != null
    //           ? item.salutation +
    //             '.' +
    //             item.first_name +
    //             ' ' +
    //             item.middle_name +
    //             ' ' +
    //             item.last_name
    //           : item.salutation + '.' + item.first_name + ' ' + item.last_name,
    //       summary: item.hlpid,
    //       profile_pic: this.state.profile_pic,
    //       videocall: this.state.videocall == 'yes' ? 'yes' : 'no',
    //       appointment_type: item.encounter_type,
    //       screen: 'timelene',
    //       enc_version:item.version,
    //       virtual_flag:item.virtual_clinic_branch

    //     });
  };

  navigateToCovidMonitoringSection = (hlpid, enc_id, patient) => {
    const { params } = this.props?.navigation?.state;
    const { docid, branch_id, doc_name } = params;
    const { t } = this.props;

    //  COMMENTED FOR FEATURE REFERENCE AND IT IT NAVIGATE TO OLD COVID MONITORING SCREEN
    // this.props.navigation.navigate('Covid', {
    //   hlpd: hlpid,
    //   enc_id: enc_id,
    // });
    if (patient.encounter_status.toLowerCase() === "closed") {
      if (patient.report_file_path) {
        this.props.navigation.navigate("ViewPdf", {
          link: `${getDevelopmentUrl()}/${patient.report_file_path.slice(5)}`,
          title: t("PROFILE.REPORT")
        });
      } else {
        Toast.show({
          text: t("PROFILE.REPORT_LINK"),
          type: "warning",
          duration: 3000
        });
      }
    } else {
      if (patient.added_date.length > 0) {
        this.props.navigation.navigate("CovidMonitoringPatientView", {
          token: global.token,
          doctor_id: docid,
          doctor_name: doc_name,
          selected_doctor_id: docid,
          status: patient.encounter_status,
          patient: patient,
          initialPage: 0
        });
      } else {
        Toast.show({
          text: t("COVID_MONITORING.INITIAL_ASSESSMENT_NOT_AVAILABLE"),
          type: "danger",
          duration: 3000
        });
      }
    }
  };

  renderPatientCard = ({ item }) => {
    const { t } = this.props;

    let p = moment(item.schedule_date).format("YYYY-MMM-DD").split("-");
    let fullname = item.middle_name
      ? item.salutation +
        " " +
        item.first_name.charAt(0).toUpperCase() +
        item.first_name.slice(1) +
        " " +
        item.middle_name.charAt(0).toUpperCase() +
        item.middle_name.slice(1) +
        " " +
        item.last_name.charAt(0).toUpperCase() +
        item.last_name.slice(1)
      : item.salutation +
        " " +
        item.first_name.charAt(0).toUpperCase() +
        item.first_name.slice(1) +
        " " +
        " " +
        item.last_name.charAt(0).toUpperCase() +
        item.last_name.slice(1);
    return (
      <View style={[styles.eventBox]}>
        <View style={styles.flex}>
          {/* Date section start */}
          <View style={styles.flexDirectionRow}>
            <CalendarBlack 
            testID="calenderIcon"
            accessibilityLabel="calenderIcon"/>
            <Text style={styles.dateText}
            testID="dateText"
            accessibilityLabel="dateText">
              {p[2]} {p[1]} {p[0]}
            </Text>
          </View>

          {/* details card start */}
          <View style={styles.detailsCardView}>
            {/* Name and status section start */}

            <TouchableOpacity
              onPress={() => this.navigationToOldPatientDetails(item)}
              style={styles.flex}>
              <View style={styles.nameStatusView}>
                <View>
                  <Text style={styles.nameStyles}
                  testID={fullname+"text"}
                  accessibilityLabel={fullname+"text"}>{fullname}</Text>
                </View>
                <View style={[styles.flex, styles.itemsRightEnd]}>
                  <Text
                    style={[
                      styles.statusStyles,
                      this.renderStatus(item).toLocaleLowerCase() === "closed"
                        ? styles.closeStatusStyles
                        : styles.remainingStatusStyles
                    ]}
                    testID={this.renderStatus(item)+"text"}
                    accessibilityLabel={this.renderStatus(item)+"text"}>
                    {this.renderStatus(item)}
                  </Text>
                </View>
              </View>
              <View style={styles.idView}>
                <Text style={styles.idTextStyles}
                testID={item.encounterCode+"text"}
                accessibilityLabel={item.encounterCode+"text"}>
                  {t("PATIENTS.ID")} {item.encounterCode}
                </Text>
              </View>

              {/* buttons section start */}
              {/* NOT REMOVED COMMENTED CODE FOR FUTURE REFERENCES */}
              <View style={styles.buttonsSectionView}>
                {/* {item.encounter_status.toLowerCase() != 'closed' && ( */}
                <View style={styles.flex}>
                  <Button
                   testID="historyButton"
                   accessibilityLabel="historyButton"
                    rounded
                    androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                    style={styles.buttonStyles}
                    onPress={() =>
                      this.props.navigation.navigate("Vitals2", {
                        hlpid: item.hlpid,
                        enc: item.encounterCode
                      })
                    }>
                    <HistoryImage 
                     testID="historyImage"
                     accessibilityLabel="historyImage"/>
                    <Text style={styles.buttonText}
                     testID="historyText"
                     accessibilityLabel="historyText">
                      {t("PATIENTS.HISTORY")}
                    </Text>
                  </Button>
                </View>
                {/* )} */}

                {/* {item.encounter_status.toLowerCase() != 'closed' && ( */}

                {item.encounter_type == "homecare" && (
                  <View style={styles.flex}>
                    <Button
                      rounded
                      androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                      style={styles.buttonStyles}
                      onPress={() =>
                        this.navigateToCovidMonitoringSection(
                          item.hlpid,
                          item.encounterCode,
                          item
                        )
                      }
                      testID="covidButton"
                      accessibilityLabel="covidButton">
                      <CovidMonitoring 
                       testID="covidMonitoringIcon"
                       accessibilityLabel="covidMonitoringIcon"/>
                      <Text style={styles.buttonText}
                      testID="covidText"
                      accessibilityLabel="covidText">
                        {t("PATIENTS.COVID")}
                      </Text>
                    </Button>
                  </View>
                )}
                {/* <View style={styles.flex}>
                  <Button
                    rounded
                    androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                    style={styles.buttonStyles}
                    onPress={() =>
                      this.navigateToCovidMonitoringSection(
                        item.hlpid,
                        item.encounterCode,
                        item,
                      )
                    }>
                    <CovidMonitoring />
                    <Text style={styles.buttonText}>{t('PATIENTS.COVID')}</Text>
                  </Button>
                </View> */}
                {/* )} */}

                {/* {item.pdflink != null && item.pdflink != '' && ( */}
                <View style={styles.flex}>
                  <Button
                   testID="prescriptionButton"
                   accessibilityLabel="prescriptionButton"
                    rounded
                    androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                    style={styles.buttonStyles}
                    onPress={() => {
                      console.log("baseurl",item?.pdflink)
                      item?.pdflink
                        ? this.props.navigation.navigate("ViewPdfScreen", {
                            link: getApiUrl() +'/'+ item?.pdflink,
                            screenname: "Prescription"
                          })
                        : NativeToast({
                            text: i18n.t("COMMON.NO_PDF"),
                            type: "warning"
                          });
                    }}>
                    <PatientPdf 
                    testID="patientPdf"
                    accessibilityLabel="patientPdf"/>
                    <Text style={styles.buttonText}
                    testID="prescriptionText"
                    accessibilityLabel="prescriptionText">
                      {t("COVID_MONITORING.PRESCRIPTION")}
                    </Text>
                  </Button>
                </View>
                {/* )} */}

                {(item.encounter_status.toLowerCase() == "undergoing" ||
                  item.encounter_status.toLowerCase() == "undergoung" ||
                  item.encounter_status.toLowerCase() == "reconsulting" ||
                  item.encounter_status.toLowerCase() == "completed") && (
                  <View style={styles.flex}>
                    <Button
                     testID="editButton"
                     accessibilityLabel="editButton"
                      rounded
                      androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                      style={styles.buttonStyles}
                      onPress={() => this.navigateToEdit(item)}>
                      <PatientEdit style={{ marginTop: 2 }} 
                          testID="editTouch"
                          accessibilityLabel="editTouch"/>
                      <Text style={styles.buttonText}
                      testID="editText"
                      accessibilityLabel="editText">
                        {t("PATIENTS.EDIT")}
                      </Text>
                    </Button>
                  </View>
                )}
              </View>

              {/* button sections end */}
            </TouchableOpacity>
            {/* Name and status section end */}
          </View>

          {/* details card end */}
        </View>
      </View>
    );
  };

  renderAutoSearchResult = ({ item }) => {
    return (
      <PatientSearchCard
        item={item}
        getPatientsDetails={() => this.getPatientsDetails(item)}
      />
    );
  };

  offlineAlert() {
    const { t } = this.props;
    Alert.alert(t("PATIENTS.PATIENT_OFF_LINE_TEXT"), "", [
      {
        text: t("COMMON.OK"),
        onPress: () => {
          return;
        }
      }
    ]);
  }

  onRefresh = () => {
    this.setState({ refreshing: true, searchText: "" });
    this.getLatestPatientsData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  //  render method
  render() {
    //  connect pop Up start
    const { searchText } = this.state;
    const { t } = this.props;

    if (this.state.confirm_modal == true) {
      return (
        <View style={styles.confirmModalCenter}>
          <Overlay isVisible={this.state.confirm_modal} height={260}>
            <ScrollView style={styles.scrollViewMarginTop}>
              <View>
                {/*TEXT INFO AND MESSAGE SECTION START */}
                <View style={styles.callPatientView}>
                  <Text style={[styles.textAlignCenter, styles.textTransform]}
                  testID={global.doctor_name+"callPatientText"}
                  accessibilityLabel={global.doctor_name+"callPatientText"}>
                    {t("PATIENTS.DR")}
                    {global.doctor_name}
                    {t("PATIENTS.CALL_PATIENT_TEXT")}{" "}
                    <Text style={styles.textTransform}
                    testID={this.state.name+"onText"}
                    accessibilityLabel={this.state.name+"onText"}>
                      {this.state.p_salutation + " " + this.state.name}
                    </Text>{" "}
                    {t("PATIENTS.ON")}
                  </Text>
                </View>
                {/*TEXT INFO AND MESSAGE SECTION END */}

                {/* PATIENT NUMBER AND CALL OPTION SECTION START*/}
                <View style={[styles.itemsCenter, styles.flexDirection]}>
                  <Text
                  testID={this.state.p_phone+"text"}
                  accessibilityLabel={this.state.p_phone+"text"}
                    style={styles.phoneNumberStyles}
                    onPress={() => this.dialCall()}>
                    {this.state.p_phone}
                  </Text>
                  <TouchableOpacity
                   testID="whatsappTouch"
                   accessibilityLabel="whatsappTouch"
                    onPress={() => {
                      Linking.openURL(
                        "https://api.whatsapp.com/send?phone=" +
                          this.state.phone_code.split("+")[1] +
                          this.state.p_phone
                      );
                    }}>
                    <WhatsApp
                     testID="whatsappIcon"
                     accessibilityLabel="whatsappIcon"
                      height={25}
                      width={25}
                      style={{ marginLeft: 15 }}
                    />
                  </TouchableOpacity>
                  {/* {this.state.onlineusers1 &&
                    this.state.onlineusers1.map((item2) =>
                      item2.split('@')[1] == 'online' ? (
                        <TouchableOpacity
                          onPress={() => this.teleMedicineVideoCall()}>
                          <VideoCamera />
                        </TouchableOpacity>
                      ) : item2.split('@')[1] == 'offline' ? (
                        <TouchableOpacity onPress={() => this.offlineAlert()}>
                          <VideoCamera />
                        </TouchableOpacity>
                      ) : null,
                    )} */}
                  <TouchableOpacity
                   testID="cameraTouch"
                   accessibilityLabel="cameraTouch"
                    onPress={() => this.teleMedicineVideoCall()}>
                    <Icon
                    testID="cameraIcon"
                    accessibilityLabel="cameraIcon"
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

                {/* PATIENT NUMBER AND CALL OPTION SECTION END*/}

                <Text style={styles.textAlignCenter}
                testID="notReachableText"
                accessibilityLabel="notReachableText">
                  {t("PATIENTS.PATIENT_NOT_REACHABLE_TEXT")}
                </Text>
                <TextInput
                testID="enterReasonTextInput"
                accessibilityLabel="enterReasonTextInput"
                  allowFontScaling={false}
                  placeholder={t("PATIENTS.ENTER_REASON")}
                  returnKeyType="done"
                  autoCapitalize="none"
                  value={this.state.reason}
                  style={styles.input}
                  onChangeText={(text) => this.reason(text)}
                />
                {this.state.valid && (
                  <Text style={styles.errorMessageStyles}
                  testID="enterReasonText"
                  accessibilityLabel="enterReasonText">
                    {t("PATIENTS.ENTER_REASON")}
                  </Text>
                )}
              </View>
            </ScrollView>
            <Row>
              <Col>
                <Button
                 testID="sendButton"
                 accessibilityLabel="sendButton"
                  onPress={() => this.sendNotification()}
                  style={styles.popUpButtonStyles}>
                  <Text allowFontScaling={false} style={styles.popUpTextColor}
                   testID="sendText"
                   accessibilityLabel="sendText">
                    {t("PATIENTS.SEND")}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                 testID="connectButton"
                 accessibilityLabel="connectButton"
                  onPress={() => this.connectVideoCall()}
                  style={styles.popUpButtonStyles}>
                  <Text allowFontScaling={false} style={styles.popUpTextColor}
                   testID="connectText"
                   accessibilityLabel="connectText">
                    {t("PATIENTS.CONNECT")}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.closeOverlay()}
                  style={styles.popUpButtonStyles}
                  testID="backButton"
                  accessibilityLabel="backButton">
                  <Text allowFontScaling={false} style={styles.popUpTextColor}
                  testID="backText"
                  accessibilityLabel="backText">
                    {t("PATIENTS.BACK")}
                  </Text>
                </Button>
              </Col>
            </Row>
          </Overlay>
        </View>
      );
    }

    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <Container style={styles.containerStyles}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <Content>
            <View>
              <Autocomplete
              testID="searchPatientsHereText"
              accessibilityLabel="searchPatientsHereText"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.autocompleteContainer}
                inputContainerStyle={styles.autoInputContainerStyles}
                listContainerStyle={styles.listContainerStyles}
                listStyle={styles.listStyles}
                data={
                  this.state.timelenedata.length > 0
                    ? this.state.timelenedata
                    : []
                }
                defaultValue={searchText}
                onChangeText={(text) => this.renderHandleSearch(text)}
                placeholder={t("PATIENTS.SEARCH_PATIENTS_PLACEHOLDER")}
                renderItem={({ item }) => this.renderAutoSearchResult({ item })}
              />
            </View>

            {/* render patients  start */}
            <FlatList
              style={styles.contentList}
              columnWrapperStyle={styles.listContainer}
              data={this.state.personTimeLine}
              renderItem={({ item }, index) => this.renderPatientCard({ item })}
            />
            {/* render patient end */}
          </Content>
        </ScrollView>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  oldList: state.oldList.oldList,
  isFetching15: state.postList.isFetching15
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMicroTemplatesuccess: (data) =>
      dispatch(fetchMicroTemplatesuccess(data)),
    TwilioConnection: (data) => dispatch(TwilioConnection(data)),
    getOldList: (data) => dispatch(getOldList(data)),
    fetchPatientSuccess: (data) => dispatch(fetchPatientSuccess(data))
  };
};

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(withTranslation()(Patients));
export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
    //   {
    //   fetchMicroTemplatesuccess,
    //   TwilioConnection,
    //   getOldList,
    //   fetchPatientSuccess,
    // }
  )(Patients)
);
