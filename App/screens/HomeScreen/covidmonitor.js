import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
//import NetInfo from '@react-native-community/netinfo'
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
export default class covidmonitor extends Component {
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
      load2: false,
      refreshing: false,
    };
  }
  componentDidMount = async () => {
    this.setState({load1: true});
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
      const doctorname = await AsyncStorage.getItem('doctorname');
      if (doctorname !== null) {
        this.setState({
          name: doctorname.split(' ')[0] + ' ' + doctorname.split(' ')[2],
        });
      }
      //Name:Archana-16/11/2020-Updated Roletype
      await this.setState({roletype: 'Practice'});
    } catch (error) {
      console.log('got error');
    }
    this.getweburl();
  };
  getweburl1 = () => {
    this.getweburl();
    this.setState({load2: true});
  };
  getweburl = () => {
    let url = getBaseUrl() + 'covid_monitor_url/';
    console.log(
      'token' + global.token,
      'hlp_id' + '',
      'role_type' + 'op_doctor',
      'doc_id:' + global.doctor_id,
      'doc_name:' + global.doctor_name,
    );
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: global.token,
        hlp_id: '',
        role_type: 'op_doctor',
        doc_id: global.doctor_id,
        doc_name: global.doctor_name,
        corporate_flag: 0,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({url: response.data, load2: false});
        console.log('url=' + JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getweburl().then((item) => {
      this.setState({refreshing: false});
    });
  };
  ActivityIndicatorLoadingView() {
    console.log('12345');
    return (
      <ActivityIndicator
        color="#009688"
        size="large"
        style={styles.ActivityIndicatorStyle}
        hidesWhenStopped={true}
      />
    );
  }
  render() {
    if (this.state.load2) {
      // alert("123")

      // this.props.navigation.navigate('covidmonitor')
      // return(
      // <WebView
      //   style={{marginTop: 0}}
      //   source={{uri: this.state.url}}
      //   renderLoading={this.ActivityIndicatorLoadingView}
      //   startInLoadingState={true}
      // />
      // )
      // return(
      // // <View style={{
      // //     flex: 1,
      // //     marginTop:250,
      // //     // justifyContent: 'center',
      // //     // alignItems: 'center'
      // // }}>
      // // <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
      // // </View>
      // <ScrollView
      return (
        <View
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }></View>
      );
      // }></ScrollView>
      // )
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
            <Title style={{color: '#FFF', fontSize: 17}}>Covid Monitor</Title>
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
          style={{marginTop: 0}}
          source={{uri: this.state.url}}
          renderLoading={this.ActivityIndicatorLoadingView}
          startInLoadingState={true}
        />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  WebViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },

  ActivityIndicatorStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
