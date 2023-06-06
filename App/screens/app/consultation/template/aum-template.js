import React, { Component } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  DeviceEventEmitter,
  KeyboardAvoidingView,Keyboard
} from "react-native";
import {
  Divider,
  BottomSheet,
  ListItem,
  Button,
  Text
} from "react-native-elements";
import SimpleHeader from "../../common/SimpleHeader";
import proxy from "./service/service";
import SingleChoice from "./controls/aum-singlechoice";
import QuestionAnswer from "./controls/aum-qa";
import YesNo from "./controls/aum-yesno";
import CheckList from "./controls/aum-checklist";
import MultiChoice from "./controls/aum-multichoice";
import Range from "./controls/aum-range";
import Notes from "./controls/aum-notes";
import Title from "./controls/aum-title";
import Table from "./controls/aum-table";
import SliderComponent from "./controls/aum-slider";
import HTMLView from "react-native-htmlview";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  createData,
  updateData
} from "../../../../redux/actions/observation_action";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import FooterButton from "../../common/FooterButton";
import { hp, wp } from "../../../../themes/Scale";
import {
  DEFAULT_INVERSE_LIGHT,
  DEFAULT_GREY_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  FONT_FAMILY,
  DEFAULT_WHITE_COLOR
} from "../../../../themes/variable";
import { NativeToast, NativeToastTop } from "../../common/Toaster";
import { fontFactor } from "../../../../utils/DeviceUtils";
import AsyncStorage from "@react-native-community/async-storage";
import i18n from "../../../../../i18n";

class AumTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateJSON: [],
      showReview: false,
      responseJSON: [],
      template: true,
      micro_template_id: "",
      data: [],
      enc_id: "",
      healphaId: "",
      doc_id: "",
      comment: "",
      answers: [],
      update: false,
      templateId: "",
      categoriWise: false,
      key: ""
    };
  }

  componentDidMount = async () => {
    this.setState({
      templateJSON: this.props.navigation.state.params.template,
      templateId: this.props.navigation.state.params.templateId,
      responseJSON: [],
      enc_id: this.props.patientList?.encounter_id,
      healphaId: this.props.patientList?.appointment?.healpha_id,
      doc_id: this.props.patientList?.appointment?.doc_id
    });
    // console.log(
    //   this.props.navigation.state.params,
    //   this.props.navigation.state.params.template,
    //   this.props.navigation.state.params.templateId,
    //   "Hello aum-template",
    //   this.props.patientList?.appointment?.id
    // );

    if (this.props.navigation.state.params.update) {
      this.setState({
        update: this.props.navigation.state.params.update,
        answers: this.props.navigation.state.params.answers
      });
    }

    if (this.props.navigation.state.params.categoriWise) {
      this.setState({
        categoriWise: true,
        key: this.props.navigation.state.params.key
      });
    }
    await AsyncStorage.setItem(
      "g_enc_id",
      this.props.patientList?.encounter_id
    );
    await AsyncStorage.setItem(
      "g_doc_id",
      this.props.patientList?.appointment?.doc_id
    );
    await AsyncStorage.setItem(
      "g_healphaId",
      this.props.patientList?.appointment?.healpha_id
    );
    await AsyncStorage.setItem("g_name", this.state.templateJSON.label);
  };

  deviceEmit = () => {
    DeviceEventEmitter.emit("getPatientCard", {
      appointmentId: this.props.patientList?.appointment?.id
    }),
      DeviceEventEmitter.emit(
        "updateTemplateAnswers",
        {
          name: this.state.templateJSON.label,
          // enc_id: this.state.enc_id,
          // doc_id: this.state.doc_id,
          // healphaId: this.state.healphaId,
          enc_id: this.props.patientList?.encounter_id,
          healphaId: this.props.patientList?.appointment?.healpha_id,
          doc_id: this.props.patientList?.appointment?.doc_id
        },
        1000
      );
    DeviceEventEmitter.emit("updateHomeScreen", { date: "" });
    [1000];
  };

  handleAnswer = (propsData, value) => {
    // console.log(propsData, "propdata");
    let x = this.state.responseJSON;

    let index = x.indexOf(propsData);
    // console.log(index, "index");
    if (index == -1) x.push(propsData);
    else {
      x.splice(index, 1);
      x.push(propsData);
    }
  };

  handleSubmit = async () => {
    // console.log(this.state.responseJSON, "answerskjsdkjhadkhakhjk");

    let data = [];
    this.state.responseJSON.map((i) => {
      let index = null;
      const splitData = i.simpleAnswer.split(":")[1];
      if (splitData[1]) {
        if (
          data.find((x, idx) => {
            const isTrue = x.micro_template_id === i.templateId;
            if (isTrue) {
              index = idx;
            }
            return isTrue;
          })
        ) {
          data[index].answers = [
            ...data[index].answers,
            { question_id: i.id, answer: splitData.slice(1), label: i.label }
          ];
        } else {
          data.push({
            micro_template_id: i.templateId,
            temp_micro_master_rel_id: i.relId,
            answers: [
              { question_id: i.id, answer: splitData.slice(1), label: i.label }
            ]
          });
        }
      }
    });

    await createData(data, {
      enc_id: this.state.enc_id,
      healphaId: this.state.healphaId,
      doc_id: this.state.doc_id,
      template_id: this.state.templateId
    })
      .then((res) => {
        if (res) {
          this.deviceEmit();
          NativeToast({
            text: i18n.t("OBSERVATION.CREATED_ANSWERS", {
              label: this.state.templateJSON.label
            }),
            type: "success"
          });
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        if (err) {
          // console.log(err, "error");
          NativeToast({ text: err.message, type: "danger" });
          // this.props.navigation.navigate('Consultation');
        }
      });
  };

  handleUpdate = async () => {
    if (this.state.responseJSON.length > 0) {
      let z = this.state.responseJSON;
      let v = this.state.responseJSON;
      let y = this.state.answers;

      let x = [];

      z.map((ii) => {
        var index = y
          .map((x) => {
            if (ii["id"] === x["question_id"]) return x["question_id"];
          })
          .indexOf(ii["id"]);

        if (index > -1) y.splice(index, 1);
      });

      z.map((i, inDex) => {
        let index = null;
        const splitData = i.simpleAnswer.split(":")[1];
        if (splitData.slice(1)) {
          y.push({
            question_id: i.id,
            answer: splitData.slice(1),
            label: i.label,
            id: i.upid,
            keyname: i.keyname
          });
        }
      });

      let result = await this.group(y, "keyname");

      let obj = {};

      result.map((i, index) => {
        obj.enc_id = this.state.enc_id;
        obj.healphaId = this.state.healphaId;
        obj.doc_id = this.state.doc_id;
        // obj.comment = i.comment;
        obj.id = i[0].id;

        let inx = [];

        i.map((ii, Index) => {
          let mapp = ii;
          delete mapp["id"];
          delete mapp["comment"];
          inx.push(mapp);
        });
        obj.answers = inx;

        x.push(obj);

        obj = {};
      });

      let myArray = x.filter(function (obj) {
        return obj.id == undefined;
      });

      let response = [];
      if (myArray.length > 0) {
        x = x.filter(function (obj) {
          return obj.id;
        });
        let data = {};
        let Answers = {};
        myArray.map((i) => {
          if (Answers?.answers?.length > 0) {
            Answers.answers.push(...i.answers);
          } else {
            Answers.answers = i.answers;
          }
        });

        data.micro_template_id = v[0].templateId;
        data.temp_micro_master_rel_id = v[0].relId;
        data.answers = Answers?.answers;

        await createData([data], {
          enc_id: this.state.enc_id,
          healphaId: this.state.healphaId,
          doc_id: this.state.doc_id,
          template_id: this.state.templateId
        })
          .then((res) => {
            if (res) {
              response.push(res);
            }
          })
          .catch((res) => {
            NativeToastTop({
              text: res.message,
              type: "warning"
            });
          });
      }

      for (let index = 0; index < x.length; index++) {
        await updateData(x[index])
          .then((res) => {
            response.push(res);
          })
          .catch((err) => {
            if (err) {
              NativeToast({
                text: err.message,
                type: "danger"
              });

              // this.props.navigation.navigate('Consultation');
              this.props.navigation.goBack();
            }
          });
      }

      if (myArray.length > 0) {
        if (response.length === x.length + 1) {
          this.deviceEmit();
          NativeToast({
            text: `Updated ${this.state.templateJSON.label} answers`,
            type: "success"
          });

          // this.props.navigation.navigate('Consultation');
          this.props.navigation.goBack();
        }
      } else {
        if (response.length === x.length) {
          this.deviceEmit();
          NativeToast({
            text: i18n.t("OBSERVATION.UPDATE_ANSWERS", {
              label: this.state.templateJSON.label
            }),
            type: "success"
          });

          // this.props.navigation.navigate('Consultation');
          this.props.navigation.goBack();
        }
      }
    } else {
      let x = this.state.answers;
      let y = [];

      let result = await this.group(x, "id");
      let obj = {};

      result.map((i, index) => {
        obj.enc_id = this.state.enc_id;
        obj.healphaId = this.state.healphaId;
        obj.doc_id = this.state.doc_id;
        obj.id = i[0].id;

        let iny = [];

        i.map((ii, Index) => {
          let mapp = ii;
          delete mapp["id"];
          iny.push(mapp);
        });
        obj.answers = iny;

        y.push(obj);

        obj = {};
      });

      let response = [];

      for (let index = 0; index < y.length; index++) {
        await updateData(y[index])
          .then((res) => {
            response.push(res);
          })
          .catch((err) => {
            NativeToast({
              text: err.message,
              type: "danger"
            });

            // this.props.navigation.navigate('Consultation');
            this.props.navigation.goBack();
          });
      }

      if (response.length === y.length) {
        this.deviceEmit();
        NativeToast({
          text: i18n.t("OBSERVATION.UPDATE_ANSWERS", {
            label: this.state.templateJSON.label
          }),
          type: "success"
        });

        // this.props.navigation.navigate('Consultation');
        this.props.navigation.goBack();
      }
    }
  };

  group = async (arr, key) => {
    return [
      ...arr
        .reduce(
          (acc, o) => acc.set(o[key], (acc.get(o[key]) || []).concat(o)),
          new Map()
        )
        .values()
    ];
  };

  renderItem = ({ item, index }) => {
    console.log("item,index",index)
    let items;
    if (this.state.categoriWise) {
      items = item.key === this.state.key ? item : {};
    } else {
      items = item;
    }

    let data = items?.micro_template?.body;
    let body = data?.sort(function (a, b) {
      return a?.fieldIndex - b?.fieldIndex; //||  a.label.localeCompare(b.label);
    });
    // console.log(body, "body");
    // let body = JSON.parse(item?.micro_template?.body);
    let templateId = items?.micro_template?.id;
    // console.log(templateId, "templatedid");
    let relId = items?.rel_id;

    // let qids = this.state.answers.find((qid) => qid?.rel_id === relId);

    return body === undefined ? null : (
      <SafeAreaView
        style={{ backgroundColor: DEFAULT_WHITE_COLOR }}
        key={index}>
        <View
          style={{
            paddingVertical: 6,
            paddingLeft: 10,
            backgroundColor: DEFAULT_WHITE_COLOR
            // height: hp(40),
          }}>
          {/* <Text h3>{this.state.item.label}</Text> */}
          <Text
            selectable
            style={{
              fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
              fontSize: 16,
              textAlignVertical: "center"
            }}>
            {items.label}
          </Text>
          {/* <Divider
            subHeader={item.label}
            orientation="horizontal"
            style={{marginBottom: 5, marginTop: 5}}
            subHeaderStyle={{color: '#2089dc'}}
          /> */}
        </View>
        <Divider orientation="horizontal" style={{ marginBottom: 10 }} />
        {body?.map((bodyItem1, index) => {
          const bodyItem = { ...bodyItem1, templateId, relId };

          let qids = this.state.answers.find(
            (qid) => qid?.question_id === bodyItem1.id
          );
          return (
            <View key={bodyItem.id}>
              {bodyItem.type == "singleChoice" ? (
                <SingleChoice
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  update={this.state.update ? true : false}
                  onAnswer={this.handleAnswer}></SingleChoice>
              ) : null}
              {bodyItem.type == "yesNo" ? (
                <YesNo
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></YesNo>
              ) : null}
              {bodyItem.type == "simpleQuestion" ? (
                <QuestionAnswer
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></QuestionAnswer>
              ) : null}
              {bodyItem.type == "checkList" ? (
                <CheckList
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></CheckList>
              ) : null}
              {bodyItem.type == "multiChoice" ? (
                <MultiChoice
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></MultiChoice>
              ) : null}
              {bodyItem.type == "ratingScale" ? (
                <Range
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></Range>
              ) : null}
              {bodyItem.type == "slider" ? (
                <SliderComponent
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></SliderComponent>
              ) : null}
              {bodyItem.type == "notes" ? (
                <Notes
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></Notes>
              ) : null}
              {bodyItem.type == "heading" ? (
                <Title
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></Title>
              ) : null}
              {bodyItem.type == "table" ? (
                <Table
                  keyname={items.key}
                  item={bodyItem}
                  answer={qids?.question_id === bodyItem.id ? qids : null}
                  onAnswer={this.handleAnswer}></Table>
              ) : null}
              {bodyItem.type != "heading" ? (
                <Divider
                  orientation="horizontal"
                  style={{ marginBottom: 10, marginTop: 10 }}
                />
              ) : null}
            </View>
          );
        })}
      {(this.state.templateJSON.categories.length==index+1)&&(
        <View style={{height:Platform.OS=='ios'?100:0}}></View>
      )}
      </SafeAreaView>
    );
  };

  render() {
    // console.log(this.state.responseJSON, "response json");
    return (
      <View style={{ flex: 1, paddingBottom: hp(70) }}>
        <SimpleHeader
          title={`${this.state.templateJSON.label} Data`}
          navigation={this.props.navigation}
          template={this.state.template}
        />
        <View
          style={{
            height: hp(40),
            borderBottomColor: DEFAULT_GREY_COLOR,
            backgroundColor: DEFAULT_INVERSE_LIGHT,
            borderBottomWidth: 1,
            justifyContent: "center"
          }}>
          <Text style={{ marginLeft: 10 }}>
            {i18n.t("OBJECTIVE.PLEASE_ENTER_THE_DETAILS")}
          </Text>
        </View>

        <ScrollView>
        <KeyboardAvoidingView
          behavior={"padding" }
          onPress={Keyboard.dismiss}>
        <FlatList
          data={this.state.templateJSON.categories}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        </KeyboardAvoidingView>
        </ScrollView>
        {/* <View
            style={{
              paddingHorizontal: 15,
              height: hp(100),
              paddingVertical: 5,
            }}>
            <TextInput
              multiline={true}
              numberOfLines={3}
              value={this.state.comment}
              style={{
                backgroundColor: DEFAULT_BACKGROUND_COLOR,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 5,
              }}
              onChangeText={(val) => {
                this.setState({comment: val});
              }}
            />
          </View>
        </ScrollView> */}
        <FooterButton
          label={
            this.state.update
              ? i18n.t("OBSERVATION.UPDATE_DATA")
              : i18n.t("OBSERVATION.SAVE_DATA")
          }
          onPress={() => {
            this.state.update ? this.handleUpdate() : this.handleSubmit();
          }}
        />

        {/* <BottomSheet
          isVisible={this.state.showReview}
          containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
          {this.state.responseJSON.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>
                  <HTMLView
                    value={'<div>' + l.simpleAnswer + '</div>'}
                    style={[{marginRight: 10}]}
                  />
                </ListItem.Title>
                <Divider
                  orientation="horizontal"
                  style={{marginBottom: 5, marginTop: 5}}
                />
              </ListItem.Content>
            </ListItem>
          ))}

          <Button
            icon={<Icon name="check-circle" size={25} color="white" />}
            style={{marginBottom: 10}}
            title=" Submit"
            onPress={this.handleSubmit}></Button>
          <Button
            icon={<Icon name="stop-circle" size={25} color="white" />}
            style={{backgroundColor: '#1E6738'}}
            title=" Close & Edit"
            onPress={() => this.setState({showReview: false})}></Button>
        </BottomSheet> */}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AumTemplate));
