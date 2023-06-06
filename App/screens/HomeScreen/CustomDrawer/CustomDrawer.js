import React, { Component } from "react";
import { View, Image, TouchableOpacity, Alert, TextInput } from "react-native";
import { Button, Text } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import { withTranslation } from "react-i18next";
import { Icon } from "react-native-elements";
import RNRestart from "react-native-restart";

// styles
import styles from "./CustomDrawerStyles";
import i18n from "../../../../i18n";
import { wp } from "../../../themes/Scale";

// images
import Language from "../../../assets/images/language.png";
import Practice from "../../../assets/images/practice.png";
import ArrowSideMenu from "../../../assets/images/arrow_side_menu.png";
import Logout from "../../../assets/images/logout.png";
import Help from "../../../assets/images/help_blue.png";
import Contact from "../../../assets/images/help.png";
import QrCode from "../../../assets/images/qrcode.png";
import Devices from "../../../assets/images/devices.png";
import ChangePassword from "../../../assets/images/change_password.png";
import HeAlpha from "../../../assets/images/healpha_logo_main.png";
import AbsentAndLeaves from "../../../assets/images/attendance.png";
import Delete1 from "../../../assets/images/Delete1.png";
import Modal from "react-native-modal";

import getBaseUrl, {
  getEnvironmentObject,
  getApiUrl
} from "../../../config/Config";
import AuthUtils from "../../../utils/AuthUtils";
import { DEFAULT_GREY_COLOR } from "../../../themes/variable";
import { theme } from "../../../themes/Theme";
import { sendOTP } from "../../../redux/actions/appointment_action";
import { NativeToastTop } from "../../app/common/Toaster";
import ApiCall from "../../../services/ApiCall";
import { DeleteAccount } from "./DeleteAccount";

