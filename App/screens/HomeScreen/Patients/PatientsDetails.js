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
  DEFAULT_BACKGROUND_COLOR,
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
import getBaseUrl from '../../../config/Config';
import ApiCall from '../../../services/ApiCall';
import {wp} from '../../../themes/Scale';
import calender from '../../../assets/images/cal.png';
import Timeline from '../../app/patienhistory/timeline/Timeline';

function PatientsDetails(props) {
  const {navigation} = props;
  const {person_details} = props.navigation.state.params;

  const renderHeaders = () => {
    return (
      <Headers
        title={'Patient ' + person_details?.person_details?.full_name}
        navigation={navigation}
        type={'person_details'}
      />
    );
  };

  useEffect(() => {}, []);
  return (
    <View style={{marginBottom: -70}}>
      {renderHeaders()}

      <View>
        <Timeline navigation={navigation} person_details={person_details} />
      </View>
    </View>
  );
}
export default PatientsDetails;
