import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {
  Container,
  Header,
  Content,
  Thumbnail,
  Text,
  Row,
  Col,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import getBaseUrl from '../../config/Config';
import i18next from 'i18next';
import i18n from '../../../i18n';

// const Realm = require('realm');
// let realm;
class Settings extends Component {
  constructor(props) {
    super(props);
    // realm = new Realm({
    //   schema: [
    //     {
    //       name: 'Notifications',
    //       properties: {
    //         id: {type: 'int', default: 0},
    //         hlpid: 'string',
    //         created_date: 'string',
    //         title: 'string',
    //         body: 'string',
    //         // data:'data?'
    //       },
    //     },
    //   ],
    // });
    this.state = {
      isLoading: true,
      data: [],
      note: false,
    };
  }
  componentDidMount = async () => {
    const docid = await AsyncStorage.getItem('doctorid');
    if (docid !== null) {
      this.setState({docid: docid});
      global.doctor_id = this.state.docid;
    }
    // var mydata = realm
    //   .objects('Notifications')
    //   .filtered(`hlpid ==  "${global.doctor_id}"`);
    // if (mydata.length == 0) {
    //   // alert("hi")
    //   this.setState({
    //     note: true,
    //   });
    // }
    this.setState({data: mydata, isLoading: false});
  };
  componentDidUpdate = () => {
    // var mydata = realm
    //   .objects('Notifications')
    //   .filtered(`hlpid ==  "${global.doctor_id}"`);
    // // alert(JSON.stringify(mydata))
    // // if(mydata.length==0){
    // //   // alert("hi")
    // //   this.setState({
    // //     note:true
    // //   })
    // // }
    // if (this.state.data.length < mydata.length) {
    //   this.setState({data: mydata});
    // }
  };

  loggingOutPut = async (deviceRegID) => {
    const deviceToken = await AsyncStorage.getItem('jwt_token');
    let putUrl = getBaseUrl() + `v1/user/device-token/${deviceRegID}`;
    fetch(putUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${deviceToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.message;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  signOut = async () => {
    let url = getBaseUrl() + 'logout';
    const deviceRegID = await AsyncStorage.getItem('deviceRegID');
    let putUrl = getBaseUrl() + `v1/user/device-token/${deviceRegID}`;
    if (deviceRegID !== null) {
      global.deviceid = deviceRegID;
    }
    const hlp = await AsyncStorage.getItem('doctorid');
    if (hlp !== null) {
      global.hlpid = hlp;
    }
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hlp: global.hlpid,
        device_id: global.deviceid,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        return response.message;
      })
      .catch((error) => {
        console.error(error);
      });
    this.loggingOutPut(deviceRegID);
    // realm.write(() => {
    //   realm.delete(this.state.data);
    // });
    AsyncStorage.clear();
    this.props.navigation.navigate('SignIn');
  };

  render() {
    return (
      <Container>
        <Content>
          <Row>
            <Col style={{marginLeft: 30, marginVertical: 15}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Profile')}>
                <Text allowFontScaling={false}>
                  {i18n.t('PROFILE.PROFILE')}
                </Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>
          <Row>
            <Col style={{marginLeft: 30, marginVertical: 15}}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('practiceapproval');
                }}>
                <Text allowFontScaling={false}>
                  {i18n.t('PROFILE.SELECT_PRACTICE')}
                </Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>
          <Row>
            <Col style={{marginLeft: 30, marginVertical: 15}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('listofdevices')}>
                <Text allowFontScaling={false}>
                  {i18n.t('PROFILE.DEVICES')}
                </Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>
          <Row>
            <Col style={{marginLeft: 30, marginVertical: 15}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ChangePassword')
                }>
                <Text allowFontScaling={false}>
                  {i18n.t('PROFILE.CHANGE_PASSWORD')}
                </Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>
          <Row>
            <Col style={{marginLeft: 30, marginVertical: 15}}>
              <TouchableOpacity onPress={this.signOut}>
                <Text allowFontScaling={false}>{i18n.t('PROFILE.LOGOUT')}</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col style={{backgroundColor: '#dcdcdc', height: 1}}></Col>
          </Row>
        </Content>
      </Container>
    );
  }
}

export default Settings;
