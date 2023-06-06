import {
  View,
  Header,
  Left,
  Body,
  Title,
  Right,
  Content,
  Toast as nativeBaseToast
} from "native-base";
import React, { Component } from "react";
import { Text, TouchableOpacity, Image, Platform } from "react-native";
import { Card, TextInput } from "react-native-paper";
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR
} from "../../../themes/variable";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Feather";
import { ScrollView } from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";
import DatePicker from "react-native-datepicker";
import { withTranslation } from "react-i18next";
import Cross from "../../HomeScreen/ImageComponents/Close.js";
import Styles from "./ProfileEditscreensStyles.js";
import { doctorPutMethod } from "../../../services/DoctorProfileService.js";
// custom components
import AppLoader from "../../HomeScreen/Common/AppLoader";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const experience = {
  experience_id: null,
  doctor_id: null,
  practice_id: null,
  branch_id: null,
  organization_name: "",
  from_date: "",
  till_date: "",
  current_work: "",
  designation: ""
};

class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: experience,
      text: "",
      checked: false,
      textInput: [],
      inputData: [],
      experienceArray: [],
      loader: false,
      experienceIds: [],
      details: {},
      dateFromPicker: false,
      dateTillPicker: false
    };
  }
  componentDidMount() {
    const { experienceArray, details } = this.props?.navigation?.state?.params;
    this.setState({ experienceArray: experienceArray, details: details });
  }

  //function to add TextInput dynamically
  addTextInput = (index) => {
    const experience = {
      experience_id: null,
      doctor_id: null,
      practice_id: null,
      branch_id: null,
      organization_name: "",
      from_date: "",
      till_date: "",
      current_work: "",
      designation: ""
    };
    let exp = this.state.experienceArray;
    exp.push(experience);
    this.setState({ experienceArray: exp });
  };

  setLoader = () => {
    this.setState({
      loader: true
    });
  };

  removeIndexObject = (index) => {
    let inputData = [...this.state.experienceArray];
    let experienceIds = this.state.experienceIds;
    let experienceObject = inputData[index];
    if (experienceObject.experience_id) {
      experienceIds.push(experienceObject.experience_id);
    }
    inputData.splice(index, 1);
    this.setState({
      experienceArray: inputData,
      loader: false
    });
  };

  removeTextInput = (index) => {
    console.log("index",index)
    this.setState(
      {
        loader: true
      },
      () => this.removeIndexObject(index)
    );
  };

  handleInputSection = (text, index, type) => {
    let exp = this.state.experienceArray;
    let expObj = exp[index];
    expObj[type] = text;
    exp[index] = expObj;
    this.setState({
      experienceArray: exp
    });
  };

  handleDesignationName = (text, index) => {
    let exp = this.state.experienceArray;
    let expObj = exp[index];
    expObj.designation = text;
    exp[index] = expObj;
    this.setState({
      experienceArray: exp
    });
  };

  handleFromDate = (text, index) => {
    let exp = this.state.experienceArray;
    let expObj = exp[index];
    expObj.fromdate = text;
    exp[index] = expObj;
    this.setState({
      experienceArray: exp
    });
  };

  handleTillDate = (text, index) => {
    let exp = this.state.experienceArray;
    let expObj = exp[index];
    expObj.tilldate = text;
    exp[index] = expObj;
    this.setState({
      experienceArray: exp
    });
  };

  handleCheckBox = (index, type, current_work) => {
    const exp = this.state.experienceArray;
    const expObj = exp[index];
    if (
      current_work === "0" ||
      current_work === "" ||
      current_work === null ||
      current_work === undefined
    ) {
      expObj[type] = "1";
    } else {
      expObj[type] = "0";
    }
    // expObj[type] = !expObj[type];
    exp[index] = expObj;
    this.setState({
      experienceArray: exp
    });
  };
  enableFromDatePicker = (date,element,index) => {
    console.log("enableFromDatePicker",index)
    this.setState((prevState) => ({
      dateFromPicker: !prevState.dateFromPicker,
      dateelementfrom: element,
      dateindexfrom:index
    }));
  };
  enableTillDatePicker = (date,element,index) => {
    console.log("enableTillDatePicker",index)
    this.setState((prevState) => ({
      dateTillPicker: !prevState.dateTillPicker,
      dateelement:element,
      dateindex:index
    }));
  };
  handleConfirm = (date,index,type )=> {
    console.log("datehandle",date)
    let date_val = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    console.log("datehandle",date_val)
    this.handleDateChange("noevent",date_val, index,type);
  };
  handleDateChange1 = (event,date, index, type) => {
    console.log("event,date, index, type",event,date, index, type)
    if (event.type === "dismissed") {
      this.setState({ dateFromPicker: false,dateTillPicker: false });
      return;
    }else{
    if (type == "till_date") {
      const exp = this.state.experienceArray;
      const expObj = exp[index];
      if (date > expObj.from_date) {
        expObj[type] = date;
        exp[index] = expObj;
        this.setState({
          experienceArray: exp,
          dateFromPicker: false,dateTillPicker: false
        });
      } else {
        alert("please Select Correct date");
      }
    } else {
      const exp = this.state.experienceArray;
      const expObj = exp[index];
      expObj[type] = date;
      exp[index] = expObj;
      this.setState({
        experienceArray: exp,
        dateFromPicker: false,dateTillPicker: false
      });
    }
  }
  };
  handleDateChange = (event,date, index, type) => {
    console.log("event,date, index, type",event,date, index, type)
    if (event.type === "dismissed") {
      this.setState({ dateFromPicker: false,dateTillPicker: false });
      return;
    }else{
    if (type == "till_date") {
      const exp = this.state.experienceArray;
      const expObj = exp[index];
      if (date > expObj.from_date) {
        expObj[type] = date;
        exp[index] = expObj;
        this.setState({
          experienceArray: exp,
          dateFromPicker: false,dateTillPicker: false
        });
      } else {
        alert("please Select Correct date");
      }
    } else {
      const exp = this.state.experienceArray;
      const expObj = exp[index];
      expObj[type] = date;
      exp[index] = expObj;
      this.setState({
        experienceArray: exp,
        dateFromPicker: false,dateTillPicker: false
      });
    }
  }
  };
  hideDatePicker = () => {
    if (this.state.dateFromPicker == true) {
      this.setState({dateFromPicker: false});
    }else if (this.state.dateTillPicker == true) {
      this.setState({dateTillPicker: false});
    }else{
      this.setState({
        dateFromPicker: false,dateTillPicker: false
      });
    }
  };
  init = async () => {
    const { t } = this.props;
    try {
      let experienceObject = this.state.experienceArray;
      const experienceIds = this.state.experienceIds;
      const payload = {
        experience: experienceObject,
        delete_experience: experienceIds
      };
      let Response = await doctorPutMethod(payload);
      if (Response) {
        this.props.navigation.goBack();
      }
    } catch (error) {
      nativeBaseToast.show({
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
          <Body style={{ marginLeft: -30 }}>
            <Title
              style={{ color: DEFAULT_WHITE_COLOR }}
              testID="editExperienceTitle"
              accessibilityLabel="editExperienceTitle">
              {t("PROFILE.EDITEXPERIENCE")}
            </Title>
          </Body>

          <Right>
            <TouchableOpacity onPress={() => this.init()}>
              <Title
                style={{ color: DEFAULT_WHITE_COLOR }}
                testID="saveTitle"
                accessibilityLabel="saveTitle">
                {t("PROFILE.SAVE")}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }

  AddexperienceSection() {
    const { t } = this.props;
    return (
      <Card style={Styles.Card}>
        <View style={Styles.AddExperienceView}>
          <View style={{ justifyContent: "flex-start" }}>
            <Text
              style={Styles.AddExperienceName}
              testID="addExperienceText"
              accessibilityLabel="addExperienceText">
              {t("PROFILE.ADDEXPERIENCE")}
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
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  }
  tillDatePicker=()=>{
    const element=this.state.dateelement
    const index=this.state.dateindex
    return(
      (Platform.OS=='android' ? (
        <DateTimePicker
          testID="dateTimePicker"
          accessibilityLabel="dateTimePicker"
          value={element.till_date!=""
          ?new Date(moment(element.till_date))
          :new Date()}
          display="default"
          mode={"date"}
          onChange={(event, date) => this.handleDateChange(event, moment(date).format('YYYY-MM-DD'), index, "till_date")}
          minimumDate={this.state.details.dob!=""
        ?new Date(moment(this.state.details.dob))
        :new Date()}
        />
      ):(
        <DateTimePickerModal
          defaultDate={new Date()}
          isVisible={this.state.dateTillPicker}
          mode="date"
          date={element.till_date!=""
          ?new Date(moment(element.till_date))
          :new Date()}
          minimumDate={this.state.details.dob!=""
          ?new Date(moment(this.state.details.dob))
          :new Date()}
          locale={'en'}
          dateFormat={'YYYY-MM-DD'}
          timeZoneOffsetInMinutes={undefined}
          onConfirm={date => this.handleConfirm(date,index,'till_date')}
          onCancel={() => this.hideDatePicker()}
        />
      )
      )
    )
  }
  fromDatePicker=()=>{
    const element=this.state.dateelementfrom
    const index=this.state.dateindexfrom
    console.log("index1",index)
    return(
      (Platform.OS=='android' ? (
        <DateTimePicker
          testID="dateFromPicker"
          accessibilityLabel="dateFromPicker"
          value={element.from_date!=""
          ?new Date(moment(element.from_date))
          :new Date()}
          key={index}
          display="default"
          mode={"date"}
          onChange={(event, date) => this.handleDateChange(event, moment(date).format('YYYY-MM-DD'), index, "from_date")}
          minimumDate={this.state.details.dob!=""
        ?new Date(moment(this.state.details.dob))
        :new Date()}
        />
      ):(
        <DateTimePickerModal
          defaultDate={new Date()}
          isVisible={this.state.dateFromPicker}
          mode="date"
          date={element.from_date!=""
          ?new Date(moment(element.from_date))
          :new Date()}
          minimumDate={this.state.details.dob!=""
          ?new Date(moment(this.state.details.dob))
          :new Date()}
          locale={'en'}
          dateFormat={'YYYY-MM-DD'}
          timeZoneOffsetInMinutes={undefined}
          onConfirm={date => this.handleConfirm(date,index,'from_date')}
          onCancel={() => this.hideDatePicker()}
        />
      )
      )
    )
  }
  ExperienceNameSection(element, index) {
    const { t } = this.props;
    console.log("element.from_date",element.from_date,index)
    return (
      <View style={Styles.CardView}>
        <Card>
          <View style={Styles.ExperienceNameSectionView}>
            <View style={{ justifyContent: "flex-start" }}>
              <Text
                style={Styles.NameText}
                testID="organizationNameText"
                accessibilityLabel="organizationNameText">
                {t("PROFILE.ORGANIZATIONNAME")}
              </Text>
            </View>

            <View style={Styles.CrossIcon}>
              <TouchableOpacity onPress={() => this.removeTextInput(index)}>
                <Cross testID="crossIcon" accessibilityLabel="crossIcon" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={Styles.TextInputView}>
            <TextInput
              testID="organizationNameTextInput"
              accessibilityLabel="organizationNameTextInput"
              style={Styles.TextInput}
              placeholder={t("PROFILE.ORGANIZATIONNAME")}
              theme={{
                colors: {
                  primary: LIST_SUB_TEXT_COLOR,
                  underlineColor: "transparent",
                  background: "transparent"
                }
              }}
              defaultValue={element.organization_name}
              onChangeText={(text) =>
                this.handleInputSection(text, index, "organization_name")
              }
            />
          </View>

          <View>
            <Text
              style={Styles.Designation}
              testID="designationText"
              accessibilityLabel="designationText">
              {t("PROFILE.DESIGNATION")}
            </Text>

            <View style={Styles.TextInputView}>
              <TextInput
                testID="designationTextInput"
                accessibilityLabel="designationTextInput"
                style={Styles.TextInput}
                placeholder={t("PROFILE.DESIGNATION")}
                theme={{
                  colors: {
                    primary: LIST_SUB_TEXT_COLOR,
                    underlineColor: "transparent",
                    background: "transparent"
                  }
                }}
                defaultValue={element.designation}
                onChangeText={(text) => {
                  this.handleInputSection(text, index, "designation");
                }}
              />
            </View>
          </View>

          <View style={Styles.Checkbox}>
            <CheckBox
              value={
                element.current_work === "0" ||
                element.current_work === "" ||
                element.current_work === null ||
                element.current_work === undefined
                  ? false
                  : true
              }
              onValueChange={() =>
                this.handleCheckBox(index, "current_work", element.current_work)
              }
            />

            <Text
              style={{ margin: 5 }}
              testID="iamCurrentlyWorkingText"
              accessibilityLabel="iamCurrentlyWorkingText">
              {t("PROFILE.IAMCURRENTLYWORKINGINTHISROLE")}
            </Text>
          </View>

          <View style={Styles.FromDate}>
            <View style={{ justifyContent: "flex-start" }}>
              <Text
                style={Styles.NameText}
                testID="fromDateText"
                accessibilityLabel="fromDateText">
                {t("PROFILE.FROMDATE")}
              </Text>
              <View style={Styles.selectFromDateView}>
                <TouchableOpacity
                  onPress={() =>
                    this.enableFromDatePicker("select_date",element,index)
                  }
                  >
                  <Text style={Styles.dateFromTex}
                  testID="selectedDateText"
                  accessibilityLabel="selectedDateText">
                    {element.from_date==""?t("PROFILE.SELECT_DATE"):element.from_date}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View>
                <DatePicker
                  testID="datePicker"
                  accessibilityLabel="datePicker"
                  //style={{ width: '150%' }}
                  // date={element.fromDate}
                  minDate={this.state.details.dob}
                  maxDate={new Date()}
                  date={element.from_date}
                  mode="date"
                  placeholder={t("PROFILE.SELECT_DATE")}
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      display: "none"
                    },
                    dateInput: {
                      ...Styles.dateInputStyles,
                      paddingLeft: 0
                    }
                  }}
                  onDateChange={(date) =>
                    this.handleDateChange(date, index, "from_date")
                  }
                />
              </View> */}
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text
                style={Styles.TillDate}
                testID="tillDateText"
                accessibilityLabel="tillDateText">
                {t("PROFILE.TILLDATE")}
              </Text>
              <View style={Styles.selectTillDateView}>
                <TouchableOpacity
                  onPress={() =>
                    this.enableTillDatePicker("select_date",element,index)
                  }
                  >
                  <Text style={Styles.dateTillTex}
                  testID="selectedTillDateText"
                  accessibilityLabel="selectedTillDateText">
                    {element.till_date==""?t("PROFILE.SELECT_DATE"):element.till_date}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{ marginLeft: "20%" }}>
                <DatePicker
                  testID="datePicker"
                  accessibilityLabel="datePicker"
                  minDate={this.state.details.dob}
                  date={element.till_date}
                  mode="date"
                  placeholder={t("PROFILE.SELECT_DATE")}
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      display: "none"
                    },
                    dateInput: {
                      ...Styles.dateInputStyles,
                      paddingLeft: 0
                    }
                  }}
                  onDateChange={(date) => {
                    this.handleDateChange(date, index, "till_date");
                  }}
                />
              </View> */}
            </View>
                      
          </View>
        </Card>
      </View>
    );
  }

  render() {
    return (
      <Content>
        <View style={{ paddingBottom: 110 }}>
          {this.Header()}
          {this.AddexperienceSection()}
          <ScrollView>
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
            {!!this.state.experienceArray?.length &&
              !this.state.loader &&
              this.state.experienceArray.map((element, index) => {
                return this.ExperienceNameSection(element, index);
              })}
          </ScrollView>
          {this.state.dateFromPicker && 
            this.fromDatePicker()
            } 
          {this.state.dateTillPicker && 
            this.tillDatePicker()
            } 
        </View>
      </Content>
    );
  }
}

export default withTranslation()(Experience);
