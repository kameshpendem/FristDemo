import React, {Component} from 'react';
import {
  PermissionsAndroid,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Row,
  Col,
  Footer,
  FooterTab,
  Button,
  Textarea,
  Item,
  Label,
  Thumbnail,
  Icon,
} from 'native-base';
import { Picker } from '@react-native-picker/picker';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import AutoTags from 'react-native-tag-autocomplete';
import {connect} from 'react-redux';
import Autocomplete from 'react-native-autocomplete-input';
import {getMedicineList} from '../../../../redux/actions/medicine_action';
import {Overlay, ButtonGroup} from 'react-native-elements';
import {
  savePlanData,
  saveLabOrderData,
  saveImagingOrderData,
  saveNursingOrderData,
  saveVaccineOrderData,
  updateVaccineBatchData,
} from '../../../../redux/actions/save_action';
import {
  deleteLabOrderData,
  deleteImagingOrderData,
  deleteNursingOrderData,
  deleteVaccineOrderData,
  deleteTempImagingOrderData,
  deleteTempLabOrderData,
  deleteTempMedicineData,
  deleteTempNursingOrderData,
  deleteTempSupplementData,
} from '../../../../redux/actions/delete_action';
import {
  repeatAllImagingOrderData,
  repeatImagingOrderData,
  repeatLabOrderData,
  repeatAllLabOrderData,
} from '../../../../redux/actions/repeat_action';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import RNImageToPdf from 'react-native-image-to-pdf';
import {getMedicineList1} from '../../../../redux/actions/medicine_action1';
import {getAddmedList} from '../../../../redux/actions/addmed_action';
import {getAddmedList1} from '../../../../redux/actions/addmed_action1';
import {getDelList} from '../../../../redux/actions/delete_med';
import {getDelList1} from '../../../../redux/actions/delete_sup';
import {getConsultList} from '../../../../redux/actions/consult_action';
import {getApplyList} from '../../../../redux/actions/tempapply_action';
import {getUpdatemsList} from '../../../../redux/actions/updatems_action';
import {getVaccineOrderData} from '../../../../redux/actions/retrieve_action';
import FlashMessage from 'react-native-flash-message';

// import {getImageorderList} from '../../../../redux/actions/imageorder_action';
import DatePicker from 'react-native-datepicker';
import FileSelector from '../../../../components/fileselector/FileSelector';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {APP_PRIMARY_COLOR} from '../../../../themes/variable';
import {NavigationActions, StackActions} from 'react-navigation';
import {changeTabData} from '../../../../redux/actions/changetab_action';
import ImageResizer from 'react-native-image-resizer';
import getBaseUrl from '../../../../config/Config';
let path1;
let uri1;

