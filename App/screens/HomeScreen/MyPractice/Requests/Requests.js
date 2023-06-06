import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import {Button, Container, InputGroup, Toast} from 'native-base';
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

// images
import Close from '../../../../assets/images/close.svg';
import Accept from '../../../../assets/images/accept.svg';
import Decline from '../../../../assets/images/decline.svg';

// styles
import styles from './RequestsStyles';

// components
import HospitalDetailsCard from './HospitalDetailsCard';
import HospitalBody from './HospitalBody';
import HospitalActions from './HospitalActions';
import HospitalFooter from './HospitalFooter';

// dummy json object

import {dummyJson} from '../Constants';
import DeclineCheckBox from './DeclineCheckBox';
import RequestCallOptions from '../../CustomComponents/RequestCallOptions/RequestCallOptions';

// services

import {
  getDoctorNewPracticeList,
  acceptNewPractice,
  declineNewPractice,
} from '../../../../services/MyPracticeService';
import {nameConversion} from '../../../../utils/NameConversion';

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorData: dummyJson,
      selectedRequest: {},
      acceptModal: false,
      declineModal: false,
      callOptions: false,
      new_practices: [],
      refreshing: false,
    };
  }

  getDoctorNewRequestList = async () => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorid');
      const doctorNewPractices = await getDoctorNewPracticeList(doctorId);
      if (doctorNewPractices && doctorNewPractices?.data) {
        this.setState({
          new_practices: doctorNewPractices.data,
        });
      }
    } catch (error) {
      Toast.show({
        text: t('MY_PRACTICES.ERRORS.GET_NEW_PRACTICE_ERROR'),
        type: 'danger',
        duration: 3000,
      });
      throw error;
    }
  };

  componentDidMount() {
    this.getDoctorNewRequestList();
  }

  renderRequestTextInfo = (text,testID) => {
    const {t} = this.props;
    return (
      <View style={[styles.screenPadding, styles.requestInfoView]}>
        <Text style={styles.requestInfoText}
        testID={testID} accessibilityLabel={testID}>
          {text}
          {/* {t('MY_PRACTICES.REQUESTS.NEW_REQUEST_APPROVAL_TEXT')} */}
        </Text>
      </View>
    );
  };

  renderHorizontalLine = () => {
    return <View style={styles.horizontalLine} />;
  };

  requestAccepted = (item) => {
    this.setState({
      selectedRequest: item,
      acceptModal: true,
      declineModal: false,
    });
  };

  requestDeclined = (item) => {
    this.setState({
      selectedRequest: item,
      declineModal: true,
      acceptModal: false,
    });
  };

  enableCallOptions = (item) => {
    this.setState({
      callOptions: !this.state.callOptions,
      selectedRequest: item,
    });
  };

  renderRequestCard = (item, index) => {
    return (
      <View style={styles.cardMainView} key={index}>
        <View style={styles.screenPadding}>
          {/* hospital details */}
          <HospitalDetailsCard item={item} />
          {/* horizontal line */}
          {this.renderHorizontalLine()}
          {/* hospital body */}
          <HospitalBody item={item} />
          {/* actions */}
          <HospitalActions
            acceptAction={() => this.requestAccepted(item)}
            declineActions={() => this.requestDeclined(item)}
          />
        </View>
        {this.renderHorizontalLine()}
        {/* footer section */}
        <HospitalFooter
          item={item}
          action={() => this.enableCallOptions(item)}
        />
      </View>
    );
  };

  renderAllNewRequests = (list) => {
    return list.map((element, index) => this.renderRequestCard(element, index));
  };

  acceptPractice = async () => {
    const {t} = this.props;
    const selectedRequested = this.state.selectedRequest;
    try {
      const doctorId = await AsyncStorage.getItem('doctorid');

      const role = await AsyncStorage.getItem('role');

      const payload = {};

      payload.doctor_status = 'app';

      // COMMENTED CODE FOR FUTURE REFERENCE
      // if (role.toLowerCase() === 'doctor' && !selectedRequested.standalone) {
      //   Toast.show({
      //     text: t('MY_PRACTICES.ERRORS.ACCESS_ROLE_ERROR'),
      //     type: 'warning',
      //     duration: 5000,
      //   });
      //   this.setState({
      //     acceptModal: false,
      //   });
      //   return;
      // }

      // if (role.toLowerCase() === 'practice') {
      //   payload.doctor_status = 'ap';
      // } else if (
      //   role.toLowerCase() === 'execution team' ||
      //   selectedRequested.standalone
      // ) {
      //   payload.doctor_status = 'app';
      // }
      const response = await acceptNewPractice(
        doctorId,
        selectedRequested.work_timing_id,
        payload,
      );
      if (response) {
        Toast.show({
          text: t('MY_PRACTICES.ERRORS.NEW_REQUEST_ACCEPT_SUCCESS'),
          type: 'success',
          duration: 5000,
        });
        this.getDoctorNewRequestList();
        this.props.updateActiveTab(0);
      }
    } catch (error) {
      Toast.show({
        text: t('MY_PRACTICES.ERRORS.NEW_REQUEST_ACCEPT_ERROR'),
        type: 'danger',
        duration: 3000,
      });
      throw error;
    } finally {
      this.setState({
        acceptModal: false,
      });
    }
  };

  declinePractice = async () => {
    const {t} = this.props;
    const selectedRequested = this.state.selectedRequest;
    try {
      const doctorId = await AsyncStorage.getItem('doctorid');

      const role = await AsyncStorage.getItem('role');

      const payload = {
        doctor_status: 'declined',
      };

      // COMMENTED CODE FOR FUTURE REFERENCE
      // if (role.toLowerCase() === 'doctor' && !selectedRequested.standalone) {
      //   Toast.show({
      //     text: t('MY_PRACTICES.ERRORS.DECLINE_ROLE_ERROR'),
      //     type: 'warning',
      //     duration: 5000,
      //   });
      //   this.setState({
      //     declineModal: false,
      //   });
      //   return;
      // }

      const response = await declineNewPractice(
        doctorId,
        selectedRequested.work_timing_id,
        payload,
      );
      if (response) {
        Toast.show({
          text: t('MY_PRACTICES.ERRORS.DECLINE_SUCCESS'),
          type: 'success',
          duration: 5000,
        });
        this.getDoctorNewRequestList();
        this.props.updateActiveTab(0);
      }
    } catch (error) {
      Toast.show({
        text: t('MY_PRACTICES.ERRORS.NEW_REQUEST_DECLINED_ERROR'),
        type: 'danger',
        duration: 3000,
      });
      throw error;
    } finally {
      this.setState({
        declineModal: false,
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getDoctorNewRequestList().then(() => {
      this.setState({refreshing: false});
    });
  };

  closeAcceptModal = async () => {
    this.setState({
      acceptModal: false,
    });
  };

  closeDeclineModal = () => {
    this.setState({
      declineModal: false,
    });
  };

  handleCheckBox = (key) => {
    const selectedRequested = this.state.selectedRequest;

    if (selectedRequested[key]) {
      selectedRequested[key] = false;
    } else {
      selectedRequested[key] = true;
    }
    this.setState({
      selectedRequested: selectedRequested,
    });
  };

  renderDeclineModal = () => {
    const selectedRequested = this.state.selectedRequest;
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.declineModal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeDeclineModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          <View style={styles.headerView}>
            <View
              style={[
                styles.flexDirectionRow,
                styles.hospitalViewMargin,
                styles.width90,
              ]}>
              <Text style={styles.acceptModalHeaderText}>
                {t('MY_PRACTICES.REQUESTS.DECLINE_WORK_WITH')}{' '}
                {nameConversion(selectedRequested.branch_name)}{' '}
                {t('MY_PRACTICES.REQUESTS.AT')}{' '}
                {nameConversion(selectedRequested.CITY)}
              </Text>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity
                style={[styles.touchableArea, styles.closeIcon]}
                onPress={() => this.closeDeclineModal()}>
                <Close height={15} width={15} style={styles.closeImage} />
              </TouchableOpacity>
            </View>
          </View>
          {/*  decline check boxes section start */}
          <View style={styles.checkBoxActionsView}>
            <Text style={styles.declineReasonText}>
              {t('MY_PRACTICES.REQUESTS.SPECIFY_REASON')}
            </Text>
            {/* check boxes */}

            <DeclineCheckBox
              value={selectedRequested.busy_with_other_hospital}
              text={t('MY_PRACTICES.REQUESTS.BUSY_WITH_OTHER')}
              action={() => this.handleCheckBox('busy_with_other_hospital')}
            />
            <DeclineCheckBox
              value={selectedRequested.far_from_my_location}
              text={t('MY_PRACTICES.REQUESTS.FAR_LOCATION')}
              action={() => this.handleCheckBox('far_from_my_location')}
            />
            <DeclineCheckBox
              value={selectedRequested.not_interested}
              text={t('MY_PRACTICES.REQUESTS.NOT_INTERESTED')}
              action={() => this.handleCheckBox('not_interested')}
            />

            <DeclineCheckBox
              value={selectedRequested.other}
              text={t('MY_PRACTICES.REQUESTS.OTHER')}
              action={() => this.handleCheckBox('other')}
            />

            <TextInput multiline={true} style={styles.additionalTextInput} />

            <View style={styles.modalAcceptButtonView}>
              <Button
                style={styles.modalDeclineButton}
                onPress={() => this.declinePractice()}>
                <Decline />
                <Text style={styles.declineText}>
                  {t('MY_PRACTICES.REQUESTS.DECLINE')}
                </Text>
              </Button>
            </View>
          </View>
          {/*  decline check boxes section end */}
        </View>
      </Modal>
    );
  };
  renderAcceptModal = () => {
    const selectedRequested = this.state.selectedRequest;
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.state.acceptModal}
        backdropOpacity={0.5}
        onBackdropPress={() => this.closeAcceptModal()}
        style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          <View style={styles.headerView}>
            <View
              style={[
                styles.flexDirectionRow,
                styles.hospitalViewMargin,
                styles.width90,
              ]}>
              <Text style={styles.acceptModalHeaderText}>
                {t('MY_PRACTICES.REQUESTS.ACCEPT_WORK_WITH')}{' '}
                {nameConversion(selectedRequested.branch_name)}{' '}
                {t('MY_PRACTICES.REQUESTS.AT')}{' '}
                {nameConversion(selectedRequested.CITY)}
              </Text>
            </View>
            <View style={styles.closeView}>
              <TouchableOpacity
                style={[styles.touchableArea, styles.closeIcon]}
                onPress={() => this.closeAcceptModal()}>
                <Close height={15} width={15} style={styles.closeImage} />
              </TouchableOpacity>
            </View>
          </View>
          {/* modal Body */}
          <View style={styles.modalBody}>
            <HospitalDetailsCard item={selectedRequested} />
            {/* horizontal line */}
            {this.renderHorizontalLine()}
            {/* hospital body */}
            <HospitalBody item={selectedRequested} />
          </View>
          {/* modal accept  button */}
          <View style={styles.modalAcceptButtonView}>
            <Button
              style={styles.modalAcceptButton}
              onPress={() => this.acceptPractice()}>
              <Accept />
              <Text style={styles.acceptText}>
                {t('MY_PRACTICES.REQUESTS.YES_ACCEPT')}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  closeCallOptionModal = () => {
    this.setState({
      callOptions: false,
    });
  };

  renderRequestCallOptions = () => {
    const selectedRequest = this.state.selectedRequest;
    const {t} = this.props;
    return (
      <RequestCallOptions
        callText={t('MY_PRACTICES.CALL_US_TEXT')}
        callSubText={t('MY_PRACTICES.CALL_US_SUB_TEXT')}
        emailText={t('MY_PRACTICES.EMAIL_TEXT')}
        emailSubText={t('MY_PRACTICES.EMAIL_SUB_TEXT')}
        closeAction={() => this.closeCallOptionModal()}
        phoneNumber={selectedRequest.MOBILE.split('-')[1]}
        email={selectedRequest.EMAIL}
      />
    );
  };

  render() {
    const {new_practices} = this.state;

    const {t} = this.props;

    return (
      <Container style={styles.requestWrapper}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {new_practices.length > 0
            ? this.renderRequestTextInfo(
                t('MY_PRACTICES.REQUESTS.NEW_REQUEST_APPROVAL_TEXT'),"newRequestApprovalText"
              )
            : this.renderRequestTextInfo(
                t('MY_PRACTICES.REQUESTS.NO_NEW_REQUEST_APPROVAL_TEXT'),"nothaveRequestForPracticeApprovalText"
              )}

          {this.state.new_practices &&
            this.renderAllNewRequests(this.state.new_practices)}
          {this.state.acceptModal && this.renderAcceptModal()}
          {this.state.declineModal && this.renderDeclineModal()}
          {this.state.callOptions && this.renderRequestCallOptions()}
        </ScrollView>
      </Container>
    );
  }
}

export default withTranslation()(Requests);
