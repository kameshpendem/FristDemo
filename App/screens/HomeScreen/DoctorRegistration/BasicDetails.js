import React, {Component} from 'react';
import {View, Header, Left, Body, Container, Content, Toast} from 'native-base';
import Icon3 from 'react-native-vector-icons/Feather';
import {Text, TouchableOpacity, Image, PermissionsAndroid} from 'react-native';
import {withTranslation} from 'react-i18next';

// images, styles, components
import LogoWhite from '../../../assets/images/logo_white.png';
import Details from './Details';
import Styles from './DoctorRegistrationStyles';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';

class Basicdetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basic: true,
      exp: false,
      qual: false,
      password: false,
      otp: false,
      sign: false,
    };
  }

  componentDidMount() {
    const {t} = this.props;
    try {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]).then((granted) => {
        Object.entries(granted).map(([key, value]) => {
          console.log('Permission:KEY:VALUE', key, value);
        });
      });
    } catch (err) {
      Toast.show({
        text: (err && err.message) || t('LOGIN.ANDROID_PERMISSION_ERROR'),
        type: 'warning',
        duration: 3000,
      });
    }
  }
  Header() {
    const {t} = this.props;
    return (
      <View>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={Styles.headerStyles}>
          <Left style={Styles.leftHeaverView}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}
            testID="leftIconTouch"
            accessibilityLabel="leftIconTouch">
              <Icon3
              testID="leftIcon"
              accessibilityLabel="leftIcon"
                name="chevron-left"
                size={22}
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
          <Body />
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

  BasicDetailsSection1() {
    return (
      <View>
        <Details navigation={this.props.navigation} />
      </View>
    );
  }

  render() {
    return (
      <Container>
        {this.Header()}
        <Content>
          <View style={Styles.basicDetailsMainView}>
            {this.state.basic && this.BasicDetailsSection1()}
          </View>
        </Content>
      </Container>
    );
  }
}
export default withTranslation()(Basicdetails);
