import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import {View, ActivityIndicator, Text} from 'react-native';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
//import NetInfo from '@react-native-community/netinfo'

export default class Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      doctorid: '',
      token: '',
      roletype: '',
      load1: false,
      email: this.props.navigation.state.params.email,
      uname: this.props.navigation.state.params.uname,
      uid: this.props.navigation.state.params.uid,
      app_type: this.props.navigation.state.params.app_type,
      hlpd: this.props.navigation.state.params.hlpd,
      b_id: this.props.navigation.state.params.b_id,
    };
  }
  componentDidMount = async () => {
    //   alert(this.state.email+"k"+this.state.uname+"k"+this.state.uid+"k"+this.state.app_type+" "+this.state.hlpd+" "+this.state.b_id)
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
      const docimage = await AsyncStorage.getItem('docimage');
      console.log(docimage);
      if (docimage !== null) {
        const docimage1 = docimage.replace(/\s/g, '');
        this.setState({docimg: docimage1});
      } else {
        const docimage1 = '';
        this.setState({docimg: docimage1});
      }

      // const role = await AsyncStorage.getItem('roletype');
      // if (role !== null) {
      await this.setState({roletype: 'Doctor'});
      //}
    } catch (error) {
      console.log('got error');
    }
    this.getweburl();
  };
  getweburl = () => {
    let kb = JSON.stringify({
      token: this.state.token,
      //Name:Archana-16/11/2020-Updated Roletype
      role_type: 'Practice',
      email: this.state.email,
      username: this.state.uname,
      hlp_id: this.state.hlpd,
      doc_id: this.state.doctorid,
      branch_id: this.state.b_id,
      uid: this.state.uid.replace(/&/gi, '.'),
      appointment_type: this.state.app_type,
      userimage: this.state.docimg,
    });
    // alert(kb)
    // service_reg_url
    console.log(kb);
    let url = getBaseUrl() + 'service_reg_url';
    console.log(
      'url=' +
        url +
        ' hlpid=' +
        this.state.doctorid +
        ' token=' +
        this.state.token +
        ' roletype=' +
        this.state.roletype,
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
        this.setState({url: response.data, load1: false});
        console.log('url=' + JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
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
    return (
      <WebView
        // style={{marginTop: -40}}
        source={{uri: this.state.url}}
        startInLoadingState
      />
      // <View>
      //     <Text>hi</Text>
      // </View>
    );
  }
}
