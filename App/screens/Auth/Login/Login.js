import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  StatusBar,
  Linking,
  TextInput,
  Keyboard,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
  BackHandler,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import FlashMessage from "react-native-flash-message";
import VersionCheck from "react-native-version-check";
import { withTranslation } from "react-i18next";
import { Button, Icon, Toast, Container, Content, Form } from "native-base";

//  constants and url
import getBaseUrl, { base_document_url } from "../../../config/Config";
const HELP_DOC_PDF_LINK = "Doc-Registration.pdf";
// styles
import { styles, botSecStyles, formStyles, choiceStyles } from "./LoginStyles";

// color variable
import {
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR
} from "../../../themes/variable";

// image components
import DoctorLogin from "../../HomeScreen/ImageComponents/DoctorLogin";
import CountrySelection from "../CountrySelection/CountrySelection";
import LogoImg from "../../../assets/images/logo_white.png";
import DownArrow from "../../../assets/images/dropdown.png";

// API services
// import API from '../../../services/Api';
import { LoginService } from "../../../services/LoginService";
import { doctorGetMethod } from "../../../services/DoctorProfileService";
import AuthUtils from "../../../utils/AuthUtils";
import i18n from "../../../../i18n";
import ApiCall from "../../../services/ApiCall";
import * as firebase from "react-native-firebase";

