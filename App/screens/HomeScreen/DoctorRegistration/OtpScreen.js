import React, {Component} from 'react';
import {View, Button, Toast as NativeBaseToast} from 'native-base';
import {Text, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import {withTranslation} from 'react-i18next';
import axios from 'axios';

import {DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import Styles from './DoctorRegistrationStyles';
import getBaseUrl from '../../../config/Config';

// images
import Cross from '../ImageComponents/Close.js';
import {getAndVerifyForgotPasswordOTp} from '../../../services/ForgotPasswordService';
import NavRoutes from '../../../constants/NavRoutes';

class Otpscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin1: '',
      pin2: '',
      pin3: '',
      pin4: '',
      pin5: '',
      pin6: '',
      time: 30,
      otp: {},
      email_mobile_text: '',
      from_forgot_password: '',
    };
    this.pin1Ref = React.createRef();
    this.pin2Ref = React.createRef();
    this.pin3Ref = React.createRef();
    this.pin4Ref = React.createRef();
    this.pin5Ref = React.createRef();
    this.pin6Ref = React.createRef();
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  };

  tick = () => {
    let time = this.state.time;
    if (time > 0) {
      time -= 1;
      this.setState({time});
    }
  };

  componentDidMount() {
    this.startTimer();
    const {details, from_forgot_password, email_mobile_text} =
      this.props?.navigation?.state?.params;
    this.setState({otp: details, email_mobile_text, from_forgot_password});
  }

  ResendOtp = async () => {
    try {
      const {email_mobile_text, from_forgot_password} = this.state;
      const {t} = this.props;
      if (from_forgot_password) {
        const requestBody = {
          email: email_mobile_text,
          user_type: 'doctor',
        };
        await getAndVerifyForgotPasswordOTp(requestBody);
        this.setState({
          time: 30,
        });
      } else {
        const url = getBaseUrl() + 'v1/auth/send-otp';
        let details = this.state.otp;
        const payload = {
          phone_code: details?.phone_code,
          phone_number: details?.phone_number,
        };
        let response = await axios.post(url, payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (response) {
          this.setState({
            time: 30,
          });
          NativeBaseToast.show({
            text: t('HELP.OTP_SCREEN.OTP_SUCCESS'),
            duration: 3000,
            type: 'success',
          });
        }
      }
    } catch (error) {
      NativeBaseToast.show({
        text: error?.message || t('HELP.OTP_SCREEN.OTP_ERROR'),
        duration: 3000,
        type: 'danger',
      });
    }
  };

  VerifyOTP = async () => {
    const {from_forgot_password, email_mobile_text} = this.state;
    const {t} = this.props;

    try {
      if (from_forgot_password) {
        const requestBody = {
          email: email_mobile_text,
          user_type: 'doctor',
          otp:
            this.state.pin1 +
            this.state.pin2 +
            this.state.pin3 +
            this.state.pin4 +
            this.state.pin5 +
            this.state.pin6,
        };
        const response = await getAndVerifyForgotPasswordOTp(requestBody);
        if (response && response?.data?.token) {
          this.props.navigation.navigate(
            NavRoutes.PUBLIC.FORGOT_PASSWORD_INPUTS,
            {
              from_forgot_password: true,
              email_mobile_text: email_mobile_text,
              token: response?.data?.token,
            },
          );
        }
      } else {
        const url = getBaseUrl() + 'v1/auth/verify-otp';
        let otpObject = this.state.otp;
        const payload = {
          phone_code: otpObject?.phone_code,
          phone_number: otpObject?.phone_number,
          code:
            this.state.pin1 +
            this.state.pin2 +
            this.state.pin3 +
            this.state.pin4 +
            this.state.pin5 +
            this.state.pin6,
        };
        let OtpResponse = await axios.post(url, payload, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (OtpResponse) {
          this.setState({
            pin1: '',
            pin2: '',
            pin3: '',
            pin4: '',
            pin5: '',
            pin6: '',
            time: 30,
          });
          this.props.navigation.navigate('PasswordScreen', {
            details: this.state.otp,
          });
        }
      }
    } catch (err) {
      NativeBaseToast.show({
        text: t('HELP.OTP_SCREEN.ENTER_CORRECT_OTP'),
        type: 'warning',
        duration: 3000,
      });
    }
  };

  OtpSection() {
    const {t} = this.props;
    return (
      <View>
        <View style={Styles.OtpView}>
          <View style={Styles.OtpTextView}>
            <Text style={Styles.OtpText}
            testID="enterSixDigitCodeSentText"
            accessibilityLabel="enterSixDigitCodeSentText">
              {t('DOCTOR_REGISTER.ENTER_THE_SIX_DIGIT_CODE_SENT_TO')}
              {'\n'}
              <Text style={Styles.otpSentNumber}
              testID={this.state.otp?.phone_number+"text"}
              accessibilityLabel={this.state.otp?.phone_number+"text"}>
                {this.state.otp?.phone_code} {this.state.otp?.phone_number}
                {this.state.email_mobile_text}
              </Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}
          testID="crossTouch"
          accessibilityLabel="crossTouch">
            <View style={Styles.CrossView}>
              <Cross 
              testID="crossImage"
              accessibilityLabel="crossImage"/>
            </View>
          </TouchableOpacity>
        </View>

        <View style={Styles.OtpinputView}>
          <TextInput
          testID="otpInput1"
          accessibilityLabel="otpInput1"
            ref={(ref) => {
              this.pin1Ref = ref;
            }}
            autoFocus={true}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin1}
            onChangeText={(pin1) => {
              this.setState({pin1: pin1});
              pin1 ? this.pin2Ref.focus() : this.pin1Ref.focus();
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="otpInput2"
          accessibilityLabel="otpInput2"
            ref={(ref) => {
              this.pin2Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin2}
            onChangeText={(pin2) => {
              pin2 ? this.pin3Ref.focus() : this.pin1Ref.focus();
              this.setState({pin2: pin2});
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="otpInput3"
          accessibilityLabel="otpInput3"
            ref={(ref) => {
              this.pin3Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin3}
            onChangeText={(pin3) => {
              this.setState({pin3: pin3});
              pin3 ? this.pin4Ref.focus() : this.pin2Ref.focus();
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="otpInput4"
          accessibilityLabel="otpInput4"
            ref={(ref) => {
              this.pin4Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin4}
            onChangeText={(pin4) => {
              this.setState({pin4: pin4});
              pin4 ? this.pin5Ref.focus() : this.pin3Ref.focus();
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="otpInput5"
          accessibilityLabel="otpInput5"
            ref={(ref) => {
              this.pin5Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin5}
            onChangeText={(pin5) => {
              this.setState({pin5: pin5});
              pin5 ? this.pin6Ref.focus() : this.pin4Ref.focus();
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="otpInput6"
          accessibilityLabel="otpInput6"
            ref={(ref) => {
              this.pin6Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin6}
            onChangeText={(pin6) => {
              this.setState({pin6: pin6});
              pin6 ? this.pin6Ref.focus() : this.pin5Ref.focus();
            }}
            style={Styles.OtpInputs}
          />
        </View>

        {this.state.time !== 0 && (
          <Text style={Styles.Resend}
          testID={this.state.time+"resendCodeInText"}
          accessibilityLabel={this.state.time+"resendCodeInText"}>
            {t('DOCTOR_REGISTER.RESEND_CODE_IN')} {this.state.time}
          </Text>
        )}

        {this.state.time <= 0 && (
          <View style={Styles.sendOtpMainView}>
            <Text style={Styles.sendOtp}
             testID="toSendOtpAgainText"
             accessibilityLabel="toSendOtpAgainText">
              {t('DOCTOR_REGISTER.TO_SEND_OTP_AGAIN')}
            </Text>
            <TouchableOpacity onPress={() => this.ResendOtp()}
            testID="clickHereTouch"
            accessibilityLabel="clickHereTouch">
              <Text style={Styles.optClickHereText}
              testID="clickHereText"
              accessibilityLabel="clickHereText">
                {' '}
                {t('DOCTOR_REGISTER.CLICK_HERE')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* OptButton */}
        <View style={Styles.OtpButtonView}>
          <Button
            onPress={() => this.VerifyOTP()}
            style={Styles.BasicNextButtonView}
            testID="continueButton"
            accessibilityLabel="continueButton">
            <Text style={Styles.ButtonText}
            testID="continueText"
            accessibilityLabel="continueText">
              {t('DOCTOR_REGISTER.CONTINUE')}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
        {this.OtpSection()}
      </View>
    );
  }
}

export default withTranslation()(Otpscreen);