// import Addmedi from './Addmedi'
// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// const Stack = createAppContainer(createStackNavigator({
//   Addmedi: {
//       screen: Addmedi,
//       navigationOptions: ({navigation}) => ({
//           title: 'Plan',
//           headerStyle: {
//               backgroundColor: APP_PRIMARY_COLOR
//           },
//           headerTintColor: '#FFFFFF',
//           headerTitleStyle: {
//               color: '#FFFFFF',
//               fontWeight: '400'
//           }
//       })
//   },
// }))
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import i18n from '../../../../../i18n';
class Plan extends Component {
  static navigationOptions = {
    headerShown: false,
    showTabBar: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      isPlanModified: false,
      expiry_date: new Date(),
      height3t: 0,
      time_hidet: true,
      time_hidet1: false,
      hidet: false,
      ban3: true,
      ban4: false,
      ban1: true,
      ban2: false,
      lb: 'Add',
      lb1: 'Add',
      junk_medicine: false,
      junk_medicine1: false,
      load1: false,
      filePath: {},
      labstrike: false,
      alertvisible: false,
      alertvisible2: false,
      alertvisible3: false,
      alertvisible4: false,
      selectedIndex: '',
      selectedIndex1: 'undefined',
      selectedIndex2: 'undefined',
      selectedIndex3: 'undefined',
      selectedIndex4: '',
      selectedIndexa: '',
      deletecheck: '',
      medicines_data: [],
      supplements_data: [],
      selectedIndexa1: 'undefined',
      selectedIndexa2: 'undefined',
      selectedIndexa3: 'undefined',
      selectedIndexa4: '',
      deleteid: '',
      deletesection: '',
      height1: 0,
      height2: 0,
      height3: 0,
      height4: 0,
      height5: 0,
      plan_data: {},
      visible: this.props.screenProps.visible == '1' ? true : false,
      visible1: this.props.screenProps.visible == '2' ? true : false,
      visible2: this.props.screenProps.visible == '3' ? true : false,
      visible3: this.props.screenProps.visible == '4' ? true : false,
      visible4: this.props.screenProps.visible == '5' ? true : false,
      visible5: this.props.screenProps.visible == '6' ? true : false,

      visible6: false,
      visible7: false,
      treatment_notes: '',
      followup_notes: '',
      interoffice_notes: '',
      imaging_encounter: '',
      imaging_encountersList: [],
      lab_encounter: '',
      lab_encountersList: [],
      buttons1: [
        '4Hours',
        '6Hours',
        '8Hours',
        '12Hours',
        i18n.t('PATIENTS.ONCE'),
        i18n.t('PATIENTS.TWICE'),
        i18n.t('PATIENTS.THRICE'),
      ],
      dup_buttons1: [
        '4H',
        '6H',
        '8H',
        '12H',
        i18n.t('PATIENTS.ONCE'),
        i18n.t('PATIENTS.TWICE'),
        i18n.t('PATIENTS.THRICE'),
      ],
      buttons2: ['1', '2', '3', '4', '5', '6'],
      buttons4: [
        i18n.t('PATIENTS.BEFORE_FOOD'),
        i18n.t('PATIENTS.AFTER_FOOD'),
        i18n.t('PATIENTS.EMPTY_STOMACH'),
        i18n.t('PATIENTS.BED_TIME'),
      ],
      buttons3: ['SOS'],
      buttons: ['1/2', '1', '2', '3'],
      buttonsa1: [
        '4Hours',
        '6Hours',
        '8Hours',
        '12Hours',
        i18n.t('PATIENTS.ONCE'),
        i18n.t('PATIENTS.TWICE'),
        i18n.t('PATIENTS.THRICE'),
      ],
      buttonsa2: ['1', '2', '3', '4', '5', '6'],
      buttonsa4: [
        i18n.t('PATIENTS.BEFORE_FOOD'),
        i18n.t('PATIENTS.AFTER_FOOD'),
        i18n.t('PATIENTS.EMPTY_STOMACH'),
        i18n.t('PATIENTS.BED_TIME'),
      ],
      buttonsa3: ['SOS'],
      buttonsa: ['1/2', '1', '2', '3'],
      custom: '',
      duration: '',
      custom1: '',
      duration1: '',
      time: '',
      time1: '',
      time2: '',
      timea: '',
      timea1: '',
      timea2: '',
      dose: '',
      dose1: '',
      mesure: i18n.t('PATIENTS.TAB'),
      mesure1: i18n.t('PATIENTS.TAB'),
      time_text: false,
      time_text1: false,
      time_text2: false,
      time_texta: false,
      time_texta1: false,
      time_texta2: false,
      query: '',
      query1: '',
      query2: '',
      medicines: [],
      supplements: [],
      vaccines: [],
      note: '',
      note1: '',
      day: '',
      day1: 'Days',
      day2: '',
      day3: 'Days',
      mulImg: [],
      lab_flg: false,
      clear_lab_val: '',
      img_flg: false,
      clear_img_val: '',
      nurs_flg: false,
      clear_nurs_val: '',
      Vaccnotindb: false,
      vaccindb: false,
      Vaccnotindb_data: '',
      selectedValue: true,
      selectedValue2: true,
      selectedValue4: true,
      selectedValue6: true,
      selectedValue8: true,
      selectedValue10: true,
      drugtype_list: [
        i18n.t('PATIENTS.TAB'),
        i18n.t('PATIENTS.CAP'),
        i18n.t('PATIENTS.ML'),
        i18n.t('PATIENTS.MG'),
        i18n.t('PATIENTS.DROPS'),
        i18n.t('PATIENTS.UNIT'),
        i18n.t('PATIENTS.SET'),
        i18n.t('PATIENTS.GM'),
        i18n.t('PATIENTS.MG_ML'),
        i18n.t('PATIENTS.NOS'),
      ],
      films12: [
        {
          title: 'Dolo',
          Dose: '1',
          When: i18n.t('PATIENTS.AFTER_FOOD'),
          Time: 'INDTGAAA000011-1-19AAA000089',
          Duration: 'Chekdin',
        },
        {
          title: 'Mac',
          Dose: '1',
          When: i18n.t('PATIENTS.AFTER_FOOD'),
          Time: 'INDTGAAA000011-1-19AAA000090',
          Duration: 'Consulting',
        },
        {
          title: 'Lenovo',
          Dose: '1',
          When: i18n.t('PATIENTS.AFTER_FOOD'),
          Time: 'INDTGAAA000011-1-19AAA000091',
          Duration: 'Closed',
        },
      ],
      sun: [
        {
          label: 'Default ',
        },
        {
          label: 'Value',
          value: "I'm not same as label",
        },
      ],
      modalVisible: false,
      //   data: [
      //     {
      //         MedicineName: 'Dolo',
      //         Dose : '1',
      //         When: i18n.t('PATIENTS.AFTER_FOOD'),
      //         Time: '6Hours',
      //         Duration:'3 Days'
      //     }
      // ],
      data1: [
        {
          Vaccine: 'Injection',
          Batch: '1',
          Expiry: '14/04/1947',
          Administer: 'Me',
        },
      ],
      tagsSelected: [],
      suggestions: [],
      tagsSelected1: [],
      suggestions1: [],
      tagsSelected2: [],
      suggestions2: [],
      newLabOrders: [],
      newImagingOrders: [],
      NewNursingOrders: [],
    };
    this.updateIndex = this.updateIndex.bind(this);
    this.updateIndex1 = this.updateIndex1.bind(this);
    this.updateIndex2 = this.updateIndex2.bind(this);
    this.updateIndex3 = this.updateIndex3.bind(this);
    this.updateIndex4 = this.updateIndex4.bind(this);
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }
  onPress = (sun) => this.setState({sun});
  handleDelete = (index) => {
    let tagsSelected = this.state.tagsSelected;
    tagsSelected.splice(index, 1);
    this.setState({tagsSelected});
  };
  updateList = async () => {
    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    // alert("Lab Order saved Successfully")
    this.props.screenProps.screen == 'dashboard'
      ? // alert("called2")
        await this.props.getApplyList(myobj)
      : this.props.screenProps.screen == 'timelene'
      ? // alert("called2")
        await this.props.getConsultList(myobj2)
      : null;
  };
  onValueChangeday = (value) => {
    // alert(value)
    this.setState({
      day: value,
    });
  };
  onValueChangedose = (value) => {
    this.setState({
      mesure: value,
    });
  };
  onValueChangedose1 = (value) => {
    this.setState({
      mesure1: value,
    });
  };
  onValueChangeday1 = (value1) => {
    // alert(value1)
    this.setState({
      day1: value1,
    });
  };
  onValueChangeday2 = (value2) => {
    // alert(value)
    this.setState({
      day2: value2,
    });
  };
  onValueChangeday3 = (value3) => {
    // alert(value1)
    this.setState({
      day3: value3,
    });
  };
  vald_text_sup = async (text) => {
    // console.log('achu', text);
    if (text.length > 1) {
      this.setState({query1: text});
    } else {
      this.setState({query1: ''});
      this.setState({junk_medicine1: false});
      return [];
    }
  };
  findSupplement(query1) {
    //method called everytime when we change the value of the input
    if (query1 === '') {
      //if the query is null then return blank
      return [];
    }

    const {supplements} = this.state;

    //alert(regex1)
    //return the filtered film array according the query from the input
    const regex1 = new RegExp(
      `${query1.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
      'i',
    );

    //console.log("regex=" + regex1+" "+JSON.stringify(this.props.medicineList1.message))
    //return the filtered film array according the query from the input
    if (this.state.query1.length > 1) {
      if (
        this.props.medicineList1.message &&
        this.props.medicineList1.message.length > 0
      ) {
        let newdata =
          this.props.medicineList1.message.length > 0 &&
          this.props.medicineList1.message.filter((supplement) => {
            // console.log(
            //   supplement.drug_name +
            //     ' ' +
            //     supplement.drug_name.replace(
            //       /([\.\^\$\*\+\?\(\)\[\{\\\|])/g,
            //       '\\$1',
            //     ),
            // );
            return (
              supplement.drug_name
                .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                .search(regex1) >= 0 ||
              (
                supplement.drug_type != null &&
                supplement.drug_type.replace(
                  /([\.\^\$\*\+\?\(\)\[\{\\\|])/g,
                  '\\$1',
                )
              ).search(regex1) >= 0
            );
          });
        if (this.state.query1.length > 1) {
          if (this.state.query1 != '' && newdata.length > 0) {
            return newdata;
          } else {
            if (!this.state.junk_medicine1) {
              Alert.alert(
                i18n.t('PATIENTS.NOT_AVA'),
                i18n.t('PATIENTS.ADD_PRES'),
                [
                  {
                    text: i18n.t('COMMON.YES'),
                    onPress: () => this.setState({junk_medicine1: true}),
                  },
                  {
                    text: i18n.t('PATIENTS.CANCEL'),
                    onPress: () => {
                      this.setState({query1: ''});
                    },
                  },
                ],
              );
            }
            return [];
          }
        } else {
          return [];
        }
      } else {
        if (!this.state.junk_medicine1) {
          Alert.alert(i18n.t('PATIENTS.NOT_AVA'), i18n.t('PATIENTS.ADD_PRES'), [
            {
              text: i18n.t('COMMON.YES'),
              onPress: () => this.setState({junk_medicine1: true}),
            },
            {
              text: i18n.t('PATIENTS.CANCEL'),
              onPress: () => {
                this.setState({query1: ''});
              },
            },
          ]);
        }
        return [];
      }
    } else {
      return [];
    }
  }
  vald_text_med = async (text) => {
    //console.log('achu', text);
    if (text.length > 1) {
      this.setState({query: text});
    } else {
      this.setState({query: ''});
      this.setState({junk_medicine: false});
      return [];
    }
  };
  findMedicine(query) {
    //console.log(query, this.state.junk_medicine, this.state.query.length);
    //method called everytime when we change the value of the input
    if (query == '') {
      //if the query is null then return blank
      return [];
    }

    const {medicines} = this.state;
    //making a case insensitive regular expression to get similar value from the film json

    const regex = new RegExp(
      `${query.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
      'i',
    );

    //   return the filtered film array according the query from the input
    //console.log("123"+medicines)
    if (this.state.query.length > 1) {
      if (medicines) {
        console.log('yes');
        let newdata = medicines.filter(
          (medicine) =>
            medicine.drug_name
              .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
              .search(regex) >= 0 ||
            (medicine.drug_type != null &&
              medicine.drug_type
                .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                .search(regex) >= 0),
        );

        if (this.state.query.length > 1) {
          if (this.state.query != '' && newdata.length > 0) {
            return newdata;
          } else {
            if (!this.state.junk_medicine) {
              Alert.alert(
                i18n.t('PATIENTS.MED_NOT'),
                i18n.t('PATIENTS.ADD_PRES'),
                [
                  {
                    text: i18n.t('COMMON.YES'),
                    onPress: () => this.setState({junk_medicine: true}),
                  },
                  {
                    text: i18n.t('PATIENTS.CANCEL'),
                    onPress: () => {
                      this.setState({query1: ''});
                    },
                  },
                ],
              );
            }
            return [];
          }
        } else {
          return [];
        }
      } else {
        if (!this.state.junk_medicine) {
          Alert.alert(i18n.t('PATIENTS.MED_NOT'), i18n.t('PATIENTS.ADD_PRES'), [
            {
              text: i18n.t('COMMON.YES'),
              onPress: () => this.setState({junk_medicine1: true}),
            },
            {
              text: i18n.t('PATIENTS.CANCEL'),
              onPress: () => {
                this.setState({query1: ''});
              },
            },
          ]);
        }
        return [];
      }
    } else {
      return [];
    }
  }

  findVaccineData(query2) {
    //method called everytime when we change the value of the input
    if (query2 === '') {
      return [];
    }
    if (query2.length <= 1 && this.state.vaccindb == true) {
      this.saveVaccData1(query2);
    }
    const {vaccines} = this.state;
    const regex = new RegExp(
      `${query2.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
      'i',
    );
    let newData = [];
    newData =
      vaccines.length > 0
        ? vaccines.filter(
            (vaccine) =>
              vaccine.vaccine_brand_name
                .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                .search(regex) >= 0,
          )
        : [];
    // console.log('vacc_newData', newData);
    if (newData.length > 0) {
      return newData;
    } else {
      if (this.state.vaccindb == false) {
        alert(i18n.t('PATIENTS.VACC_NOT'));
        //     console.log("this.state.Vaccnotindb"+this.state.Vaccnotindb+"this.state.vaccindb"+this.state.vaccindb)
        //     if(this.state.Vaccnotindb==false && this.state.vaccindb==false){
        //     console.log("dshih")
        //     Alert.alert('Alert','This Service is not available, Do you want to Add to Prescription?',
        //     [
        //         {
        //             text: "Yes", onPress: () =>{this.saveVaccData(query2)}
        //         },
        //         {
        //             text: "Cancel", onPress: () => { this.setState({ query2: "" }) }
        //         }
        //     ]
        //    )
        //    return [];
        //  }else{
        this.saveVaccData1(query2);
      }
      return [];
      //}
    }
  }

  saveVaccData = async (query2) => {
    this.setState({Vaccnotindb: true});
    this.setState({Vaccnotindb_data: query2});
  };
  saveVaccData1 = async (query2) => {
    this.setState({vaccindb: false});
    this.setState({query2: ''});
    //this.setState({Vaccnotindb_data:query2});
  };

  closeOverlay = async () => {
    this.setState({
      visible: false,
      selectedIndex: 1,
      selectedIndex1: 6,
      selectedIndex2: 1,
      selectedIndex3: 'undefined',
      selectedIndex4: '',
      drug_id: '',
      junk_medicine: false,
      time_text: true,
      time_text1: true,
      time_text2: true,
      time: '08:00 AM',
      time1: '02:00 PM',
      time2: '09:00 PM',
      day: '',
      day1: 'Days',
      custom: '',
      duration: '',
      query: '',
      dose: '',
      note: '',
      ban3: true,
      ban4: false,
      lb: 'Add',
    });
  };

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file) {
    const filePath = file.path;
    ImageResizer.createResizedImage(filePath, 800, 650, 'JPEG', 50, 0)
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
            this.checkConvert(
              this.UPLOAD_ID,
              this.UPLOAD_ENC_ID,
              this.SERVICE_LIST_ID,
              this.SERVICE_TYPE,
            );
          }, 250);
        }
      })
      .catch((err) => {});
  }

  chooseFile = (id, encid, service_list_id, servicetype) => {
    /* var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }; */

    this.UPLOAD_ID = id;
    this.UPLOAD_ENC_ID = encid;
    this.SERVICE_LIST_ID = service_list_id;
    this.SERVICE_TYPE = servicetype;
    this.fileSelRef.current.openPicker();

    /*ImagePicker.showImagePicker(options, (response) => {
      if (Platform.OS === 'android') {
        const {error, path, originalRotation} = response;
        if (path && !error) {
          let rotation = 0;

          if (originalRotation === 90) {
            rotation = 360;
          } else if (originalRotation === 270) {
            rotation = 360;
          }

          ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, rotation)
            .then(({path}) => {
              this.setState({path});
              path1 = path;
              console.log('path', path);
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
              } else {
                let source;
                console.log('123');
                source = {path: path1};
                console.log(source.path);
                console.log('Achu', source.path);
                if (path1.split('.')[1] == 'pdf') {
                  this.setState({pdfpath: path1});
                } else {
                  console.log('else');
                  this.state.mulImg.push(path1);
                  console.log('else1');
                  this.setState({mulImg: this.state.mulImg});
                  //   this.convertPDF(source.path);
                  this.checkConvert(id, encid, service_list_id, servicetype);
                }
              }
            })
            .catch((err) => {
              console.log('err', err);

              //  return Alert.alert( 'Unable to resize the photo', 'Please try again!' )
            });
        } else if (error) {
          console.log(
            'The photo picker errored. Check ImagePicker.launchCamera func',
          );
          console.log(error);
        }
      }
      if (Platform.OS === 'ios') {
        source = {path: response.uri.replace('file://', '')};

        // let source = { path: response.path };
        if (source.path.split('.')[1] == 'pdf') {
          this.setState({pdfpath: source.path});
        } else {
          this.state.mulImg.push(source.path);
          this.setState({mulImg: this.state.mulImg});
          this.checkConvert(id, encid, service_list_id, servicetype);
        }
      }
    });*/
  };

  checkConvert = (id, encid, service_list_id, servicetype) => {
    Alert.alert(
      i18n.t('PATIENTS.IMG_ORDER'),
      i18n.t('PATIENTS.ADD_MORE'),
      [
        {
          text: i18n.t('COMMON.YES'),
          onPress: () =>
            this.chooseFile(id, encid, service_list_id, servicetype),
        },
        {
          text: i18n.t('PATIENTS.CANCEL'),
          onPress: () =>
            this.convertPDF(id, encid, service_list_id, servicetype),
        },
      ],
      {cancelable: false},
    );
  };
  convertPDF = async (id, encid, service_list_id, servicetype) => {
    this.setState({load1: true});
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: encid + '-' + service_list_id + '-' + id + '.pdf',
        maxSize: {
          width: 900,
          height: 1200,
        },
        quality: 0.5,
      };

      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({mulImg: []});
      this.setState({pdfpath: pdf.filePath});
      let pt = [
        {
          name:
            servicetype == 'img'
              ? 'img'
              : servicetype == 'lab'
              ? 'lab'
              : 'nursing',
          filename: encid + '-' + service_list_id + '-' + id + '.pdf',
          type: 'application/pdf',
          data: RNFetchBlob.wrap(pdf.filePath),
        },
        {
          name: 'encounter_id',
          data: encid,
        },
        {
          name:
            servicetype == 'img'
              ? 'img_id'
              : servicetype == 'lab'
              ? 'lab_id'
              : 'nursing_id',
          data: id,
        },
        {
          name: 'docid',
          data: global.doctor_id,
        },
        {
          name: 'token',
          data: global.token,
        },
      ];

      let url =
        servicetype == 'img'
          ? getBaseUrl() + 'img_pdf/'
          : servicetype == 'lab'
          ? getBaseUrl() + 'lab_pdf/'
          : getBaseUrl() + 'nursing_pdf/';
      let response = await RNFetchBlob.fetch(
        'POST',
        url,
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
        },
        pt,
      )
        .then((response) => response.json())
        .then(async (response) => {
          // console.log(' enc inserted res=' + JSON.stringify(response));
          this.setState({load1: false});
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
      this.setState({load1: false});
      if (
        response.message == 'File Added Successfully' ||
        response.message == 'successfully' ||
        response.message == 'success'
      ) {
        this.PlanAlert.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.FILE_UPLOAD'),
          type: 'success',
          icon: 'auto',
        });
        await this.updateList();
        if (global.screen == 'dashboard') {
          await this.setState({
            plan_data: this.props.applyList.message,
          });
        } else if (global.screen == 'timelene') {
          await this.setState({
            plan_data: this.props.consultList.message,
          });
        }
      } else {
        alert(i18n.t('PATIENTS.FILE_NOT'));
      }
    } catch (e) {}
  };
  closeOverlay1 = () => {
    this.setState({
      visible1: false,
      selectedIndexa: 1,
      selectedIndexa1: 6,
      selectedIndexa2: 1,
      selectedIndexa3: 'undefined',
      selectedIndexa4: '',
      drug_id1: '',
      junk_medicine1: false,
      time_texta: true,
      time_texta1: true,
      time_texta2: true,
      timea: '08:00 AM',
      timea1: '02:00 PM',
      timea2: '09:00 PM',
      day3: 'Days',
      day2: '',
      custom1: '',
      duration1: '',
      query1: '',
      dose1: '',
      note1: '',
      ban2: false,
      ban1: true,
    });
  };
  closeOverlay2 = () => {
    this.setState({visible2: false});
  };
  closeOverlay3 = () => {
    this.setState({visible3: false});
  };
  closeOverlay4 = () => {
    this.setState({visible4: false});
  };
  closeOverlay5 = () => {
    this.setState({
      visible5: false,
      query2: '',
      vaccindb: false,
    });
  };
  closeOverlay6 = () => {
    this.setState({visible6: false});
  };
  closeOverlay7 = () => {
    this.setState({visible7: false});
  };
  closeOverlay8 = () => {
    this.setState({visible8: false});
  };
  updateIndex = async (selectedIndex) => {
    // this.setState({selectedIndex}
    if (selectedIndex != undefined) {
      this.setState({selectedIndex, dose: ''});
    } else if (this.state.dose != '') {
      this.setState({
        selectedIndex: 'undefined',
      });
    } else {
      //this.setState({selectedIndex})
    }
    //   if(selectedIndex==this.state.selectedIndex){
    //  this.setState({
    //   selectedIndex:""
    // })
    //   }
  };
  updateIndexa = async (selectedIndexa) => {
    //  this.setState({selectedIndexa})
    if (selectedIndexa != undefined) {
      this.setState({selectedIndexa, dose1: ''});
    } else if (this.state.dose1 != '') {
      this.setState({
        selectedIndexa: 'undefined',
      });
    } else {
      //this.setState({selectedIndexa})
    }
    //   if(selectedIndex==this.state.selectedIndex){
    //  this.setState({
    //   selectedIndex:""
    // })
    //   }

    //  alert("hi"+this.state.buttonsa[selectedIndexa])
  };
  updateIndex1 = async (selectedIndex1) => {
    // alert(this.state.custom)
    if (selectedIndex1 != undefined) {
      this.setState({selectedIndex1, custom: ''});
    } else if (this.state.custom != '') {
      this.setState({
        selectedIndex1: 'undefined',
      });
    } else {
    }
    if (selectedIndex1 <= 4) {
      this.setState({
        time: '09:00 AM',
        time_text: true,
        time_text1: false,
        time_text2: false,
      });
    } else if (selectedIndex1 == 5) {
      this.setState({
        time: '09:00 AM',
        time1: '09:00 PM',
        time_text1: true,
        time_text: false,
        time_text2: false,
      });
    } else if (selectedIndex1 == 6) {
      this.setState({
        time: '08:00 AM',
        time1: '02:00 PM',
        time2: '09:00 PM',
        time_text2: true,
        time_text1: false,
        time_text: false,
      });
    } else {
      this.setState({
        time_text: false,
        time_text1: false,
        time_text2: false,
      });
    }
    //    if(selectedIndex1==this.state.selectedIndex1){
    //   this.setState({
    //    selectedIndex1:""
    //  })
    //    }

    //  alert("hi"+this.state.buttons1[selectedIndex1])
  };
  updateIndex2 = async (selectedIndex2) => {
    if (selectedIndex2 != undefined) {
      this.setState({selectedIndex2, duration: ''});
      if (this.state.day1 == '' || this.state.day1 == undefined) {
        this.setState({
          day1: 'Days',
        });
      }
    } else if (this.state.duration != '') {
      this.setState({
        selectedIndex2: 'undefined',
      });
    } else {
      //  this.setState({selectedIndex2})
    }
    //    if(selectedIndex2==this.state.selectedIndex2){
    //   this.setState({
    //    selectedIndex2:""
    //  })
    //    }

    // alert("hi"+this.state.selectedIndex)
  };
  updateIndex4 = async (selectedIndex4) => {
    this.setState({selectedIndex4});
  };
  updateIndexa4 = async (selectedIndexa4) => {
    this.setState({selectedIndexa4});
  };
  updateIndexa2 = async (selectedIndexa2) => {
    if (selectedIndexa2 != undefined) {
      this.setState({selectedIndexa2, duration1: ''});
      if (this.state.day3 == '' || this.state.day3 == undefined) {
        this.setState({
          day3: 'Days',
        });
      }
    } else if (this.state.duration1 != '') {
      this.setState({
        selectedIndexa2: 'undefined',
      });
    } else {
      //this.setState({selectedIndexa2})
    }
    //    if(selectedIndex2==this.state.selectedIndex2){
    //   this.setState({
    //    selectedIndex2:""
    //  })
    //    }

    // alert("hi"+this.state.selectedIndex)
  };
  updateIndex3 = async (selectedIndex3) => {
    if (this.state.selectedIndex3 == 0) {
      this.setState({selectedIndex3: 'undefined'});
    } else {
      this.setState({
        selectedIndex3,
        selectedIndex2: 'undefined',
        duration: '',
      });
    }
  };

  updateIndexa3 = async (selectedIndexa3) => {
    if (this.state.selectedIndexa3 == 0) {
      this.setState({selectedIndexa3: 'undefined'});
    } else {
      this.setState({
        selectedIndexa3,
        selectedIndexa2: 'undefined',
        duration1: '',
      });
    }
  };
  updateIndexa1 = async (selectedIndexa1) => {
    //console.log(selectedIndexa1);
    if (selectedIndexa1 != undefined) {
      this.setState({selectedIndexa1, custom1: ''});
    }
    // alert(this.state.custom)
    else if (this.state.custom1 != '') {
      this.setState({
        selectedIndexa1: 'undefined',
      });
    } else {
    }
    if (selectedIndexa1 <= 4) {
      this.setState({
        timea: '09:00 AM',
        time_texta: true,
        time_texta1: false,
        time_texta2: false,
      });
    } else if (selectedIndexa1 == 5) {
      this.setState({
        timea: '09:00 AM',
        timea1: '09:00 PM',
        time_texta1: true,
        time_texta: false,
        time_texta2: false,
      });
    } else if (selectedIndexa1 == 6) {
      this.setState({
        timea: '08:00 AM',
        timea1: '02:00 PM',
        timea2: '09:00 PM',
        time_texta2: true,
        time_texta1: false,
        time_texta: false,
      });
    } else {
      this.setState({
        time_texta: false,
        time_texta1: false,
        time_texta2: false,
      });
    }
    //    if(selectedIndex1==this.state.selectedIndex1){
    //   this.setState({
    //    selectedIndex1:""
    //  })
    //    }

    //  alert("hi"+this.state.buttons1[selectedIndex1])
  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  handleAddition = (suggestion) => {
    //console.log('Added lab order', suggestion);
    this.state.newLabOrders.push(suggestion);
    let value_exists = Boolean;
    // console.log('Added lab order state', this.state.newLabOrders);
    this.state.newLabOrders.forEach(
      (item) =>
        //console.log('Includes', this.state.tagsSelected.includes(item)),
        (value_exists = this.state.tagsSelected.includes(item)),

      //console.log('Includes', arr.includes(item)),
    );
    if (value_exists == true) {
      console.log('lab Order Already Exists');
      alert(i18n.t('PATIENTS.LAB_ALREADY'));
    } else {
      console.log('lab Order Added to list');
      this.setState({
        tagsSelected: this.state.tagsSelected.concat([suggestion]),
      });
    }

    //this.setState({tagsSelected: this.state.tagsSelected.concat([suggestion])});
    this.setState({clear_lab_val: ''});
  };
  handleDelete1 = (index) => {
    let tagsSelected1 = this.state.tagsSelected1;
    tagsSelected1.splice(index, 1);
    this.setState({tagsSelected1});
  };
  add_medicine = async () => {
    //alert(this.state.query)
    console.log('addmedicine');
    if (this.state.query == '') {
      alert(i18n.t('PATIENTS.ENTER_MEDICINE'));
    } else {
      console.log('addmedicine1');
      let uniquecheck = this.state.medicines_data.filter((item) => {
        //  console.log(item.drug_name.trim()==this.state.query.split("(")[0].trim())
        //  console.log(item.drug_name.trim()+" "+this.state.query.split("(")[0].trim())
        // console.log(item.drug_name + " " + this.state.query.split("|")[0].trim());
        // console.log(item.trade_name + " " + this.state.query.split("|")[0].trim());
        // console.log(item.drug_id + " " + this.state.drug_id);
        if (item.drug_name != 'undefined') {
          return item.drug_id != null && item.drug_id != 0
            ? item.drug_id == this.state.drug_id
            : item.trade_name
            ? item.trade_name.trim() ==
              (this.state.query.includes('|')
                ? this.state.query.split('|')[0].trim()
                : this.state.query)
            : item.drug_name.trim() ==
              (this.state.query.includes('|')
                ? this.state.query.split('|')[0].trim()
                : this.state.query);
        }
      });
      // console.log(JSON.stringify(uniquecheck));
      // console.log(uniquecheck.length);
      if (uniquecheck.length == 0) {
        // console.log(uniquecheck, 'uniquecheck');
        // console.log('addmedicine2');
        this.setState({visible: false, load1: true});
        const docname = await AsyncStorage.getItem('doctorname');
        let timevalue = '';
        if (this.state.time1 == '' && this.state.time2 == '') {
          timevalue = this.state.time;
        } else if (this.state.time1 != '' && this.state.time2 == '') {
          timevalue = this.state.time + ',' + this.state.time1;
        } else {
          timevalue =
            this.state.time + ',' + this.state.time1 + ',' + this.state.time2;
        }
        let ob = JSON.stringify({
          // this.state.medicines
          docid: global.doctor_id,
          hlpid: this.props.screenProps.hlpid,
          enc_id: this.props.screenProps.enc_id,
          drug_id: this.state.drug_id ? this.state.drug_id : '',
          // "size":this.state.buttons[Number(this.state.selectedIndex)],
          size:
            this.state.selectedIndex != 'undefined'
              ? this.state.buttons[Number(this.state.selectedIndex)] +
                ' ' +
                this.state.mesure
              : this.state.dose + ' ' + this.state.mesure,
          trade_name: this.state.query.includes('(')
            ? this.state.query.split('(')[0] +
              '|' +
              this.state.query.split('(')[1]
            : this.state.query + ' |  ',
          duration:
            this.state.selectedIndex2 != 'undefined'
              ? this.state.buttons2[Number(this.state.selectedIndex2)].split(
                  ' ',
                )[0] +
                ' ' +
                this.state.day1
              : this.state.duration != ''
              ? this.state.duration + ' ' + this.state.day1
              : '',
          timings:
            this.state.selectedIndex1 != 'undefined'
              ? this.state.buttons1[Number(this.state.selectedIndex1)]
              : this.state.custom,
          dose_unit: this.state.mesure,
          time_unit: this.state.day,
          notes: this.state.note,
          before_after:
            this.state.selectedIndex4 != 'undefined'
              ? this.state.buttons4[Number(this.state.selectedIndex4)]
              : '',
          sostablet:
            this.state.selectedIndex3 != 'undefined'
              ? this.state.buttons3[Number(this.state.selectedIndex3)]
              : 'undefined',
          drug_intake_timing: timevalue,
          username: docname,
          token: global.token,
        });
        // console.log('save_medc', ob);
        // console.log(
        //   ob +
        //     ' ' +
        //     this.state.buttons4[Number(this.state.selectedIndex4)] +
        //     ' ' +
        //     this.state.selectedIndex4,
        // );
        await this.props.getAddmedList(ob);
        console.log('ob', ob, this.props.addmedList.message);
        if (
          this.props.addmedList.message == 'Prescription added Successfully'
        ) {
          console.log('data', this.props.addmedList.message);
          this.state.deletesection = 'Medicine';
          await this.updateList();
          if (global.screen == 'dashboard') {
            let med_data = this.props.applyList.message.prescriptions.filter(
              (item) => item.medicine_type == 'med',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.screenProps.check_status.toLowerCase() ==
              'reconsulting'
            ) {
              this.state.medicines_data = med_data;
            } else {
              let med_data2 = this.props.applyList.message.prescriptions.filter(
                (item) => item.from == 'json',
              );
              this.state.medicines_data =
                med_data2.length > 0
                  ? this.props.applyList.message.prescriptions
                  : med_data;
            }
          } else if (global.screen == 'timelene') {
            let med_data = this.props.consultList.message.prescriptions.filter(
              (item) => item.medicine_type == 'med',
            );
            this.state.plan_data = this.props.consultList.message;
            this.state.medicines_data = med_data;
          }
        }

        this.setState({
          load1: false,
          isPlanModified: true,
        });
        this.props.changeTabData(-1);
        this.PlanAlert.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.MED_ADD'),
          type: 'success',
          icon: 'auto',
        });
      } else {
        alert(i18n.t('PATIENTS.MED_ALERT'));
      }
    }
  };
  add_medicine2 = async () => {
    if (this.state.query == '') {
      alert(i18n.t('PATIENTS.ENTER_MEDICINE'));
    } else {
      let uniquecheck = this.state.medicines_data.filter((item) => {
        return item.drug_id != null && item.drug_id != 0
          ? item.drug_id == this.state.drug_id
          : item.trade_name
          ? item.trade_name.trim() ==
            (this.state.query.includes('|')
              ? this.state.query.split('|')[0].trim()
              : this.state.query)
          : item.drug_name.trim() ==
            (this.state.query.includes('|')
              ? this.state.query.split('|')[0].trim()
              : this.state.query);
      });
      if (uniquecheck.length == 0) {
        this.setState({visible: false, load1: true});
        const docname = await AsyncStorage.getItem('doctorname');
        let timevalue = '';
        if (this.state.time1 == '' && this.state.time2 == '') {
          timevalue = this.state.time;
        } else if (this.state.time1 != '' && this.state.time2 == '') {
          timevalue = this.state.time + ',' + this.state.time1;
        } else {
          timevalue =
            this.state.time + ',' + this.state.time1 + ',' + this.state.time2;
        }
        let mesure = this.state.mesure || this.state.mesuretemp;
        let ob = JSON.stringify({
          docid: global.doctor_id,
          hlpid: this.props.screenProps.hlpid,
          enc_id: this.props.screenProps.enc_id,
          drug_id: this.state.drug_id ? this.state.drug_id : '',
          // "size":this.state.buttons[Number(this.state.selectedIndex)],
          size:
            this.state.selectedIndex != 'undefined'
              ? this.state.buttons[Number(this.state.selectedIndex)] +
                ' ' +
                this.state.mesure
              : this.state.dose + ' ' + this.state.mesure,
          trade_name: this.state.query.includes('(')
            ? this.state.query.split('(')[0] +
              '|' +
              this.state.query.split('(')[1]
            : this.state.query + ' |  ',
          duration:
            this.state.selectedIndex2 != 'undefined'
              ? this.state.buttons2[Number(this.state.selectedIndex2)].split(
                  ' ',
                )[0] +
                ' ' +
                this.state.day1
              : this.state.duration != ''
              ? this.state.duration + ' ' + this.state.day1
              : '',
          timings:
            this.state.selectedIndex1 != 'undefined'
              ? this.state.buttons1[Number(this.state.selectedIndex1)]
              : this.state.custom,
          dose_unit: this.state.mesure,
          time_unit: this.state.day,
          notes: this.state.note,
          before_after:
            this.state.selectedIndex4 != 'undefined'
              ? this.state.buttons4[Number(this.state.selectedIndex4)]
              : '',
          sostablet:
            this.state.selectedIndex3 != 'undefined'
              ? this.state.buttons3[Number(this.state.selectedIndex3)]
              : 'undefined',
          drug_intake_timing: timevalue,
          username: docname,
          token: global.token,
        });
        console.log('ob', ob);
        await this.props.getAddmedList(ob);
        if (this.props.addmedList.message == 'Prescription added') {
          this.state.deletesection = 'Medicine';
          await this.updateList();
          if (global.screen == 'dashboard') {
            let med_data = this.props.applyList.message.prescriptions.filter(
              (item) => item.medicine_type == 'med',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.screenProps.check_status.toLowerCase() ==
              'reconsulting'
            ) {
              this.state.medicines_data = med_data;
            } else {
              let med_data2 = this.props.applyList.message.prescriptions.filter(
                (item) => item.from == 'json',
              );
              this.state.medicines_data =
                med_data2.length > 0
                  ? this.props.applyList.message.prescriptions
                  : med_data;
            }
          } else if (global.screen == 'timelene') {
            let med_data = this.props.consultList.message.prescriptions.filter(
              (item) => item.medicine_type == 'med',
            );
            (this.state.plan_data = this.props.consultList.message),
              (this.state.medicines_data = med_data);
          }
          this.setState({
            load1: false,
            isPlanModified: true,
            selectedIndex: 1,
            selectedIndex1: 6,
            selectedIndex2: 1,
            drug_id: '',
            selectedIndex3: 'undefined',
            selectedIndex4: '',
            junk_medicine: false,
            time_text: true,
            time_text1: true,
            time_text2: true,
            time: '08:00 AM',
            time1: '02:00 PM',
            time2: '09:00 PM',
            day1: 'Days',
            day: '',
            custom: '',
            duration: '',
            query: '',
            dose: '',
            note: '',
          });
        }
        this.PlanAlert2.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.MED_ADD'),
          type: 'success',
          icon: 'auto',
        });
      } else {
        alert(i18n.t('PATIENTS.MED_ALERT'));

        this.setState({
          load1: false,
          isPlanModified: true,
          selectedIndex: 1,
          selectedIndex1: 6,
          selectedIndex2: 1,
          drug_id: '',
          selectedIndex3: 'undefined',
          selectedIndex4: '',
          junk_medicine: false,
          time_text: true,
          time_text1: true,
          time_text2: true,
          time: '08:00 AM',
          time1: '02:00 PM',
          time2: '09:00 PM',
          day1: 'Days',
          day: '',
          custom: '',
          duration: '',
          query: '',
          dose: '',
          note: '',
        });
      }
    }
  };
  add_medicine1 = async () => {
    if (this.state.query1 == '') {
      alert(i18n.t('PATIENTS.ENTER_SUPP'));
    } else {
      let uniquecheck = this.state.supplements_data.filter((item) => {
        // console.log(item.prescription_id + ' comp ' + this.state.drug_id1);
        // console.log(item.trade_name + ' comp ' + this.state.query1);
        // console.log(item.drug_name + ' comp ' + this.state.query1);
        return item.drug_id != null && item.drug_id != 0
          ? item.drug_id == this.state.drug_id1
          : item.trade_name
          ? item.trade_name.trim() ==
            (this.state.query1.includes('|')
              ? this.state.query1.split('|')[0].trim()
              : this.state.query1)
          : item.drug_name.trim() ==
            (this.state.query1.includes('|')
              ? this.state.query1.split('|')[0].trim()
              : this.state.query1);
      });
      // console.log(uniquecheck.length);
      if (uniquecheck.length == 0) {
        this.setState({visible1: false, load1: true});
        const docname = await AsyncStorage.getItem('doctorname');
        let timevaluea = '';
        if (this.state.timea1 == '' && this.state.timea2 == '') {
          timevaluea = this.state.timea;
        } else if (this.state.timea1 != '' && this.state.timea2 == '') {
          timevaluea = this.state.timea + ',' + this.state.timea1;
        } else {
          timevaluea =
            this.state.timea +
            ',' +
            this.state.timea1 +
            ',' +
            this.state.timea2;
        }
        let ob = JSON.stringify({
          docid: global.doctor_id,
          hlpid: this.props.screenProps.hlpid,
          enc_id: this.props.screenProps.enc_id,
          drug_id: this.state.drug_id1 ? this.state.drug_id1 : '',
          // "size":this.state.buttonsa[Number(this.state.selectedIndexa)], +
          size:
            this.state.selectedIndexa != 'undefined'
              ? this.state.buttonsa[Number(this.state.selectedIndexa)] +
                ' ' +
                this.state.mesure1
              : this.state.dose1 + ' ' + this.state.mesure1,
          trade_name: this.state.query1.includes('(')
            ? this.state.query1.split('(')[0] +
              '|' +
              this.state.query1.split('(')[1]
            : this.state.query1 + ' |  ',
          duration:
            this.state.selectedIndexa2 != 'undefined'
              ? this.state.buttonsa2[Number(this.state.selectedIndexa2)].split(
                  ' ',
                )[0] +
                ' ' +
                this.state.day3
              : this.state.duration1 != ''
              ? this.state.duration1 + ' ' + this.state.day3
              : '',
          timings_sup:
            this.state.selectedIndexa1 != 'undefined'
              ? this.state.buttonsa1[Number(this.state.selectedIndexa1)]
              : this.state.custom1,
          dose_unit: this.state.mesure1,
          time_unit: this.state.day2,
          notes: this.state.note1,
          before_after:
            this.state.selectedIndexa4 != 'undefined'
              ? this.state.buttons4[Number(this.state.selectedIndexa4)]
              : '',
          sostablet_sup:
            this.state.selectedIndexa3 != 'undefined'
              ? this.state.buttonsa3[Number(this.state.selectedIndexa3)]
              : 'undefined',
          drug_intake_timing: timevaluea,
          username: docname,
          token: global.token,
        });
        await this.props.getAddmedList1(ob);
        if (this.props.addmedList1.message == 'Supplement added Successfully') {
          this.state.deletesection = 'Supplement';
          await this.updateList();
          if (global.screen == 'dashboard') {
            let sup_data = this.props.applyList.message.supplements.filter(
              (item) => item.medicine_type == 'sup',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.screenProps.check_status.toLowerCase() ==
              'reconsulting'
            ) {
              this.state.supplements_data = sup_data;
            } else {
              let med_data2 = this.props.applyList.message.supplements.filter(
                (item) => item.from == 'json',
              );
              this.state.supplements_data =
                med_data2.length > 0
                  ? this.props.applyList.message.supplements
                  : sup_data;
            }
          } else if (global.screen == 'timelene') {
            let sup_data = this.props.consultList.message.supplements.filter(
              (item) => item.medicine_type == 'sup',
            );
            (this.state.plan_data = this.props.consultList.message),
              (this.state.supplements_data = sup_data);
          }
        }
        this.setState({
          load1: false,
          isPlanModified: true,
        });
        this.props.changeTabData(-1);
        this.PlanAlert.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.SUPP_ADDED'),
          type: 'success',
          icon: 'auto',
        });
      } else {
        alert(i18n.t('PATIENTS.SUPP_EXIST'));
      }
    }
  };
  add_medicine3 = async () => {
    if (this.state.query1 == '') {
      alert(i18n.t('PATIENTS.ENTER_SUPP'));
    } else {
      let uniquecheck = this.state.supplements_data.filter((item) => {
        return item.drug_id != null && item.drug_id != 0
          ? item.drug_id == this.state.drug_id1
          : item.trade_name
          ? item.trade_name.trim() ==
            (this.state.query1.includes('|')
              ? this.state.query1.split('|')[0].trim()
              : this.state.query1)
          : item.drug_name.trim() ==
            (this.state.query1.includes('|')
              ? this.state.query1.split('|')[0].trim()
              : this.state.query1);
      });
      //alert(JSON.stringify(uniquecheck))
      if (uniquecheck.length == 0) {
        this.setState({load1: true});
        const docname = await AsyncStorage.getItem('doctorname');
        let timevaluea = '';
        if (this.state.timea1 == '' && this.state.timea2 == '') {
          timevaluea = this.state.timea;
        } else if (this.state.timea1 != '' && this.state.timea2 == '') {
          timevaluea = this.state.timea + ',' + this.state.timea1;
        } else {
          timevaluea =
            this.state.timea +
            ',' +
            this.state.timea1 +
            ',' +
            this.state.timea2;
        }
        let ob = {
          docid: global.doctor_id,
          hlpid: this.props.screenProps.hlpid,
          enc_id: this.props.screenProps.enc_id,
          drug_id: this.state.drug_id1 ? this.state.drug_id1 : '',
          // "size":this.state.buttonsa[Number(this.state.selectedIndexa)], +
          size:
            this.state.selectedIndexa != 'undefined'
              ? this.state.buttonsa[Number(this.state.selectedIndexa)] +
                ' ' +
                this.state.mesure1
              : this.state.dose1 + ' ' + this.state.mesure1,
          trade_name: this.state.query1.includes('(')
            ? this.state.query1.split('(')[0] +
              '|' +
              this.state.query1.split('(')[1]
            : this.state.query1 + ' |  ',
          duration:
            this.state.selectedIndexa2 != 'undefined'
              ? this.state.buttonsa2[Number(this.state.selectedIndexa2)].split(
                  ' ',
                )[0] +
                ' ' +
                this.state.day3
              : this.state.duration1 != ''
              ? this.state.duration1 + ' ' + this.state.day3
              : '',
          timings_sup:
            this.state.selectedIndexa1 != 'undefined'
              ? this.state.buttonsa1[Number(this.state.selectedIndexa1)]
              : this.state.custom1,
          dose_unit: this.state.mesure1,
          time_unit: this.state.day2,
          notes: this.state.note1,
          before_after:
            this.state.selectedIndexa4 != 'undefined'
              ? this.state.buttons4[Number(this.state.selectedIndexa4)]
              : '',
          sostablet_sup:
            this.state.selectedIndexa3 != 'undefined'
              ? this.state.buttonsa3[Number(this.state.selectedIndexa3)]
              : 'undefined',
          drug_intake_timing: timevaluea,
          username: docname,
          token: global.token,
        };
        await this.props.getAddmedList1(ob);
        if (this.props.addmedList1.message == 'Supplement added Successfully') {
          this.setState({deletesection: 'Supplement'});
          await this.updateList();
          if (global.screen == 'dashboard') {
            let sup_data = this.props.applyList.message.supplements.filter(
              (item) => item.medicine_type == 'sup',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.screenProps.check_status.toLowerCase() ==
              'reconsulting'
            ) {
              this.state.supplements_data = sup_data;
            } else {
              let med_data2 = this.props.applyList.message.supplements.filter(
                (item) => item.from == 'json',
              );
              this.state.supplements_data =
                med_data2.length > 0
                  ? this.props.applyList.message.supplements
                  : sup_data;
            }
          } else if (global.screen == 'timelene') {
            let sup_data = this.props.consultList.message.supplements.filter(
              (item) => item.medicine_type == 'sup',
            );
            await this.setState({
              plan_data: this.props.consultList.message,
              supplements_data: sup_data,
            });
          }
        }
        this.setState({
          load1: false,
          isPlanModified: true,
          selectedIndexa: 1,
          selectedIndexa1: 6,
          selectedIndexa2: 1,
          selectedIndexa3: 'undefined',
          selectedIndexa4: '',
          drug_id1: '',
          junk_medicine1: false,
          time_texta: true,
          time_texta1: true,
          time_texta2: true,
          timea: '08:00 AM',
          timea1: '02:00 PM',
          timea2: '09:00 PM',
          day3: 'Days',
          day2: '',
          custom1: '',
          duration1: '',
          query1: '',
          dose1: '',
          note1: '',
        });
        this.PlanAlert2.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.SUPP_ADDED'),
          type: 'success',
          icon: 'auto',
        });
      } else {
        alert(i18n.t('PATIENTS.SUPP_EXIST'));
        this.setState({
          load1: false,
          isPlanModified: true,
          selectedIndexa: 1,
          selectedIndexa1: 6,
          selectedIndexa2: 1,
          selectedIndexa3: 'undefined',
          selectedIndexa4: '',
          drug_id1: '',
          junk_medicine1: false,
          time_texta: true,
          time_texta1: true,
          time_texta2: true,
          timea: '08:00 AM',
          timea1: '02:00 PM',
          timea2: '09:00 PM',
          day3: 'Days',
          day2: '',
          custom1: '',
          duration1: '',
          query1: '',
          dose1: '',
          note1: '',
        });
      }
    }
  };
  delete_temp_medicine = async (value) => {
    this.setState({load1: true});
    await this.props.deleteTempMedicineData({
      docid: global.doctor_id,
      presc_id: value,
      hlp_id: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      token: global.token,
    });

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (
      this.props.deleteTempMedicineResponse.message == 'Successfully Deleted'
    ) {
      //  this.setState({load1:false})
      //alert("Delete Medicine Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let med_data = this.props.applyList.message.prescriptions.filter(
          (item) => item.medicine_type == 'med',
        );
        this.state.plan_data = this.props.applyList.message;
        if (
          this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
        ) {
          this.state.medicines_data = med_data;
        } else {
          let med_data2 = this.props.applyList.message.prescriptions.filter(
            (item) => item.from == 'json',
          );
          this.state.medicines_data =
            med_data2.length > 0
              ? this.props.applyList.message.prescriptions
              : med_data;
        }
      } else if (global.screen == 'timelene') {
        let med_data = this.props.consultList.message.prescriptions.filter(
          (item) => item.medicine_type == 'med',
        );
        await this.setState({
          plan_data: this.props.consultList.message,
          medicines_data: med_data,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.MED_DELE'),
      type: 'success',
      icon: 'auto',
    });
    // alert("hi"+this.props.delList.message)
  };
  delete_medicine = async (value, version_status) => {
    this.setState({load1: true});

    await this.props.getDelList({
      docid: global.doctor_id,
      prescription_id: value,
      token: global.token,
      version_status: version_status,
    });

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (this.props.delList.message == 'Prescription deleted Successfully') {
      //  this.setState({load1:false})
      //alert("Delete Medicine Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let med_data = this.props.applyList.message.prescriptions.filter(
          (item) => item.medicine_type == 'med',
        );
        this.state.plan_data = this.props.applyList.message;
        if (
          this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
        ) {
          this.state.medicines_data = med_data;
        } else {
          let med_data2 = this.props.applyList.message.prescriptions.filter(
            (item) => item.from == 'json',
          );
          this.state.medicines_data =
            med_data2.length > 0
              ? this.props.applyList.message.prescriptions
              : med_data;
        }
      } else if (global.screen == 'timelene') {
        let med_data = this.props.consultList.message.prescriptions.filter(
          (item) => item.medicine_type == 'med',
        );
        await this.setState({
          plan_data: this.props.consultList.message,
          medicines_data: med_data,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.MED_DELE'),
      type: 'success',
      icon: 'auto',
    });
    //   // alert("hi"+this.props.delList.message)
  };
  delete_temp_supplement = async (value) => {
    this.setState({load1: true});
    await this.props.deleteTempSupplementData({
      docid: global.doctor_id,
      supl_id: value,
      hlp_id: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      token: global.token,
    });
    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (
      this.props.deleteTempSupplementResponse.message == 'Successfully Deleted'
    ) {
      //this.setState({load1:false})
      //
      //alert("Supplement Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let sup_data = this.props.applyList.message.supplements.filter(
          (item) => item.medicine_type == 'sup',
        );

        this.state.plan_data = this.props.applyList.message;
        if (
          this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
        ) {
          this.state.supplements_data = sup_data;
        } else {
          let med_data2 = this.props.applyList.message.supplements.filter(
            (item) => item.from == 'json',
          );
          this.state.supplements_data =
            med_data2.length > 0
              ? this.props.applyList.message.supplements
              : sup_data;
        }
      } else if (global.screen == 'timelene') {
        let sup_data = this.props.consultList.message.supplements.filter(
          (item) => item.medicine_type == 'sup',
        );
        await this.setState({
          plan_data: this.props.consultList.message,
          supplements_data: sup_data,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.SUPP_DELE'),
      type: 'success',
      icon: 'auto',
    });
  };
  delete_supplement = async (value, version_status) => {
    this.setState({load1: true});
    await this.props.getDelList1({
      docid: global.doctor_id,
      supplement_id: value,
      token: global.token,
      version_status: version_status,
    });
    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (this.props.delList1.message == 'Supplement deleted Successfully') {
      //this.setState({load1:false})
      //
      //alert("Supplement Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let sup_data = this.props.applyList.message.supplements.filter(
          (item) => item.medicine_type == 'sup',
        );
        this.state.plan_data = this.props.applyList.message;
        if (
          this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
        ) {
          this.state.supplements_data = sup_data;
        } else {
          let med_data2 = this.props.applyList.message.supplements.filter(
            (item) => item.from == 'json',
          );
          this.state.supplements_data =
            med_data2.length > 0
              ? this.props.applyList.message.supplements
              : sup_data;
        }
      } else if (global.screen == 'timelene') {
        let sup_data = this.props.consultList.message.supplements.filter(
          (item) => item.medicine_type == 'sup',
        );
        await this.setState({
          plan_data: this.props.consultList.message,
          supplements_data: sup_data,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.SUPP_DELE'),
      type: 'success',
      icon: 'auto',
    });
    // alert("hi"+this.props.delList1.message)
  };
  onValueduration = (value) => {
    this.setState({
      duration: value,
      selectedIndex2: 'undefined',
    });
    if (this.state.day1 == '' || this.state.day1 == undefined) {
      this.setState({
        day1: 'Days',
      });
    }
  };
  onValueduration1 = (value1) => {
    this.setState({
      duration1: value1,
      selectedIndexa2: 'undefined',
    });
    if (this.state.day3 == '' || this.state.day3 == undefined) {
      this.setState({
        day3: 'Days',
      });
    }
  };
  onValuecustom = (value) => {
    this.setState({
      custom: value,
      selectedIndex1: 'undefined',
      time_text: true,
      time_text1: false,
      time_text2: false,
    });
  };
  onValuecustom1 = (value) => {
    this.setState({
      custom1: value,
      selectedIndexa1: 'undefined',
      time_texta: true,
      time_texta1: false,
      time_texta2: false,
    });
  };
  setTimeData = (time) => {
    this.setState({
      time: time,
    });
  };
  setTimeData1 = (time) => {
    this.setState({
      time1: time,
    });
  };
  setTimeData2 = (time) => {
    this.setState({
      time2: time,
    });
  };
  setTimeDataa = (time) => {
    this.setState({
      timea: time,
    });
  };
  setTimeDataa1 = (time) => {
    this.setState({
      timea1: time,
    });
  };
  setTimeDataa2 = (time) => {
    this.setState({
      timea2: time,
    });
  };
  savePlan = async (isCheckupAlert) => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let obj = JSON.stringify({
      docid: this.props.screenProps.docid,
      hlpid: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      treatment_notes: this.state.treatment_notes
        ? this.state.treatment_notes
        : '',
      interoffice_notes: this.state.interoffice_notes
        ? this.state.interoffice_notes
        : '',
      diet_notes: '',
      followup_date: '',
      followup_notes: this.state.followup_notes
        ? this.state.followup_notes
        : '',
      username: docname,
      token: this.props.screenProps.token,
    });
    // console.log('savePlan_obj', obj);
    await this.props.savePlanData(obj);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (this.props.saveplanresponse.message) {
      console.log('response',saveplanrespone.message)
      this.setState({isPlanModified: false, load1: false});
      if (this.PlanAlert && this.PlanAlert.showMessage) {
        if (isCheckupAlert) {
          this.props.screenProps.showCheckupAlert({
            message: i18n.t('PATIENTS.SUB_SUCC'),
            description: i18n.t('PATIENTS.PLAN_SUCC'),
            type: 'success',
            icon: 'auto',
          });
        } else {
          this.PlanAlert.showMessage({
            message: i18n.t('PATIENTS.PLAN_SAVE'),
            // description: i18n.t('PATIENTS.PLAN_SUCC'),
            type: 'success',
            icon: 'auto',
          });
        }
      }
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        // alert("called2"+JSON.stringify(this.props.applyList.message.plan))
        if (
          this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
        ) {
          if (this.props.applyList.message.plan.edit != []) {
            await this.setState({
              treatment_notes:
                this.props.applyList.message.plan.edit.treatment_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
              interoffice_notes:
                this.props.applyList.message.plan.edit.interoffice_notes,
            });
          } else {
            this.state.interoffice_notes =
              this.props.applyList.message.plan.show.interoffice_notes;
          }

          await this.setState({
            treatment_notes1:
              this.props.applyList.message.plan.show.treatment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
            followup_notes: this.props.applyList.message.plan.followup_notes,
          });
        } else {
          await this.setState({
            treatment_notes: this.props.applyList.message.plan.treatment_notes,
            interoffice_notes:
              this.props.applyList.message.plan.interoffice_notes,
            followup_notes: this.props.applyList.message.plan.followup_notes,
          });
        }
      } else if (global.screen == 'timelene') {
        if (this.props.consultList.message.plan.edit != []) {
          console.log('inside edit');
          this.setState({
            treatment_notes:
              this.props.consultList.message.plan.edit.treatment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
            interoffice_notes:
              this.props.consultList.message.plan.edit.interoffice_notes,
          });
        } else {
          console.log('outside edit');
          if (
            this.props.consultList.message &&
            this.props.consultList.message.plan &&
            this.props.consultList.message.plan.show &&
            this.props.consultList.message.plan.show.interoffice_notes
          ) {
            this.state.interoffice_notes =
              this.props.consultList.message.plan.show.interoffice_notes;
          }
        }
        // console.log('intraaa', this.state.interoffice_notes);
        this.setState({
          treatment_notes1:
            this.props.consultList.message.plan.show.treatment_notes != null &&
            this.props.consultList.message.plan.show.treatment_notes != '' &&
            this.props.consultList.message.plan.show.treatment_notes !=
              undefined
              ? this.props.consultList.message.plan.show.treatment_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
          //this.props.consultList.message.plan.show.treatment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi, "").replace(/<\s*[\/]?pre\s*[\/]?>/gi, "").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
          //
          followup_notes: this.props.consultList.message.plan.followup_notes,
        });
      }
    }
  };
  treat() {
    if (this.state.hidet == false) {
      this.setState({
        hidet: true,
      });
    } else if (this.state.hidet == true) {
      this.setState({
        hidet: false,
      });
    }
  }

  componentDidUpdate = (nextProps) => {};

  componentDidMount = async () => {
    if (Platform.OS === 'android') {
      try {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]).then((granted) => {
          Object.entries(granted).map(([key, value]) => {
            console.log(key, value);
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    this._unsubscribe = this.props.navigation.addListener('didBlur', () => {
      if (this.state.isPlanModified) {
        Alert.alert(i18n.t('PATIENTS.ALERT'), i18n.t('PATIENTS.PLAN_DATA1'), [
          {
            text: i18n.t('COMMON.NO'),
            onPress: () => {
              this.getPlanData();
              this.setState({isPlanModified: false});
            },
          },
          {
            text: i18n.t('COMMON.YES'),
            onPress: () => {
              this.savePlan(true);
            },
          },
        ]);
      }
      console.warn('did blur called in Plan');
    });
    this.getPlanData();
  };
  updatems1 = async () => {
    //   let timevalue="";
    //     if(this.state.time1==""&&this.state.time2==""){
    //   timevalue=this.state.time
    //     }
    //     else if( this.state.time1!=""&&this.state.time2==""){
    //       timevalue=this.state.time+","+this.state.time1
    //     }else{
    //       timevalue=this.state.time+","+this.state.time1+","+this.state.time2
    //     }
    //     const docname = await AsyncStorage.getItem('doctorname');
    //   let ob=JSON.stringify({
    //   "docid": global.doctor_id,
    //   "hlpid": this.props.screenProps.hlpid,
    //   "enc_id": this.props.screenProps.enc_id,
    //   "size": this.state.buttons[Number(this.state.selectedIndex)],
    //   "trade_name": this.state.query.split("(")[0]+"|"+this.state.query.split("(")[1],
    //   "duration": this.state.selectedIndex2!="undefined"?this.state.buttons2[Number(this.state.selectedIndex2)]:this.state.duration+" "+this.state.day1,
    //   "timings": this.state.selectedIndex1!="undefined"?this.state.buttons1[Number(this.state.selectedIndex1)] :this.state.custom+" "+this.state.day,
    //   "notes": this.state.note,
    //   "before_after": this.state.buttons4[Number(this.state.selectedIndex4)],
    //   "sostablet":this.state.selectedIndex3!="undefined"?this.state.buttons3[Number(this.state.selectedIndex3)]:"undefined",
    //   "drug_intake_timing": timevalue,
    //   "username": docname,
    //   "presc_id":this.state.med_id,
    //   "edit_table":"1",
    //   "med_type":"med",
    //   "db_json_flag":this.state.from,
    //   "token": global.token
    // })
    // // alert(ob)
    // await this.props.getUpdatemsList(ob)
    // alert(JSON.stringify(this.props.updatemsList.message))
    //updated successfully
    if (this.state.query == '') {
      alert(i18n.t('PATIENTS.ENTER_MEDICINE'));
    } else {
      this.setState({visible: false, load1: true});
      let timevalue = '';
      if (this.state.buttons1[Number(this.state.selectedIndex1)] == Thrice) {
        timevalue =
          this.state.time + ',' + this.state.time1 + ',' + this.state.time2;
      } else if (
        this.state.buttons1[Number(this.state.selectedIndex1)] == Twice
      ) {
        timevalue = this.state.time + ',' + this.state.time1;
      } else {
        timevalue = this.state.time;
      }
      const docname = await AsyncStorage.getItem('doctorname');
      // console.log('this.state.drug_id', this.state.drug_id);
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlpid: this.props.screenProps.hlpid,
        enc_id: this.props.screenProps.enc_id,
        size: (this.state.selectedIndex != 'undefined'
          ? this.state.buttons[Number(this.state.selectedIndex)] +
            ' ' +
            this.state.mesure
          : this.state.dose + ' ' + this.state.mesure
        ).replace('false', ''),
        trade_name: this.state.query.includes('(')
          ? this.state.query.split('(')[0] +
            '|' +
            this.state.query.split('(')[1]
          : this.state.query + '|' + this.state.mesure,
        duration: (this.state.selectedIndex2 != 'undefined' &&
        this.state.selectedIndex2 != -1
          ? this.state.buttons2[Number(this.state.selectedIndex2)].split(
              ' ',
            )[0] +
            ' ' +
            this.state.day1
          : this.state.duration != '' && this.state.duration != false
          ? this.state.duration + ' ' + this.state.day1
          : ''
        ).replace('false', ''),
        timings: (this.state.selectedIndex1 != 'undefined' &&
        this.state.selectedIndex1 != -1
          ? this.state.buttons1[Number(this.state.selectedIndex1)]
          : this.state.custom
        ).replace('false', ''),
        notes: this.state.note,
        drug_id: this.state.drug_id,
        dose_unit: this.state.mesure,
        time_unit: this.state.day,
        before_after:
          this.state.selectedIndex4 != -1 &&
          this.state.selectedIndex4 != 'undefined'
            ? this.state.buttons4[Number(this.state.selectedIndex4)]
            : '',
        sostablet:
          this.state.selectedIndex3 != 'undefined'
            ? this.state.buttons3[Number(this.state.selectedIndex3)]
            : 'undefined',
        drug_intake_timing: timevalue,
        username: docname,
        presc_id: this.state.med_id,
        edit_table: '1',
        med_type: 'med',
        db_json_flag: this.state.from,
        token: global.token,
      });
      //console.log('updatelist', ob);
      // console.log(
      //   ob +
      //     ' ' +
      //     this.state.buttons2[Number(this.state.selectedIndex2)] +
      //     ' ' +
      //     this.state.selectedIndex2,
      // );
      await this.props.getUpdatemsList(ob);
      // alert(JSON.stringify(this.props.editmsList.message))
      let myobj = JSON.stringify({
        docid: this.props.screenProps.docid,
        token: this.props.screenProps.token,
        consulting: 'consulting',
        hlpid: this.props.screenProps.hlpid,
        enc: this.props.screenProps.enc_id,
        chief: this.props.screenProps.chief,
        uid: this.props.screenProps.uid,
        template_id: this.props.screenProps.template_id,
        template_name: this.props.screenProps.template_name,
        app_type: this.props.screenProps.app_type,
        username: this.props.screenProps.patientname,
      });
      let myobj2 = JSON.stringify({
        uid: this.props.screenProps.uid2,
        enc: this.props.screenProps.enc_id,
        docid: this.props.screenProps.docid,
        token: this.props.screenProps.token,
        hlpid: this.props.screenProps.hlpid,
      });
      if (this.props.updatemsList.message == 'updated successfully') {
        // console.log(this.props.addmedList)
        //  alert("Medicine added Successfully")
        this.setState({deletesection: 'Medicine'});
        this.props.screenProps.screen == 'dashboard'
          ? // alert("called2")
            await this.props.getApplyList(myobj)
          : this.props.screenProps.screen == 'timelene'
          ? // alert("called2")
            await this.props.getConsultList(myobj2)
          : null;
        if (global.screen == 'dashboard') {
          let med_data = this.props.applyList.message.prescriptions.filter(
            (item) => item.medicine_type == 'med',
          );
          // let sup_data=this.props.applyList.message.prescriptions.filter(item=>item.medicine_type=="sup");
          if (
            this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
          ) {
            this.state.medicines_data = med_data;
          } else {
            let med_data2 = this.props.applyList.message.prescriptions.filter(
              (item) => item.from == 'json',
            );
            this.state.medicines_data =
              med_data2.length > 0
                ? this.props.applyList.message.prescriptions
                : med_data;
          }
        } else if (global.screen == 'timelene') {
          let med_data = this.props.consultList.message.prescriptions.filter(
            (item) => item.medicine_type == 'med',
          );
          await this.setState({
            plan_data: this.props.consultList.message,
            medicines_data: med_data,
            //  selectedIndex: "",
            //        selectedIndex1: "undefined",
            //        selectedIndex2: "undefined",
            //        selectedIndex3: "undefined",
            //        selectedIndex4: "",
            //        time:"",
            //        time1:"",
            //        time2:"",
            //        custom:"",
            //        duration:"",
            //        query:"",
            //        note:""
          });
        }
        this.props.changeTabData(-1);
        this.closeOverlay();
        this.setState({load1: false, visible: false, isPlanModified: true});
        this.PlanAlert.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.PLAN_SUCC_TXT'),
          type: 'success',
          icon: 'auto',
        });
      }
    }
  };
  updatems2 = async () => {
    //   let timevalue="";
    //     if(this.state.time1==""&&this.state.time2==""){
    //   timevalue=this.state.time
    //     }
    //     else if( this.state.time1!=""&&this.state.time2==""){
    //       timevalue=this.state.time+","+this.state.time1
    //     }else{
    //       timevalue=this.state.time+","+this.state.time1+","+this.state.time2
    //     }
    //     const docname = await AsyncStorage.getItem('doctorname');
    //   let ob=JSON.stringify({
    //   "docid": global.doctor_id,
    //   "hlpid": this.props.screenProps.hlpid,
    //   "enc_id": this.props.screenProps.enc_id,
    //   "size": this.state.buttons[Number(this.state.selectedIndex)],
    //   "trade_name": this.state.query.split("(")[0]+"|"+this.state.query.split("(")[1],
    //   "duration": this.state.selectedIndex2!="undefined"?this.state.buttons2[Number(this.state.selectedIndex2)]:this.state.duration+" "+this.state.day1,
    //   "timings": this.state.selectedIndex1!="undefined"?this.state.buttons1[Number(this.state.selectedIndex1)] :this.state.custom+" "+this.state.day,
    //   "notes": this.state.note,
    //   "before_after": this.state.buttons4[Number(this.state.selectedIndex4)],
    //   "sostablet":this.state.selectedIndex3!="undefined"?this.state.buttons3[Number(this.state.selectedIndex3)]:"undefined",
    //   "drug_intake_timing": timevalue,
    //   "username": docname,
    //   "presc_id":this.state.med_id,
    //   "edit_table":"1",
    //   "med_type":"med",
    //   "db_json_flag":this.state.from,
    //   "token": global.token
    // })
    // // alert(ob)
    // await this.props.getUpdatemsList(ob)
    // alert(JSON.stringify(this.props.updatemsList.message))
    //updated successfully
    if (this.state.query1 == '') {
      alert(i18n.t('PATIENTS.ENTER_MEDICINE'));
    } else {
      this.setState({visible1: false, load1: true});
      const docname = await AsyncStorage.getItem('doctorname');
      let timevaluea = '';
      if (this.state.buttonsa1[Number(this.state.selectedIndexa1)] == Thrice) {
        timevaluea =
          this.state.timea + ',' + this.state.timea1 + ',' + this.state.timea2;
      } else if (
        this.state.buttonsa1[Number(this.state.selectedIndexa1)] == Twice
      ) {
        timevaluea = this.state.timea + ',' + this.state.timea1;
      } else {
        timevaluea = this.state.timea;
      }
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlpid: this.props.screenProps.hlpid,
        enc_id: this.props.screenProps.enc_id,
        size: (this.state.selectedIndexa != 'undefined' &&
        this.state.selectedIndexa != -1
          ? this.state.buttonsa[Number(this.state.selectedIndexa)] +
            ' ' +
            this.state.mesure1
          : this.state.dose1 + ' ' + this.state.mesure1
        ).replace('false', ''),
        trade_name: this.state.query1.includes('(')
          ? this.state.query1.split('(')[0] +
            '|' +
            this.state.query1.split('(')[1]
          : this.state.query1 + '|' + this.state.mesure1,
        duration: (this.state.selectedIndexa2 != 'undefined' &&
        this.state.selectedIndexa2 != -1
          ? this.state.buttonsa2[Number(this.state.selectedIndexa2)].split(
              ' ',
            )[0] +
            ' ' +
            this.state.day3
          : this.state.duration1 != '' && this.state.duration1 != false
          ? this.state.duration1 + ' ' + this.state.day3
          : ''
        ).replace('false', ''),
        timings: (this.state.selectedIndexa1 != 'undefined' &&
        this.state.selectedIndexa1 != -1
          ? this.state.buttonsa1[Number(this.state.selectedIndexa1)]
          : this.state.custom1
        ).replace('false', ''),
        notes: this.state.note1,
        dose_unit: this.state.mesure1,
        drug_id: this.state.drug_id1,
        time_unit: this.state.day2,
        before_after:
          this.state.selectedIndexa4 != -1 &&
          this.state.selectedIndexa4 != 'undefined'
            ? this.state.buttons4[Number(this.state.selectedIndexa4)]
            : '',
        sostablet:
          this.state.selectedIndexa3 != 'undefined'
            ? this.state.buttonsa3[Number(this.state.selectedIndexa3)]
            : 'undefined',
        drug_intake_timing: timevaluea,
        username: docname,
        presc_id: this.state.sup_id,
        edit_table: '1',
        med_type: 'sup',
        db_json_flag: this.state.from1,
        token: global.token,
      });
      await this.props.getUpdatemsList(ob);
      // alert(JSON.stringify(this.props.editmsList.message+ob))
      // alert(JSON.stringify(this.props.updatemsList.message+ob))
      let myobj = JSON.stringify({
        docid: this.props.screenProps.docid,
        token: this.props.screenProps.token,
        consulting: 'consulting',
        hlpid: this.props.screenProps.hlpid,
        enc: this.props.screenProps.enc_id,
        chief: this.props.screenProps.chief,
        uid: this.props.screenProps.uid,
        template_id: this.props.screenProps.template_id,
        template_name: this.props.screenProps.template_name,
        app_type: this.props.screenProps.app_type,
        username: this.props.screenProps.patientname,
      });
      let myobj2 = JSON.stringify({
        uid: this.props.screenProps.uid2,
        enc: this.props.screenProps.enc_id,
        docid: this.props.screenProps.docid,
        token: this.props.screenProps.token,
        hlpid: this.props.screenProps.hlpid,
      });
      if (this.props.updatemsList.message == 'updated successfully') {
        // console.log(this.props.addmedList)
        //  alert("Medicine added Successfully")
        // this.setState({load1:false})
        this.setState({deletesection: 'Supplement'});
        // alert("Supplement added Successfully")
        this.props.screenProps.screen == 'dashboard'
          ? // alert("called2")
            await this.props.getApplyList(myobj)
          : this.props.screenProps.screen == 'timelene'
          ? // alert("called2")
            await this.props.getConsultList(myobj2)
          : null;
        if (global.screen == 'dashboard') {
          let sup_data = this.props.applyList.message.supplements.filter(
            (item) => item.medicine_type == 'sup',
          );

          this.state.plan_data = this.props.applyList.message;
          if (
            this.props.screenProps.check_status.toLowerCase() == 'reconsulting'
          ) {
            this.state.supplements_data = sup_data;
          } else {
            let med_data2 = this.props.applyList.message.supplements.filter(
              (item) => item.from == 'json',
            );
            this.state.supplements_data =
              med_data2.length > 0
                ? this.props.applyList.message.supplements
                : sup_data;
          }
          //  selectedIndexa: "",
          //     selectedIndexa1: "undefined",
          //     selectedIndexa2: "undefined",
          //     selectedIndexa3: "undefined",
          //     selectedIndexa4: "",
          //     timea:"",
          //     timea1:"",
          //     timea2:"",
          //     custom1:"",
          //     duration1:"",
          //     query1:"",
          //     note1:""
        } else if (global.screen == 'timelene') {
          let sup_data = this.props.consultList.message.supplements.filter(
            (item) => item.medicine_type == 'sup',
          );
          await this.setState({
            plan_data: this.props.consultList.message,
            supplements_data: sup_data,
            //  selectedIndexa: "",
            //     selectedIndexa1: "undefined",
            //     selectedIndexa2: "undefined",
            //     selectedIndexa3: "undefined",
            //     selectedIndexa4: "",
            //     timea:"",
            //     timea1:"",
            //     timea2:"",
            //     custom1:"",
            //     duration1:"",
            //     query1:"",
            //     note1:""
          });
        }
        this.props.changeTabData(-1);
        this.closeOverlay1();
        this.setState({load1: false, visible: false, isPlanModified: true});
        this.PlanAlert.showMessage({
          message: i18n.t('PATIENTS.SUB_SUCC'),
          description: i18n.t('PATIENTS.PLAN_SUCC1'),
          type: 'success',
          icon: 'auto',
        });
      }
    }
  };
  getPlanData = async () => {
    let obdata3 = JSON.stringify({
      enc_id: this.props.screenProps.enc_id,
      docid: global.doctor_id,
      hlp_id: this.props.screenProps.hlpid,
      token: global.token,
    });
    await this.props.getVaccineOrderData(obdata3);
    this.setState({
      vaccines: this.props.fetchingVaccineResponse.message,
      imaging_encounter: this.props.timelineList.message
        ? this.props.timelineList.message[0].enc_id
        : '',
      lab_encounter: this.props.timelineList.message
        ? this.props.timelineList.message[0].enc_id
        : '',
      selectedIndexa: 1,
      selectedIndexa1: 6,
      selectedIndexa2: 1,
      selectedIndexa4: 1,
      selectedIndex: 1,
      selectedIndex1: 6,
      selectedIndex2: 1,
      selectedIndex4: 1,
      time_text: true,
      time_text1: true,
      time_text2: true,
      time_texta: true,
      time_texta1: true,
      time_texta2: true,
      time: '08:00 AM',
      time1: '02:00 PM',
      time2: '09:00 PM',
      timea: '08:00 AM',
      timea1: '02:00 PM',
      timea2: '09:00 PM',
    });

    if (global.screen == 'dashboard') {
      //alert(JSON.stringify(this.props.applyList.message.prescriptions))
      let med_data2 = this.props.applyList.message.prescriptions.filter(
        (item) => item.from == 'json',
      );
      let med_data = this.props.applyList.message.prescriptions
        ? this.props.applyList.message.prescriptions.filter(
            (item) => item.medicine_type == 'med',
          )
        : [];
      let sup_data = this.props.applyList.message.supplements
        ? this.props.applyList.message.supplements.filter(
            (item) => item.medicine_type == 'sup',
          )
        : [];
      if (this.props.screenProps.check_status.toLowerCase() == 'reconsulting') {
        if (this.props.applyList.message.plan.edit != '') {
          this.setState({
            treatment_notes:
              this.props.applyList.message.plan.edit.treatment_notes != null &&
              this.props.applyList.message.plan.edit.treatment_notes != '' &&
              this.props.applyList.message.plan.edit.treatment_notes !=
                undefined
                ? this.props.applyList.message.plan.edit.treatment_notes
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
            interoffice_notes:
              this.props.applyList.message.plan.edit.interoffice_notes !=
                null &&
              this.props.applyList.message.plan.edit.interoffice_notes != '' &&
              this.props.applyList.message.plan.edit.interoffice_notes !=
                undefined
                ? this.props.applyList.message.plan.edit.interoffice_notes
                    .replace(/<br\s*[\/]?>/gi, '\n')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                    .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
                : '',
          });
        } else {
          this.state.interoffice_notes =
            this.props.applyList.message.plan.show.interoffice_notes != null &&
            this.props.applyList.message.plan.show.interoffice_notes != '' &&
            this.props.applyList.message.plan.show.interoffice_notes !=
              undefined
              ? this.props.applyList.message.plan.show.interoffice_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '';
        }
        //alert(JSON.stringify(this.props.applyList.message.imaging))

        this.setState({
          time_hidet1: true,
          time_hidet: false,
          plan_data: this.props.applyList.message,
          medicines_data: med_data,
          supplements_data: sup_data,
          // treatment_notes:
          // this.props.applyList.message.plan.treatment_notes!=null&&this.props.applyList.message.plan.treatment_notes!=""&&this.props.applyList.message.plan.treatment_notes!=undefined
          // ?this.props.applyList.message.plan.treatment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'):"",
          treatment_notes1:
            this.props.applyList.message.plan.show.treatment_notes != null &&
            this.props.applyList.message.plan.show.treatment_notes != '' &&
            this.props.applyList.message.plan.show.treatment_notes != undefined
              ? this.props.applyList.message.plan.show.treatment_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
          followup_notes:
            this.props.applyList.message.plan.followup_notes != undefined &&
            this.props.applyList.message.plan.followup_notes != '' &&
            this.props.applyList.message.plan.followup_notes != null
              ? this.props.applyList.message.plan.followup_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
        });
        //alert(this.state.treatment_notes+" "+this.props.applyList.message.plan.edit.treatment_notes)
        if (this.props.applyList.message.plan.edit.treatment_notes != '') {
          this.setState({hidet: true});
        } else {
          this.setState({hidet: false});
        }
      } else {
        await this.setState({
          time_hidet: true,
          time_hidet1: false,
          plan_data: this.props.applyList.message,
          medicines_data:
            med_data2.length > 0
              ? this.props.applyList.message.prescriptions
              : med_data,
          supplements_data:
            med_data2.length > 0
              ? this.props.applyList.message.supplements
              : sup_data,
          interoffice_notes:
            this.props.applyList.message.plan.interoffice_notes != null &&
            this.props.applyList.message.plan.interoffice_notes != '' &&
            this.props.applyList.message.plan.interoffice_notes != undefined
              ? this.props.applyList.message.plan.interoffice_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
          followup_notes:
            this.props.applyList.message.plan.followup_notes != undefined &&
            this.props.applyList.message.plan.followup_notes != '' &&
            this.props.applyList.message.plan.followup_notes != null
              ? this.props.applyList.message.plan.followup_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
          treatment_notes:
            this.props.applyList.message.plan.treatment_notes != null &&
            this.props.applyList.message.plan.treatment_notes != '' &&
            this.props.applyList.message.plan.treatment_notes != undefined
              ? this.props.applyList.message.plan.treatment_notes
                  .replace(/<br\s*[\/]?>/gi, '\n')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                  .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
              : '',
        });
      }
    } else if (global.screen == 'timelene') {
      //alert(JSON.stringify(this.props.consultList.message))
      if (this.props.consultList.message.plan.edit != '') {
        this.setState({
          treatment_notes:
            this.props.consultList.message.plan.edit.treatment_notes != '' &&
            this.props.consultList.message.plan.edit.treatment_notes != null &&
            this.props.consultList.message.plan.edit.treatment_notes !=
              undefined &&
            this.props.consultList.message.plan.edit.treatment_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
          interoffice_notes:
            this.props.consultList.message.plan.edit.interoffice_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
        });
      } else {
        if (
          this.props.consultList.message &&
          this.props.consultList.message.plan &&
          this.props.consultList.message.plan.show &&
          this.props.consultList.message.plan.show.interoffice_notes
        ) {
          this.state.interoffice_notes =
            this.props.consultList.message.plan.show.interoffice_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');
        }
      }

      let med_data = this.props.consultList.message.prescriptions.filter(
        (item) => item.medicine_type == 'med',
      );
      let sup_data = this.props.consultList.message.supplements.filter(
        (item) => item.medicine_type == 'sup',
      );
      await this.setState({
        plan_data: this.props.consultList.message,
        medicines_data: med_data,
        supplements_data: sup_data,
        // treatment_notes:
        // this.props.consultList.message.plan.treatment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
        // interoffice_notes:this.props.consultList.message.plan.interoffice_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<\s*[\/]?pre\s*[\/]?>/gi,"").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
        treatment_notes1:
          this.props.consultList.message.plan.show.treatment_notes != null &&
          this.props.consultList.message.plan.show.treatment_notes != '' &&
          this.props.consultList.message.plan.show.treatment_notes != undefined
            ? this.props.consultList.message.plan.show.treatment_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : '',
        // this.props.consultList.message.plan.show.treatment_notes.replace(/<br\s*[\/]?>/gi, '\n').replace(/<\s*[\/]?pre\s*[\/]?>/gi, "").replace(/<\s*[\/]?pre\s*[\/]?>/gi, "").replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
        followup_notes:
          this.props.consultList.message.plan.followup_notes != null
            ? this.props.consultList.message.plan.followup_notes
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
                .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t')
            : '',
        time_hidet1: true,
        time_hidet: false,
      });
      if (this.state.treatment_notes != '') {
        this.setState({hidet: true});
      } else {
        this.setState({hidet: false});
      }
    }

    console.log('plan2244' + JSON.stringify(this.props.ServicesList.message));
    {
      this.props.ServicesList &&
        this.props.ServicesList.message &&
        this.props.ServicesList.message != '' &&
        this.props.ServicesList.message.lab &&
        this.props.ServicesList.message.lab != '1' &&
        this.props.ServicesList.message.lab.map((item) => {
          let obj = {
            name: item.service_name,
            id: item.service_master_id,
          };
          this.state.suggestions.push(obj);
        });
    }

    {
      this.props.ServicesList &&
        this.props.ServicesList.message &&
        this.props.ServicesList.message != '' &&
        this.props.ServicesList.message.imaging &&
        this.props.ServicesList.message.imaging != '1' &&
        this.props.ServicesList.message.imaging.map((item) => {
          let obj = {
            name: item.service_name,
            id: item.service_master_id,
          };
          this.state.suggestions1.push(obj);
        });
    }
    {
      this.props.ServicesList &&
        this.props.ServicesList.message &&
        this.props.ServicesList.message != '' &&
        this.props.ServicesList.message.nursing &&
        this.props.ServicesList.message.nursing != '1' &&
        this.props.ServicesList.message.nursing.map((item) => {
          let obj = {
            name: item.service_name,
            id: item.service_master_id,
          };
          this.state.suggestions2.push(obj);
        });
    }
    //   await this.props.getMedicineList({
    //     "type":"medicine",
    //     "key":"",
    //     "docid":global.doctor_id,
    //     "token":global.token
    // })
    // await this.props.getMedicineList1({
    //   "type":"vaccine",
    //   "key":"",
    //   "docid":global.doctor_id,
    //   "token":global.token
    // })

    let newData =
      this.props.timelineList.message != 0
        ? this.props.timelineList.message.filter(
            (item) => item.enc_id == this.state.imaging_encounter,
          )
        : [];
    let newData2 =
      this.props.timelineList.message != 0
        ? this.props.timelineList.message.filter(
            (item) => item.enc_id == this.state.lab_encounter,
          )
        : [];
    this.setState({
      suggestions: this.state.suggestions,
      imaging_encountersList: newData,
      lab_encountersList: newData2,
      medicines: this.props.medicineList.message,
      supplements: this.props.medicineList1.message,
    });
    //  alert("plan1l"+JSON.stringify(this.state.medicines_data))
  };
  handleAddition1 = (suggestion1) => {
    this.state.newImagingOrders.push(suggestion1);
    let value_imageorder_exists = Boolean;

    this.state.newImagingOrders.forEach(
      (item) =>
        //console.log('Includes', this.state.tagsSelected.includes(item)),
        (value_imageorder_exists = this.state.tagsSelected1.includes(item)),

      //console.log('Includes', arr.includes(item)),
    );
    if (value_imageorder_exists == true) {
      console.log('Image Order Already Selected');
      alert(i18n.t('PATIENTS.IMAGE'));
    } else {
      console.log('Image Order Added to list');
      this.setState({
        tagsSelected1: this.state.tagsSelected1.concat([suggestion1]),
      });
    }

    // this.setState({
    //   tagsSelected1: this.state.tagsSelected1.concat([suggestion1]),
    // });
    this.setState({clear_img_val: ''});
  };
  add_md() {
    this.setState({
      visible: true,
    });
  }
  add_md1() {
    this.setState({
      visible1: true,
    });
  }
  handleDelete2 = (index) => {
    let tagsSelected2 = this.state.tagsSelected2;
    tagsSelected2.splice(index, 1);
    this.setState({tagsSelected2});
  };

  handleAddition2 = (suggestion2) => {
    this.state.NewNursingOrders.push(suggestion2);
    let value_Nursing_exists = Boolean;

    this.state.NewNursingOrders.forEach(
      (item) =>
        //console.log('Includes', this.state.tagsSelected.includes(item)),
        (value_Nursing_exists = this.state.tagsSelected2.includes(item)),

      //console.log('Includes', arr.includes(item)),
    );
    if (value_Nursing_exists == true) {
      console.log('Nursing Service Already Exists');
      alert(i18n.t('PATIENTS.NURSE_ORDER'));
    } else {
      console.log('Nursing Order Added to list');
      this.setState({
        tagsSelected2: this.state.tagsSelected2.concat([suggestion2]),
      });
    }
    // this.setState({
    //   tagsSelected2: this.state.tagsSelected2.concat([suggestion2]),
    // });
    this.setState({clear_nurs_val: ''});
  };

  addlab1 = async () => {
    let tagsSelected = this.state.tagsSelected;
    let obj = {
      name: this.state.set_labval.toUpperCase(),
      id: this.state.set_labval.toUpperCase(),
    };
    this.setState({tagsSelected: this.state.tagsSelected.concat([obj])});
    this.setState({lab_flg: false});
    this.setState({clear_lab_val: ''});
  };

  addlab = async (text) => {
    this.setState({clear_lab_val: text.nativeEvent.text});
    let query = text.nativeEvent.text;
    const {suggestions} = this.state;
    if (query.length > 1) {
      const regex = new RegExp(
        `${query.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
        'i',
      );
      console.log('suggestions 123', suggestions);
      let newdata = suggestions.filter(
        (medicine) =>
          medicine.name
            .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
            .search(regex) >= 0,
      );
      // (medicine.name.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')).search(regex) >= 0 ||
      // (medicine.id != null && (medicine.id.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')).search(regex) >= 0))
      if (query != '' && newdata.length > 0) {
        return newdata;
      } else {
        Alert.alert('Alert', i18n.t('PATIENTS.SERVICE'), [
          {
            text: i18n.t('COMMON.YES'),
            onPress: () =>
              this.setState({
                lab_flg: true,
                set_labval: query,
                clear_lab_val: '',
              }),
          },
          {
            text: i18n.t('PATIENTS.CANCEL'),
            onPress: () => {
              this.setState({clear_lab_val: ''});
            },
          },
        ]);
      }
    } else {
      return [];
    }
  };

  checkSaveLabOrder = async () => {
    // console.log(' this.state.plan_data' + this.state.plan_data);
    if (this.state.tagsSelected.length > 0) {
      if (this.state.plan_data.lab_test.length == 0) {
        this.saveLabOrder(this.state.tagsSelected);
      } else {
        let p1 = this.state.tagsSelected.filter((item) => {
          return this.state.plan_data.lab_test.some(
            (item2) =>
              (item2.service_master_id == item.id &&
                item2.version_status == 2) ||
              item2.lab_val == item.id,
          );
        });
        if (p1.length === 0) {
          this.saveLabOrder(this.state.tagsSelected);
        } else {
          alert(i18n.t('PATIENTS.LAB'));
          this.setState({tagsSelected: []});
        }
      }
    } else {
      alert(i18n.t('PATIENTS.PLS_LAB'));
    }
  };

  saveLabOrder = async (listdata) => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let on = [];
    let lab_name = '';
    listdata.map((item) => {
      if (lab_name == '') {
        lab_name = item.name;
      } else {
        lab_name = lab_name + ',' + item.name;
      }
      on.push(item.id);
    });
    if(this.props.screenProps.virtual_branch){
    if (
      this.props.screenProps.virtual_branch.virtual_clinic_branch === '' ||
      this.props.screenProps.virtual_branch.virtual_clinic_branch ===
        undefined ||
      this.props.screenProps.virtual_branch.virtual_clinic_branch === null
    ) {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlp_id: this.props.screenProps.hlpid,
        lab_name: lab_name,
        enc: this.props.screenProps.enc_id,
        lab_val: on,
        td_date: moment().format('DD-MMM-YYYY'),
        username: docname,
        token: global.token,
        // appBranch:this.props.postList.pract_details[0].branch_id
      });
      await this.props.saveLabOrderData(ob);
    } else {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlp_id: this.props.screenProps.hlpid,
        lab_name: lab_name,
        enc: this.props.screenProps.enc_id,
        lab_val: on,
        td_date: moment().format('DD-MMM-YYYY'),
        username: docname,
        token: global.token,
        appBranch: this.props.postList.pract_details[0].branch_id,
      });
      await this.props.saveLabOrderData(ob);
    }}
    else {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlp_id: this.props.screenProps.hlpid,
        lab_name: lab_name,
        enc: this.props.screenProps.enc_id,
        lab_val: on,
        td_date: moment().format('DD-MMM-YYYY'),
        username: docname,
        token: global.token,
        appBranch: this.props.postList.pract_details[0].branch_id,
      });
      await this.props.saveLabOrderData(ob);
    }

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (this.props.saveLabResponse.message == 1) {
      // alert("Lab Order saved Successfully")
      this.setState({deletesection: 'Lab Order'});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
          tagsSelected: [],
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
          tagsSelected: [],
        });
      }
    }
    this.props.changeTabData(-1);
    this.closeOverlay2();
    this.setState({load1: false, isPlanModified: true});
    this.setState({tagsSelected: []});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.LAB_SUCC'),
      type: 'success',
      icon: 'auto',
    });
  };

  addimage = async (text) => {
    this.setState({clear_img_val: text.nativeEvent.text});
    let query = text.nativeEvent.text;
    const {suggestions1} = this.state;

    if (query.length > 1) {
      const regex = new RegExp(
        `${query.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
        'i',
      );
      let newdata = suggestions1.filter(
        (medicine) =>
          medicine.name
            .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
            .search(regex) >= 0,
      );
      // (medicine.name.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')).search(regex) >= 0 ||
      // (medicine.id != null && (medicine.id.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')).search(regex) >= 0))

      if (query != '' && newdata.length > 0) {
        return newdata;
      } else {
        Alert.alert(i18n.t('PATIENTS.ALERT'), i18n.t('PATIENTS.SERVICE'), [
          {
            text: i18n.t('COMMON.YES'),
            onPress: () =>
              this.setState({
                img_flg: true,
                set_imgval: query,
                clear_img_val: '',
              }),
          },
          {
            text: i18n.t('PATIENTS.CANCEL'),
            onPress: () => {
              this.setState({clear_img_val: ''});
            },
          },
        ]);
      }
    } else {
      return [];
    }
  };

  addimage1 = async () => {
    let tagsSelected1 = this.state.tagsSelected1;
    let obj = {
      name: this.state.set_imgval.toUpperCase(),
      id: this.state.set_imgval.toUpperCase(),
    };
    this.setState({tagsSelected1: this.state.tagsSelected1.concat([obj])});
    this.setState({img_flg: false});
    this.setState({clear_img_val: ''});
  };

  checkSaveImagingOrder = async () => {
    if (this.state.tagsSelected1.length > 0) {
      if (this.state.plan_data.imaging.length == 0) {
        //alert(JSON.stringify(this.state.tagsSelected1))
        this.saveImagingOrder(this.state.tagsSelected1);
      } else {
        let p1 = this.state.tagsSelected1.filter((item) => {
          return this.state.plan_data.imaging.some(
            (item2) =>
              (item2.service_master_id == item.id &&
                item2.version_status == 2) ||
              item2.image_val == item.id,
          );
        });
        if (p1.length == 0) {
          this.saveImagingOrder(this.state.tagsSelected1);
        } else {
          alert(i18n.t('PATIENTS.IMAGE_ORDER_TXT'));
          this.setState({tagsSelected1: []});
        }
      }
    } else {
      alert(i18n.t('PATIENTS.IMAGE_ORDER_TXT1'));
    }
  };

  saveImagingOrder = async (listdata) => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    // alert("doc"+doc)
    let on = [];
    let imaging_name = '';
    listdata.map((item) => {
      if (imaging_name == '') {
        imaging_name = item.name;
      } else {
        imaging_name = imaging_name + ',' + item.name;
      }
      on.push(item.id);
    });
    if(this.props.screenProps.virtual_branch){
    if (
      this.props.screenProps.virtual_branch.virtual_clinic_branch === '' ||
      this.props.screenProps.virtual_branch.virtual_clinic_branch ===
        undefined ||
      this.props.screenProps.virtual_branch.virtual_clinic_branch === null
    ) {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlp_id: this.props.screenProps.hlpid,
        img_type: imaging_name,
        enc: this.props.screenProps.enc_id,
        img_val: on,
        td_date: moment().format('DD-MMM-YYYY'),
        username: docname,
        token: global.token,
        // appBranch:this.props.postList.pract_details[0].branch_id
      });
      await this.props.saveImagingOrderData(ob);
    } else {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlp_id: this.props.screenProps.hlpid,
        img_type: imaging_name,
        enc: this.props.screenProps.enc_id,
        img_val: on,
        td_date: moment().format('DD-MMM-YYYY'),
        username: docname,
        token: global.token,
        appBranch: this.props.postList.pract_details[0].branch_id,
      });
      await this.props.saveImagingOrderData(ob);
    }}
    else {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlp_id: this.props.screenProps.hlpid,
        img_type: imaging_name,
        enc: this.props.screenProps.enc_id,
        img_val: on,
        td_date: moment().format('DD-MMM-YYYY'),
        username: docname,
        token: global.token,
        appBranch: this.props.postList.pract_details[0].branch_id,
      });
      await this.props.saveImagingOrderData(ob);
    }

   
    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.saveImagingResponse.message == 1) {
      // alert("Imaging order added Successfully")
      this.setState({deletesection: 'Imaging Order'});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
          tagsSelected1: [],
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
          tagsSelected1: [],
        });
      }
    }
    this.props.changeTabData(-1);
    this.closeOverlay3();
    this.setState({load1: false, isPlanModified: true});
    this.setState({tagsSelected1: []});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.IMAGE_SUCC'),
      type: 'success',
      icon: 'auto',
    });
  };
  addNurse = async (text) => {
    this.setState({clear_nurs_val: text.nativeEvent.text});
    let query = text.nativeEvent.text;
    const {suggestions2} = this.state;

    if (query.length > 1) {
      const regex = new RegExp(
        `${query.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
        'i',
      );
      console.log('suggestions2 12 ', suggestions2);
      let newdata = suggestions2.filter(
        (medicine) =>
          medicine.name
            .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
            .search(regex) >= 0,
      );
      // (medicine.name.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')).search(regex) >= 0 ||
      // (medicine.id != null && (medicine.id.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')).search(regex) >= 0))

      if (query != '' && newdata.length > 0) {
        return newdata;
      } else {
        Alert.alert(i18n.t('PATIENTS.ALERT'), i18n.t('PATIENTS.SERVICE'), [
          {
            text: i18n.t('COMMON.YES'),
            onPress: () =>
              this.setState({
                nurs_flg: true,
                set_nursval: query,
                clear_nurs_val: '',
              }),
          },
          {
            text: i18n.t('PATIENTS.CANCEL'),
            onPress: () => {
              this.setState({clear_nurs_val: ''});
            },
          },
        ]);
      }
    } else {
      return [];
    }
  };

  addNurse1 = async () => {
    let tagsSelected2 = this.state.tagsSelected2;
    let obj = {
      name: this.state.set_nursval.toUpperCase(),
      id: this.state.set_nursval.toUpperCase(),
    };
    this.setState({tagsSelected2: this.state.tagsSelected2.concat([obj])});
    this.setState({nurs_flg: false});
    this.setState({clear_nurs_val: ''});
  };
  checkSaveNursingOrder = async () => {
    if (this.state.tagsSelected2.length > 0) {
      let mylist =
        this.state.plan_data.nursing != undefined
          ? this.state.plan_data.nursing
          : this.state.plan_data.nursing_services;
      if (mylist.length == 0) {
        // alert("alling")
        this.saveNursingOrder(this.state.tagsSelected2);
      } else {
        let p1 = this.state.tagsSelected2.filter((item) => {
          return mylist.some(
            (item2) =>
              (item2.service_master_id == item.id &&
                item2.version_status == 2) ||
              item2.nurse_val == item.id,
          );
        });
        if (p1.length == 0) {
          //alert("called3")
          this.saveNursingOrder(this.state.tagsSelected2);
        } else {
          alert(i18n.t('PATIENTS.NURSE_TXT1'));
          this.setState({tagsSelected2: []});
        }
      }
    } else {
      alert(i18n.t('PATIENTS.NURSE_ADD'));
    }
  };

  saveNursingOrder = async (listData) => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let on = [];
    let nursing_name = '';
    listData.map((item) => {
      if (nursing_name == '') {
        nursing_name = item.name;
      } else {
        nursing_name = nursing_name + ',' + item.name;
      }
      on.push(item.id);
    });
if(this.props.screenProps.virtual_branch){
    if (
      this.props.screenProps.virtual_branch.virtual_clinic_branch === '' ||
      this.props.screenProps.virtual_branch.virtual_clinic_branch ===
        undefined ||
      this.props.screenProps.virtual_branch.virtual_clinic_branch === null
    ) {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlpid: this.props.screenProps.hlpid,
        service_name: nursing_name,
        docname: docname,
        encid: this.props.screenProps.enc_id,
        service_value: on,
        td_date: moment().format('DD-MMM-YYYY'),
        // username:this.props.patientList.message[0].Name,
        token: global.token,
      });
      await this.props.saveNursingOrderData(ob);
    } else {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlpid: this.props.screenProps.hlpid,
        service_name: nursing_name,
        docname: docname,
        encid: this.props.screenProps.enc_id,
        service_value: on,
        td_date: moment().format('DD-MMM-YYYY'),
        // username:this.props.patientList.message[0].Name,
        token: global.token,
        appBranch: this.props.postList.pract_details[0].branch_id,
      });
      await this.props.saveNursingOrderData(ob);
    }}
    else {
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlpid: this.props.screenProps.hlpid,
        service_name: nursing_name,
        docname: docname,
        encid: this.props.screenProps.enc_id,
        service_value: on,
        td_date: moment().format('DD-MMM-YYYY'),
        // username:this.props.patientList.message[0].Name,
        token: global.token,
        appBranch: this.props.postList.pract_details[0].branch_id,
      });
      await this.props.saveNursingOrderData(ob);
    }

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.saveNursingResponse.message == 'successfully inserted') {
      // alert("Nursing order added Successfully")
      //alert()
      this.setState({deletesection: 'Nursing Order'});
      this.props.screenProps.screen == 'dashboard'
        ? await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
          tagsSelected2: [],
        });
      } else if (global.screen == 'timelene') {
        //alert(JSON.stringify(Object.keys(this.props.consultList.message.nurse_services)))
        await this.setState({
          plan_data: this.props.consultList.message,
          tagsSelected2: [],
        });
      }
    }
    this.props.changeTabData(-1);
    this.closeOverlay4();
    this.setState({load1: false, isPlanModified: true});
    this.setState({tagsSelected2: []});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Nursing Order Added ',
      type: 'success',
      icon: 'auto',
    });
  };
  saveVaccine = async () => {
    if (this.state.vaccindb == false) {
      alert(i18n.t('PATIENTS.VACCINATION'));
    } else {
      this.setState({load1: true});
      // console.log("query2"+this.state.query2)
      let vaccine_brandname = '';
      // if(this.state.Vaccnotindb==false){
      vaccine_brandname =
        this.state.vaccine_id +
        ',' +
        this.state.query2.split(' (')[0] +
        ',' +
        this.state.service_master_id;
      this.setState({vaccindb: false});
      // }else{
      //     vaccine_brandname = this.state.Vaccnotindb_data;
      //     this.setState({Vaccnotindb:false});
      // }
      const docname = await AsyncStorage.getItem('doctorname');
      if(this.props.screenProps.virtual_branch){
      if (
        this.props.screenProps.virtual_branch.virtual_clinic_branch === '' ||
        this.props.screenProps.virtual_branch.virtual_clinic_branch ===
          undefined ||
        this.props.screenProps.virtual_branch.virtual_clinic_branch === null
      ) {
        let ob = JSON.stringify({
          docid: global.doctor_id,
          hlpid: this.props.screenProps.hlpid,
          vac_bnd_name: vaccine_brandname,
          encid: this.props.screenProps.enc_id,
          username: docname,
          token: global.token,
          // appBranch:this.props.postList.pract_details[0].branch_id
        });
        await this.props.saveVaccineOrderData(ob);
      } else {
        let ob = JSON.stringify({
          docid: global.doctor_id,
          hlpid: this.props.screenProps.hlpid,
          vac_bnd_name: vaccine_brandname,
          encid: this.props.screenProps.enc_id,
          username: docname,
          token: global.token,
          appBranch: this.props.postList.pract_details[0].branch_id,
        });
        await this.props.saveVaccineOrderData(ob);
      }}
      else {
        let ob = JSON.stringify({
          docid: global.doctor_id,
          hlpid: this.props.screenProps.hlpid,
          vac_bnd_name: vaccine_brandname,
          encid: this.props.screenProps.enc_id,
          username: docname,
          token: global.token,
          appBranch: this.props.postList.pract_details[0].branch_id,
        });
        await this.props.saveVaccineOrderData(ob);
      }
      // alert("Vaccine added Successfully")
      this.setState({deletesection: 'Vaccine'});
      let myobj = JSON.stringify({
        docid: this.props.screenProps.docid,
        token: this.props.screenProps.token,
        consulting: this.props.screenProps.check_status,
        hlpid: this.props.screenProps.hlpid,
        enc: this.props.screenProps.enc_id,
        chief: this.props.screenProps.chief,
        uid: this.props.screenProps.uid,
        template_id: this.props.screenProps.template_id,
        template_name: this.props.screenProps.template_name,
        app_type: this.props.screenProps.app_type,
        username: this.props.screenProps.patientname,
      });
      let myobj2 = JSON.stringify({
        uid: this.props.screenProps.uid2,
        enc: this.props.screenProps.enc_id,
        docid: this.props.screenProps.docid,
        token: this.props.screenProps.token,
        hlpid: this.props.screenProps.hlpid,
      });

      if (this.props.saveVaccineResponse.message == 'successfully inserted') {
        // console.log(this.props.saveVaccineResponse.message=="successfully inserted")
        this.props.screenProps.screen == 'dashboard'
          ? // alert("called2")
            await this.props.getApplyList(myobj)
          : this.props.screenProps.screen == 'timelene'
          ? // alert("called2")
            await this.props.getConsultList(myobj2)
          : null;
        if (global.screen == 'dashboard') {
          await this.setState({
            plan_data: this.props.applyList.message,
            query2: '',
            vaccine_id: '',
            service_master_id: '',
          });
        } else if (global.screen == 'timelene') {
          await this.setState({
            plan_data: this.props.consultList.message,
            query2: '',
            vaccine_id: '',
            service_master_id: '',
          });
        }
      }
      let obdata3 = JSON.stringify({
        enc_id: this.props.screenProps.enc_id,
        docid: global.doctor_id,
        hlp_id: this.props.screenProps.hlpid,
        token: global.token,
      });
      await this.props.getVaccineOrderData(obdata3);

      this.setState({
        vaccines: this.props.fetchingVaccineResponse.message,
      });
      this.props.changeTabData(-1);
      this.closeOverlay5();
      this.setState({load1: false, isPlanModified: true});
      this.PlanAlert.showMessage({
        message: i18n.t('PATIENTS.SUB_SUCC'),
        description: i18n.t('PATIENTS.VACC_SUCC'),
        type: 'success',
        icon: 'auto',
      });
    }
  };
  deleteVaccineOrder = async (vaccine_id, version_status) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      id: vaccine_id,
      encid: this.props.screenProps.enc_id,
      token: global.token,
      version_status: version_status,
    });

    await this.props.deleteVaccineOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.deleteVaccineResponse.message == 'successfully deleted') {
      // alert("Vaccine Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    let obdata3 = JSON.stringify({
      enc_id: this.props.screenProps.enc_id,
      docid: global.doctor_id,
      hlp_id: this.props.screenProps.hlpid,
      token: global.token,
    });
    await this.props.getVaccineOrderData(obdata3);
    this.setState({
      load1: false,
      isPlanModified: true,
      vaccines: this.props.fetchingVaccineResponse.message,
    });
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.VACC_DEL'),
      description: i18n.t('PATIENTS.VACC_DEL'),
      type: 'success',
      icon: 'auto',
    });
    // alert(JSON.stringify(this.props.applyList.message))
  };
  deleteTempLabOrder = async (id) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      lab_id: id,
      hlp_id: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      token: global.token,
    });
    // alert(ob)

    await this.props.deleteTempLabOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (this.props.deleteTempLabResponse.message == 'Successfully Deleted') {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.LAB_DELE'),
      description: i18n.t('PATIENTS.LAB_DELE'),
      type: 'success',
      icon: 'auto',
    });
    //  textDecorationLine: 'line-through'
  };

  deleteLabOrder = async (id, version_status) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      laborder_id: id,
      encounter_id: this.props.screenProps.enc_id,
      token: global.token,
      version_status: version_status,
    });
    // console.log('labbbb', ob);

    await this.props.deleteLabOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.deleteLabResponse.message == true) {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.LAB_DELE'),
      type: 'success',
      icon: 'auto',
    });
    //  textDecorationLine: 'line-through'
  };
  deleteTempImagingOrder = async (id) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      img_id: id,
      hlp_id: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      token: global.token,
    });
    // alert(ob)

    await this.props.deleteTempImagingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.deleteTempImgResponse.message == 'Successfully Deleted') {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.IMAGE_DELE'),
      type: 'success',
      icon: 'auto',
    });
    //  textDecorationLine: 'line-through'
  };
  deleteImagingOrder = async (id, version_status) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      imaging_id: id,
      encid: this.props.screenProps.enc_id,
      token: global.token,
      version_status: version_status,
    });
    //alert(ob)
    await this.props.deleteImagingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.deleteImagingResponse.message == 'successfully deleted') {
      this.setState({load1: false, deleteid: '', isPlanModified: true});
      this.PlanAlert.showMessage({
        message: i18n.t('PATIENTS.SUB_SUCC'),
        description: i18n.t('PATIENTS.IMAGE_DELE'),
        type: 'success',
        icon: 'auto',
      });
      console.log('Imaging Order Deleted Successfully');
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    //  this.setState({load1:false})
    //  textDecorationLine: 'line-through'
  };
  deleteTempNursingOrder = async (id) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      nurse_id: id,
      hlp_id: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      token: global.token,
    });
    // alert(ob)

    await this.props.deleteTempNursingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (
      this.props.deleteTempNursingResponse.message == 'Successfully Deleted'
    ) {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.NURSE_DELE'),
      type: 'success',
      icon: 'auto',
    });
    //  textDecorationLine: 'line-through'
  };
  deleteNursingOrder = async (id, version_status) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      nurse_id: id,
      encid: this.props.screenProps.enc_id,
      token: global.token,
      version_status: version_status,
    });
    // alert(ob)
    await this.props.deleteNursingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.deleteNursingResponse.message == 'successfully deleted') {
      // alert("Nursing Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false, isPlanModified: true});
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.NURSE_DELE'),
      type: 'success',
      icon: 'auto',
    });
    //  textDecorationLine: 'line-through'
  };
  onValueChangeImagingEncounter = (value) => {
    let newData = this.props.timelineList.message.filter(
      (item) => item.enc_id == value,
    );
    this.setState({imaging_encounter: value, imaging_encountersList: newData});
  };
  onValueChangeLabEncounter = (value) => {
    let newData = this.props.timelineList.message.filter(
      (item) => item.enc_id == value,
    );
    this.setState({lab_encounter: value, lab_encountersList: newData});
  };
  repeatImagingOrder = async (id) => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      img_id: id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatImagingOrderData(ob);
    alert(this.props.RepeatingImagingResponse);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.RepeatingImagingResponse.message) {
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false});
  };
  componentWillUnmount = () => {
    if (this._unsubscribe && typeof this._unsubscribe == 'function') {
      this._unsubscribe();
    }
    this.props.changeTabData(-1);
  };
  repeatLabOrder = async (id) => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      lab_id: id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatLabOrderData(ob);
    alert(this.props.RepeatingLabResponse);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });

    if (this.props.RepeatingLabResponse) {
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false});
  };
  repeatAllLabOrder = async () => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatAllLabOrderData(ob);
    alert(this.props.RepeatingAllLabResponse);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (this.props.RepeatingAllLabResponse) {
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false});
  };
  onValueDose = (value) => {
    //alert("v"+value)
    if (value) {
      this.setState({
        dose: value,
        selectedIndex: 'undefined',
      });
    } else {
      this.setState({
        dose: value,
        selectedIndex: 1,
      });
    }
  };
  onValueDose1 = (value) => {
    // alert("v"+value)
    if (value) {
      this.setState({
        dose1: value,
        selectedIndexa: 'undefined',
      });
    } else {
      this.setState({
        dose1: value,
        selectedIndexa: 1,
      });
    }
  };
  setDate = async (newDate) => {
    await this.setState({expiry_date: newDate});
  };
  updatebatchvaccine = async (id) => {
    this.setState({load1: true});
    let obj = JSON.stringify({
      docid: global.doctor_id,
      token: global.token,
      batch_no: this.state.batch_no,
      encounter_show: this.props.screenProps.enc_id,
      expiry_date: moment(this.state.expiry_date).format('YYYY-MM-DD'),
      vaccine_id: id,
      hlpid: this.props.screenProps.hlpid,
    });
    // console.log(obj);
    await this.props.updateVaccineBatchData(obj);

    if (
      this.props.UpdatingBatchVaccineResponse.message == 'Updated Successfuly'
    ) {
      await this.updateList();
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({
      load1: false,
      isPlanModified: true,
    });
    this.PlanAlert.showMessage({
      message: i18n.t('PATIENTS.SUB_SUCC'),
      description: i18n.t('PATIENTS.VACC_UPDATE'),
      type: 'success',
      icon: 'auto',
    });
  };

  repeatAllImagingOrder = async () => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatAllImagingOrderData(ob);
    alert(this.props.RepeatingAllImagingResponse);

    let myobj = JSON.stringify({
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      consulting: this.props.screenProps.check_status,
      hlpid: this.props.screenProps.hlpid,
      enc: this.props.screenProps.enc_id,
      chief: this.props.screenProps.chief,
      uid: this.props.screenProps.uid,
      template_id: this.props.screenProps.template_id,
      template_name: this.props.screenProps.template_name,
      app_type: this.props.screenProps.app_type,
      username: this.props.screenProps.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.screenProps.uid2,
      enc: this.props.screenProps.enc_id,
      docid: this.props.screenProps.docid,
      token: this.props.screenProps.token,
      hlpid: this.props.screenProps.hlpid,
    });
    if (this.props.RepeatingAllImagingResponse) {
      this.props.screenProps.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.screenProps.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        await this.setState({
          plan_data: this.props.applyList.message,
        });
      } else if (global.screen == 'timelene') {
        await this.setState({
          plan_data: this.props.consultList.message,
        });
      }
    }
    this.setState({load1: false});
  };
  dispClk = () => {
    this.setState({selectedValue1: true});
  };
  dispClk1 = () => {
    this.setState({selectedValue3: true});
  };
  dispClk2 = () => {
    this.setState({selectedValue5: true});
  };
  dispClk3 = () => {
    this.setState({selectedValue7: true});
  };
  dispClk4 = () => {
    this.setState({selectedValue9: true});
  };
  dispClk5 = () => {
    this.setState({selectedValue11: true});
  };

  render() {
    const onChange = (event, selectedDate) => {
      console.log('Datetimepicker');
      this.setState({selectedValue1: false});
      const currentDate = selectedDate;
      this.setState({
        time: moment(currentDate, ['hh:mm']).format('hh:mm A'),
        message: '',
      });
    };
    const onChange1 = (event, selectedDate) => {
      this.setState({selectedValue3: false});
      const currentDate = selectedDate;
      this.setState({
        time1: moment(currentDate, ['hh:mm']).format('hh:mm A'),
        message: '',
      });
    };
    const onChange2 = (event, selectedDate) => {
      this.setState({selectedValue5: false});
      const currentDate = selectedDate;
      this.setState({
        time2: moment(currentDate, ['hh:mm']).format('hh:mm A'),
        message: '',
      });
    };

    const onChange3 = (event, selectedDate) => {
      this.setState({selectedValue7: false});
      const currentDate = selectedDate;
      this.setState({
        timea: moment(currentDate, ['hh:mm']).format('hh:mm A'),
        message: '',
      });
    };
    const onChange4 = (event, selectedDate) => {
      this.setState({selectedValue9: false});
      const currentDate = selectedDate;
      this.setState({
        timea1: moment(currentDate, ['hh:mm']).format('hh:mm A'),
        message: '',
      });
    };
    const onChange5 = (event, selectedDate) => {
      this.setState({selectedValue11: false});
      const currentDate = selectedDate;
      this.setState({
        timea2: moment(currentDate, ['hh:mm']).format('hh:mm A'),
        message: '',
      });
    };

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
    const {medicineList, isFetching20} = this.props;
    let selectedButton = this.state.sun.find((e) => e.selected == true);
    selectedButton = selectedButton
      ? selectedButton.value
      : this.state.sun[0].label;
    const {query} = this.state;
    const medicines = this.findMedicine(query);
    const {query2} = this.state;
    const vaccinesdata = this.findVaccineData(query2);
    const comp2 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const buttons = ['1/2', '1', '2', '3'];
    const buttons1 = [
      '4H',
      '6H',
      '8H',
      '12H',
      i18n.t('PATIENTS.ONCE'),
      i18n.t('PATIENTS.TWICE'),
      i18n.t('PATIENTS.THRICE'),
    ];
    const buttons2 = ['1', '2', '3', '4', '5', '6'];
    const buttons4 = [
      i18n.t('PATIENTS.BEFORE_FOOD'),
      i18n.t('PATIENTS.AFTER_FOOD'),
      i18n.t('PATIENTS.EMPTY_STOMACH'),
      i18n.t('PATIENTS.BED_TIME'),
    ];
    const buttons3 = ['S.O.S'];

    const {query1} = this.state;
    const supplements = this.findSupplement(query1);
    const comp1 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    const buttonsa = ['1/2', '1', '2', '3'];
    const buttonsa1 = [
      '4H',
      '6H',
      '8H',
      '12H',
      i18n.t('PATIENTS.ONCE'),
      i18n.t('PATIENTS.TWICE'),
      i18n.t('PATIENTS.THRICE'),
    ];
    const buttonsa2 = ['1', '2', '3', '4', '5', '6'];
    const buttonsa4 = [
      i18n.t('PATIENTS.BEFORE_FOOD'),
      i18n.t('PATIENTS.AFTER_FOOD'),
      i18n.t('PATIENTS.EMPTY_STOMACH'),
      i18n.t('PATIENTS.BED_TIME'),
    ];
    const buttonsa3 = ['S.O.S'];
    const {
      selectedIndex,
      selectedIndex1,
      selectedIndex2,
      selectedIndex3,
      selectedIndex4,
      selectedIndexa,
      selectedIndexa1,
      selectedIndexa2,
      selectedIndexa3,
      selectedIndexa4,
    } = this.state;

    if (this.props.changetab === 0) {
      return (
        <KeyboardAvoidingView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Overlay
              isVisible1
              fullScreen={true}
              onBackdropPress={() => {
                this.props.changeTabData(-1);
                this.closeOverlay();
              }}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 15, fontWeight: 'bold', marginLeft: 110}}>
                {i18n.t('PATIENTS.MED_ADD_TITLE')}
              </Text>
              {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
              {/* <ScrollView
                                style={{ marginTop: 15 }}
                                keyboardShouldPersistTaps={'handled'}
                                ref="myScrollView"> */}
              <KeyboardAwareScrollView>
                {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
                <View>
                  <Row
                    style={{
                      marginHorizontal: 5,
                      marginTop: 10,
                      position: 'absolute',
                      zIndex: 100,
                    }}>
                    <Col>
                      <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
                        //data to show in suggestion
                        data={
                          medicines &&
                          medicines.length === 1 &&
                          comp(
                            query,
                            medicines[0].drug_name +
                              '  ' +
                              medicines[0].drug_type,
                          )
                            ? []
                            : medicines
                        }
                        //default value if you want to set something in input
                        defaultValue={query}
                        /*onchange of the text changing the state of the query which will trigger
                                                                        the findFilm method to show the suggestions*/
                        onChangeText={this.vald_text_med.bind(this)}
                        placeholder={i18n.t('PATIENTS.SEARCH')}
                        placeholderTextColor={'#2D323C'}
                        renderItem={({item}) => (
                          //you can change the view you want to show in suggestion from here
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                query:
                                  item.drug_name.trim() +
                                  ' ' +
                                  item.strength.trim() +
                                  ' ' +
                                  item.unit.trim() +
                                  ' | ' +
                                  item.drug_type.trim(),
                                drug_id: item.drug_id,
                                mesure:
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablet' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets and capsules'
                                    ? i18n.t('PATIENTS.TAB')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'capsule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'capsules'
                                    ? i18n.t('PATIENTS.CAP')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'lotion' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'liquid' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'syrup' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'respules' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'suspensions' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'spray' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'shampoo' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'solution'
                                    ? i18n.t('PATIENTS.ML')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'ointment' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'linement' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'cream' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'creams' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'gel' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'gels' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'granules' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'eye ointmen'
                                    ? i18n.t('PATIENTS.MG')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'injection' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'ampule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'vial'
                                    ? i18n.t('PATIENTS.ML')
                                    : item.drug_type.toLowerCase().trim() ==
                                        i18n.t('PATIENTS.DROPS') ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'drop'
                                    ? i18n.t('PATIENTS.DROPS')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'syringe' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'disposals' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'suture'
                                    ? i18n.t('PATIENTS.UNIT')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'powder' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'powders'
                                    ? i18n.t('PATIENTS.GM')
                                    : item.drug_type.toLowerCase().trim() ==
                                      'veinset'
                                    ? i18n.t('PATIENTS.SET')
                                    : i18n.t('PATIENTS.NOS'),
                                junk_medicine: true,
                              })
                            }>
                            <Text
                              allowFontScaling={false}
                              style={styles.itemText}>
                              {item.drug_name} {item.strength} {item.unit} |{' '}
                              {item.drug_type}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </Col>
                  </Row>
                  {/* <Row>
    <Col style={{marginHorizontal:10,marginTop:20}}>
    <TextInput allowFontScaling={false
    placeholder="Search Medicine"
    placeholderTextColor={"#2D323C"}
    returnKeyType="done"
    autoCapitalize="none"
    value={this.state.weight}
    // keyboardType="numeric"
    style={styles.input}
    // onChangeText={this.onValueweight.bind(this)}
    />
    </Col>
    </Row> */}
                  <Row style={{marginHorizontal: 10, marginTop: 50}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.DOSE')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col size={50}>
                      <ButtonGroup
                        //style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', }}
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{
                          height: 40,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{color: 'black'}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                      />
                    </Col>
                    <Col size={20} style={{marginTop: 5, marginLeft: -5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder={i18n.t('PATIENTS.DOSE')}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.dose}
                        keyboardType="numeric"
                        style={styles.input}
                        // onChangeText={(text)=>this.setState({custom:text})}
                        onChangeText={this.onValueDose.bind(this)}
                      />
                    </Col>
                    <Col
                      size={30}
                      style={{
                        marginTop: 5,
                        borderColor: 'black',
                        borderWidth: 1,
                        height: 40,
                        backgroundColor: 'white',
                        // marginBottom: 10,
                        marginHorizontal: 5,
                        color: '#4F575C',
                        //marginLeft: 5,
                      }}>
                      <Picker
                        // mode="dropdown"
                        style={{marginTop: -7}}
                        iosIcon={
                          <Icon2
                            style={{top: -5}}
                            name="sort-down"
                            color="#a9a9a9"
                          />
                        }
                        selectedValue={this.state.mesure}
                        onValueChange={this.onValueChangedose.bind(this)}
                        // onValueChange={(value) => {this.setState({hospital_branch: value})}
                      >
                        {this.state.drugtype_list.map((item) => (
                          <Picker.Item label={item} value={item} />
                        ))}
                        {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                      </Picker>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10, marginTop: -10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.TIME')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup
                        //buttonStyle={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}
                        onPress={this.updateIndex1}
                        buttons={buttons1}
                        selectedIndex={selectedIndex1}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10, color: 'black'}}
                        innerBorderStyle={{color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col size={30} style={{marginTop: 5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder={i18n.t('PATIENTS.CUSTOM')}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.custom}
                        keyboardType="numeric"
                        style={styles.input}
                        // onChangeText={(text)=>this.setState({custom:text})}
                        onChangeText={this.onValuecustom.bind(this)}
                      />
                    </Col>
                    {this.state.custom ? (
                      <Col
                        disabled={true}
                        size={35}
                        style={{
                          marginTop: 4,
                          borderColor: 'black',
                          borderWidth: 1,
                          height: 40,
                          backgroundColor: 'white',
                          // marginBottom: 10,
                          marginLeft: 10,
                          marginHorizontal: 5,
                          color: '#4F575C',
                        }}>
                        <Picker
                          enabled={true}
                          // mode="dropdown"
                          style={{marginTop: -7}}
                          iosIcon={
                            <Icon2
                              style={{top: -5, marginLeft: -10}}
                              name="sort-down"
                              color="#a9a9a9"
                            />
                          }
                          selectedValue={this.state.day}
                          onValueChange={this.onValueChangeday.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item
                            label={i18n.t('PATIENTS.SELECT')}
                            value=""
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.HOURLY')}
                            value="Hours"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_DAY')}
                            value="Days"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_WEEK')}
                            value="Weeks"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.MONTHLY')}
                            value="Months"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.YEARLY')}
                            value="Years"
                          />
                          {/* {this.state.search_branch?(
        this.state.search_branch.pract_details.map((item) =>(
        <Picker.Item label={item.branch_name} value={item.branch_id} />
        ))):null
        } */}
                        </Picker>
                      </Col>
                    ) : (
                      <Col
                        disabled={true}
                        size={35}
                        style={{
                          marginTop: 4,
                          borderColor: 'black',
                          borderWidth: 1,
                          height: 40,
                          backgroundColor: 'white',
                          // marginBottom: 10,
                          marginLeft: 10,
                          marginHorizontal: 5,
                          color: '#4F575C',
                        }}>
                        <Picker
                          enabled={true}
                          // mode="dropdown"
                          style={{marginTop: -7}}
                          iosIcon={
                            <Icon2
                              style={{top: -5, marginLeft: -10}}
                              name="sort-down"
                              color="#a9a9a9"
                            />
                          }
                          selectedValue={this.state.day}
                          onValueChange={this.onValueChangeday.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item
                            label={i18n.t('PATIENTS.SELECT')}
                            value=""
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.HOURLY')}
                            value="Hours"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_DAY')}
                            value="Days"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_WEEK')}
                            value="Weeks"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.MONTHLY')}
                            value="Months"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.YEARLY')}
                            value="Years"
                          />
                        </Picker>
                      </Col>
                    )}
                    <Col size={width * 0.08}>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndex3}
                        buttons={buttons3}
                        selectedIndex={selectedIndex3}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          width: width * 0.2,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{fontSize: 12, color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col size={30}>
                      {/* {this.state.time_text || this.state.time_text1 || this.state.time_text2 ?
                                                <DatePicker
                                                    allowFontScaling={false}
                                                    style={{ alignSelf: 'flex-start', width: 80, marginHorizontal: 10 }}
                                                    date={this.state.time}
                                                    mode="time"
                                                    //placeholder="HH:MM"
                                                    customStyles={{
                                                      dateInput: {
                                                        borderColor:"black",
                                                      }
                                                    }}
                                                    showIcon={false}
                                                    format="hh:mm A"
                                                    confirmBtnText="Confirm"
                                                    is24Hour={false}
                                                    // showIcon="false"
                                                    cancelBtnText="Cancel"
                                                    onDateChange={(time) => { this.setTimeData(time) }}
                                                /> : null} */}

                      {(this.state.time_text ||
                        this.state.time_text1 ||
                        this.state.time_text2) &&
                      this.state.selectedValue ? (
                        <TouchableOpacity
                          style={styles.input1}
                          onPress={this.dispClk}>
                          <Text style={{marginTop: 10, fontSize: 13}}>
                            {/* {this.state.time ? this.state.time : ' HH:MM'} */}

                            {this.state.time == 'Invalid date' ? (
                              <Text numberOfLines={1}>{'08:00 AM'} </Text>
                            ) : this.state.time ? (
                              this.state.time
                            ) : (
                              <Text>{'HH: MM'} </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {this.state.selectedValue1 ? (
                        <DateTimePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          customStyles={{
                            dateInput: {
                              borderColor: 'black',
                            },
                          }}
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          testID="dateTimePicker"
                          accessibilityLabel="dateTimePicker"
                          value={new Date()}
                          mode="time"
                          is24Hour={false}
                          //display="default"
                          onChange={onChange}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {/* {this.state.time_text1 || this.state.time_text2 ?
                                                <DatePicker
                                                    allowFontScaling={false}
                                                    style={{ alignSelf: 'center', width: 80 }}
                                                    date={this.state.time1}
                                                    mode="time"
                                                    // //placeholder="HH:MM"
                                                    customStyles={{
                                                        dateInput: {
                                                            borderColor: 'black',
                                                        },
                                                    }}
                                                    showIcon={false}
                                                    format="hh:mm A"
                                                    confirmBtnText="Confirm"
                                                    is24Hour={false}
                                                    // showIcon="false"
                                                    cancelBtnText="Cancel"
                                                    onDateChange={(time) => { this.setTimeData1(time) }}
                                                /> : null} */}
                      {(this.state.time_text1 || this.state.time_text2) &&
                      this.state.selectedValue2 ? (
                        <TouchableOpacity
                          style={styles.input1}
                          onPress={this.dispClk1}>
                          <Text style={{marginTop: 10, fontSize: 13}}>
                            {/* {this.state.time1 ? this.state.time1 : ' HH:MM'} */}
                            {this.state.time1 == 'Invalid date' ? (
                              <Text>{'02:00 PM'} </Text>
                            ) : this.state.time1 ? (
                              this.state.time1
                            ) : (
                              <Text>{'HH: MM'} </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {this.state.selectedValue3 ? (
                        <DateTimePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          customStyles={{
                            dateInput: {
                              borderColor: 'black',
                            },
                          }}
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          testID="dateTimePicker"
                          accessibilityLabel="dateTimePicker"
                          value={new Date()}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={onChange1}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {/* {this.state.time_text2 ?
                                                <DatePicker
                                                    allowFontScaling={false}
                                                    style={{
                                                        alignSelf: 'flex-end',
                                                        width: 80,
                                                        marginHorizontal: 10,
                                                    }}
                                                    date={this.state.time2}
                                                    mode="time"
                                                    //placeholder="HH:MM"
                                                    customStyles={{
                                                        dateInput: {
                                                            borderColor: 'black',
                                                        },
                                                    }}
                                                    showIcon={false}
                                                    format="hh:mm A"
                                                    confirmBtnText="Confirm"
                                                    is24Hour={false}
                                                    // showIcon="false"
                                                    cancelBtnText="Cancel"
                                                    onDateChange={(time) => { this.setTimeData2(time) }}
                                                /> : null} */}
                      {this.state.time_text2 && this.state.selectedValue4 ? (
                        <TouchableOpacity
                          style={styles.input1}
                          onPress={this.dispClk2}>
                          <Text style={{marginTop: 10, fontSize: 13}}>
                            {/* {this.state.time2 ? this.state.time2 : ' HH:MM'} */}
                            {this.state.time2 == 'Invalid date' ? (
                              <Text>{'09:00 PM'}</Text>
                            ) : this.state.time2 ? (
                              this.state.time2
                            ) : (
                              <Text>{'HH: MM'} </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {this.state.selectedValue5 ? (
                        <DateTimePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          customStyles={{
                            dateInput: {
                              borderColor: 'black',
                            },
                          }}
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          testID="dateTimePicker"
                          accessibilityLabel="dateTimePicker"
                          value={new Date()}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={onChange2}
                        />
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndex4}
                        buttons={buttons4}
                        selectedIndex={selectedIndex4}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{fontSize: 10, color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10, marginTop: -8}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.DUR')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndex2}
                        buttons={buttons2}
                        selectedIndex={selectedIndex2}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{fontSize: 12, color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      size={50}
                      style={{marginTop: 10, marginHorizontal: 10}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder={i18n.t('PATIENTS.DUR')}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.duration}
                        keyboardType="numeric"
                        style={styles.input}
                        // onChangeText={(text)=>this.setState({duration:text})}
                        onChangeText={this.onValueduration.bind(this)}
                      />
                    </Col>
                    <Col
                      size={50}
                      style={{
                        marginTop: 10,
                        borderColor: 'black',
                        borderWidth: 1,
                        //height: 40,
                        backgroundColor: 'white',
                        marginLeft: 10,
                        // marginBottom: 10,
                        //marginHorizontal: 5,
                        color: '#4F575C',
                        height: 40,
                        justifyContent: 'center',
                      }}>
                      <Picker
                        // mode="dropdown"

                        style={{
                          height: 35,
                          marginTop: 2,
                          //alignSelf: 'center',
                        }}
                        iosIcon={
                          <Icon2
                            style={{top: -5}}
                            name="sort-down"
                            color="#a9a9a9"
                          />
                        }
                        selectedValue={this.state.day1}
                        onValueChange={this.onValueChangeday1.bind(this)}
                        // onValueChange={(value) => {this.setState({hospital_branch: value})}
                      >
                        <Picker.Item
                          label={i18n.t('PATIENTS.DAYS')}
                          value="Days"
                        />
                        <Picker.Item
                          label={i18n.t('PATIENTS.WEEKS')}
                          value="Weeks"
                        />
                        <Picker.Item
                          label={i18n.t('PATIENTS.MONTHS')}
                          value="Months"
                        />
                        <Picker.Item
                          label={i18n.t('PATIENTS.YEARS')}
                          value="Years"
                        />
                        {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                      </Picker>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10, marginTop: -10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.DUR_NOTE')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextInput
                        allowFontScaling={false}
                        // placeholder="Type something"
                        value={this.state.note}
                        multiline={true}
                        // numberOfLines={5}
                        onContentSizeChange={(event) => {
                          this.setState({
                            height1: event.nativeEvent.contentSize.height,
                          });
                        }}
                        style={{
                          textAlignVertical: 'top',
                          height: Math.max(35, this.state.height1),
                          borderColor: 'black',
                          borderWidth: 1,
                          borderWidth: 1,
                          marginHorizontal: 10,
                        }}
                        onChangeText={(text) => this.setState({note: text})}
                      />
                    </Col>
                  </Row>
                </View>
                {/* </ScrollView> */}
              </KeyboardAwareScrollView>
              {/* <Button
    title="Go back"
    onPress={() => this.closeOverlay()}
    containerStyle={{alignSelf:'center'}}
    buttonStyle={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20}}
    /> */}
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {this.state.ban3 && (
                  <Button
                    onPress={() => this.add_medicine2()}
                    style={{
                      backgroundColor: APP_PRIMARY_COLOR,
                      justifyContent: 'center',
                      height: 40,
                      width: 60,
                      margin: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: 'white',
                        fontSize: 10,
                        alignItems: 'center',
                      }}>
                      <Icon
                        type="FontAwesome"
                        name="plus"
                        style={{fontSize: 20, marginTop: 30, color: 'white'}}
                      />
                    </Text>
                  </Button>
                )}

                {this.state.ban3 && (
                  <Button
                    onPress={async () => {
                      await this.add_medicine();
                      this.props.changeTabData(-1);
                      this.closeOverlay();
                    }}
                    style={{
                      backgroundColor: APP_PRIMARY_COLOR,
                      justifyContent: 'center',
                      height: 40,
                      width: 70,
                      margin: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 15,
                        color: 'white',
                        alignItems: 'center',
                      }}>
                      {i18n.t('PATIENTS.SAVE')}
                    </Text>
                  </Button>
                )}

                {this.state.ban3 && (
                  <Button
                    onPress={() => {
                      this.props.changeTabData(-1);
                      this.closeOverlay();
                    }}
                    style={{
                      backgroundColor: APP_PRIMARY_COLOR,
                      justifyContent: 'center',
                      height: 40,
                      width: 60,
                      margin: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: 'white',
                        fontSize: 10,
                        alignItems: 'center',
                      }}>
                      <Icon
                        type="FontAwesome"
                        name="times"
                        style={{fontSize: 20, marginTop: 30, color: 'white'}}
                      />
                    </Text>
                  </Button>
                )}

                {this.state.ban4 && (
                  <Button
                    onPress={() => this.updatems1()}
                    style={{
                      backgroundColor: APP_PRIMARY_COLOR,
                      justifyContent: 'center',
                      height: 40,
                      width: 70,
                      margin: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 15,
                        color: 'white',
                        alignItems: 'center',
                      }}>
                      Update
                    </Text>
                  </Button>
                )}

                {this.state.ban4 && (
                  <Button
                    onPress={() => {
                      this.props.changeTabData(-1);
                      this.closeOverlay();
                    }}
                    style={{
                      backgroundColor: APP_PRIMARY_COLOR,
                      justifyContent: 'center',
                      height: 40,
                      width: 60,
                      margin: 10,
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: 'white',
                        fontSize: 10,
                        alignItems: 'center',
                      }}>
                      <Icon
                        type="FontAwesome"
                        name="times"
                        style={{fontSize: 20, marginTop: 30, color: 'white'}}
                      />
                    </Text>
                  </Button>
                )}
              </View>
              <FlashMessage
                position="top"
                ref={(ref) => (this.PlanAlert2 = ref)}
              />
            </Overlay>
          </View>
        </KeyboardAvoidingView>
      );
    }
    if (this.props.changetab == 1) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Overlay
            isVisible1
            fullScreen={true}
            onBackdropPress={() => {
              this.props.changeTabData(-1);
              this.closeOverlay1();
            }}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 15, fontWeight: 'bold', marginLeft: 110}}>
              {i18n.t('PATIENTS.SUPP_TITLE')}
            </Text>
            {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
            {/* <ScrollView
                            style={{ marginTop: 15 }}
                            keyboardShouldPersistTaps={'handled'}> */}
            <KeyboardAwareScrollView>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
              <KeyboardAvoidingView
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                behavior="margin"
                enabled
                keyboardVerticalOffset={1000}>
                <View>
                  <Row
                    style={{
                      marginHorizontal: 5,
                      marginTop: 10,
                      position: 'absolute',
                      zIndex: 100,
                    }}>
                    <Col>
                      <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
                        //data to show in suggestion
                        data={
                          supplements &&
                          supplements.length === 1 &&
                          comp1(
                            query1,
                            supplements[0].drug_name +
                              '  ' +
                              supplements[0].drug_type,
                          )
                            ? []
                            : supplements
                        }
                        //default value if you want to set something in input
                        defaultValue={query1}
                        /*onchange of the text changing the state of the query which will trigger
                                                                        the findFilm method to show the suggestions*/
                        //onChangeText={text => this.setState({ query1: text })}
                        onChangeText={this.vald_text_sup.bind(this)}
                        placeholder={i18n.t('PATIENTS.SUPP_ENTER')}
                        placeholderTextColor={'#2D323C'}
                        renderItem={({item}) => (
                          //you can change the view you want to show in suggestion from here
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                query1:
                                  item.drug_name.trim() +
                                  ' ' +
                                  item.strength.trim() +
                                  ' ' +
                                  item.unit.trim() +
                                  ' | ' +
                                  item.drug_type.trim(),
                                drug_id1: item.drug_id,
                                mesure1:
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablet' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets and capsules'
                                    ? i18n.t('PATIENTS.TAB')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'capsule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'capsules'
                                    ? 'CAPRRR'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'lotion' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'liquid' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'syrup' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'respules' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'suspensions' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'spray' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'shampoo' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'solution'
                                    ? i18n.t('PATIENTS.ML')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'ointment' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'linement' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'cream' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'creams' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'gel' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'gels' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'granules' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'eye ointmen'
                                    ? i18n.t('PATIENTS.MG')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'injection' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'ampule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'vial'
                                    ? i18n.t('PATIENTS.ML')
                                    : item.drug_type.toLowerCase().trim() ==
                                        i18n.t('PATIENTS.DROPS') ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'drop' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'eye/ear drops'
                                    ? i18n.t('PATIENTS.DROPS')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'syringe' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'disposals' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'suture' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'miscellaneous' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'soap' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'lozenges' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'condom'
                                    ? i18n.t('PATIENTS.UNIT')
                                    : item.drug_type.toLowerCase().trim() ==
                                        'powder' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'powders' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'churna' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'bhasma'
                                    ? i18n.t('PATIENTS.GM')
                                    : item.drug_type.toLowerCase().trim() ==
                                      'veinset'
                                    ? i18n.t('PATIENTS.SET')
                                    : i18n.t('PATIENTS.NOS'),

                                junk_medicine1: true,
                              })
                            }>
                            <Text
                              allowFontScaling={false}
                              style={styles.itemText}>
                              {item.drug_name} {item.strength} {item.unit} |{' '}
                              {item.drug_type}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </Col>
                  </Row>
                  {/* <Row>
    <Col style={{marginHorizontal:10,marginTop:20}}>
    <TextInput allowFontScaling={false}
    placeholder="Search Medicine"
    placeholderTextColor={"#2D323C"}
    returnKeyType="done"
    autoCapitalize="none"
    value={this.state.weight}
    // keyboardType="numeric"
    style={styles.input}
    // onChangeText={this.onValueweight.bind(this)}
    />
    </Col>
    </Row> */}
                  <Row style={{marginHorizontal: 3, marginTop: 50}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.DOSE')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col size={50}>
                      <ButtonGroup
                        //  style={{flex:1,flexDirection: 'row',flexWrap: 'wrap',}}
                        onPress={this.updateIndexa}
                        selectedIndex={selectedIndexa}
                        buttons={buttonsa}
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        containerStyle={{
                          height: 40,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{color: 'black'}}
                      />
                    </Col>
                    <Col size={20} style={{marginTop: 5, marginLeft: -5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder={i18n.t('PATIENTS.DOSE')}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.dose1}
                        keyboardType="numeric"
                        style={styles.input}
                        onChangeText={this.onValueDose1.bind(this)}
                      />
                    </Col>
                    <Col
                      size={30}
                      style={{
                        marginTop: 5,
                        borderColor: 'black',
                        borderWidth: 1,
                        height: 40,
                        backgroundColor: 'white',
                        // marginBottom: 10,
                        //marginHorizontal: 5,
                        color: '#4F575C',
                        justifyContent: 'center',
                        marginLeft: 5,
                      }}>
                      <Picker
                        style={{marginTop: -7}}
                        iosIcon={
                          <Icon2
                            style={{top: -7}}
                            name="sort-down"
                            color="#a9a9a9"
                          />
                        }
                        selectedValue={this.state.mesure1}
                        onValueChange={this.onValueChangedose1.bind(this)}>
                        {this.state.drugtype_list.map((item) => (
                          <Picker.Item label={item} value={item} />
                        ))}
                      </Picker>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.TIME')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndexa1}
                        buttons={buttonsa1}
                        selectedIndex={selectedIndexa1}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10, color: 'black'}}
                        innerBorderStyle={{color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col size={30} style={{marginTop: 5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder={i18n.t('PATIENTS.CUSTOM')}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.custom1}
                        keyboardType="numeric"
                        style={styles.input}
                        // onChangeText={(text)=>this.setState({custom:text})}
                        onChangeText={this.onValuecustom1.bind(this)}
                      />
                    </Col>
                    {this.state.custom1 ? (
                      <Col
                        size={35}
                        style={{
                          marginTop: 4,
                          borderColor: 'black',
                          borderWidth: 1,
                          height: 40,
                          backgroundColor: 'white',
                          // marginBottom: 10,
                          marginLeft: 10,
                          marginHorizontal: 5,
                          color: '#4F575C',
                        }}>
                        <Picker
                          enabled={true}
                          // mode="dropdown"
                          style={{
                            //height: 35,
                            marginTop: -7,
                            // alignSelf: 'center',
                          }}
                          iosIcon={
                            <Icon2
                              style={{top: -5, marginLeft: -10}}
                              name="sort-down"
                              color="#a9a9a9"
                            />
                          }
                          selectedValue={this.state.day2}
                          onValueChange={this.onValueChangeday2.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item
                            label={i18n.t('PATIENTS.SELECT')}
                            value=""
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.HOURLY')}
                            value="Hours"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_DAY')}
                            value="Days"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_WEEK')}
                            value="Weeks"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.MONTHLY')}
                            value="Months"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.YEARLY')}
                            value="Years"
                          />
                          {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                        </Picker>
                      </Col>
                    ) : (
                      <Col
                        size={35}
                        style={{
                          marginTop: 4,
                          borderColor: 'black',
                          borderWidth: 1,
                          height: 40,
                          backgroundColor: 'white',
                          // marginBottom: 10,
                          marginLeft: 10,
                          marginHorizontal: 5,
                          color: '#4F575C',
                          //height: 40,
                          justifyContent: 'center',
                        }}>
                        <Picker
                          enabled={true}
                          // mode="dropdown"
                          style={{marginTop: -7}}
                          iosIcon={
                            <Icon2
                              style={{top: -5, marginLeft: -10}}
                              name="sort-down"
                              color="#a9a9a9"
                            />
                          }
                          selectedValue={this.state.day2}
                          onValueChange={this.onValueChangeday2.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item
                            label={i18n.t('PATIENTS.SELECT')}
                            value=""
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.HOURLY')}
                            value="Hours"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_DAY')}
                            value="Days"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.A_WEEK')}
                            value="Weeks"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.MONTHLY')}
                            value="Months"
                          />
                          <Picker.Item
                            label={i18n.t('PATIENTS.YEARLY')}
                            value="Years"
                          />
                          {/* {this.state.search_branch?(
this.state.search_branch.pract_details.map((item) =>(
<Picker.Item label={item.branch_name} value={item.branch_id} />
))):null
} */}
                        </Picker>
                      </Col>
                    )}
                    {/* <Col size={35}> */}
                    <Col size={width * 0.09333333333}>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndexa3}
                        buttons={buttonsa3}
                        selectedIndex={selectedIndexa3}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          width: width * 0.2,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{fontSize: 12, color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col size={30}>
                      {/* {this.state.time_texta || this.state.time_texta1 || this.state.time_texta2 ?
                                                <DatePicker
                                                    allowFontScaling={false}
                                                    style={{ alignSelf: 'flex-start', width: 80, marginHorizontal: 10 }}
                                                    date={this.state.timea}
                                                    mode="time"
                                                    //placeholder="HH:MM"
                                                    customStyles={{
                                                      dateInput: {
                                                        borderColor:"black",
                                                      }
                                                    }}
                                                    showIcon={false}
                                                    format="hh:mm A"
                                                    confirmBtnText="Confirm"
                                                    is24Hour={false}
                                                    // showIcon="false"
                                                    cancelBtnText="Cancel"
                                                    onDateChange={(time) => { this.setTimeDataa(time) }}
                                                /> : null} */}
                      {(this.state.time_texta ||
                        this.state.time_texta1 ||
                        this.state.time_texta2) &&
                      this.state.selectedValue6 ? (
                        <TouchableOpacity
                          style={styles.input1}
                          onPress={this.dispClk3}>
                          <Text style={{marginTop: 10, fontSize: 13}}>
                            {/* {this.state.timea ? this.state.timea : ' HH:MM'} */}

                            {this.state.timea == 'Invalid date' ? (
                              <Text>{'08:00 AM'} </Text>
                            ) : this.state.timea ? (
                              this.state.timea
                            ) : (
                              <Text>{'HH: MM'} </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {this.state.selectedValue7 ? (
                        <DateTimePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          customStyles={{
                            dateInput: {
                              borderColor: 'black',
                            },
                          }}
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          testID="dateTimePicker"
                          accessibilityLabel="dateTimePicker"
                          value={new Date()}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={onChange3}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {/* {this.state.time_texta1 || this.state.time_texta2 ?
                                                <DatePicker
                                                    allowFontScaling={false}
                                                    style={{ alignSelf: 'center', width: 80 }}
                                                    date={this.state.timea1}
                                                    mode="time"
                                                    //placeholder="HH:MM"
                                                    customStyles={{
                                                        dateInput: {
                                                            borderColor: 'black',
                                                        },
                                                    }}
                                                    showIcon={false}
                                                    format="hh:mm A"
                                                    confirmBtnText="Confirm"
                                                    is24Hour={false}
                                                    // showIcon="false"
                                                    cancelBtnText="Cancel"
                                                    onDateChange={(time) => { this.setTimeDataa1(time) }}
                                                /> : null} */}
                      {(this.state.time_texta1 || this.state.time_texta2) &&
                      this.state.selectedValue8 ? (
                        <TouchableOpacity
                          style={styles.input1}
                          onPress={this.dispClk4}>
                          <Text style={{marginTop: 10, fontSize: 13}}>
                            {/* {this.state.timea1 ? this.state.timea1 : ' HH:MM'} */}
                            {this.state.timea1 == 'Invalid date' ? (
                              <Text>{'02:00 PM'} </Text>
                            ) : this.state.timea1 ? (
                              this.state.timea1
                            ) : (
                              <Text>{'HH: MM'} </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {this.state.selectedValue9 ? (
                        <DateTimePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          customStyles={{
                            dateInput: {
                              borderColor: 'black',
                            },
                          }}
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          testID="dateTimePicker"
                          accessibilityLabel="dateTimePicker"
                          value={new Date()}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={onChange4}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {/* {this.state.time_texta2 ?

                                                <DatePicker
                                                    allowFontScaling={false}
                                                    style={{
                                                        alignSelf: 'flex-end',
                                                        width: 80,
                                                        marginHorizontal: 10,
                                                    }}
                                                    date={this.state.timea2}
                                                    mode="time"
                                                    //placeholder="HH:MM"
                                                    customStyles={{
                                                        dateInput: {
                                                            borderColor: 'black',
                                                        },
                                                    }}
                                                    showIcon={false}
                                                    format="hh:mm A"
                                                    confirmBtnText="Confirm"
                                                    is24Hour={false}
                                                    // showIcon="false"
                                                    cancelBtnText="Cancel"
                                                    onDateChange={(time) => { this.setTimeDataa2(time) }}
                                                /> : null} */}
                      {this.state.time_texta2 && this.state.selectedValue10 ? (
                        <TouchableOpacity
                          style={styles.input1}
                          onPress={this.dispClk5}>
                          <Text style={{marginTop: 10, fontSize: 13}}>
                            {/* {this.state.timea2 ? this.state.timea2 : ' HH:MM'} */}
                            {this.state.timea2 == 'Invalid date' ? (
                              <Text>{'09:00 PM'} </Text>
                            ) : this.state.timea2 ? (
                              this.state.timea2
                            ) : (
                              <Text>{'HH: MM'} </Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {this.state.selectedValue11 ? (
                        <DateTimePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          customStyles={{
                            dateInput: {
                              borderColor: 'black',
                            },
                          }}
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          testID="dateTimePicker"
                          accessibilityLabel="dateTimePicker"
                          value={new Date()}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={onChange5}
                        />
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndexa4}
                        buttons={buttonsa4}
                        selectedIndex={selectedIndexa4}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{fontSize: 10, color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.DUR')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndexa2}
                        buttons={buttonsa2}
                        selectedIndex={selectedIndexa2}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          borderColor: 'black',
                          borderRadius: 0,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        innerBorderStyle={{color: 'black'}}
                        textStyle={{fontSize: 12, color: 'black'}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      size={50}
                      style={{marginTop: 10, marginHorizontal: 10}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder={i18n.t('PATIENTS.DUR')}
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.duration1}
                        keyboardType="numeric"
                        style={styles.input}
                        // onChangeText={(text)=>this.setState({duration:text})}
                        onChangeText={this.onValueduration1.bind(this)}
                      />
                    </Col>
                    <Col
                      size={50}
                      style={{
                        marginTop: 8,
                        borderColor: 'black',
                        borderWidth: 1,
                        height: 40,
                        backgroundColor: 'white',
                        marginLeft: 10,
                        // marginBottom: 10,
                        marginHorizontal: 5,
                        color: '#4F575C',
                      }}>
                      <Picker
                        // mode="dropdown"
                        style={{marginTop: -7}}
                        iosIcon={
                          <Icon2
                            style={{top: -5}}
                            name="sort-down"
                            color="#a9a9a9"
                          />
                        }
                        selectedValue={this.state.day3}
                        onValueChange={this.onValueChangeday3.bind(this)}
                        // onValueChange={(value) => {this.setState({hospital_branch: value})}
                      >
                        <Picker.Item
                          label={i18n.t('PATIENTS.DAYS')}
                          value="Days"
                        />
                        <Picker.Item
                          label={i18n.t('PATIENTS.WEEKS')}
                          value="Weeks"
                        />
                        <Picker.Item
                          label={i18n.t('PATIENTS.MONTHS')}
                          value="Months"
                        />
                        <Picker.Item
                          label={i18n.t('PATIENTS.YEARS')}
                          value="Years"
                        />
                        {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                      </Picker>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        {i18n.t('PATIENTS.DUR_NOTE')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextInput
                        allowFontScaling={false}
                        // placeholder="Type something"
                        value={this.state.note1}
                        multiline={true}
                        // numberOfLines={5}
                        onContentSizeChange={(event) => {
                          this.setState({
                            height2: event.nativeEvent.contentSize.height,
                          });
                        }}
                        style={{
                          height: 200,
                          textAlignVertical: 'top',
                          height: Math.max(35, this.state.height2),
                          borderColor: 'black',
                          borderWidth: 1,
                          borderWidth: 1,
                          marginHorizontal: 10,
                        }}
                        onChangeText={(text) => this.setState({note1: text})}
                      />
                    </Col>
                  </Row>
                </View>
              </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
            {/* </ScrollView> */}
            {/* <Button
    title="Go back"
    onPress={() => this.closeOverlay()}
    containerStyle={{alignSelf:'center'}}
    buttonStyle={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20}}
    /> */}
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {this.state.ban1 && (
                <Button
                  onPress={() => this.add_medicine3()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: 'center',
                    height: 40,
                    width: 60,
                    margin: 10,
                  }}>
                  {/* <Text allowFontScaling={false}style={{fontSize:12,color:"white",alignItems:"center"}}>save&add </Text> */}
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: 'white',
                      fontSize: 10,
                      alignItems: 'center',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="plus"
                      style={{fontSize: 20, marginTop: 30, color: 'white'}}
                    />
                  </Text>
                </Button>
              )}

              {this.state.ban1 && (
                <Button
                  onPress={async () => {
                    await this.add_medicine1();
                    this.props.changeTabData(-1);
                    this.closeOverlay1();
                  }}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: 'center',
                    height: 40,
                    width: 70,
                    margin: 10,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 15,
                      color: 'white',
                      alignItems: 'center',
                    }}>
                    {i18n.t('PATIENTS.SAVE')}
                  </Text>
                </Button>
              )}

              {this.state.ban1 && (
                <Button
                  onPress={() => {
                    this.props.changeTabData(-1);
                    this.closeOverlay1();
                  }}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: 'center',
                    height: 40,
                    width: 60,
                    margin: 10,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: 'white',
                      fontSize: 10,
                      alignItems: 'center',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="times"
                      style={{fontSize: 20, marginTop: 30, color: 'white'}}
                    />
                  </Text>
                </Button>
              )}

              {this.state.ban2 && (
                <Button
                  onPress={() => this.updatems2()}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: 'center',
                    height: 40,
                    width: 70,
                    margin: 10,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 15,
                      color: 'white',
                      alignItems: 'center',
                    }}>
                    Update
                  </Text>
                </Button>
              )}

              {this.state.ban2 && (
                <Button
                  onPress={() => {
                    this.props.changeTabData(-1);
                    this.closeOverlay1();
                  }}
                  style={{
                    backgroundColor: APP_PRIMARY_COLOR,
                    justifyContent: 'center',
                    height: 40,
                    width: 60,
                    margin: 10,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: 'white',
                      fontSize: 10,
                      alignItems: 'center',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name="times"
                      style={{fontSize: 20, marginTop: 30, color: 'white'}}
                    />
                  </Text>
                </Button>
              )}
            </View>
            <FlashMessage
              position="top"
              ref={(ref) => (this.PlanAlert2 = ref)}
            />
          </Overlay>
        </View>
      );
    }
    if (this.props.changetab == 2) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Overlay
            fullScreen={true}
            onBackdropPress={() => {
              this.closeOverlay2();
              this.props.changeTabData(-1);
            }}>
            <KeyboardAwareScrollView>
              <KeyboardAvoidingView
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                behavior="margin"
                enabled
                keyboardVerticalOffset={1000}>
                {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
                <View>
                  <Row>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontWeight: 'bold',
                          fontSize: 18,
                          alignSelf: 'center',
                        }}>
                        {' '}
                        {i18n.t('PATIENTS.LAB_1')}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      size={80}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: 20,
                        marginLeft: 10,
                        marginBottom: 20,
                      }}>
                      <AutoTags
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{
                          minWidth: 500,
                          maxWidth: 800,
                        }}
                        value={this.state.clear_lab_val}
                        suggestions={this.state.suggestions}
                        tagsSelected={this.state.tagsSelected}
                        placeholder={i18n.t('PATIENTS.LAB_1')}
                        handleAddition={this.handleAddition}
                        handleDelete={this.handleDelete}
                        onChange={(text) => this.addlab(text)}
                        returnKeyType="done"
                      />
                    </Col>
                    <Col size={20}></Col>
                  </Row>
                  <Row>
                    <Col size={70}>
                      {this.state.lab_flg && (
                        <TextInput
                          allowFontScaling={false}
                          placeholder="Type Here..."
                          placeholderTextColor={'#2D323C'}
                          returnKeyType="done"
                          value={this.state.set_labval}
                          style={{
                            borderColor: '#345D7E',
                            borderWidth: 1,
                            backgroundColor: 'white',
                            marginTop: 6,
                            marginLeft: 10,
                            color: '#4F575C',
                          }}
                          onChangeText={(text) =>
                            this.setState({set_labval: text})
                          }
                        />
                      )}
                    </Col>
                    <Col size={30}>
                      {this.state.lab_flg && (
                        <Button
                          style={{
                            backgroundColor: APP_PRIMARY_COLOR,
                            height: 34,
                            width: 40,
                            marginLeft: 10,
                            marginTop: 13,
                          }}
                          onPress={() => this.addlab1()}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              color: 'white',
                              fontSize: 10,
                              marginLeft: 12,
                            }}>
                            <Icon
                              type="FontAwesome"
                              name="plus"
                              style={{
                                fontSize: 20,
                                marginTop: 30,
                                color: 'white',
                              }}
                            />
                          </Text>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </View>
              </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
            {/* </ScrollView> */}
            {/* <View style={{flexDirection:"row",alignSelf:"center"}}>
             <Button style={{height:40,width:150,backgroundColor:"#F67F7D",marginTop:25,alignSelf:"center",justifyContent:"center"}} onPress={()=>this.saveLabOrder()}>
  <Text allowFontScaling={false}style={{color:"white",fontSize:18}}>Save</Text>
  </Button>
  <Button style={{marginLeft:10,height:40,width:120,backgroundColor:APP_PRIMARY_COLOR,marginTop:25,alignSelf:"center",justifyContent:"center"}} onPress={()=>this.closeOverlay2()}>
  <Text allowFontScaling={false}style={{color:"white",fontSize:18}}>Cancel</Text>
  </Button>
  </View> */}
            {/* <Button onPress={() => this.closeOverlay2()} style={{backgroundColor:"#F67F7D",justifyContent: 'center',height:40,width:60,marginLeft:140}}>
                    <Text allowFontScaling={false}style={{fontSize:15,color:"white",alignItems:"center"}}>Cancel</Text>
                  </Button>   */}
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.checkSaveLabOrder()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.SAVE')}
                </Text>
              </Button>
              <Button
                style={{
                  marginLeft: 10,
                  height: 40,
                  width: 120,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.closeOverlay2();
                  this.props.changeTabData(-1);
                }}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.CANCEL')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    if (this.props.changetab == 3) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible1
            fullScreen={true}
            //height={300}
            //width={380}
            onBackdropPress={() => {
              this.props.changeTabData(-1);
              this.closeOverlay3();
            }}>
            {/* <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'always'}> */}
            {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
            <KeyboardAwareScrollView>
              <KeyboardAvoidingView
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                behavior="margin"
                enabled
                keyboardVerticalOffset={1000}>
                <View>
                  <Row>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontWeight: 'bold',
                          fontSize: 15,
                          alignSelf: 'center',
                        }}>
                        {i18n.t('PATIENTS.IMAGE_ADD_ORDER')}
                      </Text>
                    </Col>
                    {/* <Col size={50} style={{alignItems:"flex-end"}}>
          <Button style={{backgroundColor:"#F67F7D",height:34,width:90,alignSelf:"flex-end"}} onPress={()=>this.setState({visible6:true})}>
            <Text allowFontScaling={false}style={{color:"white",fontSize:10,marginLeft:20,width:90}}>Past Orders</Text>
          </Button>
          </Col> */}
                    {/* <Col size={50} style={{alignItems:"flex-end",marginTop:45}}>
          <Button style={{backgroundColor:"#F67F7D",height:35,width:40,marginRight:10}} onPress={()=>this.saveImagingOrder()}>
            <Text allowFontScaling={false}style={{color:"white",fontSize:10,marginLeft:12}}><Icon type="FontAwesome" name="plus" style={{fontSize:20,marginTop:30,color:"white"}} /></Text>
          </Button>
          </Col> */}
                  </Row>
                  <Row>
                    <Col
                      size={80}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignSelf: 'stretch',
                        marginTop: 20,
                        marginLeft: 10,
                        marginBottom: 20,
                      }}>
                      <AutoTags
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{
                          minWidth: 500,
                          maxWidth: 800,
                        }}
                        value={this.state.clear_img_val}
                        suggestions={this.state.suggestions1}
                        tagsSelected={this.state.tagsSelected1}
                        placeholder={i18n.t('PATIENTS.IMAGE_ADD_ORDER')}
                        handleAddition={this.handleAddition1}
                        handleDelete={this.handleDelete1}
                        onChange={(text) => this.addimage(text)}
                      />
                    </Col>
                    <Col size={20}></Col>
                  </Row>
                  <Row>
                    <Col size={70}>
                      {this.state.img_flg && (
                        <TextInput
                          allowFontScaling={false}
                          placeholder="Type Here..."
                          placeholderTextColor={'#2D323C'}
                          returnKeyType="done"
                          value={this.state.set_imgval}
                          style={{
                            borderColor: '#345D7E',
                            borderWidth: 1,
                            backgroundColor: 'white',
                            marginTop: 6,
                            marginLeft: 10,
                            color: '#4F575C',
                          }}
                          onChangeText={(text) =>
                            this.setState({set_imgval: text})
                          }
                        />
                      )}
                    </Col>
                    <Col size={30}>
                      {this.state.img_flg && (
                        <Button
                          style={{
                            backgroundColor: APP_PRIMARY_COLOR,
                            height: 34,
                            width: 40,
                            marginLeft: 10,
                            marginTop: 13,
                          }}
                          onPress={() => this.addimage1()}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              color: 'white',
                              fontSize: 10,
                              marginLeft: 12,
                            }}>
                            <Icon
                              type="FontAwesome"
                              name="plus"
                              style={{
                                fontSize: 20,
                                marginTop: 30,
                                color: 'white',
                              }}
                            />
                          </Text>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </View>
              </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
            {/* </ScrollView> */}
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.checkSaveImagingOrder()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.SAVE')}
                </Text>
              </Button>
              <Button
                style={{
                  marginLeft: 10,
                  height: 40,
                  width: 120,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.props.changeTabData(-1);
                  this.closeOverlay3();
                }}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.CANCEL')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }

    if (this.props.changetab == 4) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible1
            fullScreen={true}
            //height={300}
            //width={380}
            onBackdropPress={() => {
              this.props.changeTabData(-1);
              this.closeOverlay4();
            }}>
            {/* <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'always'}> */}
            {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
            <KeyboardAwareScrollView>
              <KeyboardAvoidingView
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                behavior="margin"
                enabled
                keyboardVerticalOffset={1000}>
                <View>
                  <Row>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{
                          marginLeft: 10,
                          fontWeight: 'bold',
                          fontSize: 15,
                          alignSelf: 'center',
                        }}>
                        {i18n.t('PATIENTS.ADD_NURSE_SERVICE')}
                      </Text>
                    </Col>
                    {/* <Col size={50} style={{alignItems:"flex-end",marginTop:45}}>
          <Button style={{backgroundColor:"#F67F7D",height:34,width:40,marginRight:10}} onPress={()=>this.saveNursingOrder()}>
            <Text allowFontScaling={false}style={{color:"white",fontSize:10,marginLeft:12}}><Icon type="FontAwesome" name="plus" style={{fontSize:20,marginTop:30,color:"white"}} /></Text>
          </Button>
          </Col> */}
                  </Row>
                  <Row>
                    <Col
                      size={80}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignSelf: 'stretch',
                        marginTop: 20,
                        marginLeft: 10,
                        marginBottom: 20,
                      }}>
                      <AutoTags
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{
                          minWidth: 500,
                          maxWidth: 800,
                        }}
                        value={this.state.clear_nurs_val}
                        suggestions={this.state.suggestions2}
                        tagsSelected={this.state.tagsSelected2}
                        placeholder={i18n.t('PATIENTS.ADD_NURSE_SERVICE')}
                        handleAddition={this.handleAddition2}
                        handleDelete={this.handleDelete2}
                        onChange={(text) => this.addNurse(text)}
                      />
                    </Col>
                    <Col size={20}></Col>
                  </Row>
                  <Row>
                    <Col size={70}>
                      {this.state.nurs_flg && (
                        <TextInput
                          allowFontScaling={false}
                          placeholder="Type Here..."
                          placeholderTextColor={'#2D323C'}
                          returnKeyType="done"
                          value={this.state.set_nursval}
                          style={{
                            borderColor: '#345D7E',
                            borderWidth: 1,
                            backgroundColor: 'white',
                            marginTop: 6,
                            marginLeft: 10,
                            color: '#4F575C',
                          }}
                          onChangeText={(text) =>
                            this.setState({set_nursval: text})
                          }
                        />
                      )}
                    </Col>
                    <Col size={30}>
                      {this.state.nurs_flg && (
                        <Button
                          style={{
                            backgroundColor: APP_PRIMARY_COLOR,
                            height: 34,
                            width: 40,
                            marginLeft: 10,
                            marginTop: 13,
                          }}
                          onPress={() => this.addNurse1()}>
                          <Text
                            allowFontScaling={false}
                            style={{
                              color: 'white',
                              fontSize: 10,
                              marginLeft: 12,
                            }}>
                            <Icon
                              type="FontAwesome"
                              name="plus"
                              style={{
                                fontSize: 20,
                                marginTop: 30,
                                color: 'white',
                              }}
                            />
                          </Text>
                        </Button>
                      )}
                    </Col>
                  </Row>
                </View>
              </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
            {/* </ScrollView> */}
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.checkSaveNursingOrder()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.SAVE')}
                </Text>
              </Button>
              <Button
                style={{
                  marginLeft: 10,
                  height: 40,
                  width: 120,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.props.changeTabData(-1);
                  this.closeOverlay4();
                }}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.CANCEL')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    if (this.props.changetab == 5) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible1
            fullScreen={true}
            //height={300}
            //width={380}
            onBackdropPress={() => {
              this.props.changeTabData(-1);
              this.closeOverlay5();
            }}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
              <View>
                <Row style={{marginTop: 10}}>
                  <Col size={50}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 10,
                        fontWeight: 'bold',
                        marginTop: 5,
                        fontSize: 15,
                        alignSelf: 'center',
                      }}>
                      {i18n.t('PATIENTS.VACCINE')}
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col size={90} style={{marginLeft: 10}}>
                    <Autocomplete
                      autoCapitalize="none"
                      autoCorrect={false}
                      containerStyle={styles.autocompleteContainer}
                      data={
                        vaccinesdata.length === 1 &&
                        comp(query2, vaccinesdata[0].vaccine_brand_name)
                          ? []
                          : vaccinesdata
                      }
                      defaultValue={query2}
                      onChangeText={(text) => this.setState({query2: text})}
                      placeholder={i18n.t('PATIENTS.SEARCH_VACCINE')}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({
                              query2: item.vaccine_brand_name,
                              vaccine_id: item.vaccine_id,
                              service_master_id: item.service_master_id,
                              vaccindb: true,
                            })
                          }>
                          <Text
                            allowFontScaling={false}
                            style={styles.itemText}>
                            {item.vaccine_brand_name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </Col>
                  {/* <Col size={20} style={{alignItems:"flex-end"}}>
          <Button style={{backgroundColor:"#F67F7D",height:35,width:40,marginRight:10}} onPress={()=>this.saveVaccine()}>
            <Text allowFontScaling={false}style={{color:"white",fontSize:10,marginLeft:12}}><Icon type="FontAwesome" name="plus" style={{fontSize:20,marginTop:30,color:"white"}} /></Text>
          </Button>
          </Col>*/}
                </Row>
              </View>
            </ScrollView>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.saveVaccine()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.SAVE')}
                </Text>
              </Button>
              <Button
                style={{
                  marginLeft: 10,
                  height: 40,
                  width: 120,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.props.changeTabData(-1);
                  this.closeOverlay5();
                }}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('PATIENTS.CANCEL')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    if (this.state.visible6) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible1 height={500} width={380}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 15, fontWeight: 'bold', marginLeft: 110}}>
              Past Orders
            </Text>
            {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
            <TouchableOpacity onPress={() => this.repeatAllLabOrder()}>
              <Text allowFontScaling={false} style={{alignSelf: 'flex-end'}}>
                <Icon style={{fontSize: 20}} active name="md-repeat" />
                Repeat All
              </Text>
            </TouchableOpacity>
            <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'handled'}>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
              <View>
                <Row>
                  <Col style={{marginHorizontal: 10, marginTop: 20}}>
                    <Item picker>
                      <Picker
                        // mode="dropdown"
                        style={{height: 40, marginTop: 10}}
                        selectedValue={this.state.lab_encounter}
                        onValueChange={this.onValueChangeLabEncounter.bind(
                          this,
                        )}
                        // onValueChange={(value) => {this.setState({hospital_branch: value})}
                      >
                        {this.props.timelineList.message.length > 0 &&
                          this.props.timelineList.message.map(
                            (itemdata) =>
                              itemdata.enc_id && (
                                <Picker.Item
                                  label={itemdata.enc_id}
                                  value={itemdata.enc_id}
                                />
                              ),
                          )}
                      </Picker>
                    </Item>
                  </Col>
                </Row>
                {/* <Row>
        <Col size={40} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}>Type</Text>
          </Col>
          <Col size={40} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}>Encounter Code</Text>
          </Col>
          <Col size={20} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}>Action</Text>
          </Col>
        </Row> */}
                <Row>
                  <Col>
                    <FlatList
                      style={styles.contentList}
                      columnWrapperStyle={styles.listContainer}
                      data={
                        this.state.lab_encountersList[0].lab.length > 0
                          ? this.state.lab_encountersList[0].lab
                          : []
                      }
                      keyExtractor={(item) => {
                        return item.id;
                      }}
                      renderItem={({item}) => {
                        return (
                          <View style={styles.card}>
                            <Row>
                              <Col>
                                <Row>
                                  <Col size={80}>
                                    <Text
                                      allowFontScaling={false}
                                      style={{fontSize: 14, color: '#2D323C'}}>
                                      {' '}
                                      <Text
                                        allowFontScaling={false}
                                        style={{fontWeight: '500'}}>
                                        Lab:{' '}
                                      </Text>
                                      {item.lab ? item.lab : item.lab_name}
                                    </Text>
                                    <Text
                                      allowFontScaling={false}
                                      style={{fontSize: 14, color: '#2D323C'}}>
                                      <Text
                                        allowFontScaling={false}
                                        style={{fontWeight: '500'}}>
                                        ID:{' '}
                                      </Text>
                                      {item.encounterCode}
                                    </Text>
                                  </Col>
                                  <Col size={20} style={{marginTop: 10}}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.repeatLabOrder(item.lab_test_id)
                                      }
                                      disabled={
                                        item.delete_status == 1 ? true : false
                                      }>
                                      <Icon
                                        style={{fontSize: 20}}
                                        active
                                        name="md-repeat"
                                      />
                                    </TouchableOpacity>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </View>
                        );
                      }}
                    />
                  </Col>
                </Row>
              </View>
            </ScrollView>
            <Button
              onPress={() => this.closeOverlay6()}
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                justifyContent: 'center',
                height: 40,
                width: 60,
                marginLeft: 140,
              }}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 15, color: 'white', alignItems: 'center'}}>
                Cancel
              </Text>
            </Button>
          </Overlay>
        </View>
      );
    }
    if (this.state.visible7) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible1 height={500} width={380}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 15, fontWeight: 'bold', marginLeft: 110}}>
              Past Orders
            </Text>
            {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
            <TouchableOpacity onPress={() => this.repeatAllImagingOrder()}>
              <Text allowFontScaling={false} style={{alignSelf: 'flex-end'}}>
                <Icon style={{fontSize: 20}} active name="md-repeat" />
                Repeat All
              </Text>
            </TouchableOpacity>
            <ScrollView style={{marginTop: 15}}>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
              <View>
                <Row>
                  <Col style={{marginHorizontal: 10, marginTop: 20}}>
                    <Item picker>
                      <Picker
                        // mode="dropdown"
                        style={{height: 40, marginTop: 10}}
                        selectedValue={this.state.imaging_encounter}
                        onValueChange={this.onValueChangeImagingEncounter.bind(
                          this,
                        )}
                        // onValueChange={(value) => {this.setState({hospital_branch: value})}
                      >
                        {this.props.timelineList.message.length > 0 &&
                          this.props.timelineList.message.map(
                            (itemdata) =>
                              itemdata.enc_id && (
                                <Picker.Item
                                  label={itemdata.enc_id}
                                  value={itemdata.enc_id}
                                />
                              ),
                          )}
                      </Picker>
                    </Item>
                  </Col>
                </Row>
                {/* <Row>
        <Col size={40} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}>Type</Text>
          </Col>
          <Col size={40} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}>Encounter Code</Text>
          </Col>
          <Col size={20} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}>Action</Text>
          </Col>
        </Row> */}
                {this.state.imaging_encountersList[0].img != undefined && (
                  <Row>
                    <Col>
                      <FlatList
                        style={styles.contentList}
                        columnWrapperStyle={styles.listContainer}
                        data={this.state.imaging_encountersList[0].img}
                        keyExtractor={(item) => {
                          return item.id;
                        }}
                        renderItem={({item}) => {
                          return (
                            <View style={styles.card}>
                              <Row>
                                <Col>
                                  <Row>
                                    <Col size={80}>
                                      <Text
                                        allowFontScaling={false}
                                        style={{
                                          fontSize: 14,
                                          color: '#2D323C',
                                        }}>
                                        {' '}
                                        <Text
                                          allowFontScaling={false}
                                          style={{fontWeight: '500'}}>
                                          Type:{' '}
                                        </Text>
                                        {item.image_type}
                                      </Text>
                                      <Text
                                        allowFontScaling={false}
                                        style={{
                                          fontSize: 14,
                                          color: '#2D323C',
                                        }}>
                                        <Text
                                          allowFontScaling={false}
                                          style={{fontWeight: '500'}}>
                                          ID:{' '}
                                        </Text>
                                        {item.encounterCode}
                                      </Text>
                                    </Col>

                                    <Col size={20} style={{marginTop: 10}}>
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.repeatImagingOrder(
                                            item.imaging_id,
                                          )
                                        }
                                        style={{color: '#'}}>
                                        <Icon
                                          style={{fontSize: 40}}
                                          active
                                          name="md-repeat"
                                        />
                                      </TouchableOpacity>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </View>
                          );
                        }}
                      />
                    </Col>
                  </Row>
                )}
              </View>
            </ScrollView>
            <Button
              onPress={() => this.closeOverlay7()}
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                justifyContent: 'center',
                height: 40,
                width: 60,
                marginLeft: 140,
              }}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 15, color: 'white', alignItems: 'center'}}>
                Cancel
              </Text>
            </Button>
          </Overlay>
        </View>
      );
    }
    if (this.state.visible4) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible1
            height={300}
            width={380}
            onBackdropPress={() => this.closeOverlay4()}>
            <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'handled'}>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
              <View>
                <Row style={{marginTop: 10}}>
                  <Col size={50}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        marginLeft: 10,
                        fontWeight: 'bold',
                        marginTop: 5,
                        fontSize: 15,
                      }}>
                      Nursing Service
                    </Text>
                  </Col>
                  <Col
                    size={50}
                    style={{alignItems: 'flex-end', marginTop: 45}}>
                    <Button
                      style={{
                        backgroundColor: APP_PRIMARY_COLOR,
                        height: 34,
                        width: 40,
                        marginRight: 10,
                      }}
                      onPress={() => this.saveNursingOrder()}>
                      <Text
                        allowFontScaling={false}
                        style={{color: 'white', fontSize: 10, marginLeft: 12}}>
                        <Icon
                          type="FontAwesome"
                          name="plus"
                          style={{fontSize: 20, marginTop: 30, color: 'white'}}
                        />
                      </Text>
                    </Button>
                  </Col>
                </Row>
                <Row style={{marginTop: -55}}>
                  <Col
                    size={80}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'stretch',
                      marginTop: 20,
                      marginLeft: 10,
                      marginBottom: 20,
                    }}>
                    <AutoTags
                      containerStyle={{
                        minWidth: 500,
                        maxWidth: 800,
                      }}
                      suggestions={this.state.suggestions2}
                      tagsSelected={this.state.tagsSelected2}
                      placeholder="Add Nursing Service"
                      handleAddition={this.handleAddition2}
                      handleDelete={this.handleDelete2}
                    />
                  </Col>
                  <Col size={20}></Col>
                </Row>
              </View>
            </ScrollView>
            <Button
              onPress={() => this.closeOverlay8()}
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                justifyContent: 'center',
                height: 40,
                width: 60,
                marginLeft: 140,
              }}>
              <Text
                allowFontScaling={false}
                style={{fontSize: 15, color: 'white', alignItems: 'center'}}>
                Cancel
              </Text>
            </Button>
          </Overlay>
        </View>
      );
    }
    if (this.state.alertvisible) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            height={240}
            onBackdropPress={() => this.setState({alertvisible: false})}>
            <Icon
              type="FontAwesome"
              name="times-circle-o"
              style={{fontSize: 60, color: 'red', alignSelf: 'center'}}
            />
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                marginVertical: 30,
              }}>
              {i18n.t('PATIENTS.SURE')}
            </Text>
            <Text
              allowFontScaling={false}
              style={{alignSelf: 'center', fontSize: 18}}>
              {i18n.t('PATIENTS.REVERT')}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{height: 40, marginTop: 8, marginRight: 20, width: 100}}
                onPress={() => {
                  this.state.deletesection == 'Vaccine'
                    ? this.deleteVaccineOrder(
                        this.state.deleteid,
                        this.state.version_status,
                      )
                    : this.state.deletesection == 'Lab'
                    ? this.state.deletecheck == 'json'
                      ? this.deleteTempLabOrder(this.state.deleteid)
                      : this.deleteLabOrder(
                          this.state.deleteid,
                          this.state.version_status,
                        )
                    : this.state.deletesection == 'Imaging'
                    ? this.state.deletecheck == 'json'
                      ? this.deleteTempImagingOrder(this.state.deleteid)
                      : this.deleteImagingOrder(
                          this.state.deleteid,
                          this.state.version_status,
                        )
                    : this.state.deletesection == 'Nursing'
                    ? this.state.deletecheck == 'json'
                      ? this.deleteTempNursingOrder(this.state.deleteid)
                      : this.deleteNursingOrder(
                          this.state.deleteid,
                          this.state.version_status,
                        )
                    : this.state.deletesection == 'Medicine'
                    ? this.state.deletecheck == 'json'
                      ? this.delete_temp_medicine(this.state.deleteid)
                      : this.delete_medicine(
                          this.state.deleteid,
                          this.state.version_status,
                        )
                    : this.state.deletesection == 'Supplement'
                    ? this.state.deletecheck == 'json'
                      ? this.delete_temp_supplement(this.state.deleteid)
                      : this.delete_supplement(
                          this.state.deleteid,
                          this.state.version_status,
                        )
                    : null;

                  this.setState({alertvisible: false});
                }}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 10}}>
                  {i18n.t('PATIENTS.DELETE')}
                </Text>
              </Button>
              <Button
                danger
                style={{height: 40, marginTop: 8, marginLeft: 10, width: 80}}
                onPress={() => this.setState({alertvisible: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  {i18n.t('PATIENTS.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    if (this.state.alertvisible2) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            height={240}
            onBackdropPress={() => this.setState({alertvisible2: false})}>
            <Icon
              type="FontAwesome"
              name="check-circle"
              style={{
                fontSize: 60,
                color: 'green',
                alignSelf: 'center',
                marginTop: 40,
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                marginVertical: 30,
              }}>
              {this.state.deletesection + ' Saved Successfully'}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{
                  height: 40,
                  marginTop: 8,
                  marginRight: 40,
                  width: 80,
                  alignSelf: 'center',
                }}
                onPress={() => this.setState({alertvisible2: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  {i18n.t('PATIENTS.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    if (this.state.alertvisible3) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            height={240}
            onBackdropPress={() => this.setState({alertvisible3: false})}>
            <Icon
              type="FontAwesome"
              name="check-circle"
              style={{fontSize: 60, color: 'green', alignSelf: 'center'}}
            />
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                marginVertical: 30,
              }}>
              {this.state.deletesection + ' Deleted Successfully'}{' '}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{
                  height: 40,
                  marginTop: 8,
                  marginRight: 20,
                  width: 80,
                  alignSelf: 'center',
                }}
                onPress={() => this.setState({alertvisible3: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  {i18n.t('PATIENTS.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    if (this.state.alertvisible4) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay
            isVisible
            height={240}
            onBackdropPress={() => this.setState({alertvisible4: false})}>
            <Icon
              type="FontAwesome"
              name="check-circle"
              style={{
                fontSize: 60,
                color: 'green',
                alignSelf: 'center',
                marginTop: 30,
              }}
            />
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                marginVertical: 30,
              }}>
              {i18n.t('PATIENTS.PLAN_SAVE')}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Button
                success
                style={{
                  height: 40,
                  marginTop: 8,
                  marginRight: 10,
                  width: 80,
                  alignSelf: 'center',
                }}
                onPress={() => this.setState({alertvisible4: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  {i18n.t('PATIENTS.BACK')}
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    return (
      // <ScrollView showsVerticalScrollIndicator={true}>
      <KeyboardAwareScrollView>
        <View style={{flex: 1}}>
          <FileSelector
            ref={this.fileSelRef}
            onSelection={this.handleSelection}
            selectAny
          />
          <Row
            style={{
              height: 55,
              backgroundColor: APP_PRIMARY_COLOR,
              alignItems: 'center',
            }}>
            <Col style={{alignItems: 'center'}}>
              <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
                <Icon
                  onPress={() => {
                    this.props.navigation.navigate('Subjective');
                  }}
                  type="FontAwesome"
                  name="arrow-left"
                  style={{
                    fontSize: 25,
                    backgroundColor: APP_PRIMARY_COLOR,
                    color: '#ffffff',
                  }}
                />
              </View>
            </Col>
            {/* <View style={{ backgroundColor: APP_PRIMARY_COLOR }}> */}
            <Col style={{alignItems: 'center'}}>
              <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
                <TouchableOpacity onPress={() => this.props.changeTabData(0)}>
                  <Thumbnail
                    style={{height: 28, width: 28, marginRight: 5}}
                    square
                    source={require('../../../../assets/images/medicine.png')}
                  />
                  <Text style={{fontSize: 12, color: 'white'}}>MED</Text>
                </TouchableOpacity>
              </View>
            </Col>
            <Col style={{alignItems: 'center'}}>
              <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
                <TouchableOpacity onPress={() => this.props.changeTabData(1)}>
                  <Thumbnail
                    style={{height: 28, width: 28, marginRight: 5}}
                    square
                    source={require('../../../../assets/images/supplement.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{fontSize: 12, color: 'white'}}>SUP</Text>
            </Col>
            <Col style={{alignItems: 'center'}}>
              <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
                <TouchableOpacity onPress={() => this.props.changeTabData(2)}>
                  <Thumbnail
                    style={{height: 28, width: 28, marginRight: 5}}
                    square
                    source={require('../../../../assets/images/lab.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{fontSize: 12, color: 'white'}}>LAB</Text>
            </Col>
            <Col style={{alignItems: 'center'}}>
              <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
                <TouchableOpacity onPress={() => this.props.changeTabData(3)}>
                  <Thumbnail
                    style={{height: 28, width: 28, marginRight: 5}}
                    square
                    source={require('../../../../assets/images/imaging.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{fontSize: 12, color: 'white'}}>IMG</Text>
            </Col>
            <Col style={{alignItems: 'center'}}>
              <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
                <TouchableOpacity onPress={() => this.props.changeTabData(4)}>
                  <Thumbnail
                    style={{height: 28, width: 28, marginRight: 5}}
                    square
                    source={require('../../../../assets/images/nursing.png')}
                  />
                </TouchableOpacity>
              </View>

              <Text style={{fontSize: 12, color: 'white'}}>NUR</Text>
            </Col>
            <Col style={{alignItems: 'center'}}>
              <View style={{backgroundColor: APP_PRIMARY_COLOR}}>
                <TouchableOpacity
                  onPress={() =>
                    this.state.vaccines != ''
                      ? this.props.changeTabData(5)
                      : alert('Vaccines Unavailable')
                  }>
                  <Thumbnail
                    style={{height: 28, width: 28, marginRight: 5}}
                    square
                    source={require('../../../../assets/images/vaccination.png')}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{fontSize: 12, color: 'white'}}>VAC</Text>
            </Col>

            {/* </View> */}
          </Row>
          <Row>
            <Col>
              <FlatList
                style={styles.contentList}
                columnWrapperStyle={styles.listContainer}
                data={this.state.medicines_data}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return (
                    <View style={styles.card}>
                      <Row>
                        <Col>
                          <TouchableOpacity
                            onPress={() => {
                              item.from == 'json'
                                ? this.setState({
                                    visible: true,
                                    query:
                                      item.trade_name.trim() +
                                      ' | ' +
                                      item.drug_type.trim(),
                                    lb: 'Edit',
                                    ban3: false,
                                    ban4: true,
                                    junk_medicine: true,
                                    dose:
                                      item.size.split(' ')[0] <= 3 ||
                                      (item.size.split(' ')[0].split('/')[0] ==
                                        1 &&
                                        item.size.split(' ')[0].split('/')[1] ==
                                          2)
                                        ? ''
                                        : item.size.split(' ')[0],
                                    selectedIndex:
                                      item.size.split(' ')[0] <= 3 ||
                                      (item.size.split(' ')[0].split('/')[0] ==
                                        1 &&
                                        item.size.split(' ')[0].split('/')[1] ==
                                          2)
                                        ? this.state.buttons.indexOf(
                                            item.size.split(' ')[0],
                                          )
                                        : 'undefined',
                                    selectedIndex1:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                        ? this.state.buttons1.indexOf(
                                            item.timings.split(' ')[0],
                                          )
                                        : 'undefined',
                                    custom:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                        ? ''
                                        : item.timings.split(' ')[0],
                                    day:
                                      item.timings.split(' ')[1] != undefined &&
                                      item.timings.split(' ')[1] != '' &&
                                      item.timings.split(' ')[1] != 'SOS'
                                        ? item.timings.split(' ')[1]
                                        : '',
                                    selectedIndex4:
                                      item.before_after != ''
                                        ? this.state.buttons4.indexOf(
                                            item.before_after,
                                          )
                                        : '',
                                    selectedIndex2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttons2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 1
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day1:
                                      item.duration != ''
                                        ? item.duration.split(' ')[1] !=
                                          'undefined'
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : item.duration.split(' ')[1],
                                    note: item.notes,
                                    selectedIndex3:
                                      item.timings.includes('SOS') == true
                                        ? 0
                                        : 'undefined',
                                    mesure:
                                      item.drug_type != null &&
                                      (item.size.split(' ')[1] != 'undefined' &&
                                      item.size.length > 3
                                        ? item.size.split(' ')[1]
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'tablet' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'tablets' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'tablets and capsules')
                                        ? i18n.t('PATIENTS.TAB')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? 'CAPTTT'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'lotion' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'liquid' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'syrup' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'respules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suspensions' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'spray' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'shampoo' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'solution')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'ointment' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'linement' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'cream' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'creams' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gel' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gels' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'granules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye ointmen')
                                        ? i18n.t('PATIENTS.MG')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'injection' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'ampule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'vial')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() ==
                                            i18n.t('PATIENTS.DROPS') ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye/ear drops')
                                        ? i18n.t('PATIENTS.DROPS')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'syringe' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'disposals' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suture' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'miscellaneous' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'soap' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'lozenges' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'condom')
                                        ? i18n.t('PATIENTS.UNIT')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'powder' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'powders' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'churna' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'bhasma')
                                        ? i18n.t('PATIENTS.GM')
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'veinset'
                                        ? i18n.t('PATIENTS.SET')
                                        : item.dose_unit ||
                                          i18n.t('PATIENTS.NOS')),
                                    time: item.drug_intake_timing.split(',')[0],
                                    time1:
                                      item.drug_intake_timing.split(',')[1],
                                    time2:
                                      item.drug_intake_timing.split(',')[2],
                                    time_text:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                        ? true
                                        : false,
                                    time_text1:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true
                                        ? true
                                        : false,
                                    time_text2:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true
                                        ? true
                                        : false,
                                    from: 2,
                                    drug_id: item.prescription_id,
                                    med_id: item.No,
                                  })
                                : this.setState({
                                    query:
                                      item.drug_name.trim() +
                                      ' | ' +
                                      item.drug_type.split(')')[0].trim(),
                                    lb: 'Edit',
                                    ban3: false,
                                    ban4: true,
                                    junk_medicine: true,
                                    dose:
                                      item.tablet.split(' ')[0] <= 3 ||
                                      (item.tablet
                                        .split(' ')[0]
                                        .split('/')[0] == 1 &&
                                        item.tablet
                                          .split(' ')[0]
                                          .split('/')[1] == 2)
                                        ? ''
                                        : item.tablet.split(' ')[0],
                                    selectedIndex:
                                      item.tablet.split(' ')[0] <= 3 ||
                                      (item.tablet
                                        .split(' ')[0]
                                        .split('/')[0] == 1 &&
                                        item.tablet
                                          .split(' ')[0]
                                          .split('/')[1] == 2)
                                        ? this.state.buttons.indexOf(
                                            item.tablet.split(' ')[0],
                                          )
                                        : 'undefined',
                                    selectedIndex1:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? this.state.buttons1.indexOf(
                                            item.times.split(' ')[0],
                                          )
                                        : 'undefined',
                                    custom:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? ''
                                        : item.times.split(' ')[0],
                                    day:
                                      item.times.split(' ')[1] != undefined &&
                                      item.times.split(' ')[1] != '' &&
                                      item.times.split(' ')[1] != 'SOS'
                                        ? item.times.split(' ')[1]
                                        : '',
                                    selectedIndex4:
                                      item.drug_when != ''
                                        ? this.state.buttons4.indexOf(
                                            item.drug_when,
                                          )
                                        : '',
                                    selectedIndex2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttons2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 1
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day1:
                                      item.duration != ''
                                        ? item.duration.split(' ')[1] !=
                                          'undefined'
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : item.duration.split(' ')[1],
                                    note: item.notes,
                                    selectedIndex3:
                                      item.times.includes('SOS') == true
                                        ? 0
                                        : 'undefined',
                                    mesure:
                                      item.tablet.split(' ')[1] !=
                                        'undefined' &&
                                      item.tablet.split(' ')[1] != '' &&
                                      item.tablet.length > 3
                                        ? item.tablet.split(' ')[1]
                                        : item.drug_type.toLowerCase().trim() ==
                                            'tablet' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'tablets' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'tablets and capsules'
                                        ? i18n.t('PATIENTS.TAB')
                                        : item.drug_type.toLowerCase().trim() ==
                                            'capsule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'capsules'
                                        ? i18n.t('PATIENTS.CAP')
                                        : item.drug_type.toLowerCase().trim() ==
                                            'lotion' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'liquid' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'syrup' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'respules' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suspensions' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'spray' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'shampoo' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'solution'
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type.toLowerCase().trim() ==
                                            'ointment' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'linement' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'cream' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'creams' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'gel' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'gels' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'granules' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'eye ointmen'
                                        ? i18n.t('PATIENTS.MG')
                                        : item.drug_type.toLowerCase().trim() ==
                                            'injection' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'ampule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'vial'
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type.toLowerCase().trim() ==
                                            i18n.t('PATIENTS.DROPS') ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'drop' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'eye/ear drops'
                                        ? i18n.t('PATIENTS.DROPS')
                                        : item.drug_type.toLowerCase().trim() ==
                                            'syringe' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'disposals' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suture' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'miscellaneous' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'soap' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'lozenges' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'condom'
                                        ? i18n.t('PATIENTS.UNIT')
                                        : item.drug_type.toLowerCase().trim() ==
                                            'powder' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'powders' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'churna' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'bhasma'
                                        ? i18n.t('PATIENTS.GM')
                                        : item.drug_type.toLowerCase().trim() ==
                                          'veinset'
                                        ? i18n.t('PATIENTS.SET')
                                        : item.dose_unit ||
                                          i18n.t('PATIENTS.NOS'),
                                    time: item.drug_intake_timing.split(',')[0],
                                    time1:
                                      item.drug_intake_timing.split(',')[1],
                                    time2:
                                      item.drug_intake_timing.split(',')[2],
                                    time_text:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? true
                                        : false,
                                    time_text1:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true
                                        ? true
                                        : false,
                                    time_text2:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true
                                        ? true
                                        : false,
                                    from: item.from == 'json' ? 2 : 1,
                                    med_id: item.prescription_id,
                                    drug_id: item.prescription_id,
                                  });
                              //alert(item.times);
                              //alert( item.duration.charAt(0).toUpperCase() + item.duration.slice(1))
                              //alert(item.drug_type.trim()=="Tablet")
                              //this.updateIndex1(this.state.selectedIndex1)
                              this.props.changeTabData(0);
                            }}>
                            <Row>
                              {/* <Col size={10} style={{marginTop:-3}}>
  <Text allowFontScaling={false}style={{fontSize:15,fontWeight:"bold",alignSelf:"center"}}>
{item.drug_type=="Tablet)"?"TAB":
item.drug_type=="Syrup)"?"SYP":
item.drug_type=="Drops)"?"DRP":
item.drug_type=="Injection)"?"INJ":
item.drug_type=="Miscellaneous)"?"":
item.drug_type=="Cream)"?"CRE":
item.drug_type=="Tablets and Capsules)"?"CAP":""
} ,
  </Text>
  </Col> */}
                              <Col size={10}>
                                {/* <Text allowFontScaling={false}style={{fontSize:20,fontWeight:"bold",alignSelf:"center"}}>M</Text> */}
                                <Thumbnail
                                  style={{
                                    height: 28,
                                    width: 28,
                                    marginRight: 15,
                                  }}
                                  square
                                  source={require('../../../../assets/images/medicine.png')}
                                />
                              </Col>
                              <Col size={80}>
                                <Text
                                  allowFontScaling={false}
                                  style={[
                                    styles.listData2,
                                    item.status == 0 && {
                                      textDecorationLine: 'line-through',
                                    },
                                  ]}>
                                  {item.drug_type != null &&
                                    (item.drug_type.toLowerCase().trim() ==
                                      'tablet)' ||
                                    item.drug_type.toLowerCase().trim() ==
                                      'tablet' ||
                                    item.drug_type.toLowerCase().trim() ==
                                      'tablets' ||
                                    item.drug_type.toLowerCase().trim() ==
                                      'tablets)'
                                      ? 'TAB.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'capsule)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'capsules'
                                      ? 'CAP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'syrup)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'syrup'
                                      ? 'SYP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'drops)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          i18n.t('PATIENTS.DROPS')
                                      ? 'DRP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'injection)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'injection'
                                      ? 'INJ.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'miscellaneous)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'miscellaneous'
                                      ? ''
                                      : item.drug_type.toLowerCase().trim() ==
                                          'cream)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'cream'
                                      ? 'CRE.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules'
                                      ? 'CAP.'
                                      : '')}
                                  {item.from == 'json'
                                    ? item.trade_name
                                    : item.drug_name}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={[
                                    item.status == 0 && {
                                      textDecorationLine: 'line-through',
                                    },
                                    {fontSize: 11},
                                  ]}>
                                  (
                                  {item.from == 'json'
                                    ? item.size.replace('undefined', '')
                                    : item.tablet.replace('undefined', '')}{' '}
                                  {(item.from == 'json' &&
                                    item.size.length < 4) ||
                                  (item.from == 'json' &&
                                    item.size.split(' ')[1] == 'undefined')
                                    ? item.drug_type != null &&
                                      (item.drug_type.toLowerCase().trim() ==
                                        'tablet' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules')
                                      ? i18n.t('PATIENTS.TAB')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'capsule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'capsules')
                                      ? i18n.t('PATIENTS.CAP')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'lotion' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'liquid' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'syrup' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'respules' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suspensions' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'spray')
                                      ? i18n.t('PATIENTS.ML')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'ointment' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'linement' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'cream' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'creams' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'gel' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'gels' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'granules')
                                      ? i18n.t('PATIENTS.MG')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'injection' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'ampule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'vial')
                                      ? i18n.t('PATIENTS.ML')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          i18n.t('PATIENTS.DROPS') ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'drop')
                                      ? i18n.t('PATIENTS.DROPS')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'syringe' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'disposals' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suture')
                                      ? i18n.t('PATIENTS.UNIT')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'powder' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'powders')
                                      ? i18n.t('PATIENTS.GM')
                                      : item.drug_type != null &&
                                        item.drug_type.toLowerCase().trim() ==
                                          'VEINSET'
                                      ? i18n.t('PATIENTS.SET')
                                      : item.dose_unit || i18n.t('PATIENTS.NOS')
                                    : (item.from == 'db' ||
                                        item.from == undefined) &&
                                      item.tablet.length < 3 &&
                                      (item.drug_type != null &&
                                      (item.drug_type.toLowerCase().trim() ==
                                        'tablet' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules')
                                        ? i18n.t('PATIENTS.TAB')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? i18n.t('PATIENTS.CAP')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'lotion' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'liquid' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'syrup' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'respules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suspensions' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'spray')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'ointment' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'linement' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'cream' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'creams' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gel' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gels' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'granules')
                                        ? i18n.t('PATIENTS.MG')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'injection' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'ampule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'vial')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() ==
                                            i18n.t('PATIENTS.DROPS') ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop')
                                        ? i18n.t('PATIENTS.DROPS')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'syringe' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'disposals' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suture')
                                        ? i18n.t('PATIENTS.UNIT')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'powder' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'powders')
                                        ? i18n.t('PATIENTS.GM')
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'Miscellaneous'
                                        ? ''
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'VEINSET'
                                        ? i18n.t('PATIENTS.SET')
                                        : item.dose_unit ||
                                          i18n.t('PATIENTS.NOS'))}
                                  ,{' '}
                                  {item.from == 'json'
                                    ? item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                      ? item.timings.split(' ')[0]
                                      : item.timings.includes(
                                          i18n.t('PATIENTS.ONCE'),
                                        ) == true
                                      ? 'OD'
                                      : item.timings.includes(
                                          i18n.t('PATIENTS.TWICE'),
                                        ) == true
                                      ? 'BD'
                                      : item.timings.includes(
                                          i18n.t('PATIENTS.THRICE'),
                                        ) == true
                                      ? 'TID'
                                      : item.timings.split(' ')[0] +
                                        ' ' +
                                        item.timings.split(' ')[1]
                                    : item.from == 'db' &&
                                      (item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? item.times.split(' ')[0]
                                        : item.times.includes(
                                            i18n.t('PATIENTS.ONCE'),
                                          ) == true
                                        ? 'OD'
                                        : item.times.includes(
                                            i18n.t('PATIENTS.TWICE'),
                                          ) == true
                                        ? 'BD'
                                        : item.times.includes(
                                            i18n.t('PATIENTS.THRICE'),
                                          ) == true
                                        ? 'TID'
                                        : item.times.split(' ')[0] +
                                          ' ' +
                                          item.times.split(' ')[1])}
                                  {item.from != 'json' && item.from != 'db'
                                    ? item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                      ? item.times.split(' ')[0]
                                      : item.times.includes(
                                          i18n.t('PATIENTS.ONCE'),
                                        ) == true
                                      ? 'OD'
                                      : item.times.includes(
                                          i18n.t('PATIENTS.TWICE'),
                                        ) == true
                                      ? 'BD'
                                      : item.times.includes(
                                          i18n.t('PATIENTS.THRICE'),
                                        ) == true
                                      ? 'TID'
                                      : item.times.split(' ')[0] +
                                        ' ' +
                                        item.times.split(' ')[1]
                                    : ' '}
                                  {item.from == 'json'
                                    ? item.timings.includes('SOS') == true
                                      ? ' SOS'
                                      : ''
                                    : item.from == 'db' &&
                                      (item.times.includes('SOS') == true
                                        ? ' SOS'
                                        : '')}
                                  {item.from != 'json' && item.from != 'db'
                                    ? item.times.includes('SOS') == true
                                      ? ' SOS'
                                      : ' '
                                    : ' '}{' '}
                                  {item.from == 'json'
                                    ? item.before_after
                                    : item.drug_when}
                                  {item.duration != '' && ' for '}
                                  {item.duration.split(' ')[0]}{' '}
                                  {item.duration.split(' ')[1] == 'days' ||
                                  item.duration.split(' ')[1] == 'day' ||
                                  item.duration.split(' ')[1] == 'Days'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Day'
                                      : 'Days'
                                    : item.duration.split(' ')[1] == 'week' ||
                                      item.duration.split(' ')[1] == 'Weeks'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Week'
                                      : 'Weeks'
                                    : item.duration.split(' ')[1] ==
                                        'monthly' ||
                                      item.duration.split(' ')[1] == 'Months'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Month'
                                      : 'Months'
                                    : item.duration.split(' ')[1] == 'yearly' ||
                                      (item.duration.split(' ')[1] == 'Years' &&
                                        (item.duration.split(' ')[0] == 1
                                          ? 'Year'
                                          : 'Years'))}
                                  )
                                </Text>
                                {item.notes != '' && item.notes != null && (
                                  <Text allowFontScaling={false}>
                                    {'Notes: ' + item.notes}
                                  </Text>
                                )}
                              </Col>
                              <Col size={10}>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.setState({
                                      alertvisible: true,
                                      deleteid:
                                        item.from == 'json'
                                          ? item.No
                                          : item.prescription_id,
                                      deletesection: 'Medicine',
                                      deletecheck:
                                        item.from == 'json' ? 'json' : 'db',
                                      version_status: item.version_status,
                                    });
                                  }}
                                  disabled={item.status == 0 ? true : false}>
                                  <Icon
                                    type="FontAwesome"
                                    name="trash"
                                    style={{fontSize: 30}}
                                  />
                                </TouchableOpacity>
                              </Col>
                            </Row>
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </View>
                  );
                }}
              />
            </Col>
          </Row>
          {/* <Row style={{marginTop:10}}>
          <Col size={50}>
  <Text allowFontScaling={false}style={{marginLeft:10,fontWeight:"bold",marginTop:5,fontSize:15}}>Supplement</Text>      
          </Col>
          <Col size={50} style={{alignItems:"flex-end"}}>
      
          <TouchableOpacity onPress={()=>this.add_md1()} style={{backgroundColor:APP_PRIMARY_COLOR,height:35,width:40,marginRight:10}}>
            <Text allowFontScaling={false}style={{color:"white",fontSize:10,marginLeft:12,marginTop:10}}><Icon type="FontAwesome" name="plus" style={{fontSize:20,marginTop:30,color:"white"}} /></Text>
          </TouchableOpacity>
          </Col>
        </Row> */}
          <Row>
            <Col>
              <FlatList
                style={styles.contentList}
                columnWrapperStyle={styles.listContainer}
                data={this.state.supplements_data}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return (
                    <View style={styles.card}>
                      <Row>
                        <Col>
                          <TouchableOpacity
                            onPress={() => {
                              item.from == 'json'
                                ? this.setState({
                                    visible1: true,
                                    query1:
                                      item.trade_name.trim() +
                                      ' | ' +
                                      item.drug_type.trim(),
                                    lb1: 'Edit',
                                    ban1: false,
                                    ban2: true,
                                    junk_medicine1: true,
                                    dose1:
                                      item.size.split(' ')[0] <= 3 ||
                                      (item.size.split(' ')[0].split('/')[0] ==
                                        1 &&
                                        item.size.split(' ')[0].split('/')[1] ==
                                          2)
                                        ? ''
                                        : item.size.split(' ')[0],
                                    selectedIndexa:
                                      item.size.split(' ')[0] <= 3 ||
                                      (item.size.split(' ')[0].split('/')[0] ==
                                        1 &&
                                        item.size.split(' ')[0].split('/')[1] ==
                                          2)
                                        ? this.state.buttonsa.indexOf(
                                            item.size.split(' ')[0],
                                          )
                                        : 'undefined',
                                    selectedIndexa1:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                        ? this.state.buttonsa1.indexOf(
                                            item.timings.split(' ')[0],
                                          )
                                        : 'undefined',
                                    custom1:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                        ? ''
                                        : item.timings.split(' ')[0],
                                    day2:
                                      item.timings.split(' ')[1] != undefined &&
                                      item.timings.split(' ')[1] != '' &&
                                      item.timings.split(' ')[1] != 'SOS'
                                        ? item.timings.split(' ')[1]
                                        : '',
                                    selectedIndexa4:
                                      item.before_after != ''
                                        ? this.state.buttonsa4.indexOf(
                                            item.before_after,
                                          )
                                        : '',
                                    selectedIndexa2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttonsa2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration1:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 1
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day3:
                                      item.duration != ''
                                        ? item.duration.split(' ')[1] !=
                                          'undefined'
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : item.duration.split(' ')[1],
                                    note1: item.notes,
                                    selectedIndexa3:
                                      item.timings.includes('SOS') == true
                                        ? 0
                                        : 'undefined',
                                    mesure1:
                                      item.drug_type != null &&
                                      item.size.split(' ')[1] != 'undefined' &&
                                      item.size.length > 3
                                        ? item.size.split(' ')[1]
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'tablet' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'tablets' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'tablets and capsules')
                                        ? i18n.t('PATIENTS.TAB')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? i18n.t('PATIENTS.CAP')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'lotion' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'liquid' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'syrup' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'respules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suspensions' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'spray' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'shampoo' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'solution')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'ointment' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'linement' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'cream' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'creams' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gel' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gels' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'granules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye ointmen')
                                        ? i18n.t('PATIENTS.MG')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'injection' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'ampule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'vial')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() ==
                                            i18n.t('PATIENTS.DROPS') ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye/ear drops')
                                        ? i18n.t('PATIENTS.DROPS')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'syringe' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'disposals' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suture' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'soap' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'lozenges' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'condom')
                                        ? i18n.t('PATIENTS.UNIT')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'powder' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'powders' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'churna' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'bhasma')
                                        ? i18n.t('PATIENTS.GM')
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'veinset'
                                        ? i18n.t('PATIENTS.SET')
                                        : item.dose_unit ||
                                          i18n.t('PATIENTS.NOS'),
                                    timea:
                                      item.drug_intake_timing.split(',')[0],
                                    timea1:
                                      item.drug_intake_timing.split(',')[1],
                                    timea2:
                                      item.drug_intake_timing.split(',')[2],
                                    time_texta:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                        ? true
                                        : false,
                                    time_texta1:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.timings.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true
                                        ? true
                                        : false,
                                    time_texta2:
                                      item.timings.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true
                                        ? true
                                        : false,
                                    from1: 2,
                                    sup_id: item.No,
                                    drug_id1: item.prescription_id,
                                  })
                                : this.setState({
                                    visible1: true,
                                    query1:
                                      item.drug_name.trim() +
                                      ' | ' +
                                      item.drug_type.split(')')[0].trim(),
                                    lb1: 'Edit',
                                    ban1: false,
                                    ban2: true,
                                    junk_medicine1: true,

                                    dose1:
                                      item.tablet.split(' ')[0] <= 3 ||
                                      (item.tablet
                                        .split(' ')[0]
                                        .split('/')[0] == 1 &&
                                        item.tablet
                                          .split(' ')[0]
                                          .split('/')[1] == 2)
                                        ? ''
                                        : item.tablet.split(' ')[0],

                                    selectedIndexa:
                                      item.tablet.split(' ')[0] ||
                                      (item.tablet
                                        .split(' ')[0]
                                        .split('/')[0] == 1 &&
                                        item.tablet
                                          .split(' ')[0]
                                          .split('/')[1] == 2)
                                        ? this.state.buttonsa.indexOf(
                                            item.tablet.split(' ')[0],
                                          )
                                        : 'undefined',

                                    selectedIndexa1:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? this.state.buttonsa1.indexOf(
                                            item.times.split(' ')[0],
                                          )
                                        : 'undefined',

                                    custom1:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? ''
                                        : item.times.split(' ')[0],
                                    day2:
                                      item.times.split(' ')[1] != undefined &&
                                      item.times.split(' ')[1] != '' &&
                                      item.times.split(' ')[1] != 'SOS'
                                        ? item.times.split(' ')[1]
                                        : '',
                                    selectedIndexa4:
                                      item.drug_when != ''
                                        ? this.state.buttonsa4.indexOf(
                                            item.drug_when,
                                          )
                                        : '',

                                    selectedIndexa2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttonsa2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration1:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 1
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day3:
                                      item.duration != ''
                                        ? item.duration.split(' ')[1] !=
                                          'undefined'
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : item.duration.split(' ')[1],
                                    note1: item.notes,
                                    selectedIndexa3:
                                      item.times.includes('SOS') == true
                                        ? 0
                                        : 'undefined',
                                    mesure1:
                                      item.tablet.split(' ')[1] !=
                                        'undefined' &&
                                      item.tablet.split(' ')[1] != '' &&
                                      item.tablet.length > 3
                                        ? item.tablet.split(' ')[1]
                                        : item.drug_type != null &&
                                          (item.drug_type.toLowerCase() ==
                                            'tablet' ||
                                            item.drug_type.toLowerCase() ==
                                              'tablets' ||
                                            item.drug_type.toLowerCase() ==
                                              'tablets and capsules')
                                        ? i18n.t('PATIENTS.TAB')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? i18n.t('PATIENTS.CAP')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'lotion' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'liquid' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'syrup' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'respules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suspensions' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'spray' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'shampoo' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'solution')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'ointment' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'linement' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'cream' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'creams' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gel' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gels' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'granules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye ointmen')
                                        ? i18n.t('PATIENTS.MG')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'injection' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'ampule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'vial')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() ==
                                            i18n.t('PATIENTS.DROPS') ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye/ear drops')
                                        ? i18n.t('PATIENTS.DROPS')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'syringe' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'disposals' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suture' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'soap' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'lozenges' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'condom')
                                        ? i18n.t('PATIENTS.UNIT')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'powder' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'powders' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'churna' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'bhasma')
                                        ? i18n.t('PATIENTS.GM')
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'veinset'
                                        ? i18n.t('PATIENTS.SET')
                                        : item.dose_unit ||
                                          i18n.t('PATIENTS.NOS'),

                                    timea:
                                      item.drug_intake_timing.split(',')[0],

                                    timea1:
                                      item.drug_intake_timing.split(',')[1],

                                    timea2:
                                      item.drug_intake_timing.split(',')[2],
                                    time_texta:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.ONCE'),
                                      ) == true ||
                                      item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? true
                                        : false,
                                    time_texta1:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true ||
                                      item.times.includes(
                                        i18n.t('PATIENTS.TWICE'),
                                      ) == true
                                        ? true
                                        : false,
                                    time_texta2:
                                      item.times.includes(
                                        i18n.t('PATIENTS.THRICE'),
                                      ) == true
                                        ? true
                                        : false,

                                    from1: item.from == 'json' ? 2 : 1,

                                    sup_id: item.prescription_id,
                                    drug_id1: item.prescription_id,
                                  });
                              this.props.changeTabData(1);
                            }}>
                            <Row>
                              {/* <Col size={10} style={{marginTop:-3}}>
  <Text allowFontScaling={false}style={{fontSize:15,fontWeight:"bold",alignSelf:"center"}}>
{item.drug_type=="Tablet)"?"TAB":
item.drug_type=="Syrup)"?"SYP":
item.drug_type=="Drops)"?"DRP":
item.drug_type=="Injection)"?"INJ":
item.drug_type=="Miscellaneous)"?"":
item.drug_type=="Cream)"?"CRE":
item.drug_type=="Tablets and Capsules)"?"CAP":""
} ,
  </Text>

  </Col> */}
                              <Col size={10}>
                                {/* <Text allowFontScaling={false}style={{fontSize:20,fontWeight:"bold",alignSelf:"center"}}>M</Text> */}
                                <Thumbnail
                                  style={{
                                    height: 28,
                                    width: 28,
                                    marginRight: 15,
                                  }}
                                  square
                                  source={require('../../../../assets/images/supplement.png')}
                                />
                              </Col>
                              <Col size={80}>
                                <Text
                                  allowFontScaling={false}
                                  style={[
                                    styles.listData2,
                                    item.status == 0 && {
                                      textDecorationLine: 'line-through',
                                    },
                                  ]}>
                                  {item.drug_type != null &&
                                    (item.drug_type.toLowerCase().trim() ==
                                      'tablet)' ||
                                    item.drug_type.toLowerCase().trim() ==
                                      'tablet' ||
                                    item.drug_type.toLowerCase().trim() ==
                                      'tablets' ||
                                    item.drug_type.toLowerCase().trim() ==
                                      'tablets)'
                                      ? 'TAB.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'capsule)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'capsules'
                                      ? 'CAP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'syrup)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'syrup'
                                      ? 'SYP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'drops)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          i18n.t('PATIENTS.DROPS')
                                      ? 'DRP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'injection)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'injection'
                                      ? 'INJ.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'miscellaneous)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'miscellaneous'
                                      ? ''
                                      : item.drug_type.toLowerCase().trim() ==
                                          'cream)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'cream'
                                      ? 'CRE.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules'
                                      ? 'CAP.'
                                      : '')}
                                  {item.from == 'json'
                                    ? item.trade_name
                                    : item.drug_name}
                                </Text>
                                <Text
                                  allowFontScaling={false}
                                  style={[
                                    item.status == 0 && {
                                      textDecorationLine: 'line-through',
                                    },
                                    {fontSize: 11},
                                  ]}>
                                  (
                                  {item.from == 'json'
                                    ? item.size.replace('undefined', '')
                                    : item.tablet.replace('undefined', '')}{' '}
                                  {(item.from == 'json' &&
                                    item.size.length < 4) ||
                                  (item.from == 'json' &&
                                    item.size.split(' ')[1] == 'undefined')
                                    ? item.drug_type != null &&
                                      (item.drug_type.toLowerCase().trim() ==
                                        'tablet' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules')
                                      ? i18n.t('PATIENTS.TAB')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'capsule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'capsules')
                                      ? i18n.t('PATIENTS.CAP')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'lotion' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'liquid' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'syrup' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'respules' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suspensions' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'spray')
                                      ? i18n.t('PATIENTS.ML')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'ointment' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'linement' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'cream' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'creams' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'gel' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'gels' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'granules')
                                      ? i18n.t('PATIENTS.MG')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'injection' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'ampule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'vial')
                                      ? i18n.t('PATIENTS.ML')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          i18n.t('PATIENTS.DROPS') ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'drop')
                                      ? i18n.t('PATIENTS.DROPS')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'syringe' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'disposals' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suture')
                                      ? i18n.t('PATIENTS.UNIT')
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'powder' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'powders')
                                      ? i18n.t('PATIENTS.GM')
                                      : item.drug_type != null &&
                                        item.drug_type.toLowerCase().trim() ==
                                          'VEINSET'
                                      ? i18n.t('PATIENTS.SET')
                                      : item.dose_unit || i18n.t('PATIENTS.NOS')
                                    : (item.from == 'db' ||
                                        item.from == undefined) &&
                                      item.tablet.length < 3 &&
                                      (item.drug_type != null &&
                                      (item.drug_type.toLowerCase().trim() ==
                                        'tablet' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'tablets and capsules')
                                        ? i18n.t('PATIENTS.TAB')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? i18n.t('PATIENTS.CAP')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'lotion' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'liquid' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'syrup' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'respules' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suspensions' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'spray')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'ointment' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'linement' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'cream' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'creams' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gel' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'gels' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'granules')
                                        ? i18n.t('PATIENTS.MG')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'injection' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'ampule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'vial')
                                        ? i18n.t('PATIENTS.ML')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() ==
                                            i18n.t('PATIENTS.DROPS') ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop')
                                        ? i18n.t('PATIENTS.DROPS')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'syringe' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'disposals' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'suture')
                                        ? i18n.t('PATIENTS.UNIT')
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'powder' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'powders')
                                        ? i18n.t('PATIENTS.GM')
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'Miscellaneous'
                                        ? ''
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'VEINSET'
                                        ? i18n.t('PATIENTS.SET')
                                        : item.dose_unit ||
                                          i18n.t('PATIENTS.NOS'))}
                                  ,{' '}
                                  {item.from == 'json'
                                    ? item.timings.includes('4Hours') == true ||
                                      item.timings.includes('6Hours') == true ||
                                      item.timings.includes('8Hours') == true ||
                                      item.timings.includes('12Hours') == true
                                      ? item.timings.split(' ')[0]
                                      : item.timings.includes(
                                          i18n.t('PATIENTS.ONCE'),
                                        ) == true
                                      ? 'OD'
                                      : item.timings.includes(
                                          i18n.t('PATIENTS.TWICE'),
                                        ) == true
                                      ? 'BD'
                                      : item.timings.includes(
                                          i18n.t('PATIENTS.THRICE'),
                                        ) == true
                                      ? 'TID'
                                      : item.timings.split(' ')[0] +
                                        ' ' +
                                        item.timings.split(' ')[1]
                                    : item.from == 'db' &&
                                      (item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                        ? item.times.split(' ')[0]
                                        : item.times.includes(
                                            i18n.t('PATIENTS.ONCE'),
                                          ) == true
                                        ? 'OD'
                                        : item.times.includes(
                                            i18n.t('PATIENTS.TWICE'),
                                          ) == true
                                        ? 'BD'
                                        : item.times.includes(
                                            i18n.t('PATIENTS.THRICE'),
                                          ) == true
                                        ? 'TID'
                                        : item.times.split(' ')[0] +
                                          ' ' +
                                          item.times.split(' ')[1])}
                                  {item.from != 'json' && item.from != 'db'
                                    ? item.times.includes('4Hours') == true ||
                                      item.times.includes('6Hours') == true ||
                                      item.times.includes('8Hours') == true ||
                                      item.times.includes('12Hours') == true
                                      ? item.times.split(' ')[0]
                                      : item.times.includes(
                                          i18n.t('PATIENTS.ONCE'),
                                        ) == true
                                      ? 'OD'
                                      : item.times.includes(
                                          i18n.t('PATIENTS.TWICE'),
                                        ) == true
                                      ? 'BD'
                                      : item.times.includes(
                                          i18n.t('PATIENTS.THRICE'),
                                        ) == true
                                      ? 'TID'
                                      : item.times.split(' ')[0] +
                                        ' ' +
                                        item.times.split(' ')[1]
                                    : ' '}
                                  {item.from == 'json'
                                    ? item.timings.includes('SOS') == true
                                      ? ' SOS'
                                      : ''
                                    : item.from == 'db' &&
                                      (item.times.includes('SOS') == true
                                        ? ' SOS'
                                        : '')}
                                  {item.from != 'json' && item.from != 'db'
                                    ? item.times.includes('SOS') == true
                                      ? ' SOS'
                                      : ' '
                                    : ' '}{' '}
                                  {item.from == 'json'
                                    ? item.before_after
                                    : item.drug_when}
                                  {item.duration != '' && ' for '}
                                  {item.duration.split(' ')[0]}{' '}
                                  {item.duration.split(' ')[1] == 'days' ||
                                  item.duration.split(' ')[1] == 'day' ||
                                  item.duration.split(' ')[1] == 'Days'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Day'
                                      : 'Days'
                                    : item.duration.split(' ')[1] == 'week' ||
                                      item.duration.split(' ')[1] == 'Weeks'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Week'
                                      : 'Weeks'
                                    : item.duration.split(' ')[1] ==
                                        'monthly' ||
                                      item.duration.split(' ')[1] == 'Months'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Month'
                                      : 'Months'
                                    : item.duration.split(' ')[1] == 'yearly' ||
                                      (item.duration.split(' ')[1] == 'Years' &&
                                        (item.duration.split(' ')[0] == 1
                                          ? 'Year'
                                          : 'Years'))}
                                  )
                                </Text>
                                {item.notes != '' && item.notes != null && (
                                  <Text allowFontScaling={false}>
                                    {'Notes: ' + item.notes}
                                  </Text>
                                )}
                                {/* <Text allowFontScaling={false}style={[styles.listData,item.status==0&&{textDecorationLine: 'line-through'}]}>
  {item.drug_name}

  </Text> */}
                                {/* <Text allowFontScaling={false}style={[{fontSize:12,color:"#675e5e"},item.status==0&&{textDecorationLine: 'line-through'}]}>Dose:{item.tablet} |
  {item.drug_when=="Before Food"?"B.F":
  item.drug_when=="After Food"?"A.F":
  item.drug_when=="Empty Stomach"?"E.S":
  item.drug_when=="Bed Time"?"B.T":null
}
   | Time:{item.times=="4Hours"?"4H":
item.times=="6Hours"?"6H":
item.times=="8Hours"?"8H":
item.times=="12Hours"?"12H":
item.times=="4Hours SOS"?"4H SOS":
item.times=="6Hours SOS"?"6H SOS":
item.times=="8Hours SOS"?"8H SOS":
item.times=="12Hours SOS"?"12H SOS":item.times
} | Duration:{item.duration.includes("Days")?item.duration.replace("Days","D"):item.duration.includes("day")?item.duration.replace("day","D"):null}
</Text> */}
                              </Col>
                              <Col size={10}>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({
                                      alertvisible: true,
                                      deleteid:
                                        item.from == 'json'
                                          ? item.No
                                          : item.prescription_id,
                                      deletesection: 'Supplement',
                                      deletecheck:
                                        item.from == 'json' ? 'json' : 'db',
                                      version_status: item.version_status,
                                    })
                                  }
                                  disabled={item.status == 0 ? true : false}>
                                  <Icon
                                    type="FontAwesome"
                                    name="trash"
                                    style={{fontSize: 30}}
                                  />
                                </TouchableOpacity>
                              </Col>
                            </Row>
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </View>
                  );
                }}
              />
            </Col>
          </Row>
          {/*
        <Row>
        <Col size={80} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}style={{color:APP_PRIMARY_COLOR}}>Lab Name</Text>
          </Col>
          <Col size={20} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}style={{color:APP_PRIMARY_COLOR}}>Action</Text>
          </Col>
        </Row>*/}
          <Row>
            <Col>
              <FlatList
                style={styles.contentList}
                columnWrapperStyle={styles.listContainer}
                data={this.state.plan_data.lab_test}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return item.version_status == 2 && item.delete_status != 1 ? (
                    <View style={styles.card}>
                      <Row>
                        <Col size={10}>
                          <Thumbnail
                            style={{height: 28, width: 28, marginRight: 15}}
                            square
                            source={require('../../../../assets/images/lab.png')}
                          />
                          {/* <Thumbnail style={{height:28,width:28,marginLeft:15,marginTop:10}} square source={require("../../../assets/images/Pill.png")} /> */}
                        </Col>
                        <Col size={70} style={{marginTop: -10}}>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.listData,
                              item.version_status != 2 &&
                                item.delete_status == 1 && {
                                  textDecorationLine: 'line-through',
                                  textDecorationStyle: 'solid',
                                },
                            ]}>
                            {item.lab ? item.lab : item.lab_name}
                          </Text>
                        </Col>
                        {item.lab_pdf_path != null &&
                        item.payment_status &&
                        item.payment_status != 'Due' ? (
                          <Col size={10}>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.screenProps.rootNavigation.navigate(
                                  'ViewPdf',
                                  {link: item.lab_pdf_path},
                                )
                              }>
                              <Icon
                                type="FontAwesome"
                                name="file-pdf-o"
                                style={{fontSize: 20}}
                              />
                            </TouchableOpacity>
                          </Col>
                        ) : item.delete_status != 1 &&
                          item.lab_pdf_path == null &&
                          item.payment_status &&
                          item.payment_status != 'Due' ? (
                          <Col size={10}>
                            <TouchableOpacity
                              onPress={() =>
                                this.chooseFile(
                                  item.lab_test_id,
                                  item.encounterCode,
                                  item.service_list_id,
                                  'lab',
                                )
                              }>
                              <Icon
                                type="FontAwesome"
                                name="upload"
                                style={{fontSize: 20}}
                              />
                            </TouchableOpacity>
                          </Col>
                        ) : null}
                        {item.lab_pdf_path == null && (
                          <Col size={10}>
                            <TouchableOpacity
                              style={{marginLeft: '25%'}}
                              onPress={
                                () => {
                                  this.setState({
                                    alertvisible: true,
                                    deleteid:
                                      item.from == 'json'
                                        ? item.No
                                        : item.lab_test_id,
                                    deletesection: 'Lab',
                                    deletecheck:
                                      item.from == 'json' ? 'json' : 'db',
                                    version_status: item.version_status,
                                  });
                                }

                                // Alert.alert("Are you Sure","You Won't able to revert this",[
                                //   {
                                //     text:"OK",onPress:()=> this.deleteLabOrder(item.lab_test_id)
                                //   },
                                //   {
                                //     text:"Cancel"
                                //   }
                                // ])
                              }
                              disabled={item.delete_status == 1 ? true : false}>
                              <Icon
                                type="FontAwesome"
                                name="trash"
                                style={{fontSize: 30}}
                              />
                            </TouchableOpacity>
                          </Col>
                        )}
                      </Row>
                    </View>
                  ) : (
                    item.version_status != 2 && (
                      <View style={styles.card}>
                        <Row>
                          <Col size={10}>
                            <Thumbnail
                              style={{height: 28, width: 28, marginRight: 15}}
                              square
                              source={require('../../../../assets/images/lab.png')}
                            />
                            {/* <Thumbnail style={{height:28,width:28,marginLeft:15,marginTop:10}} square source={require("../../../assets/images/Pill.png")} /> */}
                          </Col>
                          <Col size={70} style={{marginTop: -10}}>
                            <Text
                              allowFontScaling={false}
                              style={[
                                styles.listData,
                                item.delete_status == 1 && {
                                  textDecorationLine: 'line-through',
                                  textDecorationStyle: 'solid',
                                },
                              ]}>
                              {item.lab ? item.lab : item.lab_name}
                            </Text>
                          </Col>
                          {item.lab_pdf_path != null &&
                          item.payment_status &&
                          item.payment_status != 'Due' ? (
                            <Col size={10}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.screenProps.rootNavigation.navigate(
                                    'ViewPdf',
                                    {link: item.lab_pdf_path},
                                  )
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="file-pdf-o"
                                  style={{fontSize: 20}}
                                />
                              </TouchableOpacity>
                            </Col>
                          ) : item.delete_status != 1 &&
                            item.lab_pdf_path == null &&
                            item.payment_status &&
                            item.payment_status != 'Due' ? (
                            <Col size={10}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.chooseFile(
                                    item.lab_test_id,
                                    item.encounterCode,
                                    item.service_list_id,
                                    'lab',
                                  )
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="upload"
                                  style={{fontSize: 20}}
                                />
                              </TouchableOpacity>
                            </Col>
                          ) : null}
                          {item.lab_pdf_path == null && (
                            <Col size={10}>
                              <TouchableOpacity
                                style={{marginLeft: '25%'}}
                                onPress={
                                  () => {
                                    this.setState({
                                      alertvisible: true,
                                      deleteid:
                                        item.from == 'json'
                                          ? item.No
                                          : item.lab_test_id,
                                      deletesection: 'Lab',
                                      deletecheck:
                                        item.from == 'json' ? 'json' : 'db',
                                      version_status: item.version_status,
                                    });
                                  }

                                  // Alert.alert("Are you Sure","You Won't able to revert this",[
                                  //   {
                                  //     text:"OK",onPress:()=> this.deleteLabOrder(item.lab_test_id)
                                  //   },
                                  //   {
                                  //     text:"Cancel"
                                  //   }
                                  // ])
                                }
                                disabled={
                                  item.delete_status == 1 ? true : false
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="trash"
                                  style={{fontSize: 30}}
                                />
                              </TouchableOpacity>
                            </Col>
                          )}
                        </Row>
                      </View>
                    )
                  );
                }}
              />
            </Col>
          </Row>
          {/*     
        <Row>
        <Col size={80} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}style={{color:APP_PRIMARY_COLOR}}>Image Type</Text>
          </Col>
          <Col size={20} style={{alignItems:"center"}}>
          <Text allowFontScaling={false}style={{color:APP_PRIMARY_COLOR}}>Action</Text>
          </Col>
        </Row>*/}
          <Row>
            <Col>
              <FlatList
                style={styles.contentList}
                columnWrapperStyle={styles.listContainer}
                data={this.state.plan_data.imaging}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return item.version_status == 2 && item.delete_status != 1 ? (
                    <View style={styles.card}>
                      <Row>
                        <Col size={10}>
                          {/* <Text allowFontScaling={false}style={{fontSize:20,fontWeight:"bold",alignSelf:"center"}}>I</Text> */}
                          <Thumbnail
                            style={{height: 28, width: 28, marginRight: 15}}
                            square
                            source={require('../../../../assets/images/imaging.png')}
                          />
                          {/* <Thumbnail style={{height:28,width:28,marginLeft:15,marginTop:10}} square source={require("../../../assets/images/Pill.png")} /> */}
                        </Col>
                        <Col size={70} style={{marginTop: -10}}>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.listData,
                              item.version_status != 2 &&
                                item.delete_status == 1 && {
                                  textDecorationLine: 'line-through',
                                },
                            ]}>
                            {item.image_type}
                          </Text>
                        </Col>
                        {item.img_pdf_path != null &&
                        item.payment_status != 'Due' ? (
                          <Col size={10}>
                            <TouchableOpacity
                              onPress={() =>
                                // this.props.navigation.navigate("HomeScreen")
                                //alert(JSON.stringify(this.props.navigation))
                                //.dispatch(SwitchActions.jumpTo({ routeName: 'HomeScreen' }))
                                this.props.screenProps.rootNavigation.navigate(
                                  'ViewPdf',
                                  {link: item.img_pdf_path},
                                )
                              }>
                              <Icon
                                type="FontAwesome"
                                name="file-pdf-o"
                                style={{fontSize: 20}}
                              />
                            </TouchableOpacity>
                          </Col>
                        ) : item.delete_status != 1 &&
                          item.img_pdf_path == null &&
                          item.payment_status &&
                          item.payment_status != 'Due' ? (
                          <Col size={10}>
                            <TouchableOpacity
                              onPress={() =>
                                this.chooseFile(
                                  item.imaging_id,
                                  item.encounterCode,
                                  item.service_list_id,
                                  'img',
                                )
                              }>
                              <Icon
                                type="FontAwesome"
                                name="upload"
                                style={{fontSize: 20}}
                              />
                            </TouchableOpacity>
                          </Col>
                        ) : null}
                        {item.img_pdf_path == null && (
                          <Col size={10}>
                            <TouchableOpacity
                              style={{marginLeft: '25%'}}
                              onPress={() => {
                                this.setState({
                                  alertvisible: true,
                                  deleteid:
                                    item.from == 'json'
                                      ? item.No
                                      : item.imaging_id,
                                  deletesection: 'Imaging',
                                  deletecheck:
                                    item.from == 'json' ? 'json' : 'db',
                                  version_status: item.version_status,
                                });
                                //
                                console.log(
                                  'visbile=' + this.state.alertvisible,
                                );
                              }}
                              disabled={
                                item.version_status != 2 &&
                                item.delete_status == 1
                                  ? true
                                  : false
                              }>
                              <Icon
                                type="FontAwesome"
                                name="trash"
                                style={{fontSize: 30}}
                              />
                            </TouchableOpacity>
                          </Col>
                        )}
                      </Row>
                    </View>
                  ) : (
                    item.version_status != 2 && (
                      <View style={styles.card}>
                        <Row>
                          <Col size={10}>
                            {/* <Text allowFontScaling={false}style={{fontSize:20,fontWeight:"bold",alignSelf:"center"}}>I</Text> */}
                            <Thumbnail
                              style={{height: 28, width: 28, marginRight: 15}}
                              square
                              source={require('../../../../assets/images/imaging.png')}
                            />
                            {/* <Thumbnail style={{height:28,width:28,marginLeft:15,marginTop:10}} square source={require("../../../assets/images/Pill.png")} /> */}
                          </Col>
                          <Col size={70} style={{marginTop: -10}}>
                            <Text
                              allowFontScaling={false}
                              style={[
                                styles.listData,
                                item.delete_status == 1 && {
                                  textDecorationLine: 'line-through',
                                },
                              ]}>
                              {item.image_type}
                            </Text>
                          </Col>
                          {item.img_pdf_path != null &&
                          item.payment_status != 'Due' ? (
                            <Col size={10}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.screenProps.rootNavigation.navigate(
                                    'ViewPdf',
                                    {link: item.img_pdf_path},
                                  )
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="file-pdf-o"
                                  style={{fontSize: 20}}
                                />
                              </TouchableOpacity>
                            </Col>
                          ) : item.delete_status != 1 &&
                            item.img_pdf_path == null &&
                            item.payment_status &&
                            item.payment_status != 'Due' ? (
                            <Col size={10}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.chooseFile(
                                    item.imaging_id,
                                    item.encounterCode,
                                    item.service_list_id,
                                    'img',
                                  )
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="upload"
                                  style={{fontSize: 20}}
                                />
                              </TouchableOpacity>
                            </Col>
                          ) : null}
                          {item.img_pdf_path == null && (
                            <Col size={10}>
                              <TouchableOpacity
                                style={{marginLeft: '25%'}}
                                onPress={() => {
                                  this.setState({
                                    alertvisible: true,
                                    deleteid:
                                      item.from == 'json'
                                        ? item.No
                                        : item.imaging_id,
                                    deletesection: 'Imaging',
                                    deletecheck:
                                      item.from == 'json' ? 'json' : 'db',
                                    version_status: item.version_status,
                                  });
                                  //
                                  console.log(
                                    'visbile=' + this.state.alertvisible,
                                  );
                                }}
                                disabled={
                                  item.version_status != 2 &&
                                  item.delete_status == 1
                                    ? true
                                    : false
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="trash"
                                  style={{fontSize: 30}}
                                />
                              </TouchableOpacity>
                            </Col>
                          )}
                        </Row>
                      </View>
                    )
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FlatList
                style={styles.contentList}
                columnWrapperStyle={styles.listContainer}
                data={
                  this.state.plan_data.nursing != undefined
                    ? this.state.plan_data.nursing
                    : this.state.plan_data.nursing_services
                }
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return item.version_status == 2 && item.delete_status != 1 ? (
                    <View style={styles.card}>
                      <Row>
                        <Col size={10}>
                          {/* <Text allowFontScaling={false}style={{fontSize:20,fontWeight:"bold",alignSelf:"center"}}>N</Text> */}
                          <Thumbnail
                            style={{height: 28, width: 28, marginRight: 15}}
                            square
                            source={require('../../../../assets/images/nursing.png')}
                          />
                          {/* <Image source={require('../../../assets/images/nursing.png')} style={{alignSelf:'center',hegiht:10,width:10}} /> */}
                          {/* <Thumbnail style={{height:28,width:28,marginLeft:15,marginTop:10}} square source={require("../../../assets/images/Pill.png")} /> */}
                        </Col>
                        <Col size={70} style={{marginTop: -10}}>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.listData,
                              item.version_status != 2 &&
                                item.delete_status == 1 && {
                                  textDecorationLine: 'line-through',
                                },
                            ]}>
                            {item.nurse_service
                              ? item.nurse_service
                              : item.nurse_type}
                          </Text>
                        </Col>
                        {item.ns_pdf_pah != null &&
                        item.ns_pdf_pah != '' &&
                        item.payment_status != 'Due' ? (
                          <Col size={10}>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.screenProps.rootNavigation.navigate(
                                  'ViewPdf',
                                  {link: item.ns_pdf_pah},
                                )
                              }>
                              <Icon
                                type="FontAwesome"
                                name="file-pdf-o"
                                style={{fontSize: 20}}
                              />
                            </TouchableOpacity>
                          </Col>
                        ) : item.delete_status != 1 &&
                          (item.ns_pdf_pah == null || item.ns_pdf_pah == '') &&
                          item.payment_status &&
                          item.payment_status != 'Due' ? (
                          <Col size={10}>
                            <TouchableOpacity
                              onPress={() =>
                                this.chooseFile(
                                  item.nurse_service_id,
                                  item.encounterCode,
                                  item.service_list_id,
                                  'nursing',
                                )
                              }>
                              <Icon
                                type="FontAwesome"
                                name="upload"
                                style={{fontSize: 20}}
                              />
                            </TouchableOpacity>
                          </Col>
                        ) : null}
                        {(item.ns_pdf_pah == null || item.ns_pdf_pah == '') && (
                          <Col size={10}>
                            <TouchableOpacity
                              style={{marginLeft: '25%'}}
                              onPress={() => {
                                this.setState({
                                  alertvisible: true,
                                  deleteid:
                                    item.from == 'json'
                                      ? item.No
                                      : item.nurse_service_id,
                                  deletesection: 'Nursing',
                                  deletecheck:
                                    item.from == 'json' ? 'json' : 'db',
                                  version_status: item.version_status,
                                });
                              }}
                              disabled={
                                item.version_status != 2 &&
                                item.delete_status == 1
                                  ? true
                                  : false
                              }>
                              <Icon
                                type="FontAwesome"
                                name="trash"
                                style={{fontSize: 30}}
                              />
                            </TouchableOpacity>
                          </Col>
                        )}
                      </Row>
                    </View>
                  ) : (
                    item.version_status != 2 && (
                      <View style={styles.card}>
                        <Row>
                          <Col size={10}>
                            {/* <Text allowFontScaling={false}style={{fontSize:20,fontWeight:"bold",alignSelf:"center"}}>N</Text> */}
                            <Thumbnail
                              style={{height: 28, width: 28, marginRight: 15}}
                              square
                              source={require('../../../../assets/images/nursing.png')}
                            />
                            {/* <Image source={require('../../../assets/images/nursing.png')} style={{alignSelf:'center',hegiht:10,width:10}} /> */}
                            {/* <Thumbnail style={{height:28,width:28,marginLeft:15,marginTop:10}} square source={require("../../../assets/images/Pill.png")} /> */}
                          </Col>
                          <Col size={70} style={{marginTop: -10}}>
                            <Text
                              allowFontScaling={false}
                              style={[
                                styles.listData,
                                item.version_status != 2 &&
                                  item.delete_status == 1 && {
                                    textDecorationLine: 'line-through',
                                  },
                              ]}>
                              {item.nurse_service
                                ? item.nurse_service
                                : item.nurse_type}
                            </Text>
                          </Col>
                          {item.ns_pdf_pah != null &&
                          item.ns_pdf_pah != '' &&
                          item.payment_status != 'Due' ? (
                            <Col size={10}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.screenProps.rootNavigation.navigate(
                                    'ViewPdf',
                                    {link: item.ns_pdf_pah},
                                  )
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="file-pdf-o"
                                  style={{fontSize: 20}}
                                />
                              </TouchableOpacity>
                            </Col>
                          ) : item.delete_status != 1 &&
                            (item.ns_pdf_pah == null ||
                              item.ns_pdf_pah == '') &&
                            item.payment_status &&
                            item.payment_status != 'Due' ? (
                            <Col size={10}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.chooseFile(
                                    item.nurse_service_id,
                                    item.encounterCode,
                                    item.service_list_id,
                                    'nursing',
                                  )
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="upload"
                                  style={{fontSize: 20}}
                                />
                              </TouchableOpacity>
                            </Col>
                          ) : null}
                          {(item.ns_pdf_pah == null ||
                            item.ns_pdf_pah == '') && (
                            <Col size={10}>
                              <TouchableOpacity
                                style={{marginLeft: '25%'}}
                                onPress={() => {
                                  this.setState({
                                    alertvisible: true,
                                    deleteid:
                                      item.from == 'json'
                                        ? item.No
                                        : item.nurse_service_id,
                                    deletesection: 'Nursing',
                                    deletecheck:
                                      item.from == 'json' ? 'json' : 'db',
                                    version_status: item.version_status,
                                  });
                                }}
                                disabled={
                                  item.version_status != 2 &&
                                  item.delete_status == 1
                                    ? true
                                    : false
                                }>
                                <Icon
                                  type="FontAwesome"
                                  name="trash"
                                  style={{fontSize: 30}}
                                />
                              </TouchableOpacity>
                            </Col>
                          )}
                        </Row>
                      </View>
                    )
                  );
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <FlatList
                style={styles.contentList}
                columnWrapperStyle={styles.listContainer}
                data={this.state.plan_data.vaccine_consult}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return item.version_status == 2 && item.status != 0 ? (
                    <View style={styles.card}>
                      <Row>
                        <Col size={10}>
                          <Thumbnail
                            style={{height: 28, width: 28, marginRight: 15}}
                            square
                            source={require('../../../../assets/images/vaccination.png')}
                          />
                        </Col>
                        <Col size={80} style={{marginTop: -20}}>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.listData,
                              item.status == 0 && {
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                              },
                            ]}>
                            {item.vaccine_brand_name}
                          </Text>
                          {item.batch_no == '' && item.expiry_date == '' && (
                            <View style={{flexDirection: 'row'}}>
                              {item.payment_status != 'Due' && (
                                <TextInput
                                  allowFontScaling={false}
                                  placeholder="Batch no"
                                  placeholderTextColor={'#2D323C'}
                                  returnKeyType="done"
                                  autoCapitalize="none"
                                  value={this.state.batchno}
                                  keyboardType="numeric"
                                  style={{
                                    borderColor: '#345D7E',
                                    borderWidth: 1,
                                    height: 40,
                                    backgroundColor: 'white',
                                    //paddingLeft:-10,
                                    marginTop: 6,
                                    marginRight: 5,
                                    color: '#4F575C',
                                    // paddingHorizontal: 15
                                  }}
                                  //  style={styles.input}
                                  maxLength={8}
                                  onChangeText={(text) =>
                                    this.setState({batch_no: text})
                                  }
                                />
                              )}
                              {item.payment_status != 'Due' && (
                                <DatePicker
                                  allowFontScaling={false}
                                  date={new Date(this.state.expiry_date)}
                                  minDate={new Date()}
                                  maxDate={moment(new Date(), 'YYYY-MM-DD').add(
                                    10,
                                    'years',
                                  )}
                                  locale={'en'}
                                  format="YYYY-MM-DD"
                                  timeZoneOffsetInMinutes={undefined}
                                  modalTransparent={false}
                                  animationType={'fade'}
                                  androidMode={'spinner'}
                                  //placeHolderText="Select Here"
                                  textStyle={{
                                    color: '#2D323C',
                                    borderBottomColor: '#DCDCDC',
                                    borderBottomWidth: 1,
                                  }}
                                  placeHolderTextStyle={{
                                    color: '#2D323C',
                                    borderBottomColor: '#DCDCDC',
                                    borderBottomWidth: 1,
                                  }}
                                  onDateChange={this.setDate}
                                  style={{paddingTop: 5}}
                                />
                              )}
                              {item.payment_status != 'Due' && (
                                <TouchableOpacity
                                  style={{
                                    marginLeft: 10,
                                    marginRight: 5,
                                    marginTop: 5,
                                  }}
                                  onPress={() =>
                                    this.updatebatchvaccine(item.vaccine_id)
                                  }>
                                  <Thumbnail
                                    style={{height: 40, width: 40}}
                                    square
                                    source={require('../../../../assets/images/vaccination.png')}
                                  />
                                </TouchableOpacity>
                              )}
                              <TouchableOpacity
                                style={
                                  item.payment_status == 'Due' && {
                                    marginLeft: '87%',
                                  }
                                }
                                onPress={() => {
                                  this.setState({
                                    alertvisible: true,
                                    deleteid: item.id,
                                    deletesection: 'Vaccine',
                                    version_status: item.version_status,
                                  });
                                }}
                                disabled={item.status == 0 ? true : false}>
                                <Icon
                                  type="FontAwesome"
                                  name="trash"
                                  style={{fontSize: 30, marginTop: -10}}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                          {item.batch_no != '' && item.expiry_date != '' && (
                            <Row>
                              <Col size={87}>
                                {item.payment_status != 'Due' && (
                                  <Text
                                    allowFontScaling={false}
                                    style={[
                                      {fontSize: 12, color: '#675e5e'},
                                      item.status == 0 && {
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                      },
                                    ]}>
                                    Batch No:{item.batch_no}| Expiry Date:
                                    {item.expiry_date}| Administer:
                                    {item.Administer}
                                  </Text>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </View>
                  ) : (
                    <View style={styles.card}>
                      <Row>
                        <Col size={10}>
                          <Thumbnail
                            style={{height: 28, width: 28, marginRight: 15}}
                            square
                            source={require('../../../../assets/images/vaccination.png')}
                          />
                        </Col>
                        <Col size={80} style={{marginTop: -20}}>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.listData,
                              item.status == 0 && {
                                textDecorationLine: 'line-through',
                                textDecorationStyle: 'solid',
                              },
                            ]}>
                            {item.vaccine_brand_name}
                          </Text>
                          {item.batch_no == '' && item.expiry_date == '' && (
                            <View style={{flexDirection: 'row'}}>
                              {item.payment_status != 'Due' && (
                                <TextInput
                                  allowFontScaling={false}
                                  placeholder="Batch no"
                                  placeholderTextColor={'#2D323C'}
                                  returnKeyType="done"
                                  autoCapitalize="none"
                                  value={this.state.batchno}
                                  keyboardType="numeric"
                                  style={{
                                    borderColor: '#345D7E',
                                    borderWidth: 1,
                                    height: 40,
                                    backgroundColor: 'white',
                                    //paddingLeft:-10,
                                    marginTop: 6,
                                    marginRight: 5,
                                    color: '#4F575C',
                                    // paddingHorizontal: 15
                                  }}
                                  //  style={styles.input}
                                  maxLength={8}
                                  onChangeText={(text) =>
                                    this.setState({batch_no: text})
                                  }
                                />
                              )}
                              {item.payment_status != 'Due' && (
                                <DatePicker
                                  allowFontScaling={false}
                                  date={new Date(this.state.expiry_date)}
                                  minDate={new Date()}
                                  maxDate={moment(new Date(), 'YYYY-MM-DD').add(
                                    10,
                                    'years',
                                  )}
                                  locale={'en'}
                                  format="YYYY-MM-DD"
                                  timeZoneOffsetInMinutes={undefined}
                                  modalTransparent={false}
                                  animationType={'fade'}
                                  androidMode={'spinner'}
                                  //placeHolderText="Select Here"
                                  textStyle={{
                                    color: '#2D323C',
                                    borderBottomColor: '#DCDCDC',
                                    borderBottomWidth: 1,
                                  }}
                                  placeHolderTextStyle={{
                                    color: '#2D323C',
                                    borderBottomColor: '#DCDCDC',
                                    borderBottomWidth: 1,
                                  }}
                                  onDateChange={this.setDate}
                                  style={{paddingTop: 5}}
                                />
                              )}
                              {item.payment_status != 'Due' && (
                                <TouchableOpacity
                                  style={{
                                    marginLeft: 10,
                                    marginRight: 5,
                                    marginTop: 5,
                                  }}
                                  onPress={() =>
                                    this.updatebatchvaccine(item.vaccine_id)
                                  }>
                                  <Thumbnail
                                    style={{
                                      height: 40,
                                      width: 40,
                                      paddingRight: 5,
                                    }}
                                    square
                                    source={require('../../../../assets/images/vaccination.png')}
                                  />
                                </TouchableOpacity>
                              )}
                              <TouchableOpacity
                                style={
                                  item.payment_status == 'Due' && {
                                    marginLeft: '87%',
                                  }
                                }
                                onPress={() => {
                                  this.setState({
                                    alertvisible: true,
                                    deleteid: item.id,
                                    deletesection: 'Vaccine',
                                    version_status: item.version_status,
                                  });
                                }}
                                disabled={item.status == 0 ? true : false}>
                                <Icon
                                  type="FontAwesome"
                                  name="trash"
                                  style={{fontSize: 30}}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                          {item.batch_no != '' && item.expiry_date != '' && (
                            <Row>
                              <Col size={87}>
                                {item.payment_status != 'Due' && (
                                  <Text
                                    allowFontScaling={false}
                                    style={[
                                      {fontSize: 12, color: '#675e5e'},
                                      item.status == 0 && {
                                        textDecorationLine: 'line-through',
                                        textDecorationStyle: 'solid',
                                      },
                                    ]}>
                                    Batch No:{item.batch_no}| Expiry Date:
                                    {item.expiry_date}
                                    {/* | Administer:{item.Administer} */}
                                  </Text>
                                )}
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </View>
                  );
                }}
              />
            </Col>
          </Row>
          <Row style={{marginTop: 10}}>
            <Col size={70}>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 15,
                }}>
                {i18n.t('PATIENTS.TREAT_NOTE')}
              </Text>
            </Col>
            {this.state.time_hidet1 && (
              <Col size={30}>
                <TouchableOpacity
                  style={{alignSelf: 'flex-end', marginRight: 10}}
                  onPress={() => {
                    this.treat();
                  }}>
                  <Text
                    style={{fontSize: 12, color: '#517fa4', marginRight: 10}}>
                    {i18n.t('PATIENTS.COMMENT')}{' '}
                    <Icon
                      type="FontAwesome"
                      name="caret-down"
                      style={{fontSize: 15}}
                    />
                  </Text>
                </TouchableOpacity>
              </Col>
            )}
          </Row>

          {this.state.hidet && (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.treatment_notes}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height3: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height3),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      isPlanModified: true,
                      treatment_notes: text,
                    });
                    global.treatment_notes = text;
                  }}
                  scrollEnabled={false}
                />
              </Col>
            </Row>
          )}
          {this.state.time_hidet && (
            <Row>
              <Col>
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.treatment_notes}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height3: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height3),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      isPlanModified: true,
                      treatment_notes: text,
                    });
                    global.treatment_notes = text;
                  }}
                  scrollEnabled={false}
                />
              </Col>
            </Row>
          )}

          {this.state.time_hidet1 && (
            <Row>
              <Col pointerEvents="none">
                <TextInput
                  allowFontScaling={false}
                  // placeholder="Type something"
                  value={this.state.treatment_notes1}
                  multiline={true}
                  // numberOfLines={5}
                  onContentSizeChange={(event) => {
                    this.setState({
                      height3t: event.nativeEvent.contentSize.height,
                    });
                  }}
                  style={{
                    height: 200,
                    textAlignVertical: 'top',
                    height: Math.max(35, this.state.height3t),
                    borderColor: '#345D7E',
                    borderWidth: 1,
                    borderWidth: 1,
                    marginHorizontal: 10,
                  }}
                  onChangeText={(text) => {
                    this.setState({
                      isPlanModified: true,
                      treatment_notes1: text,
                    });
                  }}
                  scrollEnabled={false}
                />
              </Col>
            </Row>
          )}
          <Row style={{marginTop: 10}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 15,
                }}>
                {i18n.t('PATIENTS.OFFICE')}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <TextInput
                allowFontScaling={false}
                // placeholder="Type something"
                value={this.state.interoffice_notes}
                multiline={true}
                numberOfLines={5}
                onContentSizeChange={(event) => {
                  this.setState({
                    height4: event.nativeEvent.contentSize.height,
                  });
                }}
                style={{
                  height: 200,
                  textAlignVertical: 'top',
                  height: Math.max(35, this.state.height4),
                  borderColor: '#345D7E',
                  borderWidth: 1,
                  borderWidth: 1,
                  marginHorizontal: 10,
                }}
                onChangeText={(text) => {
                  this.setState({
                    isPlanModified: true,
                    interoffice_notes: text,
                  });
                  global.interoffice_notes = text;
                }}
                scrollEnabled={false}
              />
            </Col>
          </Row>
          <Row style={{marginTop: 10}}>
            <Col>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  marginTop: 5,
                  fontSize: 15,
                }}>
                {i18n.t('PATIENTS.FOLLOW')}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <TextInput
                allowFontScaling={false}
                // placeholder="Type something"
                value={this.state.followup_notes}
                multiline={true}
                // numberOfLines={5}
                onContentSizeChange={(event) => {
                  this.setState({
                    height5: event.nativeEvent.contentSize.height,
                  });
                }}
                style={{
                  height: 200,
                  textAlignVertical: 'top',
                  height: Math.max(35, this.state.height5),
                  borderColor: '#345D7E',
                  borderWidth: 1,
                  borderWidth: 1,
                  marginHorizontal: 10,
                }}
                onChangeText={(text) => {
                  this.setState({isPlanModified: true, followup_notes: text});
                  global.followup_notes = text;
                }}
                scrollEnabled={false}
              />
            </Col>
          </Row>
          <Row>
            <Col style={{alignItems: 'center'}}>
              <Button
                style={{
                  height: 40,
                  width: 150,
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 25,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.savePlan()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  {i18n.t('COMMON.SAVE')}
                </Text>
              </Button>
            </Col>
          </Row>
          <Row></Row>
        </View>
        <FlashMessage position="top" ref={(ref) => (this.PlanAlert = ref)} />
      </KeyboardAwareScrollView>
      // </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  timelineList: state.persontimeline.timelineList,
  postList: state.postList.postList,
  fetchingVaccineResponse: state.retrievevaccine.fetchingVaccineResponse,
  consultList: state.consultList.consultList,
  applyList: state.applyList.applyList,
  medicineList: state.medicineList.medicineList,
  ServicesList: state.services.ServicesList,
  patientList: state.patientList.patientList,
  isFetching20: state.consultList.isFetching20,
  saveLabResponse: state.savelab.saveLabResponse,
  saveImagingResponse: state.saveimaging.saveImagingResponse,
  saveNursingResponse: state.savenursing.saveNursingResponse,
  deleteLabResponse: state.deletelab.deleteLabResponse,
  deleteImagingResponse: state.deleteimaging.deleteImagingResponse,
  deleteNursingResponse: state.deletenursing.deleteNursingResponse,
  RepeatingAllLabResponse: state.repeatalllab.RepeatingAllLabResponse,
  RepeatingAllImagingResponse:
    state.repeatallimaging.RepeatingAllImagingResponse,
  RepeatingLabResponse: state.repeatlab.RepeatingLabResponse,
  RepeatingImagingResponse: state.repeatimaging.RepeatingImagingResponse,
  saveVaccineResponse: state.savevaccine.saveVaccineResponse,
  addmedList: state.addmedList.addmedList,
  addmedList1: state.addmedList1.addmedList1,
  isFetching21: state.consultList.isFetching21,
  delList: state.delList.delList,
  delList1: state.delList1.delList1,
  medicineList1: state.medicineList1.medicineList1,
  deleteVaccineResponse: state.deletevaccine.deleteVaccineResponse,
  saveplanresponse: state.saveplan.plan_save_response,
  deleteTempLabResponse: state.delete_temp_lab_reducer.deleteTempLabList,
  deleteTempImgResponse: state.delete_temp_img_reducer.deleteTempImgList,
  deleteTempNursingResponse:
    state.delete_temp_nursing_reducer.deleteTempNursingList,
  deleteTempMedicineResponse:
    state.delete_temp_med_reducer.deleteTempMedicineList,
  deleteTempSupplementResponse:
    state.delete_temp_sup_reducer.deleteTempSupplementList,
  // editmsList:state.editmsList.editmsList,
  updatemsList: state.updatemsList.updatemsList,
  changetab: state.change_tab_reducer.changetab,
  UpdatingBatchVaccineResponse:
    state.update_vaccinebatch_reducer.UpdatingBatchVaccineResponse,
});
// export default Plan;
export default connect(mapStateToProps, {
  getMedicineList,
  savePlanData,
  saveLabOrderData,
  saveImagingOrderData,
  saveNursingOrderData,
  deleteLabOrderData,
  deleteImagingOrderData,
  deleteNursingOrderData,
  repeatAllImagingOrderData,
  repeatAllLabOrderData,
  repeatImagingOrderData,
  repeatLabOrderData,
  saveVaccineOrderData,
  deleteVaccineOrderData,
  getAddmedList,
  getAddmedList1,
  getMedicineList1,
  getDelList,
  getDelList1,
  getConsultList,
  getApplyList,
  deleteTempImagingOrderData,
  deleteTempLabOrderData,
  deleteTempMedicineData,
  deleteTempNursingOrderData,
  deleteTempSupplementData,
  updateVaccineBatchData,
  // getEditmsList,
  getUpdatemsList,
  changeTabData,
  getVaccineOrderData,
})(Plan);
const styles = StyleSheet.create({
  input: {
    // marginTop:15,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
  },
  input1: {
    marginLeft: 10,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    width: 90,
    backgroundColor: 'white',
    marginBottom: 10,
    color: '#4F575C',
    paddingHorizontal: 15,
  },
  card: {
    shadowColor: '#00000021',

    shadowOffset: {
      width: 0,

      height: 6,
    },

    marginHorizontal: 10,

    marginVertical: 5,

    shadowOpacity: 0.37,

    shadowRadius: 7.49,

    elevation: 5,

    backgroundColor: 'white',

    padding: 10,

    flexDirection: 'row',

    borderRadius: 8,
  },
  container: {
    // backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderColor: 'black',
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  inputContainerStyle: {
    borderRadius: 0,
    paddingLeft: 5,
    //height: 35,
    height: Platform.OS === 'ios' ? 35 : null,
    width: 300,
    justifyContent: 'center',
    borderColor: 'transparent',
    alignItems: 'center',
    backgroundColor: '#efeaea',
    flex: Platform.OS === 'ios' ? 1 : 0,
    //marginTop: Platform.OS === 'ios' ? 20 : 0,
    left: 0,
    //position: 'absolute',
    position: Platform.OS === 'ios' ? 'absolute' : null,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  listData: {fontSize: 12, fontWeight: 'bold', marginTop: 15},
  listData2: {fontSize: 14, fontWeight: 'bold'},
});

const {height, width} = Dimensions.get('window');
