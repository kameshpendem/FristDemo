import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import {Button, Container, Content, Toast, Footer} from 'native-base';
import FlashMessage from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart'; // Import package from node modules

// redux actions
// import {getChangeList} from '../../../redux/actions/change_action';

// styles
import styles from './ChangePasswordStyles';
import {checkPasswordSpecifications} from '../../../utils/Password';

// utils and routes
import NavRoutes from '../../../constants/NavRoutes';

import CheckIcon from '../ImageComponents/CheckInActiveIcon';
import CheckActiveIcon from '../ImageComponents/CheckActiveIcon';

import {
  isUpper,
  isLower,
  specialCharacter,
  passwordLength,
} from '../DoctorRegistration/PasswordValidator';
import AuthUtils from '../../../utils/AuthUtils';
import i18n from '../../../../i18n';
import {changePassword1} from '../../../redux/actions/changePassword_action';
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      new: '',
      new1: '',
      length_flag: false,
      upper_case: false,
      lower_case: false,
      special_character: false,
    };
  }

  change = async () => {
    const {t} = this.props;
    const selectedCountry = await AuthUtils.getUserCountry();
    if (!this.state.password) {
      this.ChangeAlert.showMessage({
        message: i18n.t('HELP.CHANGE_PASSWORD.ALERT'),
        description: i18n.t('HELP.CHANGE_PASSWORD.PLEASE_ENTER_CURRENT_PASSWORD'),
        type: 'warning',
        icon: 'auto',
      });
    } else if (!this.state.new) {
      this.ChangeAlert.showMessage({
        message: i18n.t('HELP.CHANGE_PASSWORD.ALERT'),
        description: i18n.t('HELP.CHANGE_PASSWORD.PLEASE_ENTER_NEW_PASSWORD'),
        type: 'warning',
        icon: 'auto',
      });
    } else if (!this.state.new1) {
      this.ChangeAlert.showMessage({
        message: i18n.t('HELP.CHANGE_PASSWORD.ALERT'),
        description: i18n.t('HELP.CHANGE_PASSWORD.PLEASE_ENTER_CONFIRM_PASSWORD'),
        type: 'warning',
        icon: 'auto',
      });
    } else if (this.state.new !== this.state.new1) {
      this.ChangeAlert.showMessage({
        message: i18n.t('HELP.CHANGE_PASSWORD.ALERT'),
        description: i18n.t('HELP.CHANGE_PASSWORD.CONFIRM_NEW_AND_OLD_PASSWORD'),
        type: 'warning',
        icon: 'auto',
      });
    } else {
      const obj = checkPasswordSpecifications(this.state.new);

      if (obj.flag) {
        this.ChangeAlert.showMessage({
          message: i18n.t('HELP.CHANGE_PASSWORD.ALERT'),
          description: obj.message,
          type: 'warning',
          icon: 'auto',
        });
      } else {
        const variables= {
          current_password: this.state.password,
          new_password: this.state.new,
          confirm_password: this.state.new1,
        }
        console.log("variables",variables)
        await changePassword1(variables)
          .then(res => {
            if (res.message == 'PASSWORD_CHANGED_SUCCESSFULLY') {
              // alert(i18n.t('CUSTM_CHANGEPASSWORD.SUCC_TXT'));
              Toast.show({
                text: i18n.t('HELP.CHANGE_PASSWORD.PASSWORD_UPDATED_SUCCESS'),
                type: 'success',
                duration: 3000,
              });
              setTimeout(async () => {
                await AsyncStorage.clear();
                AuthUtils.setUserCountry(selectedCountry);
                RNRestart.Restart();
              }, 3000);
            }else {
              // alert(res.message);
              // this.ChangeAlert.showMessage({
              //   message: i18n.t('HELP.CHANGE_PASSWORD.ALERT'),
              //   description: res.message,
              //   type: 'warning',
              //   icon: 'auto',
              // });
              Toast.show({
                text: res.message,
                type: 'warning',
                icon: 'auto',
              });
              this.setState({reload: false});
            }
          })
          .catch(error => {
            console.error(error);
            if (error.message == 'INVALID_CURRENT_PASSWORD') {
              alert("Please enter correct current password")
            }
            else{
              alert(error.message)
            }
          });
        // await this.props.getChangeList({
        //   oldpwd: this.state.password,
        //   newpwd: this.state.new,
        //   confirm_pass: this.state.new1,
        //   nh_id: global.doctor_id,
        //   token: global.token,
        // });
        // if (
        //   this.props.changeList.message == 0 &&
        //   this.state.password != undefined &&
        //   this.state.new != undefined &&
        //   this.state.new1 != undefined
        // ) {
        //   this.ChangeAlert.showMessage({
        //     message: i18n.t('HELP.CHANGE_PASSWORD.ALERT'),
        //     description: i18n.t('HELP.CHANGE_PASSWORD.ENTER_CORRECT_PASSWORD'),
        //     type: 'warning',
        //     icon: 'auto',
        //   });
        //   this.setState({reload: false});
        // } else if (
        //   this.props.changeList.message == true &&
        //   this.state.password != undefined &&
        //   this.state.new != undefined &&
        //   this.state.new1 != undefined
        // ) {
        //   Toast.show({
        //     text: i18n.t('HELP.CHANGE_PASSWORD.PASSWORD_UPDATED_SUCCESS'),
        //     type: 'success',
        //     duration: 3000,
        //   });
        //   setTimeout(async () => {
        //     await AsyncStorage.clear();
        //     AuthUtils.setUserCountry(selectedCountry);
        //     RNRestart.Restart();
        //   }, 3000);
        //   // this.props.navigation.navigate(NavRoutes.PUBLIC.SIGN_IN);
        // }
      }
    }
  };

  renderSpecificationsHeaderText = () => {
    const {t} = this.props;
    return (
      <View
        style={[
          styles.marginHorizontal,
          styles.marginTop,
          styles.marginBottom,
        ]}>
        <Text style={styles.passwordSpecificTextStyles}>
          {i18n.t('HELP.CHANGE_PASSWORD.PASSWORD_CONTAIN_TEXT')}
        </Text>
      </View>
    );
  };

  renderSpecificationsSubText = (text, flag) => {
    if (flag) {
      return (
        <View
          style={[
            styles.marginHorizontal,
            styles.marginTop,
            styles.marginBottom,
            styles.flexDirection,
          ]}>
          <CheckActiveIcon />
          <Text style={styles.activePasswordSpecificTextStyles}>{text}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.marginHorizontal,
            styles.marginTop,
            styles.marginBottom,
            styles.flexDirection,
          ]}>
          <CheckIcon />
          <Text style={styles.passwordSpecificTextStyles}>{text}</Text>
        </View>
      );
    }
  };

  newPassword = (text) => {
    const upper_case = isUpper(text);
    const lower_case = isLower(text);
    const special_character = specialCharacter(text);
    const length_flag = passwordLength(text);

    this.setState({
      upper_case,
      lower_case,
      special_character,
      length_flag,
      new: text,
    });
  };

  render() {
    const {t} = this.props;
    return (
      <Container>
        <Content>
          <TextInput
            allowFontScaling={false}
            placeholder={i18n.t('HELP.CHANGE_PASSWORD.CURRENT_PASSWORD')}
            returnKeyType="go"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={this.state.hidePassword1}
            style={styles.input}
            ref={(input) => (this.passwordInput = input)}
            onChangeText={(text) => this.setState({password: text})}
          />

          <TextInput
            allowFontScaling={false}
            placeholder={i18n.t('HELP.CHANGE_PASSWORD.NEW_PASSWORD')}
            returnKeyType="go"
            autoCapitalize="none"
            secureTextEntry={this.state.hidePassword2}
            autoCorrect={false}
            style={styles.input}
            ref={(input) => (this.passwordInput = input)}
            onChangeText={(text) => this.newPassword(text)}
          />

          <TextInput
            allowFontScaling={false}
            placeholder={i18n.t('HELP.CHANGE_PASSWORD.CONFIRM_PASSWORD')}
            returnKeyType="go"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={this.state.hidePassword3}
            style={styles.input}
            ref={(input) => (this.passwordInput = input)}
            onChangeText={(text) => this.setState({new1: text})}
          />
          {this.renderSpecificationsHeaderText()}
          {this.renderSpecificationsSubText(
            i18n.t('HELP.CHANGE_PASSWORD.CURRENT_PASSWORD_LENGTH'),
            this.state.length_flag,
          )}
          {this.renderSpecificationsSubText(
            i18n.t('HELP.CHANGE_PASSWORD.UPPER_CASE'),
            this.state.upper_case,
          )}
          {this.renderSpecificationsSubText(
            i18n.t('HELP.CHANGE_PASSWORD.LOWER_CASE'),
            this.state.lower_case,
          )}
          {this.renderSpecificationsSubText(
            i18n.t('HELP.CHANGE_PASSWORD.SPECIAL_CHARACTER'),
            this.state.special_character,
          )}
        </Content>
        <Footer style={styles.footerStyles}>
          <Button onPress={() => this.change()} style={styles.buttonStyles}>
            <Text style={styles.updateText}>{i18n.t('HELP.CHANGE_PASSWORD.UPDATE')}</Text>
          </Button>
        </Footer>
        <FlashMessage position="top" ref={(ref) => (this.ChangeAlert = ref)} />
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  changeList: state.changeList.changeList,
  isFetching3: state.changeList.isFetching3,
});

export default withTranslation()(
  connect(mapStateToProps, {})(ChangePassword),
);
