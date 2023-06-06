import React, {Component} from 'react';
import moment from 'moment';
import {
  Alert,
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import * as firebase from 'react-native-firebase';
import Autocomplete from 'react-native-autocomplete-input';
import {connect} from 'react-redux';
import {getOldList} from '../../redux/actions/oldpatient_action';
import {NavigationEvents} from 'react-navigation';
import {getPostList} from '../../redux/actions/post_action';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Thumbnail,
  Row,
  Col,
  Item,
  Icon,
  Input,
  Footer,
  FooterTab,
  Button,
} from 'native-base';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl, {getApiUrl} from '../../config/Config';
import i18n from '../../../i18n';
class Confirmation extends Component {
  constructor(props) {
    super(props);
    global.getdate = Date();
    this.state = {
      mdata: this.props.navigation.state.params.data,
      freebusydata: this.props.navigation.state.params.freebusydata,

      mail: this.props.navigation.state.params.mail,
      price: this.props.navigation.state.params.price,
      selectedIdtype: 'general',
      isLoading: false,
      dtime: this.props.navigation.state.params.dtime,
      endtime: this.props.navigation.state.params.endtime,
      doctorid: this.props.navigation.state.params.doctorid,
      doctorname: this.props.navigation.state.params.doctorname,
      specialization: this.props.navigation.state.params.specialization,
      branchid: this.props.navigation.state.params.branchid,
      slottime: this.props.navigation.state.params.slottime,
      imagepath: this.props.navigation.state.params.imagepath,
      branchname: this.props.navigation.state.params.branchname,
      apptype: this.props.navigation.state.params.apptype,
      city: this.props.navigation.state.params.city,
      rescheduledata: this.props.navigation.state.params.rescheduledata,
      getEncounter: this.props.navigation.state.params.getEncounter,
      hlpid: global.hlpid,
      healphauser: this.props.navigation.state.params.healphauser,
      description: '',
      modal: false,
      show: false,
      first_name: '',
      last_name: '',
      emaildata: '',
      phno: '+91',
      otpsent: false,
      otpvalue: 0,
      error1: '',
      error2: '',
      error3: '',
      error4: '',
      checking12: false,
      checking11: false,
      Bookenabled: false,
      query2: '',
      timeline: [],
      timelenedata: [],
      // name:,
      // email:,
      // phno:
    };
    console.log('slottime', this.state.slottime);
  }

  updateUser = (user) => {
    console.log(user);
    this.setState({selectedIdtype: user});
  };

  componentDidMount = async () => {
    console.log('dtime1st', this.state.dtime);
    if (!this.state.dtime) {
      await this.getDoctorData();
      await this.getCalendarData();
    }
    //this.getPersondata();
  };

