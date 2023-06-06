import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  NativeModules,
  DeviceEventEmitter,
  ToastAndroid,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Input, Card, ListItem} from 'react-native-elements';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
// import parseDate from '../HomeScreen/ParseDate';
// const fireDate = parseDate(new Date(Date.now() + 20000));
// const fireDate2 = parseDate(new Date(moment("2019-07-02 15:45:00")));
var myAlarm = NativeModules.RNAlarmNotification;
import AsyncStorage from '@react-native-community/async-storage';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
import i18n from '../../../i18n';
export default class ReminderAlarms extends Component {
  constructor(props) {
    super(props);
    global.getdate = Date();
    this.state = {
      getdate: Date(),
      list: [],
      isLoading: false,
      enc_id: this.props.navigation.state.params
        ? this.props.navigation.state.params.enc
        : '',
      medlist: [],
      morninglist: [],
      afternoonlist: [],
      eveninglist: [],
      nightlist: [],
      refreshing: false,
      hlpid: this.props.navigation.state.params.hlpid,
      encounterdate: this.props.navigation.state.params.encounterdate,
      encounterdays: '',
    };
  }

  _onRefresh = () => {
    console.log('charitha1234' + new Date());
    //    this.setState({refreshing: true});
    this.getMedicineDataDetails(this.state.getdate).then(() => {
      console.log('111111111');
      // this.mymedicinedata2().then(() => {
      //     this.setState({refreshing: false});
      //   });
    });
  };
  removeDupliactes = (values) => {
    let concatArray = values.map((eachValue) => {
      return Object.values(eachValue).join('');
    });
    let filterValues = values.filter((value, index) => {
      return concatArray.indexOf(concatArray[index]) === index;
    });

    return filterValues;
  };
  mymedicinedata2 = async () => {
    let obj = await AsyncStorage.getItem('medicinedata');
    let listdata = JSON.parse(obj);
    console.log('charitha2', listdata);
    let data = [];
    let datearray = [];
    let datearray2 = [];
    let timearray = [];
    listdata.map((itemvalue) => {
      itemvalue.drug &&
        itemvalue.drug.map((item) => {
          // datearray.push(item.drug_intake_date);
          timearray.push(item.drug_timing);
          data.push(item.drug_name);
          let timedata = moment(item.drug_timing, ['h:mm A']).format('HH:mm');
          datearray2.push(item.drug_intake_date + ' ' + timedata + ':00');
        });
    });

    let timedataarray = [];
    let mymeddataarray = [...new Set(data)];
    timedataarray = [...new Set(timearray)];
    let datedata = [];
    meddata = [];
    medicalarray = [];
    console.log(JSON.stringify(timedataarray));
    //datedata.map((itemdate)=>{
    mydata = [];

    mytimedata = [];
    myarray = [];
    let myarray1 = [];

    timedataarray.map((itemtime) => {
      mytimearray = [];
      //mymeddataarray.map(itemdrug=>{
      listdata.map((itemvalue) => {
        itemvalue.drug &&
          itemvalue.drug.map((item) => {
            // console.log(itemdate+" "+item.drug_intake_date+" "+itemtime+" "+item.drug_timing)
            // console.log(itemdate==item.drug_intake_date&&itemtime==item.drug_timing)
            if (
              moment(this.state.getdate).format('YYYY-MM-DD') ==
                item.drug_intake_date &&
              itemtime == item.drug_timing
            ) {
              console.log(
                itemtime +
                  ' ' +
                  item.drug_intake_date +
                  ' ' +
                  item.drug_timing +
                  ' ' +
                  item.drug_name,
              );
              mydata = {
                id: item.push_notification_id,
                name: item.drug_name,
                // time:item.drug_timing
              };
              mytimearray.push(mydata);
              console.log(JSON.stringify(mytimearray));
              mytimedata = {
                time: itemtime,
                namedetails: mytimearray,
              };
              myarray.push(mytimedata);
            }
          });
      });
      //  })
    });

    meddata = {
      date: moment(this.state.getdate).format('YYYY-MM-DD'),
      timedetails: this.removeDupliactes(myarray),
    };
    medicalarray.push(meddata);

    // })
    //  alert(JSON.stringify(medicalarray))

    let myarraydata = [];
    let i = 1;

    let medname = '';
    medicalarray.map((item) => {
      let timedata = [];

      item.timedetails.map((i1) => {
        let namedata = [];
        let timedata2 = moment(i1.time, ['h:mm A']).format('HH:mm');
        timedata.push(timedata2);
        i1.namedetails.map((i2) => {
          namedata.push(i2.name + '#' + i2.id);
        });
        // })
        // console.log(medname+" "+JSON.stringify(namedata))
        namedata.map((it, index) => {
          if (index == 0) {
            medname = namedata[index].trim();
          } else {
            medname += '@' + it.trim();
          }
        });

        let dat = '' + item.date + ' ' + timedata2 + ':00';

        if (moment(dat).toDate() >= moment().toDate()) {
          let datedata = parseDate(moment(dat).toDate());

          let alarmNotifData = {
            id: i.toString(), // Required
            title: this.state.hlpid + '@' + getBaseUrl(), // Required
            message: medname, // Required
            channel: 'my_channel_id', // Required. Same id as specified in MainApplication's onCreate method
            ticker: 'My Notification Ticker',
            auto_cancel: true, // default: true
            vibrate: true,
            vibration: 100, // default: 100, no vibration if vibrate: false
            small_icon: 'ic_launcher', // Required
            large_icon: 'ic_launcher',
            play_sound: true,
            sound_name: null, // Plays custom notification ringtone if sound_name: null
            color: 'red',
            schedule_once: true, // Works with ReactNativeAN.scheduleAlarm so alarm fires once
            tag: datedata,
            fire_date: datedata, // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
            // You can add any additional data that is important for the notification
            // It will be added to the PendingIntent along with the rest of the bundle.
            // e.g.
            data: {foo: 'bar'},
          };
          myarraydata.push(alarmNotifData);
          i++;
        }
      });
    });

    console.log('re=' + JSON.stringify(myarraydata));

    myarraydata.map((item) => {
      myAlarm.scheduleAlarm(item);
    });
    let result = myAlarm.getScheduledAlarms();
  };
  // alert(JSON.stringify(result))

