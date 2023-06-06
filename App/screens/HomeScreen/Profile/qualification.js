import { View, Header, Left, Body, Title, Right, Toast } from "native-base";
import React, { Component } from "react";
import { Text, TouchableOpacity,KeyboardAvoidingView,Keyboard } from "react-native";
import { Card, TextInput } from "react-native-paper";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR
} from "../../../themes/variable";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Feather";
import { ScrollView } from "react-native-gesture-handler";
import { withTranslation } from "react-i18next";
import Cross from "../../HomeScreen/ImageComponents/Close.js";
import Styles from "./ProfileEditscreensStyles.js";
import { doctorPutMethod } from "../../../services/DoctorProfileService.js";
// custom components
import AppLoader from "../../HomeScreen/Common/AppLoader";
import { YearYYYY } from "../CovidMonitoring/Utils/DateTimeUtil";
let qualificationObject = {
  edu_degree: "",
  edu_college: "",
  edu_year: ""
};
class Qualification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: "true",
      textInput: [],
      inputData: [],
      qualificationArray: [],
      qualification: qualificationObject,
      qualificationIds: [],
      loader: false,
      details: {}
    };
  }

  componentDidMount() {
    const { qualificationArray, details } =
      this.props?.navigation?.state?.params;
    this.setState({
      qualificationArray: qualificationArray,
      details: details
    });
  }

  addTextInput = () => {
    qualificationObject = {
      edu_degree: "",
      edu_college: "",
      edu_year: ""
    };
    const qualificationArray = this.state.qualificationArray;
    const obj = this.state.qualification;
    console.log("qualificationArray",qualificationArray)
    console.log("obj",qualificationObject)
    qualificationArray.push(qualificationObject);
    this.setState({
      qualificationArray: qualificationArray
    });
  };

  removeIndexObject = (index) => {
    let inputData = [...this.state.qualificationArray];
    let qualificationIds = this.state.qualificationIds;
    let qualificationObj = inputData[index];
    if (qualificationObj.education_id) {
      qualificationIds.push(qualificationObj.education_id);
    }
    inputData.splice(index, 1);
    this.setState({
      qualificationArray: inputData,
      loader: false
    });
  };

  removeTextInput = (index) => {
    this.setState(
      {
        loader: true
      },
      () => this.removeIndexObject(index)
    );
  };

  handleInputs = (text, index, type) => {
    const qArray = this.state.qualificationArray;
    const qObject = qArray[index];
    if (type === "edu_year") {
      const dobYear = YearYYYY(this.state?.details?.dob);
      if (text.length >= 4) {
        if (parseInt(text) > dobYear) {
          qObject[type] = parseInt(text);
        } else {
          Toast.show({
            text: "Please Enter Year > Date Of Birth",
            type: "danger",
            duration: 3000
          });
        }
      }
    } else {
      qObject[type] = text;
    }
    qArray[index] = qObject;
    this.setState({
      qualificationArray: qArray
    });
  };

  init = async () => {
    const { t } = this.props;
    try {
      let qualificationObj = this.state.qualificationArray;
      let qualificationIds = this.state.qualificationIds;

      const payload = {
        educations: qualificationObj,
        delete_educations: qualificationIds
      };
      let Response = await doctorPutMethod(payload);
      if (Response) {
        this.props.navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        text: t("PROFILE.DATANOTSAVED"),
        type: "danger",
        duration: 5000
      });
    }
  };

  Header() {
    const { t } = this.props;
    return (
      <View>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{ backgroundColor: APP_PRIMARY_COLOR }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon3
                testID="goBackIcon"
                accessibilityLabel="goBackIcon"
                name="chevron-left"
                size={30}
                style={{ color: DEFAULT_WHITE_COLOR }}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title
              style={{ color: DEFAULT_WHITE_COLOR }}
              testID="editQualificationTitle"
              accessibilityLabel="editQualificationTitle">
              {t("PROFILE.EDITQUALIFICATION")}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.init()}>
              <Title
                style={{ color: DEFAULT_WHITE_COLOR }}
                testID="saveTitle"
                accessibilityLabel="saveTitle">
                {" "}
                {t("PROFILE.SAVE")}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }

  Addqualification() {
    const { t } = this.props;
    return (
      <View>
        <Card style={Styles.Card}>
          <View style={Styles.AddExperienceView}>
            <View style={{ justifyContent: "flex-start" }}>
              <Text
                style={Styles.AddExperienceName}
                testID="addQualificationText"
                accessibilityLabel="addQualificationText">
                {t("PROFILE.ADDQUALIFICATION")}
              </Text>
            </View>

            <View style={Styles.SquarePlus}>
              <TouchableOpacity
                onPress={() => this.addTextInput(this.state.textInput.length)}>
                <Icon2
                  testID="plusIcon"
                  accessibilityLabel="plusIcon"
                  name="squared-plus"
                  style={{ color: APP_PRIMARY_COLOR }}
                  size={18}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    );
  }

  AddqualificationSections(element, index) {
    const { t } = this.props;
    return (
      <View style={{ marginVertical: 10 }}>
        {/* <Card style={{ paddingTop: 10, paddingBottom: 20 }}> */}
        <Card>
          <View style={Styles.ExperienceNameSectionView}>
            <View style={{ justifyContent: "flex-start" }}>
              <Text
                style={Styles.NameText}
                testID="degreeText"
                accessibilityLabel="degreeText">
                {t("PROFILE.DEGREE")}
              </Text>
            </View>

            <View style={Styles.SquarePlus}>
              <TouchableOpacity onPress={() => this.removeTextInput(index)}>
                <Cross testID="crossIcon" accessibilityLabel="crossIcon" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.TextInputView}>
            <TextInput
              testID="degreeTextInput"
              accessibilityLabel="degreeTextInput"
              style={Styles.TextInput}
              placeholder={t("PROFILE.DEGREE")}
              theme={{
                colors: {
                  primary: LIST_SUB_TEXT_COLOR,
                  underlineColor: "transparent",
                  background: "transparent"
                }
              }}
              defaultValue={element && element.edu_degree}
              onChangeText={(text) =>
                this.handleInputs(text, index, "edu_degree")
              }
            />
          </View>

          <View>
            <Text
              style={Styles.Designation}
              testID="collegeOrUniversityText"
              accessibilityLabel="collegeOrUniversityText">
              {t("PROFILE.COLLEGE/UNIVERSITY")}
            </Text>
          </View>

          <View style={Styles.TextInputView}>
            <TextInput
              testID="collegeOrUniversityTextInput"
              accessibilityLabel="collegeOrUniversityTextInput"
              style={Styles.TextInput}
              theme={{
                colors: {
                  primary: LIST_SUB_TEXT_COLOR,
                  underlineColor: "transparent",
                  background: "transparent"
                }
              }}
              placeholder={t("PROFILE.COLLEGE/UNIVERSITY")}
              defaultValue={element && element.edu_college}
              onChangeText={(text) =>
                this.handleInputs(text, index, "edu_college")
              }
            />
          </View>

          <View>
            <Text
              style={Styles.Designation}
              testID="yearText"
              accessibilityLabel="yearText">
              {t("PROFILE.YEAR")}
            </Text>
          </View>

          <View style={Styles.Year}>
            <TextInput
              testID="yearTextInput"
              accessibilityLabel="yearTextInput"
              style={Styles.TextInput}
              placeholder={t("PROFILE.YEAR")}
              maxLength={4}
              theme={{
                colors: {
                  primary: LIST_SUB_TEXT_COLOR,
                  underlineColor: "transparent",
                  background: "transparent"
                }
              }}
              keyboardType="numeric"
              returnKeyType="done"
              defaultValue={element && element.edu_year.toString()}
              onChangeText={(text) =>
                this.handleInputs(text, index, "edu_year")
              }
            />
          </View>
        </Card>
        {(this.state.qualificationArray?.length==index+1)&&(
          <View style={{height:Platform.OS=='ios'?100:0}}></View>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{ paddingBottom: 110 }}>
        {this.Header()}
        {this.Addqualification()}
        {/* <ScrollView style={{ marginBottom: Platform.OS == "ios" ? 110: 0 }}> */}
        <ScrollView>
        <KeyboardAvoidingView
            behavior={"padding"}
            // style={{ marginBottom: -100 }}
            onPress={Keyboard.dismiss}>
          {this.state.loader && (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                flex: 1
              }}>
              <AppLoader />
            </View>
          )}

          {!!this.state.qualificationArray?.length &&
            !this.state.loader &&
            this.state.qualificationArray.map((element, index) => {
              return this.AddqualificationSections(element, index);
            })}
        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default withTranslation()(Qualification);
