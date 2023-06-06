/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  PermissionsAndroid,
  Button as NativeButton,
  Platform,
  ActivityIndicator,
  Linking,
  BackHandler,
  Alert,
  Image,
  DeviceEventEmitter,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {Header, Container, Thumbnail, Button} from 'native-base';

import moment from 'moment';
import {connect} from 'react-redux';
import * as firebase from 'react-native-firebase';
import i18next from 'i18next';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {withTranslation} from 'react-i18next';
// actions and urls
import {getPostList2} from '../../../redux/actions/post_action';
import {getDoctorData} from '../../../redux/actions/retrieve_action';

// images

import Illustration from '../../../assets/images/illustration.svg';
import QrCodeScannerIcon from '../../../assets/images/qr_code_scanner.svg';
import NotificationIcon from '../../../assets/images/notification.svg';
import Close from '../../../assets/images/close.svg';
import Appointment from '../../../assets/images/appointments.svg';
import Patients from '../../../assets/images/patients.svg';
import CovidMonitoring from '../../../assets/images/covid_monitoring.svg';
import Forums from '../../../assets/images/forums.svg';
import Help from '../../../assets/images/help.svg';
import ForumsIllustration from '../../../assets/images/forums_illustration.svg';
import ForumsImage from '../../../assets/images/forums_illustration.png';

// styles
import styles from './LandingPageStyles';
// variable colors
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import getBaseUrl, {getApiUrl} from '../../../config/Config';
import * as permissions from 'react-native-permissions'; // you may also import just the functions or constants that you will use from this library
import {request, requestMultiple, PERMISSIONS} from 'react-native-permissions';
import i18n from '../../../../i18n';

// global constants
// const Realm = require("realm");
// let realm;

