import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {Icon, Left, Right} from 'native-base';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {
  DeviceEventEmitter,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {Avatar, Card, Divider} from 'react-native-elements';
import Modal from 'react-native-modal';
import {RadioButton} from 'react-native-paper';
import {connect} from 'react-redux';
import {getCountryCode} from '../../../../App/utils/CountryCode';
import call from '../../../assets/images/call.png';
import close from '../../../assets/images/close.png';
import dot from '../../../assets/images/dot.png';
import history from '../../../assets/images/history.png';
import Search from '../../../assets/images/search_patients.png';
import Video from '../../../assets/images/video.png';
import whatsapp from '../../../assets/images/whatsapp.png';
import {getApiUrl} from '../../../config/Config';
import {
  getAppointmnetsLogs,
  getOptions,
  getPatient,
  unavailablePatient,
} from '../../../redux/actions/appointment_action';
import {
  fetchMicroTemplatesuccess,
  getMasterTemplates,
  selectMicroTemplate,
  storeTemplateId,
} from '../../../redux/actions/template_action';
import {TwilioConnection} from '../../../redux/actions/TwilioActions';
import {hp, wp} from '../../../themes/Scale';
import {getColor, routeStatus, theme} from '../../../themes/Theme';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_BLACK_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_INVERSE_COLOR,
  DEFAULT_INVERSE_LIGHT,
  DEFAULT_LIGHT_GREEN_COLOR,
  DEFAULT_RED_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  GUIDELINE_BACKGROUND_COLOR,
  STATUS_OFFLINE,
} from '../../../themes/variable';
import {capitalize} from '../../../utils/capitalizeFirst';
import FooterButton from '../common/FooterButton';
import Header from '../common/Header';
import Loader from '../common/Loader';
import {NativeToast, NativeToastTop} from '../common/Toaster';
import styles from './PatientCardStyles';

