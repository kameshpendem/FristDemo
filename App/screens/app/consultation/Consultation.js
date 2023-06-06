import React, {useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {
  Alert,
  DeviceEventEmitter,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {getPatient} from '../../../redux/actions/appointment_action';
import {createPdf} from '../../../redux/actions/template_action';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
} from '../../../themes/variable';
import {capitalize} from '../../../utils/capitalizeFirst';
import Header from '../common/Header';
import Loader from '../common/Loader';
import {NativeToast, NativeToastTop} from '../common/Toaster';
import AsyncStorage from '@react-native-community/async-storage';
import Observation from './observation/Observation';
import Plan from './plan/Plan';

const Consultation = ({patientList, getPatient, templateList, ...props}) => {
  const {t} = props;
  const [tab, settab] = useState(true);
  const {convert_template_id} = props.navigation.state.params ? props.navigation.state.params : '';
  const [loading, setloading] = useState(true);
  const [enc_id, setenc_id] = useState('');
  const [doc_id, setdoc_id] = useState('');
  const [hlp_id, sethlp_id] = useState('');
  const [title, settitle] = useState('');
  const [avtitle, setavtitle] = useState('');
  const [url, seturl] = useState('');
  const [subheader, setsubheader] = useState('');
  const [goHome, setgoHome] = useState(false);
  const [appointmentType, setAppointmentType] = useState('');
  const [redialcallflag, setredialcallflag] = useState(false);
  const [allow, setAllow] = useState(false);
  const prescription = async val => {
    console.log('pdfView pdfView true prescription', val);
    await AsyncStorage.setItem('redial_call_page', 'viewpdf');
    await createPdf({
      template_id: templateList?.id,
      preview: val,
      enc_id,
      doc_id,
      hlp_id,
    })
      .then(res => {
        if (res) {
          console.log('prescription prescription res ', res);
          DeviceEventEmitter.emit('updateHomeScreen', {date: ''});
          DeviceEventEmitter.emit('getPatientCard', {
            appointmentId: patientList?.appointment?.id,
          });

          if (val == true) {
            props.navigation.navigate('ViewPdfScreen', {
              link: res.data.file_path,
              screenname:
                val == true ? 'Preview Prescription' : 'Prescription Generated',
            });
          } else {
            if (convert_template_id == true) {
              //nothing
            } else {
              setgoHome(true);
            }
            props.navigation.navigate('ViewPdfScreen', {
              link: res.data.file_path,
              screenname:
                val == true ? 'Preview Prescription' : 'Prescription Generated',
              share: true,
              convert_template_id: convert_template_id ? true : false,
            });
          }
        }
      })
      .catch(res => {
        console.log('res dat i te error ', res);
        NativeToast({
          // text: "Please fill any of data in consultation flow.",
          // // res.message,
          text: res.message,
          type: 'warning',
        });
      });
  };

  if (goHome) {
    if (props.navigation.state.params.edit) {
      props.navigation.navigate('LandingPage');
    } else {
      props.navigation.navigate('HomeScreen', {qr_code_hlp_id: ''});
    }
  }
  const pdfView = async val => {
    if (val == false) {
      console.log('pdfView pdfView false', val);
      Alert.alert(
        `${t('DASHBOARD.GENERATE_PRESCRIPTION')}`,
        `${t('DASHBOARD.ARE_YOU')}`,
        [
          ({
            text: `${t('COMMON.CANCEL')}`,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: `${t('COMMON.OK')}`,
            onPress: () => prescription(val),
          }),
        ],
        {cancelable: true},
      );
    } else if (val == true) {
      console.log('pdfView pdfView true ', val);
      prescription(val);
    }
  };
  const checkVitals = val => {
    if (allow) {
      console.log('yghxbhsbxhbhsc checkVitals ', val);
      pdfView(val);
    } else {
      Alert.alert(
        `${t('DASHBOARD.ENTER_VITAL')}`,
        '',
        [
          {
            text: `${t('COMMON.OK')}`,
            onPress: () => {
              console.log('close');
            },
          },
        ],
        {
          cancelable: true,
        },
      );
    }
  };
  const navigateBack = async () => {
    {
      global.twilioconnected
        ? Alert.alert(
            t('HEALPHACALL.DISCONNECT_CALL_WITH'),
            global.twiliopatienname,
            [
              {
                text: 'OK',
                onPress: () => {
                  /*console.log("disconnect")*/
                },
              },
            ],
          )
        : backHandlerExit();
    }
  };
  const backHandlerExit = async () => {
    global.nrmlCall = false;
    await AsyncStorage.setItem('nrml_whatsapp_call', 'false');
    props.navigation.goBack(null);
    return true;
  };
  useEffect(() => {
    setgoHome(false);
    setloading(false);
    let data = patientList;
    if (data) {
      setenc_id(data?.encounter_id);
      setdoc_id(data?.appointment?.doc_id);
      sethlp_id(data?.appointment?.person_details?.hlpid);
      settitle(data?.appointment?.person_details?.full_name);
      setavtitle(data?.appointment?.person_details?.first_name?.slice(0, 1));
      seturl(data?.appointment?.person_details?.person_image);
      setAppointmentType(data?.appointment_type_status);
      setsubheader(
        `${capitalize(data?.appointment?.person_details?.gender)}, ${
          data?.appointment?.person_details?.age
            ? data?.appointment?.person_details?.age?.slice(0, 3)
            : ''
        }`,
      );
    }
    let ob1 = DeviceEventEmitter.addListener('redialcallflagevent', e => {
      setredialcallflag(e.redialcallflag == 'true' ? true : false);
    });
    BackHandler.addEventListener('hardwareBackPress', navigateBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', navigateBack);
    };
  }, []);

  if (loading && templateList && patientList) {
    return <Loader />;
  }
  return (
    <View style={styles.flex}>
      {redialcallflag == true &&
      appointmentType == 'online' &&
      global.nrmlCall != true ? (
        <Header
          style={{backgroundColor: APP_PRIMARY_COLOR, borderBottomWidth: 0}}
          navigation={props.navigation}
          title={title}
          avatartitle={avtitle}
          url={url}
          avator
          subtext
          redialhealphacall
          observation
          subHeader={subheader}
          appointmentType={appointmentType}
        />
      ) : (
        <Header
          style={{backgroundColor: APP_PRIMARY_COLOR, borderBottomWidth: 0}}
          navigation={props.navigation}
          title={title}
          avatartitle={avtitle}
          url={url}
          avator
          subtext
          observation
          subHeader={subheader}
          appointmentType={appointmentType}
        />
      )}

      <StatusBar
        backgroundColor={APP_PRIMARY_COLOR}
        barStyle={'light-content'}
      />
      <View style={styles.observe}>
        <TouchableOpacity
          onPress={() => {
            settab(true);
          }}
          style={
            tab
              ? {...styles.observation, ...styles.isactive}
              : styles.observation
          }>
          <Text
            style={
              tab
                ? {...styles.observationText, ...styles.isObservationText}
                : styles.observationText
            }>
            {t('DASHBOARD.OBSERVATION')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            settab(false);
          }}
          style={
            !tab
              ? {...styles.observation, ...styles.isactive}
              : styles.observation
          }>
          <Text
            style={
              !tab
                ? {...styles.observationText, ...styles.isObservationText}
                : styles.observationText
            }>
            {t('DASHBOARD.PLAN')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flex}>
        {tab ? (
          <Observation
            navigation={props.navigation}
            templateList={templateList}
            setAllow={setAllow}
          />
        ) : (
          <Plan navigation={props.navigation} />
        )}
      </View>
      <View style={styles.bottomtab}>
        <TouchableOpacity
          style={styles.preview}
          onPress={() => {
            checkVitals(true);
          }}>
          <Text style={styles.previewtext}>
            {t('COVID_MONITORING.PREVIEW') +
              ' ' +
              t('COVID_MONITORING.PRESCRIPTION')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.generate}
          onPress={() => {
            checkVitals(false);
          }}>
          <Text style={styles.generatetext}>
            {t('COVID_MONITORING.GENERATE') +
              ' ' +
              t('COVID_MONITORING.PRESCRIPTION')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    patientList: state.patientList.patientList,
    templateList: state.templateList.templateList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPatient: data => dispatch(getPatient(data)),
    TwilioConnection: data => dispatch(TwilioConnection(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Consultation));

const styles = StyleSheet.create({
  observation: {
    width: '50%',
    backgroundColor: DEFAULT_WHITE_COLOR,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderColor: DEFAULT_WHITE_COLOR,
  },
  isactive: {
    borderColor: APP_PRIMARY_COLOR,
  },
  observationText: {
    color: DEFAULT_GREY_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
  },
  isObservationText: {
    color: APP_PRIMARY_COLOR,
  },
  bottomtab: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: DEFAULT_WHITE_COLOR,
    bottom: Platform.OS == 'ios' ? 20 : 0,
    paddingHorizontal: 10,
  },
  preview: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: APP_PRIMARY_COLOR,
  },
  previewtext: {
    color: APP_PRIMARY_COLOR,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
  },
  generate: {
    flex: 1,
    backgroundColor: APP_PRIMARY_COLOR,
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  generatetext: {
    color: DEFAULT_WHITE_COLOR,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
  },
  flex: {flex: 1},
  observe: {flexDirection: 'row', justifyContent: 'space-between'},
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  },
});
