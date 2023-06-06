import React, {Component} from 'react';
import moment from 'moment';
import {
  Alert,
  ActivityIndicator,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import getBaseUrl, {getApiUrl} from '../common/config';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';
import * as firebase from 'react-native-firebase';
// import messaging from "react-native-firebase/messaging";

import {
  DEFAULT_LIGHT_GREY_COLOR,
  LIST_SUB_TEXT_COLOR,
  TEXT_COLOR,
} from '../../../themes/variable';
import {Text, Icon, Button} from 'native-base';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
const base_url = getBaseUrl();
import NavRoutes from '../../constants/NavRoutes';
import i18n from '../../../i18n';
let authStatus;

class ConfirmationNew extends Component {
  constructor(props) {
    super(props);
    let dat_val = new Date();
    this.state = {
      mail: this.props.navigation.state.params.mail,
      price: this.props.navigation.state.params.price,
      selectedIdtype: this.props.navigation.state.params.selectedIdtype,
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
      personlist: [],
      otpsent: false,
      otpvalue: 0,
      error1: '',
      error2: '',
      error3: '',
      error4: '',
      checking11: false,
      Bookenabled: false,
      today_date: moment(dat_val).format('YYYY-MM-DD'),
      visibleModal: true,
    };
  }

  componentDidMount = async () => {
    this.employer();
    this.discount_amount();
    // alert(global.phone+" "+global.mail+""+global.getdate+this.state.dtime.split(" ")[0])
    // alert(this.state.price+" "+this.state.mail)
    // alert(this.state.selectedIdtype)telemedicine
    const obj = await AsyncStorage.getItem('obj');
    if (obj) {
      let ob2 = JSON.parse(obj);
      this.state.name =
        ob2[0]['salutation'] +
        '. ' +
        ob2[0]['first_name'] +
        ' ' +
        ob2[0]['middle_name'] +
        ' ' +
        ob2[0]['last_name'];
      this.state.email = ob2[0]['email'];
      this.state.phno = '+91' + ob2[0]['phone_no'];
    }
    this.setState({loading: true});

    // return this.state.name;
    let ova = JSON.stringify({
      id: global.hlpid,
      token: global.userToken,
    });
    let url = getBaseUrl() + 'payment_json/';
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ova,
    })
      .then((response) => response.json())
      .then((response) => {
        //    alert(JSON.stringify(response))
        this.setState({
          razar_id: response.message[0].razorpay_liveid,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  askConfirmation = () => {
    //  alert(this.state.disc)
    if (this.state.disc == undefined) {
      this.setState({
        show: true,
      });
    } else {
      this.setState({
        show: false,
      });
      Alert.alert(
        i18n.t('APPOINTMENTS.APP_CONFORMATION'),
        i18n.t('APPOINTMENTS.APP_CONFORMATION_POP'),
        [
          {
            text: i18n.t('COMMON.YES'),
            onPress: () => this.book(),
          },
          {
            text: i18n.t('COMMON.NO'),
            onPress: () => this.setState({modal: true}),
          },
        ],
        {cancelable: this.state.modal},
      );
    }
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  checkentereddata = () => {
    if (this.state.emaildata === '' || this.state.emaildata === 'undefined') {
      this.loginAlert.showMessage({
        message: 'Alert!',
        description: 'Please enter Healpha ID / Email / Phone Number',
        type: 'warning',
        icon: 'auto',
      });
    } else {
      this.personList();
    }
  };

  checkOTP = () => {
    if (this.state.otpgotvalue == this.state.otpvalue) {
      //alert("matched");
      this.setState({Bookenabled: true});
      this.bookappointment();
    } else {
      alert('otp mismatched');
    }
  };
  bookappointment = async () => {
    if (this.state.disc == undefined) {
      this.setState({
        show: true,
      });
    } else {
      let url = base_url + 'save_tempperson/';

      //     let start1=new Date(this.state.dtime);
      //    let  end=new Date(start1.setMinutes(start1.getMinutes() + 30).toString());
      //    alert(this.state.dtime)
      let get = moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
        .format('YYYY-MM-DD HH:mm')
        .split(' ');
      // alert("time="+get[0]+" "+get[1]);
      let start = new Date(get[0]);
      // alert("start="+get[0]);
      let gettime = get[1].split(':');

      start.setHours(gettime[0]);
      start.setMinutes(gettime[1]);

      let newStart;
      if (start.getHours() < 10 && start.getMinutes() < 10) {
        newStart = '0' + start.getHours() + ':0' + start.getMinutes();
      } else if (start.getHours() < 10 && start.getMinutes() > 10) {
        newStart = '0' + start.getHours() + ':' + start.getMinutes();
      } else if (start.getHours() > 10 && start.getMinutes() < 10) {
        newStart = start.getHours() + ':0' + start.getMinutes();
      } else {
        newStart = start.getHours() + ':' + start.getMinutes();
      }

      let ob = JSON.stringify({
        fname: this.state.first_name,
        lname: this.state.last_name,
        email: this.state.emaildata,
        code: this.state.phno.substring(0, 3),
        ph_number: this.state.phno.substring(3, this.state.phno.length),
        doc_id: this.state.doctorid,
        br_id: this.state.branchid,
        date: moment(get[0]).format('YYYY-MM-DD'),
        start_time: newStart + ':00',
        doc_name: this.state.doctorname,
        description: this.state.disc,
        app_type:
          this.state.apptype == 'review appointment'
            ? 'review'
            : this.state.apptype,
        emerg: '0',
      });
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
          alert(response.message);
          this.props.navigation.navigate(NavRoutes.PUBLIC.WELCOME);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  healphabook_appointment = async () => {
    let url = base_url + 'healphaperson_book/';

    let get = moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
      .format('YYYY-MM-DD HH:mm')
      .split(' ');

    let start = new Date(get[0]);

    let gettime = get[1].split(':');

    start.setHours(gettime[0]);
    start.setMinutes(gettime[1]);

    let newStart;
    if (start.getHours() < 10 && start.getMinutes() < 10) {
      newStart = '0' + start.getHours() + ':0' + start.getMinutes();
    } else if (start.getHours() < 10 && start.getMinutes() > 10) {
      newStart = '0' + start.getHours() + ':' + start.getMinutes();
    } else if (start.getHours() > 10 && start.getMinutes() < 10) {
      newStart = start.getHours() + ':0' + start.getMinutes();
    } else {
      newStart = start.getHours() + ':' + start.getMinutes();
    }

    let ob = JSON.stringify({
      docid: this.state.doctorid,
      br_id: this.state.branchid,
      date: moment(get[0]).format('YYYY-MM-DD'),
      hlpid: this.state.gotvalue,
      start_time: newStart + ':00',
      doc_name: this.state.doctorname,
      description: this.state.disc,
      app_type:
        this.state.apptype == 'review appointment'
          ? 'review'
          : this.state.apptype,
      emerg: '0',
      encid_list: 'null',
    });

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
        alert(response.message);
        this.props.navigation.navigate('Dashboard');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  askOTP = async () => {
    let url = base_url + 'send_otp/';
    if (this.state.first_name == '') {
      this.setState({error1: 'Please Enter First Name'});
    } else if (this.state.last_name == '') {
      this.setState({error2: 'Please Enter Last Name'});
    } else if (this.state.emaildata == '') {
      this.setState({error3: 'Please Enter Email Id'});
    } else if (this.state.phno == '+91') {
      this.setState({error4: 'Please Enter Phone Number'});
    } else {
      let ob = JSON.stringify({
        email: this.state.emaildata,
        phone: this.state.phno.substring(3, this.state.phno.length),
        fname: this.state.first_name,
        lname: this.state.last_name,
      });
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
          // alert(JSON.stringify(response))
          if (response.message == '0') {
            alert('OTP Not Sent');
          } else if (response.message == 'OTP not enabled for this instance') {
            alert('OTP not enabled for this instance');
          } else if (response.message == 'Mail not enabled for this instance') {
            alert('Mail not enabled for this instance');
          } else {
            alert('OTP Sent SuccessFully');

            this.setState({otpsent: true, otpgotvalue: response.message});
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  razr_successCallback = async (data) => {
    // alert(JSON.stringify(data))
    let url = getBaseUrl() + 'razerpay_save_qrcode/';

    //     let start1=new Date(this.state.dtime);
    //    let  end=new Date(start1.setMinutes(start1.getMinutes() + 30).toString());
    //    alert(this.state.dtime)
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
    } else {
      end = new Date(start);
      end.setMinutes(start.getMinutes() + Number(this.state.slottime));
    }

    let appointmentdata = JSON.stringify({
      name: this.state.doctorname,
      date: this.state.dtime,
      branchname: this.state.branchname,
      city: this.state.city,
      specialization: this.state.specialization,
      telemedicine: 1,
    });

    let newStart;
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
    // alert(this.state.apptype)
    let ocv = JSON.stringify({
      token: global.userToken,
      hlpid: this.state.hlpid,
      razer_id:
        global.corporate_flag1 == 'yes' && this.state.payment_by == 'employer'
          ? ''
          : data.razorpay_payment_id,
      payer_name:
        global.salutation +
        ' ' +
        global.fname.replace(/^./, global.fname[0].toUpperCase()) +
        ' ' +
        global.lname,
      purpose: this.state.apptype == 'homecare' ? 'homecare' : 'telemedicine',
      role_type: global.roletype,
      user_name:
        global.fname.replace(/^./, global.fname[0].toUpperCase()) +
        ' ' +
        global.lname,
      gen_price: this.state.price,
      app_type: this.state.apptype == 'homecare' ? 'homecare' : 'telemedicine',
      doc_name: this.state.doctorname,
      doc_id: this.state.doctorid,
      brn_id: this.state.branchid,
      start_time: newStart + ':00',
      chief: this.state.disc,
      end_time: newEnd + ':00',
      email: this.state.mail,
      app_date: this.state.dtime.split(' ')[0],
      nh_id: '',
      corporate_flag: global.corporate_flag1 == 'yes' ? 1 : 0,
      qrcode_flg: 0,
      payment_by: this.state.payment_by,
    });
    let ob = JSON.stringify({
      healphaId: this.state.hlpid,
      date: moment(get[0]).format('YYYY-MM-DD'),
      sTime: newStart,
      //(this.state.endtime!=undefined&&this.state.endtime!=null&&this.state.endtime!="")?
      // moment(this.state.endtime,"HH:mm:ss").format("HH:mm")
      //:
      eTime: newEnd,
      doctor: this.state.doctorid,
      doc_name: this.state.doctorname,
      // description:this.state.description!==undefined && this.state.description!==""?this.state.description:"appointment with "+this.state.doctorname,
      description: this.state.disc,
      branch_id: this.state.branchid,
      app_type:
        this.state.apptype == 'review appointment'
          ? 'review'
          : this.state.apptype,
      rev_enc:
        this.state.getEncounter.enc_id != undefined
          ? this.state.getEncounter.enc_id
          : '',
    });

    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ocv,
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({isLoading: false});
        if (
          response.message != 'Appointment Already Booked' &&
          response.message != 'Doctor is not Available at that Time' &&
          response.message != 'Appointment time is not Available' &&
          response.message != '0' &&
          response.message != '1' &&
          response.message != '2' &&
          response.message != 'You have selected past slot time'
        ) {
          this.props.navigation.navigate('ViewPdfScreen2', {
            link:
              global.corporate_flag1 == 'yes' &&
              this.state.payment_by == 'employer'
                ? response.message
                : base_url + '/' + response.message,
          });
        } else if (response.message == 'Appointment Already Booked') {
          this.setState({isLoading: false});
          console.log(response.message);
          Alert.alert('', i18n.t('APPOINTMENTS.ALREADY_BOOK'), [
            {
              text: i18n.t('COMMON.OK'),
              onPress: () => this.props.navigation.navigate('Dashboard'),
            },
          ]);
        } else if (response.message == 'Doctor is not Available at that Time') {
          this.setState({isLoading: false});
          console.log(response.message);
          Alert.alert('', i18n.t('APPOINTMENTS.DOC_NOT_AVBL'), [
            {
              text: i18n.t('COMMON.OK'),
              onPress: () => this.props.navigation.navigate('Dashboard'),
            },
          ]);
        } else if (response.message == 'Appointment time is not Available') {
          this.setState({isLoading: false});
          console.log(response.message);
          Alert.alert('', i18n.t('APPOINTMENTS.APP_NOT_AVBL'), [
            {
              text: i18n.t('COMMON.OK'),
              onPress: () => this.props.navigation.navigate('Dashboard'),
            },
          ]);
        } else if (response.message == '0') {
          this.setState({isLoading: false});
          console.log(response.message);
          Alert.alert('', i18n.t('APPOINTMENTS.PAYMENT_FAILED'), [
            {
              text: i18n.t('COMMON.OK'),
              onPress: () => this.props.navigation.navigate('Dashboard'),
            },
          ]);
        } else if (response.message == '1') {
          this.setState({isLoading: false});
          console.log(response.message);
          Alert.alert('', i18n.t('APPOINTMENTS.VISIT_ID_NOT_GEN'), [
            {
              text: i18n.t('COMMON.OK'),
              onPress: () => this.props.navigation.navigate('Dashboard'),
            },
          ]);
        } else if (response.message == '2') {
          this.setState({isLoading: false});
          console.log(response.message);
          Alert.alert('', i18n.t('APPOINTMENTS.RECEIPT_NOT_GEN'), [
            {
              text: i18n.t('COMMON.OK'),
              onPress: () => this.props.navigation.navigate('Dashboard'),
            },
          ]);
        } else if (response.message == 'You have selected past slot time') {
          this.setState({isLoading: false});
          console.log(response.message);
          Alert.alert('', i18n.t('APPOINTMENTS.PAST_TIME'), [
            {
              text: i18n.t('COMMON.OK'),
              onPress: () => this.props.navigation.pop(2),
            },
          ]);
        }
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.error(error);
      });
  };

  book = async () => {
    console.log('check duplicate', Date.now());
    if (
      this.state.rescheduledata == undefined &&
      this.state.apptype.toLowerCase() != 'emergency'
    ) {
      console.log('cherry1');
      let checkurl = base_url + 'check_duplicte_app/';
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

      let checking1 = JSON.stringify({
        hlpid: this.state.hlpid,
        token: global.userToken,
        app_type:
          this.state.apptype == 'review appointment'
            ? 'review'
            : this.state.apptype,
        doc_name: this.state.doctorname,
        doc_id: this.state.doctorid,
        brn_id: this.state.branchid,
        start_time: newStart + ':00',
        end_time: newEnd + ':00',
        app_date: moment(get[0]).format('YYYY-MM-DD'),
      });
      console.log('checking1' + checking1);
      console.log('start check duplicate', Date.now());
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
          console.log('end check duplicate', Date.now());
          console.log('response1.me' + response1.message);
          if (response1.message == 'Appointment Already Booked') {
            this.setState({isLoading: false, checking11: false});
            Alert.alert(i18n.t('APPOINTMENTS.ALREADY_BOOK'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.navigate('MyAppointment'),
              },
            ]);
          } else if (
            response1.message == 'Doctor is not Available at that Time'
          ) {
            this.setState({isLoading: false, checking11: false});
            Alert.alert(i18n.t('APPOINTMENTS.DOC_NOT_AVBL'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.pop(2),
              },
            ]);
          } else if (response1.message == '') {
            this.setState({isLoading: false, checking11: false});
            Alert.alert(i18n.t('APPOINTMENTS.INVALID_LOGIN'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.navigate('Dashboard'),
              },
            ]);
          } else if (response1.message == 'Not Booked') {
            this.setState({isLoading: false, checking11: false});
            Alert.alert(i18n.t('APPOINTMENTS.NOT_BOOKED'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.navigate('MyAppointment'),
              },
            ]);
          } else if (response1.message == 'You have selected past slot time') {
            this.setState({isLoading: false, checking11: false});
            Alert.alert(i18n.t('APPOINTMENTS.PAST_TIME'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.pop(2),
              },
            ]);
          } else if (response1.message == 1) {
            console.log('razorpayok');
            this.setState({checking11: true});
          } else if (response1.message == 'Please select another slot timing') {
            this.setState({isLoading: false, checking11: false});
            Alert.alert(i18n.t('APPOINTMENTS.ANOTHER_SLOT_TIMINGS'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.pop(2),
              },
            ]);
          } else {
            this.setState({isLoading: false, checking11: false});
            Alert.alert(response1.message, '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.navigate('MyAppointment'),
              },
            ]);
          }
        })
        .catch((error) => {
          this.setState({isLoading: false});
          console.error(error);
        });
    } else {
      console.log('2121');
    }
    let starttime = this.state.dtime;
    let endtime = new Date(
      moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
        .format('YYYY-MM-DD HH:mm')
        .split(' ')[0],
    );
    // let endtime=new Date(this.state.dtime).setMinutes()

    console.log(this.state.apptype);
    if (this.state.rescheduledata != undefined) {
      console.log('cherry2');
      let url = getBaseUrl() + 'reschedule/';
      console.log(this.state.apptype);
      console.log(
        'this.state.rescheduledata.',
        this.state.rescheduledata.split(' ')[3],
      );
      let ob = JSON.stringify({
        hlp: this.state.hlpid,
        dat: moment(this.state.rescheduledata.split(' ')[1]).format(
          'YYYY-MM-DD',
        ),
        originalStartTime: moment(
          this.state.rescheduledata.split(' ')[2] +
            ' ' +
            this.state.rescheduledata.split(' ')[3],
          ['YYYY-MM-DD h:mm A'],
        ).format('YYYY-MM-DD HH:mm:ss'),
        originalEndTime: moment(
          this.state.rescheduledata.split(' ')[4] +
            ' ' +
            this.state.rescheduledata.split(' ')[5],
          ['YYYY-MM-DD h:mm A'],
        ).format('YYYY-MM-DD HH:mm:ss'),
        doc_id: this.state.doctorid,
        orig_date: moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
          .format('YYYY-MM-DD HH:mm:ss')
          .split(' ')[0],
        rescheduledStartTime: moment(starttime, ['YYYY-MM-DD h:mm A']).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
        rescheduledEndTime: moment(
          this.state.dtime + '' + endtime.getMinutes(),
          ['YYYY-MM-DD h:mm A'],
        )
          .add(Number(this.state.slottime), 'm')
          .format('YYYY-MM-DD HH:mm:ss'),
        br_id: this.state.branchid,
        br_name: this.state.branchname,
        uid: this.state.rescheduledata.split(' ')[6],
        app_type:
          this.state.apptype == 'review appointment'
            ? 'review'
            : this.state.apptype,
      });
      console.log(ob);
      let appointmentdata = JSON.stringify({
        name: this.state.doctorname,
        date: this.state.dtime,
        branchname: this.state.branchname,
        city: this.state.city,
        specialization: this.state.specialization,
      });
      await fetch(url, {
        method: 'POST',
        headers: {
          AccepWelcomet: 'application/json',
          'Content-Type': 'application/json',
        },
        body: ob,
      })
        .then((response) => response.json())
        .then((response) => {
          this.setState({isLoading: false});
          // console.log("myres="+JSON.stringify(response))
          console.log('myres=' + JSON.stringify(response));
          if (response.message === 'Rescheduled') {
            this.setState({
              visibleModal: false,
            });
            this.props.navigation.navigate('BookingInfo', {
              data: appointmentdata,
            });
            // Alert.alert(
            //     'Appointment Confirmation',
            //     'Please press "Yes" to confirm appointment',
            //     [
            //         {
            //             text: 'Yes',
            //             onPress: () => this.props.navigation.navigate('BookingInfo',{data:appointmentdata})
            //         }
            //     ]
            // )
          } else {
            this.setState({isLoading: false});
            console.log(response.message);
            Alert.alert(i18n.t('APPOINTMENTS.NOT_BOOKED'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.navigate('Dashboard'),
              },
            ]);
          }
        })
        .catch((error) => {
          this.setState({isLoading: false});
          console.error(error);
        });
    } else if (this.state.apptype.toLowerCase() == 'emergency') {
      console.log('myval=' + this.state.getEncounter.enc_id);
      let url = base_url + 'ical/';

      //     let start1=new Date(this.state.dtime);
      //    let  end=new Date(start1.setMinutes(start1.getMinutes() + 30).toString());
      //    alert(this.state.dtime)
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

      let appointmentdata = JSON.stringify({
        name: this.state.doctorname,
        date: this.state.dtime,
        branchname: this.state.branchname,
        city: this.state.city,
        specialization: this.state.specialization,
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
        healphaId: this.state.hlpid,
        date: moment(get[0]).format('YYYY-MM-DD'),
        sTime: newStart,
        //(this.state.endtime!=undefined&&this.state.endtime!=null&&this.state.endtime!="")?
        // moment(this.state.endtime,"HH:mm:ss").format("HH:mm")
        //:
        eTime: newEnd,
        doctor: this.state.doctorid,
        doc_name: this.state.doctorname,
        // description:this.state.description!==undefined && this.state.description!==""?this.state.description:"appointment with "+this.state.doctorname,
        description: this.state.disc,
        branch_id: this.state.branchid,
        app_type:
          this.state.apptype == 'review appointment'
            ? 'review'
            : this.state.apptype,
        rev_enc:
          this.state.getEncounter.enc_id != undefined
            ? this.state.getEncounter.enc_id
            : '',
      });
      //  alert(this.state.disc)
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
            console.log('qrscan_flg', global.qrscan_flg);
            if (global.qrscan_flg) {
              Alert.alert(
                'Alert',
                'Would you like to make Payment and Checking-in?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      this.props.navigation.navigate('BookingInfo', {
                        data: appointmentdata,
                      });
                    },
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      this.qrscan_success();
                    },
                  },
                ],
              );
            } else {
              global.qrscan_flg = false;
              this.props.navigation.navigate('BookingInfo', {
                data: appointmentdata,
              });
            }

            // Alert.alert(
            //     'Appointment Confirmation',
            //     'Please press "Yes" to confirm appointment',
            //     [
            //         {
            //             text: 'Yes',
            //             onPress: () => this.props.navigation.navigate('BookingInfo',{data:appointmentdata})
            //         }
            //     ]
            // )
          } else {
            this.setState({isLoading: false});
            console.log(response.message);
            Alert.alert(i18n.t('APPOINTMENTS.NOT_BOOKED'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.navigate('Dashboard'),
              },
            ]);
          }
        })
        .catch((error) => {
          this.setState({isLoading: false});
          console.error(error);
        });
    } else {
      console.log('Cherry3');
      if (this.state.checking11) {
        console.log('done check duplicate', Date.now());

        if (
          global.corporate_flag1 != 'yes' &&
          ((this.state.selectedIdtype == 'telemedicine' &&
            this.state.selectedIdtype != undefined) ||
            (this.state.selectedIdtype == 'tele medicine' &&
              this.state.selectedIdtype != undefined) ||
            (this.state.selectedIdtype == 'homecare' &&
              this.state.selectedIdtype != undefined))
        ) {
          console.log('razerpay123');
          if (this.state.price >= 1) {
            let money = global.price * 100;
            const mail = await AsyncStorage.getItem('mail');
            const phone_no = await AsyncStorage.getItem('phone');
            // alert("hi")
            var options = {
              description: 'Credits towards consultation',
              image:
                'https://lh3.googleusercontent.com/bPdq_NfYWHcpSqyIkugcE_QKdr3s_Eo7OmFRZF4RgmDIXfn-spTQXzItBzkjuGGU-fPx=s180-rw',
              currency: 'INR',
              key: this.state.razar_id,
              amount: money,
              name:
                global.salutation +
                ' ' +
                global.fname.replace(/^./, global.fname[0].toUpperCase()) +
                ' ' +
                global.lname,
              prefill: {
                email: mail,
                contact: phone_no,
                name:
                  global.salutation +
                  ' ' +
                  global.fname.replace(/^./, global.fname[0].toUpperCase()) +
                  ' ' +
                  global.lname,
              },
              theme: {color: APP_PRIMARY_COLOR},
            };
            RazorpayCheckout.open(options)
              .then((data) => {
                // handle success
                console.log(`Success: ${data.razorpay_payment_id}`);
                this.razr_successCallback(data);
              })
              .catch((error) => {
                // handle failure
                if (
                  this.state.apptype == 'homecare' ||
                  this.state.apptype == 'telemedicine'
                ) {
                  let simul = base_url + 'semaphore/';
                  let get = moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
                    .format('YYYY-MM-DD HH:mm')
                    .split(' ');
                  // alert("time="+get[0]+" "+get[1]);
                  let start = new Date(get[0]);
                  // alert("start="+get[0]);
                  let gettime = get[1].split(':');

                  start.setHours(gettime[0]);
                  start.setMinutes(gettime[1]);
                  let newStart;
                  // console.log("input="+start+" "+end);
                  if (start.getHours() < 10 && start.getMinutes() < 10) {
                    newStart =
                      '0' + start.getHours() + ':0' + start.getMinutes();
                  } else if (start.getHours() < 10 && start.getMinutes() > 10) {
                    newStart =
                      '0' + start.getHours() + ':' + start.getMinutes();
                  } else if (start.getHours() > 10 && start.getMinutes() < 10) {
                    newStart = start.getHours() + ':0' + start.getMinutes();
                  } else {
                    newStart = start.getHours() + ':' + start.getMinutes();
                  }
                  let simultanious = JSON.stringify({
                    token: global.userToken,
                    hlp_id: this.state.hlpid,
                    doc_id: this.state.doctorid,
                    branid: this.state.branchid,
                    start_time: newStart + ':00',
                    date: moment(get[0]).format('YYYY-MM-DD'),
                    mode: '1',
                  });
                  console.log('Semaphore', simultanious);
                  let response1 = fetch(simul, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: simultanious,
                  })
                    .then((response1) => response1.json())
                    .then((response1) => {
                      console.log('semaphore', response1);
                    });
                }
                Alert.alert(
                  '',
                  'Appointment is not booked because payment is not completed.',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  {cancelable: false},
                );
                this.props.navigation.navigate('Dashboard');
                console.log(`Error: ${error.code} | ${error.description}`);
              });
          } else {
            let data = {};
            data['razorpay_payment_id'] = 'Pay_zero';
            console.log('data1', data);
            this.razr_successCallback(data);
          }
        } else if (
          global.corporate_flag1 == 'yes' &&
          this.state.payment_by == 'employee' &&
          ((this.state.selectedIdtype == 'telemedicine' &&
            this.state.selectedIdtype != undefined) ||
            (this.state.selectedIdtype == 'tele medicine' &&
              this.state.selectedIdtype != undefined) ||
            (this.state.selectedIdtype == 'homecare' &&
              this.state.selectedIdtype != undefined))
        ) {
          if (this.state.price >= 1) {
            console.log('price1', global.price);
            let money = global.price * 100;
            const mail = await AsyncStorage.getItem('mail');
            const phone_no = await AsyncStorage.getItem('phone');
            // alert("hi")
            var options = {
              description: 'Credits towards consultation',
              image:
                'https://lh3.googleusercontent.com/bPdq_NfYWHcpSqyIkugcE_QKdr3s_Eo7OmFRZF4RgmDIXfn-spTQXzItBzkjuGGU-fPx=s180-rw',
              currency: 'INR',
              key: this.state.razar_id,
              amount: money,
              name:
                global.salutation +
                ' ' +
                global.fname.replace(/^./, global.fname[0].toUpperCase()) +
                ' ' +
                global.lname,
              prefill: {
                email: mail,
                contact: phone_no,
                name:
                  global.salutation +
                  ' ' +
                  global.fname.replace(/^./, global.fname[0].toUpperCase()) +
                  ' ' +
                  global.lname,
              },
              theme: {color: APP_PRIMARY_COLOR},
            };
            RazorpayCheckout.open(options)
              .then((data) => {
                // handle success
                console.log(`Success: ${data.razorpay_payment_id}`);
                this.razr_successCallback(data);
              })
              .catch((error) => {
                // handle failure
                if (
                  this.state.apptype == 'homecare' ||
                  this.state.apptype == 'telemedicine'
                ) {
                  let simul = base_url + 'semaphore/';
                  let get = moment(this.state.dtime, ['YYYY-MM-DD h:mm A'])
                    .format('YYYY-MM-DD HH:mm')
                    .split(' ');
                  // alert("time="+get[0]+" "+get[1]);
                  let start = new Date(get[0]);
                  // alert("start="+get[0]);
                  let gettime = get[1].split(':');

                  start.setHours(gettime[0]);
                  start.setMinutes(gettime[1]);
                  let newStart;
                  // console.log("input="+start+" "+end);
                  if (start.getHours() < 10 && start.getMinutes() < 10) {
                    newStart =
                      '0' + start.getHours() + ':0' + start.getMinutes();
                  } else if (start.getHours() < 10 && start.getMinutes() > 10) {
                    newStart =
                      '0' + start.getHours() + ':' + start.getMinutes();
                  } else if (start.getHours() > 10 && start.getMinutes() < 10) {
                    newStart = start.getHours() + ':0' + start.getMinutes();
                  } else {
                    newStart = start.getHours() + ':' + start.getMinutes();
                  }
                  let simultanious = JSON.stringify({
                    token: global.userToken,
                    hlp_id: this.state.hlpid,
                    doc_id: this.state.doctorid,
                    branid: this.state.branchid,
                    start_time: newStart + ':00',
                    date: moment(get[0]).format('YYYY-MM-DD'),
                    mode: '1',
                  });
                  console.log('Semaphore', simultanious);
                  let response1 = fetch(simul, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: simultanious,
                  })
                    .then((response1) => response1.json())
                    .then((response1) => {
                      console.log('semaphore', response1);
                    });
                }
                Alert.alert(
                  '',
                  'Appointment is not booked because payment is not completed.',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  {cancelable: false},
                );
                this.props.navigation.navigate('Dashboard');
                console.log(`Error: ${error.code} | ${error.description}`);
              });
          } else {
            let data = {};
            data['razorpay_payment_id'] = 'Pay_zero';
            console.log('data1', data);
            this.razr_successCallback(data);
          }
        } else if (
          global.corporate_flag1 == 'yes' &&
          ((this.state.selectedIdtype == 'telemedicine' &&
            this.state.selectedIdtype != undefined) ||
            (this.state.selectedIdtype == 'tele medicine' &&
              this.state.selectedIdtype != undefined) ||
            (this.state.selectedIdtype == 'homecare' &&
              this.state.selectedIdtype != undefined))
        ) {
          let data = '';
          this.razr_successCallback(data);
        } else {
          console.log('myval=' + this.state.getEncounter.enc_id);
          let url = base_url + 'ical/';

          //     let start1=new Date(this.state.dtime);
          //    let  end=new Date(start1.setMinutes(start1.getMinutes() + 30).toString());
          //    alert(this.state.dtime)
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

          let appointmentdata = JSON.stringify({
            name: this.state.doctorname,
            date: this.state.dtime,
            branchname: this.state.branchname,
            city: this.state.city,
            specialization: this.state.specialization,
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
            healphaId: this.state.hlpid,
            date: moment(get[0]).format('YYYY-MM-DD'),
            sTime: newStart,
            //(this.state.endtime!=undefined&&this.state.endtime!=null&&this.state.endtime!="")?
            // moment(this.state.endtime,"HH:mm:ss").format("HH:mm")
            //:
            eTime: newEnd,
            doctor: this.state.doctorid,
            doc_name: this.state.doctorname,
            // description:this.state.description!==undefined && this.state.description!==""?this.state.description:"appointment with "+this.state.doctorname,
            description: this.state.disc,
            branch_id: this.state.branchid,
            app_type:
              this.state.apptype == 'review appointment'
                ? 'review'
                : this.state.apptype,
            rev_enc:
              this.state.getEncounter.enc_id != undefined
                ? this.state.getEncounter.enc_id
                : '',
          });
          //  alert(this.state.disc)
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
                console.log('qrscan_flg', global.qrscan_flg);
                if (global.qrscan_flg) {
                  Alert.alert(
                    'Alert',
                    'Would you like to make Payment and Checking-in?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {
                          this.props.navigation.navigate('BookingInfo', {
                            data: appointmentdata,
                          });
                        },
                      },
                      {
                        text: 'Yes',
                        onPress: () => {
                          this.qrscan_success();
                        },
                      },
                    ],
                  );
                } else {
                  global.qrscan_flg = false;
                  this.props.navigation.navigate('BookingInfo', {
                    data: appointmentdata,
                  });
                  // if(global.corporate_flag1=="yes"){
                  //     console.log("1111");
                  //     let ob1= JSON.stringify({
                  //         "token":global.userToken,
                  //         "gen_price":this.state.price,
                  //         "hlpid":this.state.hlpid,
                  //         "doc_id":this.state.doctorid,
                  //         "doc_name":this.state.doctorname,
                  //         "branch_id":this.state.branchid,
                  //         "date_sel":moment(get[0]).format('YYYY-MM-DD'),
                  //         "start_time":newStart+":00",
                  //         "username":global.fname+" "+global.lname,
                  //         "app_type":this.state.apptype=="homecare"?"homecare":"telemedicine"
                  //     })
                  //     this.props.navigation.navigate('BookingInfo',{data:appointmentdata,corporatedata:ob1})
                  // }
                  // else{
                  this.props.navigation.navigate('BookingInfo', {
                    data: appointmentdata,
                  });
                  // }
                  // Alert.alert(
                  //     'Appointment Confirmation',
                  //     'Please press "Yes" to confirm appointment',
                  //     [
                  //         {
                  //             text: 'Yes',
                  //             onPress: () => this.props.navigation.navigate('BookingInfo',{data:appointmentdata})
                  //         }
                  //     ]
                  // )
                }
              } else {
                this.setState({isLoading: false});
                console.log(response.message);
                Alert.alert(i18n.t('APPOINTMENTS.NOT_BOOKED'), '', [
                  {
                    text: i18n.t('COMMON.OK'),
                    onPress: () => this.props.navigation.navigate('Dashboard'),
                  },
                ]);
              }
            })
            .catch((error) => {
              this.setState({isLoading: false});
              console.error(error);
            });
        }
      }
    }
  };

  employer = async () => {
    let ob = JSON.stringify({
      hlp_id: global.hlpid,
      branch_id: this.state.branchid,
    });
    console.log(ob);
    let getdataurl = base_url + 'get_payment_by_flag/';
    fetch(getdataurl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ob,
    })
      .then((response) => response.json())
      .then(async (response) => {
        this.setState({payment_by: response.message.payment_by});
      });
  };

  qrscan_success = async () => {
    global.qrscan_flg = false;
    let ob = JSON.stringify({
      passingdate: this.state.today_date,
      hlp: global.hlpid,
      branch_id: this.state.branchid,
    });
    console.log(ob);
    let getdataurl = base_url + 'get_apptdet_by_brhid/';
    fetch(getdataurl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ob,
    })
      .then((response) => response.json())
      .then(async (response) => {
        console.log('validate_person_summary_res=' + JSON.stringify(response));
        if (response.message && response.message != '') {
          console.log(response.message);
          let newdata = response.message.filter((item) => {
            return item.appointment_status == 'Appointment Booked';
          });
          console.log(newdata);
          if (newdata != '') {
            this.setState({
              apptype: newdata[0]['appointment_type'],
              doctorname: newdata[0]['doc_name'],
              doctorid: newdata[0]['uid'].split(':')[2],
              app_date: newdata[0]['uid'].split(':')[1],
              start_time: newdata[0]['date_start'].split(' ')[1],
              end_time: newdata[0]['date_end'].split(' ')[1],
            });

            this.get_docprice(
              newdata[0]['uid'],
              newdata[0]['appointment_type'],
              this.state.branchid,
            );
          } else {
            Alert.alert(i18n.t('APPOINTMENTS.NOT_BOOKED'), '', [
              {
                text: i18n.t('COMMON.OK'),
                onPress: () => this.props.navigation.navigate('MyAppointment'),
              },
            ]);
          }
        }
      });
  };

  get_docprice = async (uid, appt_type, brnid) => {
    let doctorid = uid.split('&');
    let url = base_url + 'doctor_details_by_id';

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doctor_id: doctorid[2],
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('doctor_details_by_id', response);
        if (response) {
          this.setState({mail: response.doc_details[0].email});
          for (let i = 0; i < response.doc_price_list.length; i++) {
            if (response.doc_price_list[i].branch_id == brnid) {
              this.setState({doc_price1: response.doc_price_list[i]});
              if (appt_type == 'review') {
                this.setState({doc_price: this.state.doc_price1.review});
              } else if (appt_type == 'emergency') {
                this.setState({
                  doc_price: this.state.doc_price1.emergency_price,
                });
              } else {
                this.setState({doc_price: this.state.doc_price1.general_price});
              }
              console.log(this.state.doc_price + 'general');
            }
          }
          console.log('call razerpay qrscan', Date.now());
          this.razr_successCallback_qrscan();
          console.log('end razerpay qrscan', Date.now());
        } else {
          console.log('call razerpay qrscan', Date.now());
          this.razr_successCallback_qrscan();
          console.log('end razerpay qrscan', Date.now());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  discount_amount = async () => {
    let url = base_url + 'get_consultation_discounted_amount';

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hlp_id: global.hlpid,
        branch_id: this.state.branchid,
        amount: this.state.price,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('price', response.message);
        global.price = response.message;
      })
      .catch((error) => {
        console.error(error);
      });
  };
  razr_successCallback_qrscan = async () => {
    if (this.state.doc_price >= 1) {
      //razar_pay
      let money;
      console.log('price1', global.price);

      if (this.state.doc_price != '') {
        money = global.price * 100;
      } else {
        money = 100;
      }
      console.log('price1', global.price);

      const mail = await AsyncStorage.getItem('mail');
      const phone_no = await AsyncStorage.getItem('phone');
      var options = {
        description: 'Credits towards consultation',
        image:
          'https://lh3.googleusercontent.com/bPdq_NfYWHcpSqyIkugcE_QKdr3s_Eo7OmFRZF4RgmDIXfn-spTQXzItBzkjuGGU-fPx=s180-rw',
        currency: 'INR',
        key: this.state.razar_id,
        amount: money,
        name:
          global.salutation +
          ' ' +
          global.fname.replace(/^./, global.fname[0].toUpperCase()) +
          ' ' +
          global.lname,
        prefill: {
          email: mail,
          contact: phone_no,
          name:
            global.salutation +
            ' ' +
            global.fname.replace(/^./, global.fname[0].toUpperCase()) +
            ' ' +
            global.lname,
        },
        theme: {color: APP_PRIMARY_COLOR},
      };
      console.log('call razerpay', Date.now());
      RazorpayCheckout.open(options)
        .then((data) => {
          // handle success
          console.log(`Success: ${data.razorpay_payment_id}`);
          alert('Payment is Completed!');
          console.log('end razerpay', Date.now());
          this.changests_billing(data);
        })
        .catch((error) => {
          // handle failure

          Alert.alert(
            '',
            'Payment is not completed.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          //this.props.navigation.navigate("Dashboard")
          console.log(`Error: ${error.code} | ${error.description}`);
        });
    } else {
      let data = {};
      data['razorpay_payment_id'] = 'Pay_zero';
      this.changests_billing(data);
    }
  };

  changests_billing = async (data) => {
    console.log('call razerpay save', Date.now());
    let ocv = JSON.stringify({
      token: global.userToken,
      hlpid: global.hlpid,
      razer_id: data.razorpay_payment_id,
      payer_name:
        global.salutation +
        ' ' +
        global.fname.replace(/^./, global.fname[0].toUpperCase()) +
        ' ' +
        global.lname,
      purpose: 'telemedicine',
      role_type: global.roletype,
      user_name:
        global.fname.replace(/^./, global.fname[0].toUpperCase()) +
        ' ' +
        global.lname,
      gen_price: this.state.doc_price != '' ? this.state.doc_price : '',
      app_type: this.state.apptype != '' ? this.state.apptype : 'telemedicine',
      doc_name: this.state.doctorname != '' ? this.state.doctorname : '',
      doc_id: this.state.doctorid != '' ? this.state.doctorid : '',
      brn_id: this.state.branchid != '' ? this.state.branchid : '',
      start_time: this.state.start_time != '' ? this.state.start_time : '',
      chief: '',
      end_time: this.state.end_time != '' ? this.state.end_time : '',
      email: this.state.mail,
      app_date: this.state.app_date != '' ? this.state.app_date : '',
      nh_id: '',
      corporate_flag: 0,
      qrcode_flg: 1,
      payment_by: this.state.payment_by,
    });
    console.log(Date.now(), ocv);
    let url = base_url + 'razerpay_save_qrcode/';
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ocv,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('ejf' + Date.now() + response);
        if (
          response.message != 'Appointment Already Booked' &&
          response.message != 'Doctor is not Available at that Time' &&
          response.message != 'Appointment time is not Available' &&
          response.message != '0' &&
          response.message != '1' &&
          response.message != '2' &&
          response.message != 'You have selected past slot time'
        ) {
          this.props.navigation.navigate('ViewPdfScreen2', {
            link: base_url + '/' + response.message,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  personList = async () => {
    let getdataurl = base_url + 'user_data/';
    let response = await fetch(getdataurl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email:
          typeof this.state.emaildata === 'string' ? this.state.emaildata : '',
      }),
    })
      .then((res) => res.json())
      .then((json) => json)

      .catch((error) => {
        console.error(error);
      });

    console.log('length=' + response.message);
    if (response.message === 0) {
      this.loginAlert.showMessage({
        message: 'You Have Entered Incorrect Details',
        description: 'Please Enter Valid User Credentials',
        type: 'warning',
        autoHide: false,
        icon: 'auto',
      });
    } else {
      this.setState({personlist: response.message});
      this.setState({gotvalue: response.message[0]['hlpid']});
      console.log('h=' + JSON.stringify(response.message));
    }
  };

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.deviceRegistration();
    } else {
      this.requestPermission();
    }
  }
  async requestPermission() {
    try {
      authStatus = await firebase.messaging().requestPermission();
      console.log('permission granted');
      // User has authorised
      this.deviceRegistration();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  deviceRegistration = async () => {
    try {
      const enabled = await firebase.messaging().hasPermission();
      // const enabled =
      // authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      // authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        await firebase.messaging().requestPermission();
      }
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        this.setState({regToken: fcmToken});
        console.log('token=' + fcmToken + ' enabled=' + enabled);
        await AsyncStorage.setItem('deviceRegID', fcmToken);
      } else {
        // user doesn't have a device token yet
        console.log('Not Found');
      }
      console.log('firebase token=' + fcmToken);
      return fcmToken;
    } catch (error) {
      console.warn('notification token error', error);
    }
  };

  login = async () => {
    if (this.state.disc == undefined) {
      this.setState({
        show: true,
      });
    } else {
      console.log('hlpid=' + this.state.gotvalue);
      console.log('password=' + this.state.pass);
      if (this.state.gotvalue === 0 || this.state.gotvalue === 'undefined') {
        this.loginAlert.showMessage({
          message: 'Alert!',
          description: 'Please select a user',
          type: 'warning',
          icon: 'auto',
        });
      } else {
        if (typeof this.state.pass === 'undefined' || this.state.pass === '') {
          this.loginAlert.showMessage({
            message: 'Unable to login!',
            description: 'Please enter the password',
            type: 'warning',
            icon: 'auto',
          });
        } else {
          this.setState({error: '', loading: true});
          let url = base_url + 'validate_mobile1_login/';
          let bodyob = JSON.stringify({
            hlp: this.state.gotvalue,
            password: this.state.pass,
          });
          console.log(bodyob);
          console.log(url);
          await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: bodyob,
          })
            .then((response) => response.json())
            .then((response) => {
              console.log('test', response.message);
              if (response.message === 'Success') {
                this.getData(response);

                this.checkPermission();
                this.healphabook_appointment();
                this.setState({error: '', loading: false});
                this.loginAlert.showMessage({
                  message: 'Authentication Done!',
                  description: 'You have successfully logged in.',
                  type: 'success',
                  icon: 'auto',
                });
                // console.log('from signin',response.role_data[0].role_type)
              } else if (response.message == 'Password is Incorrect') {
                this.setState({error: '', loading: false});
                this.loginAlert.showMessage({
                  message: 'Authentication Failed',
                  description: 'Please enter correct password',
                  type: 'danger',
                  icon: 'auto',
                });
              } else if (response.message == 'Your Account is not active') {
                this.setState({error: '', loading: false});
                this.loginAlert.showMessage({
                  message: 'Your Account is not active',
                  description: 'Please activate your account',
                  type: 'danger',
                  icon: 'auto',
                });
              } else if (response.message == 'Your Plan is expired') {
                this.setState({error: '', loading: false});
                this.loginAlert.showMessage({
                  message: 'Your Plan is expired',
                  description: 'Please extend your plan to login',
                  type: 'danger',
                  icon: 'auto',
                });
              } else {
                this.setState({error: '', loading: false});
                this.loginAlert.showMessage({
                  message: 'Authentication Failed',
                  description: 'Please enter correct details',
                  type: 'danger',
                  icon: 'auto',
                });
              }
            })
            .catch((error) => {
              console.error(error);
              this.loginAlert.showMessage({
                message: 'Something Went Wrong',
                description: 'Please Contact Healpha Helpdesk',
                type: 'danger',
                icon: 'auto',
                autoHide: false,
              });
              this.setState({error: '', loading: false});
              // console.error(error);
            });
        }
      }
    }
  };

  getData = async (res) => {
    //  alert(res.token)
    await AsyncStorage.setItem('userToken', res.token.toString());
    await AsyncStorage.setItem('hlpid', res.hlpId.toString());
    await AsyncStorage.setItem(
      'roletype',
      res.role_data[0].role_type.toString(),
    );
    await AsyncStorage.setItem('phone', res.role_data[0].phone_no.toString());
    await AsyncStorage.setItem(
      'school',
      res.role_data.person_person_type != ''
        ? JSON.stringify(res.role_data.person_person_type)
        : '',
    );
    await AsyncStorage.setItem(
      'haj',
      res.role_data.person_haj_type != ''
        ? JSON.stringify(res.role_data.person_haj_type)
        : '',
    );
    await AsyncStorage.setItem('birth_date', res.user_details.dob.toString());
    await AsyncStorage.setItem('gender', res.user_details.gender.toString());
  };

  render() {
    const {t} = this.props;
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
    const {docName, docAddress, inputStyle, iconStyle} = Styles;

    let uri =
      this.state.imagepath.trim() != ''
        ? {uri: getApiUrl() + '/' + this.state.imagepath.trim()}
        : require('../../assets/img/doc2.png');
    return (
      // <Container>
      //   <Content>
      //     <Card>
      //       <CardItem>
      //         <Body>
      //           <Row>
      //             <Col size={15}>
      //               <Thumbnail small source={uri} />
      //             </Col>
      //             <Col size={85}>
      //               <Text style={docName}>
      //                 {'Dr.' +
      //                   this.state.doctorname +
      //                   '(' +
      //                   this.state.specialization +
      //                   ')'}
      //               </Text>
      //               <Text style={docAddress}>
      //                 {this.state.branchname + ',' + this.state.city}
      //               </Text>
      //             </Col>
      //           </Row>
      //         </Body>
      //       </CardItem>
      //     </Card>
      //     <Card>
      //       <CardItem>
      //         <Body>
      //           <Row>
      //             <Col size={10}>
      //               <Icon style={iconStyle} active name="md-time" />
      //             </Col>
      //             <Col size={90}>
      //               <Row>
      //                 <Text style={{fontSize: 12}}>Date and Time</Text>
      //               </Row>
      //               <Row>
      //                 <Text style={{color: '#a9abad', fontSize: 13}}>
      //                   {this.state.dtime}
      //                 </Text>
      //                 <Text
      //                   style={{
      //                     color: '#a9abad',
      //                     fontSize: 10,
      //                     marginTop: 3,
      //                     marginLeft: 5,
      //                   }}>
      //                   {'in ' + timedata}
      //                 </Text>
      //               </Row>
      //             </Col>
      //           </Row>
      //         </Body>
      //       </CardItem>
      //     </Card>
      //     <Card>
      //       <CardItem>
      //         <Body>
      //           <Item>
      //             <Icon style={iconStyle} active name="md-copy" />
      //             <Input
      //               style={inputStyle}
      //               placeholder="Complaint"
      //               value={this.state.disc}
      //               onChangeText={text => this.setState({disc: text})}
      //             />
      //           </Item>
      //           {this.state.show ? (
      //             <Text style={{fontSize: 10, color: 'red', marginLeft: 10}}>
      //               Please Fill Description
      //             </Text>
      //           ) : null}
      //         </Body>
      //       </CardItem>
      //     </Card>
      //   </Content>
      //   <Content>
      //     {global.userToken == undefined &&
      //       this.props.navigation.state.params.healphauser == 'yes' && (
      //         <View style={Styles.formContainer}>
      //           {/* <Text style={Styles.buttonText2} >Login</Text> */}
      //           <Row>
      //             <Col size={80}>
      //               <TextInput
      //                 placeholder="Email or Healpha ID"
      //                 placeholderTextColor={'#2D323C'}
      //                 returnKeyType="done"
      //                 keyboardType="email-address"
      //                 autoCapitalize="none"
      //                 autoCorrect={false}
      //                 style={Styles.input}
      //                 onChangeText={text => {
      //                   text === '' && this.setState({personlist: []});
      //                   this.setState({emaildata: text});
      //                 }}
      //               />
      //             </Col>
      //             <Col size={20}>
      //               <Button
      //                 style={{
      //                   backgroundColor: APP_PRIMARY_COLOR,
      //                   alignSelf: 'center',
      //                 }}
      //                 //  onPress={this.book.bind(this)}
      //                 onPress={this.checkentereddata}>
      //                 <Icon style={iconStyle} active name="md-arrow-forward" />
      //               </Button>
      //             </Col>
      //           </Row>

      //           {this.state.personlist.length > 0 && (
      //             <View>
      //               <Picker
      //                 selectedValue={this.state.gotvalue}
      //                 style={Styles.pickerStyle}
      //                 onValueChange={(itemValue, itemIndex) =>
      //                   this.setState({gotvalue: itemValue})
      //                 }>
      //                 {/* <Picker.Item key={'unselectable'} label={"Please select the user"} value={0}/> */}
      //                 {this.state.personlist.map((item, key) => (
      //                   <Picker.Item
      //                     label={item.first_name}
      //                     value={item.hlpid}
      //                     key={key}
      //                   />
      //                 ))}
      //               </Picker>

      //               <TextInput
      //                 placeholder="Password"
      //                 placeholderTextColor={'#2D323C'}
      //                 returnKeyType="go"
      //                 secureTextEntry
      //                 style={Styles.input}
      //                 ref={input => (this.passwordInput = input)}
      //                 onChangeText={text => this.setState({pass: text})}
      //               />
      //               <TouchableOpacity
      //                 style={Styles.buttonContainer}
      //                 onPress={this.login}>
      //                 <Text style={Styles.buttonText}>Log in</Text>
      //               </TouchableOpacity>
      //             </View>
      //           )}

      //           <TouchableOpacity
      //             onPress={() =>
      //               this.props.navigation.navigate('ForgotPassword')
      //             }>
      //             <Text style={{textAlign: 'center', color: '#4F575C'}}>
      //               Forgot Password
      //             </Text>
      //           </TouchableOpacity>
      //         </View>
      //       )}
      //     {global.userToken == undefined &&
      //       this.props.navigation.state.params.healphauser == 'no' && (
      //         <View style={Styles.formContainer}>
      //           <Item>
      //             <Icon style={iconStyle} active name="person" />
      //             <Input
      //               style={inputStyle}
      //               placeholder="First Name"
      //               value={this.state.first_name}
      //               onChangeText={text =>
      //                 this.setState({first_name: text, error1: ''})
      //               }
      //             />
      //           </Item>
      //           {this.state.error1 != '' && (
      //             <Text style={{color: 'red'}}>{'* ' + this.state.error1}</Text>
      //           )}
      //           <Item>
      //             <Icon style={iconStyle} active name="person" />
      //             <Input
      //               style={inputStyle}
      //               placeholder="Last Name"
      //               value={this.state.last_name}
      //               onChangeText={text =>
      //                 this.setState({last_name: text, error2: ''})
      //               }
      //             />
      //           </Item>
      //           {this.state.error2 != '' && (
      //             <Text style={{color: 'red'}}>{'* ' + this.state.error2}</Text>
      //           )}
      //           <Item>
      //             <Icon style={iconStyle} active name="mail" />
      //             <Input
      //               style={inputStyle}
      //               placeholder="Email"
      //               value={this.state.emaildata}
      //               onChangeText={text =>
      //                 this.setState({emaildata: text, error3: ''})
      //               }
      //             />
      //           </Item>
      //           {this.state.error3 != '' && (
      //             <Text style={{color: 'red'}}>{'* ' + this.state.error3}</Text>
      //           )}
      //           <Item>
      //             <Icon style={iconStyle} active name="call" />
      //             <Input
      //               style={inputStyle}
      //               placeholder="Number"
      //               value={this.state.phno}
      //               keyboardType="numeric"
      //               maxLength={13}
      //               onChangeText={text =>
      //                 this.setState({phno: text, error4: ''})
      //               }
      //             />
      //           </Item>
      //           {this.state.error4 != '' && (
      //             <Text style={{color: 'red'}}>{'* ' + this.state.error4}</Text>
      //           )}
      //           {this.state.otpsent && (
      //             <Item>
      //               <Input
      //                 style={inputStyle}
      //                 placeholder="Enter OTP"
      //                 value={this.state.otpvalue}
      //                 keyboardType="numeric"
      //                 maxLength={10}
      //                 onChangeText={text => this.setState({otpvalue: text})}
      //               />
      //             </Item>
      //           )}
      //           <Row>
      //             <Col size={this.state.otpsent ? 50 : 80}>
      //               <Button
      //                 style={{
      //                   backgroundColor: APP_PRIMARY_COLOR,
      //                   marginTop: 10,
      //                   alignSelf: 'center',
      //                 }}
      //                 //  onPress={this.book.bind(this)}
      //                 onPress={this.askOTP}>
      //                 <Text style={{color: 'white'}}>
      //                   {!this.state.otpsent ? 'Generate OTP' : 'RESEND OTP'}
      //                 </Text>
      //               </Button>
      //             </Col>
      //             <Col size={this.state.otpsent ? 50 : 20}>
      //               {this.state.otpsent && (
      //                 <Button
      //                   style={{
      //                     backgroundColor: APP_PRIMARY_COLOR,
      //                     marginTop: 10,
      //                     alignSelf: 'center',
      //                   }}
      //                   //  onPress={this.book.bind(this)}
      //                   onPress={this.checkOTP}>
      //                   <Text>Book Appointment</Text>
      //                 </Button>
      //               )}
      //             </Col>
      //           </Row>
      //         </View>
      //       )}
      //   </Content>
      //   {global.userToken != undefined && (
      //     <Footer>
      //       <FooterTab>
      //         <Button
      //           style={{backgroundColor: APP_PRIMARY_COLOR}}
      //           //  onPress={this.book.bind(this)}
      //           onPress={this.askConfirmation}>
      //           <Text style={{color: 'white'}}>Confirm</Text>
      //         </Button>
      //       </FooterTab>
      //     </Footer>
      //   )}
      //   <FlashMessage position="top" ref={ref => (this.loginAlert = ref)} />
      // </Container>

      <Modal
        style={Styles.modal}
        isVisible={this.state.visibleModal}
        //onBackdropPress={this.hideModal}
        onBackdropPress={() => this.props.navigation.goBack()}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}>
          <View style={{marginLeft: 16, marginRight: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
                borderBottomWidth: 0.25,
                borderColor: LIST_SUB_TEXT_COLOR,
                alignItems: 'flex-start',
              }}>
              <View>
                <Text style={Styles.modalHeaderText}>
                  {i18n.t('APPOINTMENT_CONFIRM.CONFIRM_APPOINTMENT')}
                </Text>
                <Text style={Styles.modalHeaderSubText}>
                  {i18n.t('APPOINTMENT_CONFIRM.CHECK_DETAILS')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon
                  name="close"
                  type="AntDesign"
                  color={APP_PRIMARY_COLOR}
                  //containerStyle={{marginTop: 20}}
                  ///onPress={this.hideModal}

                  onPress={() => this.props.navigation.goBack()}
                  style={Styles.iconStyle}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text style={Styles.modalHeaderText}>
                  {this.state.doctorname}
                </Text>
                <Text style={Styles.modalHeaderSubText}>
                  {this.state.specialization}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={Styles.branchicon}
                    source={require('../../assets/images/hospital_clinic.png')}
                    // ../../assets/images/contact_hospital_white.png
                  />
                  <Text style={Styles.modalHeaderSubText}>
                    {this.state.branchname + ',' + this.state.city}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text style={Styles.modalSubText}>
                {i18n.t('APPOINTMENT_CONFIRM.APPOINTMENT_TYPE')}
              </Text>
              <Text style={Styles.modalHeaderSubText}>
                {this.state.apptype}
              </Text>
            </View>

            <View>
              <Text style={Styles.modalSubText}>
                {i18n.t('APPOINTMENT_CONFIRM.APPOINTMENT_DATE_TIME')}
              </Text>
              <Text style={Styles.modalHeaderSubText}>
                {/* {moment(this.state.dtime).format('YYYY/MM/DD, h:mm:ss a')} */}
                {this.state.dtime}
              </Text>
            </View>

            <View>
              {/* <Input
              style={inputStyle}
              placeholder="Complaints"
              value={this.state.disc}
              onChangeText={text => this.setState({disc: text})}
            /> */}
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: DEFAULT_LIGHT_GREY_COLOR,
                }}
                placeholder={i18n.t('APPOINTMENTS.COMPLAINTS')}
                value={this.state.disc}
                onChangeText={(text) => this.setState({disc: text})}
              />
            </View>

            <Button
              full
              onPress={this.askConfirmation}
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                //marginTop: 20,
                //alignSelf: 'center',
                //width: 100,
                bottom: 0,
                marginTop: 20,
              }}>
              <Text style={{color: 'white', marginLeft: 20, fontSize: 14}}>
                {i18n.t('APPOINTMENT_CONFIRM.CONFIRM_BUTTON_TEXT')}
              </Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}
////withTranslation()(Confirmation)

export {ConfirmationNew};

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
  modal: {
    margin: 0,
    backgroundColor: 'white',
    //height: '30%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //flex: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    //justifyContent: 'center',
    //alignItems: 'center',
    // height: '80%',
    padding: 10,
  },
  modalHeaderText: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontFamily: 'NunitoSans-SemiBold',
    marginVertical: 5,
  },
  modalHeaderSubText: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: 13,
    fontFamily: 'NunitoSans-Regular',
    marginVertical: 5,
  },
  modalSubText: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: 16,
    fontFamily: 'NunitoSans-Regular',
    marginVertical: 5,
  },
  textModalone: {
    color: LIST_SUB_TEXT_COLOR,
    fontSize: 16,
    fontFamily: 'NunitoSans-Regular',
    marginVertical: 5,
  },
  branchicon: {
    width: 14,
    height: 14,
  },
  bottomView: {
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
};
