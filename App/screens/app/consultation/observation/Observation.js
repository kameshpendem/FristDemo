import React, { useState, createRef, useEffect } from "react";
import {
  CardItem,
  Left,
  Body,
  Right,
  ListItem,
  Icon,
  Button,
  Footer
} from "native-base";
import { Card, Divider } from "react-native-elements";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  DeviceEventEmitter,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { getColor, theme } from "../../../../themes/Theme";
import Edit from "../../../../assets/images/edit.png";
import ActionSheet from "react-native-actions-sheet";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_BLUE_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  FONT_FAMILY,
  DEFAULT_BACKGROUND_COLOR
} from "../../../../themes/variable";
import { wp, hp } from "../../../../themes/Scale";
import Collapsible from "react-native-collapsible";
import close from "../../../../assets/images/close.png";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  getVitalsLabels,
  fetchVitalLabelssuccess,
  getTemplateViewData,
  updateData
} from "../../../../redux/actions/observation_action";
import { OBSERVATION } from "../../../../themes/variable";
import Loader from "../../common/Loader";
import { NativeToast, NativeToastTop } from "../../common/Toaster";
import { fontFactor } from "../../../../utils/DeviceUtils";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

function Observation({
  navigation,
  templateList,
  fetchVitalLabelssuccess,
  patientList,
  setAllow,
  t
}) {
  const [loading, setloading] = useState(true);
  const [vitalsShow, setVitalsshow] = useState(true);
  const [vitalsData, setvitalsData] = useState();
  const [show, setShow] = useState(true);
  const [objectiveShow, setObjectiveShow] = useState(true);
  const [assessmentShow, setAssessmentShow] = useState(true);
  const [keyname, setkeyname] = useState("");
  const [templatesData, settemplatesData] = useState({});
  const [enc_id, setenc_id] = useState();
  const [doc_id, setdoc_id] = useState();
  const [healphaId, sethealphaId] = useState();
  const [actionRender, setactionRender] = useState({});
  const [comment, setcomment] = useState("");
  const [addcomment, setaddcomment] = useState(false);
  const [appointmentType, setappointmentType] = useState("");
  const actionSheetRef = createRef();

  const handleCollapse = (val) => {
    getData({
      enc_id,
      doc_id,
      healphaId
    });
    const tmpData = templatesData?.data;
    let filterdata;
    if (tmpData) {
      filterdata = tmpData[val];
    }
    if (!tmpData || tmpData[val] === undefined) {
      setVitalsshow(true);
      setShow(true);
      setObjectiveShow(true);
      setAssessmentShow(true);

      return TemplateNavigate({
        templatejson: templateList?.data[val],
        answers: filterdata === undefined ? null : filterdata
      });
    }
    setVitalsshow(true);
    setkeyname(val);
    if (OBSERVATION[0] == val) {
      setShow(!show);
      setObjectiveShow(true);
      setAssessmentShow(true);
    } else if (OBSERVATION[1] == val) {
      setObjectiveShow(!objectiveShow);
      setShow(true);
      setAssessmentShow(true);
    } else if (OBSERVATION[2] == val) {
      setAssessmentShow(!assessmentShow);
      setShow(true);
      setObjectiveShow(true);
    }
  };

  const handleCollapseFromAnswers = async () => {
    let g_enc_id = await AsyncStorage.getItem("g_enc_id");
    let g_doc_id = await AsyncStorage.getItem("g_doc_id");
    let g_healphaId = await AsyncStorage.getItem("g_healphaId");
    let g_name = await AsyncStorage.getItem("g_name");

    let key = g_name.toLowerCase();

    setVitalsshow(true);
    setkeyname(key);

    await getTemplateViewData({
      enc_id: g_enc_id,
      doc_id: g_doc_id,
      healphaId: g_healphaId
    })
      .then((res) => {
        //console.log("handleCollapseFromAnswers", res);
        settemplatesData(res.template);
        if (res.template) {
          setTimeout(() => {
            if (OBSERVATION[0] == key) {
              setShow(false);
              setObjectiveShow(true);
              setAssessmentShow(true);
            } else if (OBSERVATION[1] == key) {
              setObjectiveShow(false);
              setShow(true);
              setAssessmentShow(true);
            } else if (OBSERVATION[2] == key) {
              setAssessmentShow(false);
              setShow(true);
              setObjectiveShow(true);
            }
          }, 1000);
        }
      })
      .catch((res) => {});
  };

  const VitalsLabes = async (val) => {
    let data = await getVitalsLabels({
      doc_id: val.doc_id,
      enc_id: val.enc_id,
      healphaId: val.healphaId,
      templateId: val.templateId
    })
      .then((res) => {
        if (res) {
          setVitalsshow(true);
          fetchVitalLabelssuccess(res);
          setVitalsshow(true);

          let obj = {};
          if (res?.vitals?.length > 0) {
            setAllow(true);
          }
          if (res?.vitals?.length > 0) {
            let vitalsdata = res.vitals[0];
            Object.keys(vitalsdata).map((label) => {
              if (label !== "comment" || label !== "id") {
                let keyColor = label + "_" + "color";
                obj[label] = vitalsdata[label]?.value;
                obj[keyColor] = vitalsdata[label]?.color;
              }
            });
          }

          navigation.navigate("VitalsInput", {
            templateId: navigation.state.params.templateId,
            edit:
              res?.vitals?.length > 0
                ? res?.vitals[0]?.vital_status !== "active"
                  ? true
                  : false
                : false,
            data:
              res?.vitals[0]?.vital_status === undefined
                ? JSON.stringify({})
                : res?.vitals[0]?.vital_status !== "active"
                ? JSON.stringify(obj)
                : JSON.stringify({}),
            comment:
              res?.vitals[0]?.vital_status === undefined
                ? ""
                : res?.vitals[0]?.vital_status !== "active"
                ? res.vitals[0].comments
                : "",
            id:
              res?.vitals[0]?.vital_status === undefined
                ? ""
                : res?.vitals[0]?.vital_status !== "active"
                ? res?.vitals[0]?.id
                : ""
          });
        }
      })
      .catch((res) => {
        NativeToastTop({ text: t("BILLING.PAYBILL.FAIL"), type: "warning" });
      });
  };

  const getVitalsCheck = async (val) => {
    await getVitalsLabels({
      doc_id: val.doc_id,
      enc_id: val.enc_id,
      healphaId: val.healphaId,
      templateId: val.templateId
    })
      .then((res) => {
        if (res) {
          setvitalsData(res);
          if (res?.vitals?.length > 0) {
            setAllow(true);
          }
          setTimeout(() => {
            setVitalsshow(false);
          }, 300);
        }
      })
      .catch((res) => {
        NativeToastTop({ text: t("BILLING.PAYBILL.FAIL"), type: "warning" });
      });
  };

  const initialRender = async (val) => {
    await getVitalsLabels({
      doc_id: val.doc_id,
      enc_id: val.enc_id,
      healphaId: val.healphaId,
      templateId: val.templateId
    }).then((res) => {
      if (res) {
        setvitalsData(res);
        if (res?.vitals?.length > 0) {
          setAllow(true);
        }
      }
    });
  };

  const vitalsRender = async () => {
    setShow(true), setObjectiveShow(true), setAssessmentShow(true);
    if (vitalsShow) {
      await getVitalsLabels({
        doc_id,
        enc_id,
        healphaId,
        templateId: templateList?.id
      }).then((res) => {
        if (res) {
          setvitalsData(res);
          if (res?.vitals?.length > 0) {
            setAllow(true);
          }
          if (
            res?.vitals?.length === 0 ||
            (vitalsData?.vitals[0]?.vital_status === "active" &&
              appointmentType.toLowerCase() == "review")
          ) {
            VitalsLabes({
              doc_id,
              enc_id,
              healphaId,
              templateId: templateList.id
            });
          } else {
            setVitalsshow(!vitalsShow);
          }
        } else {
          setVitalsshow(!vitalsShow);
        }
      });
      // .catch(() => {
      //   NativeToastTop({ text: t("BILLING.PAYBILL.FAIL"), type: "warning" });
      // });
    } else {
      setVitalsshow(!vitalsShow);
    }
  };

  const getData = async (val) => {
    await getTemplateViewData({
      enc_id: val.enc_id,
      doc_id: val.doc_id,
      healphaId: val.healphaId
    })
      .then((res) => {
        settemplatesData(res.template);
        setloading(false);
      })
      .catch((res) => {});
  };

  const TemplateNavigate = (val) => {
    setShow(true), setObjectiveShow(true), setAssessmentShow(true);

    if (val?.answers == null) {
      navigation.navigate("Template", {
        template: val.templatejson,
        update: false,
        templateId: navigation.state.params.templateId,
        edit: navigation.state.params.edit
      });
    } else {
      if (val?.answers === undefined) {
        navigation.navigate("Template", {
          template: val.templatejson,
          update: false,
          templateId: navigation.state.params.templateId,
          edit: navigation.state.params.edit
        });
      } else {
        let answers = [];
        let data = val?.answers?.categories;

        let obj = {};

        data.map((i) => {
          i.micro_template.answers.map((ii) => {
            obj = ii;
            obj.id = i.micro_template.id;
            obj.rel_id = i.rel_id;
            obj.comment = i.comment;
            obj.keyname = i?.key;
            answers.push(obj);
            obj = {};
          });
        });

        navigation.navigate("Template", {
          template: val.templatejson,
          answers: answers,
          update: true,
          categoriWise: false,
          key: "",
          templateId: navigation.state.params.templateId,
          edit: navigation.state.params.edit
        });
      }
    }
  };

  const addComment = (val) => {
    setactionRender(val.categories);
    setShow(true);
    setObjectiveShow(true);
    setAssessmentShow(true);
    actionSheetRef.current?.setModalVisible();
  };

  const categoryNavigate = (val) => {
    // console.log(val, "categoryNavigate");

    let answers = [];
    let data = val?.answers;

    let obj = {};

    data.micro_template.answers.map((ii) => {
      obj = ii;
      obj.id = data.micro_template.id;
      obj.rel_id = data.rel_id;
      obj.comment = data.comment;
      obj.keyname = val.key;
      answers.push(obj);
      obj = {};
    });

    navigation.navigate("Template", {
      template: val.templatejson,
      answers: answers,
      update: true,
      categoriWise: true,
      key: val.key,
      templateId: navigation.state.params.templateId,
      edit: navigation.state.params.edit
    });
  };

  useEffect(() => {
    // settemplateId(navigation.state.params.templateId);

    // console.log(
    //   navigation.state.params.edit,
    //   'props.navigation.state.params.edit',
    // );

    //console.log(patientList, "patientListpatientListpatientListpatientList");

    setaddcomment(navigation.state.params.edit);
    setappointmentType(patientList?.appointment?.appointment_type);
    setenc_id(patientList?.encounter_id);
    setdoc_id(patientList?.appointment?.doc_id);
    sethealphaId(patientList?.appointment?.healpha_id);
    getData({
      enc_id: patientList?.encounter_id,
      doc_id: patientList?.appointment?.doc_id,
      healphaId: patientList?.appointment?.healpha_id
    });

    // console.log(templateList, "hello templateList");

    // if (templateList) {
    initialRender({
      doc_id: patientList?.appointment?.doc_id,
      enc_id: patientList?.encounter_id,
      healphaId: patientList?.appointment?.healpha_id,
      templateId: templateList?.id ? templateList?.id : ""
    });
    // }

    DeviceEventEmitter.addListener("updateTemplateAnswers", (e) => {
      handleCollapseFromAnswers();
    });

    DeviceEventEmitter.addListener("VitalsLabes", (e) => {
      getVitalsCheck({
        doc_id: e.doc_id,
        enc_id: e.enc_id,
        healphaId: e.healphaId,
        templateId: e?.templateId
      });
    });
    DeviceEventEmitter.addListener("toVitals", () => {
      setVitalsshow(false);
    });
    return () => {
      DeviceEventEmitter.removeAllListeners("updateTemplateAnswers");
      DeviceEventEmitter.removeAllListeners("VitalsLabes");
      DeviceEventEmitter.removeAllListeners("toVitals");
    };
  }, []);

  const answerParse = (answer, question) => {
    if (question == "singleChoice") {
      let fill = answer.includes(" ");
      if (fill) {
        let parse = answer?.split(" ");
        return parse[0] + " " + parse[1]?.trim();
      } else {
        return answer;
      }
    }
    if (question == "yesNo") {
      let fill = answer.includes(" ");

      if (fill) {
        let parse = answer?.split(" ");
        return parse[0] + " " + parse[1]?.trim();
      } else {
        return answer;
      }
    }
    if (question == "simpleQuestion") {
      return answer;
    }
    if (question == "checkList") {
      let fill = answer.includes("<br/>");
      if (fill) {
        let splits = answer?.split("<br/>");
        return splits.join(", ");
      } else {
        return answer;
      }
    }
    if (question == "multiChoice") {
      let fill = answer.includes("<br/>");

      if (fill) {
        let splits = answer?.split("<br/>");
        return splits.join(", ");
      } else {
        return answer;
      }
    }
    if (question == "ratingScale") return answer;
    if (question == "slider") return answer;
    if (question == "notes") return answer;
    if (question == "heading") return answer;
    if (question == "table") return "table";
    // if (question != "heading") return "heading";
  };

  const Action = () => {
    const AddComment = async (val) => {
      actionSheetRef.current?.setModalVisible(false);

      await updateData({
        enc_id,
        doc_id,
        healphaId,
        id: val.id,
        comment,
        answers: val.answers
      })
        .then((res) => {
          if (res) {
            NativeToast({
              text: t("OBSERVATION.COMMENT_ADDED", { label: val?.label }),
              type: "success"
            });

            handleCollapse(keyname);
          }
        })
        .catch((err) => {
          NativeToast({ text: err.message, type: "danger" });
        });
    };

    let data = actionRender;

    return (
      <View
        style={{
          backgroundColor: DEFAULT_WHITE_COLOR,
          // flexGrow: 2,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}>
        <View style={{ padding: 5 }}>
          <View style={styles.image}>
            <Left>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                  fontSize: 16
                }}
                testID="addCommentsText"
                accessibilityLabel="addCommentsText">
                {t("OBSERVATION.ADDCOMMENTS")}
              </Text>
            </Left>
            <Right>
              <TouchableOpacity
              testID="closeTouch"
              accessibilityLabel="closeTouch"
                onPress={() => actionSheetRef.current?.setModalVisible(false)}>
                <Image source={close} style={styles.close} 
                testID="closeImage"
                accessibilityLabel="closeImage"/>
              </TouchableOpacity>
            </Right>
          </View>
        </View>
        <KeyboardAvoidingView
          style={
            data?.micro_template?.answers?.length > 20
              ? {
                  height: hp(500)
                }
              : {}
          }
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={
              data?.micro_template?.answers.length > 20
                ? { paddingBottom: hp(70) }
                : {}
            }>
            <View>
              {data?.micro_template?.answers?.map((i, index) => {
                return (
                  <View style={{ paddingHorizontal: 20 }} key={index}>
                    <Text
                    testID={index + 1 + ` ` + i?.label?.trim() + ` - `+answerParse(i.answer, i?.question_id?.split("-")?.[0])+"text"}
                    accessibilityLabel={index + 1 + ` ` + i?.label?.trim() + ` - `+answerParse(i.answer, i?.question_id?.split("-")?.[0])+"text"}>
                      {index + 1 + ` ` + i?.label?.trim() + ` - `}
                      {
                        " " +
                          answerParse(i.answer, i?.question_id?.split("-")?.[0])

                        // ans.answer
                      }
                    </Text>
                  </View>
                );
              })}
            </View>
            <View
              style={{
                marginHorizontal: wp(20),
                height: 100,
                paddingVertical: 20,
                // alignContent: 'center',
                justifyContent: "center"
              }}>
              {/* <Card> */}
              <TextInput
                multiline={true}
                // numberOfLines={3}
                onChangeText={(val) => setcomment(val)}
                style={{
                  backgroundColor: DEFAULT_WHITE_COLOR,
                  borderColor: DEFAULT_LIGHT_GREY_COLOR,
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingVertical: Platform.OS === "ios" ? 20 : 0,
                  paddingHorizontal: Platform.OS === "ios" ? 10 : 0,
                  height: hp(80),
                  flexWrap: "wrap"
                }}
              />
              {/* </Card> */}
            </View>
            <Footer
              style={[
                styles.footerSection
                // data?.micro_template?.answers.length > 5
                //   ? { position: "absolute", bottom: 0, right: 0, left: 0 }
                //   : {}
              ]}>
              <Button
              testID="addCommentButton"
              accessibilityLabel="addCommentButton"
                style={[styles.footerButtonStyles]}
                onPress={() =>
                  AddComment({
                    id: data?.micro_template?.id,
                    answers: data?.micro_template?.answers,
                    label: data?.label
                  })
                }>
                <Text style={styles.footerButtonText}
                testID="addCommentText"
                accessibilityLabel="addCommentText">{`Add comment`}</Text>
                {/* <Text style={styles.footerButtonText}>
              {`Add comment for ${data?.label}`}
            </Text> */}
              </Button>
            </Footer>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };

  const Vitals = () => {
    return (
      <View
        style={{
          backgroundColor: DEFAULT_WHITE_COLOR
        }}>
        {vitalsData && vitalsData.vitals.length > 0 ? (
          <View style={styles.collapsible}>
            <CardItem style={{ borderRadius: 5 }}>
              <Left>
                <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD }}testID="vitalSignsText"
                accessibilityLabel="vitalSignsText">
                  Vital Signs
                </Text>
              </Left>
              <Body>
                <Text
                testID="valuesText"
                accessibilityLabel="valuesText">Values</Text>
              </Body>
            </CardItem>
            <Divider style={styles.lineStyle} />
            {vitalsData?.categories.map((categories, index) => {
              if (categories?.data === undefined) {
                return (
                  <View>
                    {vitalsData?.vitals[0][categories?.value]?.value == "" ||
                    vitalsData?.vitals[0][categories?.value]?.value == null ||
                    vitalsData?.vitals[0][categories?.value]?.value ==
                      undefined ? null : (
                      <View
                        key={index}
                        style={{ flexDirection: "row", padding: 3 }}>
                        <Text style={{ flex: 1, marginLeft: 10 }}
                        testID={categories?.label+"text"}
                        accessibilityLabel={categories?.label+"text"}>
                          {categories?.label}
                        </Text>

                        <Text
                          style={{
                            flex: 1,
                            color: getColor(
                              vitalsData?.vitals[0][categories?.value]?.color
                            )
                          }}
                          testID={categories?.unit+"text"}
                          accessibilityLabel={categories?.unit+"text"}>
                          {vitalsData?.vitals[0][categories?.value]?.value}{" "}
                          {vitalsData?.vitals[0][categories?.value]?.value
                            ? categories?.unit
                            : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              } else if (typeof categories?.data === "object") {
                return (
                  <View
                    key={index}
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: DEFAULT_GREY_COLOR,
                      borderRadius: 5
                    }}>
                    {/* <View style={styles.collapsible}> */}
                    <CardItem style={{ borderRadius: 5 }}>
                      <Left>
                        <Text
                        testID={categories?.label+"text"}
                        accessibilityLabel={categories?.label+"text"}
                          style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD }}>
                          {categories?.label}
                        </Text>
                      </Left>
                      <Body></Body>
                    </CardItem>
                    <Divider style={styles.lineStyle} />
                    {/* </View> */}
                    {categories?.data.map((bp, index1) => {
                      return (
                        <View key={index1}>
                          {vitalsData?.vitals[0][bp?.value]?.value ==
                          null ? null : (
                            <CardItem>
                              <Left>
                                <Text
                                testID={bp?.label+"text"}
                                accessibilityLabel={bp?.label+"text"}>{bp?.label}</Text>
                              </Left>
                              <Body>
                                <Text
                                  style={{
                                    color: getColor(
                                      vitalsData?.vitals[0][bp?.value]?.color
                                    )
                                  }}
                                  testID={bp?.unit+"text"}
                                  accessibilityLabel={bp?.unit+"text"}>
                                  {vitalsData?.vitals[0][bp?.value]?.value}{" "}
                                  {vitalsData?.vitals[0][bp?.value]?.value
                                    ? bp?.unit
                                    : ""}
                                </Text>
                              </Body>
                            </CardItem>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              }
            })}
          </View>
        ) : // <View
        //   style={{
        //     height: hp(100),
        //     justifyContent: 'center',
        //   }}>
        //   {/* <Text style={{textAlign: 'center'}}>No Vitals Data Available</Text> */}

        // </View>
        null}
        {vitalsData && vitalsData?.vitals[0]?.comments ? (
          <View>
            <CardItem>
              <Text
              testID="nursesNotesText"
              accessibilityLabel="nursesNotesText">Nurse's Notes</Text>
            </CardItem>
            <View
              style={[
                styles.collapsible,
                {
                  backgroundColor: getColor("offline"),
                  borderColor: getColor(0.5)
                }
              ]}>
              <ListItem>
                <Text
                testID={vitalsData?.vitals[0]?.comments+"text"}
                accessibilityLabel={vitalsData?.vitals[0]?.comments+"text"}>{vitalsData?.vitals[0]?.comments}</Text>
              </ListItem>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  };

  const TemplateDataView = () => {
    let labels = templatesData?.data;
    if (loading) {
      return <Loader />;
    }
    if (labels) {
      return (
        <View>
          {
            labels[keyname]
              ? labels[keyname]?.categories.map((categories, index) => {
                  // let date = new Date(
                  //   categories?.micro_template?.modified_at
                  // ).toDateString();
                  // let time = new Date(
                  //   categories?.micro_template?.modified_at
                  // ).toTimeString();
                  // console.log(categories?.micro_template?.comment, "comment");
                  // console.log(
                  //   time,
                  //   date,
                  //   categories?.micro_template?.modified_at,
                  //   "categories?.micro_template?.modified_at"
                  // );

                  let comments = categories?.micro_template?.comment || [];
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: DEFAULT_WHITE_COLOR,
                        borderRadius: 5,
                        marginRight: 5
                      }}>
                      <View style={styles.collapsible}>
                        <CardItem style={{ borderRadius: 5 }}>
                          <Left>
                            <Text
                              style={{
                                fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
                              }}
                              testID={categories?.label+"text"}
                              accessibilityLabel={categories?.label+"text"}>
                              {categories?.label}
                            </Text>
                          </Left>
                          <Right>
                            {/* {addcomment ? (
                              
                            ) : null} */}

                            <TouchableOpacity
                            testID="editTouch"
                            accessibilityLabel="editTouch"
                              onPress={() => {
                                addcomment
                                  ? addComment({
                                      categories: categories,
                                      index: index
                                    })
                                  : categoryNavigate({
                                      templatejson: templateList?.data[keyname],
                                      answers: categories,
                                      categoriWise: true,
                                      key: categories?.key
                                    });
                              }}>
                              <Image
                              testID="editImage"
                              accessibilityLabel="editImage"
                                source={Edit}
                                style={{
                                  tintColor: APP_PRIMARY_COLOR,
                                  width: 20,
                                  height: 20
                                }}
                              />
                            </TouchableOpacity>
                          </Right>
                        </CardItem>
                        <Divider style={styles.lineStyle} />
                        {categories?.micro_template?.answers.map(
                          (ans, indexans) => {
                            return (
                              <View key={indexans}>
                                <View
                                  style={{
                                    borderRadius: 5,
                                    marginVertical: 2,
                                    paddingHorizontal: 10
                                  }}>
                                  <View>
                                    <Text
                                      style={[
                                        styles.textMargin
                                        // { backgroundColor: "red" }
                                      ]}
                                      testID={indexans +
                                        1 +
                                        `. ` +
                                        ans?.label?.trim() +
                                        " "+"text"}>
                                      {indexans +
                                        1 +
                                        `. ` +
                                        ans?.label?.trim() +
                                        " "}
                                      {/* {''} */}-
                                      {
                                        " " +
                                          answerParse(
                                            ans.answer,
                                            ans?.question_id?.split("-")?.[0]
                                          )

                                        // ans.answer
                                      }
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            );
                          }
                        )}
                        {comments?.map((ii, commentIndex) => {
                          // let date = new Date(
                          //   i.comment_added_at
                          // ).toDateString();
                          // console.log(date, "date");
                          // let time = new Date(
                          //   i.comment_added_at
                          // ).toTimeString();
                          // console.log(time, "time");
                          // const time = i.comment_added_at.slice(11, 22);
                          // if (!i) return null;

                          const time = moment(ii?.comment_added_at);
                          // console.log(ii, "hellooooooooo");

                          return (
                            <View>
                              {commentIndex + 1 === comments.length ? (
                                <Divider style={styles.lineStyle} />
                              ) : null}

                              <View
                                style={[
                                  {
                                    borderRadius: 5,
                                    // flexDirection: "column",
                                    // alignItems: "flex-start",
                                    paddingHorizontal: 20,
                                    justifyContent: "space-between",
                                    textAlign: "center"
                                    // flex: 1
                                    // display: "flex"
                                  },
                                  commentIndex == 0
                                    ? {
                                        marginTop: 2
                                        // backgroundColor: "red"
                                      }
                                    : {}
                                ]}>
                                <Text
                                  style={[
                                    {
                                      fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      // textAlignVertical: "center",
                                      textAlign: "justify"
                                    }
                                  ]}
                                  testID={ii.comment+"text"}
                                  accessibilityLabel={ii.comment+"text"}>
                                  {ii.comment}
                                </Text>
                                <Text
                                  style={{
                                    color: DEFAULT_LIGHT_GREY_COLOR,
                                    textAlign: "right"
                                  }}
                                  testID={ii?.comment_added_at+"text"}
                                  accessibilityLabel={ii?.comment_added_at+"text"}>
                                  {moment(ii?.comment_added_at).format(
                                    "DD/MM/YY"
                                  ) +
                                    " " +
                                    moment(time, "HHmm").format("hh:mm a")}
                                </Text>
                              </View>
                            </View>
                          );

                          // return (
                          //   <View>
                          //     <Divider style={styles.lineStyle} />
                          //     <View
                          //       style={{
                          //         borderRadius: 5,
                          //         flexDirection: "column",
                          //         // alignItems: "flex-start",
                          //         paddingHorizontal: 20,
                          //         marginVertical: 2,
                          //         justifyContent: "space-between",
                          //         textAlign: "center",
                          //         flex: 1
                          //         // display: "flex"
                          //       }}>
                          //       <Text
                          //         style={[
                          //           styles.textMargin,
                          //           {
                          //             fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                          //             alignItems: "center",
                          //             justifyContent: "center",
                          //             display: "flex",
                          //             // textAlignVertical: "center",
                          //             textAlign: "justify"
                          //           }
                          //         ]}
                          // >
                          //         {ii.comment}
                          //       </Text>
                          //       <Text
                          //         style={{
                          //           color: DEFAULT_LIGHT_GREY_COLOR,
                          //           // alignSelf: "flex-end"
                          //           alignItems: "center",
                          //           textAlign: "right",
                          //           justifyContent: "flex-end"
                          //         }}>
                          //         {moment(ii?.comment_added_at).format(
                          //           "DD/MM/YY"
                          //         ) +
                          //           " " +
                          //           moment(time, "HHmm").format("hh:mm a")}
                          //       </Text>
                          //     </View>
                          //   </View>
                          // );
                        })}
                      </View>
                    </View>
                  );
                })
              : null
            // <View style={{height: hp(100), justifyContent: 'center'}}>
            //   <Text
            //     style={{
            //       textAlign: 'center',
            //     }}>
            //     {`There is no ${keyname} data available!`}
            //   </Text>
            // </View>
          }
        </View>
      );
    } else {
      return null;
      // <View style={{height: hp(100), justifyContent: 'center'}}>
      //   <Text
      //     style={{
      //       textAlign: 'center',
      //     }}>{`There is no ${keyname} data available!`}</Text>
      // </View>
    }
  };

  if (loading || !templateList || templatesData == []) {
    return <Loader />;
  }
  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="always">
        <View>
          <Text
            style={{
              margin: 15,
              fontSize: 16,
              fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR
            }}
            testID="pleaseEnterTheDetailsText"
            accessibilityLabel="pleaseEnterTheDetailsText">
            {t("OBJECTIVE.PLEASE_ENTER_THE_DETAILS")}
          </Text>
          <View style={styles.lineStyle} />

          <View
            style={{
              flex: 1,
              backgroundColor: DEFAULT_WHITE_COLOR
            }}>
            <TouchableOpacity
              style={{ paddingLeft: 6 }}
              onPress={() => {
                // vitalsData?.vitals?.length > 0 ? vitalsRender() : VitalsLabes();
                vitalsRender();
              }}>
              <View
                style={{
                  flexDirection: "row",
                  backgrousndColor: DEFAULT_WHITE_COLOR,
                  paddingVertical: 10
                }}>
                <Left style={{ marginHorizontal: wp(10) }}>
                  <Text style={styles.vital}
                  testID="vitalsText"
                  accessibilityLabel="vitalsText">Vitals</Text>
                  {/* <Text style={styles.vital}>{t('OBJECTIVE.VITALS')}</Text> */}
                  <Text
                    note
                    style={[{ color: DEFAULT_GREY_COLOR }, styles.textfont]}
                    testID="keyMeasurementsText"
                    accessibilityLabel="keyMeasurementsText">
                    {t("OBJECTIVE.KEY_MEASUREMENTS")}
                  </Text>
                </Left>
                <View style={{ alignItems: "flex-end" }}>
                  <Right style={{ flexDirection: "row", alignItems: "center" }}>
                    {vitalsData &&
                    vitalsData?.vitals?.length > 0 &&
                    vitalsData?.vitals[0]?.vital_status == "draft" ? (
                      <TouchableOpacity
                        onPress={() => {
                          VitalsLabes({
                            doc_id,
                            enc_id,
                            healphaId,
                            templateId: templateList.id
                          });
                          setVitalsshow(true);
                        }}
                        testID="editTouch"
                        accessibilityLabel="editTouch">
                        <Image
                        testID="editImage"
                        accessibilityLabel="editImage"
                          source={Edit}
                          style={{
                            tintColor: APP_PRIMARY_COLOR,
                            height: 20,
                            width: 20
                          }}
                        />
                      </TouchableOpacity>
                    ) : null}
                    <Icon
                    testID="arrowIcon"
                    accessibilityLabel="arrowIcon"
                      type="EvilIcons"
                      name={vitalsShow ? "chevron-down" : "chevron-up"}
                      style={{ fontSize: 40 }}
                    />
                  </Right>
                </View>
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={vitalsShow}>{Vitals()}</Collapsible>
            <View style={styles.lineStyle} />

            {templateList ? (
              OBSERVATION.map((labelConst, index) => {
                return Object.keys(templateList?.data).map((i, indexOf) => {
                  let filterdata;
                  if (templatesData.data) {
                    filterdata = templatesData?.data[i];
                  }
                  if (i === labelConst) {
                    return (
                      <View key={(index, indexOf)} style={{ paddingLeft: 6 }}>
                        <TouchableOpacity
                          onPress={() => handleCollapse(labelConst)}
                          // key={ item[ i ].id }
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              backgroundColor: DEFAULT_WHITE_COLOR,
                              paddingVertical: 10
                            }}>
                            <Left style={{ marginHorizontal: wp(10) }}>
                              <TouchableOpacity
                                onPress={() => handleCollapse(labelConst)}
                                testID={templateList?.data[i]?.label+"touch"}
                                accessibilityLabel={templateList?.data[i]?.label+"touch"}>
                                <Text style={styles.vital}
                                testID={templateList?.data[i]?.label+"text"}
                                accessibilityLabel={templateList?.data[i]?.label+"text"}>
                                  {templateList?.data[i]?.label}
                                </Text>
                                <Text
                                  note
                                  style={[
                                    { color: DEFAULT_GREY_COLOR },
                                    styles.textfont
                                  ]}
                                  testID="keyMeasurementsText"
                                  accessibilityLabel="keyMeasurementsText">
                                  {t("OBJECTIVE.KEY_MEASUREMENTS")}
                                </Text>
                              </TouchableOpacity>
                            </Left>
                            <View style={{ alignItems: "flex-end" }}>
                              <Right
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center"
                                }}>
                                {/* {addcomment?.templatesData?.data?.length > 0 ? ( */}
                                {filterdata === undefined ||
                                addcomment === true ? null : (
                                  <TouchableOpacity
                                  testID="editTouch"
                                    accessibilityLabel="editTouch"
                                    onPress={() => {
                                      TemplateNavigate({
                                        templatejson: templateList?.data[i],
                                        answers:
                                          filterdata === undefined
                                            ? null
                                            : filterdata
                                      });
                                    }}>
                                    <Image
                                    testID="editImage"
                                    accessibilityLabel="editImage"
                                      source={Edit}
                                      style={{
                                        tintColor: APP_PRIMARY_COLOR,
                                        height: 20,
                                        width: 20
                                      }}
                                    />
                                  </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                  onPress={() => handleCollapse(labelConst)}>
                                  <Icon
                                  testID="arrowIcon1"
                                  accessibilityLabel="arrowIcon1"
                                    type="EvilIcons"
                                    name={
                                      labelConst == OBSERVATION[0]
                                        ? show
                                          ? "chevron-down"
                                          : "chevron-up"
                                        : labelConst == OBSERVATION[1]
                                        ? objectiveShow
                                          ? "chevron-down"
                                          : "chevron-up"
                                        : labelConst == OBSERVATION[2]
                                        ? assessmentShow
                                          ? "chevron-down"
                                          : "chevron-up"
                                        : null
                                    }
                                    style={{ fontSize: 40 }}
                                  />
                                </TouchableOpacity>
                              </Right>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <Collapsible
                          collapsed={
                            labelConst == OBSERVATION[0]
                              ? show
                              : labelConst == OBSERVATION[1]
                              ? objectiveShow
                              : labelConst == OBSERVATION[2]
                              ? assessmentShow
                              : null
                          }>
                          {TemplateDataView()}
                        </Collapsible>
                        <View style={styles.lineStyle} />
                      </View>
                    );
                  }
                });
              })
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
        <ActionSheet ref={actionSheetRef}>{Action()}</ActionSheet>
      </ScrollView>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => {
  return {
    patientList: state.patientList.patientList,
    templateList: state.templateList.templateList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVitalLabelssuccess: (data) => dispatch(fetchVitalLabelssuccess(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Observation));

const styles = StyleSheet.create({
  footerSection: {
    height: 70,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    bottom: Platform.OS === "ios" ? 20 : 0
    // position: "absolute",
    // right: 0,
    // left: 0
  },
  footerButtonStyles: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: APP_PRIMARY_COLOR
  },
  footerButtonText: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fontFamily.primarySemiBold,
    textAlign: "center",
    color: DEFAULT_WHITE_COLOR
  },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  },
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_GREY_COLOR
  },
  textfont: {
    fontFamily: theme.fontFamily.primaryRegular
  },

  uparrow: {
    width: 70,
    height: 70,
    resizeMode: "center",
    tintColor: DEFAULT_GREY_COLOR,
    transform: [{ rotate: "90deg" }]
  },
  vital: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
    fontSize: 16
  },
  downarrow: {
    width: 70,
    height: 70,
    resizeMode: "center",
    tintColor: DEFAULT_GREY_COLOR,
    transform: [{ rotate: "270deg" }]
  },
  textAlignment: {
    textAlign: "center"
  },
  close: {
    width: 10,
    height: 10
  },
  image: {
    flexDirection: "row",
    margin: wp(10)
  },
  collapsible: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    margin: wp(10),
    borderRadius: 5
  },
  headingbg: {
    backgroundColor: DEFAULT_LIGHT_BLUE_COLOR
  }
});
