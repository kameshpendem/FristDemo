import {View, Button, Toast as NativeBaseToast} from 'native-base';
import Toast from 'react-native-simple-toast';
import React, {Component} from 'react';
import {Text, Linking, TouchableOpacity, TextInput, Image} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
// import CountryPicker from 'react-native-country-codes-picker';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
// import { Picker as SelectPicker } from '@react-native-picker/picker';
import Styles from './DoctorRegistrationStyles';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import getBaseUrl, {getEnvironmentObject} from '../../../config/Config';

// images
import DropDownArrow from '../../../assets/images/dropdown.png';
import AuthUtils from '../../../utils/AuthUtils';
import CountrySelection from '../../Auth/CountrySelection/CountrySelection';
import i18n from '../../../../i18n';
import moment from 'moment';
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {
        phone_code: '',
      },

      firstNameValidate: true,
      lastNameValidate: true,
      email: '',
      emailIdValidate: true,
      show: false,
      countrySelected: false,
      selectedCountryName: '',
      selectedCountryLabel: '',
      date_show: false,
    };
  }
  phone_code = async () => {
    const environment = await getEnvironmentObject();
    let details = this.state.details;
    const phone_code = environment?.country_code;
    details.phone_code = phone_code;
    this.setState({
      details: details,
    });
  };

  setCountry = async () => {
    const selectedCountry = await AuthUtils.getUserCountry();
    this.setState(() => ({
      countrySelected: false,
      selectedCountryName: selectedCountry,
      selectedCountryLabel:
        selectedCountry == 'in'
          ? 'India'
          : selectedCountry == 'sl'
          ? 'Sri Lanka'
          : '',
    }));
  };
  componentDidMount() {
    this.phone_code();
    this.setCountry();
  }

  openTermsAndServices = () => {
    const {t} = this.props;
    try {
      Linking.openURL('https://www.healpha.com/terms-of-service/');
    } catch (error) {
      Toast.show({
        text:
          (error && error.message) || t('LOGIN.TERMS_OF_SERVICE_OPEN_ERROR'),
        type: 'warning',
        duration: 3000,
        position: 'top',
      });
    }
  };

  askOTP = async () => {
    const {t} = this.props;
    if (!this.state.selectedCountryName) {
      Toast.show('Please Select Country', Toast.SHORT);
    } else if (
      !this.state.details?.first_name ||
      !this.state.firstNameValidate
    ) {
      Toast.show(i18n.t('PERSON_REGISTRATION.ENTER_FNAME'), Toast.SHORT);
    } else if (!this.state.details?.last_name || !this.state.lastNameValidate) {
      Toast.show(i18n.t('PERSON_REGISTRATION.ENTER_LNAME'), Toast.SHORT);
    } else if (
      !this.state.details?.phone_number ||
      !this.state.details?.phone_code
    ) {
      Toast.show(i18n.t('PERSON_REGISTRATION.ENTER_PHONE_NO'), Toast.SHORT);
    } else if (!this.state.details?.email || !this.state.emailIdValidate) {
      Toast.show(i18n.t('LOGIN.ENTER_EMAIL'), Toast.SHORT);
    }
    //  else if (!this.state.details?.dob) {
    //   Toast.show(i18n.t('COMMON.PLS_DATE'), Toast.SHORT);
    // } else if (!this.state.details?.gender) {
    //   Toast.show(i18n.t('PERSON_REGISTRATION.GEN_DER'), Toast.SHORT);
    // }
     else {
      try {
        const url = getBaseUrl() + 'v1/auth/send-otp';
        let otpObject = this.state.details;
        const payload = {
          phone_code: otpObject.phone_code,
          phone_number: otpObject.phone_number,
        };
        let OtpResponse = await axios.post(url, payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (OtpResponse) {
          this.props.navigation.navigate('Otpscreen', {
            details: otpObject,
            from_forgot_password: false,
            email_mobile_text: '',
          });
        }
      } catch (error) {
        NativeBaseToast.show({
          text: error?.message || t('PROFILE.DATANOTSAVED'),
          duration: 5000,
        });
      }
    }
  };

  validate_name(text, type) {
    const details = this.state.details;
    details[type] = text;
    this.setState({
      details: details,
    });

    let alph = /^[a-zA-Z\s]+$/;
    if (type === 'first_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            first_name: text,
          });
          this.setState({firstNameValidate: true});
        } else {
          this.setState({
            first_name: '',
          });
          this.setState({firstNameValidate: false});
        }
      } else {
        this.setState({
          first_name: '',
        });
      }
    } else if (type === 'last_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            last_name: text,
          });
          this.setState({lastNameValidate: true});
        } else {
          this.setState({
            last_name: '',
          });
          this.setState({lastNameValidate: false});
        }
      } else {
        this.setState({
          last_name: '',
        });
      }
    }
  }

  validate = (text, type) => {
    const details = this.state.details;
    details[type] = text;
    this.setState({
      details: details,
    });

    let email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{1,4})$/;
    if (!email.test(text)) {
      this.setState({email: ''});
      this.state.emailIdValidate = false;
    } else {
      this.setState({email: text});
      this.state.emailIdValidate = true;
    }
  };

  handleInputText = (text, type) => {
    const details = this.state.details;
    details[type] = text;
    this.setState({
      details: details,
    });
  };

  handleDateOfBirth = (event,date) => {
    if (event.type === "dismissed") {
      this.setState({ date_show: false });
      return;
    }else{
      this.setState({ date_show: false });
      this.handleInputText(date, 'dob');
    }
  };

  handleGenderSection = (value) => {
    this.handleInputText(value, 'gender');
  };

  handlePhoneCode = () => {
    this.setState({
      show: true,
    });
  };
  enableDatePicker = (date) => {
    this.setState((prevState) => ({
      date_show: !prevState.date_show,
    }));
  };
  openCountrySelection = () => {
    this.setState(() => ({
      countrySelected: true,
    }));
  };

  BasicDetailsSection1() {
    const {t} = this.props;
    return (
      <View>
        <View style={Styles.BasicDetailsView}>
          <View style={Styles.View}>
            <Text style={Styles.TextView}
             testID="basicDetailsText"
             accessibilityLabel="basicDetailsText">
              {t('DOCTOR_REGISTER.BASIC_DETAILS')}
            </Text>
            <Text style={Styles.SubText}
            testID="addYourDetailsText"
            accessibilityLabel="addYourDetailsText">
              {t('DOCTOR_REGISTER.ADD_YOUR_DETAILS')}
            </Text>
          </View>
          <View style={Styles.CircularView}>
            <AnimatedCircularProgress
              size={50}
              width={3}
              fill={0}
              tintColor={APP_PRIMARY_COLOR}
              backgroundColor="#DBE4E6">
              {(fill) => <Text style={Styles.circleText}
               testID="numberText"
               accessibilityLabel="numberText">1/2</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.marginTop25]}
              testID="countryText"
              accessibilityLabel="countryText">Country</Text>
          <View style={[Styles.countryPicker]}>
            <TouchableOpacity
              style={Styles.touchableView}
              onPress={() => this.openCountrySelection()}
              testID="chooseCountryTouch"
              accessibilityLabel="chooseCountryTouch">
              <Text
                style={
                  this.state.selectedCountryLabel
                    ? Styles.countryText
                    : Styles.countryPlaceHolder
                }
                testID="chooseCountry"
                accessibilityLabel="chooseCountry">
                {this.state.selectedCountryLabel
                  ? this.state.selectedCountryLabel
                  : t('LOGIN.SELECT_COUNTRY')}
              </Text>
              <Image
                source={DropDownArrow}
                style={Styles.dropDownArrow}
                testID="selectCountryIcon"
                accessibilityLabel="selectCountryIcon"
              />
            </TouchableOpacity>
          </View>

          <View style={Styles.horizontalLine} />
        </View>

        {/* FirstName */}
        <View style={Styles.TextInputView}>
          <Text style={[Styles.labelText, Styles.labelMarginTop]}>
            {t('PROFILE.FIRSTNAME')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
              editable={false}
              defaultValue={'Dr.'}
              style={Styles.drTextInput}
              testID="choose Dr."
              accessibilityLabel="choose Dr."
            />
            <TextInput
              style={Styles.textInput}
              onChangeText={(text) => this.validate_name(text, 'first_name')}
              testID="chooseFirstNametextInput"
              accessibilityLabel="chooseFirstNametextInput"
            />
          </View>

          {!this.state.firstNameValidate ? (
            <Text style={Styles.ErrorText} testID="firstNameError">
              *{t('DOCTOR_REGISTER.PLEASE_ENTER_ALPHABETS')}
            </Text>
          ) : null}
        </View>

        <View style={Styles.TextInputView}>
          <Text
            style={[Styles.labelText, Styles.marginTop15]}
            testID="chooseLastNametextInput"
            accessibilityLabel="chooseLastNametextInput">
            {t('PROFILE.LASTNAME')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
              style={Styles.textInput}
              onChangeText={(text) => this.validate_name(text, 'last_name')}
              testID="chooseLastNameIcon"
              accessibilityLabel="chooseLastNameIcon"
            />
          </View>

          {!this.state.lastNameValidate ? (
            <Text style={Styles.ErrorText} testID="lastNameError"
            accessibilityLabel="lastNameError">
              *{t('DOCTOR_REGISTER.PLEASE_ENTER_ALPHABETS')}
            </Text>
          ) : null}
        </View>

        {/* PhoneNumber */}

        <View style={Styles.PhoneNumberView}>
          <View style={Styles.TextInputView}>
            <Text
              style={[Styles.labelText, Styles.marginTop15]}
              testID="phoneNumberText"
              accessibilityLabel="phoneNumberText">
              {t('PROFILE.PHONENUMBER')}
            </Text>
            <View style={[Styles.Phncode, Styles.flexDirectionRow]}>
              <TouchableOpacity
                style={Styles.PhoncodeStyle}
                testID="phoneCodeView"
                accessibilityLabel="phoneCodeView"
                // onPress={() => this.handlePhoneCode()}
              >
                <Text
                 testID={this.state.details.phone_code+"text"}
                 accessibilityLabel={this.state.details.phone_code+"text"}>{this.state.details.phone_code}</Text>
              </TouchableOpacity>
              {this.state.selectedCountryLabel == 'India' ? (
                <TextInput
                  maxLength={10}
                  keyboardType="number-pad"
                  style={Styles.textInput}
                  testID="phoneNumberTextInput"
                  accessibilityLabel="phoneNumberTextInput"
                  onChangeText={(text) =>
                    this.handleInputText(text, 'phone_number')
                  }
                  returnKeyType="done"
                />
              ) : null}
              {this.state.selectedCountryLabel == 'Sri Lanka' ? (
                <TextInput
                  maxLength={9}
                  keyboardType="number-pad"
                  style={Styles.textInput}
                  testID="phoneNumberTextInput"
                  accessibilityLabel="phoneNumberTextInput"
                  onChangeText={(text) =>
                    this.handleInputText(text, 'phone_number')
                  }
                />
              ) : null}
            </View>
            {this.state.selectedCountryLabel == 'India' ? (
              this.state.details?.phone_number?.length < 10 ? (
                <Text style={Styles.ErrorText1} testID="phoneNumberError"
                accessibilityLabel="phoneNumberError">
                  *{t('DOCTOR_REGISTER.PHONE_NUMBER_NOT_LESSTHAN')}
                </Text>
              ) : null
            ) : this.state.details?.phone_number?.length < 9 ? (
              <Text style={Styles.ErrorText1} testID="phoneNumberError"
              accessibilityLabel="phoneNumberError">
                {t('DOCTOR_REGISTER.PHONE_NO_NINE')}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={Styles.TextInputView}>
          <Text
            style={[Styles.labelText, Styles.marginTop15]}
            testID="emailtext"
            accessibilityLabel="emailtext">
            {t('PROFILE.EMAIL')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
              style={Styles.textInput}
              onChangeText={(text) => this.validate(text, 'email')}
              testID="emailtextInput"
              accessibilityLabel="emailtextInput"
            />
          </View>

          {!this.state.emailIdValidate ? (
            <Text style={Styles.EmailValidator} testID="emailError"
            accessibilityLabel="emailError">
              *{t('DOCTOR_REGISTER.INVALIED_EMAIL_ADDRESS')}
            </Text>
          ) : null}
        </View>

        {/* DateOfBirth */}
        {/* <View style={Styles.TextInputView}>
          {/* <TouchableOpacity
            onPress={() => {
              this.setState({
                date_show: true,
              });
            }}> */}
            {/* <Text
              style={[Styles.labelText, Styles.marginTop15]}
              testID="EnterDateOfBirth"
              accessibilityLabel="EnterDateOfBirth">
              {t('PROFILE.DATEOFBIRTH')}
            </Text>
            <View>
            <TouchableOpacity
              onPress={() =>
                 this.enableDatePicker("select_date")
              }
              >
              <Text style={Styles.dateTex}>
                {this.state.details?.dob
                ?moment(this.state.details?.dob).format("YYYY-MM-DD")
                : t('PROFILE.dateOfBirthText')
                }
                </Text>
            </TouchableOpacity>
              {/* <DatePicker
                maxDate={new Date()}
                style={Styles.DatePicker}
                date={this.state.details.dob}
                mode="date"
                placeholder={t('PROFILE.dateOfBirthText')}
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: Styles.dateIcon,
                  dateInput: Styles.dateInput,
                }}
                onDateChange={(date) => this.handleDateOfBirth(date, 'dob')}
                testID="dateOfBirthSelect"
              /> */}

            {/* </View> */}

            {/* {this.state.date_show && (
                <DateTimePicker
                  testID="dateOfBirthSelect"
                  accessibilityLabel="dateOfBirthSelect"
                  value={this.state.details?.dob
                    ? new Date(moment(this.state.details?.dob))
                    : new Date()}
                  display="default"
                  mode={'date'}
                  onChange={(event, date) => {
                    const new_date = moment(date).format('YYYY-MM-DD');
                    this.handleDateOfBirth(event,new_date, 'dob');
                  }}
                  maximumDate={new Date()}
                />
              )} */}
          {/* </TouchableOpacity> */}
        {/* </View>  */}

        {/* Gender */}

        {/* <View style={Styles.TextInputView}>
          <Text
            style={[Styles.labelText, Styles.marginTop25]}
            testID="genderText"
            accessibilityLabel="genderText">
            {t('PROFILE.GENDER')}
          </Text>
          <View style={Styles.pickerMainView}>
            <Picker
              mode="dropdown"
              selectedValue={
                this.state.details.gender ? this.state.details.gender : ''
              }
              onValueChange={(itemValue, itemIndex) =>
                this.handleGenderSection(itemValue)
              }
              testID="chooseGenderIcon"
              accessibilityLabel="chooseGenderIcon">
              <Picker.Item
                label={i18n.t('PROFILE.SELECT')}
                value=""
                style={Styles.selectGenderPickerItem}
                testID="chooseSelectIcon"
                accessibilityLabel="chooseSelectIcon"
              />
              <Picker.Item
                label={i18n.t('PROFILE.MALE')}
                value="male"
                style={Styles.pickerItems}
                testID="chooseMaleIcon"
                accessibilityLabel="chooseMaleIcon"
              />
              <Picker.Item
                label={i18n.t('PROFILE.FEMALE')}
                value="female"
                style={Styles.pickerItems}
                testID="chooseFemaleIcon"
                accessibilityLabel="chooseFemaleIcon"
              />
              <Picker.Item
                label={i18n.t('PROFILE.OTHER')}
                value="other"
                style={Styles.pickerItems}
                testID="chooseOtherIcon"
                accessibilityLabel="chooseOtherIcon"
              />
            </Picker>
          </View>

          <View style={Styles.horizontalLine} />
        </View> */}

        {/* Accept term of services */}

        <View style={Styles.TermsofConditions}>
          <Text
            style={Styles.TermsofConditionsText}
            testID="ChooseAcceptText"
            accessibilityLabel="ChooseAcceptText"
            onPress={() => this.openTermsAndServices()}>
            {t('DOCTOR_REGISTER.BY_CREATING_ACCOUNT_I_ACCEPT')}
            {''}
            <Text style={Styles.UnderlineText}>{t('LOGIN.ACCEPT_TEXT')}</Text>
          </Text>
        </View>
        {/* NextButton */}
        <View style={Styles.BasicNextButton}>
          <Button
            onPress={() => this.askOTP()}
            style={Styles.BasicNextButtonView}
            testID="chooseRegisterNextButton"
            accessibilityLabel="chooseRegisterNextButton">
            <Text style={Styles.ButtonText}>{t('DOCTOR_REGISTER.NEXT')}</Text>
          </Button>
        </View>
      </View>
    );
  }

  setSelectedPhoneCode = (item) => {
    let details = Object.assign({}, this.state.details);
    details.phone_code = item.dial_code;
    this.setState({
      details: details,
      show: false,
    });
  };
  closeCountrySelection = async (item) => {
    global.selectedCountryLabel = item?.label;
    this.setState((prevState) => ({
      countrySelected: false,
      selectedCountryName: item?.value || prevState?.selectedCountryName,
      selectedCountryLabel: item?.label || prevState?.selectedCountryLabel,
    }));

    this.phone_code();
  };
  render() {
    return (
      <View style={Styles.flex}>
        {this.BasicDetailsSection1()}

        <Modal
          isVisible={this.state.show}
          backdropOpacity={0.5}
          onBackdropPress={() => {
            this.setState({
              show: false,
            });
          }}
          style={Styles.modalPaddingStyles}>
          {/* <CountryPicker
            show={this.state.show}
            initialCountry={'in'}
            pickerButtonOnPress={(item) => this.setSelectedPhoneCode(item)}
          /> */}
        </Modal>
        {this.state.countrySelected && (
          <CountrySelection action={this.closeCountrySelection} />
        )}
      </View>
    );
  }
}

export default withTranslation()(Details);
