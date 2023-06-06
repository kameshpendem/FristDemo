import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
//import NetInfo from '@react-native-community/netinfo'
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import getBaseUrl from '../../config/Config';
export default class practiceapproval extends Component {
  state = {
    url: '',
    doctorid: '',
    token: '',
    roletype: '',
    load1: false,
  };
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
      const username = await AsyncStorage.getItem('doctorname');
      if (username !== null) {
        this.setState({username: username});
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
    let url = getBaseUrl() + 'doctor_url';
    console.log(
      'url=' +
        url +
        ' hlpid=' +
        this.state.doctorid +
        ' token=' +
        this.state.token +
        ' roletype=' +
        this.state.roletype +
        ' username=' +
        this.state.username,
    );
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docid: this.state.doctorid,
        token: this.state.token,
        role_type: this.state.roletype,
        username: this.state.username,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          url: response.message[0].practice_approval,
          load1: false,
        });
        console.log('url=' + JSON.stringify(response));
        console.log(response.message[0].practice_approval);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  ActivityIndicatorLoadingView() {
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
    // if(this.state.load1){
    //     return(
    //     <View style={{
    //         flex: 1,
    //         marginTop:250,
    //         // justifyContent: 'center',
    //         // alignItems: 'center'
    //     }}>
    //     <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
    //     </View>
    //     )
    // }
    return (
      <WebView
        style={{marginTop: -60}}
        source={{uri: this.state.url}}
        renderLoading={this.ActivityIndicatorLoadingView}
        startInLoadingState={true}
      />
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
