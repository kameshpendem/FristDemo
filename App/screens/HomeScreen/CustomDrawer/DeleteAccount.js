import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import NavRoutes from '../../../constants/NavRoutes';
import AuthUtils from '../../../utils/AuthUtils';
import {withTranslation} from 'react-i18next';
import {
  Row,
  Col,
  Content,
  Container,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  Button,
  Toast as NativeBaseToast,
  Footer,
} from 'native-base';
import {
  CodeField,
  useBlurOnFulfill,
} from 'react-native-confirmation-code-field';
import Modal from 'react-native-modal';
// import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import Communications from 'react-native-communications';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  DEFAULT_LIGHT_GREY_COLOR,
} from '../../../themes/variable';
import i18n from '../../../../i18n';
import {theme} from '../../../themes/Theme';
import getBaseUrl from '../../../config/Config';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Styles from './DeleteAccountStyles';
// import {deleteAcount} from '../services/AppointmentsServices';
import { NativeToast, NativeToastTop } from '../../app/common/Toaster';
class DeleteAccount extends Component {
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
    };
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
    this._unsubscribe = this.props.navigation.addListener('didFocus', () => {
      // this.startTimer();
      const {details} = this.props?.navigation?.state?.params;
      // this.setState({otp: details});
      this.setState({
        pin1: '',
        pin2: '',
        pin3: '',
        pin4: '',
        pin5: '',
        pin6: '',
        time: 30,
        otp: details,
      });
    });
    this.startTimer();
    const {details} = this.props?.navigation?.state?.params;
    this.setState({
      pin1: '',
      pin2: '',
      pin3: '',
      pin4: '',
      pin5: '',
      pin6: '',
      time: 30,
      otp: details,
    });
  }

  componentWillUnmount() {
    // BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.props.navigation.navigate('Dashboard'),
    // );
  }

  ResendOtp = async () => {
    try {
      const url = getBaseUrl() + 'v1/auth/send-otp';
      let details = this.state.otp;
      const payload = {
        phone_code: this.props.navigation.state.params.phone_code,
        phone_number: this.props.navigation.state.params.phone_number,
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
          text: 'Otp sent successfully',
          duration: 3000,
          type: 'success',
        });
      }
    } catch (error) {
      NativeBaseToast.show({
        text: error?.message || 'Error while sending otp!',
        duration: 3000,
        type: 'danger',
      });
    }
  };
  logout1 = async () => {
    let url = getBaseUrl() + "logout";
    const deviceRegID = await AsyncStorage.getItem("deviceRegID");
    const hlp = await AsyncStorage.getItem("doctorid");
    const selectedCountry = await AuthUtils.getUserCountry();
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hlp: hlp,
        device_id: deviceRegID
      })
    })
      .then((response) => {
        return response.message;
        //RNRestart.Restart();
      })
      .catch((error) => {
        console.error(error);
      });
    const deviceToken = await AsyncStorage.getItem("jwt_token");
    let putUrl = getBaseUrl() + `v1/user/device-token/${deviceRegID}`;
    fetch(putUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${deviceToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        return res.message;
      })
      .catch((error) => {
        console.error(error);
      });
    AsyncStorage.clear();
    this.props.navigation.navigate("SignIn");
    AuthUtils.setUserCountry(selectedCountry);
  };
  logout = async () => {
    const device_token = await AsyncStorage.getItem('jwt_token');
    let putUrl = getBaseUrl() + `v1/user/delete-account`;
    let payload = JSON.stringify({
      deleted_reason: this.props.navigation.state.params.comment_text,
    });
    const head = {
      headers: {
        Authorization: `Bearer ${device_token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    let res = await fetch(putUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${device_token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: payload,
    })
      .then(res => res.json())
      .then(json => {
        if (json?.status_type == 'Success') {
          NativeToastTop({text: json?.message, type: 'success'});

          this.logout1();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  verifyOtp = async () => {
    const {t} = this.props;
    try {
      const url = getBaseUrl() + 'v1/auth/verify-otp';
      let otpObject = this.state.otp;
      const payload = {
        phone_code: this.props.navigation.state.params.phone_code,
        phone_number: this.props.navigation.state.params.phone_number,
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
        try {
          this.logout();
        } catch (e) {
          console.log('error' + e);
        }
      }
    } catch (err) {
      console.log(err);
      NativeBaseToast.show({
        text: 'Please enter correct otp to proceed',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  OtpSection() {
    const {t} = this.props;
    return (
      <View>
        <View style={Styles.cancelIconView}>
          {/* <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Dashboard')}>
            <CloseIcon style={Styles.cancelIcon} />
          </TouchableOpacity> */}
        </View>
        <View style={Styles.OtpView}>
          <View style={Styles.OtpTextView}>
            <Text style={Styles.OtpText}
            testID="enterTheSixDigitCodeText"
            accessibilityLabel="enterTheSixDigitCodeText">
              {i18n.t('DOCTOR_REGISTER.ENTER_THE_SIX_DIGIT_CODE_SENT_TO')}

              <Text style={Styles.otpSentNumber}
              testID="phoneNumberText"
              accessibilityLabel="phoneNumberText">
                {this.props.navigation.state.params.phone_code}{' '}
                {this.props.navigation.state.params.phone_number}
              </Text>
            </Text>
          </View>
        </View>

        <View style={Styles.OtpinputView}>
          <TextInput
          testID="phonePadTextInput1"
          accessibilityLabel="phonePadTextInput1"
            ref={ref => {
              this.pin1Ref = ref;
            }}
            autoFocus={true}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin1}
            onChangeText={pin1 => {
              this.setState({pin1: pin1});
              if (this.state.pin1 != '') {
                this.pin1Ref.focus();
              } else {
                this.pin2Ref.focus();
              }
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="phonePadTextInput2"
          accessibilityLabel="phonePadTextInput2"
            ref={ref => {
              this.pin2Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin2}
            onKeyPress={({nativeEvent}) => {
              nativeEvent.key === 'Backspace' ? this.pin1Ref.focus() : '';
            }}
            onChangeText={pin2 => {
              this.setState({pin2: pin2});
              if (this.state.pin2 != '') {
                this.pin1Ref.focus();
              } else {
                this.pin3Ref.focus();
              }
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="phonePadTextInput3"
          accessibilityLabel="phonePadTextInput3"
            ref={ref => {
              this.pin3Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin3}
            onKeyPress={({nativeEvent}) => {
              nativeEvent.key === 'Backspace' ? this.pin2Ref.focus() : '';
            }}
            onChangeText={pin3 => {
              this.setState({pin3: pin3});
              if (this.state.pin3 != '') {
                this.pin2Ref.focus();
              } else {
                this.pin4Ref.focus();
              }
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="phonePadTextInput4"
          accessibilityLabel="phonePadTextInput4"
            ref={ref => {
              this.pin4Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin4}
            onKeyPress={({nativeEvent}) => {
              nativeEvent.key === 'Backspace' ? this.pin3Ref.focus() : '';
            }}
            onChangeText={pin4 => {
              this.setState({pin4: pin4});
              if (this.state.pin4 != '') {
                this.pin3Ref.focus();
              } else {
                this.pin5Ref.focus();
              }
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="phonePadTextInput5"
          accessibilityLabel="phonePadTextInput5"
            ref={ref => {
              this.pin5Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin5}
            onKeyPress={({nativeEvent}) => {
              nativeEvent.key === 'Backspace' ? this.pin4Ref.focus() : '';
            }}
            onChangeText={pin5 => {
              this.setState({pin5: pin5});
              if (this.state.pin5 != '') {
                this.pin4Ref.focus();
              } else {
                this.pin6Ref.focus();
              }
            }}
            style={Styles.OtpInputs}
          />
          <TextInput
          testID="phonePadTextInput6"
          accessibilityLabel="phonePadTextInput6"
            ref={ref => {
              this.pin6Ref = ref;
            }}
            maxLength={1}
            keyboardType={'phone-pad'}
            value={this.state.pin6}
            onKeyPress={({nativeEvent}) => {
              nativeEvent.key === 'Backspace' ? this.pin5Ref.focus() : '';
            }}
            onChangeText={pin6 => {
              this.setState({pin6: pin6});
              if (this.state.pin6 != '') {
                this.pin5Ref.focus();
              }
            }}
            style={Styles.OtpInputs}
          />
        </View>

        {this.state.time !== 0 && (
          <View style={Styles.sendOtpMainView}
          testID="resendCodeInText"
          accessibilityLabel="resendCodeInText">
            <Text style={Styles.Resend}>
              {i18n.t('ADD_PATIENT.RESEND_CODE_IN')} {this.state.time}
            </Text>
          </View>
        )}

        {this.state.time <= 0 && (
          <View style={Styles.sendOtpMainView}>
            <Text style={Styles.sendOtp}
            testID="sendText"
            accessibilityLabel="sendText">{i18n.t('DELETE.SEND')}</Text>
            <TouchableOpacity onPress={() => this.ResendOtp()}
            testID="clickTouch"
            accessibilityLabel="clickTouch">
              <Text style={Styles.optClickHereText}
              testID="clickText"
              accessibilityLabel="clickText">
                {i18n.t('DELETE.CLICK')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* OptButton */}
        <Footer style={[styles.footer, {justifyContent: 'space-between'}]}>
          <View style={styles.flex}>
            <Button
              onPress={() => this.props.navigation.navigate('Dashboard')}
              style={Styles.ConfirmDeletionbutton}
              testID="cancelButton"
              accessibilityLabel="cancelButton">
              <Text style={Styles.ButtonText1}
              testID="cancelText" accessibilityLabel="cancelText">{i18n.t('DELETE.CANCEL')} </Text>
            </Button>
          </View>

          <View style={styles.flex}>
            <Button
              style={Styles.CancelDeletionbutton}
              onPress={() => this.verifyOtp()}
              testID="confirmButton" accessibilityLabel="confirmButton">
              <Text style={Styles.ButtonText2}
               testID="confirmText" accessibilityLabel="confirmText">{i18n.t('DELETE.CONFIRM')}</Text>
            </Button>
          </View>
        </Footer>
      </View>
    );
  }
  render() {
    const phone_no_call = global.phone_code + ' ' + global.phone_no_val;
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, height: 100}}
        style={{flexDirection: 'column', flex: 1}}>
        <Container>
          {/* <Header
            androidStatusBarColor={APP_PRIMARY_COLOR}
            style={{backgroundColor: APP_PRIMARY_COLOR}}>
            <Left>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="md-arrow-back" style={{color: '#FFF'}} />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={{color: '#FFF', fontSize: 17}}>
                {i18n.t('DELETE.TITLE')}{' '}
              </Title>
            </Body>
            <Right />
          </Header> */}
          <Content style={{marginLeft: 15, marginTop: 15}}>
            <View style={styles.comm}>
              <Text style={styles.text} testID="areYouSurYouWantToDeleteYourAccountText"
              accessibilityLabel="areYouSurYouWantToDeleteYourAccountText">{i18n.t('DELETE.TEXT')} </Text>
            </View>
            <View style={styles.comm}>
              <Text style={styles.text1}
              testID="informationText"
              accessibilityLabel="informationText">{i18n.t('DELETE.INFO')} </Text>
            </View>
            <Text style={styles.text2}
            testID="otpText"
            accessibilityLabel="otpText">{i18n.t('DELETE.OTP')} </Text>
            <View style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
              {this.OtpSection()}
            </View>
          </Content>
        </Container>
      </ScrollView>
    );
  }
}

export {DeleteAccount};

const styles = StyleSheet.create({
  head: {
    alignItems: 'center',
    marginLeft: 60,
  },
  comm: {
    marginTop: 10,
  },
  comm1: {
    marginTop: 40,
  },
  addloc: {
    marginLeft: 20,
    marginTop: 40,
  },
  box: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  address: {
    flexDirection: 'column',
    backgroundColor: 'white',
    marginLeft: 70,
    marginTop: -50,
  },
  text: {
    paddingLeft: 5,
    fontFamily: theme.fontFamily.primarySemiBold,
    color: DEFAULT_BLACK_COLOR,
    lineHeight: 25,
    fontSize: theme.fontSizes.ml,
  },
  text1: {
    paddingLeft: 5,
    fontFamily: theme.fontFamily.primarySemiBold,
    color: DEFAULT_GREY_COLOR,
    lineHeight: 25,
    fontSize: theme.fontSizes.ml,
  },
  text2: {
    paddingLeft: 5,
    fontFamily: theme.fontFamily.primarySemiBold,
    color: DEFAULT_GREY_COLOR,
    lineHeight: 25,
    fontSize: theme.fontSizes.ml,
    marginTop: 30,
  },
  htext: {
    fontSize: 16,
    marginLeft: 20,
    fontWeight: 'bold',
    height: 50,
  },

  Adtext: {
    fontSize: 14,
  },
  container: {
    height: 300,
    marginTop: 10,
  },
  list: {
    //paddingHorizontal: 5,
    height: 50,
    backgroundColor: 'white',
  },
  listContainer: {
    alignItems: 'center',
  },
  /******** card **************/
  card: {
    marginHorizontal: 2,
    marginVertical: 2,
    flexBasis: '40%',
    marginTop: 10,
    height: 100,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: -2,
    },
    elevation: 4,
  },

  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    color: '#345D7E',
    fontWeight: '500',
    alignSelf: 'center',
  },
  inputbox: {
    marginLeft: 10,
    marginTop: 30,
    backgroundColor: 'white',
    height: 150,
    width: 300,
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 30,
  },
  cardImage: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
  modalPaddingStyles: {
    padding: 0,
    margin: 0,
    height: 450,
  },
  flex: {
    flex: 1,
  },
  otpModal: {
    marginTop: 'auto',
    backgroundColor: DEFAULT_GREY_COLOR,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    shadowColor: DEFAULT_GREY_COLOR,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderColor: DEFAULT_GREY_COLOR,
  },
  headerView: {
    flexDirection: 'row',
    height: 50,
    paddingTop: 15,
  },
  otpHeader: {
    fontSize: theme.fontSizes.ml,
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    paddingTop: 5,
    marginLeft: 10,
  },
  footer: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    height: 80,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingLeft: 15,
    paddingRight: 20,
    marginTop: 220,
  },
});
