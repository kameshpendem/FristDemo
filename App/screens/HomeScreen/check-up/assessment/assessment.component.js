import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  NativeModules,
  DeviceEventEmitter,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
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
import { connect } from 'react-redux';
import { Overlay } from 'react-native-elements';
var SpiroReact = NativeModules.SpiroReact;
import FlashMessage from 'react-native-flash-message';
import { saveAssessementData } from '../../../../redux/actions/save_action';
import { getConsultList } from '../../../../redux/actions/consult_action';
import { getApplyList } from '../../../../redux/actions/tempapply_action';
import QuestionnaireForm from '../../../Questionnaire/Form';
import { saveTemplateData } from '../../../../redux/actions/save_action';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { APP_PRIMARY_COLOR } from '../../../../themes/variable';
import getBaseUrl from '../../../../config/Config';
import i18n from '../../../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Assesment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_notes: '',
      diagnosis_comments: '',
      doctor_notes: '',
      assessment_notes1: '',
      diagnosis_comments1: '',
      doctor_notes1: '',
      assessment_notes2: '',
      diagnosis_comments2: '',
      doctor_notes2: '',
      load1: false,
      alertvisible4: false,
      hlpid: this.props.screenProps.hlpid,
      encounter_show: this.props.screenProps.enc_id,
      hide7: false,
      hide8: false,
      height: 0,
      height1: 0,
      height2: 0,
      height3: 0,
      height4: 0,
      height5: 0,
      hide9: false,
      time_tick: false,
      time1: true,
      time2: true,
      time3: true,
      isAssessmentModified: false,
      diagnoses_template: false,
      assessment_template: false,
      notes_template: false,
      template_api_response: [],
      active_template: '',
      template_answers: [],
    };

    let o1 = DeviceEventEmitter.addListener('setdiag', (e) => {
      this.setState({
        isAssessmentModified: true,
        diagnosis_comments:
          this.state.diagnosis_comments != '' &&
            this.state.diagnosis_comments != undefined
            ? this.state.diagnosis_comments + ' ' + e
            : e,
      });
      global.diagnosis_comments =
        this.state.diagnosis_comments != '' &&
          this.state.diagnosis_comments != undefined
          ? this.state.diagnosis_comments + ' ' + e
          : e;
    });

    let o2 = DeviceEventEmitter.addListener('setassmnotes', (e) => {
      this.setState({
        isAssessmentModified: true,
        assessment_notes:
          this.state.assessment_notes != '' &&
            this.state.assessment_notes != undefined
            ? this.state.assessment_notes + ' ' + e
            : e,
      });
      global.assessment_notes =
        this.state.assessment_notes != '' &&
          this.state.assessment_notes != undefined
          ? this.state.assessment_notes + ' ' + e
          : e;
    });

    let o3 = DeviceEventEmitter.addListener('setdocnotes', (e) => {
      this.setState({
        isAssessmentModified: true,
        doctor_notes:
          this.state.doctor_notes != '' && this.state.doctor_notes != undefined
            ? this.state.doctor_notes + ' ' + e
            : e,
      });
      global.doctor_notes =
        this.state.doctor_notes != '' && this.state.doctor_notes != undefined
          ? this.state.doctor_notes + ' ' + e
          : e;
    });
  }

  dig() {
    if (this.state.hide7 == false) {
      this.setState({
        hide7: true,
      });
    } else if (this.state.hide7 == true) {
      this.setState({
        hide7: false,
      });
    }
  }
  asses() {
    if (this.state.hide8 == false) {
      this.setState({
        hide8: true,
      });
    } else if (this.state.hide8 == true) {
      this.setState({
        hide8: false,
      });
    }
  }
  doc() {
    if (this.state.hide9 == false) {
      this.setState({
        hide9: true,
      });
    } else if (this.state.hide9 == true) {
      this.setState({
        hide9: false,
      });
    }
  }
  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('didBlur', () => {
      if (this.state.isAssessmentModified) {
        Alert.alert(i18n.t('ASSESSMENT.ALERT'), i18n.t('ASSESSMENT.SAVE_ASSESSMENT'), [
          {
            text: i18n.t('COMMON.NO'),
            onPress: () => {
              this.getAssessmentData();
              this.setState({ isAssessmentModified: false });
            },
          },
          {
            text: i18n.t('COMMON.YES'),
            onPress: () => {
              this.saveAssessment(true);
            },
          },
        ]);
      }
      console.warn('did blur called in assessment');
    });
    this.getAssessmentData();
  };
  getAssessmentData = () => {
    if (global.screen == 'dashboard') {
      if (this.props.screenProps.check_status.toLowerCase() == 'reconsulting') {
        if (
          this.props.applyList &&
          this.props.applyList.message &&
          this.props.applyList.message.assessment &&
          this.props.applyList.message.assessment.edit != ''
        ) {
          (this.state.assessment_notes2 =
            this.props.applyList.message.assessment instanceof Array &&
              this.props.applyList.message.assessment.length > 0
              ? this.props.applyList.message.assessment[0].assessment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.assessment.edit.assessment_notes !=
                '' &&
                this.props.applyList.message.assessment.edit.assessment_notes !=
                null &&
                this.props.applyList.message.assessment.edit.assessment_notes !=
                undefined
                ? this.props.applyList.message.assessment.edit.assessment_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
            (this.state.diagnosis_comments2 =
              this.props.applyList.message.diagnosis instanceof Array &&
                this.props.applyList.message.assessment.length > 0
                ? this.props.applyList.message.diagnosis[0].notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.applyList.message.assessment.edit.comments != '' &&
                  this.props.applyList.message.assessment.edit.comments !=
                  null &&
                  this.props.applyList.message.assessment.edit.comments !=
                  undefined
                  ? this.props.applyList.message.assessment.edit.comments
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                  : ''),
            this.setState({
              doctor_notes2:
                this.props.applyList.message.assessment instanceof Array &&
                  this.props.applyList.message.assessment.length > 0
                  ? this.props.applyList.message.assessment[0].doctor_notes
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                  : this.props.applyList.message.assessment.edit.doctor_notes !=
                    '' &&
                    this.props.applyList.message.assessment.edit.doctor_notes !=
                    null &&
                    this.props.applyList.message.assessment.edit.doctor_notes !=
                    undefined
                    ? this.props.applyList.message.assessment.edit.doctor_notes
                      .replace(/<br\s*[\/]?>/gi, '\n')
                      .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                      .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                      .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                    : '',
            });
        }
        // alert(JSON.stringify(this.props.applyList.message.assessment.edit))
        (this.state.time_tick = true),
          (this.state.time1 = false),
          (this.state.time2 = false),
          (this.state.time3 = false),
          (this.state.assessment_notes1 =
            this.props.applyList.message.assessment instanceof Array &&
              this.props.applyList.message.assessment.length > 0
              ? this.props.applyList.message.assessment[0].assessment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.assessment.show.assessment_notes !=
                '' &&
                this.props.applyList.message.assessment.show.assessment_notes !=
                null &&
                this.props.applyList.message.assessment.show.assessment_notes !=
                undefined
                ? this.props.applyList.message.assessment.show.assessment_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
          (this.state.diagnosis_comments1 =
            this.props.applyList.message.diagnosis instanceof Array &&
              this.props.applyList.message.assessment.length > 0
              ? this.props.applyList.message.diagnosis[0].notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.assessment.show.comments != '' &&
                this.props.applyList.message.assessment.show.comments != null &&
                this.props.applyList.message.assessment.show.comments !=
                undefined
                ? this.props.applyList.message.assessment.show.comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
          this.setState({
            doctor_notes1:
              this.props.applyList.message.assessment instanceof Array &&
                this.props.applyList.message.assessment.length > 0
                ? this.props.applyList.message.assessment[0].doctor_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.applyList.message.assessment.show.doctor_notes !=
                  '' &&
                  this.props.applyList.message.assessment.show.doctor_notes !=
                  null &&
                  this.props.applyList.message.assessment.show.doctor_notes !=
                  undefined
                  ? this.props.applyList.message.assessment.show.doctor_notes
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                  : '',
          });
        global.assessment_notes1 =
          this.props.applyList.message.assessment instanceof Array &&
            this.props.applyList.message.assessment.length > 0
            ? this.props.applyList.message.assessment[0].assessment_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.assessment.show.assessment_notes !=
              '' &&
              this.props.applyList.message.assessment.show.assessment_notes !=
              null &&
              this.props.applyList.message.assessment.show.assessment_notes !=
              undefined
              ? this.props.applyList.message.assessment.show.assessment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '';

        global.diagnosis_comments1 =
          this.props.applyList.message.diagnosis instanceof Array &&
            this.props.applyList.message.assessment.length > 0
            ? this.props.applyList.message.diagnosis[0].notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.assessment.show.comments != '' &&
              this.props.applyList.message.assessment.show.comments != null &&
              this.props.applyList.message.assessment.show.comments != undefined
              ? this.props.applyList.message.assessment.show.comments
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '';

        global.doc_notes1 =
          this.props.applyList.message.assessment instanceof Array &&
            this.props.applyList.message.assessment.length > 0
            ? this.props.applyList.message.assessment[0].doctor_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.assessment.show.doctor_notes != '' &&
              this.props.applyList.message.assessment.show.doctor_notes !=
              null &&
              this.props.applyList.message.assessment.show.doctor_notes !=
              undefined
              ? this.props.applyList.message.assessment.show.doctor_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '';
        //
        if (this.state.diagnosis_comments2 != '') {
          this.setState({
            hide7: true,
          });
        } else {
          this.setState({
            hide7: false,
          });
        }
        if (this.state.assessment_notes2 != '') {
          this.setState({
            hide8: true,
          });
        } else {
          this.setState({
            hide8: false,
          });
        }
        if (
          this.props.applyList.message.assessment.edit.doctor_notes != '' &&
          this.props.applyList.message.assessment.edit != ''
        ) {
          this.setState({
            hide9: true,
          });
        } else {
          this.setState({
            hide9: false,
          });
        }
      } else {
        (this.state.time_tick = false),
          (this.state.time1 = true),
          (this.state.time2 = true),
          (this.state.time3 = true),
          (this.state.assessment_notes =
            this.props.applyList.message.assessment instanceof Array &&
              this.props.applyList.message.assessment.length > 0
              ? this.props.applyList.message.assessment[0].assessment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.assessment.assessment_notes !=
                '' &&
                this.props.applyList.message.assessment.assessment_notes !=
                null &&
                this.props.applyList.message.assessment.assessment_notes !=
                undefined
                ? this.props.applyList.message.assessment.assessment_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
          (this.state.diagnosis_comments =
            this.props.applyList.message.diagnosis instanceof Array &&
              this.props.applyList.message.assessment.length > 0
              ? this.props.applyList.message.diagnosis[0].notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.applyList.message.assessment.comments != '' &&
                this.props.applyList.message.assessment.comments != null &&
                this.props.applyList.message.assessment.comments != undefined
                ? this.props.applyList.message.assessment.comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
          this.setState({
            doctor_notes:
              this.props.applyList.message.assessment instanceof Array &&
                this.props.applyList.message.assessment.length > 0
                ? this.props.applyList.message.assessment[0].doctor_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.applyList.message.assessment.doctor_notes != '' &&
                  this.props.applyList.message.assessment.doctor_notes !=
                  null &&
                  this.props.applyList.message.assessment.doctor_notes !=
                  undefined
                  ? this.props.applyList.message.assessment.doctor_notes
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                  : '',
          });
        global.assessment_notes =
          this.props.applyList.message.assessment instanceof Array &&
            this.props.applyList.message.assessment.length > 0
            ? this.props.applyList.message.assessment[0].assessment_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.assessment.assessment_notes != '' &&
              this.props.applyList.message.assessment.assessment_notes !=
              null &&
              this.props.applyList.message.assessment.assessment_notes !=
              undefined
              ? this.props.applyList.message.assessment.assessment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '';

        global.diagnosis_comments =
          this.props.applyList.message.diagnosis instanceof Array &&
            this.props.applyList.message.assessment.length > 0
            ? this.props.applyList.message.diagnosis[0].notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.assessment.comments != '' &&
              this.props.applyList.message.assessment.comments != null &&
              this.props.applyList.message.assessment.comments != undefined
              ? this.props.applyList.message.assessment.comments
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '';

        global.doc_notes =
          this.props.applyList.message.assessment instanceof Array &&
            this.props.applyList.message.assessment.length > 0
            ? this.props.applyList.message.assessment[0].doctor_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.applyList.message.assessment.doctor_notes != '' &&
              this.props.applyList.message.assessment.doctor_notes != null &&
              this.props.applyList.message.assessment.doctor_notes != undefined
              ? this.props.applyList.message.assessment.doctor_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '';
      }
    } else if (global.screen == 'timelene') {
      if (
        this.props.consultList &&
        this.props.consultList.message &&
        this.props.consultList.message.assessment &&
        this.props.consultList.message.assessment.edit != ''
      ) {
        (this.state.assessment_notes2 =
          this.props.consultList.message.assessment instanceof Array &&
            this.props.consultList.message.assessment.length > 0
            ? this.props.consultList.message.assessment[0].assessment_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.assessment.edit.assessment_notes !=
              null &&
              this.props.consultList.message.assessment.edit.assessment_notes !=
              undefined &&
              this.props.consultList.message.assessment.edit.assessment_notes !=
              ''
              ? this.props.consultList.message.assessment.edit.assessment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
          (this.state.diagnosis_comments2 =
            this.props.consultList.message.diagnosis instanceof Array &&
              this.props.consultList.message.assessment.length > 0
              ? this.props.consultList.message.diagnosis[0].notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.consultList.message.assessment.edit.comments !=
                null &&
                this.props.consultList.message.assessment.edit.comments !=
                undefined &&
                this.props.consultList.message.assessment.edit.comments != ''
                ? this.props.consultList.message.assessment.edit.comments
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : ''),
          this.setState({
            doctor_notes2:
              this.props.consultList.message.assessment instanceof Array &&
                this.props.consultList.message.assessment.length > 0
                ? this.props.consultList.message.assessment[0].doctor_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : this.props.consultList.message.assessment.edit.doctor_notes !=
                  null &&
                  this.props.consultList.message.assessment.edit.doctor_notes !=
                  undefined &&
                  this.props.consultList.message.assessment.edit.doctor_notes !=
                  ''
                  ? this.props.consultList.message.assessment.edit.doctor_notes
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                  : '',
          });
      }
      // alert(JSON.stringify(this.props.consultList.message.assessment))

      (this.state.time_tick = true),
        (this.state.time1 = false),
        (this.state.time2 = false),
        (this.state.time3 = false),
        (this.state.assessment_notes1 =
          this.props.consultList.message.assessment instanceof Array &&
            this.props.consultList.message.assessment.length > 0
            ? this.props.consultList.message.assessment[0].assessment_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.assessment.show.assessment_notes !=
              null
              ? this.props.consultList.message.assessment.show.assessment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
        (this.state.diagnosis_comments1 =
          this.props.consultList.message.diagnosis instanceof Array &&
            this.props.consultList.message.assessment.length > 0
            ? this.props.consultList.message.diagnosis[0].notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : this.props.consultList.message.assessment.show.comments != null
              ? this.props.consultList.message.assessment.show.comments
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : ''),
        this.setState({
          doctor_notes1:
            this.props.consultList.message.assessment instanceof Array &&
              this.props.consultList.message.assessment.length > 0
              ? this.props.consultList.message.assessment[0].doctor_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.consultList.message.assessment.show.doctor_notes !=
                null
                ? this.props.consultList.message.assessment.show.doctor_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
        });
      global.assessment_notes =
        this.props.consultList.message.assessment instanceof Array &&
          this.props.consultList.message.assessment.length > 0
          ? this.props.consultList.message.assessment[0].assessment_notes
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.assessment.show.assessment_notes !=
            null
            ? this.props.consultList.message.assessment.show.assessment_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : '';

      global.diagnosis_comments =
        this.props.consultList.message.diagnosis instanceof Array &&
          this.props.consultList.message.assessment.length > 0
          ? this.props.consultList.message.diagnosis[0].notes
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.assessment.show.comments != null
            ? this.props.consultList.message.assessment.show.comments
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : '';

      global.doc_notes =
        this.props.consultList.message.assessment instanceof Array &&
          this.props.consultList.message.assessment.length > 0
          ? this.props.consultList.message.assessment[0].doctor_notes
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.assessment.show.doc_notes != null
            ? this.props.consultList.message.assessment.show.doctor_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : '';

      if (this.state.diagnosis_comments2 != '') {
        this.setState({
          hide7: true,
        });
      } else {
        this.setState({
          hide7: false,
        });
      }
      if (this.state.assessment_notes2 != '') {
        this.setState({
          hide8: true,
        });
      } else {
        this.setState({
          hide8: false,
        });
      }
      if (
        this.props.consultList.message.assessment.edit.doctor_notes != '' &&
        this.props.consultList.message.assessment.edit != ''
      ) {
        this.setState({
          hide9: true,
        });
      } else {
        this.setState({
          hide9: false,
        });
      }
    }
  };
  componentWillUnmount = () => {
    if (this._unsubscribe && typeof this._unsubscribe == 'function') {
      this._unsubscribe();
    }
  };

  onChangeText = (key, value) => {
    this.setState({
      isAssessmentModified: true,
      [key]: value,
    });
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
    this.props.screenProps.screen == 'dashboard'
      ? await this.props.getApplyList(myobj)
      : this.props.screenProps.screen == 'timelene'
        ? await this.props.getConsultList(myobj2)
        : null;
  };

  _startRecognizing = async (text) => {
    SpiroReact.speechToTextData(text);
  };
  saveAssessment = async (isCheckupAlert) => {
    this.setState({ load1: true });
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      diag_comm:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.diagnosis_comments2
            : this.state.diagnosis_comments
          : this.state.diagnosis_comments2,
      assm_notes:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.assessment_notes2
            : this.state.assessment_notes
          : this.state.assessment_notes2,
      doc_notes:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.doctor_notes2
            : this.state.doctor_notes
          : this.state.doctor_notes2,
      hlpid: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      hlpid: this.state.hlpid,
    });
    console.log('saveAssessment_obbb', obj);
    await this.props.saveAssessementData(obj);
    let ob = this.props.assessmentresponse;
    if (ob.message == 'Assesment Saved Successfully') {
      // this.updateList();
      this.setState({ isAssessmentModified: false, load1: false });
      if (this.AssessmentAlert && this.AssessmentAlert.showMessage) {
        if (isCheckupAlert) {
          this.props.screenProps.showCheckupAlert({
            message: i18n.t('ASSESSMENT.SUCCESS'),
            description: i18n.t('ASSESSMENT.ASSESSMENT_SAVED'),
            type: 'success',
            icon: 'auto',
          });
        } else {
          this.AssessmentAlert.showMessage({
            message: i18n.t('PATIENTS.ASS_SAVE_TEXT'),
            //description: i18n.t('PATIENTS.ASS_SUCC'),
            type: 'success',
            icon: 'auto',
          });
        }
      }
    }
  };

  //1.get_templates_data - tCategory, tPractice, tBranch, tSpec, tMaster.
  openTemplate = async (data) => {
    this.state.active_template = data;
    this.setState({ diagnoses_template: false });
    this.setState({ assessment_template: false });
    this.setState({ notes_template: false });
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
          if (data === 'diagnoses') {
            this.setState({ diagnoses_template: true });
          }
          if (data === 'assessment') {
            this.setState({ assessment_template: true });
          }
          if (data === 'doctorNotes') {
            this.setState({ notes_template: true });
          }
        }
        //this.setState({upload_image_data:response.message});
      })
      .catch((error) => {
        console.error(error);
      });
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
    this.setState({ diagnoses_template: false });
    this.setState({ assessment_template: false });
    this.setState({ notes_template: false });

    console.log(final_result + 'finall');
    if (this.state.active_template === 'diagnoses') {
      this.setState({
        diagnosis_comments: final_result
          .toString()
          .split(',')
          .join('\n')
          .toString(),
      });
    }
    if (this.state.active_template === 'assessment') {
      this.setState({
        assessment_notes: final_result
          .toString()
          .split(',')
          .join('\n')
          .toString(),
      });
    }
    if (this.state.active_template === 'doctorNotes') {
      this.setState({
        doctor_notes: final_result.toString().split(',').join('\n').toString(),
      });
    }
  };

  render() {
    if (this.state.load1) {
      return (
        <View
          style={{
            flex: 1,
            marginTop: 250,
          }}>
          <ActivityIndicator size="large" color="#f67f7d" />
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
            onBackdropPress={() => this.setState({ alertvisible4: false })}>
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
              {i18n.t('ASSESSMENT.ASSESSMENT_SAVED_SUCCESSFULLY')}
            </Text>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Button
                success
                style={{
                  height: 40,
                  marginTop: 8,
                  marginRight: 10,
                  width: 80,
                  alignSelf: 'center',
                }}
                onPress={() => this.setState({ alertvisible4: false })}>
                <Text
                  allowFontScaling={false}
                  style={{ color: 'white', marginLeft: 25 }}>
                  {i18n.t('PATIENTS.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }

    return (
      // <ScrollView>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
        <View style={{ flex: 1 }}>
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 10,
                  marginBottom: 5,
                }}>
                {i18n.t('PATIENTS.DIAG')}
              </Text>
            </Col>
            {this.state.time_tick ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.dig();
                  }}>
                  <Text
                    style={{ fontSize: 12, color: '#517fa4', marginRight: 10 }}>
                    {i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{ fontSize: 15 }}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>
          {this.state.hide7 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  value={this.state.diagnosis_comments2}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height: event.nativeEvent.contentSize.height,
                    });
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
                    this.onChangeText('diagnosis_comments2', text);
                    global.diagnosis_comments = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  value={this.state.diagnosis_comments1}
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
                    this.setState({
                      isAssessmentModified: true,
                      diagnosis_comments1: text,
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
                  value={this.state.diagnosis_comments}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height: event.nativeEvent.contentSize.height,
                    });
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
                    this.onChangeText('diagnosis_comments', text);
                    global.diagnosis_comments = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.diagnoses_template ? (
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
                  marginTop: 10,
                  marginBottom: 5,
                }}>
                {i18n.t('PATIENTS.ASSESSMENT')}
              </Text>
            </Col>
            {this.state.time_tick ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.asses();
                  }}>
                  <Text
                    style={{ fontSize: 12, color: '#517fa4', marginRight: 10 }}>
                    {i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{ fontSize: 15 }}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>
          {this.state.hide8 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.assessment_notes2}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height1: event.nativeEvent.contentSize.height,
                    });
                  }}
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
                    this.onChangeText('assessment_notes2', text);
                    global.assessment_notes = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  value={this.state.assessment_notes1}
                  multiline={true}
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
                    this.setState({
                      isAssessmentModified: true,
                      assessment_notes1: text,
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
                  value={this.state.assessment_notes}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height1: event.nativeEvent.contentSize.height,
                    });
                  }}
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
                    this.onChangeText('assessment_notes', text);
                    global.assessment_notes = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.assessment_template ? (
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
                  marginTop: 10,
                  marginBottom: 5,
                }}>
                {i18n.t('PATIENTS.DOC_NOTE')}
              </Text>
            </Col>
            {this.state.time_tick ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.doc();
                  }}>
                  <Text
                    style={{ fontSize: 12, color: '#517fa4', marginRight: 10 }}>
                    {i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{ fontSize: 15 }}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            ) : null}
          </Row>
          {this.state.hide9 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  value={this.state.doctor_notes2}
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
                    this.onChangeText('doctor_notes2', text);
                    global.doctor_notes = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  value={this.state.doctor_notes1}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height5: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height5),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      isAssessmentModified: true,
                      doctor_notes1: text,
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
                  value={this.state.doctor_notes}
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
                    this.onChangeText('doctor_notes', text);
                    global.doctor_notes = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.notes_template ? (
            <QuestionnaireForm
              {...this.state.template_api_response}
              onDataChange={this.saveTemplateResponse}></QuestionnaireForm>
          ) : null}
          <Row>
            <Col style={{ alignItems: 'center' }}>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.saveAssessment()}>
                <Text
                  allowFontScaling={false}
                  style={{ color: 'white', fontSize: 18 }}>
                  {i18n.t('PATIENTS.SAVE')}
                </Text>
              </Button>
            </Col>
          </Row>
          <FlashMessage
            position="center"
            ref={(ref) => (this.AssessmentAlert = ref)}
          />
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  consultList: state.consultList.consultList,
  isFetching: state.assessment.isFetching,
  assessmentresponse: state.assessment.assessmentresponse,
  applyList: state.applyList.applyList,
});

export default connect(mapStateToProps, {
  saveAssessementData,
  getApplyList,
  getConsultList,
})(Assesment);
