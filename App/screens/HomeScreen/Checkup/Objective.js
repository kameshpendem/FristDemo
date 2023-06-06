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
import {saveObjectiveData} from '../../../redux/actions/save_action';
import FlashMessage from 'react-native-flash-message';
import {getConsultList} from '../../../redux/actions/consult_action';
import {getApplyList} from '../../../redux/actions/tempapply_action';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import {Picker} from '@react-native-picker/picker';

var SpiroReact = NativeModules.SpiroReact;
class Objective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load1: false,
      obj_phy_examination: '',
      obj_phy_examination1: '',
      obj_phy_examination2: '',
      alertvisible4: false,
      hlpid: this.props.myprops.hlpid,
      encounter_show: this.props.myprops.enc_id,
      hide6: false,
      height: 0,
      height1: 0,
      time_tick1: false,
      time_tick2: true,
    };

    let o1 = DeviceEventEmitter.addListener('setphyexam', (e) => {
      this.setState({
        obj_phy_examination:
          this.state.obj_phy_examination != '' &&
          this.state.obj_phy_examination != undefined
            ? this.state.obj_phy_examination + ' ' + e
            : e,
      });
      global.obj_phy_examination =
        this.state.obj_phy_examination != '' &&
        this.state.obj_phy_examination != undefined
          ? this.state.obj_phy_examination + ' ' + e
          : e;
    });
  }

  componentDidMount = () => {
    // console.log("res="+this.props.applyList.message.objective.phy_exm)
    // alert(this.props.myprops.check_status)
    if (global.screen == 'dashboard') {
      if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
        if (this.props.applyList.message.objective.edit != []) {
          this.setState({
            obj_phy_examination2:
              this.props.applyList.message.subjective instanceof Array &&
              this.props.applyList.message.subjective.length > 0
                ? this.props.applyList.message.subjective[0].obj_phy_examination
                : this.props.applyList.message.objective.edit.phy_exm != '' &&
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
          //
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
        // alert(JSON.stringify(this.props.applyList.message.objective.edit))

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

      // console.log(this.props.applyList.message.subjective instanceof Array&&this.props.applyList.message.subjective.length>0? this.props.applyList.message.subjective[0].obj_phy_examination:this.props.applyList.message.objective.phy_exm)
    } else if (global.screen == 'timelene') {
      if (this.props.consultList.message.objective.edit != []) {
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
          // this.props.consultList.message.subjective instanceof Array&&
          // this.props.consultList.message.subjective.length>0?
          // this.props.consultList.message.subjective[0].obj_phy_examination
          // :
          // this.props.consultList.message.objective.phy_exm!=""&&this.props.consultList.message.objective.phy_exm!=null&&this.props.consultList.message.objective.phy_exm!=undefined
          // ?this.props.consultList.message.objective.phy_exm.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",
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
      // this.props.consultList.message.subjective instanceof Array&&
      // this.props.consultList.message.subjective.length>0?
      // this.props.consultList.message.subjective[0].obj_phy_examination
      // :
      // this.props.consultList.message.objective.phy_exm!=""&&this.props.consultList.message.objective.phy_exm!=null&&this.props.consultList.message.objective.phy_exm!=undefined
      // ?this.props.consultList.message.objective.phy_exm.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):""
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
    // this.setState({
    //   obj_phy_examination:this.props.consultList.message.subjective instanceof Array? this.props.consultList.message.subjective[0].obj_phy_examination:this.props.consultList.message.objective.phy_exm,
    //   hlpid:this.props.consultList.message.subjective instanceof Array? this.props.consultList.message.subjective[0].hlpid:this.props.consultList.message.objective.hlpid,
    //   encounter_show:this.props.consultList.message.subjective instanceof Array? this.props.consultList.message.subjective[0].encounterCode:this.props.consultList.message.objective.encounter_show
    // })
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
    //o1.remove()
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
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    this.props.myprops.screen == 'dashboard'
      ? await this.props.getApplyList(myobj)
      : this.props.myprops.screen == 'timelene'
      ? await this.props.getConsultList(myobj2)
      : null;
  };

  onChangeText = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  _startRecognizing = async (text) => {
    SpiroReact.speechToTextData(text);
  };
  saveObjective = async () => {
    this.setState({load1: true});
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      physical: global.obj_phy_examination ? global.obj_phy_examination : '',
      enc_id: this.state.encounter_show,
      hlpid: this.state.hlpid,
    });
    await this.props.saveObjectiveData(obj);
    let ob = this.props.objectiveresponse;
    if (ob.message == 'Objective saved Successfully') {
      this.updateList();
      this.setState({load1: false});
      this.ObjectiveAlert.showMessage({
        message: 'Success!',
        description: 'Objective saved ',
        type: 'success',
        icon: 'auto',
      });
    }
    // alert(ob.message)
  };
  render() {
    if (this.state.load1) {
      return (
        <View
          style={{
            flex: 1,
            marginTop: 250,
            // justifyContent: 'center',
            // alignItems: 'center' this.props.myprops.check
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
              testID="objectiveSavedSuccessfullyText"
              accessibilityLabel="objectiveSavedSuccessfullyText">
              Objective Saved Successfully
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
              testID="backButton"
              accessibilityLabel="backButton"
                success
                style={{height: 40, marginTop: 8, marginRight: 10, width: 80}}
                onPress={() => this.setState({alertvisible4: false})}>
                <Text
                testID="backText"
                accessibilityLabel="backText"
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
          {/* <Text allowFontScaling={false}> Objective </Text> */}
          <Row>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 20,
                  marginBottom: 10,
                }}
                testID="physicalExaminationText"
                accessibilityLabel="physicalExaminationText">
                Physical Examination
              </Text>
            </Col>
            {this.state.time_tick1 ? (
              <Col>
                <TouchableOpacity
                 testID="commentTouch"
                 accessibilityLabel="commentTouch"
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
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}
                    testID="commentText"
                    accessibilityLabel="commentText">
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
          {this.state.hide6 ? (
            <Row>
              <Col>
                <TextInput
                testID="commentTextInput"
                accessibilityLabel="commentTextInput"
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.obj_phy_examination2}
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
                    this.onChangeText('obj_phy_examination2', text);
                    global.obj_phy_examination = text;
                    // this.setState({obj_phy_examination2:text+" "+this.state.obj_phy_examination1})
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("phyexam");SpiroReact.getVoiceValue('physical')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          {this.state.time_tick1 ? (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                testID="commentTextInput"
                accessibilityLabel="commentTextInput"
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
                    this.setState({obj_phy_examination1: text});
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("phyexam");SpiroReact.getVoiceValue('physical')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}

          {/* // {this.state.hide6?<Row style={{marginHorizontal:10,marginBoteditable={false}tom:20}}>
// <Col>
// <Text allowFontScaling={false}>{this.state.obj_phy_examination}</Text>
// </Col>
// </Row>:null} */}

          {this.state.time_tick2 ? (
            <Row>
              <Col>
                <TextInput
                testID="commentTextInput"
                accessibilityLabel="commentTextInput"
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.obj_phy_examination}
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
                    this.onChangeText('obj_phy_examination', text);
                    global.obj_phy_examination = text;
                  }}
                />
                {/* <TouchableOpacity onPress={()=>{this._startRecognizing("phyexam");SpiroReact.getVoiceValue('physical')}} style={{marginRight:30,marginTop:10,alignSelf: 'flex-end',marginTop:-30}}><Icon type="FontAwesome" name="microphone" style={{fontSize:25}} /></TouchableOpacity> */}
              </Col>
            </Row>
          ) : null}
          <Row>
            <Col>
              <Button
              testID="saveButton"
              accessibilityLabel="saveButton"
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
                  style={{color: 'white', fontSize: 18}}
                  testID="saveText"
                  accessibilityLabel="saveText">
                  Save
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
});

export default connect(mapStateToProps, {
  saveObjectiveData,
  getConsultList,
  getApplyList,
})(Objective);
