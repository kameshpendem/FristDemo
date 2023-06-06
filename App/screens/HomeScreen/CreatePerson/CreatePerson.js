import React, {Component} from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import FlashMessage from 'react-native-flash-message';
import {getPostList} from '../../../redux/actions/post_action';
import {connect} from 'react-redux';
import moment from 'moment';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import {NavigationEvents} from 'react-navigation';
import PhoneInput from 'react-native-phone-input';
import AsyncStorage from '@react-native-community/async-storage';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import FileSelector from '../../../components/fileselector/FileSelector';

import {
  Row,
  Col,
  Button,
  Label,
  Container,
  Content,
  Icon,
} from 'native-base';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import getBaseUrl, {getApiUrl} from '../../../config/Config';
import i18n from '../../../../i18n';
import {Picker} from '@react-native-picker/picker';

let path1;
class CreatePerson extends Component {
  constructor(props) {
    super(props);
    global.emailIdValidate = true;
    global.phoneNumberValidate = true;
    global.phone = this.props.navigation.state.params.phone_no;
    let dat_val = new Date();
    this.state = {
      first_name: this.props.navigation.state.params.first_name,
      last_name: this.props.navigation.state.params.last_name,
      temp_to_perm: this.props.navigation.state.params.temp_to_perm,
      uid_temp: this.props.navigation.state.params.uid_temp,
      phone_no: this.props.navigation.state.params.phone_no,
      email: this.props.navigation.state.params.email,
      branchid: this.props.navigation.state.params.branchid,
      chosenDate: moment(dat_val).format('DD-MMM-YYYY'),
      personImage: '',
      refresh: false,
      phoneemptyvalidate: false,
      phonemorethanvalidate: false,
      firstNameValidate: true,
      middleNameValidate: true,
      lastNameValidate: true,
      fatherNameValidate: true,
      salutation: 'Mr',
      father_name: '',
      otpsent: false,
      phonecode: global.phonecode,
      tempper_val_cng: false,
      email: '',
      idtype_val: [],
      idtype_numberValidate: true,
      newDatePicker: new Date(),
      chosenDate: new Date(),
      uploadImage: '',
    };
    this.setDate = this.setDate.bind(this);
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile = async (file) => {
    const path = file.path;
    let path_val;
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
        .then(({path, uri}) => {
          this.setState({path});
          path1 = path;
          let source;
          source = {path: path1};
          if (path1.split('.')[1] == 'pdf') {
            this.setState({pdfpath: path1});
          } else {
            var RandomNumber = Math.floor(1000 + Math.random() * 9000);
            let p = [
              {
                name: 'image',
                filename: 'image.jpg',
                type: 'image/jpg',
                // data: RNFetchBlob.wrap(path1),
                data: RNFetchBlob.wrap(uri),

                // response.data
              },
              {
                name: 'image_tag',
                data: RandomNumber + '.jpeg',
              },
            ];
            RNFetchBlob.fetch(
              'POST',
              getBaseUrl() + 'upload_image',
              {
                Authorization: 'Bearer access-token',
                otherHeader: 'foo',
                'Content-Type': 'multipart/form-data',
              },
              p,
            )
              .then((response) => response.json())

              .then((resp) => {
                this.state.personImage = uri;
                this.setImageData(resp.message.toString());
                Alert.alert(i18n.t('PERSON_REGISTRATION.ALERT'),i18n.t('PERSON_REGISTRATION.IMAGE_UPLOADED') );
              })
              .catch((err) => {
                Alert.alert(i18n.t('PERSON_REGISTRATION.ALERT'),i18n.t('PERSON_REGISTRATION.IMAGE_NOT_UPLOADED'));
              });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  setImage = () => {
    this.fileSelRef.current.openPicker();
  };

  convertPDF = async () => {
    // this.refs.loading.show();
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: global.doctor_id + '.pdf',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 800,
          height: 1056,
        },
        quality: 0.4, // optional compression paramter
      };
      this.setState({mulImg: []});
      alert(i18n.t('PERSON_REGISTRATION.FILE_UPLOADED'));
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({pdfpath: pdf.filePath});
    } catch (e) {
      console.log(e);
    }
  };
  setDate(newDate) {
    let dateNew = newDate.toString();
    this.setState({chosenDate: dateNew});
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]).then((granted) => {
          Object.entries(granted).map(([key, value]) => {
            console.log('consoleee' + key, value);
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    this.setStandAlone();
    this.get_tdtype();
    this.setImageData();
  }
  setStandAlone = async () => {
    let newdata = this.props.postList.pract_details.filter((item) => {
      return item.branch_id == this.state.branchid;
    });
    // // alert(newdata[0].op_branch_work_timings[0].standalone)
    this.setState({
      sa_branch_id: newdata[0].branch_id,
      sa_branch_name: newdata[0].branch_name,
      sa_prac_id: newdata[0].practice_id,
      sa_prac_name: newdata[0].practice_name,
      stand: newdata[0].op_branch_work_timings[0].standalone,
      sa_slot_timing: newdata[0].slot_timing,
      sa_visit_hours_time: newdata[0].visit_hours_time,
      sa_specialization: newdata[0].specialization,
    });
  };

  get_tdtype = async () => {
    let url = getBaseUrl() + 'get_idtype_name/';
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message) {
          let newdata = response.message.filter((item) => {
            return item.IDtype != 'No ID';
          });
          console.log(newdata);
          this.setState({
            idtype_val: newdata,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  onValueChangeIdtype = (value) => {
    var idtype_val = value.split(' ');
    this.setState({
      def_idtype_val: idtype_val[0],
      def_idtype_val1: idtype_val[0] ,
      idd_length: idtype_val[1],
      idd_type: idtype_val[2],
    });
  };

  validate = (value) => {
    this.setState({tempper_val_cng: true});
    let email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{1,4})$/;
    if (!email.test(value)) {
      this.setState({email: ''});
      global.emailIdValidate = false;
    } else {
      this.setState({email: value});
      global.emailIdValidate = true;
    }
  };

  onValueChangePhoneNumber(value) {
    this.setState({tempper_val_cng: true});
    if (value.length <= 3) {
      // Alert.alert("Phone number is not empty");
      this.setState({phoneemptyvalidate: true});
      global.phoneNumberValidate = false;
      this.setState({refresh: true});
    } else {
      if (value.length >= 14) {
        global.phone = '';
        this.setState({refresh: true});
        this.setState({phonemorethanvalidate: true});
        console.log(global.phonecode + '  ' + global.phone);
      } else {
        global.phone = value.substring(3, 13);
        global.phonecode = value.substring(0, 3);

        global.phoneNumberValidate = true;
        this.setState({phoneemptyvalidate: false});
        this.setState({phonemorethanvalidate: false});
        this.setState({refresh: true});
      }
    }
  }

  validate_name(text, type) {
    let alph = /^[a-zA-Z\s]+$/;
    let alph1 = /^[a-zA-Z0-9\s]+$/;
    if (type === 'first_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            first_name: text,
          });
          this.setState({firstNameValidate: true});
        } else {
          this.setState({
            first_name: '',
          });
          this.setState({firstNameValidate: false});
        }
      } else {
        this.setState({
          first_name: '',
        });
      }
    } else if (type === 'last_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            last_name: text,
          });
          this.setState({lastNameValidate: true});
        } else {
          this.setState({
            last_name: '',
          });
          this.setState({lastNameValidate: false});
        }
      } else {
        this.setState({
          last_name: '',
        });
      }
    } else if (type === 'middle_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            middle_name: text,
          });
          this.setState({middleNameValidate: true});
        } else {
          this.setState({
            middle_name: '',
          });
          this.setState({middleNameValidate: false});
        }
      } else {
        this.setState({
          middle_name: '',
        });
      }
    } else if (type === 'father_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            father_name: text,
          });
          this.setState({fatherNameValidate: true});
        } else {
          this.setState({
            father_name: '',
          });
          this.setState({fatherNameValidate: false});
        }
      } else {
        this.setState({
          father_name: '',
        });
      }
    } else if (type === 'idtype_number') {
      if (text != '') {
        if (alph1.test(text)) {
          if (text.length <= 14) {
            this.setState({
              idtype_no: text,
            });
            this.setState({idtype_numberValidate: true});
          } else {
            this.setState({
              idtype_no: text.substring(0, 13),
            });
            this.setState({idtype_numberValidate: false});
          }
        } else {
          this.setState({idtype_numberValidate: false});
        }
      } else {
        this.setState({
          idtype_no: '',
        });
      }
    }
  }

  checkOTP = () => {
    if (this.state.otpgotvalue == this.state.otpvalue) {
      this.validateEmailPhone();
    } else {
      alert(i18n.t('PERSON_REGISTRATION.MISMATCHED_OTP'));
    }
  };
  askOTP = async () => {
    let url = getBaseUrl() + 'send_otp/';
    if (this.state.first_name == '') {
      this.setState({error1: i18n.t('PERSON_REGISTRATION.PLEASE_ENTER_FIRST_NAME')});
    } else if (this.state.last_name == '') {
      this.setState({error2: i18n.t('PERSON_REGISTRATION.PLEASE_ENTER_LAST_NAME')});
    }
    // else if(this.state.email==""){
    //     this.setState({error3:"Please Enter Email Id"})
    // }
    else if (global.phone == '+91' || global.phone === '+94') {
      this.setState({error4:i18n.t('PERSON_REGISTRATION.PLEASE_ENTER_PHONE_NO') });
    } else {
      let ob = JSON.stringify({
        email: this.state.email,
        phone: global.phone,
        fname: this.state.first_name,
        lname: this.state.last_name,
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
          // alert(JSON.stringify(response))
          if (response.message == '0') {
            alert(i18n.t('PERSON_REGISTRATION.OTP_NOT_SENT'));
          } else if (response.message == 'OTP not enabled for this instance') {
            alert(i18n.t('PERSON_REGISTRATION.OTP_NOT_ENABLED'));
          } else if (response.message == 'Mail not enabled for this instance') {
            alert(i18n.t('PERSON_REGISTRATION.MAIL_NOT_ENABLED'));
          } else {
            alert(i18n.t('PERSON_REGISTRATION.OTP_SENT_SUCCESSFULLY'));

            this.setState({otpsent: true, otpgotvalue: response.message});
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  goSubmit = async () => {
    const doctorname = await AsyncStorage.getItem('doctorname');
    if (doctorname !== null) {
      this.setState({doctorname: doctorname});
    }
    const salutation = this.state.salutation;
    const first_name = this.state.first_name;
    const last_name = this.state.last_name;
    const father_name = this.state.father_name;
    const blood_group = this.state.blood_group;
    const gender = this.state.gender;
    const dt = this.state.chosenDate;
    const email = this.state.email;
    const phone = global.phone;
    const phonecode = global.phonecode;
    const def_idtype_val = this.state.def_idtype_val;
    const idtype_no = this.state.idtype_no;
    const image_data = this.state.personImage;
    if (!first_name) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_FNAME'));
    } else if (!last_name) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_LNAME'));
    } else if (!blood_group) {
      alert(i18n.t('PERSON_REGISTRATION.BLOOD'));
    } else if (!gender) {
      alert(i18n.t('PERSON_REGISTRATION.GEN_DER'));
    } else if (!dt) {
      alert(i18n.t('PERSON_REGISTRATION.DATE'));
    }
    // else if(!father_name){
    //   alert("Please enter the father's name");
    // }
    // else if(!email){
    //     alert("Please enter the email");
    // }
    else if (!def_idtype_val) {
      alert(i18n.t('PERSON_REGISTRATION.DATE'));
    } else if (!idtype_no) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_ID_TYPE'));
    } else if (!phone) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_ID_NO'));
    } else if (phone.length != 10) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_PHONE_NO'));
    } else if (!phonecode) {
      alert(i18n.t('PERSON_REGISTRATION.PHONE_CODE'));
    }
    // else if(!image_data || image_data == '24'){
    //   alert("Please upload your profile");
    // }
    else {
      //this._handleSubmit();
      //this.validateEmailPhone();
      this.askOTP();
    }
  };
  // state = {user: ''}
  updateUser = (salutation) => {
    this.setState({salutation: salutation});
  };
  state = {blood_group: ''};
  updateUserBlood = (blood_group) => {
    this.setState({blood_group: blood_group});
  };
  state = {gender: ''};
  updateUserGender = (gender) => {
    this.setState({gender: gender});
  };

  validateEmailPhone = async () => {
    let email_id;
    if (this.state.email == '') {
      email_id = 'no';
    } else {
      email_id = this.state.email;
    }
    const doctorname = await AsyncStorage.getItem('doctorname');
    if (doctorname !== null) {
      this.setState({doctorname: doctorname});
    }
    const salutation = this.state.salutation;
    const first_name = this.state.first_name;
    const last_name = this.state.last_name;
    const father_name = this.state.father_name;
    const blood_group = this.state.blood_group;
    const gender = this.state.gender;
    const dt = this.state.chosenDate;
    const email = email_id;
    const phone = global.phone;
    const phonecode = global.phonecode;
    const def_idtype_val = this.state.def_idtype_val;
    const idtype_no = this.state.idtype_no;
    const image_data = this.state.personImage;
    if (!first_name) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_FNAME'));
    } else if (!last_name) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_LNAME'));
    } else if (!blood_group) {
      alert(i18n.t('PERSON_REGISTRATION.BLOOD'));
    } else if (!gender) {
      alert(i18n.t('PERSON_REGISTRATION.GEN_DER'));
    } else if (!dt) {
      alert(i18n.t('PERSON_REGISTRATION.DATE'));
    }
    // else if(!email){
    //     alert("Please enter the email");
    // }
    else if (!def_idtype_val) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_ID_TYPE'));
    } else if (!idtype_no) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_ID_NO'));
    } else if (!phone) {
      alert(i18n.t('PERSON_REGISTRATION.ENTER_PHONE_NO'));
    } else if (phone.length != 10) {
      alert(i18n.t('PERSON_REGISTRATION.NO_LENGTH'));
    } else if (!phonecode) {
      alert(i18n.t('PERSON_REGISTRATION.PHONE_CODE'));
    } else {
      let ob = JSON.stringify({
        phone: global.phone,
        email: email_id,
        healphaId: '',
        edit_flag: '',
      });
      let getdataurl = getBaseUrl() + 'check_duplicate/';
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
          if (response != 1 || response.length > 0) {
            Alert.alert(
              i18n.t('PERSON_REGISTRATION.ALERT'),
              i18n.t('PERSON_REGISTRATION.ANOTHER_WITH_SAME_EMAIL'),
              [
                {
                  text: i18n.t('PERSON_REGISTRATION.YES'),
                  onPress: () => {
                    this.setState({person_data: response}),
                      this.props.navigation.navigate('ValidateEmailPhone', {
                        person_data: this.state.person_data,
                        email: this.state.email,
                        phone: global.phone,
                        first_name: this.state.first_name,
                        middle_name: this.state.middle_name,
                        last_name: this.state.last_name,
                        salutation: this.state.salutation,
                        person_image: this.state.personImage,
                        chosenDate: this.state.chosenDate,
                        phone_code: global.phonecode,
                        blood_group: this.state.blood_group,
                        gender: this.state.gender,
                        temp_to_perm: this.state.temp_to_perm,
                        uid_temp: this.state.uid_temp,
                        brn_id: this.state.sa_branch_id,
                        brn_name: this.state.sa_branch_name,
                        father_name: this.state.father_name,
                        doctor_name: this.state.doctorname,
                        school_name:
                          this.state.sa_prac_id + '-' + this.state.sa_prac_name,
                        branch_id:
                          this.state.sa_branch_id +
                          '-' +
                          this.state.sa_branch_name,
                        id_type: this.state.def_idtype_val,
                        id_number: this.state.idtype_no,
                      });
                  },
                },
                {text: i18n.t('PERSON_REGISTRATION.CANCEL'), onPress: () => console.log('Cancel Pressed!')},
              ],
              {cancelable: true},
            );
            // this.setState({person_data:response});
            // this.props.navigation.navigate('ValidateEmailPhone',{person_data:this.state.person_data,email:this.state.email,phone:global.phone
            //   ,first_name:this.state.first_name,middle_name:this.state.middle_name,last_name:this.state.last_name,salutation:this.state.salutation
            //   ,person_image:this.state.personImage,chosenDate:this.state.chosenDate,phone_code:global.phonecode
            //   ,blood_group:this.state.blood_group,gender:this.state.gender
            //   ,temp_to_perm:this.state.temp_to_perm,uid_temp:this.state.uid_temp
            //   ,brn_id:this.state.sa_branch_id,brn_name:this.state.sa_branch_name
            //   ,father_name:this.state.father_name,doctor_name:this.state.doctorname,school_name:this.state.sa_prac_id+"-"+this.state.sa_prac_name
            // ,branch_id:this.state.sa_branch_id+"-"+this.state.sa_branch_name});
          } else {
            this._handleSubmit();
          }
        });
    }
  };

  _handleSubmit = () => {
    let m_name = this.state.middle_name;
    if (!m_name) {
      m_name = '';
    }
    let temp_to_perm1 = this.state.temp_to_perm;
    if (!temp_to_perm1) {
      temp_to_perm1 = '';
    }
    let uid_temp1 = this.state.uid_temp;
    if (!uid_temp1) {
      uid_temp1 = '';
    }
    let f_name = this.state.father_name;
    if (!f_name) {
      f_name = '';
    }
    const image = this.state.personImage?.uri;

    let ob = JSON.stringify({
      salutation: this.state.salutation,
      // person_image: this.state.personImage,
      person_image: this.state.uploadImage,
      first_name: this.state.first_name,
      middle_name: m_name,
      last_name: this.state.last_name,
      id_type: this.state.def_idtype_val,
      id_number: this.state.idtype_no,
      dob: this.state.chosenDate,
      age: '',
      gender: this.state.gender,
      family_type: '',
      family_size: '',
      alternative_phone_code: '',
      alternative_phone_no: '',
      phone_no: global.phone,
      phone_code: global.phonecode,
      blood_group: this.state.blood_group,
      email: this.state.email,
      password: '',
      p1_salutation: '',
      p1_name: f_name,
      p1_relation: '',
      p1_gender: '',
      p1_phone_code: '',
      p1_phone_no: '',
      p1_email: '',
      p1_blood_group: '',
      p2_salutation: '',
      p2_name: '',
      p2_relation: '',
      p2_gender: '',
      p2_phone_code: '',
      p2_phone_no: '',
      p2_email: '',
      p2_blood_group: '',
      emg_phone_no: '',
      emg_name: '',
      emg_blood_group: '',
      emg_email: '',
      doc_name: '',
      doc_email: '',
      doc_address: '',
      doc_phone_no: '',
      health_monitor: '',
      school_name: this.state.sa_prac_id + '-' + this.state.sa_prac_name,
      branch_id: this.state.sa_branch_id + '-' + this.state.sa_branch_name,
      class_name: '',
      section: '',
      roll_no: '',
      office_name: '',
      branch: '',
      dept: '',
      employee_id: '',
      general: '1',
      paddress1: '',
      paddress2: '',
      landmark: '',
      pcity: '',
      pstate: '',
      pcountry: '',
      ppostal_code: '',
      paddress_of: '',
      p1address1: '',
      p1address2: '',
      p1city: '',
      p1country: '',
      p1state: '',
      p1postal_code: '',
      p1address_of: '',
      p2address1: '',
      p2address2: '',
      p2city: '',
      p2country: '',
      p2state: '',
      p2postal_code: '',
      relation_patient: '',
      rel_name: '',
      rel_hlp: '',
      rel_val: '',
      master_slave: '',
      doctor_name: this.state.doctorname,
      temp_to_perm: temp_to_perm1,
      uid_temp: uid_temp1,
    });
    let getdataurl = getBaseUrl() + 'person_save/';
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
        if (response['message']) {
          alert(response['message']);
        }
        //this.props.navigation.pop(1)
        this.props.navigation.navigate('HomeScreen', {
          branch_id: this.state.sa_branch_id,
          branch_name: this.state.sa_branch_name,
          qr_code_hlp_id: ''
        });
        return response;
      })

      .catch((error) => {
        console.log('error', error);
      });
  };

  setImageData = async (filePath) => {
    if (
      this.state.personImage === null ||
      this.state.personImage === '' ||
      this.state.personImage === undefined
    ) {
      this.state.personImage = require('../../../assets/images/user.png');
    } else {
      let image = this.state.personImage;
      image = image.replace('/usr/share/nginx/html/cihealpha/', '');
      this.state.personImage = {
        uri: image,
      };
    }
    this.setState({refresh: true, uploadImage: getApiUrl() + filePath});
  };
  render() {
    let dt = this.state.chosenDate;
    const {input} = styles;
    return (
      <Container>
        <Content>
          <Row>
            <Col>
              <NavigationEvents onDidFocus={this.setImageData} />

              <FileSelector
                ref={this.fileSelRef}
                onSelection={this.handleSelection}
                selectAny
              />
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => this.setImage()}>
                <Image
                testID="personImage"
                accessibilityLabel="personImage"
                  style={{
                    paddingVertical: 30,
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                  resizeMode="cover"
                  source={this.state.personImage}
                />
              </TouchableOpacity>
            </Col>
          </Row>

          <Row>
            <Col size={40}>
              <Label style={{marginLeft: 30, fontSize: 10, fontWeight: '500'}}
              testID="saluationLabel"
              accessibilityLabel="saluationLabel">
                {i18n.t('PERSON_REGISTRATION.SALUTATION')}<Text style={styles.TextStyle}>*</Text>
              </Label>
              <Picker
              testID="saluationPicker"
              accessibilityLabel="saluationPicker"
                selectedValue={this.state.salutation}
                iosIcon={
                  <Icon2
                    style={{marginRight: 40, top: -5}}
                    name="sort-down"
                    color="#a9a9a9"
                  />
                }
                style={{marginLeft: 15, height: 50, width: 100, marginTop: 0}}
                onValueChange={this.updateUser}>
                <Picker.Item label={i18n.t('PERSON_REGISTRATION.MR')} value="Mr" />
                <Picker.Item label={i18n.t('PERSON_REGISTRATION.MS')} value="Ms" />
                <Picker.Item label={i18n.t('PERSON_REGISTRATION.MRS')} value="Mrs" />
                <Picker.Item label={i18n.t('PERSON_REGISTRATION.MASTER')} value="Master" />
                <Picker.Item label={i18n.t('PERSON_REGISTRATION.BABY')} value="Baby" />
                <Picker.Item label={i18n.t('PERSON_REGISTRATION.BABY_OF')} value="Baby_of" />
                <Picker.Item label={i18n.t('PERSON_REGISTRATION.DR')} value="Dr" />
              </Picker>
              <Icon
                style={{alignSelf: 'flex-end', marginTop: -45, marginRight: 25}}
                name={this.state.icon1}
                size={14}
                onPress={() => this._changeIcon1()}
              />
            </Col>
            {/* <Col size={4}>
    </Col> */}
            <Col size={70}>
              <TextInput
              testID="firstNameTextInput"
              accessibilityLabel="firstNameTextInput"
                allowFontScaling={false}
                placeholder={i18n.t('PERSON_REGISTRATION.FIRST_NAME')}
                placeholderTextColor={'#2D323C'}
                style={[styles.input2]}
                defaultValue={this.state.first_name}
                //onChangeText={(text)=>this.setState({first_name:text})}
                onChangeText={(text) => this.validate_name(text, 'first_name')}
              />
              <Icon
                style={{alignSelf: 'flex-end', marginTop: -45, marginRight: 25}}
                name={this.state.icon1}
                size={14}
                onPress={() => this._changeIcon1()}
              />
              {!this.state.firstNameValidate ? (
                <Text style={{fontSize: 10, fontWeight: '500', color: 'red'}}
                testID="pleaseEnterAlphabetsText"
                accessibilityLabel="pleaseEnterAlphabetsText">
                  {' '}
                  * Please Enter Alphabets{' '}
                </Text>
              ) : null}
            </Col>
          </Row>
          <View style={{padding: 20}}>
            <Row>
              <Col size={48}>
                <TextInput
                testID="middleNameTextInput"
                accessibilityLabel="middleNameTextInput"
                  allowFontScaling={false}
                  placeholder={i18n.t('PERSON_REGISTRATION.MIDDLE_NAME')}
                  placeholderTextColor={'#2D323C'}
                  style={[styles.input1]}
                  //onChangeText={(text)=>this.setState({middle_name:text})}
                  onChangeText={(text) =>
                    this.validate_name(text, 'middle_name')
                  }
                />
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
                {!this.state.middleNameValidate ? (
                  <Text
                  testID="enterAlphabetsText"
                  accessibilityLabel="enterAlphabetsText"
                    style={{
                      fontSize: 10,
                      fontWeight: '500',
                      color: 'red',
                      marginLeft: 20,
                    }}>
                    {' '}
                    * Please Enter Alphabets{' '}
                  </Text>
                ) : null}
              </Col>
              <Col size={4}></Col>
              <Col size={48}>
                <TextInput
                 testID="lastNameTextInput"
                 accessibilityLabel="lastNameTextInput"
                  allowFontScaling={false}
                  placeholder={i18n.t('PERSON_REGISTRATION.LAST_NAME')}
                  placeholderTextColor={'#2D323C'}
                  style={[styles.input2, {marginTop: 10, marginRight: 0}]}
                  defaultValue={this.state.last_name}
                  //onChangeText={(text)=>this.setState({last_name:text})}
                  onChangeText={(text) => this.validate_name(text, 'last_name')}
                />
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
                {!this.state.lastNameValidate ? (
                  <Text style={{fontSize: 10, fontWeight: '500', color: 'red'}}
                  testID="enterAlphabetsText"
                  accessibilityLabel="enterAlphabetsText">
                    {' '}
                    * Please Enter Alphabets{' '}
                  </Text>
                ) : null}
              </Col>
            </Row>
          </View>
          <View style={{padding: 10, paddingRight: 20}}>
            <Row>
              <Col size={25}>
                <Label
                 testID="bloodGroupLabel"
                 accessibilityLabel="bloodGroupLabel"
                  style={{marginLeft: 20, fontSize: 10, fontWeight: '500'}}>
                  {i18n.t('PERSON_REGISTRATION.BLOOD_GROUP')}<Text style={styles.TextStyle}>*</Text>
                </Label>
                <Picker
                 testID="bloodGroupPicker"
                 accessibilityLabel="bloodGroupPicker"
                  selectedValue={this.state.blood_group}
                  iosIcon={
                    <Icon2
                    testID="downIcon2"
                    accessibilityLabel="downIcon2"
                      style={{marginRight: 40, top: -5}}
                      name="sort-down"
                      color="#a9a9a9"
                    />
                  }
                  style={{
                    marginLeft: 15,
                    height: 50,
                    width: '99%',
                    marginTop: 0,
                  }}
                  placeholder={i18n.t('PERSON_REGISTRATION.SELECT')}
                  onValueChange={this.updateUserBlood}>
                  <Picker.Item label={i18n.t('PERSON_REGISTRATION.SELECT')} value="" />
                  <Picker.Item label="O+" value="O pos" />
                  <Picker.Item label="O-" value="O neg" />
                  <Picker.Item label="A+" value="A pos" />
                  <Picker.Item label="A-" value="A pos" />
                  <Picker.Item label="B+" value="B pos" />
                  <Picker.Item label="B-" value="B neg" />
                  <Picker.Item label="OH" value="OH" />
                  <Picker.Item label="AB+" value="AB pos" />
                  <Picker.Item label="AB-" value="AB neg" />
                  <Picker.Item label={i18n.t('PERSON_REGISTRATION.NOT_KNOWN')} value="NOT KNOWN" />
                </Picker>
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
              </Col>
              <Col size={25}>
                <Label
                 testID="genderLabel"
                 accessibilityLabel="genderLabel"
                  style={{marginLeft: 10, fontSize: 10, fontWeight: '500'}}>
                  {i18n.t('PERSON_REGISTRATION.GENDER')}<Text style={styles.TextStyle}>*</Text>
                </Label>
                <Picker
                 testID="genderPicker"
                 accessibilityLabel="genderPicker"
                  selectedValue={this.state.gender}
                  style={{
                    marginLeft: 0,
                    height: 50,
                    width: '99%',
                    marginTop: 0,
                  }}
                  iosIcon={<Icon2 name="sort-down" color="#a9a9a9" />}
                  placeholder={i18n.t('PERSON_REGISTRATION.SELECT')}
                  onValueChange={this.updateUserGender}>
                  <Picker.Item label={i18n.t('PERSON_REGISTRATION.SELECT')} value="" />
                  <Picker.Item label={i18n.t('PERSON_REGISTRATION.MALE')} value="male" />
                  <Picker.Item label={i18n.t('PERSON_REGISTRATION.FEMALE')} value="female" />
                  <Picker.Item label={i18n.t('PERSON_REGISTRATION.OTHERS')} value="others" />
                </Picker>
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
              </Col>
            </Row>
          </View>
          <Row>
            <View>
              <Col
                size={50}
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginLeft: 20,
                  // flexDirection: 'row',
                  // marginHorizontal: 20,
                }}>
                <Label
                 testID="dateOfBirthLabel"
                 accessibilityLabel="dateOfBirthLabel"
                  style={{
                    margin: 10,
                    fontSize: 10,
                    fontWeight: '500',
                    marginLeft: 10,
                    //padding: 10,
                  }}>
                  {i18n.t('PERSON_REGISTRATION.DATE_OF_BIRTH')}{' '}
                  <Text
                    style={{fontSize: 20, color: 'red', textAlign: 'center'}}
                  >
                    *
                  </Text>
                </Label>

                {Platform.OS === 'android' ? (
                  <View style={{marginLeft: 10}}>
                    <DatePicker
                     testID="middleNameTextInput"
                     accessibilityLabel="middleNameTextInput"
                      allowFontScaling={false}
                      maxDate={new Date()}
                      date={this.state.newDatePicker}
                      customStyles={{
                        dateIcon: {
                          height: 20,
                          //width: '320%',
                          marginLeft: 10,
                        },
                        dateInput: {
                          height: 15,
                          //    marginHorizontal:10,
                          borderColor: 'white',
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      minDate={new Date(1900, 1, 1)}
                      // maxDate={new Date(2020, 12, 12)}
                      locale={'en'}
                      format="DD-MMM-YYYY"
                      timeZoneOffsetInMinutes={undefined}
                      modalTransparent={false}
                      animationType={'fade'}
                      androidMode={'spinner'}
                      showIcon={true}
                      style={{height: 60}}
                      // placeHolderText="Select date"
                      textStyle={{color: 'green'}}
                      placeHolderTextStyle={{color: '#d3d3d3'}}
                      //onDateChange={this.setDate}
                      onDateChange={(date) =>
                        this.setState({newDatePicker: date})
                      }
                      disabled={false}
                    />
                  </View>
                ) : (
                  <View style={{marginTop: -5}}>
                    <DateTimePicker
                      style={{
                        width: '320%',
                        backgroundColor: 'white',
                        height: 60,
                      }}
                      testID="dateTimePicker"
                      accessibilityLabel="dateTimePicker"
                      value={new Date(this.state.chosenDate)} //date={this.state.newDatePicker}
                      //value={this.state.newDatePicker} //date={this.state.newDatePicker}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      //onChange={this.setDate}
                      onDateChange={(date) => this.setState({chosenDate: date})}
                      locale={'en'}
                    />
                  </View>
                )}
              </Col>
            </View>
          </Row>

          <View style={{padding: 1}}>
            <Row>
              <Col>
                <TextInput
                 testID="fatherNameTextInput"
                 accessibilityLabel="fatherNameTextInput"
                  allowFontScaling={false}
                  placeholder={i18n.t('PERSON_REGISTRATION.FATHER_NAME')}
                  placeholderTextColor={'#2D323C'}
                  style={styles.input}
                  //onChangeText={(text)=>this.setState({father_name:text})}
                  onChangeText={(text) =>
                    this.validate_name(text, 'father_name')
                  }
                />
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
                {!this.state.fatherNameValidate ? (
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '500',
                      color: 'red',
                      marginLeft: 20,
                    }}
                    testID="enterAlphabetsText"
                    accessibilityLabel="enterAlphabetsText">
                    {' '}
                    * Please Enter Alphabets{' '}
                  </Text>
                ) : null}
              </Col>
            </Row>
          </View>
          <View style={{padding: 20}}>
            <Row>
              <Col>
                <TextInput
                 testID="emailTextInput"
                 accessibilityLabel="emailTextInput"
                  allowFontScaling={false}
                  placeholder={i18n.t('PERSON_REGISTRATION.EMAIL')}
                  placeholderTextColor={'#2D323C'}
                  style={styles.emailinput}
                  defaultValue={this.state.email}
                  onChangeText={(text) => this.validate(text)}
                  //onChangeText={(text)=>this.setState({email:text})}
                />
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
                {!global.emailIdValidate ? (
                  <Text
                  testID="invalidEmailText"
                  accessibilityLabel="invalidEmailText"
                    style={{
                      fontSize: 10,
                      fontWeight: '500',
                      color: 'red',
                      marginLeft: 20,
                    }}>
                    {' '}
                    * {i18n.t('PERSON_REGISTRATION.INVALID_EMAIL_ADDRESS')}{' '}
                  </Text>
                ) : null}
              </Col>
            </Row>
          </View>
          <Row>
            <Col>
              <PhoneInput
               testID="phoneInput"
               accessibilityLabel="phoneInput"
                ref="phone"
                initialCountry={'in'}
                style={styles.input}
                value={this.state.phonecode + this.state.phone_no}
                onChangePhoneNumber={(text) => {
                  this.onValueChangePhoneNumber(text);
                }}
              />
              {/* </Col>
    <Col>
    <TextInput allowFontScaling={false}
    placeholder="Phone Number"
    placeholderTextColor={"#2D323C"}
    style={styles.input}
    //onChangeText={(text)=>this.setState({phone:text})}
    onChangeText={
      (text) => {
          this.onValueChangePhoneNumber(text)
      }
  }
    />  */}
              <Icon
                style={{alignSelf: 'flex-end', marginTop: -45, marginRight: 25}}
                name={this.state.icon1}
                size={14}
                onPress={() => this._changeIcon1()}
              />
              {this.state.phoneemptyvalidate ? (
                <Text
                testID="numberNotEmptyText"
                accessibilityLabel="numberNotEmptyText"
                  style={{
                    fontSize: 10,
                    fontWeight: '500',
                    color: 'red',
                    marginLeft: 20,
                  }}>
                  {' '}
                  * Phone number is not empty{' '}
                </Text>
              ) : null}
              {this.state.phonemorethanvalidate ? (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '500',
                    color: 'red',
                    marginLeft: 20,
                  }}
                  testID="numberMoreThan10Text"
                  accessibilityLabel="numberMoreThan10Text">
                  {' '}
                  * {i18n.t('PERSON_REGISTRATION.MORE_THAN_10')}{' '}
                </Text>
              ) : null}
            </Col>
          </Row>
          <View
            style={{
              flexDirection: 'row',
              marginTop: '5%',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
            }}>
            <Row>
              <Col size={40}>
                <Label
                 testID="idTypeLabel"
                 accessibilityLabel="idTypeLabel"
                  style={{
                    marginLeft: 25,
                    fontSize: 10,
                    fontWeight: '500',
                    //marginTop: 10,
                    margin: 5,
                  }}>
                  {i18n.t('PERSON_REGISTRATION.ID_TYPE')} <Text style={styles.TextStyle}>*</Text>
                </Label>
                <Picker
                 testID="idTypePicker"
                 accessibilityLabel="idTypePicker"
                  // style={{marginLeft: 15, height: 50, width: 130, marginTop: 0}}
                  style={{marginLeft: 5, height: 40, marginTop: -10}}
                  selectedValue={this.state.def_idtype_val1}
                  iosIcon={
                    <Icon2
                      style={{marginRight: 40, top: -5}}
                      name="sort-down"
                      color="#a9a9a9"
                    />
                  }
                  placeholder={i18n.t('PERSON_REGISTRATION.SELECT')}
                  onValueChange={this.onValueChangeIdtype.bind(this)}>
                  <Picker.Item label={i18n.t('PERSON_REGISTRATION.SELECT')} value={''} />
                  {this.state.idtype_val.map((item) => (
                    <Picker.Item
                      label={item.IDtype}
                      value={
                        item.IDtype_value
                        //  +
                        // ' ' +
                        // item.inputtype +
                        // ' ' +
                        // item.inputlength
                      }
                    />
                  ))}
                </Picker>
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
              </Col>
              <Col size={4}></Col>

              <Col size={60}>
                <TextInput
                 testID="idNumberTextInput"
                 accessibilityLabel="idNumberTextInput"
                  allowFontScaling={false}
                  maxLength={14}
                  placeholder={i18n.t('PERSON_REGISTRATION.ID_NUMBER')}
                  placeholderTextColor={'#2D323C'}
                  style={styles.input2}
                  //onChangeText={(text)=>this.setState({idtype_no:text})}
                  onChangeText={(text) =>
                    this.validate_name(text, 'idtype_number')
                  }
                />
                <Icon
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: -45,
                    marginRight: 25,
                  }}
                  name={this.state.icon1}
                  size={14}
                  onPress={() => this._changeIcon1()}
                />
                {!this.state.idtype_numberValidate ? (
                  <Text style={{fontSize: 10, fontWeight: '500', color: 'red'}}
                  testID="enterValidIdText"
                  accessibilityLabel="enterValidIdText">
                    {' '}
                    * Please Enter valid ID Number{' '}
                  </Text>
                ) : null}
              </Col>
            </Row>
          </View>
          <Row>
            <View style={{height: 50}} />
            {/* <Col style={{alignItems:'center',marginTop:10}}>
    <Button onPress={this.goSubmit} style={{width:90,height:45,backgroundColor:"#F67F7D",borderColor:'#F67F7D', borderRadius:8, borderWidth: 1,}}>
    <Text allowFontScaling={false}style={{color:"white",marginLeft:20}}> Submit </Text>
    </Button>
    </Col> */}

            <Col>
              {this.state.otpsent && (
                <TextInput
                testID="enterOtpTextInput"
                accessibilityLabel="enterOtpTextInput"
                  style={styles.inputOtp}
                  placeholder={i18n.t('PERSON_REGISTRATION.ENTER_OTP')}
                  placeholderTextColor={'#2D323C'}
                  value={this.state.otpvalue}
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={(text) => this.setState({otpvalue: text})}
                />
              )}
            </Col>
          </Row>
          {this.state.temp_to_perm == 'Yes' && !this.state.tempper_val_cng && (
            <Row>
              <Col size={90}>
                <Button
                 testID="submitButton"
                 accessibilityLabel="submitButton"
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    marginTop: 5,
                    alignSelf: 'center',
                    paddingHorizontal: 10,
                    height: 45,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: APP_PRIMARY_COLOR,
                  }}
                  onPress={this.validateEmailPhone}>
                  <Text style={{color: 'white'}}
                   testID="submitText"
                   accessibilityLabel="submitText">{i18n.t('PERSON_REGISTRATION.SUBMIT')}</Text>
                </Button>
              </Col>
            </Row>
          )}
          {this.state.temp_to_perm == 'Yes' && this.state.tempper_val_cng && (
            <Row>
              <Col size={this.state.otpsent ? 50 : 90}>
                <Button
                 testID="generateOrResendotpButton"
                 accessibilityLabel="generateOrResendotpButton"
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    marginTop: 5,
                    alignSelf: 'center',
                    paddingHorizontal: 10,
                    height: 45,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: APP_PRIMARY_COLOR,
                  }}
                  onPress={this.goSubmit}>
                  <Text style={{color: 'white'}}
                   testID="generateOrResendotpText"
                   accessibilityLabel="generateOrResendotpText">
                    {!this.state.otpsent ? i18n.t('PERSON_REGISTRATION.GENERATE_OTP') : i18n.t('PERSON_REGISTRATION.RESEND_OTP')}
                  </Text>
                </Button>
              </Col>
              <Col size={this.state.otpsent ? 50 : 10}>
                {this.state.otpsent && (
                  <Button
                  testID="submitButton"
                  accessibilityLabel="submitButton"
                    style={{
                      backgroundColor: APP_PRIMARY_COLOR,
                      marginTop: 5,
                      alignSelf: 'center',
                      paddingHorizontal: 10,
                      height: 45,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: APP_PRIMARY_COLOR,
                    }}
                    onPress={this.checkOTP}>
                    <Text style={{color: 'white'}}
                     testID="submitText"
                     accessibilityLabel="submitText">{i18n.t('PERSON_REGISTRATION.SUBMIT')}</Text>
                  </Button>
                )}
              </Col>
            </Row>
          )}

          {this.state.temp_to_perm != 'Yes' && (
            <Row>
              <Col size={this.state.otpsent ? 50 : 90}>
                <Button
                 testID="resendOtpButton"
                 accessibilityLabel="resendOtpButton"
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    marginTop: 5,
                    alignSelf: 'center',
                    height: 45,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: APP_PRIMARY_COLOR,
                  }}
                  onPress={this.goSubmit}>
                  <Text style={{color: 'white'}}
                   testID="generateOrResendotpText"
                   accessibilityLabel="generateOrResendotpText">
                    {!this.state.otpsent ? i18n.t('PERSON_REGISTRATION.GENERATE_OTP') : i18n.t('PERSON_REGISTRATION.RESEND_OTP')}
                  </Text>
                </Button>
              </Col>
              <Col size={this.state.otpsent ? 50 : 10}>
                {this.state.otpsent && (
                  <Button
                  testID="submitButton"
                  accessibilityLabel="submitButton"
                    style={{
                      backgroundColor: APP_PRIMARY_COLOR,
                      marginTop: 5,
                      alignSelf: 'center',
                      paddingHorizontal: 10,
                      height: 45,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: APP_PRIMARY_COLOR,
                    }}
                    onPress={this.checkOTP}>
                    <Text style={{color: 'white'}}
                     testID="submitText"
                     accessibilityLabel="submitText">{i18n.t('PERSON_REGISTRATION.SUBMIT')}</Text>
                  </Button>
                )}
              </Col>
            </Row>
          )}
        </Content>
        <FlashMessage position="top" ref={(ref) => (this.ChangeAlert = ref)} />
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  postList: state.postList.postList,
});
const styles = StyleSheet.create({
  input: {
    marginTop: 5,
    borderColor: '#3b3d40',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
    marginHorizontal: 20,
  },
  inputOtp: {
    marginTop: 30,
    borderColor: '#3b3d40',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  input1: {
    marginTop: 10,
    borderColor: '#3b3d40',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  input2: {
    marginTop: 15,
    borderColor: '#3b3d40',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    //marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
    marginRight: 17,
  },
  emailinput: {
    marginTop: 5,
    borderColor: '#3b3d40',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
    //marginHorizontal: 20,
  },
  TextStyle: {
    fontSize: 10,
    color: 'red',
  },
});

export default connect(mapStateToProps, {getPostList})(CreatePerson);
