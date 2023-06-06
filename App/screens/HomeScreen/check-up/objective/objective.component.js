import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  NativeModules,
  DeviceEventEmitter,
  TouchableOpacity,
  ActivityIndicator,
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
import {connect} from 'react-redux';
import {Overlay} from 'react-native-elements';
import {saveObjectiveData} from '../../../../redux/actions/save_action';
import FlashMessage from 'react-native-flash-message';
import {getConsultList} from '../../../../redux/actions/consult_action';
import {getApplyList} from '../../../../redux/actions/tempapply_action';
import QuestionnaireForm from '../../../Questionnaire/Form';
import {saveTemplateData} from '../../../../redux/actions/save_action';
import {APP_PRIMARY_COLOR} from '../../../../themes/variable';
import getBaseUrl from '../../../../config/Config';
import i18n from '../../../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Objective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load1: false,
      obj_phy_examination: '',
      obj_phy_examination1: '',
      obj_phy_examination2: '',
      alertvisible4: false,
      hlpid: this.props.screenProps.hlpid,
      encounter_show: this.props.screenProps.enc_id,
      hide6: false,
      height: 0,
      height1: 0,
      time_tick1: false,
      time_tick2: true,
      isObjectiveModified: false,
      active_template: '',
      physical_template: false,
      template_answers: [],
    };

    let o1 = DeviceEventEmitter.addListener('setphyexam', (e) => {
      this.setState({
        isObjectiveModified: true,
        obj_phy_examination:
          this.state.obj_phy_examination != '' &&
          this.state.obj_phy_examination != undefined
            ? this.state.obj_phy_examination + ' ' + e
            : e,
      });
      // global.obj_phy_examination = this.state.obj_phy_examination != "" && this.state.obj_phy_examination != undefined ? this.state.obj_phy_examination + " " + e : e
    });
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('didBlur', () => {
      if (this.state.isObjectiveModified) {
        Alert.alert(i18n.t('OBJECTIVE.ALERT'), i18n.t('OBJECTIVE.SAVE_OBJECTIVE'), [
          {
            text: i18n.t('OBJECTIVE.NO'),
            onPress: () => {
              this.getObjectiveData();
              this.setState({isObjectiveModified: false});
            },
          },
          {
            text: i18n.t('OBJECTIVE.YES'),
            onPress: () => {
              this.saveObjective(true);
            },
          },
        ]);
      }
    });
    this.getObjectiveData();
  };
  getObjectiveData = () => {
    if (global.screen == 'dashboard') {
      if (this.props.screenProps.check_status.toLowerCase() == 'reconsulting') {
        if (
          this.props.applyList &&
          this.props.applyList.message &&
          this.props.applyList.message.objective.edit != ''
        ) {
          this.setState({
            obj_phy_examination2:
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].obj_phy_examination
                : this.props.applyList.message.objective &&
                  this.props.applyList.message.objective.edit &&
                  this.props.applyList.message.objective.edit.phy_exm &&
                  this.props.applyList.message.objective.edit.phy_exm != '' &&
                  this.props.applyList.message.objective.edit.phy_exm != null &&
                  this.props.applyList.message.objective.edit.phy_exm !=
                    undefined
                ? this.props.applyList.message.objective.edit.phy_exm
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
          });
          if (
            this.props.applyList.message.objective.edit.phy_exm != '' &&
            this.props.applyList.message.objective.edit != ''
          ) {
            this.setState({
              hide6: true,
            });
          } else {
            this.setState({
              hide6: false,
            });
          }
        }
        (this.state.time_tick1 = true),
          (this.state.time_tick2 = false),
          this.setState({
            obj_phy_examination1:
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].obj_phy_examination
                : this.props.applyList.message.objective.show.phy_exm != '' &&
                  this.props.applyList.message.objective.show.phy_exm != null &&
                  this.props.applyList.message.objective.show.phy_exm !=
                    undefined
                ? this.props.applyList.message.objective.show.phy_exm
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
          });
        global.obj_phy_examination1 =
          this.props.applyList.message.subjective instanceof Array &&
          this.props.applyList.message.subjective.length > 0
            ? this.props.applyList.message.subjective[0].obj_phy_examination
            : this.props.applyList.message.objective.show.phy_exm != '' &&
              this.props.applyList.message.objective.show.phy_exm != null &&
              this.props.applyList.message.objective.show.phy_exm != undefined
            ? this.props.applyList.message.objective.show.phy_exm
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : '';
      } else {
        (this.state.time_tick1 = false),
          (this.state.time_tick2 = true),
          this.setState({
            obj_phy_examination:
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].obj_phy_examination
                : this.props.applyList.message.objective.phy_exm != '' &&
                  this.props.applyList.message.objective.phy_exm != null &&
                  this.props.applyList.message.objective.phy_exm != undefined
                ? this.props.applyList.message.objective.phy_exm
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
          });
        global.obj_phy_examination =
          this.props.applyList.message.subjective instanceof Array &&
          this.props.applyList.message.subjective.length > 0
            ? this.props.applyList.message.subjective[0].obj_phy_examination
            : this.props.applyList.message.objective.phy_exm != '' &&
              this.props.applyList.message.objective.phy_exm != null &&
              this.props.applyList.message.objective.phy_exm != undefined
            ? this.props.applyList.message.objective.phy_exm
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
        this.props.consultList.message.objective &&
        this.props.consultList.message.objective.edit != ''
      ) {
        this.setState({
          obj_phy_examination2:
            this.props.consultList.message.subjective instanceof Array &&
            this.props.consultList.message.subjective.length > 0
              ? this.props.consultList.message.subjective[0].obj_phy_examination
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.consultList.message.objective.edit.phy_exm != null &&
                this.props.consultList.message.objective.edit.phy_exm !=
                  undefined &&
                this.props.consultList.message.objective.edit.phy_exm != ''
              ? this.props.consultList.message.objective.edit.phy_exm
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
        });
      }
      (this.state.time_tick1 = true),
        (this.state.time_tick2 = false),
        this.setState({
          obj_phy_examination1:
            this.props.consultList.message.subjective instanceof Array &&
            this.props.consultList.message.subjective.length > 0
              ? this.props.consultList.message.subjective[0].obj_phy_examination
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : this.props.consultList.message.objective.show.phy_exm != null
              ? this.props.consultList.message.objective.show.phy_exm
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
        });

      global.obj_phy_examination =
        this.props.consultList.message.subjective instanceof Array &&
        this.props.consultList.message.subjective.length > 0
          ? this.props.consultList.message.subjective[0].obj_phy_examination
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : this.props.consultList.message.objective.show.phy_exm != null
          ? this.props.consultList.message.objective.show.phy_exm
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
          : '';
      if (
        this.props.consultList.message.objective.edit.phy_exm != '' &&
        this.props.consultList.message.objective.edit != ''
      ) {
        this.setState({
          hide6: true,
        });
      } else {
        this.setState({
          hide6: false,
        });
      }
    }
  };

  phy() {
    if (this.state.hide6 == false) {
      this.setState({
        hide6: true,
      });
    } else if (this.state.hide6 == true) {
      this.setState({
        hide6: false,
      });
    }
  }
  componentWillUnmount = () => {
    if (this._unsubscribe && typeof this._unsubscribe == 'function') {
      this._unsubscribe();
    }
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

  onChangeText = (key, value) => {
    this.setState({
      isObjectiveModified: true,
      [key]: value,
    });
  };

  saveObjective = async (isCheckupAlert) => {
    this.setState({load1: true});
    let obj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      physical:
        global.screen == 'dashboard'
          ? this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
            ? this.state.obj_phy_examination2
            : this.state.obj_phy_examination
          : this.state.obj_phy_examination2,
      enc_id: this.state.encounter_show,
      hlpid: this.state.hlpid,
    });
    await this.props.saveObjectiveData(obj);
    let ob = this.props.objectiveresponse;
    console.log('ob',ob,ob.message)
    if (ob.message ==  'Objective saved Successfully'){
      console.log('message',ob.message)
      // this.updateList();
      this.setState({isObjectiveModified: false, load1: false});
      if (this.ObjectiveAlert && this.ObjectiveAlert.showMessage) {
        if (isCheckupAlert) {
          this.props.screenProps.showCheckupAlert({
            message: i18n.t('PATIENTS.SUB_SUCC'),
            description:i18n.t('PATIENTS.OBJ_TXT') ,
            type: 'success',
            icon: 'auto',
          });
        } else {
          this.ObjectiveAlert.showMessage({
            message: i18n.t('PATIENTS.OBJ_SUCC_TXT'),
           // description:i18n.t('PATIENTS.OBJ_TXT') ,
            type: 'success',
            icon: 'auto',
          });
        }
      }
    }
    // alert(ob.message)
  };

  openTemplate = async (data) => {
    this.state.active_template = data;
    this.setState({physical_template: false});
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
          alert(i18n.t('OBJECTIVE.NO_TEMPLATE_FOUND'));
        } else {
          console.log('else');
          this.state.template_api_response = response.message;
          console.log(this.state.template_api_response);
          if (data === 'physicalExamination') {
            this.setState({physical_template: true});
          }
        }
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
    this.setState({physical_template: false});

    console.log(final_result + 'finall');
    if (this.state.active_template === 'physicalExamination') {
      this.setState({
        obj_phy_examination: final_result
          .toString()
          .split(',')
          .join('\n')
          .toString(),
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
              {i18n.t('PATIENTS.OBJ_SUCC_TXT')}
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
      <ScrollView>
        <View style={{flex: 1}}>
          {/* <Text allowFontScaling={false}> Objective </Text> */}
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
                {i18n.t('PATIENTS.PHYSICAL')}
              </Text>
            </Col>
            {this.state.time_tick1 ? (
              <Col>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.phy();
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
          {this.state.hide6 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  value={this.state.obj_phy_examination2}
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
                    this.onChangeText('obj_phy_examination2', text);
                    global.obj_phy_examination = text;
                    // this.setState({obj_phy_examination2:text+" "+this.state.obj_phy_examination1})
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick1 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  // editable={false}
                  value={this.state.obj_phy_examination1}
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
                    // this.onChangeText("obj_phy_examination",text);
                    // global.obj_phy_examination=text
                    this.setState({
                      isObjectiveModified: true,
                      obj_phy_examination1: text,
                    });
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick2 ? (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  value={this.state.obj_phy_examination}
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
                    this.onChangeText('obj_phy_examination', text);
                    global.obj_phy_examination = text;
                  }}
                />
              </Col>
            </Row>
          ) : null}
          {this.state.physical_template ? (
            <QuestionnaireForm
              {...this.state.template_api_response}
              onDataChange={this.saveTemplateResponse}></QuestionnaireForm>
          ) : null}
          <Row>
            <Col>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.saveObjective()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('COMMON.SAVE')}
                </Text>
              </Button>
            </Col>
          </Row>
          <FlashMessage
            position="center"
            ref={(ref) => (this.ObjectiveAlert = ref)}
          />
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => ({
  consultList: state.consultList.consultList,
  isFetching: state.objective.isFetching,
  objectiveresponse: state.objective.objectiveresponse,
  applyList: state.applyList.applyList,
  template_response: state.insight_template.template_response,
});

export default connect(mapStateToProps, {
  saveObjectiveData,
  getConsultList,
  getApplyList,
  saveTemplateData,
})(Objective);
