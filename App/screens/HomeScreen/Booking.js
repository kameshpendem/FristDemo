import React, {Component} from 'react';
import {TouchableOpacity, Alert, Image, ScrollView} from 'react-native';
import {
  View,
  Text,
  Row,
  Col,
  Content,
  Container,
  Label,
  Item,
  Button,
} from 'native-base';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
import {NavigationEvents} from 'react-navigation';
import {Overlay} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';

import {AppointmentButton} from '../../common/AppointmentButton';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
import i18n from '../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Booking extends Component {
  constructor(props) {
    super(props);
    global.getdate = Date();
    global.userToken = '';
    global.hlpid = '';
    this.state = {
      mdata: this.props.navigation.state.params.data,
      freebusydata: this.props.navigation.state.params.freebusydata,
      specialization: this.props.navigation.state.params.specialization,
      imagepath: this.props.navigation.state.params.imagepath,
      branchid: this.props.navigation.state.params.branchid,
      selectedIdtype: this.props.navigation.state.params.selectedIdtype,
      //rescheduledata:this.props.navigation.state.params.rescheduledata,
      rescheduledata: '',
      getdate: Date(),
      chief_complaint: '',
      encounter_date: '',
      isReview: false,
      selectedTime: '',
      appointmentdata: [],
      selectedEncounter: '',
      selectedPicker: false,
      getdata: [],
      message: '',
      data: [],
      data2: [],
      data3: [],
      doctors: [],
      doc_price: [],
      blacklist: [],
      visible1: false,
      visible2: false,
      visible3: false,
      time: '',
      encid1: '',
      appttype11: '',
      selectedValue: false,
    };
  }

  onValueChangeEncounter = (value) => {
    console.log(JSON.stringify(value));

    if (value != 'select') {
      this.setState({
        selectedEncounter: value,
        isReview: true,
        encounter_date: moment(value.schedule_date, 'YYYY-MM-DD').format(
          'YYYY-MMM-DD',
        ),
        chief_complaint:
          value.subjective.length > 0
            ? value.subjective[0].cheif_complaints
            : '',
        // selectedIdtype:"select"
      });
    }
  };
  reviewOk = async () => {
    this.setState({
      selectedValue: false,
      message: '',
      visible1: false,
    });
    await this.getDoctorData();
    await this.getCalendarData();
  };
  dateSelected = (date) => {
    // this.setState({getdate:date.toString()});
    global.getdate = date;
    this.getCalendarData();
    console.log(global.getdate);
  };

  getTimeline = async () => {
    let url = getBaseUrl() + 'review_enclist/';
    let ob = JSON.stringify({
      // "hlpid" : global.hlpid,
      // "token" : global.userToken,
      hlpid: '',
      token: '',
      branch_id: this.state.freebusydata.split(',')[0],
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
        if (
          response.message != 0 &&
          response.message != null &&
          response.message != []
        ) {
          return response.message;
        } else {
          return [];
        }
      })
      .catch((error) => {
        console.error(error);
      });

    this.setState({getData: response});
  };

  closeOverlay1 = () => {
    // this.setState({visible1:false,selectedIdtype:"select",selectedValue:false,message:""})
  };
  onValueChangeIdType = async (value) => {
    this.setState({
      selectedIdtype: value,
      // visible1:false
    });
    // alert(value)

    let doctorid = this.state.mdata.split(' ');
    let url1 = getBaseUrl() + 'emergency_status/';
    let freetime = this.state.freebusydata.split(',');
    let mdata = this.state.mdata.split(' ');
    let doc_id = mdata[0];
    let branch_id = freetime[0];
    if (value == 'emergency') {
      let ob1 = JSON.stringify({
        doc_id: doc_id,
        parameter: 's',
        branch_id: branch_id,
      });
      console.log('ob1=' + ob1);
      let response1 = await fetch(url1, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: ob1,
      })
        .then((response1) => response1.json())
        .then((response1) => {
          console.log('res=');
          console.log('res=' + JSON.stringify(response1));
          // let o1 = JSON.parse(response._bodyText);
          return response1.message;
        })

        .catch((error) => {
          console.error(error);
        });
      this.setState({
        status: response1,
      });

      if (this.state.status == 0) {
        console.log('value=' + this.state.selectedIdtype);
        this.setState({
          selectedValue: false,
          message: '',
          visible1: false,
        });
      } else if (this.state.status == 1) {
        this.setState({selectedValue: true});
      } else if (this.state.status == 2) {
        this.setState({message: 'no emergency allowance'});
      }
      this.setState({selectedPicker: false});
    } else if (value == 'review appointment' || value == 'review') {
      console.log('length=' + this.state.getData.length);
      console.log('reviewtele' + this.state.getData);
      this.state.getData.length > 0
        ? this.setState({
            selectedPicker: true,
            message: '',
            selectedValue: false,
          })
        : this.setState({message: 'there  is no appointments for review'});
    } else {
      this.setState({
        selectedValue: false,
        message: '',
        selectedPicker: false,
        // selectedIdtype:"select"
      });
    }
    //     let arraydata=this.state.appointmentdata.filter((arr,index,self)=>{
    //         return index===self.findIndex(item=>(
    //         item.UID.split(":")[1]===moment(global.getdate).format('YYYY-MM-DD')&&item.UID.split(":")[2]===doctorid[0] &&item.APPOINTMENT_TYPE==value
    //         ))
    //  })
    // if(arraydata.length>0){
    //    this.setState({visible1:false,visible2:true})
    // }
    // else
    // {
    // alert("selected="+value)

    // }
  };

  ChangeAppointmentType = async (ishealphauser) => {
    this.setState({ishealphauser: ishealphauser});
    console.log('appointment');
    await this.getDoctorData();
    await this.getCalendarData();

    // let url1 = base_url + "emergency_status/";
    // let freetime=this.state.freebusydata.split(",");
    let mdata = this.state.mdata.split(' ');
    // let doc_id=mdata[0]
    // let branch_id=freetime[0];

    if (this.state.selectedIdtype == 'emergency') {
      if (this.state.time != '') {
        this.getEmergencySlotTime(this.state.time, mdata[0]);
      } else {
        this.setState({message: 'Please Select time'});
      }
    } else {
      this.setState({visible1: false});
    }
    //     let ob1 =JSON.stringify({
    //         doc_id:doc_id,
    //         parameter:"s",
    //         branch_id:branch_id
    //     })
    //     console.log("ob1="+ob1)
    //     let response1 = await fetch(url1
    //         , {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body:ob1
    //         }
    //     )
    //     .then((response1) => response1.json())
    //     .then((response1) => {
    //         console.log("res=");
    //         console.log("res="+JSON.stringify(response1));
    //         // let o1 = JSON.parse(response._bodyText);
    //             return response1.message;
    //     })

    //         .catch((error) => {
    //             console.error(error);
    //         });
    //        this.setState({
    //            status:response1,
    //         })

    //     if(this.state.status==0){

    //         console.log("value="+this.state.selectedIdtype)
    //         this.setState({
    //             selectedValue:false,
    //             message:"",
    //             visible1:false,
    //          })

    //     }
    //     else if(this.state.status==1)
    //     {
    //        this.setState({selectedValue:true});
    //      }
    //      else if(this.state.status==2){
    //         this.setState({message:"no emergency allowance"})
    //      }
    // }

    // else if(this.state.selectedIdtype=="review appointment" || this.state.selectedIdtype=="review"){
    //     console.log("length="+this.state.getData.length)
    //     this.state.getData.length>0?
    //     this.setState({selectedPicker:true,message:""})
    //     :this.setState({message:"there  is no appointments for review"})
    // }
    // else{

    // this.setState({
    //     selectedValue:false,
    //     message:"",
    //     visible1:false,
    //     selectedPicker:false,
    //     // selectedIdtype:"select"
    //  })
    // }
  };
  getEmergencyData = async () => {
    let url = getBaseUrl() + 'appointmenttype/';
    let freetime = this.state.freebusydata.split(',');
    let practice_id = freetime[5];
    let branch_id = freetime[0];
    let ob = JSON.stringify({
      doc_id: this.state.doctors.doc_details[0].non_healpha_user_id,
      // practice_id:practice_id,
      branch_id: branch_id,
    });
    console.log('ob=' + ob);
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
        // let o1 = JSON.parse(response._bodyText);
        console.log('ob2=' + JSON.stringify(response));
        return response.message;
      })

      .catch((error) => {
        console.error(error);
      });
    if (global.userToken != undefined) {
      let ob = [];
      let ob1 = [];
      console.log('appttype1' + response);
      response.map((item) => {
        // if(item.appointment_type_value=="general"||item.appointment_type_value=="emergency"){
        ob.push(item.appointment_type_value);
        // }
      });
      if (ob.includes('telemedicine')) {
        ob1.push('Telemedicine');
      }
      if (ob.includes('homecare')) {
        ob1.push('Homecare');
      }
      if (ob.includes('covid')) {
        ob1.push('Covid');
      }
      if (ob.includes('general')) {
        ob1.push('General');
      }
      if (ob.includes('review')) {
        ob1.push('Review');
      }
      if (ob.includes('emergency')) {
        ob1.push('Emergency');
      }
      console.log(ob1);
      this.setState({selectedIdtype: ob1[0].toLowerCase(), type: ob1});
    } else {
      let ob = [];
      console.log('appttype' + response);
      response.map((item) => {
        console.log('valueeeeeeee', item.appointment_type_value);
        if (
          item.appointment_type_value == 'general' ||
          item.appointment_type_value == 'emergency'
        ) {
          ob.push(item);
        }
      });
      this.setState({type: ob});
    }
    //

    this.setState({visible1: true});
    // alert("hi"+JSON.stringify(this.state.type))
  };

  getEmergencySlotTime = async (time, doctor_id) => {
    let url = getBaseUrl() + 'emergency_slottime/';
    let freetime = this.state.freebusydata.split(',');
    let branch_id = freetime[0];
    let dayvalue;
    let mdata = this.state.mdata.split(' ');
    let ob = JSON.stringify({
      parameter: 's',
      branch_id: branch_id,
      date: moment(global.getdate).format('YYYY-MM-DD'),
      emergency_time: moment(time, 'hh:mm A').format('HH:mm'),
      doc_id: doctor_id,
      day: moment(global.getdate).format('dddd'),
    });

    console.log(ob);
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
        // let o1 = JSON.parse(response._bodyText);
        console.log('res=' + response.message);
        if (response.message == 0) {
          this.setState({message: 'give more than current time'});
          //
          alert(this.state.message);
        } else if (response.message == 1) {
          this.setState({message: 'going to beyond timings'});
          //
          alert(this.state.message);
        } else if (response.message == 2) {
          this.setState({message: 'give greater than doctor timing'});
          //
          alert(this.state.message);
        } else if (response.message == 3) {
          this.setState({message: 'no emergency allowance'});
          //
          alert(this.state.message);
        } else {
          this.setState({
            selectedValue: false,
            message: '',
            visible1: false,
            // selectedIdtype:"select"
          });
          this.props.navigation.navigate('Confirmation', {
            price:
              this.state.selectedIdtype == 'homecare'
                ? this.state.doc_price.homecare
                : this.state.doc_price.telemedicine,
            mail: this.state.doctors.doc_details[0].email,
            dtime:
              moment(global.getdate).format('YYYY-MM-DD') +
              ' ' +
              moment(time, ['HH:mm']).format('h:mm A'),
            doctorid: mdata[0],
            doctorname: mdata[1] + ' ' + mdata[2],
            specialization: this.state.specialization,
            branchid: freetime[0],
            slottime: freetime[2],
            imagepath: this.state.imagepath.trim(),
            city: freetime[4],
            branchname: freetime[3],
            apptype: 'emergency',
            endtime:
              moment(global.getdate).format('YYYY-MM-DD') +
              ' ' +
              response.message,
            getEncounter: this.state.selectedEncounter,
          });
        }
        return response.message;
      })

      .catch((error) => {
        console.error(error);
      });
    //     this.setState({type:response});
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
    let practice =
      this.state.branchid != undefined
        ? this.state.doctors.pract_details.filter(
            (item) => item.branch_id === this.state.branchid,
          )
        : this.state.doctors.pract_details.filter(
            (item) => item.branch_id === this.state.freebusydata.split(',')[0],
          );
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
              my[0] = my[0];
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
      this.state.data = dt;
      this.state.data2 = dt2;
      this.state.data3 = dt3;
    } else {
      this.state.data = [];
      this.state.data2 = [];
      this.state.data3 = [];
    }
    this.setState({disabled: true});
  };
  alencid = async (data, data1) => {
    this.setState({encid1: data, appttype11: data1});
  };
  componentDidMount = async () => {
    this.ChangeAppointmentType('yes');
    // alert(this.state.mdata+" "+this.state.imagepath+" "+this.state.freebusydata)
    await this.getDoctorData();
    // alert(this.state.price)
    console.log('hfwekjnel ewfvfwev' + this.state.price);
    if (this.props.navigation.state.params.rescheduledata != undefined) {
      // await this.getDoctorData();
      await this.getCalendarData();
    } else {
      global.userToken != undefined && (await this.getTimeline());
      await this.getEmergencyData();
      global.userToken != undefined && (await this.getappointments());
    }
  };
  getappointments = async () => {
    let url = getBaseUrl() + 'person_appointment';
    console.log(
      'url=' +
        url +
        ' hlpid=' +
        global.hlpid +
        ' token=' +
        global.userToken +
        ' roletype=' +
        global.roletype,
    );
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // hlp: global.hlpid,
        // token: global.userToken,
        hlp: '',
        token: '',
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === 'File Not Exists') {
          return [];
        } else {
          // alert("msg="+JSON.stringify(response.message))
          return response.message;
        }
      })
      .catch((error) => {
        console.error(error);
      });
    //     response.reverse().map((item)=>{
    //     // console.log(item.UID.split(":")[2])
    //         if(item.APPOINTMENT_STATUS!="cancelled"&&item.UID.split(":")[2]==this.state.mdata.split(" ")[0]){
    //         this.state.blacklist.push(item.UID.split(":")[1])
    //         }
    //     });

    // this.setState({appointmentdata: response.reverse()});
  };

  onClickFunction = (e, time, ishealphauser) => {
    let doctorid = this.state.mdata.split(' ');
    let freetime = this.state.freebusydata.split(',');

    console.log('res=' + this.state.selectedIdtype);
    console.log('res=' + this.props.navigation.state.params.rescheduledata);
    if (this.props.navigation.state.params.rescheduledata != undefined) {
      this.props.navigation.navigate('Confirmation', {
        mail: this.state.doctors.doc_details[0].email,
        price:
          this.state.selectedIdtype == 'homecare'
            ? this.state.doc_price.homecare
            : this.state.doc_price.telemedicine,
        dtime: moment(global.getdate).format('YYYY-MM-DD') + ' ' + time,
        doctorid: this.state.mdata.split(' ')[0],
        doctorname:
          this.state.mdata.split(' ')[1] + ' ' + this.state.mdata.split(' ')[2],
        specialization: this.state.specialization,
        branchid: freetime[0],
        slottime: freetime[2],
        imagepath: this.state.imagepath.trim(),
        city: freetime[4],
        branchname: freetime[3],
        apptype:
          this.props.navigation.state.params.rescheduledata.split(' ')[0],
        rescheduledata: this.props.navigation.state.params.rescheduledata,
        getEncounter: this.state.selectedEncounter,
        selectedIdtype: this.state.selectedIdtype,
      });
    } else {
      console.log('apptdata' + JSON.stringify(this.state.appointmentdata));
      if (
        this.state.selectedIdtype == 'homecare' ||
        this.state.selectedIdtype == 'covid'
      ) {
        let arraydata = this.state.appointmentdata.filter(
          (arr, index, self) => {
            return (
              index ===
              self.findIndex(
                (item) =>
                  item.BRANCH_ID == freetime[0] &&
                  (item.APPOINTMENT_TYPE == 'homecare' ||
                    item.APPOINTMENT_TYPE == 'covid') &&
                  (this.state.selectedIdtype == 'homecare' ||
                    this.state.selectedIdtype == 'covid') &&
                  item.APPOINTMENT_STATUS != 'cancelled' &&
                  item.APPOINTMENT_STATUS != 'closed' &&
                  this.alencid(item.encounter_id, item.APPOINTMENT_TYPE),
              )
            );
          },
        );
        if (arraydata.length > 0) {
          this.setState({visible3: true});
          // alert("appointment already booked")
        } else {
          if (this.state.selectedIdtype == 'emergency') {
            this.getEmergencySlotTime(time, doctorid[0]);
          } else {
            console.log(
              'free time clicked=' +
                moment(global.getdate).format('YYYY-MM-DD') +
                ' ' +
                time,
            );
            this.props.navigation.navigate('Confirmation', {
              mail: this.state.doctors.doc_details[0].email,
              price:
                this.state.selectedIdtype == 'homecare'
                  ? this.state.doc_price.homecare
                  : this.state.doc_price.telemedicine,
              dtime: moment(global.getdate).format('YYYY-MM-DD') + ' ' + time,
              doctorid: this.state.mdata.split(' ')[0],
              doctorname:
                this.state.mdata.split(' ')[1] +
                ' ' +
                this.state.mdata.split(' ')[2],
              specialization: this.state.specialization,
              branchid: freetime[0],
              slottime: freetime[2],
              imagepath: this.state.imagepath.trim(),
              city: freetime[4],
              branchname: freetime[3],
              apptype: this.state.selectedIdtype,
              getEncounter: this.state.selectedEncounter,
              healphauser: ishealphauser,
              selectedIdtype: this.state.selectedIdtype,
            });
          }
        }
      } else {
        let arraydata = this.state.appointmentdata.filter(
          (arr, index, self) => {
            return (
              index ===
              self.findIndex(
                (item) =>
                  item.uid.split(':')[1] ===
                    moment(global.getdate).format('YYYY-MM-DD') &&
                  item.uid.split(':')[2] === doctorid[0] &&
                  item.APPOINTMENT_TYPE == this.state.selectedIdtype &&
                  item.APPOINTMENT_STATUS != 'cancelled',
              )
            );
          },
        );
        if (arraydata.length > 0) {
          this.setState({visible2: true});
          // alert("appointment already booked")
        } else {
          if (this.state.selectedIdtype == 'emergency') {
            this.getEmergencySlotTime(time, doctorid[0]);
          } else {
            console.log(
              'free time clicked=' +
                moment(global.getdate).format('YYYY-MM-DD') +
                ' ' +
                time,
            );
            this.props.navigation.navigate('Confirmation', {
              mail: this.state.doctors.doc_details[0].email,
              price:
                this.state.selectedIdtype == 'homecare'
                  ? this.state.doc_price.homecare
                  : this.state.doc_price.telemedicine,
              dtime: moment(global.getdate).format('YYYY-MM-DD') + ' ' + time,
              doctorid: this.state.mdata.split(' ')[0],
              doctorname:
                this.state.mdata.split(' ')[1] +
                ' ' +
                this.state.mdata.split(' ')[2],
              specialization: this.state.specialization,
              branchid: freetime[0],
              slottime: freetime[2],
              imagepath: this.state.imagepath.trim(),
              city: freetime[4],
              branchname: freetime[3],
              apptype: this.state.selectedIdtype,
              getEncounter: this.state.selectedEncounter,
              healphauser: ishealphauser,
              selectedIdtype: this.state.selectedIdtype,
            });
          }
        }
      }
    }
    // this.setState({selectedTime:time})

    //   this.getEmergencyData()
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
          response.message != i18n.t('BOOKING.GIVE_CORRECT_DATA') &&
          response.message != i18n.t('BOOKING.ENTER_CORRECT_DATA') &&
          response.message != i18n.t('BOOKING.PLEASE_ENTER_ALL_DATA')
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
  setTimeData = (time) => {
    let mdata = this.state.mdata.split(' ');
    this.setState({
      time: moment(time, ['HH:mm']).format('h:mm A'),
      message: '',
    });
    //alert
    //this.getEmergencySlotTime(time,mdata[0])
  };

  render() {
    console.log('data=' + this.state.mdata);
    // let slt;
    // let elt;
    // if((this.state.selectedIdtype=="telemedicine"&&this.state.selectedIdtype!=undefined)||
    // (this.state.selectedIdtype=="tele medicine"&&this.state.selectedIdtype!=undefined)){
    //    slt=new Date()
    //    elt=new Date()
    // }else{
    //     slt=moment()
    //     elt=moment().add(31, 'days')
    // }
    let datesWhitelist = [
      {
        start: moment(),
        end: moment().add(31, 'days'), // total 4 days enabled
      },
    ];
    let act = 1;
    //             if(this.state.visible1){
    //         return(
    //             <View style={{
    //                 justifyContent: 'center',
    //                 alignItems: 'center'
    //             }}>
    //           <Overlay isVisible height={(this.state.selectedPicker||this.state.selectedValue)?310:190}>
    // <ScrollView>
    //           <Text style={{alignSelf:"center"}}>
    //                      Appointment Type
    //                  </Text>
    //               <Item picker style={{marginTop:15}}>
    //                                 <Picker
    //                                    selectedValue={this.state.selectedIdtype}
    //                                    onValueChange={this.onValueChangeIdType.bind(this)}
    //                                 >
    //                                 <Picker.Item label="Select" value="select" />

    //                                  {
    //                                 this.state.type.map((item) =>(
    //                                     <Picker.Item label={item} value={item.toLowerCase()} />
    //                                 ))
    //                                 }
    //                                 </Picker>
    //              </Item>
    //              {
    //                  this.state.selectedPicker&&(
    //                     <Item picker style={{marginTop:15}}>
    //                     <Picker
    //                        selectedValue={this.state.selectedEncounter}
    //                        onValueChange={this.onValueChangeEncounter.bind(this)}
    //                     >
    //                     <Picker.Item label="Select Encounter" value="select" />

    //                      {
    //                     this.state.getData.map((item) =>(
    //                        ((item.encounter_type!="covid")&&(item.encounter_type!="homecare"))&& <Picker.Item label={item.enc_id} value={item} />
    //                     ))
    //                     }
    //                     {/* {
    //                     this.state.getData.map((item) =>(
    //                        <Picker.Item label={item.enc_id} value={item} />
    //                     ))
    //                     } */}
    //                     </Picker>
    //  </Item>
    //                  )
    //              }

    //        {this.state.selectedValue?(<DatePicker
    //     style={{width: 200,marginTop:20,alignSelf:'center'}}
    //     date={this.state.time}
    //     mode="time"
    //     placeholder="HH:MM"
    //     // showIcon={false}
    //     format="HH:mm"
    //     confirmBtnText="Confirm"
    //     is24Hour={false}
    //     showIcon="false"
    //     cancelBtnText="Cancel"
    //     customStyles={{
    //       dateIcon: {
    //         position: 'absolute',
    //         left: 0,
    //         top: 4,
    //         marginLeft: 0
    //       },
    //       dateInput: {
    //         marginLeft: 36
    //       }
    //       // ... You can check the source to find the other keys.
    //     }}
    //     onDateChange={(time) => {this.setTimeData(time)}}
    //        />):null}
    //   {/* <Text>{this.state.time}</Text> */}
    //   <Text style={{color:"red",marginLeft:50,marginTop:10}}>{this.state.message}</Text>
    // {this.state.isReview &&
    // <Text style={{fontSize:14,color: "#2D323C",marginLeft:50,marginTop:10}}>
    //     <Text style={{fontWeight:'500',marginTop:13,fontWeight:"bold"}}>Chief Complaint: </Text>
    //                 {((this.state.chief_complaint
    //                     .replace(/(3[01]|[2][0-9]|0\d)-[a-zA-Z]{3}-\d{4}/,''))
    //                     .replace('<br>', ''))
    //                     .replace(/\s*\<.*?\>\s*/g, '\t')}
    //               </Text>}
    // {this.state.isReview && <Text style={{fontSize:14,color: "#2D323C",marginLeft:50,marginTop:10}}><Text style={{fontWeight:'500',marginTop:13,fontWeight:"bold"}}>Date: </Text> {this.state.encounter_date}</Text>}

    // <Row style={{marginTop:-20,justifyContent:"center"}}>
    //                  <Col>
    //                  <Button small
    //                 onPress={() =>this.state.isReview?this.reviewOk():
    //                     this.ChangeAppointmentType("yes")
    //                     }
    //                 style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:100}}
    //                 >
    //                     <Text style={{color:"white",marginLeft:20,fontSize:14}}>OK</Text>
    //                 </Button>
    //                  </Col>
    //                  <Col>
    //         <Button small
    //         onPress={() => this.props.navigation.goBack()}
    //         style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:100}}
    //         ><Text style={{color:"white",marginLeft:20,fontSize:14}}>Back</Text></Button>
    //         </Col>
    //              </Row>
    // {/*
    //              :
    //              <Button small
    //         onPress={() => this.props.navigation.goBack()}
    //         style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:100}}
    //         ><Text style={{color:"white",marginLeft:13,fontSize:12}}>close</Text></Button> */}

    // </ScrollView>
    //           </Overlay>
    //         </View>
    //         )
    //     }

    if (this.state.visible2) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible1 height={350}>
            <Image
              source={require('../../assets/images/no-record.png')}
              style={{alignSelf: 'center'}}
            />
            <Text
              style={{alignSelf: 'center', fontSize: 14, fontWeight: '600'}}>
              {i18n.t('BOOKING.APPOINTMENT_BOOKED')}{' '}
            </Text>
            {/* <Text> {"\n"}</Text>
             {this.state.type.length>1&& <Text style={{ fontSize:14, fontWeight:'600'}}>Please Press "Change" if you want book another type of appointment</Text>} */}
            {/* {this.state.type.length==1? */}

            <Button
              small
              onPress={() => this.props.navigation.goBack()}
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                marginTop: 20,
                alignSelf: 'center',
                width: 100,
              }}>
              <Text style={{color: 'white', marginLeft: 13, fontSize: 10}}>
              {i18n.t('BOOKING.GO_BACK')}
              </Text>
            </Button>

            {/* :

                <Row>
                    <Col>
                <Button small
                onPress={() => this.props.navigation.goBack()}
                style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:100}}
                ><Text style={{color:"white",marginLeft:13,fontSize:10}}>Go Back</Text></Button>
                </Col>
                <Col>
                <Button small
                onPress={() => this.setState({visible2:false,visible1:true,selectedIdtype:"select"})}
                style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:100}}
                ><Text style={{color:"white",marginLeft:13,fontSize:10}}>Change</Text></Button>
                </Col>
                </Row>
             } */}
          </Overlay>
        </View>
      );
    }
    if (this.state.visible3) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible1 height={350}>
            <Image
              source={require('../../assets/images/no-record.png')}
              style={{alignSelf: 'center'}}
            />
            <Text
              style={{alignSelf: 'center', fontSize: 14, fontWeight: '600'}}>
              An {this.state.appttype11} encounter (
              {this.state.encid1.split('-')[2]}), is already Open , Please close
              the encounter{' '}
            </Text>
            {/* <Text> {"\n"}</Text>
             {this.state.type.length>1&& <Text style={{ fontSize:14, fontWeight:'600'}}>Please Press "Change" if you want book another type of appointment</Text>} */}
            {/* {this.state.type.length==1? */}

            <Button
              small
              onPress={() => this.props.navigation.goBack()}
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                marginTop: 20,
                alignSelf: 'center',
                width: 100,
              }}>
              <Text style={{color: 'white', marginLeft: 13, fontSize: 10}}>
              {i18n.t('BOOKING.GO_BACK')}
              </Text>
            </Button>

            {/* :

                <Row>
                    <Col>
                <Button small
                onPress={() => this.props.navigation.goBack()}
                style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:100}}
                ><Text style={{color:"white",marginLeft:13,fontSize:10}}>Go Back</Text></Button>
                </Col>
                <Col>
                <Button small
                onPress={() => this.setState({visible2:false,visible1:true,selectedIdtype:"select"})}
                style={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20,alignSelf:'center',width:100}}
                ><Text style={{color:"white",marginLeft:13,fontSize:10}}>Change</Text></Button>
                </Col>
                </Row>
             } */}
          </Overlay>
        </View>
      );
    }
    //   let datesBlacklist = [ moment().add(1, 'days') ]; // 1 day disabled
    return (
      <Container>
        <Content>
          {/*    <NavigationEvents onDidFocus={this.getCalendarData.bind(this)}/> */}

          <CalendarStrip
            calendarAnimation={{type: 'parallel', duration: 30}}
            daySelectionAnimation={{
              type: 'background',
              duration: 200,
              highlightColor: '#EEEEEE',
            }}
            style={{height: 100, paddingTop: 20, paddingBottom: 10}}
            calendarHeaderStyle={{
              color: '#345D7E',
              paddingBottom: 10,
              marginTop: -15,
            }}
            calendarColor={'#DCDCDC'}
            dateNumberStyle={{color: '#345D7E'}}
            dateNameStyle={{color: '#345D7E'}}
            highlightDateNumberStyle={{color: APP_PRIMARY_COLOR}}
            highlightDateNameStyle={{color: APP_PRIMARY_COLOR}}
            disabledDateNameStyle={{color: 'grey'}}
            disabledDateNumberStyle={{color: 'grey'}}
            datesWhitelist={datesWhitelist}
            datesBlacklist={this.state.blacklist}
            onDateSelected={(date) => this.dateSelected(date)}
            selectedDate={global.getdate}
            iconContainer={{flex: 0.1}}
            minDate={new Date()}
          />

          <Text style={{marginLeft: 15, color: '#4F575C'}}>
            <Icon name="md-partly-sunny" size={16} color="#4F8EF7" />
            &nbsp;&nbsp;{i18n.t('BOOKING.MORNING')}
          </Text>
          <Row>
            <Col
              style={{
                marginLeft: 10,
                marginTop: 10,
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {this.state.data.map((p) => (
                <AppointmentButton
                  buttonName={p}
                  onPress={(e) => {
                    global.userToken != undefined
                      ? this.onClickFunction(e, p, 'yes')
                      : Alert.alert(null, i18n.t('BOOKING.ARE_YOU_HEALPHA_USER'), [
                          {
                            text: i18n.t('BOOKING.YES'),
                            onPress: () => this.onClickFunction(e, p, 'yes'),
                          },
                          {
                            text: i18n.t('BOOKING.NO'),
                            onPress: () => this.onClickFunction(e, p, 'no'),
                          },
                        ]);
                  }}></AppointmentButton>
              ))}
            </Col>
          </Row>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#DCDCDC',
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          />
          <Text style={{marginLeft: 15, color: '#4F575C'}}>
            <Icon name="md-sunny" size={16} color="#FFD700" />
            &nbsp;&nbsp;{i18n.t('BOOKING.AFTERNOON')}
          </Text>
          <Row>
            <Col
              style={{
                marginLeft: 10,
                marginTop: 10,
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {this.state.data2.map((p) => (
                <AppointmentButton
                  buttonName={p}
                  onPress={(e) => {
                    global.userToken != undefined
                      ? this.onClickFunction(e, p, 'yes')
                      : Alert.alert(null, i18n.t('BOOKING.ARE_YOU_HEALPHA_USER'), [
                          {
                            text: i18n.t('BOOKING.YES'),
                            onPress: () => this.onClickFunction(e, p, 'yes'),
                          },
                          {
                            text: i18n.t('BOOKING.NO'),
                            onPress: () => this.onClickFunction(e, p, 'no'),
                          },
                        ]);
                  }}
                />
              ))}
            </Col>
          </Row>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#DCDCDC',
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          />
          <Text style={{marginLeft: 15, color: '#4F575C'}}>
            <Icon name="md-moon" size={16} color="#4F575C" />
            &nbsp;&nbsp;{i18n.t('BOOKING.EVENING')}
          </Text>

          <Row>
            <Col
              style={{
                marginLeft: 10,
                marginTop: 10,
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {this.state.data3.map((p) => (
                <AppointmentButton
                  buttonName={p}
                  onPress={(e) => {
                    global.userToken != undefined
                      ? this.onClickFunction(e, p, 'yes')
                      : Alert.alert(null, i18n.t('BOOKING.ARE_YOU_HEALPHA_USER'), [
                          {
                            text: i18n.t('BOOKING.YES'),
                            onPress: () => this.onClickFunction(e, p, 'yes'),
                          },
                          {
                            text: i18n.t('BOOKING.NO'),
                            onPress: () => this.onClickFunction(e, p, 'no'),
                          },
                        ]);
                  }}
                  active={1}
                  disabled={1}></AppointmentButton>
              ))}
            </Col>
          </Row>
        </Content>
      </Container>
    );
  }
}
export default Booking;
