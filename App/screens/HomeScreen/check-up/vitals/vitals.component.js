import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
  ActivityIndicator,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform
} from 'react-native';

import Slider from 'react-native-slider';
import {connect} from 'react-redux';
import RangeSlider from 'react-native-range-slider';
import {Overlay} from 'react-native-elements';
import {
  Container,
  Header,
  Content,
  Row,
  Col,
  Footer,
  FooterTab,
  Button,
  Textarea,
  Item,
  Label,
  Thumbnail,
  Icon,
} from 'native-base';
import {getNurseVitalsData} from '../../../../redux/actions/retrieve_action';
import {saveVitalsData} from '../../../../redux/actions/save_action';
import FlashMessage from 'react-native-flash-message';
import {getConsultList} from '../../../../redux/actions/consult_action';
import {getApplyList} from '../../../../redux/actions/tempapply_action';
import moment from 'moment';
import BluetoothSerial from 'react-native-bluetooth-serial';
import {BluetoothStatus} from 'react-native-bluetooth-status';
import {Buffer} from 'buffer';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import {APP_PRIMARY_COLOR} from '../../../../themes/variable';
import AudioRecord from 'react-native-audio-record';
import Permissions from 'react-native-permissions';
import RNFS from 'react-native-fs';
// import MicStream from 'react-native-microphone-stream';
    // "react-native-microphone-stream": "git://github.com/chadsmith/react-native-microphone-stream.git",
// import LiveAudioStream from 'react-native-live-audio-stream';
// import AudioRecorderPlayer, {
//   AVEncoderAudioQualityIOSType,
//   AVEncodingOption,
//   AudioEncoderAndroidType,
//   AudioSet,
//   AudioSourceAndroidType,
//  } from 'react-native-audio-recorder-player';
// import SoundPlayer from 'react-native-sound-player'
import getBaseUrl from '../../../../config/Config';
import i18n from '../../../../../i18n';
import {Picker} from '@react-native-picker/picker';

global.Buffer = Buffer;
const iconv = require('iconv-lite');
var SpiroReact = NativeModules.SpiroReact;
var path = RNFS.ExternalStorageDirectoryPath+'/MyApp';
// RNFS.mkdir(path);
path += '/data2.wav';
let ayudata = path
let path11=path
let decodedPieces =[]
class vitals extends Component {
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    Text.allowFontScaling = false;

    this.state = {
      pf: '',
      v_data: [],
      // loading1:true,
      vitals_lay: false,
      weight: '0',
      height: '0',
      bmi: '0',
      value: 0,
      value1: 0,
      value2: '0',
      value3: '0',
      value4: '0',
      value5: '0',
      value6: '0',
      load1: false,
      alertvisible4: false,
      customData: [],
      bpsystolic: null,
      bpdiastolic: null,
      sliderValue: 15,
      in: false,
      ou: true,
      screenWidth: Dimensions.get('window').width,
      nurse_note: '',
      loading: true,
      hlpid: '',
      encounter_show: '',
      borderColorHeight: '#FBFBFB',
      borderColorWeight: '#FBFBFB',
      bordertemperatue: '#FBFBFB',
      borderColorcus1: '#FBFBFB',
      borderColorsystolic: '',
      borderColordiastolic: '',
      u: '',
      w: '',
      b: '',
      height1: '',
      weight1: '',
      bmi1: '',
      systolic1: '',
      diastolic1: '',
      pulse1: '',
      oxy_sat1: '',
      pefr1: '',
      resp1: '',
      temperature1: '',
      m_height: '',
      fm_height: '',
      m_weight: '',
      fm_weight: '',
      height_data: [],
      customLabel: '',
      h: [],
      m_bmi: '',
      fm_bmi: '',
      m_heightbp: '',
      m_sysbp: '',
      custom_fields: false,
      heighttext: 0,
      isVitalsModified: false,
      isEnabled: false,
      devices: [],
      devicecount: '0',
      ashastatus: true,
      audioFile: '',
      recording: false,
      loaded: false,
      paused: true,
      start: false
    };
    // this.audioRecorderPlayer = new AudioRecorderPlayer();
    // this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
    let o1 = DeviceEventEmitter.addListener('setnursenotes', (e) => {
      this.setState({
        nurse_note:
          this.state.nurse_note != '' && this.state.nurse_note != undefined
            ? this.state.nurse_note + ' ' + e
            : e,
      });
    });

    let ob = DeviceEventEmitter.addListener('setnursevitals', async (e) => {
      let myobj = JSON.stringify({
        docid: global.doctor_id,
        token: global.token,
        val: e,
      });
      console.log('vitalsdata=' + myobj);
      await this.props.getNurseVitalsData(myobj);
      let text = this.props.vitals_retrieve_response.message;
      console.log('res=' + JSON.stringify(text));
      let key = Object.keys(text);
      if (text['height']) {
        this.vHeight(text['height']);
      }
      if (text['weight']) {
        this.vWeight(text['weight']);
      }
      if (text['wait']) {
        this.vWeight(text['wait']);
      }
      if (text['vate']) {
        this.vWeight(text['vate']);
      }
      if (text['systolic']) {
        this.vSystolic_BP(text['systolic']);
      }
      if (text['diastolic']) {
        this.vDiastolic_BP(text['diastolic']);
      }
      if (text['high bp']) {
        this.vSystolic_BP(text['high bp']);
      }
      if (text['low bp']) {
        this.vDiastolic_BP(text['low bp']);
      }
      if (text['pulse']) {
        vPulse_Rate(text['pulse']);
      }
      if (text['pulse rate']) {
        this.vPulse_Rate(text['pulse rate']);
      }
      if (text['rate']) {
        this.vPulse_Rate(text['rate']);
      }
      if (text['oxygen']) {
        this.vOxygen_Saturation(text['oxygen']);
      }
      if (text['oxygen saturation']) {
        this.vOxygen_Saturation(text['oxygen saturation']);
      }
      if (text['spiro']) {
        this.vPEFR(text['spiro']);
      }
      if (text['spirometric']) {
        this.vPEFR(text['spirometric']);
      }
      if (text['spirometry']) {
        this.vPEFR(text['spirometry']);
      }
      if (text['spirometer']) {
        this.vPEFR(text['spirometer']);
      }
      if (text['spyro']) {
        this.vPEFR(text['spyro']);
      }
      if (text['pefr']) {
        this.vPEFR(text['pefr']);
      }
      if (text['p e f r']) {
        this.vPEFR(text['p e f r']);
      }
      if (text['pfr']) {
        this.vPEFR(text['pfr']);
      }
      if (text['cfr']) {
        this.vPEFR(text['cfr']);
      }
      if (text['tvs']) {
        this.vPEFR(text['tvs']);
      }
      if (text['efr']) {
        this.vPEFR(text['efr']);
      }
      if (text['pef']) {
        this.vPEFR(text['pef']);
      }
      if (text['PEFR']) {
        this.vPEFR(text['PEFR']);
      }
      if (text['for']) {
        this.vPEFR(text['for']);
      }
      if (text['fifa']) {
        this.vPEFR(text['fifa']);
      }
      if (text['tfr']) {
        this.vPEFR(text['tfr']);
      }
      if (text['pf']) {
        this.vPEFR(text['pf']);
      }
      if (text['pf for']) {
        this.vPEFR(text['pf for']);
      }
      if (text['respiratory']) {
        this.vRespiratory_Rate(text['respiratory']);
      }
      if (text['respiratory rate']) {
        this.vRespiratory_Rate(text['respiratory rate']);
      }
      if (text['temperature']) {
        this.vTemperature(text['temperature']);
      }
      if (text['head circumference']) {
        this.vHeadcircumference(text['head circumference']);
      }
    });
    DeviceEventEmitter.addListener('getTempData', (e) => {
      // handle event
      // console.log(e)
      let tmp = (e * 9) / 5 + 32;
      this.setState({value6: tmp});
      console.log('msg' + tmp);
    });
    DeviceEventEmitter.addListener('getBpData', (e) => {
      let bp = e.split('-');
      this.setState({value: bp[0], value1: bp[1]});
    });

    DeviceEventEmitter.addListener('getPulseData', (e) => {
      //alert(e)
      let pulse = e.split('-');
      pulse = e;
      this.setState({value3: pulse[0]});
      this.setState({value2: pulse[1]});
    });
    DeviceEventEmitter.addListener('eventValueAasha', (e) => {
      if (e.aashavalue.includes('T_')) {
        let temp = e.aashavalue.split('_');
        Toast.show('Fetching data...');
        this.onValuetemp(temp[1]);
      } else if (e.aashavalue.includes('B_')) {
        let bp = e.aashavalue.split('_');
        Toast.show('Fetching data...');
        this.onValuebmi1(bp[1]);
        this.onValuebmi2(bp[2]);
      } else if (e.aashavalue.includes('O_')) {
        console.log('o');
        let pulse = e.aashavalue.split('_');
        console.log('o1', pulse);
        Toast.show('Fetching data...');
        this.onValueoxg(pulse[1]);
        this.onValuepulse(pulse[2]);
      } else{
        console.log("values",e.aashavalue)
      }
    });
    DeviceEventEmitter.addListener('getAyuData', (data) => {
      console.log("data",data)
      // const data1={uri: "file:///"+data}
      var path = RNFS.ExternalStorageDirectoryPath+'/AyuData';
      console.log("path1",path)
      let ayudata=data
      const data1={uri: "file:///"+data}
      this.onStartPlay()
    //   try {
    //     // play the file tone.mp3
    //     SoundPlayer.playSoundFile(data.split('.')[0], 'wav')
    //     // or play from url
    //     // SoundPlayer.playUrl('https://example.com/music.mp3')
    // } catch (e) {
    //     console.log(`cannot play the sound file`, e)
    // }
      // alert("got the data")
      // alert(data)
  //     RNFS.readFile(path, 'base64')
  //     .then((data) => {
  //       console.log("data",data)
  //         // this.socket.emit('sendingAudio', {
  //         //     sound: data
  //         // }, (error, response) => {
  //         //     console.log(error, response)
  //         // });

  // })      
      // data=parseShort(data)
      // var path = RNFS.ExternalStorageDirectoryPath+'/MyApp';
      // // RNFS.mkdir(path);
      // path += '/data1.wav';
      // console.log("path",path)
      // const bufferFile = Buffer.from(data, 'base64');
      // alert(bufferFile)
      // decodedPieces.push(Buffer.from("hello", 'base64'));
      // decodedPieces.push(data);

      // RNFS.writeFile(path, data, 'utf8')
      //   .then((success) => {
      //     // console.log('Success');
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });
      // const options = {
      //   sampleRate: 16000,
      //   channels: 1,
      //   bitsPerSample: 16,
      //   wavFile: 'test.wav'
      // };
  
      // AudioRecord.init(options);
      // console.log("Data1") 
      // AudioRecord.on('data', data => {
      //   const chunk = Buffer.from(data, 'base64');
      //   console.log('chunk size', chunk.byteLength);
      //   // do something with audio chunk
      // });
    // }
    // console.log("Data2") 

