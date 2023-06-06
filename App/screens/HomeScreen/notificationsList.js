import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Container,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  Card,
  CardItem,
} from 'native-base';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from 'i18next';
import getBaseUrl from '../../config/Config';
// const Realm = require('realm');
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
} from '../../themes/variable';
// let realm;
export default class notificationsList extends Component {
  static navigationOptions = {
    headerShown: false,
  };
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
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    const docid = await AsyncStorage.getItem('doctorid');
    if (docid !== null) {
      this.setState({docid});
      global.doctor_id = this.state.docid;
    }
    this.get_notification_list();
    // var mydata = realm
    //   .objects('Notifications')
    //   .filtered(`hlpid ==  "${global.doctor_id}"`);
    // if (mydata.length == 0) {
    //   // alert("hi")
    //   // this.setState({
    //   //   note:true
    //   // })
    // }
    // this.setState({data:mydata,isLoading:false});
  };

  get_notification_list = async () => {
    let url = getBaseUrl() + 'get_notificationlist_data/';
    let ob = JSON.stringify({
      hlp: global.doctor_id,
      device_id: global.deviceid,
    });
    console.log(ob);

    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ob,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('notificaton_list1111', JSON.stringify(response));
        if (
          response.message &&
          response.message !== '' &&
          response.message !== []
        ) {
          let pp = response.message.filter(
            (ele, ind) =>
              ind ===
              response.message.findIndex(
                (elem) =>
                  elem.body === ele.body &&
                  elem.hlp_id === ele.hlp_id &&
                  elem.date_added === ele.date_added,
              ),
          );
          console.log(pp);
          this.setState({data: pp});
          console.log('notificaton_list_data', this.state.data);
        } else {
          this.setState({data: [], note: true});
        }
      })
      .catch((error) => {
        console.error(error);
      });
    this.setState({isLoading: false});
  };
  // componentDidUpdate=()=>{
  //  var mydata = realm.objects('Notifications').filtered(`hlpid ==  "${global.doctor_id}"`);
  //   // alert(JSON.stringify(mydata))
  //   // if(mydata.length==0){
  //   //   // alert("hi")
  //   //   this.setState({
  //   //     note:true
  //   //   })
  //   // }
  //   if(this.state.data.length<mydata.length){
  //   this.setState({data:mydata});
  //   }
  // }
  clear = async () => {
    // console
    //   realm.write(() => {
    //     realm.delete(this.state.data)
    // })
    // var mydata = realm.objects('Notifications').filtered(`hlpid ==  "${global.doctor_id}"`);
    // // alert(JSON.stringify(mydata))
    // this.setState({
    //   data:mydata,
    //   note:true
    // });
    console.log(global.deviceid);
    let url = getBaseUrl() + 'update_notificationlist_status/';
    let ob = JSON.stringify({
      hlp: global.doctor_id,
      device_id: global.deviceid,
    });
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ob,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('notificaton_list_status', JSON.stringify(response));
        if (response) {
          //this.setState({data:response.message});
          this.get_notification_list();
          this.setState({
            note: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    this.setState({isLoading: false});
  };

  sure = () => {
    if (this.state.data.length !== 0) {
      Alert.alert(
        '',
        i18n.t('HELP.NOTIFICATIONS.ARE_YOU_SURE_TEXT'),
        [
          {
            text: i18n.t('HELP.NOTIFICATIONS.YES'),
            onPress: () => this.clear(),
          },
          {
            text: i18n.t('HELP.NOTIFICATIONS.NO'),
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.get_notification_list().then(() => {
      this.setState({refreshing: false});
    });
  };

  renderNotification({item}) {
    return (
      <Card style={styles.notificationCard}>
        <CardItem style={styles.notificationCardItem}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.body}</Text>
          <Text style={styles.notificationTime}>
            {moment(item.date_added).fromNow()}
          </Text>
        </CardItem>
      </Card>
    );
  }

  renderNotificationList() {
    return (
      <SafeAreaView style={styles.notificationListView}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderNotification.bind(this)}
          keyExtractor={(item) => item.notification_id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </SafeAreaView>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <Container>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="md-arrow-back" style={styles.backIcon} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={styles.headerTitle}>
              {i18n.t('COMMON.TITLE')}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => this.sure()}>
              <Text allowFontScaling={false} style={styles.clearButtonText}>
                {i18n.t('COMMON.CLEAR')}
              </Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <Container>
          {this.state.note && (
            <Text style={styles.noNotificationsText}>
              {i18n.t('HELP.NOTIFICATIONS.NO_NOTIFICATIONS')}
            </Text>
          )}
          {this.renderNotificationList()}
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: DEFAULT_WHITE_COLOR,
  },
  headerTitle: {
    color: DEFAULT_WHITE_COLOR,
    fontSize: 17,
  },
  clearButton: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginRight: 5,
  },
  clearButtonText: {
    color: APP_PRIMARY_COLOR,
    fontSize: 12,
    margin: 5,
  },
  noNotificationsText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: DEFAULT_WHITE_COLOR,
    marginTop: 50,
  },
  notificationListView: {
    padding: 10,
  },
  notificationCardItem: {
    flexDirection: 'column',
  },
  notificationTitle: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold',
    color: APP_PRIMARY_COLOR,
  },
  notificationBody: {
    justifyContent: 'flex-start',
    fontSize: 14,
    color: DEFAULT_BLACK_COLOR,
  },
  notificationTime: {
    fontSize: 14,
    color: DEFAULT_GREY_COLOR,
    alignSelf: 'flex-end',
  },
});
