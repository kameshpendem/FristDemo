import React, {Component, version} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  processColor,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  Linking,
  Alert,
  PermissionsAndroid,
  Platform,
  BackHandler,
  DeviceEventEmitter
} from 'react-native';
import {
  Row,
  Col,
  Thumbnail,
  DatePicker,
  Footer,
  FooterTab,
  Button,
  Item,
  Label,
  Icon,
  Header,
  Container,
  Content,
} from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';
import {connect} from 'react-redux';
import {getOldList} from '../../redux/actions/oldpatient_action';
import {getReportList} from '../../redux/actions/report_action';
import {SearchBar, Overlay} from 'react-native-elements';
import moment from 'moment';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
import {getCountryCode} from '../../utils/CountryCode';
import i18n from '../../../i18n';
import {TwilioConnection} from '../../redux/actions/TwilioActions';
import AsyncStorage from '@react-native-community/async-storage';
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
//   console.log('10 ' + new Date() + JSON.stringify(message));
//   await ws.send(JSON.stringify(message));
//   console.log('222', await ws.send(JSON.stringify(message)));
//   console.log('11 ws=' + ws + ' date=' + new Date() + JSON.stringify(message));
// };

class OldPateint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docid: this.props.navigation.state.params.docid,
      branch_id: this.props.navigation.state.params.branch_id,
      encid: 'select',
      hlpid: 'select',
      query2: '',
      query3: '',
      onclicked: false,
      loading: true,
      profile_pic: this.props.navigation.state.params.profile_pic,
      value: '',
      keydata: '',
      timeline: [],
      persontimeline: [],
      onlineusers1: [],
      videocall: '',
      timelenedata: [],
      refreshing: false,
    };
    this.arrayholder = [];
    this.handleBackPress = this.handleBackPress.bind(this);
    this.init();
    DeviceEventEmitter.addListener('eventOldPatStartConsultation', (e) => {
      {e.selectTemplate=="true"?
      this.connected1('yes'):this.connected1('no')}
    });
  }

  init = async () => {
    console.log("twilioold")
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
    this.props.navigation.addListener('willFocus', this._handleStateChange);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    if (!this.state.open_consult_popup) {
      return;
    }
    await this.findTimelineData1(this.state.hlpid);
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
      date: '',
    });

    if (!this.props.oldList.message || this.props.oldList.message.length <= 0) {
      return;
    }

    const [patient] = this.props.oldList.message.filter(
      (each) => each.enc_id === this.state.enc_id,
    );
      console.log("patient234",patient)
    this.openOverlay1(
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
      moment(patient.dob).format('YYYY-MM-DD'),
      patient.blood_group,
      patient.middle_name != '' && patient.middle_name != null
        ? patient.salutation +
            '.' +
            patient.first_name +
            ' ' +
            patient.middle_name +
            ' ' +
            patient.last_name
        : patient.salutation +
            '.' +
            patient.first_name +
            ' ' +
            patient.last_name,
      patient.hlpid,
      this.state.profile_pic,
      patient.salutation,
      patient.encounter_type,
      patient.phone_code,
      patient.version
    );
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress() {
    this.props.navigation.goBack(null);
    return true;
  }

  _handleStateChange = (state) => {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
    if (this.state.open_consult_popup) {
      this.handleBackPress();
    }
  };

  componentDidUpdate = () => {
    console.log("did update")
    //webrtc connection issue 2022/05/05
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
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search Here..."
        round
        lightTheme
        showLoadingIcon
        onChangeText={(text) => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
        containerStyle={{
          backgroundColor: '#E9E9EF',
          height: 24,
          marginBottom: 30,
        }}
        inputStyle={{backgroundColor: '#EEE', fontSize: 12}}
      />
    );
  };
  dialCall = () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${this.state.p_phone}`;
    } else {
      phoneNumber = `telprompt:${this.state.p_phone}`;
    }

    Linking.openURL(phoneNumber);
  };
  openOverlay1 = (
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
  ) => {
    console.log(
      '1' + phone_no,
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
      enc_version
    );
   //webrtc connection issue 2022/05/05
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
  closeOverlay1 = async () => {
    if (this.state.open_consult_popup) {
      this.setState({
        confirm_modal: false,
      });
      this.handleBackPress();
      return;
    }

    if (this.state.reason != '') {
      this.setState({confirm_modal: false});
    } else {
      this.setState({
        confirm_modal: false,
        reason: true,
      });
    }
    this.state.reason = '';
  };
  reason = (text) => {
    // alert(text)
    this.setState({
      reason: text,
      valid: false,
    });
  };
  telemedicinevideocall = () => {
    console.log('123');
    // this.setState({videocall:"yes"})
    // this.connected1('yes');
    this.heAlphaCall()
  };
  telemedicinevideocall1 = () => {
    console.log('234');
    // this.setState({videocall:"no"})
    alert(
      'PatienssssssearchFilterFunctionearchFilterFunctionearchFilterFunctionearchFilterFunctionearchFilterFunctionearchFilterFunctiont is not reachable please enter a reason',
    );
  };

heAlphaCall = async() => {
  await AsyncStorage.setItem('twilioEncid', this.state.enc_id+'_'+this.state.enc_version);
  await AsyncStorage.setItem('twilioPerHlpid', this.state.hlpid1);
  await AsyncStorage.setItem('twilioPerName', this.state.name.split('.')[1]);
  await AsyncStorage.setItem('selectTemplate', this.state.confirm_modal?"true":"false");
  await AsyncStorage.setItem('consult', "false");
  await AsyncStorage.setItem('fromPage', "oldpatient");
  this.setState(
    {
      call: false,
      confirm_modal: false,
      confirm_modal1: false,
      visible: false,
    },
    () => this.props.TwilioConnection(true),
  );
};
  sendnotification = async () => {
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    console.log('poiuy', deviceToken);
    let url = getBaseUrl() + 'notify_patient/';
    console.log('urllllllllllllllllllllllll',url);
    let ocv = JSON.stringify({
      hlp: this.state.hlpid,
      doc: global.doctor_id,
      token: global.token,
      node_token: deviceToken,
      content: this.state.reason,
    });
    console.log('ocv', ocv);
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ocv,
    })
      .then((response) => response.json())
      .then((response) => {
        alert(i18n.t('COVID_MONITORING.SUCC'));
        return response.message;
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.error(error);
      });
  };
  connected1 = async (videocall) => {
    // console.log(this.state.tmp_status)
    // alert(this.state.tmp_uid.replace(/&/g,"."))
    // alert(JSON.stringify(obc))
    // console.log(this.state.plist)
    this.setState({
      confirm_modal: false,
    });
    console.log(
      'connected1' + this.state.hlpid,
      this.state.enc_id,
      this.state.hspname,
      this.state.template_name,
      this.state.template_id,
      this.state.branch_id,
      this.state.gender,
      this.state.plist,
      this.state.age,
      this.state.dob,
      this.state.blood_group,
      this.state.name,
      this.state.hlpid1,
      this.state.profile_pic,
    );
    this.props.navigation.navigate('Consult', {
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
      videocall: videocall == 'yes' ? 'yes' : 'no',
      appointment_type: this.state.encounter_type,
      screen: 'timelene',
    });
  };
  searchFilterFunction = (text) => {
    this.setState({
      value: text,
    });
    if (text != '') {
      const newData = this.arrayholder.filter((item) => {
        let p = moment(item.schedule_date).format('YYYY-MMM-DD').split('-');
        const textData = text.toUpperCase();
        return (
          item.encounterCode.toUpperCase().indexOf(textData) > -1 ||
          item.encounter_status.toUpperCase().indexOf(textData) > -1 ||
          item.first_name.toUpperCase().indexOf(textData) > -1 ||
          item.last_name.toUpperCase().indexOf(textData) > -1 ||
          item.middle_name.toUpperCase().indexOf(textData) > -1 ||
          item.hlpid.toUpperCase().indexOf(textData) > -1 ||
          item.first_name.toUpperCase().indexOf(textData) +
            ' ' +
            item.last_name.toUpperCase().indexOf(textData) >
            -1 ||
          item.first_name.toUpperCase().indexOf(textData) +
            ' ' +
            item.middle_name.toUpperCase().indexOf(textData) +
            ' ' +
            item.last_name.toUpperCase().indexOf(textData) >
            -1 ||
          p[0].toUpperCase().indexOf(textData) > -1 ||
          p[1].toUpperCase().indexOf(textData) > -1 ||
          p[2].toUpperCase().indexOf(textData) > -1
        );
      });
      this.setState({
        timeline: newData,
      });
    } else {
      this.setState({
        timeline: this.arrayholder,
      });
    }
  };

  componentDidMount = async () => {
    if (Platform.OS === 'android') {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]).then((granted) => {
          Object.entries(granted).map(([key, value]) => {
            console.log(key, value);
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    // this.getData("person","select","select");
    //   }
    //   getData=async(key,hlpid,encid)=>{
    //     await this.props.getOldList({
    //       "docid":this.state.docid,
    //       "token":global.token,
    //       "hlpid":hlpid,
    //       "encid":encid,
    //       "branch":this.state.branch_id,
    //       "key":key,
    //       "date":""
    //       })

    //       if(this.props.oldList.message==3){

    //       }
    //       else{

    //          this.state.timeline=this.props.oldList.message;

    //       // alert(JSON.stringify(this.state.timeline[this.state.timeline.length-1].id))

    //       // this.arrayholder=[...this.arrayholder,...this.props.oldList.message];
    //     }
    //webrtc connection issue 2022/05/05
    // ws.onmessage = (msg) => {
    //   console.log('4 Got message', msg.data);
    //   const data = JSON.parse(msg.data);
    //   console.log('5 online=' + data.onlineusers);
    //   switch (data.type) {
    //     case 'online_users':
    //       //    alert("online called");
    //       this.setState({onlineusers1: data.onlineusers});
    //       // online_user(data.onlineusers)
    //       break;
    //     case 'close':
    //       this.setState({onlineusers1: data.onlineusers});
    //       //    alert("online called");
    //       // online_user(data.onlineusers)
    //       break;
    //     default:
    //       break;
    //   }
    // };
    this.setState({loading: false});
  };
  getData2 = async (key, hlpid, encid) => {
    console.log(
      '123456',
      'docid:',
      this.state.docid,
      'token:',
      global.token,
      'hlpid:',
      hlpid,
      'encid:',
      encid,
      'branch:',
      this.state.branch_id,
      'key:',
      key,
    );
    await this.props.getOldList({
      docid: this.state.docid,
      token: global.token,
      hlpid: hlpid,
      encid: encid,
      branch: this.state.branch_id,
      key: key,
      date: '',
    });
    //alert("data="+JSON.stringify(this.props.oldList.message))
    if (this.props.oldList.message == 3) {
      Alert.alert('There are no old encounters for this person', '', [
        {
          text: 'Ok',
          onPress: () => this.props.navigation.navigate('LandingPage'),
        },
      ]);
    } else {
      this.state.persontimeline = this.props.oldList.message.reverse();
      // alert(JSON.stringify(this.state.timeline[this.state.timeline.length-1].id))
      // this.arrayholder=[...this.arrayholder,...this.props.oldList.message];
    }
    this.setState({loading: false});
    this.setState({timelenedata: []});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getData().then((item) => {
      console.log('res=' + JSON.stringify(item));
      this.setState({refreshing: false});
    });
  };
  renderFooter = () => {
    return (
      <View>
        {this.state.timeline.length > 0 && <ActivityIndicator size="large" />}
      </View>
    );
  };
  handleLoadMore = () => {
    this.setState(
      {
        maxid: this.state.timeline[this.state.timeline.length - 1].id,
      },
      () => {
        this.getData();
      },
    );
  };
  findTimelineData1 = async (query2) => {
    console.log(query2 + ' ' + query2.length + ' ' + this.state.search_flg);
    if (query2 === '') {
      this.setState({timelenedata: []});
    } else if (query2.length >= 3) {
      let url = getBaseUrl() + 'docapp_timeline_search/';
      let ob = JSON.stringify({
        token: global.token,
        doc_id: global.doctor_id,
        key: query2,
      });
      console.log(url + ' ' + ob);
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: ob,
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('persondata', response.message);
          if (response) {
            this.setState({timelenedata: response.message});
          } else {
            return [];
          }
        });
    } else {
      this.setState({timelenedata: []});
    }
  };
  findTimelineData(query2) {
    console.log('query2' + query2);
    if (query2 === '') {
      console.log('12354');
      return [];
    } else if (query2.length >= 3) {
      const {timeline} = this.state;
      const regex = new RegExp(
        `${query2.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
        'i',
      );
      let newData = [];

      newData =
        timeline.length > 0
          ? timeline.filter(
              (timelinedata) =>
                timelinedata.first_name
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.last_name
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.middle_name
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.hlpid
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.phone_no
                  .replace(/([\.\phone_no^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.email
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0,
            )
          : [];
      console.log('12345', newData);
      return newData;
    } else {
      return [];
    }
  }
  render() {
    if (this.state.confirm_modal == true) {
      console.log('12345');
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible={this.state.confirm_modal} height={260}>
            {/* <Text allowFontScaling={false}style={{fontSize:15,fontWeight:"bold",marginLeft:80}}>Select Template</Text> */}
            {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
            <ScrollView style={{marginTop: 15}}>
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
                  <Col style={{alignSelf: 'center'}}>
                    <View style={{flexDirection: 'row', marginRight: 20}}>
                      <Text style={{textAlign: 'center'}}>
                        <Text style={{textTransform: 'capitalize'}}>
                          Dr.{global.doctor_name}
                        </Text>{' '}
                        Please call patient{' '}
                        <Text style={{textTransform: 'capitalize'}}>
                          {this.state.p_salutation + ' ' + this.state.name}
                        </Text>{' '}
                        on
                      </Text>
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <View style={{flexDirection: 'row', marginLeft: 1}}>
                      <Text
                        style={{
                          fontSize: 21,
                          color: '#517fa4',
                          textDecorationLine: 'underline',
                        }}
                        onPress={() => this.dialCall()}>
                        {this.state.p_phone}
                      </Text>
                      <TouchableOpacity
                        onPress={async () => {
                          const country_code = await getCountryCode();
                          Linking.openURL(
                            'https://api.whatsapp.com/send?phone=' +
                              this.state.phone_code.split('+')[1] +
                              this.state.p_phone,
                          );
                        }}>
                        <Image
                          style={{height: 25, width: 25, marginLeft: 15}}
                          source={require('../../assets/images/whatsapp.png')}
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
                              marginLeft: 15,
                            }}
                          />
                        </TouchableOpacity>
                    </View>
                  </Col>
                </Row>
                <Text style={{textAlign: 'center'}}>
                  If patient is not reachable please add reason and click on
                  send
                </Text>
                <Row>
                  <Col>
                    <TextInput
                      allowFontScaling={false}
                      placeholder="Enter Reason"
                      // autoFocus='true'
                      placeholderTextColor={'#2D323C'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={this.state.reason}
                      style={styles.input}
                      onChangeText={(text) => this.reason(text)}
                    />
                    {this.state.valid && (
                      <Text style={{fontSize: 12, color: 'red'}}>
                        Please enter reason
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
            <Row style={{marginLeft: 5}}>
              <Col>
                <Button
                  onPress={() => this.sendnotification()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: 'center',
                    height: 30,
                    width: 70,
                    marginLeft: 10,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: 'white',
                      alignItems: 'center',
                    }}>
                    Send
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.connected1()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: 'center',
                    height: 30,
                    width: 70,
                    marginLeft: 10,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: 'white',
                      alignItems: 'center',
                    }}>
                    Connect
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.closeOverlay1()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    height: 30,
                    width: 70,
                    justifyContent: 'center',
                    marginLeft: 10,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 12,
                      color: 'white',
                      alignItems: 'center',
                    }}>
                    Back
                  </Text>
                </Button>
              </Col>
            </Row>
          </Overlay>
        </View>
      );
    }
    const {query2} = this.state;
    const timelenedata = this.findTimelineData(query2);
    console.log(timelenedata);
    console.log(timelenedata[0]);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    const {oldList, isFetching16, encList, isFetching15} = this.props;

    return (
      // <ScrollView refreshControl={
      //   <RefreshControl
      //     refreshing={this.state.refreshing}
      //     onRefresh={this._onRefresh}
      //   />}>
      <Container>
        <Content>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.autocompleteContainer}
              data={
                this.state.timelenedata.length > 0
                  ? this.state.timelenedata
                  : []
              }
              defaultValue={query2}
              onChangeText={(text) =>
                this.setState({query2: text}, async () => {
                  try {
                    await this.findTimelineData1(text);
                  } catch (e) {
                    // handle error
                  }
                })
              }
              placeholder="Search Person"
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      query2:
                        item.middle_name != null
                          ? item.first_name +
                            ' ' +
                            item.middle_name +
                            ' ' +
                            item.last_name
                          : item.first_name + ' ' + item.last_name,
                      loading: true,
                    });
                    this.setState({
                      salutation: item.salutation,
                      first_name: item.first_name,
                      last_name: item.last_name,
                    }),
                      this.getData2(this.state.query2, item.hlpid, 'null');
                  }}>
                  <Text allowFontScaling={false} style={styles.itemText}>
                    {item.first_name}{' '}
                    {item.middle_name != null ? item.middle_name : ''}{' '}
                    {item.last_name} | {item.hlpid} | {item.phone_no}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {/* <TouchableOpacity onPress={()=>{this.setState({onclicked:true,loading:true});}}>
                        <Icon name='search' size={12} style={{color: '#2D323C',marginTop:10}} />
                        </TouchableOpacity> */}
          </View>

          <Row>
            <Col>
              <FlatList
                //onEndReachedThreshold={50}
                //  onEndReached={this.handleLoadMore}
                //  ListFooterComponent={this.renderFooter}
                // onRefresh={this._handleRefresh}
                // refreshing={this.state.refreshing}
                style={styles.contentList}
                columnWrapperStyle={styles.listContainer}
                data={this.state.persontimeline}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  console.log(item);
                  let p = moment(item.schedule_date)
                    .format('YYYY-MMM-DD')
                    .split('-');
                  let fullname = item.middle_name
                    ? item.salutation +
                      ' ' +
                      item.first_name +
                      ' ' +
                      item.middle_name[0].toUpperCase() +
                      ' ' +
                      item.last_name
                    : item.salutation +
                      ' ' +
                      item.first_name +
                      ' ' +
                      ' ' +
                      item.last_name;
                  console.log(fullname.length);
                  return (
                    <View style={styles.eventBox}>
                      <View style={styles.eventDate}>
                        <Text allowFontScaling={false} style={styles.eventDay}>
                          {p[2]}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.eventMonth}>
                          {p[1]}
                        </Text>
                        <Text allowFontScaling={false} style={styles.eventYear}>
                          {p[0]}
                        </Text>
                      </View>
                      {item.encounter_status.toLowerCase() != 'closed' && (
                        <View style={{flex: 1}}>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                'OldPatientDetails',
                                {
                                  Id: item.id,
                                  schedule_date: item.schedule_date,
                                  enc_id: item.enc_id,
                                  hlpid: item.hlpid,
                                  branch_id: item.branch_id,
                                  encounterdate: item.schedule_date,
                                  encounter_type: item.encounter_status,
                                },
                              )
                            }>
                            <View>
                              <View style={styles.eventContent}>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.doctorName}>
                                  {fullname.length > 28
                                    ? fullname.substring(0, 28) + '..'
                                    : fullname}
                                  {/* {item.middle_name?item.salutation+" "+item.first_name+" "+item.middle_name[0].toUpperCase()+" "+item.last_name.substring(0,5):item.salutation+" "+item.first_name+" "+" "+item.last_name} */}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.encID}>
                                  <Text
                                    allowFontScaling={false}
                                    style={{fontWeight: '500'}}>
                                    ID:{' '}
                                  </Text>
                                  {item.encounterCode}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.encID}>
                                  <Text
                                    allowFontScaling={false}
                                    style={{
                                      fontWeight: '500',
                                      textTransform: 'capitalize',
                                    }}>
                                    Status:{' '}
                                  </Text>
                                  {item.encounter_status.toLowerCase() ===
                                  'checkedin'
                                    ? 'Checked In'
                                    : item.encounter_status.toLowerCase() ===
                                      'consulting'
                                    ? 'Consulting'
                                    : item.encounter_status.toLowerCase() ===
                                      'undergoing'
                                    ? 'In Process'
                                    : item.encounter_status.toLowerCase() ===
                                      'undergoung'
                                    ? 'In Process'
                                    : item.encounter_status.toLowerCase() ===
                                      'appointment booked'
                                    ? 'Booked'
                                    : item.encounter_status.toLowerCase() ===
                                      'completed'
                                    ? 'Completed'
                                    : item.encounter_status.toLowerCase() ===
                                      'cancelled'
                                    ? 'Cancelled'
                                    : item.encounter_status.toLowerCase() ===
                                      'Cancelled'
                                    ? 'Cancelled'
                                    : item.encounter_status.toLowerCase() ===
                                      'appointment recheduled'
                                    ? 'Re-Scheduled'
                                    : item.encounter_status.toLowerCase() ===
                                      'Appointment Rescheduled'
                                    ? 'Re-Scheduled'
                                    : item.encounter_status.toLowerCase() ===
                                      'reconsulting'
                                    ? 'Reconsulting'
                                    : item.encounter_status.toLowerCase() ===
                                      'triage'
                                    ? 'Triage'
                                    : item.encounter_status.toLowerCase() ===
                                      'Confirm'
                                    ? 'Confirm'
                                    : item.encounter_status.toLowerCase() ===
                                      'confirm'
                                    ? 'Confirm'
                                    : item.encounter_status.toLowerCase() ===
                                      'closed'
                                    ? 'Closed'
                                    : item.encounter_status.toLowerCase() ===
                                      'Closed'
                                    ? 'Closed'
                                    : null}
                                </Text>
                              </View>
                              <Row style={{marginTop: 5, marginLeft: -20}}>
                                <Col style={{marginHorizontal: 15}}>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: APP_PRIMARY_COLOR,
                                      marginLeft: 30,
                                    }}
                                    onPress={() =>
                                      this.props.navigation.navigate(
                                        'Vitals2',
                                        {
                                          hlpid: item.hlpid,
                                          enc: item.encounterCode,
                                        },
                                      )
                                    }>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        color: 'white',
                                        fontSize: 12,
                                        margin: 5,
                                        marginVertical: 5,
                                        textAlign: 'center',
                                      }}>
                                      Vitals {'  '} History
                                    </Text>
                                  </TouchableOpacity>
                                </Col>
                                <Col>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: APP_PRIMARY_COLOR,
                                      marginLeft: 30,
                                    }}
                                    onPress={() =>
                                      this.props.navigation.navigate('Covid', {
                                        hlpd: item.hlpid,
                                        enc_id: item.encounterCode,
                                      })
                                    }>
                                    <Text
                                      allowFontScaling={false}
                                      style={{
                                        color: 'white',
                                        fontSize: 12,
                                        marginVertical: 5,
                                        textAlign: 'center',
                                      }}>
                                      Covid Monitoring
                                    </Text>
                                  </TouchableOpacity>
                                </Col>
                              </Row>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                      {item.encounter_status.toLowerCase() == 'closed' && (
                        <View>
                          <View style={styles.eventContent}>
                            <Text
                              allowFontScaling={false}
                              style={styles.doctorName}>
                              {fullname.length > 28
                                ? fullname.substring(0, 28) + '..'
                                : fullname}
                              {/* {item.middle_name?item.salutation+" "+item.first_name+" "+item.middle_name[0].toUpperCase()+" "+item.last_name.substring(0,5):item.salutation+" "+item.first_name+" "+" "+item.last_name} */}
                            </Text>
                            <Text allowFontScaling={false} style={styles.encID}>
                              <Text
                                allowFontScaling={false}
                                style={{fontWeight: '500'}}>
                                ID:{' '}
                              </Text>
                              {item.encounterCode}
                            </Text>
                            <Text allowFontScaling={false} style={styles.encID}>
                              <Text
                                allowFontScaling={false}
                                style={{
                                  fontWeight: '500',
                                  textTransform: 'capitalize',
                                }}>
                                Status:{' '}
                              </Text>
                              {item.encounter_status.toLowerCase() === 'closed'
                                ? 'Closed'
                                : item.encounter_status.toLowerCase() ===
                                  'Closed'
                                ? 'Closed'
                                : null}
                            </Text>
                          </View>
                        </View>
                      )}
                      <View>
                        {/* <Row>
                        <Col size={90} style={{alignItems:"flex-end",paddingRight:10}}> */}
                        {item.pdflink != null && item.pdflink != '' ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate('ViewPdf', {
                                link: item.pdflink,
                              })
                            }
                            style={{marginTop: 10}}>
                            <Icon
                              type="FontAwesome"
                              name="file-pdf-o"
                              style={{fontSize: 20, color: APP_PRIMARY_COLOR}}
                            />
                          </TouchableOpacity>
                        ) : null}
                        {/* </Col>
                          <Col size={10}>
                           */}
                        {item.encounter_status.toLowerCase() == 'undergoing' ||
                        item.encounter_status.toLowerCase() == 'undergoung' ||
                        item.encounter_status.toLowerCase() == 'reconsulting' ||
                        item.encounter_status.toLowerCase() == 'completed' ? (
                          <TouchableOpacity
                            style={{marginTop: 10}}
                            onPress={() =>
                              item.encounter_type == 'telemedicine' ||
                              item.encounter_type == 'homecare'
                                ? this.openOverlay1(
                                    item.phone_no,
                                    item.hlpid,
                                    item.enc_id,
                                    item.PRACTICE_NAME,
                                    item.template_name,
                                    item.template_id,
                                    item.branch_id,
                                    item.gender,
                                    item.uid,
                                    item.age,
                                    moment(item.dob).format('YYYY-MM-DD'),
                                    item.blood_group,
                                    item.middle_name != '' &&
                                      item.middle_name != null
                                      ? item.salutation +
                                          '.' +
                                          item.first_name +
                                          ' ' +
                                          item.middle_name +
                                          ' ' +
                                          item.last_name
                                      : item.salutation +
                                          '.' +
                                          item.first_name +
                                          ' ' +
                                          item.last_name,
                                    item.hlpid,
                                    this.state.profile_pic,
                                    item.salutation,
                                    item.encounter_type,
                                    item.phone_code,
                                    item.version
                                  )
                                : this.props.navigation.navigate('Consult', {
                                    hlpid: item.hlpid,
                                    enc_id: item.enc_id,
                                    hspname: item.PRACTICE_NAME,
                                    template_name: item.template_name,
                                    template_id: item.template_id,
                                    branch: item.branch_id,
                                    gender: item.gender,
                                    plist: item.uid,
                                    age: item.age,
                                    dob: moment(item.dob).format('YYYY-MM-DD'),
                                    blood: item.blood_group,
                                    name:
                                      item.middle_name != '' &&
                                      item.middle_name != null
                                        ? item.salutation +
                                          '.' +
                                          item.first_name +
                                          ' ' +
                                          item.middle_name +
                                          ' ' +
                                          item.last_name
                                        : item.salutation +
                                          '.' +
                                          item.first_name +
                                          ' ' +
                                          item.last_name,
                                    summary: item.hlpid,
                                    profile_pic: this.state.profile_pic,
                                    videocall:
                                      this.state.videocall == 'yes'
                                        ? 'yes'
                                        : 'no',
                                    appointment_type: item.encounter_type,
                                    screen: 'timelene',
                                  })
                            }>
                            <Icon
                              type="FontAwesome"
                              name="pencil-square-o"
                              style={{fontSize: 20}}
                            />
                          </TouchableOpacity>
                        ) : null}
                        {/* </Col>
                          </Row>   */}
                      </View>
                    </View>
                  );
                }}
                // ListHeaderComponent={this.renderHeader}
              />
            </Col>
          </Row>
        </Content>
      </Container>
      // </ScrollView>
    );
  }
}
const mapStateToProps = (state) => ({
  oldList: state.oldList.oldList,
  isFetching15: state.postList.isFetching15,
  // encList:state.encList.encList,
  // isFetching16:state.postList.isFetching16,
});
const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  input: {
    marginTop: 15,
    borderColor: '#345D7E',
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    width: '100%',
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    shadowColor: '#00000021',

    shadowOffset: {
      width: 0,

      height: 6,
    },

    marginHorizontal: 10,

    marginVertical: 5,

    shadowOpacity: 0.37,

    shadowRadius: 7.49,

    elevation: 5,

    backgroundColor: 'white',

    padding: 10,

    flexDirection: 'row',

    borderRadius: 8,
  },
  eventBox: {
    padding: 10,
    flex: 1,
    // marginTop: 5,
    // marginBottom: 5,
    flexDirection: 'row',
  },
  eventDate: {
    flexDirection: 'column',
  },
  eventDay: {
    fontSize: 26,
    color: APP_PRIMARY_COLOR,
    fontWeight: '600',
  },
  eventMonth: {
    fontSize: 22,
    color: '#345D7E',
    fontWeight: '600',
  },
  eventYear: {
    fontSize: 18,
    color: '#4F575C',
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
  },
  encID: {
    fontSize: 14,
    color: '#2D323C',
  },
  doctorName: {
    fontSize: 18,
    color: '#345D7E',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
export default connect(mapStateToProps, {getOldList,TwilioConnection})(OldPateint);
