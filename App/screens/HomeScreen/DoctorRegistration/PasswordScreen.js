import {
  View,
  Header,
  Left,
  Body,
  Button,
  Toast as NativeBaseToast,
  Container,
  Content,
  Toast,
} from 'native-base';

import Icon3 from 'react-native-vector-icons/Feather';
import React, {Component} from 'react';
import {Text, TouchableOpacity, Image, TextInput} from 'react-native';
import {withTranslation} from 'react-i18next';
import RNFetchBlob from 'rn-fetch-blob';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CheckIcon from '../ImageComponents/CheckInActiveIcon';
import CheckActiveIcon from '../ImageComponents/CheckActiveIcon';

import AppLoader from '../Common/AppLoader';

// styles
import Styles from './DoctorRegistrationStyles';

// utils and functions
import {
  isUpper,
  isLower,
  isNumber,
  specialCharacter,
  passwordLength,
} from './PasswordValidator';

// themes
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';

//images
import LogoWhite from '../../../assets/images/logo_white.png';
import getBaseUrl from '../../../config/Config';
import axios from 'axios';
class PasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password_text: '',
      passwordValidate: true,
      length_flag: false,
      number_flag: false,
      upper_case_flag: false,
      lower_case_flag: false,
      special_character_flag: false,
      details: {},
      loader: false,
    };
  }

  handlePassword = (text) => {
    const uflag = isUpper(text);
    const lflag = isLower(text);
    const sFlag = specialCharacter(text);
    const plFlag = passwordLength(text);
    const nflag = isNumber(text);

    this.setState({
      length_flag: plFlag,
      upper_case_flag: uflag,
      lower_case_flag: lflag,
      number_flag: nflag,
      special_character_flag: sFlag,
      password_text: text,
    });
  };

  componentDidMount() {
    const {details} = this.props?.navigation?.state?.params;
    this.setState({details: details});
  }

  createAccountOld = async () => {
    this.setState({
      loader: true,
    });
    if (
      !this.state.length_flag ||
      !this.state.lower_case_flag ||
      !this.state.number_flag ||
      !this.state.special_character_flag
    ) {
      Toast.show({
        text: 'Please Follow the instructions to create password',
        type: 'warning',
        duration: 3000,
      });
    } else {
      try {
        RNFetchBlob.fetch(
          'POST',
          getBaseUrl() + 'v1/auth/sign-up/doctor',
          {
            // dropbox upload headers
            'Dropbox-API-Arg': JSON.stringify({
              path: '/img-from-react-native.png',
              mode: 'add',
              autorename: true,
              mute: false,
            }),
            'Content-Type': 'application/octet-stream',
          },
          [
            {
              name: 'doc_certificate',
              filename: Math.round(Math.random() * 1000000) + 'certificate.pdf',
              data: RNFetchBlob.wrap(this.state.details?.doc_certificate),
            },
            {
              name: 'doc_sign',
              filename: Math.round(Math.random() * 1000000) + 'doc_sign.jpg',
              data: RNFetchBlob.wrap(this.state.details?.image),
            },

            {name: 'edu_degree', data: this.state.details?.edu_degree},
            {name: 'edu_college', data: this.state.details?.edu_college},
            {name: 'edu_year', data: this.state.details?.edu_year},

            {name: 'first_name', data: this.state.details?.first_name},
            {name: 'last_name', data: this.state.details?.last_name},
            {name: 'salutation', data: 'Dr'},
            {name: 'phone_code', data: this.state.details?.phone_code},
            {name: 'phone_no', data: this.state.details?.phone_number},
            {name: 'dob', data: this.state.details?.dob},
            {name: 'email', data: this.state.details?.email},
            {name: 'gender', data: this.state.details?.gender},
            {name: 'password', data: this.state.password_text},
            {
              name: 'registration_number',
              data: this.state.details?.registration_number,
            },
            {
              name: 'year_of_registration',
              data: this.state.details?.year_of_registration,
            },
            {
              name: 'Medical_council',
              data: this.state.details?.medical_council,
            },
            {
              name: 'user_type',
              data: 'Practice'
            },
          ],
        )
          .then((res) => {
            const response = JSON.parse(res.data);
            if (response.message == "Doctor Created.") {
              NativeBaseToast.show({
                text: response.message+' Pending Healpha Activation.',
                type: 'success',
                duration: 3000,
              });
              setTimeout(() => {
                this.setState({
                  loader: false,
                });
                this.props.navigation.navigate('SignIn');
              }, 3000);
            }
            else if (response.message) {
              NativeBaseToast.show({
                text: response.message,
                type: 'success',
                duration: 3000,
              });
              setTimeout(() => {
                this.setState({
                  loader: false,
                });
                this.props.navigation.navigate('SignIn');
              }, 3000);
            }
          })
          .catch(() => {
            NativeBaseToast.show({
              text: 'Unable to create account, Please contact administration',
              type: 'danger',
              duration: 3000,
            });
          });
      } catch (error) {
        NativeBaseToast.show({
          text:
            'Doctor already exists with phone number or email.' ||
            error?.message,
          type: 'danger',
          duration: 3000,
        });
      }
    }
  };
  createAccount = async () => {
    this.setState({
      loader: true,
    });
    if (
      !this.state.length_flag ||
      !this.state.lower_case_flag ||
      !this.state.number_flag ||
      !this.state.special_character_flag
    ) {
      Toast.show({
        text: 'Please Follow the instructions to create password',
        type: 'warning',
        duration: 3000,
      });
      this.setState({
        loader: false,
      });
    } else {
      // try {
        const url = getBaseUrl() + 'v1/auth/sign-up/doctor/web';
        const payload = {
          first_name: this.state.details?.first_name,
          last_name: this.state.details?.last_name,
          salutation: 'Dr',
          phone_code: this.state.details?.phone_code,
          phone_no: this.state.details?.phone_number,
          email: this.state.details?.email,
          password: this.state.password_text,
          user_type: 'practice'
        };
        console.log(payload)
        axios.post(url, payload)
        .then(response => { 
          console.log(response.data.message)
          if (response.data.message == "User Created.") {
            NativeBaseToast.show({
              text: response.data.message+' Pending Healpha Activation.',
              type: 'success',
              duration: 3000,
            });
            setTimeout(() => {
              this.setState({
                loader: false,
              });
              this.props.navigation.navigate('SignIn');
            }, 3000);
          }
          else if (response.data.message) {
            NativeBaseToast.show({
              text: response.data.message,
              type: 'success',
              duration: 3000,
            });
            setTimeout(() => {
              this.setState({
                loader: false,
              });
              this.props.navigation.navigate('SignIn');
            }, 3000);
          }
        })
        .catch(error => {
            NativeBaseToast.show({
              text:
                // 'Doctor already exists with phone number or email.' ||
                error.response.data.message,
              type: 'warning',
              duration: 3000,
            });
        });
    }
  };
  renderHeader() {
    const {t} = this.props;
    return (
      <View>
        <Header androidStatusBarColor={APP_PRIMARY_COLOR} style={Styles.Header}>
          <Left style={Styles.leftHeaverView}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}
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
            testID="healphaImage"
            accessibilityLabel="healphaImage"
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
  PasswordSection() {
    const {t} = this.props;
    return (
      // password
      <View>
        <View style={Styles.BasicDetailsView}>
          <View style={Styles.View}>
            <Text style={Styles.TextView}
            testID="passwordText"
            accessibilityLabel="passwordText">{t('DOCTOR_REGISTER.PASSWORD')}</Text>
            <Text style={Styles.TermsofConditionsText}
            testID="createPasswordText"
            accessibilityLabel="createPasswordText">
              {t('DOCTOR_REGISTER.CREATEPASSWORD')}
            </Text>
          </View>
          <View style={Styles.CircularView}>
            <AnimatedCircularProgress
              size={60}
              width={3}
              //fill={this.state.fill}
              fill={50}
              tintColor={APP_PRIMARY_COLOR}
              backgroundColor="#DBE4E6">
              {(fill) => <Text style={Styles.circleText}>2/2</Text>}
            </AnimatedCircularProgress>
          </View>
        </View>
        {/* Createpassword */}

        <View style={[Styles.TextInputView, Styles.passwordMarginTop]}>
          <Text style={[Styles.labelText, Styles.marginTop15]}
          testID="createPasswordText"
          accessibilityLabel="createPasswordText">
            {t('DOCTOR_REGISTER.CREATEPASSWORD')}
          </Text>
          <View style={[Styles.flexDirectionRow]}>
            <TextInput
            testID="createPasswordTextInput"
            accessibilityLabel="createPasswordTextInput"
              style={Styles.textInput}
              onChangeText={(text) => this.handlePassword(text)}
            />
          </View>
        </View>

        <View style={Styles.PasswordsView}>
          <Text style={Styles.Passwordmust}
           testID="passwordMustContainAtleastText"
           accessibilityLabel="passwordMustContainAtleastText">
            {t('DOCTOR_REGISTER.PASSWORD_MUST_CONTAINS_ATLEAST')}
          </Text>
        </View>

        <View>
          {this.state.length_flag == false ? (
            <View style={Styles.CheckIcon}>
              <CheckIcon 
              testID="passwordcheckIcon"
              accessibilityLabel="passwordcheckIcon"/>
              <Text style={Styles.PasswordText}
              testID="passwordBetweenEightAndSixteenCharactersText"
              accessibilityLabel="passwordBetweenEightAndSixteenCharactersText">
                {t('DOCTOR_REGISTER.PASSWORD_BETWEEN_8_AND_16_CHARACTERS')}
              </Text>
            </View>
          ) : (
            <View style={Styles.CheckIcon}>
              <CheckActiveIcon 
              testID="checkActiPasswordcheckIcon"
              accessibilityLabel="checkActiPasswordcheckIcon"/>
              <Text style={Styles.PasswordTextGreen}
              testID="passwordBetweenEightAndSixteenCharactersText"
              accessibilityLabel="passwordBetweenEightAndSixteenCharactersText">
                {t('DOCTOR_REGISTER.PASSWORD_BETWEEN_8_AND_16_CHARACTERS')}
              </Text>
            </View>
          )}
        </View>

        <View>
          {this.state.upper_case_flag == false ? (
            <View style={Styles.CheckIcon}>
              <CheckIcon 
               testID="uppercaseCheckIcon"
               accessibilityLabel="uppercaseCheckIcon"/>
              <Text style={Styles.PasswordText}
              testID="oneUpperCaseText"
              accessibilityLabel="oneUpperCaseText">
                {' '}
                {t('DOCTOR_REGISTER.ONE_UPPERCASE')}
              </Text>
            </View>
          ) : (
            <View style={Styles.CheckIcon}>
              <CheckActiveIcon 
               testID="upperCaseCheckActiveIcon"
               accessibilityLabel="upperCaseCheckActiveIcon"/>
              <Text style={Styles.PasswordTextGreen}
              testID="oneUpperCaseText"
              accessibilityLabel="oneUpperCaseText">
                {' '}
                {t('DOCTOR_REGISTER.ONE_UPPERCASE')}
              </Text>
            </View>
          )}
        </View>

        <View>
          {this.state.number_flag == false ? (
            <View style={Styles.CheckIcon}>
              <CheckIcon 
               testID="oneNumberTextCheckActiveIcon"
               accessibilityLabel="oneNumberTextCheckActiveIcon"/>

              <Text style={Styles.PasswordText}
              testID="oneNumberText"
              accessibilityLabel="oneNumberText">
                {' '}
                {t('DOCTOR_REGISTER.ONE_NUMBER')}
              </Text>
            </View>
          ) : (
            <View style={Styles.CheckIcon}>
              <CheckActiveIcon 
               testID="oneNumberTextCheckActiveIcon"
               accessibilityLabel="oneNumberTextCheckActiveIcon"/>

              <Text style={Styles.PasswordTextGreen}
               testID="oneNumberText"
               accessibilityLabel="oneNumberText">
                {' '}
                {t('DOCTOR_REGISTER.ONE_NUMBER')}
              </Text>
            </View>
          )}
        </View>

        <View>
          {this.state.special_character_flag == false ? (
            <View style={Styles.CheckIcon}>
              <CheckIcon 
               testID="specialCharCheckActiveIcon"
               accessibilityLabel="specialCharCheckActiveIcon"/>

              <Text style={Styles.PasswordText}
               testID="oneSpecialCharacterText"
               accessibilityLabel="oneSpecialCharacterText">
                {' '}
                {t('DOCTOR_REGISTER.ONE_SPECIAL_CHARACTER')}
              </Text>
            </View>
          ) : (
            <View style={Styles.CheckIcon}>
              <CheckActiveIcon 
               testID="specialCharCheckActiveIcon"
               accessibilityLabel="specialCharCheckActiveIcon"/>

              <Text style={Styles.PasswordTextGreen}
               testID="oneSpecialCharacterText"
               accessibilityLabel="oneSpecialCharacterText">
                {' '}
                {t('DOCTOR_REGISTER.ONE_SPECIAL_CHARACTER')}
              </Text>
            </View>
          )}
        </View>

        {/* Create Account */}

        <View style={Styles.CreateAccont}>
          <Button
           testID="createAccountButton"
           accessibilityLabel="createAccountButton"
            onPress={() => this.createAccount()}
            style={Styles.BasicNextButtonView}>
            {this.state.loader ? (
              <AppLoader size={'small'} color={DEFAULT_WHITE_COLOR} />
            ) : (
              <Text style={Styles.ButtonText}
              testID="createAccountText"
              accessibilityLabel="createAccountText">
                {t('DOCTOR_REGISTER.CREATE_ACCOUNT')}
              </Text>
            )}
          </Button>
        </View>
      </View>
    );
  }
  render() {
    return (
      <Container>
        {this.renderHeader()}
        <Content style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
          {this.PasswordSection()}
        </Content>
      </Container>
    );
  }
}

export default withTranslation()(PasswordScreen);
