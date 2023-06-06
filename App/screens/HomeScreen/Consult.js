import React, {Component} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableHighlight,
  TextInput,
  Dimensions,
  PanResponder,
  Animated,
  Alert,
  Platform,
  DeviceEventEmitter
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
// import Autocomplete from 'react-native-autocomplete-input';
import Tab1 from './Tab1';
import Tab3 from './Tab3';
import Tab2 from './Tab2';
import {getConsultList} from '../../redux/actions/consult_action';
import {getValidateList} from '../../redux/actions/validate_action';
import {getApplyList} from '../../redux/actions/tempapply_action';
import {getPresecList} from '../../redux/actions/presec_action';
import {getMedicineList} from '../../redux/actions/medicine_action';
import {getMedicineList1} from '../../redux/actions/medicine_action1';
import RNImageToPdf from 'react-native-image-to-pdf';
import {Overlay} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {
  Container,
  Header,
  Content,
  Row,
  Col,
  Footer,
  FooterTab,
  Button,
  Item,
  Label,
  Thumbnail,
} from 'native-base';
//import {Picker} from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  getPlanServicesData,
  getPersonTimelineData,
  getVaccineOrderData,
  getHistoryData,
} from '../../redux/actions/retrieve_action';
import EncounterTimeline from './EncounterTimeline';
//import EncounterTimeLine from './EncounterTimeLine/EncounterTimeLine';

import checkUp from './check-up';
import Telemedicine from '../HomeScreen/Checkup/Telemedicine';
import FlashMessage from 'react-native-flash-message';
import RNFetchBlob from 'rn-fetch-blob';
import ImageResizer from 'react-native-image-resizer';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import FileSelector from '../../components/fileselector/FileSelector';
import Twilio from '../HomeScreen/Checkup/Twilio';
import getBaseUrl from '../../config/Config';
import i18n from '../../../i18n';
import {TwilioConnection} from '../../redux/actions/TwilioActions';

