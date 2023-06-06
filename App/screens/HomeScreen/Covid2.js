import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import {View, ActivityIndicator, Text} from 'react-native';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';

//import NetInfo from '@react-native-community/netinfo'

export default class Covid2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      doctorid: '',
      token: '',
      roletype: '',
      load1: false,
      // email:this.props.navigation.state.params.email,
      // uname:this.props.navigation.state.params.uname,
      // uid:this.props.navigation.state.params.uid,
      // app_type:this.props.navigation.state.params.app_type,
      hlpd: this.props.navigation.state.params.hlpd,
      enc: this.props.navigation.state.params.enc,
      // b_id:this.props.navigation.state.params.b_id,
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
      hlp_id: this.state.hlpd,
      enc_id: this.state.enc,
      doc_id: this.state.doctorid,
    });
    console.log(kb);
    // service_reg_url
    let url = getBaseUrl() + 'covid_checkup_url';
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
        console.log('urjjjjjjjjl=' + JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  onBridgeMessage = (webViewData) => {
    // let jsonData = JSON.parse(webViewData);

    // if (jsonData.success) {
    //   Alert.alert(jsonData.message);
    // }
    console.log('data received', webViewData);
    //.. do some react native stuff when data is received
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
        style={{marginTop: 0}}
        source={{uri: this.state.url}}
        startInLoadingState
      />
      // <WebViewBridge
      //     ref="webviewbridge"
      //     onBridgeMessage={this.onBridgeMessage.bind(this)}
      //     source={ {
      //       uri: this.state.url
      //     } } />
      // <View>
      //     <Text>hi</Text>
      // </View>
    );
  }
}
