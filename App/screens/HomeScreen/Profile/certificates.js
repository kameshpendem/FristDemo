import {
  View,
  Header,
  Left,
  Body,
  Title,
  Right,
  Toast as nativeBaseToast,
  Icon,
} from 'native-base';
import React, {Component} from 'react';
import {Text, TouchableOpacity, ScrollView, Image, Alert} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import Icon3 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Entypo';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import FileSelector from '../../../components/fileselector/FileSelector.js';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import ImageResizer from 'react-native-image-resizer';
import {doctorPutMethod} from '../../../services/DoctorProfileService.js';
import {YearYYYY} from '../CovidMonitoring/Utils/DateTimeUtil';
import getBaseUrl from '../../../config/Config';

const registerCertificationsObject = {
  // registrationNumber: '',
  // yearOfRegistration: '',
  // registrationName: '',
  // certificateImage: null,
};
class Certificates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: [],
      inputData: [],
      pdfpath: '',
      mulImg: [],
      details: {},
      registerObject: registerCertificationsObject,
      registerCertificationsArray: [],
    };

    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }
  componentDidMount() {
    const {registerCertifications} = this.props.navigation?.state?.params;
    this.setState({
      details: registerCertifications,
    });
  }

  addTextInput = () => {
    const registerCertifications = this.state.registerCertificationsArray;
    const obj = this.state.registerObject;
    registerCertifications.push(obj);
    this.setState({
      registerCertificationsArray: registerCertifications,
    });
  };

  //function to remove TextInput dynamically
  removeTextInput = (index) => {
    let inputData = this.state.registerCertificationsArray;
    inputData.splice(index, 1);
    this.setState({
      registerCertificationsArray: inputData,
    });
  };

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file) {
    const path = file.path;
    let checkFile = path.split('.');
    if (checkFile.slice(-1)[0]?.toLowerCase() === 'pdf') {
      let filename;
      filename = global.hlpid + '_Immunization_' + '.pdf';
      // setfileName(filename);
      this.setState({mulImg: path});
      this.setState({pdfpath: path});
    } else {
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
        .then(({path}) => {
          this.setState({path});
          if (path.split('.')[1] == 'pdf') {
            this.setState({pdfpath: path});
          } else {
            const images = this.state.mulImg;
            images.push(path);
            this.setState({mulImg: this.state.mulImg});
            setTimeout(() => {
              this.checkConvert();
            }, 250);
          }
        })
        .catch((err) => {
          console.log('errorrrrr9999', err);
        });
    } catch (error) {
      console.log(
        'The photo picker errored. Check ImagePicker.launchCamera func',
      );
      console.log(error);
    }
  }
  }
  checkConvert = () => {
    Alert.alert(
      'Images added',
      'Do you want to add more?',
      [
        {text: 'Yes', onPress: () => this.setImage()},
        {text: 'No', onPress: () => this.convertPDF()},
      ],
      {cancelable: false},
    );
  };
  convertPDF = async () => {
    //this.refs.loading.show();
    const doctorId = await AsyncStorage.getItem('doctorid');
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: doctorId + 'certificate.pdf',
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 800,
          height: 1056,
        },
        quality: 0.4, // optional compression paramter
      };
      this.setState({mulImg: []});

      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({pdfpath: pdf.filePath});
    } catch (e) {
      console.log(e);
    }
  };
  setImage = () => {
    this.fileSelRef.current.openPicker();
  };

  init2 = async () => {
    const {t} = this.props;
    try {
      const payload = {medical_registration:{
        registration_number: this.state.details?.medical_registartion==null?this.state.details?.registration_number:this.state.details?.medical_registartion?.registration_number,
        year_of_registration: this.state.details?.medical_registartion==null?this.state.details?.year_of_registration:this.state.details?.medical_registartion?.year_of_registration,
        medical_council_name: this.state.details?.medical_registartion==null?this.state.details?.medical_council_name:this.state.details?.medical_registartion?.medical_council_name,
        medical_registration_id: this.state.details?.medical_registartion==null?"":this.state.details?.medical_registartion?.id
      }};
      let Response = await doctorPutMethod(payload);
      if (Response) {
        this.props.navigation.navigate('Profile');
      }
    } catch (error) {
      nativeBaseToast.show({
        text: t('PROFILE.DATANOTSAVED'),
        type: 'danger',
        duration: 5000,
      });
    }
  };

  init = async () => {
    const {t} = this.props;
    const doctorId = await AsyncStorage.getItem('doctorid');
    const token = await AsyncStorage.getItem('jwt_token');
    console.log({
      // dropbox upload headers
      Authorization: 'Bearer' + ' ' + token,
      'Dropbox-API-Arg': JSON.stringify({
        path: '/img-from-react-native.png',
        mode: 'add',
        autorename: true,
        mute: false,
      }),
      'Content-Type': 'application/octet-stream',
    },{
      filename: Math.round(Math.random() * 1000000) + 'certificate.pdf',
      type: 'image/pdf',
      data: RNFetchBlob.wrap(this.state.pdfpath),
    })
    if (this.state.pdfpath) {
      try {
        RNFetchBlob.fetch(
          'PUT',
          getBaseUrl() + 'v1/user/profile-pic/' + doctorId+'/upload/medical_certificate',
          {
            // dropbox upload headers
            Authorization: 'Bearer' + ' ' + token,
            'Dropbox-API-Arg': JSON.stringify({
              path: '/img-from-react-native.png',
              mode: 'add',
              autorename: true,
              mute: false,
            }),
            'Content-Type': 'application/octet-stream',
          },
          [
            //  {name:'registration_number',data: this.state.details?.registration_number},
            //  {name:'year_of_registration',data: this.state.details?.year_of_registration},
            //  {name:'medical_council', data: this.state.details?.medical_council},
            {
              name: 'file',
              filename: Math.round(Math.random() * 1000000) + 'certificate.pdf',
              type: 'image/pdf',
              data: RNFetchBlob.wrap(this.state.pdfpath),
            },
          ],
        )
          .then((res) => {
            this.init2();
            const response = {}; //JSON.parse(res?.data);
            this.props.navigation.goBack();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        nativeBaseToast.show({
          text: t('PROFILE.DATANOTSAVED'),
          type: 'danger',
          duration: 5000,
        });
      }
    } else {
      this.init2();
      this.props.navigation.goBack();
    }
  };

  // init = async () => {
  //   const {t} = this.props;
  //   const doctorId = await AsyncStorage.getItem('doctorid');
  //   const jwt_token = await AsyncStorage.getItem('jwt_token');
  //   try {
  //     RNFetchBlob.fetch(
  //       'PUT',
  //       baseURL + 'v1/doctor/' + doctorId,
  //       {
  //         // dropbox upload headers
  //         Authorization: 'Bearer' + ' ' + jwt_token,
  //         'Dropbox-API-Arg': JSON.stringify({
  //           path: '/img-from-react-native.png',
  //           mode: 'add',
  //           autorename: true,
  //           mute: false,
  //         }),
  //         'Content-Type': 'application/octet-stream',
  //       },
  //       [{name: 'registration_number',data: this.state.details?.registration_number},
  //         {name: 'year_of_registration',data: this.state.details?.year_of_registration},
  //         {name: 'medical_council', data: this.state.details?.medical_council},
  //         {
  //           name: 'doc_certificate',
  //           filename: Math.round(Math.random() * 1000000) + "certificate.pdf",
  //           type: 'image/pdf',
  //           data: RNFetchBlob.wrap(this.state.pdfpath)},
  //       ],
  //     )

  //       .then((res) => {
  //         console.log('response',res);
  //         const response = {}; //JSON.parse(res?.data);
  //         this.props.navigation.goBack();
  //       })
  //       .catch((err) => {
  //         console.log('error', err);
  //       });
  //   } catch (error) {
  //     nativeBaseToast.show({
  //       text: t('PROFILE.DATANOTSAVED'),
  //       type: 'danger',
  //       duration: 5000,
  //     });
  //   }
  // };

  Header() {
    const {t} = this.props;
    return (
      <View>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon3
              testID="goBackIcon"
              accessibilityLabel="goBackIcon"
                name="chevron-left"
                size={30}
                style={{color: DEFAULT_WHITE_COLOR}}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={{color: DEFAULT_WHITE_COLOR}}
             testID="editCertificatesTitle"
             accessibilityLabel="editCertificatesTitle">
              {t('PROFILE.EDITCERTIFICATES')}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.init()}>
              <Title style={{color: DEFAULT_WHITE_COLOR}}
              testID="saveTitle"
              accessibilityLabel="saveTitle">
                {' '}
                {t('PROFILE.SAVE')}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }

  AddCertifictesSection() {
    const {t} = this.props;
    return (
      <Card>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
          }}>
          <View style={{justifyContent: 'flex-start'}}>
            <Text
              style={{
                marginLeft: 16,
                fontSize: 18,
                padding: 5,
                color: APP_PRIMARY_COLOR,
              }}
              testID="addCertificatesText"
              accessibilityLabel="addCertificatesText">
              {t('PROFILE.ADDCERTIFICATES')}
            </Text>
          </View>

          <View style={{justifyContent: 'flex-end', marginRight: 16}}>
            <TouchableOpacity
              onPress={() => this.addTextInput(this.state.textInput.length)}>
              <Icon2
                testID="plusIcon"
                accessibilityLabel="plusIcon"
                name="squared-plus"
                style={{padding: 5, color: APP_PRIMARY_COLOR}}
                size={20}
              />
            </TouchableOpacity>
            <View></View>
          </View>
        </View>
      </Card>
    );
  }

  handleInputText = (text, type) => {
    console.log("text, type",text, type)
    const details = this.state.details;
    if (type === 'year_of_registration') {
      const dobYear = YearYYYY(this.state?.details?.dob);
      if (text.length >= 4) {
        if (parseInt(text) > dobYear) {
          details['medical_registartion']==null
          ?details[type] = parseInt(text)
          :details['medical_registartion'][type] = parseInt(text);
        } else {
          nativeBaseToast.show({
            text: 'Please Enter Year > Date Of Birth',
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } else {
      details['medical_registartion']==null
          ?details[type] = text
          :details['medical_registartion'][type] = text;
    }

    this.setState({
      details: details,
    });
  };

  renderSection() {
    const {t} = this.props;
    return (
      <View style={{margin: 6}}>
        <Card style={{paddingBottom: 10}}>
          <View style={{marginLeft: 16, marginRight: 16, marginTop: 20}}>
            <View>
              <Text style={{fontSize: 14}}
              testID="registrationNumberText"
              accessibilityLabel="registrationNumberText">
                {' '}
                {t('PROFILE.REGISTRATIONNUMBER')}
              </Text>
            </View>
            <View style={{marginLeft: -8, marginTop: 5}}>
              <TextInput
               testID="registrationNumberTextInput"
               accessibilityLabel="registrationNumberTextInput"
                style={{height: 40, backgroundColor: 'white'}}
                placeholder={t('PROFILE.REGISTRATIONNUMBER')}
                maxLength={6}
                defaultValue={this.state.details?.medical_registartion?.registration_number}
                onChangeText={(text) =>
                  this.handleInputText(text, 'registration_number')
                }
              />
            </View>

            <View>
              <Text style={{fontSize: 14, paddingTop: 10}}
                testID="yearOfRegistrationText"
                accessibilityLabel="yearOfRegistrationText">
                {' '}
                {t('PROFILE.YEAROFREGISTRATION')}
              </Text>
            </View>

            <View style={{marginLeft: -8, marginTop: 5}}>
              <TextInput
                testID="yearOfRegistrationTextInput"
                accessibilityLabel="yearOfRegistrationTextInput"
                style={{height: 40, backgroundColor: 'white'}}
                placeholder= {t('PROFILE.YEAROFREGISTRATION')}
                maxLength={4}
                defaultValue={this.state.details?.medical_registartion?.year_of_registration?.toString()}
                keyboardType="phone-pad"
                returnKeyType="done"
                onChangeText={(text) =>
                  this.handleInputText(text, 'year_of_registration')
                }
              />
            </View>

            <View>
              <Text style={{fontSize: 14, paddingTop: 10}}
                testID="registrationOrMedicalCouncilText"
                accessibilityLabel="registrationOrMedicalCouncilText">
                {t('PROFILE.REGISTRATION/MEDICALCOUNCIL')}
              </Text>
            </View>

            <View style={{marginLeft: -8, marginTop: 5}}>
              <TextInput
                testID="registrationOrMedicalCouncilTextInput"
                accessibilityLabel="registrationOrMedicalCouncilTextInput"
                style={{height: 40, backgroundColor: 'white'}}
                placeholder=  {t('PROFILE.REGISTRATION/MEDICALCOUNCIL')}
                defaultValue={this.state.details?.medical_registartion?.medical_council_name}
                onChangeText={(text) =>
                  this.handleInputText(text, 'medical_council_name')
                }
              />
            </View>
          </View>
        </Card>

        {/* Image upload View start */}
        {this.state.pdfpath == '' ? (
          <View style={{marginTop: 10}}>
            <Card>
              <View style={{marginLeft: 16, paddingBottom: 10}}>
                <Text style={{fontSize: 14, padding: 10}}
                  testID="uploadRegisteredCertificatesText"
                  accessibilityLabel="uploadRegisteredCertificatesText">
                  {t('PROFILE.UPLOADREGISTRATIONCERTIFICATES')}
                </Text>

                <View
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: '#EDF5F7',
                    borderRadius: 5,
                  }}>
                  <TouchableOpacity onPress={() => this.setImage()}
                   testID="pdfAttachIcon"
                   accessibilityLabel="pdfAttachIcon">
                    <FileSelector
                      ref={this.fileSelRef}
                      onSelection={this.handleSelection}
                      selectAny
                    />
                    <Image
                      testID="pdfAttachImage"
                      accessibilityLabel="pdfAttachImage"
                      style={{justifyContent: 'center', margin: 12}}
                      source={require('../../../../App/assets/images/attach.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          </View>
        ) : (
          <View style={{marginTop: 10}}>
            <Card>
              <View style={{marginLeft: 16, paddingBottom: 10}}>
                <Text style={{fontSize: 14, padding: 10}}
                  testID="uploadRegisteredCertificatesText"
                  accessibilityLabel="uploadRegisteredCertificatesText">
                  {t('PROFILE.UPLOADREGISTRATIONCERTIFICATES')}
                </Text>

                <View
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: '#EDF5F7',
                    borderRadius: 5,
                  }}>
                  <Icon
                    testID="pdfIcon"
                    accessibilityLabel="pdfIcon"
                    name="file-pdf-o"
                    type="FontAwesome"
                    size={25}
                    style={{
                      justifyContent: 'center',
                      margin: 12,
                      color: APP_PRIMARY_COLOR,
                    }}
                  />
                </View>
              </View>
            </Card>
          </View>
        )}
        {/* Image upload View end */}
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.Header()}
        {this.renderSection()}
      </View>
    );
  }
}

export default withTranslation()(Certificates);
