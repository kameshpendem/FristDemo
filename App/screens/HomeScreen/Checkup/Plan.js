import React, {Component} from 'react';
import {
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
import {Picker} from '@react-native-picker/picker';

import AutoTags from 'react-native-tag-autocomplete';
import {connect} from 'react-redux';
import Autocomplete from 'react-native-autocomplete-input';
import {getMedicineList} from '../../../redux/actions/medicine_action';
import {Overlay, ButtonGroup} from 'react-native-elements';
import {
  savePlanData,
  saveLabOrderData,
  saveImagingOrderData,
  saveNursingOrderData,
  saveVaccineOrderData,
  updateVaccineBatchData,
} from '../../../redux/actions/save_action';
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
} from '../../../redux/actions/delete_action';
import {
  repeatAllImagingOrderData,
  repeatImagingOrderData,
  repeatLabOrderData,
  repeatAllLabOrderData,
} from '../../../redux/actions/repeat_action';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import RNImageToPdf from 'react-native-image-to-pdf';
import {getMedicineList1} from '../../../redux/actions/medicine_action1';
import {getAddmedList} from '../../../redux/actions/addmed_action';
import {getAddmedList1} from '../../../redux/actions/addmed_action1';
import {getDelList} from '../../../redux/actions/delete_med';
import {getDelList1} from '../../../redux/actions/delete_sup';
import {getConsultList} from '../../../redux/actions/consult_action';
import {getApplyList} from '../../../redux/actions/tempapply_action';
// import {getEditmsList} from '../../../redux/actions/editms_action';
import {getUpdatemsList} from '../../../redux/actions/updatems_action';
import FlashMessage from 'react-native-flash-message';