const Tabs = createAppContainer(
  createBottomTabNavigator(
    {
      Tab1: {
        screen: checkUp,
        navigationOptions: {
          tabBarLabel: () => (
            <Text
              style={{textAlign: 'center', color: '#000000', fontWeight: '50'}}>
              {i18n.t('PATIENTS.CHECK_UP')}
            </Text>
          ),
          tabBarIcon: ({tintColor}) => (
            <Icon name="stethoscope" color={tintColor} size={24} />
            // <Icon type="FontAwesome" color={tintColor} name="home" />
          ),
        },
      },
      Tab2: {
        screen: Tab2,
        navigationOptions: {
          tabBarLabel: () => (
            <Text
              style={{textAlign: 'center', color: '#000000', fontWeight: '50'}}>
              {i18n.t('PATIENTS.HISTORY')}
            </Text>
          ),
          tabBarIcon: ({tintColor}) => (
            <Icon name="heartbeat" color={tintColor} size={24} />
          ),
        },
      },
      Tab3: {
        screen: Tab3,
        navigationOptions: {
          tabBarLabel: () => (
            <Text
              style={{textAlign: 'center', color: '#000000', fontWeight: '50'}}>
              {i18n.t('PATIENTS.IMMUNIZATION')}
            </Text>
          ),
          tabBarIcon: ({tintColor}) => (
            <Icon name="medkit" color={tintColor} size={24} />
          ),
        },
      },
      Tab4: {
        screen: EncounterTimeline,
        navigationOptions: {
          tabBarLabel: () => (
            <Text
              style={{textAlign: 'center', color: '#000000', fontWeight: '50'}}>
              {i18n.t('PATIENTS.TIMELINE')}
            </Text>
          ),

          tabBarIcon: ({tintColor}) => (
            <Icon name="clock-o" color={tintColor} size={24} />
          ),
        },
      },
    },
    {
      tabBarOptions: {
        activeTintColor: '#345D7E',
        inactiveTintColor: 'grey',
        style: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          shadowOffset: {width: 5, height: 3},
          shadowColor: 'black',
          shadowOpacity: 0.5,
          elevation: 5,
          gesturesEnabled: true,
        },
      },
    },
  ),
);
let path1;
let uri1;
class Consult extends Component {
  pan = new Animated.ValueXY();
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      callbacknavigation: '',
      pdfpath: '',
      hspname: this.props.navigation.state.params.hspname,
      films: [],
      query: '',
      uploadmodal: false,
      modalVisible: false,
      virtual_flag:this.props.navigation.state.params.virtual_flag,
      hlpid: this.props.navigation.state.params.summary,
      enc_id: this.props.navigation.state.params.enc_id,
      description: this.props.navigation.state.params.description,
      template_id: this.props.navigation.state.params.template_id,
      template_name: this.props.navigation.state.params.template_name,
      appointment_type: this.props.navigation.state.params.appointment_type,
      appointment_staus: this.props.navigation.state.params.appointment_staus,
      search_branch: this.props.navigation.state.params.branch,
      check_status: this.props.navigation.state.params.screen2,
      virtual:this.props.navigation.state.params.virtual_clinic_branch,
      plist: this.props.navigation.state.params.plist,
      name: this.props.navigation.state.params.name,
      summary: this.props.navigation.state.params.summary,
      profile_pic: this.props.navigation.state.params.profile_pic,
      screen: this.props.navigation.state.params.screen,
      dob: this.props.navigation.state.params.dob,
      gender: this.props.navigation.state.params.gender,
      blood: this.props.navigation.state.params.blood,
      age: this.props.navigation.state.params.age,
      videocall: this.props.navigation.state.params.videocall,
      profile_pic1: require('../../assets/images/doc.jpg'),
      loading: true,
      mulImg: [],
      showfileupload: false,
      saveflg: false,
      aasha: this.props.navigation.state.params.aasha,
      redial_call: require('../../assets/images/redial_black.png'),
      enc_version: this.props.navigation.state.params.enc_version,
      virtual_clinic_branch: this.props.navigation.state.params.virtual_clinic_branch,
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.setPanResponder();
    let ob1 = DeviceEventEmitter.addListener('redialcallflagevent', (e) => {
      this.setState({
        redialcallflag:e.redialcallflag=="true"?true:false
      });
    });
  }

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file) {
    const path = file.path;
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
        .then(({path}) => {
          this.setState({path});
          path1 = path;
          let source;
          source = {path: path1};
          if (path1.split('.')[1] == 'pdf') {
            this.setState({pdfpath: path1});
          } else {
            this.state.mulImg.push(path1);
            this.setState({mulImg: this.state.mulImg});
            setTimeout(() => {
              this.checkConvert();
            }, 250);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } catch (error) {
      console.log(
        'The photo picker errored. Check ImagePicker.launchCamera func',
      );
      console.log(error);
    }
  }

  setImage = () => {
    // const options = {
    //   title: 'Select Prescription file',
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };
    this.fileSelRef.current.openPicker();

    // ImagePicker.showImagePicker(options, (response) => {
    //   console.log('Type = ', response);
    //   if (Platform.OS === 'android') {
    //     const { error, path, originalRotation } = response;
    //     if (path && !error) {
    //       let rotation = 0;

    //       if (originalRotation === 90) {
    //         rotation = 360;
    //       } else if (originalRotation === 270) {
    //         rotation = 360;
    //       }

    //       ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, rotation)
    //         .then(({ path }) => {
    //           this.setState({ path });
    //           path1 = path;
    //           console.log('path', path);
    //           if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //             // console.log(this.state.mulImg.length)
    //             // if(this.state.mulImg.length>=1){
    //             //   this.checkConvert()
    //             // }
    //           } else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //           } else {
    //             let source;
    //             // if(Platform.OS==='android'){
    //             console.log('123');
    //             source = { path: path1 };
    //             console.log(source.path);
    //             // }
    //             // if(Platform.OS==='ios'){
    //             //   console.log("234")
    //             //   source={path:this.state.uri}
    //             // }
    //             console.log('Achu', source.path);

    //             if (path1.split('.')[1] == 'pdf') {
    //               this.setState({ pdfpath: path1 });
    //             } else {
    //               console.log('else');
    //               this.state.mulImg.push(path1);
    //               console.log('else1');
    //               this.setState({ mulImg: this.state.mulImg });
    //               //   this.convertPDF(source.path);
    //               this.checkConvert();
    //             }
    //           }
    //         })
    //         .catch((err) => {
    //           console.log('err', err);

    //           //  return Alert.alert( 'Unable to resize the photo', 'Please try again!' )
    //         });
    //     } else if (error) {
    //       console.log(
    //         'The photo picker errored. Check ImagePicker.launchCamera func',
    //       );
    //       console.log(error);
    //     }
    //   }
    //   if (Platform.OS === 'ios') {
    //     const { error, uri, originalRotation } = response;

    //     if (uri && !error) {
    //       let rotation = 0;

    //       if (originalRotation === 90) {
    //         rotation = 360;
    //       } else if (originalRotation === 270) {
    //         rotation = 360;
    //       }

    //       ImageResizer.createResizedImage(uri, 800, 650, 'JPEG', 50, rotation)
    //         .then(({ uri }) => {
    //           this.setState({ uri });
    //           uri1 = uri;
    //           if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //             // console.log(this.state.mulImg.length)
    //             // if(this.state.mulImg.length>=1){
    //             //   this.checkConvert()
    //             // }
    //           } else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //           } else {
    //             let source;
    //             // if(Platform.OS==='android'){
    //             console.log('123');
    //             source = { path: path1 };
    //             console.log(source.path);
    //             // }
    //             // if(Platform.OS==='ios'){
    //             //   console.log("234")
    //             //   source={path:this.state.uri}
    //             // }
    //             console.log('Achu', source.path);

    //             if (path1.split('.')[1] == 'pdf') {
    //               this.setState({ pdfpath: path1 });
    //             } else {
    //               console.log('else');
    //               this.state.mulImg.push(path1);
    //               console.log('else1');
    //               this.setState({ mulImg: this.state.mulImg });
    //               //   this.convertPDF(source.path);
    //               this.checkConvert();
    //             }
    //           }
    //         })
    //         .catch((err) => {
    //           console.log('err', err);

    //           //  return Alert.alert( 'Unable to resize the photo', 'Please try again!' )
    //         });
    //     } else if (error) {
    //       console.log(
    //         'The photo picker errored. Check ImagePicker.launchCamera func',
    //       );
    //       console.log(error);
    //     }
    //   }
    //   if (Platform.OS === 'ios') {
    //     source = { path: response.uri.replace('file://', '') };
    //     if (source.path.split('.')[1] == 'pdf') {
    //       this.setState({ pdfpath: source.path });
    //     } else {
    //       this.state.mulImg.push(source.path);
    //       this.setState({ mulImg: this.state.mulImg });
    //       //   this.convertPDF(source.path);
    //       this.checkConvert();
    //     }
    //   }
    //   // }
    // });
  };

  checkConvert = () => {
    Alert.alert(
      i18n.t('PLAN.PRESCRIPTION_ADDED'),
      i18n.t('PATIENTS.ADD_MORE'),
      [
        {text: i18n.t('COMMON.YES'), onPress: () => this.setImage()},
        {text: i18n.t('COMMON.NO'), onPress: () => this.convertPDF()},
      ],
      {cancelable: false},
    );
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
      console.log(options);
      alert(i18n.t('PERSON_REGISTRATION.FILE_UPLOADED'));
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      console.log('paaath', this.state.pdfpath);
      this.setState({pdfpath: pdf.filePath});
      console.log('paaath', this.state.pdfpath);
      // this.refs.loading.close();
    } catch (e) {
      console.log(e);
    }
  };

  savePdf = async () => {
    if (!this.state.pdfpath) {
      alert(i18n.t('PATIENTS.UPLOAD_PDF'));
    } else if (!this.state.img_name) {
      alert(i18n.t('PATIENTS.FILE_NAME'));
    } else if (!this.state.image_notes) {
      alert(i18n.t('PATIENTS.PLS_ENTER_NOTES'));
    } else {
      this.setState({loading: true});
      try {
        const docname = await AsyncStorage.getItem('doctorname');
        console.log(
          this.state.pdfpath,
          this.state.image_notes,
          this.state.img_name,
        );
        console.log(this.state.summary, this.state.enc_id, docname);
        let obk = [
          {
            name: 'FILES',
            filename: 'consultation_pdf',
            type: 'application/pdf',
            data: RNFetchBlob.wrap(this.state.pdfpath),
          },
          {
            name: 'hlp_id',
            data: this.state.summary,
          },
          {
            name: 'enc_id',
            data: this.state.enc_id,
          },
          {
            name: 'notes',
            data: this.state.image_notes,
          },
          {
            name: 'img_name',
            data: this.state.img_name,
          },
          {
            name: 'doc_id',
            data: global.doctor_id,
          },
          {
            name: 'doc_name',
            data: docname,
          },
        ];
        console.log('gug' + obk);
        let url = getBaseUrl() + 'consultation_img_upload/';
        let response = await RNFetchBlob.fetch(
          'POST',
          url,
          {
            Authorization: 'Bearer access-token',
            otherHeader: 'foo',
          },
          obk,
        )
          .then((response) => response.json())
          .then(async (response) => {
            this.setState({loading: false});
            setTimeout(() => {
              Alert.alert(
                i18n.t('PATIENTS.ALERT'),
                i18n.t('PERSON_REGISTRATION.FILE_UPLOADED'),
                [
                  {
                    text: i18n.t('COMMON.OK'),
                    onPress: () => this.getUploadedImages(),
                  },
                ],
              );
            }, 1000);
            return response;
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (e) {}
      this.getUploadedImages();
    }
  };

  getUploadedImages = async () => {
    this.setState({pdfpath: ''});
    this.setState({showfileupload: ''});
    this.setState({saveflg: ''});
    this.setState({pdfpath: ''});
    let url = getBaseUrl() + 'get_images_byencounter/';
    let ob = JSON.stringify({
      enc_id: this.state.enc_id,
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
        console.log(response.message);
        this.setState({upload_image_data: response.message});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  deleteImg = async (id) => {
    const docname = await AsyncStorage.getItem('doctorname');
    let url = getBaseUrl() + 'delete_images_byencounter/';
    let ob = JSON.stringify({
      enc_id: this.state.enc_id,
      id: id,
      doc_name: docname,
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
        console.log(response.message);
        alert(response.message);
        this.getUploadedImages();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  showPdf = async(pdflink) => {
    this.setState({uploadmodal: false});
    console.log('link=' + pdflink);
    await AsyncStorage.setItem('redial_call_page', 'viewpdf');
    this.props.navigation.navigate('ViewPdf', {
      link: pdflink,
    });
  };
  showPdf1 = async(pdflink) => {
    this.setState({uploadmodal: false});
    console.log('link=' + pdflink);
    await AsyncStorage.setItem('redial_call_page', 'viewpdf');
    this.props.navigation.navigate('ViewPdf3', {
      link: pdflink,
    });
  };
  getAge = (dob) => {
    var nowDate = new Date(new Date().setHours(0, 0, 0, 0));
    var dobDate = new Date(dob);

    var years = nowDate.getFullYear() - dobDate.getFullYear();
    var months = nowDate.getMonth() - dobDate.getMonth();
    var days = nowDate.getDate() - dobDate.getDate();

    // Work out the difference in months.
    months += years * 12;
    if (days < 0) {
      months -= 1;
    }
    // Now add those months to the date of birth.
    dobDate.setMonth(dobDate.getMonth() + months);
    // Calculate the difference in milliseconds.
    var diff = nowDate - dobDate;
    // Divide that by 86400 to get the number of days.
    var days = Math.round(diff / 86400 / 1000);
    // Now convert months back to years and months.
    years = parseInt(months / 12);
    months -= years * 12;
    // Format age as "xx years, yy months, zz days"
    var text = '';
    if (years) {
      text = years + (years > 1 ? 'Y ' : 'Y ');
    }
    if (months) {
      // alert(months)
      if (text.length) {
        text = text;
      }
      text = text + months + (months > 1 ? 'M ' : 'M ');
    }
    if (days) {
      if (text.length) {
        text = text;
      }
      text = text + days + (days > 1 ? 'D' : 'D');
    }
    var y = years != '0' ? years + 'Y ' : '0Y ';
    var m = months != 0 ? months + 'M ' : '0M ';
    var d = days != '0' ? days + 'D' : '1D';
    //this.setState({age:y+m+d})
    return y + m + d;
  };
  callbackFunction = (childData) => {
    this.setState({callbacknavigation: childData});
  };
  componentDidMount = async () => {

    this.getUploadedImages();
    //First method to be called after components mount
    //fetch the data from the server for the suggestion
    global.screen = this.state.screen;
    if (this.state.screen == 'dashboard') {
      await this.props.getApplyList({
        docid: global.doctor_id,
        token: global.token,
        consulting: this.state.check_status,
        hlpid: this.state.summary,
        enc: this.state.enc_id,
        chief: this.state.description,
        uid: this.state.plist.replace(/&/g, '.'),
        template_id: this.state.template_id,
        template_name: this.state.template_name,
        app_type: this.state.appointment_type,
        username: this.state.name,
        // "custom_field0":""
      });
    } else if (this.state.screen == 'timelene') {
      console.log({
        hlpid: this.state.summary,
        enc: this.state.enc_id,
        docid: global.doctor_id,
        token: global.token,
      });
      await this.props.getConsultList({
        // "uid":this.state.plist,
        hlpid: this.state.summary,
        enc: this.state.enc_id,
        docid: global.doctor_id,
        token: global.token,
      });
    }

    await this.props.getValidateList({
      docid: global.doctor_id,
      token: global.token,
    });
    this.setState({
      profile_pic1: this.state.profile_pic,
      loading: false,
    });

    let obdata = JSON.stringify({
      practice_id: this.props.postList.pract_details[0].branch_id.split('-')[0],
    });
    let obdaata2 = JSON.stringify({
      hlp: this.state.summary,
    });
    let obdata3 = JSON.stringify({
      enc_id: this.state.enc_id,
      docid: global.doctor_id,
      hlp_id: this.state.summary,
      token: global.token,
    });
    let obdata4 = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
    });
    //alert(this.state.search_branch)
    //services search data
    this.props.getPlanServicesData(obdata);
    this.props.getPersonTimelineData(obdaata2);
    //vaccine search data
    this.props.getVaccineOrderData(obdata3);
    //getting  allergy default data
    this.props.getHistoryData(obdata4);
    //medicine search data
    await this.props.getMedicineList({
      type: 'MEDICINE',
      key: '',
      docid: global.doctor_id,
      token: global.token,
      branchid: this.state.search_branch,
    });
    //supplement search data
    await this.props.getMedicineList1({
      type: 'SUPPLEMENT',
      key: '',
      docid: global.doctor_id,
      token: global.token,
      branchid: this.state.search_branch,
    });
    // DeviceEventEmitter.emit('eventBacktoConsultation', { data:'yes' });
  };
  telemedicinevideocall = async () => {
    this.heAlphaCall();
  };

  heAlphaCall = async () => {
    
    const {virtual_clinic_branch} = this.state;

    if (virtual_clinic_branch?.virtual_clinic_branch) {
      await AsyncStorage.setItem('virtual_clinic_flag', 'true');
      await AsyncStorage.setItem(
        'virtual_clinic_branch',
        virtual_clinic_branch?.virtual_clinic_branch,
      );
    } else {
      await AsyncStorage.setItem('virtual_clinic_flag', 'false');
    }

    await AsyncStorage.setItem(
      'twilioEncid',
      this.state.enc_id + '_' + this.state.enc_version,
    );
    await AsyncStorage.setItem('twilioPerHlpid', this.state.hlpid);
    await AsyncStorage.setItem('twilioPerName', this.state.name);
    await AsyncStorage.setItem(
      'selectTemplate','false',
    );
    await AsyncStorage.setItem(
      'consult', 'false',
    );
    await AsyncStorage.setItem('fromPage', 'consult');
    this.props.TwilioConnection(true)
  };
  gen_presec = async () => {
    // this.setState({ loading: true })
    const docname = await AsyncStorage.getItem('doctorname');
    let obs = JSON.stringify({
      docid: global.doctor_id,
      hlp: this.state.summary,
      enc_id: this.state.enc_id,
      doc_name: docname,
      token: global.token,
      age_value: this.getAge(this.state.dob),
    });
    // console.log(obs)
    await this.props.getPresecList(obs);
    // alert("hi="+JSON.stringify(this.props.presecList.message.exits))
    this.setState({loading: false});
    if (this.props.presecList.message == 'Please Save Vitals') {
      alert(i18n.t('PATIENTS.PLS_SAVE_VITALS'));
      //  this.state.callbacknavigation.navigate("Vitals")
    } else {
      await this.ConsultAlert.showMessage({
        message: 'Success!',
        description: 'Prescription Generated',
        type: 'success',
        icon: 'auto',
      });
      if (this.props.presecList.message.exits == '1') {
        let path_val = this.props.presecList.message.pdf_path.replace(
          '/usr/share/nginx/html/cihealpha/',
          '',
        );
        await AsyncStorage.setItem('redial_call_page', 'viewpdf');
        path_val = path_val.replace('/storage/', '');
        this.props.navigation.navigate('ViewPdf2', {
          link: path_val,
          branch_id:
            this.props.navigation.state.params.enc_id.split('-')[0] +
            '-' +
            this.props.navigation.state.params.enc_id.split('-')[1],
          branch_name: this.props.navigation.state.params.hspname,
          profile_pic: this.props.navigation.state.params.profile_pic,
        });
      } else {
        alert('prescription not generated');
      }
    }
  };

  showCheckupAlert = ({message, description, type, icon}) => {
    console.warn('********************');
    if (this.ConsultAlert && this.ConsultAlert.showMessage) {
      this.ConsultAlert.showMessage({
        message: message,
        description: description,
        type: type,
        icon: icon,
      });
    }
  };

  setPanResponder() {
    this._y = 0;
    this._animation = new Animated.Value(300);
    this._animation.addListener(({value}) => {
      this._y = value;
    });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      //  onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.pan.setOffset({
          x: this.pan.x._value,
          y: this.pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this.pan.x, dy: this._animation},
      ]),
      onPanResponderRelease: (e, gestureState) => {
        this.pan.flattenOffset();
        if (gestureState.dy > 100) {
          Animated.timing(this._animation, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
          }).start();
          this._animation.setOffset(300);
        } else {
          this._animation.setOffset(0);
          Animated.timing(this._animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
        //alert(JSON.stringify(this._animation))
      },
    });
  }
  handleOpen = () => {
    this._animation.setOffset(0);
    Animated.timing(this._animation, {
      toValue: 0,
      duration: 200,
    }).start();
  };

  render() {
    const {
      consultList,
      isFetching10,
      validateList,
      isFetching11,
      applyList,
      isFetching19,
    } = this.props;
    const {width, height: screenHeight} = Dimensions.get('window');
    const height = screenHeight;
    const translateYInterpolate = this._animation.interpolateNode({
      inputRange: [0, 300],
      outputRange: [0, screenHeight - height - 320],
      extrapolate: 'clamp',
    });

    const scaleInterpolate = this._animation.interpolateNode({
      inputRange: [0, 300],
      outputRange: [1, 0.1],
      extrapolate: 'clamp',
    });

    const scaleInterpolate2 = this._animation.interpolateNode({
      inputRange: [0, 300],
      outputRange: [1, 0.05],
      extrapolate: 'clamp',
    });
    const translateXInterpolate = this._animation.interpolateNode({
      inputRange: [0, 300],
      outputRange: [0, 90],
      extrapolate: 'clamp',
    });

    const videoStyles = {
      transform: [
        {
          translateY: translateYInterpolate,
        },
        {
          translateX: translateXInterpolate,
        },
        {
          scaleX: scaleInterpolate,
        },
        {
          scaleY: scaleInterpolate2,
        },
      ],
    };

    if (this.state.loading) {
      //||this.props.isFetching10||this.state.isFetching19
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
    if (this.state.uploadmodal) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            height="auto"
            onBackdropPress={() => this.setState({uploadmodal: false})}>
            <FileSelector
              ref={this.fileSelRef}
              onSelection={this.handleSelection}
              selectAny
            />
            <KeyboardAwareScrollView>
              <Row
                style={{
                  backgroundColor: APP_PRIMARY_COLOR,
                  height: 50,
                  marginTop: -10,
                  marginHorizontal: -20,
                  borderRadius: 10,
                }}>
                <Col size={75}>
                  <Text
                    style={{
                      color: 'white',
                      marginTop: 15,
                      fontSize: 16,
                      alignSelf: 'center',
                    }}>
                    {i18n.t('COMMON.UPLOAD')}{' '}
                  </Text>
                </Col>
              </Row>

              {this.state.showfileupload ? (
                <Row style={{height: 50}}>
                  <Col size={40}>
                    <Text style={{marginTop: 15, fontSize: 16}}>
                      {i18n.t('COMMON.UPLOADED_FILES')}
                    </Text>
                  </Col>

                  <Col size={60}>
                    {this.state.pdfpath == '' ? (
                      <TouchableOpacity onPress={() => this.setImage()}>
                        <Icon
                          style={{
                            fontSize: 20,
                            color: '#555b57',
                            marginTop: 15,
                          }}
                          type="FontAwesome"
                          name="upload"
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.showPdf1(this.state.pdfpath)}>
                        <Icon
                          style={{
                            fontSize: 20,
                            color: '#555b57',
                            marginTop: 15,
                          }}
                          type="FontAwesome"
                          name="file-pdf-o"
                        />
                      </TouchableOpacity>
                    )}
                  </Col>
                </Row>
              ) : null}
              {this.state.showfileupload ? (
                <Row
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Col size={40}>
                    <Text style={{fontSize: 16}}>
                      {i18n.t('PATIENTS.NAME')}
                    </Text>
                  </Col>
                  <Col size={60}>
                    <TextInput
                      allowFontScaling={false}
                      placeholder={i18n.t('PATIENTS.ENTER_NAME')}
                      placeholderTextColor={'#2D323C'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      style={styles.input}
                      onChangeText={(text) => {
                        this.setState({img_name: text});
                      }}
                    />
                  </Col>
                </Row>
              ) : null}
              {this.state.showfileupload ? (
                <Row
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Col size={40}>
                    <Text style={{fontSize: 16}}>
                      {i18n.t('COVID_MONITORING.NOTES')}
                    </Text>
                  </Col>
                  <Col size={60}>
                    <TextInput
                      allowFontScaling={false}
                      placeholder={i18n.t('PATIENTS.ENTER_NOTES')}
                      placeholderTextColor={'#2D323C'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      style={styles.input}
                      onChangeText={(text) => {
                        this.setState({image_notes: text});
                      }}
                    />
                  </Col>
                </Row>
              ) : null}
              {this.state.upload_image_data &&
                this.state.upload_image_data.map((item, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'flex-end',
                      marginTop: 0,
                    }}>
                    <Row>
                      <Col size={70}>
                        <Text
                          key={index}
                          allowFontScaling={false}
                          style={{marginTop: 13}}>
                          {item.file_name}
                        </Text>
                      </Col>
                      <Col size={15}>
                        {item.file_path == null ||
                        item.file_path == '' ? null : item.file_path != null ? (
                          <TouchableOpacity
                            onPress={() => this.showPdf(item.file_path)}>
                            <Icon
                              style={{
                                fontSize: 20,
                                color: '#555b57',
                                marginTop: 15,
                              }}
                              type="FontAwesome"
                              name="file-pdf-o"
                            />
                          </TouchableOpacity>
                        ) : null}
                      </Col>
                      <Col size={15}>
                        <TouchableOpacity
                          onPress={() => this.deleteImg(item.id)}>
                          <Icon
                            type="FontAwesome"
                            name="trash"
                            style={{
                              fontSize: 22,
                              color: '#555b57',
                              marginTop: 15,
                            }}
                          />
                        </TouchableOpacity>
                      </Col>
                    </Row>
                  </View>
                ))}

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                {this.state.saveflg ? (
                  <Button
                    style={{
                      height: 35,
                      width: 80,
                      backgroundColor: APP_PRIMARY_COLOR,
                      marginTop: 15,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      this.savePdf();
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{color: 'white', fontSize: 15}}>
                      {i18n.t('COMMON.SAVE')}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    style={{
                      height: 35,
                      width: 80,
                      backgroundColor: APP_PRIMARY_COLOR,
                      marginTop: 15,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      this.setState({showfileupload: true, saveflg: true});
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{color: 'white', fontSize: 15}}>
                      {i18n.t('COMMON.ADD')}
                    </Text>
                  </Button>
                )}
                <Button
                  style={{
                    marginLeft: 10,
                    height: 35,
                    width: 80,
                    backgroundColor: APP_PRIMARY_COLOR,
                    marginTop: 15,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      uploadmodal: false,
                      showfileupload: false,
                      saveflg: false,
                    });
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'white', fontSize: 15}}>
                    {i18n.t('PATIENTS.CANCEL')}
                  </Text>
                </Button>
              </View>
            </KeyboardAwareScrollView>
          </Overlay>
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}>
        <View style={{position: 'relative', flex: 1}}>
          <Header style={{backgroundColor: 'white', height: 100}}>
            <StatusBar
              backgroundColor={APP_PRIMARY_COLOR}
              barStyle={'dark-content'}
            />
            <Row>
              <Col>
                <Row>
                  <Col size={10} style={{marginLeft: -15}}>
                    <TouchableOpacity>
                      <Thumbnail
                        square
                        source={require('../../assets/images/ic_launcher.png')}
                      />
                    </TouchableOpacity>
                  </Col>
                  <Col size={75} style={{marginLeft: 10}}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginTop: 15,
                        marginLeft: 20,
                        fontSize: 15,
                        alignSelf: 'center',
                        textTransform: 'capitalize',
                      }}>
                      {this.state.hspname}
                    </Text>
                  </Col>
                  {this.state.redialcallflag?
                  <Col size={25}>
                  <TouchableOpacity
                        onPress={() =>
                          this.telemedicinevideocall()
                        }>
                    <Thumbnail
                      style={{
                        borderRadius: 63,
                        borderWidth: 1,
                        borderColor: 'black',
                        marginTop: 10,
                        alignSelf: 'center',
                      }}
                      small
                      source={this.state.redial_call}
                    />
                    </TouchableOpacity>
                  </Col>:null}
                  <Col size={25}>
                    <Thumbnail
                      style={{
                        borderRadius: 63,
                        borderWidth: 1,
                        borderColor: 'black',
                        marginTop: 10,
                        alignSelf: 'center',
                      }}
                      small
                      source={this.state.profile_pic1}
                    />
                  </Col>
                </Row>
                <Row
                  style={{backgroundColor: '#e4e4e4', marginHorizontal: -10}}>
                  <Col size={65} style={{marginVertical: 15}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Person_Profile', {
                          hlpid: this.state.summary,
                        })
                      }>
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          marginLeft: 5,
                          textTransform: 'capitalize',
                        }}>
                        {this.state.name + ' | ' + this.state.gender + ' | '}
                        {this.getAge(this.state.dob).toUpperCase()}
                        {' | '}
                        {this.state.blood == 'O pos'
                          ? 'O +ve'
                          : this.state.blood == 'O neg'
                          ? 'O -ve'
                          : this.state.blood == 'A pos'
                          ? 'A +ve'
                          : this.state.blood == 'A neg'
                          ? 'A -ve'
                          : this.state.blood == 'B pos'
                          ? 'B +ve'
                          : this.state.blood == 'B neg'
                          ? 'B -ve'
                          : this.state.blood == 'AB pos'
                          ? 'AB +ve'
                          : this.state.blood == 'AB neg'
                          ? 'AB -ve'
                          : this.state.blood == 'OH'
                          ? 'OH'
                          : this.state.blood == 'NOT KNOWN' && 'NOT KNOWN'}
                      </Text>
                    </TouchableOpacity>
                  </Col>
                  <Col size={13}>
                    <TouchableOpacity
                      style={{marginTop: 15, marginLeft: 25}}
                      onPress={() => this.setState({uploadmodal: true})}>
                      <Icon
                        style={{fontSize: 28, color: 'black'}}
                        type="FontAwesome"
                        name="paperclip"
                      />
                      {/* <Text allowFontScaling={false} style={{color:"white",fontSize:12,marginVertical:5,textAlign:"center"}}>Upload</Text> */}
                    </TouchableOpacity>
                  </Col>
                  <Col size={12}>
                    <TouchableOpacity onPress={() => this.gen_presec()}>
                      <Thumbnail
                        style={{
                          height: 25,
                          width: 25,
                          marginTop: 15,
                          marginLeft: 10,
                        }}
                        square
                        source={require('../../assets/images/pre.png')}
                      />
                    </TouchableOpacity>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Header>
          <View style={{flex: 1, position: 'relative'}}>
            <Tabs
              screenProps={{
                rootNavigation: this.props.navigation,
                hspname: this.props.navigation.state.params.hspname,
                name: this.props.navigation.state.params.name,
                enc_id: this.state.enc_id,
                hlpid: this.state.summary,
                docid: global.doctor_id,
                token: global.token,
                profile_pic: this.props.navigation.state.params.profile_pic,
                screen: this.state.screen,
                chief: this.state.description,
                uid: this.state.plist.replace(/&/g, '.'),
                template_id: this.state.template_id,
                template_name: this.state.template_name,
                app_type: this.state.appointment_type,
                patientname: this.state.name,
                appointment_staus:
                  this.props.navigation.state.params.appointment_staus,
                check_status: this.props.navigation.state.params.screen2,
                uid2: this.state.plist,
                age: this.getAge(this.state.dob),
                dob: this.state.dob,
                gender: this.state.gender,
                blood: this.state.blood,
                aasha: this.state.aasha,
                virtual_branch:this.state.virtual,
                virtual_flag_data:this.state.virtual_flag,
                showCheckupAlert: this.showCheckupAlert,
                // parentCallback: (data) => {this.callbackFunction(data)}
              }}
            />
          </View>
        </View>
        {/* {(this.state.appointment_type.toLowerCase() == 'telemedicine' ||
          this.state.appointment_type.toLowerCase() == 'homecare') &&
          this.state.videocall == 'yes' && ( */}
        {/* <Animated.View
              style={[
                {
                  height: screenHeight,
                  width: width,
                  backgroundColor: '#000',
                  position: 'absolute',
                  zIndex: 1,
                },
                videoStyles,
              ]}
              {...this._panResponder.panHandlers}>
              <Twilio
                screenProps={{
                  hlpid: this.state.summary,
                  rootNavigation: this.props.navigation,
                }}
              />
            </Animated.View> */}
        {/* )} */}
        <FlashMessage position="top" ref={(ref) => (this.ConsultAlert = ref)} />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  consultList: state.consultList.consultList,
  isFetching10: state.consultList.isFetching10,
  isFetching11: state.consultList.isFetching11,
  validateList: state.validateList.validateList,
  patientList: state.patientList.patientList,
  applyList: state.applyList.applyList,
  postList: state.postList.postList,
  isFetching19: state.patientList.isFetching19,
  presecList: state.presecList.presecList,
  isFetching25: state.patientList.isFetching25,
});
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 16,
    marginTop: 40,
    zIndex: 1,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    zIndex: 1,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
    zIndex: 1,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    zIndex: 1,
  },
});
// export default Consult;
export default connect(mapStateToProps, {
  getConsultList,
  getValidateList,
  getApplyList,
  getPlanServicesData,
  getPersonTimelineData,
  getVaccineOrderData,
  getHistoryData,
  getPresecList,
  getMedicineList1,
  getMedicineList,
  TwilioConnection,
})(Consult);
