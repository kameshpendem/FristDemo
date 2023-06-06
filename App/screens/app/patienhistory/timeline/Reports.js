import React, {useState, useEffect, createRef} from 'react';
import {Card} from 'native-base';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  DeviceEventEmitter,
  Keyboard,
} from 'react-native';
import {Left, Right, Toast} from 'native-base';
import {wp, hp} from '../../../../themes/Scale';
import calender from '../../../../assets/images/cal.png';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  getTimeline,
  getReceipts,
} from '../../../../redux/actions/timeline_action';
import {Divider} from 'react-native-elements';
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_GREY_COLOR,
  FONT_FAMILY,
  DEFAULT_LIGHT_GREEN_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_INVERSE_COLOR,
  DEFAULT_INVERSE_LIGHT,
  APP_PRIMARY_COLOR,
} from '../../../../themes/variable';
import Hospital from '../../../../assets/images/hsptl.png';
import Name from '../../../../assets/images/Patient.png';
import AddImage from '../../../../assets/images/addImage.png';
import Bill from '../../../../assets/images/bill.png';
import close from '../../../../assets/images/close.png';
import Header from '../../common/Header';
import ImageResizer from 'react-native-image-resizer';
import AppLoader from '../../../../screens/HomeScreen/Common/AppLoader';
import FileSelector from '../../../../components/fileselector/FileSelector';
import {getImgData} from '../../../../redux/actions/addImg_action';
import {getLabData} from '../../../../redux/actions/addLab_action';
import {getVaccineData} from '../../../../redux/actions/addVaccine_action';
import Pdf from '../../../../assets/images/adobe.png';
// import styles from './EncounterTimelineDetailsStyles';
import getBaseUrl, {getApiUrl} from '../../../../config/Config';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
import ApiCall from '../../../../services/ApiCall';
import axios from 'axios';
import Loader from '../../common/Loader';
import ActionSheet from 'react-native-actions-sheet';
import {NativeToastTop} from '../../common/Toaster';

const fileSelRef = React.createRef();
const serviceRef = React.createRef();
const urlRef = React.createRef();
const encounter = React.createRef();
const attachmentref = createRef();

