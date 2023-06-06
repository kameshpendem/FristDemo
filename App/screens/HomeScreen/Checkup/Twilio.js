import React, { Component, createRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  DeviceEventEmitter,
  Image,
  Alert,
  TextInput,
  ScrollView
} from "react-native";
import {
  TwilioVideoLocalView, // to get local view
  TwilioVideoParticipantView, //to get participant view
  TwilioVideo
} from "react-native-twilio-video-webrtc";
// make sure you install vector icons and its dependencies
import MIcon from "react-native-vector-icons/MaterialIcons";
import normalize from "react-native-normalize";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import getBaseUrl, { getInstanceType } from "../../../config/Config";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

// styles
import TStyles from "./TwilioStyles";

// images
import Stethoscope from "../../../assets/images/stethoscope.png";
import close from "../../../assets/images/close.png";
import Search from "../../../assets/images/search_patients.png";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_LIGHT_BLUE_COLOR,
  DEFAULT_LIGHT_GREEN_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_RED_COLOR,
  GUIDELINE_BACKGROUND_COLOR,
  FONT_FAMILY,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_INVERSE_COLOR,
  DEFAULT_INVERSE_LIGHT,
  DEFAULT_BLACK_COLOR,
  HIGH_RISK_COLOR,
  STATUS_OFFLINE
} from "../../../themes/variable";
import CloseIcon from "../ImageComponents/CloseIcon";
import { Thumbnail, Footer, Button } from "native-base";
import { Card, Divider } from "react-native-elements";
import Modal from "react-native-modal";
// Redux actions

import { TwilioConnection } from "../../../redux/actions/TwilioActions";
import {
  selectMicroTemplate,
  fetchMicroTemplatesuccess,
  storeTemplateId,
  getMasterTemplates
} from "../../../redux/actions/template_action";
import { NativeToast } from "../../app/common/Toaster";
import { Left, Right } from "native-base";
import i18n from "../../../../i18n";
import {
  getAllVirtualClinicUsers,
  sendNotificationToVirtualClinicUsers
} from "../../../services/MyPracticeService";
import { withComponentStateCache } from "react-component-state-cache";
import { RandomValues } from "../../../redux/actions/random_action";
import {healphaCallEventEmitter} from '../MyPractice/Constants';

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
export async function GetAllPermissions() {
  // it will ask the permission for user
  try {
    // if (Platform.OS === "android") {
    const userResponse = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]);
    return userResponse;
    // }
  } catch (err) {
    console.log(err);
  }
  return null;
}
async function getApiHeaders() {
  const token = await AsyncStorage.getItem("jwt_token");
  return {
    Authorization: "Bearer" + " " + token
  };
}
let audioTrackDict = {};
let audioTracksList = {};
class Twilio extends Component {
  constructor(props) {
    super(props);
    this.templateRef = createRef();
    this.state = {
      isAudioEnabled: true,
      isVideoEnabled: true,
      isButtonDisplay: true,
      status: "disconnected",
      participants: new Map(),
      videoTracks: new Map(),
      audioTracks: new Map(),
      participantList: new Map(),
      videotrack1: [],
      track: true,
      roomName: "",
      token: "",
      client_name: global.doctor_name.replace(/ +/g, " "),
      client_id: global.doctor_id,
      floating_flag: false,
      videoTracksList: [],
      floating_flag: false,
      device_logined: false,
      deviceAudio: false,
      person_logined: false,
      inconsult: false,
      selectTemplate: false,
      consult: false,
      send_notify: false,
      callsend: false,
      minimize_call: false,
      templates: [],
      modal: false,
      searchTemp: "",
      virtual_clinic_branch: "",
      virtual_clinic_flag: ""
    };
    global.redialalert = true;
    DeviceEventEmitter.addListener(healphaCallEventEmitter.eventKeyAasha, (e) => {
      this._onsendString(e.name);
    });
    DeviceEventEmitter.addListener(healphaCallEventEmitter.eventBacktoConsultation, (e) => {
      this._onBacktoConsult();
    });
    DeviceEventEmitter.addListener(healphaCallEventEmitter.redial, (e) => {
      this._onBacktoConsult();
    });
    DeviceEventEmitter.addListener(healphaCallEventEmitter.eventTwilioDisconnect, (e) => {
      this.setState({eventdisconnect: true});
      this._onEndButtonPress1(true);
    });
    DeviceEventEmitter.addListener(healphaCallEventEmitter.vitalssaved, (e) => {
      this._onsendString(
        this.state.perHlpId + "@concent@Device@twilio@vitalssaved" + e
      );
    });
  }
  componentDidMount = async () => {
    // selected_appointment, virtual_clinic_flag

    const virtual_clinic_branch = await AsyncStorage.getItem(
      "virtual_clinic_branch"
    );
    const virtual_clinic_flag = await AsyncStorage.getItem(
      "virtual_clinic_flag"
    );

    const roomName = await AsyncStorage.getItem("twilioEncid");
    const perHlpId = await AsyncStorage.getItem("twilioPerHlpid");
    const perName = await AsyncStorage.getItem("twilioPerName");
    const selectTemplate = await AsyncStorage.getItem("selectTemplate");
    const consult = await AsyncStorage.getItem("consult");
    const frompage = await AsyncStorage.getItem("fromPage");
    this.setState({
      roomName: roomName + "_" + getInstanceType(),
      perHlpId: perHlpId,
      perName: perName.replace(/ +/g, " "),
      selectTemplate: selectTemplate,
      consult: consult,
      frompage: frompage,
      inconsult: frompage=='consult'?true:false,
      virtual_clinic_branch: virtual_clinic_branch,
      virtual_clinic_flag: virtual_clinic_flag
    });

    let random = Math.round(Math.random() * 1000)
    this.props.RandomValues(random);
    if (selectTemplate === "false") {
      this.getMasterTemplatesList();
    }
    // on start we are asking the permisions
    // this.eventListener = DeviceEventEmitter.addListener('eventKey',this.handleEvent);
    GetAllPermissions();
    this.getAccessToken();
    frompage=='consult'?this.hideTwilioCall():false
  };

  componentWillMount() {
    // this.props.componentstate.set('twilio_ref', 10, this.refs.twilioVideo);
    return;
  }

  componentWillUnmount() {
    this.props.componentstate.remove("twilio_ref", this.props.random_values);
  }

