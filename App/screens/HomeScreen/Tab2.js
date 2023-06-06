import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon2 from 'react-native-vector-icons/FontAwesome';

import {
  Row,
  Col,
  Button,
  Icon,
  Item,
  Input,
  Thumbnail,
  Label,
  Header,
} from 'native-base';
import moment from 'moment';
// redux actions
import {
  saveAllergyData,
  saveSsmData,
  updateAllergyData,
} from '../../redux/actions/save_action';
import {deleteAllergyData} from '../../redux/actions/delete_action';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getConsultList} from '../../redux/actions/consult_action';
import {getApplyList} from '../../redux/actions/tempapply_action';
import {Overlay, ButtonGroup} from 'react-native-elements';
import {connect} from 'react-redux';
import {getPresecList} from '../../redux/actions/presec_action';
import FlashMessage from 'react-native-flash-message';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView } from 'react-native';
// color code..
import {APP_PRIMARY_COLOR} from '../../themes/variable';
// api service
import API from '../../services/Api';
import i18n from '../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Tab2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allergies_data: [],
      refreshing: false,
      ssm_data: [],
      isvisible1: false,
      visible2: false,
      isvisible3: false,
      severity: 'select',
      type: 'select',
      status: 'select',
      reaction: '',
      allergen: '',
      buttonname: 'Save',
      surgeries: '',
      serious_illness: '',
      medications: '',
      chosenDate: new Date(),
      error1: false,
      error2: false,
      error3: false,
      error4: false,
      error5: false,
      error6: false,
      error7: false,
      error8: false,
      allergy_types: {},
      loader: true,
    };
    this.setDate = this.setDate.bind(this);
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getData().then((item) => {
      this.setState({refreshing: false});
    });
  };
  setDate = async (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log('sandy');
    console.log(currentDate);
    await this.setState({chosenDate: moment(currentDate).format('YYYY-MM-DD')});
  };

  componentWillUnmount = async() => {
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  };

  updateAllergyTypes(allergy_types) {
    setTimeout(
      this.setState({
        allergy_types: allergy_types,
        loader: false,
      }),
      100,
    );
  }
  componentDidMount = async () => {
   	    const doctor_id = await AsyncStorage.getItem('doctorid');
    const token = await AsyncStorage.getItem('userToken');
    const payload = {
      docid: doctor_id,
      token: token,
    };
    const allergyJsonResponse = await API.call(
      'post',
      '/allergy_json/',
      payload,
    );
    setTimeout(() => {
      this.setState({
        allergy_types: allergyJsonResponse?.message?.allergy_types?.status,
        loader: false,
      });
    }, 2000);
    if (global.screen == 'dashboard') {
      await this.setState({
        allergies_data: this.props.applyList.message.allergies,
        ssm_data: this.props.applyList.message.ssm,
      });
      //
      //  alert(JSON.stringify(this.state.ssm_data))
    } else if (global.screen == 'timelene') {
      await this.setState({
        allergies_data: this.props.consultList.message.allergies,
        ssm_data: this.props.consultList.message.ssm,
      });
    }
  };
  getData = async () => {
    // alert(JSON.stringify({
    //   "docid":global.doctor_id,
    //   "token":global.token,
    //   "consulting":this.props.screenProps.check_status,
    //   "hlpid":this.props.screenProps.hlpid,
    //   "enc":this.props.screenProps.enc_id,
    //   "chief":this.props.screenProps.chief,
    //   "uid":this.props.screenProps.uid,
    //   "enc":this.props.screenProps.enc_id,
    //   "template_id":this.props.screenProps.template_id,
    //   "template_name":this.props.screenProps.template_name,
    //   "app_type":this.props.screenProps.app_type,
    //   "username":this.props.screenProps.patientname,
    //   "custom_field0":""
    // }))

    if (global.screen == 'dashboard') {
      await this.props.getApplyList({
        docid: global.doctor_id,
        token: global.token,
        consulting: this.props.screenProps.check_status,
        hlpid: this.props.screenProps.hlpid,
        enc: this.props.screenProps.enc_id,
        chief: this.props.screenProps.chief,
        uid: this.props.screenProps.uid,
        enc: this.props.screenProps.enc_id,
        template_id: this.props.screenProps.template_id,
        template_name: this.props.screenProps.template_name,
        app_type: this.props.screenProps.app_type,
        username: this.props.screenProps.patientname,
        custom_field0: '',
      });
      //alert("values="+JSON.stringify(this.props.applyList.message.allergies))
      await this.setState({
        allergies_data: this.props.applyList.message.allergies,
        ssm_data: this.props.applyList.message.ssm,
      });
      //
      //  alert(JSON.stringify(this.state.ssm_data))
    } else if (global.screen == 'timelene') {
      await this.props.getConsultList({
        // "uid":this.state.plist,
        hlpid: this.props.screenProps.hlpid,
        enc: this.props.screenProps.enc_id,
        docid: global.doctor_id,
        token: global.token,
      });
      await this.setState({
        allergies_data: this.props.consultList.message.allergies,
        ssm_data: this.props.consultList.message.ssm,
      });
    }
  };
  closeOverlay = () => {
    this.setState({
      isvisible1: false,
      allergies_id: '',
      type: '',
      allergen: '',
      severity: '',
      chosenDate: new Date(this.state.chosenDate),
      status: '',
      reaction: '',
      buttonname: 'Save',
    });
  };
  closeOverlay2 = () => {
    this.setState({
      visible2: false,
    });
  };
  addAllergy = async () => {
    if (this.state.type == 'select') {
      this.setState({error1: true});
    } else if (this.state.allergen == '') {
      this.setState({error2: true});
    } else if (this.state.severity == 'select') {
      this.setState({error3: true});
    } else if (this.state.status == 'select') {
      this.setState({error4: true});
    } else if (this.state.reaction == '') {
      this.setState({error5: true});
    } else {
      const docname = await AsyncStorage.getItem('doctorname');
      let ob = JSON.stringify({
        allergy_type: this.state.type,
        allergen: this.state.allergen,
        severity: this.state.severity,
        observed_on:
          moment(this.state.chosenDate).format('YYYY-MM-DD') + ' 00:00:00',
        reaction: this.state.reaction,
        status: this.state.status,
        docid: global.doctor_id,
        docname: docname,
        token: global.token,
        hlpid: this.props.screenProps.hlpid,
        encid: this.props.screenProps.enc_id,
      });
      console.log('12345asd', ob);
      await this.props.saveAllergyData(ob);
      //alert(this.props.SaveAllergyResponse.message)
      if (this.props.SaveAllergyResponse.message == 'successfully inserted') {
        this.AllergyAlert.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.ADD_ALLERGE'),
          type: 'success',
          icon: 'auto',
        });
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
        if (global.screen == 'dashboard') {
          await this.setState({
            allergies_data: this.props.applyList.message.allergies,
          });
        } else if (global.screen == 'timelene') {
          await this.setState({
            allergies_data: this.props.consultList.message.allergies,
          });
        }
      }else{
        if (this.props.SaveAllergyResponse.message == 'Already Exists') {
          this.AllergyAlert.showMessage({
           message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.ADD_ALREADY'),
            type: 'success',
            icon: 'auto',
          });
        }
      }
      this.closeOverlay();
    }
  };
  updateAllergy = async () => {
    const docname = await AsyncStorage.getItem('doctorname');
    let ob = JSON.stringify({
      allergy_id: this.state.allergies_id,
      allergy_type: this.state.type,
      allergen: this.state.allergen,
      severity: this.state.severity,
      observed_on:
        moment(this.state.chosenDate).format('YYYY-MM-DD') + ' 00:00:00',
      reaction: this.state.reaction,
      status: this.state.status,
      docname: docname,
      docid: global.doctor_id,
      token: global.token,
    });
    // alert(ob)
    await this.props.updateAllergyData(ob);

    if (this.props.UpdateAllergyResponse.message == 'successfully updated') {
      // alert(this.props.UpdateAllergyResponse.message+" "+this.AllergyAlert)
      this.AllergyAlert.showMessage({
        message: i18n.t('PATIENTS.SUB_SUCC'),
        description: i18n.t('PATIENTS.UPDATE_ALLERGE'),
        type: 'success',
        icon: 'auto',
      });
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
      if (global.screen == 'dashboard') {
        await this.setState({
          allergies_data: this.props.applyList.message.allergies,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          allergies_data: this.props.consultList.message.allergies,
        });
      }
    }
    this.closeOverlay();
  };
  addSsm = async () => {
    //   if(this.state.surgeries==""){
    //     this.setState({error6:true})
    //   }
    //  else if(this.state.serious_illness==""){
    //   this.setState({error7:true})
    //   }
    //   else if(this.state.medications==""){
    //     this.setState({error8:true})
    //   }
    console.log('asdfg');
    if (
      this.state.surgeries != '' ||
      this.state.serious_illness != '' ||
      this.state.medications != ''
    ) {
      const docname = await AsyncStorage.getItem('doctorname');
      let ob = JSON.stringify({
        surgeries: this.state.surgeries,
        serious_ill: this.state.serious_illness,
        medication: this.state.medications,
        docid: global.doctor_id,
        docname: docname,
        token: global.token,
        hlpid: this.props.screenProps.hlpid,
        encid: this.props.screenProps.enc_id,
      });
      console.log('ob123', ob);
      // alert(ob)
      await this.props.saveSsmData(ob);

      if (
        this.props.SaveSsmResponse.message == 'updated successfully' ||
        this.props.SaveSsmResponse.message == 'inserted successfully'
      ) {
        //  alert(this.props.SaveSsmResponse.message)

        this.props.SaveSsmResponse.message == 'updated successfully' &&
          this.SSMAlert.showMessage({
            message: i18n.t('PATIENTS.SUB_SUCC'),
        description: i18n.t('PATIENTS.HISTORY_UPDATE'),
            type: 'success',
            icon: 'auto',
          });
        this.props.SaveSsmResponse.message == 'inserted successfully' &&
          this.SSMAlert.showMessage({
           
            message: i18n.t('PATIENTS.SUB_SUCC'),
        description: i18n.t('PATIENTS.HISTORY_ADDED'),
            type: 'success',
            icon: 'auto',
          });
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
        if (global.screen == 'dashboard') {
          await this.setState({
            ssm_data: this.props.applyList.message.ssm,
          });
        } else if (global.screen == 'timelene') {
          await this.setState({
            ssm_data: this.props.consultList.message.ssm,
          });
        }
      }
      this.closeOverlay2();
    } else {
      // alert("Please Capture SSM")
      this.SSMAlert.showMessage({
        message: i18n.t('PATIENTS.ALERT'),
        description: i18n.t('PATIENTS.SSM'),
        type: 'danger',
        icon: 'auto',
      });
    }
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
    // alert(docname)
    // alert("hi"+this.props.presecList.message)
    if (this.props.presecList.message.trim() == 'Please Save Vitals') {
      alert(i18n.t('PATIENTS.PLS_SAVE_VITALS'));
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
  deleteAllergy = async (allergy_id) => {
    let ob = JSON.stringify({
      allergy_id: allergy_id,
      docid: global.doctor_id,
      token: global.token,
    });
    await this.props.deleteAllergyData(ob);

    if (this.props.DeleteAllergyResponse.message == 'successfully deleted') {
      alert(this.props.DeleteAllergyResponse.message);
      // this.AllergyAlert.showMessage({
      //   message: "Success!",
      //   description: "Allergy Deleted",
      //   type: "success",
      //   icon: "auto"
      // });
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
      if (global.screen == 'dashboard') {
        await this.setState({
          allergies_data: this.props.applyList.message.allergies,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          allergies_data: this.props.consultList.message.allergies,
        });
      }
    }
  };
  onValueChangeType = (value) => {
    this.setState({type: value, error1: false});
  };
  onValueChangeSeverity = (value) => {
    this.setState({severity: value, error3: false});
  };
  onValueChangeStatus = (value) => {
    this.setState({status: value, error4: false});
  };
  render() {
    if (!this.state.loader) {
    if (this.state.isvisible1) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            fullScreen={true}
            isVisible={this.state.isvisible1}
            height={'85%'}
            width={330}
            onBackdropPress={() => this.closeOverlay()}>
            {/* <ScrollView style={{ marginTop: 15 }}> */}
            <KeyboardAwareScrollView>
              <View>
                <Row>
                  <Col style={{marginHorizontal: 0, marginTop: 10}}>
                    <Row>
                      <Col size={25}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.ALLERGY_TYPE')}:</Label>
                      </Col>
                      <Col size={75}>
                        <Item picker>
                          <Picker
                            style={{height: 35, width: 120, marginTop: 10}}
                            selectedValue={this.state.type}
                            iosIcon={
                              <Icon2
                                style={{top: -5}}
                                name="sort-down"
                                color="#a9a9a9"
                              />
                            }
                            placeholder='Select'
                            onValueChange={this.onValueChangeType.bind(this)}>
                            <Picker.Item label={i18n.t('PROFILE.SELECT')} value={'select'} />
                            <Picker.Item
                              label={
                                this.props.historydata.message.allergy_types.status.opt1
                                  .charAt(0)
                                  .toUpperCase() +
                                this.props.historydata.message.allergy_types.status.opt1.slice(
                                  1,
                                )
                              }
                              value={
                                this.props.historydata.message.allergy_types
                                  .status.opt1
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.allergy_types.status.opt2
                                  .charAt(0)
                                  .toUpperCase() +
                                this.props.historydata.message.allergy_types.status.opt2.slice(
                                  1,
                                )
                              }
                              value={
                                this.props.historydata.message.allergy_types
                                  .status.opt2
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.allergy_types.status.opt3
                                  .charAt(0)
                                  .toUpperCase() +
                                this.props.historydata.message.allergy_types.status.opt3.slice(
                                  1,
                                )
                              }
                              value={
                                this.props.historydata.message.allergy_types
                                  .status.opt3
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.allergy_types.status.opt4
                                  .charAt(0)
                                  .toUpperCase() +
                                this.props.historydata.message.allergy_types.status.opt4.slice(
                                  1,
                                )
                              }
                              value={
                                this.props.historydata.message.allergy_types
                                  .status.opt4
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.allergy_types.status.opt5
                                  .charAt(0)
                                  .toUpperCase() +
                                this.props.historydata.message.allergy_types.status.opt5.slice(
                                  1,
                                )
                              }
                              value={
                                this.props.historydata.message.allergy_types
                                  .status.opt5
                              }
                            />
                          </Picker>
                        </Item>
                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error1 &&i18n.t('PATIENTS.ALLERGY_TYPE_ALERT') }
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col size={23}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.ALLERGEN')}:</Label>
                      </Col>
                      <Col size={80}>
                        <Item>
                          <Input
                            style={{height:-5,fontSize: 12,marginTop:13}}
                            placeholder={i18n.t('PATIENTS.ALLERGEN')}
                            value={this.state.allergen}
                            onChangeText={(text) =>
                              this.setState({allergen: text, error2: false})
                            }
                          />
                        </Item>
                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error2 &&i18n.t('PATIENTS.ALLERGEN_ALERT') }
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col size={22}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.SEVERITY')}:</Label>
                      </Col>
                      <Col size={80}>
                        <Item picker>
                          <Picker
                            style={{height: 35, width: 120, marginTop: 11}}
                            iosIcon={
                              <Icon2
                                style={{top: -5}}
                                name="sort-down"
                                color="#a9a9a9"
                              />
                            }
                            placeholder='Select'
                            selectedValue={this.state.severity}
                            onValueChange={this.onValueChangeSeverity.bind(
                              this,
                            )}>
                            <Picker.Item label={i18n.t('PROFILE.SELECT')} value={'select'} />
                            <Picker.Item
                              label={
                                this.props.historydata.message.severity.status.opt2.split(
                                  '-',
                                )[0]
                              }
                              value={
                                this.props.historydata.message.severity.status.opt2.split(
                                  '-',
                                )[0]
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.severity.status.opt1.split(
                                  '-',
                                )[0]
                              }
                              value={
                                this.props.historydata.message.severity.status.opt1.split(
                                  '-',
                                )[0]
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.severity.status.opt4.split(
                                  '-',
                                )[0]
                              }
                              value={
                                this.props.historydata.message.severity.status.opt4.split(
                                  '-',
                                )[0]
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.severity.status.opt3.split(
                                  '-',
                                )[0]
                              }
                              value={
                                this.props.historydata.message.severity.status.opt3.split(
                                  '-',
                                )[0]
                              }
                            />
                          </Picker>
                        </Item>
                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error3 && i18n.t('PATIENTS.SEVERITY_ALERT')}
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col size={33}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.OBSERVE_ON')}:</Label>
                      </Col>
                      <Col size={70}>
                        <Item>
                          {Platform.OS === 'android' ? (
                            <DatePicker
                              allowFontScaling={false}
                              date={new Date(this.state.chosenDate)}
                              minDate={new Date(this.props.screenProps.dob)}
                              maxDate={new Date()}
                              locale={'en'}
                              format="DD-MMM-YYYY"
                              timeZoneOffsetInMinutes={undefined}
                              modalTransparent={false}
                              animationType={'fade'}
                              androidMode={'spinner'}
                              //placeHolderText="Select Here"
                              textStyle={{
                                color: '#2D323C',
                                borderBottomColor: '#DCDCDC',
                                borderBottomWidth: 1,
                              }}
                              placeHolderTextStyle={{
                                color: '#2D323C',
                                borderBottomColor: '#DCDCDC',
                                borderBottomWidth: 1,
                              }}
                              onDateChange={this.setDate}
                              style={{paddingTop: 5}}
                            />
                          ) : (
                            <DateTimePicker
                              style={{
                                width: 320,
                                backgroundColor: 'white',
                                height: 60,
                              }}
                              testID="dateTimePicker"
                              accessibilityLabel="dateTimePicker"
                              value={new Date(this.state.chosenDate)}
                              minimumDate={new Date(this.props.screenProps.dob)}
                              maximumDate={new Date()}
                              mode="date"
                              is24Hour={true}
                              display="default"
                              onChange={this.setDate}
                              locale={'en'}
                            />
                          )}
                        </Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col size={22}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.STATUS')}:</Label>
                      </Col>
                      <Col size={80}>
                        <Item picker>
                          <Picker
                            style={{height: 35, width: 120, marginTop: 10}}
                            selectedValue={this.state.status}
                            iosIcon={
                              <Icon2
                                style={{top: -5}}
                                name="sort-down"
                                color="#a9a9a9"
                              />
                            }
                            placeholder='Select'
                            onValueChange={this.onValueChangeStatus.bind(this)}>
                            <Picker.Item label={i18n.t('PROFILE.SELECT')} value={'select'} />
                            <Picker.Item
                              label={
                                this.props.historydata.message.allergy_status.status.opt1.split(
                                  '-',
                                )[0]
                              }
                              value={
                                this.props.historydata.message.allergy_status.status.opt1.split(
                                  '-',
                                )[1]
                              }
                            />
                            <Picker.Item
                              label={
                                this.props.historydata.message.allergy_status.status.opt2.split(
                                  '-',
                                )[0]
                              }
                              value={
                                this.props.historydata.message.allergy_status.status.opt2.split(
                                  '-',
                                )[1]
                              }
                            />
                          </Picker>
                        </Item>

                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error4 && i18n.t('PATIENTS.STATUS_ALERT')}
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col size={22}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.REACTION')}</Label>
                      </Col>
                      <Col size={80}>
                        <Item>
                          <Input
                            style={{height:-5,fontSize: 12,marginTop:13}}
                            placeholder={i18n.t('PATIENTS.REACTION')}
                            value={this.state.reaction}
                            onChangeText={(text) =>
                              this.setState({reaction: text, error5: false})
                            }
                          />
                        </Item>
                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error5 && i18n.t('PATIENTS.REACTION_ALERT')}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </View>
              {/* </ScrollView> */}
            </KeyboardAwareScrollView>
            <Row>
              <Col>
                <Button
                  onPress={() =>
                    this.state.buttonname == 'Save'
                      ? this.addAllergy()
                      : this.updateAllergy()
                  }
                  style={{
                    height: 40,
                    width: 120,
                    marginBottom: 5,
                    backgroundColor: APP_PRIMARY_COLOR,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', fontSize: 18}}>
                   {i18n.t('COMMON.SAVE')}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.closeOverlay()}
                  style={{
                    height: 40,
                    width: 120,
                    marginBottom: 10,
                    backgroundColor: APP_PRIMARY_COLOR,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', fontSize: 18}}>
                    {i18n.t('PATIENTS.CANCEL')}
                  </Text>
                </Button>
              </Col>
            </Row>
            <FlashMessage
              position="top"
              ref={(ref) => (this.AllergyAlert = ref)}
            />
          </Overlay>
        </View>
      );
    }
    if (this.state.visible2) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible={this.state.visible2}
            //fullScreen={true}
            height={'70%'}
            width={'100%'}
            onBackdropPress={() => this.setState({visible2: false})}>
              <KeyboardAwareScrollView>
                <KeyboardAvoidingView>
            <ScrollView style={{marginTop: 15}}>
              <View>
                <Row>
                  <Col style={{marginHorizontal: 10, marginTop: 20}}>
                    <Row>
                      <Col size={30}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.SUR')}:</Label>
                      </Col>
                      <Col size={80}>
                        <Item>
                          <Input
                            style={{fontSize: 12}}
                            placeholder=""
                            value={this.state.surgeries}
                            onChangeText={(text) =>
                              this.setState({surgeries: text, error6: false})
                            }
                          />
                        </Item>
                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error6 && i18n.t('PATIENTS.SUR_POP')}
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col size={30}>
                        <Label style={styles.LabelStyle}>
                        {i18n.t('PATIENTS.SERIOUS')}:
                        </Label>
                      </Col>
                      <Col size={70}>
                        <Item>
                          <Input
                            style={{fontSize: 12}}
                            placeholder=""
                            value={this.state.serious_illness}
                            onChangeText={(text) =>
                              this.setState({
                                serious_illness: text,
                                error7: false,
                              })
                            }
                          />
                        </Item>
                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error7 &&
                            i18n.t('PATIENTS.SERIOUS_POP')}
                        </Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col size={38}>
                        <Label style={styles.LabelStyle}>{i18n.t('PATIENTS.MEDICATION')}:</Label>
                      </Col>
                      <Col size={75}>
                        <Item>
                          <Input
                            style={{fontSize: 12}}
                            placeholder=""
                            value={this.state.medications}
                            onChangeText={(text) =>
                              this.setState({medications: text, error8: false})
                            }
                          />
                        </Item>
                        <Text allowFontScaling={false} style={{color: 'red'}}>
                          {this.state.error8 && i18n.t('PATIENTS.MEDICATION_POP')}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </View>
            </ScrollView>
          
            <Row>
              <Col>
                <Button
                  onPress={() => this.addSsm()}
                  style={{
                    height: 30,
                    width: 120,
                    marginBottom: 10,
                    backgroundColor: APP_PRIMARY_COLOR,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', fontSize: 18}}>
                    {this.state.ssm_data.length == 0 ?  i18n.t('COMMON.SAVE') :  i18n.t('INITIAL_ASSESSMENT.UPDATE')}
                  </Text>
                </Button>
              </Col>
              <Col>
                <Button
                  onPress={() => this.closeOverlay2()}
                  style={{
                    height: 30,
                    width: 120,
                    marginBottom: 10,
                    backgroundColor: APP_PRIMARY_COLOR,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', fontSize: 18}}>
                     {i18n.t('PATIENTS.CANCEL')}
                  </Text>
                </Button>
              </Col>
            </Row>
            <FlashMessage position="top" ref={(ref) => (this.SSMAlert = ref)} />
            </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
          </Overlay>
         
        </View>
      );
    }
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        {/*           
        <Header style={{backgroundColor:"white",height:100}}>
        <StatusBar backgroundColor={APP_PRIMARY_COLOR} barStyle={"dark-content"}/>
        
        <Row>
          <Col>
          <Row>
            <Col size={10} style={{marginLeft:-15}}>
            <TouchableOpacity>
            <Thumbnail square source={require("../../assets/images/ic_launcher.png")} />
            </TouchableOpacity>
            </Col>
            <Col size={65} style={{marginLeft:20}}>
                            <Text allowFontScaling={false}style={{marginTop:15,marginLeft:20,fontSize:15,alignSelf:"center", textTransform: 'capitalize'}}>{this.props.screenProps.hspname}</Text>
            </Col>
            
            <Col size={25}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Settings')}>
            <Thumbnail  style={{borderRadius: 63,borderWidth: 1,borderColor: "black",marginTop:10,alignSelf:"center"}} small source={this.props.screenProps.profile_pic!=null&&this.props.screenProps.profile_pic!=""?this.props.screenProps.profile_pic:require("../../assets/images/doc.jpg")} />
         </TouchableOpacity>
            </Col>
        </Row>
        <Row style={{backgroundColor:"#e4e4e4",marginHorizontal:-10}}>
                <Col size={75} style={{marginVertical:15}}>
                <Text allowFontScaling={false}style={{fontSize:12,marginLeft:5,textTransform:"capitalize"}}>{this.props.screenProps.name+" | "+this.props.screenProps.gender+" | "+this.props.screenProps.age
                +" | "}{
                  this.props.screenProps.blood=="O pos"?"O +ve":
                  this.props.screenProps.blood=="O neg"?"O -ve":
                  this.props.screenProps.blood=="A pos"?"A +ve":
                  this.props.screenProps.blood=="A neg"?"A -ve":
                  this.props.screenProps.blood=="B pos"?"B +ve":
                  this.props.screenProps.blood=="B neg"?"B -ve":
                  this.props.screenProps.blood=="AB pos"?"AB +ve":
                  this.props.screenProps.blood=="AB neg"?"AB -ve":
                  this.props.screenProps.blood=="OH"?"OH":
                  this.props.screenProps.blood=="NOT KNOWN"&&"NOT KNOWN"
                }</Text>
                </Col>
                <Col size={12}>
      
                <TouchableOpacity onPress={()=>this.gen_presec()}><Thumbnail style={{height:25,width:25,marginTop:15}} square source={require("../../assets/images/pre.png")} /></TouchableOpacity>
                </Col>
                <Col size={12}>
                <TouchableOpacity><Icon type="FontAwesome" name="times" style={{fontSize:20,color:"#949494",marginTop:15,}} /></TouchableOpacity>
                </Col>
              </Row>
          </Col>
        </Row>
        </Header> */}
        <View>
          <Row style={{marginTop: 10}}>
            <Col size={50}>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 15,
                }}>
              {i18n.t('PATIENTS.ALLERGIES')}
              </Text>
            </Col>
            <Col size={50} style={{alignItems: 'flex-end'}}>
              <Button
                style={{
                  backgroundColor: APP_PRIMARY_COLOR,
                  height: 35,
                  width: 40,
                  marginRight: 10,
                }}
                onPress={() => this.setState({isvisible1: true})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 10, marginLeft: 12}}>
                  <Icon
                    type="FontAwesome"
                    name="plus"
                    style={{fontSize: 20, marginTop: 30, color: 'white'}}
                  />
                </Text>
              </Button>
            </Col>
          </Row>
        </View>
        <View style={{marginTop: 10}}>
          <FlatList
            style={styles.contentList}
            columnWrapperStyle={styles.listContainer}
            data={this.state.allergies_data}
            keyExtractor={(item) => {
              return item.allergies_id;
            }}
            renderItem={({item}) => {
              return (
                <View style={styles.card}>
                  {/* <TouchableOpacity> */}
                  <Row>
                    <Col>
                      <TouchableOpacity
                        disabled={item.delete_state == 0 ? true : false}
                        onPress={() => {
                          this.setState({
                            allergies_id: item.allergies_id,
                            type: item.allergy_type,
                            allergen: item.allergen,
                            severity: item.severity,
                            chosenDate: new Date(
                              moment(item.observed_on).format('YYYY-MM-DD'),
                            ),
                            status: item.status,
                            reaction: item.reaction,
                            isvisible1: true,
                            buttonname: i18n.t('INITIAL_ASSESSMENT.UPDATE'),
                          });
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            {fontSize: 12},
                            item.delete_state == 0 && {
                              textDecorationLine: 'line-through',
                            },
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontWeight: '500',
                              marginTop: 13,
                              fontWeight: 'bold',
                            }}>
                            {i18n.t('PATIENTS.TYPE')} :{' '}
                          </Text>
                          {item.allergy_type.replace(
                            /^./,
                            item.allergy_type[0].toUpperCase(),
                          )}{' '}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            {fontSize: 12},
                            item.delete_state == 0 && {
                              textDecorationLine: 'line-through',
                            },
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontWeight: '500',
                              marginTop: 10,
                              fontWeight: 'bold',
                            }}>
                             {i18n.t('PATIENTS.ALLERGEN')}:{' '}
                          </Text>
                          {item.allergen}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            {fontSize: 12},
                            item.delete_state == 0 && {
                              textDecorationLine: 'line-through',
                            },
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontWeight: '500',
                              marginTop: 13,
                              fontWeight: 'bold',
                            }}>
                            {i18n.t('PATIENTS.SEVERITY')} :{' '}
                          </Text>{' '}
                          {item.severity == 1
                            ? 'Absent'
                            : item.severity == 0.5
                            ? 'Moderate'
                            : item.severity == 0
                            ? 'Severe'
                            : item.severity}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            {fontSize: 12},
                            item.delete_state == 0 && {
                              textDecorationLine: 'line-through',
                            },
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontWeight: '500',
                              marginTop: 13,
                              fontWeight: 'bold',
                            }}>
                           {i18n.t('PATIENTS.OBSERVE_ON')}:{' '}
                          </Text>{' '}
                          {moment(item.observed_on, 'YYYY-MM-DD').format(
                            'Do MMM YYYY',
                          )}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            {fontSize: 12},
                            item.delete_state == 0 && {
                              textDecorationLine: 'line-through',
                            },
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontWeight: '500',
                              marginTop: 13,
                              fontWeight: 'bold',
                            }}>
                            {i18n.t('PATIENTS.STATUS')}:{' '}
                          </Text>{' '}
                          {item.status == '0' ? 'Inactive' : 'Active'}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={[
                            {fontSize: 12},
                            item.delete_state == 0 && {
                              textDecorationLine: 'line-through',
                            },
                          ]}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontWeight: '500',
                              marginTop: 13,
                              fontWeight: 'bold',
                            }}>
                             {i18n.t('PATIENTS.REACTION')}:{' '}
                          </Text>
                          {item.reaction}
                        </Text>
                      </TouchableOpacity>
                    </Col>
                    {/* <Col size={25}>
{item.delete_state==1&&
    <TouchableOpacity style={{marginTop:40}} onPress={()=>this.deleteAllergy(item.allergies_id)}>
    <Icon type="FontAwesome" name="trash" style={{fontSize:30,alignSelf:"flex-end"}} />
    </TouchableOpacity>
    }
</Col> */}
                  </Row>

                  {/* </TouchableOpacity> */}
                </View>
              );
            }}
          />
        </View>
        <View>
          <Row style={{marginTop: 10}}>
            <Col size={80}>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 15,
                }}>
                {i18n.t('PATIENTS.TEXT')}
              </Text>
            </Col>
            <Col size={20} style={{alignItems: 'flex-end'}}>
              <Button
                style={{
                  backgroundColor: APP_PRIMARY_COLOR,
                  height: 35,
                  width: 40,
                  marginRight: 10,
                }}
                onPress={() => this.setState({visible2: true})}>
                {this.state.ssm_data.length == 0 ? (
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', fontSize: 10, marginLeft: 12}}>
                    <Icon
                      type="FontAwesome"
                      name="plus"
                      style={{fontSize: 20, marginTop: 30, color: 'white'}}
                    />
                  </Text>
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', fontSize: 10, marginLeft: 12}}>
                    <Icon
                      type="FontAwesome"
                      name="pencil-square-o"
                      style={{fontSize: 20, marginTop: 30, color: 'white'}}
                    />
                  </Text>
                )}
              </Button>
            </Col>
          </Row>
        </View>
        <View style={{marginTop: 10}}>
          <FlatList
            style={styles.contentList}
            columnWrapperStyle={styles.listContainer}
            data={this.state.ssm_data}
            keyExtractor={(item) => {
              return item.ssm_id;
            }}
            renderItem={({item}) => {
              return (
                <View style={styles.card}>
                  <Row>
                    <Col size={90}>
                      <Text allowFontScaling={false} style={{fontSize: 12}}>
                        {' '}
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontWeight: '500',
                            marginTop: 13,
                            fontWeight: 'bold',
                          }}>
                          {i18n.t('PATIENTS.SUR')}:{' '}
                        </Text>
                        {item.surgeries}{' '}
                      </Text>
                      <Text allowFontScaling={false} style={{fontSize: 12}}>
                        {' '}
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontWeight: '500',
                            marginTop: 13,
                            fontWeight: 'bold',
                          }}>
                         {i18n.t('PATIENTS.SERIOUS')}:{' '}
                        </Text>
                        {item.serious_ill}
                      </Text>
                      <Text allowFontScaling={false} style={{fontSize: 12}}>
                        {' '}
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontWeight: '500',
                            marginTop: 13,
                            fontWeight: 'bold',
                          }}>
                           {i18n.t('PATIENTS.MEDICATION')}:{' '}
                        </Text>
                        {item.medications}
                      </Text>
                    </Col>
                    {/* <Col size={10}>
    <TouchableOpacity style={{marginTop:10}} onPress={()=>this.deleteSsm(item.ssm_id)} disabled={item.delete_status==1?true:false}>
    <Icon type="FontAwesome" name="trash" style={{fontSize:30}} />
    </TouchableOpacity>
  </Col> */}
                  </Row>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    );
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  consultList: state.consultList.consultList,
  applyList: state.applyList.applyList,
  historydata: state.history.HistoryResponse,
  SaveAllergyResponse: state.add_allergy.SaveAllergyResponse,
  SaveSsmResponse: state.add_ssm.SaveSsmResponse,
  DeleteAllergyResponse: state.delete_allergy.DeleteAllergyResponse,
  UpdateAllergyResponse: state.update_allergy.UpdateAllergyResponse,
  presecList: state.presecList.presecList,
});
export default connect(mapStateToProps, {
  saveAllergyData,
  saveSsmData,
  getApplyList,
  getConsultList,
  deleteAllergyData,
  updateAllergyData,
  getPresecList,
})(Tab2);

const styles = StyleSheet.create({
  input: {
    // marginTop:15,
    borderColor: '#345D7E',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
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
  container: {
    // backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
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
  inputContainerStyle: {
    borderRadius: 0,
    paddingLeft: 5,
    height: 40,
    width: 300,
    justifyContent: 'center',
    borderColor: 'transparent',
    alignItems: 'stretch',
    backgroundColor: '#efeaea',
  },
  listData: {fontSize: 13, fontWeight: 'bold', marginTop: 10},
  LabelStyle: {
    marginTop: 26,
    fontSize: 14,
    flexWrap: 'wrap',
    fontWeight: '800',
  },
});