    // start1();
    });
    // start1=()=>{
    //   console.log("Data3") 
    //   if(this.state.start==true){
    //     this.setState({ start:true });
    //     console.log("hellostart1")
    //   }
    //   else{
    //     console.log("Data4") 
    //     start()
    //   }
    // } 
    // start = () => {
    //   console.log('start record');
    //   this.setState({ audioFile: '', recording: true, loaded: false });
    //   AudioRecord.start();
    // };
  
    // stop = async () => {
    //   if (!this.state.recording) return;
    //   console.log('stop record');
    //   let audioFile = await AudioRecord.stop();
    //   console.log('audioFile', audioFile);
    //   this.setState({ audioFile, recording: false });
    // };
  
    // load = () => {
    //   return new Promise((resolve, reject) => {
    //     if (!this.state.audioFile) {
    //       return reject('file path is empty');
    //     }
  
    //     this.sound = new Sound(this.state.audioFile, '', error => {
    //       if (error) {
    //         console.log('failed to load the file', error);
    //         return reject(error);
    //       }
    //       this.setState({ loaded: true });
    //       return resolve();
    //     });
    //   });
    // };
    // play = async () => {
    //   if (!this.state.loaded) {
    //     try {
    //       await this.load();
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
  
    //   this.setState({ paused: false });
    //   Sound.setCategory('Playback');
  
    //   this.sound.play(success => {
    //     if (success) {
    //       console.log('successfully finished playing');
    //     } else {
    //       console.log('playback failed due to audio decoding errors');
    //     }
    //     this.setState({ paused: true });
    //     // this.sound.release();
    //   });
    // };
    // pause = () => {
    //   this.sound.pause();
    //   this.setState({ paused: true });
    // };
    DeviceEventEmitter.addListener('getSpiroData', (e) => {
      // handle event
      console.log(e);
      this.setState({value4: e});
    });
  }

  // componentWillUnmount = async () => {
  //     if (this._unsubscribe && typeof (this._unsubscribe) == 'function') {
  //         this._unsubscribe();
  //     }
  // }
  // onStartRecord = async () => {
  //   var path = RNFS.ExternalStorageDirectoryPath+'/MyApp';
  //   RNFS.mkdir(path);
  //   path += '/hello.m4a';
  //   console.log("pathb",path)
  //   // const path = 'hello.m4a';
  //   const audioSet = {
  //     AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  //     AudioSourceAndroid: AudioSourceAndroidType.MIC,
  //     AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  //     AVNumberOfChannelsKeyIOS: 2,
  //     AVFormatIDKeyIOS: AVEncodingOption.aac,
  //   };
  //   console.log('audioSet', audioSet);
  //   const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);
  //   this.audioRecorderPlayer.addRecordBackListener((e) => {
  //     this.setState({
  //       recordSecs: e.current_position,
  //       recordTime: this.audioRecorderPlayer.mmssss(
  //         Math.floor(e.current_position),
  //       ),
  //     });
  //   });
  //   console.log(`uri: ${uri}`);
  // }
  // onStopRecord = async () => {
  //   const result = await this.audioRecorderPlayer.stopRecorder();
  //   this.audioRecorderPlayer.removeRecordBackListener();
  //   this.setState({
  //     recordSecs: 0,
  //   });
  //   console.log(result);
  // }
  // onStartPlay = async (e) => {
  //   console.log('onStartPlay');
  //   var path = RNFS.ExternalStorageDirectoryPath+'/AyuData';
  //   RNFS.mkdir(path);
  //   path += '/recorded.wav';
  //   console.log("patha",ayudata)
  //   const msg = await this.audioRecorderPlayer.startPlayer(ayudata);
  //   this.audioRecorderPlayer.setVolume(1.0);
  //   console.log(msg);
  //   this.audioRecorderPlayer.addPlayBackListener((e) => {
  //     if (e.current_position === e.duration) {
  //       console.log('finished');
  //       this.audioRecorderPlayer.stopPlayer();
  //     }
  //     this.setState({
  //       currentPositionSec: e.current_position,
  //       currentDurationSec: e.duration,
  //       playTime: this.audioRecorderPlayer.mmssss(
  //         Math.floor(e.current_position),
  //       ),
  //       duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
  //     });
  //   });
  // }
  // onPausePlay = async (e) => {
  //   await this.audioRecorderPlayer.pausePlayer();
  //  }
  //  onStopPlay = async (e) => {
  //   console.log('onStopPlay');
  //   this.audioRecorderPlayer.stopPlayer();
  //   this.audioRecorderPlayer.removePlayBackListener();
  //   }
  requestEnable() {
    BluetoothSerial.requestEnable()
      .then((res) => this.setState({isEnabled: true}))
      .catch((err) => console.log(err.message));
  }
  enable() {
    BluetoothSerial.enable()
      .then((res) => this.setState({isEnabled: true}))
      .catch((err) => console.log(err.message));
    this.setState({devices: BluetoothSerial.list()});
    console.log('paired devices', this.state.devices);
  }
  async checkInitialBluetoothState() {
    const isEnabled = await BluetoothStatus.state();
    console.log('check bluetooth on or off', isEnabled);
    if (isEnabled == true) {
      this.setState({devices: BluetoothSerial.list()});
      console.log('paired devices', this.state.devices);
      // {this.state.devices.map((device) => {
      //        console.log("paried")
      // })}
      console.log('bluetooth already enabled');
    } else {
      this.requestEnable();
    }
  }
  async bluetoothpair() {
    BluetoothSerial.list().then(
      (data1) => {
        console.log('hurray' + JSON.stringify(data1));
        data1
          .map((data) => {
            console.log(
              'Found Devices',
              data.id,
              data.class,
              data.address,
              data.name,
            );
            if (data.name.includes('SPP')) {
              console.log('yes');
              this.setState({devicecount: '1'});
              this.Aashaconnect(data);
            } else if (data.name.includes('NIBP046')) {
              console.log('yes');
              this.setState({devicecount: '1'});
              this.Bpconnect(data);
            } else if (data.name.includes('PULMO0')) {
              console.log('yes');
              this.setState({devicecount: '1'});
              this.Bpconnect(data);
            } else if (data.name.includes('WT01')) {
              console.log('yes');
              this.setState({devicecount: '1'});
              this.Bpconnect(data);
            } else if (data.name.includes('SpO208')) {
              console.log('yes');
              this.setState({devicecount: '1'});
              this.Bpconnect(data);
            } else if (data.name.includes('TEMP03')) {
              console.log('yes');
              this.setState({devicecount: '1'});
              this.Bpconnect(data);
            } else {
              alert(i18n.t('PATIENTS.BLUTOOTH '));
            }
          })
          .catch((err) => console.log('1234', err.message));
        if (this.state.devicecount != '1') {
          alert(i18n.t('PATIENTS.PLS_AASHA'));
        }
      },
      (error) => {
        console.log('could not find paired devices because: ' + error);
        //   this.showError(error);
      },
    );
  }
  updateList = async () => {
    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    this.props.screenProps.screen == 'dashboard'
      ? await this.props.getApplyList(myobj)
      : this.props.screenProps.screen == 'timelene'
      ? await this.props.getConsultList(myobj2)
      : null;
  };
  async TurnOnBT() {
    // alert("123");
    SpiroReact.TurnBT(
      (err) => {
        console.log(err);
      },
      (msg) => {
        console.log(msg);
      },
    );
  }
  microphone = async (data) =>{
    // console.log("mic",data)
          RNFS.writeFile(path11, data, 'utf8')
      .then((success) => {
        console.log('Success');
      })
      .catch((err) => {
        console.log(err.message);
      })
  }
  scanayuble = async () => {
    console.log("scanayuble called")
    SpiroReact.scanayuble();
    // const data1={uri: "file:////storage/emulated/0/AyuData/recorded.wav"}
    // this.onStartPlay()

    // LiveAudioStream.start();
    // this.onStartRecord();
    console.log('srikanth' + this.state.value + ' ' + this.state.value1);
  };
  startayuble = async () => {
    console.log("scanayuble called")
    // SpiroReact.startayuble();
    SpiroReact.startayuble()
    console.log('srikanth' + this.state.value + ' ' + this.state.value1);
  };
  stopayuble = async () => {
    console.log("stopayuble called")
    SpiroReact.stopayuble();
    // MicStream.stop();
    // decodedPieces.push(Buffer.from(data, 'base64'));
    // console.log("decoded",decodedPieces)
    // const decoded = Buffer.concat(decodedPieces);
    // this.microphone(decodedPieces)
    // LiveAudioStream.stop();
    // this.onStopRecord();
    // this.onStartPlay();
    console.log('srikanth' + this.state.value + ' ' + this.state.value1);
  };
  getBp = async () => {
    SpiroReact.startBp(
      (err) => {
        console.log(err);
      },
      (msg) => {
        let bp = msg.split(' ');
        this.setState({value: bp[0], value1: bp[1]});
      },
    );
    console.log('srikanth' + this.state.value + ' ' + this.state.value1);
  };
  getPulse = async () => {
    SpiroReact.startSpo2(
      (err) => {
        console.log(err);
      },
      (msg) => {
        let pulsevalue = msg.split(' ');
        this.setState({value3: pulsevalue[0], value2: pulsevalue[1]});
      },
    );
  };
  change_status = async () => {
    this.setState({
      loading1: true,
    });
    console.log(global.hlpid + global.userToken);
    let obk = JSON.stringify({
      doc_id: global.doctor_id,
      token: global.token,
      hlp_id: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
    });
    console.log(obk + '  ' + global.doctor_id);
    let url = getBaseUrl() + 'get_vitals_from_persondb';
    // console.log("gug"+ob)p {hlpid:this.props.screenProps.hlpid,enc:this.props.screenProps.enc_id})}> */}
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: obk,
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log("hfkjqkfwkejhkjwefkjwekjebfkwjebjeb"+JSON.stringify(response.data[0].cancellation_charge))
        //   alert("hfkjqkfwkejhkjwefkjwekjebfkwjebjeb"+JSON.stringify(response))

        this.setState({
          loading1: false,
          vitals_lay: true,
        });
        if (response.data != undefined) {
          console.log('response.data', response.data);
          this.setState({
            v_data: response.data,
            pf: response.data[0].PEFR,
          });
        }

        //
        // alert(JSON.stringify(response.data))
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount = async () => {
    // this.saveData();
    if (Platform.OS === 'android') {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]).then((granted) => {
          Object.entries(granted).map(([key, value]) => {
            console.log(key, value);
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
    var path = RNFS.ExternalStorageDirectoryPath+'/MyApp';
    RNFS.mkdir(path);
    path += '/data2.wav';
    let path11=path
    // alert("path",path)
    // this.TurnOnBT()
  //   const options = {
  //     sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
  //     channels: 1,        // 1 or 2, default 1
  //     bitsPerSample: 16,  // 8 or 16, default 16
  //     audioSource: 6,     // android only (see below)
  //     bufferSize: 4096    // default is 2048
  //   };
  //   LiveAudioStream.init(options);
  //   let decodedPieces = [];
  //   // AudioRecord.on('data', data => {
  //   //   console.log("decodedPieces",decodedPieces)
  //   //   decodedPieces.push(Buffer.from(data, 'base64'));
  //   // });
  // LiveAudioStream.on('data', data => {
  //   // var chunk = Buffer.from(data, 'base64');
  //   decodedPieces.push(Buffer.from(data, 'base64'));
  //   // this.microphone(chunk);
  //   // base64-encoded audio data chunks
  // });

    // const listener = MicStream.addListener(data => 
    //         // console.log("mic",data)
    //         microphone(data)
    //   );
    // MicStream.init({
    //   bufferSize: 4096,
    //   sampleRate: 44100,
    //   bitsPerChannel: 16,
    //   channelsPerFrame: 1,
    // });
    // MicStream.start();
    // if (Platform.OS === 'android') {
    //   try {
    //     PermissionsAndroid.requestMultiple([
    //       PermissionsAndroid.PERMISSIONS.MICROPHONE,
    //     ]).then((granted) => {
    //       Object.entries(granted).map(([key, value]) => {
    //         console.log(key, value);
    //       });
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // this.scanayuble()
    this.getVitalsData();
    global.customData = this.state.customData;
    // alert("aasha"+this.props.screenProps.aasha)
    // this.TurnOnBT();
    
    // const options = {
    //   sampleRate: 16000,
    //   channels: 1,
    //   bitsPerSample: 16,
    //   wavFile: 'test.wav'
    // };

    // AudioRecord.init(options);
    // AudioRecord.on('data', data => {
    //   const chunk = Buffer.from(data, 'base64');
    //   console.log('chunk size', chunk.byteLength);
    //   // do something with audio chunk
    // });
    const deviceaasha = await AsyncStorage.getItem('deviceaasha');
    const devicechinese = await AsyncStorage.getItem('devicechinese');

    const Devices_flg = await AsyncStorage.getItem('Devices_flg');
    this.setState({Devices_flg: Devices_flg});

    const height_val = await AsyncStorage.getItem('height_val');
    const weight_val = await AsyncStorage.getItem('weight_val');
    const bp_val = await AsyncStorage.getItem('bp_val');
    const PulseOximeter_val = await AsyncStorage.getItem('PulseOximeter_val');
    const Spirometer_val = await AsyncStorage.getItem('Spirometer_val');
    const Temperature_val = await AsyncStorage.getItem('Temperature_val');
    this.setState({
      height_val: height_val,
      weight_val: weight_val,
      bp_val: bp_val,
      PulseOximeter_val: PulseOximeter_val,
      Spirometer_val: Spirometer_val,
      Temperature_val: Temperature_val,
    });
    console.log(this.state.height_val);
    if (Devices_flg == 'yes') {
      if (Platform.OS === 'android') {
        this.checkInitialBluetoothState();
        }
      if(Platform.OS === 'android'){
        this.bluetoothpair();
      }
    }
    this._unsubscribe = this.props.navigation.addListener('didBlur', () => {
      if (this.state.isVitalsModified) {
        Alert.alert(i18n.t('PATIENTS.ALERT'), i18n.t('PATIENTS.ALERT_DATA'), [
          {
            text: i18n.t('COMMON.NO'),
            onPress: () => {
              this.setState({load1: true});
              this.getVitalsData();
              this.setState({isVitalsModified: false, load1: false});
            },
          },
          {
            text: i18n.t('COMMON.YES'),
            onPress: () => {
              this.saveVitalsData(true);
            },
          },
        ]);
      }
      console.warn('did blur called in vitals');
    });
  };
  async Aashaconnect(device) {
    console.log('connecting..', device);
    this.setState({connecting: true});
    BluetoothSerial.connect(device.id)
      .then((res) => {
        Toast.show('Connected to Aasha device');
        console.log(`Connected to device ${device.name}`);
        this.setState({device, connected: true, connecting: false});
      })
      .catch((err) =>
        // console.log("123",err.message)
        this.bluetoothpair(),
      );
  }
  async Bpconnect(device) {
    console.log('connecting..', device);
    this.setState({connecting: true});
    BluetoothSerial.connect(device.id)
      .then((res) => {
        console.log('Connected to Aasha device');
        console.log(`Connected to device ${device.name}`);
        this.setState({device, connected: true, connecting: false});
      })
      .catch((err) => console.log('123', err.message));
  }
  async writePackets(message, packetSize = 64) {
    const toWrite = iconv.encode(message, 'cp852');
    const writePromises = [];
    const packetCount = Math.ceil(toWrite.length / packetSize);

    for (var i = 0; i < packetCount; i++) {
      const packet = new Buffer(packetSize);
      packet.fill(' ');
      toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
      writePromises.push(BluetoothSerial.write(packet));
    }

    Promise.all(writePromises).then((result) => {
      console.log(result);
    });
  }
  async ashastatus() {
    console.log('ashastatus');
    BluetoothSerial.readFromDevice().then((data) => {
      console.log(data);
      // this.setState({mydata:data})
      if (
        data == 'undefined' ||
        data == undefined ||
        this.state.ashastatus == 'undefined' ||
        this.state.ashastatus == undefined
      ) {
        console.log('ashs2');
        this.setState({ashastatus: true});
      } else {
        console.log('ashs3');
        this.setState({mydata: data, ashastatus: false});
      }
    });
  }
  async write11(message){
    DeviceEventEmitter.emit('eventKeyAasha', {name:"aasha@"+message});
  }
  async write(message) {
    if (message == 'p') {
      Toast.show('Clicked on Pulse');
    }
    if (message == 'b') {
      Toast.show('Clicked on BP');
    }
    if (message == 'm') {
      Toast.show('Clicked on Temperatue');
    }

    if (!this.state.connected) {
      console.log('You must connect to device first');
      this.bluetoothpair();
      Toast.show('Start the testing');
      BluetoothSerial.write(message)
        .then((res) => {
          console.log('Successfuly wrote to device=' + res);
          this._interval = setInterval(() => {
            // Your code
            console.log('data1');
            BluetoothSerial.readFromDevice()
              .then((data) => {
                console.log('data', data);
                //   this.setState({mydata:data})
                if (data != 'undefined' && data != undefined) {
                  if (data.includes('T_')) {
                    let temp = data.split('_');
                    //   this.setState({
                    //     tempvalue:temp[1]+String.fromCharCode(176),
                    //     value6:temp[2]+String.fromCharCode(176)
                    //   })
                    //   this.disconnect()
                    //    this.setState({
                    //        loading2:false,
                    //      })
                    Toast.show('Fetching data...');
                    this.onValuetemp(temp[2]);
                    clearInterval(this._interval);
                  } else if (data.includes('B_')) {
                    let bp = data.split('_');
                    //   this.setState({bpvalue:bp[1]+"/"+bp[2]})
                    //   this.setState({  value: bp[1], value1: bp[2] })
                    //   this.disconnect()
                    //    this.setState({
                    //        loading2:false,
                    //      })
                    Toast.show('Fetching data...');
                    this.onValuebmi1(bp[1]);
                    this.onValuebmi2(bp[2]);
                    clearInterval(this._interval);
                  } else if (data.includes('O_')) {
                    console.log('o');
                    let pulse = data.split('_');
                    console.log('o1', pulse);
                    // this.setState({
                    //   spo2value:pulse[1]+"%",
                    //   pulsevalue:pulse[2]+" bpm"
                    // })
                    //   this.setState({ value2: pulse[2],value3:pulse[1] })
                    //   this.disconnect()
                    //    this.setState({
                    //        loading2:false,
                    //      })
                    Toast.show('Fetching data...');
                    this.onValueoxg(pulse[1]);
                    this.onValuepulse(pulse[2]);
                    clearInterval(this._interval);
                  } else if (data != undefined && data.includes('G_')) {
                    this.setState({loading2: false, glucovalue: data});
                    this.disconnect();
                    clearInterval(this._interval);
                  }
                } else {
                  console.log('else');
                }
              })
              .catch((err) => console.log('123', err.message));
            //   console.log("s="+this.state.mydata);
          }, 3000);

          this.setState({connected: true});

          console.log();
        })
        .catch((err) => console.log(err.message));
    }
    //console.log('Successfuly wrote to device='+message);
    else {
      Toast.show('Start the testing');
      BluetoothSerial.write(message)
        .then((res) => {
          console.log('Successfuly wrote to device=' + res);
          this._interval = setInterval(() => {
            // Your code
            console.log('data1');

            BluetoothSerial.readFromDevice()
              .then((data) => {
                console.log('data', data);
                // this.setState({mydata:data})
                if (data != 'undefined' && data != undefined) {
                  if (data.includes('T_')) {
                    let temp = data.split('_');
                    // this.setState({
                    //   tempvalue:temp[1]+String.fromCharCode(176),
                    //   value6:temp[2]+String.fromCharCode(176)
                    // })
                    // this.disconnect()
                    //  this.setState({
                    //      loading2:false,
                    //    })
                    Toast.show('Fetching data...');
                    this.onValuetemp(temp[2]);
                    clearInterval(this._interval);
                  } else if (data.includes('B_')) {
                    let bp = data.split('_');
                    // this.setState({bpvalue:bp[1]+"/"+bp[2]})
                    // this.disconnect()
                    //  this.setState({
                    //      loading2:false,
                    //    })
                    Toast.show('Fetching data...');
                    this.onValuebmi1(bp[1]);
                    this.onValuebmi2(bp[2]);
                    clearInterval(this._interval);
                  } else if (data.includes('O_')) {
                    let pulse = data.split('_');
                    console.log('o4', pulse);
                    // this.setState({
                    //   spo2value:pulse[1]+"%",
                    //   pulsevalue:pulse[2]+" bpm"
                    // })
                    console.log('o');
                    //  this.setState({ value2: pulse[2],value3:pulse[1] })
                    // this.disconnect()
                    //  this.setState({
                    //      loading2:false,
                    //    })
                    Toast.show('Fetching data...');
                    this.onValueoxg(pulse[1]);
                    this.onValuepulse(pulse[2]);
                    clearInterval(this._interval);
                  } else if (data.includes('G_')) {
                    this.setState({loading2: false, glucovalue: data});
                    this.disconnect();
                    clearInterval(this._interval);
                  }
                } else {
                  console.log('else');
                }
              })
              .catch((err) => console.log(err.message));

            // console.log("s="+this.state.mydata);
          }, 3000);
          this.setState({connected: true});

          console.log();
        })
        .catch((err) => console.log(err.message));
    }
  }
  async tempwrite() {
    if (!this.state.connected) {
      console.log('You must connect to device first');
      this.bluetoothpair();
      BluetoothSerial.write()
        .then((res) => {
          console.log('Successfuly wrote to device=' + res);
          this._interval = setInterval(() => {
            // Your code
            BluetoothSerial.readFromDevice().then((data) => {
              console.log(data);
              this.setState({mydata: data});
            });

            console.log('s3=' + this.state.mydata);

            //  if(this.state.mydata!=undefined&&this.state.mydata.includes('T_')){
            //   let temp=this.state.mydata.split("_");
            //   this.setState({
            //     tempvalue:temp[1]+String.fromCharCode(176)+"C",
            //     value6:temp[2]+String.fromCharCode(176)
            //   })
            //   this.disconnect()
            //    clearInterval(this._interval)
            //  }
          }, 3000);

          this.setState({connected: true});

          console.log();
        })
        .catch((err) => console.log(err.message));
    }
    //console.log('Successfuly wrote to device='+message);
    else {
      console.log('tempwriteelse');
      BluetoothSerial.write()
        .then((res) => {
          console.log('Successfuly wrote to device=' + res);
          this._interval = setInterval(() => {
            // Your code
            BluetoothSerial.readFromDevice().then((data) => {
              console.log(data);
              this.setState({mydata: data});
            });

            console.log('s4=' + this.state.mydata);
            //    if(this.state.mydata!=undefined&&this.state.mydata.includes('T_')){
            //     let temp=this.state.mydata.split("_");
            //     this.setState({
            //       tempvalue:temp[1]+String.fromCharCode(176)+"C",
            //       value6:temp[2]+String.fromCharCode(176)+"F"
            //     })
            //     this.disconnect()
            //      clearInterval(this._interval)
            //    }
          }, 3000);

          this.setState({connected: true});

          console.log();
        })
        .catch((err) => console.log(err.message));
    }
  }
  async disconnect() {
    console.log('disconnected');
    BluetoothSerial.disconnect()
      .then(() => this.setState({connected: false}))
      .catch((err) => console.log(err.message));
  }

  /**
   * Toggle connection when we have active device
   * @param  {Boolean} value
   */
  async toggleConnect(value) {
    if (value === true && this.state.device) {
      this.connect(this.state.device);
    } else {
      this.disconnect();
    }
  }
  getVitalsData = () => {
    if (global.screen == 'dashboard') {
      (this.state.height = this.props.applyList.message.vitals.height),
        (this.state.weight = this.props.applyList.message.vitals.weight),
        (this.state.bmi = this.props.applyList.message.vitals.bmi),
        (this.state.value = this.props.applyList.message.vitals.systolic),
        (this.state.value1 = this.props.applyList.message.vitals.diastolic),
        (this.state.value2 = this.props.applyList.message.vitals.pulse_rate),
        (this.state.value3 =
          this.props.applyList.message.vitals.oxygen_saturation),
        (this.state.value4 = this.props.applyList.message.vitals.pefr),
        (this.state.value5 =
          this.props.applyList.message.vitals.respiratory_rate),
        (this.state.value6 = this.props.applyList.message.vitals.temperature),
        (this.state.nurse_note = this.props.applyList.message.vitals.comments),
        (this.state.hlpid = this.props.screenProps.hlpid),
        (this.state.encounter_show = this.props.screenProps.enc_id);

      if (this.props.applyList.message.vitals.custom_fields) {
        if (this.props.applyList.message.vitals.custom_fields.length > 0) {
          this.state.customData =
            this.props.applyList.message.vitals.custom_fields;
          this.state.custom_fields = true;
          this.setState({loadtemp: true});
        }
      }
      this.onValueheight(this.props.applyList.message.vitals.height.toString());
      this.onValueweight(this.props.applyList.message.vitals.weight.toString());
      this.sum1(this.props.applyList.message.vitals.bmi);
      this.onValuebmi1(this.props.applyList.message.vitals.systolic);
      this.onValuebmi2(this.props.applyList.message.vitals.diastolic);
      this.onValuepulse(this.props.applyList.message.vitals.pulse_rate);
      this.onValueoxg(this.props.applyList.message.vitals.oxygen_saturation);
      this.onValuespi(this.props.applyList.message.vitals.pefr);
      this.onValuetemp(
        this.props.applyList.message.vitals.temperature.toString(),
      );
      this.onValueresp(this.props.applyList.message.vitals.respiratory_rate);
      if (this.props.applyList.message.vitals.custom_fields) {
        this.props.applyList.message.vitals.custom_fields.map((item, key) =>
          this.onValuecus1(key, item.value),
        );
      }
    } else if (global.screen == 'timelene') {
      this.setState({
        height:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].height
            : this.props.consultList.message.vitals.height,
        weight:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].weight
            : this.props.consultList.message.vitals.weight,
        bmi:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].bmi
            : this.props.consultList.message.vitals.bmi,
        value:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].systolic
            : this.props.consultList.message.vitals.systolic,
        value1:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].diastolic
            : this.props.consultList.message.vitals.diastolic,
        value2:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].pulse_rate
            : this.props.consultList.message.vitals.pulse_rate,
        value3:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].oxygen_saturation
            : this.props.consultList.message.vitals.oxygen_saturation,
        value4:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].pefr
            : this.props.consultList.message.vitals.pefr,
        value5:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].respiratory_rate
            : this.props.consultList.message.vitals.respiratory_rate,
        value6:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].temperature
            : this.props.consultList.message.vitals.temperature,
        nurse_note:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].comments
            : this.props.consultList.message.vitals.comments,
        hlpid:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].hlpid
            : this.props.consultList.message.vitals.hlpid,
        encounter_show:
          this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].encounterCode
            : this.props.consultList.message.vitals.encounter_show,
      });
      if (
        this.props.consultList.message.enc_vitals instanceof Array &&
        this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].custom_fields
          : this.props.consultList.message.vitals.custom_fields
      ) {
        if (
          (this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
            ? this.props.consultList.message.enc_vitals[0].custom_fields
            : this.props.consultList.message.vitals.custom_fields
          ).length > 0
        ) {
          this.setState({
            custom_fields: true,
            customData:
              this.props.consultList.message.enc_vitals instanceof Array &&
              this.props.consultList.message.enc_vitals.length > 0
                ? this.props.consultList.message.enc_vitals[0].custom_fields
                : this.props.consultList.message.vitals.custom_fields,
          });
        }
      }
      if (this.state.custom_fields) {
        this.props.consultList.message.enc_vitals instanceof Array &&
        this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].custom_fields
          : this.props.consultList.message.vitals.custom_fields.map(
              (item, key) => this.onValuecus1(key, item.value),
            );
      }
      this.onValueheight(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].height
          : this.props.consultList.message.vitals.height,
      );
      this.onValueweight(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].weight
          : this.props.consultList.message.vitals.weight,
      );
      this.sum1(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].bmi
          : this.props.consultList.message.vitals.bmi,
      );
      this.onValuepulse(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].pulse_rate
          : this.props.consultList.message.vitals.pulse_rate,
      );
      this.onValueoxg(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].oxygen_saturation
          : this.props.consultList.message.vitals.oxygen_saturation,
      );
      this.onValuespi(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].pefr
          : this.props.consultList.message.vitals.pefr,
      );
      this.onValuetemp(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].temperature
          : this.props.consultList.message.vitals.temperature,
      );
      this.onValueresp(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].respiratory_rate
          : this.props.consultList.message.vitals.respiratory_rate,
      );
      this.onValuebmi1(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].systolic
          : this.props.consultList.message.vitals.systolic,
      );
      this.onValuebmi2(
        this.props.consultList.message.enc_vitals instanceof Array &&
          this.props.consultList.message.enc_vitals.length > 0
          ? this.props.consultList.message.enc_vitals[0].diastolic
          : this.props.consultList.message.vitals.diastolic,
      );
    }
  };
  getTemp = async () => {
    SpiroReact.startTemp(
      (err) => {
        console.log(err);
      },
      (msg) => {
        let tmp = (msg * 9) / 5 + 32;
        this.setState({value6: tmp});
        console.log('hi' + tmp);
      },
    );
  };
  getAasha = async (text) => {
    alert('234');
    this.TurnOnBT();
    if (text == 'm') {
      this.setState({value6: ''});
    }
    if (text == 'p') {
      console.log('p');
      this.setState({value2: ''});
    }
    if (text == 'b') {
      this.setState({value1: '', value3: data[0]});
    }
    if (text == 's') {
      console.log('s');
      // this.setState({ value6: msg })
    }
    SpiroReact.startAasha(
      text,
      (err) => {
        console.log(err);
      },
      (msg) => {
        // let tmp = (msg * 9 / 5) + 32
        console.log('text' + msg);
        if (text == 'm') {
          console.log('m');
          this.setState({value6: msg});
        }
        if (text == 'p') {
          console.log('p');
          let data = msg.split(' ');
          this.setState({value2: data[1], value3: data[0]});
        }
        if (text == 'b') {
          this.setState({value1: msg});
        }
        if (text == 's') {
          this.setState({value6: msg});
        }
      },
    );
  };
  saveVitalsData = async (isCheckupAlert) => {
    this.disconnect()
    console.log(
      this.state.height + this.state.weight + this.state.bmi,
      this.state.value +
        this.state.value1 +
        this.state.value2 +
        this.state.value3 +
        this.state.value4 +
        this.state.value5 +
        this.state.value6,
    );
    if (
      this.state.height ||
      this.state.weight ||
      this.state.bmi != 0.0 ||
      this.state.value != 0 ||
      this.state.value1 != 0 ||
      this.state.value2 ||
      this.state.value3 ||
      this.state.value4 ||
      this.state.value5 ||
      this.state.value6
    ) {
      this.setState({load1: true});
      let obj = JSON.stringify({
        docid: global.doctor_id,
        token: global.token,
        height: this.state.height,
        weight: this.state.weight,
        bmi: this.state.bmi,
        systolic: Math.round(this.state.value),
        diastolic: Math.round(this.state.value1),
        pulse: this.state.value2,
        oxy_sat: this.state.value3,
        pefr: this.state.value4,
        resp: this.state.value5,
        temperature: this.state.value6,
        height1: this.state.height1,
        weight1: this.state.weight1,
        bmi1: this.state.weight1,
        systolic1: this.state.systolic1,
        diastolic1: this.state.diastolic1,
        pulse1: this.state.pulse1,
        oxy_sat1: this.state.oxy_sat1,
        pefr1: this.state.pefr1,
        resp1: this.state.resp1,
        temperature1: this.state.temperature1,
        editor_nurse_notes: this.state.nurse_note,
        encounter_show: this.state.encounter_show,
        age_value: this.props.screenProps.age,
        hlpid_show: this.state.hlpid,
        custom_label: this.state.customData,
      });
      console.log(obj);
      // alert(obj)
      await this.props.saveVitalsData(obj);
      // alert("Vitals Saved Successfully");
      // this.updateList();
      this.setState({isVitalsModified: false, load1: false});
      if (this.VitalsAlert && this.VitalsAlert.showMessage) {
        DeviceEventEmitter.emit("vitalssaved",{data:'charitha'})
        if (isCheckupAlert) {
          this.props.screenProps.showCheckupAlert({
            message: i18n.t('PATIENTS.SUB_SUCC'),
            description: i18n.t('PATIENTS.VITAL_TXT_SUCC'),
            type: 'success',
            icon: 'auto',
          });
        } else {
          this.VitalsAlert.showMessage({
            message: i18n.t('PATIENTS.VITAL_SUCC'),
           // description: i18n.t('PATIENTS.VITAL_TXT_SUCC'),
            type: 'success',
            icon: 'auto',
          });
        }
      }
    } else {
      alert(i18n.t('PATIENTS.PLS_VITAL'));
    }
  };
  getSpiro = async () => {
    SpiroReact.startSpiro(
      (err) => {
        console.log(err);
      },
      (msg) => {
        this.setState({value4: msg});
      },
    );
  };
  _startRecognizing = async (text) => {
    let listening = false;

    SpiroReact.speechToTextData(text);

    console.log('vitalsdata=' + listening);
    //  ob.remove()
  };
  vHeight(val) {
    var n = isNaN(val);
    console.log('height calledd');
    if (n == false) {
      console.log('height calledd2');
      if (val.length <= 3) {
        console.log('height calledd3');
        this.setState({height: val});
        // document.getElementById("height").value = val;
        // tab_edit=1;
        // sum();
        // get_height_alert(val);
      }
    }
  }
  vWeight = (val) => {
    var n = isNaN(val);
    if (n == false) {
      if (val.length <= 3) {
        this.setState({weight: val});

        // tab_edit=1;
        // sum();
        // get_weight_alert(val);
      }
    }
  };
  vSystolic_BP = (val) => {
    var n = isNaN(val);
    if (n == false) {
      this.setState({value: val});
      // tab_edit=1;
      // get_sys_bp(val)
    }
  };
  vDiastolic_BP = (val) => {
    var n = isNaN(val);
    if (n == false) {
      this.setState({value1: val});
      // tab_edit=1;
      // get_dia_bp(val)
    }
  };
  vPulse_Rate = (val) => {
    var n = isNaN(val);
    if (n == false) {
      this.setState({value2: val});
      // tab_edit=1;
      // pulseal(val)
    }
  };
  vTemperature = (val) => {
    var n = isNaN(val);
    if (n == false) {
      if (val <= 120) {
        this.setState({value6: val});
        // tab_edit=1;
        // temperature1(val);
      } else {
        alert(i18n.t('PATIENTS.ALERT1'));
      }
    }
  };
  vOxygen_Saturation = (val) => {
    var n = isNaN(val);
    if (n == false) {
      this.setState({value3: val});
      //tab_edit=1;
      //oxysat(val)
    }
  };
  vPEFR = (val) => {
    var n = isNaN(val);
    if (n == false) {
      this.setState({value4: val});
      //tab_edit=1;
      //spiro(val)
    }
  };
  vHeadcircumference(val) {
    var n = isNaN(val);
    if (n == false) {
      // document.getElementById("custom_field0").value = val;
      // tab_edit=1;
    }
  }
  vRespiratory_Rate = (val) => {
    var n = isNaN(val);
    if (n == false) {
      this.setState({value5: val});
      // tab_edit=1;
      // get_resp_alert(val)
    }
  };
  diff_months = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60 * 24 * 7 * 4;
    return Math.abs(Math.round(diff));
  };
  onValuebmi1 = (value) => {
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.toString().match(numbers)) {
        let val1 = Number(value);

        let val = this.state.height;
        if (val1 > 300) {
          alert(i18n.t('PATIENTS.ALERT3'));
        } else if (val1 <= 300) {
          let h = [];
          let a = [];
          let x = [];
          if (val && val1) {
            let dob = this.props.screenProps.dob;
            let dobdate = new Date(dob);
            let cur_date = new Date();
            let age_month = this.diff_months(cur_date, dobdate);
            let age1 = this.props.screenProps.age;
            let dob1 = age1.split(' ');
            let ageY = dob1[0].split('Y');
            let ageM = dob1[1].split('M');
            let gender = this.props.screenProps.gender;
            var height = this.state.height;
            var age = ageY[0];
            if (age == 0) {
              age = 1;
            }
            if (age_month < 204) {
              if (gender == 'male')
                h.push(this.props.validateList.message.m_sysbp);
              else h.push(this.props.validateList.message.fm_sysbp);

              if (gender == 'male')
                a.push(this.props.validateList.message.m_heightbp);
              else a.push(this.props.validateList.message.fm_heightbp);
              let s = new Array();
              let pval = 0;
              let perc = '';
              let percent50 = '';
              let percent90 = '';
              let percent95 = '';
              let percent99 = '';

              {
                Object.entries(a[0]).map(([key, v]) => {
                  if (age_month == key) {
                    let percentile = this.swap(a[0][key]);
                    {
                      Object.entries(percentile).map(([key1, v1]) => {
                        x.push(key1);
                      });
                    }
                    let k = x.sort();
                    let len = k.length;
                    for (let l = 0; l < len; l++) {
                      if (l == len - 2) {
                        let avg1 = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);

                        if (val <= avg1 && val > pval) {
                          perc = percentile[k[l]];
                        } else if (val > avg1) {
                          perc = percentile[k[l + 1]];
                        }
                      } else if (l == len - 1) {
                        var avg1 = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);
                        var avg2 = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);
                        if (val <= avg2 && val > avg1) {
                          perc = percentile[k[l]];
                        } else if (val > avg2 && val <= k[l + 1]) {
                          perc = percentile[k[l + 1]];
                        }
                      } else {
                        var avg = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);
                        var avg2 = (
                          (parseFloat(k[l + 1]) + parseFloat(k[l + 2])) /
                          2
                        ).toFixed(1);
                        if (val <= avg && val > pval) {
                          perc = percentile[k[l]];
                        }
                        pval = avg;
                      }
                      let percent = percentile[height];
                    }
                  }
                });
              }

              {
                Object.entries(h[0]).map(([key2, v2]) => {
                  if (age == key2) {
                    {
                      Object.entries(h[0][key2]).map(([key3, v3]) => {
                        percent50 = h[0][key2][key3]['50'];
                        percent90 = h[0][key2][key3]['90'];
                        percent95 = h[0][key2][key3]['95'];
                        percent99 = h[0][key2][key3]['99'];
                      });
                    }
                    if (val1 >= percent50 && val1 <= percent90) {
                      this.setState({b: 1});
                      this.setState({borderColorsystolic: '#00B050'});
                      this.setState({systolic1: '1'});
                    } else if (val1 > percent90 && val1 < percent95) {
                      this.setState({b: 0.5});
                      this.setState({borderColorsystolic: '#FFBF00'});
                      this.setState({systolic1: '0.5'});
                    } else if (val1 >= percent95 || val1 < percent50) {
                      this.setState({b: 0});
                      this.setState({borderColorsystolic: '#FF0000'});
                      this.setState({systolic1: '0'});
                    } else if (val1 > percent99 || val1 < percent50) {
                      this.setState({b: 0});
                      this.setState({borderColorsystolic: '#FF0000'});
                      this.setState({systolic1: '0'});
                    }
                    this.setState({value: val1});
                  }
                });
              }
            } else {
              if (value >= 100 && value <= 120) {
                let b = 1;
                this.setState({borderColorsystolic: '#00B050'});
                this.setState({systolic1: '1'});
              } else if (
                (value >= 90 && value < 100) ||
                (value > 120 && value < 140)
              ) {
                let b = 0.5;
                this.setState({borderColorsystolic: '#FFBF00'});
                this.setState({systolic1: '0.5'});
              } else if (value >= 140 || value < 90) {
                let b = 0;
                this.setState({borderColorsystolic: '#FF0000'});
                this.setState({systolic1: '0'});
              } else {
                this.setState({borderColorsystolic: '#FEFBFB'});
              }
              this.setState({value: val1});
            }
          }
          this.setState({value: value});
        }
        global.value = value;
        global.systolic1 = this.state.systolic1;
      } else {
        alert('Please Enter Digits');
      }
    } else {
      this.setState({value: 0, borderColorsystolic: '#FEFBFB'});
    }
  };
  onValuebmi2 = (value) => {
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.toString().match(numbers)) {
        let val2 = Number(value);
        let val = this.state.height;
        if (val2 > 300) {
          alert(i18n.t('PATIENTS.ALERT3'));
        } else if (val2 <= 300) {
          let h = [];
          let a = [];
          let x = [];
          if (val && val2) {
            // alert("hi"+this.props.applyList.message)
            let dob = this.props.screenProps.dob;
            let dobdate = new Date(dob);
            let cur_date = new Date();
            let age_month = this.diff_months(cur_date, dobdate);
            let age1 = this.props.screenProps.age;
            let dob1 = age1.split(' ');
            let ageY = dob1[0].split('Y');
            let ageM = dob1[1].split('M');
            let gender = this.props.screenProps.gender;
            var height = this.state.height;
            var age = ageY[0];
            // alert(age_month)
            if (age == 0) {
              age = 1;
            }

            if (age_month < 204) {
              if (gender == 'male')
                h.push(this.props.validateList.message.m_diabp);
              else h.push(this.props.validateList.message.fm_diabp);

              if (gender == 'male')
                a.push(this.props.validateList.message.m_heightbp);
              else a.push(this.props.validateList.message.fm_heightbp);
              let s = new Array();
              let pval = 0;
              let perc = '';
              let percent50 = '';
              let percent90 = '';
              let percent95 = '';
              let percent99 = '';

              {
                Object.entries(a[0]).map(([key, v]) => {
                  if (age_month == key) {
                    let percentile = this.swap(a[0][key]);
                    {
                      Object.entries(percentile).map(([key1, v1]) => {
                        x.push(key1);
                      });
                    }
                    let k = x.sort();
                    let len = k.length;
                    for (let l = 0; l < len; l++) {
                      if (l == len - 2) {
                        let avg1 = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);

                        if (val <= avg1 && val > pval) {
                          perc = percentile[k[l]];
                        } else if (val > avg1) {
                          perc = percentile[k[l + 1]];
                        }
                      } else if (l == len - 1) {
                        var avg1 = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);
                        var avg2 = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);
                        if (val <= avg2 && val > avg1) {
                          perc = percentile[k[l]];
                        } else if (val > avg2 && val <= k[l + 1]) {
                          perc = percentile[k[l + 1]];
                        }
                      } else {
                        var avg = (
                          (parseFloat(k[l]) + parseFloat(k[l + 1])) /
                          2
                        ).toFixed(1);
                        var avg2 = (
                          (parseFloat(k[l + 1]) + parseFloat(k[l + 2])) /
                          2
                        ).toFixed(1);
                        if (val <= avg && val > pval) {
                          perc = percentile[k[l]];
                        }
                      }
                      let percent = percentile[height];
                    }
                  }
                });
              }

              {
                Object.entries(h[0]).map(([key2, v2]) => {
                  if (age == key2) {
                    {
                      Object.entries(h[0][key2]).map(([key3, v3]) => {
                        percent50 = h[0][key2][key3]['50'];
                        percent90 = h[0][key2][key3]['90'];
                        percent95 = h[0][key2][key3]['95'];
                        percent99 = h[0][key2][key3]['99'];
                      });
                    }
                    if (val2 >= percent50 && val2 <= percent90) {
                      this.setState({b: 1});
                      this.setState({borderColordiastolic: '#00B050'});
                      this.setState({diastolic1: '1'});
                    } else if (val2 >= percent90 && val2 < percent95) {
                      this.setState({b: 0.5});
                      this.setState({borderColordiastolic: '#FFBF00'});
                      this.setState({diastolic1: '0.5'});
                    } else if (val2 >= percent95 || val2 < percent50) {
                      this.setState({b: 0});
                      this.setState({borderColordiastolic: '#FF0000'});
                      this.setState({diastolic1: '0'});
                    } else if (val2 > percent99 || val2 < percent50) {
                      this.setState({b: 0});
                      this.setState({borderColordiastolic: '#FF0000'});
                      this.setState({diastolic1: '0'});
                    }
                    this.setState({value1: val2});
                  }
                });
              }
            } else {
              if (value >= 70 && value <= 80) {
                let b = 1;
                this.setState({borderColordiastolic: '#00B050'});
                this.setState({diastolic1: '0'});
              } else if (
                (value >= 60 && value < 70) ||
                (value > 80 && value < 90)
              ) {
                let b = 0.5;
                this.setState({borderColordiastolic: '#FFBF00'});
                this.setState({diastolic1: '0.5'});
              } else if (value >= 90 || value < 60) {
                let b = 0;
                this.setState({borderColordiastolic: '#FF0000'});
                this.setState({diastolic1: '0'});
              } else {
                this.setState({borderColordiastolic: '#FEFBFB'});
              }
              this.setState({value1: val2});
            }
          }
          this.setState({value1: value});
        }
        global.value1 = value;
        global.diastolic1 = this.state.diastolic1;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.setState({value1: 0, borderColordiastolic: '#FEFBFB'});
    }
  };
  onValuepulse = (value) => {
    console.log('o3', value);
    value = value.trim();
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        this.setState({value2: value});
        let age = this.props.screenProps.age;
        let age1 = age.split(' ');
        let ageYear = age1[0].split('Y');
        age = ageYear[0];
        if (value) {
          if (age >= 1 && age <= 10) {
            if (value >= 69 && value <= 129) {
              this.setState({borderColorpulse: '#00B050'});
              this.setState({pulse1: '1'});
            } else {
              this.setState({borderColorpulse: '#FF0000'});
              this.setState({pulse1: '0'});
            }
          } else {
            if (value >= 59 && value <= 99) {
              this.setState({borderColorpulse: '#00B050'});
              this.setState({pulse1: '1'});
            } else {
              this.setState({borderColorpulse: '#FF0000'});
              this.setState({pulse1: '0'});
            }
          }
        } else {
          this.setState({borderColorpulse: '#FEFBFB'});
        }
        global.value2 = value;
        global.pulse1 = this.state.pulse1;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.setState({value2: '', borderColorpulse: '#FEFBFB'});
    }
  };
  onValueoxg = (value) => {
    console.log('o2', value);
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        // this.state.value3 = value;
        console.log('oxy8', value, this.state.value3);
        this.setState({value3: value});
        if (value) {
          console.log('oxy2=' + value + ' value3=' + this.state.value3);
          if (value >= 90 && value <= 100) {
            console.log('oxy3=' + value + ' value3=' + this.state.value3);
            this.setState({borderColoroxg: '#00B050'});
            this.setState({oxy_sat1: '1'});
          } else {
            console.log('oxy4=' + value + ' value3=' + this.state.value3);
            this.setState({borderColoroxg: '#FF0000'});
            this.setState({oxy_sat1: '0'});
          }
        } else {
          console.log('oxy5=' + value + ' value3=' + this.state.value3);
          this.setState({borderColoroxg: '#FEFBFB'});
        }
        console.log('oxy9', value);
        global.value3 = value;
        console.log('oxy6', global.value3, value);
        global.oxy_sat1 = this.state.oxy_sat1;
        console.log('oxy10', this.state.oxy_sat1);
        console.log('oxy11', this.state.value3);
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      console.log('Elsepart');
      this.setState({value3: '', borderColoroxg: '#FEFBFB'});
    }
  };
  onValuespi = (value) => {
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        global.spiro = value;
        this.setState({value4: value});
        if (value) {
          if (this.state.height != '') {
            var cal = this.state.height - 100;
            var mul = cal * 5;
            var pefr = mul + 100;
            var half = pefr / 2;
            var past = pefr / 5;
            var eighty = past * 4;
            if (value >= eighty) {
              this.setState({borderColorpefr: '#00B050'});
              this.setState({pefr1: '1'});
            } else if (value >= half && value < eighty) {
              this.setState({borderColorpefr: '#FFBF00'});
              this.setState({pefr1: '0.5'});
            } else {
              this.setState({borderColorpefr: '#FF0000'});
              this.setState({pefr1: '0'});
            }
          }
        } else {
          this.setState({borderColorpefr: '#FEFBFB'});
        }
        global.value4 = value;
        global.pefr1 = this.state.pefr1;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.setState({value4: '', borderColorpefr: '#FEFBFB'});
    }
  };
  onValueresp = (value) => {
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        global.resp = value;
        this.setState({value5: value});
        let age = this.props.screenProps.age;
        let age1 = age.split(' ');
        let ageMonths = age1[1].split('M');
        if (!ageMonths[0]) {
          ageMonths[0] = 0;
        }
        if (value) {
          if (ageMonths < 1) {
            if (value >= 30 && value <= 40) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          } else if (ageMonths <= 6) {
            if (value >= 25 && value <= 40) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          } else if (ageMonths <= 36) {
            if (value >= 20 && value <= 30) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          } else if (ageMonths <= 72) {
            if (value >= 18 && value <= 25) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          } else if (ageMonths <= 120) {
            if (value >= 17 && value <= 23) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          } else if (ageMonths <= 780) {
            if (value >= 12 && value <= 18) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          } else if (ageMonths <= 960) {
            if (value >= 12 && value <= 28) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          } else {
            if (value >= 10 && value <= 30) {
              this.setState({b: 1});
              this.setState({borderColorresp: '#00B050'});
              this.setState({resp1: '1'});
            } else {
              this.setState({b: 0});
              this.setState({borderColorresp: '#FF0000'});
              this.setState({resp1: '0'});
            }
          }

          this.setState({resp1: this.state.b});
        } else {
          this.setState({borderColorresp: '#FEFBFB'});
        }
        global.value5 = value;
        global.resp1 = this.state.resp1;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.setState({value5: '', borderColorresp: '#FEFBFB'});
    }
  };
  onValuetemp = (value) => {
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        if (numbers.test(value) == false) {
          value = value.substring(0, value.length - 1);
        }
        this.setState({value6: value});
        if (value) {
          if (value >= 94 && value < 99) {
            this.setState({bordertemperatue: '#00B050'});
            this.setState({temperature1: '1'});
          } else if (value >= 99 && value <= 100) {
            this.setState({bordertemperatue: '#FFBF00'});
            this.setState({temperature1: '0.5'});
          } else {
            this.setState({bordertemperatue: '#FF0000'});
            this.setState({temperature1: '0'});
          }
        } else {
          this.setState({bordertemperatue: '#FEFBFB'});
        }

        global.value6 = value;
        global.temperature1 = this.state.temperature1;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.setState({value6: '', bordertemperatue: '#FEFBFB'});
    }
  };
  onValueheight = (value) => {
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        if (numbers.test(value) == false) {
          value = value.substring(0, value.length - 1);
        }
        this.setState({height: value});
        let age = this.props.screenProps.age;
        let age1 = age.split(' ');
        let ageYear = age1[0].split('Y');
        let ageMonths = age1[1].split('M');
        if (!ageMonths[0]) {
          ageMonths[0] = 0;
        }
        let gender = this.props.screenProps.gender;
        let h = [];
        let orgAge = ageYear[0] + '.' + ageMonths[0];
        if (orgAge <= 19.0) {
          if (gender == 'male') {
            h.push(this.props.validateList.message.m_height);
          } else {
            h.push(this.props.validateList.message.fm_height);
          }
          {
            Object.entries(h[0]).map(([key, v]) => {
              if (key == orgAge) {
                console.log('height_age=' + orgAge);

                let h1 = v['FIELD1'];
                let h2 = v['FIELD2'];
                let h3 = v['FIELD3'];
                let h4 = v['FIELD4'];
                let h5 = v['FIELD5'];
                let h6 = v['FIELD6'];
                let h7 = v['FIELD7'];
                if (value) {
                  if ((value >= h3 && value <= h7) || value > h7) {
                    this.setState({u: 1});
                    this.setState({borderColorHeight: '#00B050'});
                    this.setState({height1: '1'});
                  } else if (value >= h2 && value < h3) {
                    this.setState({u: 0.5});
                    this.setState({borderColorHeight: '#FFBF00'});
                    this.setState({height1: '0.5'});
                  }
                  // else if (value > h5 && value <= h6) {
                  //     this.setState({ u: 1 })
                  //     this.setState({ borderColorHeight: "#00B050" })
                  //     this.setState({ height1: "1" })
                  // }
                  else if (value < h2) {
                    this.setState({u: 0});
                    this.setState({borderColorHeight: '#FF0000'});
                    this.setState({height1: '0'});
                  }
                  //  else if (value > h6) {
                  //     this.setState({ u: 1 })
                  //     this.setState({ borderColorHeight: "#00B050" })
                  //     this.setState({ height1: "1" })
                  // }
                  this.setState({height1: this.state.u});
                } else {
                  this.setState({borderColorHeight: '#FEFBFB'});
                }
              }
            });
          }
        } else if (value) {
          if (value >= 171.6) {
            this.setState({u: 1});
            this.setState({borderColorHeight: '#00B050'});
            this.setState({height1: '1'});
          } else if (
            (value >= 167.2 && value < 171.6) ||
            (value > 181.5 && value <= 185.9)
          ) {
            this.setState({u: 0.5});
            this.setState({borderColorHeight: '#FFBF00'});
            this.setState({height1: '0.5'});
          }
          // else if (value > 181.5 && value <= 185.9) {
          //     this.setState({ u: 1 })
          //     this.setState({ borderColorHeight: "#00B050" })
          //     this.setState({ height1: "1" })
          // }
          else if (value < 167.2 || value > 188.5) {
            this.setState({u: 0});
            this.setState({borderColorHeight: '#FF0000'});
            this.setState({height1: '0'});
          }
          this.setState({height1: this.state.u});
        } else {
          this.setState({borderColorHeight: '#FEFBFB'});
        }
        this.sum('height', value, this.state.weight);

        global.height = value;
        global.height1 = this.state.height1;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.setState({height: '', borderColorHeight: '#FEFBFB'});
    }
  };
  onValueweight = (value) => {
    if (value != '') {
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        if (numbers.test(value) == false) {
          value = value.substring(0, value.length - 1);
        }
        this.setState({weight: value});
        let age = this.props.screenProps.age;
        let age1 = age.split(' ');
        let ageYear = age1[0].split('Y');
        let ageMonths = age1[1].split('M');
        if (!ageMonths[0]) {
          ageMonths[0] = 0;
        }
        let gender = this.props.screenProps.gender;
        let h = [];
        let orgAge = ageYear[0] + '.' + ageMonths[0];
        if (orgAge <= 20.0) {
          if (gender == 'male') {
            h.push(this.props.validateList.message.m_weight);
          } else {
            h.push(this.props.validateList.message.fm_weight);
          }
          {
            Object.entries(h[0]).map(([key, v]) => {
              if (key == orgAge) {
                console.log('weight_age=' + orgAge);
                let h1 = v['FIELD1'];
                let h2 = v['FIELD2'];
                let h3 = v['FIELD3'];
                let h4 = v['FIELD4'];
                let h5 = v['FIELD5'];
                let h6 = v['FIELD6'];
                let h7 = v['FIELD7'];

                if (value) {
                  if (value >= h3 && value <= h5) {
                    this.setState({w: 1});
                    this.setState({borderColorWeight: '#00B050'});
                    this.setState({weight1: '1'});
                  } else if (
                    (value >= h2 && value < h3) ||
                    (value > h5 && value <= h6)
                  ) {
                    this.setState({w: 0.5});
                    this.setState({borderColorWeight: '#FFBF00'});
                    this.setState({weight1: '0.5'});
                  } else if (value < h2 || value > h6) {
                    this.setState({w: 0});
                    this.setState({borderColorWeight: '#FF0000'});
                    this.setState({weight1: '0'});
                  }
                  this.setState({weight1: this.state.w});
                } else {
                  this.setState({borderColorWeight: '#FEFBFB'});
                }
              }
            });
          }
        } else {
          if (value) {
            if (value >= 63.64 && value <= 79.18) {
              this.setState({w: 1});
              this.setState({borderColorWeight: '#00B050'});
              this.setState({weight1: '1'});
            } else if (
              (value >= 58.41 && value < 63.64) ||
              (value > 79.18 && value <= 88.81)
            ) {
              this.setState({w: 0.5});
              this.setState({borderColorWeight: '#FFBF00'});
              this.setState({weight1: '0.5'});
            } else if (value < 58.41 || value > 88.81) {
              this.setState({w: 1});
              this.setState({borderColorWeight: '#FF0000'});
              this.setState({weight1: '0'});
            }
            this.setState({weight1: this.state.w});
          } else {
            this.setState({borderColorWeight: '#FEFBFB'});
          }
        }
        this.sum('weight', this.state.height, value);

        global.weight = value;
        global.weight1 = this.state.weight1;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.setState({weight: '', borderColorWeight: '#FEFBFB'});
    }
  };
  onValuecus1 = (key, value) => {
    console.log(key, value);
    if (value != '') {
      console.log('a');
      var numbers = /^[0-9]*\.?[0-9]*$/;
      if (value.match(numbers)) {
        console.log('b');
        if (numbers.test(value) == false) {
          console.log('c');
          value = value.substring(0, value.length - 1);
        }
        this.state.customData[key].value = value;
        this.setState({customData: this.state.customData});

        let b;
        console.log(this.state.customData[key].label.trim());
        if (this.state.customData[key].label.trim() == 'Head Circumference') {
          console.log('d');
          let dob = this.props.screenProps.dob;
          let dobdate = new Date(dob);
          let age = this.props.screenProps.age;
          let age1 = age.split(' ');
          let ageY = age1[0].split('Y');
          let ageM = age1[1].split('M');
          let age_month = parseInt(ageY) * 12 + parseInt(ageM);
          console.log('age_month' + age_month);
          let gender = this.props.screenProps.gender;
          if (age_month <= 60) {
            console.log('d');
            let h = [];
            if (gender == 'male') {
              h.push(this.props.validateList.message.m_head);
            } else {
              h.push(this.props.validateList.message.fm_head);
            }

            let fieldh1;
            let fieldh2;
            let fieldh3;
            let fieldh4;
            let fieldh5;
            {
              Object.entries(h[0]).map(([key, v]) => {
                if (age_month == key) {
                  fieldh1 = h[0][key]['1'];
                  fieldh2 = h[0][key]['2'];
                  fieldh3 = h[0][key]['3'];
                  fieldh4 = h[0][key]['4'];
                  fieldh5 = h[0][key]['5'];
                  if (value) {
                    console.log('e');
                    if (value > fieldh2 && value < fieldh4) {
                      b = 1;
                      this.setState({borderColorcus1: '#00B050'});
                    } else if (
                      (value > fieldh1 && value <= fieldh2) ||
                      (value >= fieldh4 && value < fieldh5)
                    ) {
                      b = 0.5;
                      this.setState({borderColorcus1: '#FFBF00'});
                    } else if (value <= fieldh1 || value >= fieldh5) {
                      b = 0;
                      this.setState({borderColorcus1: '#FF0000'});
                    } else {
                      b = 0;
                      this.setState({borderColorcus1: '#FF0000'});
                    }
                  }
                  console.log(this.state.borderColorcus1);
                }
              });
            }
          } else {
            console.log('age');
          }
        } else {
          b = 0;
          // this.setState({ borderColorcus1: "#FEFBFB" })
        }

        global.customData = this.state.customData;
      } else {
        alert(i18n.t('PATIENTS.DIGIT'));
      }
    } else {
      this.state.customData[key].value = '';
      this.setState({customData: this.state.customData});
    }
  };
  sum = (key, value1, value2) => {
    // if(this.state.height==""||this.state.height==0||this.state.weight==""||this.state.weight==0){
    // }
    // else{
    let bmi2 = '';
    if (value2 !== 0) {
      if (key == 'height') {
      }
      if (key == 'weight') {
        this.setState({weight: value2});
      }
      //
      if (this.state.height != '') {
        let bmi = (value2 / value1 / value1) * 10000;
        let bmi2 = bmi.toFixed(2);
        this.setState({bmi: bmi2});
        this.sum1(bmi2);
      }
    }
    global.bmi = this.state.bmi;
    //}
  };
  sum1 = (bmi2) => {
    this.setState({bmi: bmi2});
    let age = this.props.screenProps.age;
    let age1 = age.split(' ');
    let ageYear = age1[0].split('Y');
    let ageMonths = age1[1].split('M');
    if (!ageMonths[0]) {
      ageMonths[0] = 0;
    }
    let gender = this.props.screenProps.gender;
    let h = [];
    let orgAge = ageYear[0] + '.' + ageMonths[0];
    if (bmi2) {
      if (orgAge <= 19.0) {
        if (gender == 'male') {
          h.push(this.props.validateList.message.m_bmi);
        } else {
          h.push(this.props.validateList.message.fm_bmi);
        }
        {
          Object.entries(h[0]).map(([key, v]) => {
            if (key == orgAge) {
              console.log('bmi_age=' + orgAge);
              let h1 = v['FIELD1'];
              let h2 = v['FIELD2'];
              let h3 = v['FIELD3'];
              let h4 = v['FIELD4'];
              let h5 = v['FIELD5'];
              let h6 = v['FIELD6'];
              let h7 = v['FIELD7'];
              if (bmi2) {
                if (bmi2 >= h3 && bmi2 <= h5) {
                  this.setState({b: 1});
                  this.setState({borderColorbmi: '#00B050'});
                  this.setState({bmi1: '1'});
                } else if (
                  (bmi2 >= h2 && bmi2 < h3) ||
                  (bmi2 > h5 && bmi2 <= h6)
                ) {
                  this.setState({b: 0.5});
                  this.setState({borderColorbmi: '#FFBF00'});
                  this.setState({bmi1: '0.5'});
                } else if (bmi2 < h2 || bmi2 > h6) {
                  this.setState({b: 0});
                  this.setState({borderColorbmi: '#FF0000'});
                  this.setState({bmi1: '0'});
                }
                this.setState({bmi1: this.state.b});
              } else {
                this.setState({borderColorbmi: '#FEFBFB'});
              }
            }
          });
        }
      } else {
        if (bmi2) {
          if (bmi2 >= 18.5 && bmi2 < 25) {
            this.setState({b: 1});
            this.setState({borderColorbmi: '#00B050'});
            this.setState({bmi1: '1'});
          } else if (bmi2 >= 25 && bmi2 < 30) {
            this.setState({b: 0.5});
            this.setState({borderColorbmi: '#FFBF00'});
            this.setState({bmi1: '0.5'});
          } else if (bmi2 < 18.5 || bmi2 >= 30) {
            this.setState({b: 1});
            this.setState({borderColorbmi: '#FF0000'});
            this.setState({bmi1: '0'});
          }
          this.setState({bmi1: this.state.b});
        } else {
          this.setState({borderColorbmi: '#FEFBFB'});
        }
      }
    } else {
      this.setState({borderColorbmi: '#070707'});
    }
    global.bmi = this.state.bmi;
  };
  data = (val) => {
    if (val) {
      let len = val.length;
      if (len == 1 || len == 5 || len == 6) {
        if (val.charAt(len - 1) != '.') {
          // this.setState({height:val})
          return true;
        } else {
          return false;
        }
      } else if (len == 2 || len == 3) {
        // this.setState({height:val})
        return true;
      } else if (len == 4) {
        if (val.charAt(len - 1) == '.') {
          if (val.charAt(len - 2) != '.') {
            // this.setState({height:val})
            return true;
          } else {
            return false;
          }
        } else {
          if (val.charAt(len - 2) == '.') {
            // this.setState({height:val})
            return true;
          } else {
            return false;
          }
        }
      }
    } else {
      return 'empty';
    }
  };

  swap = (json) => {
    let ret = {};
    {
      Object.entries(json).map(([key, v]) => {
        ret[v] = key;
      });
    }
    return ret;
  };

  render() {
    // let deviceWidth = Dimensions.get('window').width
    // this.setState({
    //   consult:global.consult
    // })
    if (this.state.loading1) {
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
    const left =
      (this.state.value * (Math.round(this.state.screenWidth / 5) - 20)) / 100 -
      15;
    const left1 =
      (this.state.value1 * (Math.round(this.state.screenWidth / 5) - 20)) /
        100 -
      15;
    // alert(global.consult)
    if (this.state.load1) {
      return (
        <View
          style={{
            flex: 1,
            marginTop: 250,
            // justifyContent: 'center',
            // alignItems: 'center'
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    if (this.state.alertvisible4) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            height={240}
            onBackdropPress={() => this.setState({alertvisible4: false})}>
            <Icon
              type="FontAwesome"
              name="check-circle"
              style={{
                fontSize: 60,
                color: 'green',
                alignSelf: 'center',
                marginTop: 30,
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                marginVertical: 30,
              }}>
              {i18n.t(PATIENTS.VITAL_SUCC)}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{height: 40, marginTop: 8, marginRight: 10, width: 80}}
                onPress={() => this.setState({alertvisible4: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  {i18n.t('PATIENTS.SAVE')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    if (this.state.vitals_lay) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            fullScreen={true}
            height={240}
            onBackdropPress={() => this.setState({vitals_lay: false})}>
            <Row
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                height: 50,
                marginTop: -10,
                marginHorizontal: -50,
              }}>
              <Col size={25}>
                <TouchableOpacity
                  onPress={() => this.setState({vitals_lay: false})}>
                  <Icon
                    type="FontAwesome"
                    name="arrow-left"
                    style={{
                      fontSize: 20,
                      marginTop: 15,
                      marginLeft: 50,
                      color: 'white',
                    }}
                  />
                </TouchableOpacity>
              </Col>
              <Col size={75}>
                <Text style={{color: 'white', marginTop: 15, fontSize: 16}}>
                {i18n.t('PATIENTS.VITAL_HISTORY')}
                </Text>
              </Col>
            </Row>
            <Container>
              <Content>
                <Row style={{marginTop: 20}}>
                  <Col>
                    {/* <Text style={{textAlign:"center",fontWeight:"bold"}}>{this.state.name}</Text> */}
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {i18n.t('PATIENTS.VITAL_ID')}:{this.props.screenProps.enc_id}
                    </Text>
                  </Col>
                </Row>
                {this.state.v_data.length != 0 && (
                  <Row style={{marginHorizontal: 5, marginTop: 30}}>
                    <Col size={28}>
                      {/* <Text style={{fontWeight:"bold"}}>Month</Text>
      <Text style={{marginTop:10,fontWeight:"bold"}}>Day</Text>
      <Text style={{marginTop:10,fontWeight:"bold"}}>Time</Text> */}
                      <Text style={{marginTop: 100}}>{i18n.t('PATIENTS.HEIGHT')}({i18n.t('PATIENTS.CM')})</Text>
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.WEIGHT')}({i18n.t('PATIENTS.KGS')})</Text>
                      <Text style={{marginTop: 10}}>
                      {i18n.t('PATIENTS.BMI')}({i18n.t('PATIENTS.KGM')}<Text style={{fontSize: 5}}>2</Text>)
                      </Text>
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.SYS')}({i18n.t('PATIENTS.MM')})</Text>
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.DIA')}({i18n.t('PATIENTS.HG')})</Text>
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.PULSE')}({i18n.t('PATIENTS.MIN')})</Text>
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.O2SAT')}(%)</Text>
                      {/* {this.state.pf!=""&&this.state.pf!=null&&this.state.pf!=undefined&&<Text style={{marginTop:10}}>PEFR(Ltr/min)</Text>} */}
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.PEFR')}({i18n.t('PATIENTS.LM')})</Text>
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.RESP')}({i18n.t('PATIENTS.MIN')})</Text>
                      <Text style={{marginTop: 10}}>{i18n.t('PATIENTS.TEMP')}({i18n.t('PATIENTS.DEGREE')})</Text>
                    </Col>
                    <Col size={68}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}>
                        {this.state.v_data.map((item) => (
                          <Row>
                            <Col>
                              {/* <Row>
          <Col>
         
          </Col>
        </Row> */}
                              <Row>
                                <Col style={{marginLeft: 10}} size={90}>
                                  {/* <Text style={{fontWeight:"bold",textAlign:"center"}}></Text>
        <Text style={{marginTop:10,fontWeight:"bold",textAlign:"center"}}></Text>
        <Text style={{marginTop:10,fontWeight:"bold",textAlign:"center"}}></Text> */}
                                  {/* <Text>{moment(item.created_date).format('hh:mm A')}</Text> */}
                                  {/* <TouchableOpacity> */}

                                  {/* <Text style={{fontWeight:"bold",marginTop:-10,transform: [{ rotate: '-90deg'}]}}>&</Text> */}
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[9]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[8]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[7]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[6]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    /
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[4]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[3]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    /
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[1]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date.split(' ')[0])
                                        .format('DD-MM-YYYY')
                                        .split('')[0]
                                    }
                                  </Text>
                                  {/* </TouchableOpacity> */}
                                  <Text
                                    style={{marginTop: 10, width: 50}}></Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.height}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.weight}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.bmi != '' &&
                                      item.bmi != null &&
                                      Number(item.bmi).toFixed(1)}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.systolic != '' &&
                                      item.systolic != 0 &&
                                      item.systolic != null &&
                                      item.systolic != undefined &&
                                      item.systolic}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.diastolic != '' &&
                                      item.diastolic != 0 &&
                                      item.diastolic != null &&
                                      item.diastolic != undefined &&
                                      item.diastolic}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.pulse_rate}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.oxygen_saturation}
                                  </Text>
                                  {/* {(item.PEFR!=""&&item.PEFR!=null&&item.PEFR!=undefined)?<Text style={{marginTop:10,marginLeft:15,textAlign:"center"}}>{item.PEFR}</Text>:""} */}
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.PEFR}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.respiratory_rate}
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: 10,
                                      marginLeft: 15,
                                      textAlign: 'center',
                                    }}>
                                    {item.temperature}
                                  </Text>
                                  {/* <Text style={{marginTop:10,transform: [{ rotate: '-90deg'}]}}><Text style={{transform: [{ rotate: '-90deg'}]}}>hi</Text><Text style={{transform: [{ rotate: '-90deg'}]}}>hi</Text></Text> */}
                                  {/* {item.height_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginLeft:12,marginTop:10}} />}
  {item.height_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.height_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />} */}

                                  {/* {item.weight_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.weight_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.weight_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

  {item.bmi_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.bmi_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.bmi_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

  {item.systolic_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.systolic_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.systolic_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

  {item.diastolic_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.diastolic_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.diastolic_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

  {item.pulse_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.pulse_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.pulse_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

{item.oxygen_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
{item.oxygen_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
{item.oxygen_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

{item.PEFR_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.PEFR_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.PEFR_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

  {item.resp_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.resp_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.resp_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />}

  {item.temp_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000",marginTop:10}} />}
  {item.temp_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00",marginTop:10}} />}
  {item.temp_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050",marginTop:10}} />} */}
                                </Col>
                                <Col
                                  size={10}
                                  style={{marginTop: 18, marginLeft: -8}}>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date)
                                        .format('hh:mm A')
                                        .split('')[7]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date)
                                        .format('hh:mm A')
                                        .split('')[6]
                                    }
                                  </Text>
                                  {/* <Text style={{fontWeight:"bold",marginTop:-10,transform: [{ rotate: '-90deg'}]}}>{moment(item.created_date).format('hh:mm A').split("")[5]}</Text> */}
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date)
                                        .format('hh:mm A')
                                        .split('')[4]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date)
                                        .format('hh:mm A')
                                        .split('')[3]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date)
                                        .format('hh:mm A')
                                        .split('')[2]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date)
                                        .format('hh:mm A')
                                        .split('')[1]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}>
                                    {
                                      moment(item.created_date)
                                        .format('hh:mm A')
                                        .split('')[0]
                                    }
                                  </Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        ))}
                      </ScrollView>
                    </Col>
                  </Row>
                )}

                {this.state.v_data.length == 0 && (
                  <Row>
                    <Col>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 20,
                          marginTop: 25,
                        }}>
                        {i18n.t('PATIENTS.NODATA')}
                      </Text>
                    </Col>
                  </Row>
                )}
                {/* <Icon type="FontAwesome" name="check-circle" style={{ fontSize: 60, color: "green", alignSelf: 'center', marginTop: 30 }} /> */}
                {/* <Text allowFontScaling={false} style={{ alignSelf: 'center', fontSize: 14, fontWeight: 'bold', marginVertical: 30 }}>Vitals Saved Successfully</Text> */}
                {/* <View style={{ flexDirection: "row", alignSelf: "center" }}> */}
                {/* <Row>
                            <Col style={{alignItems:"center",marginTop:25}}>
                            <Button style={{ height: 40,width: 80,backgroundColor: APP_PRIMARY_COLOR }} onPress={() => this.setState({ vitals_lay: false })}>
                                <Text allowFontScaling={false} style={{ color: "white", marginLeft: 25 }}>Close</Text>
                            </Button>
                            </Col>
                        </Row> */}

                {/* </View> */}
              </Content>
            </Container>
          </Overlay>
        </View>
      );
    }

    return (
      <Container>
        <Content style={{marginTop: 15}}>
          <Row>
            <Col style={{backgroundColor: '#EFEDED', marginTop: 5}}>
              <Row>
                <Col size={4}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginLeft: 5,
                      marginTop: 15,
                    }}>
                    {i18n.t('PATIENTS.HEIGHT')}
                  </Text>
                </Col>
                <Col size={4}>
                  <TextInput
                    allowfontScaling={false}
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={this.state.height}
                    keyboardType="numeric"
                    maxLength={6}
                    style={styles.input}
                    backgroundColor={this.state.borderColorHeight}
                    onChangeText={(text) => {
                      this.onValueheight(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                </Col>
                <Col size={2}>
                  <Text allowFontScaling={false} style={{marginTop: 12}}>
                  {i18n.t('PATIENTS.CM')}
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col size={4}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginLeft: 5,
                      marginTop: 12,
                    }}>
                   {i18n.t('PATIENTS.WEIGHT')}
                  </Text>
                </Col>
                <Col size={4}>
                  <TextInput
                    allowfontScaling={false}
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={this.state.weight}
                    keyboardType="numeric"
                    maxLength={6}
                    style={styles.input}
                    backgroundColor={this.state.borderColorWeight}
                    onChangeText={(text) => {
                      this.onValueweight(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                </Col>
                <Col size={2}>
                  <Text allowFontScaling={false} style={{marginTop: 12}}>
                  {i18n.t('PATIENTS.KGS')}
                  </Text>
                </Col>
              </Row>
            </Col>
            {/* Oxygen Saturation start  */}
            <Col
              style={{backgroundColor: '#EFEDED', marginTop: 5, marginLeft: 5}}>
              <Row>
                <Col size={50} style={{alignItems: 'center', marginTop: 20}}>
                  {/* <Text>hi</Text> */}
                  <Text allowFontScaling={false} style={{marginLeft: -12}}>
                    <Icon
                      type="FontAwesome"
                      name="tachometer"
                      style={{fontSize: 35, color: this.state.borderColorbmi}}
                    />{' '}
                    {i18n.t('PATIENTS.BMI')}
                  </Text>
                  <Text allowFontScaling={false}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        backgroundColor: this.state.borderColorbmi,
                        color: '#FEFBFB',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {this.state.bmi}
                    </Text>{' '}
                    {i18n.t('PATIENTS.KGM')}
                    <Text allowFontScaling={false} style={{fontSize: 5}}>
                      2
                    </Text>
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>

          <Col style={{backgroundColor: '#EFEDED', marginTop: 5}}>
            <Text
              allowFontScaling={false}
              style={{fontWeight: 'bold', fontSize: 13, marginLeft: 10}}>
              {i18n.t('PATIENTS.BLOOD')}
            </Text>
            <Row style={{marginTop: -18}}>
              <Col size={20}></Col>
              <Col size={50}>
                <TextInput
                  allowfontScaling={false}
                  // placeholder="Val"
                  placeholderTextColor={'#2D323C'}
                  returnKeyType="done"
                  autoCapitalize="none"
                  value={Math.round(this.state.value).toString()}
                  keyboardType="numeric"
                  maximumValue={300}
                  maxLength={3}
                  style={[
                    styles.input1,
                    {
                      width: 70,
                      textAlign: 'center',
                      left: left,
                      marginLeft: 30,
                      marginBottom: 10,
                      marginTop: 20,
                    },
                  ]}
                  onChangeText={(text) => {
                    this.onValuebmi1(text);
                    this.setState({isVitalsModified: true});
                  }}
                />
              </Col>
              <Col size={20}></Col>
            </Row>
            <Row style={{marginLeft: 10, marginTop: -25}}>
              <Col size={20} style={{marginTop: 8}}>
                <Text
                  allowFontScaling={false}
                  style={{fontWeight: 'bold', fontSize: 12}}>
                 {i18n.t('PATIENTS.SYSTOLIC')}
                </Text>
              </Col>
              <Col size={50}>
                <Slider
                  value={Number(this.state.value) || 0}
                  thumbTintColor={this.state.borderColorsystolic}
                  minimumTrackTintColor={this.state.borderColorsystolic}
                  minimumValue={0}
                  maximumValue={300}
                  onValueChange={(text) => {
                    this.onValuebmi1(text);
                    this.setState({isVitalsModified: true});
                  }}
                />
              </Col>
              <Col size={15}>
                <Text allowFontScaling={false} style={{marginTop: 8}}>
                {i18n.t('PATIENTS.MM')}
                </Text>
              </Col>
              {/* <Col size={5}>
  <TouchableOpacity onPress={()=>this.getBp()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
  </Col> */}
              {/* {this.props.screenProps.aasha=="Yes"? */}
              {this.state.Devices_flg == 'yes' ? (
                this.state.bp_val == 'Aasha' ? (
                  <Col size={5}>
                    <TouchableOpacity onPress={() => this.write('b')}>
                      <Icon
                        type="FontAwesome"
                        name="refresh"
                        style={{fontSize: 20, marginTop: 30, color: '#0781fa'}}
                      />
                    </TouchableOpacity>
                  </Col>
                ) : (
                  <Col size={5}></Col>
                )
              ) : (
                // this.state.bp_val?
                // <Col size={5}>
                // <TouchableOpacity onPress={()=>this.getBp()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
                // </Col>:<Col size={5}></Col>
                <Col size={5}></Col>
              )}
            </Row>
            <Row style={{marginTop: -30}}>
              <Col size={20}></Col>
              <Col size={50}>
                {this.props.screenProps.aasha == 'Yes' ? (
                  <TextInput
                    allowfontScaling={false}
                    // placeholder="Val"
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={Math.round(this.state.value1).toString()}
                    keyboardType="numeric"
                    maximumValue={300}
                    style={[
                      styles.input2,
                      {
                        width: 70,
                        textAlign: 'center',
                        left: left1,
                        marginLeft: 30,
                        marginBottom: 10,
                        marginTop: 20,
                      },
                    ]}
                    onChangeText={this.onValuebmi2.bind(this)}
                    onChangeText={(text) => {
                      this.onValuebmi2(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                ) : (
                  <TextInput
                    allowfontScaling={false}
                    // placeholder="Val"
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={Math.round(this.state.value1).toString()}
                    keyboardType="numeric"
                    maximumValue={300}
                    style={[
                      styles.input1,
                      {
                        width: 70,
                        textAlign: 'center',
                        left: left1,
                        marginLeft: 30,
                        marginBottom: 10,
                        marginTop: 20,
                      },
                    ]}
                    onChangeText={this.onValuebmi2.bind(this)}
                    onChangeText={(text) => {
                      this.onValuebmi2(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                )}
              </Col>
              <Col size={20}></Col>
            </Row>
            <Row style={{marginLeft: 10, marginTop: -20}}>
              <Col size={20} style={{marginTop: 8}}>
                <Text
                  allowFontScaling={false}
                  style={{fontWeight: 'bold', fontSize: 12}}>
                  {i18n.t('PATIENTS.DIASTOLIC')}
                </Text>
              </Col>
              <Col size={50}>
                {this.props.screenProps.aasha == 'Yes' ? (
                  <Slider
                    value={Number(this.state.value1) || 0}
                    thumbTintColor={this.state.borderColordiastolic}
                    minimumTrackTintColor={this.state.borderColordiastolic}
                    minimumValue={0}
                    maximumValue={300}
                    maxLength={3}
                    onValueChange={(text) => {
                      this.onValuebmi2(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                ) : (
                  <Slider
                    value={Number(this.state.value1) || 0}
                    thumbTintColor={this.state.borderColordiastolic}
                    minimumTrackTintColor={this.state.borderColordiastolic}
                    minimumValue={0}
                    maximumValue={300}
                    maxLength={3}
                    onValueChange={(text) => {
                      this.onValuebmi2(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                )}
              </Col>
              <Col size={10}>
                <Text allowFontScaling={false} style={{marginTop: 8}}>
                {i18n.t('PATIENTS.HG')}
                </Text>
              </Col>
              <Col size={10}></Col>
            </Row>
          </Col>
          {/* Pulase Rate start  */}
          <Row>
            <Col style={{backgroundColor: '#EFEDED', marginTop: 5}}>
              <Row>
                <Col size={2}>
                  <Icon
                    style={{
                      fontSize: 20,
                      marginTop: 10,
                      marginLeft: 10,
                      color: '#555b57',
                    }}
                    type="FontAwesome"
                    name="heartbeat"
                  />
                </Col>
                {/* <Col size={4}>
                                    <Text style={{ marginTop: 10, fontSize: 12 }}>
                                        <Text allowFontScaling={false} style={{ marginTop: 5, fontSize: 12, fontWeight: "bold" }}>PR</Text>
                                        <Text allowFontScaling={false} style={{ fontSize: 12 }}>  (min)</Text>
                                    </Text>
                                </Col> */}
                {this.state.Devices_flg == 'yes' ? (
                  this.state.PulseOximeter_val == 'Aasha' ? (
                    <Col size={4}>
                      <TouchableOpacity onPress={() => this.write('p')}>
                        <Text style={{marginTop: 10, fontSize: 12}}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              marginTop: 5,
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}>
                            {i18n.t('PATIENTS.PR')}
                          </Text>
                          <Text allowFontScaling={false} style={{fontSize: 12}}>
                            {' '}
                            ({i18n.t('PATIENTS.MIN')})
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </Col>
                  ) : this.state.PulseOximeter_val ? (
                    <Col size={4}>
                      {/* <TouchableOpacity onPress={()=>this.getPulse()}> */}
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          {i18n.t('PATIENTS.PR')}
                        </Text>
                        <Text allowFontScaling={false} style={{fontSize: 12}}>
                          {' '}
                          ({i18n.t('PATIENTS.MIN')})
                        </Text>
                      </Text>
                      {/* </TouchableOpacity> */}
                    </Col>
                  ) : (
                    <Col size={4}>
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          {i18n.t('PATIENTS.PR')}
                        </Text>
                        <Text allowFontScaling={false} style={{fontSize: 12}}>
                          {' '}
                          ({i18n.t('PATIENTS.MIN')})
                        </Text>
                      </Text>
                    </Col>
                  )
                ) : (
                  <Col size={4}>
                    <Text style={{marginTop: 10, fontSize: 12}}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginTop: 5,
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {i18n.t('PATIENTS.PR')}
                      </Text>
                      <Text allowFontScaling={false} style={{fontSize: 12}}>
                        {' '}
                        ({i18n.t('PATIENTS.MIN')})
                      </Text>
                    </Text>
                  </Col>
                )}
                {/* {this.props.screenProps.aasha=="Yes"?
                            <Col size={5}>
                            <TouchableOpacity onPress={()=>this.write("p")}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
                            </Col>:
                             <Col size={5}> 
  <TouchableOpacity onPress={()=>this.getPulse()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
   </Col> 
                                } */}
                <Col size={3}>
                  {/* {this.props.screenProps.aasha=="Yes"? */}
                  {this.state.Devices_flg == 'yes' ? (
                    <TextInput
                      allowfontScaling={false}
                      placeholderTextColor={'#2D323C'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={String(this.state.value2)}
                      keyboardType="numeric"
                      maxLength={3}
                      style={styles.input}
                      backgroundColor={this.state.borderColorpulse}
                      onChangeText={(text) => {
                        this.onValuepulse(text);
                        this.setState({isVitalsModified: true});
                      }}
                    />
                  ) : (
                    <TextInput
                      allowfontScaling={false}
                      placeholderTextColor={'#2D323C'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={String(this.state.value2)}
                      keyboardType="numeric"
                      maxLength={3}
                      style={styles.input}
                      backgroundColor={this.state.borderColorpulse}
                      onChangeText={(text) => {
                        this.onValuepulse(text);
                        this.setState({isVitalsModified: true});
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Col>
            {/* Oxygen Saturation start  */}
            <Col
              style={{backgroundColor: '#EFEDED', marginTop: 5, marginLeft: 5}}>
              <Row>
                <Col size={2}>
                  <Thumbnail
                    style={{
                      height: 30,
                      width: 30,
                      marginLeft: 1,
                      marginTop: 5,
                      color: '#555b57',
                    }}
                    square
                    source={require('../../../../assets/images/o2.png')}
                  />
                </Col>
                <Col size={4}>
                  <Text style={{marginTop: 10, fontSize: 12, marginLeft: -6}}>
                    <Text
                      allowFontScaling={false}
                      style={{marginTop: 5, fontSize: 12, fontWeight: 'bold'}}>
                      {i18n.t('PATIENTS.O2SAT')}
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize: 12}}>
                      (%)
                    </Text>
                  </Text>
                </Col>
                <Col size={2.5}>
                  {/* {this.state.Devices_flg=="Yes"?
+                                    <TextInput allowfontScaling={false}
+                                        placeholderTextColor={"#2D323C"}
+                                        returnKeyType="done"
+                                        autoCapitalize="none"
+                                        value={String(this.state.value3)}
+                                        keyboardType="numeric"
+                                        maxLength={3}
+                                        style={styles.input2}
+                                        marginLeft={-20}
+                                        backgroundColor={this.state.borderColoroxg}
+                                        onChangeText={(text)=>{
+                                            this.onValueoxg(text);
+                                            this.setState({isVitalsModified:true})
+                                        }}
+                                        
+                                    />: */}
                  <TextInput
                    allowfontScaling={false}
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={String(this.state.value3)}
                    keyboardType="numeric"
                    maxLength={3}
                    style={styles.input}
                    marginLeft={-25}
                    backgroundColor={this.state.borderColoroxg}
                    onChangeText={(text) => {
                      this.onValueoxg(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {/* PEFR/Spirometry start  */}
          <Row>
            <Col style={{backgroundColor: '#EFEDED', marginTop: 5}}>
              <Row>
                <Col size={2}>
                  <Icon
                    style={{
                      fontSize: 20,
                      marginTop: 10,
                      marginLeft: 10,
                      color: '#555b57',
                    }}
                    type="FontAwesome"
                    name="heartbeat"
                  />
                </Col>
                {this.state.Devices_flg == 'yes' ? (
                  this.state.Spirometer_val == 'Aasha' ? (
                    <Col size={4}>
                      <TouchableOpacity onPress={() => this.getAasha('s')}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          {i18n.t('PATIENTS.PEFR')}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={{fontSize: 12, marginLeft: -5}}>
                          {i18n.t('PATIENTS.LM')}
                        </Text>
                      </TouchableOpacity>
                    </Col>
                  ) : this.state.Spirometer_val ? (
                    <Col size={4}>
                      {/* <TouchableOpacity onPress={()=>this.getSpiro()}> */}
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginTop: 5,
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {i18n.t('PATIENTS.PEFR')}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{fontSize: 12, marginLeft: -5}}>
                        {i18n.t('PATIENTS.LM')}
                      </Text>
                      {/* </TouchableOpacity> */}
                    </Col>
                  ) : (
                    <Col size={4}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginTop: 5,
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {i18n.t('PATIENTS.PEFR')}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{fontSize: 12, marginLeft: -5}}>
                        {i18n.t('PATIENTS.LM')}
                      </Text>
                    </Col>
                  )
                ) : (
                  <Col size={4}>
                    <Text
                      allowFontScaling={false}
                      style={{marginTop: 5, fontSize: 12, fontWeight: 'bold'}}>
                      {i18n.t('PATIENTS.PEFR')}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{fontSize: 12, marginLeft: -5}}>
                      ({i18n.t('PATIENTS.LM')})
                    </Text>
                  </Col>
                )}
                <Col size={3}>
                  <TextInput
                    allowfontScaling={false}
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={String(this.state.value4)}
                    keyboardType="numeric"
                    maxLength={4}
                    style={styles.input}
                    backgroundColor={this.state.borderColorpefr}
                    onChangeText={(text) => {
                      this.onValuespi(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                </Col>
                {/* {this.props.screenProps.aasha=="Yes"?
                            <Col size={5}>
                            <TouchableOpacity onPress={()=>this.getAasha('s')}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
                            </Col>:

                                <Col size={1}>
  <TouchableOpacity onPress={()=>this.getSpiro()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,marginLeft:-150,color:"#0781fa"}} /></TouchableOpacity>
  </Col>
    } */}
              </Row>
            </Col>
            {/* Respiratory Rate start  */}
            <Col
              style={{backgroundColor: '#EFEDED', marginTop: 5, marginLeft: 5}}>
              <Row>
                <Col size={2}>
                  <Thumbnail
                    style={{
                      height: 30,
                      width: 30,
                      marginLeft: 10,
                      marginTop: 5,
                    }}
                    square
                    source={require('../../../../assets/images/resp.png')}
                  />
                </Col>
                <Col size={4}>
                  <Text style={{marginTop: 10, fontSize: 12}}>
                    <Text
                      allowFontScaling={false}
                      style={{marginTop: 5, fontSize: 12, fontWeight: 'bold'}}>
                      {i18n.t('PATIENTS.RR')}
                    </Text>
                    <Text allowFontScaling={false} style={{fontSize: 12}}>
                      {' '}
                      ({i18n.t('PATIENTS.MIN')})
                    </Text>
                  </Text>
                </Col>
                <Col size={2.5}>
                  <TextInput
                    allowfontScaling={false}
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={String(this.state.value5)}
                    keyboardType="numeric"
                    maxLength={3}
                    style={styles.input}
                    marginLeft={-25}
                    backgroundColor={this.state.borderColorresp}
                    onChangeText={(text) => {
                      this.onValueresp(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Temperature start  */}
          <Row>
            <Col style={{backgroundColor: '#EFEDED', marginTop: 5}}>
              <Row>
                <Col size={2}>
                  <Icon
                    style={{
                      fontSize: 20,
                      marginTop: 10,
                      marginLeft: 10,
                      color: '#555b57',
                    }}
                    type="FontAwesome"
                    name="thermometer-empty"
                  />
                </Col>
                {this.state.Devices_flg == 'yes' ? (
                  this.state.Temperature_val == 'Aasha' ? (
                    <Col size={4}>
                      <TouchableOpacity onPress={() => this.write('m')}>
                        <Text style={{marginTop: 10, fontSize: 12}}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              marginTop: 5,
                              fontSize: 12,
                              fontWeight: 'bold',
                              marginLeft: -5,
                            }}>
                            {i18n.t('PATIENTS.TEMP')}
                          </Text>
                          <Text
                            allowFontScaling={false}
                            style={{fontSize: 12, marginLeft: 10}}>
                            {' '}
                            ({i18n.t('PATIENTS.DEGREE')})
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </Col>
                  ) : this.state.Temperature_val ? (
                    <Col size={4}>
                      {/* <TouchableOpacity onPress={()=>this.getTemp()}> */}
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginLeft: -5,
                          }}>
                          {i18n.t('PATIENTS.TEMP')}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={{fontSize: 12, marginLeft: 10}}>
                          {' '}
                          ({i18n.t('PATIENTS.DEGREE')})
                        </Text>
                      </Text>
                      {/* </TouchableOpacity> */}
                    </Col>
                  ) : (
                    <Col size={4}>
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginLeft: -5,
                          }}>
                          {i18n.t('PATIENTS.TEMP')}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={{fontSize: 12, marginLeft: 10}}>
                          {' '}
                          ({i18n.t('PATIENTS.DEGREE')})
                        </Text>
                      </Text>
                    </Col>
                  )
                ) : (
                  <Col size={4}>
                    <Text style={{marginTop: 10, fontSize: 12}}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginTop: 5,
                          fontSize: 12,
                          fontWeight: 'bold',
                          marginLeft: -5,
                        }}>
                        {i18n.t('PATIENTS.TEMP')}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={{fontSize: 12, marginLeft: 10}}>
                        {' '}
                        ({i18n.t('PATIENTS.DEGREE')})
                      </Text>
                    </Text>
                  </Col>
                )}
                <Col size={3}>
                  {/* {this.props.screenProps.aasha=="Yes"? */}
                  {/* {this.state.Devices_flg=="yes"?
                                    <TextInput allowfontScaling={false}
                                        placeholderTextColor={"#2D323C"}
                                        returnKeyType="done"
                                        autoCapitalize="none"
                                        value={String(this.state.value6)}
                                        keyboardType="numeric"
                                        maxLength={6}
                                        style={styles.input2}
                                        backgroundColor={this.state.bordertemperatue}
                                        onChangeText={(text)=>{
                                            this.onValuetemp(text);
                                            this.setState({isVitalsModified:true})
                                        }}
                                    />: */}
                  <TextInput
                    allowfontScaling={false}
                    placeholderTextColor={'#2D323C'}
                    returnKeyType="done"
                    autoCapitalize="none"
                    value={String(this.state.value6)}
                    keyboardType="numeric"
                    maxLength={6}
                    style={styles.input}
                    backgroundColor={this.state.bordertemperatue}
                    onChangeText={(text) => {
                      this.onValuetemp(text);
                      this.setState({isVitalsModified: true});
                    }}
                  />
                </Col>
              </Row>
              {/* {this.props.screenProps.aasha=="Yes"?
                            <Col size={5}>
                            <TouchableOpacity onPress={()=>this.write('m')}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
                            </Col>:
                            <Col size={5}>
  <TouchableOpacity onPress={()=>this.getTemp()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
  </Col>
    } */}
            </Col>
            <Col size={1}></Col>
            {/* Custom Field start  */}
          </Row>

          {/* custom fields start  */}
          <Row>
            {this.state.custom_fields ? (
              this.state.customData.map((item, key) => (
                <Col
                  style={{
                    backgroundColor: '#EFEDED',
                    marginTop: 5,
                    flexDirection: 'row',
                    marginLeft: 5,
                  }}>
                  <Row>
                    <Col size={2}>
                      <Icon
                        style={{
                          fontSize: 20,
                          marginTop: 10,
                          marginLeft: 10,
                          color: '#555b57',
                        }}
                        type="FontAwesome"
                        name="heartbeat"
                      />
                    </Col>
                    <Col size={4}>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginTop: 5,
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {item.label}
                      </Text>
                      <Text allowFontScaling={false} style={{fontSize: 12}}>
                        ({item.unit})
                      </Text>
                    </Col>
                    <Col size={3}>
                      {this.state.borderColorcus1 == '#FBFBFB' ? (
                        <TextInput
                          allowfontScaling={false}
                          placeholderTextColor={'#2D323C'}
                          returnKeyType="done"
                          autoCapitalize="none"
                          value={item.value}
                          keyboardType="numeric"
                          maxLength={6}
                          style={styles.input1}
                          backgroundColor={this.state.borderColorcus1}
                          onChangeText={(text) => {
                            this.onValuecus1(key, text);
                            this.setState({isVitalsModified: true});
                          }}
                        />
                      ) : (
                        <TextInput
                          allowfontScaling={false}
                          placeholderTextColor={'#2D323C'}
                          returnKeyType="done"
                          autoCapitalize="none"
                          value={item.value}
                          keyboardType="numeric"
                          maxLength={6}
                          style={styles.input}
                          backgroundColor={this.state.borderColorcus1}
                          onChangeText={(text) => {
                            this.onValuecus1(key, text);
                            this.setState({isVitalsModified: true});
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Col>
              ))
            ) : (
              <Col size={1}></Col>
            )}
          </Row>
          {/* Nurse Notes start*/}
          <Row>
            <Col style={{backgroundColor: '#EFEDED', marginTop: 5}}>
              <Row>
                <Col>
                  <Text
                    allowFontScaling={false}
                    style={{marginLeft: 10, fontWeight: 'bold', marginTop: 5}}>
                    {i18n.t('PATIENTS.NURSE')}
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col>
                      <TextInput
                        allowfontScaling={false}
                        // placeholder="Type something"
                        value={this.state.nurse_note}
                        // onValueChange={this._startRecognizing.bind(Number(this))}
                        multiline={true}
                        // numberOfLines={3}
                        onContentSizeChange={(event) => {
                          this.setState({
                            heighttext: event.nativeEvent.contentSize.height,
                          });
                        }}
                        style={{
                          backgroundColor: '#FEFBFB',
                          height: 200,
                          textAlignVertical: 'top',
                          height: Math.max(35, this.state.heighttext),
                          borderColor: '#345D7E',
                          borderWidth: 1,
                          borderWidth: 1,
                          marginHorizontal: 10,
                        }}
                        onChangeText={(text) => {
                          this.setState({
                            isVitalsModified: true,
                            nurse_note: text,
                          });
                          global.nurse_note = text;
                        }}
                        scrollEnabled={false}
                      />

                      {/* <Textarea rowSpan={3} bordered /> */}
                      {/* <TouchableOpacity onPress={()=>{this._startRecognizing("nursenotes");SpiroReact.getVoiceValue('nursing')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
                    </Col>
                  </Row>
                  <Row style={{margin: 3}}>
                    <Col style={{alignItems: 'center'}}>
                      <Button
                        style={{
                          height: 40,
                          //width: 120
                          width: width * 0.26666666666,
                          backgroundColor: APP_PRIMARY_COLOR,
                          marginTop: 10,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => this.saveVitalsData()}>
                        <Text
                          allowFontScaling={false}
                          style={{color: 'white', fontSize: 15}}>
                          {i18n.t('PATIENTS.SAVE')}
                        </Text>
                      </Button>
                    </Col>
                    <Col style={{alignItems: 'center'}}>
                      {/* <Button style={{ height: 40, width: 150, backgroundColor: "#F67F7D", marginTop: 10, alignSelf: "center", justifyContent: "center" }} onPress={()=>this.props.navigation.navigate('Vitals2',{hlpid:this.props.screenProps.hlpid,enc:this.props.screenProps.enc_id})}> */}
                      <Button
                        style={{
                          height: 40,
                          //width: 120,
                          width: width * 0.26666666666,
                          backgroundColor: APP_PRIMARY_COLOR,
                          marginTop: 10,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => this.change_status()}>
                        {/* <Button style={{ height: 40, width: 150, backgroundColor: "#F67F7D", marginTop: 10, alignSelf: "center", justifyContent: "center" }}onPress={() => this.setState({ vitals_lay: true })}> */}
                        <Text
                          allowFontScaling={false}
                          style={{color: 'white', fontSize: 13}}>
                          {i18n.t('PATIENTS.VITAL_HISTORY')}
                        </Text>
                      </Button>
                    </Col>
                    <Col style={{alignItems: 'center'}}>
                      <Button
                        style={{
                          height: 40,
                          //width: 120,
                          width: width * 0.26666666666,
                          backgroundColor: APP_PRIMARY_COLOR,
                          marginTop: 10,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          console.log('selected patient:', global.patient);
                          Alert.alert(
                            i18n.t('PATIENTS.ALERT'),
                            i18n.t('PATIENTS.ALERT_DATA'),
                            [
                              {
                                text: i18n.t('COMMON.NO'),
                                onPress: async () => {
                                  this.setState({load1: true});
                                  await this.updateList();
                                  await this.getVitalsData();
                                  this.setState({
                                    isVitalsModified: false,
                                    load1: false,
                                  });
                                  global.screen == 'dashboard'
                                    ? this.props.applyList.message
                                        .covid_pdf_exists === '0' ||
                                      this.props.applyList.message
                                        .covid_pdf_exists === 0
                                      ? this.props.screenProps.rootNavigation.navigate(
                                          'CovidMonitoringInitialAssessment',
                                          {
                                            token: await AsyncStorage.getItem(
                                              'userToken',
                                            ),
                                            doctor_id:
                                              await AsyncStorage.getItem(
                                                'doctorid',
                                              ),
                                            doctor_name:
                                              await AsyncStorage.getItem(
                                                'doctorname',
                                              ),
                                            patient: global.patient,
                                            from: 'initial_assessment',
                                          },
                                        )
                                      : // this.props.screenProps.rootNavigation.navigate(
                                        //     'Covid2',
                                        //     {
                                        //       hlpd: this.state.hlpid,
                                        //       enc: this.props.screenProps.enc_id,
                                        //     },
                                        //   )

                                        this.props.screenProps.rootNavigation.navigate(
                                          'ViewPdf',
                                          {
                                            link: this.props.applyList.message
                                              .covid_pdf_path,
                                          },
                                        )
                                    : this.props.consultList.message
                                        .covid_pdf_exists === '0' ||
                                      this.props.applyList.message
                                        .covid_pdf_exists === 0
                                    ? this.props.screenProps.rootNavigation.navigate(
                                        'CovidMonitoringInitialAssessment',
                                        {
                                          token: await AsyncStorage.getItem(
                                            'userToken',
                                          ),
                                          doctor_id: await AsyncStorage.getItem(
                                            'doctorid',
                                          ),
                                          doctor_name:
                                            await AsyncStorage.getItem(
                                              'doctorname',
                                            ),
                                          patient: global.patient,
                                          from: 'initial_assessment',
                                        },
                                      )
                                    : // this.props.screenProps.rootNavigation.navigate(
                                      //     'Covid2',
                                      //     {
                                      //       hlpd: this.state.hlpid,
                                      //       enc: this.props.screenProps.enc_id,
                                      //     },
                                      //   )

                                      this.props.screenProps.rootNavigation.navigate(
                                        'ViewPdf',
                                        {
                                          link: this.props.consultList.message
                                            .covid_pdf_path,
                                        },
                                      );
                                },
                              },
                              {
                                text: i18n.t('COMMON.YES'),
                                onPress: async () => {
                                  await this.saveVitalsData(true);

                                  global.screen == 'dashboard'
                                    ? this.props.applyList.message
                                        .covid_pdf_exists === '0' ||
                                      this.props.applyList.message
                                        .covid_pdf_exists === 0
                                      ? this.props.screenProps.rootNavigation.navigate(
                                          'CovidMonitoringInitialAssessment',
                                          {
                                            token: await AsyncStorage.getItem(
                                              'userToken',
                                            ),
                                            doctor_id:
                                              await AsyncStorage.getItem(
                                                'doctorid',
                                              ),
                                            doctor_name:
                                              await AsyncStorage.getItem(
                                                'doctorname',
                                              ),
                                            patient: global.patient,
                                            from: 'initial_assessment',
                                          },
                                        )
                                      : // this.props.screenProps.rootNavigation.navigate(
                                        //     'Covid2',
                                        //     {
                                        //       hlpd: this.state.hlpid,
                                        //       enc: this.props.screenProps.enc_id,
                                        //     },
                                        //   )

                                        this.props.screenProps.rootNavigation.navigate(
                                          'ViewPdf',
                                          {
                                            link: this.props.applyList.message
                                              .covid_pdf_path,
                                          },
                                        )
                                    : this.props.consultList.message
                                        .covid_pdf_exists === '0' ||
                                      this.props.consultList.message
                                        .covid_pdf_exists === 0
                                    ? this.props.screenProps.rootNavigation.navigate(
                                        'CovidMonitoringInitialAssessment',
                                        {
                                          token: await AsyncStorage.getItem(
                                            'userToken',
                                          ),
                                          doctor_id: await AsyncStorage.getItem(
                                            'doctorid',
                                          ),
                                          doctor_name:
                                            await AsyncStorage.getItem(
                                              'doctorname',
                                            ),
                                          patient: global.patient,
                                          from: 'initial_assessment',
                                        },
                                      )
                                    : // this.props.screenProps.rootNavigation.navigate(
                                      //     'Covid2',
                                      //     {
                                      //       hlpd: this.state.hlpid,
                                      //       enc: this.props.screenProps.enc_id,
                                      //     },
                                      //   )

                                      this.props.screenProps.rootNavigation.navigate(
                                        'ViewPdf',
                                        {
                                          link: this.props.consultList.message
                                            .covid_pdf_path,
                                        },
                                      );
                                },
                              },
                            ],
                          );
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{color: 'white', fontSize: 15}}>
                          {i18n.t('PATIENTS.COVID')}
                        </Text>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text allowFontScaling={false}>
                    {this.state.partialResults}
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
        <FlashMessage
          position="center"
          ref={(ref) => (this.VitalsAlert = ref)}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  consultList: state.consultList.consultList,
  applyList: state.applyList.applyList,
  vitals_retrieve_response: state.vitals.vitals_retrieve_response,
  validateList: state.validateList.validateList,
  vitals_save_response: state.vitals.vitals_save_response,
});

const styles = StyleSheet.create({
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },

  sliderDummy: {
    backgroundColor: '#d3d3d3',
    width: 300,
    height: 30,
    borderRadius: 50,
    position: 'absolute',
  },

  sliderReal: {
    backgroundColor: '#119EC2',
    height: 30,
  },

  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 200,
  },
  input: {
    // marginTop:15,
    fontSize: 13,
    fontWeight: 'bold',
    borderColor: '#345D7E',
    borderWidth: 1,
    height: 37,
    backgroundColor: 'white',
    marginTop: 5,
    marginLeft: -15,
    marginBottom: 5,
    width: 70,
    color: '#FBFBFB',
    paddingHorizontal: 15,
  },
  input1: {
    // marginTop:15,
    fontSize: 13,
    fontWeight: 'bold',
    borderColor: '#345D7E',
    borderWidth: 1,
    height: 37,
    backgroundColor: 'white',
    marginTop: 5,
    marginLeft: -15,
    marginBottom: 5,
    width: 70,
    color: '#060606',
    paddingHorizontal: 15,
  },
  input2: {
    // marginTop:15,
    fontSize: 13,
    fontWeight: 'bold',
    borderColor: '#345D7E',
    borderWidth: 1,
    height: 37,
    backgroundColor: 'white',
    marginTop: 5,
    marginLeft: -15,
    marginBottom: 5,
    width: 70,
    paddingHorizontal: 15,
  },
});

const {height, width} = Dimensions.get('window');
export default connect(mapStateToProps, {
  getNurseVitalsData,
  saveVitalsData,
  getApplyList,
  getConsultList,
})(vitals);