  removeAndUpdateReference = () => {
    const ref = this.props.componentstate.get("twilio_ref", this.props.random_values);

    if (ref) {
      this.props.componentstate.remove("twilio_ref", this.props.random_values);
      if (this.refs.twilioVideo) {
        this.props.componentstate.set("twilio_ref", this.props.random_values, this.refs.twilioVideo);
      } else {
        this.props.componentstate.set("twilio_ref", this.props.random_values, ref);
      }
    } else {
      this.props.componentstate.set("twilio_ref", this.props.random_values, this.refs.twilioVideo);
    }
    this.setState({ modal: false });
  };

  getMasterTemplatesList = async (e) => {
    let practice_id = await AsyncStorage.getItem("practice_id");

    await getMasterTemplates({
      practice_id: practice_id,
      branch_id: global.branchId,
      search_text: e?.search_text ? e?.search_text : ""
    })
      .then((res) => {
        this.setState({ templates: res.templates });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  searchTemplate = (val) => {
    this.setState({ searchTemp: val });

    if (val.length > 2) {
      this.getMasterTemplatesList({
        search_text: val
      });
    } else if (!val.trim()) {
      this.getMasterTemplatesList({
        search_text: ""
      });
    }
  };

  _onBacktoConsult = () => {
    this.setState({ backConsult: true });
  };
  getAccessToken = async () => {
    let payload = {
      room_name: this.state.roomName,
      client_id: this.state.client_id,
      client_name: this.state.client_name
    };
    const res = getBaseUrl() + `v1/colloboration/twilio/generate-access-token`;
    const headers = await getApiHeaders();
    await axios
      .post(res, payload, {
        headers: headers
      })
      .then((response) => {
        this.setState({ token: response.data.data.access_token }, () =>
          this._onConnectButtonPress()
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  _onConnectButtonPress = () => {
    this.refs.twilioVideo.connect({
      roomName: this.state.roomName,
      accessToken: this.state.token,
      maintainVideoTrackInBackground: true
    });

    global.twilioconnected = true;
    global.twiliopatienname = this.state.perName;
    this.props.componentstate.set("twilio_ref", this.props.random_values, this.refs.twilioVideo);

    this.setState({ status: "connecting" });
  };

  _onsendString = (data) => {
    // send message
    const ref = this.props.componentstate.get("twilio_ref", this.props.random_values);

    if (this.refs.twilioVideo) {
      // this.props.componentstate.set('twilio_ref', 10, this.refs.twilioVideo);

      this.refs.twilioVideo.sendString(data);

      this.removeAndUpdateReference();

      // this.props.componentstate.set('twilio_ref', 10, this.refs.twilioVideo);
    } else{
      ref
        ?.sendString(data);
      // this.props.componentstate.set('twilio_ref', 10, ref);
      this.removeAndUpdateReference();
    }
  };

  _onEndButtonPress1 = (eventdisconnect) => {
    {
      this.state.isVideoEnabled ? null : this._onVideoButtonPress();
    }
    
    this.refs.twilioVideo.disconnect();
    this.removeAndUpdateReference();
    // this.setState(
    //   {
    //     floating_flag: false,
    //   },
    //   () => this.props.TwilioConnection(false),
    // );
  };
  _onEndButtonPress = () => {
    this._onsendString("doctor disconnected");
    {
      this.state.isVideoEnabled ? null : this._onVideoButtonPress();
    }
    this.refs.twilioVideo.disconnect();
    this.removeAndUpdateReference();
    // this.setState(
    //   {
    //     floating_flag: false,
    //   },
    //   () => this.props.TwilioConnection(false),
    // );
  };
  _onMuteButtonPress = () => {
    // // on cliking the mic button we are setting it to mute or viceversa
    // this.refs.twilioVideo
    //   .setLocalAudioEnabled(!this.state.isAudioEnabled)
    //   .then((isEnabled) => this.setState({ isAudioEnabled: isEnabled }));
    const ref = this.props.componentstate.get("twilio_ref", this.props.random_values);

    if (this.refs.twilioVideo) {
      // this.props.componentstate.set('twilio_ref', 10, this.refs.twilioVideo);

      this.refs.twilioVideo
        .setLocalAudioEnabled(!this.state.isAudioEnabled)
        .then((isEnabled) => this.setState({ isAudioEnabled: isEnabled }));

      this.removeAndUpdateReference();

      // this.props.componentstate.set('twilio_ref', 10, this.refs.twilioVideo);
    } else if (ref?.setLocalAudioEnabled) {
      ref
        ?.setLocalAudioEnabled(!this.state.isAudioEnabled)
        .then((isEnabled) => this.setState({ isAudioEnabled: isEnabled }));
      // this.props.componentstate.set('twilio_ref', 10, ref);
      this.removeAndUpdateReference();
    }
  };
  _onRemoteParticipantsPress1 = (trackSid, trackIdentifier) => {
    this.setState({
      track: !this.state.track,
      trackSid: trackSid,
      trackIdentifier: trackIdentifier
    });
  };
  _onRemoteParticipantsPress2 = (trackSid, trackIdentifier) => {
    if (trackSid == this.state.trackSid) {
      return (
        <TwilioVideoParticipantView
          style={styles.remoteVideo1}
          key={this.state.tracktrackSid}
          trackIdentifier={this.state.trackIdentifier}
        />
      );
    } else {
      return (
        <TwilioVideoParticipantView
          style={styles.remoteVideo}
          key={trackSid}
          trackIdentifier={trackIdentifier}
        />
      );
    }
  };
  _onVideoButtonPress = () => {
    // on cliking the video button we are setting it to mute or viceversa
    this.refs.twilioVideo
      .setLocalVideoEnabled(!this.state.isVideoEnabled)
      .then((isEnabled) => this.setState({ isVideoEnabled: isEnabled }));
    this.removeAndUpdateReference();
  };
  _onFlipButtonPress = () => {
    // switches between fronst camera and Rare camera
    this.refs.twilioVideo.flipCamera();
    this.removeAndUpdateReference();
  };
  _onRoomDidConnect = () => {
    global.twilioconnected = true;
    this.setState({ status: "connected" });
  };
  // _onRoomDidDisconnect = ({roomName, error}) => {
  //   this.setState({status: 'disconnected'});
  // };

  sendNotificationToVirtualClinic = async (contentdata, data) => {
    try {
      this.setState({ send_notify: true });
      const { virtual_clinic_branch } = this.state;

      const url =
        getBaseUrl() + `v1/virtual-clinic/${virtual_clinic_branch}/users/all`;

      const response = await getAllVirtualClinicUsers(url);

      const users = response?.data?.users || [];

      const php_token = await AsyncStorage.getItem("userToken");

      const nodeToken = await AsyncStorage.getItem("jwt_token");

      for (let i = 0; i < users?.length; i++) {
        const element = users[i];

        const payload = {
          action:
            data +
            this.state.roomName +
            "@concent@" +
            this.state.perHlpId +
            "@concent@" +
            this.state.perName +
            "@concent@" +
            this.state.client_id +
            "@concent@" +
            this.state.client_name,
          content: contentdata,
          doc: this.state.client_id,
          hlp: element?.nh_id,
          source: "patient",
          token: php_token,
          node_token: nodeToken
        };
        const notification_url = getBaseUrl() + `notify_healpha_call`;
        await sendNotificationToVirtualClinicUsers(notification_url, payload);
      }
    } catch (error) {
      console.error(error);
      this.setState({ isLoading: false });
    }
  };

  sendNotification1 = (data) => {
    if (data == 1) {
      this.state.virtual_clinic_flag === "true"
        ? this.sendNotificationToVirtualClinic(
            i18n.t("HEALPHACALL.JOIN_CALL"),
            "Healpha Call@concent@"
          )
        : this.sendNotification(
            i18n.t("HEALPHACALL.JOIN_CALL"),
            "Healpha Call@concent@"
          );
    } else {
      // this.setState({redialalert:true})
      global.redialalert = true;

      this.state.virtual_clinic_flag === "true"
        ? this.sendNotificationToVirtualClinic(
            i18n.t("HEALPHACALL.JOIN_CALL"),
            "Healpha Call@concent@"
          )
        : this.sendNotification(
            i18n.t("HEALPHACALL.JOIN_CALL"),
            "Healpha Call@concent@"
          );
    }
  };
  _onsendNotification2 = () => {
    // this.setState({redialalert:true})
    global.redialalert = true;

    this.state.virtual_clinic_flag === "true"
      ? this.sendNotificationToVirtualClinic(
          i18n.t("HEALPHACALL.JOIN_CALL"),
          "Healpha Call@concent@"
        )
      : this.sendNotification(
          i18n.t("HEALPHACALL.JOIN_CALL"),
          "Healpha Call@concent@"
        );
  };
  _onRoomDidDisconnect = async ({ roomName, error }) => {
    global.twilioconnected = false;
    global.redialalert = false;
    this.setState({ status: "disconnected", callsend: true });
    this.state.virtual_clinic_flag === "true"
      ? this.sendNotificationToVirtualClinic(
          i18n.t("HEALPHACALL.CALL_DISCONNECT"),
          "Healpha Call Disconnected@concent@"
        )
      : this.sendNotification(
          i18n.t("HEALPHACALL.CALL_DISCONNECT"),
          "Healpha Call Disconnected@concent@"
        );
    await AsyncStorage.setItem("virtual_clinic_flag", "false");

    this.setState(
      {
        floating_flag: false
      },
      () => this.props.TwilioConnection(false)
    );
    const redial_call_flag=await AsyncStorage.getItem('redial_call_flag');
    redial_call_flag=="videpdf"?null:await AsyncStorage.setItem('redial_call_flag', 'consult')
    const redial_call_flag1=await AsyncStorage.getItem('redial_call_flag')
    redial_call_flag1=="viewpdf"?DeviceEventEmitter.emit(healphaCallEventEmitter.redialcallflagevent, {
      redialcallflag:"false",
    }):
    DeviceEventEmitter.emit(healphaCallEventEmitter.redialcallflagevent, {
      redialcallflag:"true",
    })
  };

  _onRoomDidFailToConnect = (error) => {
    this.setState({ status: "disconnected" });
  };
  _onRoomParticipantDidConnect = (participants) => {
    if (
      participants.participant.identity.split("@concent@")[0] ==
        this.state.perHlpId &&
      participants.participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({
        callsend: false
      });
    }
    const participantList1 =
      this.state.participantList instanceof Map
        ? this.state.participantList
        : new Map();
    this.setState({
      participantList: new Map([
        ...participantList1,
        [
          participants.participant.sid,
          {
            participantSid: participants.participant.sid,
            participantIdentity: participants.participant.identity
          }
        ]
      ])
    });
    // this.setState({status: 'connected'});
    // this._onFlipButtonPress1()
    this.removeAndUpdateReference();
  };
  _onRoomParticipantDidDisconnect = (participants) => {
    const participantList = this.state.participantList;
    const videoTracksList = this.state.videoTracksList;
    // const videoTracks = this.state.videoTracks;
    if (
      participants.participant.identity.split("@concent@")[0] ==
        this.state.perHlpId &&
      participants.participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({
        person_logined: false,
        videoTracks: this.state.videoTracks,
        send_notify: false
      });
    }
    if (this.state.participantList instanceof Map) {
      participantList.delete(participants.participant.sid);
      videoTracksList.pop(participants.participant.sid);
      // Array.from(
      //   this.state.videoTracks,
      //   ([trackSid, trackIdentifier]) => {
      //     if(trackIdentifier.participantIdentity==participants.identity){
      //       videoTracks.delete(trackSid);
      //     }
      //   })
      this.setState({
        participantList: participantList,
        videoTracksList: videoTracksList,
        videoTracks: this.state.videoTracks
      });
    }
    // this.setState({status: 'disconnected'});
    this.removeAndUpdateReference();
  };

  _onParticipantAddedVideoTrack = ({ participant, track }) => {
    // call everytime a participant joins the same room
    if (this.state.videoTracksList.includes(participant.sid)) {
      // videoTrack already exist
    } else {
      this.state.videoTracksList.push(participant.sid);
    }
    // this.state.videoTracksList.append(participant.sid)
    if (
      participant.identity.split("@concent@")[0] == this.state.perHlpId &&
      participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({ person_logined: true });
    }
    const videoTracks = this.state.videoTracks;
    if (this.state.videoTracks instanceof Map) {
      // videoTracks.delete(track.trackSid);
      Array.from(this.state.videoTracks, ([trackSid, trackIdentifier]) => {
        if (trackIdentifier.participantIdentity == participant.identity) {
          videoTracks.delete(trackSid);
          this.setState({ videoTracks: videoTracks });
        }
      });
    }
    // this.setState({videoTracks:videoTracks})
    const videoTracks1 =
      this.state.videoTracks instanceof Map
        ? this.state.videoTracks
        : new Map();
    this.setState({
      videoTracks: new Map([
        ...videoTracks1,
        [
          track.trackSid,
          {
            participantSid: participant.sid,
            videoTrackSid: track.trackSid,
            participantIdentity: participant.identity,
            enabled: track.enabled
          }
        ]
      ])
    });
    // }
    this.removeAndUpdateReference();
  };
  _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    // gets called when a participant disconnects.
    if (
      participant.identity.split("@concent@")[0] == this.state.perHlpId &&
      participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({ person_logined: true });
    }
    // if(this.state.videoTracksList.includes(participant.sid)){
    //   console.log("videoTrack exist")
    // }else{
    //   console.log("videotrack")
    // }
    // if(this.state.videoTracksList.includes(participant.sid)){
    const videoTracks = this.state.videoTracks;
    if (this.state.videoTracks instanceof Map) {
      if (track.enabled) {
        videoTracks.delete(track.trackSid);
        this.setState({ videoTracks: videoTracks });
      } else {
        videoTracks.delete(track.trackSid);
        this.setState({ videoTracks: videoTracks });
        const videoTracks1 =
          this.state.videoTracks instanceof Map
            ? this.state.videoTracks
            : new Map();
        this.setState({
          videoTracks: new Map([
            ...videoTracks1,
            [
              track.trackSid,
              {
                participantSid: participant.sid,
                videoTrackSid: track.trackSid,
                participantIdentity: participant.identity,
                enabled: track.enabled
              }
            ]
          ])
        });
      }
    }
    // this.state.videoTracksList.append(participant.sid)
    this.removeAndUpdateReference();
  };
  _onParticipantAddedAudioTrack = ({ participant, track }) => {
    // call everytime a participant joins the same room
    // Array.from(
    //     this.state.videoTracks,
    //     ([trackSid, trackIdentifier]) => {
    //       if(trackIdentifier.participantIdentity==participants.identity){
    //         console.log("trackidentity",trackSid,trackIdentifier)
    //         videoTracks.delete(trackSid);
    //       }
    //     })
    if (participant.identity.split("@concent@")[1] == "Device") {
      this.setState({ device_logined: true, deviceAudio: track.enabled });
    }
    if (
      participant.identity.split("@concent@")[0] == this.state.perHlpId &&
      participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({ person_logined: true });
    }
    audioTracksList[participant.identity] = track.enabled;
    //   const audioTracks1 =
    //   this.state.audioTracks instanceof Map
    //     ? this.state.audioTracks
    //     : new Map();
    // this.setState({
    //   audioTracks: new Map([
    //     ...audioTracks1,
    //     [
    //       track.trackSid,
    //       {
    //         participantSid: participant.sid,
    //         videoTrackSid: track.trackSid,
    //         participantIdentity: participant.identity,
    //       },
    //     ],
    //   ]),
    // });
    this.removeAndUpdateReference();
  };
  _onParticipantRemovedAudioTrack = ({ participant, track }) => {
    // gets called when a participant disconnects.
    if (participant.identity.split("@concent@")[1] == "Device") {
      this.setState({ device_logined: false, deviceAudio: track.enabled });
    }
    if (
      participant.identity.split("@concent@")[0] == this.state.perHlpId &&
      participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({ person_logined: true });
    }
    audioTracksList[participant.identity] = track.enabled;

    // const audioTracks = this.state.audioTracks;
    // if (this.state.audioTracks instanceof Map) {
    //   audioTracks.delete(track.trackSid);
    //   this.setState({audioTracks: audioTracks});
    // }
    this.removeAndUpdateReference();
  };

  _onParticipantDisabledAudioTrack = ({ participant, track }) => {
    // call everytime a participant joins the same room
    if (participant.identity.split("@concent@")[1] == "Device") {
      this.setState({ deviceAudio: track.enabled });
    }
    if (
      participant.identity.split("@concent@")[0] == this.state.perHlpId &&
      participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({ person_logined: true });
    }
    audioTracksList[participant.identity] = track.enabled;
    this.setState({ videoTracks: this.state.videoTracks });

    // const audioTracks = this.state.audioTracks;
    // if (this.state.audioTracks instanceof Map) {
    //   audioTracks.delete(track.trackSid);
    //   this.setState({audioTracks: audioTracks});
    // }
    this.removeAndUpdateReference();
  };

  _onParticipantDisabledVideoTrack = ({ participant, track }) => {
    // gets called when a participant disconnects.
  };

  _onParticipantEnabledAudioTrack = ({ participant, track }) => {
    // gets called when a participant disconnects.
    if (participant.identity.split("@concent@")[1] == "Device") {
      this.setState({ deviceAudio: track.enabled });
    }
    if (
      participant.identity.split("@concent@")[0] == this.state.perHlpId &&
      participant.identity.split("@concent@")[1] != "Device"
    ) {
      this.setState({ person_logined: true });
    }
    audioTracksList[participant.identity] = track.enabled;
    this.setState({ videoTracks: this.state.videoTracks });

    //   const audioTracks1 =
    //   this.state.audioTracks instanceof Map
    //     ? this.state.audioTracks
    //     : new Map();
    // this.setState({
    //   audioTracks: new Map([
    //     ...audioTracks1,
    //     [
    //       track.trackSid,
    //       {
    //         participantSid: participant.sid,
    //         videoTrackSid: track.trackSid,
    //         participantIdentity: participant.identity,
    //       },

    //     ],
    //   ]),
    // });
    this.removeAndUpdateReference();
  };
  _onParticipantEnabledVideoTrack = ({ participant, track }) => {
    // gets called when a participant disconnects.
  };
  _onDataTrackMessageReceived = ({ participant, message }) => {
    // gets called when a participant disconnects.
    if((message.includes('@vitalsdata@')) && (message.split('@vitalsdata@')[0]==this.state.client_id + "@concent@" + this.state.client_name)){
      DeviceEventEmitter.emit(healphaCallEventEmitter.eventVitals, {
        data: message.split('@vitalsdata@')[1]
      });
    }else if((message.includes('@vitalspushdata@')) && (message.split('@vitalspushdata@')[0]==this.state.client_id + "@concent@" + this.state.client_name)){
      DeviceEventEmitter.emit(healphaCallEventEmitter.eventpushVitalsfromperson, {
        data: message.split('@vitalspushdata@')[1]
      });
    }else if((message.includes('@vitalspushfromdb@')) && (message.split('@vitalspushfromdb@')[0]==this.state.client_id + "@concent@" + this.state.client_name)){
      DeviceEventEmitter.emit(healphaCallEventEmitter.eventvitalspushfromdb, {
        data: message.split('@vitalspushfromdb@')[1]
      });
    }else if((message.includes('@aashavalue@')) && (message.split('@aashavalue@')[0]==this.state.client_id + "@concent@" + this.state.client_name)){
      DeviceEventEmitter.emit(healphaCallEventEmitter.eventaashavalue, {
        data: message.split('@aashavalue@')[1]
      });
    }
    else{
    const participant_data = message.split("@twilio@")[0];
    const value = message.split("@twilio@")[1];
    if (
      participant_data ==
      this.state.client_id + "@concent@" + this.state.client_name
    ) {
      switch (value) {
        case "aasha":
          DeviceEventEmitter.emit(healphaCallEventEmitter.eventValueAasha, {
            aashavalue: value.split("@")[1]
          });
          break;
        case "audio enable":
          this._onMuteButtonPress();
          break;
        case "audio disable":
          this._onMuteButtonPress();
          break;
        case "video enable":
          this._onVideoButtonPress();
          break;
        case "video disable":
          this._onVideoButtonPress();
          break;
        // case 'p':
        //     this.getPulse()
        //     break;
        // case 's':
        //     this.getSpiro()
        //     break;
        // case 'm':
        //     this.getTemp()
        //     break;
        default:
          break;
      }
    } else {
        // console.log("mesage", message);
        //no need to set anything
    }
  }
    this.removeAndUpdateReference();
  };

  minimizeVideoCall = () => {
    this.removeAndUpdateReference();

    this.setState((prevStae) => ({
      floating_flag: !prevStae.floating_flag
    }));
  };
  hideTwilioCall = () => {
    global.minimize_call = true
    this.setState((prevStae) => ({
      floating_flag: true,
      minimize_call: true
    }));
    this.removeAndUpdateReference();
  };

  toggleDevice(value) {
    if (value === true) {
      this._onsendString("audio enable");
    } else {
      this._onsendString("audio disable");
    }
  }
  sendNotification = async (contentdata, data) => {
    const deviceToken = await AsyncStorage.getItem("jwt_token");
    // if (this.state.reason) {
    this.setState({ send_notify: true });
    let url = getBaseUrl() + "notify_healpha_call/";
    let ocv = JSON.stringify({
      hlp: this.state.perHlpId,
      doc: this.state.client_id,
      token: global.token,
      node_token: deviceToken,
      content: contentdata,
      action:
        data +
        this.state.roomName +
        "@concent@" +
        this.state.perHlpId +
        "@concent@" +
        this.state.perName +
        "@concent@" +
        this.state.client_id +
        "@concent@" +
        this.state.client_name,
      source: "patient"
    });
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
        // alert('Notification Send Successfully');
        return response.message;
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.error(error);
      });
    // } else {
    //   alert('Please enter a reason');
    // }
  };
  _onChange = async () => {

    {
      this.state.frompage == "oldpatient" &&
        DeviceEventEmitter.emit(healphaCallEventEmitter.eventOldPatStartConsultation, {
          selectTemplate: this.state.selectTemplate
        });
    }
    {
      this.state.frompage == "patients" &&
        DeviceEventEmitter.emit(healphaCallEventEmitter.eventPatientsStartConsultation, {
          selectTemplate: this.state.selectTemplate
        });
    }
    this.setState({ inconsult: true });

    if (this.state.selectTemplate === "true") {
      {
        this.state.frompage == "homescreen" &&
          DeviceEventEmitter.emit(healphaCallEventEmitter.eventStartConsultation, {
            templateid: this.props.template_id
          });
        this.minimizeVideoCall();
      }
    } else {
      this.setState({ modal: true });

      // this.getMasterTemplatesList()
      //   .then((res) => {

      //   })
      //   .catch((res) => {
      //     alert(res.message);
      //   });

      // {
      //   this.state.frompage == 'homescreen' &&
      //     DeviceEventEmitter.emit('popUpModal', {
      //       true: 'true',
      //     });
      // }
    }
  };

  selectTemplate = async (val) => {
    this.minimizeVideoCall();
    {
      this.state.frompage == "homescreen" &&
        DeviceEventEmitter.emit(healphaCallEventEmitter.selectTemplate, {
          templateId: val
        });
    }
  };

  // renderPatientDial = () => {
  //   console.log("renderPatientDial")
  //   this.sendNotification()
  //   return (
  //     <View style={TStyles.itemsCenter}>
  //       <Text style={TStyles.dialingPatientText}>Dialing Patient...</Text>
  //       <View style={TStyles.dialingPatientMainView}>
  //         <View style={TStyles.connectingPatientNameView}>
  //           <Text style={TStyles.nameText} numberOfLines={1}>
  //           {this.state.perName}
  //           </Text>
  //         </View>

  //         <View style={TStyles.connectingPatientName}>
  //           <Text style={TStyles.PatientNameText}>{this.state.perName.match(/\b(\w)/g).join('').toUpperCase()}</Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  renderPatientDial = () => {
    {
      this.state.send_notify ? null : this.sendNotification1(1);
    }
    setTimeout(() => {
      if (this.state.person_logined) {
        // this.hangupCall2(notification.data.click_action);
        // console.log("already connected");
      } else {
        if (global.redialalert) {
          global.redialalert = false;
          Alert.alert(
            i18n.t("HEALPHACALL.PATIENT_NOT_REACHABLE"),
            i18n.t("HEALPHACALL.WANT_TO_CONTINUE"),
            [
              {
                text: i18n.t("HEALPHACALL.REDIAL"),
                onPress: () => this.sendNotification1(2)
              },
              {
                text: i18n.t("HEALPHACALL.GOBACK"),
                onPress: () => this._onEndButtonPress()
              }
            ],
            { cancelable: false }
          );
        }
      }
    }, 60000);
    return (
      <View style={[TStyles.itemsCenter, TStyles.flex]}>
        <View style={TStyles.flexDirection}>
          {!this.state.floating_flag && (
            <View style={[TStyles.flex, TStyles.itemsCenter]}>
              <Text style={TStyles.dialingPatientText}>
                {i18n.t("HEALPHACALL.DIALING_PATIENT")}
              </Text>
            </View>
          )}
          <View>
            {!this.state.floating_flag && (
              <TouchableOpacity
                style={TStyles.contentEnd}
                onPress={() => this.minimizeVideoCall()}>
                <CloseIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* {this.state.floating_flag && (
          <View style={TStyles.fullScreen}>
            <TouchableOpacity
              onPress={() => this.minimizeVideoCall()}
              style={TStyles.ptFullScreenTouch}>
              <MIcon
                name={'fullscreen'}
                size={24}
                color={DEFAULT_WHITE_COLOR}
              />
            </TouchableOpacity>
          </View>
        )} */}

        <View
          style={[
            TStyles.dialingPatientMainView,
            this.state.minimize_call ? TStyles.displayNone : {}
          ]}>
          {this.state.floating_flag && (
            <View
              style={[
                TStyles.fullScreen,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  marginRight: wp(-3)
                }
              ]}>
              <TouchableOpacity
                onPress={() => this.minimizeVideoCall()}
                style={[TStyles.connectingFullScreen]}>
                <MIcon
                  name={"fullscreen"}
                  size={24}
                  color={DEFAULT_WHITE_COLOR}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.hideTwilioCall()}
                style={TStyles.connectingFullScreen}>
                <MIcon name={"close"} size={24} color={DEFAULT_WHITE_COLOR} />
              </TouchableOpacity>
            </View>
          )}

          <View style={TStyles.connectingPatientNameView}>
            <Text style={TStyles.nameText} numberOfLines={1}>
              {this.state.perName}
            </Text>
          </View>

          <View style={TStyles.connectingPatientName}>
            <Text style={TStyles.PatientNameText}>
              {this.state.perName
                .match(/\b(\w)/g)
                .join("")
                .toUpperCase()}
            </Text>
          </View>
        </View>

        {this.state.minimize_call && this.renderMinimizeContent()}
      </View>
    );
  };

  expandCall = () => {
    global.minimize_call = false
    this.setState((prevStae) => ({
      floating_flag: false,
      minimize_call: false
    }));
    this.removeAndUpdateReference();
  };

  renderMinimizeContent = () => {
    return (
      <View style={TStyles.flex}>
        <View style={TStyles.hideCallingMainView}>
          <TouchableOpacity
            style={TStyles.hideCallingTouchableView}
            onPress={() => this.expandCall()}>
            <View style={TStyles.activeButton} />
            <View style={[TStyles.flex, TStyles.itemsCenter]}>
              <Text style={TStyles.hideNameText}>
                {this.state.perName
                  .match(/\b(\w)/g)
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderConnectedPatientView = () => {
    return (
      <View style={TStyles.itemsCenter}>
        <View style={TStyles.flexDirection}>
          {!this.state.floating_flag && this.state.person_logined && (
            <View style={TStyles.itemsEndAndFlex2}>
              <MCIcon
                name={"circle"}
                size={20}
                color={"green"}
                style={TStyles.connectedCircle}
              />
              <Text style={TStyles.connected}>
                {i18n.t("HEALPHACALL.CONNECTED")}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={TStyles.contentEnd}
            onPress={() => this.minimizeVideoCall()}>
            {!this.state.floating_flag && <CloseIcon />}
            {/* <CloseIcon /> */}
          </TouchableOpacity>
        </View>

        {/* Participate view start */}

        {Array.from(
          this.state.videoTracks,
          ([trackSid, trackIdentifier], index) => {
            if (
              trackIdentifier.participantIdentity.split("@concent@")[0] ==
                this.state.perHlpId &&
              trackIdentifier.participantIdentity.split("@concent@")[1] !=
                "Device"
            ) {
              return (
                <View
                  style={[
                    TStyles.participateMainView,
                    this.state.floating_flag ? TStyles.height : {},
                    this.state.minimize_call ? TStyles.displayNone : {}
                  ]}>
                  <View style={TStyles.participateMediaView}>
                    {!this.state.floating_flag && this.state.device_logined && (
                      <View style={[TStyles.stethFlex]}>
                        <TouchableOpacity
                          style={[TStyles.stethFlex]}
                          onPress={() =>
                            this._onsendString(
                              this.state.perHlpId +
                                "@concent@Device@twilio@audio disable"
                            )
                          }>
                          <Image
                            source={Stethoscope}
                            style={TStyles.stethoscopeIcon}
                          />
                          {this.state.deviceAudio && (
                            <MCIcon name={"circle"} size={10} color={"green"} />
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                    {!this.state.floating_flag && (
                      <View style={TStyles.ptMediaView}>
                        <TouchableOpacity
                          style={TStyles.ptMediaTouch}
                          onPress={() =>
                            this._onsendString(
                              trackIdentifier.participantIdentity +
                                "@twilio@audio disable"
                            )
                          }>
                          <MIcon
                            name={
                              audioTracksList[
                                trackIdentifier.participantIdentity
                              ]
                                ? "mic"
                                : "mic-off"
                            }
                            size={24}
                            color={DEFAULT_WHITE_COLOR}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={TStyles.ptMediaTouch}
                          onPress={() =>
                            this._onsendString(
                              trackIdentifier.participantIdentity +
                                "@twilio@video disable"
                            )
                          }>
                          <MIcon
                            name={
                              trackIdentifier.enabled
                                ? "videocam"
                                : "videocam-off"
                            }
                            size={24}
                            color={DEFAULT_WHITE_COLOR}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    {this.state.floating_flag && (
                      <View style={TStyles.hideCallView}>
                        <View>
                          <TouchableOpacity
                            onPress={() => this.minimizeVideoCall()}
                            style={TStyles.ptFullScreenTouch}>
                            <MIcon
                              name={"fullscreen"}
                              size={24}
                              color={DEFAULT_WHITE_COLOR}
                            />
                          </TouchableOpacity>
                        </View>

                        <View>
                          <TouchableOpacity
                            onPress={() => this.hideTwilioCall()}
                            style={TStyles.ptFullScreenTouch}>
                            <MIcon
                              name={"close"}
                              size={24}
                              color={DEFAULT_WHITE_COLOR}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>

                  <View style={TStyles.ptNameView}>
                    <Text style={TStyles.ptName} numberOfLines={1}>
                      {
                        trackIdentifier.participantIdentity.split(
                          "@concent@"
                        )[1]
                      }
                    </Text>
                  </View>

                  {/* {this.state.track && ( */}
                  {trackIdentifier.enabled ? (
                    <TwilioVideoParticipantView
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                      style={TStyles.twilioVideoParticipantView}
                    />
                  ) : (
                    <View style={TStyles.connectingPatientName}>
                      <Text style={TStyles.PatientNameText}>
                        {this.state.perName
                          .match(/\b(\w)/g)
                          .join("")
                          .toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {/* )} */}
                </View>
              );
            }
          }
        )}
        {this.state.minimize_call && this.renderMinimizeContent()}
      </View>
    );
  };

  renderLocalVideo = () => {
    return (
      <View
        style={[
          TStyles.lcVideoMainView,
          this.state.floating_flag ? TStyles.displayNone : TStyles.displayFlex
        ]}>
        <View style={TStyles.lcVideoHidden}>
          <View style={TStyles.lcVideoNameView}>
            <Text style={TStyles.lcVideoName} numberOfLines={1}>
              {this.state.client_name}
            </Text>
          </View>

          <TwilioVideoLocalView
            enabled={true}
            style={TStyles.twilioVideoLocalView}
          />
        </View>

        {/* Other Participate Videos View */}

        {Array.from(
          this.state.videoTracks,
          ([trackSid, trackIdentifier], index) => {
            if (
              (trackIdentifier.participantIdentity !=
              this.state.perHlpId + "@concent@" + this.state.perName) && (trackIdentifier.participantIdentity !=
                this.state.perHlpId + "@concent@Device")
            ) {
              return (
                <View style={TStyles.optMainView}>
                  <View style={TStyles.optNameView}>
                    <Text style={TStyles.optNameText} numberOfLines={1}>
                      {
                        trackIdentifier.participantIdentity.split(
                          "@concent@"
                        )[1]
                      }
                    </Text>
                  </View>

                  <View style={TStyles.optMediaView}>
                    <View style={TStyles.ptMediaView}>
                      <TouchableOpacity
                        style={TStyles.ptMediaTouch}
                        onPress={() =>
                          this._onsendString(
                            trackIdentifier.participantIdentity +
                              "@twilio@audio disable"
                          )
                        }>
                        <MIcon
                          name={
                            audioTracksList[trackIdentifier.participantIdentity]
                              ? "mic"
                              : "mic-off"
                          }
                          size={24}
                          color={DEFAULT_WHITE_COLOR}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={TStyles.ptMediaTouch}
                        onPress={() =>
                          this._onsendString(
                            trackIdentifier.participantIdentity +
                              "@twilio@video disable"
                          )
                        }>
                        <MIcon
                          name={
                            trackIdentifier.enabled
                              ? "videocam"
                              : "videocam-off"
                          }
                          size={24}
                          color={DEFAULT_WHITE_COLOR}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {trackIdentifier.enabled ? (
                    <TwilioVideoParticipantView
                      enabled={true}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                      style={TStyles.optVideo}
                    />
                  ) : (
                    <View style={TStyles.connectingPatientName}>
                      <Text style={TStyles.PatientNameText}>
                        {this.state.perName
                          .match(/\b(\w)/g)
                          .join("")
                          .toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }
          }
        )}
      </View>
    );
  };

  renderCallButtons = () => {
    return (
      <View
        style={[
          TStyles.twilioButtonMainView,
          this.state.floating_flag ? TStyles.displayNone : TStyles.displayFlex,
          this.state.floating_flag ? TStyles.zIndex0 : TStyles.zIndex2
        ]}>
        <TouchableOpacity
          style={[
            TStyles.micButtonStyles,
            TStyles.itemsCenter,
            TStyles.flexDirection,
            this.state.floating_flag
              ? TStyles.displayNone
              : TStyles.displayFlex,
            TStyles.justifyContentSpaceAround
          ]}
          onPress={this._onMuteButtonPress}>
          <MIcon
            name={this.state.isAudioEnabled ? "mic" : "mic-off"}
            size={24}
            color={DEFAULT_WHITE_COLOR}
          />
          <Text style={TStyles.mediaOnOff}>
            {this.state.isAudioEnabled
              ? i18n.t("HEALPHACALL.ON")
              : i18n.t("HEALPHACALL.OFF")}
          </Text>
        </TouchableOpacity>
        {this.state.device_flag ? null : (
          <TouchableOpacity
            style={[
              TStyles.micButtonStyles,
              TStyles.itemsCenter,
              TStyles.flexDirection,
              this.state.floating_flag
                ? TStyles.displayNone
                : TStyles.displayFlex,
              TStyles.justifyContentSpaceAround
            ]}
            onPress={this._onVideoButtonPress}>
            <MIcon
              name={this.state.isVideoEnabled ? "videocam" : "videocam-off"}
              size={24}
              color={DEFAULT_WHITE_COLOR}
            />
            <Text style={TStyles.mediaOnOff}>
              {this.state.isVideoEnabled
                ? i18n.t("HEALPHACALL.ON")
                : i18n.t("HEALPHACALL.OFF")}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            TStyles.micButtonStyles,
            this.state.floating_flag ? TStyles.displayNone : TStyles.displayFlex
          ]}
          onPress={this._onEndButtonPress}>
          <MIcon name="call-end" size={24} color={DEFAULT_RED_COLOR} />
        </TouchableOpacity>
      </View>
    );
  };
  renderStartConsultation = () => {
    return (
      <View>
        {this.state.floating_flag ? null : (
          <Footer style={TStyles.twilioBackgroundColor}>
            {this.state.inconsult ? (
              <Button
                onPress={() => this.minimizeVideoCall()}
                style={TStyles.buttonStyles}>
                <Text style={TStyles.updateText}>
                  {i18n.t("HEALPHACALL.BACK_TO_CONSULTATION")}
                </Text>
              </Button>
            ) : (
              <Button
                onPress={() => this._onChange()}
                style={TStyles.buttonStyles}>
                <Text style={TStyles.updateText}>
                  {i18n.t("HEALPHACALL.START_CONSULTATION")}
                </Text>
              </Button>
            )}

            {/* <ActionSheet ref={this.templateRef}>{this.Templates()}</ActionSheet> */}
            <Modal
              isVisible={this.state.modal}
              // isVisible={true}
              onBackButtonPress={() => {
                this.setState({ modal: false });
              }}
              onBackdropPress={() => {
                this.setState({ modal: false });
              }}
              backdropOpacity={0.1}
              style={{
                padding: 0,
                margin: 0
              }}>
              <View
                style={{
                  flex: 1
                  // height: '60%',
                }}>
                <View
                  style={{
                    backgroundColor: DEFAULT_WHITE_COLOR,
                    height: "60%",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    paddingBottom: hp(20)
                  }}>
                  <View style={styles.image}>
                    <Text
                      style={{
                        fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                        fontSize: 16
                      }}>
                      Select Template
                    </Text>
                    <Right style={{ marginRight: 10 }}>
                      <TouchableOpacity
                        onPress={() => this.setState({ modal: false })}>
                        <Image source={close} style={styles.close} />
                      </TouchableOpacity>
                    </Right>
                  </View>
                  <View>
                    <View style={styles.searchoutside}>
                      <View style={styles.search}>
                        <Image source={Search} style={styles.searchimg} />
                        <TextInput
                          value={this.state.searchTemp}
                          placeholder="Search Patient"
                          style={[styles.searchmedicine, { width: "100%" }]}
                          onChangeText={(val) => {
                            this.searchTemplate(val);
                          }}
                        />
                      </View>
                    </View>

                    <ScrollView keyboardShouldPersistTaps="always">
                      {this.state.templates &&
                        this.state.templates.map((template, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              onPress={() => this.selectTemplate(template.id)}>
                              <View
                                key={index}
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  margin: 10,
                                  alignItems: "center"
                                }}>
                                <Text>{template.name}</Text>
                                <View
                                  style={{
                                    borderRadius: 5,
                                    backgroundColor: DEFAULT_LIGHT_GREEN_COLOR,
                                    color: DEFAULT_GREEN_COLOR,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5
                                  }}>
                                  <Text
                                    style={{
                                      color: DEFAULT_GREEN_COLOR
                                    }}>
                                    Preview
                                  </Text>
                                </View>
                              </View>
                              <Divider style={styles.divide} />
                            </TouchableOpacity>
                          );
                        })}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </Modal>
          </Footer>
        )}
      </View>
    );
  };

  render() {
    const tracksLength = Array.from(this.state.videoTracks);
    return (
      <View
        style={[
          styles.container,
          this.state.floating_flag
            ? TStyles.twilioMainFloatingView
            : TStyles.twilioMainWindow,
          this.state.floating_flag ? TStyles.bgTransparent : {},
          this.state.minimize_call ? styles.minimizeCall : {}
        ]}>
        {this.state.status === "disconnected" && (
          <View
            style={[
              TStyles.flex,
              TStyles.twilioBackgroundColor,
              TStyles.itemsCenter
            ]}>
            <Text style={TStyles.connectedText}>
              {i18n.t("HEALPHACALL.CONNECTING")}
            </Text>
          </View>
        )}
        {(this.state.status === "connected" ||
          this.state.status === "connecting") && (
          <View
            style={[
              styles.callContainer,
              this.state.floating_flag ? TStyles.bgTransparent : {}
            ]}>
            {this.state.device_flag ? null : (
              <View style={TStyles.flex}>
                <View
                  style={[
                    TStyles.localVideoView,
                    this.state.floating_flag
                      ? TStyles.marginZero
                      : TStyles.localVideoMargin,
                    this.state.floating_flag ? TStyles.paddingZero : {},
                    this.state.floating_flag ? TStyles.floatingLocalVideo : {}
                  ]}>
                  {/* Dialing Patient Screen Start */}

                  {/* {tracksLength?.length === 0 && this.renderPatientDial()} */}
                  {this.state.person_logined == false &&
                    this.renderPatientDial()}
                  {/* {tracksLength?.length > 0 &&
                    this.renderConnectedPatientView()} */}
                  {this.state.person_logined == true &&
                    this.renderConnectedPatientView()}

                  {/* Dialing Patient Screen End */}

                  {/* remaining connected persons */}
                </View>

                {/* render Local video start */}

                {this.renderLocalVideo()}

                {/* render local video end */}
              </View>
            )}

            {/* Twilio Call Buttons Start */}
            {this.renderCallButtons()}
            {this.state.frompage != "true" &&
              this.state.person_logined &&
              this.renderStartConsultation()}
            {/* Twilio Call Buttons End */}
          </View>
        )}
        <TwilioVideo
          ref="twilioVideo"
          onRoomDidConnect={this._onRoomDidConnect}
          onRoomDidDisconnect={this._onRoomDidDisconnect}
          onRoomDidFailToConnect={this._onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={this._onParticipantRemovedVideoTrack}
          onParticipantAddedAudioTrack={this._onParticipantAddedAudioTrack}
          onParticipantDisabledVideoTrack={
            this._onParticipantDisabledVideoTrack
          }
          onParticipantDisabledAudioTrack={
            this._onParticipantDisabledAudioTrack
          }
          onParticipantEnabledVideoTrack={this._onParticipantEnabledVideoTrack}
          onParticipantEnabledAudioTrack={this._onParticipantEnabledAudioTrack}
          onParticipantRemovedAudioTrack={this._onParticipantRemovedAudioTrack}
          onDataTrackMessageReceived={this._onDataTrackMessageReceived}
          onRoomParticipantDidConnect={this._onRoomParticipantDidConnect}
          onRoomParticipantDidDisconnect={this._onRoomParticipantDidDisconnect}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    twilio_connection: state.app_twilio.twilio_connection,
    template_id: state.template_store_reducer.templateid,
    random_values: state.random_value.random_values
  };
}

export default connect(mapStateToProps, {
  TwilioConnection,
  selectMicroTemplate,
  fetchMicroTemplatesuccess,
  RandomValues
})(withTranslation()(withComponentStateCache(Twilio)));

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    minHeight: "100%",
    backgroundColor: "#1A3A44"
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white"
  },
  button: {
    marginTop: 100
  },
  localVideoOnButtonEnabled: {
    bottom: "40%",
    width: "35%",
    left: "64%",
    height: "25%",
    zIndex: 2
  },
  close: {
    width: 12,
    height: 12
  },
  searchoutside: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    padding: 5
  },
  searchimg: {
    height: 25,
    width: 25,
    margin: 10
  },
  search: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: DEFAULT_BLACK_COLOR,
    borderRadius: 5,
    margin: 8
  },

  localVideoOnButtonDisabled: {
    bottom: "30%",
    width: "35%",
    left: "64%",
    height: "25%",
    zIndex: 2
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "column"
  },
  remoteVideo: {
    width: wp("20%"),
    height: hp("20%"),
    zIndex: 1
  },
  image: {
    flexDirection: "row",
    margin: 10,
    marginBottom: 10
  },
  remoteVideo1: {
    width: wp("100%"),
    height: hp("100%"),
    zIndex: 1
  },
  searchmedicine: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
  },
  divide: { height: 1, backgroundColor: "#e1e8ee" },
  remoteVideo2: {
    width: wp("100%"),
    height: hp("100%"),
    zIndex: 1
  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 2
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center"
  },
  spacing: {
    padding: 10
  },
  inputLabel: {
    fontSize: 18
  },
  buttonContainer: {
    height: normalize(45),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: wp("90%"),
    borderRadius: 30
  },
  loginButton: {
    backgroundColor: "#1E3378",
    width: wp("90%"),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 10
  },
  Buttontext: {
    color: "white",
    fontWeight: "500",
    fontSize: 18
  },
  inputBox: {
    borderBottomColor: "#cccccc",
    fontSize: 16,
    width: wp("95%"),
    borderBottomWidth: 1
  },
  minimizeCall: {
    position: "absolute",
    right: wp(2),
    top: wp(2),
    width: wp(20),
    height: wp(20),
    zIndex: 100,
    borderRadius: wp(15)
  }
});