  getPersondata = async () => {
    let url = getBaseUrl() + 'searchperson/';
    let ob = JSON.stringify({
      practice_id: this.state.branchid.split('-')[0],
      branch_id: this.state.branchid,
    });
    console.log(url + ' ' + ob);
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
        //     if(response.message!=0&&response.message!=null&&response.message!=[]){
        //    return response.message
        //     }
        //     else{
        //         return [];
        //     }
        //console.log("persondata",response);
        this.setState({timeline: response});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getDoctorData = async () => {
    let doctorid = this.state.mdata.split(' ');
    let url = getBaseUrl() + 'doctor_details_by_id';

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doctor_id: doctorid[0],
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log("my="+o1['doc_details'][0]['first_name']);
        // console.log("doctordata ="+JSON.stringify(response)+"tel"+JSON.stringify(response.doc_details[0].non_healpha_user_id))
        if (
          this.state.selectedIdtype == 'telemedicine' ||
          this.state.selectedIdtype == 'homecare'
        ) {
          this.setState({doctors: response});
          for (let i = 0; i < response.doc_price_list.length; i++) {
            if (
              response.doc_price_list[i].branch_id ==
              this.state.freebusydata.split(',')[0]
            ) {
              this.setState({doc_price: response.doc_price_list[i]});
            }
          }
          console.log('12345' + this.state.doc_price.telemedicine);
        } else {
          this.setState({doctors: response});
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };

  getCalendarData = async () => {
    let doctorid = this.state.mdata.split(' ');
    let freetime = this.state.freebusydata.split(',');
    let duration;
    let dayvalue;
    console.log(
      'branchid=' +
        this.state.branchid +
        ' ' +
        this.state.freebusydata.split(',')[0],
    );
    console.log('branchid=' + this.props.postList.pract_details[0].branch_id);
    let practice =
      this.state.branchid != undefined
        ? this.props.postList.pract_details.filter(
            (item) => item.branch_id === this.state.branchid,
          )
        : this.props.postList.pract_details.filter(
            (item) => item.branch_id === this.state.freebusydata.split(',')[0],
          );
    console.log('practice', practice);
    if (
      practice[0].visit_hours_time.trim() == 'to' ||
      practice[0].visit_hours_time == '00:00 to 00:00'
    ) {
      console.log('weekday hours');
      let mydate = new Date();
      let selecteddate1 = moment(global.getdate).format('YYYY-MM-DD');
      console.log('date' + mydate);
      let selecteddate2 = new Date(selecteddate1).getDay();
      console.log(new Date(selecteddate1).getDay());
      if (selecteddate2 == 0) {
        duration = practice[0].doc_weekly_timings[0].sunday_working_time;
        dayvalue = 'sunday';
      } else if (selecteddate2 == 1) {
        duration = practice[0].doc_weekly_timings[0].monday_working_time;
        dayvalue = 'monday';
      } else if (selecteddate2 == 2) {
        duration = practice[0].doc_weekly_timings[0].tuesday_working_time;
        dayvalue = 'tuesday';
      } else if (selecteddate2 == 3) {
        duration = practice[0].doc_weekly_timings[0].wednesday_working_time;
        dayvalue = 'wednesday';
      } else if (selecteddate2 == 4) {
        duration = practice[0].doc_weekly_timings[0].thursday_working_time;
        dayvalue = 'thursday';
      } else if (selecteddate2 == 5) {
        duration = practice[0].doc_weekly_timings[0].friday_working_time;
        dayvalue = 'friday';
      } else if (selecteddate2 == 6) {
        duration = practice[0].doc_weekly_timings[0].saturday_working_time;
        dayvalue = 'saturday';
      }
    } else {
      console.log('visit hours');
      let mydate = new Date();
      let selecteddate1 = moment(global.getdate).format('YYYY-MM-DD');
      console.log('date' + mydate);
      let selecteddate2 = new Date(selecteddate1).getDay();
      console.log(new Date(selecteddate1).getDay());
      if (selecteddate2 == 0) {
        dayvalue = 'sunday';
      } else if (selecteddate2 == 1) {
        dayvalue = 'monday';
      } else if (selecteddate2 == 2) {
        dayvalue = 'tuesday';
      } else if (selecteddate2 == 3) {
        dayvalue = 'wednesday';
      } else if (selecteddate2 == 4) {
        dayvalue = 'thursday';
      } else if (selecteddate2 == 5) {
        dayvalue = 'friday';
      } else if (selecteddate2 == 6) {
        dayvalue = 'saturday';
      }
      duration = practice[0].visit_hours_time;
    }
    let response = await this.getFreeBusy(
      duration,
      dayvalue,
      this.state.freebusydata.split(',')[0],
    );
    let dt = [];
    let dt2 = [];
    let dt3 = [];
    if (response != 0) {
      response['free'].map((item) => {
        let start = new Date();
        let my = item.split(':');
        let end = new Date(global.getdate);
        end.setHours(my[0]);
        end.setMinutes(my[1]);
        if (start < end) {
          if (my[1] === '0' && my[1] !== '00') {
            my[1] += '0';
          }
          if (my[0] < 12) {
            if (my[0] < 10) {
              my[0] = '0' + my[0];
            }
            if (my[1] < 10 && my[1] !== '00' && my[1].indexOf('0') <= -1) {
              my[1] = '0' + my[1];
            }
            dt.push(my[0] + ':' + my[1] + ' AM');
          } else if (my[0] >= 12 && my[0] < 16) {
            if (my[0] == 12) {
              if (my[0] < 10) {
                my[0] = '0' + my[0];
              }
              if (my[1] < 10 && my[1] !== '00' && my[1].indexOf('0') <= -1) {
                my[1] = '0' + my[1];
              }
              dt2.push(my[0] + ':' + my[1] + ' PM');
            } else if (my[0] > 12) {
              my[0] -= 12;
              if (my[0] < 10) {
                my[0] = '0' + my[0];
              }
              if (my[1] < 10 && my[1] !== '00' && my[1].indexOf('0') <= -1) {
                my[1] = '0' + my[1];
              }
              dt2.push(my[0] + ':' + my[1] + ' PM');
            }
          } else if (my[0] >= 16 && my[0] <= 24) {
            if (my[0] > 12) {
              my[0] -= 12;
              if (my[0] < 10) {
                my[0] = '0' + my[0];
              }
              if (my[1] < 10 && my[1] !== '00' && my[1].indexOf('0') <= -1) {
                my[1] = '0' + my[1];
              }
              dt3.push(my[0] + ':' + my[1] + ' PM');
            }
          }
        }
      });
      console.log('dt', dt);
      console.log('dt2', dt2);
      console.log('dt3', dt3);
      this.state.data = dt;
      this.state.data2 = dt2;
      this.state.data3 = dt3;
      if (this.state.data != '') {
        console.log('data', this.state.data[0]);
        this.setState({
          dtime:
            moment(global.getdate).format('YYYY-MM-DD') +
            ' ' +
            this.state.data[0],
        });
      } else if (this.state.data2 != '') {
        console.log('data2', this.state.data2[0]);
        this.setState({
          dtime:
            moment(global.getdate).format('YYYY-MM-DD') +
            ' ' +
            this.state.data2[0],
        });
      } else if (this.state.data3 != '') {
        console.log('data3', this.state.data3[0]);
        this.setState({
          dtime:
            moment(global.getdate).format('YYYY-MM-DD') +
            ' ' +
            this.state.data3[0],
        });
      } else {
        this.setState({dtime: ''});
      }
    } else {
      this.state.data = [];
      this.state.data2 = [];
      this.state.data3 = [];
    }
    this.setState({disabled: true});
  };

  getFreeBusy = async (duration, dayvalue, branchid) => {
    let doctorid = this.state.mdata.split(' ');
    let freetime = this.state.freebusydata.split(',');
    // alert(freetime[0]+" "+freetime[1]+" "+freetime[2]);
    var spli = duration.split(' to ');

    var spli1 = spli[0].split(':');
    var spli2 = spli[1].split(':');
    var start_time = spli[0];
    var end_time = spli[1];
    var st_time = start_time.substring(0, 2);

    var en_time = end_time.substring(0, 2);

    let url = getBaseUrl() + 'free_busy/';
    console.log('date=' + moment(global.getdate).format('YYYY-MM-DD'));
    console.log(
      'id=' + doctorid[0] + ' st_time' + start_time + ' en_time' + end_time,
    );
    let onj = JSON.stringify({
      doctor_id: doctorid[0],
      date: moment(global.getdate).format('YYYY-MM-DD'),
      day: dayvalue,
      branch_id: branchid,
      st_time: start_time,
      en_time: end_time,
      slot_timing: freetime[2],
    });
    console.log('res=' + onj);
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: onj,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response567=' + JSON.stringify(response));
        if (
          response.message != i18n.t('BOOKING.ICS_FILE_MISSING') &&
          response.message != i18n.t('BOOKING.GIVE_CORRECT_DATA')  &&
          response.message != i18n.t('BOOKING.PLEASE_ENTER_ALL_DATA') &&
          response.message != i18n.t('BOOKING.GIVE_CORRECT_DATA')
        ) {
          console.log('res2=' + response.message);
          return response.message;
        } else {
          alert(i18n.t('BOOKING.NO_AVAILABLE_TIMINGS'));
          return 0;
        }
      })
      .catch((error) => {
        console.log('response568=' + JSON.stringify(response));
        console.error(error);
      });

    return response;
  };