// import * as firebase from 'react-native-firebase';
// import i18next from 'i18next';
import VersionCheck from 'react-native-version-check';
import {doctorGetMethod} from '../../../services/DoctorProfileService';
import {
  getAllVirtualClinicUsers,
  sendNotificationToVirtualClinicUsers,
} from '../../../services/MyPracticeService';
import {getAuthorizations} from '../../../redux/actions/billing_action';
class LandingPage extends Component {
  constructor() {
    super();
    // realm = new Realm({
    //   schema: [
    //     {
    //       name: "Notifications",
    //       properties: {
    //         id: { type: "int", default: 0 },
    //         hlpid: "string",
    //         created_date: "string",
    //         title: "string",
    //         body: "string"
    //         // data:'data?'
    //       }
    //     }
    //   ]
    // });
    this.state = {
      defineURL: '',
      all: '',
      review: '',
      vip: '',
      hospital_branch: '',
      branch_name: '',
      new_patient: '',
      refreshing: false,
      profile_pic: require('../../../assets/images/doc.jpg'),
      aasha: 'No',
      isLoading: true,
      hospital_branchList: [],
      branchNameToDisplay: '',
      language: i18next.language,
      practiceModal: false,
      isVersionAlert: false,
      covidMonitoringTotalCount: 0,
      covidMonitoringActiveCount: 0,
      covidMonitoringHighRiskCount: 0,
      doctor_name: '',
      init: true,
    };
  }
  versionlinking = () => {
    BackHandler.exitApp();
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.healpha_doctor',
    );
    // this.setState({isVersionAlert:false})
  };
  versionlink = () => {
    Alert.alert(
      'Please Update',
      'You will have to update your app to the latest version to continue using',
      [
        {
          text: 'Update',
          onPress: () => this.versionlinking(),
        },
      ],
    );
  };

  init = async () => {
    // this.getDoctorName();
    // this.setState({isLoading: true});
    if (Platform.OS === 'android') {
      // try {
      //   PermissionsAndroid.requestMultiple([
      //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      //   ]).then((granted) => {
      //     Object.entries(granted).map(([key, value]) => {
      //       console.log(key, value);
      //     });
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ]).then(async statuses => {
        // console.log("Camera", statuses[PERMISSIONS.ANDROID.CAMERA]);

        // console.log("RECORD", statuses[PERMISSIONS.ANDROID.RECORD_AUDIO]);

        // console.log(
        //   "WRITE",
        //   statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]
        // );

        // console.log(
        //   "READ",
        //   statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]
        // );
        const setdeviceRegID = await AsyncStorage.getItem('is_reg_completed');

        console.log('false4', setdeviceRegID);
        setdeviceRegID == 'false'
          ? this.props.navigation.navigate('Profile')
          : this.init1();
      });
    } else {
      console.log('false5', setdeviceRegID);
      const setdeviceRegID = await AsyncStorage.getItem('is_reg_completed');
      setdeviceRegID == 'false'
        ? this.props.navigation.navigate('Profile')
        : this.init1();
    }
  };
  init1 = async () => {
    let scrollValue = 0;
    const setdeviceRegID = await AsyncStorage.getItem('setdeviceRegID');
    if (setdeviceRegID == 'true') {
      console.log('already set device');
    } else {
      this.checkPermission();
    }
    await this.getuser();
    // if (Platform.OS == "android") {
    await this.createNotificationListeners();
    // }
    await this.api1();

    if (Platform.OS == 'android') {
      VersionCheck.getLatestVersion({
        provider: 'playStore', // for Android
      }).then(latestVersion => {
        // console.log('latestVersion', latestVersion);
        this.setState({getLatestVersion1: latestVersion});
        // console.log(
        //   'VersionCheck.getCurrentVersion()',
        //   VersionCheck.getCurrentVersion(),
        // );
        this.setState({currentversion: VersionCheck.getCurrentVersion()});
        if (latestVersion > VersionCheck.getCurrentVersion()) {
          this.setState({isVersionAlert: true});
        } else {
          this.setState({isVersionAlert: false});
        }
      });
    }
  };
  getDoctorName = async () => {
    const doctor_profile_response = await doctorGetMethod();

    const doctor_object = doctor_profile_response?.data?.data;

    const doctor_name =
      doctor_object.first_name +
      ' ' +
      doctor_object.middle_name +
      ' ' +
      doctor_object.last_name;
    this.setState({
      doctor_name: doctor_name,
    });
  };
  componentDidMount = async () => {
    requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    ]).then(res => {
      console.log('permission on bluetooth');
    });
    this.init();
    this.props.navigation.addListener('willFocus', this._handleStateChange);
  };

  componentWillUnmount = async () => {
    // this.props.onRef(null);
  };

  _handleStateChange = async state => {
    // this.state.hospital_branch
    // if (this.state.init) {
    //   this.setState({ init: false });
    //   return;
    // }

    this.init();
  };

  api1 = async () => {
    try {
      let docid = await AsyncStorage.getItem('doctorid');

      await this.props.getPostList2({doctor_id: docid});
      let branch_id = await AsyncStorage.getItem('branch_id');
      let alone = await AsyncStorage.getItem('alone');
      if (branch_id) {
        global.standalone = alone;
        this.setState({hospital_branch: branch_id});
        this.checkAuthorization({
          branch_id: branch_id,
        });
      } else {
        this.setState({
          hospital_branch: this.props?.postList?.pract_details?.[0]?.branch_id,
        });
        global.standalone = this.props?.postList
          ? this.props?.postList?.pract_details.length > 0
            ? this.props?.postList?.pract_details[0]?.is_standalone
            : ''
          : '';
        this.checkAuthorization({
          branch_id: this.props?.postList?.pract_details[0]?.branch_id,
        });

        await AsyncStorage.setItem('alone', global.standalone);
        await AsyncStorage.setItem(
          'branch_id',
          this.props?.postList?.pract_details[0]?.branch_id,
        );
      }

      this.setState({
        branch_name: this.props?.postList?.pract_details?.[0]?.branch_name,
      });

      // console.log(
      //   this.props?.postList?.pract_details[0],
      //   'this.props?.postList?.pract_details[0]?.branch_id',
      // );

      let practice_id = await AsyncStorage.getItem('practice_id');
      if (!practice_id) {
        await AsyncStorage.setItem(
          'practice_id',
          this.props?.postList?.pract_details[0]?.practice_id,
        );
      }
      // else {
      //   await AsyncStorage.setItem(
      //     "practice_id",
      //     this.props?.postList?.pract_details[0]?.practice_id
      //   );
      // }

      let slotTime = await AsyncStorage.getItem('slot_timing');
      if (!slotTime) {
        await AsyncStorage.setItem(
          'slot_timing',
          this.props.postList.pract_details[0].slot_timing,
        );
      }

      this.props.postList.pract_details.filter((item, index) =>
        //console.log('props-State ', item.branch_name)
        this.state.hospital_branchList.push(item.branch_name),
      );

      // console.log('listBranches ', this.state.hospital_branchList);
      // console.log('listBranches ', this.state.hospital_branchList.length);

      if (this.state.hospital_branchList.length === 1) {
        // console.log('listBranches-Length == 1');
        //this.state.hospital_branchList.push(item.branch_name)
        // console.log('listBranchesName ', this.state.hospital_branchList);
        let branchName = this.state.hospital_branchList.toString();
        // console.log('listBranchesName ', branchName);
        this.setState({branchNameToDisplay: branchName});
        // console.log('listBranchesName ', this.state.branchNameToDisplay);
      }

      // this.props.postList.pract_details.map((item,index) => (
      //   //console.log('props-State ', item.branch_name)
      //   //this.setState({hospitalList: item.branch_name})
      //   //this.state.hospital_branchList.push(item.branch_name)

      // ))

      global.profile_image = this.props.postList.doc_details[0].profile_image;
      global.profile_image1 = this.props.postList.doc_details[0].profile_image;

      if (
        global.profile_image.trim() != '' &&
        global.profile_image != undefined &&
        global.profile_image != null
      ) {
        global.profile_image = {
          uri: getApiUrl() + '/' + global.profile_image.trim(),
        };
      } else {
        global.profile_image = require('../../../assets/images/doc.jpg');
      }
      const docid1 = await AsyncStorage.getItem('doctorid');
      if (docid !== null) {
        this.setState({docid: docid1});
        global.doctor_id = this.state.docid;
      }
      const tokenid = await AsyncStorage.getItem('userToken');
      if (tokenid !== null) {
        this.setState({token: tokenid});
        global.token = this.state.token;
      }
      let ob = JSON.stringify({
        docid: global.doctor_id,
        token: global.token,
        date: moment(new Date()).format('YYYYMMDD'),
        branchid: this.props.postList.pract_details[0].branch_id,
      });
      await this.props.getDoctorData(ob);
      const CovidMonitoringCounts =
        this.props.doctordata?.message?.count_data?.count;
      let totalCount =
        CovidMonitoringCounts?.active_patients + CovidMonitoringCounts?.closed;
      this.setState({
        all: this.props.doctordata?.message?.data?.all,
        new_patient: this.props.doctordata?.message?.data?.new_patient,
        review: this.props.doctordata?.message?.data?.review,
        vip:
          this.props.doctordata?.message?.data?.vip +
          this.props.doctordata?.message?.data?.emergency,
        isLoading: false,
        covidMonitoringTotalCount: totalCount,
        covidMonitoringActiveCount: CovidMonitoringCounts.active_patients,
        covidMonitoringHighRiskCount: CovidMonitoringCounts.high_risk,
      });
    } catch (error) {
      console.log('api try error', error.message);
    }
  };

  _onRefresh = async () => {
    const setdeviceRegID = await AsyncStorage.getItem('is_reg_completed');
    console.log('false1', setdeviceRegID);
    if (setdeviceRegID == 'false') {
      console.log('false2', setdeviceRegID);
      this.props.navigation.navigate('Profile');
    } else {
      console.log('false6', setdeviceRegID);
      this.setState({refreshing: true});
      await this.getuser();
      await this.createNotificationListeners();
      this.api1().then(item => {
        this.setState({refreshing: false});
      });
    }
  };
  hangupcall = () => {
    global.showredialalert = false;
    global.redialalert = false;
    alert(i18n.t('HEALPHACALL.EXIT_ROOM'));
    // DeviceEventEmitter.emit('eventTwilioDisconnect', {
    //   aashavalue: 'disconnect',
    // });
  };
  sendNotification = async (contentdata, data, answer, body) => {
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    console.log('poiuy', deviceToken);
    // if (this.state.reason) {
    global.redialalert = true;
    this.setState({send_notify: true});
    let url = getBaseUrl() + 'notify_healpha_call/';
    console.log('notifyhealphacall', url);
    let ocv = JSON.stringify({
      hlp: answer.split('@concent@')[2],
      doc: answer.split('@concent@')[4],
      token: global.token,
      content: contentdata,
      node_token: deviceToken,
      action:
        data +
        answer.split('@concent@')[1] +
        '@concent@' +
        answer.split('@concent@')[2] +
        '@concent@' +
        answer.split('@concent@')[3] +
        '@concent@' +
        answer.split('@concent@')[4] +
        '@concent@' +
        answer.split('@concent@')[5],
      source: 'patient',
    });
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ocv,
    })
      .then(response => response.json())
      .then(response => {
        // alert('Notification Send Successfully');
        return response.message;
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.error('notify_healpha_call', error);
      });
    // } else {
    //   alert('Please enter a reason');
    // }
  };

  sendNotificationToVirtualClinic = async (contentdata, data, answer, body) => {
    try {
      global.redialalert = true;
      this.setState({send_notify: true});

      const virtual_clinic_branch = await AsyncStorage.getItem(
        'virtual_clinic_branch',
      );

      const url =
        getBaseUrl() + `v1/virtual-clinic/${virtual_clinic_branch}/users/all`;

      const response = await getAllVirtualClinicUsers(url);

      const users = response?.data?.users || [];

      const php_token = await AsyncStorage.getItem('userToken');

      const nodeToken = await AsyncStorage.getItem('jwt_token');

      for (let i = 0; i < users?.length; i++) {
        const element = users[i];

        const payload = {
          action:
            data +
            answer.split('@concent@')[1] +
            '@concent@' +
            answer.split('@concent@')[2] +
            '@concent@' +
            answer.split('@concent@')[3] +
            '@concent@' +
            answer.split('@concent@')[4] +
            '@concent@' +
            answer.split('@concent@')[5],

          content: contentdata,
          doc: answer.split('@concent@')[4],
          hlp: element?.nh_id,
          source: 'patient',
          token: php_token,
          node_token: nodeToken,
        };
        console.log('payloadddddddddddd', payload);
        const notification_url = getBaseUrl() + `notify_healpha_call`;
        console.log('notifyhealphacall', notification_url);

        await sendNotificationToVirtualClinicUsers(notification_url, payload);
      }
    } catch (error) {
      console.error('virtual_clinic_branch', error);
      this.setState({isLoading: false});
    }
  };

  redialAlert = async (answer, body, status) => {
    if (global.showredialalert) {
    } else {
      global.showredialalert = true;
      const virtual_clinic_flag = await AsyncStorage.getItem(
        'virtual_clinic_flag',
      );

      global.redialalert = false;
      Alert.alert(
        status == 1
          ? i18n.t('HEALPHACALL.DECLINED')
          : i18n.t('HEALPHACALL.NO_RESPONSE'),
        body,
        [
          {
            text: i18n.t('HEALPHACALL.REDIAL'),
            onPress: () =>
              virtual_clinic_flag === 'true'
                ? this.sendNotificationToVirtualClinic(
                    i18n.t('HEALPHACALL.JOIN_CALL'),
                    'Healpha Call@concent@',
                    answer,
                    body,
                  )
                : this.sendNotification(
                    i18n.t('HEALPHACALL.JOIN_CALL'),
                    'Healpha Call@concent@',
                    answer,
                    body,
                  ),
          },
          {
            text: i18n.t('HEALPHACALL.GOBACK'),
            onPress: () => this.hangupcall(),
          },
        ],
        {cancelable: false},
      );
    }
  };
  componentWillUnmount() {
    this.notificationOpenedListener();
    this.notificationListener();
  }
  createNotificationListeners = () => {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body, action} = notification;
        console.log('body1', title, body, notification.notificationId);
        if (
          notification?.data?.click_action.split('@concent@')[0] ==
          'Healpha Call Declined'
        ) {
          firebase
            .notifications()
            .removeDeliveredNotification(notification.notificationId);
          if (body.toLowerCase().includes('not reachable') == true) {
            global.twilioconnected
              ? this.redialAlert(notification.data?.click_action, body, 0)
              : console.log('not connected');
          } else {
            global.twilioconnected
              ? this.redialAlert(notification.data?.click_action, body, 1)
              : console.log('not connected');
          }
        }
        const channelId = new firebase.notifications.Android.Channel(
          'Default',
          'Default',
          firebase.notifications.Android.Importance.High,
        );
        firebase.notifications().android.createChannel(channelId);

        let notification_to_be_displayed =
          new firebase.notifications.Notification({
            data: notification.data,
            sound: 'default',
            show_in_foreground: true,
            title: notification.title,
            body: notification.body,
            action: notification.action,
          });

        if (Platform.OS == 'android') {
          notification_to_be_displayed.android
            .setPriority(firebase.notifications.Android.Priority.High)
            .android.setChannelId('Default')
            .android.setVibrate(1000);
        }
        notification.setSound('default');
        firebase
          .notifications()
          .displayNotification(notification_to_be_displayed);
        // realm.write(() => {
        //   var ID = realm.objects("Notifications").length + 1;
        //   // alert(" realm data saved successfully"+ID);
        //   realm.create("Notifications", {
        //     id: ID,
        //     hlpid: global.doctor_id,
        //     created_date: new Date().toString(),
        //     title: notification.title,
        //     body: notification.body
        //     //   data:notification.data
        //   });
        // });
      });
    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        const data = notificationOpen.notification._data;
        if (
          data?.click_action == 'appointment' ||
          data?.click_action == 'Cancellation' ||
          data?.click_action == 'reschedule'
        ) {
          // this.props.navigation.navigate('MyAppointment')
        } else if (data?.click_action == 'vaccine') {
          //   this.props.navigation.navigate('ImmunizationScreen')
        } else if (data?.click_action == 'report_generated') {
          // this.props.navigation.navigate('EncounterTimeline')
        } else if (
          data?.click_action == 'telemedicine' ||
          data?.click_action == 'homecare'
        ) {
          // this.props.navigation.navigate('Telemedicine')
        } else if (data?.click_action == 'reset_password') {
          AsyncStorage.clear();
          // this.props.navigation.navigate('Welcome')
        } else if (data?.click_action == 'Healpha Call Declined') {
          {
            global.twilioconnected
              ? this.hangupcall()
              : console.log('not connected');
          }
        }
        firebase
          .notifications()
          .removeDeliveredNotification(
            notificationOpen.notification.notificationId,
          );
      });

    const notificationOpen = firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (
          data?.click_action == 'appointment' ||
          data?.click_action == 'Cancellation' ||
          data?.click_action == 'reschedule'
        ) {
          // this.props.navigation.navigate('MyAppointment')
        } else if (data?.click_action == 'vaccine') {
          //   this.props.navigation.navigate('ImmunizationScreen')
        } else if (data?.click_action == 'report_generated') {
          // this.props.navigation.navigate('EncounterTimeline')
        } else if (
          data?.click_action == 'telemedicine' ||
          data?.click_action == 'homecare'
        ) {
          // this.props.navigation.navigate('Telemedicine')
        } else if (data?.click_action == 'reset_password') {
          AsyncStorage.clear();
          // this.props.navigation.navigate('Welcome')
        } else if (data?.click_action == 'Healpha Call Declined') {
          {
            global.twilioconnected
              ? this.hangupcall()
              : console.log('not connected');
          }
        }
        firebase
          .notifications()
          .removeDeliveredNotification(
            notificationOpen.notification.notificationId,
          );

        if (notificationOpen) {
          //    alert("hi1"+(JSON.stringify(notificationOpen.notification._data)))
          // App was opened by a notification
          const notification = notificationOpen.notification;
          // var ID = realm.objects("Notifications").length + 1;
          // // alert(" realm data saved successfully"+ID);
          // realm.create("Notifications", {
          //   id: ID,
          //   hlpid: global.doctor_id,
          //   created_date: moment(new Date()).format("DD-MMM-YYYY hh:mm"),
          //   title: notification.title,
          //   body: notification.body
          //   //   data:notification.data
          // });
          firebase
            .notifications()
            .removeDeliveredNotification(
              notificationOpen.notification.notificationId,
            );
        }
        // }
      });

    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {});
    //process data message
    // console.log('JSON.stringify:', JSON.stringify(message));
    // });
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {});
    //process data message
    // console.log(JSON.stringify(messagnewdatae));
    // });
  };

  loadDeviceid = async deviceRegID => {
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    let url = getBaseUrl() + `v1/user/device-token`;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${deviceToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_id: deviceRegID,
        device_type: 'app',
      }),
    })
      .then(response => response.json())
      .then(response => {
        return true;
      })
      .catch(error => {
        console.error('device-token', error);
      });
  };

  getuser = async () => {
    try {
      const tokenid = await AsyncStorage.getItem('userToken');
      if (tokenid !== null) {
        this.setState({token: tokenid});
        global.token = this.state.token;
      }
      const docid = await AsyncStorage.getItem('doctorid');
      if (docid !== null) {
        this.setState({docid: docid});
        global.doctor_id = this.state.docid;
      }
      const docname = await AsyncStorage.getItem('doctorname');
      console.log('docname', docname);
      if (docname !== null) {
        // this.setState({docid: docid});
        console.log('docname', docname);
        global.doctor_name = docname;
      }
      const deviceRegID = await AsyncStorage.getItem('deviceRegID');
      global.deviceid = deviceRegID;
      //  alert(deviceRegID);
      await this.loadDeviceid(deviceRegID);

      return true;
    } catch (error) {
      console.log('error getuser');
    }
  };
  deviceRegistration = async () => {
    try {
      const enabled = await firebase.messaging().hasPermission();
      if (!enabled) {
        await firebase.messaging().requestPermission();
      }
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('deviceRegID', fcmToken);
        await AsyncStorage.setItem('setdeviceRegID', 'true');
      } else {
        // user doesn't have a device token yet, do nothing for now
      }
    } catch (error) {
      console.log('deviceRegistration', error);
      // Do nothing as of now
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.deviceRegistration();
    } catch (error) {
      // Permission rejected, do something
    }
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.deviceRegistration();
    } else {
      this.requestPermission();
    }
  };
  onValueChangehospital = async (value, label) => {
    //Archana 2021-06-19
    //added asyncstorage for hospital change because of not getting updated data based on branch in covid monitor
    await AsyncStorage.setItem('branch_id', value);
    this.setState({
      hospital_branch: value,
      aasha: value,
    });
    let ob = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      date: moment(new Date()).format('YYYYMMDD'),
      branchid: value,
    });
    await this.props.getDoctorData(ob);
    this.setState({
      all: this.props.doctordata?.message?.data?.all,
      new_patient: this.props.doctordata?.message?.data?.new_patient,
      review: this.props?.doctordata?.message?.data?.review,
      vip:
        this.props.doctordata?.message?.data?.vip +
        this.props.doctordata?.message?.data?.emergency,
    });
    let newdata = this.props.postList.pract_details.filter(item => {
      return item.branch_id == value;
    });
    this.setState({branch_name: newdata[0].branch_name});
    //Archana 2021-06-19
    //calling Doctor data for count update because of not getting updated data based on branch in covid monitor
    let ob1 = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      date: moment(new Date()).format('YYYYMMDD'),
      branchid: value,
    });
    await this.props.getDoctorData(ob1);

    const CovidMonitoringCounts =
      this.props.doctordata?.message?.count_data?.count;
    console.log(
      'CovidMonitoringCounts',
      CovidMonitoringCounts,
      CovidMonitoringCounts.active_patients,
    );
    let totalCount =
      CovidMonitoringCounts.active_patients + CovidMonitoringCounts.closed;

    this.setState({
      all: this.props.doctordata.message?.data?.all,
      new_patient: this.props.doctordata.message?.data?.new_patient,
      review: this.props.doctordata.message?.data?.review,
      vip:
        this.props.doctordata.message?.data?.vip +
        this.props.doctordata.message?.data?.emergency,
      isLoading: false,
      covidMonitoringTotalCount: totalCount,
      covidMonitoringActiveCount: CovidMonitoringCounts.active_patients,
      covidMonitoringHighRiskCount: CovidMonitoringCounts.high_risk,
    });
  };

  renderPracticeList() {
    this.setState({
      practiceModal: true,
    });
  }

  closeModal() {
    this.setState({
      practiceModal: false,
    });
  }

  checkAuthorization = async ({branch_id}) => {
    await getAuthorizations({branch_id}).then(res => {
      if (res) {
        let data = res.access;
        global.AuthCancel = data?.isAuthorizedToCancelService;
        global.AuthBilling = data?.isAuthorizedToDoBilling;
        global.AuthDiscount = data?.isAuthorizedToGiveDiscount;
        global.AuthPaylater = data?.isAuthorizedToPayLater;
      }
    });
  };

  changeHospital = async (branchId, ele) => {
    await AsyncStorage.setItem(
      'slot_timing 123',
      ele?.slot_timing + '   ' + ele?.op_branch_work_timings[0]?.standalone,
    );
    await AsyncStorage.setItem(
      'alone',
      ele ? ele?.op_branch_work_timings[0]?.standalone : '',
    );
    global.standalone = ele?.op_branch_work_timings[0]?.standalone;
    this.onValueChangehospital(branchId);
    this.checkAuthorization({branch_id: branchId});
    this.closeModal();
  };

  renderPracticeClinics() {
    const pract_details = this.props.postList.pract_details;
    if (pract_details && pract_details.length) {
      return pract_details.map((ele, index) => (
        <TouchableOpacity
          testID={ele.branch_name + 'touch'}
          accessibilityLabel={ele.branch_name + 'touch'}
          onPress={() => this.changeHospital(ele.branch_id, ele)}
          style={{paddingTop: 10, paddingBottom: 5}}
          key={index}>
          <Text
            style={{fontSize: 16}}
            testID={ele.branch_name + 'text'}
            accessibilityLabel={ele.branch_name + 'text'}>
            {ele.branch_name}
          </Text>
        </TouchableOpacity>
      ));
    } else {
      return '';
    }
  }
  checkCameraPermissionAndRedirect = async (data1, data2, data3) => {
    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (!result) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission Required',
            message: 'Healpha requires camera to access to access this feature',
            buttonPositive: 'Ok',
          },
        );
        this.props.navigation.navigate('QrCodeScanner', {
          branch_id: data1,
          branch_name: data2,
          aasha: data3,
        });
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   this.props.navigation.navigate('QrCodeScanner')
        // } else {
        //   console.log("Camera permission denied");//toast message
        // }
      } catch (err) {
        console.warn(err);
      }
    } else {
      this.props.navigation.navigate('QrCodeScanner', {
        branch_id: data1,
        branch_name: data2,
        aasha: data3,
      });
    }
  };
  renderPracticeModal() {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.practiceModal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          {/* title and close modal actions start */}
          <View
            style={[
              styles.headerView,
              {
                paddingBottom: 5,
              },
            ]}>
            <Text
              style={styles.headerText}
              testID="selectPracticeText"
              accessibilityLabel="selectPracticeText">
              {t('DASHBOARD.SELECT_PRACTICE')}
            </Text>
            <View style={styles.closeView}>
              <TouchableOpacity
                testID="closeTouch"
                accessibilityLabel="closeTouch"
                style={styles.touchableArea}
                onPress={() => this.closeModal()}>
                <Close
                  height={18}
                  width={18}
                  style={styles.closeImage}
                  testID="closeImage"
                  accessibilityLabel="closeImage"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* title and close modal actions end  */}

          {/* practice list start */}
          {this.renderPracticeClinics()}
        </View>
      </Modal>
    );
  }

  renderInitialClinic = () => {
    const pract_details = this.props.postList.pract_details;
    const {hospital_branch} = this.state;

    if (pract_details && pract_details.length) {
      const [initialHospital] = pract_details?.filter(item => {
        return item.branch_id === hospital_branch;
      });
      if (initialHospital) {
        setTimeout(async () => {
          await AsyncStorage.setItem('branch_id', initialHospital.branch_id);
        }, 1000);
        global.branch_name = initialHospital.branch_name;
        return initialHospital.branch_name;
      }
    }
    return '';
  };

  renderTextAndNumber(text, number, testID) {
    return (
      <View style={styles.textNumberMainView}>
        <View style={styles.textViewWidth}>
          <Text
            style={styles.textStyles}
            testID={testID}
            accessibilityLabel={testID}>
            {text}
          </Text>
        </View>
        <View style={styles.numberView}>
          <Text style={styles.numberTextStyles}>{number}</Text>
        </View>
      </View>
    );
  }

  covidMonitoringNavigation = async () => {
    await AsyncStorage.setItem('branch_id', this.state.hospital_branch);
    this.props.navigation.navigate('HeaderBar', {
      doctor_id: this.state.docid,
      branch_id: this.state.hospital_branch,
      token: global.token,
      doc_name: global.doctor_name,
    });
  };
  // render section
  render() {
    // loader section
    const {t} = this.props;
    if (this.state.isVersionAlert) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.versionlink()}
          {/* <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} /> */}
        </View>
      );
    }
    if (this.state.isLoading) {
      return (
        <View style={styles.loaderView}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <Container style={styles.containerStyles}>
        {/* Header bar section start */}
        <Header
          style={{backgroundColor: APP_PRIMARY_COLOR, borderBottomWidth: 0}}>
          <StatusBar
            backgroundColor={APP_PRIMARY_COLOR}
            barStyle={'light-content'}
          />
          <View style={styles.headerBarMainView}>
            <View style={styles.headerNameView}>
              <Text
                style={styles.welcomeText}
                testID="welcomeText"
                accessibilityLabel="welcomeText">
                {t('DASHBOARD.WELCOME_TEXT')}
                <Text
                  style={styles.doctorNameText}
                  testID="doctorNameText"
                  accessibilityLabel="doctorNameText">
                  {global.doctor_name}
                </Text>
              </Text>
            </View>

            <View style={styles.profileNotificationMainView}>
              {/* <View style={[styles.marginRight20, styles.notificationView]}> */}
              <TouchableOpacity
                style={{marginRight: 10, top: -15}}
                onPress={
                  () =>
                    this.checkCameraPermissionAndRedirect(
                      this.state.hospital_branch,
                      this.state.branch_name,
                      this.state.aasha,
                    )
                  // this.props.navigation.navigate('QrCodeScanner', {
                  //   branch_id: this.state.hospital_branch,
                  //   branch_name: this.state.branch_name,
                  //   aasha: this.state.aasha,
                  // })
                }>
                {/* <Image
                  source={require('../../../assets/menuitems/qrscan.png')}
                  style={{height: 25, width: 25, marginLeft: 0, marginTop: 8}}
                /> */}
                <QrCodeScannerIcon />
              </TouchableOpacity>
              {/* </View> */}
              <View style={[styles.marginRight20, styles.notificationView]}>
                <TouchableOpacity
                  style={styles.touchableView}
                  onPress={() =>
                    this.props.navigation.navigate('notificationsList')
                  }>
                  <NotificationIcon
                    testID="notificationIcon"
                    accessibilityLabel="notificationIcon"
                    height={20}
                    width={20}
                    style={styles.notificationIconStyles}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.itemsEnd, styles.notificationView]}>
                <TouchableOpacity
                  style={styles.touchableView}
                  onPress={
                    () => this.props.navigation.openDrawer()
                    // this.props.navigation.navigate('ProfileDrawer')
                  }>
                  <Thumbnail
                    testID="profileImage"
                    accessibilityLabel="profileImage"
                    style={styles.profileIconStyles}
                    small
                    source={
                      global.profile_image
                        ? global.profile_image
                        : this.state.profile_pic
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Header>

        {/* Header bar section start */}

        <View style={styles.imageView}>
          <Illustration
            testID="doctorImage"
            accessibilityLabel="doctorImage"
            height={'100%'}
            width={'100%'}
            style={styles.imageBackgroundStyles}
          />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={styles.flex1}>
          <View style={styles.flex1}>
            <View style={[styles.hospitalSectionMainView]}>
              <View style={styles.hospitalTextView}>
                <Text
                  style={styles.hospitalText}
                  testID="hospitalText"
                  accessibilityLabel="hospitalText">
                  {this.renderInitialClinic()}
                </Text>
              </View>

              <View style={styles.changeButtonView}>
                <NativeButton
                  testID="changeButton"
                  accessibilityLabel="changeButton"
                  onPress={() => this.renderPracticeList()}
                  title={t('DASHBOARD.CHANGE')}
                  color={APP_PRIMARY_COLOR}
                />
              </View>
            </View>

            <View style={[styles.actionsMainView]}>
              <View style={styles.appointmentMainView}>
                <TouchableOpacity
                  style={styles.touchableStyles}
                  onPress={() => {
                    this.props.navigation.navigate('HomeScreen', {
                      branch_id: this.state.hospital_branch,
                      branch_name: this.state.branch_name,
                      aasha: this.state.aasha,
                      qr_code_hlp_id: '',
                    });
                  }}
                  testID="appointmentsButton"
                  accessibilityLabel="appointmentsButton">
                  <View style={styles.cardNameAndImageSection}>
                    <Text
                      style={styles.cardText}
                      testID="appointmentsText"
                      accessibilityLabel="appointmentsText">
                      {t('DASHBOARD.APPOINTMENTS')}
                    </Text>
                    <Appointment
                      testID="appointmentImage"
                      accessibilityLabel="appointmentImage"
                      height={30}
                      width={30}
                      style={styles.imageStyles}
                    />
                  </View>

                  <View style={styles.cardNumberTextView}>
                    {this.renderTextAndNumber(
                      t('DASHBOARD.TOTAL'),
                      this.state.all,
                      'totalText',
                    )}
                    {this.renderTextAndNumber(
                      t('DASHBOARD.VIP'),
                      this.state.vip,
                      'vipEmergencyText',
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.actionsMainView]}>
              <View style={styles.appointmentMainView}>
                <TouchableOpacity
                  style={styles.touchableStyles}
                  onPress={() => {
                    this.props.navigation.navigate('ListOfPatients', {
                      docid: this.state.docid,
                      branch_id: this.state.hospital_branch,
                      profile_pic: global.profile_image
                        ? global.profile_image
                        : this.state.profile_pic,
                      doc_name: global.doctor_name,
                      navigation:this.props.navigation

                    });
                    // this.props.navigation.navigate('OldPatient', {
                    //   docid: this.state.docid,
                    //   branch_id: this.state.hospital_branch,
                    //   profile_pic: global.profile_image
                    //     ? global.profile_image
                    //     : this.state.profile_pic,
                    //   doc_name: global.doctor_name,
                    //   navigation: this.props.navigation,
                    // });
                  }}
                  testID="patientsButton"
                  accessibilityLabel="patientsButton">
                  <View style={styles.cardNameAndImageSection}>
                    <Text
                      style={styles.cardText}
                      testID="patientsText"
                      accessibilityLabel="patientsText">
                      {t('DASHBOARD.PATIENTS')}
                    </Text>
                    <Patients
                      testID="patientsImage"
                      accessibilityLabel="patientsImage"
                      height={30}
                      width={30}
                      style={styles.imageStyles}
                    />
                  </View>
                  <View style={styles.cardNumberTextView}>
                    {this.renderTextAndNumber(
                      t('DASHBOARD.TOTAL'),
                      this.state.new_patient + this.state.review,
                      'totalText',
                    )}
                    {this.renderTextAndNumber(
                      t('DASHBOARD.NEW'),
                      this.state.new_patient,
                      'newText',
                    )}
                    {this.renderTextAndNumber(
                      t('DASHBOARD.REVIEWS'),
                      this.state.review,
                      'reviewsText',
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.actionsMainView]}>
              <View style={styles.appointmentMainView}>
                <TouchableOpacity
                  style={styles.touchableStyles}
                  onPress={() => {
                    // this.covidMonitoringNavigation();
                    this.props.navigation.navigate('CovidMonitoringDashboard', {
                      doctor_id: this.state.docid,
                      branch_id: this.state.hospital_branch,
                      token: global.token,
                      doc_name: global.doctor_name,
                    });
                  }}
                  testID="covidmonitoringButton"
                  accessibilityLabel="covidmonitoringButton">
                  <View style={styles.cardNameAndImageSection}>
                    <Text
                      style={styles.cardText}
                      testID="covidMonitoringText"
                      accessibilityLabel="covidMonitoringText">
                      {t('DASHBOARD.COVID_MONITORING')}
                    </Text>
                    <CovidMonitoring
                      testID="covidMonitoringImage"
                      accessibilityLabel="covidMonitoringImage"
                      heigh={30}
                      width={30}
                      style={styles.imageStyles}
                    />
                  </View>
                  <View style={styles.cardNumberTextView}>
                    {this.renderTextAndNumber(
                      t('DASHBOARD.TOTAL'),
                      this.state.covidMonitoringTotalCount,
                      'totalText',
                    )}
                    {this.renderTextAndNumber(
                      t('DASHBOARD.ACTIVE'),
                      this.state.covidMonitoringActiveCount,
                      'activeText',
                    )}
                    {this.renderTextAndNumber(
                      t('DASHBOARD.HIGH_RISK'),
                      this.state.covidMonitoringHighRiskCount,
                      'highRiskText',
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={[styles.actionsMainView]}>
              <View style={styles.appointmentMainView}>
                <TouchableOpacity
                  style={styles.touchableStyles}
                  onPress={() => {
                    // this.covidMonitoringNavigation();
                    this.props.navigation.navigate('flatlist', {
                      doctor_id: this.state.docid,
                      branch_id: this.state.hospital_branch,
                      token: global.token,
                      doc_name: global.doctor_name,
                    });
                  }}> */}
            {/* <View style={styles.cardNameAndImageSection}>
                    <Text style={styles.cardText}>
                      {t('New')}
                    </Text>
                   /* <CovidMonitoring
                      heigh={30}
                      width={30}
                      style={styles.imageStyles}
                    />
                  </View>*/}
            {/* <View style={styles.cardNumberTextView}>
                    {this.renderTextAndNumber(
                      t('DASHBOARD.TOTAL'),
                      this.state.covidMonitoringTotalCount,
                    )}
                  </View> */}
            {/* </TouchableOpacity>
              </View>
            </View> */}

            <View style={[styles.actionsMainView]}>
              {/* <View style={styles.flexDirectionRow}>
                <View
                  style={[styles.forumSectionMainView, styles.marginRight5]}>
                  <View>
                    <Text style={styles.heAlphaHealthForums}>
                      {t('DASHBOARD.HEALPHA_HEALTH_FORUMS')}
                    </Text>
                    <Text style={styles.AskAndDiscussText}>
                      {t('DASHBOARD.DISCUSS_ASK_QUESTION')}
                    </Text>
                    <Button
                      style={styles.askQuestionButton}
                      onPress={() => this.props.navigation.navigate('Forums')}>
                      <Text style={styles.askQuestionButtonText}>
                        {t('DASHBOARD.ASK_QUESTION')}
                      </Text>
                    </Button> */}

              <TouchableOpacity
                style={styles.illusMainView}
                onPress={() => this.props.navigation.navigate('Forums')}
                testID="forumsButton"
                accessibilityLabel="forumsButton">
                <View style={styles.illusTabView}>
                  <View style={styles.contentSec}>
                    <View>
                      <Text
                        style={styles.illusHeading}
                        testID="healphaHealthForumsText"
                        accessibilityLabel="healphaHealthForumsText">
                        {t('DASHBOARD.HEALTH_FORUMS')}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={styles.illusSubHeading}
                        testID="discussAndAskQuestionsText"
                        accessibilityLabel="discussAndAskQuestionsText">
                        {t('DASHBOARD.DISCUSS_ASK_QUES')}
                      </Text>
                    </View>
                    <View style={styles.illusBtnWrap}>
                      {/* <Button style={styles.illusBtn} onPress={() => this.props.navigation.navigate('Forums')}>
                          <Text style={styles.illusBtnText}>Ask a Question</Text>
                        </Button> */}
                    </View>
                  </View>
                  <View style={styles.forumsImageView}>
                    <Image
                      source={ForumsImage}
                      style={styles.flex}
                      testID="forumsImage"
                      accessibilityLabel="forumsImage"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {/* </View> */}
              {/* </View> */}
              {/* </View> */}
            </View>
          </View>
        </ScrollView>
        {this.state.practiceModal && this.renderPracticeModal()}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  postList: state.postList.postList,
  doctordata: state.doctor_reducer.getDoctorData,
  fetching: state.doctor_reducer.DoctorDataFetching,
});

export default connect(mapStateToProps, {getPostList2, getDoctorData})(
  withTranslation()(LandingPage),
);
