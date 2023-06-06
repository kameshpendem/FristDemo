import {
  View,
  Header,
  Left,
  Body,
  Button,
  Container,
  Content,
  Toast,
} from 'native-base';

import Icon3 from 'react-native-vector-icons/Feather';
import React, {Component} from 'react';
import {Text, TouchableOpacity, Image, TextInput} from 'react-native';
import {withTranslation} from 'react-i18next';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
// Styles and color variables
import Styles from './DoctorRegistrationStyles';
import {
  APP_PRIMARY_COLOR,
  CARD_SUB_TEXT_COLOR,
  DEFAULT_WHITE_COLOR,
} from '../../../themes/variable';

// images
import LogoWhite from '../../../assets/images/logo_white.png';

class ExperienceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fill: '',
      experience: {},
    };
  }

  componentDidMount() {
    const {details} = this.props?.navigation?.state?.params;
    this.setState({experience: details});
  }

  handleInputText = (text, type) => {
    const exp = this.state.experience;
    exp[type] = text;
    this.setState({
      experience: exp,
    });
  };

  handleCheckBox = (type, current_work) => {
    const exp = this.state.experience;
    if (
      current_work === '0' ||
      current_work === '' ||
      current_work === null ||
      current_work === undefined
    ) {
      exp[type] = '1';
      const date = moment().format('DD-MM-YYYY');
      this.handleInputText(date, 'till_date');
    } else {
      exp[type] = '0';
    }
    this.setState({
      experience: exp,
    });
  };

  handleGoBack = () => {
    let exp = this.state.experience;
    exp.current_work = '0';
    exp.from_date = '';
    exp.till_date = '';
    exp.designation = '';
    exp.organization_name = '';
    this.setState(
      {
        experience: exp,
      },
      () => this.props.navigation.goBack(),
    );
  };
  Header() {
    const {t} = this.props;
    return (
      <View>
        <Header androidStatusBarColor={APP_PRIMARY_COLOR} style={Styles.Header}>
          <Left style={Styles.leftHeaverView}>
            <TouchableOpacity onPress={() => this.handleGoBack()}
            testID="leftIconTouch"
            accessibilityLabel="leftIconTouch">
              <Icon3
              testID="leftIcon"
              accessibilityLabel="leftIcon"
                name="chevron-left"
                size={25}
                style={{color: DEFAULT_WHITE_COLOR}}
              />
            </TouchableOpacity>
            <Image
            testID="healphaLogo"
            accessibilityLabel="healphaLogo"
              source={LogoWhite}
              style={Styles.headerImageStyles}
              resizeMode="contain"
            />
          </Left>
          <Body></Body>
        </Header>
        <View style={Styles.HeaderView}>
          <Text style={Styles.HeaderText}
           testID="createAnAccountWithHealphaText"
           accessibilityLabel="createAnAccountWithHealphaText">
            {t('DOCTOR_REGISTER.CREATE_AN_ACCOUNT_WITH_HEALPHA')}
          </Text>
        </View>
      </View>
    );
  }
  handleFromDate = (date) => {
    this.handleInputText(date, 'from_date');
  };

  handleInputText = (text, type) => {
    const exp = this.state.experience;
    exp[type] = text;
    this.setState({
      experience: exp,
    });
  };
  handleTillDate = (date) => {
    this.handleInputText(date, 'till_date');
  };

  handleInputText = (text, type) => {
    const exp = this.state.experience;
    exp[type] = text;
    this.setState({
      experience: exp,
    });
  };

  navigateTo = () => {
    const details = this.state.experience;

    if (!details.organization_name) {
      Toast.show({
        text: 'Please Enter organization name',
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.designation) {
      Toast.show({
        text: 'Please Enter designation',
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.current_work || details.current_work === '0') {
      Toast.show({
        text: 'Please select currently working role',
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.from_date) {
      Toast.show({
        text: 'Please select from date',
        type: 'warning',
        duration: 3000,
      });
    } else if (!details.till_date) {
      Toast.show({
        text: 'Please select till date',
        type: 'warning',
        duration: 3000,
      });
    } else {
      this.props.navigation.navigate('QualificationScreen', {
        details: this.state.experience,
      });
    }
  };
  ExperienceDetails() {
    const {t} = this.props;
    return (
      // addExperience
      <View>
        <View style={Styles.Experience}>
          <View style={Styles.View}>
            <Text style={Styles.ExperienceText}
            testID="experiencesText"
            accessibilityLabel="experiencesText">
              {t('PROFILE.EXPERIENCES')}
            </Text>
            <Text style={Styles.WorkExpeience}
            testID="addLatestWorkExperienceText"
            accessibilityLabel="addLatestWorkExperienceText">
              {t('DOCTOR_REGISTER.ADD_YOUR_RECENT_LATEST_WORK_EXPERIENCE')}
            </Text>
          </View>
          <View style={Styles.CircularView}>"
            <AnimatedCircularProgress
              size={60}
              width={4}
              fill={20}
              tintColor={APP_PRIMARY_COLOR}
              backgroundColor="#DBE4E6">
              {(fill) => <Text style={Styles.circleText}
              testID="twoByFiveText"
              accessibilityLabel="twoByFiveText">2/5</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>

        {/* OrganizationName */}

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}
          testID="organizationNameText"
          accessibilityLabel="organizationNameText">
            {t('PROFILE.ORGANIZATIONNAME')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
            testID="organizationNameTextInput"
            accessibilityLabel="organizationNameTextInput"
              defaultValue={this.state.experience?.organization_name}
              style={Styles.textInput}
              onChangeText={(text) =>
                this.handleInputText(text, 'organization_name')
              }
            />
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.marginTop25]}
          testID="designationText"
          accessibilityLabel="designationText">
            {t('PROFILE.DESIGNATION')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
            testID="designationTextInput"
            accessibilityLabel="designationTextInput"
              defaultValue={this.state.experience?.designation}
              style={Styles.textInput}
              onChangeText={(text) => this.handleInputText(text, 'designation')}
            />
          </View>
        </View>

        {/* checkbox */}
        <View style={Styles.ExpCheckbox}>
          <CheckBox
          testID="checkBox"
          accessibilityLabel="checkBox"
            boxType="circle"
            style={Styles.checkBoxMargin}
            value={
              this.state.experience.current_work === '0' ||
              this.state.experience.current_work === '' ||
              this.state.experience.current_work === null ||
              this.state.experience.current_work === undefined
                ? false
                : true
            }
            tintColors={{true: APP_PRIMARY_COLOR, false: CARD_SUB_TEXT_COLOR}}
            onValueChange={() =>
              this.handleCheckBox(
                'current_work',
                this.state.experience.current_work,
              )
            }
          />

          <Text style={Styles.CurrentWork}
          testID="currentlyWorkingThisRoleText"
          accessibilityLabel="currentlyWorkingThisRoleText">
            {t('PROFILE.IAMCURRENTLYWORKINGINTHISROLE')}
          </Text>
        </View>
        {/* DateSection */}
        <View style={Styles.ExpdateView}>
          <View style={[Styles.TextInputView, Styles.flex]}>
            <Text style={[Styles.labelText, Styles.marginTop15]}
            testID="fromDateText"
            accessibilityLabel="fromDateText">
              {t('PROFILE.FROMDATE')}
            </Text>
            <View style={Styles.flex}>
              <DatePicker
              testID="datePicker"
              accessibilityLabel="datePicker"
                maxDate={new Date()}
                style={Styles.DatePicker}
                date={this.state.experience.from_date}
                mode="date"
                placeholder="Select from date"
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: Styles.dateIcon,
                  dateInput: Styles.dateInput,
                }}
                onDateChange={(date) => this.handleFromDate(date, 'from_date')}
              />
            </View>
          </View>

          <View style={[Styles.TextInputView, Styles.flex]}>
            <Text style={[Styles.labelText, Styles.marginTop15]}
            testID="tillDateText"
            accessibilityLabel="tillDateText">
              {t('PROFILE.TILLDATE')}
            </Text>
            <View style={Styles.flex}>
              <DatePicker
              testID="datePicker"
              accessibilityLabel="datePicker"
                maxDate={new Date()}
                style={Styles.DatePicker}
                date={this.state.experience.till_date}
                mode="date"
                placeholder="Select till date"
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: Styles.dateIcon,
                  dateInput: Styles.dateInput,
                }}
                onDateChange={(date) => this.handleTillDate(date, 'till_date')}
              />
            </View>
          </View>
        </View>

        {/* NextButton/exp */}

        <View style={Styles.ExpNxtButtonView}>
          <Button
          testID="nextButton"
          accessibilityLabel="nextButton"
            onPress={() => this.navigateTo()}
            style={Styles.BasicNextButtonView}>
            <Text style={Styles.ButtonText}
            testID="nextText"
            accessibilityLabel="nextText">{t('DOCTOR_REGISTER.NEXT')}</Text>
          </Button>
        </View>
      </View>
    );
  }
  render() {
    return (
      <Container style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
        {this.Header()}
        <Content>{this.ExperienceDetails()}</Content>
      </Container>
    );
  }
}

export default withTranslation()(ExperienceScreen);