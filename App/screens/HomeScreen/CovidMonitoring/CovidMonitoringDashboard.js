import React, {Component} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Dimensions,
  Image,
  TextInput,
  ToastAndroid,
  Platform,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Container, Item, Toast} from 'native-base';
import {connect} from 'react-redux';
import moment from 'moment';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import getBaseUrl, { getApiUrl } from '../../../config/Config';
import {
  getPracticeBranchList,
  getDoctorList,
  getCovidMonitorCounts,
} from '../../../redux/actions/covidmonitoring_action';

import {
  ACTIVE_PATIENTS_COLOR,
  NOT_COMPLETED_COLOR,
  HIGH_RISK_COLOR,
  MODERATE_RISK_COLOR,
  LOW_RISK_COLOR,
  CLOSED_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
} from '../../../themes/variable';
import styles from './CovidMonitoringDashboardStyle';
import {isPortrait} from './Utils/Utils';

// images

import Close from '../../../assets/images/close.png';
import DropDown from '../../../assets/images/dropdown.png';
import CovidMonitoringIcon from '../../../assets/images/covid_illustration.png';
import GuideLinesIcon from '../../../assets/images/guidelines.png';
import Family from '../../../assets/images/family.png';
import ChangeDateIcon from '../../../assets/images/dateIcon.png';

// API service
import API from '../../../services/Api';
import {Picker} from '@react-native-picker/picker';

class CovidMonitorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      token: '',
      doctor_id: '',
      selected_doctor_id: '',
      practice_id: '',
      practice_name: '',
      branch_id: '',
      branch_name: '',
      date: new Date(),
      refreshing: false,
      portrait: isPortrait(),
      show: false,
      doctorModal: false,
      doctorList: [],
      loader: false,
      counts: {},
      helpDoc: null,
      pdfUrl: null
    };

    this.statusTypes = [
      {
        status: 'active_patients',
        color: ACTIVE_PATIENTS_COLOR,
      },
      {
        status: 'not_completed',
        color: NOT_COMPLETED_COLOR,
      },
      {
        status: 'high_risk',
        color: HIGH_RISK_COLOR,
      },
      {
        status: 'moderate_risk',
        color: MODERATE_RISK_COLOR,
      },
      {
        status: 'low_risk',
        color: LOW_RISK_COLOR,
      },
      {
        status: 'closed',
        color: CLOSED_COLOR,
      },
    ];

    Dimensions.addEventListener('change', () => {
      this.setState({portrait: isPortrait()});
    });

    this.onHospitalChange = this.onHospitalChange.bind(this);
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.openGuidelines = this.openGuidelines.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.redirectToNotifications = this.redirectToNotifications.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
  }

  componentDidMount() {
    this.init();
    this.props.navigation.setParams({
      redirectToNotifications: this.redirectToNotifications,
    });
    this.Apicallmethod();
    this.props.navigation.addListener('willFocus', this._handleStateChange);
  }

  _handleStateChange = (state) => {
    if (this.state.init) {
      this.setState({init: false});
      return;
    }
    this.getCovidMonitorCounts();
  };

  redirectToNotifications() {
    this.props.navigation.navigate('notificationsList');
  }

  init = async () => {
    try {
      const doctor_id = await AsyncStorage.getItem('doctorid');
      const token = await AsyncStorage.getItem('userToken');
      const branch_id = await AsyncStorage.getItem('branch_id');

      this.setState({
        token,
        doctor_id,
        selected_doctor_id: doctor_id,
        branch_id,
      });

      await this.props.getPracticeBranchList({
        id: doctor_id,
        token: token,
        doctor_flag: '1',
      });
      this.setState({
        loader: false,
      });
      if (this.props.practiceBranchList) {
        const [selectedHospital] = this.props.practiceBranchList?.filter(
          (item) => {
            return item.branch_id === branch_id;
          },
        );

        if (selectedHospital) {
          this.setState(
            {
              practice_id: selectedHospital.practice_id,
              practice_name: selectedHospital.practice_name,
              branch_id: selectedHospital.branch_id,
              branch_name: selectedHospital.branch_name,
              selected_doctor_id: this.state.doctor_id,
            },
            () => this.getDoctorList(),
          );
        } else if (this.props.practiceBranchList?.[0]) {
          this.setState(
            {
              practice_id: this.props.practiceBranchList[0].practice_id,
              practice_name: this.props.practiceBranchList[0].practice_name,
              branch_id: this.props.practiceBranchList[0].branch_id,
              branch_name: this.props.practiceBranchList[0].branch_name,
              selected_doctor_id: this.state.doctor_id,
            },
            () => this.getDoctorList(),
          );
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  getDoctorList = async () => {
    const payload = {
      id: this.state.doctor_id,
      token: this.state.token,
      practice_id: this.state.practice_id,
      branch_id: this.state.branch_id,
      doctor_flag: '1',
      role: await AsyncStorage.getItem('role'),
    };
    await this.props.getDoctorList(payload);
    this.setState(
      {
        doctorList: this.props.doctorList,
        loader: true,
      },
      () => this.getCovidMonitorCounts(),
    );
  };

  getCovidMonitorCounts = async () => {
    try {
      const payload = {
        id: this.state.doctor_id,
        token: this.state.token,
        practiceid: this.state.practice_id,
        branchid: this.state.branch_id,
        filter_date: moment(this.state.date).format('YYYY-MM-DD'),
        selected_doctor_nh_id: this.state.selected_doctor_id,
        doctor_flag: '1',
        role: await AsyncStorage.getItem('role'),
      };

      const response = await API.call(
        'post',
        'get_covid_monitor_count/',
        payload,
      );
      if (response && response?.data && response?.data?.count) {
        this.setState({
          counts: response.data.count,
        });
        // await this.props.getCovidMonitorCounts(payload);
      }
    } catch (error) {
      Toast.show({
        text: error && error?.message,
        type: 'danger',
        duration: 3000,
      });
    } finally {
      this.setState({
        loader: false,
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true, loader: true});
    this.getCovidMonitorCounts().then(() => {
      this.setState({refreshing: false, loader: false});
    });
  };

  onDoctorChange(value) {
    // const [selectedDoctor] = this.props.doctorList?.filter((item) => {
    //   return item.doctor_id === value;
    // });

    // if (!selectedDoctor) {
    //   return;
    // }

    // this.setState(
    //   {
    //     selected_doctor_id: selectedDoctor.doctor_id,
    //   },
    //   () => this.getCovidMonitorCounts(),
    // );
    this.setState(
      {
        selected_doctor_id: value,
      },
      () => this.getCovidMonitorCounts(),
    );
  }

  toggleDatePicker() {
    this.setState((prevState) => ({
      show: !prevState.show,
    }));
  }

  onHospitalChange(value) {
    const [selectedHospital] = this.props.practiceBranchList?.filter((item) => {
      return item.branch_id === value;
    });

    if (!selectedHospital) {
      return;
    }

    this.setState(
      {
        practice_id: selectedHospital.practice_id,
        practice_name: selectedHospital.practice_name,
        branch_id: selectedHospital.branch_id,
        branch_name: selectedHospital.branch_name,
      },
      () => this.getDoctorList(),
    );
  }

  onDateChange(dateObj) {
    this.setState(
      {
        date: dateObj,
        show: false,
      },
      () => this.getCovidMonitorCounts(),
    );
  }

  Apicallmethod = () => {
    let url = getBaseUrl() + 'v1/public/help-document-details';
    let response = fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          helpDoc: response.data.help_document_details,
        });
        var onlyPDFCovidMonitObj = this.state.helpDoc.find(o => o.key == 'doctor_app_covid_monitoring')
        //console.log("pdf url obj", onlyPDFCovidMonitObj);
        //console.log("pdf url here", onlyPDFCovidMonitObj.value );
        this.setState({pdfUrl: onlyPDFCovidMonitObj.value})
      })
      .catch(error => {
        console.error(error);
      });
      // console.log("base urls"+base_url);
      // console.log("api url"+api_url);
      // console.log("url"+url);

  };

  openGuidelines() {
    const {t} = this.props;
    if(this.state.pdfUrl){
      this.props.navigation.navigate('ViewPdf', {
        link: getApiUrl()+ '/' + this.state.pdfUrl,
        title: t('PROFILE.HOME_CARE_GUIDE_LINES'),
      });
    }else{
      Platform.OS == 'android' ?  ToastAndroid.show("Unable to fetch help url") : null;
    }
  }

  renderActivityIndicator() {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={DEFAULT_WHITE_COLOR} />
      </View>
    );
  }

  renderGuidelines() {
    const {t} = this.props;
    return (
      <View style={[styles.guidelinesView, styles.guideLinesMainView]}>
        <View style={styles.guideLinesTextView}>
          <View>
            <Text style={styles.guideLinesText}
            testID="guidelinesText"
            accessibilityLabel="guidelinesText">
              {t('DASHBOARD.GUIDELINES_TEXT')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.guideLineTouchableView}
            onPress={() => this.openGuidelines()}>
            <Image
              source={GuideLinesIcon}
              style={styles.guideLineImage}></Image>
            <Text style={styles.guideText}
            testID="goToGuidelinesText"
            accessibilityLabel="goToGuidelinesText">
              {t('DASHBOARD.GO_TO_GUIDELINES')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.guideLineImageView}>
          <Image source={Family} style={styles.familyImageStyles}
           testID="familyImage"
           accessibilityLabel="familyImage"></Image>
        </View>
      </View>
    );
  }

  navigation = async (status) => {
    const {navigation} = this.props;

    await AsyncStorage.setItem('status', status);
    navigation.navigate('CovidMonitoringPatientList', {
      token: this.state.token,
      status: status,
      date: this.state.date,
      doctor_id: this.state.doctor_id,
      practice_id: this.state.practice_id,
      branch_id: this.state.branch_id,
      branch_name: this.state.branch_name,
      selected_doctor_id: this.state.selected_doctor_id,
    });
  };
  renderCounts({item}) {
    const {t} = this.props;
    return (
      <TouchableOpacity
        key={item.status}
        style={[
          styles.eachCountView,
          {
            backgroundColor: item.color,
          },
        ]}
        onPress={() =>
          this.props.navigation.navigate('CovidMonitoringPatientList', {
            token: this.state.token,
            status: item.status,
            date: this.state.date,
            doctor_id: this.state.doctor_id,
            practice_id: this.state.practice_id,
            branch_id: this.state.branch_id,
            branch_name: this.state.branch_name,
            selected_doctor_id: this.state.selected_doctor_id,
          })
        }
        testID={"button"+item.status.toUpperCase()}
        accessibilityLabel={"button"+item.status.toUpperCase()}>
        <Text style={styles.countLabel}
        testID={"text"+item.status.toUpperCase()}
        accessibilityLabel={"text"+item.status.toUpperCase()}>
          {t('COVID_MONITORING.' + item.status.toUpperCase())}
        </Text>
        <View style={styles.flexDirectionRow}>
          <Text style={styles.countValue}
          testID="countText"
          accessibilityLabel="countText">
            {/* {this.props.isLoading && this.renderActivityIndicator()}
            {!this.props.isLoading &&
              this.props.covidMonitorCounts?.[item.status]} */}

            {this.state.loader && this.renderActivityIndicator()}
            {!this.state.loader && this.state.counts?.[item.status]}
          </Text>
          <View style={styles.imageView}>
            <Image source={CovidMonitoringIcon} style={styles.imageStyles} 
            testID="covidMonitoringIcon"
            accessibilityLabel="covidMonitoringIcon"/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderCountsInfo() {
    return (
      <SafeAreaView style={[styles.countsView, {padding: 5}]}>
        <FlatList
          data={this.statusTypes}
          renderItem={this.renderCounts.bind(this)}
          keyExtractor={(item) => item.status}
          key={this.state.portrait ? '_' : '#'}
          numColumns={this.state.portrait ? 2 : 3}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
        {this.renderGuidelines()}
      </SafeAreaView>
    );
  }

  handleDoctors() {
    this.setState({
      doctorModal: true,
    });
  }

  renderDoctorName(id, list) {
    const [selectedDoctor] = list?.filter((item) => {
      return item.doctor_id === id;
    });
    if (selectedDoctor) {
      return `${selectedDoctor.salutation}. ${selectedDoctor.first_name} ${selectedDoctor.last_name}`;
    } else {
      return '';
    }
  }

  onDateCancel() {
    this.setState({show: false});
  }
  renderDoctorInfo() {
    const {t} = this.props;
    let minDate = new Date();
    minDate.setMonth(minDate.getMonth() - 6);
    return (
      <View>
        {/* doctor drop down section  start */}
        <View style={styles.doctorDropDownSectionView}>
          <TouchableOpacity
            onPress={() => this.handleDoctors()}
            style={styles.doctorSectionTouchableView}>
            <View style={styles.doctorNameView}>
              <Text numberOfLines={1}
              testID={this.state.selected_doctor_id+this.props.doctorList+"text"}
              accessibilityLabel={this.state.selected_doctor_id+this.props.doctorList+"text"}>
                {this.renderDoctorName(
                  this.state.selected_doctor_id,
                  this.props.doctorList,
                )}
              </Text>
            </View>
            <View style={styles.filledDropDownView}>
              <Image source={DropDown} style={styles.dropDownArrow} />
            </View>
          </TouchableOpacity>
        </View>
        {/* doctor drop down section  start */}

        {/* status and date picker section */}
        <View style={styles.datePickerSection}>
          <View style={styles.textViewWidth}>
            <Text style={styles.dateText}
            testID="dateInformationText"
            accessibilityLabel="dateInformationText">{t('DASHBOARD.DATE_INFO_TEXT')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.setState({show: true})}
            style={styles.changeDateTouchableView}>
            <Text
            testID={this.state.date+"text"}
            accessibilityLabel={this.state.date+"text"}>{moment(this.state.date).format('DD-MMM-YYYY')}</Text>
            <Image source={ChangeDateIcon} style={styles.dateIconStyles} 
            testID="changeDateIcon"
            accessibilityLabel="changeDateIcon"/>
          </TouchableOpacity>
        </View>
        {/* status and date picker section */}
        
        {/* date time picker modal */}
        <DateTimePickerModal
        testID="dateTimePicker"
        accessibilityLabel="dateTimePicker"
          isVisible={this.state.show}
          mode="date"
          date={new Date(this.state.date)}
          minimumDate={new Date(minDate)}
          maximumDate={new Date()}
          onConfirm={this.onDateChange}
          onCancel={this.toggleDatePicker}
        />        
      </View>
    );
  }

  renderHospitalInfo() {
    return (
      <View style={styles.hospitalInfoView}>
        <Item picker>
          <Picker
          testID="practiceNameDropDown"
          accessibilityLabel="practiceNameDropDown"
            style={styles.picker}
            selectedValue={this.state.branch_id}
            onValueChange={this.onHospitalChange}>
            {this.props.practiceBranchList &&
              this.props.practiceBranchList.map((item, index) => (
                <Picker.Item
                  label={`${item.practice_name} - ${item.branch_name}`}
                  value={item.branch_id}
                  key={index}
                />
              ))}
          </Picker>
        </Item>
      </View>
    );
  }

  closeDoctorModal() {
    this.setState({
      doctorModal: false,
    });
  }

  handleDoctorSearch(text) {
    let {doctorList} = this.props;

    if (text) {
      doctorList = doctorList?.filter(
        (item) =>
          item.salutation?.toLowerCase().includes(text.toLowerCase()) ||
          item.first_name?.toLowerCase().includes(text.toLowerCase()) ||
          item.last_name?.toLowerCase().includes(text.toLowerCase()),
      );
    }

    this.setState({
      doctorList,
    });
  }

  getDoctorCounts(doctor_id) {
    this.onDoctorChange(doctor_id);
    // get doctor counst
    this.setState({
      doctorList: this.props.doctorList,
      doctorModal: false,
      // loader: true,
    });
  }
  renderDoctorNames(doctorList) {
    const {t} = this.props;
    if (doctorList.length) {
      return doctorList.map((item, index) => (
        <View style={styles.doctorViewStyles} key={index}>
          <TouchableOpacity
            onPress={() => this.getDoctorCounts(item.doctor_id)}>
            <Text
            testID={item.first_name+item.last_name+"text"}
            accessibilityLabel={item.first_name+item.last_name+"text"}>{`${item.salutation}. ${item.first_name} ${item.last_name}`}</Text>
          </TouchableOpacity>
        </View>
      ));
    } else {
      return (
        <View>
          <Text
          testID="noDataText"
          accessibilityLabel="noDataText">{t('CLOSE_PATIENT.NO_DATA')}</Text>
        </View>
      );
    }
  }

  renderDoctorsList() {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.doctorModal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeDoctorModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.modalStyles}>
          <View style={styles.headerView}>
            <Text style={styles.headerText}
            testID="searchDoctorText"
            accessibilityLabel="searchDoctorText">
              {t('CLOSE_PATIENT.SEARCH_DOCTOR_TEXT')}
            </Text>
            <View style={styles.closeView}>
              <TouchableOpacity
                onPress={() => this.closeDoctorModal()}
                style={styles.touchableArea}
                testID="searchDoctorText"
                accessibilityLabel="searchDoctorText">
                <Image source={Close} style={[styles.closeImage]} 
                  testID="searchDoctorText"
                  accessibilityLabel="searchDoctorText"/>
              </TouchableOpacity>
            </View>
          </View>
          {/* search done */}
          <View style={styles.infoTextView}>
            <TextInput
            testID="searchTextInput"
            accessibilityLabel="searchTextInput"
              style={styles.textInputStyles}
              placeholder={t('CLOSE_PATIENT.SEARCH_PLACEHOLDER')}
              onChangeText={(text) => this.handleDoctorSearch(text)}
            />
          </View>

          {/* render doctor list */}
          <ScrollView>
            {this.renderDoctorNames(this.state.doctorList)}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor={APP_PRIMARY_COLOR}
          barStyle={'light-content'}
        />
        {this.renderDoctorInfo()}
        {this.renderCountsInfo()}
        {this.props.doctorList && this.renderDoctorsList()}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    practiceBranchList:
      state.practiceBranchList.response?.data?.practice_branch || [],
    doctorList: state.doctorList.response?.data?.doctor_list || [],
    covidMonitorCounts: state.covidMonitorCounts.response?.data?.count,
    isLoading: state.covidMonitorCounts.loading,
  };
};

export default withTranslation()(
  connect(mapStateToProps, {
    getPracticeBranchList,
    getDoctorList,
    getCovidMonitorCounts,
  })(CovidMonitorDashboard),
);
