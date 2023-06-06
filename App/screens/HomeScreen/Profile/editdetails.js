import {
  View,
  Header,
  Left,
  Body,
  Title,
  Right,
  Row,
  Col,
  Container,
  Content,
  Toast as NativeBaseToast,
} from 'native-base';
import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  LIST_SUB_TEXT_COLOR,
} from '../../../themes/variable';
import Icon3 from 'react-native-vector-icons/Feather';
import {Avatar} from 'react-native-elements';
// import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import Styles from './ProfileEditscreensStyles.js';
// import {CountryPicker} from 'react-native-country-codes-picker';
// import CountryPicker from 'react-native-country-codes-picker';
import {doctorPutMethod} from '../../../services/DoctorProfileService.js';
import CameraIcon from '../../../assets/images/camera.svg';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from 'react-navigation';
import FileSelector from '../../../components/fileselector/FileSelector.js';
import getBaseUrl, {getApiUrl} from '../../../config/Config';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";

import DefaultDoctorImage from '../../../assets/images/healpha_doctor.png';
import axios from 'axios';
import i18n from '../../../../i18n';
import FileSelectorProfile from '../../../components/fileselector/FileSelectorProfile';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

let path1;
const data_gender = [
  i18n.t('PROFILE.SELECT'),
  i18n.t('PROFILE.MALE'),
  i18n.t('PROFILE.FEMALE'),
  i18n.t('PROFILE.OTHER'),
];
class Editdeatails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNameValidate: false,
      middleNameValidate: false,
      lastNameValidate: false,
      details: {},
      show: false,
      pdfpath: '',
      phoneCode:global.phone_code,
      datePicker:false
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {
    const {details} = this.props?.navigation?.state?.params;
    this.setState({
      details: details,
    });
  }

  init = async () => {
    if (this.state.firstNameValidate || !this.state.details?.first_name) {
      Toast.show(i18n.t('PERSON_REGISTRATION.ENTER_FNAME'), Toast.SHORT);
    } else if (this.state.lastNameValidate || !this.state.details?.last_name) {
      Toast.show(i18n.t('PERSON_REGISTRATION.ENTER_LNAME'), Toast.SHORT);
    } 
    else if (this.state.details.phone_no.length == 0) {
      Toast.show('Please Enter Phone Number', Toast.SHORT);
    }
    else if (this.state.details.phone_code == '+91' && (this.state.details.phone_no.length <10 || this.state.details.phone_no.length  >10)) {
      Toast.show('Phone Number not Less or greater than 10', Toast.SHORT);
    } 
    else if (this.state.details.phone_code == '+94' && (this.state.details.phone_no.length <9 || this.state.details.phone_no.length  >9)) {
      Toast.show('Phone Number not Less or greater than 9', Toast.SHORT);
    } 
    else if (this.state.emailIdValidate || !this.state.details?.email) {
      Toast.show(i18n.t('PERSON_REGISTRATION.EMAIL'), Toast.SHORT);
    } else if (!this.state.details?.dob) {
      Toast.show(i18n.t('PERSON_REGISTRATION.BIRTH'), Toast.SHORT);
    } else if (!this.state.details?.gender) {
      Toast.show(i18n.t('PERSON_REGISTRATION.GEN_DER'), Toast.SHORT);
    } else {
      const {t} = this.props;
      try {
        const doctorId = await AsyncStorage.getItem('doctorid');
        const token = await AsyncStorage.getItem('jwt_token');

        const url = getBaseUrl() + 'v1/doctor/' + doctorId;

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        const payload = {
          first_name: this.state.details?.first_name,
          last_name: this.state.details?.last_name,
          middle_name:
            this.state.details?.middle_name === ''
              ? ' '
              : this.state.details.middle_name,
          dob: this.state.details?.dob,
          email: this.state.details?.email,
          phone_no: this.state.details?.phone_no,
          phone_code: this.state.details?.phone_code,
          gender: this.state.details?.gender,
        };
        const response = await axios.put(url, payload, {headers: headers});

        if (response) {
          this.props.navigation.goBack();
        }

        // RNFetchBlob.fetch(
        //   'PUT',
        //   getBaseUrl() + 'v1/doctor/' + doctorId,
        //   {
        //     // dropbox upload headers
        //     Authorization: 'Bearer' + ' ' + token,
        //     'Dropbox-API-Arg': JSON.stringify({
        //       path: '/img-from-react-native.png',
        //       mode: 'add',
        //       autorename: true,
        //       mute: false,
        //     }),
        //     'Content-Type': 'application/octet-stream',
        //   },
        //   [
        //     {name: 'first_name', data: this.state.details?.first_name},
        //     {name: 'last_name', data: this.state.details?.last_name},
        //     {
        //       name: 'middle_name',
        //       data:
        //         this.state.details?.middle_name === ''
        //           ? ' '
        //           : this.state.details.middle_name,
        //     },
        //     {name: 'dob', data: this.state.details?.dob},
        //     {name: 'email', data: this.state.details?.email},
        //     {name: 'phone_no', data: this.state.details?.phone_no},
        //     {name: 'phone_code', data: this.state.details?.phone_code},
        //   ],
        // )
        //   .then((res) => {
        //     const response = {}; //JSON.parse(res?.data);
        //     this.props.navigation.goBack();
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      } catch (error) {
        NativeBaseToast.show({
          text: t('PROFILE.DATANOTSAVED'),
          type: 'danger',
          duration: 5000,
        });
      }
    }
  };

  validate_name(text, type) {
    const details = this.state.details;
    details[type] = text;
    this.setState({
      details: details,
    });

    let alph = /^[a-zA-Z\s]+$/;
    let email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{1,4})$/;
    if (type === 'first_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            first_name: text,
          });
          this.setState({firstNameValidate: false});
        } else {
          this.setState({
            first_name: '',
          });
          this.setState({firstNameValidate: true});
        }
      } else {
        this.setState({
          first_name: '',
        });
      }
    } else if (type === 'middle_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            middle_name: text,
          });
          this.setState({middleNameValidate: false});
        } else {
          this.setState({
            middle_name: '',
          });
          this.setState({middleNameValidate: true});
        }
      } else {
        this.setState({
          middle_name: '',
        });
      }
    } else if (type === 'last_name') {
      if (text != '') {
        if (alph.test(text)) {
          this.setState({
            last_name: text,
          });
          this.setState({lastNameValidate: false});
        } else {
          this.setState({
            last_name: '',
          });
          this.setState({lastNameValidate: true});
        }
      } else {
        this.setState({
          last_name: '',
        });
      }
    } else if (type === 'email') {
      if (text != '') {
        if (email.test(text)) {
          this.setState({
            email: text,
          });
          this.setState({emailIdValidate: false});
        } else {
          this.setState({
            email: '',
          });
          this.setState({emailIdValidate: true});
        }
      } else {
        this.setState({
          email: '',
        });
      }
    }
  }

  handleInputText = (text, type) => {
    const details = this.state.details;
    details[type] = text;
    this.setState({
      details: details,
    });
  };

  handleDateOfBirth = (event,date) => {
    console.log("event,date",event,date)
    if (event.type === "dismissed") {
      this.setState({ datePicker: false });
      return;
    }else{
      this.setState({ datePicker: false });
      this.handleInputText(date, 'dob');
    }
  };
  handleConfirm = date => {
    console.log("datehandle",date)
    let date_val = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    this.setState({ datePicker: false });
    console.log("datehandle",date_val)
    this.handleInputText(date_val, 'dob');
  };
  hideDatePicker = () => {
    if (this.state.datePicker == true) {
      this.setState({datePicker: false});
    }
  };
  handleGenderSection = (value) => {
    this.handleInputText(value, 'gender');
  };

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
          <Body style={{marginLeft: -30}}>
            <Title style={{color: DEFAULT_WHITE_COLOR}}
              testID="editDetailsTitle"
              accessibilityLabel="editDetailsTitle">
              {t('PROFILE.EDITDETAILS')}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.init()}>
              <Title style={{color: DEFAULT_WHITE_COLOR}}
                testID="saveTitle"
                accessibilityLabel="saveTitle">
                {t('PROFILE.SAVE')}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }

  setImage = () => {
    this.fileSelRef.current.openPicker();
  };

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadImage = async () => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorid');
      const token = await AsyncStorage.getItem('jwt_token');
      const uri =
        Platform.OS === 'ios'
          ? this.state.pdfpath.replace('file:///', '')
          : this.state.pdfpath;
      RNFetchBlob.fetch(
        'PUT',
        getBaseUrl() + 'v1/doctor/' + doctorId,
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
          {
            name: 'profile_image',
            filename: Math.round(Math.random() * 1000000) + 'profile_image.jpg',
            type: 'image.jpg',
            data: RNFetchBlob.wrap(uri),
          },
        ],
      )
        .then((res) => {
          if (res) {
            NativeBaseToast.show({
              text: i18n.t('PROFILE_DRAWER.IMG_UPLOAD'),
              type: 'success',
              duration: 5000,
            });
          }
        })
        .catch((err) => {
          NativeBaseToast.show({
            text: err && err.message,
            type: 'warning',
            duration: 5000,
          });
        });
    } catch (error) {
      NativeBaseToast.show({
        text: (error && error.message) || 'Error while uploading profile image',
        type: 'warning',
        duration: 5000,
      });
    }
  };
  enableDatePicker = (date) => {
    this.setState((prevState) => ({
      datePicker: !prevState.datePicker,
    }));
  };
  uploadFile(file) {
    const path = file.path;
    try {
      ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
        .then(({path, uri}) => {
          this.setState({path, uri});
          path1 = uri;
          if (path1.split('.')[1] == 'pdf') {
            this.setState({pdfpath: path1}, () => this.uploadImage());
          } else {
            this.setState({pdfpath: uri}, () => this.uploadImage());
          }
        })
        .catch((err) => {
          NativeBaseToast.show({
            text: (err && err.message) || 'Error while uploading profile image',
            type: 'warning',
            duration: 5000,
          });
        });
    } catch (error) {
      NativeBaseToast.show({
        text: (error && error.message) || 'Error while uploading profile image',
        type: 'warning',
        duration: 5000,
      });
    }
  }

  ProfileSection() {
    const {t} = this.props;

    return (
      <View>
        <Text style={Styles.Profile}
          testID="profilePictureText"
          accessibilityLabel="profilePictureText">{t('PROFILE.PROFILEPICTURE')}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.state.pdfpath !== '' ? (
            <Image
            testID="profileImage"
            accessibilityLabel="profileImage"
              style={Styles.profileImageView}
              resizeMode="cover"
              source={{
                uri: this.state.pdfpath,
              }}
            />
          ) : (
            <Image
            testID="profileImage"
            accessibilityLabel="profileImage"
              style={Styles.profileImageView}
              resizeMode="cover"
              source={
                this.state.details?.profile_image !== ''
                  ? {
                      uri:
                        getApiUrl() + '/' + this.state.details?.profile_image,
                    }
                  : require('../../../assets/images/user.png')
              }
            />
          )}
        </View>

        <TouchableOpacity onPress={() => this.setImage()}>
          <NavigationEvents onDidFocus={this.setImageData} />
          <FileSelectorProfile
            ref={this.fileSelRef}
            onSelection={this.handleSelection}
            selectAny
          />
          <View
            style={{
              marginLeft: 50,
              top: -10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CameraIcon 
              testID="cameraIcon"
              accessibilityLabel="cameraIcon"/>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  FirstNameSection() {
    const {t} = this.props;
    return (
      <View style={Styles.NameSection}>
        <View style={Styles.FirstNameView}>
          <Text style={Styles.NameText}
            testID="firstNameText"
            accessibilityLabel="firstNameText">{t('PROFILE.FIRSTNAME')}</Text>
        </View>

        <View style={Styles.TextInputView}>
          <TextInput
            testID="firstNameTextInput"
            accessibilityLabel="firstNameTextInput"
            style={Styles.TextInput}
            placeholder={t('PROFILE.FIRSTNAME')}
            theme={{
              colors: {
                primary: LIST_SUB_TEXT_COLOR,
                underlineColor: 'transparent',
                background: 'transparent',
              },
            }}
            defaultValue={this.state.details?.first_name}
            onChangeText={(text) => this.validate_name(text, 'first_name')}
          />
          {this.state.firstNameValidate ? (
            <Text style={Styles.TextError}
            testID="alphabetsError"
            accessibilityLabel="alphabetsError">
              {' '}
              * {t('PROFILE.PLEASE_ENTER_ALPHABETS')}{' '}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  MiddleNameSection() {
    const {t} = this.props;
    return (
      <View style={{marginVertical: 10}}>
        <View style={Styles.FirstNameView}>
          <Text style={Styles.NameText}
            testID="middleNameText"
            accessibilityLabel="middleNameText">{t('PROFILE.MIDDLENAME')}</Text>
        </View>

        <View style={Styles.TextInputView}>
          <TextInput
            testID="middleNameTextInput"
            accessibilityLabel="middleNameTextInput"
            style={Styles.TextInput}
            theme={{
              colors: {
                primary: LIST_SUB_TEXT_COLOR,
                underlineColor: 'transparent',
                background: 'transparent',
              },
            }}
            placeholder={t('PROFILE.MIDDLENAME')}
            defaultValue={this.state.details?.middle_name}
            onChangeText={(text) => this.validate_name(text, 'middle_name')}
          />
          {this.state.middleNameValidate ? (
            <Text style={Styles.TextError}
            testID="alphabetsError"
            accessibilityLabel="alphabetsError">
              {' '}
              * {t('PROFILE.PLEASE_ENTER_ALPHABETS')}{' '}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
  LastNameSection() {
    const {t} = this.props;
    return (
      <View style={{marginVertical: 10}}>
        <View style={Styles.FirstNameView}>
          <Text style={Styles.NameText}
            testID="lastNameText"
            accessibilityLabel="lastNameText">{t('PROFILE.LASTNAME')}</Text>
        </View>

        <View style={Styles.TextInputView}>
          <TextInput
            testID="lastNameTextInput"
            accessibilityLabel="lastNameTextInput"
            style={Styles.TextInput}
            theme={{
              colors: {
                primary: LIST_SUB_TEXT_COLOR,
                underlineColor: 'transparent',
                background: 'transparent',
              },
            }}
            placeholder={t('PROFILE.LASTNAME')}
            defaultValue={this.state.details?.last_name}
            onChangeText={(text) => this.validate_name(text, 'last_name')}
          />
          {this.state.lastNameValidate ? (
            <Text style={Styles.TextError}
            testID="alphabetsError"
            accessibilityLabel="alphabetsError">
              {' '}
              * {t('PROFILE.PLEASE_ENTER_ALPHABETS')}{' '}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  handlePhoneCode = () => {
    this.setState({
      show: true,
    });
  };

  PhoneNumberSection() {
    const {t} = this.props;
    return (
      <View style={{marginVertical: 10}}>
        <View style={Styles.FirstNameView}>
          <Text style={Styles.NameText}
            testID="phoneNumberText"
            accessibilityLabel="phoneNumberText">{t('PROFILE.PHONENUMBER')}</Text>
        </View>

        <View style={Styles.TextInputView}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{
                //width: '10%',
                marginLeft: 5,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
                onPress={() => this.handlePhoneCode()}>
                <Text
                  testID="phoneCodeText"
                  accessibilityLabel="phoneCodeText">{this.state.details.phone_code}</Text>
              </TouchableOpacity>
            </View>
            {this.state.details.phone_code == '+91' ? (
              <TextInput
                style={[Styles.TextInput, {flex: 1}]}
                placeholder={i18n.t('PERSONAL_PROFILE.PHONE_NUM')}
                maxLength={10}
                keyboardType="phone-pad"
                returnKeyType="done"
                //  value= {this.state.details?.phone_code}
                defaultValue={this.state.details?.phone_no}
                onChangeText={(text) => this.handleInputText(text, 'phone_no')}
              />
            ) : (
              <TextInput
                style={[Styles.TextInput, {flex: 1}]}
                placeholder={i18n.t('PERSONAL_PROFILE.PHONE_NUM')}
                maxLength={9}
                keyboardType="phone-pad"
                //  value= {this.state.details?.phone_code}
                defaultValue={this.state.details?.phone_no}
                onChangeText={(text) => this.handleInputText(text, 'phone_no')}
              />
            )}
          </View>
          {this.state.details.phone_code =='+91' ? (
            this.state.details?.phone_no?.length < 10 &&
            this.state.details?.phone_no &&
            !this.state.phoneValidate ? (
              <Text style={Styles.TextError}>
                {' '}
                * {t('PROFILE.PHONE_NUMBER_NOT_LESSTHAN_10_DIGITS')}{' '}
              </Text>
            ) : null
          ) : this.state.details?.phone_no?.length < 9 &&
            this.state.details?.phone_no &&
            !this.state.phoneValidate ? (
            <Text style={Styles.TextError}>
              {' '}
              {t('DOCTOR_REGISTER.PHONE_NO_NINE')}
            </Text>
          ) : null}

          {!this.state.details?.phone_no ? (
            <Text style={Styles.TextError}
            testID="phoneNumberEmptyError"
            accessibilityLabel="phoneNumberEmptyError">
              {' '}
              * {t('PROFILE.PHONE_NUMBER_IS_NOT_EMPTY')}{' '}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  EmailSection() {
    const {t} = this.props;
    return (
      <View style={{marginVertical: 10}}>
        <View style={Styles.FirstNameView}>
          <Text style={Styles.NameText}
            testID="emailText"
            accessibilityLabel="emailText">{t('PROFILE.EMAIL')}</Text>
        </View>

        <View style={Styles.TextInputView}>
          <TextInput
            testID="emailTextInput"
            accessibilityLabel="emailTextInput"
            style={Styles.TextInput}
            theme={{
              colors: {
                primary: LIST_SUB_TEXT_COLOR,
                underlineColor: 'transparent',
                background: 'transparent',
              },
            }}
            placeholder={t('PROFILE.EMAIL')}
            defaultValue={this.state.details?.email}
            onChangeText={(text) => this.validate_name(text, 'email')}
          />
          {this.state.emailIdValidate ? (
            <Text style={Styles.TextError}
            testID="invalidEmailError"
            accessibilityLabel="invalidEmailError">
              {' '}
              *{t('PROFILE.INVALIED_EMAIL_ADDRESS')}{' '}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  DateOfBirthSection() {
    const {t} = this.props;
    return (
      <View style={{marginVertical: 10}}>
        <View style={Styles.FirstNameView}>
          <Text style={Styles.NameText}
            testID="dateOfBirthText"
            accessibilityLabel="dateOfBirthText">{t('PROFILE.DATEOFBIRTH')}</Text>
        </View>

        <View style={Styles.TextInputView}>
        {/* <View> */}
        <TouchableOpacity
              onPress={() =>
                 this.enableDatePicker("select_date")
              }
              >
              <Text style={Styles.dateTex}
              testID="selectedDateOfBirth"
              accessibilityLabel="selectedDateOfBirth">
                {this.state.details?.dob
                // ? new Date(moment(this.state.details?.dob))
                ?moment(this.state.details?.dob).format("YYYY-MM-DD")
                : moment(new Date()).format("YYYY-MM-DD")
                }
                </Text>
            </TouchableOpacity>
          {/* <DatePicker
            testID="dateOfBirthPicker"
            accessibilityLabel="dateOfBirthPicker"
            style={{width: '100%'}}
            date={
              this.state.details?.dob
                ? new Date(moment(this.state.details?.dob))
                : new Date()
            }
            //date={new Date()}
            mode="date"
            placeholder="select date"
            // format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                display: 'none',
              },
              dateInput: {
                ...Styles.dateInputStyles,
              },
            }}
            onDateChange={(date) => this.handleDateOfBirth(date)}
          /> */}    
        </View>
      </View>
    );
  }

  GenderSection() {
    const {t} = this.props;
    if (this.state.details && this.state.details.gender) {
      gender_val = this.state.details.gender;
    } else {
      const {details} = this.props?.navigation?.state?.params;
      gender_val = details.gender;
    }
    return (
      <View>
        <View style={{marginVertical: 10}}>
          <View style={Styles.FirstNameView}>
            <Text style={Styles.NameText}
              testID="genderText"
              accessibilityLabel="genderText">{t('PROFILE.GENDER')}</Text>
          </View>

          <View style={Styles.PickerView}>
          {Platform.OS == 'android' ? (
            <Picker
              testID="genderPicker"
              accessibilityLabel="genderPicker"
              style={{height: 40}}
              selectedValue={
                this.state.details?.gender
                  ? this.state.details?.gender
                  : t('PROFILE.SELECT')
              }
              placeholder={t('PROFILE.SELECT')}
              onValueChange={(itemValue, itemIndex) =>
                this.handleGenderSection(itemValue)
              }>
              <Picker.Item
                testID="selectPickerItem"
                accessibilityLabel="selectPickerItem"
                label={t('PROFILE.SELECT')}
                value=''
              />
              <Picker.Item
                testID="malePickerItem"
                accessibilityLabel="malePickerItem"
                label={t('PROFILE.MALE')}
                value='male'
              />
              <Picker.Item
              testID="femalePickerItem"
              accessibilityLabel="femalePickerItem"
                label={t('PROFILE.FEMALE')}
                value='female'
              />
              <Picker.Item
               testID="otherPickerItem"
               accessibilityLabel="otherPickerItem"
                label={t('PROFILE.OTHER')}
                value='other'
              />
            </Picker>):
            (
              <SelectDropdown
                data={data_gender}
                onSelect={(selectedItem, index) => {
                  this.handleGenderSection(selectedItem);
                }}
                defaultButtonText={gender_val}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={Styles.dropdown4BtnStyle}
                buttonTextStyle={Styles.dropdown4BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <Icon3
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={Styles.dropdown4DropdownStyle}
                rowStyle={Styles.dropdown4RowStyle}
                rowTextStyle={Styles.dropdown4RowTxtStyle}
              />
            )}
          </View>
        </View>

        <View>
          <Row>
            <Col style={Styles.BorderLine}></Col>
          </Row>
        </View>
      </View>
    );
  }

  setSelectedPhoneCode = (item) => {
    let details = this.state.details;
    details.phone_code = item.dial_code;
    this.setState({
      details: details,
      show: false,
    });
  };

  render() {
    if (Object.keys(this.state.details).length > 0) {
      return (
        <Container>
          {this.Header()}
          <Content>
            {this.ProfileSection()}
            {this.FirstNameSection()}
            {this.MiddleNameSection()}
            {this.LastNameSection()}
            {this.PhoneNumberSection()}
            {this.EmailSection()}
            {this.DateOfBirthSection()}
            {this.GenderSection()}
            {this.state.datePicker && 
            (Platform.OD=='android' ?(
              <DateTimePicker
                testID="dateOfBirthPicker"
                accessibilityLabel="dateOfBirthPicker"
                value={this.state.details?.dob
                  ? new Date(moment(this.state.details?.dob))
                  : 'Select Date'}
                display="default"
                mode={"date"}
                onChange={(event, date) => this.handleDateOfBirth(event, date)}
                maximumDate = {new Date()}
              />
            ):(
              <DateTimePickerModal
                defaultDate={new Date()}
                isVisible={this.state.datePicker}
                mode="date"
                date={this.state.details?.dob
                  ? new Date(moment(this.state.details?.dob))
                  : 'Select Date'}
                maximumDate={new Date()}
                locale={'en'}
                dateFormat={'YYYY-MM-DD'}
                timeZoneOffsetInMinutes={undefined}
                onConfirm={date => this.handleConfirm(date)}
                onCancel={() => this.hideDatePicker()}
              />
            ))}  
            {/* <CountryPicker
              show={this.state.show}
              pickerButtonOnPress={(item) => this.setSelectedPhoneCode(item)}
            /> */}
          </Content>
        </Container>
      );
    }
    return (
      <View style={Styles.loaderView}>
        <ActivityIndicator size={'large'} color={APP_PRIMARY_COLOR} />
      </View>
    );
  }
}

export default withTranslation()(Editdeatails);
