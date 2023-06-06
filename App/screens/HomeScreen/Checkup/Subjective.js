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
import {saveSubjectiveData} from '../../../redux/actions/save_action';
import {saveObjectiveData} from '../../../redux/actions/save_action';
import {getConsultList} from '../../../redux/actions/consult_action';
import {getApplyList} from '../../../redux/actions/tempapply_action';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
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
      hlpid: this.props.myprops.hlpid,
      encounter_show: this.props.myprops.enc_id,
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
    };

    let o1 = DeviceEventEmitter.addListener('setchief', (e) => {
      this.setState({
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
  saveSubjective = async () => {
    this.setState({load1: true});
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      cheif_comp_comments: global.chief_complaints
        ? global.chief_complaints
        : '',
      symptoms_comments: global.symptoms_comments
        ? global.symptoms_comments
        : '',
      present_ill_text: global.history_present_ill
        ? global.history_present_ill
        : '',
      past_medical_text: global.history_past_medical
        ? global.history_past_medical
        : '',
      family_social_text: global.history_family_social
        ? global.history_family_social
        : '',
      encounter_show: this.state.encounter_show,
      hlpid: this.state.hlpid,
    });

    //alert(obj)
    await this.props.saveSubjectiveData(obj);
    let ob = this.props.subjectiveresponse;
    if (ob.message == 'Subjective saved Successfully') {
      this.updateList();
      this.setState({load1: false, pagevalue: -1});
      this.SubjectiveAlert.showMessage({
        message: 'Success!',
        description: 'Subjective saved ',
        type: 'success',
        icon: 'auto',
      });
    }
    // alert(ob.message)
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
  //componentDidUpdate=(nextProps)=>{
  // console.log("from="+this.props.myprops.frompage+" nextpage="+this.state.pagevalue)
  //  if(this.props.myprops.currentpage!=this.state.pagevalue&&this.state.pagevalue!=undefined)
  //  this.saveSubjective();
  //}

  // componentWillUnmount=()=>{
  // // alert("from2="+this.props.myprops.frompage+" nextpage2="+this.state.pagevalue)
  // }
  componentDidMount = () => {
    //alert(JSON.stringify(this.props.applyList.message.subjective))

    if (global.screen == 'dashboard') {
      if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
        if (this.props.applyList.message.subjective.edit != '') {
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
            ? this.props.myprops.chief
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
            ? this.props.myprops.chief
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
            ? this.props.myprops.chief
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
            ? this.props.myprops.chief
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
      if (this.props.consultList.message.subjective.edit != '') {
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

      // this.state.chief_complaints=this.props.consultList.message.subjective instanceof Array&&this.props.consultList.message.subjective.length>0? this.props.consultList.message.subjective[0].cheif_complaints.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):
      (this.state.chief_complaints =
        this.props.consultList.message.subjective.show.cheif_complaints ==
        undefined
          ? this.props.myprops.chief
          : this.props.consultList.message.subjective.show.cheif_complaints
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')),
        // this.props.consultList.message.subjective instanceof Array&&
        // this.props.consultList.message.subjective.length>0?
        //  this.props.consultList.message.subjective[0].cheif_complaints.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
        //  :
        //  this.props.consultList.message.subjective.cheif_complaints==""||this.props.consultList.message.subjective.cheif_complaints==undefined||this.props.consultList.message.subjective.cheif_complaints==null
        //  ?
        //  this.props.myprops.chief
        //  :
        //  this.props.consultList.message.subjective.cheif_complaints.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
        (this.state.time_tick3 = true),
        (this.state.time1 = false),
        (this.state.time2 = false),
        (this.state.time3 = false),
        (this.state.time4 = false),
        // chief_complaints:this.props.consultList.message.subjective instanceof Array? this.props.consultList.message.subjective[0].cheif_complaints:this.props.consultList.message.subjective.cheif_complaints,
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
          // syptoms_comments1:
          // this.props.consultList.message.subjective instanceof Array&&
          // this.props.consultList.message.subjective.length>0?
          // this.props.consultList.message.subjective[0].symptoms_comments.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          // :
          // this.props.consultList.message.subjective.syptoms_comments!=""&&this.props.consultList.message.subjective.syptoms_comments!=null&&this.props.consultList.message.subjective.syptoms_comments!=undefined?
          // this.props.consultList.message.subjective.syptoms_comments.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"" ,
          // history_present_ill1:
          // this.props.consultList.message.subjective instanceof Array&&
          // this.props.consultList.message.subjective.length>0?
          // this.props.consultList.message.subjective[0].history_present_ill
          // :
          // this.props.consultList.message.subjective.history_present_ill!=""&&this.props.consultList.message.subjective.history_present_ill!=null&&this.props.consultList.message.subjective.history_present_ill!=undefined?
          // this.props.consultList.message.subjective.history_present_ill.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",
          // history_past_medical1:
          // this.props.consultList.message.subjective instanceof Array&&
          // this.props.consultList.message.subjective.length>0?
          // this.props.consultList.message.subjective[0].history_past_medical
          // :
          // this.props.consultList.message.subjective.history_past_medical!=""&&this.props.consultList.message.subjective.history_past_medical!=null&&this.props.consultList.message.subjective.history_past_medical!=undefined?
          // this.props.consultList.message.subjective.history_past_medical.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",
          // history_family_social1:
          // this.props.consultList.message.subjective instanceof Array&&
          // this.props.consultList.message.subjective.length>0?
          //  this.props.consultList.message.subjective[0].history_family_social
          //  :
          //  this.props.consultList.message.subjective.history_family_social!=""&&this.props.consultList.message.subjective.history_family_social!=null&&this.props.consultList.message.subjective.history_family_social!=undefined?
          //  this.props.consultList.message.subjective.history_family_social.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",
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
          ? this.props.myprops.chief
          : this.props.consultList.message.subjective.show.cheif_complaints
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');
      // this.props.consultList.message.subjective instanceof Array&&
      // this.props.consultList.message.subjective.length>0?
      //  this.props.consultList.message.subjective[0].cheif_complaints.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
      //  :
      //  this.props.consultList.message.subjective.cheif_complaints==""||this.props.consultList.message.subjective.cheif_complaints==undefined||this.props.consultList.message.subjective.cheif_complaints==null
      //  ?
      //  this.props.myprops.chief
      //  :
      //  this.props.consultList.message.subjective.cheif_complaints.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')

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
      // this.props.consultList.message.subjective instanceof Array&&
      // this.props.consultList.message.subjective.length>0?
      // this.props.consultList.message.subjective[0].symptoms_comments.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
      // :
      // this.props.consultList.message.subjective.syptoms_comments!=""&&this.props.consultList.message.subjective.syptoms_comments!=null&&this.props.consultList.message.subjective.syptoms_comments!=undefined?
      // this.props.consultList.message.subjective.syptoms_comments.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):""
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
      // this.props.consultList.message.subjective instanceof Array&&
      // this.props.consultList.message.subjective.length>0?
      // this.props.consultList.message.subjective[0].history_present_ill
      // :
      // this.props.consultList.message.subjective.history_present_ill!=""&&this.props.consultList.message.subjective.history_present_ill!=null&&this.props.consultList.message.subjective.history_present_ill!=undefined?
      // this.props.consultList.message.subjective.history_present_ill.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):""
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
      // this.props.consultList.message.subjective instanceof Array&&
      // this.props.consultList.message.subjective.length>0?
      // this.props.consultList.message.subjective[0].history_past_medical
      // :
      // this.props.consultList.message.subjective.history_past_medical!=""&&this.props.consultList.message.subjective.history_past_medical!=null&&this.props.consultList.message.subjective.history_past_medical!=undefined?
      // this.props.consultList.message.subjective.history_past_medical.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):""
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
      // this.props.consultList.message.subjective instanceof Array&&
      // this.props.consultList.message.subjective.length>0?
      //  this.props.consultList.message.subjective[0].history_family_social
      //  :
      //  this.props.consultList.message.subjective.history_family_social!=""&&this.props.consultList.message.subjective.history_family_social!=null&&this.props.consultList.message.subjective.history_family_social!=undefined?
      //  this.props.consultList.message.subjective.history_family_social.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):""
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
  // getData=async()=>{
  //   if(global.screen=="dashboard"){
  //     await this.props.getApplyList({
  //       "docid":global.doctor_id,
  //       "token":global.token,
  //       "consulting":"consulting",
  //       "hlpid":this.props.navigation.state.params.hlpid,
  //       "enc":this.props.navigation.state.params.enc_id,
  //       "chief":this.props.navigation.state.params.chief,
  //       "uid":this.props.navigation.state.params.uid,
  //       "enc":this.props.navigation.state.params.enc_id,
  //       "template_id":this.props.navigation.state.params.template_id,
  //       "template_name":this.props.navigation.state.params.template_name,
  //       "app_type":this.props.navigation.state.params.app_type,
  //       "username":this.props.navigation.state.params.patientname,
  //       "custom_field0":""
  //     })

  // await this.setState({
  //   chief_complaints:this.props.applyList.message.subjective instanceof Array&&this.props.applyList.message.subjective.length>0? this.props.applyList.message.subjective[0].cheif_complaints:this.props.applyList.message.subjective.cheif_complaints==undefined?this.props.myprops.chief:this.props.applyList.message.subjective.cheif_complaints,
  //   syptoms_comments:this.props.applyList.message.subjective instanceof Array&&this.props.applyList.message.subjective.length>0? this.props.applyList.message.subjective[0].symptoms_comments:this.props.applyList.message.subjective.syptoms_comments,
  //   time_tick3:false,
  //     history_present_ill:this.props.applyList.message.subjective instanceof Array&&this.props.applyList.message.subjective.length>0? this.props.applyList.message.subjective[0].history_present_ill:this.props.applyList.message.subjective.history_present_ill,
  //     history_past_medical:this.props.applyList.message.subjective instanceof Array&&this.props.applyList.message.subjective.length>0? this.props.applyList.message.subjective[0].history_past_medical:this.props.applyList.message.subjective.history_past_medical,
  //     history_family_social:this.props.applyList.message.subjective instanceof Array&&this.props.applyList.message.subjective.length>0? this.props.applyList.message.subjective[0].history_family_social:this.props.applyList.message.subjective.history_family_social,
  //   })
  //    //
  //   }else if(global.screen=="timelene"){
  //     await this.props.getConsultList({
  //       // "uid":this.state.plist,
  //       "hlpid":this.props.navigation.state.params.hlpid,
  //       "enc":this.props.navigation.state.params.enc_id,
  //       "docid":global.doctor_id,
  //       "token":global.token
  //   })
  //   await this.setState({
  //     chief_complaints:this.props.consultList.message.subjective instanceof Array&&this.props.consultList.message.subjective.length>0? this.props.consultList.message.subjective[0].cheif_complaints:this.props.consultList.message.subjective.cheif_complaints==undefined?this.props.myprops.chief:this.props.consultList.message.subjective.cheif_complaints,
  //     time_tick3:true,
  //     // chief_complaints:this.props.consultList.message.subjective instanceof Array? this.props.consultList.message.subjective[0].cheif_complaints:this.props.consultList.message.subjective.cheif_complaints,
  //     syptoms_comments:this.props.consultList.message.subjective instanceof Array&&this.props.consultList.message.subjective.length>0? this.props.consultList.message.subjective[0].symptoms_comments:this.props.consultList.message.subjective.syptoms_comments,
  //     history_present_ill:this.props.consultList.message.subjective instanceof Array&&this.props.consultList.message.subjective.length>0? this.props.consultList.message.subjective[0].history_present_ill:this.props.consultList.message.subjective.history_present_ill,
  //     history_past_medical:this.props.consultList.message.subjective instanceof Array&&this.props.consultList.message.subjective.length>0? this.props.consultList.message.subjective[0].history_past_medical:this.props.consultList.message.subjective.history_past_medical,
  //     history_family_social:this.props.consultList.message.subjective instanceof Array&&this.props.consultList.message.subjective.length>0? this.props.consultList.message.subjective[0].history_family_social:this.props.consultList.message.subjective.history_family_social,
  //     })
  //   }
  // }
  _startRecognizing = async (text) => {
    SpiroReact.speechToTextData(text);
  };
  onChangeText = (key, value) => {
    this.setState({
      [key]: value,
    });
  };
  getChiefComplaints = (Complaints) => {
    return <HTMLView value={Complaints} />;
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
              Subjective Saved Successfully
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{height: 40, marginTop: 8, marginRight: 10, width: 80}}
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
                  marginTop: 5,
                  marginBottom: 10,
                }}>
                Chief Complaints
              </Text>
            </Col>
            {/* // {this.state.time_tick3? <Col>
// <TouchableOpacity style={{marginTop:5,alignSelf: 'flex-end',marginRight:10}} onPress={()=>{this.cheif()}}><Text style={{fontSize:12,color:"#517fa4",marginRight:10}}>Comment <Icon type="FontAwesome" name="caret-down" style={{fontSize:15}} /></Text></TouchableOpacity>
// </Col>:null} */}
          </Row>
          {this.state.hide1 ? (
            <Row style={{marginHorizontal: 10, marginBottom: 20}}>
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
                // placeholder="Type something"
                value={this.state.chief_complaints}
                multiline={true}
                // numberOfLines={5}
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
              />
              {/* <TouchableOpacity onPress={()=>{this._startRecognizing("chief");SpiroReact.getVoiceValue('chief')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
            </Col>
          </Row>

          <Row style={{marginTop: 10}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                Symptoms
              </Text>
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.sym();
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
          {/* // {this.state.hide2?<Row style={{marginHorizontal:10,marginBottom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.syptoms_comments}</Text>
// </Col>
// </Row>:null} */}
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
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("sym");SpiroReact.getVoiceValue('symptoms')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
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
                  // editable={false}
                  // numberOfLines={5}
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
                    // this.onChangeText("syptoms_comments",text)
                    this.setState({
                      symptoms_comments1: text,
                    });
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("sym");SpiroReact.getVoiceValue('symptoms')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
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
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("sym");SpiroReact.getVoiceValue('symptoms')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{marginLeft: 10, fontWeight: 'bold', marginTop: 15}}>
                History
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
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: 12,
                }}>
                Present Illness History
              </Text>
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.present();
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
          {/* // {this.state.hide3?<Row style={{marginHorizontal:10,marginBottom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.history_present_ill}</Text>
// </Col>
// </Row>:null} */}
          {this.state.hide3 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_present_ill2}
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
                    this.onChangeText('history_present_ill2', text);
                    global.history_present_ill = text;
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("preill");SpiroReact.getVoiceValue('present')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick3 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_present_ill1}
                  multiline={true}
                  // editable={false}
                  // numberOfLines={5}
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
                    //   this.onChangeText("history_present_ill",text)
                    // global.history_present_ill=text
                    this.setState({
                      history_present_ill1: text,
                    });
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("preill");SpiroReact.getVoiceValue('present')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
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
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("preill");SpiroReact.getVoiceValue('present')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          <Row style={{marginTop: 20}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: 12,
                }}>
                Past Illness History
              </Text>
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.past();
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
          {/* // {this.state.hide4?<Row style={{marginHorizontal:10,marginBottom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.history_past_medical}</Text>
// </Col>
// </Row>:null} */}
          {this.state.hide4 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_past_medical2}
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
                    this.onChangeText('history_past_medical2', text);
                    global.history_past_medical = text;
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("pastill");SpiroReact.getVoiceValue('past')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick3 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.history_past_medical1}
                  multiline={true}
                  // editable={false}
                  // numberOfLines={5}
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
                    //   this.onChangeText("history_past_medical",text)
                    // global.history_past_medical=text
                    this.setState({
                      history_past_medical1: text,
                    });
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("pastill");SpiroReact.getVoiceValue('past')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
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
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("pastill");SpiroReact.getVoiceValue('past')}} style={{marginRight:30,marginTop:20,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
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
                  marginTop: 5,
                  fontSize: 12,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                Family Illness History
              </Text>
            </Col>
            {this.state.time_tick3 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.family();
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
          {/* // {this.state.hide5?<Row style={{marginHorizontal:10,marginBottom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.history_family_social}</Text>
// </Col>
// </Row>:null} */}
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
                  Save
                </Text>
              </Button>
            </Col>
          </Row>
          <FlashMessage
            position="center"
            ref={(ref) => (this.SubjectiveAlert = ref)}
          />
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => ({
  consultList: state.consultList.consultList,
  applyList: state.applyList.applyList,
  isFetching: state.subjective.isFetching,
  subjectiveresponse: state.subjective.subjectiveresponse,
});

export default connect(mapStateToProps, {
  saveSubjectiveData,
  saveObjectiveData,
  getApplyList,
  getConsultList,
})(Subjective);