  componentDidMount = async () => {
    var encounterdate1 = this.state.encounterdate.split('-');
    var date1 = new Date().getDate();
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear();
    var encountercurrentdate = month + '/' + date1 + '/' + year;
    var encounterselecteddate =
      encounterdate1[1] + '/' + encounterdate1[2] + '/' + encounterdate1[0];
    var date1 = new Date(encounterselecteddate);
    var date2 = new Date(encountercurrentdate);
    var diffInMs = Math.abs(date2 - date1);
    var range1 = diffInMs / (1000 * 60 * 60 * 24);
    this.setState({encounterdays: range1});
    // this.getMedicineDataDetails(new Date());
    // this.mymedicinedata2();
    this.setState({isLoading: true});
    this._onRefresh();
    this.setState({isLoading: false});
  };

  dateSelected = (date) => {
    console.log('2345' + date.toString());
    this.setState({getdate: date.toString()});
    // global.getdate = date;
    this.state.morninglist = [];
    this.state.afternoonlist = [];
    this.state.eveninglist = [];
    this.setState({nightlist: []});
    this.getMedicineDataDetails(date);
    // console.log(global.getdate);
  };

  getMedicineData = async () => {
    this.state.morninglist = [];
    this.state.afternoonlist = [];
    this.state.eveninglist = [];
    this.state.nightlist = [];
    let obj = await AsyncStorage.getItem('medicinedata');

    let listdata = JSON.parse(obj);

    let meddata = [];
    let medicalarray = [];

    let mydata = [];
    let myarray = [];
    listdata.map((itemvalue) => {
      console.log(JSON.stringify(itemvalue));
      itemvalue.drug &&
        itemvalue.drug.map((item) => {
          console.log(
            moment(this.state.getdate).format('YYYY-MM-DD') +
              ' ' +
              item.drug_intake_date,
          );
          if (
            moment(this.state.getdate).format('YYYY-MM-DD') ==
            item.drug_intake_date
          ) {
            mydata = {
              notification_id: item.push_notification_id,
              name: item.drug_name,
              time: item.drug_timing,
              status: item.drug_intake_status,
            };
            myarray.push(mydata);
          }
        });
    });
    myarray.sort(function (a, b) {
      return (
        new Date('1900/01/01 ' + a.time) - new Date('1900/01/01 ' + b.time)
      );
    });
    meddata = {
      date: moment(this.state.getdate).format('YYYY-MM-DD'),
      timedetails: myarray,
    };
    medicalarray.push(meddata);
    // alert(JSON.stringify(medicalarray))
    medicalarray.map((item) => {
      if (item.date == moment(this.state.getdate).format('YYYY-MM-DD')) {
        item.timedetails.map((i) => {
          console.log(
            item.date +
              ' ' +
              this.state.getdate +
              ' ' +
              i.time +
              ' ' +
              (moment(this.state.getdate).format('YYYY-MM-DD') + ' ' + i.time) +
              ' ' +
              new Date(
                moment(this.state.getdate).format('YYYY-MM-DD') + ' ' + i.time,
              ),
          );
          let dtime = moment(i.time, ['h:mm A']).format('HH:mm');
          console.log(dtime);
          let mtime = dtime.split(':');
          let mydata = {
            name: i.name,
            time: i.time,
          };
          // mydata.sort(function(a, b){
          //     return a.time - b.time;
          // });
          this.state.list.push(mydata);

          if (mtime[0] >= 0 && mtime[0] < 12) {
            let mydata = {
              notification_id: i.notification_id,
              name: i.name,
              icon: 'local-pharmacy',
              time: i.time,
              ...(i.status == '1'
                ? {rightIcon: 'check-circle', color: 'green'}
                : i.status == '0'
                ? {rightIcon: 'close', color: 'red'}
                : i.status == '0.5'
                ? {rightIcon: 'warning', color: 'orange'}
                : {rightIcon: 'checkclose', color: '#808080'}),
              status: i.status,
            };

            this.state.morninglist.push(mydata);
          } else if (mtime[0] >= 12 && mtime[0] < 16) {
            let mydata = {
              notification_id: i.notification_id,
              name: i.name,
              icon: 'local-pharmacy',
              time: i.time,
              ...(i.status == '1'
                ? {rightIcon: 'check-circle', color: 'green'}
                : i.status == '0'
                ? {rightIcon: 'close', color: 'red'}
                : i.status == '0.5'
                ? {rightIcon: 'warning', color: 'orange'}
                : {rightIcon: 'checkclose', color: '#808080'}),
              status: i.status,
            };
            this.state.afternoonlist.push(mydata);
          } else if (mtime[0] >= 16 && mtime[0] < 19) {
            let mydata = {
              notification_id: i.notification_id,
              name: i.name,
              icon: 'local-pharmacy',
              time: i.time,
              ...(i.status == '1'
                ? {rightIcon: 'check-circle', color: 'green'}
                : i.status == '0'
                ? {rightIcon: 'close', color: 'red'}
                : i.status == '0.5'
                ? {rightIcon: 'warning', color: 'orange'}
                : {rightIcon: 'checkclose', color: '#808080'}),
              status: i.status,
            };
            this.state.eveninglist.push(mydata);
          } else {
            let mydata = {
              notification_id: i.notification_id,
              name: i.name,
              icon: 'local-pharmacy',
              time: i.time,
              ...(i.status == '1'
                ? {rightIcon: 'check-circle', color: 'green'}
                : i.status == '0'
                ? {rightIcon: 'close', color: 'red'}
                : i.status == '0.5'
                ? {rightIcon: 'warning', color: 'orange'}
                : {rightIcon: 'checkclose', color: '#808080'}),
              status: i.status,
            };
            this.state.nightlist.push(mydata);
          }
        });
      }
    });
    this.setState({morninglist: [...this.state.morninglist]});
    console.log(this.state.morninglist.length);
    console.log(this.state.eveninglist.length);
    console.log(this.state.nightlist.length);
  };
  getMedicineDataDetails = async (date) => {
    // alert("charitha"+new Date()+moment(date).format('YYYY-MM-DD'))
    let url = getBaseUrl() + 'notification_list/';
    let ob = JSON.stringify({
      hlp: this.state.hlpid,
      device_id: '',
      date: moment(date).format('YYYY-MM-DD'),
      ...(this.state.enc_id != '' && {
        enc_id: this.state.enc_id,
      }),
    });
    // alert(url+" "+ob);
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ob,
    })
      .then((response) => response.json())
      .then(async (response) => {
        medicineObj = response;
        // medicineObj = JSON.parse(res._bodyText);
        //  this.state.medlist=response;
        this.setState({refresh: true});
        console.log('medlist0', JSON.stringify(medicineObj));
        await AsyncStorage.setItem('medicinedata', JSON.stringify(medicineObj));
        // alert(JSON.stringify(response))
        this.getMedicineData();
        return medicineObj;
      })
      .catch((error) => {
        // console.error(error);console.log("writing response")
        // this
        //     .loginAlert
        //     .showMessage({message: "Something Went Wrong", description: "Please Contact Healpha Helpdesk", type: "danger", icon: "auto", autoHide: false});
      });
  };

  changeMedicineTakenStatus = (
    notification_id,
    availabletime,
    currenttime,
    status,
  ) => {
    console.log('writing responses');
    if (status == 1) {
      let beforetime = new Date(currenttime);
      beforetime.setMinutes(beforetime.getMinutes() - 30);
      let aftertime = new Date(currenttime);
      aftertime.setMinutes(aftertime.getMinutes() + 30);
      //  alert("writing response"+beforetime+" "+aftertime)
      if (availabletime >= beforetime && availabletime <= aftertime) {
        this.executeMedicineStatusUpdate(notification_id, status);
      } else {
        this.executeMedicineStatusUpdate(notification_id, '0.5');
      }
    } else if (status == 0) {
      console.log('writing response');
      this.executeMedicineStatusUpdate(notification_id, status);
    }
  };
  executeMedicineStatusUpdate = async (notification_id, status) => {
    let getdataurl = getBaseUrl() + 'medicine_update/';
    let on = JSON.stringify({
      hlp: this.state.hlpid,
      drug_intake_status: status,
      push_notification_id: notification_id,
    });
    let response = await fetch(getdataurl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: on,
    })
      .then((response) => response.json())
      .then((res) => {
        this.getMedicineDataDetails(this.state.getdate);
      })

      .catch((error) => {
        console.error(error);
      });
  };
  callMedicineUpdate = (notification_id, mytime, status) => {
    var nowDate = new Date();
    let mytime2 = moment(mytime, ['h:mm A']).format('HH:mm:ss');
    var Time1 = new Date(moment(this.state.getdate).format('YYYY-MM-DD'));
    let mytim2 = mytime2.split(':');
    Time1.setHours(mytim2[0]);
    Time1.setMinutes(mytim2[1]);

    var LastTenMin = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate(),
      nowDate.getHours(),
      nowDate.getMinutes(),
    );
    //alert(Time1+" "+LastTenMin)

    var Time2 = moment(this.state.getdate).format('YYYY-MM-DD');
    if (Time2 <= moment(new Date()).format('YYYY-MM-DD')) {
      if (Time1 <= LastTenMin) {
        if (status != '') {
          Alert.alert(
            i18n.t('PATIENTS.MEDICINE_ALERT'),
            null,
            [
              {
                text: i18n.t('CONFIRMATION.CONFIRM'),
                onPress: () =>
                  this.getAlert(notification_id, Time1, LastTenMin),
              },
              {
                text: i18n.t('PATIENTS.CANCEL'),
              },
              {
                cancelable: false,
              },
            ],
          );
        } else {
          this.getAlert(notification_id, Time1, LastTenMin);
        }
      }
    }
    //alert(notification_id)
  };
  getAlert = (notification_id, Time1, LastTenMin) => {
    Alert.alert(i18n.t('PATIENTS.OBJECTIVE_ALERT'), null, [
      {
        text: i18n.t('PATIENTS.TAKEN'),
        onPress: () =>
          this.changeMedicineTakenStatus(notification_id, Time1, LastTenMin, 1),
      },
      {
        text: i18n.t('PATIENTS.NOT_TAKEN'),
        onPress: () =>
          this.changeMedicineTakenStatus(notification_id, Time1, LastTenMin, 0),
      },
      {
        text: i18n.t('PATIENTS.CANCEL'),
      },
      {
        cancelable: false,
      },
    ]);
  };
  render() {
    if (this.state.isLoading) {
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
    let datesWhitelist = [
      {
        start: moment().subtract(this.state.encounterdays, 'days'),
        end: moment().add(0, 'days'), // total 4 days enabled
      },
    ];
    let datesBlacklist = [moment().add(0, 'days')];
    const list = [
      {
        title: 'Glipizide',
        icon: 'local-pharmacy',
        value: '03:00 PM',
        righticon: 'access-alarms',
      },
      {
        title: 'Glucophage',
        icon: 'local-pharmacy',
        value: '06:00 PM',
        righticon: 'access-alarms',
      },
    ];
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <CalendarStrip
        testID="calenderStrip"
        accessibilityLabel="calenderStrip"
          calendarAnimation={{type: 'sequence', duration: 30}}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: '#EEEEEE',
          }}
          style={{height: 100, paddingTop: 20, paddingBottom: 10}}
          calendarHeaderStyle={{color: 'white'}}
          calendarColor={'#345D7E'}
          dateNumberStyle={{Calencolor: 'white'}}
          dateNameStyle={{color: 'white'}}
          highlightDateNumberStyle={{color: APP_PRIMARY_COLOR}}
          highlightDateNameStyle={{color: APP_PRIMARY_COLOR}}
          disabledDateNameStyle={{color: 'grey'}}
          disabledDateNumberStyle={{color: 'grey'}}
          // datesWhitelist={datesWhitelist}
          minDate={moment().subtract(this.state.encounterdays, 'days')}
          maxDate={moment().add(0, 'days')}
          // datesBlacklist={datesBlacklist}
          onDateSelected={(date) => this.dateSelected(date)}
          selectedDate={this.state.getdate}
          // leftSelector={[]}

          //rightSelector={[]}
          // startDate={moment().subtract(6,"days")}
          //  endDate={ moment()}
          // startingDate={ moment().subtract(1,"days")}
          // iconContainer={{flex: 0.1}}
        />
        {this.state.morninglist.length == 0 &&
          this.state.afternoonlist.length == 0 &&
          this.state.eveninglist.length == 0 &&
          this.state.nightlist.length == 0 && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
              testID="noMedicinesAvailablkeText"
              accessibilityLabel="noMedicinesAvailablkeText"
                allowFontScaling={false}
                style={{fontSize: 30, fontWeight: 'bold', marginTop: 250}}>
                No Medicines Available!
              </Text>
            </View>
          )}
        {this.state.morninglist.length > 0 && (
          <Card title="Morning"
          testID="morningTitle"
          accessibilityLabel="morningTitle">
            {this.state.morninglist.map((item, i) => (
              <ListItem
                key={i}
                title={item.name}
                leftIcon={{name: item.icon}}
                badge={{
                  value: item.time,
                  textStyle: {color: '#FFFFFF', paddingHorizontal: 10},
                }}
                // rightIcon={{name: item.righticon}}
                rightIcon={{name: item.rightIcon, color: item.color}}
                // onPress={()=>this.callMedicineUpdate(item.notification_id,item.time,item.status)}
              />
            ))}
          </Card>
        )}
        {this.state.afternoonlist.length > 0 && (
          <Card title="Afternoon"
          testID="afternoonTitle"
          accessibilityLabel="afternoonTitle">
            {this.state.afternoonlist.map((item, i) => (
              <ListItem
                key={i}
                title={item.name}
                leftIcon={{name: item.icon}}
                badge={{
                  value: item.time,
                  textStyle: {color: '#FFFFFF', paddingHorizontal: 10},
                }}
                rightIcon={{name: item.rightIcon, color: item.color}}
                // onPress={()=>this.callMedicineUpdate(item.notification_id,item.time,item.status)}
              />
            ))}
          </Card>
        )}
        {this.state.eveninglist.length > 0 && (
          <Card title="Evening"
          testID="eveningTitle"
          accessibilityLabel="eveningTitle">
            {this.state.eveninglist.map((item, i) => (
              <ListItem
                key={i}
                title={item.name}
                leftIcon={{name: item.icon}}
                badge={{
                  value: item.time,
                  textStyle: {color: '#FFFFFF', paddingHorizontal: 10},
                }}
                rightIcon={{name: item.rightIcon, color: item.color}}
                // onPress={()=>this.callMedicineUpdate(item.notification_id,item.time,item.status)}
              />
            ))}
          </Card>
        )}
        {this.state.nightlist.length > 0 && (
          <Card title="Night"
          testID="nightTitle"
          accessibilityLabel="nightTitle">
            {this.state.nightlist.map((item, i) => (
              <ListItem
                key={i}
                title={item.name}
                leftIcon={{name: item.icon}}
                badge={{
                  value: item.time,
                  textStyle: {color: '#FFFFFF', paddingHorizontal: 10},
                }}
                rightIcon={{name: item.rightIcon, color: item.color}}
                // onPress={()=>this.callMedicineUpdate(item.notification_id,item.time,item.status)}
              />
            ))}
          </Card>
        )}
      </ScrollView>
    );
  }
}

// export {ReminderAlarms};
