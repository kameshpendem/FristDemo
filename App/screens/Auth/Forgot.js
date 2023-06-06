import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator  
} from 'react-native';
import {getForgotList} from '../../redux/actions/forgot_action';
import {getForList} from '../../redux/actions/for_action';
import {connect} from 'react-redux';
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
import FlashMessage from 'react-native-flash-message';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import i18n from '../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      r1: true,
      v1: false,
      s1: false,
      alertvisible4: false,
      load1: false,      
      name: [],
      namevalue: 'Select',
    };
    this.PICKER_DEFAULT_VAL = 'Select'
    this.onValueChangeName = this.onValueChangeName.bind(this)
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('SignIn');
    return true;
  };
  forgot = async () => {
    this.setState({load1: true});
    await this.props.getForgotList({
      nh_id: this.state.namevalue,
      email: this.state.email,
    });
    if (this.props.forgotList.message == 'mail sent successfully') {
      this.setState({load1: false, v1: false});
      this.ForgotAlert.showMessage({
        message: i18n.t('FORGOT.MAIL_SENT'),
        description: i18n.t('FORGOT.PLEASE_CHECK_YOUR_EMAIL'),
        type: 'success',
        icon: 'auto',
      });
    } else {
      this.ForgotAlert.showMessage({
        message: i18n.t('FORGOT.MAIL_SENT_FAILED'),
        description: i18n.t('FORGOT.PLEASE_CONTACT_HEALPHA_HELPDESK'),
        type: 'danger',
        icon: 'auto',
      });
    }
  };
  for = async () => {
    await this.props.getForList({
      email: this.state.email,
    });
    if (this.props.forList.message == 0) {
      // this.setState({
      //   v1:true ,
      //   name:this.props.forList.message
      // })
    } else {
      this.setState({
        v1: true,
        name: this.props.forList.message,
      });
    }
  };
  onValueChangeName = (value) => {    
    this.setState({
      namevalue: value,
    });
  };

  render() {
    const {input} = styles;
    const {forgotList, isFetching2, forList, isFetching4} = this.props;
    if (this.state.load1) {
      return (
        <View
          style={{
            flex: 1,
            marginTop: 250,
            // justifyContent: 'center',
            // alignItems: 'center'
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
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
              }}>
              {i18n.t("FORGOT.MA_IL_SENT")}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{height: 40, marginTop: 8, marginRight: 10, width: 80}}
                onPress={() => {
                  this.setState({alertvisible4: false});
                  this.props.navigation.navigate('SignIn');
                }}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  {i18n.t('FORGOT.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }

    return (
      //   <View>
      <Container>
        <Content>
          <StatusBar
            backgroundColor={APP_PRIMARY_COLOR}
            barStyle={'light-content'}
          />
          {/* <Text> Forgot </Text> */}

          <Row>
            <Col>
              <TextInput
                allowFontScaling={false}
                placeholder={i18n.t('FORGOT.ENTER_YOUR_EMAIL_ID')}
                placeholderTextColor={'#2D323C'}
                returnKeyType="done"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={input}
                onChangeText={(text) => this.setState({email: text})}
              />
              {this.state.s1 ? (
                <Text
                  allowFontScaling={false}
                  style={{color: 'red', fontSize: 10, marginLeft: 40}}>
                  {i18n.t('FORGOT.PLEASE_ENTER_THE_VALID_EMAIL')}
                </Text>
              ) : null}
            </Col>
          </Row>
          {this.state.v1 ? (
            <Row>
              <Col style={input}>
                <Item picker style={{marginTop: -10}}>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="ios-caret-down" fontSize={12} />}
                    selectedValue={this.state.namevalue}                    
                    onValueChange={(val) => this.onValueChangeName(val ? val.toString() : "")}>
                    <Picker.Item
                      label={'Select'}
                      value={this.PICKER_DEFAULT_VAL}
                    />
                    {this.state.name.map((itemdata, index) => (
                      <Picker.Item
                        key={index}
                        label={itemdata.first_name + ' ' + itemdata.last_name}
                        value={itemdata.non_healpha_user_id}
                      />
                    ))}
                  </Picker>
                </Item>
              </Col>
            </Row>
          ) : null}
          {this.state.r1 ? (
            <Row>
              <Col style={{alignItems: 'center', marginTop: 20}}>
                <Button
                  onPress={() =>
                    this.state.namevalue == this.PICKER_DEFAULT_VAL
                      ? this.for()
                      : this.forgot()
                  }
                  style={{
                    width: 90,
                    height: 45,
                    backgroundColor: APP_PRIMARY_COLOR,
                    borderColor: APP_PRIMARY_COLOR,
                    borderRadius: 8,
                    borderWidth: 1,
                    alignSelf: 'center',
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', marginLeft: 25}}>
                    {' '}
                    Reset{' '}
                  </Text>
                </Button>
              </Col>
            </Row>
          ) : null}
          {/* <Row>
             <Col style={{alignItems:'center',marginTop:20}}>
             <Button onPress={this.for} style={{width:90,height:45,backgroundColor:APP_PRIMARY_COLOR,borderColor:APP_PRIMARY_COLOR, borderRadius:8, borderWidth: 1,}}>
             <Text allowFontScaling={false} style={{color:"white",marginLeft:25}}> Reset </Text>
             </Button>
             </Col>
         </Row> */}
        </Content>
        <FlashMessage position="top" ref={(ref) => (this.ForgotAlert = ref)} />
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  forgotList: state.forgotList.forgotList,
  isFetching2: state.forgotList.isFetching2,
  forList: state.forList.forList,
  isFetching4: state.forList.isFetching4,
});
// export default Forgot;
export default connect(mapStateToProps, {getForgotList, getForList})(Forgot);
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
