// import React, { Component } from 'react';
// import { View, Text } from 'react-native';

// class Vitals extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <View>
//         <Text> Vitals </Text>
//       </View>
//     );
//   }
// }

// export {Vitals}
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
  ScrollView,
} from 'react-native';

import Slider from 'react-native-slider';
import moment from 'moment';
// import { connect } from 'react-redux';
// import RangeSlider from 'react-native-range-slider'
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
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
// import {Picker} from '@react-native-picker/picker';
import FlashMessage from 'react-native-flash-message';
import {Platform} from 'react-native';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
import i18n from '../../../i18n';
var SpiroReact = NativeModules.SpiroReact;
export default class Vitals2 extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    Text.allowFontScaling = false;
    // Text.defaultProps = Text.defaultProps || {}; //Disable dynamic type in IOS
    // Text.defaultProps.allowFontScaling = false;
    // TextInput.defaultProps = TextInput.defaultProps || {}; //Disable dynamic type in IOS
    // TextInput.defaultProps.allowFontScaling = false;

    this.state = {
      enc: this.props.navigation.state.params.enc,
      name: this.props.navigation.state.params.name,
      hlpid1: this.props.navigation.state.params.hlpid,
      staus: this.props.navigation.state.params.staus,
      v_show: false,
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
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      nurse_note: '',
      loading: true,
      loading1: true,
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
      v_data: [],
    };
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
      this.setState({value: bp[0]});
      this.setState({value1: bp[1]});
    });

    DeviceEventEmitter.addListener('getPulseData', (e) => {
      //alert(e)
      let pulse = e.split('-');
      pulse = e;
      //  this.setState({value3:pulse[0]})
      //   this.setState({value2:pulse[1]})
    });
    DeviceEventEmitter.addListener('getSpiroData', (e) => {
      // handle event
      console.log(e);
      this.setState({value4: e});
    });
  }

  componentWillUnmount = async () => {};
  updateList = async () => {
    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    // alert(myobj2)
    // alert("Lab Order saved Successfully")
    this.props.myprops.screen == 'dashboard'
      ? // alert("called2")
        await this.props.getApplyList(myobj)
      : this.props.myprops.screen == 'timelene'
      ? // alert("called2")
        await this.props.getConsultList(myobj2)
      : null;
  };

  getBp = async () => {
    SpiroReact.startBp(
      (err) => {
        console.log(err);
      },
      (msg) => {
        let bp = msg.split(' ');
        this.setState({value: bp[0]});
        this.setState({value1: bp[1]});
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
        this.setState({value3: pulsevalue[0]});
        this.setState({value2: pulsevalue[1]});
      },
    );
  };
  componentDidMount = async () => {
    await this.validateList();
    await this.change_status();
    global.customData = this.state.customData;
  };
  vital_show = () => {
    this.setState({
      v_show: true,
    });
  };
  validateList = async () => {
    console.log(global.hlpid + global.userToken);
    let obk = JSON.stringify({
      docid: this.state.hlpid,
      token: global.token,
    });
    //   console.log(obs)
    let url = getBaseUrl() + 'vitals_json';
    // console.log("gug"+ob)p
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
        //  console.log("hfkjqkfwkejhkjwefkjwekjebfkwjebjeb"+JSON.stringify(response.data[0].cancellation_charge))
        //  console.log("hfkjqkfwkejhkjwefkjwekjebfkwjebjeb"+JSON.stringify(response))
        // alert(JSON.stringify(response))
        //  this.setState({
        //      charge:response.data[0].cancellation_charge
        //  })
        this.setState({
          loading: false,
          validateList: response.message,
        });
      })
      .catch((error) => {
        console.error(error);
      });
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
  change_status = async () => {
    console.log(global.hlpid + global.userToken);
    let obk = JSON.stringify({
      doc_id: global.doctor_id,
      token: global.token,
      hlp_id: this.state.hlpid1,
      enc_id: this.state.enc,
    });
    console.log(obk);
    let url = getBaseUrl() + 'get_vitals_from_persondb';
    // console.log("gug"+ob)p
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
        console.log(
          'hfkjqkfwkejhkjwefkjwekjebfkwjebjeb' + JSON.stringify(response),
        );

        this.setState({
          loading1: false,
        });
        if (response.data != undefined) {
          this.setState({
            v_data: response.data,
            height: response.data[0].height,
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
  saveVitalsData = async () => {
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
      age_value: global.agevalue,
      hlpid_show: this.state.hlpid,
      custom_label: this.state.customData,
    });
    console.log(obj);
    // alert(obj)
    await this.props.saveVitalsData(obj);
    // alert("Vitals Saved Successfully");
    this.updateList();
    this.setState({load1: false});
    this.VitalsAlert.showMessage({
      message:i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.VITAL_SUCC'),
      type: 'success',
      icon: 'auto',
    });
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
    this.setState({value: value});

    let val1 = Number(value);
    let val = this.state.height;
    if (val1 > 300) {
      alert(i18n.t('PATIENTS.ALERT2'));
    } else {
      let h = [];
      let a = [];
      let x = [];
      if (val && val1) {
        let dob = global.birth_date;
        let dobdate = new Date(dob);
        let cur_date = new Date();
        let age_month = this.diff_months(cur_date, dobdate);
        let age1 = global.agevalue;
        let dob1 = age1.split(' ');
        let ageY = dob1[0].split('Y');
        let ageM = dob1[1].split('M');
        let gender = global.gender;
        var height = this.state.height;
        var age = ageY[0];
        if (age == 0) {
          age = 1;
        }
        if (age_month < 204) {
          if (gender == 'male') h.push(this.state.validateList.m_sysbp);
          else h.push(this.state.validateList.fm_sysbp);

          if (gender == 'male') a.push(this.state.validateList.m_heightbp);
          else a.push(this.state.validateList.fm_heightbp);
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
                if (val1 >= percent50 && val1 <= percent90) {
                  this.setState({b: 1});
                  this.setState({borderColorsystolic: '#00B050'});
                  this.setState({systolic1: '1'});
                } else if (val1 > percent90 && val1 <= percent95) {
                  this.setState({b: 0.5});
                  this.setState({borderColorsystolic: '#FFBF00'});
                  this.setState({systolic1: '0.5'});
                } else if (val1 >= percent95 || val1 <= percent99) {
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
    }
    global.value = value;
    global.systolic1 = this.state.systolic1;
  };
  onValuebmi2 = (value) => {
    this.setState({value1: value});
    let val2 = Number(value);
    let val = this.state.height;
    if (val2 > 300) {
      alert(i18n.t('PATIENTS.ALERT2'));
    } else {
      let h = [];
      let a = [];
      let x = [];
      if (val && val2) {
        // alert("hi"+this.props.applyList.message)
        let dob = global.birth_date;
        let dobdate = new Date(dob);
        let cur_date = new Date();
        let age_month = this.diff_months(cur_date, dobdate);
        let age1 = global.agevalue;
        let dob1 = age1.split(' ');
        let ageY = dob1[0].split('Y');
        let ageM = dob1[1].split('M');
        let gender = global.gender;
        var height = this.state.height;
        var age = ageY[0];
        // alert(age_month)
        if (age == 0) {
          age = 1;
        }

        if (age_month < 204) {
          if (gender == 'male') h.push(this.state.validateList.m_diabp);
          else h.push(this.state.validateList.fm_diabp);

          if (gender == 'male') a.push(this.state.validateList.m_heightbp);
          else a.push(this.state.validateList.fm_heightbp);
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
                } else if (val2 > percent90 && val2 <= percent95) {
                  this.setState({b: 0.5});
                  this.setState({borderColordiastolic: '#FFBF00'});
                  this.setState({diastolic1: '0.5'});
                } else if (val2 >= percent95 || val2 <= percent99) {
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
    }
    global.value1 = value;
    global.diastolic1 = this.state.diastolic1;
  };
  onValuepulse = (value) => {
    this.setState({value2: value});
    let age = global.agevalue;
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
  };
  onValueoxg = (value) => {
    this.setState({value3: value});

    if (value) {
      if (value >= 90 && value <= 100) {
        this.setState({borderColoroxg: '#00B050'});
        this.setState({oxy_sat1: '1'});
      } else {
        this.setState({borderColoroxg: '#FF0000'});
        this.setState({oxy_sat1: '0'});
      }
    } else {
      this.setState({borderColoroxg: '#FEFBFB'});
    }
    global.value3 = value;
    global.oxy_sat1 = this.state.oxy_sat1;
  };
  onValuespi = (value) => {
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
  };
  onValueresp = (value) => {
    global.resp = value;
    this.setState({value5: value});
    let age = global.agevalue;
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
  };
  onValuetemp = (value) => {
    let ret = this.data(value);
    if (ret == true) {
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
    } else if (ret == false) {
      this.setState({bordertemperatue: this.state.bordertemperatue});
    } else {
      this.setState({value6: value});
      this.setState({bordertemperatue: '#FBFBFB'});
    }

    global.value6 = value;
    global.temperature1 = this.state.temperature1;
  };
  onValueheight = (value) => {
    let ret = this.data(value);
    if (ret == true) {
      this.setState({height: value});
      let age = global.agevalue;
      let age1 = age.split(' ');
      let ageYear = age1[0].split('Y');
      let ageMonths = age1[1].split('M');
      if (!ageMonths[0]) {
        ageMonths[0] = 0;
      }
      let gender = 'male';
      let h = [];
      let orgAge = ageYear[0] + '.' + ageMonths[0];
      if (orgAge <= 19.0) {
        if (gender == 'male') {
          h.push(this.state.validateList.m_height);
        } else {
          h.push(this.state.validateList.fm_height);
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
                if (value >= h3 && value <= h5) {
                  this.setState({u: 1});
                  this.setState({borderColorHeight: '#00B050'});
                  this.setState({height1: '1'});
                } else if (value >= h2 && value < h3) {
                  this.setState({u: 0.5});
                  this.setState({borderColorHeight: '#FFBF00'});
                  this.setState({height1: '0.5'});
                } else if (value > h5 && value <= h6) {
                  this.setState({u: 1});
                  this.setState({borderColorHeight: '#00B050'});
                  this.setState({height1: '1'});
                } else if (value < h2) {
                  this.setState({u: 0});
                  this.setState({borderColorHeight: '#FF0000'});
                  this.setState({height1: '0'});
                } else if (value > h6) {
                  this.setState({u: 1});
                  this.setState({borderColorHeight: '#00B050'});
                  this.setState({height1: '1'});
                }
                this.setState({height1: this.state.u});
              } else {
                this.setState({borderColorHeight: '#FEFBFB'});
              }
            }
          });
        }
      } else if (value) {
        if (value >= 171.6 && value <= 181.5) {
          this.setState({u: 1});
          this.setState({borderColorHeight: '#00B050'});
          this.setState({height1: '1'});
        } else if (value >= 167.2 && value < 171.6) {
          this.setState({u: 0.5});
          this.setState({borderColorHeight: '#FFBF00'});
          this.setState({height1: '0.5'});
        } else if (value > 181.5 && value <= 185.9) {
          this.setState({u: 1});
          this.setState({borderColorHeight: '#00B050'});
          this.setState({height1: '1'});
        } else if (value < 167.2 || value > 188.5) {
          this.setState({u: 0});
          this.setState({borderColorHeight: '#FF0000'});
          this.setState({height1: '0'});
        }
        this.setState({height1: this.state.u});
      } else {
        this.setState({borderColorHeight: '#FEFBFB'});
      }
      // this.sum();
    } else if (ret == false) {
      this.setState({borderColorHeight: this.state.borderColorHeight});
    } else {
      this.setState({height: value});
      this.setState({borderColorHeight: '#FEFBFB'});
    }

    global.height = value;
    global.height1 = this.state.height1;
  };
  onValueweight = (value) => {
    let ret = this.data(value);
    if (ret == true && ret != 'empty') {
      this.setState({weight: value});
      let age = global.agevalue;
      let age1 = age.split(' ');
      let ageYear = age1[0].split('Y');
      let ageMonths = age1[1].split('M');
      if (!ageMonths[0]) {
        ageMonths[0] = 0;
      }
      let gender = 'male';
      let h = [];
      let orgAge = ageYear[0] + '.' + ageMonths[0];
      if (orgAge <= 20.0) {
        if (gender == 'male') {
          h.push(this.state.validateList.m_weight);
        } else {
          h.push(this.state.validateList.fm_weight);
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
      this.sum(value);
    } else if (ret == false) {
      this.setState({borderColorWeight: this.state.borderColorWeight});
    } else {
      this.setState({weight: value});
      this.setState({borderColorWeight: '#FEFBFB'});
    }

    global.weight = value;
    global.weight1 = this.state.weight1;
  };
  onValuenurse = (value) => {
    this.setState({nurse: value});
  };
  onValuecus1 = (key, value) => {
    let ret = this.data(value);

    if (ret == true) {
      this.state.customData[key].value = value;
      this.setState({customData: this.state.customData});
      ///
      console.log('key2=' + JSON.stringify(this.state.customData));
      let b;
      if (this.state.customData[key].label.trim() == 'Head Circumference') {
        let dob = global.birth_date;
        let dobdate = new Date(dob);
        let age = global.agevalue;
        let age1 = age.split(' ');
        let ageY = age1[0].split('Y');
        let ageM = age1[1].split('M');
        let age_month = parseInt(ageY) * 12 + parseInt(ageM);
        console.log('age_month' + age_month);
        let gender = global.gender;
        if (age_month <= 60) {
          let h = [];
          if (gender == 'male') {
            h.push(this.state.validateList.m_head);
          } else {
            h.push(this.state.validateList.fm_head);
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
                  if (value > fieldh2 && value < fieldh4) {
                    b = 1;
                    this.setState({borderColorcus1: '#FF0000'});
                  } else if (value > fieldh1 && value < fieldh5) {
                    b = 0.5;
                    this.setState({borderColorcus1: '#FFBF00'});
                  } else if (value < fieldh1 || value > fieldh5) {
                    b = 0;
                    this.setState({borderColorcus1: '#FF0000'});
                  } else {
                    b = 0;
                    this.setState({borderColorcus1: '#FF0000'});
                  }
                } else {
                  b = 0;
                  this.setState({borderColorcus1: '#FEFBFB'});
                }
              }
            });
          }
        } else {
          console.log('age');
        }
      } else {
        b = 0;
        this.setState({borderColorcus1: '#FEFBFB'});
      }
    } else if (ret == false) {
      this.setState({borderColorcus1: this.state.borderColorcus1});
    } else {
      this.state.customData[key].value = value;
      this.setState({customData: this.state.customData});
      this.setState({borderColorcus1: '#FBFBFB'});
    }
    global.customData = this.state.customData;
  };
  sum = (value) => {
    let bmi2 = '';
    if (value !== 0) {
      this.setState({weight: value});
      if (this.state.height != '') {
        let bmi = (value / this.state.height / this.state.height) * 10000;
        let bmi2 = bmi.toFixed(2);
        this.setState({bmi: bmi2});
        this.sum1(bmi2);
      }
    }
    global.bmi = this.state.bmi;
  };
  sum1 = (bmi2) => {
    this.setState({bmi: bmi2});
    let age = global.agevalue;
    let age1 = age.split(' ');
    let ageYear = age1[0].split('Y');
    let ageMonths = age1[1].split('M');
    if (!ageMonths[0]) {
      ageMonths[0] = 0;
    }
    let gender = 'male';
    let h = [];
    let orgAge = ageYear[0] + '.' + ageMonths[0];
    if (bmi2) {
      if (orgAge <= 19.0) {
        if (gender == 'male') {
          h.push(this.state.validateList.m_bmi);
        } else {
          h.push(this.state.validateList.fm_bmi);
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
      if (len == 1 || len == 2 || len == 5 || len == 6) {
        if (val.charAt(len - 1) != '.') {
          // this.setState({height:val})
          return true;
        } else {
          return false;
        }
      } else if (len == 3) {
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
    // if(this.state.loading){
    //   return(
    //   <View style={{
    //       flex: 1,
    //       justifyContent: 'center',
    //       alignItems: 'center'
    //   }}>
    //   <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
    //   </View>
    //   )
    // }
    const left =
      (this.state.value * (Math.round(this.state.screenWidth / 5) - 20)) / 100 -
      15;
    const left1 =
      (this.state.value1 * (Math.round(this.state.screenWidth / 5) - 20)) /
        100 -
      15;
    // alert(global.consult)
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
            testID="circleIcon"
            accessibilityLabel="circleIcon"
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
              }}
              testID="vitalsSuccessText"
              accessibilityLabel="vitalsSuccessText">
              {i18n.t('PATIENTS.VITAL_SUCC')}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
               testID="backButton"
             accessibilityLabel="backButton"
                success
                style={{height: 40, marginTop: 8, marginRight: 10, width: 80}}
                onPress={() => this.setState({alertvisible4: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}
                  testID="backText"
                  accessibilityLabel="backText">
                  {i18n.t('PATIENTS.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    return (
      <Container>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}
            testID="backArrowTouch"
            accessibilityLabel="backArrowTouch">
              <Icon name="md-arrow-back" style={{color: '#FFF'}} 
              testID="backArrowText"
              accessibilityLabel="backArrowText"/>
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={{color: '#FFF', fontSize: 17}}
            testID="vitalsHistoryText"
            accessibilityLabel="vitalsHistoryText">{i18n.t('PATIENTS.VITAL_HISTORY')}</Title>
          </Body>
          <Right>
            {/* {this.state.staus!="Triage"&&<TouchableOpacity style={{backgroundColor:"white"}} onPress={()=>this.props.navigation.navigate('Vitals3',{enc:this.state.enc,length:this.state.v_data.length,height:this.state.height})}>
                                <Text allowFontScaling={false} style={{color:APP_PRIMARY_COLOR,fontSize:12,margin:5}}>Add</Text>
                            </TouchableOpacity>} */}
          </Right>
        </Header>
        <Content style={{marginTop: 15}}>
          {this.state.v_show && (
            <View>
              <Row>
                <Col>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                    testID="addVitalsText"
                    accessibilityLabel="addVitalsText">
                   {i18n.t('PATIENTS.ADD_VITALS')}
                  </Text>
                </Col>
              </Row>
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
                          marginLeft: 10,
                          marginTop: 15,
                        }}
                        testID="heightText"
                        accessibilityLabel="heightText">
                        {i18n.t('PATIENTS.HEIGHT')}
                      </Text>
                    </Col>
                    <Col size={4}>
                      <TextInput
                      testID="heightTextInput"
                      accessibilityLabel="heightTextInput"
                        allowfontScaling={false}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.height}
                        keyboardType="numeric"
                        maxLength={6}
                        style={styles.input}
                        backgroundColor={this.state.borderColorHeight}
                        onChangeText={this.onValueheight.bind(this)}
                      />
                    </Col>
                    <Col size={2}>
                      <Text allowFontScaling={false} style={{marginTop: 12}}
                      testID="cmText"
                      accessibilityLabel="cmText">
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
                          marginLeft: 10,
                          marginTop: 12,
                        }}
                        testID="weightText"
                        accessibilityLabel="weightText">
                        {i18n.t('PATIENTS.WEIGHT')}
                      </Text>
                    </Col>
                    <Col size={4}>
                      <TextInput
                      testID="weightTextInput"
                      accessibilityLabel="weightTextInput"
                        allowfontScaling={false}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.weight}
                        keyboardType="numeric"
                        maxLength={6}
                        style={styles.input}
                        backgroundColor={this.state.borderColorWeight}
                        onChangeText={this.onValueweight.bind(this)}
                      />
                    </Col>
                    <Col size={2}>
                      <Text allowFontScaling={false} style={{marginTop: 12}}
                      testID="kgsText"
                      accessibilityLabel="kgsText">
                      {i18n.t('PATIENTS.KGS')}
                      </Text>
                    </Col>
                  </Row>
                </Col>
                {/* Oxygen Saturation start  */}
                <Col
                  style={{
                    backgroundColor: '#EFEDED',
                    marginTop: 5,
                    marginLeft: 5,
                  }}>
                  <Row>
                    <Col
                      size={50}
                      style={{alignItems: 'center', marginTop: 20}}>
                      {/* <Text>hi</Text> */}
                      <Text allowFontScaling={false} style={{marginLeft: -12}}
                      testID="bmiText"
                      accessibilityLabel="bmiText">
                        <Icon
                        testID="tachometerIcon"
                        accessibilityLabel="tachometerIcon"
                          type="FontAwesome"
                          name="tachometer"
                          style={{
                            fontSize: 35,
                            color: this.state.borderColorbmi,
                          }}
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
                          }}
                          testID={this.state.bmi+"text"}
                          accessibilityLabel={this.state.bmi+"text"}>
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
                  style={{fontWeight: 'bold', fontSize: 13, marginLeft: 10}}
                  testID="bloodText"
                  accessibilityLabel="bloodText">
                  {i18n.t('PATIENTS.BLOOD')}
                </Text>
                <Row style={{marginTop: -18}}>
                  <Col size={20}></Col>
                  <Col size={50}>
                    <TextInput
                    testID="bloodTextInput"
                    accessibilityLabel="bloodTextInput"
                      allowfontScaling={false}
                      // placeholder="Val"
                      placeholderTextColor={'#2D323C'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      value={Math.round(this.state.value).toString()}
                      keyboardType="numeric"
                      maximumValue={300}
                      style={[
                        styles.input1,
                        {
                          width: 50,
                          textAlign: 'center',
                          left: left,
                          marginLeft: 30,
                          marginBottom: 10,
                          marginTop: 20,
                        },
                      ]}
                      onChangeText={this.onValuebmi1.bind(this)}
                    />
                  </Col>
                  <Col size={20}></Col>
                </Row>
                <Row style={{marginLeft: 10, marginTop: -25}}>
                  <Col size={20} style={{marginTop: 8}}>
                    <Text
                      allowFontScaling={false}
                      style={{fontWeight: 'bold', fontSize: 12}}
                      testID="sysText"
                      accessibilityLabel="sysText">
                      {i18n.t('PATIENTS.SYS')}
                    </Text>
                  </Col>
                  <Col size={50}>
                    <Slider
                      value={Number(this.state.value)}
                      thumbTintColor={this.state.borderColorsystolic}
                      minimumTrackTintColor={this.state.borderColorsystolic}
                      minimumValue={0}
                      maximumValue={300}
                      onValueChange={this.onValuebmi1.bind(Number(this))}
                    />
                  </Col>
                  <Col size={15}>
                    <Text allowFontScaling={false} style={{marginTop: 8}}
                    testID="mmText"
                    accessibilityLabel="mmText">
                    {i18n.t('PATIENTS.MM')}
                    </Text>
                  </Col>
                  {/* <Col size={5}>
  <TouchableOpacity onPress={()=>this.getBp()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:30,color:"#0781fa"}} /></TouchableOpacity>
  </Col> */}
                </Row>
                <Row style={{marginTop: -30}}>
                  <Col size={20}></Col>
                  <Col size={50}>
                    <TextInput
                    testID="sysTextInput"
                    accessibilityLabel="sysTextInput"
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
                          width: 50,
                          textAlign: 'center',
                          left: left1,
                          marginLeft: 30,
                          marginBottom: 10,
                          marginTop: 20,
                        },
                      ]}
                      onChangeText={this.onValuebmi2.bind(this)}
                    />
                  </Col>
                  <Col size={20}></Col>
                </Row>
                <Row style={{marginLeft: 10, marginTop: -20}}>
                  <Col size={20} style={{marginTop: 8}}>
                    <Text
                      allowFontScaling={false}
                      style={{fontWeight: 'bold', fontSize: 12}}
                      testID="diaText"
                      accessibilityLabel="diaText">
                      {i18n.t('PATIENTS.DIA')}
                    </Text>
                  </Col>
                  <Col size={50}>
                    <Slider
                      value={Number(this.state.value1)}
                      thumbTintColor={this.state.borderColordiastolic}
                      minimumTrackTintColor={this.state.borderColordiastolic}
                      minimumValue={0}
                      maximumValue={300}
                      onValueChange={this.onValuebmi2.bind(Number(this))}
                    />
                  </Col>
                  <Col size={10}>
                    <Text allowFontScaling={false} style={{marginTop: 8}}
                    testID="hgText"
                    accessibilityLabel="hgText">
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
                      testID="heartbeatIcon"
                      accessibilityLabel="heartbeatIcon"
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
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                          testID="prText"
                          accessibilityLabel="prText">
                          {i18n.t('PATIENTS.PR')}
                        </Text>
                        <Text allowFontScaling={false} style={{fontSize: 12}}
                        testID="minText"
                        accessibilityLabel="minText">
                          {' '}
                          ({i18n.t('PATIENTS.MIN')})
                        </Text>
                      </Text>
                    </Col>
                    <Col size={3}>
                      <TextInput
                      testID="rrTextInput"
                      accessibilityLabel="rrTextInput"
                        allowfontScaling={false}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={String(this.state.value2)}
                        keyboardType="numeric"
                        maxLength={3}
                        style={styles.input}
                        backgroundColor={this.state.borderColorpulse}
                        onChangeText={this.onValuepulse.bind(this)}
                      />
                    </Col>
                    {/* <Col size={1} style={{marginHorizontal:10}}>
  <TouchableOpacity onPress={()=>this.getPulse()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:8,color:"#0781fa"}} /></TouchableOpacity>
  </Col> */}
                  </Row>
                </Col>
                {/* Oxygen Saturation start  */}
                <Col
                  style={{
                    backgroundColor: '#EFEDED',
                    marginTop: 5,
                    marginLeft: 5,
                  }}>
                  <Row>
                    <Col size={2}>
                      {/* <Thumbnail style={{height:30,width:30,marginLeft:5,marginTop:5}} square source={require("../../../assets/images/o2.png")} /> */}
                    </Col>
                    <Col size={4}>
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                        testID="oxygenText"
                        accessibilityLabel="oxygenText"
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          {i18n.t('PATIENTS.O2SAT')}
                        </Text>
                        <Text allowFontScaling={false} style={{fontSize: 12}}>
                          {' '}
                          (%)
                        </Text>
                      </Text>
                    </Col>
                    <Col size={2.5}>
                      <TextInput
                      testID="oxygenTextInput"
                      accessibilityLabel="oxygenTextInput"
                        allowfontScaling={false}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={String(this.state.value3)}
                        keyboardType="numeric"
                        maxLength={3}
                        style={styles.input}
                        marginLeft={-20}
                        backgroundColor={this.state.borderColoroxg}
                        onChangeText={this.onValueoxg.bind(this)}
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
                      testID="heartbeatIcon"
                      accessibilityLabel="heartbeatIcon"
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
                        }}
                        testID="pefrText"
                      accessibilityLabel="pefrText">
                        {i18n.t('PATIENTS.PEFR')}
                      </Text>
                      <Text allowFontScaling={false} style={{fontSize: 12}}
                      testID="lmText"
                      accessibilityLabel="lmText">
                        ({i18n.t('PATIENTS.LM')})
                      </Text>
                    </Col>
                    <Col size={3}>
                      <TextInput
                      testID="pefrTextInput"
                      accessibilityLabel="pefrTextInput"
                        allowfontScaling={false}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={String(this.state.value4)}
                        keyboardType="numeric"
                        maxLength={4}
                        style={styles.input}
                        backgroundColor={this.state.borderColorpefr}
                        onChangeText={this.onValuespi.bind(this)}
                      />
                    </Col>
                    {/* <Col size={1} style={{marginHorizontal:10}}>
  <TouchableOpacity onPress={()=>this.getSpiro()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:8,color:"#0781fa"}} /></TouchableOpacity>
  </Col> */}
                  </Row>
                </Col>
                {/* Respiratory Rate start  */}
                <Col
                  style={{
                    backgroundColor: '#EFEDED',
                    marginTop: 5,
                    marginLeft: 5,
                  }}>
                  <Row>
                    <Col size={2}>
                      {/* <Thumbnail style={{height:30,width:30,marginLeft:10,marginTop:5}} square source={require("../../../assets/images/resp.png")} /> */}
                    </Col>
                    <Col size={4}>
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                          testID="rrText"
                          accessibilityLabel="rrText">
                          {i18n.t('PATIENTS.RR')}
                        </Text>
                        <Text allowFontScaling={false} style={{fontSize: 12}}
                        testID="minText"
                        accessibilityLabel="minText">
                          {' '}
                          ({i18n.t('PATIENTS.MIN')})
                        </Text>
                      </Text>
                    </Col>
                    <Col size={2.5}>
                      <TextInput
                      testID="rrTextInput"
                      accessibilityLabel="rrTextInput"
                        allowfontScaling={false}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={String(this.state.value5)}
                        keyboardType="numeric"
                        maxLength={3}
                        style={styles.input}
                        marginLeft={-20}
                        backgroundColor={this.state.borderColorresp}
                        onChangeText={this.onValueresp.bind(this)}
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
                      testID="thermometerText"
                      accessibilityLabel="thermometerText"
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
                    <Col size={4}>
                      <Text style={{marginTop: 10, fontSize: 12}}>
                        <Text
                        testID="temperatureText"
                        accessibilityLabel="temperatureText"
                          allowFontScaling={false}
                          style={{
                            marginTop: 5,
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginLeft: -5,
                          }}
                         >
                          {i18n.t('PATIENTS.TEMP')}
                        </Text>
                        <Text
                         testID="degreeText"
                         accessibilityLabel="degreeText"
                          allowFontScaling={false}
                          style={{fontSize: 12, marginLeft: 10}}>
                          {' '}
                          ({i18n.t('PATIENTS.DEGREE')})
                        </Text>
                      </Text>
                      {/* <Text allowFontScaling={false}style={{fontSize:12}}>°F</Text> */}
                    </Col>
                    <Col size={3}>
                      <TextInput
                       testID="degreeTextInput"
                       accessibilityLabel="degreeTextInput"
                        allowfontScaling={false}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={String(this.state.value6)}
                        keyboardType="numeric"
                        maxLength={6}
                        style={styles.input}
                        backgroundColor={this.state.bordertemperatue}
                        onChangeText={this.onValuetemp.bind(this)}
                      />
                    </Col>
                    {/* <Col size={1}style={{marginHorizontal:10}}>
  <TouchableOpacity onPress={()=>this.getTemp()}><Icon type="FontAwesome" name="refresh" style={{fontSize:20,marginTop:8,color:"#0781fa"}} /></TouchableOpacity>
  </Col> */}
                  </Row>
                </Col>
                <Col size={1}></Col>
                {/* Custom Field start  */}
                {/*{this.state.custom_fields?
<Col style={{backgroundColor:"#EFEDED",marginTop:5,marginLeft:5} }>
<Row>
  <Col size={2}>
  <Icon style={{fontSize:20,marginTop:10,marginLeft:10,color:"#555b57"}} type="FontAwesome" name="heartbeat" />
  </Col>
  <Col size={4}>
  <Text allowFontScaling={false} style={{marginTop:5,fontSize:12,fontWeight:"bold"}}>{this.props.applyList.message.vitals.custom_fields[0].label}</Text>
  <Text allowFontScaling={false}style={{fontSize:12}}>{this.props.applyList.message.vitals.custom_fields[0].unit}</Text>
  </Col>
  <Col size={2.5}>
  <TextInput  allowfontScaling={false}
placeholderTextColor={"#2D323C"}
returnKeyType="done"
autoCapitalize="none"
value={this.state.custom1}
keyboardType="numeric"
maxLength={3}
style={styles.input}
backgroundColor={this.state.borderColorcus1}
onChangeText={this.onValuecus1.bind(this)}
/>
  </Col>
</Row>
</Col>
:<Col size={1}></Col>
}*/}
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
                          testID="heartBeatIcon"
                          accessibilityLabel="heartBeatIcon"
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
                            }}
                            testID={item.label+"text"}
                            accessibilityLabel={item.label+"text"}>
                            {item.label}
                          </Text>
                          <Text allowFontScaling={false} style={{fontSize: 12}}
                          testID={item.unit+"text"}
                          accessibilityLabel={item.unit+"text"}>
                            ({item.unit})
                          </Text>
                        </Col>
                        <Col size={3}>
                          {this.state.borderColorcus1 == '#FBFBFB' ? (
                            <TextInput
                            testID="unitTextInput"
                            accessibilityLabel="unitTextInput"
                              allowfontScaling={false}
                              placeholderTextColor={'#2D323C'}
                              returnKeyType="done"
                              autoCapitalize="none"
                              value={item.value}
                              keyboardType="numeric"
                              maxLength={6}
                              style={styles.input1}
                              backgroundColor={this.state.borderColorcus1}
                              onChangeText={(text) =>
                                this.onValuecus1(key, text)
                              }
                            />
                          ) : (
                            <TextInput
                            testID="unitTextInput"
                            accessibilityLabel="unitTextInput"
                              allowfontScaling={false}
                              placeholderTextColor={'#2D323C'}
                              returnKeyType="done"
                              autoCapitalize="none"
                              value={item.value}
                              keyboardType="numeric"
                              maxLength={6}
                              style={styles.input}
                              backgroundColor={this.state.borderColorcus1}
                              onChangeText={(text) =>
                                this.onValuecus1(key, text)
                              }
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
                  {/* <Row>
  <Col>
  <Text allowFontScaling={false}style={{marginLeft:10,fontWeight:"bold",marginTop:5}}>Nurse's Notes</Text>
  </Col>
</Row> */}
                  <Row>
                    <Col>
                      {/* <Row>
  <Col>
  <TextInput  allowfontScaling={false}
                // placeholder="Type something"
                value={this.state.nurse_note}
                // onValueChange={this._startRecognizing.bind(Number(this))}    
                multiline={true}
                // numberOfLines={3}
                onContentSizeChange={(event) => {
                  this.setState({ heighttext: event.nativeEvent.contentSize.height })
                }}
                style={{backgroundColor:"#FEFBFB", height:200, textAlignVertical: 'top',height:Math.max(35, this.state.heighttext), borderColor:'#345D7E', borderWidth: 1,
                borderWidth: 1,marginHorizontal:10}}
                 onChangeText={(text)=>{
                   this.setState({nurse_note:text})
                   global.nurse_note=text
                   }}/> */}
                      {/* <Textarea rowSpan={3} bordered /> */}
                      {/* <TouchableOpacity onPress={()=>{this._startRecognizing("nursenotes");SpiroReact.getVoiceValue('nursing')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
                      {/* </Col>

</Row> */}
                      <Row>
                        <Col style={{alignItems: 'center'}}>
                          <Button
                            style={{
                              height: 40,
                              width: 150,
                              backgroundColor: APP_PRIMARY_COLOR,
                              marginTop: 10,
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => this.saveVitalsData()}
                            testID="saveButton"
                              accessibilityLabel="saveButton">
                            <Text
                              allowFontScaling={false}
                              style={{color: 'white', fontSize: 18}}
                              testID="saveText"
                              accessibilityLabel="saveText">
                              {i18n.t('PATIENTS.SAVE')}
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
            </View>
          )}
          {/* <Row>
        <Col>
        <Row style={{marginTop:10}}>
            <Col>
            <Text style={{marginLeft:5,fontWeight:"bold"}}> Date:21-05-2020 & Time:3:00pm</Text>
            </Col>
        </Row>
        <Row style={{marginHorizontal:10}}>
            <Col size={40}>
            <Row style={{marginTop:10}}>
                <Col size={50}>
                <Text style={{fontSize:12}}>Height</Text>
                </Col>
                <Col size={50} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>195.5cm</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={50}>
                <Text style={{fontSize:12}}>Weight</Text>
                </Col>
                <Col size={50} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>kgs</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={50}>
                <Text style={{fontSize:12}}>BMI</Text>
                </Col>
                <Col size={50} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>kg/m<Text style={{fontSize:5}}>2</Text></Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={50}>
                <Text style={{fontSize:12}}>Systolic</Text>
                </Col>
                <Col size={50} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>mm</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={50}>
                <Text style={{fontSize:12}}>Diastolic</Text>
                </Col>
                <Col size={50} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>Hg</Text>
                </Col>
            </Row>
            </Col>
            <Col size={70} style={{marginLeft:5}}>
            <Row style={{marginTop:10}}>
                <Col size={60}>
                <Text style={{fontSize:12}}>Pulse Rate</Text>
                </Col>
                <Col size={40} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>min</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={60}>
                <Text style={{fontSize:12}}>Oxygen Saturation</Text>
                </Col>
                <Col size={40} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>%</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={60}>
                <Text style={{fontSize:12}}>PEFR/Spirometry</Text>
                </Col>
                <Col size={40} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>ltr/min</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={60}>
                <Text style={{fontSize:12}}>Respiratory Rate</Text>
                </Col>
                <Col size={40} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>min</Text>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col size={60}>
                <Text style={{fontSize:12}}>Temperature</Text>
                </Col>
                <Col size={40} style={{borderColor:"black",borderWidth:1}}>
                <Text style={{fontSize:12,textAlign:"center"}}>°F</Text>
                </Col>
            </Row>
            </Col>
        </Row>
        </Col>
    </Row>
    <Row style={{backgroundColor: '#DCDCDC', height: 1, marginVertical: 10}} /> */}

          {/* <Row>
      <Col>
        <Row style={{marginLeft:10}}>
          <Col size={40}>
          <Text>hi</Text>
          </Col>
          <Col size={60}  style={{transform: [{ rotate: '-90deg'}]}}>
        
          <Text style={{textAlignVertical:"top",width:5}}>hk</Text>
          </Col>
        </Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Height</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Weight</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>BMI</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Systolic</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Diastolic</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Pulse Rate</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Oxygen Saturation</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>PEFR/Spirometry</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Respiratory Rate</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
<Row>
  <Col size={40}>
  <Text style={{marginLeft:10}}>Temperature</Text>
  </Col>
  <Col size={60}>

  </Col>
</Row>
      </Col>
     
    </Row> */}
          {/* <Row>
      <Col size={30}>
        <Text style={{marginTop:100}}>Date&Time</Text>
      </Col>
      <Col size={70}>
<Row>
  <Col size={10}>
     <Text style={{marginTop:55}}>h</Text>
    <Text style={{marginTop:-5}}>e</Text>
    <Text style={{marginTop:-5}}>i</Text>
    <Text style={{marginTop:-5}}>g</Text>
    <Text style={{marginTop:-5}}>h</Text>
    <Text style={{marginTop:-5}}>t</Text>
  </Col>
  <Col size={10}>
  <Text style={{marginTop:55}}>w</Text>
    <Text style={{marginTop:-5}}>e</Text>
    <Text style={{marginTop:-5}}>i</Text>
    <Text style={{marginTop:-5}}>g</Text>
    <Text style={{marginTop:-5}}>h</Text>
    <Text style={{marginTop:-5}}>t</Text>
  </Col>
  <Col size={10}>
  <Text style={{marginTop:95}}>B</Text>
    <Text style={{marginTop:-5}}>M</Text>
    <Text style={{marginTop:-5}}>I</Text>
  </Col>
  <Col size={10}>
  <Text style={{marginTop:25}}>S</Text>
    <Text style={{marginTop:-5}}>y</Text>
    <Text style={{marginTop:-5}}>s</Text>
    <Text style={{marginTop:-5}}>t</Text>
    <Text style={{marginTop:-5}}>o</Text>
    <Text style={{marginTop:-5}}>l</Text>
    <Text style={{marginTop:-5}}>i</Text>
    <Text style={{marginTop:-5}}>c</Text>

  </Col>
  <Col size={10}>
  <Text style={{marginTop:10}}>D</Text>
    <Text style={{marginTop:-5}}>i</Text>
    <Text style={{marginTop:-5}}>a</Text>
    <Text style={{marginTop:-5}}>s</Text>
    <Text style={{marginTop:-5}}>t</Text>
    <Text style={{marginTop:-5}}>o</Text>
    <Text style={{marginTop:-5}}>l</Text>
    <Text style={{marginTop:-5}}>i</Text>
    <Text style={{marginTop:-5}}>c</Text>

  </Col>
  <Col size={10}>
    <Text style={{marginTop:110}}>P</Text>
    <Text style={{marginTop:-5}}>R</Text>

  </Col>
  <Col size={10}>
  <Text style={{marginTop:85}}>O2</Text>
    <Text style={{marginTop:-5}}>S</Text>
    <Text style={{marginTop:-5}}>a</Text>
    <Text style={{marginTop:-5}}>t</Text>

  </Col>
  <Col size={10}>
  <Text style={{marginTop:85}}>P</Text>
    <Text style={{marginTop:-5}}>E</Text>
    <Text style={{marginTop:-5}}>F</Text>
    <Text style={{marginTop:-5}}>R</Text>

  </Col>
  <Col size={10}>
  <Text style={{marginTop:110}}>R</Text>
    <Text style={{marginTop:-5}}>R</Text>

  </Col>
  <Col size={10}>
  <Text style={{marginTop:85}}>T</Text>
    <Text style={{marginTop:-5}}>E</Text>
    <Text style={{marginTop:-5}}>M</Text>
    <Text style={{marginTop:-5}}>P</Text>

  </Col>

</Row>
      </Col>
    </Row> */}
          {/* {this.state.v_data.map((item)=>(
   <Row>
      <Col size={30}>
        <Text style={{fontSize:12,marginTop:5}}>
       {item.created_date.split(" ")[0]}&{moment(item.created_date).format('hh:mm A')}
        </Text>
      </Col>
      <Col size={70}>
<Row>
  <Col size={10}>
  {item.height_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.height_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.height_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}
  </Col>
  <Col size={10}>
  {item.weight_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.weight_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.weight_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}
  </Col>
  <Col size={10}>
  {item.bmi_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.bmi_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.bmi_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}
  </Col>
  <Col size={10}>
  {item.systolic_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.systolic_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.systolic_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}

  </Col>
  <Col size={10}>
  {item.diastolic_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.diastolic_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.diastolic_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}

  </Col>
  <Col size={10}>
  {item.pulse_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.pulse_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.pulse_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}

  </Col>
  <Col size={10}>
  {item.oxygen_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.oxygen_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.oxygen_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}
  </Col>
  <Col size={10}>
  {item.PEFR_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.PEFR_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.PEFR_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}
  </Col>
  <Col size={10}>
  {item.resp_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.resp_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.resp_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}
  </Col>
  <Col size={10}>
  {item.temp_rag==0&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FF0000"}} />}
  {item.temp_rag==0.5&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#FFBF00"}} />}
  {item.temp_rag==1&&<Icon type="FontAwesome" name="square" style={{fontSize:20,color:"#00B050"}} />}
  </Col>
</Row>
      </Col>
 </Row>
    ))}   */}
          <Row>
            <Col>
              {/* <Text style={{textAlign:"center",fontWeight:"bold"}}>{this.state.name}</Text> */}
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
              {i18n.t('PATIENTS.VISIT_ID')}:{this.state.enc}
              </Text>
            </Col>
          </Row>
          {this.state.v_data.length != 0 && (
            <Row style={{marginHorizontal: 5, marginTop: 30}}>
              <Col size={32}>
                {/* <Text style={{fontWeight:"bold"}}>Month</Text>
      <Text style={{marginTop:10,fontWeight:"bold"}}>Day</Text>
      <Text style={{marginTop:10,fontWeight:"bold"}}>Time</Text> */}
                <Text allowFontScaling={false} style={{marginTop: 100}}
                testID="heightText"
                accessibilityLabel="heightText">
                {i18n.t('PATIENTS.HEIGHT')}({i18n.t('PATIENTS.CM')})
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 15}}
                testID="weightText"
                accessibilityLabel="weightText">
                {i18n.t('PATIENTS.WEIGHT')}({i18n.t('PATIENTS.KGS')})
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="bmiText"
                accessibilityLabel="bmiText">
                {i18n.t('PATIENTS.BMI')}({i18n.t('PATIENTS.KGM')}<Text style={{fontSize: 5}}>2</Text>)
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="sysText"
                accessibilityLabel="sysText">
                {i18n.t('PATIENTS.SYS')}({i18n.t('PATIENTS.MM')})
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="diaText"
                accessibilityLabel="diaText">
                {i18n.t('PATIENTS.DIA')}({i18n.t('PATIENTS.DIA')})
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="pulseText"
                accessibilityLabel="pulseText">
                {i18n.t('PATIENTS.PULSE')}({i18n.t('PATIENTS.MIN')})
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="oTwoText"
                accessibilityLabel="oTwoText">
                {i18n.t('PATIENTS.O2SAT')}(%)
                </Text>
                {/* {this.state.pf!=""&&this.state.pf!=null&&this.state.pf!=undefined&&<Text style={{marginTop:10}}>PEFR(Ltr/min)</Text>} */}
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="pefrLmText"
                accessibilityLabel="pefrLmText">
                {i18n.t('PATIENTS.PEFR')}({i18n.t('PATIENTS.LM')})
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="respMinText"
                accessibilityLabel="respMinText">
                {i18n.t('PATIENTS.RESP')}({i18n.t('PATIENTS.MIN')})
                </Text>
                <Text allowFontScaling={false} style={{marginTop: 10}}
                testID="temperatureDegreeText"
                accessibilityLabel="temperatureDegreeText">
                {i18n.t('PATIENTS.TEMP')}({i18n.t('PATIENTS.DEGREE')})
                </Text>
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
                            <Text style={[styles.welcome]}
                            testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[9]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[9]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[9]
                              }
                            </Text>
                            <Text style={styles.welcome}
                            testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[8]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[8]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[8]
                              }
                            </Text>
                            <Text style={styles.welcome}testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[7]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[7]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[7]
                              }
                            </Text>
                            <Text style={styles.welcome}
                            testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[6]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[6]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[6]
                              }
                            </Text>
                            <Text style={styles.welcome}>/</Text>
                            <Text style={styles.welcome}
                            testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[4]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[4]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[4]
                              }
                            </Text>
                            <Text style={styles.welcome}
                            testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[3]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[3]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[3]
                              }
                            </Text>
                            <Text style={styles.welcome}>/</Text>
                            <Text style={styles.welcome}
                            testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[1]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[1]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[1]
                              }
                            </Text>
                            <Text style={styles.welcome}
                            testID={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[0]+"text"}
                            accessibilityLabel={ moment(item.created_date.split(' ')[0])
                            .format('DD-MM-YYYY')
                            .split('')[0]+"text"}>
                              {
                                moment(item.created_date.split(' ')[0])
                                  .format('DD-MM-YYYY')
                                  .split('')[0]
                              }
                            </Text>
                            {/* </TouchableOpacity> */}

                            {Platform.OS === 'ios' ? (
                              <Text style={{marginTop: 15, width: 50}}></Text>
                            ) : (
                              <Text style={{width: 50}}></Text>
                            )}

                            <Text
                              style={{
                                marginTop: 25,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.height+"text"}
                              accessibilityLabel={item.height+"text"}>
                              {item.height}
                            </Text>
                            <Text
                              style={{
                                marginTop: 15,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.weight+"text"}
                              accessibilityLabel={item.weight+"text"}>
                              {item.weight}
                            </Text>
                            <Text
                              style={{
                                marginTop: 15,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.bmi+"text"}
                              accessibilityLabel={item.bmi+"text"}>
                              {item.bmi != '' &&
                                item.bmi != null &&
                                Number(item.bmi).toFixed(1)}
                            </Text>
                            <Text
                              style={{
                                marginTop: 10,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.systolic+"text"}
                              accessibilityLabel={item.systolic+"text"}>
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
                              }}
                              testID={item.diastolic+"text"}
                              accessibilityLabel={item.diastolic+"text"}>
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
                              }}
                              testID={item.pulse_rate+"text"}
                              accessibilityLabel={item.pulse_rate+"text"}>
                              {item.pulse_rate}
                            </Text>
                            <Text
                              style={{
                                marginTop: 10,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.oxygen_saturation+"text"}
                              accessibilityLabel={item.oxygen_saturation+"text"}>
                              {item.oxygen_saturation}
                            </Text>
                            {/* {item.PEFR!=""&&item.PEFR!=null&&item.PEFR!=undefined&&<Text style={{marginTop:30,marginLeft:15,textAlign:"center"}}>{item.PEFR}</Text>} */}
                            <Text
                              style={{
                                marginTop: 10,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.PEFR+"text"}
                              accessibilityLabel={item.PEFR+"text"}>
                              {item.PEFR}
                            </Text>
                            <Text
                              style={{
                                marginTop: 10,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.respiratory_rate+"text"}
                              accessibilityLabel={item.respiratory_rate+"text"}>
                              {item.respiratory_rate}
                            </Text>
                            <Text
                              style={{
                                marginTop: 10,
                                marginLeft: 15,
                                textAlign: 'center',
                              }}
                              testID={item.temperature+"text"}
                              accessibilityLabel={item.temperature+"text"}>
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
                              }}
                              testID={ moment(item.created_date)
                                .format('hh:mm A')
                                .split('')[7]+"text"}
                                accessibilityLabel={ moment(item.created_date)
                                  .format('hh:mm A')
                                  .split('')[7]+"text"}>
                              {
                                moment(item.created_date)
                                  .format('hh:mm A')
                                  .split('')[7]
                              }
                            </Text>
                            <Text
                            testID={ moment(item.created_date)
                              .format('hh:mm A')
                              .split('')[6]+"text"}
                              accessibilityLabel={ moment(item.created_date)
                                .format('hh:mm A')
                                .split('')[6]+"text"}
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
                              }}
                              testID={ moment(item.created_date)
                                .format('hh:mm A')
                                .split('')[4]+"text"}
                                accessibilityLabel={ moment(item.created_date)
                                  .format('hh:mm A')
                                  .split('')[4]+"text"}>
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
                              }}
                              testID={ moment(item.created_date)
                                .format('hh:mm A')
                                .split('')[3]+"text"}
                                accessibilityLabel={ moment(item.created_date)
                                  .format('hh:mm A')
                                  .split('')[3]+"text"}>
                              {
                                moment(item.created_date)
                                  .format('hh:mm A')
                                  .split('')[3]
                              }
                            </Text>
                            <Text
                            testID={ moment(item.created_date)
                              .format('hh:mm A')
                              .split('')[2]+"text"}
                              accessibilityLabel={ moment(item.created_date)
                                .format('hh:mm A')
                                .split('')[2]+"text"}
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
                              }}
                              testID={ moment(item.created_date)
                                .format('hh:mm A')
                                .split('')[1]+"text"}
                                accessibilityLabel={ moment(item.created_date)
                                  .format('hh:mm A')
                                  .split('')[1]+"text"}>
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
                              }}
                              testID={ moment(item.created_date)
                                .format('hh:mm A')
                                .split('')[0]+"text"}
                                accessibilityLabel={ moment(item.created_date)
                                  .format('hh:mm A')
                                  .split('')[0]+"text"}>
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
                  }}
                  testID="noDataText"
                  accessibilityLabel="noDataText">
                  {i18n.t('PATIENTS.NODATA')}
                </Text>
              </Col>
            </Row>
          )}
        </Content>
        <FlashMessage
          position="center"
          ref={(ref) => (this.VitalsAlert = ref)}
        />
      </Container>
    );
  }
}

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
  welcome: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -10,
    transform: [{rotate: '-90deg'}],
  },
});