  getData2 = async (hlpid) => {
    console.log('hlpiddd', hlpid);
    this.setState({hlp_id: hlpid});
    this.setState({timelenedata: []});
    this.setState({loading: false});
  };

  askConfirmation = () => {
    //  alert(this.state.disc)
    if (!this.state.hlp_id) {
      alert(i18n.t('CONFIRMATION.SELECT_PERSON'));
    } else if (this.state.disc == undefined) {
      this.setState({
        show: true,
      });
    } else {
      this.setState({
        show: false,
      });
      Alert.alert(
        i18n.t('CONFIRMATION.CONFIRMATION'),
        i18n.t('CONFIRMATION.CONFIRM_APPOINTMENT'),
        [
          {
            text: i18n.t('CONFIRMATION.YES'),
            onPress: () => this.book(),
          },
          {
            text: i18n.t('CONFIRMATION.NO'),
            onPress: () => this.setState({modal: true}),
          },
        ],
        {cancelable: this.state.modal},
      );
    }
  };

  book = async () => {
    this.setState({isLoading: true});
    let url = getBaseUrl() + 'ical/';
    let checkurl = getBaseUrl() + 'check_duplicte_app_fromdoc/';

    console.log('dtime', this.state.dtime);
    let get = moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
      .format('YYYY-MM-DD HH:mm')
      .split(' ');
    // alert("time="+get[0]+" "+get[1]);
    let start = new Date(get[0]);
    // alert("start="+get[0]);
    let gettime = get[1].split(':');

    start.setHours(gettime[0]);
    start.setMinutes(gettime[1]);
    let end;
    if (
      this.state.endtime != undefined &&
      this.state.endtime != null &&
      this.state.endtime != ''
    ) {
      let get = moment(this.state.endtime, ['YYYY-MM-DD h:mm'])
        .format('YYYY-MM-DD HH:mm')
        .split(' ');
      //alert("time="+get[0]+" "+get[1]);
      end = new Date(get[0]);
      // alert("start="+end);
      let gettime = get[1].split(':');

      end.setHours(gettime[0]);
      end.setMinutes(gettime[1]);
      console.log('endvalue=' + end + ' ' + start);
    } else {
      end = new Date(start);
      end.setMinutes(start.getMinutes() + Number(this.state.slottime));
      console.log(
        'hi' +
          end +
          end.setTime(
            start.getTime() + Number(this.state.slottime) * 60 * 1000,
          ),
      );
    }

    let newStart;
    console.log('input=' + start + ' ' + end);
    if (start.getHours() < 10 && start.getMinutes() < 10) {
      newStart = '0' + start.getHours() + ':0' + start.getMinutes();
    } else if (start.getHours() < 10 && start.getMinutes() > 10) {
      newStart = '0' + start.getHours() + ':' + start.getMinutes();
    } else if (start.getHours() > 10 && start.getMinutes() < 10) {
      newStart = start.getHours() + ':0' + start.getMinutes();
    } else {
      newStart = start.getHours() + ':' + start.getMinutes();
    }
    let newEnd;
    if (end.getHours() < 10 && end.getMinutes() < 10) {
      newEnd = '0' + end.getHours() + ':0' + end.getMinutes();
    } else if (end.getHours() < 10 && end.getMinutes() > 10) {
      newEnd = '0' + end.getHours() + ':' + end.getMinutes();
    } else if (end.getHours() > 10 && end.getMinutes() < 10) {
      newEnd = end.getHours() + ':0' + end.getMinutes();
    } else {
      newEnd = end.getHours() + ':' + end.getMinutes();
    }

    console.log('hlp', this.state.hlp_id);
    console.log(await AsyncStorage.getItem('userToken'));
    console.log(this.state.selectedIdtype);
    console.log(await AsyncStorage.getItem('doctorid'));
    console.log(await AsyncStorage.getItem('doctorname'));
    console.log(this.state.branchid);
    console.log(this.state.disc);
    console.log(newStart);
    console.log(newEnd);
    console.log(moment(get[0]).format('YYYY-MM-DD'));
    let appointmentdata = JSON.stringify({
      name: await AsyncStorage.getItem('doctorname'),
      date: this.state.dtime,
      branchid: this.state.branchid,
      branchname: this.state.branchname,
      city: this.state.city,
      specialization: this.state.specialization,
      salutation: this.state.salutation,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
    });

    let checking1 = JSON.stringify({
      hlpid: this.state.hlp_id,
      token: await AsyncStorage.getItem('userToken'),
      app_type:
        this.state.selectedIdtype == 'review appointment'
          ? 'review'
          : this.state.selectedIdtype,
      doc_name: await AsyncStorage.getItem('doctorname'),
      doc_id: await AsyncStorage.getItem('doctorid'),
      brn_id: this.state.branchid,
      start_time: newStart + ':00',
      end_time: newEnd + ':00',
      app_date: moment(get[0]).format('YYYY-MM-DD'),
    });
    console.log('checking1' + checking1);
    let ob = JSON.stringify({
      healphaId: this.state.hlp_id,
      date: moment(get[0]).format('YYYY-MM-DD'),
      sTime: newStart,
      eTime: newEnd,
      doctor: await AsyncStorage.getItem('doctorid'),
      doc_name: await AsyncStorage.getItem('doctorname'),
      description: this.state.disc,
      branch_id: this.state.branchid,
      app_type:
        this.state.selectedIdtype == 'review appointment'
          ? 'review'
          : this.state.selectedIdtype,
      rev_enc: '',
    });

    console.log('input_ob=' + ob);

    let response1 = await fetch(checkurl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: checking1,
    })
      .then((response1) => response1.json())
      .then((response1) => {
        console.log('response1.me' + response1.message);
        if (response1.message == i18n.t('BOOKING.APPOINTMENT_BOOKED')) {
          this.setState({isLoading: false, checking11: false});
          Alert.alert(
            i18n.t('BOOKING.APPOINTMENT_BOOKED'),
            i18n.t('BOOKING.SELECT_DIFFERENT_DATE'),
            [
              {
                text: i18n.t('BOOKING.OK'),
              },
            ],
          );
        } else if (
          response1.message == i18n.t('BOOKING.DOCTOR_NOT_AVAILABLE')
        ) {
          this.setState({isLoading: false, checking11: false});
          Alert.alert(
            i18n.t('BOOKING.DOCTOR_NOT_AVAILABLE'),
            i18n.t('BOOKING.SELECT_DIFFERENT_SLOT'),
            [
              {
                text: i18n.t('BOOKING.OK'),
              },
            ],
          );
        } else if (response1.message == '') {
          this.setState({isLoading: false, checking11: false});
          Alert.alert(i18n.t('BOOKING.INVALID_TOKEN'), i18n.t('BOOKING.RELOGIN_AGAIN'), [
            {
              text: i18n.t('BOOKING.OK'),
              onPress: () =>
                this.props.navigation.navigate('LandingPage', {
                  branch_id: this.state.branchid,
                  branch_name: this.state.branchname,
                }),
            },
          ]);
        } else {
          console.log('okkkkkkkkkkkk');
          if (this.state.selectedIdtype.toLowerCase() == 'emergency') {
            this.setState({checking12: true});
          } else {
            this.setState({checking11: true});
          }
        }
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.error(error);
      });

