import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  findNodeHandle,
  KeyboardAvoidingView,
} from 'react-native';
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
import {connect} from 'react-redux';
import {Overlay} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
var SpiroReact = NativeModules.SpiroReact;
import FlashMessage from 'react-native-flash-message';
import {saveSubjectiveData} from '../../../../redux/actions/save_action';
import {saveObjectiveData} from '../../../../redux/actions/save_action';
import {getConsultList} from '../../../../redux/actions/consult_action';
import {getApplyList} from '../../../../redux/actions/tempapply_action';
import QuestionnaireForm from '../../../Questionnaire/Form';
import {saveTemplateData} from '../../../../redux/actions/save_action';
import {cos} from 'react-native-reanimated';
import {APP_PRIMARY_COLOR} from '../../../../themes/variable';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import getBaseUrl from '../../../../config/Config';
import i18n from '../../../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Subjective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load1: false,
      alertvisible4: false,
      chief_complaints: '',
      syptoms_comments: '',
      history_present_ill: '',
      history_past_medical: '',
      history_family_social: '',
      syptoms_comments1: '',
      history_present_ill1: '',
      history_past_medical1: '',
      history_family_social1: '',
      syptoms_comments2: '',
      history_present_ill2: '',
      history_past_medical2: '',
      history_family_social2: '',
      hlpid: this.props.screenProps.hlpid,
      encounter_show: this.props.screenProps.enc_id,
      pagevalue: global.tabvalue,
      hide1: false,
      hide2: false,
      hide3: false,
      hide4: false,
      hide5: false,
      height: 0,
      height1: 0,
      height2: 0,
      height3: 0,
      height4: 0,
      height5: 0,
      height6: 0,
      height7: 0,
      height8: 0,
      height9: 0,
      refreshing: false,
      time_tick3: false,
      time1: true,
      time2: true,
      time3: true,
      time4: true,
      isSubjectiveModified: false,
      symptoms_template: false,
      presentillness_template: false,
      pastillness_template: false,
      familyillness_template: false,
      template_api_response: [],
      active_template: '',
      template_answers: [],
      template_api_data: false,
      template_submit_data: [],
    };

    let o1 = DeviceEventEmitter.addListener('setchief', (e) => {
      this.setState({
        isSubjectiveModified: true,
        chief_complaints:
          this.state.chief_complaints != '' &&
          this.state.chief_complaints != undefined
            ? this.state.chief_complaints + ' ' + e
            : e,
      });
      global.chief_complaints =
        this.state.chief_complaints != '' &&
        this.state.chief_complaints != undefined
          ? this.state.chief_complaints + ' ' + e
          : e;
    });
    let o2 = DeviceEventEmitter.addListener('setsym', (e) => {
      this.setState({
        isSubjectiveModified: true,
        syptoms_comments:
          this.state.syptoms_comments != '' &&
          this.state.syptoms_comments != undefined
            ? this.state.syptoms_comments + ' ' + e
            : e,
      });
      global.symptoms_comments =
        this.state.syptoms_comments != '' &&
        this.state.syptoms_comments != undefined
          ? this.state.syptoms_comments + ' ' + e
          : e;
    });
    let o3 = DeviceEventEmitter.addListener('setpreill', (e) => {
      this.setState({
        isSubjectiveModified: true,
        history_present_ill:
          this.state.history_present_ill != '' &&
          this.state.history_present_ill != undefined
            ? this.state.history_present_ill + ' ' + e
            : e,
      });
      global.history_present_ill =
        this.state.history_present_ill != '' &&
        this.state.history_present_ill != undefined
          ? this.state.history_present_ill + ' ' + e
          : e;
    });
    let o4 = DeviceEventEmitter.addListener('setpastill', (e) => {
      this.setState({
        isSubjectiveModified: true,
        history_past_medical:
          this.state.history_past_medical != '' &&
          this.state.history_past_medical != undefined
            ? this.state.history_past_medical + ' ' + e
            : e,
      });
      global.history_past_medical =
        this.state.history_past_medical != '' &&
        this.state.history_past_medical != undefined
          ? this.state.history_past_medical + ' ' + e
          : e;
    });
    let o5 = DeviceEventEmitter.addListener('setfamill', (e) => {
      this.setState({
        isSubjectiveModified: true,
        history_family_social:
          this.state.history_family_social != '' &&
          this.state.history_family_social != undefined
            ? this.state.history_family_social + ' ' + e
            : e,
      });
      global.history_family_social =
        this.state.history_family_social != '' &&
        this.state.history_family_social != undefined
          ? this.state.history_family_social + ' ' + e
          : e;
    });
  }

  cheif() {
    if (this.state.hide1 == false) {
      this.setState({
        hide1: true,
      });
    } else if (this.state.hide1 == true) {
      this.setState({
        hide1: false,
      });
    }
  }
  sym() {
    if (this.state.hide2 == false) {
      this.setState({
        hide2: true,
      });
    } else if (this.state.hide2 == true) {
      this.setState({
        hide2: false,
      });
    }
  }
  present() {
    if (this.state.hide3 == false) {
      this.setState({
        hide3: true,
      });
    } else if (this.state.hide3 == true) {
      this.setState({
        hide3: false,
      });
    }
  }
  past() {
    if (this.state.hide4 == false) {
      this.setState({
        hide4: true,
      });
    } else if (this.state.hide4 == true) {
      this.setState({
        hide4: false,
      });
    }
  }
  family() {
    if (this.state.hide5 == false) {
      this.setState({
        hide5: true,
      });
    } else if (this.state.hide5 == true) {
      this.setState({
        hide5: false,
      });
    }
  }
  saveSubjective = async (isCheckupAlert) => {
    this.setState({load1: true});
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      cheif_comp_comments: this.state.chief_complaints,
      symptoms_comments:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.syptoms_comments2
            : this.state.syptoms_comments
          : this.state.syptoms_comments2,
      present_ill_text:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.history_present_ill2
            : this.state.history_present_ill
          : this.state.history_present_ill2,
      past_medical_text:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.history_past_medical2
            : this.state.history_past_medical
          : this.state.history_past_medical2,
      family_social_text:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.history_family_social2
            : this.state.history_family_social
          : this.state.history_family_social2,
      encounter_show: this.state.encounter_show,
      hlpid: this.state.hlpid,
    });

    //alert(obj)
    await this.props.saveSubjectiveData(obj);
    let ob = this.props.subjectiveresponse;
    if (ob.message == 'Subjective saved Successfully') {
      // this.updateList()
      this.setState({isSubjectiveModified: false, load1: false, pagevalue: -1});
      if (this.SubjectiveAlert && this.SubjectiveAlert.showMessage) {
        if (isCheckupAlert) {
          this.props.screenProps.showCheckupAlert({
            message: i18n.t('PATIENTS.SUB_SUCC'),
            description: i18n.t('PATIENTS.SUB_SUCC_TXT'),
            type: 'success',
            icon: 'auto',
          });
        } else {
          this.SubjectiveAlert.showMessage({
            message: i18n.t('PATIENTS.SUB_TXT_SAVE'),
            //description: i18n.t('PATIENTS.SUB_SUCC_TXT'),
            type: 'success',
            icon: 'auto',
          });
        }
      }
    }
    // alert(ob.message)
  };
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
    // alert(myobj2)
    // alert("Lab Order saved Successfully")
    console.log('cherrysubj', myobj);
    this.props.screenProps.screen == 'dashboard'
      ? // alert("called2")
        await this.props.getApplyList(myobj)
      : this.props.screenProps.screen == 'timelene'
      ? // alert("called2")
        await this.props.getConsultList(myobj2)
      : null;
  };

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('didBlur', () => {
      if (this.state.isSubjectiveModified) {
        Alert.alert(i18n.t('PATIENTS.ALERT'), i18n.t('PATIENTS.SUB_DATA'), [
          {
            text: i18n.t('COMMON.NO'),
            onPress: () => {
              this.getSubjectiveData();
              this.setState({isSubjectiveModified: false});
            },
          },
          {
            text:i18n.t('COMMON.YES'),
            onPress: () => {
              this.saveSubjective(true);
            },
          },
        ]);
      }
      console.warn('did blur called in subjective');
    });
    this.getSubjectiveData();
    //  this.sendData()
  };
  //     sendData = () => {

  //         this.props.screenProps.parentCallback(this.props.navigation);
  //    }
  getSubjectiveData = () => {
    if (global.screen == 'dashboard') {
      if (this.props.screenProps.check_status.toLowerCase() == 'reconsulting') {
        if (
          this.props.applyList &&
          this.props.applyList.message &&
          this.props.applyList.message.subjective &&
          this.props.applyList.message.subjective.edit != ''
        ) {
          (this.state.syptoms_comments2 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].symptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.edit.syptoms_comments !=
                  '' &&
                this.props.applyList.message.subjective.edit.syptoms_comments !=
                  null &&
                this.props.applyList.message.subjective.edit.syptoms_comments !=
                  undefined
              ? this.props.applyList.message.subjective.edit.syptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
            (this.state.history_present_ill2 =
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].history_present_ill
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.applyList.message.subjective.edit
                    .history_present_ill != '' &&
                  this.props.applyList.message.subjective.edit
                    .history_present_ill != null &&
                  this.props.applyList.message.subjective.edit
                    .history_present_ill != undefined
                ? this.props.applyList.message.subjective.edit.history_present_ill
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
            (this.state.history_past_medical2 =
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].history_past_medical
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.applyList.message.subjective.edit
                    .history_past_medical != '' &&
                  this.props.applyList.message.subjective.edit
                    .history_past_medical != null &&
                  this.props.applyList.message.subjective.edit
                    .history_past_medical != undefined
                ? this.props.applyList.message.subjective.edit.history_past_medical
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
            this.setState({
              history_family_social2:
                this.props.applyList.message.subjective instanceof Array &&
                this.props.applyList.message.subjective.length > 0
                  ? this.props.applyList.message.subjective[0].history_family_social
                      .replace(/<br\s*[\/]?>/gi, '\n')
                      .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                      .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                      .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                  : this.props.applyList.message.subjective.edit
                      .history_family_social != '' &&
                    this.props.applyList.message.subjective.edit
                      .history_family_social != null &&
                    this.props.applyList.message.subjective.edit
                      .history_family_social != undefined
                  ? this.props.applyList.message.subjective.edit.history_family_social
                      .replace(/<br\s*[\/]?>/gi, '\n')
                      .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                      .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                      .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                  : '',
            });
        }
        // alert(JSON.stringify(this.props.applyList.message.subjective.edit))

        (this.state.chief_complaints =
          this.props.applyList.message.subjective instanceof Array &&
          this.props.applyList.message.subjective.length > 0
            ? this.props.applyList.message.subjective[0].cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.subjective.show.cheif_complaints ==
                '' ||
              this.props.applyList.message.subjective.show.cheif_complaints ==
                undefined ||
              this.props.applyList.message.subjective.show.cheif_complaints ==
                null
            ? this.props.screenProps.chief
            : this.props.applyList.message.subjective.show.cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
          (this.state.syptoms_comments1 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].symptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.show.syptoms_comments !=
                  '' &&
                this.props.applyList.message.subjective.show.syptoms_comments !=
                  null &&
                this.props.applyList.message.subjective.show.syptoms_comments !=
                  undefined
              ? this.props.applyList.message.subjective.show.syptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (this.state.time_tick3 = true),
          (this.state.time1 = false),
          (this.state.time2 = false),
          (this.state.time3 = false),
          (this.state.time4 = false),
          (this.state.history_present_ill1 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.show
                  .history_present_ill != '' &&
                this.props.applyList.message.subjective.show
                  .history_present_ill != null &&
                this.props.applyList.message.subjective.show
                  .history_present_ill != undefined
              ? this.props.applyList.message.subjective.show.history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (this.state.history_past_medical1 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.show
                  .history_past_medical != '' &&
                this.props.applyList.message.subjective.show
                  .history_past_medical != null &&
                this.props.applyList.message.subjective.show
                  .history_past_medical != undefined
              ? this.props.applyList.message.subjective.show.history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          this.setState({
            history_family_social1:
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].history_family_social
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.applyList.message.subjective.show
                    .history_family_social != '' &&
                  this.props.applyList.message.subjective.show
                    .history_family_social != null &&
                  this.props.applyList.message.subjective.show
                    .history_family_social != undefined
                ? this.props.applyList.message.subjective.show.history_family_social
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
          });
        (global.chief_complaints =
          this.props.applyList.message.subjective instanceof Array &&
          this.props.applyList.message.subjective.length > 0
            ? this.props.applyList.message.subjective[0].cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.subjective.show.cheif_complaints ==
                '' ||
              this.props.applyList.message.subjective.show.cheif_complaints ==
                undefined ||
              this.props.applyList.message.subjective.show.cheif_complaints ==
                null
            ? this.props.screenProps.chief
            : this.props.applyList.message.subjective.show.cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
          (global.symptoms_comments1 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].symptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.show.syptoms_comments !=
                  '' &&
                this.props.applyList.message.subjective.show.syptoms_comments !=
                  null &&
                this.props.applyList.message.subjective.show.syptoms_comments !=
                  undefined
              ? this.props.applyList.message.subjective.show.syptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (global.history_present_ill1 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.show
                  .history_present_ill != '' &&
                this.props.applyList.message.subjective.show
                  .history_present_ill != null &&
                this.props.applyList.message.subjective.show
                  .history_present_ill != undefined
              ? this.props.applyList.message.subjective.show.history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (global.history_past_medical1 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.show
                  .history_past_medical != '' &&
                this.props.applyList.message.subjective.show
                  .history_past_medical != null &&
                this.props.applyList.message.subjective.show
                  .history_past_medical != undefined
              ? this.props.applyList.message.subjective.show.history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (global.history_family_social1 =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_family_social
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.show
                  .history_family_social != '' &&
                this.props.applyList.message.subjective.show
                  .history_family_social != null &&
                this.props.applyList.message.subjective.history_family_social !=
                  undefined
              ? this.props.applyList.message.subjective.show.history_family_social
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '');

        //
        if (this.state.syptoms_comments2 != '') {
          this.setState({
            hide2: true,
          });
        } else {
          this.setState({
            hide2: false,
          });
        }
        if (this.state.history_present_ill2 != '') {
          this.setState({
            hide3: true,
          });
        } else {
          this.setState({
            hide3: false,
          });
        }
        if (this.state.history_past_medical2 != '') {
          this.setState({
            hide4: true,
          });
        } else {
          this.setState({
            hide4: false,
          });
        }
        if (
          this.props.applyList.message.subjective.edit.history_family_social !=
            '' &&
          this.props.applyList.message.subjective.edit != ''
        ) {
          this.setState({
            hide5: true,
          });
        } else {
          this.setState({
            hide5: false,
          });
        }
      } else {
        (this.state.chief_complaints =
          this.props.applyList.message.subjective instanceof Array &&
          this.props.applyList.message.subjective.length > 0
            ? this.props.applyList.message.subjective[0].cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.subjective.cheif_complaints == '' ||
              this.props.applyList.message.subjective.cheif_complaints ==
                undefined ||
              this.props.applyList.message.subjective.cheif_complaints == null
            ? this.props.screenProps.chief
            : this.props.applyList.message.subjective.cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
          (this.state.syptoms_comments =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].symptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.syptoms_comments !=
                  '' &&
                this.props.applyList.message.subjective.syptoms_comments !=
                  null &&
                this.props.applyList.message.subjective.syptoms_comments !=
                  undefined
              ? this.props.applyList.message.subjective.syptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (this.state.time_tick3 = false),
          (this.state.time1 = true),
          (this.state.time2 = true),
          (this.state.time3 = true),
          (this.state.time4 = true),
          (this.state.history_present_ill =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.history_present_ill !=
                  '' &&
                this.props.applyList.message.subjective.history_present_ill !=
                  null &&
                this.props.applyList.message.subjective.history_present_ill !=
                  undefined
              ? this.props.applyList.message.subjective.history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (this.state.history_past_medical =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.history_past_medical !=
                  '' &&
                this.props.applyList.message.subjective.history_past_medical !=
                  null &&
                this.props.applyList.message.subjective.history_past_medical !=
                  undefined
              ? this.props.applyList.message.subjective.history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          this.setState({
            // isSubjectiveModified: true,
            history_family_social:
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].history_family_social
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.applyList.message.subjective
                    .history_family_social != '' &&
                  this.props.applyList.message.subjective
                    .history_family_social != null &&
                  this.props.applyList.message.subjective
                    .history_family_social != undefined
                ? this.props.applyList.message.subjective.history_family_social
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
          });
        (global.chief_complaints =
          this.props.applyList.message.subjective instanceof Array &&
          this.props.applyList.message.subjective.length > 0
            ? this.props.applyList.message.subjective[0].cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.subjective.cheif_complaints == '' ||
              this.props.applyList.message.subjective.cheif_complaints ==
                undefined ||
              this.props.applyList.message.subjective.cheif_complaints == null
            ? this.props.screenProps.chief
            : this.props.applyList.message.subjective.cheif_complaints
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
          (global.symptoms_comments =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].symptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.syptoms_comments !=
                  '' &&
                this.props.applyList.message.subjective.syptoms_comments !=
                  null &&
                this.props.applyList.message.subjective.syptoms_comments !=
                  undefined
              ? this.props.applyList.message.subjective.syptoms_comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (global.history_present_ill =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.history_present_ill !=
                  '' &&
                this.props.applyList.message.subjective.history_present_ill !=
                  null &&
                this.props.applyList.message.subjective.history_present_ill !=
                  undefined
              ? this.props.applyList.message.subjective.history_present_ill
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (global.history_past_medical =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.history_past_medical !=
                  '' &&
                this.props.applyList.message.subjective.history_past_medical !=
                  null &&
                this.props.applyList.message.subjective.history_past_medical !=
                  undefined
              ? this.props.applyList.message.subjective.history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (global.history_family_social =
            this.props.applyList.message.subjective instanceof Array &&
            this.props.applyList.message.subjective.length > 0
              ? this.props.applyList.message.subjective[0].history_family_social
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.subjective.history_family_social !=
                  '' &&
                this.props.applyList.message.subjective.history_family_social !=
                  null &&
                this.props.applyList.message.subjective.history_family_social !=
                  undefined
              ? this.props.applyList.message.subjective.history_family_social
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '');
      }
    } else if (global.screen == 'timelene') {
      // alert("hi"+JSON.stringify(this.props.consultList.message.subjective.syptoms_c))
      // alert(JSON.stringify(this.props.consultList.message.subjective))
      if (
        this.props.consultList &&
        this.props.consultList.message &&
        this.props.consultList.message.subjective &&
        this.props.consultList.message.subjective.edit != ''
      ) {
        this.state.syptoms_comments2 =
          this.props.consultList.message.subjective instanceof Array &&
          this.props.consultList.message.subjective.length > 0
            ? this.props.consultList.message.subjective[0].symptoms_comments
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.subjective.edit.syptoms_comments !=
                '' &&
              this.props.consultList.message.subjective.edit.syptoms_comments !=
                null &&
              this.props.consultList.message.subjective.edit.syptoms_comments !=
                undefined &&
              this.props.consultList.message.subjective.edit.syptoms_comments
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');

        (this.state.history_present_ill2 =
          this.props.consultList.message.subjective instanceof Array &&
          this.props.consultList.message.subjective.length > 0
            ? this.props.consultList.message.subjective[0].history_present_ill
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.subjective.edit
                .history_present_ill != '' &&
              this.props.consultList.message.subjective.edit
                .history_present_ill != undefined &&
              this.props.consultList.message.subjective.edit
                .history_present_ill != null &&
              this.props.consultList.message.subjective.edit.history_present_ill
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
          (this.state.history_past_medical2 =
            this.props.consultList.message.subjective instanceof Array &&
            this.props.consultList.message.subjective.length > 0
              ? this.props.consultList.message.subjective[0].history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.consultList.message.subjective.edit
                  .history_past_medical != '' &&
                this.props.consultList.message.subjective.edit
                  .history_past_medical != null &&
                this.props.consultList.message.subjective.edit
                  .history_past_medical != undefined &&
                this.props.consultList.message.subjective.edit.history_past_medical
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
          this.setState({
            // isSubjectiveModified: true,
            history_family_social2:
              this.props.consultList.message.subjective instanceof Array &&
              this.props.consultList.message.subjective.length > 0
                ? this.props.consultList.message.subjective[0].history_family_social
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.consultList.message.subjective.edit
                    .history_family_social != '' &&
                  this.props.consultList.message.subjective.edit
                    .history_family_social != null &&
                  this.props.consultList.message.subjective.edit
                    .history_family_social != undefined &&
                  this.props.consultList.message.subjective.edit.history_family_social
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
          });
      }
      (this.state.chief_complaints =
        this.props.consultList.message.subjective.show.cheif_complaints ==
        undefined
          ? this.props.screenProps.chief
          : this.props.consultList.message.subjective.show.cheif_complaints
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
        (this.state.time_tick3 = true),
        (this.state.time1 = false),
        (this.state.time2 = false),
        (this.state.time3 = false),
        (this.state.time4 = false),
        (this.state.syptoms_comments1 =
          this.props.consultList.message.subjective instanceof Array &&
          this.props.consultList.message.subjective.length > 0
            ? this.props.consultList.message.subjective[0].symptoms_comments
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.subjective.show.syptoms_comments
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
        (this.state.history_present_ill1 =
          this.props.consultList.message.subjective instanceof Array &&
          this.props.consultList.message.subjective.length > 0
            ? this.props.consultList.message.subjective[0].history_present_ill
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.subjective.show.history_present_ill
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
        (this.state.history_past_medical1 =
          this.props.consultList.message.subjective instanceof Array &&
          this.props.consultList.message.subjective.length > 0
            ? this.props.consultList.message.subjective[0].history_past_medical
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.subjective.show.history_past_medical
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
        this.setState({
          // isSubjectiveModified: true,
          history_family_social1:
            this.props.consultList.message.subjective instanceof Array &&
            this.props.consultList.message.subjective.length > 0
              ? this.props.consultList.message.subjective[0].history_family_social
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.consultList.message.subjective.show.history_family_social
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
        });

      global.chief_complaints =
        this.props.consultList.message.subjective instanceof Array &&
        this.props.consultList.message.subjective.length > 0
          ? this.props.consultList.message.subjective[0].cheif_complaints
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.subjective.show.cheif_complaints ==
            undefined
          ? this.props.screenProps.chief
          : this.props.consultList.message.subjective.show.cheif_complaints
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');

      global.symptoms_comments1 =
        this.props.consultList.message.subjective instanceof Array &&
        this.props.consultList.message.subjective.length > 0
          ? this.props.consultList.message.subjective[0].symptoms_comments
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.subjective.show.syptoms_comments
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');
      global.history_present_ill1 =
        this.props.consultList.message.subjective instanceof Array &&
        this.props.consultList.message.subjective.length > 0
          ? this.props.consultList.message.subjective[0].history_present_ill
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.subjective.show.history_present_ill
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');
      global.history_past_medical1 =
        this.props.consultList.message.subjective instanceof Array &&
        this.props.consultList.message.subjective.length > 0
          ? this.props.consultList.message.subjective[0].history_past_medical
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.subjective.show.history_past_medical
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');
      global.history_family_social1 =
        this.props.consultList.message.subjective instanceof Array &&
        this.props.consultList.message.subjective.length > 0
          ? this.props.consultList.message.subjective[0].history_family_social
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.subjective.show.history_family_social
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');
      if (this.state.syptoms_comments2 != '') {
        this.setState({
          hide2: true,
        });
      } else {
        this.setState({
          hide2: false,
        });
      }
      if (this.state.history_present_ill2 != '') {
        this.setState({
          hide3: true,
        });
      } else {
        this.setState({
          hide3: false,
        });
      }
      if (this.state.history_past_medical2 != '') {
        this.setState({
          hide4: true,
        });
      } else {
        this.setState({
          hide4: false,
        });
      }

      if (
        this.props.consultList.message.subjective.edit.history_family_social !=
          '' &&
        this.props.consultList.message.subjective.edit != ''
      ) {
        this.setState({
          hide5: true,
        });
      } else {
        this.setState({
          hide5: false,
        });
      }
    }
  };

  componentWillUnmount = () => {
    if (this._unsubscribe && typeof this._unsubscribe == 'function') {
      this._unsubscribe();
    }
  };

  _startRecognizing = async (text) => {
    SpiroReact.speechToTextData(text);
  };
  onChangeText = (key, value) => {
    this.setState({
      isSubjectiveModified: true,
      [key]: value,
    });
  };
  getChiefComplaints = (Complaints) => {
    return <HTMLView value={Complaints} />;
  };

  // save_templates_data - tID, tResponse, username.
  saveTemplateResponse = async (response__Data) => {
    console.log(response__Data + 'responseee');
    this.state.template_answers = response__Data;
    console.log(this.state.template_answers + 'sandyyyyy');
    let obj = JSON.stringify({
      tID: this.props.screenProps.template_id,
      tResponse: JSON.stringify(response__Data),
      username: 'sandy',
    });

    console.log(obj);
    await this.props.saveTemplateData(obj);
    let ob = this.props.template_response;
    console.log(ob.message);
    let final_result = [];
    //console.log(this.state.template_answers + "answers")
    this.state.template_answers.forEach((item, index) => {
      console.log(item);
      if (item.type == 'checkList') {
        final_result.push(item.label);
        item.value.forEach((item, index) => {
          final_result.push(item.value);
        });
      }
      if (item.type == 'simpleQuestion') {
        final_result.push(item.value, item.usernote);
      }
      if (item.type == 'singleChoice') {
        final_result.push(item.label, item.selectedOption.value);
        if (item.hasOwnProperty('childOption') && item.childOption != '') {
          final_result.push(item.childOption.value);
        }
      }
      if (item.type == 'multiChoice') {
        final_result.push(item.label);
        item.value.forEach((item, index) => {
          final_result.push(item.value);
        });
      }
      if (item.type == 'yesNo') {
        final_result.push(item.label, item.selectedOption);
      }
      if (item.type == 'notes') {
        final_result.push(item.label, item.usernote);
      }
      if (item.type == 'table') {
        final_result.push(item.label);
        if (item.hasOwnProperty('value') && item.value.length >= 1) {
          item.value.forEach((item, index) => {
            final_result.push(item);
          });
        }
      }
      if (item.type == 'ratingScale') {
        final_result.push(item.label, item.selectedRating);
      }
    });
    this.setState({symptoms_template: false});
    this.setState({presentillness_template: false});
    this.setState({pastillness_template: false});
    this.setState({familyillness_template: false});

    console.log(final_result + 'finall');
    if (this.state.active_template === 'symptoms') {
      this.setState({
        syptoms_comments: final_result
          .toString()
          .split(',')
          .join('\n')
          .toString(),
      });
    }
    if (this.state.active_template === 'presentIllness') {
      this.setState({
        history_present_ill: final_result
          .toString()
          .split(',')
          .join('\n')
          .toString(),
      });
    }
    if (this.state.active_template === 'pastIllness') {
      this.setState({
        history_past_medical: final_result
          .toString()
          .split(',')
          .join('\n')
          .toString(),
      });
    }
    if (this.state.active_template === 'familyIllness') {
      this.setState({
        history_family_social: final_result
          .toString()
          .split(',')
          .join('\n')
          .toString(),
      });
    }
  };
  //1.get_templates_data - tCategory, tPractice, tBranch, tSpec, tMaster.
  openTemplate = async (data) => {
    this.state.active_template = data;
    this.setState({symptoms_template: false});
    this.setState({presentillness_template: false});
    this.setState({pastillness_template: false});
    this.setState({familyillness_template: false});
    console.log(data);
    let url = getBaseUrl() + 'get_templates_data/';
    let ob = JSON.stringify({
      tCategory: data,
      tPractice: global.template_practice_id,
      tBranch: global.template_branch_id,
      tSpec: global.template_specialization,
      tMaster: this.props.screenProps.template_id,
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
        console.log(response);
        //console.log(JSON.parse(response.message[0].TemplateBody))
        if (response.message.length == 0) {
          alert(i18n.t('PATIENTS.NO_TEMPLATE'));
        } else {
          console.log('else');
          this.state.template_api_response = response.message;
          console.log(this.state.template_api_response);
          if (data === 'symptoms') {
            this.setState({symptoms_template: true});
          }
          if (data === 'presentIllness') {
            this.setState({presentillness_template: true});
          }
          if (data === 'pastIllness') {
            this.setState({pastillness_template: true});
          }
          if (data === 'familyIllness') {
            this.setState({familyillness_template: true});
          }
          this.setState({template_api_data: true});
        }
        //this.setState({upload_image_data:response.message});
      })
      .catch((error) => {
        console.error(error);
      });
  };
  scrollToInput = async (reactNode) => {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode);
  };
  render() {
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
              {i18n.t('PATIENTS.SUB_TXT_SAVE')}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{height: 40, marginTop: 8, marginRight: 10, width: 80}}
                onPress={() => this.setState({alertvisible4: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  {i18n.t('PATIENTS.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }

    return (
      <KeyboardAwareScrollView resetScrollToCoords={{x: 0, y: 0}}>
        <View>
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  marginBottom: 5,
                }}>
                {i18n.t('PATIENTS.CHIEF_COMP')}
              </Text>
            </Col>
          </Row>
          {this.state.hide1 ? (
            <Row style={{marginHorizontal: 10, marginBottom: 10}}>
              <Col>
                <Text allowFontScaling={false}>
                  {this.state.chief_complaints}
                </Text>
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col>
              <TextInput
                allowFontScaling={false}
                value={this.state.chief_complaints}
                // multiline={true}
                scrollEnabled={false}
                onContentSizeChange={(event) => {
                  this.setState({height: event.nativeEvent.contentSize.height});
                }}
                style={{
                  height: 200,
                  textAlignVertical: 'top',
                  height: Math.max(35, this.state.height),
                  borderColor: '#345D7E',
                  borderWidth: 1,
                  borderWidth: 1,
                  marginHorizontal: 10,
                }}
                onChangeText={(text) => {
                  this.onChangeText('chief_complaints', text);
                  global.chief_complaints = text;
                }}
                // blurOnSubmit={true} returnKeyType={"done"}
              />
            </Col>
          </Row>

          <Row style={{marginTop: 2}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  marginBottom: 5,
                }}>
                {i18n.t('COMMON.SYMPTOMS')}
              </Text>
              {/* <Button style={{ height: 20, width: 150, backgroundColor: APP_PRIMARY_COLOR, marginTop: 5,marginBottom:5, alignSelf: "center", justifyContent: "center" }} onPress={() => this.openTemplate()}>
                                <Text allowFontScaling={false} style={{ color: "white", fontSize: 18 }}>Open Template</Text>
                            </Button> */}
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    this.sym();
                  }}>
                  <Text
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    {i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{fontSize: 15}}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>
          {this.state.hide2 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.syptoms_comments2}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height1: event.nativeEvent.contentSize.height,
                    });
                  }}
                  multiline={true}
                  // numberOfLines={5}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height1),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('syptoms_comments2', text);
                    global.symptoms_comments = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick3 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.syptoms_comments1}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height6: event.nativeEvent.contentSize.height,
                    });
                  }}
                  multiline={true}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height6),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      symptoms_comments1: text,
                    });
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time1 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.syptoms_comments}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height1: event.nativeEvent.contentSize.height,
                    });
                  }}
                  multiline={true}
                  // numberOfLines={5}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height1),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('syptoms_comments', text);
                    global.symptoms_comments = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.symptoms_template ? (
            <QuestionnaireForm
              {...this.state.template_api_response}
              onDataChange={this.saveTemplateResponse}></QuestionnaireForm>
          ) : null}
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{marginLeft: 10, fontWeight: 'bold', marginTop: 5}}>
                { i18n.t('PATIENTS.HISTORY')}
              </Text>
            </Col>
          </Row>

          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  marginBottom: 5,
                  fontSize: 12,
                }}>
                { i18n.t('PATIENTS.ILLNESS')}
              </Text>
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    this.present();
                  }}>
                  <Text
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    { i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{fontSize: 15}}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>
          {this.state.hide3 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  value={this.state.history_present_ill2}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height2: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height2),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('history_present_ill2', text);
                    global.history_present_ill = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick3 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  value={this.state.history_present_ill1}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height7: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height7),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      isSubjectiveModified: true,
                      history_present_ill1: text,
                    });
                  }}
                />
              </Col>
            </Row>
          ) : null}

          {this.state.time2 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_present_ill}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height2: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height2),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('history_present_ill', text);
                    global.history_present_ill = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.presentillness_template ? (
            <QuestionnaireForm
              {...this.state.template_api_response}
              onDataChange={this.saveTemplateResponse}></QuestionnaireForm>
          ) : null}
          <Row style={{marginTop: 5}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  marginBottom: 5,
                  fontSize: 12,
                }}>
                { i18n.t('PATIENTS.PAST')}
              </Text>
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    this.past();
                  }}>
                  <Text
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    { i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{fontSize: 15}}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>

          {this.state.hide4 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  value={this.state.history_past_medical2}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height3: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height3),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('history_past_medical2', text);
                    global.history_past_medical = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick3 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  value={this.state.history_past_medical1}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height8: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height8),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      isSubjectiveModified: true,
                      history_past_medical1: text,
                    });
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time3 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_past_medical}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height3: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height3),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('history_past_medical', text);
                    global.history_past_medical = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.pastillness_template ? (
            <QuestionnaireForm
              {...this.state.template_api_response}
              onDataChange={this.saveTemplateResponse}></QuestionnaireForm>
          ) : null}
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 12,
                  marginTop: 10,
                  marginBottom: 5,
                }}>
                { i18n.t('PATIENTS.FAMILY')}
              </Text>
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 10,
                  }}
                  onPress={() => {
                    this.family();
                  }}>
                  <Text
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    { i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{fontSize: 15}}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>
          {this.state.hide5 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_family_social2}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height4: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height4),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('history_family_social2', text);
                    global.history_family_social = text;
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("famill");SpiroReact.getVoiceValue('family')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick3 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_family_social1}
                  multiline={true}
                  // numberOfLines={5}
                  // editable={false}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height9: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height9),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    //   this.onChangeText("history_family_social",text)
                    // global.history_family_social=text
                    this.setState({
                      isSubjectiveModified: true,
                      history_family_social1: text,
                    });
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("famill");SpiroReact.getVoiceValue('family')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time4 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_family_social}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height4: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height4),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.onChangeText('history_family_social', text);
                    global.history_family_social = text;
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("famill");SpiroReact.getVoiceValue('family')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.familyillness_template ? (
            <QuestionnaireForm
              {...this.state.template_api_response}
              onDataChange={this.saveTemplateResponse}></QuestionnaireForm>
          ) : null}
          <Row>
            <Col style={{alignSelf: 'center'}}>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.saveSubjective()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  { i18n.t('PATIENTS.SAVE')}
                </Text>
              </Button>
            </Col>
          </Row>
          <FlashMessage
            position="center"
            ref={(ref) => (this.SubjectiveAlert = ref)}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const mapStateToProps = (state) => ({
  consultList: state.consultList.consultList,
  applyList: state.applyList.applyList,
  isFetching: state.subjective.isFetching,
  subjectiveresponse: state.subjective.subjectiveresponse,
  template_response: state.insight_template.template_response,
});

export default connect(mapStateToProps, {
  saveSubjectiveData,
  saveObjectiveData,
  getApplyList,
  getConsultList,
  saveTemplateData,
})(Subjective);
