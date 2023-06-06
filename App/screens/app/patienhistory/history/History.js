import React, {useState, createRef, useEffect} from 'react';
import {Icon, Toast} from 'native-base';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import Cal from '../../../../assets/images/cal.png';
import {Divider} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import ImageResizer from 'react-native-image-resizer';
import RNImageToPdf from 'react-native-image-to-pdf';
import {
  DEFAULT_GREY_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  APP_PRIMARY_COLOR,
  DEFAULT_INVERSE_LIGHT,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
} from '../../../../themes/variable';
import {theme} from '../../../../themes/Theme';
import FooterButton from '../../common/FooterButton';
import ApiCall from '../../../../services/ApiCall';
import getBaseUrl, {getApiUrl} from '../../../../config/Config';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import {wp, hp} from '../../../../themes/Scale';
import Edit from '../../../../assets/images/edit.png';
import Plus from '../../../../assets/images/add1.png';
import Food from '../../../../assets/images/food.png';
import surgerie from '../../../../assets/images/surgerie.png';
import Collapsible from 'react-native-collapsible';
import {BackHandler} from 'react-native';
import Delete from '../../../../assets/images/delete.png';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actions-sheet';
import {connect} from 'react-redux';
import FileSelector from '../../../../components/fileselector/FileSelector';
import AsyncStorage from '@react-native-community/async-storage';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import {
  postAllergies,
  getAllergyTypes,
  getSeverityTypes,
  getHealthEventsTypes,
  PostHealthEvents,
  postRelationship,
  getRelationshipTypes,
  getAllergies,
  deleteAllergies,
  getFamilyHistoryDetails,
  updateAllergies,
  deleteFamilyHistory,
  updateFamilyHistory,
  getHealthEvents,
  deleteHealthEvent,
  updateHealthEvent,
} from '../../../../redux/actions/allergies_action';
import Pdf from '../../../../assets/images/adobe.png';
import {NativeToastTop} from '../../common/Toaster';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button} from 'react-native-paper';
import DatePicker1 from 'react-native-date-picker';

const AllergiesRef = createRef();
const SurgeriesRef = createRef();
const FamilyHistoryRef = createRef();
const fileSelRef = React.createRef();
const serviceRef = React.createRef();
const idRef = React.createRef();
const addRef = React.createRef();
const actionSheetRef = createRef();

const selectRef = React.createRef();
const eventTypeRef = React.createRef();
const eventTypeRefId = React.createRef();
const eventDetailsRef = React.createRef();
const eventDescriptionRef = React.createRef();
const eventidRef = React.createRef();
const pdfRef = React.createRef();
const detailtrue = React.createRef();

const editHealthEvent = React.createRef();

