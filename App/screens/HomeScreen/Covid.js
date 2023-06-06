import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Container,
  Row,
  Col,
  Content,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
} from 'native-base';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';

//import NetInfo from '@react-native-community/netinfo'

export default class Covid extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      doctorid: '',
      token: '',
      roletype: '',
      load1: false,
      doctor_name: '',
      email: this.props.navigation.state.params.email,
      uname: this.props.navigation.state.params.uname,
      uid: this.props.navigation.state.params.uid,
      app_type: this.props.navigation.state.params.app_type,
      hlpd: this.props.navigation.state.params.hlpd,
      enc_id: this.props.navigation.state.params.enc_id,
      b_id: this.props.navigation.state.params.b_id,
      load2: false,
      refreshing: false,
    };
  }
  componentDidMount = async () => {
    //   alert(this.state.email+"k"+this.state.uname+"k"+this.state.uid+"k"+this.state.app_type+" "+this.state.hlpd+" "+this.state.b_id)
    this.setState({load1: true});
    let a = global.doctor_name.split(' ');
    let b = a.length;
    this.setState({doctor_name: a[0] + ' ' + a[b - 1]});
    await this.getuserdata();
  };

  getuserdata = async () => {
    try {
      const tokenid = await AsyncStorage.getItem('userToken');

      if (tokenid !== null) {
        this.setState({token: tokenid});
      }
      const doctorid = await AsyncStorage.getItem('doctorid');
      if (doctorid !== null) {
        this.setState({doctorid: doctorid});
      }
      // const role = await AsyncStorage.getItem('roletype');
      // if (role !== null) {
      //Name:Archana-16/11/2020-Updated Roletype
      await this.setState({roletype: 'Practice'});
      //}
    } catch (error) {
      console.log('got error');
    }
    this.getweburl();
  };
  getweburl = () => {
    let kb = JSON.stringify({
      token: this.state.token,
      hlp_id: this.state.hlpd,
      role_type: 'patient',
      doc_id: this.state.doctorid,
      enc_id: this.state.enc_id,
      doc_name: this.state.doctor_name,
      corporate_flag: 0,
    });
    console.log(kb);
    // service_reg_url
    let url = getBaseUrl() + 'covid_monitor_url';
    console.log(
      'url=' +
        url +
        ' hlpid=' +
        this.state.doctorid +
        ' token=' +
        this.state.token +
        ' roletype=' +
        this.state.roletype +
        'enc_id=' +
        this.state.enc_id,
    );
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: kb,
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({url: response.data, load1: false, load2: false});
        console.log('urjjjjjjjjl=' + JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  getweburl1 = () => {
    this.getweburl();
    this.setState({load2: true});
  };
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getweburl().then((item) => {
      this.setState({refreshing: false});
    });
  };
  render() {
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
    if (this.state.load2) {
      return (
        <View
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }></View>
      );
    }
    return (
      <Container>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="md-arrow-back" style={{color: '#FFF'}} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={{color: '#FFF', fontSize: 17}}>
              Covid Monitoring
            </Title>
          </Body>
          <Right>
            {/* <View>{this.renderButton()}</View> */}
            {/* <TouchableOpacity style={{backgroundColor:"white"}} onPress={()=>this.getweburl()}> */}
            <Icon
              name="md-close"
              style={{color: '#FFF'}}
              onPress={() => this.getweburl1()}
            />
            {/* </TouchableOpacity> */}
          </Right>
        </Header>
        <WebView
          // style={{marginTop: -40}}
          source={{uri: this.state.url}}
          startInLoadingState
        />
      </Container>
      // <View>
      //     <Text>hi</Text>
      // </View>
    );
  }
}
