import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  processColor,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {getNonList} from '../../redux/actions/nonhealpha_action';
import {
  Row,
  Col,
  Thumbnail,
  DatePicker,
  Footer,
  FooterTab,
  Button,
  Item,
  Label,
  Icon,
  Header,
  Container,
  Content,
  Left,
  Right,
  Body,
  Title,
} from 'native-base';
import {connect} from 'react-redux';
import {getPostList} from '../../redux/actions/post_action';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import {getApiUrl} from '../../config/Config';
import i18n from '../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profile_image: require('../../assets/images/tar.png'),
    };
    this.handleBackPress = this.handleBackPress.bind(this);
  }
  componentDidMount = () => {
    this.fetchData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      async () => {
        console.log('12345');
        await this.props.getNonList({
          nh_id: global.doctor_id,
          token: global.token,
        });
        await this.props.getPostList({doctor_id: global.doctor_id});
        console.log(this.props.nonList.message);

        let d1 = new Date(this.props.nonList.message.from_date);
        let d2 = new Date(this.props.nonList.message.to_date);
        let startMonth = d1.getFullYear() * 12 + d1.getMonth();
        let endMonth = d2.getFullYear() * 12 + d2.getMonth();
        let monthInterval = endMonth - startMonth;
        let diff = (monthInterval / 12).toFixed(1);
        if (diff.split('.')[1] == 0) {
          this.setState({
            exp: diff.split('.')[0],
          });
        } else {
          this.setState({
            exp: diff.split('.')[0] + '.' + diff.split('.')[1],
          });
        }
        global.profile_image = this.props.nonList.message.profile_image;
        global.profile_image1 = this.props.nonList.message.profile_image;
        if (
          global.profile_image.trim() != '' &&
          global.profile_image != undefined &&
          global.profile_image != null
        ) {
          global.profile_image = {
            uri: getApiUrl() + '/' + global.profile_image.trim(),
          };
        } else {
          global.profile_image = require('../../assets/images/tar.png');
        }

        this.setState({
          list: this.props.nonList.message,
          profile_image: {
            uri:
              getApiUrl() +
              '/' +
              this.props.nonList.message.profile_image.trim(),
          },
          loading: false,
        });
        // this.fetchData();
      },
    );
  };

  componentWillUnmount = () => {
    this.willFocusSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  };
  handleBackPress() {
    this.props.navigation.goBack(null);
    return true;
  }
  fetchData = async () => {
    await this.props.getNonList({
      nh_id: global.doctor_id,
      token: global.token,
    });

    let d1 = new Date(this.props.nonList.message.from_date);
    let d2 = new Date(this.props.nonList.message.to_date);
    let startMonth = d1.getFullYear() * 12 + d1.getMonth();
    let endMonth = d2.getFullYear() * 12 + d2.getMonth();
    let monthInterval = endMonth - startMonth;
    let diff = (monthInterval / 12).toFixed(1);
    if (diff.split('.')[1] == 0) {
      this.setState({
        exp: diff.split('.')[0],
      });
    } else {
      this.setState({
        exp: diff.split('.')[0] + '.' + diff.split('.')[1],
      });
    }
    this.setState({
      list: this.props.nonList.message,
      profile_image: {
        uri:
          getApiUrl() + '/' + this.props.nonList.message.profile_image.trim(),
      },
      loading: false,
    });
  };
  render() {
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    return (
      <Container>
        <Content>
          <Header
            androidStatusBarColor={APP_PRIMARY_COLOR}
            style={{backgroundColor: APP_PRIMARY_COLOR}}>
            <Left>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="md-arrow-back" style={{color: '#FFF'}} />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={{color: '#FFF'}}>{i18n.t('PROFILE.PROFILE')}</Title>
            </Body>
            <Right>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('doctoredit')}>
                <Text allowFontScaling={false} style={{color: 'white'}}>
                {i18n.t('PROFILE.EDIT')}
                </Text>
              </TouchableOpacity>
            </Right>
          </Header>
          <Row style={{marginTop: 10}}>
            <Col size={25}>
              {this.state.list.profile_image.trim() == '' ? (
                <Thumbnail
                  square
                  source={require('../../assets/images/tar.png')}
                  style={{marginLeft: 10}}
                />
              ) : (
                <Thumbnail
                  square
                  source={this.state.profile_image}
                  style={{marginLeft: 10}}
                />
              )}
            </Col>
            <Col size={75}>
              <Text
                allowFontScaling={false}
                style={{fontWeight: 'bold', fontSize: 16}}>
                Dr.
                {this.state.list.first_name +
                  ' ' +
                  this.state.list.middle_name +
                  ' ' +
                  this.state.list.last_name}
              </Text>
              <Text
                allowFontScaling={false}
                style={{fontSize: 12, color: '#808080'}}>
                <Icon
                  style={{fontSize: 12, color: '#555b57'}}
                  type="FontAwesome"
                  name="graduation-cap"
                />{' '}
                {this.state.list.education[0].edu_degree +
                  ', ' +
                  this.state.list.prac[0].specialization.replace(
                    /^./,
                    this.state.list.prac[0].specialization[0].toUpperCase(),
                  )}
              </Text>
              <Text
                allowFontScaling={false}
                style={{fontSize: 12, color: '#808080'}}>
                <Icon
                  style={{fontSize: 12, color: 'green'}}
                  type="FontAwesome"
                  name="check-circle"
                />{' '}
                {i18n.t('PROFILE.MEDICAL_REGISTRATION_VERIFIED')}
              </Text>
            </Col>
          </Row>
          <Row style={{marginTop: 15}}>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>
          {this.state.list.phone_no != '' &&
            this.state.list.phone_no != null &&
            this.state.list.phone_no != undefined && (
              <Row style={{marginLeft: 10, marginTop: 10}}>
                <Col>
                  <Text allowFontScaling={false} style={{fontSize: 14}}>
                    <Icon
                      style={{fontSize: 18, color: 'black', marginTop: 10}}
                      type="FontAwesome"
                      name="phone-square"
                    />{' '}
                    {this.state.list.phone_no}
                  </Text>
                </Col>
              </Row>
            )}
          {this.state.list.phone_no != '' &&
            this.state.list.phone_no != null &&
            this.state.list.phone_no != undefined && (
              <Row style={{marginTop: 15}}>
                <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
              </Row>
            )}
          {this.state.list.email != '' &&
            this.state.list.email != null &&
            this.state.list.email != undefined && (
              <Row style={{marginLeft: 10, marginTop: 10}}>
                <Col>
                  <Text allowFontScaling={false} style={{fontSize: 14}}>
                    <Icon
                      style={{fontSize: 16, color: 'black', marginTop: 3}}
                      type="FontAwesome"
                      name="envelope"
                    />{' '}
                    {this.state.list.email}
                  </Text>
                </Col>
              </Row>
            )}
          {this.state.list.email != '' &&
            this.state.list.email != null &&
            this.state.list.email != undefined && (
              <Row style={{marginTop: 15}}>
                <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
              </Row>
            )}
          <Row style={{marginLeft: 10, marginTop: 10}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{fontWeight: 'bold', fontSize: 14}}>
                {i18n.t('PROFILE.EDUCATION')}
              </Text>
            </Col>
          </Row>
          {this.state.list.education.map((item, index) => (
            <Row key={index} style={{marginLeft: 20, marginTop: 10}}>
              <Col>
                <Text allowFontScaling={false} style={{fontSize: 12}}>
                  <Icon
                    style={{fontSize: 12}}
                    type="FontAwesome"
                    name="circle"
                  />{' '}
                  {item.edu_degree}
                </Text>
              </Col>
            </Row>
          ))}
          <Row style={{marginTop: 15}}>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>

          {/* {this.props.nonList.message.experience.map((item) =><Row>
<Col>
{item.from_date!=""&&item.till_date!=""&&<Row style={{marginLeft:10,marginTop:20}}>
<Col>
<Text allowFontScaling={false}style={{fontWeight:"bold",fontSize:14}}>Experience</Text>
</Col>
</Row>}

{item.from_date!=""&&item.till_date!=""&&<Row style={{marginLeft:20,marginTop:10}}>
<Col>
<Text allowFontScaling={false}style={{fontSize:12}}>
<Icon style={{fontSize:12}} type="FontAwesome" name="circle" /> From {item.from_date} To {item.till_date} {item.organization_name}</Text>
</Col>
</Row>}
{item.from_date!=""&&item.till_date!=""&&<Row style={{marginTop:15}}>
<Col style={{backgroundColor:"#dcdcdc",height:1}}></Col>
</Row>}
</Col>
</Row>)} */}

          <Row style={{marginLeft: 10, marginTop: 10}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{fontWeight: 'bold', fontSize: 14}}>
                {i18n.t('PROFILE.REGISTRATION')}
              </Text>
            </Col>
          </Row>
          <Row style={{marginLeft: 20, marginTop: 10}}>
            <Col>
              <Text allowFontScaling={false} style={{fontSize: 12}}>
                <Icon style={{fontSize: 12}} type="FontAwesome" name="circle" />{' '}
                {this.state.list.Medical_council}
              </Text>
            </Col>
          </Row>
          <Row style={{marginTop: 15}}>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  nonList: state.nonList.nonList,
});
export default connect(mapStateToProps, {getPostList, getNonList})(Profile);
