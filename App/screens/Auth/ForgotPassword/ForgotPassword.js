import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import {View, Text} from 'react-native';
import {
  Input,
  Label,
  Container,
  Content,
  Footer,
  Button,
  Toast,
} from 'native-base';

// styles
import styles from './ForgotPasswordStyles';
import {TEXT_INPUT_COLOR} from '../../../themes/variable';
import {getAndVerifyForgotPasswordOTp} from '../../../services/ForgotPasswordService';
import NavRoutes from '../../../constants/NavRoutes';
import i18n from '../../../../i18n';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      input: '',
    };
  }

  sendOtp = async () => {
    try {
      const {input} = this.state;
      const {t} = this.props;
      if (input) {
        const payload = {
          email: input,
          user_type: 'doctor',
        };
        const response = await getAndVerifyForgotPasswordOTp(payload);
        if (response && response?.status_code === 200) {
          this.props.navigation.navigate(NavRoutes.PUBLIC.OTP, {
            from_forgot_password: true,
            email_mobile_text: input,
          });
        }
      } else {
        Toast.show({
          text: i18n.t('HELP.FORGOT_PASSWORD.EMAIL_PHONE_NUMBER'),
          type: 'warning',
          duration: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        text: error?.message || i18n.t('HELP.FORGOT_PASSWORD.EMAIL_PHONE_NUMBER_ERROR'),
        type: 'danger',
        duration: 3000,
      });
    }
  };
  handleTextInput = (text) => {
    this.setState({
      input: text,
    });
  };

  render() {
    const {t} = this.props;
    return (
      <Container style={styles.container}>
        <Content>
          <View>
            <Label style={styles.labelStyle}>
              {i18n.t('HELP.FORGOT_PASSWORD.TITLE')}
            </Label>
            <Input
              value={this.state.input}
              style={styles.inputStyles}
              placeholderTextColor={TEXT_INPUT_COLOR}
              placeholder={i18n.t('HELP.FORGOT_PASSWORD.PLACEHOLDER')}
              onChangeText={(text) => this.handleTextInput(text)}
            />
          </View>
        </Content>
        <Footer style={styles.footer}>
          <Button
            style={styles.footerButtonStyles}
            onPress={() => this.sendOtp()}>
            <Text style={styles.footerButtonText}>
              {i18n.t('HELP.FORGOT_PASSWORD.SUBMIT')}
            </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

export default withTranslation()(ForgotPassword);
