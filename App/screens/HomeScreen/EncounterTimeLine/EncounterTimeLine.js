import React, {Component} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {Icon, Overlay} from 'react-native-elements';
import {Row, Col, Button, Toast} from 'native-base';
import moment from 'moment';
import RNImageToPdf from 'react-native-image-to-pdf';
import AsyncStorage from '@react-native-community/async-storage';
import ImageResizer from 'react-native-image-resizer';
import {withTranslation} from 'react-i18next';
import FileSelector from '../../../components/fileselector/FileSelector';
// redux actions
import {getPresecList} from '../../../redux/actions/presec_action';
import {getOldList} from '../../../redux/actions/oldpatient_action';
import {getTimeList} from '../../../redux/actions/timeline_action';

import API from '../../../services/Api';
import getBaseUrl, {getApiUrl} from '../../../config/Config';

//  constants and urls

let path1;

// styles and color codes
import styles from './EncounterTimeLineStyles';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
} from '../../../themes/variable';
import CalendarBlack from '../ImageComponents/CalendarBlack';
import HistoryImage from '../ImageComponents/HistoryImage';
import CovidMonitoring from '../ImageComponents/CovidMonitoring';
import PatientPdf from '../ImageComponents/PatientPdf';
import i18n from '../../../../i18n';

class EncounterTimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      mulImg: [],
      hdata: {},
      timeline: [],
      visible1: false,
      refreshing: false,
    };
    this.fileSelRef = React.createRef();
    this.handleSelection = this.handleSelection.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount = async () => {
    this.setState({isLoading: true});
    await this.getData();
    this.setState({isLoading: false});
  };

  getData = async () => {
    try {
      const payload = {
        docid: global.doctor_id,
        token: global.token,
        hlpid: global.hlpid,
        branch: global.branch_id,
        date: '',
        encid: 'null',
        key: global.search_text ? global.search_text : '',
      };

      const response = await API.call(
        'post',
        'dashboard_timelinelist/',
        payload,
      );

      this.setState({
        timeline: response.message,
        isLoading: false,
        refreshing: false,
      });
    } catch (error) {
      Toast.show({
        text: error?.message,
        type: 'warning',
        duration: 3000,
      });
    }
  };

  handleSelection(files) {
    if (files && files.length) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file) {
    const filePath = file.path;
    ImageResizer.createResizedImage(filePath, 800, 650, 'JPEG', 50, 0)
      .then(({path}) => {
        this.setState({path});
        path1 = path;
        let source, filename;
        source = {path: path1};
        if (path1.split('.')[1] == 'pdf') {
          url == 'lab_presc/'
            ? (filename =
                this.UPLOAD_ENCOUNTER_ID + '_Lab_' + this.UPLOAD_ID + '.pdf')
            : (filename =
                this.UPLOAD_ENCOUNTER_ID +
                '_imaging_' +
                this.UPLOAD_ID +
                '.pdf');
          this.uploadPdf(
            this.UPLOAD_ENCOUNTER_ID,
            this.UPLOAD_ID,
            this.UPLOAD_URL,
            source.path,
            filename,
          );
        } else {
          this.state.mulImg.push(path1);

          this.setState({mulImg: this.state.mulImg});
          setTimeout(() => {
            this.checkConvert(
              this.UPLOAD_ENCOUNTER_ID,
              this.UPLOAD_ID,
              this.UPLOAD_URL,
            );
          }, 250);
        }
      })
      .catch((err) => {
        Toast.show({
          text: err?.message,
          type: 'warning',
          duration: 3000,
        });
      });
  }

  setImage = (encounterid, id, url) => {
    // const options = {
    //   title: 'Select Image',
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };

    this.UPLOAD_ENCOUNTER_ID = encounterid;
    this.UPLOAD_ID = id;
    this.UPLOAD_URL = url;
    this.fileSelRef.current.openPicker();

    /*ImagePicker.showImagePicker(options, (response) => {
      const {error, path, originalRotation} = response;
      if (path && !error) {
        let rotation = 0;

        if (originalRotation === 90 || originalRotation === 270) {
          rotation = 360;
        }

        ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, rotation)
          .then(({path}) => {
            this.setState({path});
            path1 = path;
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              let source, filename;
              source = {path: path1};
              if (path1.split('.')[1] == 'pdf') {
                url == 'lab_presc/'
                  ? (filename = encounterid + '_Lab_' + id + '.pdf')
                  : (filename = encounterid + '_imaging_' + id + '.pdf');
                this.uploadPdf(encounterid, id, url, source.path, filename);
              } else {
                this.state.mulImg.push(path1);

                this.setState({mulImg: this.state.mulImg});

                this.checkConvert(encounterid, id, url);
              }
            }
          })
          .catch((err) => {
            Toast.show({
              text: err?.message,
              type: 'warning',
              duration: 3000,
            });
          });
      } else if (error) {
        Toast.show({
          text: error?.message,
          type: 'warning',
          duration: 3000,
        });
      }
    });*/
  };

  checkConvert = (encounterid, id, url) => {
    Alert.alert(
      i18n.t('PLAN.PRESCRIPTION_ADDED'),
     i18n.t('PATIENTS.ADD_MORE'),
      [
        {text: i18n.t('COMMON.YES'), onPress: () => this.setImage(encounterid, id, url)},
        {text: i18n.t('COMMON.NO'), onPress: () => this.convertPDF(encounterid, id, url)},
      ],
      {cancelable: false},
    );
  };

  convertPDF = async (encounterid, id, url) => {
    //  this.refs.loading.show();
    this.setState({isLoading: true});
    let filename;
    url == 'lab_presc/'
      ? (filename = encounterid + '_Lab_' + id + '.pdf')
      : (filename = encounterid + '_imaging_' + id + '.pdf');
    try {
      const options = {
        imagePaths: this.state.mulImg,
        name: filename,
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 800,
          height: 1056,
        },
        quality: 0.4, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      this.setState({mulImg: []});
      this.uploadPdf(encounterid, id, url, pdf.filePath, filename);
    } catch (e) {
      Toast.show({
        text: e?.message,
        type: 'warning',
        duration: 3000,
      });
    }
  };

  uploadPdf = async (encounterid, id, urldata, path, pdfname) => {
    // let url = base_url + "immun_img_upload"
    let url = getBaseUrl() + urldata;
    let pt = [
      {
        name: urldata == 'lab_presc/' ? 'lab' : 'img',
        filename: pdfname,
        type: 'application/pdf',
        data: RNFetchBlob.wrap(path),
      },
      {
        name: 'encounter_id',
        data: encounterid.toString(),
      },
      urldata == 'lab_presc/'
        ? {
            name: 'lab_id',
            data: id.toString(),
          }
        : {
            name: 'img_id',
            data: id.toString(),
          },
    ];

    RNFetchBlob.fetch(
      'POST',
      url,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'application/pdf',
      },
      pt,
    )
      .then((response) => response.json())
      .then(async (resp) => {
        this.setState({isLoading: false});
        //
        if (resp.message == 'File Added Successfully') {
          alert(resp.message);
          this.getData();
        }
      })
      .catch((error) => {
        Toast.show({
          text: error?.message,
          type: 'warning',
          duration: 3000,
        });
      });
  };

  closeOverlay1 = () => {
    this.setState({visible1: false});
  };
  openOverlay = () => {
    this.setState({
      visible1: true,
    });
  };
  uploadImage = async (encounterid, id, urldata, path) => {
    let url = getBaseUrl() + urldata;
    let imagename;
    urldata == 'lab_presc/'
      ? (imagename = encounterid + '_Lab_' + id + '.jpg')
      : (imagename = encounterid + '_imaging_' + id + '.jpg');
    let pt = [
      {
        name: urldata == 'lab_presc/' ? 'lab' : 'img',
        filename: imagename,
        type: 'image/jpg',
        data: RNFetchBlob.wrap(path),
      },
      {
        name: 'encounter_id',
        data: encounterid.toString(),
      },
      urldata == 'lab_presc/'
        ? {
            name: 'lab_id',
            data: id.toString(),
          }
        : {
            name: 'img_id',
            data: id.toString(),
          },
    ];

    RNFetchBlob.fetch(
      'POST',
      url,
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      pt,
    )
      .then((response) => response.json())
      .then((resp) => {
        if (resp.message == 'File Added Successfully') {
          this.timelineAlert.showMessage({
            message: 'success',
            description: i18n.t('PERSON_REGISTRATION.FILE_UPLOADED'),
            type: 'success',
            icon: 'auto',
          });
          this.refs.loading.close();
          // this.getTimeline();
        } else {
          this.refs.loading.close();
          this.timelineAlert.showMessage({
            message: 'File upload failed',
            description: 'File not upload',
            type: 'danger',
            icon: 'auto',
          });
        }
      })
      .catch((err) => {
        Toast.show({
          text: err?.message,
          type: 'warning',
          duration: 3000,
        });
      });
  };

  closeOverlay = () => {
    this.setState({visible: false});
  };

  showPdf = (pdflink) => {
    this.props.screenProps.rootNavigation.navigate('ViewPdf', {
      link: pdflink,
    });
  };
  showPdf1 = (pdflink) => {
    //alert(pdflink)
    this.setState({
      visible1: false,
    });
    this.props.screenProps.rootNavigation.navigate('ViewPdf', {
      link: pdflink,
    });
  };

  getRecieptName = (name) => {
    var recName = name;
    var srec = recName.split('-')[4];
    var frec = srec.split('.')[0];
    return frec;
  };

  toggleImageModal = (img) => {
    if (img == '') {
      alert('no image found');
    } else {
      let uri = img != '' && getApiUrl() + '/' + img.trim();
      this.props.screenProps.rootNavigation.navigate('ViewImage', {
        link: uri.toString(),
        screenname: 'EncounterTimeline',
      });
    }
  };
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getData().then((item) => {
      this.setState({hdata: item[0], refreshing: false});
    });
  };
  renderNamingConversion = (text) => {
    if (text) {
      return text.charAt(0).toUpperCase() + text.slice(1) + ' ';
    }
    return '';
  };

  renderFullName = (item) => {
    if (item) {
      return (
        this.renderNamingConversion(item.salutation + '.') +
        this.renderNamingConversion(item.first_name) +
        this.renderNamingConversion(item.middle_name) +
        this.renderNamingConversion(item.last_name)
      );
    }
    return '';
  };

  renderStatus = (item) => {
    const {t} = this.props;

    return item.encounter_status.toLowerCase() === 'checkedin'
      ? t('PATIENTS.CHECKED_IN')
      : item.encounter_status.toLowerCase() === 'consulting'
      ? t('PATIENTS.CONSULTING')
      : item.encounter_status.toLowerCase() === 'undergoing'
      ? t('PATIENTS.IN_PROCESS')
      : item.encounter_status.toLowerCase() === 'undergoung'
      ? t('PATIENTS.IN_PROCESS')
      : item.encounter_status.toLowerCase() === 'appointment booked'
      ? t('PATIENTS.BOOKED')
      : item.encounter_status.toLowerCase() === 'completed'
      ? t('PATIENTS.COMPLETED')
      : item.encounter_status.toLowerCase() === 'cancelled'
      ? t('PATIENTS.CANCELLED')
      : item.encounter_status.toLowerCase() === 'Cancelled'
      ? t('PATIENTS.CANCELLED')
      : item.encounter_status.toLowerCase() === 'appointment recheduled'
      ? t('PATIENTS.RE_SCHEDULED')
      : item.encounter_status.toLowerCase() === 'Appointment Rescheduled'
      ? t('PATIENTS.RE_SCHEDULED')
      : item.encounter_status.toLowerCase() === 'reconsulting'
      ? t('PATIENTS.RE_CONSULTING')
      : item.encounter_status.toLowerCase() === 'triage'
      ? t('PATIENTS.TRIAGE')
      : item.encounter_status.toLowerCase() === 'Confirm'
      ? t('PATIENTS.CONFIRM')
      : item.encounter_status.toLowerCase() === 'confirm'
      ? t('PATIENTS.CONFIRM')
      : item.encounter_status.toLowerCase() === 'closed'
      ? t('PATIENTS.CLOSED')
      : item.encounter_status.toLowerCase() === 'Closed'
      ? t('PATIENTS.CLOSED')
      : null;
  };

  navigationToOldPatientDetails = (item) => {
    this.props.screenProps.rootNavigation.navigate('OldPatientDetails', {
      Id: item.id,
      schedule_date: item.schedule_date,
      enc_id: item.enc_id,
      hlpid: item.hlpid,
      branch_id: item.branch_id,
      encounterdate: item.schedule_date,
      encounter_type: item.encounter_status,
    });
  };

  navigateToCovidMonitoringSection = async (hlpid, enc_id, patient) => {
    const {t} = this.props;

    const doctorId = await AsyncStorage.getItem('doctorid');
    const doctor_name = await AsyncStorage.getItem('doctorname');

    if (patient.encounter_status.toLowerCase() === 'closed') {
      if (patient.report_file_path) {
        this.props.screenProps.rootNavigation.navigate('ViewPdf', {
          link: `${prefix}/${patient.report_file_path.slice(5)}`,
          title: t('PROFILE.REPORT'),
        });
      } else {
        Toast.show({
          text: 'Selected patient not have report link',
          type: 'warning',
          duration: 3000,
        });
      }
    } else {
      if (patient.added_date.length > 0) {
        this.props.screenProps.rootNavigation.navigate(
          'CovidMonitoringPatientView',
          {
            token: global.token,
            doctor_id: doctorId,
            doctor_name: doctor_name,
            selected_doctor_id: doctorId,
            status: patient.encounter_status,
            patient: patient,
            initialPage: 0,
          },
        );
      } else {
        Toast.show({
          text: t('COVID_MONITORING.INITIAL_ASSESSMENT_NOT_AVAILABLE'),
          type: 'danger',
          duration: 3000,
        });
      }
    }
  };

  handleHistoryButton = (hlpid, enc) => {
    this.props.screenProps.rootNavigation.navigate('Vitals2', {
      hlpid: hlpid,
      enc: enc,
    });
  };

  renderPatientCard = ({item}) => {
    const {t} = this.props;

    let p = moment(item.schedule_date).format('YYYY-MMM-DD').split('-');

    let fullname = item.middle_name
      ? item.salutation +
        ' ' +
        item.first_name.charAt(0).toUpperCase() +
        item.first_name.slice(1) +
        ' ' +
        item.middle_name.charAt(0).toUpperCase() +
        item.middle_name.slice(1) +
        ' ' +
        item.last_name.charAt(0).toUpperCase() +
        item.last_name.slice(1)
      : item.salutation +
        ' ' +
        item.first_name.charAt(0).toUpperCase() +
        item.first_name.slice(1) +
        ' ' +
        ' ' +
        item.last_name.charAt(0).toUpperCase() +
        item.last_name.slice(1);
    return (
      <View style={[styles.eventBox]}>
        <View style={styles.flex}>
          {/* Date section start */}
          <View style={styles.flexDirectionRow}>
            <CalendarBlack />
            <Text style={styles.dateText}>
              {p[2]} {p[1]} {p[0]}
            </Text>
          </View>

          {/* details card start */}
          <View style={styles.detailsCardView}>
            {/* Name and status section start */}

            <TouchableOpacity
              onPress={() => this.navigationToOldPatientDetails(item)}
              style={styles.flex}>
              <View style={styles.nameStatusView}>
                <View>
                  <Text style={styles.nameStyles}>{fullname}</Text>
                </View>
                <View style={[styles.flex, styles.itemsRightEnd]}>
                  <Text
                    style={[
                      styles.statusStyles,
                      this.renderStatus(item).toLocaleLowerCase() === 'closed'
                        ? styles.closeStatusStyles
                        : styles.remainingStatusStyles,
                    ]}>
                    {this.renderStatus(item)}
                  </Text>
                </View>
              </View>
              <View style={styles.idView}>
                <Text style={styles.idTextStyles}>
                  {t('PATIENTS.ID')} {item.encounterCode}
                </Text>
              </View>

              {/* buttons section start */}
              <View style={styles.buttonsSectionView}>
                <View style={styles.flex}>
                  <Button
                    rounded
                    androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                    style={styles.buttonStyles}
                    onPress={() =>
                      this.handleHistoryButton(item.hlpid, item.encounterCode)
                    }>
                    <HistoryImage />
                    <Text style={styles.buttonText}>
                      {t('PATIENTS.HISTORY')}
                    </Text>
                  </Button>
                </View>

                {item.encounter_type == 'homecare' && (
                  <View style={styles.flex}>
                    <Button
                      rounded
                      androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                      style={styles.buttonStyles}
                      onPress={() =>
                        this.navigateToCovidMonitoringSection(
                          item.hlpid,
                          item.encounterCode,
                          item,
                        )
                      }>
                      <CovidMonitoring />
                      <Text style={styles.buttonText}>
                        {t('PATIENTS.COVID')}
                      </Text>
                    </Button>
                  </View>
                )}

                <View style={styles.flex}>
                  <Button
                    rounded
                    androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                    style={styles.buttonStyles}
                    onPress={() =>
                      this.props.screenProps.rootNavigation.navigate(
                        'ViewPdf',
                        {
                          link: item.pdflink,
                        },
                      )
                    }>
                    <PatientPdf />
                    <Text style={styles.buttonText}>
                      {t('PATIENTS.PRESCRIPTION')}
                    </Text>
                  </Button>
                </View>
              </View>

              {/* button sections end */}
            </TouchableOpacity>
            {/* Name and status section end */}
          </View>

          {/* details card end */}
        </View>
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    let item = this.state.hdata;
    if (this.state.visible1) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Overlay isVisible1>
            <ScrollView>
              <FileSelector
                ref={this.fileSelRef}
                onSelection={this.handleSelection}
                selectAny
              />
              <View>
                <Text
                  allowFontScaling={false}
                  allowFontScaling={false}
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 20,
                  }}>
                  Receipts
                </Text>
                {item.reclink.map((item) => (
                  <Row style={{marginTop: 15, marginLeft: 15}}>
                    <Col size={35}>
                      <Text allowFontScaling={false} allowFontScaling={false}>
                        {this.getRecieptName(item)}{' '}
                      </Text>
                    </Col>
                    <Col size={65} style={{marginTop: -15}}>
                      <TouchableOpacity onPress={() => this.showPdf1(item)}>
                        <Icon
                          reverse
                          raised
                          color="#517fa4"
                          size={15}
                          name="file-text-o"
                          type="font-awesome"
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                ))}
              </View>
            </ScrollView>
            <Button
              title="Close"
              onPress={() => this.closeOverlay1()}
              containerStyle={{alignSelf: 'center'}}
              buttonStyle={{backgroundColor: APP_PRIMARY_COLOR}}
            />
          </Overlay>
        </View>
      );
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <View>
          <FlatList
            keyExtractor={(item) => item.encounterCode}
            data={this.state.timeline}
            // renderItem={({item}) => this.renderTimeLineCard({item})}
            renderItem={({item}) => this.renderPatientCard({item})}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  timelineList: state.timeList.timeList,
  presecList: state.presecList.presecList,
});
export default withTranslation()(
  connect(mapStateToProps, {getTimeList, getPresecList, getOldList})(
    EncounterTimeLine,
  ),
);
