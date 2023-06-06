import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';

//import NetInfo from '@react-native-community/netinfo'
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import getBaseUrl from '../../config/Config';

export default class forums extends Component {
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
      const doctorname = await AsyncStorage.getItem('doctorname');

      if (doctorname !== null) {
        this.setState({
          name: doctorname.split(' ')[0] + '_' + doctorname.split(' ')[1],
        });
      }
      await this.setState({roletype: 'Doctor'});
    } catch (error) {
      console.log('got error');
    }
    this.getweburl();
  };
  getweburl = () => {
    let url = getBaseUrl() + 'covid_url/';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.doctorid,
        token: this.state.token,
        role_type: this.state.roletype,
        name: this.state.name,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({url: response.message[0].covid_url, load1: false});
        console.log('url=' + JSON.stringify(response));
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
