import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Alert,
  PermissionsAndroid,
  Platform,
  BackHandler,
  RefreshControl,
  DeviceEventEmitter,
  Image,
} from 'react-native';
import {
  Row,
  Col,
  Button,
  Container,
  Content,
  Toast,
  Icon,
  Left,
  Right,
  Body,
  Title,
  Header,
  Card,
} from 'native-base';
import Autocomplete from 'react-native-autocomplete-input';
import {connect} from 'react-redux';
import {Overlay} from 'react-native-elements';
import moment from 'moment';
import {withTranslation} from 'react-i18next';

//  redux state Actions
import {getOldList} from '../../../redux/actions/oldpatient_action';
import {
  selectMicroTemplate,
  fetchMicroTemplatesuccess,
} from '../../../redux/actions/template_action';

import {fetchPatientSuccess} from '../../../redux/actions/appointment_action';

//  theme colors
import {
  APP_PRIMARY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  FONT_FAMILY,
} from '../../../themes/variable';

// APi service
// import API from '../../../services/Api';

// image components
import HistoryImage from '../ImageComponents/HistoryImage';
import CalendarBlack from '../ImageComponents/CalendarBlack';
import CovidMonitoring from '../ImageComponents/CovidMonitoring';
import PatientEdit from '../ImageComponents/PatientEdit';
import PatientPdf from '../ImageComponents/PatientPdf';
import WhatsApp from '../ImageComponents/WhatsApp';
import VideoCamera from '../ImageComponents/VideoCamera';
import Headers from '../../app/common/Headers';
import styles from './ListOfPatientsStyles';

// components
import PatientSearchCard from './PatientSearchCard';

//  styles
// import styles from './PatientsStyles';
import getBaseUrl, {getDevelopmentUrl, getApiUrl} from '../../../config/Config';
import {TwilioConnection} from '../../../redux/actions/TwilioActions';
import AsyncStorage from '@react-native-community/async-storage';
import {NativeToast, NativeToastTop} from '../../app/common/Toaster';
import back_arrow from '../../../assets/images/back_arrow.png';
import i18n from '../../../../i18n';
import {wp} from '../../../themes/Scale';
import ApiCall from '../../../services/ApiCall';

function ListOfPatients(props) {
  const {navigation} = props;
  const [listOfPatient, setListOfPatient] = useState([]);
  const [searchText, setSearchText] = useState();

  const listOfpatients = async () => {
    try {
      const url =
        getBaseUrl() +
        `v1/doctor/${global.doctor_id}/patient/all?search_text=${
          global.search_text && global.search_text.length >= 3
            ? global.search_text
            : ''
        }`;

      const response = await ApiCall.get(url);
      setListOfPatient(response?.data?.patients);
      global.search_text=''
    } catch (error) {
      console.log('error in the list of person ', error);
    }
  };

  const renderHeader = () => {
    return (
      <Headers
        title={'Patients'}
        navigation={navigation}
        type={'list_of_patients'}
        setSearchText={setSearchText}
        listOfpatients={() => listOfpatients()}
        searchText={searchText}
      />
    );
  };

  useEffect(async () => {
    await listOfpatients();
  }, []);

  return (
    <View>
      {renderHeader()}
      <ScrollView style={styles.scrollViewStyle}>
        {listOfPatient && listOfPatient.length > 0 ? (
          listOfPatient.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PatientsDetails', {
                    navigation: navigation,
                    person_details: item,
                  });
                }}>
                <View
                  style={[styles.onGoingOrderMainView, styles.screenPadding]}>
                  <View style={styles.viewStyle}></View>
                  <View style={styles.person}>
                    <View>
                      <Text style={styles.personStyle}>
                        <Icon
                          testID="personIcon"
                          accessibilityLabel="personIcon"
                          name="person"
                          type="Ionicons"
                          style={styles.personIcon}
                        />
                      </Text>
                    </View>
                    <View style={styles.age}>
                      <Text>{item?.person_details?.full_name}</Text>
                      <Text>
                        {item?.person_details?.gender} ,{' '}
                        {item?.person_details?.age}{' '}
                      </Text>
                    </View>
                    {item?.person_details?.email ? (
                      <View style={styles.email}>
                        <View>
                          <Text style={styles.emailStyle}>
                            <Icon
                              testID="mailIcon"
                              accessibilityLabel="mailIcon"
                              name="mail"
                              type="Ionicons"
                              style={styles.emailIcon}
                            />
                          </Text>
                        </View>
                        <View style={styles.emailText}>
                          <Text style={styles.emailTextStyle}>
                            {item?.person_details?.email}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    {/* <View
                  style={{
                    // borderWidth: 1,
                    borderLeftWidth: wp(1),
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    borderColor: DEFAULT_LIGHT_GREY_COLOR,
                    marginTop: wp(-50),
                    marginLeft: 'auto',
                    width: 200,
                    height: 20,
                  }}
                /> */}

                    <View
                      style={{
                        marginTop: item?.person_details?.email
                          ? item?.person_details?.email?.length >= 25
                            ? wp(-67)
                            : wp(-55)
                          : wp(-15),
                        marginLeft: item?.person_details?.email
                          ? wp(210)
                          : wp(0),
                      }}>
                      <View>
                        <Text style={styles.phone}>
                          <Icon
                            testID="callIcon"
                            accessibilityLabel="callIcon"
                            name="call"
                            type="Ionicons"
                            style={styles.phoneIcon}
                          />
                        </Text>
                      </View>
                      <View style={styles.phoneTextView}>
                        <Text>
                          {item?.person_details?.phone_code}-
                          {item?.person_details?.phone_no}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No Appointments available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
export default ListOfPatients;