// import {getImageorderList} from '../../../redux/actions/imageorder_action';
import DatePicker from 'react-native-datepicker';
import FileSelector from '../../../components/fileselector/FileSelector';
import moment from 'moment';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import {NavigationActions, StackActions} from 'react-navigation';
import {changeTabData} from '../../../redux/actions/changetab_action';
import getBaseUrl from '../../../config/Config';
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
class Plan extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
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
      visible: this.props.myprops.visible == '1' ? true : false,
      visible1: this.props.myprops.visible == '2' ? true : false,
      visible2: this.props.myprops.visible == '3' ? true : false,
      visible3: this.props.myprops.visible == '4' ? true : false,
      visible4: this.props.myprops.visible == '5' ? true : false,
      visible5: this.props.myprops.visible == '6' ? true : false,

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
        'Once',
        'Twice',
        'Thrice',
      ],
      dup_buttons1: ['4H', '6H', '8H', '12H', 'Once', 'Twice', 'Thrice'],
      buttons2: ['1', '2', '3', '4', '5', '6'],
      buttons4: ['Before Food', 'After Food', 'Empty Stomach', 'Bed Time'],
      buttons3: ['SOS'],
      buttons: ['1/2', '1', '2', '3'],
      buttonsa1: [
        '4Hours',
        '6Hours',
        '8Hours',
        '12Hours',
        'Once',
        'Twice',
        'Thrice',
      ],
      buttonsa2: ['1', '2', '3', '4', '5', '6'],
      buttonsa4: ['Before Food', 'After Food', 'Empty Stomach', 'Bed Time'],
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
      mesure: 'TAB',
      mesure1: 'TAB',
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
      day: 'hourly',
      day1: 'days',
      day2: 'hourly',
      day3: 'days',
      mulImg: [],
      drugtype_list: [
        'TAB',
        'CAP',
        'ML',
        'MG',
        'Drops',
        'UNIT',
        'SET',
        'GM',
        'MG/ML',
        'Nos.',
      ],
      films12: [
        {
          title: 'Dolo',
          Dose: '1',
          When: 'After Food',
          Time: 'INDTGAAA000011-1-19AAA000089',
          Duration: 'Chekdin',
        },
        {
          title: 'Mac',
          Dose: '1',
          When: 'After Food',
          Time: 'INDTGAAA000011-1-19AAA000090',
          Duration: 'Consulting',
        },
        {
          title: 'Lenovo',
          Dose: '1',
          When: 'After Food',
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
      //         When: 'After Food',
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
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    // alert("Lab Order saved Successfully")
    this.props.myprops.screen == 'dashboard'
      ? // alert("called2")
        await this.props.getApplyList(myobj)
      : this.props.myprops.screen == 'timelene'
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
    console.log('regex=' + regex1);
    //return the filtered film array according the query from the input
    let newdata = supplements.filter((supplement) => {
      console.log(
        supplement.drug_name +
          ' ' +
          supplement.drug_name.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1'),
      );
      return (
        supplement.drug_name
          .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
          .search(regex1) >= 0 ||
        (
          supplement.drug_type != null &&
          supplement.drug_type.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
        ).search(regex1) >= 0
      );
    });

    if (this.state.query1.length > 1) {
      if (this.state.query1 != '' && newdata.length > 0) {
        return newdata;
      } else {
        if (!this.state.junk_medicine1) {
          Alert.alert(
            'Supplement Not Available',
            'Do You Want To Add To Prescription',
            [
              {
                text: 'Yes',
                onPress: () => this.setState({junk_medicine1: true}),
              },
              {
                text: 'Cancel',
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
  }
  findMedicine(query) {
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
            'Medicine Not Available',
            'Do You Want To Add To Prescription',
            [
              {
                text: 'Yes',
                onPress: () => this.setState({junk_medicine: true}),
              },
              {
                text: 'Cancel',
                onPress: () => {
                  this.setState({query: ''});
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
  }

  findVaccineData(query2) {
    // await this.props.getMedicineList({
    //     "type":"medicine",
    //     "key":this.state.query,
    //     "docid":global.doctor_id,
    //     "token":global.token
    // })
    // console.log("hi"+JSON.stringify("hi"+this.props.medicineList.message))
    //method called everytime when we change the value of the input
    if (query2 === '') {
      //if the query is null then return blank
      return [];
    }
    const {vaccines} = this.state;
    // console.log("vaccine="+JSON.stringify(vaccines))
    // alert(JSON.stringify(this.props.fetchingVaccineResponse))
    //making a case insensitive regular expression to get similar value from the film json

    // const regex1 = new RegExp(`${query1.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g,'\\$1')}`, 'i');

    // //return the filtered film array according the query from the input
    // return supplements.filter(supplement => (supplement.drug_name.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g,'\\$1')).search(regex1) >= 0 ||(supplement.drug_type.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g,'\\$1')).search(regex1) >= 0 );

    const regex = new RegExp(
      `${query2.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')}`,
      'i',
    );

    //return the filtered film array according the query from the input
    let newData = [];
    console.log('values=' + JSON.stringify(vaccines));
    newData =
      vaccines.length > 0
        ? vaccines.filter(
            (vaccine) =>
              vaccine.vaccine_brand_name
                .replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g, '\\$1')
                .search(regex) >= 0,
          )
        : [];
    return newData;
  }
  closeOverlay = async () => {
    this.setState({
      visible: false,
      selectedIndex: 1,
      selectedIndex1: 6,
      selectedIndex2: 1,
      selectedIndex3: 'undefined',
      selectedIndex4: 1,
      time_text: true,
      time_text1: true,
      time_text2: true,
      time: '08:00 AM',
      time1: '02:00 PM',
      time2: '09:00 PM',
      day: 'hourly',
      day1: 'days',
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
    let source;
    source = {path: filePath};
    if (source.path.split('.')[1] == 'pdf') {
      this.setState({pdfpath: source.path});
    } else {
      this.state.mulImg.push(source.path);
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
  }

  chooseFile = (id, encid, service_list_id, servicetype) => {
    /* var options = {
      title: 'Select Image',
      //   customButtons: [
      //     { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      //   ],
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

    /* ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);
  
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else {
        let source;
        if(Platform.OS==='android'){
          source = {path: response.path};
        }
        if(Platform.OS==='ios'){
          source={path:response.uri.replace('file://','')}
        }
        // let source = { path: response.path };
        // console.log(source);
        if(source.path.split(".")[1]=="pdf"){
          this.setState({pdfpath:source.path})
        }
        else{
          this.state.mulImg.push(source.path);
        this.setState({mulImg:this.state.mulImg});
      //   this.convertPDF(source.path);
      this.checkConvert(id,encid,service_list_id,servicetype);
        }
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        // this.state.mulImg.push(source.path);
        // this.setState({
        //   filePath: source,
        // });
      }
    });
    // alert(this.state.filePath.uri)
    // this.checkConvert(); */
  };

  checkConvert = (id, encid, service_list_id, servicetype) => {
    Alert.alert(
      'Image Order added',
      'Do you want to add more?',
      [
        {
          text: 'Yes',
          onPress: () =>
            this.chooseFile(id, encid, service_list_id, servicetype),
        },
        {
          text: 'No',
          onPress: () =>
            this.convertPDF(id, encid, service_list_id, servicetype),
        },
      ],
      {cancelable: false},
    );
  };
  convertPDF = async (id, encid, service_list_id, servicetype) => {
    // this.refs.loading.show();
    this.setState({load1: true});
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: encid + '-' + service_list_id + '-' + id + '.pdf',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: 1200,
        },
        quality: 0.5, // optional compression paramter
      };
      // console.log(options)

      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({pdfpath: pdf.filePath});
      // this.refs.loading.close();
      // alert("hi"+pdf.filePath)
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
      // alert(url+" "+JSON.stringify(pt))
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
          console.log(' enc inserted res=' + JSON.stringify(response));
          this.setState({load1: false});
          //  alert(JSON.stringify(response))
          // this.refs.loading.close();
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
      this.setState({load1: false});
      console.log(response.message);
      if (
        response.message == 'File Added Successfully' ||
        response.message == 'successfully' ||
        response.message == 'success'
      ) {
        //alert("Added Successfully")
        this.PlanAlert.showMessage({
          message: 'Success!',
          description: 'File Uploaded',
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
        alert('File not upload');
      }
    } catch (e) {
      // console.log(e);
    }
  };
  closeOverlay1 = () => {
    // this.state.junk_medicine1=false;
    this.setState({
      visible1: false,
      selectedIndexa: 1,
      selectedIndexa1: 6,
      selectedIndexa3: 'undefined',
      selectedIndexa2: 1,
      selectedIndexa4: 1,
      time_texta: true,
      time_texta1: true,
      time_texta2: true,
      timea: '08:00 AM',
      timea1: '02:00 PM',
      timea2: '09:00 PM',
      day3: 'days',
      day2: 'hourly',
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
    this.setState({visible5: false});
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
    //    if(selectedIndex4==this.state.selectedIndex4){
    //   this.setState({
    //    selectedIndex4:""
    //  })
    //    }
    //  alert("hi"+this.state.custom)
  };
  updateIndexa4 = async (selectedIndexa4) => {
    this.setState({selectedIndexa4});
    //    if(selectedIndex4==this.state.selectedIndex4){
    //   this.setState({
    //    selectedIndex4:""
    //  })
    //    }
    //  alert("hi"+this.state.custom1)
  };
  updateIndexa2 = async (selectedIndexa2) => {
    if (selectedIndexa2 != undefined) {
      this.setState({selectedIndexa2, duration1: ''});
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
    console.log(selectedIndexa1);
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
    this.setState({tagsSelected: this.state.tagsSelected.concat([suggestion])});
  };
  handleDelete1 = (index) => {
    let tagsSelected1 = this.state.tagsSelected1;
    tagsSelected1.splice(index, 1);
    this.setState({tagsSelected1});
  };
  add_medicine = async () => {
    //alert(this.state.query)

    if (this.state.query == '') {
      alert('please enter medicine');
    } else {
      let uniquecheck = this.state.medicines_data.filter((item) => {
        //  console.log(item.drug_name.trim()==this.state.query.split("(")[0].trim())
        //  console.log(item.drug_name.trim()+" "+this.state.query.split("(")[0].trim())
        console.log(item.drug_name + ' ' + this.state.query);
        return item.drug_id != null
          ? item.drug_id == this.state.drug_id
          : item.drug_name ==
              (this.state.query.includes('(')
                ? this.state.query.split('(')[0]
                : this.state.query);
      });
      //alert(JSON.stringify(uniquecheck))
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
        let ob = JSON.stringify({
          // this.state.medicines
          docid: global.doctor_id,
          hlpid: this.props.myprops.hlpid,
          enc_id: this.props.myprops.enc_id,
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
              : this.state.custom + ' ' + this.state.day,
          notes: this.state.note,
          before_after: this.state.buttons4[Number(this.state.selectedIndex4)],
          sostablet:
            this.state.selectedIndex3 != 'undefined'
              ? this.state.buttons3[Number(this.state.selectedIndex3)]
              : 'undefined',
          drug_intake_timing: timevalue,
          username: docname,
          token: global.token,
        });
        console.log(
          ob +
            ' ' +
            this.state.buttons2[Number(this.state.selectedIndex2)] +
            ' ' +
            this.state.selectedIndex2,
        );
        await this.props.getAddmedList(ob);

        if (
          this.props.addmedList.message == 'Prescription added Successfully'
        ) {
          this.state.deletesection = 'Medicine';
          await this.updateList();
          if (global.screen == 'dashboard') {
            let med_data = this.props.applyList.message.prescriptions.filter(
              (item) => item.medicine_type == 'med',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.myprops.check_status.toLowerCase() == 'reconsulting'
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
        });
        this.props.changeTabData(-1);
        this.PlanAlert.showMessage({
          message: 'Success!',
          description: 'Medicine Added',
          type: 'success',
          icon: 'auto',
        });
      } else {
        alert('Medicine Already Exists');
      }
    }
  };

  add_medicine2 = async () => {
    if (this.state.query == '') {
      alert('please enter medicine');
    } else {
      let uniquecheck = this.state.medicines_data.filter((item) => {
        return item.drug_id != null
          ? item.drug_id == this.state.drug_id
          : item.drug_name ==
              (this.state.query.includes('(')
                ? this.state.query.split('(')[0]
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
          hlpid: this.props.myprops.hlpid,
          enc_id: this.props.myprops.enc_id,
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
              : this.state.custom + ' ' + this.state.day,
          notes: this.state.note,
          before_after: this.state.buttons4[Number(this.state.selectedIndex4)],
          sostablet:
            this.state.selectedIndex3 != 'undefined'
              ? this.state.buttons3[Number(this.state.selectedIndex3)]
              : 'undefined',
          drug_intake_timing: timevalue,
          username: docname,
          token: global.token,
        });
        await this.props.getAddmedList(ob);
        if (
          this.props.addmedList.message == 'Prescription added Successfully'
        ) {
          this.state.deletesection = 'Medicine';
          await this.updateList();
          if (global.screen == 'dashboard') {
            let med_data = this.props.applyList.message.prescriptions.filter(
              (item) => item.medicine_type == 'med',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.myprops.check_status.toLowerCase() == 'reconsulting'
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
            selectedIndex: 1,
            selectedIndex1: 6,
            selectedIndex2: 1,
            selectedIndex3: 'undefined',
            selectedIndex4: 1,
            time_text: true,
            time_text1: true,
            time_text2: true,
            time: '08:00 AM',
            time1: '02:00 PM',
            time2: '09:00 PM',
            day1: 'days',
            day: 'hourly',
            custom: '',
            duration: '',
            query: '',
            dose: '',
            note: '',
          });
        }
        this.PlanAlert2.showMessage({
          message: 'Success!',
          description: 'Medicine Added',
          type: 'success',
          icon: 'auto',
        });
      } else {
        alert('Medicine Already Exists');
      }
    }
  };
  add_medicine1 = async () => {
    if (this.state.query1 == '') {
      alert('please enter supplement');
    } else {
      let uniquecheck = this.state.medicines_data.filter((item) => {
        return item.drug_id != null
          ? item.drug_id == this.state.drug_id1
          : item.drug_name ==
              (this.state.query1.includes('(')
                ? this.state.query1.split('(')[0]
                : this.state.query1);
      });
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
          hlpid: this.props.myprops.hlpid,
          enc_id: this.props.myprops.enc_id,
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
              : this.state.custom1 + ' ' + this.state.day2,
          notes: this.state.note1,
          before_after: this.state.buttons4[Number(this.state.selectedIndexa4)],
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
            let sup_data = this.props.applyList.message.prescriptions.filter(
              (item) => item.medicine_type == 'sup',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.myprops.check_status.toLowerCase() == 'reconsulting'
            ) {
              this.state.supplements_data = sup_data;
            } else {
              let med_data2 = this.props.applyList.message.prescriptions.filter(
                (item) => item.from == 'json',
              );
              this.state.supplements_data =
                med_data2.length > 0
                  ? this.props.applyList.message.supplements
                  : sup_data;
            }
          } else if (global.screen == 'timelene') {
            let sup_data = this.props.consultList.message.prescriptions.filter(
              (item) => item.medicine_type == 'sup',
            );
            (this.state.plan_data = this.props.consultList.message),
              (this.state.supplements_data = sup_data);
          }
        }
        this.setState({
          load1: false,
        });
        this.props.changeTabData(-1);
        this.PlanAlert.showMessage({
          message: 'Success!',
          description: 'Supplement Added',
          type: 'success',
          icon: 'auto',
        });
      } else {
        alert('Supplement Already Exists');
      }
    }
  };
  add_medicine3 = async () => {
    if (this.state.query1 == '') {
      alert('please enter supplement');
    } else {
      let uniquecheck = this.state.medicines_data.filter((item) => {
        return item.drug_id != null
          ? item.drug_id == this.state.drug_id1
          : item.drug_name ==
              (this.state.query1.includes('(')
                ? this.state.query1.split('(')[0]
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
          hlpid: this.props.myprops.hlpid,
          enc_id: this.props.myprops.enc_id,
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
              : this.state.custom1 + ' ' + this.state.day2,
          notes: this.state.note1,
          before_after: this.state.buttons4[Number(this.state.selectedIndexa4)],
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
            let sup_data = this.props.applyList.message.prescriptions.filter(
              (item) => item.medicine_type == 'sup',
            );
            this.state.plan_data = this.props.applyList.message;
            if (
              this.props.myprops.check_status.toLowerCase() == 'reconsulting'
            ) {
              this.state.supplements_data = sup_data;
            } else {
              let med_data2 = this.props.applyList.message.prescriptions.filter(
                (item) => item.from == 'json',
              );
              this.state.supplements_data =
                med_data2.length > 0
                  ? this.props.applyList.message.supplements
                  : sup_data;
            }
          } else if (global.screen == 'timelene') {
            let sup_data = this.props.consultList.message.prescriptions.filter(
              (item) => item.medicine_type == 'sup',
            );
            await this.setState({
              plan_data: this.props.consultList.message,
              supplements_data: sup_data,
            });
          }
        } else {
          alert('Supplement Already Exists');
        }
      }
      this.setState({
        load1: false,
        selectedIndexa: 1,
        selectedIndexa1: 6,
        selectedIndexa2: 1,
        selectedIndexa3: 'undefined',
        selectedIndexa4: 1,
        time_texta: true,
        time_texta1: true,
        time_texta2: true,
        timea: '08:00 AM',
        timea1: '02:00 PM',
        timea2: '09:00 PM',
        day3: 'days',
        day2: 'hourly',
        custom1: '',
        duration1: '',
        query1: '',
        dose1: '',
        note1: '',
      });
      this.PlanAlert2.showMessage({
        message: 'Success!',
        description: 'Supplement Added',
        type: 'success',
        icon: 'auto',
      });
    }
  };
  delete_temp_medicine = async (value) => {
    this.setState({load1: true});
    await this.props.deleteTempMedicineData({
      docid: global.doctor_id,
      presc_id: value,
      hlp_id: this.props.myprops.hlpid,
      enc_id: this.props.myprops.enc_id,
      token: global.token,
    });

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (
      this.props.deleteTempMedicineResponse.message == 'Successfully Deleted'
    ) {
      //  this.setState({load1:false})
      //alert("Delete Medicine Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let med_data = this.props.applyList.message.prescriptions.filter(
          (item) => item.medicine_type == 'med',
        );
        this.state.plan_data = this.props.applyList.message;
        if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
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
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Medicine Deleted',
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
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (this.props.delList.message == 'Prescription deleted Successfully') {
      //  this.setState({load1:false})
      //alert("Delete Medicine Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let med_data = this.props.applyList.message.prescriptions.filter(
          (item) => item.medicine_type == 'med',
        );
        this.state.plan_data = this.props.applyList.message;
        if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
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
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Medicine Deleted',
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
      hlp_id: this.props.myprops.hlpid,
      enc_id: this.props.myprops.enc_id,
      token: global.token,
    });
    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (
      this.props.deleteTempSupplementResponse.message == 'Successfully Deleted'
    ) {
      //this.setState({load1:false})
      //
      //alert("Supplement Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let sup_data = this.props.applyList.message.prescriptions.filter(
          (item) => item.medicine_type == 'sup',
        );

        this.state.plan_data = this.props.applyList.message;
        if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
          this.state.supplements_data = sup_data;
        } else {
          let med_data2 = this.props.applyList.message.prescriptions.filter(
            (item) => item.from == 'json',
          );
          this.state.supplements_data =
            med_data2.length > 0
              ? this.props.applyList.message.supplements
              : sup_data;
        }
      } else if (global.screen == 'timelene') {
        let sup_data = this.props.consultList.message.prescriptions.filter(
          (item) => item.medicine_type == 'sup',
        );
        await this.setState({
          plan_data: this.props.consultList.message,
          supplements_data: sup_data,
        });
      }
    }
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Supplement Deleted',
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
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (this.props.delList1.message == 'Supplement deleted Successfully') {
      //this.setState({load1:false})
      //
      //alert("Supplement Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        let sup_data = this.props.applyList.message.prescriptions.filter(
          (item) => item.medicine_type == 'sup',
        );
        this.state.plan_data = this.props.applyList.message;
        if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
          this.state.supplements_data = sup_data;
        } else {
          let med_data2 = this.props.applyList.message.prescriptions.filter(
            (item) => item.from == 'json',
          );
          this.state.supplements_data =
            med_data2.length > 0
              ? this.props.applyList.message.supplements
              : sup_data;
        }
      } else if (global.screen == 'timelene') {
        let sup_data = this.props.consultList.message.prescriptions.filter(
          (item) => item.medicine_type == 'sup',
        );
        await this.setState({
          plan_data: this.props.consultList.message,
          supplements_data: sup_data,
        });
      }
    }
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Supplement Deleted',
      type: 'success',
      icon: 'auto',
    });
    // alert("hi"+this.props.delList1.message)
  };

  onValueduration = (value) => {
    // alert("hi"+value)
    this.setState({
      duration: value,
      selectedIndex2: 'undefined',
    });
  };
  onValueduration1 = (value1) => {
    // alert("hi"+value)
    this.setState({
      duration1: value1,
      selectedIndexa2: 'undefined',
    });
  };
  onValuecustom = (value) => {
    // alert("v"+value)
    this.setState({
      custom: value,
      selectedIndex1: 'undefined',
      time_text: true,
      time_text1: false,
      time_text2: false,
    });
  };
  onValuecustom1 = (value) => {
    // alert("v"+value)
    this.setState({
      custom1: value,
      selectedIndexa1: 'undefined',
      time_texta: true,
      time_texta1: false,
      time_texta2: false,
    });
  };
  setTimeData = (time) => {
    // let mdata =this.state.mdata.split(" ");
    this.setState({
      time: time,
      // am:(moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1]
    });
    // alert(time)
    // alert((moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1])
    // this.getEmergencySlotTime(time,mdata[0])
  };
  setTimeData1 = (time) => {
    // let mdata =this.state.mdata.split(" ");
    this.setState({
      time1: time,
      // am:(moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1]
    });
    // alert(time)
    // alert((moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1])
    // this.getEmergencySlotTime(time,mdata[0])
  };
  setTimeData2 = (time) => {
    // let mdata =this.state.mdata.split(" ");
    this.setState({
      time2: time,
      // am:(moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1]
    });
    // alert(time)
    // alert((moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1])
    // this.getEmergencySlotTime(time,mdata[0])
  };
  setTimeDataa = (time) => {
    // let mdata =this.state.mdata.split(" ");
    this.setState({
      timea: time,
      // am:(moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1]
    });
    // alert(time)
    // alert((moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1])
    // this.getEmergencySlotTime(time,mdata[0])
  };
  setTimeDataa1 = (time) => {
    // let mdata =this.state.mdata.split(" ");
    this.setState({
      timea1: time,
      // am:(moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1]
    });
    // alert(time)
    // alert((moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1])
    // this.getEmergencySlotTime(time,mdata[0])
  };
  setTimeDataa2 = (time) => {
    // let mdata =this.state.mdata.split(" ");
    this.setState({
      timea2: time,
      // am:(moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1]
    });
    // alert(time)
    // alert((moment(time, ["HH:mm"]).format("hh:mm A")).split(" ")[1])
    // this.getEmergencySlotTime(time,mdata[0])
  };
  savePlan = async () => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let obj = JSON.stringify({
      docid: this.props.myprops.docid,
      hlpid: this.props.myprops.hlpid,
      enc_id: this.props.myprops.enc_id,
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
      token: this.props.myprops.token,
    });
    //alert(obj)
    await this.props.savePlanData(obj);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.saveplanresponse.message) {
      this.setState({load1: false});
      this.PlanAlert.showMessage({
        message: 'Success!',
        description: 'Plan saved ',
        type: 'success',
        icon: 'auto',
      });
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
        ? // alert("called2")
          await this.props.getConsultList(myobj2)
        : null;
      if (global.screen == 'dashboard') {
        // alert("called2"+JSON.stringify(this.props.applyList.message.plan))
        if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
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
          this.state.interoffice_notes =
            this.props.consultList.message.plan.show.interoffice_notes;
        }
        this.setState({
          treatment_notes1:
            this.props.consultList.message.plan.show.treatment_notes
              .replace(/<br\s*[\/]?>/gi, '\n')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
              .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
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

  componentDidUpdate = (nextProps) => {
    // console.log("visiblepage="+this.props.myprops.visible+" frompage= "+this.props.myprops.frompage+" length="+this.props.myprops.tabslength)
    // if(this.props.myprops.visible!=this.props.myprops.currentpage&&this.props.myprops.tabslength>=5&&this.props.myprops.tabs[4].title!="Plan"){
    // if(this.props.myprops.frompage==1){
    //   this.setState({visible:false})
    // }
    // else if(this.props.myprops.frompage==2){
    //   this.setState({visible1:false})
    // }
    // else if(this.props.myprops.frompage==3){
    //   this.setState({visible2:false})
    // }
    // else if(this.props.myprops.frompage==4){
    //   this.setState({visible3:false})
    // }
    // else if(this.props.myprops.frompage==5){
    //   this.setState({visible4:false})
    // }
    // else if(this.props.myprops.frompage==6){
    //   this.setState({visible5:false})
    // }
    // //  if(this.props.changetab==-1){
    // //   this.setState({visible:true})
    // //   this.getPlanData();
    // // }
    // else if(this.props.myprops.visible==2){
    //   this.setState({visible1:true})
    //   this.getPlanData();
    // }
    // else if(this.props.myprops.visible==3){
    //   this.setState({visible2:true})
    //   this.getPlanData();
    // }
    // else if(this.props.myprops.visible==4){
    //   this.setState({visible3:true})
    //   this.getPlanData();
    // }
    // else if(this.props.myprops.visible==5){
    //   this.setState({visible4:true})
    //   this.getPlanData();
    // }
    // else if(this.props.myprops.visible==6){
    //   this.setState({visible5:true})
    //   this.getPlanData();
    // }
    // }
  };

  componentDidMount = async () => {
    this.getPlanData();
  };
  // editmed=async(presc)=>{
  // let ob=JSON.stringify({
  //   "docid":global.doctor_id,
  //   "presc_id":presc,
  //   "token": global.token
  // })
  // await this.props.getEditmsList(ob)
  // alert(JSON.stringify(this.props.editmsList.message))
  // }
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
    //   "hlpid": this.props.myprops.hlpid,
    //   "enc_id": this.props.myprops.enc_id,
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
      alert('please enter medicine');
    } else {
      this.setState({visible: false, load1: true});
      let timevalue = '';
      if (this.state.buttons1[Number(this.state.selectedIndex1)] == 'Thrice') {
        timevalue =
          this.state.time + ',' + this.state.time1 + ',' + this.state.time2;
      } else if (
        this.state.buttons1[Number(this.state.selectedIndex1)] == 'Twice'
      ) {
        timevalue = this.state.time + ',' + this.state.time1;
      } else {
        timevalue = this.state.time;
      }
      const docname = await AsyncStorage.getItem('doctorname');
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlpid: this.props.myprops.hlpid,
        enc_id: this.props.myprops.enc_id,
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
          : this.state.duration != ''
          ? this.state.duration + ' ' + this.state.day1
          : ''
        ).replace('false', ''),
        timings: (this.state.selectedIndex1 != 'undefined' &&
        this.state.selectedIndex1 != -1
          ? this.state.buttons1[Number(this.state.selectedIndex1)]
          : this.state.custom + ' ' + this.state.day
        ).replace('false', ''),
        notes: this.state.note,
        before_after: this.state.buttons4[Number(this.state.selectedIndex4)],
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
      //alert(this.state.custom+" "+this.state.day)
      await this.props.getUpdatemsList(ob);
      // alert(JSON.stringify(this.props.editmsList.message))
      let myobj = JSON.stringify({
        docid: this.props.myprops.docid,
        token: this.props.myprops.token,
        consulting: 'consulting',
        hlpid: this.props.myprops.hlpid,
        enc: this.props.myprops.enc_id,
        chief: this.props.myprops.chief,
        uid: this.props.myprops.uid,
        template_id: this.props.myprops.template_id,
        template_name: this.props.myprops.template_name,
        app_type: this.props.myprops.app_type,
        username: this.props.myprops.patientname,
      });
      let myobj2 = JSON.stringify({
        uid: this.props.myprops.uid2,
        enc: this.props.myprops.enc_id,
        docid: this.props.myprops.docid,
        token: this.props.myprops.token,
        hlpid: this.props.myprops.hlpid,
      });
      if (this.props.updatemsList.message == 'updated successfully') {
        // console.log(this.props.addmedList)
        //  alert("Medicine added Successfully")
        this.setState({deletesection: 'Medicine'});
        this.props.myprops.screen == 'dashboard'
          ? // alert("called2")
            await this.props.getApplyList(myobj)
          : this.props.myprops.screen == 'timelene'
          ? // alert("called2")
            await this.props.getConsultList(myobj2)
          : null;
        if (global.screen == 'dashboard') {
          let med_data = this.props.applyList.message.prescriptions.filter(
            (item) => item.medicine_type == 'med',
          );
          // let sup_data=this.props.applyList.message.prescriptions.filter(item=>item.medicine_type=="sup");
          if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
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
        this.setState({load1: false, visible: false});
        this.PlanAlert.showMessage({
          message: 'Success!',
          description: 'Medicine Updated',
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
    //   "hlpid": this.props.myprops.hlpid,
    //   "enc_id": this.props.myprops.enc_id,
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
      alert('please enter medicine');
    } else {
      this.setState({visible1: false, load1: true});
      const docname = await AsyncStorage.getItem('doctorname');
      let timevaluea = '';
      if (
        this.state.buttonsa1[Number(this.state.selectedIndexa1)] == 'Thrice'
      ) {
        timevaluea =
          this.state.timea + ',' + this.state.timea1 + ',' + this.state.timea2;
      } else if (
        this.state.buttonsa1[Number(this.state.selectedIndexa1)] == 'Twice'
      ) {
        timevaluea = this.state.timea + ',' + this.state.timea1;
      } else {
        timevaluea = this.state.timea;
      }
      let ob = JSON.stringify({
        docid: global.doctor_id,
        hlpid: this.props.myprops.hlpid,
        enc_id: this.props.myprops.enc_id,
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
          : this.state.duration1 != ''
          ? this.state.duration1 + ' ' + this.state.day3
          : ''
        ).replace('false', ''),
        timings: (this.state.selectedIndexa1 != 'undefined' &&
        this.state.selectedIndexa1 != -1
          ? this.state.buttonsa1[Number(this.state.selectedIndexa1)]
          : this.state.custom1 + ' ' + this.state.day2
        ).replace('false', ''),
        notes: this.state.note1,
        before_after: this.state.buttons4[Number(this.state.selectedIndexa4)],
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
        docid: this.props.myprops.docid,
        token: this.props.myprops.token,
        consulting: 'consulting',
        hlpid: this.props.myprops.hlpid,
        enc: this.props.myprops.enc_id,
        chief: this.props.myprops.chief,
        uid: this.props.myprops.uid,
        template_id: this.props.myprops.template_id,
        template_name: this.props.myprops.template_name,
        app_type: this.props.myprops.app_type,
        username: this.props.myprops.patientname,
      });
      let myobj2 = JSON.stringify({
        uid: this.props.myprops.uid2,
        enc: this.props.myprops.enc_id,
        docid: this.props.myprops.docid,
        token: this.props.myprops.token,
        hlpid: this.props.myprops.hlpid,
      });
      if (this.props.updatemsList.message == 'updated successfully') {
        // console.log(this.props.addmedList)
        //  alert("Medicine added Successfully")
        // this.setState({load1:false})
        this.setState({deletesection: 'Supplement'});
        // alert("Supplement added Successfully")
        this.props.myprops.screen == 'dashboard'
          ? // alert("called2")
            await this.props.getApplyList(myobj)
          : this.props.myprops.screen == 'timelene'
          ? // alert("called2")
            await this.props.getConsultList(myobj2)
          : null;
        if (global.screen == 'dashboard') {
          let sup_data = this.props.applyList.message.prescriptions.filter(
            (item) => item.medicine_type == 'sup',
          );

          this.state.plan_data = this.props.applyList.message;
          if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
            this.state.supplements_data = sup_data;
          } else {
            let med_data2 = this.props.applyList.message.prescriptions.filter(
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
          let sup_data = this.props.consultList.message.prescriptions.filter(
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
        this.setState({load1: false, visible: false});
        this.PlanAlert.showMessage({
          message: 'Success!',
          description: 'Supplement Updated',
          type: 'success',
          icon: 'auto',
        });
      }
    }
  };
  getPlanData = async () => {
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
      let sup_data = this.props.applyList.message.prescriptions
        ? this.props.applyList.message.prescriptions.filter(
            (item) => item.medicine_type == 'sup',
          )
        : [];
      if (this.props.myprops.check_status.toLowerCase() == 'reconsulting') {
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
        this.state.interoffice_notes =
          this.props.consultList.message.plan.show.interoffice_notes
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t');
      }

      let med_data = this.props.consultList.message.prescriptions.filter(
        (item) => item.medicine_type == 'med',
      );
      let sup_data = this.props.consultList.message.prescriptions.filter(
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
          this.props.consultList.message.plan.show.treatment_notes
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<\s*[\/]?pre\s*[\/]?>/gi, '')
            .replace(/<[^>]+>/g, '\t\t\t\t\t\t\t\t\t\t'),
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

    // console.log("plan2"+JSON.stringify(this.state.plan_data.supplements))
    this.props.ServicesList.message.lab.map((item) => {
      let obj = {
        name: item.service_name,
        id: item.service_master_id,
      };
      this.state.suggestions.push(obj);
    });

    this.props.ServicesList.message.imaging.map((item) => {
      let obj = {
        name: item.service_name,
        id: item.service_master_id,
      };
      this.state.suggestions1.push(obj);
    });
    this.props.ServicesList.message.nursing.map((item) => {
      let obj = {
        name: item.service_name,
        id: item.service_master_id,
      };
      this.state.suggestions2.push(obj);
    });
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
    this.setState({
      tagsSelected1: this.state.tagsSelected1.concat([suggestion1]),
    });
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
    this.setState({
      tagsSelected2: this.state.tagsSelected2.concat([suggestion2]),
    });
  };
  checkSaveLabOrder = async () => {
    if (this.state.tagsSelected.length > 0) {
      if (this.state.plan_data.lab_test.length == 0) {
        this.saveLabOrder(this.state.tagsSelected);
      } else {
        let p1 = this.state.tagsSelected.filter((item) => {
          return this.state.plan_data.lab_test.some(
            (item2) => item2.service_master_id == item.id,
          );
        });
        if (p1.length == 0) {
          this.saveLabOrder(this.state.tagsSelected);
        } else {
          alert('Lab Order Already Exists');
          this.setState({tagsSelected: []});
        }
      }
    } else {
      alert('Please Add Lab Order');
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
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.myprops.hlpid,
      lab_name: lab_name,
      enc: this.props.myprops.enc_id,
      lab_val: on,
      td_date: moment().format('DD-MMM-YYYY'),
      username: docname,
      token: global.token,
    });
    console.log(ob);
    await this.props.saveLabOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (this.props.saveLabResponse.message == 1) {
      // alert("Lab Order saved Successfully")
      this.setState({deletesection: 'Lab Order'});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Lab Order Added',
      type: 'success',
      icon: 'auto',
    });
  };
  checkSaveImagingOrder = async () => {
    if (this.state.tagsSelected1.length > 0) {
      if (this.state.plan_data.imaging.length == 0) {
        //alert(JSON.stringify(this.state.tagsSelected1))
        this.saveImagingOrder(this.state.tagsSelected1);
      } else {
        let p1 = this.state.tagsSelected1.filter((item) => {
          return this.state.plan_data.imaging.some(
            (item2) => item2.service_master_id == item.id,
          );
        });
        if (p1.length == 0) {
          this.saveImagingOrder(this.state.tagsSelected1);
        } else {
          alert('Imaging Order Already Exists');
          this.setState({tagsSelected1: []});
        }
      }
    } else {
      alert('Please Add Imaging Order');
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
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.myprops.hlpid,
      img_type: imaging_name,
      enc: this.props.myprops.enc_id,
      img_val: on,
      td_date: moment().format('DD-MMM-YYYY'),
      username: docname,
      token: global.token,
    });
    // console.log(ob)
    await this.props.saveImagingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.saveImagingResponse.message == 1) {
      // alert("Imaging order added Successfully")
      this.setState({deletesection: 'Imaging Order'});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Imaging Order Added ',
      type: 'success',
      icon: 'auto',
    });
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
          return mylist.some((item2) => item2.service_master_id == item.id);
        });
        if (p1.length == 0) {
          //alert("called3")
          this.saveNursingOrder(this.state.tagsSelected2);
        } else {
          alert('Nursing Order Already Exists');
          this.setState({tagsSelected2: []});
        }
      }
    } else {
      alert('Please Add Imaging Order');
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
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlpid: this.props.myprops.hlpid,
      service_name: nursing_name,
      docname: docname,
      encid: this.props.myprops.enc_id,
      service_value: on,
      td_date: moment().format('DD-MMM-YYYY'),
      // username:this.props.patientList.message[0].Name,
      token: global.token,
    });
    // console.log(ob)
    await this.props.saveNursingOrderData(ob);
    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.saveNursingResponse.message == 'successfully inserted') {
      // alert("Nursing order added Successfully")
      //alert()
      this.setState({deletesection: 'Nursing Order'});
      this.props.myprops.screen == 'dashboard'
        ? await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Nursing Order Added ',
      type: 'success',
      icon: 'auto',
    });
  };
  saveVaccine = async () => {
    this.setState({load1: true});
    // console.log("query2"+this.state.query2)
    let vaccine_brandname = '';

    vaccine_brandname =
      this.state.vaccine_id +
      ',' +
      this.state.query2.split('(')[0] +
      ',' +
      this.state.service_master_id;
    const docname = await AsyncStorage.getItem('doctorname');

    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlpid: this.props.myprops.hlpid,
      vac_bnd_name: vaccine_brandname,
      encid: this.props.myprops.enc_id,
      username: docname,
      token: global.token,
    });
    console.log('data=' + ob);
    await this.props.saveVaccineOrderData(ob);
    // alert("Vaccine added Successfully")
    this.setState({deletesection: 'Vaccine'});
    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.saveVaccineResponse.message == 'successfully inserted') {
      // console.log(this.props.saveVaccineResponse.message=="successfully inserted")
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.props.changeTabData(-1);
    this.closeOverlay5();
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Vaccine Added',
      type: 'success',
      icon: 'auto',
    });
  };
  deleteVaccineOrder = async (vaccine_id, version_status) => {
    this.setState({load1: true});
    let ob = JSON.stringify({
      docid: global.doctor_id,
      id: vaccine_id,
      encid: this.props.myprops.enc_id,
      token: global.token,
      version_status: version_status,
    });

    await this.props.deleteVaccineOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.deleteVaccineResponse.message == 'successfully deleted') {
      // alert("Vaccine Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.setState({load1: false});
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Vaccine Deleted ',
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
      hlp_id: this.props.myprops.hlpid,
      enc_id: this.props.myprops.enc_id,
      token: global.token,
    });
    // alert(ob)

    await this.props.deleteTempLabOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (this.props.deleteTempLabResponse.message == 'Successfully Deleted') {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Lab Order Deleted ',
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
      encounter_id: this.props.myprops.enc_id,
      token: global.token,
      version_status: version_status,
    });
    // alert(ob)

    await this.props.deleteLabOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.deleteLabResponse.message == true) {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Lab Order Deleted ',
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
      hlp_id: this.props.myprops.hlpid,
      enc_id: this.props.myprops.enc_id,
      token: global.token,
    });
    // alert(ob)

    await this.props.deleteTempImagingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.deleteTempImgResponse.message == 'Successfully Deleted') {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Imaging Order Deleted ',
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
      encid: this.props.myprops.enc_id,
      token: global.token,
      version_status: version_status,
    });
    //alert(ob)
    await this.props.deleteImagingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.deleteImagingResponse.message == 'successfully deleted') {
      this.setState({load1: false, deleteid: ''});
      this.PlanAlert.showMessage({
        message: 'Success!',
        description: 'Imaging Order Deleted ',
        type: 'success',
        icon: 'auto',
      });
      console.log('Imaging Order Deleted Successfully');
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
      hlp_id: this.props.myprops.hlpid,
      enc_id: this.props.myprops.enc_id,
      token: global.token,
    });
    // alert(ob)

    await this.props.deleteTempNursingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (
      this.props.deleteTempNursingResponse.message == 'Successfully Deleted'
    ) {
      // alert("Lab Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Nursing Order Deleted ',
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
      encid: this.props.myprops.enc_id,
      token: global.token,
      version_status: version_status,
    });
    // alert(ob)
    await this.props.deleteNursingOrderData(ob);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.deleteNursingResponse.message == 'successfully deleted') {
      // alert("Nursing Order Deleted Successfully")
      this.setState({deleteid: ''});
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Nursing Order Deleted ',
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
      hlp_id: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      img_id: id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatImagingOrderData(ob);
    alert(this.props.RepeatingImagingResponse);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.RepeatingImagingResponse.message) {
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    this.props.changeTabData(-1);
  };
  repeatLabOrder = async (id) => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      lab_id: id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatLabOrderData(ob);
    alert(this.props.RepeatingLabResponse);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });

    if (this.props.RepeatingLabResponse) {
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
      hlp_id: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatAllLabOrderData(ob);
    alert(this.props.RepeatingAllLabResponse);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (this.props.RepeatingAllLabResponse) {
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    // alert("v"+value)
    this.setState({
      dose: value,
      selectedIndex: 'undefined',
    });
  };
  onValueDose1 = (value) => {
    // alert("v"+value)
    this.setState({
      dose1: value,
      selectedIndexa: 'undefined',
    });
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
      encounter_show: this.props.myprops.enc_id,
      expiry_date: moment(this.state.expiry_date).format('YYYY-MM-DD'),
      vaccine_id: id,
      hlpid: this.props.myprops.hlpid,
    });
    console.log(obj);
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
    });
    this.PlanAlert.showMessage({
      message: 'Success!',
      description: 'Vaccine Updated',
      type: 'success',
      icon: 'auto',
    });
  };

  repeatAllImagingOrder = async () => {
    this.setState({load1: true});
    const docname = await AsyncStorage.getItem('doctorname');
    let ob = JSON.stringify({
      docid: global.doctor_id,
      hlp_id: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      username: docname,
      token: global.token,
    });
    // alert(ob)
    await this.props.repeatAllImagingOrderData(ob);
    alert(this.props.RepeatingAllImagingResponse);

    let myobj = JSON.stringify({
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      consulting: this.props.myprops.check_status,
      hlpid: this.props.myprops.hlpid,
      enc: this.props.myprops.enc_id,
      chief: this.props.myprops.chief,
      uid: this.props.myprops.uid,
      template_id: this.props.myprops.template_id,
      template_name: this.props.myprops.template_name,
      app_type: this.props.myprops.app_type,
      username: this.props.myprops.patientname,
    });
    let myobj2 = JSON.stringify({
      uid: this.props.myprops.uid2,
      enc: this.props.myprops.enc_id,
      docid: this.props.myprops.docid,
      token: this.props.myprops.token,
      hlpid: this.props.myprops.hlpid,
    });
    if (this.props.RepeatingAllImagingResponse) {
      this.props.myprops.screen == 'dashboard'
        ? // alert("called2")
          await this.props.getApplyList(myobj)
        : this.props.myprops.screen == 'timelene'
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
    const buttons1 = ['4H', '6H', '8H', '12H', 'Once', 'Twice', 'Thrice'];
    const buttons2 = ['1', '2', '3', '4', '5', '6'];
    const buttons4 = ['Before Food', 'After Food', 'Empty Stomach', 'Bed Time'];
    const buttons3 = ['S.O.S'];

    const {query1} = this.state;
    const supplements = this.findSupplement(query1);

    const comp1 = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    const buttonsa = ['1/2', '1', '2', '3'];
    const buttonsa1 = ['4H', '6H', '8H', '12H', 'Once', 'Twice', 'Thrice'];
    const buttonsa2 = ['1', '2', '3', '4', '5', '6'];
    const buttonsa4 = [
      'Before Food',
      'After Food',
      'Empty Stomach',
      'Bed Time',
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
    if (this.props.changetab == 0) {
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
                {this.state.lb} Medicine
              </Text>
              {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
              <ScrollView
                style={{marginTop: 15}}
                keyboardShouldPersistTaps={'handled'}>
                {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
                <View>
                  <Row style={{marginHorizontal: 5, marginTop: 10}}>
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
                        onChangeText={(text) => this.setState({query: text})}
                        placeholder="Search Medicine"
                        renderItem={({item}) => (
                          //you can change the view you want to show in suggestion from here
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                query:
                                  item.drug_name + '(' + item.drug_type + ')',
                                drug_id: item.drug_id,
                                mesure:
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablet' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets and capsules'
                                    ? 'TAB'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'capsule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'capsules'
                                    ? 'CAP'
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
                                    ? 'ML'
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
                                    ? 'MG'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'injection' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'ampule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'vial'
                                    ? 'ML'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'drops' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'drop'
                                    ? 'Drops'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'syringe' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'disposals' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'suture'
                                    ? 'UNIT'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'powder' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'powders'
                                    ? 'GM'
                                    : item.drug_type.toLowerCase().trim() ==
                                      'veinset'
                                    ? 'SET'
                                    : 'Nos.',
                                junk_medicine: true,
                              })
                            }>
                            <Text
                              allowFontScaling={false}
                              style={styles.itemText}>
                              {item.drug_name} | {item.drug_type}
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
                  <Row style={{marginHorizontal: 10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Dose
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col size={50}>
                      <ButtonGroup
                        //  style={{flex:1,flexDirection: 'row',flexWrap: 'wrap',}}
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{height: 40}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                      />
                    </Col>
                    <Col size={20} style={{marginTop: 5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Dose"
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
                    <Col size={30} style={{marginHorizontal: 3}}>
                      <Item picker>
                        <Picker
                          // mode="dropdown"
                          style={{height: 35, marginTop: 10}}
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
                      </Item>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10, marginTop: -10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Timings
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndex1}
                        buttons={buttons1}
                        selectedIndex={selectedIndex1}
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col size={30} style={{marginTop: 5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Custom"
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
                    <Col size={35} style={{marginHorizontal: 3}}>
                      <Item picker>
                        <Picker
                          // mode="dropdown"
                          style={{height: 35, marginTop: 10}}
                          selectedValue={this.state.day}
                          onValueChange={this.onValueChangeday.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item label="Hourly" value="hourly" />
                          <Picker.Item label="A Day" value="day" />
                          <Picker.Item label="A Week" value="weeks" />
                          <Picker.Item label="Monthly" value="monthly" />
                          <Picker.Item label="Yearly" value="yearly" />
                          {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                        </Picker>
                      </Item>
                    </Col>

                    <Col size={35}>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndex3}
                        buttons={buttons3}
                        selectedIndex={selectedIndex3}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 10,
                          width: 110,
                        }}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col size={30}>
                      {this.state.time_text ||
                      this.state.time_text1 ||
                      this.state.time_text2 ? (
                        <DatePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          date={this.state.time}
                          mode="time"
                          //placeholder="HH:MM"
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          is24Hour={false}
                          // showIcon="false"
                          cancelBtnText="Cancel"
                          onDateChange={(time) => {
                            this.setTimeData(time);
                          }}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {this.state.time_text1 || this.state.time_text2 ? (
                        <DatePicker
                          allowFontScaling={false}
                          style={{alignSelf: 'center', width: 80}}
                          date={this.state.time1}
                          mode="time"
                          // //placeholder="HH:MM"
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          is24Hour={false}
                          // showIcon="false"
                          cancelBtnText="Cancel"
                          onDateChange={(time) => {
                            this.setTimeData1(time);
                          }}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {this.state.time_text2 ? (
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
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          is24Hour={false}
                          // showIcon="false"
                          cancelBtnText="Cancel"
                          onDateChange={(time) => {
                            this.setTimeData2(time);
                          }}
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
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10, marginTop: -8}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Duration
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
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 12}}
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
                        placeholder="Duration"
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
                    <Col size={50}>
                      <Item picker>
                        <Picker
                          // mode="dropdown"
                          style={{height: 35, marginTop: 10}}
                          selectedValue={this.state.day1}
                          onValueChange={this.onValueChangeday1.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item label="Days" value="days" />
                          <Picker.Item label="Weeks" value="week" />
                          <Picker.Item label="Months" value="monthly" />
                          <Picker.Item label="Years" value="yearly" />
                          {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                        </Picker>
                      </Item>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10, marginTop: -10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Note
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
                          borderColor: '#345D7E',
                          borderWidth: 1,
                          borderWidth: 1,
                          marginHorizontal: 10,
                        }}
                        onChangeText={(text) => this.setState({note: text})}
                      />
                    </Col>
                  </Row>
                </View>
              </ScrollView>
              {/* <Button
    title="Go back"
    onPress={() => this.closeOverlay()}
    containerStyle={{alignSelf:'center'}}
    buttonStyle={{backgroundColor:APP_PRIMARY_COLOR, marginTop:20}}
    /> */}
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {this.state.ban3 && (
                  <Button
                    onPress={async () => {
                      this.add_medicine2();
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
                      Save
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
              {this.state.lb1} Supplement
            </Text>
            {/* <Image source={require('../assets/img/no-record.png')} style={{alignSelf:'center'}} /> */}
            <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'handled'}>
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
                  <Row style={{marginHorizontal: 5, marginTop: 10}}>
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
                        onChangeText={(text) => this.setState({query1: text})}
                        placeholder="Enter Supplement"
                        renderItem={({item}) => (
                          //you can change the view you want to show in suggestion from here
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                query1:
                                  item.drug_name + ' (' + item.drug_type + ')',
                                drug_id1: item.drug_id,
                                mesure1:
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablet' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets' ||
                                  item.drug_type.toLowerCase().trim() ==
                                    'tablets and capsules'
                                    ? 'TAB'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'capsule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'capsules'
                                    ? 'CAP'
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
                                    ? 'ML'
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
                                    ? 'MG'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'injection' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'ampule' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'vial'
                                    ? 'ML'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'drops' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'drop' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'eye/ear drops'
                                    ? 'Drops'
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
                                    ? 'UNIT'
                                    : item.drug_type.toLowerCase().trim() ==
                                        'powder' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'powders' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'churna' ||
                                      item.drug_type.toLowerCase().trim() ==
                                        'bhasma'
                                    ? 'GM'
                                    : item.drug_type.toLowerCase().trim() ==
                                      'veinset'
                                    ? 'SET'
                                    : 'Nos.',

                                junk_medicine1: true,
                              })
                            }>
                            <Text
                              allowFontScaling={false}
                              style={styles.itemText}>
                              {item.drug_name} | {item.drug_type}
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
                  <Row style={{marginHorizontal: 3}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Dose
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
                      />
                    </Col>
                    <Col size={20} style={{marginTop: 5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Dose"
                        placeholderTextColor={'#2D323C'}
                        returnKeyType="done"
                        autoCapitalize="none"
                        value={this.state.dose1}
                        keyboardType="numeric"
                        style={styles.input}
                        // onChangeText={(text)=>this.setState({custom:text})}
                        onChangeText={this.onValueDose1.bind(this)}
                      />
                    </Col>
                    <Col size={30} style={{marginHorizontal: 3}}>
                      <Item picker>
                        <Picker
                          // mode="dropdown"
                          style={{height: 35, marginTop: 10}}
                          selectedValue={this.state.mesure1}
                          onValueChange={this.onValueChangedose1.bind(this)}
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
                      </Item>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Timings
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
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col size={30} style={{marginTop: 5}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Custom"
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

                    <Col size={35} style={{marginHorizontal: 3}}>
                      <Item picker>
                        <Picker
                          // mode="dropdown"
                          style={{height: 35, marginTop: 10}}
                          selectedValue={this.state.day2}
                          onValueChange={this.onValueChangeday2.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item label="Hourly" value="hourly" />
                          <Picker.Item label="A Day" value="day" />
                          <Picker.Item label="A Week" value="week" />
                          <Picker.Item label="Monthly" value="monthly" />
                          <Picker.Item label="Yearly" value="yearly" />
                          {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                        </Picker>
                      </Item>
                    </Col>
                    <Col size={35}>
                      <ButtonGroup
                        // buttonStyle={{flex: 1,flexDirection: 'row',flexWrap: 'wrap'}}
                        onPress={this.updateIndexa3}
                        buttons={buttonsa3}
                        selectedIndex={selectedIndexa3}
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col size={30}>
                      {this.state.time_texta ||
                      this.state.time_texta1 ||
                      this.state.time_texta2 ? (
                        <DatePicker
                          allowFontScaling={false}
                          style={{
                            alignSelf: 'flex-start',
                            width: 80,
                            marginHorizontal: 10,
                          }}
                          date={this.state.timea}
                          mode="time"
                          //placeholder="HH:MM"
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          is24Hour={false}
                          // showIcon="false"
                          cancelBtnText="Cancel"
                          onDateChange={(time) => {
                            this.setTimeDataa(time);
                          }}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {this.state.time_texta1 || this.state.time_texta2 ? (
                        <DatePicker
                          allowFontScaling={false}
                          style={{alignSelf: 'center', width: 80}}
                          date={this.state.timea1}
                          mode="time"
                          //placeholder="HH:MM"
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          is24Hour={false}
                          // showIcon="false"
                          cancelBtnText="Cancel"
                          onDateChange={(time) => {
                            this.setTimeDataa1(time);
                          }}
                        />
                      ) : null}
                    </Col>
                    <Col size={30}>
                      {this.state.time_texta2 ? (
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
                          showIcon={false}
                          format="hh:mm A"
                          confirmBtnText="Confirm"
                          is24Hour={false}
                          // showIcon="false"
                          cancelBtnText="Cancel"
                          onDateChange={(time) => {
                            this.setTimeDataa2(time);
                          }}
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
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 10}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Duration
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
                        containerStyle={{height: 40, marginHorizontal: 10}}
                        selectedButtonStyle={{
                          backgroundColor: APP_PRIMARY_COLOR,
                        }}
                        textStyle={{fontSize: 12}}
                        // size={3}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col size={50} style={{marginTop: 10, marginHorizontal: 3}}>
                      <TextInput
                        allowFontScaling={false}
                        placeholder="Duration"
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
                    <Col size={50} style={{marginHorizontal: 10}}>
                      <Item picker>
                        <Picker
                          // mode="dropdown"
                          style={{height: 35, marginTop: 10}}
                          selectedValue={this.state.day3}
                          onValueChange={this.onValueChangeday3.bind(this)}
                          // onValueChange={(value) => {this.setState({hospital_branch: value})}
                        >
                          <Picker.Item label="Days" value="days" />
                          <Picker.Item label="Weeks" value="week" />
                          <Picker.Item label="Months" value="monthly" />
                          <Picker.Item label="Years" value="yearly" />
                          {/* {this.state.search_branch?(
    this.state.search_branch.pract_details.map((item) =>(
    <Picker.Item label={item.branch_name} value={item.branch_id} />
    ))):null
    } */}
                        </Picker>
                      </Item>
                    </Col>
                  </Row>
                  <Row style={{marginHorizontal: 10}}>
                    <Col>
                      <Text
                        allowFontScaling={false}
                        style={{fontWeight: 'bold'}}>
                        Note
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
                          borderColor: '#345D7E',
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
            </ScrollView>
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
                    Save
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
            alignItems: 'center',
          }}>
          <Overlay
            height={300}
            width={380}
            onBackdropPress={() => {
              this.closeOverlay2();
              this.props.changeTabData(-1);
            }}>
            <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'handled'}>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
              <View>
                {/* <Button onPress={() => this.closeOverlay2()} style={{backgroundColor:APP_PRIMARY_COLOR,alignSelf:'flex-end', justifyContent:"center", height:40,width:40,margin:10}}>
    <Text allowFontScaling={false}style={{color:"white",fontSize:10,alignItems:"center"}}><Icon type="FontAwesome" name="times" style={{fontSize:30,marginTop:30,color:"white"}} /></Text>
    </Button>  */}

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
                      Add Lab Order
                    </Text>

                    {/* <View style={{backgroundColor: '#DCDCDC', height: 1, marginVertical: 10}} /> */}
                  </Col>
                  {/* <Col size={50} style={{alignItems:"flex-end"}}>
          <Button style={{backgroundColor:APP_PRIMARY_COLOR,height:34,width:90,alignSelf:"flex-end"}} onPress={()=>this.setState({visible6:true})}>
            <Text allowFontScaling={false}style={{color:"white",fontSize:10,marginLeft:20,width:90}}>Past Orders</Text>
          </Button>
          </Col> */}
                  {/* <Col size={50} style={{alignItems:"flex-end",marginTop:45}}>
          <Button style={{backgroundColor:APP_PRIMARY_COLOR,height:35,width:40,marginRight:10}} onPress={()=>this.saveLabOrder()}>
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
                      alignSelf: 'center',
                      marginTop: 20,
                      marginLeft: 10,
                      marginBottom: 20,
                    }}>
                    <AutoTags
                      inputContainerStyle={styles.inputContainerStyle}
                      containerStyle={{minWidth: 500, maxWidth: 800}}
                      suggestions={this.state.suggestions}
                      tagsSelected={this.state.tagsSelected}
                      placeholder="Add Lab Orders"
                      handleAddition={this.handleAddition}
                      handleDelete={this.handleDelete}
                    />
                  </Col>
                  <Col size={20}></Col>
                </Row>
              </View>
            </ScrollView>
            {/* <View style={{flexDirection:"row",alignSelf:"center"}}>
             <Button style={{height:40,width:150,backgroundColor:APP_PRIMARY_COLOR,marginTop:25,alignSelf:"center",justifyContent:"center"}} onPress={()=>this.saveLabOrder()}>
  <Text allowFontScaling={false}style={{color:"white",fontSize:18}}>Save</Text>
  </Button>
  <Button style={{marginLeft:10,height:40,width:120,backgroundColor:APP_PRIMARY_COLOR,marginTop:25,alignSelf:"center",justifyContent:"center"}} onPress={()=>this.closeOverlay2()}>
  <Text allowFontScaling={false}style={{color:"white",fontSize:18}}>Cancel</Text>
  </Button>
  </View> */}
            {/* <Button onPress={() => this.closeOverlay2()} style={{backgroundColor:APP_PRIMARY_COLOR,justifyContent: 'center',height:40,width:60,marginLeft:140}}>
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
                  Save
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
                  Cancel
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
            height={600}
            width={380}
            onBackdropPress={() => {
              this.props.changeTabData(-1);
              this.closeOverlay3();
            }}>
            <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'handled'}>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
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
                      Add Imaging Order
                    </Text>
                  </Col>
                  {/* <Col size={50} style={{alignItems:"flex-end"}}>
          <Button style={{backgroundColor:"#F67F7D",height:34,width:90,alignSelf:"flex-end"}} onPress={()=>this.setState({visible6:true})}>
            <Text allowFontScaling={false}style={{color:"white",fontSize:10,marginLeft:20,width:90}}>Past Orders</Text>
          </Button>
          </Col> */}
                  {/* <Col size={50} style={{alignItems:"flex-end",marginTop:45}}>
          <Button style={{backgroundColor:APP_PRIMARY_COLOR,height:35,width:40,marginRight:10}} onPress={()=>this.saveImagingOrder()}>
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
                      containerStyle={{minWidth: 500, maxWidth: 800}}
                      suggestions={this.state.suggestions1}
                      tagsSelected={this.state.tagsSelected1}
                      placeholder="Add Imaging Orders"
                      handleAddition={this.handleAddition1}
                      handleDelete={this.handleDelete1}
                    />
                  </Col>
                  <Col size={20}></Col>
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
                onPress={() => this.checkSaveImagingOrder()}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', fontSize: 18}}>
                  Save
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
                  Cancel
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
            height={300}
            width={380}
            onBackdropPress={() => {
              this.props.changeTabData(-1);
              this.closeOverlay4();
            }}>
            <ScrollView
              style={{marginTop: 15}}
              keyboardShouldPersistTaps={'handled'}>
              {/* {this.props.templateList.message!=undefined&& this.props.templateList.message.map((item) => */}
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
                      Add Nursing Service
                    </Text>
                  </Col>
                  {/* <Col size={50} style={{alignItems:"flex-end",marginTop:45}}>
          <Button style={{backgroundColor:APP_PRIMARY_COLOR,height:34,width:40,marginRight:10}} onPress={()=>this.saveNursingOrder()}>
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
                      containerStyle={{minWidth: 500, maxWidth: 800}}
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
                  Save
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
                  Cancel
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
                      Vaccine
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
                      placeholder="Search Vaccine"
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({
                              query2: item.vaccine_brand_name,
                              vaccine_id: item.vaccine_id,
                              service_master_id: item.service_master_id,
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
                  Save
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
                  Cancel
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
                      containerStyle={{minWidth: 500, maxWidth: 800}}
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
              Are You Sure?
            </Text>
            <Text
              allowFontScaling={false}
              style={{alignSelf: 'center', fontSize: 18}}>
              You Won't be able to revert this!
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
                  Yes,delete it
                </Text>
              </Button>
              <Button
                danger
                style={{height: 40, marginTop: 8, marginLeft: 10, width: 80}}
                onPress={() => this.setState({alertvisible: false})}>
                <Text
                  allowFontScaling={false}
                  style={{color: 'white', marginLeft: 25}}>
                  Back
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
                  Back
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
                  Back
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
              Plan Saved Successfully
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
                  Back
                </Text>
              </Button>
            </View>
          </Overlay>
        </View>
      );
    }
    return (
      //  <Container>
      //    <Content>

      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={{flex: 1}}>
          <FileSelector
            ref={this.fileSelRef}
            onSelection={this.handleSelection}
            selectAny
          />
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
                                    query: item.trade_name,
                                    lb: 'Edit',
                                    ban3: false,
                                    ban4: true,
                                    junk_medicine: true,
                                    junk_medicine1: true,
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
                                      item.timings == '4Hours' ||
                                      item.timings == '6Hours' ||
                                      item.timings == '8Hours' ||
                                      item.timings == '12Hours' ||
                                      item.timings == 'Once' ||
                                      item.timings == 'Twice' ||
                                      item.timings == 'Thrice' ||
                                      item.timings == '4Hours SOS' ||
                                      item.timings == '6Hours SOS' ||
                                      item.timings == '8Hours SOS' ||
                                      item.timings == '12Hours SOS' ||
                                      item.timings == 'Once SOS' ||
                                      item.timings == 'Twice SOS' ||
                                      item.timings == 'Thrice SOS'
                                        ? this.state.buttons1.indexOf(
                                            item.timings.split(' ')[0],
                                          )
                                        : 'undefined',
                                    custom:
                                      item.timings == '4Hours' ||
                                      item.timings == '6Hours' ||
                                      item.timings == '8Hours' ||
                                      item.timings == '12Hours' ||
                                      item.timings == 'Once' ||
                                      item.timings == 'Twice' ||
                                      item.timings == 'Thrice' ||
                                      item.timings == '4Hours SOS' ||
                                      item.timings == '6Hours SOS' ||
                                      item.timings == '8Hours SOS' ||
                                      item.timings == '12Hours SOS' ||
                                      item.timings == 'Once SOS' ||
                                      item.timings == 'Twice SOS' ||
                                      item.timings == 'Thrice SOS'
                                        ? ''
                                        : item.timings.split(' ')[0],
                                    day:
                                      item.timings.split(' ')[1] != undefined &&
                                      item.timings.split(' ')[1] != '' &&
                                      item.timings.split(' ')[1] != 'SOS'
                                        ? item.timings.split(' ')[1]
                                        : 'hourly',
                                    selectedIndex4: this.state.buttons4.indexOf(
                                      item.before_after,
                                    ),
                                    selectedIndex2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttons2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day1:
                                      item.duration === ''
                                        ? item.duration.split(' ')[1] !=
                                          undefined
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : 'Days',
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
                                        ? 'TAB'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? 'CAP'
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
                                        ? 'ML'
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
                                        ? 'MG'
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
                                        ? 'ML'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'drops' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye/ear drops')
                                        ? 'Drops'
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
                                        ? 'UNIT'
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
                                        ? 'GM'
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'veinset'
                                        ? 'SET'
                                        : item.dose_unit || 'Nos.'),
                                    time: item.drug_intake_timing.split(',')[0],
                                    time1:
                                      item.drug_intake_timing.split(',')[1],
                                    time2:
                                      item.drug_intake_timing.split(',')[2],
                                    time_text:
                                      item.timings == 'Once'
                                        ? true
                                        : item.timings == 'Twice'
                                        ? true
                                        : item.timings == 'Thrice'
                                        ? true
                                        : false,
                                    time_text1:
                                      item.timings == 'Twice'
                                        ? true
                                        : item.timings == 'Thrice'
                                        ? true
                                        : false,
                                    time_text2:
                                      item.timings == 'Thrice' ? true : false,
                                    from: 2,
                                    med_id: item.No,
                                  })
                                : this.setState({
                                    query: item.drug_name,
                                    lb: 'Edit',
                                    ban3: false,
                                    ban4: true,
                                    junk_medicine: true,
                                    junk_medicine1: true,
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
                                      item.times == '4Hours' ||
                                      item.times == '6Hours' ||
                                      item.times == '8Hours' ||
                                      item.times == '12Hours' ||
                                      item.times == 'Once' ||
                                      item.times == 'Twice' ||
                                      item.times == 'Thrice' ||
                                      item.times == '4Hours SOS' ||
                                      item.times == '6Hours SOS' ||
                                      item.times == '8Hours SOS' ||
                                      item.times == '12Hours SOS' ||
                                      item.times == 'Once SOS' ||
                                      item.times == 'Twice SOS' ||
                                      item.times == 'Thrice SOS'
                                        ? this.state.buttons1.indexOf(
                                            item.times.split(' ')[0],
                                          )
                                        : 'undefined',
                                    custom:
                                      item.times == '4Hours' ||
                                      item.times == '6Hours' ||
                                      item.times == '8Hours' ||
                                      item.times == '12Hours' ||
                                      item.times == 'Once' ||
                                      item.times == 'Twice' ||
                                      item.times == 'Thrice' ||
                                      item.times == '4Hours SOS' ||
                                      item.times == '6Hours SOS' ||
                                      item.times == '8Hours SOS' ||
                                      item.times == '12Hours SOS' ||
                                      item.times == 'Once SOS' ||
                                      item.times == 'Twice SOS' ||
                                      item.times == 'Thrice SOS'
                                        ? ''
                                        : item.times.split(' ')[0],
                                    day:
                                      item.times.split(' ')[1] != undefined &&
                                      item.times.split(' ')[1] != '' &&
                                      item.times.split(' ')[1] != 'SOS'
                                        ? item.times.split(' ')[1]
                                        : 'hourly',
                                    selectedIndex4: this.state.buttons4.indexOf(
                                      item.drug_when,
                                    ),
                                    selectedIndex2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttons2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day1:
                                      item.duration === ''
                                        ? item.duration.split(' ')[1] !=
                                          undefined
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : 'Days',
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
                                        ? 'TAB'
                                        : item.drug_type.toLowerCase().trim() ==
                                            'capsule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'capsules'
                                        ? 'CAP'
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
                                        ? 'ML'
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
                                        ? 'MG'
                                        : item.drug_type.toLowerCase().trim() ==
                                            'injection' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'ampule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'vial'
                                        ? 'ML'
                                        : item.drug_type.toLowerCase().trim() ==
                                            'drops' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'drop' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'eye/ear drops'
                                        ? 'Drops'
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
                                        ? 'UNIT'
                                        : item.drug_type.toLowerCase().trim() ==
                                            'powder' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'powders' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'churna' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'bhasma'
                                        ? 'GM'
                                        : item.drug_type.toLowerCase().trim() ==
                                          'veinset'
                                        ? 'SET'
                                        : item.dose_unit || 'Nos.',
                                    time: item.drug_intake_timing.split(',')[0],
                                    time1:
                                      item.drug_intake_timing.split(',')[1],
                                    time2:
                                      item.drug_intake_timing.split(',')[2],
                                    time_text:
                                      item.times == 'Once'
                                        ? true
                                        : item.times == 'Twice'
                                        ? true
                                        : item.times == 'Thrice'
                                        ? true
                                        : false,
                                    time_text1:
                                      item.times == 'Twice'
                                        ? true
                                        : item.times == 'Thrice'
                                        ? true
                                        : false,
                                    time_text2:
                                      item.times == 'Thrice' ? true : false,
                                    from: item.from == 'json' ? 2 : 1,
                                    med_id: item.prescription_id,
                                  });
                              // alert( item.duration.charAt(0).toUpperCase() + item.duration.slice(1))
                              //alert(item.drug_type.trim()=="Tablet")
                              //  this.updateIndex1(this.state.selectedIndex1)
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
                                  source={require('../../../assets/images/medicine.png')}
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
                                    'tablet)'
                                      ? 'TAB.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'capsule)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'capsules'
                                      ? 'CAP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'syrup)'
                                      ? 'SYP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Drops)'
                                      ? 'DRP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Injection)'
                                      ? 'INJ.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Miscellaneous)'
                                      ? ''
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Cream)'
                                      ? 'CRE.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Tablets and Capsules)'
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
                                      ? 'TAB'
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'capsule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'capsules')
                                      ? 'CAP'
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
                                      ? 'ML, '
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
                                      ? 'MG, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'injection' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'ampule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'vial')
                                      ? 'ML, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'drops' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'drop')
                                      ? 'Drops, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'syringe' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'disposals' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suture')
                                      ? 'UNIT, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'powder' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'powders')
                                      ? 'GM, '
                                      : item.drug_type != null &&
                                        item.drug_type.toLowerCase().trim() ==
                                          'VEINSET'
                                      ? 'SET, '
                                      : item.dose_unit || 'Nos.'
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
                                        ? 'TAB'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? 'CAP'
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
                                        ? 'ML, '
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
                                        ? 'MG, '
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
                                        ? 'ML, '
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'drops' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop')
                                        ? 'Drops, '
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
                                        ? 'UNIT, '
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'powder' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'powders')
                                        ? 'GM, '
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'Miscellaneous'
                                        ? ', '
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'VEINSET'
                                        ? 'SET, '
                                        : item.dose_unit || 'Nos.')}
                                  ,
                                  {item.from == 'json'
                                    ? item.timings
                                    : item.times}{' '}
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
                                    : item.duration.split(' ')[1] == 'week'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Week'
                                      : 'Weeks'
                                    : item.duration.split(' ')[1] == 'monthly'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Month'
                                      : 'Months'
                                    : item.duration.split(' ')[1] == 'yearly' &&
                                      (item.duration.split(' ')[0] == 1
                                        ? 'Year'
                                        : 'Years')}
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
                                    query1: item.trade_name,
                                    lb1: 'Edit',
                                    ban1: false,
                                    ban2: true,
                                    junk_medicine: true,
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
                                      item.timings == '4Hours' ||
                                      item.timings == '6Hours' ||
                                      item.timings == '8Hours' ||
                                      item.timings == '12Hours' ||
                                      item.timings == 'Once' ||
                                      item.timings == 'Twice' ||
                                      item.timings == 'Thrice' ||
                                      item.timings == '4Hours SOS' ||
                                      item.timings == '6Hours SOS' ||
                                      item.timings == '8Hours SOS' ||
                                      item.timings == '12Hours SOS' ||
                                      item.timings == 'Once SOS' ||
                                      item.timings == 'Twice SOS' ||
                                      item.timings == 'Thrice SOS'
                                        ? this.state.buttonsa1.indexOf(
                                            item.timings.split(' ')[0],
                                          )
                                        : 'undefined',
                                    custom1:
                                      item.timings == '4Hours' ||
                                      item.timings == '6Hours' ||
                                      item.timings == '8Hours' ||
                                      item.timings == '12Hours' ||
                                      item.timings == 'Once' ||
                                      item.timings == 'Twice' ||
                                      item.timings == 'Thrice' ||
                                      item.timings == '4Hours SOS' ||
                                      item.timings == '6Hours SOS' ||
                                      item.timings == '8Hours SOS' ||
                                      item.timings == '12Hours SOS' ||
                                      item.timings == 'Once SOS' ||
                                      item.timings == 'Twice SOS' ||
                                      item.timings == 'Thrice SOS'
                                        ? ''
                                        : item.timings.split(' ')[0],
                                    day2:
                                      item.timings.split(' ')[1] != undefined &&
                                      item.timings.split(' ')[1] != '' &&
                                      item.timings.split(' ')[1] != 'SOS'
                                        ? item.timings.split(' ')[1]
                                        : 'hourly',
                                    selectedIndexa4:
                                      this.state.buttonsa4.indexOf(
                                        item.before_after,
                                      ),
                                    selectedIndexa2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttonsa2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration1:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day3:
                                      item.duration === ''
                                        ? item.duration.split(' ')[1] !=
                                          undefined
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : 'Days',
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
                                        ? 'TAB'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? 'CAP'
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
                                        ? 'ML'
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
                                        ? 'MG'
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
                                        ? 'ML'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'drops' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye/ear drops')
                                        ? 'Drops'
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
                                        ? 'UNIT'
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
                                        ? 'GM'
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'veinset'
                                        ? 'SET'
                                        : item.dose_unit || 'Nos.',
                                    timea:
                                      item.drug_intake_timing.split(',')[0],
                                    timea1:
                                      item.drug_intake_timing.split(',')[1],
                                    timea2:
                                      item.drug_intake_timing.split(',')[2],
                                    time_texta:
                                      item.timings == 'Once'
                                        ? true
                                        : item.timings == 'Twice'
                                        ? true
                                        : item.timings == 'Thrice'
                                        ? true
                                        : false,
                                    time_texta1:
                                      item.timings == 'Twice'
                                        ? true
                                        : item.timings == 'Thrice'
                                        ? true
                                        : false,
                                    time_texta2:
                                      item.timings == 'Thrice' ? true : false,
                                    from1: 2,
                                    sup_id: item.No,
                                  })
                                : this.setState({
                                    visible1: true,
                                    query1: item.drug_name,
                                    lb1: 'Edit',
                                    ban1: false,
                                    ban2: true,
                                    junk_medicine: true,
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
                                      item.times == '4Hours' ||
                                      item.times == '6Hours' ||
                                      item.times == '8Hours' ||
                                      item.times == '12Hours' ||
                                      item.times == 'Once' ||
                                      item.times == 'Twice' ||
                                      item.times == 'Thrice' ||
                                      item.times == '4Hours SOS' ||
                                      item.times == '6Hours SOS' ||
                                      item.times == '8Hours SOS' ||
                                      item.times == '12Hours SOS' ||
                                      item.times == 'Once SOS' ||
                                      item.times == 'Twice SOS' ||
                                      item.times == 'Thrice SOS'
                                        ? this.state.buttonsa1.indexOf(
                                            item.times.split(' ')[0],
                                          )
                                        : 'undefined',

                                    custom1:
                                      item.times == '4Hours' ||
                                      item.times == '6Hours' ||
                                      item.times == '8Hours' ||
                                      item.times == '12Hours' ||
                                      item.times == 'Once' ||
                                      item.times == 'Twice' ||
                                      item.times == 'Thrice' ||
                                      item.times == '4Hours SOS' ||
                                      item.times == '6Hours SOS' ||
                                      item.times == '8Hours SOS' ||
                                      item.times == '12Hours SOS' ||
                                      item.times == 'Once SOS' ||
                                      item.times == 'Twice SOS' ||
                                      item.times == 'Thrice SOS'
                                        ? ''
                                        : item.times.split(' ')[0],
                                    day2:
                                      item.times.split(' ')[1] != undefined &&
                                      item.times.split(' ')[1] != '' &&
                                      item.times.split(' ')[1] != 'SOS'
                                        ? item.times.split(' ')[1]
                                        : 'hourly',
                                    selectedIndexa4:
                                      this.state.buttonsa4.indexOf(
                                        item.drug_when,
                                      ),

                                    selectedIndexa2:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? 'undefined'
                                        : this.state.buttonsa2.indexOf(
                                            item.duration.split(' ')[0],
                                          )),
                                    duration1:
                                      item.duration != '' &&
                                      (item.duration.split(' ')[0] >= 7
                                        ? item.duration.split(' ')[0]
                                        : ''),
                                    day3:
                                      item.duration === ''
                                        ? item.duration.split(' ')[1] !=
                                          undefined
                                          ? item.duration.split(' ')[1]
                                          : 'Days'
                                        : 'Days',
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
                                        ? 'TAB'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? 'CAP'
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
                                        ? 'ML'
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
                                        ? 'MG'
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
                                        ? 'ML'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'drops' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'eye/ear drops')
                                        ? 'Drops'
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
                                        ? 'UNIT'
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
                                        ? 'GM'
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'veinset'
                                        ? 'SET'
                                        : item.dose_unit || 'Nos.',

                                    timea:
                                      item.drug_intake_timing.split(',')[0],

                                    timea1:
                                      item.drug_intake_timing.split(',')[1],

                                    timea2:
                                      item.drug_intake_timing.split(',')[2],

                                    time_texta:
                                      item.times == 'Once'
                                        ? true
                                        : item.times == 'Twice'
                                        ? true
                                        : item.times == 'Thrice'
                                        ? true
                                        : false,

                                    time_texta1:
                                      item.times == 'Twice'
                                        ? true
                                        : item.times == 'Thrice'
                                        ? true
                                        : false,

                                    time_texta2:
                                      item.times == 'Thrice' ? true : false,

                                    from1: item.from == 'json' ? 2 : 1,

                                    sup_id: item.prescription_id,
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
                                  source={require('../../../assets/images/supplement.png')}
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
                                    'tablet)'
                                      ? 'TAB.'
                                      : item.drug_type.toLowerCase().trim() ==
                                          'capsule)' ||
                                        item.drug_type.toLowerCase().trim() ==
                                          'capsules'
                                      ? 'CAP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'syrup)'
                                      ? 'SYP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Drops)'
                                      ? 'DRP.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Injection)'
                                      ? 'INJ.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Miscellaneous)'
                                      ? ''
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Cream)'
                                      ? 'CRE.'
                                      : item.drug_type.toLowerCase().trim() ==
                                        'Tablets and Capsules)'
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
                                      ? 'TAB'
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'capsule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'capsules')
                                      ? 'CAP'
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
                                      ? 'ML, '
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
                                      ? 'MG, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'injection' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'ampule' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'vial')
                                      ? 'ML, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'drops' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'drop')
                                      ? 'Drops, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'syringe' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'disposals' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'suture')
                                      ? 'UNIT, '
                                      : item.drug_type != null &&
                                        (item.drug_type.toLowerCase().trim() ==
                                          'powder' ||
                                          item.drug_type.toLowerCase().trim() ==
                                            'powders')
                                      ? 'GM, '
                                      : item.drug_type != null &&
                                        item.drug_type.toLowerCase().trim() ==
                                          'VEINSET'
                                      ? 'SET, '
                                      : item.dose_unit || 'Nos.'
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
                                        ? 'TAB'
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'capsule' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'capsules')
                                        ? 'CAP'
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
                                        ? 'ML, '
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
                                        ? 'MG, '
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
                                        ? 'ML, '
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'drops' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'drop')
                                        ? 'Drops, '
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
                                        ? 'UNIT, '
                                        : item.drug_type != null &&
                                          (item.drug_type
                                            .toLowerCase()
                                            .trim() == 'powder' ||
                                            item.drug_type
                                              .toLowerCase()
                                              .trim() == 'powders')
                                        ? 'GM, '
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'Miscellaneous'
                                        ? ', '
                                        : item.drug_type != null &&
                                          item.drug_type.toLowerCase().trim() ==
                                            'VEINSET'
                                        ? 'SET, '
                                        : item.dose_unit || 'Nos.')}
                                  ,
                                  {item.from == 'json'
                                    ? item.timings
                                    : item.times}{' '}
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
                                    : item.duration.split(' ')[1] == 'week'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Week'
                                      : 'Weeks'
                                    : item.duration.split(' ')[1] == 'monthly'
                                    ? item.duration.split(' ')[0] == 1
                                      ? 'Month'
                                      : 'Months'
                                    : item.duration.split(' ')[1] == 'yearly' &&
                                      (item.duration.split(' ')[0] == 1
                                        ? 'Year'
                                        : 'Years')}
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
                            source={require('../../../assets/images/lab.png')}
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
                                this.props.myprops.rootNavigation.navigate(
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
                              source={require('../../../assets/images/lab.png')}
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
                                  this.props.myprops.rootNavigation.navigate(
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
                            source={require('../../../assets/images/imaging.png')}
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
                              onPress={
                                (() =>
                                  // this.props.navigation.navigate("HomeScreen")
                                  //alert(JSON.stringify(this.props.navigation))
                                  //.dispatch(SwitchActions.jumpTo({ routeName: 'HomeScreen' }))
                                  this.props.myprops,
                                rootNavigation.navigate('ViewPdf', {
                                  link: item.img_pdf_path,
                                }))
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
                              source={require('../../../assets/images/imaging.png')}
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
                                  this.props.myprops.rootNavigation.navigate(
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
                            source={require('../../../assets/images/nursing.png')}
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
                                this.props.myprops.rootNavigation.navigate(
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
                              source={require('../../../assets/images/nursing.png')}
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
                                  this.props.myprops.rootNavigation.navigate(
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
                            source={require('../../../assets/images/vaccination.png')}
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
                                    90,
                                    'days',
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
                                    source={require('../../../assets/images/vaccination.png')}
                                  />
                                </TouchableOpacity>
                              )}
                              <TouchableOpacity
                                style={
                                  item.payment_status == 'Due' && {
                                    marginLeft: 270,
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
                  ) : (
                    <View style={styles.card}>
                      <Row>
                        <Col size={10}>
                          <Thumbnail
                            style={{height: 28, width: 28, marginRight: 15}}
                            square
                            source={require('../../../assets/images/vaccination.png')}
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
                                    90,
                                    'days',
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
                                    source={require('../../../assets/images/vaccination.png')}
                                  />
                                </TouchableOpacity>
                              )}
                              <TouchableOpacity
                                style={
                                  item.payment_status == 'Due' && {
                                    marginLeft: 270,
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
                Treatment Notes
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
                    Comment{' '}
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
                    this.setState({treatment_notes: text});
                    global.treatment_notes = text;
                  }}
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
                    this.setState({treatment_notes: text});
                    global.treatment_notes = text;
                  }}
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
                    this.setState({treatment_notes1: text});
                  }}
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
                Intra Office Notes **not shared to patient
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
                  this.setState({interoffice_notes: text});
                  global.interoffice_notes = text;
                }}
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
                FollowUp Notes
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
                  this.setState({followup_notes: text});
                  global.followup_notes = text;
                }}
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
                  Save
                </Text>
              </Button>
            </Col>
          </Row>
          <Row></Row>
          {/* <Row>FollowUp Notes
           <Col style={{marginHorizontal:8,marginTop:10}}>
           <TextInput allowFontScaling={false
placeholder="Search Medicine"
placeholderTextColor={"#2D323C"}
returnKeyType="done"
autoCapitalize="none"
value={this.state.height}
keyboardType="numeric"
style={styles.input}
// onChangeText={this.onValueheight.bind(this)}
/>
           </Col>
         </Row> */}
          {/* <Row>
          <Col>
  <Text style={{marginLeft:10,fontWeight:"bold",marginTop:5}}>Dose</Text>       
          </Col>
        </Row>
        <Row>
          <Col style={{flex: 1,flexDirection: 'column',flexWrap: 'wrap'}}>
          <RadioGroup radioButtons={this.state.data} onPress={this.onPress} flexDirection='row'/>
          </Col>
        </Row> */}
        </View>
        <FlashMessage position="top" ref={(ref) => (this.PlanAlert = ref)} />
      </ScrollView>
      //    </Content>
      //  </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  timelineList: state.persontimeline.timelineList,

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
  patientList: state.patientList.patientList,
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
})(Plan);
const styles = StyleSheet.create({
  input: {
    // marginTop:15,
    borderColor: '#345D7E',
    borderWidth: 1,
    height: 40,
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
    height: 40,
    width: 300,
    justifyContent: 'center',
    borderColor: 'transparent',
    alignItems: 'center',
    backgroundColor: '#efeaea',
  },
  listData: {fontSize: 12, fontWeight: 'bold', marginTop: 15},
  listData2: {fontSize: 14, fontWeight: 'bold'},
});