const History = ({navigation, patientList, t}) => {
  const [allergy, setAllergy] = useState(true);
  const [surgery, setSurgery] = useState(true);
  const [family, setFamily] = useState(true);
  const [allAllergies, setAllAllergies] = useState([]);
  const [editAllergy, setEditAllergy] = useState('');
  const [allFamilyHistory, setAllFamilyHistory] = useState([]);
  const [editFamily, setEditFamily] = useState('');
  const [allHealthEvents, setAllHealthEvents] = useState([]);
  // const [editHealthEvent, setEditHealthEvent] = useState({});
  const [showAddVaccince, setshowAddVaccince] = useState(false);
  const [pdf, setPdf] = useState();
  const [hlpid, setHlpId] = useState('');
  const [id_val, setIdVal] = useState('');
  const [url_val, setUrlVal] = useState('');
  const [path, setPath] = useState('');
  const [mulImg, setMulImg] = useState([]);
  const [pdfpath, setPdfPath] = useState('');
  const [fileName, setfileName] = useState('');

  const openAction = () => {
    // setTimeout(() => {
    // actionSheetRef.current?.setModalVisible( true );
    setshowAddVaccince(true);
    // }, 250);
  };

  const clearState = () => {
    eventidRef.current = null;
    eventTypeRef.current = null;
    eventDescriptionRef.current = null;
    eventDetailsRef.current = null;
    pdfRef.current = null;
    editHealthEvent.current = null;
  };

  const handleSelection = async files => {
    console.log(files, 'files');
    if (files && files.length) {
      uploadFile(files[0]);
    }
  };

  const showPdf = pdflink => {
    if (!pdflink) return alert('Invalid');
    navigation.navigate('ViewPdfScreen', {
      link: `${getApiUrl()}${pdflink}`,
      screenname: 'Significant Upload Attachement',
    });
  };

  const uploadFile = file => {
    const path = file.path;
    const healpha_id = patientList.appointment.healpha_id;
    const id = id_val || idRef.current;
    const url = url_val;
    console.log('printing healpha id in line 147 historyyyyyyy', healpha_id);
    let checkFile = path.split('.');

    if (checkFile.slice(-1)[0]?.toLowerCase() === 'pdf') {
      let filename;
      filename = healpha_id + '_Immunization_' + id + '.pdf';
      //  setPdfPath(path);
      // path = ;
      // let decodepath = decodeURI(file?.fileCopyUri.replace("file:/", ""));
      // console.log(decodepath);
      pdfRef.current = {
        filePath: path,
        filename,
      };
      setfileName(filename);
    } else {
      try {
        ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
          .then(({path}) => {
            pdfRef.current = path;
            const path1 = path;
            let source;
            source = {path: path1};
            if (path1.split('.')[1] == 'pdf') {
              let filename;
              filename = healpha_id + '_Immunization_' + id + '.pdf';
              // setPdfPath(path1);
              pdfRef.current = path1;
            } else {
              // mulImg.push(path1);
              setMulImg([...mulImg, path1]);
              setTimeout(() => {
                checkConvert(healpha_id, id, url, file, path1);
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

  const checkConvert = (healpha_id, id, url, file, path1) => {
    Alert.alert(
      t('VACCINATION.ATTACHMENT_ADDED'),
      t('VACCINATION.ADD_MORE'),
      [
        {
          text: t('COMMON.YES'),
          onPress: () => setImage(healpha_id, id, url),
        },
        {
          text: t('COMMON.NO'),
          onPress: () => {
            convertPDF(id, path1), openAction();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const convertPDF = async (id, path1) => {
    // this.refs.loading.show();
    const hlp_id = patientList.appointment.healpha_id;
    let filename = hlp_id + '_Immunization_' + id + '.pdf';
    let checkPath = [];
    if (!path1?.trim()) {
      checkPath = mulImg;
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
      pdfRef.current = {...pdf, filename};
      setfileName(filename);
    } catch (e) {
      console.log(e);
    }
  };

  const uploadPdf = async (encounterid, path, pdfname) => {
    const doc_id = patientList.appointment.doc_id;
    const hlp_id = patientList.appointment.healpha_id;
    const id = idRef.current;
    let token = await AsyncStorage.getItem('jwt_token');
    let url =
      getBaseUrl() +
      `v1/person/${hlp_id}/health-event/${id}/attachment?mime_type=pdf`;
    console.log(url, 'Heloooooooooooooo');
    let pt = new FormData();
    pt.append('description', 'desc2');
    pt.append('file_name', pdfname);
    pt.append('file', {
      uri: 'file://' + path,
      type: 'application/pdf',
      name: pdfname,
    });

    console.log(pt, 'Hello ptt');

    ApiCall.post(url, pt, {
      Authorization: `Bearer ${token}`,
      otherHeader: 'foo',
      'Content-Type': 'multipart/form-data',
    })
      .then(res => {
        console.log(res, 'response');
        if (res.message) {
          clearState();
          getHealthEventsData(patientList?.appointment?.healpha_id);
          NativeToastTop({
            text: 'Significant Health Event added',
            type: 'success',
          });
          // getData();
          setfileName('');
          eventDescriptionRef.current = null;
          eventDetailsRef.current = null;
          eventTypeRef.current = null;
          idRef.current = null;
          pdfRef.current = null;
        } else {
          Toast.show({
            text: 'Upload Failed',
            type: 'danger',
            duration: 5000,
          });
        }
      })
      .catch(err => {
        console.log(err, 'Error');
      })
      .finally(res => {
        console.log(res, 'finally');

        setshowAddVaccince(false);
      });
  };

  const setImage = (healpha_id, id, url) => {
    console.log(fileSelRef.current, 'fileSelRef');
    setshowAddVaccince(true);
    serviceRef.current = id;
    setHlpId(healpha_id);
    setIdVal(id);
    setUrlVal(url);
    // fileSelRef?.current?.openPicker();
    setTimeout(() => {
      fileSelRef?.current?.openPicker();
    }, 250);
  };

  const Status = [
    {
      id: 0,
      status: 'InActive',
    },
    {
      id: 1,
      status: 'Active',
    },
  ];

  function handleBackButtonClick() {
    navigation.goBack();
    setEditAllergy('');
    setEditFamily('');
    // setEditHealthEvent( '' );
    editHealthEvent.current = '';
    return true;
  }

  const getAlleriesData = async () => {
    const healpha_id = patientList?.appointment?.healpha_id;
    console.log(healpha_id, 'Healpha_idddd');
    const data = await getAllergies({healpha_id});
    // console.log(data, 'person_allergies');
    setAllAllergies(data.person_allegies);
  };

  const getFamilyHistoryData = async () => {
    const healpha_id = patientList?.appointment?.healpha_id;
    const data = await getFamilyHistoryDetails({healpha_id});
    console.log(data, 'Family');
    setAllFamilyHistory(data);
  };
  const getHealthEventsData = async () => {
    const healpha_id = patientList?.appointment?.healpha_id;
    const data = await getHealthEvents({healpha_id});
    // console.log(data, "HealthEvents");
    setAllHealthEvents(data);
  };

  const DeleteAllergy = async id => {
    const allergies_id = id;
    const deleted = await deleteAllergies({allergies_id});
    alert('Allergy Deleted');
    getAlleriesData();
  };

  const DeleteHealthEvent = async id => {
    const event_id = id;
    await deleteHealthEvent({event_id})
      .then(res => {
        if (res) {
          NativeToastTop({
            text: 'Significant Health Event Deleted',
            type: 'success',
          });
          getHealthEventsData();
        }
      })
      .catch(res => {
        NativeToastTop({text: res.message, type: 'warning'});
      });
  };

  const DeleteFamily = async family_id => {
    await deleteFamilyHistory({family_id})
      .then(res => {
        getFamilyHistoryData();
        NativeToastTop({text: 'Family History Deleted', type: 'success'});
      })
      .catch(err => {
        NativeToastTop({text: err.message, type: 'warning'});
      });
  };

  const onChangeDetails = async val => {
    eventDetailsRef.current = null;
    eventDetailsRef.current = val;
  };
  const enableDatePicker = date => {
    if (datePicker === false) {
      setdatePicker(true);
    } else {
      setdatePicker(false);
    }
  };
  const handleDateOfAllergy = (event, date) => {
    console.log('date', date);
    if (event.type === 'dismissed') {
      setdatePicker(false);
      return;
    } else {
      setObserved(date);
      setdatePicker(false);
    }
  };
  useEffect(() => {
    getFamilyHistoryData(patientList?.appointment?.healpha_id),
      getAlleriesData(patientList?.appointment?.healpha_id),
      getHealthEventsData(patientList?.appointment?.healpha_id);
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      backHandler.remove();
    };
  }, []);

  const History1 = () => {
    return (
      <View style={{flexDirection: 'row', padding: wp(20)}}>
        <View
          style={{
            flex: 5,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <FlatList
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            data={allAllergies}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View>
                    <View style={{flexDirection: 'row'}} key={index}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={styles.index}
                          testID="allergenText"
                          accessibilityLabel="allergenText">
                          {t('PATIENTS.ALLERGEN')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index}>-</Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          testID={item.allergen + 'text'}
                          accessibilityLabel={item.allergen + 'text'}>
                          {item.allergen}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}} key={index}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={styles.index}
                          testID="selectSeverityText"
                          accessibilityLabel="selectSeverityText">
                          {t('PATIENTS.SELECT_SEVERITY')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index}>-</Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          testID={item.severity + 'text'}
                          accessibilityLabel={item.severity + 'text'}>
                          {item.severity}
                        </Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row'}} key={index}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={styles.index}
                          testID="observeOnText"
                          accessibilityLabel="observeOnText">
                          {t('PATIENTS.OBSERVE_ON')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index}>-</Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          testID={item.observed_on + 'text'}
                          accessibilityLabel={item.observed_on + 'text'}>
                          {moment(item.observed_on).format('MMM DD YYYY')}
                          {/* {item.observed_on?.toString().slice(0, 10)} */}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}} key={index}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={styles.index}
                          testID="selectStatusText"
                          accessibilityLabel="selectStatusText">
                          {t('PATIENTS.SELECT_STATUS')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index}>-</Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          testID="statusText"
                          accessibilityLabel="statusText">
                          {item.status ? 'Active' : 'InActive'}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}} key={index}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={styles.index}
                          testID="reactionText"
                          accessibilityLabel="reactionText">
                          {t('PATIENTS.REACTION')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index}>-</Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          testID={item.reaction + 'text'}
                          accessibilityLabel={item.reaction + 'text'}>
                          {item.reaction}
                        </Text>
                      </View>
                    </View>
                    <Divider
                      style={(styles.lineStyle, {marginVertical: wp(10)})}
                    />
                  </View>
                  <View style={styles.allergiesss}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditAllergy(item);
                        AllergiesRef.current?.setModalVisible();
                      }}
                      testID="editTouch"
                      accessibilityLabel="editTouch">
                      <Image
                        source={Edit}
                        style={{width: 25, height: 20}}
                        testID="editImage"
                        accessibilityLabel="editImage"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => DeleteAllergy(item.allergies_id)}
                      testID="deleteTouch"
                      accessibilityLabel="deleteTouch">
                      <Image
                        testID="deleteImage"
                        accessibilityLabel="deleteImage"
                        source={Delete}
                        style={{width: 20, height: 20, marginLeft: wp(10)}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };
  const AddAllergy = () => {
    const [allergyType, setAllergyType] = useState(
      editAllergy ? editAllergy.allergy_type : '',
    );
    const [allergen, setAllergen] = useState(
      editAllergy ? editAllergy.allergen : '',
    );
    const [severity, setSeverity] = useState(
      editAllergy ? editAllergy.severity : '',
    );
    const [status, setStatus] = useState(
      editAllergy ? (editAllergy.status ? 'Active' : 'InActive') : '',
    );
    const [reaction, setReaction] = useState(
      editAllergy ? editAllergy.reaction : '',
    );
    const [observed, setObserved] = useState(
      editAllergy ? editAllergy.observed_on : '',
    );
    const [allergyTypes, setAllergyTypes] = useState([]);
    const [severityTypes, setSeverityTypes] = useState([]);
    const [datePicker, setdatePicker] = useState(false);

    useEffect(() => {
      const res = async () => {
        const data = await getAllergyTypes();
        setAllergyTypes(data.values);
      };
      res();

      const res1 = async () => {
        const data = await getSeverityTypes();
        setSeverityTypes(data.values);
      };
      res1();
    }, []);

    const onAdd = async () => {
      if (!allergyType?.trim()) return alert('Allergy Type Required!');
      if (!allergen.trim()) return alert('Allergen Required!');
      if (!severity.trim()) return alert('Severity Required!');
      if (!status.trim()) return alert('Status Required!');
      if (!reaction.trim()) return alert('Reaction Required!');
      if (!observed.trim()) return alert('Date Required!');
      const variables = {
        healpha_id: patientList?.appointment?.healpha_id,
        allergy_type: allergyType,
        allergen,
        allergy_severity: severity,
        allergy_status: status === 'Active' ? 1 : 0,
        reaction,
        observed_on: observed,
        updated_by: patientList?.appointment?.healpha_id,
      };
      console.log(variables);
      await postAllergies(variables)
        .then(res => {
          alert('Users Allergies Created');
          getAlleriesData();
          AllergiesRef.current?.setModalVisible(false);
        })
        .catch(error => {
          console.log(error, 'error');
        });
    };
    const onUpdate = async () => {
      const variables = {
        allergies_id: editAllergy.allergies_id,
        healpha_id: patientList?.appointment?.healpha_id,
        allergy_type: allergyType,
        allergen,
        allergy_severity: severity,
        allergy_status: status === 'Active' ? 1 : 0,
        reaction,
        observed_on: observed,
      };
      // console.log(variables.allergy_status, status, 'final');
      await updateAllergies(variables)
        .then(res => {
          console.log(res, 'responsesee');

          alert('Users Allergies Updated');
          getAlleriesData();
          AllergiesRef.current?.setModalVisible(false);
        })
        .catch(error => {})
        .finally(() => {
          setEditAllergy('');
        });
    };
    return (
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          onPress={Keyboard.dismiss}>
          <View style={styles.paddingA}>
            <View style={styles.directionA}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                  fontSize: 18,
                }}
                testID="addAllergyText"
                accessibilityLabel="addAllergyText">
                {t('PATIENTS.ADD_ALLERGY')}
                {/* {editAllergy.id
              ? `${t('PATIENTS.UPDATE')}`
              : `${t('PATIENTS.ADD')}`}
            {t('PATIENTS.ALLERGY')} */}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditAllergy('');
                  AllergiesRef.current?.setModalVisible();
                }}
                testID="closeTouch"
                accessibilityLabel="closeTouch">
                <Icon
                  name="close"
                  type="Ionicons"
                  style={{fontSize: 25}}
                  testID="closeIcon"
                  accessibilityLabel="closeIcon"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.marginA}>
              <View style={styles.screentop}>
                <Text
                  style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                  testID="allergyTypeText"
                  accessibilityLabel="allergyTypeText">
                  {t('PATIENTS.ALLERGY_TYPE')}
                </Text>
                <SelectDropdown
                  testID="allergyDropdown"
                  accessibilityLabel="allergyDropdown"
                  data={allergyTypes}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem.id);
                    setAllergyType(selectedItem.label);
                  }}
                  defaultButtonText={
                    editAllergy
                      ? allergyType
                      : `${t('PATIENTS.SELECT_ALLERGY')}`
                  }
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.label;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.label;
                  }}
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        testID="arrowIcon"
                        accessibilityLabel="arrowIcon"
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#444'}
                        size={18}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
              </View>
            </View>
            <View style={styles.marginA}>
              <Text
                style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                testID="allergenText"
                accessibilityLabel="allergenText">
                {t('PATIENTS.ALLERGEN')}
              </Text>
              <TextInput
                testID="allergenTextInput"
                accessibilityLabel="allergenTextInput"
                value={allergen}
                onChangeText={val => setAllergen(val)}
                style={styles.allergyinput}
              />
            </View>
            <View style={styles.marginA}>
              <View style={styles.screentop}>
                <Text
                  style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                  testID="selectSeverityText"
                  accessibilityLabel="selectSeverityText">
                  {t('PATIENTS.SELECT_SEVERITY')}
                </Text>
                <SelectDropdown
                  testID="selectSeverityDropDown"
                  accessibilityLabel="selectSeverityDropDown"
                  data={severityTypes}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem.id, index);
                    setSeverity(selectedItem.label);
                  }}
                  defaultButtonText={
                    editAllergy ? severity : `${t('PATIENTS.SELECT_SEVERITY')}`
                  }
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.label;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.label;
                  }}
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        testID="arrowIcon1"
                        accessibilityLabel="arrowIcon1"
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#444'}
                        size={18}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
              </View>
            </View>
            <View style={styles.marginA}>
              <Text
                style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                testID="selectStatusText"
                accessibilityLabel="selectStatusText">
                {t('PATIENTS.SELECT_STATUS')}
              </Text>
              <SelectDropdown
                testID="selectStatusDropDown"
                accessibilityLabel="selectStatusDropDown"
                data={Status}
                defaultButtonText={
                  editAllergy ? status : `${t('PATIENTS.SELECT_STATUS')}`
                }
                onSelect={val => {
                  // console.log(val.id);
                  setStatus(val.status);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.status;
                }}
                rowTextForSelection={(item, index) => {
                  return item.status;
                }}
                buttonStyle={styles.dropdown4BtnStyle}
                buttonTextStyle={styles.dropdown4BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                  return (
                    <Feather
                      testID="arrpwIcon3"
                      accessibilityLabel="arrpwIcon3"
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#444'}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown4DropdownStyle}
                rowStyle={styles.dropdown4RowStyle}
                rowTextStyle={styles.dropdown4RowTxtStyle}
              />
            </View>
            <View style={styles.marginA}>
              <Text
                style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                testID="reactionText"
                accessibilityLabel="reactionText">
                {t('PATIENTS.REACTION')}
              </Text>
              <TextInput
                testID="reactionTextInput"
                accessibilityLabel="reactionTextInput"
                multiline={true}
                numberOfLines={3}
                value={reaction}
                onChangeText={val => setReaction(val)}
                style={{
                  // height: 100,
                  textAlignVertical: 'top',
                  borderColor: DEFAULT_LIGHT_GREY_COLOR,
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: Platform.OS == 'android' ? 5 : 10,
                }}
              />
            </View>
            <View style={styles.marginA}>
              <Text
                style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                testID="observeOnText"
                accessibilityLabel="observeOnText">
                {t('PATIENTS.OBSERVE_ON')}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Image
                  testID="observeOnImage"
                  accessibilityLabel="observeOnImage"
                  source={Cal}
                  style={{width: 30, height: 30, alignSelf: 'center'}}
                />
                <Button
                  testID="dateButton"
                  accessibilityLabel="dateButton"
                  style={{
                    borderColor: DEFAULT_LIGHT_GREY_COLOR,
                    borderWidth: 1,
                    borderRadius: 1,
                    padding: 0,
                  }}
                  onPress={() => setdatePicker(true)}>
                  <Text
                    style={{color: DEFAULT_LIGHT_GREY_COLOR}}
                    testID="dateText"
                    accessibilityLabel="dateText">
                    {observed != ''
                      ? // ? new Date(moment(this.state.details?.dob))
                        moment(observed).format('YYYY-MM-DD')
                      : 'select date'}
                  </Text>
                </Button>
                {/* <DatePicker
                showIcon={false}
                style={{ width: 180 }}
                date={observed}
                confirmBtnText="confirm"
                cancelBtnText="cancel"
                mode="date"
                maxDate={new Date()}
                placeholder="select date"
                format="YYYY-MM-DD"
                onDateChange={(selectedDate) => setObserved(selectedDate)}
              /> */}
              </View>
            </View>
            {datePicker && (
              <DateTimePicker
                testID="dateOfAllergy"
                accessibilityLabel="dateOfAllergy"
                value={observed != '' ? new Date(moment(observed)) : new Date()}
                display="default"
                mode={'date'}
                onChange={(event, date) => {
                  const new_date = moment(date).format('YYYY-MM-DD');
                  // handleDateOfAllergy(event,new_date)
                  if (event.type === 'dismissed') {
                    setdatePicker(false);
                    return;
                  } else {
                    setObserved(new_date);
                    setdatePicker(false);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
            <TouchableOpacity
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                padding: 12,
                borderRadius: 5,
                marginVertical: 10,
              }}
              onPress={editAllergy ? onUpdate : onAdd}
              testID="allergyTouch"
              accessibilityLabel="allergyTouch">
              <Text
                style={{
                  color: DEFAULT_WHITE_COLOR,
                  textAlign: 'center',
                  fontFamily: 'NunitoSans-Bold',
                  fontSize: 18,
                }}
                testID="allergyText"
                accessibilityLabel="allergyText">
                {editAllergy
                  ? `${t('PATIENTS.UPDATE_ALLERGE')}`
                  : `${t('PATIENTS.SAVE_ALLERGY')}`}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  };
  const [eventTypes, setEventTypes] = useState([]);
  useEffect(() => {
    const res = async () => {
      await getHealthEventsTypes()
        .then(res => {
          setEventTypes(res.values);
        })
        .catch(err => {
          console.log(err);
        });
    };
    res();
  }, [showAddVaccince]);

  const AddHealthEvent = () => {
    const onAddHealthEvent = async () => {
      setSurgery(true);
      if (!eventTypeRef?.current.trim())
        return alert('HealthEvent Type Required!');
      if (!eventDetailsRef?.current.trim())
        return alert('Event Name Type Required!');
      if (!eventDescriptionRef?.current.trim())
        return alert('Event Details Type Required!');

      const variables = {
        healpha_id: patientList?.appointment?.healpha_id,
        event_type: eventTypeRef?.current,
        event_name: eventDetailsRef?.current,
        event_description: eventDescriptionRef?.current,
        status: 1,
      };

      await PostHealthEvents(variables)
        .then(res => {
          // console.log('stage 1', idRef.current, res);
          idRef.current = res.id; // added vaccine id after getting
          if (pdfRef.current !== null) {
            return uploadPdf(hlpid, pdfRef?.current?.filePath, fileName);
          } else {
            setfileName('');
            eventDescriptionRef.current = null;
            eventDetailsRef.current = null;
            eventTypeRef.current = null;
            idRef.current = null;

            NativeToastTop({
              text: 'Significant Health Event added',
              type: 'success',
            });
            setshowAddVaccince(false);
          }
        })
        .catch(error => {
          NativeToastTop({text: error.message, type: 'warning'});
        })
        .finally(async res => {
          console.log(res, 'finally123');

          await getHealthEventsData();
        });
    };

    const onUpdateHealthEvent = async () => {
      setSurgery(true);
      const variables = {
        event_id: eventidRef?.current,
        healpha_id: patientList?.appointment?.healpha_id,
        event_type: eventTypeRef?.current,
        event_name: eventDetailsRef?.current,
        event_description: eventDescriptionRef?.current,
        status: 1,
      };
      await updateHealthEvent(variables)
        .then(res => {
          idRef.current = eventidRef?.current;
          if (pdfRef.current !== null) {
            return uploadPdf(
              hlpid,
              pdfRef?.current?.filePath,
              pdfRef?.current?.filename,
            );
          } else {
            eventDescriptionRef.current = null;
            eventDetailsRef.current = null;
            eventTypeRef.current = null;
            idRef.current = null;

            NativeToastTop({
              text: 'Significant Health Event updated',
              type: 'success',
            });
          }
          getHealthEventsData();
          editHealthEvent.current = {};
        })
        .catch(error => {})
        .finally(() => {
          // setEditHealthEvent('');
          setshowAddVaccince(false);
        });
    };

    if (detailtrue.current) {
      let item = editHealthEvent.current;
      eventTypeRef.current = item?.event_type;
      eventDetailsRef.current = item?.event_name;
      eventDescriptionRef.current = item?.event_description;
      eventidRef.current = item.id;
      detailtrue.current = false;
    }
    return (
      // <Modal style={{margin: 0, padding: 0}}>

      <View
        style={[
          {
            backgroundColor: DEFAULT_WHITE_COLOR,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        ]}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          onPress={Keyboard.dismiss}>
          <ScrollView>
            <FileSelector
              ref={fileSelRef}
              onError={() => {
                if (mulImg?.length > 0) {
                  convertPDF(id_val || idRef.current, '');
                }
              }}
              onSelection={handleSelection}
              selectAny
              multiple
            />
            <View style={styles.directionA}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                  fontSize: 18,
                }}
                testID="healthEventsText"
                accessibilityLabel="healthEventsText">
                {editHealthEvent?.current?.id
                  ? `${t('PATIENTS.UPDATE')}`
                  : `${t('PATIENTS.ADD')}`}{' '}
                {t('PATIENTS.SIGNIFICANT HEALTH EVENTS')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // setEditHealthEvent({});
                  editHealthEvent.current = {};
                  // SurgeriesRef.current?.setModalVisible();
                  clearState();
                  setshowAddVaccince(false);
                  // actionSheetRef.current?.setModalVisible(false)
                }}
                testID="closeTouch"
                accessibilityLabel="closeTouch">
                <Icon
                  name="close"
                  type="Ionicons"
                  style={{fontSize: 25}}
                  testID="closeIcon"
                  accessibilityLabel="closeIcon"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.marginA}>
              <View style={styles.screentop}>
                <Text
                  style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                  testID="healthEventTypeText"
                  accessibilityLabel="healthEventTypeText">
                  {t('PATIENTS.HEALTH EVENT TYPE')}
                </Text>
                <SelectDropdown
                  testID="eventTypeDropDown"
                  accessibilityLabel="eventTypeDropDown"
                  data={eventTypes}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem.id, index);
                    eventTypeRef.current = selectedItem.label_name;
                    eventTypeRefId.current = selectedItem.id;
                  }}
                  defaultButtonText={
                    eventTypeRef?.current
                      ? eventTypeRef?.current
                      : `${
                          t('PATIENTS.SELECT') +
                          ' ' +
                          t('PATIENTS.HEALTH EVENT TYPE')
                        }`
                  }
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.label_name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.label_name;
                  }}
                  buttonStyle={styles.dropdown4BtnStyle}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        testID="arrowIcon4"
                        accessibilityLabel="arrowIcon4"
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#444'}
                        size={18}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdown4DropdownStyle}
                  rowStyle={styles.dropdown4RowStyle}
                  rowTextStyle={styles.dropdown4RowTxtStyle}
                />
              </View>
            </View>
            <View style={styles.marginA}>
              <Text
                style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                testID="eventNameText"
                accessibilityLabel="eventNameText">
                {t('PATIENTS.EVENT_NAME')}
              </Text>
              <TextInput
                testID="eventNameTextInput"
                accessibilityLabel="eventNameTextInput"
                style={styles.allergyinput}
                defaultValue={eventDetailsRef?.current}
                onChangeText={onChangeDetails}
              />
            </View>
            <View style={styles.marginA}>
              <Text
                style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
                testID="eventDetailsText"
                accessibilityLabel="eventDetailsText">
                {t('PATIENTS.EVENT_DETAILS')}
              </Text>
              <TextInput
                testID="eventDetailsTextInput"
                accessibilityLabel="eventDetailsTextInput"
                multiline={true}
                numberOfLines={10}
                placeholder={`${t('COMMON.ADDEVENT')}`}
                style={styles.placeholderInput}
                defaultValue={eventDescriptionRef?.current}
                onChangeText={val =>
                  // setEventDetails(val)
                  {
                    eventDescriptionRef.current = val;
                  }
                }
              />
            </View>
            {!pdfRef?.current && (
              <TouchableOpacity
                testID="uploadTouch"
                accessibilityLabel="uploadTouch"
                style={{
                  backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
                  padding: 12,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
                onPress={() => {
                  // idRef.current = item.id;
                  setImage(null, null);
                  addRef.current = true;
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Icon
                    testID="uploadImage"
                    accessibilityLabel="addAllergyText"
                    name="cloud-upload"
                    type="MaterialIcons"
                    style={{
                      color: APP_PRIMARY_COLOR,
                      fontSize: 20,
                      alignSelf: 'center',
                      marginHorizontal: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: APP_PRIMARY_COLOR,
                      textAlign: 'center',
                      fontFamily: 'NunitoSans-Bold',
                      fontSize: 18,
                    }}
                    testID="uploadFileText"
                    accessibilityLabel="uploadFileText">
                    {t('PATIENTS.UPLOAD_FILE')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {/* {!pdfRef?.current ? null : (
          <TextInput
            value={fileName}
            onChangeText={(e) => {
              setfileName(e);
            }}
          />
        )} */}
            {pdfRef?.current && (
              <View>
                <TextInput
                  testID="enterNameTextInput"
                  accessibilityLabel="enterNameTextInput"
                  style={styles.allergyinput}
                  placeholder={`${t('TIMELINE.ENTER_NAME')}`}
                  value={fileName}
                  defaultValue={fileName}
                  onChangeText={e => {
                    setfileName(e);
                  }}
                />
              </View>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: APP_PRIMARY_COLOR,
                padding: 12,
                borderRadius: 5,
                marginVertical: 10,
              }}
              // onPress={onAddHealthEvent}
              onPress={
                editHealthEvent?.current?.id
                  ? onUpdateHealthEvent
                  : onAddHealthEvent
              }
              testID="eventTouch"
              accessibilityLabel="eventTouch">
              <Text
                style={{
                  color: DEFAULT_WHITE_COLOR,
                  textAlign: 'center',
                  fontFamily: 'NunitoSans-Bold',
                  fontSize: 18,
                }}
                testID="eventText"
                accessibilityLabel="eventText">
                {/* Save Event */}
                {editHealthEvent?.current?.id
                  ? `${t('TIMELINE.UPDATE EVENT')}`
                  : `${t('TIMELINE.SAVE EVENT')}`}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      // </Modal>
    );
  };
  const AddFamilyHistory = () => {
    const [relation, setRelation] = useState(
      editFamily ? editFamily.relation : '',
    );
    const [details, setDetails] = useState(
      editFamily ? editFamily.description : '',
    );
    const [relationTypes, setRelationTypes] = useState([]);

    useEffect(() => {
      const res = async () => {
        const data = await getRelationshipTypes();
        setRelationTypes(data?.values || []);
      };
      res();
    }, []);

    const onAddFamily = async () => {
      if (!relation?.trim()) return alert('Relation Type Required!');
      if (!details?.trim()) return alert('Family Details Required!');
      const variables = {
        healpha_id: patientList?.appointment?.healpha_id,
        relation,
        description: details,
      };
      await postRelationship(variables)
        .then(async res => {
          alert('Users Family History Created');
          await getFamilyHistoryData();
          FamilyHistoryRef.current?.setModalVisible(false);
        })
        .catch(error => {});
    };
    const onUpdateFamily = () => {
      const variables = {
        family_id: editFamily.id,
        healpha_id: patientList?.appointment?.healpha_id,
        relation,
        description: details,
      };
      updateFamilyHistory(variables)
        .then(async res => {
          alert('Users Family History Updated');
          await getFamilyHistoryData();
          FamilyHistoryRef.current?.setModalVisible(false);
        })
        .catch(error => {})
        .finally(() => {
          setEditFamily('');
        });
    };
    return (
      <View style={[styles.paddingA, {backgroundColor: DEFAULT_WHITE_COLOR}]}>
        <View
          style={[styles.directionA, {backgroundColor: DEFAULT_WHITE_COLOR}]}>
          <Text
            style={{fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD, fontSize: 18}}>
            {t('PATIENTS.ADD_FAMILY_HISTORY')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              FamilyHistoryRef.current?.setModalVisible();
            }}
            testID="addAllergyText"
            accessibilityLabel="addAllergyText">
            <Icon
              name="closeIcon"
              type="closeIcon"
              style={{fontSize: 25}}
              testID="closeImage"
              accessibilityLabel="closeImage"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.marginA}>
          <View style={styles.screentop}>
            <Text
              style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
              testID="relationText"
              accessibilityLabel="relationText">
              {t('PATIENTS.RELATION')}
            </Text>
            <SelectDropdown
              testID="relationDropDown"
              accessibilityLabel="relationDropDown"
              data={relationTypes}
              onSelect={(selectedItem, index) => {
                setRelation(selectedItem.label);
              }}
              defaultButtonText={
                editFamily
                  ? relation
                  : `${t('PATIENTS.SELECT') + ' ' + t('PATIENTS.RELATION')}`
              }
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return (
                  <Feather
                    testID="arrowIcon5"
                    accessibilityLabel="arrowIcon5"
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#444'}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown4DropdownStyle}
              rowStyle={styles.dropdown4RowStyle}
              rowTextStyle={styles.dropdown4RowTxtStyle}
            />
          </View>
        </View>

        <View style={styles.marginA}>
          <Text
            style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
            testID="updateFamilyDetailsText"
            accessibilityLabel="updateFamilyDetailsText">
            {t('PATIENTS.PLEASE_UPDATE_FAMILY_DETAILS')}
          </Text>
          <TextInput
            testID="addIllnessText"
            accessibilityLabel="addIllnessText"
            multiline={true}
            numberOfLines={10}
            placeholder={t('PATIENTS.ADD_ILLNESS')}
            style={styles.placeholderInput}
            value={details}
            onChangeText={val => setDetails(val)}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: APP_PRIMARY_COLOR,
            padding: 12,
            borderRadius: 5,
            marginVertical: 10,
          }}
          // onPress={onAddFamily}
          onPress={editFamily ? onUpdateFamily : onAddFamily}
          testID="familyHistoryTouch"
          accessibilityLabel="familyHistoryTouch">
          <Text
            style={{
              color: DEFAULT_WHITE_COLOR,
              textAlign: 'center',
              fontFamily: 'NunitoSans-Bold',
              fontSize: 18,
            }}
            testID="familyHistoryText"
            accessibilityLabel="familyHistoryText">
            {editFamily
              ? `${t('PATIENTS.UPDATE_FAMILY_HISTORY')}`
              : `${t('PATIENTS.ADD_FAMILY_HISTORY')}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Surgeries = () => {
    return (
      <View style={{flexDirection: 'row', padding: wp(20)}}>
        <View
          style={{
            flex: 5,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <FlatList
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            data={allHealthEvents}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View>
                    {/* <View style={{flex: 4}}> */}
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.6}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID="healthEventTypeText"
                          accessibilityLabel="healthEventTypeText">
                          {t('PATIENTS.HEALTH EVENT TYPE')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index} key={index}>
                          -
                        </Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID={item.event_type + 'text'}
                          accessibilityLabel={item.event_type + 'text'}>
                          {item.event_type}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.6}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID="eventNameText"
                          accessibilityLabel="eventNameText">
                          {t('PATIENTS.EVENT_NAME')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index} key={index}>
                          -
                        </Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID={item.event_name + 'text'}
                          accessibilityLabel={item.event_name + 'text'}>
                          {item.event_name}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.6}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID="eventDetailsText"
                          accessibilityLabel="eventDetailsText">
                          {t('PATIENTS.EVENT_DETAILS')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index} key={index}>
                          -
                        </Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID={item.event_description + 'text'}
                          accessibilityLabel={item.event_description + 'text'}>
                          {item.event_description}
                        </Text>
                      </View>
                    </View>
                    {item?.health_event_files[0]?.file_url ? (
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 0.6}}>
                          <Text
                            style={styles.index}
                            key={index}
                            testID="attachmentText"
                            accessibilityLabel="attachmentText">
                            {t('PATIENTS.ATTACHMENT')}
                          </Text>
                        </View>
                        <View style={{flex: 0.2}}>
                          <Text
                            style={styles.index}
                            key={index}
                            testID="addAllergyText"
                            accessibilityLabel="addAllergyText">
                            -
                          </Text>
                        </View>
                        <View style={{flex: 1.0}}>
                          <TouchableOpacity
                            onPress={() => {
                              showPdf(item.health_event_files[0].file_url);
                            }}
                            testID="pdfTouch"
                            accessibilityLabel="pdfTouch">
                            <Image
                              testID="pdfImage"
                              accessibilityLabel="pdfImage"
                              source={Pdf}
                              style={{width: 30, height: 30}}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}

                    <Divider
                      style={(styles.lineStyle, {marginVertical: wp(10)})}
                    />
                  </View>
                  <View style={styles.allergiesss}>
                    <TouchableOpacity
                      onPress={() => {
                        // setEditHealthEvent(item);
                        editHealthEvent.current = item;
                        detailtrue.current = true;
                        setshowAddVaccince(true);
                        // SurgeriesRef.current?.setModalVisible();
                      }}
                      testID="editTouch"
                      accessibilityLabel="editTouch">
                      <Image
                        source={Edit}
                        style={{width: 25, height: 20}}
                        testID="editImage"
                        accessibilityLabel="editImage"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => DeleteHealthEvent(item.id)}>
                      <Image
                        testID="deleteImage"
                        accessibilityLabel="deleteImage"
                        source={Delete}
                        style={{width: 20, height: 20, marginLeft: wp(10)}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };
  const FamilyHistory = () => {
    return (
      <View style={{flexDirection: 'row', padding: wp(20)}}>
        <View
          style={{
            flex: 5,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <FlatList
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            data={allFamilyHistory}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View>
                    {/* <View style={{flex: 4}}> */}
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID="relationText"
                          accessibilityLabel="relationText">
                          {t('PATIENTS.RELATION')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index} key={index}>
                          -
                        </Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID={item.relation + 'text'}
                          accessibilityLabel={item.relation + 'text'}>
                          {item.relation}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID="descriptionText"
                          accessibilityLabel="descriptionText">
                          {t('PATIENTS.DESCRIPTION')}
                        </Text>
                      </View>
                      <View style={{flex: 0.2}}>
                        <Text style={styles.index} key={index}>
                          -
                        </Text>
                      </View>
                      <View style={{flex: 1.0}}>
                        <Text
                          style={styles.index}
                          key={index}
                          testID={item.description + 'text'}
                          accessibilityLabel={item.description + 'text'}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <Divider
                      style={(styles.lineStyle, {marginVertical: wp(10)})}
                    />
                  </View>
                  <View style={styles.allergiesss}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditFamily(item);
                        FamilyHistoryRef.current?.setModalVisible();
                      }}
                      testID="editTouch"
                      accessibilityLabel="editTouch">
                      <Image
                        source={Edit}
                        style={{width: 25, height: 20}}
                        testID="editImage"
                        accessibilityLabel="editImage"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => DeleteFamily(item.id)}
                      testID="deleteTouch"
                      accessibilityLabel="deleteTouch">
                      <Image
                        testID="deleteImage"
                        accessibilityLabel="deleteImage"
                        source={Delete}
                        style={{width: 20, height: 20, marginLeft: wp(10)}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };
  return (
    <ScrollView>
      <View style={{flex: 1, paddingBottom: 100}}>
        <View>
          <Text
            style={{margin: 10, fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD}}
            testID="allergyDetailsText"
            accessibilityLabel="allergyDetailsText">
            {t(
              'PATIENTS.PLEASE ENTER THE DETAILS OF ALERGIES & OTHER AILMENTS',
            )}
          </Text>
        </View>
        <Divider style={styles.lineStyle} />
        <Divider style={(styles.lineStyle, {marginTop: wp(20)})} />
        <View style={styles.allergytypes}>
          <View style={{width: '60%'}}>
            <Text
              style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
              testID="allergiesText"
              accessibilityLabel="allergiesText">
              {t('PATIENTS.ALLERGIES')}
            </Text>
            <Text
              style={{color: DEFAULT_GREY_COLOR}}
              testID="addAllergiesYouHaveText"
              accessibilityLabel="addAllergiesYouHaveText">
              {t('PATIENTS.ADD ANY ALLERGIES YOU HAVE')}
            </Text>
          </View>
          <View style={{width: '40%', alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                AllergiesRef.current?.setModalVisible();
                setAllergy(true);
              }}
              testID="plusTouch"
              accessibilityLabel="plusTouch">
              <Image
                source={Plus}
                style={{width: 30, height: 30}}
                testID="plusImage"
                accessibilityLabel="plusImage"
              />
            </TouchableOpacity>
          </View>
        </View>

        <ActionSheet ref={AllergiesRef}>
          <AddAllergy />
        </ActionSheet>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(15),
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View>
            <TouchableOpacity
              onPress={() => setAllergy(!allergy)}
              style={{flexDirection: 'row'}}
              testID="foodAllergyTouch"
              accessibilityLabel="foodAllergyTouch">
              <Image
                source={Food}
                style={{width: 30, height: 30, margin: 2}}
                testID="foodImage"
                accessibilityLabel="foodImage"
              />
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                }}
                testID="foodAllergyText"
                accessibilityLabel="foodAllergyText">
                {t('PATIENTS.FOOD ALLERGY')}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setAllergy(!allergy)}
              testID="arrowTouch"
              accessibilityLabel="arrowTouch">
              {allergy ? (
                <Icon
                  testID="downIcon"
                  accessibilityLabel="downIcon"
                  name="chevron-down"
                  type="Ionicons"
                  style={{fontSize: 25}}
                />
              ) : (
                <Icon
                  testID="upIcon"
                  accessibilityLabel="upIcon"
                  name="chevron-up"
                  type="Ionicons"
                  style={{fontSize: 25}}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Divider style={(styles.lineStyle, {marginHorizontal: wp(10)})} />
        <Collapsible collapsed={allergy}>{History1()}</Collapsible>
        <Divider style={styles.lineStyle} />
        <View style={styles.allergytypes}>
          <View style={{width: '60%'}}>
            <Text
              style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
              testID="significantHealthEventsTouch"
              accessibilityLabel="significantHealthEventsTouch">
              {t('PATIENTS.SIGNIFICANT HEALTH EVENTS')}
            </Text>
            <Text
              style={{color: DEFAULT_GREY_COLOR}}
              testID="addAllergyText"
              accessibilityLabel="addAllergyText">
              {t(
                'PATIENTS.ADD ANY SURGERY, SERIOUS ILLNESS AND SERIOUS MEDICATION',
              )}
            </Text>
          </View>

          <View style={{width: '40%', alignItems: 'flex-end'}}>
            <TouchableOpacity
              // onPress={() => {
              //   SurgeriesRef.current?.setModalVisible();
              // }}
              onPress={() => {
                openAction();
              }}
              testID="plusTouch"
              accessibilityLabel="plusTouch">
              <Image
                source={Plus}
                style={{width: 30, height: 30}}
                testID="plusImage"
                accessibilityLabel="plusImage"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <ActionSheet ref={SurgeriesRef}>
          <AddHealthEvent />
        </ActionSheet> */}
        <Modal
          isVisible={showAddVaccince}
          style={{padding: 0, margin: 0}}
          onModalHide={() => {
            clearState();
          }}
          useNativeDriver={true}
          backdropOpacity={0.5}>
          {React.useCallback(AddHealthEvent())}
        </Modal>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(15),
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View>
            <TouchableOpacity
              testID="surgerieTouch"
              accessibilityLabel="surgerieTouch"
              onPress={() => setSurgery(!surgery)}
              style={{flexDirection: 'row'}}>
              <Image
                testID="surgerieImage"
                accessibilityLabel="surgerieImage"
                source={surgerie}
                style={{width: 30, height: 30, margin: 2}}
              />
              <Text
                style={{alignSelf: 'center'}}
                testID="surgerieText"
                accessibilityLabel="surgerieText">
                {t('PATIENTS.SURGERIES')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => setSurgery(!surgery)}
              style={{marginTop: -5}}
              testID="familyHistopryTouch"
              accessibilityLabel="familyHistopryTouch">
              {surgery ? (
                <Icon
                  testID="downIcon1"
                  accessibilityLabel="downIcon1"
                  name="chevron-down"
                  type="Ionicons"
                  style={{fontSize: 25}}
                />
              ) : (
                <Icon
                  testID="upIcon1"
                  accessibilityLabel="upIcon1"
                  name="chevron-up"
                  type="Ionicons"
                  style={{fontSize: 25}}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Collapsible collapsed={surgery}>{Surgeries()}</Collapsible>
        <Divider style={styles.lineStyle} />
        <View style={styles.allergytypes}>
          <View style={{width: '60%'}}>
            <Text
              style={{fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD}}
              testID="familyHistoryText"
              accessibilityLabel="familyHistoryText">
              {t('PATIENTS.FAMILY HISTORY')}
            </Text>
            <Text
              style={{color: DEFAULT_GREY_COLOR}}
              testID="keyMeasurementsText"
              accessibilityLabel="keyMeasurementsText">
              {t('PATIENTS.KEY MEASUREMENTS TO BE MEASURED')}
            </Text>
          </View>
          <View style={{width: '40%', alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                FamilyHistoryRef.current?.setModalVisible();
              }}
              testID="historyTouch"
              accessibilityLabel="historyTouch">
              <Image
                source={Plus}
                style={{width: 30, height: 30}}
                testID="plusImage"
                accessibilityLabel="plusImage"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <AddAllergy /> */}
        <ActionSheet ref={FamilyHistoryRef}>
          <AddFamilyHistory />
        </ActionSheet>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(15),
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{marginHorizontal: wp(10)}}>
            <TouchableOpacity
              onPress={() => setFamily(!family)}
              testID="familyHistoryTouch"
              accessibilityLabel="familyHistoryTouch">
              <Text
                testID="familyHistoryText"
                accessibilityLabel="familyHistoryText">
                {t('PATIENTS.FAMILY HISTORY')}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setFamily(!family)}
              style={{marginTop: -5}}>
              {family ? (
                <Icon
                  testID="upIcon4"
                  accessibilityLabel="upIcon4"
                  name="chevron-down"
                  type="Ionicons"
                  style={{fontSize: 25}}
                />
              ) : (
                <Icon
                  testID="upIcon4"
                  accessibilityLabel="upIcon4"
                  name="chevron-up"
                  type="Ionicons"
                  style={{fontSize: 25}}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Collapsible collapsed={family}>{FamilyHistory()}</Collapsible>
        <Divider style={styles.lineStyle} />
      </View>
    </ScrollView>
  );
};

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
)(withTranslation()(History));

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_INVERSE_LIGHT,
  },
  uparrow: {
    width: 70,
    height: 70,
    resizeMode: 'center',
    tintColor: DEFAULT_GREY_COLOR,
    transform: [{rotate: '90deg'}],
  },
  screentop: {marginTop: 5},
  downarrow: {
    width: 70,
    height: 70,
    resizeMode: 'center',
    tintColor: DEFAULT_GREY_COLOR,
    transform: [{rotate: '270deg'}],
  },
  allergytypes: {
    flexDirection: 'row',
    padding: wp(15),
    justifyContent: 'space-between',
    backgroundColor: DEFAULT_WHITE_COLOR,
  },
  index: {
    marginVertical: wp(5),
  },
  vertical: {
    marginVertical: wp(10),
  },
  directionA: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textfont: {
    fontFamily: theme.fontFamily.primaryRegular,
  },
  marginA: {
    marginVertical: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(22),
  },
  modalView: {
    width: '90%',
    height: '90%',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderRadius: 20,
    padding: 10,
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  allergiesss: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
  },
  paddingA: {
    padding: 20,
    marginTop: Platform.OS == 'ios' ? 30 : 0,
  },
  modalView2: {
    width: '90%',
    height: Platform.OS == 'ios' ? '65%' : '45%',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderRadius: 20,
    padding: 30,
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView1: {
    width: '90%',
    height: '65%',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderRadius: 20,
    padding: 30,
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: 'left',
    marginVertical: wp(5),
  },
  input: {
    borderWidth: 1,
    borderColor: DEFAULT_GREY_COLOR,
    width: wp(300),
    borderRadius: wp(10),
  },
  historyicon: {
    width: 15,
    height: 15,
  },
  cloud: {
    flexDirection: 'row',
    marginVertical: wp(8),
  },
  allergyinput: {
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderRadius: 5,
    marginTop: 2,
    padding: 5,
    height: 40,
  },
  placeholderInput: {
    height: 100,
    textAlignVertical: 'top',
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  dropdown4BtnStyle: {
    width: 'auto',
    //height: "auto",
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: 40,
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
});
