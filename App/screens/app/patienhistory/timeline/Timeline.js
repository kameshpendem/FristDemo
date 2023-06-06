import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {getCaptureVitals} from '../../../../redux/actions/timeline_action';
import {fetchVitalLabelssuccess} from '../../../../redux/actions/observation_action';
import EditIcon from '../../../../assets/images/edit.svg';
import {Card} from 'native-base';
import {
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR,
  FONT_FAMILY,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_LIGHT_GREEN_COLOR,
  DEFAULT_GREEN_COLOR,
} from '../../../../themes/variable';
import Pdf from '../../../../assets/images/pdfLarge.png';
import Hospital from '../../../../assets/images/hsptl.png';
import Name from '../../../../assets/images/Patient.png';
import {wp, hp} from '../../../../themes/Scale';
import remainder from '../../../../assets/images/bell.png';
import beat from '../../../../assets/images/heart.png';
import report from '../../../../assets/images/File.png';
import calender from '../../../../assets/images/cal.png';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {getTimeline} from '../../../../redux/actions/timeline_action';
import {
  encounterStatus,
  reportsButton,
  getVitalsButton,
  PrescriptionButton,
  PrescriptionButton2,
} from './Utils';
import getBaseUrl, {getApiUrl} from '../../../../config/Config';
import homeStyles from '../../../app/homescreen/HomeScreenStyles';
import {log} from 'react-native-reanimated';
import {NativeToast} from '../../common/Toaster';
import {ScrollView} from 'react-native-gesture-handler';
import {getColor, getCardColor, theme} from '../../../../themes/Theme';
import moment from 'moment';
import ApiCall from '../../../../services/ApiCall';
const Timeline = ({
  navigation,
  patientList,
  fetchVitalLabelssuccess,
  t,
  person_details,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enc_id, setEnc_id] = useState('');
  const [appointment_details, set_appointment_details] = useState([]);
  const healpha_person_details = navigation.state.params?.person_details
    ? navigation.state.params?.person_details
    : '';

  const navigateToEdit = (item, editaccess) => {
    global.hlpid = item?.appointment?.healpha_id;
    global.branch_id = item?.appointment?.branch_details?.branch_id;
    // global.search_text = this.state.searchText;
    if (item?.appointment?.id === null) {
      Toast.show({
        text: 'No appointment id found',
        type: 'warning',
        buttonText: 'Okay',
        duration: 5000,
        style: {marginBottom: 60},
      });
      // // NativeToast({text: 'No appointment id found', type: 'warning'});
    } else {
      navigation.navigate('PatientCard', {
        virtualBranch: item?.appointment?.virtual_clinic_branch
          ? item?.appointment?.virtual_clinic_branch
          : '',
        appointmentId: item?.appointment?.id,
        edit: true,
        editaccess: editaccess,
      });
    }
  };

  const getVitalLabels = async ({
    Id,
    enc_id,
    template_id,
    doc_id,
    healpha_id,
    enc_status,
    person_details,
    is_editable,
  }) => {
    const variables = {
      templateId: template_id,
      healpha_id: healpha_person_details?.hlp_id
        ? healpha_person_details?.hlp_id
        : patientList?.appointment?.healpha_id,
      doc_id: doc_id,
      enc_id: enc_id,
      data: 'all',
    };
    await getCaptureVitals(variables)
      .then(res => {
        fetchVitalLabelssuccess(res);
        if (res?.vitals?.length > 0) {
          navigation.navigate('CaptureVitals', {
            Id,
            enc_id,
            enc_status,
            doc_id,
            healpha_id,
            template_id,
            person_details,
            is_editable,
          });
        } else {
          navigation.navigate('VitalsInput', {
            encounter_id: enc_id,
            template_id: template_id?.trim() === '' ? '' : template_id,
            doctor_id: doc_id,
            hlp_id: healpha_id,
            timeline: true,
          });
        }
      })
      .then(res => {
        // NativeToast({text: res.message, type: 'warning'});
      });
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const variables = {
        healpha_id: healpha_person_details?.hlp_id
          ? healpha_person_details?.hlp_id
          : patientList?.appointment?.healpha_id,
        enc_id: navigation.state.params?.enc_id,
      };
      let data = await getTimeline(variables);
      if (healpha_person_details && healpha_person_details) {
        try {
          const url_personal =
            getBaseUrl() +
            `v1/appointment/person-timeline/${
              healpha_person_details ? healpha_person_details?.hlp_id : ''
            }`;
          const response_personal = await ApiCall.get(url_personal);
          if (response_personal?.data?.appointment_details) {
            setData(data.appointment_details);
            set_appointment_details(
              response_personal?.data?.appointment_details,
            );
          }
        } catch (error) {
          console.log('error in person details ', error);
        }
      } else {
        setData(data.appointment_details);
      }

      setLoading(false);
    };
    getData();
  }, []);
  // console.log(capturedata, 'MY DATA');

  const showPdf = pdflink => {
    // console.log(pdflink, 'pdflink');
    if (!pdflink) return alert('PDF file path not found.');
    console.log(pdflink, 'pdflink');
    navigation.navigate('ViewPdfScreen', {
      // link: pdflink,
      link: getApiUrl() + pdflink,
      screenname: 'Prescription',
    });
  };

  if (loading) {
    return (
      <View style={homeStyles.loaderView}>
        <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <View style={{padding: 15}}>
      <FlatList
        style={{marginBottom: Platform.OS == 'ios' ? '80%' : '50%'}}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        renderItem={({item: i, index: index}) => {
          let type = i?.op_details?.type;

          if (type.toLowerCase() == 'op') {
            console.log(i.appointment.appointment_status, 'op ststus');
            return (
              <View style={{marginVertical: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 5,
                    alignSelf: 'flex-start',
                  }}>
                  <Image
                    source={calender}
                    style={styles.imagesize}
                    testID="calenderImage"
                    accessibilityLabel="calenderImage"
                  />
                  <Text
                    style={[
                      styles.alignment,
                      {fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD},
                    ]}
                    testID={i.appointment.date_start + 'text'}
                    accessibilityLabel={i.appointment.date_start + 'text'}>
                    {moment(i.appointment.date_start).format('DD MMM YY')}
                    {/* {i.appointment.date_start.slice(0, 10)} */}
                  </Text>
                </View>
                <Card style={styles.card} borderRadius={10}>
                  <View
                    style={{
                      padding: wp(15),
                      backgroundColor: DEFAULT_WHITE_COLOR,
                      borderRadius: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD}}
                        testID={
                          i.appointment.doctor_details.full_name + 'text'
                        }>
                        {i.appointment.doctor_details.salutation +
                          ' ' +
                          i.appointment.doctor_details.full_name}
                      </Text>
                      <View>
                        {healpha_person_details ? (
                          <Text style={{color: '#E64C4C'}}>
                            {appointment_details[index]?.user_enc_access
                              ?.is_owner == true
                              ? ''
                              : 'Shared'}
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            backgroundColor: getCardColor(
                              i.appointment.appointment_status.toLowerCase(),
                            ),
                            // color: getColor(
                            //   i.appointment.appointment_status.toLowerCase()
                            // ),
                            paddingHorizontal: 10,
                            paddingVertical: 2,
                          }}
                          testID={i.appointment.appointment_status + 'text'}
                          accessibilityLabel={
                            i.appointment.appointment_status + 'text'
                          }>
                          {/* {i.appointment.appointment_status} */}
                          {encounterStatus(i.appointment.appointment_status)}
                        </Text>
                      </View>
                    </View>

                    {i.specialization && (
                      <Text
                        note
                        style={{
                          color: DEFAULT_GREY_COLOR,
                          paddingVertical: wp(5),
                          fontSize: theme.fontSizes.md,
                          fontFamily: theme.fontFamily.primaryRegular,
                        }}
                        testID={i.specialization + 'text'}
                        accessibilityLabel={i.specialization + 'text'}>
                        {i.specialization.replace(
                          /^./,
                          i.specialization[0].toUpperCase(),
                        )}
                      </Text>
                    )}

                    <View style={styles.details}>
                      <Image
                        source={Hospital}
                        style={styles.imagesize}
                        testID="hospitalImage"
                        accessibilityLabel="hospitalImage"
                      />
                      <Text
                        style={styles.alignment}
                        testID={
                          i.appointment.branch_details.branch_name +
                          i.op_details.encounter_code +
                          'text'
                        }
                        accessibilityLabel={
                          i.appointment.branch_details.branch_name +
                          i.op_details.encounter_code +
                          'text'
                        }>
                        {' '}
                        {i.appointment.branch_details.branch_name +
                          ' - ' +
                          i.op_details.encounter_code}
                      </Text>
                    </View>
                    {(i.appointment.appointment_status == 'completed' ||
                      i.appointment.appointment_status == 'closed') &&
                    healpha_person_details ? (
                      <View>
                        <TouchableOpacity
                          style={{marginTop: wp(-30), marginLeft: wp(300)}}
                          onPress={() =>
                            navigateToEdit(
                              i,
                              appointment_details[index]?.user_enc_access
                                ?.is_editable,
                            )
                          }>
                          <EditIcon />
                        </TouchableOpacity>
                      </View>
                    ) : null}

                    <View style={styles.details}>
                      <Image
                        source={Name}
                        style={styles.imagesize}
                        testID="personImage"
                        accessibilityLabel="personImage"
                      />
                      <Text
                        style={[
                          styles.alignment,
                          {textTransform: 'capitalize'},
                        ]}
                        testID="patientTypeText"
                        accessibilityLabel="patientTypeText">
                        {type == 'op' || type == 'service'
                          ? 'OutPatient - Regular'
                          : type}
                      </Text>
                    </View>
                  </View>
                  {/* <Divider style={styles.lineStyle} /> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingVertical: wp(10),
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      backgroundColor: DEFAULT_SHADOW_COLOR,
                    }}>
                    <View style={{flex: 7.5, flexDirection: 'row'}}>
                      <TouchableOpacity
                        disabled={!getVitalsButton(i.appointment)}
                        style={{flex: 3.0, flexDirection: 'row'}}
                        // onPress={() => navigation.navigate('CaptureVitals')}
                        onPress={() => {
                          getVitalLabels({
                            Id: i?.op_details.id,
                            enc_id: i?.encounter_id,
                            template_id: i?.template_id,
                            doc_id: i?.appointment?.doc_id,
                            healpha_id: patientList?.appointment?.healpha_id,
                            enc_status: i?.appointment?.appointment_status,
                            person_details: healpha_person_details
                              ? healpha_person_details
                              : '',
                            is_editable:
                              healpha_person_details &&
                              appointment_details[index]?.user_enc_access
                                ?.is_editable,
                          });
                        }}
                        testID="beatTouch"
                        accessibilityLabel="beatTouch">
                        {/* onPress={CaptureVitals()} */}
                        <Image
                          source={beat}
                          style={styles.image}
                          testID="beatImage"
                          accessibilityLabel="beatImage"
                        />
                        <Text
                          style={{
                            textAlign: 'center',
                            color: !getVitalsButton(i.appointment)
                              ? '#808080'
                              : 'black',
                          }}
                          testID="captureVitalsText"
                          accessibilityLabel="captureVitalsText">
                          {t('PROFILE.CAPTURE VITALS')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        testID="prescriptionTouch"
                        accessibilityLabel="prescriptionTouch"
                        disabled={!PrescriptionButton(i.appointment)}
                        style={{flex: 3.0, flexDirection: 'row'}}
                        onPress={() => showPdf(i.prescription_url)}>
                        <Image
                          source={Pdf}
                          style={styles.image}
                          testID="pdfImage"
                          accessibilityLabel="pdfImage"
                        />
                        <Text
                          style={{
                            textAlign: 'center',
                            color: !PrescriptionButton(i.appointment)
                              ? '#808080'
                              : 'black',
                          }}
                          testID="prescriptionText"
                          accessibilityLabel="prescriptionText">
                          {t('PROFILE.PRESCRIPTION')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={!reportsButton(i.appointment)}
                        style={{flex: 3.0, flexDirection: 'row'}}
                        onPress={() => {
                          // console.log(i?.encounter_id, "EncounterId");
                          navigation.navigate('TimelineReports', {
                            Id: i?.op_details.id,
                            enc_id: i?.encounter_id,
                            person_details: healpha_person_details
                              ? healpha_person_details
                              : '',
                            editalble_data:
                              healpha_person_details &&
                              appointment_details[index]?.user_enc_access
                                ?.is_editable,
                                doctor_id:i.appointment
                          });
                        }}
                        testID="reportTouch"
                        accessibilityLabel="reportTouch">
                        <Image
                          source={report}
                          style={styles.image}
                          testID="reportImage"
                          accessibilityLabel="reportImage"
                        />
                        <Text
                          style={{
                            textAlign: 'center',
                            color: !reportsButton(i.appointment)
                              ? '#808080'
                              : 'black',
                          }}
                          testID="reportText"
                          accessibilityLabel="reportText">
                          {t('PROFILE.REPORT')}
                        </Text>
                      </TouchableOpacity>
                      {/* )} */}
                    </View>
                  </View>
                </Card>
              </View>
            );
          } else if (type.toLowerCase() == 'op-personal') {
            if (i.appointment) {
              return (
                <View style={{marginVertical: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 5,
                      alignSelf: 'flex-start',
                    }}>
                    <Image
                      source={calender}
                      style={styles.imagesize}
                      testID="calenderImage"
                      accessibilityLabel="calenderImage"
                    />
                    <Text
                      style={[
                        styles.alignment,
                        {fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD},
                      ]}
                      testID={i.appointment.date_start + 'text'}
                      accessibilityLabel={i.appointment.date_start + 'text'}>
                      {moment(i.appointment.date_start).format('DD MMM YY')}
                      {/* {i.appointment.date_start.slice(0, 10)} */}
                    </Text>
                  </View>
                  <Card style={styles.card} borderRadius={10}>
                    <View
                      style={{
                        padding: wp(15),
                        backgroundColor: DEFAULT_WHITE_COLOR,
                        borderRadius: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD}}
                          testID={
                            i.appointment.doctor_details.full_name + 'text'
                          }
                          accessibilityLabel={
                            i.appointment.doctor_details.full_name + 'text'
                          }>
                          {i.appointment.doctor_details.salutation +
                            ' ' +
                            i.appointment.doctor_details.full_name}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              backgroundColor: getCardColor(
                                i.appointment.appointment_status.toLowerCase(),
                              ),
                              // color: getColor(
                              //   i.appointment.appointment_status.toLowerCase()
                              // ),
                              paddingHorizontal: 10,
                              paddingVertical: 2,
                            }}
                            testID={i.appointment.appointment_status + 'text'}
                            accessibilityLabel={
                              i.appointment.appointment_status + 'text'
                            }>
                            {/* {i.appointment.appointment_status} */}
                            {encounterStatus(i.appointment.appointment_status)}
                          </Text>
                        </View>
                      </View>

                      <Text
                        note
                        style={{
                          color: DEFAULT_GREY_COLOR,
                          paddingVertical: wp(5),
                          fontSize: theme.fontSizes.md,
                          fontFamily: theme.fontFamily.primaryRegular,
                        }}
                        testID={i.specialization + 'text'}
                        accessibilityLabel={i.specialization + 'text'}>
                        {i.specialization.replace(
                          /^./,
                          i.specialization[0].toUpperCase(),
                        )}
                      </Text>
                      <View style={styles.details}>
                        <Image
                          source={Hospital}
                          style={styles.imagesize}
                          testID="hospitalImage"
                          accessibilityLabel="hospitalImage"
                        />
                        <Text
                          style={styles.alignment}
                          testID={
                            i.appointment.branch_details.branch_name +
                            i.op_details.encounter_code +
                            'text'
                          }
                          accessibilityLabel={
                            i.appointment.branch_details.branch_name +
                            i.op_details.encounter_code +
                            'text'
                          }>
                          {' '}
                          {i.appointment.branch_details.branch_name +
                            ' - ' +
                            i.op_details.encounter_code}
                        </Text>
                      </View>
                      {(i.appointment.appointment_status == 'completed' ||
                        i.appointment.appointment_status == 'closed') &&
                      healpha_person_details ? (
                        <View>
                          <TouchableOpacity
                            style={{marginTop: wp(-30), marginLeft: wp(300)}}
                            onPress={() =>
                              navigateToEdit(
                                i,
                                appointment_details[index]?.user_enc_access
                                  ?.is_editable,
                              )
                            }>
                            <EditIcon />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      <View style={styles.details}>
                        <Image
                          source={Name}
                          style={styles.imagesize}
                          testID="personImage"
                          accessibilityLabel="personImage"
                        />
                        <Text
                          style={[
                            styles.alignment,
                            {textTransform: 'capitalize'},
                          ]}
                          testID="patientTypeText"
                          accessibilityLabel="patientTypeText">
                          {type == 'op' || type == 'service'
                            ? 'OutPatient - Regular'
                            : type}
                        </Text>
                      </View>
                    </View>
                    {/* <Divider style={styles.lineStyle} /> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingVertical: wp(10),
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        backgroundColor: DEFAULT_SHADOW_COLOR,
                      }}>
                      <View style={{flex: 7.5, flexDirection: 'row'}}>
                        {/* <TouchableOpacity
                      disabled={!getVitalsButton(i.appointment)}
                      style={{ flex: 3.0, flexDirection: "row" }}
                      // onPress={() => navigation.navigate('CaptureVitals')}
                      onPress={() => {
                        getVitalLabels({
                          Id: i?.op_details.id,
                          enc_id: i?.encounter_id,
                          template_id: i?.template_id,
                          doc_id: i?.appointment?.doc_id,
                          healpha_id: patientList?.appointment?.healpha_id,
                          enc_status: i?.appointment?.appointment_status
                        });
                      }}>
                      <Image source={beat} style={styles.image} />
                      <Text
                        style={{
                          textAlign: "center",
                          color: !getVitalsButton(i.appointment)
                            ? "#808080"
                            : "black"
                        }}>
                        {t("PROFILE.CAPTURE VITALS")}
                      </Text>
                    </TouchableOpacity> */}
                        <TouchableOpacity
                          disabled={!PrescriptionButton(i.appointment)}
                          style={{flex: 3.0, flexDirection: 'row'}}
                          onPress={() => showPdf(i.prescription_url)}
                          testID="pdfTouch"
                          accessibilityLabel="pdfTouch">
                          <Image
                            source={Pdf}
                            style={styles.image}
                            testID="pdfImage"
                            accessibilityLabel="pdfImage"
                          />
                          <Text
                            style={{
                              textAlign: 'center',
                              color: !PrescriptionButton(i.appointment)
                                ? '#808080'
                                : 'black',
                            }}
                            testID="prescriptionText"
                            accessibilityLabel="prescriptionText">
                            {t('PROFILE.PRESCRIPTION')}
                          </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                      disabled={!reportsButton(i.appointment)}
                      style={{ flex: 3.0, flexDirection: "row" }}
                      onPress={() => {
                        // console.log(i?.encounter_id, "EncounterId");
                        navigation.navigate("TimelineReports", {
                          Id: i?.op_details.id,
                          enc_id: i?.encounter_id
                        });
                      }}>
                      <Image source={report} style={styles.image} />
                      <Text
                        style={{
                          textAlign: "center",
                          color: !reportsButton(i.appointment)
                            ? "#808080"
                            : "black"
                        }}>
                        {t("PROFILE.REPORT")}
                      </Text>
                    </TouchableOpacity> */}
                        {/* )} */}
                      </View>
                    </View>
                  </Card>
                </View>
              );
            } else {
              return (
                <View style={{marginVertical: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 5,
                      alignSelf: 'flex-start',
                    }}>
                    <Image
                      source={calender}
                      style={styles.imagesize}
                      testID="calenderImage"
                      accessibilityLabel="calenderImage"
                    />
                    <Text
                      style={[
                        styles.alignment,
                        {fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD},
                      ]}
                      testID={i.op_details.encounter_date + 'text'}
                      accessibilityLabel={i.op_details.encounter_date + 'text'}>
                      {moment(i.op_details.encounter_date).format('DD MMM YY')}
                      {/* {i.appointment.date_start.slice(0, 10)} */}
                    </Text>
                  </View>
                  <Card style={styles.card} borderRadius={10}>
                    <View
                      style={{
                        padding: wp(15),
                        backgroundColor: DEFAULT_WHITE_COLOR,
                        borderRadius: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {/* <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD }}>
                       {i.op_details.doctor_details.full_name}
                    </Text> */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              backgroundColor: getCardColor(
                                i.op_details.status.toLowerCase(),
                              ),
                              // color: getColor(
                              //   i.appointment.appointment_status.toLowerCase()
                              // ),
                              paddingHorizontal: 10,
                              paddingVertical: 2,
                            }}
                            testID={i.op_details.status + 'text'}
                            accessibilityLabel={i.op_details.status + 'text'}>
                            {/* {i.appointment.appointment_status} */}
                            {encounterStatus(i.op_details.status)}
                          </Text>
                        </View>
                      </View>

                      {/* <Text
                    note
                    style={{
                      color: DEFAULT_GREY_COLOR,
                      paddingVertical: wp(5)
                    }}>
                    {i.specialization}
                  </Text> */}
                      <View style={styles.details}>
                        <Image
                          source={Hospital}
                          style={styles.imagesize}
                          testID="hospitalImage"
                          accessibilityLabel="hospitalImage"
                        />
                        <Text
                          style={styles.alignment}
                          testID={
                            i.op_details.branch_details.branch_name +
                            i.op_details.encounter_code +
                            'text'
                          }
                          accessibilityLabel={
                            i.op_details.branch_details.branch_name +
                            i.op_details.encounter_code +
                            'text'
                          }>
                          {' '}
                          {i.op_details.branch_details.branch_name +
                            ' - ' +
                            i.op_details.encounter_code}
                        </Text>
                      </View>
                      {(i.appointment.appointment_status == 'completed' ||
                        i.appointment.appointment_status == 'closed') &&
                      healpha_person_details ? (
                        <View>
                          <TouchableOpacity
                            style={{marginTop: wp(-30), marginLeft: wp(300)}}
                            onPress={() =>
                              navigateToEdit(
                                i,
                                appointment_details[index]?.user_enc_access
                                  ?.is_editable,
                              )
                            }>
                            <EditIcon />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      <View style={styles.details}>
                        <Image
                          source={Name}
                          style={styles.imagesize}
                          testID="personImage"
                          accessibilityLabel="personImage"
                        />
                        <Text
                          style={[
                            styles.alignment,
                            {textTransform: 'capitalize'},
                          ]}
                          testID="patientTypeText"
                          accessibilityLabel="patientTypeText">
                          {type == 'op' || type == 'service'
                            ? 'OutPatient - Regular'
                            : type}
                        </Text>
                      </View>
                    </View>
                    {/* <Divider style={styles.lineStyle} /> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingVertical: wp(10),
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        backgroundColor: DEFAULT_SHADOW_COLOR,
                      }}>
                      <View style={{flex: 7.5, flexDirection: 'row'}}>
                        {/* <TouchableOpacity
                      disabled={!getVitalsButton(i.appointment)}
                      style={{ flex: 3.0, flexDirection: "row" }}
                      // onPress={() => navigation.navigate('CaptureVitals')}
                      onPress={() => {
                        getVitalLabels({
                          Id: i?.op_details.id,
                          enc_id: i?.encounter_id,
                          template_id: i?.template_id,
                          doc_id: i?.appointment?.doc_id,
                          healpha_id: patientList?.appointment?.healpha_id,
                          enc_status: i?.appointment?.appointment_status
                        });
                      }}>
                      <Image source={beat} style={styles.image} />
                      <Text
                        style={{
                          textAlign: "center",
                          color: !getVitalsButton(i.appointment)
                            ? "#808080"
                            : "black"
                        }}>
                        {t("PROFILE.CAPTURE VITALS")}
                      </Text>
                    </TouchableOpacity> */}
                        <TouchableOpacity
                          disabled={!PrescriptionButton2(i.op_details)}
                          style={{flex: 3.0, flexDirection: 'row'}}
                          onPress={() => showPdf(i.prescription_url)}>
                          <Image
                            source={Pdf}
                            style={styles.image}
                            testID="pdfImage"
                            accessibilityLabel="pdfImage"
                          />
                          <Text
                            style={{
                              textAlign: 'center',
                              color: !PrescriptionButton2(i.op_details)
                                ? '#808080'
                                : 'black',
                            }}
                            testID="prescriptionText"
                            accessibilityLabel="prescriptionText">
                            {t('PROFILE.PRESCRIPTION')}
                          </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                      disabled={!reportsButton(i.appointment)}
                      style={{ flex: 3.0, flexDirection: "row" }}
                      onPress={() => {
                        // console.log(i?.encounter_id, "EncounterId");
                        navigation.navigate("TimelineReports", {
                          Id: i?.op_details.id,
                          enc_id: i?.encounter_id
                        });
                      }}>
                      <Image source={report} style={styles.image} />
                      <Text
                        style={{
                          textAlign: "center",
                          color: !reportsButton(i.appointment)
                            ? "#808080"
                            : "black"
                        }}>
                        {t("PROFILE.REPORT")}
                      </Text>
                    </TouchableOpacity> */}
                        {/* )} */}
                      </View>
                    </View>
                  </Card>
                </View>
              );
            }
          } else {
            console.log('not op r op-personal');
          }
          //   let encounter_date=''
          //   if(type=='school'){
          //    encounter_date= i.op_details.encounter_date.split('-')
          //    encounter_date=encounter_date[2]+'-'+encounter_date[1]+'-'+encounter_date[0]
          //   }
          //   else{
          //     encounter_date= i.op_details.encounter_date
          //   }
          //   return (
          //     <View style={{ marginVertical: 10 }}>
          //       <View
          //         style={{
          //           flexDirection: "row",
          //           marginLeft: 5,
          //           alignSelf: "flex-start"
          //         }}>
          //         <Image source={calender} style={styles.imagesize} />
          //         <Text
          //           style={[
          //             styles.alignment,
          //             { fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD }
          //           ]}>
          //           {moment(encounter_date).format("DD MMM YY")}
          //           {/* {i.appointment.date_start.slice(0, 10)} */}
          //         </Text>
          //       </View>
          //       <Card style={styles.card} borderRadius={10}>
          //         <View
          //           style={{
          //             padding: wp(15),
          //             backgroundColor: DEFAULT_WHITE_COLOR,
          //             borderRadius: 10
          //           }}>
          //           <View
          //             style={{
          //               flexDirection: "row",
          //               justifyContent: "flex-end"
          //             }}>
          //             {/* <Text style={{ fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD }}>
          //                {i.op_details.doctor_details.full_name}
          //             </Text> */}
          //             <View
          //               style={{
          //                 flexDirection: "row",
          //                 justifyContent: "flex-end"
          //               }}>
          //               <Text
          //                 style={{
          //                   backgroundColor: getCardColor(
          //                     i.op_details.status.toLowerCase()
          //                   ),
          //                   // color: getColor(
          //                   //   i.appointment.appointment_status.toLowerCase()
          //                   // ),
          //                   paddingHorizontal: 10,
          //                   paddingVertical: 2
          //                 }}>
          //                 {/* {i.appointment.appointment_status} */}
          //                 {encounterStatus(i.op_details.status)}
          //               </Text>
          //             </View>
          //           </View>

          //           {/* <Text
          //             note
          //             style={{
          //               color: DEFAULT_GREY_COLOR,
          //               paddingVertical: wp(5)
          //             }}>
          //             {i.specialization}
          //           </Text> */}
          //           <View style={styles.details}>
          //             <Image source={Hospital} style={styles.imagesize} />
          //             <Text style={styles.alignment}>
          //               {" "}
          //               {i.op_details.branch_details.branch_name.toUpperCase() +
          //                 " - " +
          //                 i.op_details.encounter_code}
          //             </Text>
          //           </View>
          //           <View style={styles.details}>
          //             {/* <Image source={Name} style={styles.imagesize} /> */}
          //             <Text>
          //               Type:
          //             </Text>
          //             <Text
          //               style={[
          //                 styles.alignment,
          //                 { textTransform: "capitalize" }
          //               ]}>
          //               {type == "op" || type == "service"
          //                 ? "OutPatient - Regular"
          //                 : type}
          //             </Text>
          //           </View>
          //         </View>
          //         {/* <Divider style={styles.lineStyle} /> */}
          //         <View
          //           style={{
          //             flexDirection: "row",
          //             paddingVertical: wp(10),
          //             borderBottomLeftRadius: 10,
          //             borderBottomRightRadius: 10,
          //             backgroundColor: DEFAULT_SHADOW_COLOR
          //           }}>
          //           <View style={{ flex: 7.5, flexDirection: "row" }}>
          //             {/* <TouchableOpacity
          //               disabled={!getVitalsButton(i.appointment)}
          //               style={{ flex: 3.0, flexDirection: "row" }}
          //               // onPress={() => navigation.navigate('CaptureVitals')}
          //               onPress={() => {
          //                 getVitalLabels({
          //                   Id: i?.appointment.id,
          //                   enc_id: i?.encounter_id,
          //                   template_id: i?.template_id,
          //                   doc_id: i?.appointment?.doc_id,
          //                   healpha_id: patientList?.appointment?.healpha_id,
          //                   enc_status: i?.appointment?.appointment_status
          //                 });
          //               }}>
          //               <Image source={beat} style={styles.image} />
          //               <Text
          //                 style={{
          //                   textAlign: "center",
          //                   color: !getVitalsButton(i.appointment)
          //                     ? "#808080"
          //                     : "black"
          //                 }}>
          //                 {t("PROFILE.CAPTURE VITALS")}
          //               </Text>
          //             </TouchableOpacity> */}
          //             <TouchableOpacity
          //               disabled={!PrescriptionButton2(i.op_details)}
          //               style={{ flex: 3.0, flexDirection: "row" }}
          //               onPress={() => showPdf(i.prescription_url)}>
          //               <Image source={Pdf} style={styles.image} />
          //               <Text
          //                 style={{
          //                   textAlign: "center",
          //                   color: !PrescriptionButton2(i.op_details)
          //                     ? "#808080"
          //                     : "black"
          //                 }}>
          //                 {t("PROFILE.PRESCRIPTION")}
          //               </Text>
          //             </TouchableOpacity>
          //             {/* <TouchableOpacity
          //               disabled={!reportsButton(i.appointment)}
          //               style={{ flex: 3.0, flexDirection: "row" }}
          //               onPress={() => {
          //                 // console.log(i?.encounter_id, "EncounterId");
          //                 navigation.navigate("TimelineReports", {
          //                   Id: i?.appointment.id,
          //                   enc_id: i?.encounter_id
          //                 });
          //               }}>
          //               <Image source={report} style={styles.image} />
          //               <Text
          //                 style={{
          //                   textAlign: "center",
          //                   color: !reportsButton(i.appointment)
          //                     ? "#808080"
          //                     : "black"
          //                 }}>
          //                 {t("PROFILE.REPORT")}
          //               </Text>
          //             </TouchableOpacity>
          //             {/* )} */}
          //           </View>
          //         </View>
          //       </Card>
          //     </View>
          //   );
          // }
        }}
      />
    </View>
  );
};
// export default Timeline;
const mapStateToProps = state => {
  return {
    patientList: state.patientList.patientList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchVitalLabelssuccess: data => dispatch(fetchVitalLabelssuccess(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Timeline));

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_GREY_COLOR,
  },
  image: {
    width: 18,
    height: 18,
    marginHorizontal: 5,
  },
  card: {
    //borderColor: DEFAULT_LIGHT_GREY_COLOR,
    // borderRadius: 10,
    marginVertical: 10,
    marginTop: 10,
  },
  text: {
    flexDirection: 'row',
    // paddingHorizontal: wp(10),
  },
  details: {
    flexDirection: 'row',
    // margin: wp(5),
    paddingVertical: wp(5),
  },
  imagesize: {
    width: 20,
    height: 20,
  },
  alignment: {
    textAlign: 'center',
    marginHorizontal: wp(8),
  },
  // schoolCardLabel: {
  //   fontFamily: theme.fontFamily.primaryRegular,
  //   fontSize: theme.fontSizes.sm1,
  // },
});