    if (this.state.checking12) {
      let url = getBaseUrl() + 'ical/';
      let get = moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
        .format('YYYY-MM-DD HH:mm')
        .split(' ');
      let start = new Date(get[0]);
      let gettime = get[1].split(':');

      start.setHours(gettime[0]);
      start.setMinutes(gettime[1]);
      let end;
      if (
        this.state.endtime != undefined &&
        this.state.endtime != null &&
        this.state.endtime != ''
      ) {
        let get = moment(this.state.endtime, ['YYYY-MM-DD h:mm'])
          .format('YYYY-MM-DD HH:mm')
          .split(' ');
        end = new Date(get[0]);
        let gettime = get[1].split(':');

        end.setHours(gettime[0]);
        end.setMinutes(gettime[1]);
        console.log('endvalue=' + end + ' ' + start);
      } else {
        end = new Date(start);
        end.setMinutes(start.getMinutes() + Number(this.state.slottime));
        console.log(
          'hi' +
            end +
            end.setTime(
              start.getTime() + Number(this.state.slottime) * 60 * 1000,
            ),
        );
      }

      let appointmentdata = JSON.stringify({
        name: await AsyncStorage.getItem('doctorname'),
        date: this.state.dtime,
        branchid: this.state.branchid,
        branchname: this.state.branchname,
        city: this.state.city,
        specialization: this.state.specialization,
        salutation: this.state.salutation,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
      });

      let newStart;
      console.log('input=' + start + ' ' + end);
      if (start.getHours() < 10 && start.getMinutes() < 10) {
        newStart = '0' + start.getHours() + ':0' + start.getMinutes();
      } else if (start.getHours() < 10 && start.getMinutes() >= 10) {
        newStart = '0' + start.getHours() + ':' + start.getMinutes();
      } else if (start.getHours() >= 10 && start.getMinutes() < 10) {
        newStart = start.getHours() + ':0' + start.getMinutes();
      } else {
        newStart = start.getHours() + ':' + start.getMinutes();
      }
      let newEnd;
      if (end.getHours() < 10 && end.getMinutes() < 10) {
        newEnd = '0' + end.getHours() + ':0' + end.getMinutes();
      } else if (end.getHours() < 10 && end.getMinutes() >= 10) {
        newEnd = '0' + end.getHours() + ':' + end.getMinutes();
      } else if (end.getHours() >= 10 && end.getMinutes() < 10) {
        newEnd = end.getHours() + ':0' + end.getMinutes();
      } else {
        newEnd = end.getHours() + ':' + end.getMinutes();
      }

      let ob = JSON.stringify({
        healphaId: this.state.hlp_id,
        date: moment(get[0]).format('YYYY-MM-DD'),
        sTime: newStart,
        eTime: newEnd,
        doctor: await AsyncStorage.getItem('doctorid'),
        doc_name: await AsyncStorage.getItem('doctorname'),
        description: this.state.disc,
        branch_id: this.state.branchid,
        app_type:
          this.state.selectedIdtype == 'review appointment'
            ? 'review'
            : this.state.selectedIdtype,
        rev_enc: '',
      });
      console.log(
        'input2=' +
          newStart +
          ' ' +
          newEnd +
          ' ' +
          start.getHours() +
          ':' +
          start.getMinutes() +
          ' ' +
          end.getHours() +
          ':' +
          end.getMinutes(),
      );
      console.log('input=' + ob);
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
          this.setState({isLoading: false});
          console.log(response);
          if (response.message === 'Appointment is booked') {
            console.log('appointmnet encounter');
            this.createEncounter(response.uid);
            this.props.navigation.navigate('BookingInfo', {
              data: appointmentdata,
            });
          } else {
            this.setState({isLoading: false});
            console.log(response.message);
            Alert.alert(
              i18n.t('BOOKING.APPOINTMENT_NOT_BOOKED'),
              i18n.t('BOOKING.CONTACT_HEALPHA_HELPDESK'),
              [
                {
                  text:  i18n.t('BOOKING.OK'),
                  onPress: () =>
                    this.props.navigation.navigate('LandingPage', {
                      branch_id: this.state.branchid,
                      branch_name: this.state.branchname,
                    }),
                },
              ],
            );
          }
        })
        .catch((error) => {
          this.setState({isLoading: false});
          console.error(error);
        });
    }

    if (this.state.checking11) {
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
          this.setState({isLoading: false});
          console.log(response);
          if (response.message === 'Appointment is booked') {
            this.createEncounter(response.uid);
            this.props.navigation.navigate('BookingInfo', {
              data: appointmentdata,
            });
          } else {
            this.setState({isLoading: false});
            console.log(response.message);
            Alert.alert(
              i18n.t('BOOKING.APPOINTMENT_NOT_BOOKED'),
              i18n.t('BOOKING.CONTACT_HEALPHA_HELPDESK'),
              [
                {
                  text: i18n.t('BOOKING.OK'),
                  onPress: () =>
                    this.props.navigation.navigate('LandingPage', {
                      branch_id: this.state.branchid,
                      branch_name: this.state.branchname,
                    }),
                },
              ],
            );
          }
        })
        .catch((error) => {
          this.setState({isLoading: false});
          console.error(error);
        });
    }
  };

  createEncounter = async (uid) => {
    console.log('uid', uid);
    let ob = JSON.stringify({
      para_stand: 1,
      doc_email: this.props.postList.doc_details[0].email,
      uid: uid,
      doc_id: await AsyncStorage.getItem('doctorid'),
      doc_name: await AsyncStorage.getItem('doctorname'),
      practice_id: this.state.branchid.split('-')[0],
      branch_id: this.state.branchid,
      app_type:
        this.state.selectedIdtype == 'review appointment'
          ? 'review'
          : this.state.selectedIdtype,
      hlp_id: this.state.hlp_id,
      passingdate: '',
    });
    console.log('ob=', ob);
    let getdataurl = getBaseUrl() + 'create_newenc_standalone/';
    fetch(getdataurl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ob,
    }).then(async (response) => {
      console.log('Appointment booked');
    });
  };
  getTimeDateData = async () => {
    const dtime1 = this.props.navigation.state.params.dtime;
    if (!dtime1) {
      await this.getDoctorData();
      await this.getCalendarData();
    } else {
      this.setState({dtime: dtime1});
    }
    console.log(dtime1);
  };

  findTimelineData = async (query2) => {
    console.log(query2 + ' ' + query2.length + ' ' + this.state.search_flg);
    if (query2 === '') {
      this.setState({timelenedata: []});
    } else if (query2.length >= 3) {
      let url = getBaseUrl() + 'searchperson_standalone/';
      let ob = JSON.stringify({
        load: query2,
      });
      console.log(url + ' ' + ob);
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
          console.log('persondata', response.person);
          console.log(response.person.length);
          if (response.person.length > 0) {
            this.setState({timelenedata: response.person});
          } else {
            Alert.alert(
              i18n.t('CONFIRMATION.PERSON_NOT_AVAILABLE'),
              i18n.t('CONFIRMATION.PRESS_YES_TO_CREATE_PERSON'),
              [
                {
                  text: i18n.t('CONFIRMATION.YES'),
                  onPress: () =>
                    this.props.navigation.navigate('PersonAppointment', {
                      first_name: '',
                      last_name: '',
                      uid_temp: '',
                      temp_to_perm: '',
                      phone_no: '',
                      email: '',
                      branchid: this.state.branchid,
                    }),
                },
                {
                  text: i18n.t('CONFIRMATION.NO'),
                  onPress: () =>
                    this.setState({modal: true, timelenedata: [], query2: ''}),
                },
              ],
              {cancelable: this.state.modal},
            );
            return [];
          }
        });
    } else {
      this.setState({timelenedata: []});
    }
  };

  findTimelineData1 = async (query2) => {
    console.log('query2' + query2);
    if (query2 === '') {
      console.log('12354');
      return [];
    } else if (query2.length >= 3) {
      const {timeline} = this.state;
      const regex = new RegExp(
        `${query2.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
        'i',
      );
      let newData = [];

      newData =
        timeline.length > 0
          ? timeline.filter(
              (timelinedata) =>
                timelinedata.first_name
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.last_name
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.hlpid
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.phone_no
                  .replace(/([\.\phone_no^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0 ||
                timelinedata.email
                  .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                  .search(regex) >= 0,
            )
          : [];
      console.log('newData', newData);
      if (newData == []) {
        console.log('noooooooo');
      } else {
        return newData;
      }
    } else {
      return [];
    }
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
    let get = moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
      .format('YYYY-MM-DD HH:mm')
      .split(' ');
    let gettime = get[1].split(':');
    let end = new Date(get[0]);
    end.setHours(gettime[0]);
    end.setMinutes(gettime[1]);
    let st = new Date();
    var diffDays2 = Math.abs(Math.round((end - st) / (1000 * 60)));
    let value = diffDays2;

    let units = {
      day: 24 * 60,
      hour: 60,
      minute: 1,
    };
    // alert(value+" "+JSON.stringify(units));

    let result = [];

    for (let name in units) {
      let p = Math.floor(value / units[name]);
      if (p == 1) {
        result.push(' ' + p + ' ' + name);
      }

      if (p >= 2) {
        result.push(' ' + p + ' ' + name + 's');
      }
      value %= units[name];
    }
    // alert(value+" "+JSON.stringify(units)+" result= "+JSON.stringify(result))
    let timedata = '';
    if (result.length > 0) {
      result.map((item) => {
        timedata = timedata + ' ' + item;
      });
    } else {
      timedata = result[0];
    }
    // alert(days+" "+hrs+":"+minut);
    const {docName, docAddress, inputStyle, iconStyle} = Styles;
    //const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
    //  let uri=urldata[0]+"/"+this.state.imagepath.trim() ;
    console.log('imagepath', this.state.imagepath);
    let uri =
      this.state.imagepath.trim() != ''
        ? {uri: getApiUrl() + '/' + this.state.imagepath.trim()}
        : require('../../assets/images/doc2.png');

    const {query2} = this.state;
    //const timelenedata = this.findTimelineData(query2);
    //    console.log("timelenedata",timelenedata)
    //    console.log(timelenedata[0])
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    if (this.state.loading) {
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

    return (
      <Container>
        <Content>
          <Row>
            <Col style={{alignItems: 'flex-end'}}>
              <Button
                style={{
                  backgroundColor: APP_PRIMARY_COLOR,
                  padding: 5,
                  height: 28,
                  width: 180,
                  marginTop: 8,
                  marginBottom: 4,
                  marginRight: 4,
                }}
                onPress={async () => {
                  const country = await AsyncStorage.getItem('USER_COUNTRY');
                  if (country === 'in') {
                    this.props.navigation.navigate('CreatePerson', {
                      first_name: '',
                      last_name: '',
                      uid_temp: '',
                      temp_to_perm: '',
                      phone_no: '',
                      email: '',
                      branchid: this.state.branchid,
                    });
                  } else if (country === 'sl') {
                    this.props.navigation.navigate('PersonAppointment', {
                      first_name: '',
                      last_name: '',
                      uid_temp: '',
                      temp_to_perm: '',
                      phone_no: '',
                      email: '',
                      branchid: this.state.branchid,
                    });
                  }
                }}>
                <Text style={{color: 'white', marginLeft: 5}}>
                  {i18n.t('CONFIRMATION.CREATE_PERSON')}
                </Text>
              </Button>
            </Col>
          </Row>

          {/* <Card>
            <CardItem>
              <Body> */}
          <Row style={{zIndex: 1}}>
            <Col>
              <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={Styles.autocompleteContainer}
                data={
                  this.state.timelenedata.length > 0
                    ? this.state.timelenedata
                    : []
                }
                defaultValue={query2}
                onChangeText={(text) =>
                  this.setState({query2: text}, async () => {
                    try {
                      await this.findTimelineData(text);
                    } catch (e) {
                      // handle error
                    }
                  })
                }
                placeholder={i18n.t('CONFIRMATION.SEARCH_PERSON')}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        query2:
                          item.middle_name != null
                            ? item.first_name +
                              ' ' +
                              item.middle_name +
                              ' ' +
                              item.last_name
                            : item.first_name + ' ' + item.last_name,
                        loading: true,
                      });
                      this.setState({
                        salutation: item.salutation,
                        first_name: item.first_name,
                        last_name: item.last_name,
                      }),
                        this.getData2(item.hlpid);
                    }}>
                    <Row>
                      <Text allowFontScaling={false} style={Styles.itemText}>
                        {item.first_name}{' '}
                        {item.middle_name != null ? item.middle_name : ''}{' '}
                        {item.last_name} | {item.hlpid} | {item.phone_no}
                      </Text>
                    </Row>
                  </TouchableOpacity>
                )}
              />
            </Col>
            {/* <Col size={15}>
        
                        <Thumbnail small source={uri} />
                        </Col>
                        <Col size={85}>
                            
                          <Text style={docName}>{"Dr."+this.state.doctorname+"("+this.state.specialization+")"}</Text>
                          <Text style={docAddress}>{this.state.branchname+","+this.state.city}</Text>
                        </Col> */}
          </Row>
          {/* </Body>
            </CardItem>
          </Card> */}

          <Card>
            <CardItem>
              <Body>
                <Text style={{color: '#a9abad', fontSize: 10}}>
                {i18n.t('CONFIRMATION.APPOINTMENT_TYPE')}
                </Text>
                <Picker
                  placeholder="Select Appointment Type"
                  label="AppointmentType"
                  name="AppointmentType"
                  selectedValue={this.state.selectedIdtype}
                  style={{height: 30, width: 160, marginLeft: -10}}
                  onValueChange={this.updateUser}>
                  <Picker.Item label={i18n.t('CONFIRMATION.GENERAL')} value="general" />
                  <Picker.Item label={i18n.t('CONFIRMATION.EMERGENCY')} value="emergency" />
                  <Picker.Item label={i18n.t('CONFIRMATION.HOME_CARE')} value="homecare" />
                  <Picker.Item label={i18n.t('CONFIRMATION.REVIEW')} value="review" />
                  <Picker.Item label={i18n.t('CONFIRMATION.TELEMEDICINE')} value="telemedicine" />
                </Picker>
              </Body>
            </CardItem>
          </Card>

          <Card>
            <NavigationEvents onDidFocus={this.getTimeDateData} />
            <CardItem
              button
              onPress={() =>
                this.props.navigation.navigate('Booking', {
                  data: this.state.mdata,
                  freebusydata: this.state.freebusydata,
                  specialization: this.state.specialization,
                  imagepath: this.state.imagepath,
                  selectedIdtype: this.state.selectedIdtype,
                })
              }>
              <Body>
                <Row>
                  <Col size={10}>
                    <Icon style={iconStyle} active name="md-time" />
                  </Col>
                  <Col size={90}>
                    <Row>
                      <Text style={{fontSize: 12}}>{i18n.t('CONFIRMATION.DATE_AND_TIME')}</Text>
                    </Row>
                    <Row>
                      <Text style={{color: '#a9abad', fontSize: 13}}>
                        {this.state.dtime}
                      </Text>
                      <Text
                        style={{
                          color: '#a9abad',
                          fontSize: 10,
                          marginTop: 3,
                          marginLeft: 5,
                        }}>
                        {'in' + timedata}
                      </Text>
                    </Row>
                  </Col>
                </Row>
              </Body>
            </CardItem>
          </Card>

          <Card>
            <CardItem>
              <Body>
                <Item>
                  <Icon style={iconStyle} active name="md-copy" />
                  <Input
                    style={inputStyle}
                    placeholder={i18n.t('CONFIRMATION.COMPLAINT')}
                    value={this.state.disc}
                    onChangeText={(text) => this.setState({disc: text})}
                  />
                </Item>
                {this.state.show ? (
                  <Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>
                  {i18n.t('CONFIRMATION.PLEASE_FILL_DESCRIPTION')}
                  </Text>
                ) : null}
              </Body>
            </CardItem>
          </Card>
        </Content>
        {AsyncStorage.getItem('userToken') != undefined && (
          <Footer>
            <FooterTab>
              <Button
                style={{backgroundColor: APP_PRIMARY_COLOR}}
                //  onPress={this.book.bind(this)}
                onPress={this.askConfirmation}>
                <Text style={{color: 'white'}}>{i18n.t('CONFIRMATION.CONFIRM')}</Text>
              </Button>
            </FooterTab>
          </Footer>
        )}
        <FlashMessage position="top" ref={(ref) => (this.loginAlert = ref)} />
      </Container>
    );
  }
}

const Styles = {
  docName: {
    fontSize: 12,
  },
  docAddress: {
    fontSize: 10,
    color: '#a9abad',
    marginTop: 5,
  },
  inputStyle: {
    fontSize: 12,
  },
  iconStyle: {
    fontSize: 30,
  },
  formContainer: {
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: APP_PRIMARY_COLOR,
    paddingVertical: 15,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    height: 40,
    backgroundColor: '#dcdcdc',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
  },
  buttonText2: {
    textAlign: 'center',
    color: '#32325D',
    fontWeight: '700',
    fontSize: 20,
    textTransform: 'capitalize',
    padding: 20,
  },
  pickerStyle: {
    height: 40,
    width: null,
    color: '#4F575C',
    marginBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#dcdcdc',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
};
const mapStateToProps = (state) => ({
  oldList: state.oldList.oldList,
  postList: state.postList.postList,
});
export default connect(mapStateToProps, {getOldList, getPostList})(
  Confirmation,
);