function PatientCard({
  t,
  navigation,
  fetchMicroTemplatesuccess,
  TwilioConnection,
  storeTemplateId,
  PatientList,
  getPatient,
  ...props
}) {
  const scrollViewRef = useRef();
  const actionSheetRef = createRef();
  const patientRef = createRef();
  const templateRef = createRef();
  const [searchTemp, setSearchTemp] = useState('');
  const [loading, setloading] = useState(true);
  const {modaltemp} = navigation.state.params;
  const {Template_exist} = navigation.state.params;
  const [openPopUp, setopenPopUp] = useState(false);
  const [modal, setModal] = useState(false || modaltemp);
  const [patientList, setpatientList] = useState({});
  const [templates, settemplates] = useState([]);
  const [appointmentsLog, setappointmentsLog] = useState([]);
  const [logsLoad, setlogsload] = useState(true);
  const [enc_id, setenc_id] = useState('');
  const [doc_id, setdoc_id] = useState('');
  const [healphaId, sethealphaId] = useState('');
  const [appointment_id, setappointment_id] = useState();
  const [options, setoptions] = useState([]);
  const [templateId, settemplateId] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [fullName, setFullName] = useState('');
  const [appointmentStatus, setappointmentStatus] = useState('');
  const [tmp_enc_version, settmp_enc_version] = useState('');
  const [branchId, setBranchId] = useState('');
  const [alone, setalone] = useState('');
  const [nrml_WhatCall, setnrml_WhatCall] = useState(false);
  let isRendered = useRef(false);
  // const entities = new Html5Entities();

  const getMasterTemplatesList = async val => {
    let practice_id = await AsyncStorage.getItem('practice_id');
    isRendered = true;
    await getMasterTemplates({
      practice_id: practice_id,
      branch_id: val.branch_id,
      doctor_id: val.doc_id,
      specialization: '',
      search_text: val?.search_text ? val.search_text : '',
    })
      .then(res => {
        if (isRendered) {
          settemplates(res.templates);
        }
        return null;
      })
      .catch(err => {});
  };
  const searchTemplate = val => {
    setSearchTemp(val);

    if (val.length > 2) {
      getMasterTemplatesList({
        branch_id: branchId,
        doctor_id: doc_id,
        search_text: val,
      });
    } else if (!val.trim()) {
      getMasterTemplatesList({
        branch_id: branchId,
        doctor_id: doc_id,
        search_text: '',
      });
    }
  };
  const selectTemplateExist = async val => {
    const convert_template_id = navigation.state.params.convert_template_id ? navigation.state.params.convert_template_id : '';
    actionSheetRef.current?.setModalVisible(false);
    await selectMicroTemplate(val)
      .then(res => {
        if (res.template) {
          setModal(false);
          navigation.navigate('Consultation', {
            templateId: val,
            edit: navigation.state.params.edit ? true : false,
            enc_id: enc_id,
            convert_template_id:convert_template_id? true:false
          });
          searchTemplate('');
          fetchMicroTemplatesuccess(res.template);
        }
      })
      .catch(res => {
        NativeToast({text: t('BILLING.PAYBILL.FAIL'), type: 'danger'});
      });
  };

  const selectTemplate = async val => {
    actionSheetRef.current?.setModalVisible(false);

    await selectMicroTemplate(val)
      .then(res => {
        setModal(false);
        navigation.navigate('Consultation', {
          templateId: val,
          edit: navigation.state.params.edit ? true : false,
        });
        searchTemplate('');
        fetchMicroTemplatesuccess(res.template);
      })
      .catch(res => {
        NativeToastTop({text: t('BILLING.PAYBILL.FAIL'), type: 'warning'});
      });

    // let enc = await AsyncStorage.getItem('encount_id');
    // let doc = await AsyncStorage.getItem('doc_id');
    // let healpha = await AsyncStorage.getItem('healphaId');

    // let isUpdated = await updateTemplateId({
    //   enc_id: enc,
    //   doc_id: doc,
    //   healphaId: healpha,
    //   id: val,
    // });

    // if (isUpdated) {

    // }
  };

  const getAppointmentLogs = async val => {
    let list = await getOptions();
    if (list?.data?.values) setoptions(list.data.values);

    let data = await getAppointmnetsLogs({
      doc_id: val.doc_id,
      healphaId: val.healphaId,
      userId: val.userId,
    });

    if (data.logs) {
      setappointmentsLog(data.logs.reverse());
      setTimeout(() => {
        setlogsload(false);
      }, 200);
    }
  };

  const heAlphaCall = async () => {
    actionSheetRef.current?.setModalVisible(false);

    if (navigation.state.params.virtualBranch) {
      await AsyncStorage.setItem('virtual_clinic_flag', 'true');
      await AsyncStorage.setItem(
        'virtual_clinic_branch',
        navigation.state.params.virtualBranch,
      );
    } else {
      await AsyncStorage.setItem('virtual_clinic_flag', 'false');
    }
    global.branchId = branchId;
    await AsyncStorage.setItem('twilioEncid', enc_id + '_' + tmp_enc_version);
    await AsyncStorage.setItem('twilioPerHlpid', healphaId);
    await AsyncStorage.setItem('twilioPerName', fullName);
    await AsyncStorage.setItem('selectTemplate', templateId ? 'true' : 'false');
    await AsyncStorage.setItem('consult', templateId ? 'true' : 'false');
    await AsyncStorage.setItem('fromPage', 'homescreen');
    TwilioConnection(true);
  };

  const setAsyncData = async val => {
    if (val.enc_id == undefined) null;
    else await AsyncStorage.setItem('encount_id', val.enc_id);

    await AsyncStorage.setItem('doc_id', val.doc_id);
    await AsyncStorage.setItem('healphaId', val.healphaId);
  };

  const getPatientCard = async val => {
    let doctorId = await AsyncStorage.getItem('doctorid');
    let branchId = await AsyncStorage.getItem('branch_id');
    let variables = {
      doctor_id: doctorId,
      branch_id: branchId,
      id: val.appointmentId,
    };

    global.appointmentId = val.appointmentId;

    await getPatient(variables)
      .then(res => {
        if (res) {
          let data = res.person_appointment_details;
          setappointmentStatus(data?.appointment?.appointment_status);
          setFullName(data?.appointment?.person_details?.full_name);
          setAppointmentType(data?.appointment_type_status);
          settmp_enc_version(data?.version);
          setenc_id(data?.encounter_id);
          setdoc_id(data?.appointment?.doc_id);
          sethealphaId(data?.appointment?.healpha_id);
          setappointment_id(data?.appointment?.id);
          setBranchId(data?.appointment?.branch_id);
          if (data.template_id && data.template_id.toString() !== '0') {
            settemplateId(data.template_id);
            storeTemplateId(data.template_id);
          } else {
            getMasterTemplatesList({
              doc_id: data.appointment.doc_id,
              branch_id: data.appointment.branch_id,
            });
          }
          setpatientList(data);
          setloading(false);
          getAppointmentLogs({
            doc_id: data.appointment.doc_id,
            healphaId: data.appointment.healpha_id,
            userId: data.appointment.id,
          });
          setAsyncData({
            doc_id: data.appointment.doc_id,
            healphaId: data.appointment.healpha_id,
            enc_id: data?.encounter_id,
          });
        }
      })
      .catch(res => {
        NativeToast({text: t('BILLING.PAYBILL.FAIL'), type: 'warning'});
        navigation.goBack();
      });
  };

  useEffect(async () => {
    if (modaltemp == false) {
      setTimeout(() => {
        setopenPopUp(true);
      }, 1000);
    }
    const convert_template_id = navigation.state.params.convert_template_id ? navigation.state.params.convert_template_id :'';
    if (Template_exist == true) {
      selectTemplateExist(convert_template_id);
    }
    DeviceEventEmitter.addListener('getPatientCard', e => {
      getPatientCard(e);
    });

    DeviceEventEmitter.addListener('eventStartConsultation', e => {
      selectTemplateExist(e.templateid);
    });

    DeviceEventEmitter.addListener('selectTemplate', e => {
      selectTemplate(e.templateId);
    });
    const navFocusListener = navigation.addListener('didFocus', () => {
      init();
    });
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      navFocusListener.remove();
      backAction.remove();
    };
  }, []);
  const backAction = () => {
    handleBackButtonClick();
  };
  const init = async () => {
    let appointmentId = navigation.state.params.appointmentId;

    let virtualBranch = navigation.state.params.virtualBranch;
    setalone(global.standalone);
    let nrml_whatsapp_call = await AsyncStorage.getItem('nrml_whatsapp_call');
    global.nrmlCall = nrml_whatsapp_call == 'true' ? true : false;
    setnrml_WhatCall(global.nrmlCall);
    getPatientCard({
      appointmentId: appointmentId,
      virtualBranch: virtualBranch,
    });
  };
  const handleBackButtonClick = async () => {
    global.nrmlCall = false;
    await AsyncStorage.setItem('nrml_whatsapp_call', 'false');
    console.log('handleBackButtonClick');
  };
  const DialCall = async () => {
    let phoneNumber = '';
    console.log('DialCall');

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${patientList?.appointment?.person_details?.phone_no}`;
    } else {
      phoneNumber = `telprompt:${patientList?.appointment?.person_details?.phone_no}`;
    }
    Linking.openURL(phoneNumber);
    console.log('DialCall');
    global.nrmlCall = true;
    await AsyncStorage.setItem('nrml_whatsapp_call', 'true');
    setnrml_WhatCall(true);
  };

  const Patient = () => {
    const [checked, setChecked] = useState('');
    const [otherComment, setotherComment] = useState('');

    const UnavailablePatient = async val => {
      actionSheetRef.current?.setModalVisible(false);
      patientRef.current?.setModalVisible(false);

      if (checked === '' && otherComment === '') {
        NativeToast({
          text: t('PATIENTS.SELECT_OR_WRITE'),
          type: 'warning',
        });
      } else {
        if (checked === 'Other' && !otherComment.trim())
          return NativeToast({
            text: t('PATIENTS.WRITE_SOMETHING'),
            type: 'warning',
          });

        await unavailablePatient({
          enc_id: enc_id,
          doc_id: doc_id,
          healphaId: healphaId,
          type: val.type,
          appointment_id: appointment_id,
          comment: checked === 'Other' ? otherComment : checked,
          cancelled: val.is_appointment_cancelled,
        })
          .then(res => {
            if (res) {
              DeviceEventEmitter.emit('updateHomeScreen', {date: ''});
              setTimeout(() => {
                NativeToast({
                  text: 'Comment Saved',
                  type: 'success',
                  onclose: navigation.goBack(),
                });
              }, 200);
            }
          })
          .catch(err => {
            NativeToast({
              text: err.message, //t("BILLING.PAYBILL.FAIL"),
              type: 'warning',
            });
          });
      }
    };

    if (loading) {
      return null;
    }
    return (
      <View style={{padding: 10}}>
        <View style={styles.image}>
          <Left>
            <Text
              testID="writeMessageText"
              accessibilityLabel="writeMessageText">
              {t('COMMON.WRITEMESSAGE')}
            </Text>
          </Left>
          <Right>
            <TouchableOpacity
              onPress={() => patientRef.current?.setModalVisible(false)}>
              <Image
                source={close}
                style={styles.close}
                testID="closeImage"
                accessibilityLabel="closeImage"
              />
            </TouchableOpacity>
          </Right>
        </View>

        {options &&
          options.map((option, index) => {
            return (
              <View key={index}>
                <View style={styles.direction}>
                  <RadioButton
                    testID="radioButton"
                    accessibilityLabel="radioButton"
                    value={option.label}
                    status={checked === option.label ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(option.label)}
                  />
                  <Text
                    style={styles.alignment}
                    testID={option.label + 'text'}
                    accessibilityLabel={option.label + 'text'}>
                    {option.label}
                  </Text>
                </View>
                {option.label === 'Other' ? (
                  <View
                    style={{
                      borderColor: DEFAULT_INVERSE_COLOR,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      marginLeft: 30,
                      marginRight: 30,
                    }}>
                    <TextInput
                      testID="writeStatusTextInput"
                      accessibilityLabel="writeStatusTextInput"
                      multiline={true}
                      numberOfLines={2}
                      value={otherComment}
                      onFocus={() => setChecked('Other')}
                      onChangeText={val => setotherComment(val)}
                      placeholder={t('PATIENTS.WRITESTATUS_PLACEHOLDER')}
                    />
                  </View>
                ) : null}
              </View>
            );
          })}

        <TouchableOpacity
          style={{
            backgroundColor: APP_PRIMARY_COLOR,
            padding: 12,
            borderRadius: 5,
            marginVertical: 10,
          }}
          onPress={() => {
            UnavailablePatient({
              type: 'patient_unavailable',
              is_appointment_cancelled: false,
            });
          }}
          testID="sendAndBackTouch"
          accessibilityLabel="sendAndBackTouch">
          <Text
            style={{
              color: DEFAULT_WHITE_COLOR,
              textAlign: 'center',
              fontFamily: 'NunitoSans-Bold',
              fontSize: 18,
            }}
            testID="sendAndBackText"
            accessibilityLabel="sendAndBackText">
            {t('PATIENTS.SEND_AND_BACK')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            UnavailablePatient({
              type: 'patient_unavailable',
              is_appointment_cancelled: true,
            });
          }}
          style={{
            backgroundColor: GUIDELINE_BACKGROUND_COLOR,
            padding: 12,
            borderRadius: 5,
            marginVertical: 10,
          }}
          testID="sendAndCancelTouch"
          accessibilityLabel="sendAndCancelTouch">
          <Text
            style={{
              color: DEFAULT_RED_COLOR,
              textAlign: 'center',
              fontFamily: 'NunitoSans-Bold',
              fontSize: 18,
            }}
            testID="sendAndCancelText"
            accessibilityLabel="sendAndCancelText">
            {t('PATIENTS.SEND_AND_CANCEL')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Action = () => {
    if (loading) {
      return null;
    }
    return (
      <View
        style={{
          padding: 5,
          backgroundColor: openPopUp == true && DEFAULT_WHITE_COLOR,
        }}>
        <View style={styles.image}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
              fontSize: 16,
            }}
            testID="connectWithText"
            accessibilityLabel="connectWithText">
            {t('COMMON.CONNECT_WITH')}
          </Text>
          <Right style={{marginRight: wp(10)}}>
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current?.setModalVisible(false),
                  setopenPopUp(false);
              }}
              testID="closeTouch"
              accessibilityLabel="closeTouch">
              <Image
                source={close}
                style={styles.close}
                testID="closeImage"
                accessibilityLabel="closeImage"
              />
            </TouchableOpacity>
          </Right>
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log('DialCallDialCall');
            DialCall();
          }}>
          <View style={styles.image}>
            <Image
              source={call}
              style={styles.iconsize}
              testID="callImage"
              accessibilityLabel="callImage"
            />
            <Text
              style={styles.horizontal}
              testID="phoneText"
              accessibilityLabel="phoneText">
              {t('PATIENTS.PHONE')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const country_code = await getCountryCode();
            Linking.openURL(
              'https://api.whatsapp.com/send?phone=' +
                country_code +
                `${patientList?.appointment?.person_details?.phone_no}`,
            );
            global.nrmlCall = true;
            await AsyncStorage.setItem('nrml_whatsapp_call', 'true');
            setnrml_WhatCall(true);
          }}
          testID="whatsappTouch"
          accessibilityLabel="whatsappTouch">
          <View style={styles.image}>
            <Image
              source={whatsapp}
              style={styles.iconsize}
              testID="whatsappImage"
              accessibilityLabel="whatsappImage"
            />
            <Text
              style={styles.horizontal}
              testID="whatsappText"
              accessibilityLabel="whatsappText">
              {t('PROFILE.WHATSAPP')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            heAlphaCall();
          }}
          // onPress={() => {
          //   templateId
          //     ? selectTemplateExist(templateId)
          //     : templateRef.current?.setModalVisible(true);
          // } }
          testID="healphaTouch"
          accessibilityLabel="healphaTouch">
          <View style={styles.image}>
            <Image
              source={Video}
              style={styles.iconsize}
              testID="healphaImage"
              accessibilityLabel="healphaImage"
            />
            <Text
              style={styles.horizontal}
              testID="healphaText"
              accessibilityLabel="healphaText">
              {t('PROFILE.HEALPHA')}
            </Text>
          </View>
        </TouchableOpacity>
        <Divider style={styles.lineStyle} />
        <Text
          style={{
            textAlign: 'center',
            marginVertical: wp(10),
            fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
          }}
          testID="cantConnectText"
          accessibilityLabel="cantConnectText">
          {t('COMMON.CANT CONNECT')}
        </Text>
        <TouchableOpacity
          block
          style={{
            backgroundColor: GUIDELINE_BACKGROUND_COLOR,
            height: hp(50),
            marginHorizontal: wp(10),
            marginVertical: wp(10),
          }}
          onPress={() => {
            patientRef.current?.setModalVisible(true);
          }}>
          <View style={styles.vertical}>
            <Text
              style={[
                styles.input,
                styles.textfont,
                {
                  textAlign: 'center',
                  color: DEFAULT_RED_COLOR,
                  fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                },
              ]}
              testID="markUnavailableText"
              accessibilityLabel="markUnavailableText">
              {t('COMMON.MARK_UNAVAILABLE')}
            </Text>
          </View>
        </TouchableOpacity>
        <ActionSheet ref={patientRef}>{Patient()}</ActionSheet>
      </View>
    );
  };

  if (loading) {
    return <Loader />;
  }
  return patientList ? (
    <View style={{flex: 1}}>
      <Header
        testID="appointmentWithHeader"
        accessibilityLabel="appointmentWithHeader"
        navigation={navigation}
        title={t('DASHBOARD.APPOINTMENTWITH', {
          name: fullName,
        })}
      />

      <View style={[styles.connect]}>
        <Card>
          <View
            style={{
              justifyContent: 'flex-end',
              right: 0,
              alignSelf: 'flex-end',
              marginTop: -5,
            }}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    paddingLeft: 20,
                    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                  }}
                  testID={patientList?.appointment?.appointment_status + 'text'}
                  accessibilityLabel={
                    patientList?.appointment?.appointment_status + 'text'
                  }>
                  {patientList?.appointment?.appointment_status}
                </Text>
                <Image
                  testID="dotImage"
                  accessibilityLabel="dotImage"
                  source={dot}
                  style={[
                    styles.flatImage,
                    {
                      tintColor: getColor(
                        patientList?.appointment?.appointment_status.toLowerCase(),
                      ),
                      marginTop: hp(3),
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Avatar
                testID="personImage"
                accessibilityLabel="personImage"
                title={patientList?.appointment?.person_details.first_name.slice(
                  0,
                  1,
                )}
                rounded
                size="medium"
                source={{
                  uri: `${
                    getApiUrl() +
                    '/' +
                    patientList?.appointment?.person_details?.person_image
                  }`,
                }}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginLeft: 10,
              }}>
              <View style={{flexDirection: 'row', width: '60%'}}>
                <View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      {
                        fontSize: theme.fontSizes.md,
                        fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                      },
                      {flexShrink: 1},
                    ]}
                    testID={fullName + 'text'}
                    accessibilityLabel={fullName + 'text'}>
                    {fullName}
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    borderRadius: 20,
                    alignSelf: 'center',
                    padding: 3,
                    backgroundColor: getColor(appointmentType),
                  }}>
                  <Text
                    testID={appointmentType + 'text'}
                    accessibilityLabel={appointmentType + 'text'}>
                    {appointmentType}
                  </Text>
                </View>
              </View>

              {/* <View
                  style={[
                    styles.liveStatus,
                    {
                      backgroundColor: getColor(appointment_type_status),
                    },
                  ]}>
                  <Text style={styles.textCenter}>
                    {appointment_type_status}
                  </Text>
                </View> */}

              <Text
                note
                style={[{color: DEFAULT_GREY_COLOR}, styles.textfont]}
                testID={patientList?.appointment?.appointment_type + 'text'}
                accessibilityLabel={
                  patientList?.appointment?.appointment_type + 'text'
                }>
                {patientList?.appointment?.appointment_type}
              </Text>
            </View>
          </View>
          <Divider style={styles.lineStyle} />
          <View style={styles.direction}>
            {/* <Image
                source={name}
                style={(styles.icon, {alignSelf: 'center'})}
              /> */}
            <Icon
              testID="personIcon"
              accessibilityLabel="personIcon"
              name="person"
              type="Ionicons"
              style={{fontSize: 18, alignSelf: 'center'}}
            />
            <Text
              style={[styles.input, styles.textfont, {marginHorizontal: wp(5)}]}
              testID={
                patientList?.appointment?.person_details?.gender +
                patientList?.appointment?.person_details?.age +
                'text'
              }
              accessibilityLabel={
                patientList?.appointment?.person_details?.gender +
                patientList?.appointment?.person_details?.age +
                'text'
              }>
              {capitalize(patientList?.appointment?.person_details?.gender)},{' '}
              {patientList?.appointment?.person_details?.age}
            </Text>
          </View>
          {patientList?.appointment?.person_details?.email ? (
            <View style={styles.direction}>
              <Icon
                testID="mailIcon"
                accessibilityLabel="mailIcon"
                name="mail"
                type="Ionicons"
                style={{fontSize: 18, alignSelf: 'center'}}
              />
              <Text
                style={[
                  styles.input,
                  styles.textfont,
                  {marginHorizontal: wp(5)},
                ]}
                testID={
                  patientList?.appointment?.person_details?.email + 'text'
                }
                accessibilityLabel={
                  patientList?.appointment?.person_details?.email + 'text'
                }>
                {patientList?.appointment?.person_details?.email}
              </Text>
            </View>
          ) : null}
          {patientList?.appointment?.person_details?.phone_no ? (
            <View style={styles.direction}>
              {/* <Image
                source={phone}
                style={(styles.icon, {alignSelf: 'center'})}
              /> */}
              <Icon
                testID="callIcon"
                accessibilityLabel="callIcon"
                name="call"
                type="Ionicons"
                style={{fontSize: 18, alignSelf: 'center'}}
              />
              <Text
                style={[
                  styles.input,
                  styles.textfont,
                  {marginHorizontal: wp(5)},
                ]}
                testID={
                  patientList?.appointment?.person_details?.phone_no + 'text'
                }
                accessibilityLabel={
                  patientList?.appointment?.person_details?.phone_no + 'text'
                }>
                {patientList?.appointment?.person_details?.phone_no}
              </Text>
            </View>
          ) : null}
          <Divider style={styles.lineStyle} />
          <View style={{marginVertical: wp(10), flexGrow: 2}}>
            <Text
              note
              style={[{color: DEFAULT_GREY_COLOR}, styles.textfont]}
              testID="cheifComplaintText"
              accessibilityLabel="cheifComplaintText">
              {t('PATIENTS.CHEIF_COMPLIANT')}
            </Text>
            <Text
              style={styles.textfont}
              testID={patientList?.appointment?.description + 'text'}
              accessibilityLabel={
                patientList?.appointment?.description + 'text'
              }>
              {patientList?.appointment?.description}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PatientHistory');
            }}
            block
            style={{
              backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
            }}
            testID="viewPatientHistoryTouch"
            accessibilityLabel="viewPatientHistoryTouch">
            <View style={styles.vertical}>
              <Image
                source={history}
                style={styles.historyicon}
                testID="historyImage"
                accessibilityLabel="historyImage"
              />
              <Text
                style={
                  ([styles.input, styles.textfont],
                  {
                    textAlign: 'center',
                    color: APP_PRIMARY_COLOR,
                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                  })
                }
                testID="viewPatientHistoryText"
                accessibilityLabel="viewPatientHistoryText">
                {t('PATIENTS.VIEW PATIENT HISTORY')}
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View
          style={{
            margin: wp(20),
          }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
              fontSize: 16,
            }}
            testID="appointmentLogText"
            accessibilityLabel="appointmentLogText">
            {t('DASHBOARD.APPOINTMENT LOG')}
          </Text>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: DEFAULT_GREY_COLOR,
            borderBottomColor: DEFAULT_GREY_COLOR,
            paddingBottom: hp(85),
          }}>
          {/* {
              
            } */}
          {logsLoad ? (
            <View style={{paddingTop: hp(50)}}>
              <Loader noBackground={true} />
            </View>
          ) : (
            appointmentsLog &&
            appointmentsLog.map((log, index) => {
              let date = moment(log.date);

              // console.log(date, log.date, ";lkj;lkj");

              if (log?.label) {
                return (
                  <View
                    key={index}
                    style={{
                      paddingBottom: 10,
                      borderBottomColor: DEFAULT_INVERSE_LIGHT,
                      borderBottomWidth: 1,
                      backgroundColor: log.is_appointment_cancelled
                        ? STATUS_OFFLINE
                        : DEFAULT_WHITE_COLOR,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        paddingHorizontal: wp(15),
                      }}>
                      <View style={{paddingLeft: 2}}>
                        <Text
                          style={[
                            styles.textAlignment,
                            {
                              color: log.is_appointment_cancelled
                                ? DEFAULT_RED_COLOR
                                : DEFAULT_BLACK_COLOR,
                            },
                          ]}
                          testID={log.label + 'text'}
                          accessibilityLabel={log.label + 'text'}>
                          {log.label}
                        </Text>
                      </View>
                      <View style={{paddingLeft: 2}}>
                        <Text
                          style={{
                            color: DEFAULT_GREY_COLOR,
                            fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          }}
                          testID={log.data + 'text'}
                          accessibilityLabel={log.data + 'text'}>
                          {moment(log.date).format('DD/MM/YY')}
                        </Text>
                        {/* <Text>
                          {moment(date, 'HHmm').format('hh:mm A')}
                        </Text> */}
                      </View>
                    </View>
                    <Card
                      containerStyle={{
                        backgroundColor: log.is_appointment_cancelled
                          ? DEFAULT_WHITE_COLOR
                          : DEFAULT_INVERSE_LIGHT,
                        borderRadius: 5,
                      }}>
                      <View>
                        <Text
                          style={{width: '100%'}}
                          testID={log.message + 'text'}
                          accessibilityLabel={log.message + 'text'}>
                          {log.message}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{color: DEFAULT_INVERSE_COLOR}}
                          testID={log.doctor.first_name + 'text'}
                          accessibilityLabel={log.doctor.first_name + 'text'}>
                          {`${log.doctor.salutation}.${
                            log.doctor.first_name
                          }, ${moment(date, 'hhmm')
                            .format('hh:mm a')
                            .slice(0, -1)}`}
                        </Text>
                      </View>
                    </Card>
                  </View>
                );
              } else {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: wp(15),
                      paddingTop: 10,
                      backgroundColor: DEFAULT_WHITE_COLOR,
                      borderBottomColor: DEFAULT_INVERSE_LIGHT,
                      borderBottomWidth: 1,
                    }}>
                    <View
                      style={{
                        paddingLeft: 2,
                        width: '65%',
                      }}>
                      <Text
                        style={styles.textAlignment}
                        numberOfLines={1}
                        testID={log.message + 'text'}
                        accessibilityLabel={log.message + 'text'}>
                        {log.message}
                      </Text>
                    </View>
                    <View style={{paddingLeft: 2, flexDirection: 'row'}}>
                      <Text
                        style={{
                          color: DEFAULT_GREY_COLOR,
                          fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          fontSize: 12,
                        }}
                        testID={log.date + 'text'}
                        accessibilityLabel={log.date + 'text'}>
                        {/* {DateFormat(log.date)} */}
                        {moment(log.date).format('DD/MM/YY')}
                      </Text>
                      <Text
                        style={{
                          color: DEFAULT_GREY_COLOR,
                          fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          marginLeft: 5,
                          fontSize: 12,
                        }}
                        testID={date + 'text'}
                        accessibilityLabel={date + 'text'}>
                        {moment(date, 'HHmm').format('hh:mm a').slice(0, -1)}
                      </Text>
                    </View>
                  </View>
                );
              }
            })
          )}
        </View>
      </ScrollView>

      {/* <Divider style={styles.lineStyles} /> */}
      {routeStatus(
        appointmentType?.toLowerCase(),
        alone,
        appointmentStatus?.toLowerCase(),
      ) || (navigation.state.params.edit && navigation.state.params.editaccess == 1)
        ? openPopUp != true && (
            <View>
              <FooterButton
                label={
                  appointmentType === 'online' &&
                  global.nrmlCall != true &&
                  nrml_WhatCall != true
                    ? t('COMMON.CONNECT NOW')
                    : t('HEALPHACALL.START_CONSULTATION')
                }
                // onPress={() => {
                //   actionSheetRef.current?.setModalVisible(true);
                // }}

                onPress={() => {
                  appointmentType === 'online' &&
                  global.nrmlCall != true &&
                  nrml_WhatCall != true
                    ? actionSheetRef.current?.setModalVisible(true)
                    : templateId
                    ? selectTemplateExist(templateId)
                    : setModal(true); //templateRef.current?.setModalVisible(true);
                }}
              />
              {/* <ActionSheet ref={templateRef}>
            <Templates />
          </ActionSheet> */}
            </View>
          )
        : null}

      <Modal
        isVisible={modal}
        onBackButtonPress={() => {
          setModal(false);
        }}
        onBackdropPress={() => {
          setModal(false);
        }}
        backdropOpacity={0.1}
        style={{
          padding: 0,
          margin: 0,
          // flex: 1,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: DEFAULT_WHITE_COLOR,
              height: '60%',
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
              paddingBottom: hp(100),
            }}>
            <View style={styles.image}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                  fontSize: 16,
                }}
                testID="selectTemplateText"
                accessibilityLabel="selectTemplateText">
                {t('PATIENTS.SELECT_TEMPLATE')}
              </Text>
              <Right style={{marginRight: wp(10)}}>
                <TouchableOpacity
                  onPress={() => setModal(false)}
                  testID="closeTouch"
                  accessibilityLabel="closeTouch">
                  <Image
                    source={close}
                    style={styles.close}
                    testID="closeImage"
                    accessibilityLabel="closeImage"
                  />
                </TouchableOpacity>
              </Right>
            </View>
            <View>
              <View style={styles.searchoutside}>
                <View style={styles.search}>
                  <Image
                    source={Search}
                    style={styles.searchimg}
                    testID="searchImage"
                    accessibilityLabel="searchImage"
                  />
                  <TextInput
                    testID="searchTemplateTextInput"
                    accessibilityLabel="searchTemplateTextInput"
                    value={searchTemp}
                    placeholder={t('COMMON.SEARCH_TEMPLATE')}
                    style={styles.searchmedicine}
                    onChangeText={val => {
                      searchTemplate(val);
                    }}
                  />
                </View>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                style={{marginBottom: 50}}>
                {templates.map((template, index) => {
                  return (
                    <View style={{flex: 1}} key={index}>
                      <TouchableOpacity
                        onPress={() => selectTemplate(template.id)}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            margin: 10,
                            alignItems: 'center',
                          }}>
                          <Text
                            testID={template.name + 'text'}
                            accessibilityLabel={template.name + 'text'}>
                            {template.name}
                          </Text>
                          <View
                            style={{
                              borderRadius: 5,
                              backgroundColor: DEFAULT_LIGHT_GREEN_COLOR,
                              color: DEFAULT_GREEN_COLOR,
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                            }}>
                            <Text
                              style={{
                                color: DEFAULT_GREEN_COLOR,
                              }}
                              testID="previewText"
                              accessibilityLabel="previewText">
                              {t('COMMON.PREVIEW')}
                            </Text>
                          </View>
                        </View>
                        <Divider style={styles.divide} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {global.nrmlCall != true &&
        nrml_WhatCall != true &&
        (openPopUp == true ? (
          // <ActionSheet>
          <Action />
        ) : (
          // </ActionSheet>
          <ActionSheet ref={actionSheetRef}>
            <Action />
          </ActionSheet>
        ))}

      {/* <ActionSheet ref={templateRef}>
        <Templates />
      </ActionSheet> */}
    </View>
  ) : null;
}

const mapStateToProps = state => {
  return {
    PatientList: state.patientList.patientList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMicroTemplatesuccess: data =>
      dispatch(fetchMicroTemplatesuccess(data)),
    TwilioConnection: data => dispatch(TwilioConnection(data)),
    storeTemplateId: data => dispatch(storeTemplateId(data)),
    getPatient: data => dispatch(getPatient(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(PatientCard));