class Login extends Component {
  static navigationOptions = {
    headerShown: false
  };
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      icon: "eye-off",
      hidePassword: true,
      checked: false,
      checked1: false,
      isVersionAlert: false,
      buttonsModal: true,
      loginModal: false,
      modalHeight: "50%",
      imageMargin: -100,
      loginForm: false,
      countrySelected: false,
      selectedCountryName: "",
      selectedCountryLabel: ""
    };
    this.login = this.login.bind(this);
    this.showHelpDoc = this.showHelpDoc.bind(this);
  }
  versionLinking = () => {
    BackHandler.exitApp();
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.healpha_doctor"
    );
    // this.setState({isVersionAlert:false})
  };
  versionLink = () => {
    const { t } = this.props;
    Alert.alert(
      i18n.t("LOGIN.VERSION_UPDATE_HEADER"),
      i18n.t("LOGIN.VERSION_UPDATE_SUB_TEXT"),
      [
        {
          text: i18n.t("LOGIN.UPDATE"),
          onPress: () => this.versionLinking()
        }
      ]
    );
  };

  _handleStateChange = (state) => {
    if (!this.state.buttonsModal) {
      this.setState({ buttonsModal: true });
      return;
    }
  };

  keyboardDidShow(e) {
    this.setState({
      modalHeight: "65%",
      imageMargin: 100
    });
  }
  keyboardDidHide(e) {
    this.setState({
      modalHeight: "50%",
      imageMargin: -100
    });
  }

  showHelpDoc() {
    this.props.navigation.navigate("ViewPdf", {
      link: HELP_DOC_PDF_LINK,
      baseUrl: base_document_url
    });
  }

  // componentWillMount() {
  //   Keyboard.addListener("keyboardDidShow", (e) => this.keyboardDidShow(e));
  //   Keyboard.addListener("keyboardDidHide", (e) => this.keyboardDidHide(e));
  // }

  componentDidMount() {
    const { t } = this.props;
    this.props.navigation.addListener("willFocus", this._handleStateChange);

    if (Platform.OS == "android") {
      VersionCheck.getLatestVersion({
        provider: "playStore" // for Android
      }).then((latestVersion) => {
        this.setState({ getLatestVersion1: latestVersion });
        this.setState({ currentversion: VersionCheck.getCurrentVersion() });
        if (latestVersion > VersionCheck.getCurrentVersion()) {
          this.setState({ isVersionAlert: true });
          try {
            PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.CAMERA,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            ]).then((granted) => {
              Object.entries(granted).map(([key, value]) => {
                console.log("PermissionsAndroid:KEY:VALUE", key, value);
              });
            });
          } catch (err) {
            Toast.show({
              text:
                (err && err.message) ||
                i18n.t("LOGIN.ANDROID_PERMISSION_ERROR"),
              type: "warning",
              duration: 3000
            });
          }
        } else {
          this.setState({ isVersionAlert: false });
          try {
            PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.CAMERA,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            ]).then((granted) => {
              Object.entries(granted).map(([key, value]) => {
                console.log("PermissionsAndroid:KEY:VALUE", key, value);
              });
            });
          } catch (err) {
            Toast.show({
              text:
                (err && err.message) ||
                i18n.t("LOGIN.ANDROID_PERMISSION_ERROR"),
              type: "warning",
              duration: 3000
            });
          }
        }
      });
    } else {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]).then((granted) => {
          Object.entries(granted).map(([key, value]) => {
            console.log("PermissionsAndroid:KEY:VALUE", key, value);
          });
        });
      } catch (err) {
        Toast.show({
          text:
            (err && err.message) || i18n.t("LOGIN.ANDROID_PERMISSION_ERROR"),
          type: "warning",
          duration: 3000
        });
      }
    }

    this.deviceRegistration();
  }

  deviceRegistration = async () => {
    const selectedCountry = await AuthUtils.getUserCountry();

    global.selectedCountryLabel =
      selectedCountry == "in"
        ? "India"
        : selectedCountry === "sl"
        ? "Sri Lanka"
        : "";

    this.setState(() => ({
      countrySelected: false,
      selectedCountryName: selectedCountry,
      selectedCountryLabel:
        selectedCountry == "in"
          ? "India"
          : selectedCountry === "sl"
          ? "Sri Lanka"
          : ""
    }));

    const fcmToken = await firebase.messaging().getToken();
    console.log("fcmToken",fcmToken)
    if (fcmToken) {
      await AsyncStorage.setItem("deviceRegID", fcmToken);
    }
    return fcmToken;
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  // clickEventListener1() {
  //   Linking.openURL(
  //     'https://web.healpha.com/images/Helpdocs/DOC_HealphaApp-Doctor_Reg_compressed.pdf',
  //   ).catch((err) => console.error('An error occurred', err));
  // }
  // setNodeData = async (data) => {

  // };

  setDoctorLoginResult = async (phpResponse, nodeResponse) => {
    console.log("data in the nodae data ", nodeResponse);
    const php_token = nodeResponse.phpTimestampToken.toString();
    const doctore_id = nodeResponse.id.toString();
    const is_reg_completed = nodeResponse.is_reg_completed.toString();
    await AsyncStorage.setItem("userToken", php_token);
    await AsyncStorage.setItem("doctorid", doctore_id);
    await AsyncStorage.setItem("role", nodeResponse.role_type);
    await AsyncStorage.setItem("is_reg_completed", is_reg_completed);
    global.jwt_token = nodeResponse.token;

    await AsyncStorage.setItem("jwt_token", nodeResponse.token);
    // await AsyncStorage.setItem("obj", JSON.stringify(phpResponse));
    const url = getBaseUrl() + `v1/public/doctor/${nodeResponse?.id}`;
    const response = await ApiCall.get(url);
    if (response?.data) {
      const name =
      ((response?.data?.middle_name!='') || (response?.data?.middle_name!=null) || (response?.data?.middle_name!=undefined))?response?.data?.first_name + ' ' +
        response?.data?.middle_name + ' ' +
        response?.data?.last_name:
        response?.data?.first_name + ' ' + response?.data?.last_name
      await AsyncStorage.setItem("phone", response?.data?.phone_no.toString());

      await AsyncStorage.setItem("doctorname", name.toString());

      await AsyncStorage.setItem(
        "docimage",
        response?.data?.profile_image.toString()
      );
    }
    this.props.navigation.navigate("LandingPage")
    return true;
  };

  nodeLogin = async () => {
    // this.signIn(phpResponse);
    const { t } = this.props;

    try {
      const payload = {
        email: this.state.email,
        password: this.state.pass,
        is_doctor: true,
        is_mobile_auth: true
      };
      console.log("kjashdiudsjfh",payload)
      // const response = await LoginService(payload);
      const url = getBaseUrl() + "v1/auth/login/non-healpha-user";
      const response = await ApiCall.post(url, payload);
      if (response) {
        if(response?.data?.is_subscription_valid){
          if(response?.data?.message=='USER_BRANCHES_NOT_EXISTS'){
            Toast.show({
              text: response?.data?.message,
              duration: 5000,
              type: "warning"
            });
          }else{
            await this.setDoctorLoginResult("", response?.data);
            return true;      
          }
        }else{
          Toast.show({
            text: response?.message,
            duration: 5000,
            type: "warning"
          });
        }
      } else {
        this.loginAlert.showMessage({
          message: i18n.t("LOGIN.UNABLE_TO_LOGIN"),
          description: response && response["message"],
          type: "danger",
          icon: "auto"
        });
      }

      // await this.setNodeData(response?.data?.id);
    } catch (error) {
      Toast.show({
        text: error?.message || i18n.t("LOGIN.HE_ALPHA_DESK_HELP"),
        duration: 5000,
        type: "danger"
      });
    }
  };

  setJwtToken = async (response) => {
    global.jwt_token = response.token;
    await AsyncStorage.setItem("jwt_token", response.token);
    // usage example
    // const jwt_token = global.jwt_token;
    // or
    // const jwt_token = await AsyncStorage.getItem('jwt_token');
  };

  login = async (event) => {
    const { t } = this.props;
    if (!this.state.selectedCountryName) {
      this.loginAlert.showMessage({
        message: i18n.t("LOGIN.UNABLE_TO_LOGIN"),
        description: i18n.t("LOGIN.SELECT_COUNTRY"),
        type: "warning",
        icon: "auto"
      });
    } else if (this.state.email === "" || this.state.email === "undefined") {
      this.loginAlert.showMessage({
        message: i18n.t("LOGIN.UNABLE_TO_LOGIN"),
        description: i18n.t("LOGIN.ENTER_EMAIL"),
        type: "warning",
        icon: "auto"
      });
    } else {
      if (typeof this.state.pass === "undefined" || this.state.pass === "") {
        this.loginAlert.showMessage({
          message: i18n.t("LOGIN.UNABLE_TO_LOGIN"),
          description: i18n.t("LOGIN.ENTER_PASSWORD"),
          type: "warning",
          icon: "auto"
        });
      } else {
        this.setState({ error: "", loading: true });
        console.log("\n login url 123 :", getBaseUrl(), "getbaseurl");
        let url = getBaseUrl() + "non_healpha_login";
        await this.nodeLogin();
        this.setState({
          loginForm: false
        });

        // fetch(url, {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json"
        //   },
        //   body: JSON.stringify({
        //     email:
        //       typeof this.state.email === "string"
        //         ? this.state.email.toString()
        //         : "",
        //     password:
        //       typeof this.state.pass === "string"
        //         ? this.state.pass.toString()
        //         : ""
        //   })
        // })
        //   .then((response) => response.json())
        //   .then(async (response) => {

        //     if (response["message"] === "Success") {

        //     }

        //     else if (response['message'] == 'Invalid Email') {
        //       // this.setState({error: '', loading: false});
        //       // alert('hi2')
        //       this.loginAlert.showMessage({
        //         message: i18n.t('LOGIN.INVALID_EMAIL'),
        //         description: i18n.t('LOGIN.ENTER_CORRECT_EMAIL'),
        //         type: 'danger',
        //         icon: 'auto',
        //       });
        //     } else if (response['message'] == 'Your Account is not active') {
        //       // this.setState({error: '', loading: false});
        //       // alert('hi2')
        //       this.loginAlert.showMessage({
        //         message: i18n.t('LOGIN.ACCOUNT_IS_NOT_ACTIVE'),
        //         description:i18n.t('LOGIN.ACTIVATE_YOUR_ACCOUNT'),
        //         type: 'danger',
        //         icon: 'auto',
        //       });
        //     } else if (response['message'] == 'Your Plan is expired') {
        //       // this.setState({error: '', loading: false});
        //       // alert('hi2')
        //       this.loginAlert.showMessage({
        //         message: i18n.t('LOGIN.PLAN_IS_EXPIRED'),
        //         description: i18n.t('LOGIN.EXTEND_YOUR_PLAN'),
        //         type: 'danger',
        //         icon: 'auto',
        //       });
        //     } else if (
        //       response['message'] == 'Please Subscribe / Renew your plans'
        //     ) {
        //       // this.setState({error: '', loading: false});
        //       // alert('hi2')
        //       this.loginAlert.showMessage({
        //         message: i18n.t('LOGIN.PLAN_IS_EXPIRED'),
        //         description: i18n.t('LOGIN.SUBSCRIBE_OR_RENEW'),
        //         type: 'danger',
        //         icon: 'auto',
        //       });
        //     } else if (
        //       response['message'] == 'OP Clinic/Hospital NOT assigned'
        //     ) {
        //       // this.setState({error: '', loading: false});
        //       // alert('hi2')
        //       this.loginAlert.showMessage({
        //         message: i18n.t('LOGIN.OP_CLINIC_NOT_ASSIGNED'),
        //         description: i18n.t('LOGIN.CONTACT_PRACTICE_ADMIN'),
        //         type: 'danger',
        //         icon: 'auto',
        //       });
        //     } else {
        //       // this.setState({error: '', loading: false});
        //       // alert('hi2')
        //       this.loginAlert.showMessage({
        //         message: i18n.t('LOGIN.AUTHENTICATION_ERROR'),
        //         description: i18n.t('LOGIN.ENTER_CORRECT_DETAILS'),
        //         type: 'danger',
        //         icon: 'auto',
        //       });
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error, "error from login php url");

        //     this.loginAlert.showMessage({
        //       message:
        //         (error && error.message) ||
        //         i18n.t("LOGIN.SERVER_NOT_RESPONDING"),
        //       description: i18n.t("LOGIN.HE_ALPHA_DESK_HELP"),
        //       type: "danger",
        //       icon: "auto",
        //       autoHide: false
        //     });
        //     this.setState({ error: "", loading: false });
        //   });
      }
    }
  };

  changePasswordType = () => {
    this.state.icon !== "eye-off"
      ? this.setState({ icon: "eye-off", hidePassword: true })
      : this.setState({ icon: "eye", hidePassword: false });
  };

  navigateToDoctorRegister = () => {
    this.setState(
      {
        buttonsModal: false
      },
      () => this.props.navigation.navigate("Basicdetails")
    );

    // if (this.state.selectedCountryName) {

    // } else {
    //   Toast.show({
    //     text: 'Please Select Country',
    //     type: 'warning',
    //     duration: 2000,
    //   });
    // }
  };

  openCloseLoginModal = () => {
    this.setState((prevState) => ({
      loginForm: !prevState.loginForm
    }));
  };

  openCountrySelection = () => {
    this.setState(() => ({
      countrySelected: true
    }));
  };

  closeCountrySelection = (item) => {
    this.setState((prevState) => ({
      countrySelected: false,
      selectedCountryName: item?.value || prevState?.selectedCountryName,
      selectedCountryLabel: item?.label || prevState?.selectedCountryLabel
    }));
    // global.selectedCountryLabel = item?.label;
  };

  navigateToForgotPasswordScreen = () => {
    const { t } = this.props;
    if (!this.state.selectedCountryName) {
      this.loginAlert.showMessage({
        message: t("LOGIN.UNABLE_TO_LOGIN"),
        description: t("LOGIN.SELECT_COUNTRY"),
        type: "warning",
        icon: "auto"
      });
    } else {
      this.setState(
        {
          loginModal: false
        },
        () => this.props.navigation.navigate("Forgot")
      );
    }
  };

  openTermsAndServices = () => {
    const { t } = this.props;
    try {
      Linking.openURL("https://www.healpha.com/terms-of-service/");
    } catch (error) {
      Toast.show({
        text:
          (error && error.message) ||
          i18n.t("LOGIN.TERMS_OF_SERVICE_OPEN_ERROR"),
        type: "warning",
        duration: 3000,
        position: "top"
      });
    }
  };

  renderForm() {
    const { t } = this.props;
    return (
      <View style={formStyles.formSec}>
        <Form>
          <View style={formStyles.inputSectionMainView}>
            <View style={formStyles.countryLabel}>
              <TouchableOpacity
                style={formStyles.countryTouchable}
                testID="chooseCountry"
                accessibilityLabel="chooseCountry"
                onPress={() => this.openCountrySelection()}>
                <Text>
                  {global.selectedCountryLabel
                    ? global.selectedCountryLabel
                    : i18n.t("LOGIN.COUNTRY")}
                </Text>

                <Image
                  source={DownArrow}
                  style={formStyles.dropdownArrow}
                  testID="chooseCountryIcon"
                  accessibilityLabel="chooseCountryIcon"
                />
              </TouchableOpacity>
            </View>
            <View style={formStyles.flexDirectionRow}>

              { isNaN(this.state.email) ? null : global.phonecode && (
                <TextInput
                  testID="phoneCodeTextInput"
                  accessibilityLabel="phoneCodeTextInput"
                  style={formStyles.emailAndPhoneNumberText}
                  editable={false}
                  defaultValue={global.phonecode}
                />
              )}

              <TextInput
                style={[formStyles.emailAndPhoneNumberText, formStyles.flex]}
                autoCapitalize={"none"}
                keyboardType="email-address"
                autoCompleteType={"email"}
                placeholder={i18n.t("LOGIN.EMAIL_PLACEHOLDERS")}
                onChangeText={(text) => this.setState({ email: text })}
                testID="emailOrPhoneNumberTextInput"
                accessibilityLabel="emailOrPhoneNumberTextInput"
              />
            </View>

            <TextInput
              testID="passwordTextInput"
              accessibilityLabel="passwordTextInput"
              autoCapitalize={"none"}
              style={formStyles.passwordInputText}
              secureTextEntry={this.state.hidePassword}
              onChangeText={(text) => this.setState({ pass: text })}
              placeholder={i18n.t("LOGIN.PASSWORD_PLACEHOLDER")}
              ref={(input) => (this.passwordInput = input)}
            />
            <Icon
              style={formStyles.passwordIconStyles}
              name={this.state.icon}
              onPress={() => this.changePasswordType()}
              testID="passwordIcon"
              accessibilityLabel="passwordIcon"
            />
            <Text
              style={formStyles.forgotPasswordText}
              testID="forgotPasswordText"
              accessibilityLabel="forgotPasswordText"
              onPress={() => this.navigateToForgotPasswordScreen()}>
              {i18n.t("LOGIN.FORGOT_PASSWORD")}
            </Text>
          </View>
        </Form>
      </View>
    );
  }

  renderBottomChoiceSec() {
    const { t } = this.props;

    return (
      <View style={botSecStyles.bottomSec}>
        <View
          style={[choiceStyles.bottomSecTextSec, choiceStyles.rowContainer]}>
           <View>
            <Text
              style={choiceStyles.bottomSecText}
              testID="createAnAccountOrLoginText"
              accessibilityLabel="createAnAccountOrLoginText">
              {i18n.t("LOGIN.CREAT_ACCOUNT_HEADER_TEXT")}
            </Text>
          </View>
          <View style={choiceStyles.countryCodeContainer}>
            <Text
              style={choiceStyles.countryCode}
              onPress={() => this.openCountrySelection()}>
              {this.state.selectedCountryName}
            </Text>
          </View>
        </View>
        <View style={choiceStyles.bottomSecBtnView}>
          <View style={choiceStyles.bottomSecBtnWrap}>
            <Button
              bordered
              primary
              style={[choiceStyles.baseButton, choiceStyles.outlineBtn]}
              onPress={() => this.navigateToDoctorRegister()}
              testID="createAccountButton"
              accessibilityLabel="createAccountButton">
              <Text
                testID="createAccountText"
                accessibilityLabel="createAccountText"
                uppercase={false}
                style={[choiceStyles.btnText, choiceStyles.outlineBtnText]}>
                {" "}
                {i18n.t("LOGIN.CREATE_ACCOUNT")}
              </Text>
            </Button>
          </View>
          <View
            style={[
              choiceStyles.bottomSecBtnWrap,
              choiceStyles.outlineBtnWrap
            ]}>
            <Button
              testID="loginButton"
              accessibilityLabel="loginButton"
              primary
              style={[choiceStyles.baseButton, choiceStyles.filledButton]}
              onPress={() => this.openCloseLoginModal()}>
              <Text
                uppercase={false}
                style={choiceStyles.btnText}
                testID="loginText"
                accessibilityLabel="loginText">
                {i18n.t("LOGIN.LOGIN")}
              </Text>
            </Button>
          </View>
        </View>

        {/* COUNTRY SELECTION  BUTTON */}

        {/* <View style={choiceStyles.selectCountryMainView}>
          <View style={choiceStyles.selectCountryTextMainView}>
            <Text
              style={[
                choiceStyles.bottomSecText,
                choiceStyles.countrySecMargin,
              ]}>
              Select your country
            </Text>
          </View>

          <TouchableOpacity
            style={choiceStyles.countrySelectionTouchableView}
            onPress={() => this.openCountrySelection()}>
            <View style={choiceStyles.countryTextView}>
              <Text
                style={
                  this.state.selectedCountryName
                    ? choiceStyles.countryCode
                    : choiceStyles.selectCountyText
                }>
                {this.state.selectedCountryName === null ||
                this.state.selectedCountryName == undefined ||
                this.state.selectedCountryName === ''
                  ? 'Select Country'
                  : this.state.selectedCountryName}
              </Text>
            </View>
            <View>
              <Image
                source={DownArrow}
                resizeMode={'contain'}
                style={choiceStyles.dropdownArrow}
              />
            </View>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }

  renderBottomSec() {
    const { t } = this.props;
    return (
      <View style={botSecStyles.bottomSec}>
        <View style={botSecStyles.bottomHeadingSec}>
          <Text
            style={botSecStyles.bottomSecHeading}
            testID="loginToContinueText"
            accessibilityLabel="loginToContinueText">
            {i18n.t("LOGIN.LOG_TO_CONTINUE")}
          </Text>
          <Text
            style={botSecStyles.bottomSecSubHeading}
            testID="provideBelowDetailsToLoginText"
            accessibilityLabel="provideBelowDetailsToLoginText">
            {" "}
            {i18n.t("LOGIN.LOGIN_SUB_TEXT")}
          </Text>
        </View>
        {this.renderForm()}
        <View style={botSecStyles.tosSec}>
          <Text
            style={botSecStyles.tosText}
            onPress={() => this.openTermsAndServices()}
            testID="byLoginIacceptText"
            accessibilityLabel="byLoginIacceptText">
            {t("LOGIN.TERMS_TEXT")}&nbsp;
            <Text
              style={botSecStyles.tosTextHighlight}
              testID="termsOfServicesText"
              accessibilityLabel="termsOfServicesText">
              {t("LOGIN.ACCEPT_TEXT")}
            </Text>
          </Text>
        </View>
        <View style={botSecStyles.bottomSecBtnView}>
          <Button
            bordered
            primary
            style={botSecStyles.baseButton}
            onPress={() => this.login()}
            testID="loginButton"
            accessibilityLabel="loginButton">
            <Text
              uppercase={false}
              style={botSecStyles.btnText}
              testID="loginText"
              accessibilityLabel="loginText">
              {i18n.t("LOGIN.LOGIN")}
            </Text>
          </Button>
        </View>
      </View>
    );
  }

  renderTopSec() {
    const { t } = this.props;
    return (
      <View style={styles.topSec}>
        <View style={styles.logoTextView}>
          <View style={styles.logoSec}>
            <View style={styles.logoView}>
              <Image
                testID="healphaLogoImage"
                accessibilityLabel="healphaLogoImage"
                source={LogoImg}
                style={styles.logoImg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.closeIconView}>
              {this.state.loginForm && (
                <Icon
                  testID="closeIcon"
                  accessibilityLabel="closeIcon"
                  style={styles.closeIconImg}
                  size={30}
                  name="close"
                  onPress={() => this.openCloseLoginModal()}
                />
              )}
            </View>
          </View>
          <Text
            uppercase={false}
            style={styles.logoSecText}
            testID="doctorAppFromHealphaText"
            accessibilityLabel="doctorAppFromHealphaText">
            {this.state.loginForm
              ? i18n.t("LOGIN.WELCOME_SUB_TEXT")
              : i18n.t("LOGIN.WELCOME_TEXT")}
          </Text>
        </View>
        <View
          style={[
            styles.midImgSec,
            !this.state.loginForm && { marginTop: "20%" }
          ]}>
          <DoctorLogin />
        </View>
      </View>
    );
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.safeTop} />
        <SafeAreaView style={styles.safeArea}>
          <Container>
            <Content contentContainerStyle={styles.content}>
              <StatusBar
                backgroundColor={APP_PRIMARY_COLOR}
                barStyle={"light-content"}
              />
              <View style={styles.mainWrapper}>
                {this.renderTopSec()}
                {this.state.loginForm
                  ? this.renderBottomSec()
                  : this.renderBottomChoiceSec()}

                {this.state.countrySelected && (
                  <CountrySelection action={this.closeCountrySelection} />
                )}
              </View>
              <FlashMessage
                position="top"
                ref={(ref) => (this.loginAlert = ref)}
              />
            </Content>
          </Container>
        </SafeAreaView>
      </Fragment>
    );
  }
}

export default withTranslation()(Login);
