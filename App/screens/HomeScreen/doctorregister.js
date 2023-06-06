import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import {View, ActivityIndicator} from 'react-native';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
//import NetInfo from '@react-native-community/netinfo'
import getBaseUrl from '../../config/Config';

export default class doctorregister extends Component {
  state = {
    url: '',
    load1: false,
  };
  componentDidMount = async () => {
    this.setState({load1: true});
    await this.getweburl();
  };

  getweburl = () => {
    let url = getBaseUrl() + 'doctor_reg_url/';
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({url: response.message, load1: false});
        console.log('url=' + JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  _onShouldStartLoadWithRequest = (e) => {
    var isDL = false;
    if (e.url.split('/')[4] === 'mobile1') {
      // alert("hi")
      isDL = true;
    }

    if (isDL) {
      this.props.navigation.navigate('SignIn');
      // this.refs._webView.stopLoading();
      return true;
    }
    return false;
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
        style={{marginTop: -60}}
        source={{uri: this.state.url}}
        ref="_webView"
        onNavigationStateChange={this._onShouldStartLoadWithRequest}
        startInLoadingState
      />
    );
  }
}
