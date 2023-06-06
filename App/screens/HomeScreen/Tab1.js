import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
  ActivityIndicator,
  StatusBar,
  BackHandler,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Tab,
  Tabs,
  Row,
  Col,
  Footer,
  FooterTab,
  Button,
  Item,
  Label,
  Icon,
  Thumbnail,
} from 'native-base';

import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';

import CheckUp from './check-up';

import Vitals from './Checkup/Vitals';
import Objective from './Checkup/Objective';
import Plan from './Checkup/Plan';
import Subjective from './Checkup/Subjective';
import Assessment from './Checkup/Assesment';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {getPresecList} from '../../redux/actions/presec_action';
import {
  saveSubjectiveData,
  saveObjectiveData,
  saveAssessementData,
  saveVitalsData,
  savePlanData,
} from '../../redux/actions/save_action';
import FlashMessage from 'react-native-flash-message';
import {changeTabData} from '../../redux/actions/changetab_action';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import i18n from '../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Tab1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loading: false,
      lastpage: -1,
      visible: 0,
      tabs: [
        {
          title: 'Vitals',
          url: Vitals,
          visible: 0,
        },
        {
          title: 'Subjective',
          url: Subjective,
          visible: 0,
        },
        {
          title: 'Objective',
          url: Objective,
          visible: 0,
        },
        {
          title: 'Assessment',
          url: Assessment,
          visible: 0,
        },
        {
          title: 'PlanTTTT',
          url: Plan,
          visible: 1,
        },
      ],
      tabsdata: [
        {
          title: 'Vitals',
          url: Vitals,
          visible: 0,
        },
        {
          title: 'Subjective',
          url: Subjective,
          visible: 0,
        },
        {
          title: 'Objective',
          url: Objective,
          visible: 0,
        },
        {
          title: 'Assessment',
          url: Assessment,
          visible: 0,
        },
        {
          title: 'PlanTTTT',
          url: Plan,
          visible: 1,
        },
      ],
      plantabs: [],
    };
  }

  saveVitalsData = async () => {
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      height: global.height,
      weight: global.weight,
      bmi: global.bmi,
      systolic: Math.round(global.value),
      diastolic: Math.round(global.value1),
      pulse: global.value2,
      oxy_sat: global.value3,
      pefr: global.value4,
      resp: global.value5,
      temperature: global.value6,
      height1: global.height1,
      weight1: global.weight1,
      bmi1: global.weight1,
      systolic1: global.systolic1,
      diastolic1: global.diastolic1,
      pulse1: global.pulse1,
      oxy_sat1: global.oxy_sat1,
      pefr1: global.pefr1,
      resp1: global.resp1,
      temperature1: global.temperature1,
      editor_nurse_notes:
        global.nurse_note != undefined ? global.nurse_note : '',
      hlpid_show: this.props.screenProps.hlpid,
      encounter_show: this.props.screenProps.enc_id,
      age_value: this.props.screenProps.age,
      custom_label: global.customData,
    });
    await this.props.saveVitalsData(obj);

    this.setState({load1: false});
    this.TabAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.VITAL_SUCC'),
      type: 'success',
      icon: 'auto',
    });
  };

  saveSubjective = async () => {
    // this.setState({load1:true})
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      cheif_comp_comments:
        global.chief_complaints != undefined ? global.chief_complaints : '',
      symptoms_comments:
        global.symptoms_comments != undefined ? global.symptoms_comments : '',
      present_ill_text:
        global.history_present_ill != undefined
          ? global.history_present_ill
          : '',
      past_medical_text:
        global.history_past_medical != undefined
          ? global.history_past_medical
          : '',
      family_social_text:
        global.history_family_social != undefined
          ? global.history_family_social
          : '',
      hlpid: this.props.screenProps.hlpid,
      encounter_show: this.props.screenProps.enc_id,
    });
    // alert(obj)
    await this.props.saveSubjectiveData(obj);
    let ob = this.props.subjectiveresponse;
    if (ob.message == 'Subjective saved Successfully') {
      this.setState({load1: false, pagevalue: -1});
      this.TabAlert.showMessage({
        message: 'Success!',
        description: 'Subjective saved',
        type: 'success',
        icon: 'auto',
      });
    }
  };

  saveAssessment = async () => {
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      diag_comm: global.diagnosis_comments ? global.diagnosis_comments : '',
      assm_notes: global.assessment_notes ? global.assessment_notes : '',
      doc_notes: global.doctor_notes ? global.doctor_notes : '',
      hlpid: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
    });
    await this.props.saveAssessementData(obj);
    let ob = this.props.assessmentresponse;
    if (ob.message == 'Assesment Saved Successfully') {
      // this.setState({load1:false})
      this.TabAlert.showMessage({
        message: 'Success!',
        description: 'Assessment Saved ',
        type: 'success',
        icon: 'auto',
      });
    }
  };

  savePlan = async () => {
    const docname = await AsyncStorage.getItem('doctorname');
    let obj = JSON.stringify({
      docid: global.doctor_id,
      hlpid: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      treatment_notes: global.treatment_notes ? global.treatment_notes : '',
      interoffice_notes: global.interoffice_notes
        ? global.interoffice_notes
        : '',
      diet_notes: '',
      followup_date: '',
      followup_notes: global.followup_notes ? global.followup_notes : '',
      username: docname,
      token: global.token,
    });
    // alert(obj)
    await this.props.savePlanData(obj);

    if (this.props.saveplanresponse.message) {
      // alert(this.props.saveplanresponse.message)
      this.setState({load1: false});
      this.TabAlert.showMessage({
        message: 'Success!',
        description: 'Plan saved ',
        type: 'success',
        icon: 'auto',
      });
    }
  };
  saveObjective = async () => {
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      physical:
        global.obj_phy_examination != undefined
          ? global.obj_phy_examination
          : '',
      hlpid: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
    });
    await this.props.saveObjectiveData(obj);
    let ob = this.props.objectiveresponse;
    if (ob.message == 'Objective saved Successfully') {
      // this.setState({load1:false})
      this.TabAlert.showMessage({
        message: 'Success!',
        description: 'Objective saved ',
        type: 'success',
        icon: 'auto',
      });
    }
    // alert(ob.message)
  };
  appendlistdata = (from) => {
    console.log('called');
    this.setState({loading: true});

    let obj = {
      title: (
        <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Icon
            type="FontAwesome"
            name="arrow-left"
            style={{
              fontSize: 25,
              backgroundColor: APP_PRIMARY_COLOR,
              color: '#ffffff',
            }}
          />
        </View>
      ),
      url: Subjective,
    };
    this.state.plantabs.unshift(obj);
    let obj1 = {
      title: (
        <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <View>
            <TouchableOpacity onPress={() => this.props.changeTabData(0)}>
              <Thumbnail
                style={{height: 28, width: 28, marginRight: 5}}
                square
                source={require('../../assets/images/medicine.png')}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.props.changeTabData(1)}>
              <Thumbnail
                style={{height: 28, width: 28, marginRight: 5}}
                square
                source={require('../../assets/images/supplement.png')}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.props.changeTabData(2)}>
              <Thumbnail
                style={{height: 28, width: 28, marginRight: 5}}
                square
                source={require('../../assets/images/lab.png')}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.props.changeTabData(3)}>
              <Thumbnail
                style={{height: 28, width: 28, marginRight: 5}}
                square
                source={require('../../assets/images/imaging.png')}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.props.changeTabData(4)}>
              <Thumbnail
                style={{height: 28, width: 28, marginRight: 5}}
                square
                source={require('../../assets/images/nursing.png')}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.props.changeTabData(5)}>
              <Thumbnail
                style={{height: 28, width: 28, marginRight: 5}}
                square
                source={require('../../assets/images/vaccination.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      ),
      url: Plan,
    };
    this.state.plantabs.push(obj1);
    // this.setState({plantabs:this.state.plantabs})

    this.setState({
      loading: false,
      page: 1,
      frompage: from,
      tabs: this.state.plantabs,
    });
  };
  appendlistdata2 = (from) => {
    console.log('called2');
    this.setState({
      page: 1,
      tabs: this.state.tabsdata,
      frompage: from,
      plantabs: [],
    });
  };
  appendlistdata3 = (i, from) => {
    console.log('called3');
    this.setState({page: i, frompage: from});
  };
  gen_presec = async () => {
    const docname = await AsyncStorage.getItem('doctorname');
    let obs = {
      docid: global.doctor_id,
      hlp: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      doc_name: docname,
      token: global.token,
    };
    await this.props.getPresecList(obs);
    // alert(this.props.presecList.message)
    if (this.props.presecList.message.trim() == 'Please Save Vitals') {
      alert('Please Save Vitals');
      this.setState({page: 0, tabs: this.state.tabsdata});
    } else {
      this.props.screenProps.rootNavigation.navigate('ViewPdf2', {
        link: this.props.presecList.message,
        branch_id:
          this.props.screenProps.enc_id.split('-')[0] +
          '-' +
          this.props.screenProps.enc_id.split('-')[1],
        branch_name: this.props.screenProps.hspname,
        profile_pic: this.props.screenProps.profile_pic,
      });
    }
  };
  render() {
    if (this.state.load1) {
      console.log('loader called');
      return (
        <View
          style={{
            flex: 1,
            marginTop: 250,
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    return (
      <Container>
        <View style={{flex: 1}}>
          <CheckUp
            screenProps={{
              rootNavigation: this.props.screenProps.rootNavigation,
              enc_id: this.props.screenProps.enc_id,
              hlpid: this.props.screenProps.hlpid,
              docid: this.props.screenProps.docid,
              token: this.props.screenProps.token,
              screen: this.props.screenProps.screen,
              chief: this.props.screenProps.chief,
              uid: this.props.screenProps.uid,
              template_id: this.props.screenProps.template_id,
              template_name: this.props.screenProps.template_name,
              app_type: this.props.screenProps.app_type,
              patientname: this.props.screenProps.patientname,
              uid2: this.props.screenProps.uid2,
              age: this.props.screenProps.age,
              dob: this.props.screenProps.dob,
              gender: this.props.screenProps.gender,
              check_status: this.props.screenProps.check_status,
              blood: this.props.screenProps.blood,
            }}
          />
        </View>
        <FlashMessage position="center" ref={(ref) => (this.TabAlert = ref)} />
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  presecList: state.presecList.presecList,
  subjectiveresponse: state.subjective.subjectiveresponse,
  objectiveresponse: state.objective.objectiveresponse,
  assessmentresponse: state.assessment.assessmentresponse,
  vitals_save_response: state.vitals.vitals_save_response,
  saveplanresponse: state.saveplan.plan_save_response,
});

export default connect(mapStateToProps, {
  getPresecList,
  saveSubjectiveData,
  saveObjectiveData,
  saveAssessementData,
  saveVitalsData,
  savePlanData,
  changeTabData,
})(Tab1);
