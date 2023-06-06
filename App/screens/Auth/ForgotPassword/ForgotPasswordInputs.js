import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import {Button, Container, Content, Toast, Footer} from 'native-base';
import FlashMessage from 'react-native-flash-message';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

// styles
import styles from './ForgotPasswordStyles';
import {checkPasswordSpecifications} from '../../../utils/Password';

import CheckIcon from '../../HomeScreen/ImageComponents/CheckInActiveIcon';
import CheckActiveIcon from '../../HomeScreen/ImageComponents/CheckActiveIcon';

import {
  isUpper,
  isLower,
  specialCharacter,
  passwordLength,
} from '../../HomeScreen/DoctorRegistration/PasswordValidator';
import {createNewPassword} from '../../../services/ForgotPasswordService';
import NavRoutes from '../../../constants/NavRoutes';

// redux actions
import {getChangeList} from '../../../redux/actions/change_action';
import i18n from '../../../../i18n';

class ForgotPasswordInputs extends Component {
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
      from_forgot_password: '',
      email_mobile_text: '',
      token: '',
    };
  }

  componentDidMount() {
    const {from_forgot_password, email_mobile_text, token} =
      this.props?.navigation?.state?.params;
    this.setState({email_mobile_text, from_forgot_password, token});
  }
  change = async () => {
    try {
      const {t} = this.props;
      if (!this.state.new) {
        this.ChangeAlert.showMessage({
          message: i18n.t('PASSWORD.ALERT'),
          description: i18n.t('PASSWORD.PLEASE_ENTER_NEW_PASSWORD'),
          type: 'warning',
          icon: 'auto',
        });
      } else if (!this.state.new1) {
        this.ChangeAlert.showMessage({
          message: i18n.t('PASSWORD.ALERT'),
          description: i18n.t('PASSWORD.PLEASE_ENTER_CONFIRM_PASSWORD'),
          type: 'warning',
          icon: 'auto',
        });
      } else if (this.state.new !== this.state.new1) {
        this.ChangeAlert.showMessage({
          message: i18n.t('PASSWORD.ALERT'),
          description: i18n.t('PASSWORD.CONFIRM_NEW_AND_OLD_PASSWORD'),
          type: 'warning',
          icon: 'auto',
        });
      } else {
        const obj = checkPasswordSpecifications(this.state.new);

        if (obj.flag) {
          this.ChangeAlert.showMessage({
            message: i18n.t('PASSWORD.ALERT'),
            description: obj.message,
            type: 'warning',
            icon: 'auto',
          });
        } else {
          const payload = {
            password: this.state.new,
            confirm_password: this.state.new1,
            invitation_code: this.state.token,
          };
          const response = await createNewPassword(payload);
          if (response && response?.status_code === 200) {
            Toast.show({
              text:i18n.t('PASSWORD.CHANGED_PASSWORD_SUCCESS'),
              type: 'success',
              duration: 3000,
            });
            this.props.navigation.navigate(NavRoutes.PUBLIC.SIGN_IN);
          }
        }
      }
    } catch (error) {
      Toast.show({
        text: i18n.t('PASSWORD.CHANGED_PASSWORD_ERROR'),
        type: 'warning',
        duration: 3000,
      });
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
          {i18n.t('PASSWORD.PASSWORD_CONTAIN_TEXT')}
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
            placeholder={i18n.t('PASSWORD.NEW_PASSWORD')}
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
            placeholder={i18n.t('PASSWORD.CONFIRM_PASSWORD')}
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
            i18n.t('PASSWORD.CURRENT_PASSWORD_LENGTH'),
            this.state.length_flag,
          )}
          {this.renderSpecificationsSubText(
            i18n.t('PASSWORD.UPPER_CASE'),
            this.state.upper_case,
          )}
          {this.renderSpecificationsSubText(
            i18n.t('PASSWORD.LOWER_CASE'),
            this.state.lower_case,
          )}
          {this.renderSpecificationsSubText(
            i18n.t('PASSWORD.SPECIAL_CHARACTER'),
            this.state.special_character,
          )}
        </Content>
        <Footer style={styles.footerStyles}>
          <Button onPress={() => this.change()} style={styles.buttonStyles}>
            <Text style={styles.updateText}>{i18n.t('PASSWORD.UPDATE')}</Text>
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
  connect(mapStateToProps, {getChangeList})(ForgotPasswordInputs),
);