const Reports = ({navigation, patientList, t}) => {
  const [imgData, setImgData] = useState([]);
  const [labData, setLabData] = useState([]);
  const [vaccineData, setvaccineData] = useState([]);
  const [data, setData] = useState([]);
  const [encId, setEncId] = useState('');
  const [id_val, setIdVal] = useState('');
  const [url_val, setUrlVal] = useState('');
  const [path, setPath] = useState('');
  const [mulImg, setMulImg] = useState([]);
  const [pdfpath, setPdfPath] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [fileName, setfileName] = useState('');
  const [selectFile, setSelectFile] = useState('');
  const [loading, setLoading] = useState(false);

  const enc_id = navigation?.state?.params?.enc_id || '';
  const editalble_data = navigation?.state?.params?.editalble_data || '';
  const person_doctor_id = navigation.state.params.person_details?.doc_id
    ? navigation.state.params.person_details?.doc_id
    : '';
  const doctor_id = navigation.state.params.doctor_id
    ? navigation.state.params.doctor_id
    : '';
  const person_healpha_id = navigation.state.params.person_details?.hlp_id
    ? navigation.state.params.person_details?.hlp_id
    : '';
  const filterData =
    data.find(i => i.op_details.id === navigation.state.params.Id) || {};
  useEffect(() => {
    const getData = async () => {
      const variables = {
        healpha_id: navigation.state.params.person_details?.hlp_id
          ? navigation.state.params.person_details?.hlp_id
          : patientList?.appointment?.healpha_id,
      };

      let data = await getTimeline(variables);

      setData(data.appointment_details);
    };

    const receiptsData = async () => {
      setLoading(true);
      const variables = {
        healpha_id: person_healpha_id
          ? person_healpha_id
          : patientList?.appointment?.healpha_id,
        enc_id: enc_id,
      };
      let receiptsdata = await getReceipts(variables);
      setReceipts(receiptsdata.receipts);
      setLoading(false);
    };
    receiptsData();

    getData();
    getImagingData();
    getLaboratoryData();
    GetVaccineData();
  }, []);

  const getImagingData = async () => {
    const doc_id = doctor_id?.doc_id
      ? doctor_id?.doc_id
      : patientList.appointment.doc_id;
    const hlp_id = person_healpha_id
      ? person_healpha_id
      : patientList.appointment.healpha_id;
    const data = await getImgData({enc_id, doc_id, hlp_id});
    setImgData(data.services);
  };
  const getLaboratoryData = async () => {
    const doc_id = doctor_id?.doc_id
      ? doctor_id?.doc_id
      : patientList.appointment.doc_id;
    const hlp_id = person_healpha_id
      ? person_healpha_id
      : patientList.appointment.healpha_id;
    const data = await getLabData({enc_id, doc_id, hlp_id});
    setLabData(data.services);
  };

  const GetVaccineData = async () => {
    const doc_id = doctor_id?.doc_id
      ? doctor_id?.doc_id
      : patientList.appointment.doc_id;
    const hlp_id = person_healpha_id
      ? person_healpha_id
      : patientList.appointment.healpha_id;

    let data = await getVaccineData({enc_id, doc_id, hlp_id, pending: false});
    setvaccineData(data.services || []);
    // setLabData(data.services);
  };

  const showPdf = pdflink => {
    if (!pdflink) return alert('Invalid');
    navigation.navigate('ViewPdfScreen', {
      link: `${getApiUrl()}${pdflink}`,
      // link: getApiUrl() + '/' + pdflink,
      screenname: 'Reports',
    });
  };
  const showPdf1 = pdflink => {
    if (!pdflink) return alert('Invalid');
    navigation.navigate('ViewPdfScreen', {
      // link: pdflink,
      link: `${getApiUrl()}${pdflink}`,
      screenname: 'Receipts',
    });
  };
  const showPdf2 = pdflink => {
    if (!pdflink) return alert('Invalid');
    navigation.navigate('ViewPdfScreen', {
      link: `${getApiUrl()}${pdflink}`,
      // link: getApiUrl() + '/' + pdflink,
      screenname: 'Reports',
    });
  };

  const deviceEmit = () => {
    DeviceEventEmitter.emit('getPatientCard', {
      appointmentId: patientList?.appointment?.id,
    }),
      DeviceEventEmitter.emit('updateHomeScreen', {date: ''});
  };

  // const renderLabReportPdf = (item) => {
  //   return (
  //     <TouchableOpacity
  //       style={styles.labOrderIcon}
  //       onPress={() => showPdf(urldata[0] + '/' + item.lab_pdf_path)}>
  //       <PrescriptionIcon height={15} width={15} />
  //     </TouchableOpacity>
  //   );
  // };

  // const renderLabReportUpload = (item) => {
  //   return (
  //     <TouchableOpacity
  //       style={styles.labOrderIcon}
  //       onPress={() =>
  //         setImage(item.encounterCode, item.lab_test_id, 'lab_presc/')
  //       }>
  //       <FileSelector
  //         ref={fileSelRef}
  //         onSelection={handleSelection}
  //         selectAny
  //       />
  //       <Image source={UploadIcon} style={{height: 15, width: 15}} />
  //     </TouchableOpacity>
  //   );
  // };

  const uploadFile = file => {
    const path = file.path;
    const encounterid = encounter.current;
    const id = serviceRef.current;
    const url = urlRef.current;

    let checkFile = path.split('.');

    if (checkFile.slice(-1)[0]?.toLowerCase() === 'pdf') {
      let filename;
      url == 'lab/'
        ? (filename = encounterid + '_Lab_' + id + '.pdf')
        : (filename = encounterid + '_imaging_' + id + '.pdf');
      setfileName(filename);
      setPdfPath(path);
    } else {
      try {
        ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
          .then(({path}) => {
            setPath(path);
            const path1 = path;
            let source;
            source = {path: path1};
            if (path1.split('.')[1] == 'pdf') {
              let filename;
              url == 'lab/'
                ? (filename = encounterid + '_Lab_' + id + '.pdf')
                : (filename = encounterid + '_imaging_' + id + '.pdf');
              setPdfPath(path1);
            } else {
              // mulImg.push(path1);
              setMulImg([...mulImg, path1]);
              setTimeout(() => {
                checkConvert(encounterid, id, url, file, path1);
              }, 250);
            }
          })
          .catch(err => {
            // console.log('err', err);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSelection = async files => {
    if (files && files.length) {
      uploadFile(files[0]);
    }
  };

  // const renderLabReportImage = (item) => {
  //   return (
  //     <TouchableOpacity
  //       style={styles.labOrderIcon}
  //       onPress={() => toggleImageModal(item.lab_pdf_path)}>
  //       {item.lab_pdf_path != '' && (
  //         <Image source={AddedImage} style={styles.addedImage} />
  //       )}
  //     </TouchableOpacity>
  //   );
  // };

  // const renderLabReport = (item) => {
  //   const labReports = item?.lab;
  //   const {t} = props;
  //   return (
  //     <View style={styles.labReportsMainView}>
  //       <View style={styles.chiefComplaintsMargin}>
  //         <Text style={styles.chiefComplaintsTextHeader}>
  //           {t('MY_RECORD_DETAILS.LAB_REPORTS')}
  //         </Text>

  //         {labReports.length ? (
  //           labReports.map((item) => (
  //             <View style={styles.labReportContent}>
  //               <Text
  //                 style={[
  //                   styles.chiefComplaintsValue,
  //                   styles.reportTextValueMargin,
  //                 ]}>
  //                 {item.lab}
  //               </Text>
  //               {item.lab_pdf_path == null || item.lab_pdf_path == ''
  //                 ? renderLabReportUpload(item)
  //                 : item.lab_pdf_path.split('.')[1] == 'pdf'
  //                 ? renderLabReportPdf(item)
  //                 : renderLabReportImage(item)}
  //             </View>
  //           ))
  //         ) : (
  //           <Text style={styles.chiefComplaintsValue}>-</Text>
  //         )}
  //       </View>
  //     </View>
  //   );
  // };

  const setImage = (encounterid, id, url) => {
    serviceRef.current = id;
    urlRef.current = url;
    encounter.current = encounterid;
    setEncId(encounterid);
    setIdVal(id);
    fileSelRef?.current?.openPicker();
  };
  const setImage1 = (encounterid, id, url) => {
    serviceRef.current = id;
    urlRef.current = url;
    encounter.current = encounterid;
    setEncId(encounterid);
    fileSelRef?.current?.openPicker();
  };

  const openImagePicker = (encounterid, id, url) => {
    encounter.current = encounterid;
    serviceRef.current = id;
    urlRef.current = url;
    setUrlVal(url);
    attachmentref.current?.setModalVisible(true);
  };

  const checkConvert = (encounterid, id, url, file, path1) => {
    Alert.alert(
      t('VACCINATION.ATTACHMENT_ADDED'),
      t('VACCINATION.ADD_MORE'),
      [
        {
          text: t('COMMON.YES'),
          onPress: () => {
            url_val == 'lab/'
              ? setImage1(encounter.current, serviceRef.current, urlRef.current)
              : setImage(encounter.current, serviceRef.current, urlRef.current);
          },
        },
        {
          text: t('COMMON.NO'),
          onPress: () => convertPDF(encounterid, id, url, file, path1),
        },
      ],
      {cancelable: false},
    );
  };

  const convertPDF = async (encounterid, id, url, file, path1) => {
    // this.refs.loading.show();
    let filename;
    url == 'lab/'
      ? (filename = encounterid + '_Lab_' + id + '.pdf')
      : (filename = encounterid + '_imaging_' + id + '.pdf');
    let checkPath = [];
    if (!path1?.trim()) {
      checkPath = [...mulImg];
    } else {
      checkPath = [...mulImg, path1];
    }
    try {
      const options = {
        fileCache: true,
        imagePaths: checkPath,
        name: filename,
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: 1200,
        },
        quality: 0.4, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      setMulImg([]);
      setfileName(filename);
      setPdfPath(pdf.filePath);
    } catch (e) {
      console.log(e);
    }
  };

  const uploadPdf = async (encounterid, id, urldata, path, pdfname, file) => {
    const doc_id = person_doctor_id
      ? person_doctor_id
      : patientList.appointment.doc_id;
    const hlp_id = person_healpha_id
      ? person_healpha_id
      : patientList.appointment.healpha_id;
    let token = await AsyncStorage.getItem('jwt_token');
    if (path == '' || path == null || path == undefined) {
      // setLoading(false);
      NativeToastTop({
        text: t('VACCINATION.PLEASE_SELECT'),
        type: 'warning',
      });
    } else {
      let url =
        getBaseUrl() +
        `v1/appointment/encounter/${encounterid}/doctor/${doc_id}/person/${hlp_id}/plan/attachment/${
          urldata == 'lab/' ? 'lab' : 'imaging'
        }?service_id=${id}`;

      let pt = new FormData();
      pt.append('description', 'desc2');
      pt.append('file_name', pdfname);
      pt.append('file', {
        uri: 'file://' + path,
        type: 'application/jpeg',
        name: pdfname,
      });
      setLoading(true);
      ApiCall.post(url, pt, {
        Authorization: `Bearer ${token}`,
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      })
        .then(res => {
          if (res.message) {
            deviceEmit();
            NativeToastTop({
              text: res.message,
              type: 'success',
            });
            urldata == 'lab/' ? getLaboratoryData() : getImagingData();
            setPdfPath('');
            setfileName('');
            serviceRef.current = '';
            encounter.current = '';
            urlRef.current = '';
            attachmentref.current?.setModalVisible(false);
            setLoading(false);
          } else {
            Toast.show({
              text: 'Upload Failed',
              type: 'danger',
              duration: 3000,
            });
          }
        })
        .catch(err => {
          setLoading(false);
          NativeToastTop({
            text: err.message,
            type: 'danger',
          });
        });
    }
  };
  const AttachmentFiles = () => {
    // const [nameOfFile, setnameOfFile] = useState("");
    return (
      <View style={{padding: 15}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
              fontSize: 16,
            }}
            testID="uploadFileText"
            accessibilityLabel="uploadFileText">
            {t('TIMELINE.UPLOAD FILE')}
          </Text>
          <TouchableOpacity
            onPress={() => attachmentref.current?.setModalVisible(false)}
            testID="closeTouch"
            accessibilityLabel="closeTouch">
            <Image
              source={close}
              style={{width: 14, height: 14}}
              testID="closeImage"
              accessibilityLabel="closeImage"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: DEFAULT_INVERSE_LIGHT,
            marginVertical: 10,
            padding: 10,
            borderRadius: 5,
            borderStyle: 'dotted',
            borderWidth: 1,
            borderColor: DEFAULT_GREY_COLOR,
          }}>
          <View style={{marginVertical: 10}}>
            <View>
              <Text testID="fileNameText" accessibilityLabel="fileNameText">
                {t('COMMON.NAME_FILE')}
              </Text>
              <TextInput
                testID="enterNameTextInput"
                accessibilityLabel="enterNameTextInput"
                placeholder={`${t('TIMELINE.ENTER_NAME')}`}
                style={{
                  borderWidth: 1,
                  borderColor: DEFAULT_INVERSE_LIGHT,
                  padding: 15,
                  borderRadius: 5,
                  backgroundColor: DEFAULT_WHITE_COLOR,
                  marginTop: 5,
                }}
                defaultValue={fileName}
                blurOnSubmit={true}
                value={fileName}
                onChangeText={setfileName}
                onEndEditing={() => {
                  setfileName(fileName);
                }}
                onBlur={() => {
                  setfileName(fileName);
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                marginVertical: 15,
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}>
              <Text
                ellipsizeMode="head"
                numberOfLines={1}
                style={{width: '70%'}}
                testID={pdfpath + 'text'}
                accessibilityLabel={pdfpath + 'text'}>
                {pdfpath}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  url_val == 'lab/'
                    ? setImage1(
                        encounter.current,
                        serviceRef.current,
                        urlRef.current,
                      )
                    : setImage(
                        encounter.current,
                        serviceRef.current,
                        urlRef.current,
                      );
                }}
                style={{
                  backgroundColor: DEFAULT_INVERSE_LIGHT,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                }}
                testID="browseTouch"
                accessibilityLabel="browseTouch">
                <Text testID="browseText" accessibilityLabel="browseText">
                  {t('COMMON.BROWSE')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            uploadPdf(
              encounter.current,
              serviceRef.current,
              urlRef.current,
              pdfpath,
              fileName,
            );
          }}
          style={{
            backgroundColor: APP_PRIMARY_COLOR,
            padding: 10,
            margin: 5,
            borderRadius: 5,
          }}
          testID="uploadedSelectedTouch"
          accessibilityLabel="uploadedSelectedTouch">
          <Text
            testID="uploadedSelectedText"
            accessibilityLabel="uploadedSelectedText"
            style={{
              color: DEFAULT_WHITE_COLOR,
              textAlign: 'center',
              fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
              fontSize: 18,
            }}>
            {t('COMMON.UPLOADED_SELECTED')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{marginTop: hp(50)}}>
        <Loader />
      </View>
    );
  }
  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <Header
        title={t('COVID_MONITORING.REPORT')}
        navigation={navigation}
        testID="reportHeader"
        accessibilityLabel="reportHeader"
      />
      <FileSelector
        ref={fileSelRef}
        onError={() => {
          if (mulImg?.length > 0) {
            convertPDF(
              encounter?.current,
              serviceRef.current,
              urlRef.current,
              '',
              '',
            );
          }
        }}
        onSelection={handleSelection}
        selectAny
      />
      {filterData.appointment ? (
        <View>
          <View
            style={{
              padding: wp(15),
              backgroundColor: DEFAULT_WHITE_COLOR,
              borderRadius: 10,
            }}>
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
                  style={styles.alignment}
                  testID={filterData.appointment?.date_start + 'text'}
                  accessibilityLabel={
                    filterData.appointment?.date_start + 'text'
                  }>
                  {filterData.appointment?.date_start.slice(0, 10)}
                </Text>
              </View>
              <Card style={styles.card} borderRadius={10}>
                {/* {data.filter()((i, idx) => {
                return ( */}
                <View style={{marginVertical: 10}}>
                  {/* <Card style={styles.card} borderRadius={10}> */}
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
                          filterData.appointment?.doctor_details?.full_name +
                          'name'
                        }
                        accessibilityLabel={
                          filterData.appointment?.doctor_details?.full_name +
                          'name'
                        }>
                        {filterData.appointment?.doctor_details?.salutation +
                          ' ' +
                          filterData.appointment?.doctor_details?.full_name}
                      </Text>
                      <Text
                        style={{
                          backgroundColor: DEFAULT_LIGHT_GREEN_COLOR,
                          color: DEFAULT_GREEN_COLOR,
                          paddingHorizontal: 10,
                          paddingVertical: 2,
                        }}
                        testID={
                          filterData.appointment?.appointment_status + 'text'
                        }
                        accessibilityLabel={
                          filterData.appointment?.appointment_status + 'text'
                        }>
                        {filterData.appointment?.appointment_status}
                      </Text>
                    </View>

                    <Text
                      note
                      style={{
                        color: DEFAULT_GREY_COLOR,
                        paddingVertical: wp(5),
                      }}
                      testID={filterData.specialization + 'text'}
                      accessibilityLabel={filterData.specialization + 'text'}>
                      {filterData.specialization}
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
                          filterData.appointment?.branch_details?.branch_name +
                          'text'
                        }
                        accessibilityLabel={
                          filterData.appointment?.branch_details?.branch_name +
                          'text'
                        }>
                        {' '}
                        {filterData.appointment?.branch_details?.branch_name +
                          ' - ' +
                          filterData.appointment?.branch_details?.branch_id}
                      </Text>
                    </View>
                    <View style={styles.details}>
                      <Image
                        source={Name}
                        style={styles.imagesize}
                        testID="personImage"
                        accessibilityLabel="personImage"
                      />
                      <Text
                        style={styles.alignment}
                        testID={
                          filterData.appointment?.appointment_type + 'text'
                        }
                        accessibilityLabel={
                          filterData.appointment?.appointment_type + 'text'
                        }>
                        {'OutPatient - ' +
                          filterData.appointment?.appointment_type}
                      </Text>
                    </View>
                    <View style={styles.details}>
                      <Text
                        style={styles.alignment}
                        testID={
                          'chiefComplaintsText' +
                          patientList?.appointment?.description
                        }
                        accessibilityLabel={
                          'chiefComplaintsText' +
                          patientList?.appointment?.description
                        }>
                        Chief Complaints -
                        {patientList?.appointment?.description}
                      </Text>
                    </View>
                  </View>
                  {/* <Divider style={styles.lineStyle} /> */}
                  {/* </Card> */}
                </View>
                {/* );
              })} */}
                {/* <Divider style={styles.lineStyle} /> */}
              </Card>
              <Card style={styles.card} borderRadius={10}>
                <View>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                      textAlign: 'left',
                      margin: wp(10),
                    }}
                    testID="imagingReport"
                    accessibilityLabel="imagingReport">
                    {t('PLAN.IMAGING') + ' ' + t('COVID_MONITORING.REPORT')}
                  </Text>
                </View>
                {imgData.map(i => {
                  return (
                    <View style={{flexDirection: 'row', padding: wp(10)}}>
                      <Text
                        style={{width: '90%'}}
                        testID={i.service_name + 'text'}
                        accessibilityLabel={i.service_name + 'text'}>
                        {i.service_name}
                      </Text>

                      <Right>
                        {i.attachments?.length ? (
                          <TouchableOpacity
                            style={styles.labOrderIcon}
                            onPress={() =>
                              showPdf(i?.attachments[0]?.file_path)
                            }
                            testID="pdfTouch"
                            accessibilityLabel="pdfTouch">
                            <Image
                              testID="pdfImage"
                              accessibilityLabel="pdfImage"
                              source={Pdf}
                              style={{height: 25, width: 25}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            testID="addTouch"
                            accessibilityLabel="addTouch"
                            style={styles.labOrderIcon}
                            onPress={() =>
                              openImagePicker(i.encounter_id, i.id, 'imaging/')
                            }
                            disabled={
                              editalble_data == ''
                                ? false
                                : editalble_data == '0' && true
                            }>
                            <Image
                              testID="addImage"
                              accessibilityLabel="addImage"
                              source={AddImage}
                              style={{height: 25, width: 25}}
                            />
                          </TouchableOpacity>
                        )}
                      </Right>
                    </View>
                  );
                })}
              </Card>
              <Card style={styles.card} borderRadius={10}>
                <View>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                      textAlign: 'left',
                      marginHorizontal: wp(10),
                      marginVertical: wp(5),
                    }}
                    testID="laboratoryReport"
                    accessibilityLabel="laboratoryReport">
                    {t('PLAN.LABORATORY') + ' ' + t('COVID_MONITORING.REPORT')}
                  </Text>
                </View>
                {labData.map(i => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: wp(10),
                      }}>
                      <Text
                        style={{width: '90%'}}
                        testID={i.service_name + 'text'}
                        accessibilityLabel={i.service_name + 'text'}>
                        {i.service_name}
                      </Text>

                      <Right>
                        {i.attachments?.length ? (
                          <TouchableOpacity
                            testID="pdfTouch"
                            accessibilityLabel="pdfTouch"
                            style={styles.labOrderIcon}
                            onPress={() =>
                              showPdf2(i?.attachments[0]?.file_path)
                            }>
                            <Image
                              testID="pdfImage"
                              accessibilityLabel="pdfImage"
                              source={Pdf}
                              style={{height: 25, width: 25}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            testID="pdfTouch"
                            accessibilityLabel="pdfTouch"
                            style={styles.labOrderIcon}
                            onPress={() =>
                              openImagePicker(i.encounter_id, i.id, 'lab/')
                            }
                            disabled={
                              editalble_data == ''
                                ? false
                                : editalble_data == '0' && true
                            }>
                            <Image
                              testID="addImage"
                              accessibilityLabel="addImage"
                              source={AddImage}
                              style={{height: 25, width: 25}}
                            />
                          </TouchableOpacity>
                        )}
                      </Right>
                    </View>
                  );
                })}
              </Card>

              <Card style={styles.card} borderRadius={10}>
                <View>
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                      textAlign: 'left',
                      marginHorizontal: wp(10),
                      marginVertical: wp(5),
                    }}
                    testID="vaccineReport"
                    accessibilityLabel="vaccineReport">
                    {t('PLAN.VACCINE') + ' ' + t('COVID_MONITORING.REPORT')}
                  </Text>
                </View>
                {vaccineData.map(i => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: wp(10),
                      }}>
                      <Text
                        style={{width: '90%'}}
                        testID={i.vaccine_details.vaccine_brand_name + 'text'}
                        accessibilityLabel={
                          i.vaccine_details.vaccine_brand_name + 'text'
                        }>
                        {i.vaccine_details.vaccine_brand_name}
                      </Text>

                      <Right>
                        {
                          i.attachments?.length ? (
                            <TouchableOpacity
                              testID="pdfTouch"
                              accessibilityLabel="pdfTouch"
                              style={styles.labOrderIcon}
                              onPress={() =>
                                showPdf2(i?.attachments[0]?.file_path)
                              }>
                              <Image
                                testID="pdfImage"
                                accessibilityLabel="pdfImage"
                                source={Pdf}
                                style={{height: 25, width: 25}}
                              />
                            </TouchableOpacity>
                          ) : null
                          //  (
                          //   <TouchableOpacity
                          //     style={styles.labOrderIcon}
                          //     onPress={() =>
                          //       setImage1(i.encounter_id, i.id, "lab/")
                          //     }>
                          //     <FileSelector
                          //       ref={fileSelRef}
                          //       onSelection={handleSelection}
                          //       selectAny
                          //     />
                          //     <Image
                          //       source={AddImage}
                          //       style={{ height: 25, width: 25 }}
                          //     />
                          //   </TouchableOpacity>
                          // )
                        }
                      </Right>
                    </View>
                  );
                })}
              </Card>
            </View>
            <View>
              <Card>
                <Text
                  style={{color: DEFAULT_GREY_COLOR, padding: wp(10)}}
                  testID="receiptText"
                  accessibilityLabel="receiptText">
                  {t('COMMON.RECEIPT')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {receipts?.map((i, index) => {
                    return (
                      <TouchableOpacity
                        style={[styles.vital]}
                        onPress={() => showPdf1(i.pdf)}
                        testID="receiptTouch"
                        accessibilityLabel="receiptTouch">
                        <Image
                          source={Bill}
                          style={styles.img}
                          testID="receiptImage"
                          accessibilityLabel="receiptImage"
                        />
                        <Text
                          style={{paddingVertical: wp(10)}}
                          testID="receiptText"
                          accessibilityLabel="receiptText">
                          {t('COMMON.RECEIPT')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Card>
            </View>
          </View>
          <ActionSheet ref={attachmentref}>
            {/* <AttachmentFiles /> */}
            {AttachmentFiles()}
          </ActionSheet>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <AppLoader size={'small'} color={DEFAULT_WHITE_COLOR} />
        </View>
      )}
    </ScrollView>
  );
};
// export default Reports;
const mapStateToProps = state => {
  return {
    patientList: state.patientList.patientList,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Reports));

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_GREY_COLOR,
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
  image: {
    width: 18,
    height: 18,
    marginHorizontal: 5,
  },
  alignment: {
    textAlign: 'center',
    marginHorizontal: wp(8),
  },
  index: {
    marginVertical: wp(5),
  },
  vital: {
    // flexDirection: 'row',
    padding: wp(20),
    // marginRight: wp(10)
  },
  img: {
    width: 40,
    height: 40,
  },
});
