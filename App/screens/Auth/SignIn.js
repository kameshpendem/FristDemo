import React, {Component} from 'react';
import * as firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {Icon, Row, Col} from 'native-base';
import VersionCheck from 'react-native-version-check';

import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Linking,
  ScrollView,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
import i18n from '../../../i18n';

let authStatus;
class SignIn extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      icon: 'eye-off',
      hidePassword: true,
      checked: false,
      checked1: false,
      isVersionAlert: false,
    };
  }
  versionlinking = () => {
    BackHandler.exitApp();
    Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.healpha_doctor',
    );
    // this.setState({isVersionAlert:false})
  };
  versionlink = () => {
    Alert.alert(
      i18n.t('LOGIN.VERSION_UPDATE_HEADER'),
      i18n.t('LOGIN.VERSION_UPDATE_SUB_TEXT'),
      [
        {
          text: 'Update',
          onPress: () => this.versionlinking(),
        },
      ],
    );
  };
  componentDidMount() {
    if (Platform.OS == 'android') {
      VersionCheck.getLatestVersion({
        provider: 'playStore', // for Android
      }).then((latestVersion) => {
        console.log('latestVersion', latestVersion);
        this.setState({getLatestVersion1: latestVersion});
        console.log(
          'VersionCheck.getCurrentVersion()',
          VersionCheck.getCurrentVersion(),
        );
        this.setState({currentversion: VersionCheck.getCurrentVersion()});
        if (latestVersion > VersionCheck.getCurrentVersion()) {
          this.setState({isVersionAlert: true});
          try {
            PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.CAMERA,
              //PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              //  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
              //PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            ]).then((granted) => {
              console.log('key1');
              Object.entries(granted).map(([key, value]) => {
                console.log('key', key, value);
              });
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          this.setState({isVersionAlert: false});
          try {
            PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.CAMERA,
              //PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              //  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
              //PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            ]).then((granted) => {
              console.log('key1');
              Object.entries(granted).map(([key, value]) => {
                console.log('key', key, value);
              });
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
    } else {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          //PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          //  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          //PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ]).then((granted) => {
          console.log('key1');
          Object.entries(granted).map(([key, value]) => {
            console.log('key', key, value);
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    this.deviceRegistration();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    
    if (enabled) {
      this.deviceRegistration();
    } else {
      this.requestPermission();
    }
  }
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      console.log('permission granted');
      // User has authorised
      this.deviceRegistration();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  deviceRegistration = async () => {
    try {
      await firebase.messaging().hasPermission();
      // const enabled =
      // authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      // authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        await firebase.messaging().requestPermission();
      }
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        this.setState({regToken: fcmToken});
        console.log('token=' + fcmToken + ' enabled=' + enabled);
        await AsyncStorage.setItem('deviceRegID', fcmToken);
      } else {
        // user doesn't have a device token yet
        console.log('Not Found');
      }
      console.log('firebase token=' + fcmToken);
      return fcmToken;
    } catch (error) {
      console.warn('notification token error', error);
    }
  };

  // deviceRegistration = async () => {
  //     const fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //         await AsyncStorage.setItem("deviceRegID", fcmToken)
  //         console.log(fcmToken)
  //     } else {
  //         console.log("Not Found");
  //     }
  //     return fcmToken;
  // };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  signIn = async (response) => {
    console.log("signInsignIn",JSON.stringify(response));
    await AsyncStorage.setItem('obj', JSON.stringify(response));
    // this.deviceRegistration();
    await AsyncStorage.setItem('userToken', response['token'].toString());
    await AsyncStorage.setItem('doctorid', response['nh_id'].toString());
    await AsyncStorage.setItem('doctorname', response['username'].toString());
    await AsyncStorage.setItem('docimage', response['userimage'].toString());
    if (response.role_type == 'Doctor' || response.doctor_flag == '1') {
      this.props.navigation.navigate('LandingPage');
    } else {
      this.loginAlert.showMessage({
        message: i18n.t('LOGIN.AUTHENTICATION_FAILED'),
        description: i18n.t('LOGIN.LOGIN_WITH_DOCTOR_ID'),
        type: 'warning',
        icon: 'auto',
      });
    }
  };
  clickEventListener() {
    Linking.openURL('https://www.healpha.com/terms-of-service/').catch((err) =>
      console.error('An error occurred', err),
    );
  }
  clickEventListener1() {
    Linking.openURL(getBaseUrl() + '/assets/').catch((err) =>
      console.error('An error occurred', err),
    );
  }
  checkbox() {
    // alert("aaaa");
    if (this.state.checked == false) {
      this.setState({
        checked: true,
      });
    } else {
      this.setState({
        checked: false,
      });
    }
  }
  login = (event) => {
    // if (this.state.checked == true) {
    // this.setState({
    //     checked1: false
    // })
    console.log('password=' + this.state.pass);
    if (this.state.email === '' || this.state.email === 'undefined') {
      this.loginAlert.showMessage({
        message: i18n.t('LOGIN.UNABLE_TO_LOGIN'),
        description: i18n.t('LOGIN.ENTER_EMAIL'),
        type: 'warning',
        icon: 'auto',
      });
    } else {
      if (typeof this.state.pass === 'undefined' || this.state.pass === '') {
        this.loginAlert.showMessage({
          message: i18n.t('LOGIN.UNABLE_TO_LOGIN'),
          description: i18n.t('LOGIN.ENTER_PASSWORD'),
          type: 'warning',
          icon: 'auto',
        });
      } else {
        this.setState({error: '', loading: true});
        // let url = base_url + 'non_healpha_login';
        let url = getBaseUrl() + 'non_healpha_login';
        console.log(url);
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email:
              typeof this.state.email === 'string'
                ? this.state.email.toString()
                : '',
            password:
              typeof this.state.pass === 'string'
                ? this.state.pass.toString()
                : '',
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response['message']);
            if (response['message'] === 'Success') {
              this.signIn(response);
              if (
                response.role_type == 'Doctor' ||
                response.doctor_flag == '1'
              ) {
                this.loginAlert.showMessage({
                  message: i18n.t('LOGIN.AUTHENTICATION_DONE'),
                  description: i18n.t('LOGIN.LOGIN_SUCCESS'),
                  type: 'success',
                  icon: 'auto',
                });
              }
            } else if (response['message'] == 'Invalid Email') {
              // this.setState({error: '', loading: false});
              // alert('hi2')
              this.loginAlert.showMessage({
                message: i18n.t('LOGIN.INVALID_EMAIL'),
                description: i18n.t('LOGIN.ENTER_CORRECT_EMAIL'),
                type: 'danger',
                icon: 'auto',
              });
            } else if (response['message'] == 'Your Account is not active') {
              // this.setState({error: '', loading: false});
              // alert('hi2')
              this.loginAlert.showMessage({
                message: i18n.t('LOGIN.ACCOUNT_IS_NOT_ACTIVE'),
                description:i18n.t('LOGIN.ACTIVATE_YOUR_ACCOUNT'),
                type: 'danger',
                icon: 'auto',
              });
            } else if (response['message'] == 'Your Plan is expired') {
              // this.setState({error: '', loading: false});
              // alert('hi2')
              this.loginAlert.showMessage({
                message: i18n.t('LOGIN.PLAN_IS_EXPIRED'),
                description: i18n.t('LOGIN.EXTEND_YOUR_PLAN'),
                type: 'danger',
                icon: 'auto',
              });
            } else if (
              response['message'] == 'Please Subscribe / Renew your plans'
            ) {
              // this.setState({error: '', loading: false});
              // alert('hi2')
              this.loginAlert.showMessage({
                message: i18n.t('LOGIN.PLAN_IS_EXPIRED'),
                description: i18n.t('LOGIN.SUBSCRIBE_OR_RENEW'),
                type: 'danger',
                icon: 'auto',
              });
            } else if (
              response['message'] == 'OP Clinic/Hospital NOT assigned'
            ) {
              // this.setState({error: '', loading: false});
              // alert('hi2')
              this.loginAlert.showMessage({
                message: i18n.t('LOGIN.OP_CLINIC_NOT_ASSIGNED'),
                description: i18n.t('LOGIN.CONTACT_PRACTICE_ADMIN'),
                type: 'danger',
                icon: 'auto',
              });
            } else {
              // this.setState({error: '', loading: false});
              // alert('hi2')
              this.loginAlert.showMessage({
                message: i18n.t('LOGIN.AUTHENTICATION_ERROR'),
                description: i18n.t('LOGIN.ENTER_CORRECT_DETAILS'),
                type: 'danger',
                icon: 'auto',
              });
            }
          })
          .catch((error) => {
            // alert('hi3')
            this.loginAlert.showMessage({
              message:  i18n.t('LOGIN.SERVER_NOT_RESPONDING'),
              description: i18n.t('LOGIN.HE_ALPHA_DESK_HELP'),
              type: 'danger',
              icon: 'auto',
              autoHide: false,
            });
            this.setState({error: '', loading: false});
            console.error(error);
          });
      }
    }
    // } else {
    //     this.setState({
    //         checked1: true
    //     })
    // }
  };

  _changeIcon = () => {
    this.state.icon !== 'eye-off'
      ? this.setState({icon: 'eye-off', hidePassword: true})
      : this.setState({icon: 'eye', hidePassword: false});
  };

  render() {
    if (this.state.isVersionAlert) {
      console.log('123');
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.versionlink()}
          {/* <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} /> */}
        </View>
      );
    }
    const {
      container,
      logoContainer,
      formContainer,
      input,
      buttonContainer,
      buttonText,
    } = styles;
    return (
      // <ScrollView style={container}>
      <KeyboardAwareScrollView style={container}>
        <StatusBar backgroundColor={'#eeeeee'} barStyle={'dark-content'} />
        <View style={logoContainer}>
          <Image
            source={require('../../assets/images/healphalogo.jpg')}
            style={{marginTop: 5, height: 70, width: 230}}
          />
          <Image
            source={require('../../assets/images/healpha_doctor.png')}
            style={{height: 200, width: 200}}
          />
        </View>
        <View style={formContainer}>
          <Text
            allowFontScaling={false}
            style={{
              alignSelf: 'center',
              padding: 10,
              color: '#517fa4',
              fontWeight: 'bold',
              fontSize: 15,
            }}>
            {i18n.t('LOGIN.WELCOME_TEXT')}
          </Text>
          <TextInput
            allowFontScaling={false}
            placeholder={i18n.t('LOGIN.EMAIL_OR_PHONENUMBER')}
            placeholderTextColor={'#2D323C'}
            returnKeyType="done"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={input}
            onChangeText={(text) => this.setState({email: text})}
          />

          <TextInput
            allowFontScaling={false}
            placeholder={i18n.t('LOGIN.ENTER_YOUR_PASSWORD')}
            placeholderTextColor={'#2D323C'}
            returnKeyType="go"
            secureTextEntry={this.state.hidePassword}
            style={input}
            ref={(input) => (this.passwordInput = input)}
            onChangeText={(text) => this.setState({pass: text})}
          />
          <Icon
            style={{alignSelf: 'flex-end', marginTop: -45, marginRight: 15}}
            name={this.state.icon}
            size={14}
            onPress={() => this._changeIcon()}
          />
        </View>
        {/* <Row> */}
        <View
          style={{flexDirection: 'row', marginTop: -10, alignSelf: 'center'}}>
          {/* <View style={{marginLeft: 15}}>
            <CheckBox
              checked={this.state.checked}
              onPress={() => this.setState({checked: !this.state.checked})}
            /> */}
          {/* <ListItem onPress={this.checkbox()}>
    <CheckBox checked={this.state.checked} />
</ListItem> */}
          {/* </View> */}
          <View style={{marginLeft: -15}}>
            {/* <Text style={{paddingTop: 15}}>I agree to the</Text> */}
          </View>
          <View style={{marginTop: 0}}>
            <TouchableOpacity onPress={() => this.clickEventListener()}>
              <Text
                style={{textAlign: 'center', color: '#517fa4', paddingTop: 15}}>
                {i18n.t('LOGIN.TERMS_ACCEPT')}
                <Text style={{fontWeight: 'bold', marginLeft: 5}}>
                  {' '}
                  {i18n.t('LOGIN.TERMS_OF_SERVICES')}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </Row> */}
        {/* <Row>
          <View style={{marginLeft: 13, marginTop: -13}}>
            {this.state.checked1 && (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 10,
                  marginLeft: 45,
                }}>
                Please Accept Terms of Services
              </Text>
            )}
          </View>
        </Row> */}

        <Row style={{marginTop: 10}}>
          <Col size={55}>
            <TouchableOpacity
              onPress={
                () => this.props.navigation.navigate('doctorregister')
                // Linking.openURL(urldata[0]+"/doctor_reg").catch((err) => console.error('An error occurred', err))
              }
              style={styles.buttonStyle2}>
              <Text allowFontScaling={false} style={styles.textStyle}>
                {i18n.t('LOGIN.REGISTER')}{' '}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col size={45}>
            <TouchableOpacity
              onPress={this.login.bind(this)}
              style={styles.buttonStyle}>
              <Text allowFontScaling={false} style={styles.textStyle}>
                {i18n.t('LOGIN.LOG_IN')}
              </Text>
            </TouchableOpacity>
          </Col>
        </Row>
        <Row>
          <Col>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Forgot')}>
              <Text
                allowFontScaling={false}
                style={{textAlign: 'center', color: '#4F575C', marginTop: 15}}>
                {i18n.t('LOGIN.FORGOT_PASS_WORD')}
              </Text>
            </TouchableOpacity>
          </Col>
        </Row>
        <Row>
          <Col>
            <TouchableOpacity onPress={() => this.clickEventListener1()}>
              <Text
                allowFontScaling={false}
                style={{textAlign: 'center', color: '#4F575C', marginTop: 5}}>
                {i18n.t('LOGIN.REGISTER_A_DOCTOR')}
              </Text>
            </TouchableOpacity>
          </Col>
        </Row>

        <View></View>
        <FlashMessage position="top" ref={(ref) => (this.loginAlert = ref)} />
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    );
  }
}

export default SignIn;

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 0.2,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    backgroundColor: '#dcdcdc',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
  },
  buttonContainer: {
    backgroundColor: APP_PRIMARY_COLOR,
    paddingVertical: 15,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
  },
  formContainer: {
    padding: 10,
    //marginTop:1,
  },
  textStyle: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  buttonStyle: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: APP_PRIMARY_COLOR,
    // borderRadius:5,
    marginBottom: 15,
  },
  buttonStyle2: {
    // marginTop:-10,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#517fa4',
    // borderRadius:5,
    // marginBottom: 15,
  },
};