// constants
// const Realm = require("realm");
// let realm;
class CustomDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      image: "",
      selectedLanguage: "English",
      // realm: new Realm({
      //   schema: [
      //     {
      //       name: "Notifications",
      //       properties: {
      //         id: { type: "int", default: 0 },
      //         hlpid: "string",
      //         created_date: "string",
      //         title: "string",
      //         body: "string"
      //       }
      //     }
      //   ]
      // }),
      data: [],
      country_languages: [],
      visible: false,
      comment_text: ""
    };
  }

  languages = async () => {
    let environment = await getEnvironmentObject();
    this.setState({
      country_languages: environment?.languages || []
    });
  };
  componentDidMount = async () => {
    this.languages();
    this.Apicallmethod();
    const docid = await AsyncStorage.getItem("doctorid");
    if (docid !== null) {
      this.setState({ docid: docid });
      global.doctor_id = this.state.docid;
    }
    // var mydata = realm
    //   .objects("Notifications")
    //   .filtered(`hlpid ==  "${global.doctor_id}"`);
    // if (mydata.length == 0) {
    //   this.setState({
    //     note: true
    //   });
    // }
    // this.setState({ data: mydata, isLoading: false });
    this.setState({ isLoading: false });
  };

  changeLanguage = (lng, text) => {
    i18n.changeLanguage(lng);
    this.setState({
      modal: false,
      selectedLanguage: text
    });
  };

  settingActions = (type) => {
    if (type === "select_practice") {
      this.props.navigation.navigate("practiceapproval");
    } else if (type === "select_language") {
      this.setState({
        modal: !this.state.modal
      });
      // setModal(!modal);
    }
  };

  renderSettingsSection = (text1, text2, type, image,testID,accessibilityLabel) => {
    return (
      <View style={styles.settingSectionWrapper}>
        <TouchableOpacity onPress={() => this.settingActions(type)}>
          <View style={styles.flexDirectionRow}>
            <View style={styles.ImageTextSectionView}>
              <Image source={image} style={styles.ImageStyles} testID={testID} accessibilityLabel={testID}></Image>
              <Text style={styles.textStyles} testID={testID} accessibilityLabel={testID}>
                {text1}
                <Text testID={testID} accessibilityLabel={testID}>{text2}</Text>
              </Text>
            </View>
            <View style={styles.sideArrowSectionView}>
              <Image source={ArrowSideMenu} style={styles.sideArrowStyles} testID="arrowSideImage" accessibilityLabel="arrowSideImage"/>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  logOut = async () => {
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

  menuSectionActions = async (type) => {
    if (type === "profile") {
      this.props.navigation.navigate("Profile");
    } else if (type === "devices") {
      this.props.navigation.navigate("listofdevices");
    } else if (type === "change_password") {
      this.props.navigation.navigate("ChangePassword");
    } else if (type === "help") {
      this.props.navigation.navigate("FaqScreen");
    } else if (type === "my_practice") {
      this.props.navigation.navigate("MyPractice");
    } else if (type === "contact") {
      this.props.navigation.navigate("Contact");
    } else if (type === "qrcode") {
      this.props.navigation.navigate("QrCode");
    } else if (type === "delete") {
      this.setState({ visible: false });
      const phone_number = await AsyncStorage.getItem("phone");
      try {
        const url2 = getBaseUrl() + "v1/auth/send-otp";
        const payload = {
          phone_code: global.phonecode,
          phone_number: phone_number
        };
        let res = await ApiCall.post(url2, payload);
        if (res) {
          this.props.navigation.navigate("DeleteAccount", {
            phone_number: phone_number,
            phone_code: global.phonecode,
            comment_text: this.state.comment_text
          });

          alert(i18n.t("PERSON_REGISTRATION.OTP_SENT_SUCCESSFULLY"));
        }
      } catch (error) {
        alert(i18n.t("PERSON_REGISTRATION.OTP_MOBILEb 677"));
      }
    } else if (type === "logout") {
      this.logOut();
    } else if (type === "select_country") {
      const { t } = this.props;
      Alert.alert(
        t("PROFILE.CHANGE_COUNTRY"),
        t("PROFILE.YOU_WILL_BE_LOGGED_OUT"),
        [
          {
            text: t("COMMON.CANCEL"),
            style: "cancel"
          },
          { text: t("COMMON.OK"), onPress: () => this.logOut() }
        ]
      );
    } else if (type === "leave_absence") {
      this.props.navigation.navigate("LeaveOrAbsence");
    }
  };

  menuSection = (text1, type, image,testID,accessibilityLabel) => {
    return (
      <View style={styles.settingSectionWrapper}>
        <TouchableOpacity onPress={() => this.menuSectionActions(type)}>
          <View style={styles.flexDirectionRow}>
            <View style={styles.ImageTextSectionView}>
              <Image source={image} style={styles.ImageStyles} testID={testID} accessibilityLabel={testID}></Image>
              <Text style={styles.textStyles} testID={testID} accessibilityLabel={testID}>{text1}</Text>
            </View>
            <View style={styles.sideArrowSectionView}>
              <Image source={ArrowSideMenu} style={styles.sideArrowStyles} testID="arrowImage1" accessibilityLabel="arrowImage1"/>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderLanguages = () => {
    const { country_languages } = this.state;
    return country_languages.map((element) => (
      <Button
        key={element.id}
        style={styles.languageButtonStyles}
        onPress={() => this.changeLanguage(element.value, element.label)}
        testID={element.label+"button"}>
        <Text style={styles.buttonText}
        testID={element.label+"text"}>{element.label}</Text>
      </Button>
    ));
  };
  Apicallmethod = () => {
    let base_url = getBaseUrl();
    let url_base = base_url + "v1/public/country-contact-details";
    let response = fetch(url_base, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          image: response.data.contact_details.portal_header_logo
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  data_trigger = async () => {
    if (this.state.visible == false) {
      this.setState({ visible: true });
    } else {
      this.setState({ visible: true });
    }
  };

  delete_account_function = () => {
    return (
      <Modal
        isVisible={this.state.visible}
        style={styles.modalPaddingAndMargin}>
        <View style={styles.modalStylescomment}>
          <View>
            <Text
              style={{
                fontSize: theme.fontSizes.ml,
                color: "black",
                fontFamily: theme.fontFamily.primarySemiBold
              }}
              testID="deleteReasonText"
              accessibilityLabel="deleteReasonText">
              {i18n.t("DELETE.REASON")}{" "}
            </Text>
            <TouchableOpacity
              style={styles.closeTouchableViewNewPatientcomment}>
              {/* <Close height={theme.fontSizes.sm} width={theme.fontSizes.sm} /> */}
            </TouchableOpacity>
            <TextInput
            testID="enterReasonTextInput"
            accessibilityLabel="enterReasonTextInput"
              placeholder= {i18n.t("DELETE.ENTER_REASON")}
              style={styles.searchmedicinecomment}
              placeholderTextColor={DEFAULT_GREY_COLOR}
              defaultValue={""}
              onChangeText={(val) => {
                this.setState({ comment_text: val });
              }}
            />
            <View style={{ padding: 25 }}>
              <Button
                style={styles.languageButtonStyles1}
                onPress={() => {
                  this.menuSectionActions("delete");
                }}
                testID="deleteButton"
                accessibilityLabel="deleteButton">
                <Text style={styles.oktext}
                testID="proceedText"
                accessibilityLabel="proceedText">{i18n.t("DELETE.PROCEED")}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  navigationView = () => {
    // COMMENTED CODE FOR FEATURE REFERENCE
    // let api_url= getApiUrl();
    // let image_url= api_url+this.state.image;

    const { t } = this.props;
    return (
      // <Container style={styles.drawerWrapper}>
      <View style={styles.drawerWrapper}>
        <View style={styles.settingView}>
          <Text style={styles.settingText}
          testID="settingsText"
          accessibilityLabel="settingsText">{t("PROFILE.SETTINGS")}</Text>
          {/* select language section start*/}

          {this.renderSettingsSection(
            t("PROFILE.LANGUAGE"),
            i18n.language === "en"
              ? "English"
              : i18n.language === "hi"
              ? "हिंदी"
              : "తెలుగు",
            "select_language",
            Language,
            "languageText"
          )}
          {/* select language section end */}
          {/* Language buttons */}

          {this.state.modal && (
            <View style={styles.buttonsView}>{this.renderLanguages()}</View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.menuView}>
            <Text style={styles.settingText} testID="menuText"
            accessibilityLabel="menuText">{t("PROFILE.MENU")}</Text>
            {this.menuSection(
              t("PROFILE.PROFILE"),
              "profile",
              global.profile_image,
              "profileImage"
            )}
            {this.menuSection(t("PROFILE.DEVICES"), "devices", Devices,"devicesText")}
            {this.menuSection(
              t("PROFILE.CHANGE_PASSWORD"),
              "change_password",
              ChangePassword,
              "changePasswordText"
            )}
            {this.menuSection(
              t("PROFILE.MY_PRACTICE"),
              "my_practice",
              Practice,
              "myPracticeText"
            )}

            {this.menuSection(
              i18n.t("PROFILE_DRAWER.LEAVE_ABSENCE"),
              "leave_absence",
              AbsentAndLeaves,
              "LeaveAbsenseText"
            )}

            {this.menuSection(t("PROFILE.HELP"), "help", Help)}
            {this.menuSection(
              t("COVID_MONITORING.CONTACT"),
              "contact",
              Contact,
              "contactText"
            )}
            {this.menuSection(t("PROFILE.QRCODE"), "qrcode", QrCode)}
          </View>
          <View style={styles.logoutSection}>
            <View style={styles.logoutAndFooterSection}>
              <TouchableOpacity
                onPress={() => this.menuSectionActions("select_country")}>
                <View style={styles.flexDirectionRow}>
                  <View style={styles.ImageTextSectionView}>
                    <Icon
                    testID="locationIcon"
                    accessibilityLabel="locationIcon"
                      name="location-outline"
                      type="ionicon"
                      size={24}
                      color="#04A6D6"
                    />
                    <Text style={styles.textStyles}
                    testID="changeCountryText"
                    accessibilityLabel="changeCountryText">
                      {t("PROFILE.CHANGE_COUNTRY")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.logoutSection}>
              <View style={styles.logoutAndFooterSection}>
                <View style={styles.ImageTextSectionView}>
                  <TouchableOpacity
                    style={styles.flexTouch}
                    onPress={() => {
                      this.setState({ visible: true });
                    }}>
                    <Image source={Delete1} style={styles.logoutImageStyles} 
                    testID="deleteImage"
                    accessibilityLabel="deleteImage"/>
                    <Text style={styles.textStylesOne}
                    testID="deleteText"
                    accessibilityLabel="deleteText">
                      {t("DELETE.TITLE")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.logoutAndFooterSection}>
              <TouchableOpacity
                onPress={() => this.menuSectionActions("logout")}>
                <View style={styles.flexDirectionRow}>
                  <View style={styles.ImageTextSectionView}>
                    <Image source={Logout} style={styles.logoutImageStyles} 
                    testID="logoutImage"
                    accessibilityLabel="logoutImage"/>
                    <Text style={styles.textStyles}
                    testID="logoutText"
                    accessibilityLabel="logoutText">{t("PROFILE.LOGOUT")}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.poweredBySection}>
              <Text style={{ fontSize: wp(10) }}
              testID="poweredByText"
              accessibilityLabel="poweredByText">
                {t("PROFILE.POWERED_BY")}
              </Text>
              <Image
              testID="healphaImage"
              accessibilityLabel="healphaImage"
                source={HeAlpha}
                style={{
                  height: wp(30),
                  width: wp(160),
                  marginLeft: wp(20),
                  paddingTop: wp(30)
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  navigate = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.delete_account_function()}
        {this.navigationView()}
      </View>
    );
  }
}

export default withTranslation()(CustomDrawer);
