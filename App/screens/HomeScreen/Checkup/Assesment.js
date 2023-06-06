import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  NativeModules,
  DeviceEventEmitter,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
var SpiroReact = NativeModules.SpiroReact;
import {saveAssessementData} from '../../../redux/actions/save_action';
import FlashMessage from 'react-native-flash-message';
import {getConsultList} from '../../../redux/actions/consult_action';
import {getApplyList} from '../../../redux/actions/tempapply_action';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
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
      hlpid: this.props.myprops.hlpid,
      encounter_show: this.props.myprops.enc_id,
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
    };

    let o1 = DeviceEventEmitter.addListener('setdiag', (e) => {
      this.setState({
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
    if (global.screen == 'dashboard') {
      if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
        if (this.props.applyList.message.assessment.edit != []) {
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
      if (this.props.consultList.message.assessment.edit != []) {
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
          // assessment_notes1:" ",
          // this.props.consultList.message.assessment instanceof Array &&
          // this.props.consultList.message.assessment.length>0?
          //  this.props.consultList.message.assessment[0].assessment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          //  :
          //  this.props.consultList.message.assessment.assessment_notes!=""&&this.props.consultList.message.assessment.assessment_notes!=null&&this.props.consultList.message.assessment.assessment_notes!=undefined?
          //  this.props.consultList.message.assessment.assessment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",

          // diagnosis_comments1:" ",
          // this.props.consultList.message.diagnosis instanceof Array &&
          // this.props.consultList.message.assessment.length>0?
          //  this.props.consultList.message.diagnosis[0].notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          //  :
          //  this.props.consultList.message.assessment.comments!=""&&this.props.consultList.message.assessment.comments!=null&&this.props.consultList.message.assessment.comments!=undefined?
          //  this.props.consultList.message.assessment.comments.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",

          // doctor_notes1:" ",
          // this.props.consultList.message.assessment instanceof Array &&
          // this.props.consultList.message.assessment.length>0?
          // this.props.consultList.message.assessment[0].doctor_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          // :
          // this.props.consultList.message.assessment.doctor_notes!=""&&this.props.consultList.message.assessment.doctor_notes!=null&&this.props.consultList.message.assessment.doctor_notes!=undefined?
          // this.props.consultList.message.assessment.doctor_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",
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
      // this.props.consultList.message.assessment instanceof Array &&
      // this.props.consultList.message.assessment.length>0?
      //  this.props.consultList.message.assessment[0].assessment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
      //  :
      //  this.props.consultList.message.assessment.assessment_notes!=""&&this.props.consultList.message.assessment.assessment_notes!=null&&this.props.consultList.message.assessment.assessment_notes!=undefined?
      //  this.props.consultList.message.assessment.assessment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"";

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
      //  this.props.consultList.message.diagnosis instanceof Array &&
      // this.props.consultList.message.assessment.length>0?
      //  this.props.consultList.message.diagnosis[0].notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
      //  :
      //  this.props.consultList.message.assessment.comments!=""&&this.props.consultList.message.assessment.comments!=null&&this.props.consultList.message.assessment.comments!=undefined?
      //  this.props.consultList.message.assessment.comments.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"";

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
      // this.props.consultList.message.assessment instanceof Array &&
      //  this.props.consultList.message.assessment.length>0?
      //  this.props.consultList.message.assessment[0].doctor_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
      //  :
      //  this.props.consultList.message.assessment.doctor_notes!=""&&this.props.consultList.message.assessment.doctor_notes!=null&&this.props.consultList.message.assessment.doctor_notes!=undefined?
      //  this.props.consultList.message.assessment.doctor_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):""

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
  onChangeText = (key, value) => {
    this.setState({
      [key]: value,
    });
  };
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

  _startRecognizing = async (text) => {
    SpiroReact.speechToTextData(text);
  };
  saveAssessment = async () => {
    this.setState({load1: true});
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      diag_comm: global.diagnosis_comments ? global.diagnosis_comments : '',
      assm_notes: global.assessment_notes ? global.assessment_notes : '',
      doc_notes: global.doctor_notes ? global.doctor_notes : '',
      hlpid: this.props.myprops.hlpid,
      enc_id: this.props.myprops.enc_id,
      hlpid: this.state.hlpid,
    });
    // alert(obj)
    await this.props.saveAssessementData(obj);
    let ob = this.props.assessmentresponse;
    if (ob.message == 'Assesment Saved Successfully') {
      this.updateList();
      this.setState({load1: false});
      this.AssessmentAlert.showMessage({
        message: 'Success!',
        description: 'Assessment Saved ',
        type: 'success',
        icon: 'auto',
      });
    }
    // alert(ob.message)
    //}
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
              Assessment Saved Successfully
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{
                  height: 40,
                  marginTop: 8,
                  marginRight: 10,
                  width: 80,
                  alignSelf: 'center',
                }}
                onPress={() => this.setState({alertvisible4: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  Back
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }

    return (
      <ScrollView>
        <View style={{flex: 1}}>
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                Diagnoses
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
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    Comment{' '}
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
          {/* // {this.state.hide7?<Row style={{marginHorizontal:10,marginBottom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.diagnosis_comments}</Text>
// </Col>
// </Row>:null} */}
          {this.state.hide7 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.diagnosis_comments2}
                  multiline={true}
                  // numberOfLines={5}
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
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("diag");SpiroReact.getVoiceValue('diagnosis')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.diagnosis_comments1}
                  multiline={true}
                  // numberOfLines={5}
                  // editable={false}
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
                    //   this.onChangeText("diagnosis_comments",text)
                    // global.diagnosis_comments=text
                    this.setState({
                      diagnosis_comments1: text,
                    });
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("diag");SpiroReact.getVoiceValue('diagnosis')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time1 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.diagnosis_comments}
                  multiline={true}
                  // numberOfLines={5}
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
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("diag");SpiroReact.getVoiceValue('diagnosis')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                Assessment Notes
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
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    Comment{' '}
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
          {/* // {this.state.hide8?<Row style={{marginHorizontal:10,marginBottom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.assessment_notes}</Text>
// </Col>
// </Row>:null} */}
          {this.state.hide8 ? (
            <Row>
              <Col>
                {/* <Text allowFontScaling={false}
// placeholder="Type something"
value={this.state.assessment_notes2}
multiline={true}
// numberOfLines={5}
onContentSizeChange={(event) => {
this.setState({ height1: event.nativeEvent.contentSize.height })
}}
style={{ height:200, textAlignVertical: 'top',height: Math.max(35, this.state.height1), borderColor:'#345D7E', borderWidth: 1,
borderWidth: 1,marginHorizontal:10}}
onChangeText={(text)=>{this.onChangeText("assessment_notes2",text)
global.assessment_notes=text+" "+this.state.assessment_notes1
}}
/> */}
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
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("assmnotes");SpiroReact.getVoiceValue('assessment')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.assessment_notes1}
                  multiline={true}
                  // numberOfLines={5}
                  // editable={false}
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
                    //   this.onChangeText("assessment_notes",text)
                    // global.assessment_notes=text
                    this.setState({
                      assessment_notes1: text,
                    });
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("assmnotes");SpiroReact.getVoiceValue('assessment')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time2 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.assessment_notes}
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
                    this.onChangeText('assessment_notes', text);
                    global.assessment_notes = text;
                  }}
                />
                {/* <Text allowFontScaling={false}Input
// placeholder="Type something"
value={this.state.assessment_notes}
multiline={true}
// numberOfLines={5}
onContentSizeChange={(event) => {
this.setState({ height1: event.nativeEvent.contentSize.height })
}}
style={{ height:200, textAlignVertical: 'top',height: Math.max(35, this.state.height1), borderColor:'#345D7E', borderWidth: 1,
borderWidth: 1,marginHorizontal:10}}
onChangeText={(text)=>{this.onChangeText("assessment_notes",text)
global.assessment_notes=text
}}
/> */}
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("assmnotes");SpiroReact.getVoiceValue('assessment')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                Doctor Notes
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
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    Comment{' '}
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
          {/* // {this.state.hide9?<Row style={{marginHorizontal:10,marginBottom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.doctor_notes}</Text>
// </Col>
// </Row>:null} */}
          {this.state.hide9 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.doctor_notes2}
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
                    this.onChangeText('doctor_notes2', text);
                    global.doctor_notes = text;
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("docnotes");SpiroReact.getVoiceValue('doctor')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.doctor_notes1}
                  multiline={true}
                  // numberOfLines={5}
                  // editable={false}
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
                    // this.onChangeText("doctor_notes",text)
                    // global.doctor_notes=text
                    this.setState({
                      doctor_notes1: text,
                    });
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("docnotes");SpiroReact.getVoiceValue('doctor')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time3 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.doctor_notes}
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
                    this.onChangeText('doctor_notes', text);
                    global.doctor_notes = text;
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("docnotes");SpiroReact.getVoiceValue('doctor')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col style={{alignItems: 'center'}}>
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
                  style={{color: 'white', fontSize: 18}}>
                  Save
                </Text>
              </Button>
            </Col>
          </Row>
          <FlashMessage
            position="center"
            ref={(ref) => (this.AssessmentAlert = ref)}
          />
        </View>
      </ScrollView>
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
