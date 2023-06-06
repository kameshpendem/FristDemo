import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {
  Button,
  Container,
  Icon,
  Textarea,
  Card,
  CardItem,
  Toast,
  CheckBox,
} from 'native-base';
import {Portal, FAB} from 'react-native-paper';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';

import {
  getCovidNotes,
  getStandardNotes,
  saveCovidNotesData,
} from '../../../../redux/actions/covidmonitoring_action';
import UploadFileModal from '../../Common/UploadFileModal';
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_MEDIUM_BLUE_COLOR,
  APP_PRIMARY_COLOR,
  REVIEW_NOTES_BACKGROUND_TEXT_COLOR,
  REVIEW_NOTES_NURSE_COLOR,
  PHYSIOTHERAPIST_BACKGROUND_COLOR,
  DIETICIAN_BACKGROUND_COLOR,
} from '../../../../themes/variable';
import styles from './CovidMonitoringReviewTabStyle';
import ConfirmDialog from '../../Common/ConfirmDialog';

import API from '../../../../services/Api';
// images
import Attachments from '../../../../assets/images/attachments.svg';

class CovidMonitoringReviewTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      doctor_name: '',
      role: 'doctor',
      notes: '',
      dietician: false,
      physiotherapist: false,
      show: false,
      filter: '',
      covidNotes: [],
      type: null,
      confirmDialogData: {},
      showConfirm: false,
      doctorCount: '',
      nurseCount: '',
      physioCount: '',
      dieticianCount: '',
      loader: true,
    };

    this.filterBy = this.filterBy.bind(this);
    this.getFilterSelection = this.getFilterSelection.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
    this.updateIncluded = this.updateIncluded.bind(this);
    this.showUploadFileModal = this.showUploadFileModal.bind(this);
    this.hideUploadFileModal = this.hideUploadFileModal.bind(this);
    this.hideConfirmDialog = this.hideConfirmDialog.bind(this);
    this.renderStandardNotes = this.renderStandardNotes.bind(this);
  }

  componentDidMount() {
    this.init();
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  init = async () => {
    this.getCovidNotes();
    this.getStandardNotes();
    const doctor_name = await AsyncStorage.getItem('doctorname');
    const role = await AsyncStorage.getItem('role');
    this.setState({doctor_name, role});
  };

  onRefresh = () => {
    this.setState({refreshing: true, loader: true});
    this.getCovidNotes().then(() => {
      this.setState({refreshing: false, loader: false});
    });
  };

  getCovidNotes = async () => {
    const payload = {
      id: this.props.doctor_id,
      token: this.props.token,
      hlp_id: this.props.patient.hlpid,
      enc_id: this.props.patient.enc_id,
      date: this.props.patient.added_date,
      doctor_flag: '1',
      name: await AsyncStorage.getItem('doctorname'),
      role: await AsyncStorage.getItem('role'),
    };
    await this.props.getCovidNotes(payload);
    const covidNotes = this.props.covidNotes;
    let doctorCount = 0;
    let nurseCount = 0;
    let physioCount = 0;
    let dieticianCount = 0;
    covidNotes.forEach((element) => {
      if (element.created_user_type === 'doctor') {
        doctorCount++;
      } else if (element.created_user_type === 'nurse') {
        nurseCount++;
      } else if (element.created_user_type === 'physiotherapist') {
        physioCount++;
      } else if (element.created_user_type === 'dietician') {
        dieticianCount++;
      }
    });

    this.setState({
      covidNotes: this.props.covidNotes,
      filter: null,
      doctorCount,
      nurseCount,
      physioCount,
      dieticianCount,
    });
  };

  getStandardNotes = async () => {
    const payload = {
      id: this.props.doctor_id,
      token: this.props.token,
      doctor_flag: '1',
      name: await AsyncStorage.getItem('doctorname'),
      role: await AsyncStorage.getItem('role'),
    };
    await this.props.getStandardNotes(payload);
    this.setState({
      loader: false,
    });
  };

  saveNotes = async () => {
    const {t} = this.props;
    if (!this.state.notes) {
      Toast.show({
        text: t('MESSAGES.ENTER_NOTES'),
        type: 'warning',
        duration: 5000,
        position: 'top',
      });
      return;
    }
    const payload = {
      id: this.props.doctor_id,
      token: this.props.token,
      hlp_id: this.props.patient.hlpid,
      enc_id: this.props.patient.enc_id,
      role: this.state.role,
      name: this.state.doctor_name,
      notes: this.state.notes,
      dietician: this.state.dietician,
      physiotherapist: this.state.physiotherapist,
      date: this.props.patient.added_date,
      doctor_flag: '1',
    };

    // await this.props.saveCovidNotesData(payload);
    try {
      const response = await API.call(
        'post',
        'save_covid_notes_data/',
        payload,
      );
      if (response && response?.status_code === 200) {
        Toast.show({
          text:
            response?.message ||
            t('COVID_MONITORING.ADD_NOTES_SUCCESS_MESSAGE'),
          type: 'success',
          duration: 5000,
        });
      }
    } catch (error) {
      Toast.show({
        text: t('COVID_MONITORING.ADD_NOTES_WARNING_MESSAGE'),
        type: 'danger',
        duration: 5000,
      });
      throw error;
    }
    this.getCovidNotes();
    this.hideModal();
    this.props.updateShowBackAlert(false);
  };

  showModal() {
    this.setState({visible: true});
  }

  hideModal() {
    this.setState({
      visible: false,
      notes: '',
      dietician: false,
      physiotherapist: false,
    });
  }

  showUploadFileModal() {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({show: true});
    }, 500);
  }

  hideUploadFileModal(value) {
    if (value === 'navigate') {
      this.setState({
        show: false,
        visible: false,
        notes: '',
        dietician: false,
        physiotherapist: false,
      });
    } else {
      this.setState({
        show: false,
        visible: true,
      });
    }
  }

  onChangeText(text) {
    this.setState({notes: text});
  }

  updateIncluded(type) {
    this.setState((prevState) => ({
      [type]: !prevState[type],
    }));
    // if (
    //   (type === 'dietician' && !this.state.dietician) ||
    //   (type === 'physiotherapist' && !this.state.physiotherapist)
    // ) {
    //   this.showConfirmDialog(type);
    // } else {
    //   this.setState((prevState) => ({
    //     [type]: !prevState[type],
    //   }));
    // }
  }

  showConfirmDialog(type) {
    const {t} = this.props;
    let confirmDialogData = {};

    if (type === 'dietician') {
      confirmDialogData = {
        title: t('COVID_MONITORING.CONFIRM_DIETICIAN_DIALOG_TITLE'),
        content: t('COVID_MONITORING.CONFIRM_DIETICIAN_DIALOG_CONTENT'),
        noLabel: t('COMMON.NO'),
        yesLabel: t('COMMON.YES'),
      };
    } else if (type === 'physiotherapist') {
      confirmDialogData = {
        title: t('COVID_MONITORING.CONFIRM_PHYSIOTHERAPIST_DIALOG_TITLE'),
        content: t('COVID_MONITORING.CONFIRM_PHYSIOTHERAPIST_DIALOG_CONTENT'),
        noLabel: t('COMMON.NO'),
        yesLabel: t('COMMON.YES'),
      };
    }

    this.setState({
      showConfirm: true,
      type,
      confirmDialogData,
    });
  }

  hideConfirmDialog(confirm) {
    const {type} = this.state;
    if (confirm) {
      this.setState((prevState) => ({
        [type]: !prevState[type],
      }));
    }

    this.setState({
      showConfirm: false,
      type: null,
      confirmDialogData: {},
    });
  }

  filterBy(filter) {
    this.setState(
      {
        covidNotes: [],
      },
      () => {
        if (this.state.filter === filter) {
          this.setState({filter: null, covidNotes: this.props.covidNotes});
        } else {
          const covidNotes = this.props.covidNotes.filter((each) =>
            each.created_user_type?.toLowerCase().includes(filter),
          );
          this.setState({filter: filter, covidNotes: covidNotes}, () => {});
        }
      },
    );
  }

  getFilterSelection(type) {
    if (this.state.filter === type) {
      return {
        backgroundColor: APP_PRIMARY_COLOR,
        color: DEFAULT_WHITE_COLOR,
        fontSize: 12,
      };
    } else {
      return {
        backgroundColor: DEFAULT_WHITE_COLOR,
        color: APP_PRIMARY_COLOR,
        fontSize: 12,
      };
    }
  }

  standardNotesSelected(notes) {
    const value = this.state.notes ? `${this.state.notes} ${notes}` : notes;
    this.setState({notes: value});
  }

  renderStandardNotes(item, length, index) {
    return (
      <Text
        style={[
          styles.predefinedNotesText,
          length === index ? {borderBottomWidth: 0} : {},
        ]}
        onPress={() => this.standardNotesSelected(item.notes)}
        testID={item.notes+"text"}
        accessibilityLabel={item.notes+"text"}>
        {item.notes}
      </Text>
    );
  }

  renderConfirmDialog() {
    return (
      <ConfirmDialog
        visible={this.state.showConfirm}
        onDismiss={this.hideConfirmDialog}
        title={this.state.confirmDialogData.title}
        content={this.state.confirmDialogData.content}
        noLabel={this.state.confirmDialogData.noLabel}
        yesLabel={this.state.confirmDialogData.yesLabel}
      />
    );
  }

  renderUploadFileModal() {
    const {t} = this.props;

    return (
      <UploadFileModal
        visible={this.state.show}
        onDismiss={this.hideUploadFileModal}
        title={t('COMMON.SELECT_FILES')}
        upload={true}
        doctor_id={this.props.doctor_id}
        hlp_id={this.props.patient.hlpid}
        enc_id={this.props.patient.enc_id}
        navigation={this.props.navigation}
      />
    );
  }

  renderModalView() {
    const {t} = this.props;
    return (
      <View style={styles.modalViewStyle}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderLabel}
          testID="addNewReviewText"
          accessibilityLabel="addNewReviewText">
            {t('COVID_MONITORING.ADD_NEW_REVIEW')}
          </Text>
          <Icon
          testID="closeImage"
          accessibilityLabel="closeImage"
            name="close"
            type="MaterialCommunityIcons"
            onPress={this.hideModal}
          />
        </View>
        <View style={styles.modalContent}>
          <View style={styles.standardReviewsView}>
            <View>
              <Text
              testID="selectStandardReviewText"
              accessibilityLabel="selectStandardReviewText">{t('COVID_MONITORING.SELECT_STANDARD_REVIEW')}</Text>
            </View>
            <SafeAreaView style={styles.standardReviewsTextView}>
              <FlatList
                data={this.props.standardNotes}
                renderItem={({item, index}) =>
                  this.renderStandardNotes(
                    item,
                    this.props.standardNotes.length - 1,
                    index,
                  )
                }
                keyExtractor={(item) => item.notes}
              />
            </SafeAreaView>
          </View>
          <View style={styles.customReviewView}>
            <View>
              <Text
              testID="writeYourReviewText"
              accessibilityLabel="writeYourReviewText">{t('COVID_MONITORING.OR_WRITE_YOUR_REVIEW')}</Text>
            </View>
            <View>
              <Textarea
              testID="writeYourReviewHereTextArea"
              accessibilityLabel="writeYourReviewHereTextArea"
                bordered
                style={styles.textAreaStyles}
                rowSpan={5}
                defaultValue={this.state.notes}
                onChangeText={this.onChangeText}
                placeholder={t('COVID_MONITORING.WRITE_YOUR_REVIEW_HERE')}
              />
            </View>
          </View>
        </View>
        {this.state.role !== 'physiotherapist' &&
          this.state.role !== 'dietician' && (
            <View style={styles.checkBoxActionView}>
              <View style={styles.checkBoxAction}>
                <CheckBox
                testID="checkBox"
                accessibilityLabel="checkBox"
                  style={{marginRight: 15}}
                  checked={this.state.dietician ? true : false}
                  onPress={() => this.updateIncluded('dietician')}
                />
                <Text
                testID="dieticianRecommendationIncludedText"
                accessibilityLabel="dieticianRecommendationIncludedText">
                  {t('COVID_MONITORING.DIETICIAN_RECOMMENDATION_INCLUDED')}
                </Text>
              </View>
              <View style={styles.checkBoxAction}>
                <CheckBox
                testID="checkBox"
                accessibilityLabel="checkBox"
                  style={{marginRight: 15}}
                  checked={this.state.physiotherapist ? true : false}
                  onPress={() => this.updateIncluded('physiotherapist')}
                />
                <Text
                testID="physiotherapistRecommandationIncludedText"
                accessibilityLabel="physiotherapistRecommandationIncludedText">
                  {t(
                    'COVID_MONITORING.PHYSIOTHERAPIST_RECOMMENDATION_INCLUDED',
                  )}
                </Text>
              </View>
            </View>
          )}

        <View style={styles.modalActions}>
          <View style={styles.uploadFileView}>
            <TouchableOpacity
              onPress={this.showUploadFileModal}
              style={styles.attachFileTouchable}
              testID="uploadTouch"
              accessibilityLabel="uploadTouch">
              <Attachments height={25} width={25} 
              testID="attachmentImage"
              accessibilityLabel="attachmentImage"/>
              <Text style={styles.uploadTextStyles}
              testID="uploadText"
              accessibilityLabel="uploadText">{t('COMMON.UPLOAD')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsView}>
            {/* <Button
              light
              style={styles.modalActionCancelButton}
              onPress={this.hideModal}>
              <Text>{t('COMMON.CANCEL')}</Text>
            </Button> */}
            <Button
              light
              style={styles.modalActionSaveButton}
              onPress={this.saveNotes}
              testID="saveButton"
              accessibilityLabel="saveButton">
              <Text style={styles.saveText}
              testID="saveText"
              accessibilityLabel="saveText">{t('COMMON.SAVE')}</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  renderAddReviewModal() {
    return (
      <Portal>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Modal
            dismissable={false}
            isVisible={this.state.visible}
            backdropOpacity={0.5}
            onBackdropPress={() => {
              this.hideModal();
            }}
            style={styles.modalPaddingAndMarginStyles}
            contentContainerStyle={styles.modalContainerStyle}>
            {this.renderModalView()}
          </Modal>
        </TouchableWithoutFeedback>
      </Portal>
    );
  }

  renderAddReviewButton() {
    const {t} = this.props;
    return (
      <FAB
      testID="addReviewTab"
      accessibilityLabel="addReviewTab"
        style={styles.addReviewButtonView}
        icon="note-text-outline"
        color={DEFAULT_WHITE_COLOR}
        onPress={this.showModal}
        label={t('COVID_MONITORING.ADD_REVIEW')}
      />
    );
  }

  getBackgroundColor(item) {
    if (item.created_user_type?.toLowerCase().includes('doctor')) {
      return {
        backgroundColor: REVIEW_NOTES_BACKGROUND_TEXT_COLOR,
        ...styles.cardPaddingBottom,
      };
    } else if (item.created_user_type?.toLowerCase().includes('dietician')) {
      return {
        backgroundColor: DIETICIAN_BACKGROUND_COLOR,
        ...styles.cardPaddingBottom,
      };
    } else if (
      item.created_user_type?.toLowerCase().includes('physiotherapist')
    ) {
      return {
        backgroundColor: PHYSIOTHERAPIST_BACKGROUND_COLOR,
        ...styles.cardPaddingBottom,
      };
    } else {
      return {
        backgroundColor: REVIEW_NOTES_NURSE_COLOR,
        ...styles.cardPaddingBottom,
      };
    }
  }

  renderEachReview({item}) {
    const {t} = this.props;
    return (
      <Card>
        <CardItem style={styles.eachReviewView} cardBody>
          {/* patient name and Date section */}
          <View style={[styles.reviewInfoView]}>
            <View style={[styles.nameDateView, styles.paddingLeft]}>
              <Text style={[styles.doctorName]}
              testID={item.created_by+"text"} accessibilityLabel={item.created_by+"text"}>{`${item.created_by}`}</Text>
              <Text style={styles.reviewDate}
              testID={item.created_at+"text"} accessibilityLabel={item.created_at+"text"}>{item.created_at}</Text>
            </View>
            <View style={styles.roleView}>
              <Text style={[styles.userType, this.getBackgroundColor(item)]}
              testID="doctorText"
              accessibilityLabel="doctorText">
                {item.created_user_type.toLowerCase() === 'doctor'
                  ? t('COVID_MONITORING.DOCTOR')
                  : ''}
              </Text>
            </View>
          </View>

          <View style={[styles.reviewDescView, styles.flexDirectionRow]}>
            <View style={[styles.flexOne, styles.paddingLeft]}>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            {(item.is_physiotherapist || item.is_dietician) && (
              <View style={styles.checkBoxesMainView}>
                {item.is_physiotherapist && (
                  <Text style={[styles.userType, styles.physioView]}
                  testID="physiotherapistText"
                  accessibilityLabel="physiotherapistText">
                    {t('COVID_MONITORING.PHYSIOTHERAPIST')}
                  </Text>
                )}
                {item.is_dietician && (
                  <Text
                    style={[
                      styles.userType,
                      styles.dieticianView,
                      styles.marginTop,
                    ]}
                    testID="dieticianText"
                    accessibilityLabel="dietiecianText">
                    {t('COVID_MONITORING.DIETICIAN')}
                  </Text>
                )}
              </View>
            )}
          </View>
        </CardItem>
      </Card>
    );
  }

  renderReviewsList() {
    const {t} = this.props;
    if (this.state.covidNotes.length) {
      return (
        <SafeAreaView style={styles.reviewsListView}>
          <FlatList
            data={this.state.covidNotes}
            renderItem={this.renderEachReview.bind(this)}
            keyExtractor={(item) => item.created_at}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          />
        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.itemsCenter}>
          <Text
          testID="noRecordsText"
          accessibilityLabel="noRecordsText">{t('PROFILE.NO_RECORDS')}</Text>
        </View>
      );
    }
  }

  renderEachFilter(id, label, value,testID) {
    return (
      <TouchableOpacity
        style={[styles.filtersButton, this.getFilterSelection(id)]}
        onPress={() => this.filterBy(id)}
        testID={label+"touch"}
        accessibilityLabel={label+"touch"}>
        <Text style={this.getFilterSelection(id)}
        testID={label+"text"}
        accessibilityLabel={label+"text"}>{label}</Text>
      </TouchableOpacity>
    );
  }

  renderFilters() {
    const {t} = this.props;
    return (
      <View style={styles.filtersView}>
        <View style={styles.filterLabelView}>
          <Text style={styles.filterLabel}
          testID="filterByText"
          accessibilityLabel="filterByText">{t('COMMON.FILTER_BY')}</Text>
        </View>
        <View style={styles.filterSelectView}>
          {this.renderEachFilter(
            'doctor',
            t('COVID_MONITORING.DOCTOR'),
            this.state.doctorCount,
            "doctorText"
          )}
          {this.renderEachFilter(
            'nurse',
            t('COVID_MONITORING.NURSE'),
            this.state.nurseCount,
            "nurseText"
          )}
          {this.renderEachFilter(
            'physiotherapist',
            t('COVID_MONITORING.PHYSIOTHERAPIST'),
            this.state.physioCount,
            "physiotherapistText"
          )}
          {this.renderEachFilter(
            'dietician',
            t('COVID_MONITORING.DIETICIAN'),
            this.state.dieticianCount,
            "dieticianText"
          )}
        </View>
      </View>
    );
  }

  render() {
    if (this.state.loader) {
      return (
        <View style={styles.itemsCenter}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    return (
      <Container style={styles.container}>
        {this.renderFilters()}
        {this.renderReviewsList()}
        <View>
          {this.renderAddReviewModal()}
          {this.props.status !== 'closed' && this.renderAddReviewButton()}
          {this.state.show && this.renderUploadFileModal()}
          {this.renderConfirmDialog()}
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    covidNotes: state.covidNotes.response?.data?.covid_notes || [],
    standardNotes: state.standardNotes.response?.data?.standard_notes,
    savedCovidNotes: state.savedCovidNotes.response,
  };
};

export default withTranslation()(
  connect(mapStateToProps, {
    getCovidNotes,
    getStandardNotes,
    saveCovidNotesData,
  })(CovidMonitoringReviewTab),
);
