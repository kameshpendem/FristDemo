import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import {
  Row,
  Col,
  Button,
  Item,
  Label,
  Container,
  Content,
  Icon,
} from 'native-base';
import {connect} from 'react-redux';
import {getChangeList} from '../../redux/actions/change_action';
import FlashMessage from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import i18n from '../../../i18n'; 
import {Picker} from '@react-native-picker/picker';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertvisible4: false,
      password: '',
      icon1: 'eye-off',
      hidePassword1: true,
      new: '',
      icon2: 'eye-off',
      hidePassword2: true,
      new1: '',
      icon3: 'eye-off',
      hidePassword3: true,
    };
  }
  componentDidMount = () => {
    // this.change()
  };
  change = async () => {
    if (this.state.password == undefined || this.state.password === '') {
      this.ChangeAlert.showMessage({
        message: i18n.t("COMMON.ALERT"),
        description: i18n.t("PASSWORD.PLEASE_ENTER_CURRENT_PASSWORD"),
        type: 'warning',
        icon: 'auto',
      });
    } else if (this.state.new == undefined || this.state.new === '') {
      this.ChangeAlert.showMessage({
        message:  i18n.t("COMMON.ALERT"),
        description: i18n.t("PASSWORD.PLEASE_ENTER_NEW_PASSWORD"),
        type: 'warning',
        icon: 'auto',
      });
    } else if (this.state.new1 == undefined || this.state.new1 === '') {
      this.ChangeAlert.showMessage({
        message:  i18n.t("COMMON.ALERT"),
        description: i18n.t("PASSWORD.PLEASE_ENTER_CONFIRM_PASSWORD"),
        type: 'warning',
        icon: 'auto',
      });
    } else if (this.state.new !== this.state.new1) {
      this.ChangeAlert.showMessage({
        message:  i18n.t("COMMON.ALERT"),
        description: i18n.t("PASSWORD.CONFIRM_NEW_AND_OLD_PASSWORD"),
        type: 'warning',
        icon: 'auto',
      });
    } else {
      console.log('Inside else case:');
      await this.props.getChangeList({
        oldpwd: this.state.password,
        newpwd: this.state.new,
        confirm_pass: this.state.new1,
        nh_id: global.doctor_id,
        token: global.token,
      });
      if (
        this.props.changeList.message == 0 &&
        this.state.password != undefined &&
        this.state.new != undefined &&
        this.state.new1 != undefined
      ) {
        // alert("")
        this.ChangeAlert.showMessage({
          message:  i18n.t("COMMON.ALERT"),
          description: i18n.t("PASSWORD.CORRECT_PASSWORD"),
          type: 'warning',
          icon: 'auto',
        });
        this.setState({reload: false});
      } else if (
        this.props.changeList.message == true ||
        this.props.changeList.message !== 0
      ) {
        //   this.ChangeAlert.showMessage({
        //             message: "Success!",
        //             description: "Password Changed",
        //             type: "success",
        //             icon: "auto"
        //         });

        this.setState({alertvisible4: true});
      }
    }
  };

  _changeIcon1 = () => {
    this.state.icon1 !== 'eye-off'
      ? this.setState({icon1: 'eye-off', hidePassword1: true})
      : this.setState({icon1: 'eye', hidePassword1: false});
  };
  _changeIcon2 = () => {
    this.state.icon2 !== 'eye-off'
      ? this.setState({icon2: 'eye-off', hidePassword2: true})
      : this.setState({icon2: 'eye', hidePassword2: false});
  };
  _changeIcon3 = () => {
    this.state.icon3 !== 'eye-off'
      ? this.setState({icon3: 'eye-off', hidePassword3: true})
      : this.setState({icon3: 'eye', hidePassword3: false});
  };
  render() {
    const {input} = styles;
    const {changeList, isFetching3} = this.props;

    if (this.state.alertvisible4) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            height={240}
            onBackdropPress={() => this.setState({alertvisible4: false})}>
            <Icon
             testID="circleIcon"
             accessibilityLabel="circleIcon"
              type="FontAwesome"
              name="check-circle"
              style={{
                fontSize: 60,
                color: 'green',
                alignSelf: 'center',
                marginTop: 30,
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                marginVertical: 30,
              }}
              testID="passwordChangedText"
              accessibilityLabel="passwordChangedText">
              {i18n.t("PASSWORD.PASSWORD_CHANGED")}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{
                  height: 40,
                  marginTop: 8,
                  marginRight: 10,
                  width: 80,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={() => {
                  this.setState({alertvisible4: false});
                  AsyncStorage.clear();
                  this.props.navigation.navigate('SignIn');
                }}
                testID="okButton"
                accessibilityLabel="okButton">
                <Text allowFontScaling={false} style={{color: 'white'}}
                 testID="okText"
                 accessibilityLabel="okText">
                  {i18n.t("COMMON.OK")}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    return (
      <Container>
        <Content>
          <Row>
            <Col>
              <TextInput
               testID="currentPasswordTextInput"
               accessibilityLabel="currentPasswordTextInput"
                allowFontScaling={false}
                placeholder={i18n.t("PASSWORD.CURRENT_PASSWORD")}
                placeholderTextColor={'#2D323C'}
                returnKeyType="go"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={this.state.hidePassword1}
                style={input}
                ref={(input) => (this.passwordInput = input)}
                onChangeText={(text) => this.setState({password: text})}
              />
              <Icon
                style={{alignSelf: 'flex-end', marginTop: -45, marginRight: 25}}
                name={this.state.icon1}
                size={14}
                onPress={() => this._changeIcon1()}
                testID="eyeOffIcon"
                accessibilityLabel="eyeOffIcon"/>
            </Col>
          </Row>
          <Row>
            <Col>
              <TextInput
               testID="newPasswordTextInput"
               accessibilityLabel="newPasswordTextInput"
                allowFontScaling={false}
                placeholder={i18n.t("PASSWORD.NEW_PASSWORD")}
                placeholderTextColor={'#2D323C'}
                returnKeyType="go"
                autoCapitalize="none"
                secureTextEntry={this.state.hidePassword2}
                autoCorrect={false}
                style={input}
                ref={(input) => (this.passwordInput = input)}
                onChangeText={(text) => this.setState({new: text})}
              />
              <Icon
                style={{alignSelf: 'flex-end', marginTop: -45, marginRight: 25}}
                name={this.state.icon2}
                size={14}
                onPress={() => this._changeIcon2()}
                testID="eyeOffIcon2"
                accessibilityLabel="eyeOffIcon2"/>
            </Col>
          </Row>
          <Row>
            <Col>
              <TextInput
              testID="confirmPasswordTextInput"
              accessibilityLabel="confirmPasswordTextInput"
                allowFontScaling={false}
                placeholder={i18n.t("PASSWORD.CONFIRM_PASSWORD")}
                placeholderTextColor={'#2D323C'}
                returnKeyType="go"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={this.state.hidePassword3}
                style={input}
                ref={(input) => (this.passwordInput = input)}
                onChangeText={(text) => this.setState({new1: text})}
              />
              <Icon
                style={{alignSelf: 'flex-end', marginTop: -45, marginRight: 25}}
                name={this.state.icon3}
                size={14}
                onPress={() => this._changeIcon3()}
                testID="eyeOffIcon3"
                accessibilityLabel="eyeOffIcon3"/>
            </Col>
          </Row>
          <Row>
            <Col style={{alignItems: 'center', marginTop: 20}}>
              <Button
                onPress={this.change}
                style={{
                  width: 90,
                  height: 45,
                  backgroundColor: APP_PRIMARY_COLOR,
                  borderColor: APP_PRIMARY_COLOR,
                  borderRadius: 8,
                  borderWidth: 1,
                  alignSelf: 'center',
                }}
                testID="submitButton"
                accessibilityLabel="submitButton">
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 20}}>
                  {' '}
                  {i18n.t("PERSON_REGISTRATION.SUBMIT")}{' '}
                </Text>
              </Button>
            </Col>
          </Row>
        </Content>
        <FlashMessage position="top" ref={(ref) => (this.ChangeAlert = ref)} />
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  changeList: state.changeList.changeList,
  isFetching3: state.changeList.isFetching3,
});
export default connect(mapStateToProps, {getChangeList})(ChangePassword);
const styles = {
  input: {
    marginTop: 15,
    borderColor: '#345D7E',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
    marginHorizontal: 20,
  },
};
