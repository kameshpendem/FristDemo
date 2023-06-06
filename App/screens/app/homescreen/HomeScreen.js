import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {Icon} from 'native-base';
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {withTranslation} from 'react-i18next';
import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {Calendar, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import Collapsible from 'react-native-collapsible';
import {Button, Divider} from 'react-native-elements';
import {connect} from 'react-redux';
import AttachClose from '../../../assets/images/attachClose.png';
import Attachment from '../../../assets/images/attachement.png';
import back_arrow from '../../../assets/images/back_arrow.png';
import Bill from '../../../assets/images/bill.png';
import Cal from '../../../assets/images/cal.png';
import Camera from '../../../assets/images/cameravacc.png';
import close from '../../../assets/images/close.png';
import Close from '../../../assets/images/close.svg';
import dot from '../../../assets/images/dot.png';
import Mail from '../../../assets/images/mail.png';
import Pdf from '../../../assets/images/pdf.png';
import Person from '../../../assets/images/personGender.png';
import Search from '../../../assets/images/search_patients.png';
import Vaccine from '../../../assets/images/vacc.png';
import FileSelector from '../../../components/fileselector/FileSelector';
import {
  getVaccineData,
  ProvideVaccine,
} from '../../../redux/actions/addVaccine_action';
import {
  createPerson,
  fetchPatientSuccess,
  generateEncounter,
  getAppointmentsCount,
  getAppointmentsList,
  getExistingUsers,
  getPatient,
  searchPatient,
  sendOTP,
  verifyOTP,
} from '../../../redux/actions/appointment_action';
import {hp, wp} from '../../../themes/Scale';
import {getCardColor, getColor} from '../../../themes/Theme';
import {
  APP_PRIMARY_BACKGROUND_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_INVERSE_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_RED_COLOR,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  STATUS_BOOKED,
  STATUS_CARD_BORDER_COLOR,
  STATUS_COMPLETED,
  STATUS_OFFLINE,
  STATUS_ONLINE,
} from '../../../themes/variable';
import {
  BOOKAPPOINTMENT,
  BOOKED,
  PATIENTCARD,
  REVIEW,
  SUCCESS,
  UPDATEHOMESCREEN,
} from '../common/Constants';
import Header from '../common/Header';
import styles from './HomeScreenStyles';

import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import Loader from '../common/Loader';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import DatePicker from 'react-native-date-picker';
import ImageResizer from 'react-native-image-resizer';
import RNImageToPdf from 'react-native-image-to-pdf';
import Modal from 'react-native-modal';
import getBaseUrl, {getApiUrl} from '../../../config/Config';
import {getRelationshipTypes} from '../../../redux/actions/allergies_action';
import {getAuthorizations} from '../../../redux/actions/billing_action';
import ApiCall from '../../../services/ApiCall';
import {capitalize} from '../../../utils/capitalizeFirst';
import {getCountryCode} from '../../../utils/CountryCode';
import {NativeToast, NativeToastTop} from '../common/Toaster';
import i18n from '../../../../i18n';

const fileSelRef = React.createRef();
let vaccineDataRef = createRef();
let indexofVaccine = createRef();
let vaccineId = createRef();

function HomeScreen({
  doctorDetails,
  getPatient,
  fetchPatientSuccess,
  patientList,
  // type,
  // qr_code_hlp_id,
  ...props
}) {
  // console.log('typein the hvabxhwbx ', type);
  const actionSheetRef = createRef();
  const scrollRef = useRef();
  const {qr_code_hlp_id} = props.navigation.state.params;
  const {appointment_id_qr} = props.navigation.state.params
    ? props.navigation.state.params
    : null;
  const {t} = props;
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [textDate, settextDate] = useState(moment().format('MMMM, D YYYY'));
  const [textsearch, setTextSearch] = useState('');
  const [statuskey, setStatusKey] = useState('');
  const [statusCount, setstatusCount] = useState([]);
  const [count, setcount] = useState(0);
  const [statusIndexValue, setstatusIndexValue] = useState(null);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [statusloading, setstatusloading] = useState(true);
  const [appointmentloading, setappointmentloading] = useState(true);
  const [modal, setModal] = useState(false);
  const [relationShow, setrelationShow] = useState(false);
  const [otpShow, setotpShow] = useState(false);
  const [search, setsearch] = useState(false);
  const [vaccineModal, setvaccineModal] = useState(false);
  const [patientsList, setpatientsList] = useState([]);
  const [refreshing, setrefreshing] = useState(false);
  const [first_name, setfirst_name] = useState('');
  const [last_name, setlast_name] = useState('');
  const [phone_code, setphone_code] = useState('');
  const [phone_number, setphone_number] = useState('');
  const [email, setemail] = useState('');
  const [dob, setdob] = useState('');
  const [gender, setgender] = useState('');
  const [salutation, setsalutation] = useState('Mr');
  const [relation, setrelation] = useState('');
  const [family_head_id, setfamily_head_id] = useState('');
  const [registeredName, setregisteredName] = useState('');
  const [alone, setalone] = useState(false);
  const [billing, setbilling] = useState(false);
  const [value, setValue] = useState('');
  const [branch_id, setbranch_id] = useState('');
  const [doctor_id, setdoctor_id] = useState('');
  const [id_val, setIdVal] = useState('');
  const [url_val, setUrlVal] = useState('');
  const [loading, setloading] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [propss, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [vaccineData, setVaccineData] = useState([]);
  const [vaccinepatient, setvaccinepatient] = useState({});
  const [mulImg, setMulImg] = useState([]);
  const [offset, setoffset] = useState(0);
  const [timerCount, setTimer] = useState(30);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openExpiry, setopenExpiry] = useState(false);
  const handleToggle = () => setShow(!show);
  const [successModal, setsuccessModal] = useState(false);
  const {qr_book_consult} = props.navigation.state.params
    ? props.navigation.state.params
    : null;
  const [bookedModal, setbookedModal] = useState(
    qr_book_consult ? qr_book_consult : false,
  );
  const [appointmentid, setappointmentid] = useState('');
  const [encount_id, setencount_id] = useState('');
  const [app_type, setapp_type] = useState('');
  const [app_status, setapp_status] = useState('');
  const [virtual_branch, set_virtual_branch] = useState();
  const [flag, setflag] = useState(false);
  const [relationList, setrelationList] = useState([]);
  const [dataSourceCords, setDataSourceCords] = useState([]);
  const [scrollToIndex, setScrollToIndex] = useState(0);
  const [scrollto, setscrollto] = useState(true);
  const [nextOffset, setnextOffset] = useState(false);
  const [overAllCount, setOverallCount] = useState(0);

  const CELL_COUNT = 6;
  const salutationList = ['Mr', 'Ms', 'Mrs'];
  const genderList = ['Male', 'Female', 'Other'];

  const GetVaccineData = async val => {
    let variable = {
      enc_id: val?.encounter_id,
      doc_id: val?.appointment?.doc_id,
      hlp_id: val?.appointment?.healpha_id,
      pending: true,
    };

    if (
      val?.encounter_id &&
      val?.appointment?.doc_id &&
      val?.appointment?.healpha_id
    ) {
      return await getVaccineData(variable)
        .then(res => {
          return res?.services;
        })
        .catch(err => {
          NativeToastTop({text: err.message, type: 'danger'});
        });
    }
  };

  const ChangeDay = e => {
    setoffset(0);
    setappointmentloading(true);
    setAppointmentsList([]);
    let data = moment(e).format('MMMM, D YYYY');
    setstatusIndexValue(null);
    setStatusKey('');
    settextDate(data);
    setSelectedDate(e);
    getStatusCount(e);
    getAppointments(e);
  };
  const statusFilter = async val => {
    setoffset(0);
    setappointmentloading(true);
    setstatusIndexValue(val.index);
    setStatusKey(val.filterKey);
    let doctorId = await AsyncStorage.getItem('doctorid');
    let branchId = await AsyncStorage.getItem('branch_id');

    setAppointmentsList([]);

    if (val.filterKey == '') {
      const selectedStatus = '';
      const date = selectedDate;
      await getAllAppointments(date, selectedStatus);
    } else {
      const variables = {
        doctor_id: doctorId,
        branch_id: branchId,
        date: selectedDate,
        appointment_checked: val.filterKey,
        search_text: textsearch,
        limit: 20,
        offset: 0,
      };

      await getAppointmentsList(variables)
        .then(res => {
          if (res?.appointments.length === 20) {
            setnextOffset(true);
            setoffset(20);
          } else {
            setnextOffset(false);
          }
          setAppointmentsList(res.appointments);

          setloading(false);
          // setoffset(20);
          setappointmentloading(false);
        })
        .catch(res => {
          NativeToast({text: res.message, type: 'danger'});
        })
        .finally(() => {
          setcount(val?.count || '');
        });
    }
  };

  const searchAppointment = async val => {
    setoffset(0);
    setappointmentloading(true);
    setStatusKey(val.filterKey);
    let doctorId = await AsyncStorage.getItem('doctorid');
    let branchId = await AsyncStorage.getItem('branch_id');

    setAppointmentsList([]);

    let statusSelected = statuskey ? statuskey : '';

    const variables = {
      doctor_id: doctorId,
      branch_id: branchId,
      date: selectedDate,
      appointment_checked: statusSelected,
      search_text: val,
      limit: 20,
      offset: 0,
    };

    await getStatusCount(selectedDate);

    await getAppointmentsList(variables)
      .then(res => {
        setAppointmentsList(res.appointments);
        if (res?.appointments.length === 20) {
          setnextOffset(true);
        } else {
          setnextOffset(false);
        }
        setloading(false);
        setoffset(20);
        setappointmentloading(false);
      })
      .catch(res => {
        NativeToast({text: res.message, type: 'danger'});
      });
  };

  const increaseappoint = data => {
    let appCount = 0;
    data.map((item, index) => {
      appCount += item.count;
    });

    if (overAllCount == appCount) {
      statuskey == '' ? setcount(overAllCount) : setcount(count);
    } else {
      setcount(appCount);
      setOverallCount(appCount);
    }
  };

  const getStatusCount = async val => {
    await AsyncStorage.removeItem('paymentCriteria');

    await AsyncStorage.removeItem('AddService');

    await getCountryCode().then(res => {
      setphone_code(res);
    });
    setappointmentloading(true);
    let doctorId = await AsyncStorage.getItem('doctorid');
    let branchId = await AsyncStorage.getItem('branch_id');
    setbranch_id(branchId), setdoctor_id(doctorId);
    // console.log(branchId);
    let token = await AsyncStorage.getItem('jwt_token');
    // console.log(token, "token");
    let date = val ? val : selectedDate;
    const variables = {
      doctor_id: doctorId,
      branch_id: branchId,
      date: date,
      appointment_checked: statuskey,
      search_text: textsearch,
    };

    await getAppointmentsCount(variables)
      .then(res => {
        setstatusCount(res.appointment_status);
        increaseappoint(res.appointment_status);
        if (res.appointment_status) {
          setstatusloading(false);
        }
      })
      .catch(res => {
        NativeToast({text: res.message, type: 'danger'});
      });
  };

  const findindexofcurrenttime = async val => {
    let time = moment().format('HH:mm');

    let values = val?.filter(i => i?.appointment?.date_start >= time);
    if (values?.length > 0) {
      values = values?.reverse();
      let index = val?.indexOf(values[0]);
      setTimeout(() => {
        scrollHandler(index);
      }, 200);
    }
  };

  const getAllAppointments = async (val, selectedStatus) => {
    let doctorId = await AsyncStorage.getItem('doctorid');
    let branchId = await AsyncStorage.getItem('branch_id');

    let date = val ? val : selectedDate;
    let keylabel = val?.filterKey ? val?.filterKey : '';
    let statusSelected = statuskey ? statuskey : '';

    const variables = {
      doctor_id: doctorId,
      branch_id: branchId,
      date: date,
      appointment_checked: keylabel ? keylabel : '',
      search_text: '',
      limit: 20,
      offset: 0,
    };

    await getAppointmentsList(variables)
      .then(res => {
        if (res.appointments) {
          if (res?.appointments.length === 20) {
            setnextOffset(true);
          } else {
            setnextOffset(false);
          }
          {
            selectedStatus == '' ? setcount(overAllCount) : setcount(count);
          }
          setAppointmentsList(res.appointments);
          findindexofcurrenttime(res.appointments);
          setoffset(20);
          setappointmentloading(false);
          setrefreshing(false);
        }
      })
      .catch(res => {
        NativeToast({text: res.message, type: 'danger'});
      });
  };

  const getAppointments = async val => {
    let doctorId = await AsyncStorage.getItem('doctorid');
    let branchId = await AsyncStorage.getItem('branch_id');

    let date = val ? val : selectedDate;

    const variables = {
      doctor_id: doctorId,
      branch_id: branchId,
      date: date,
      appointment_checked: statuskey,
      search_text: textsearch,
      limit: 20,
      offset: offset,
    };

    await getAppointmentsList(variables)
      .then(res => {
        if (res.appointments) {
          if (res?.appointments.length === 20) {
            setnextOffset(true);
          } else {
            setnextOffset(false);
          }
          let data = [...appointmentsList, ...res.appointments];
          setAppointmentsList(data);
          if (offset == 0 && selectedDate == moment().format('YYYY-MM-DD')) {
            findindexofcurrenttime(res.appointments);
          }
          let setNumber = Number(offset + 20);

          setoffset(setNumber);
          setrefreshing(false);
          setappointmentloading(false);
        }
      })
      .catch(res => {
        NativeToast({text: res.message, type: 'danger'});
      });
  };

  const changeBranch = async () => {
    setoffset(0);
    setStatusKey('');
    setTextSearch('');
    const selectedStatus = '';
    getAllAppointments(selectedDate, selectedStatus);
    // getAppointments(selectedDate);
    getStatusCount(selectedDate);
  };

  const createEncounter = async val => {
    let variable = {
      appointment_id: appointmentid || appointment_id_qr,
    };
    let payload = {
      corporate_flag: flag,
      appointment_type: app_type.toLocaleLowerCase(),
      encounter_id: encount_id,
    };
    await generateEncounter(variable, payload)
      .then(async res => {
        if (res.status_type == SUCCESS) {
          setoffset(0);
          setAppointmentsList([]);
          const selectedStatus = '';

          await getAllAppointments(selectedDate, selectedStatus);
          await getStatusCount(selectedDate);
          // setTimeout(() => {
          getPatientCard({
            virtualBranch: virtual_branch,
            appointmentId: appointmentid || appointment_id_qr,
            status: app_status?.toLocaleLowerCase(),
            type: app_type?.toLocaleLowerCase(),
          });
          // }, 200);
        }
      })
      .catch(res => {
        NativeToastTop({text: res.message, type: 'warning'});
      });
  };

  const getPatientCard = val => {
    props.navigation.navigate(PATIENTCARD, {
      virtualBranch: val.virtualBranch,
      appointmentId: val.appointmentId,
      edit: val.type === REVIEW ? true : false,
    });
  };

  const _onRefresh = () => {
    setoffset(0);
    // setrefreshing(true);
    setAppointmentsList([]);

    const selectedStatus = statuskey == '' ? '' : statuskey;

    getAllAppointments(selectedDate, selectedStatus);
    getStatusCount(selectedDate);
  };

  const checkAuthorization = async ({branch_id}) => {
    await getAuthorizations({branch_id}).then(res => {
      if (res) {
        let data = res.access;
        global.AuthCancel = data?.isAuthorizedToCancelService;
        global.AuthBilling = data?.isAuthorizedToDoBilling;
        global.AuthDiscount = data?.isAuthorizedToGiveDiscount;
        global.AuthPaylater = data?.isAuthorizedToPayLater;
      }
    });
  };

  useEffect(async () => {
    // global.standalone;
    setbilling(global.AuthBilling);
    setalone(global.standalone);
    getAppointments(selectedDate);
    getStatusCount(selectedDate);
    global.nrmlCall = false;
    await AsyncStorage.setItem('nrml_whatsapp_call', 'false');

    DeviceEventEmitter.addListener(UPDATEHOMESCREEN, e => {
      let date = e?.date ? e?.date : selectedDate;
      setSelectedDate(date);
      const selectedStatus = '';

      getAllAppointments(date, selectedStatus);
      getStatusCount(date);
    });
    return () => {
      DeviceEventEmitter.removeAllListeners(UPDATEHOMESCREEN);
    };
  }, []);

  // const init = () => {
  //   getStatusCount(selectedDate);

  //   getAppointments(selectedDate);
  // };

  // useEffect(() => {
  //   setalone(global.standalone);
  //   const focusListener = props.navigation.addListener("didFocus", () => {
  //     init();
  //   });
  //   return focusListener;
  // }, [props.navigation]);

  const setImage = () => {
    fileSelRef?.current?.openPicker();
  };

  const uploadPdf = async data => {
    let token = await AsyncStorage.getItem('jwt_token');

    let success = [];

    let enc_id = vaccinepatient?.encounter_id;
    let doc_id = vaccinepatient?.appointment?.doc_id;
    let hlp_id = vaccinepatient?.appointment?.healpha_id;

    for (let index = 0; index < data.length; index++) {
      let url =
        getBaseUrl() +
        `v1/appointment/encounter/${enc_id}/doctor/${doc_id}/person/${hlp_id}/plan/attachment/vaccine?service_id=${data[index].person_vaccine_id}`;
      // console.log(url, "urlhahaha");
      let pdfname = data[index].attachments[0].file;
      let path = data[index].attachments[0].path;

      let pt = new FormData();
      pt.append('description', 'desc2');
      pt.append('file_name', pdfname);
      pt.append('file', {
        uri: 'file://' + path,
        type: 'application/pdf',
        name: pdfname,
      });
      await ApiCall.postMultiForm(url, pt, {
        Authorization: `Bearer ${token}`,
        otherHeader: 'foo',
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      })
        .then(res => {
          if (res) {
            success.push(res);
          }
        })
        .catch(err => {
          NativeToastTop({
            text: err.message,
            type: 'warning',
          });
        });

      if (data.length === success.length) {
        setvaccineModal(false);
        setMulImg([]);

        indexofVaccine.current = null;
        vaccineDataRef.current = null;
        vaccineId.current = null;
        setTimeout(() => {
          setsuccessModal(true);
        }, 250);
        // NativeToastTop({
        //   text: success[0].message,
        //   type: "success"
        // });
      }
    }
  };

  const SaveVaccination = async () => {
    let enteredData = [];

    vaccineData.map((i, index) => {
      if (i.batch_no && i.attachments.length > 0 && i.expiry_date) {
        let obj = {};
        obj.person_vaccine_id = i.id;
        obj.batch_no = i.batch_no;
        obj.expiry_date = i.expiry_date;
        obj.attachments = i.attachments;

        enteredData.push(obj);
        obj = {};
      }
    });

    let variable = {
      enc_id: vaccinepatient.encounter_id,
      doc_id: vaccinepatient.appointment.doc_id,
      hlp_id: vaccinepatient.appointment.healpha_id,
    };

    await ProvideVaccine(variable, enteredData)
      .then(res => {
        if (res) {
          if (res) {
            uploadPdf(enteredData);
          }
        }
      })
      .catch(res => {
        NativeToast({text: res.message, type: 'danger'});
      });
  };

  const getPatientData = async e => {
    if (e.toString().length >= 3) {
      await searchPatient(e)
        .then(res => {
          if (res) setpatientsList(res?.data?.persons);
        })
        .catch(res => {
          NativeToast({text: res.message, type: 'danger'});
        });
    }
  };

  const leftPress = () => {
    let startOfWeek = moment(selectedDate).startOf('week').toDate();
    startOfWeek.setDate(
      startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7),
    );

    ChangeDay(moment(startOfWeek).format('YYYY-MM-DD'));
  };

  const rightPress = () => {
    let endOfWeek = moment(selectedDate).endOf('week').toDate();
    endOfWeek.setDate(endOfWeek.getDate() + ((7 - endOfWeek.getDay()) % 7) + 1);

    ChangeDay(moment(endOfWeek).format('YYYY-MM-DD'));
  };

  const counter = e => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
    //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  };

  const resendOTP = async e => {
    await sendOTP({
      phone_code,
      phone_number,
      email: email,
      last_name: last_name,
      first_name: first_name,
    })
      .then(res => {
        if (res.status_type == SUCCESS) {
          setotpShow(() => {
            setotpShow(true);
          }, 3000);
          NativeToastTop({
            text: res.message,
            type: 'success',
          });

          if (e?.resend == true) {
            setTimer(30);
          }
          counter();
        }
      })
      .catch(res => {
        NativeToastTop({text: res.message, type: 'warning'});
      });
  };

  const verifyotp = async () => {
    await verifyOTP({phone_code, phone_number, email: email, code: value})
      .then(res => {
        if (res.status_type == 'Success') {
          setloading(true);

          // NativeToastTop({ text: res.message, type: "success" });
          setTimeout(() => {
            savePersonDetails();
          }, 250);
        }
      })
      .catch(res => {
        NativeToastTop({
          text: res.message,
          type: 'danger',
        });
      });
  };

  const savePersonDetails = async () => {
    let doctorId = await AsyncStorage.getItem('doctorid');
    let branchId = await AsyncStorage.getItem('branch_id');
    await createPerson({
      first_name,
      last_name,
      phone_code,
      phone_number,
      email,
      dob,
      gender,
      salutation,
      relation,
      family_head_id,
      doctor_id: doctorId,
      branch_id: branchId,
    })
      .then(res => {
        setotpShow(false);

        setTimeout(() => {
          NativeToastTop({
            text: t('ADD_PATIENT.USER_CREATED'),
            type: 'success',
          });
          setloading(false);
        }, 300);
        onClose();
      })
      .catch(res => {
        NativeToastTop({text: res.message, type: 'danger'});
      });
  };

  const addPatient = async () => {
    const emailreg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const country = await AsyncStorage.getItem('USER_COUNTRY');

    if (!email.trim()) {
    } else {
      if (emailreg.test(email) === false)
        return NativeToastTop({
          text: t('ADD_PATIENT.INVALID_EMAIL'),
          type: 'warning',
        });
    }
    if (!first_name.trim())
      return NativeToastTop({
        text: t('ADD_PATIENT.REQUIRED_FIRST_NAME'),
        type: 'warning',
      });
    if (!last_name.trim())
      return NativeToastTop({
        text: t('ADD_PATIENT.REQUIRED_LAST_NAME'),
        type: 'warning',
      });
    if (!phone_code.trim())
      return NativeToastTop({
        text: 'Required country code!',
        type: 'warning',
      });
    if (!phone_number.trim())
      return NativeToastTop({
        text: t('ADD_PATIENT.REQUIRED_MOBILE_NUMBER'),
        type: 'warning',
      });
    if (country != '') {
      console.log('country', country);
      if (country == 'sl') {
        console.log('insidesl', phone_number.toString().length);
        if (
          phone_number.toString().length !== 9 ||
          phone_number.toString().length > 9
        ) {
          console.log('insideslif');
          return NativeToastTop({
            text: t('ADD_PATIENT.INVALID_MOBILE'),
            type: 'warning',
          });
        }
      } else {
        console.log('outsidesl');
        if (
          phone_number.toString().length !== 10 ||
          phone_number.toString().length > 10
        ) {
          return NativeToastTop({
            text: t('ADD_PATIENT.INVALID_MOBILE'),
            type: 'warning',
          });
        }
      }
    }
    if (!dob.trim())
      return NativeToastTop({
        text: t('ADD_PATIENT.REQUIRED_DOB'),
        type: 'warning',
      });
    if (!gender.trim())
      return NativeToastTop({
        text: t('ADD_PATIENT.SELECT_GENDER'),
        type: 'warning',
      });

    await getExistingUsers(phone_number)
      .then(async res => {
        setModal(false);
        if (res?.persons?.length > 0) {
          setfamily_head_id(res.family_head_id);
          setregisteredName(
            res?.persons[0]?.first_name + ' ' + res?.persons[0]?.last_name,
          );

          await getRelationshipTypes()
            .then(res => {
              setrelationList(res?.values || []);
            })
            .catch(err => {
              NativeToastTop({text: err.message, type: 'warning'});
            });

          setTimeout(() => {
            setrelationShow(true);
          }, 300);
        } else {
          setTimer(30);
          setTimeout(() => {
            setotpShow(true);
            resendOTP({resend: false});
          }, 300);
        }
      })
      .catch(res => {
        NativeToastTop({text: res.message, type: 'warning'});
      });
  };

  const selectRelation = () => {
    if (!relation.trim())
      return NativeToastTop({
        text: t('ADD_PATIENT.SELECT_RELATION'),
        type: 'warning',
      });

    setTimer(30);

    resendOTP({resend: false});
    setrelationShow(false);
  };

  const onClose = () => {
    setpatientsList([]);
    setTimer(30);
    setfirst_name('');
    setlast_name('');
    setphone_number('');
    setemail('');
    setdob('');
    setgender('');
    setsalutation('Mr');
    setrelation('');
    setValue('');
  };

  const clearAsync = async () => {
    await AsyncStorage.removeItem('paymentCriteria');
    await AsyncStorage.removeItem('encounterpayment');
    await AsyncStorage.removeItem('AddService');
  };

  const Newpatients = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            padding: 20,
            backgroundColor: DEFAULT_WHITE_COLOR,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            flexGrow: 2,
            bottom: 0,
            position: 'absolute',
            right: 0,
            left: 0,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                fontSize: 20,
              }}
              testID="addPatientText"
              accessibilityLabel="addPatientText">
              {t('ADD_PATIENT.ADD_PATIENT')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModal(false);
                onClose();
              }}
              style={{
                width: wp(30),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              testID="closeTouch"
              accessibilityLabel="closeTouch">
              <Image
                source={close}
                style={{width: 12, height: 12}}
                testID="closeImage"
                accessibilityLabel="closeImage"
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            onPress={Keyboard.dismiss}>
            <ScrollView>
              <View
                style={{
                  marginVertical: 20,
                  flexDirection: 'row',
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                }}>
                <SelectDropdown
                  testID="arrowIcon"
                  accessibilityLabel="arrowIcon"
                  data={salutationList}
                  // defaultValueByIndex={1}
                  onSelect={(selectedItem, index) => {
                    setsalutation(selectedItem);
                  }}
                  defaultButtonText={'Mr'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  buttonStyle={styles.dropdown4BtnStyle1}
                  buttonTextStyle={styles.dropdown4BtnTxtStyle1}
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
                <TextInput
                  testID="firstNameTextInput"
                  accessibilityLabel="firstNameTextInput"
                  placeholder={t('ADD_PATIENT.FIRSTNAME_PLACEHOLDER')}
                  style={{
                    padding: 5,
                    bottom: 5,
                    width: '100%',
                  }}
                  onChangeText={val => {
                    setfirst_name(val);
                  }}
                />
              </View>
              <View
                style={{
                  marginVertical: 10,
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                  marginTop: wp(-5),
                }}>
                <TextInput
                  testID="LastNameTextInput"
                  accessibilityLabel="LasttNameTextInput"
                  placeholder={t('ADD_PATIENT.LASTNAME_PLACEHOLDER')}
                  style={{
                    padding: 5,
                    width: '100%',
                    marginLeft: 40,
                  }}
                  onChangeText={val => {
                    setlast_name(val);
                  }}
                />
              </View>
              <View
                style={{
                  marginVertical: 20,
                  flexDirection: 'row',
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                  marginTop: wp(5),
                }}>
                <Text
                  style={{}}
                  testID="phoneCodeText"
                  accessibilityLabel="phoneCodeText">
                  {phone_code}
                </Text>
                {phone_code == '+91' ? (
                  <TextInput
                    testID="mobileNumberTextInput"
                    accessibilityLabel="mobileNumberTextInput"
                    placeholder={t('ADD_PATIENT.MOBILENUMBER_PLACEHOLDER')}
                    value={phone_number}
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={val => {
                      setphone_number(val);
                    }}
                    style={{
                      padding: 5,
                      bottom: 5,
                      marginLeft: 18,
                      width: '100%',
                    }}
                  />
                ) : (
                  <TextInput
                    testID="mobileNumberTextInput"
                    accessibilityLabel="mobileNumberTextInput"
                    placeholder={t('ADD_PATIENT.MOBILENUMBER_PLACEHOLDER')}
                    value={phone_number}
                    keyboardType="numeric"
                    maxLength={9}
                    onChangeText={val => {
                      setphone_number(val);
                    }}
                    style={{
                      padding: 5,
                      bottom: 5,
                      marginLeft: 18,
                      width: '100%',
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  marginVertical: 20,
                  flexDirection: 'row',
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                  marginTop: wp(-5),
                }}>
                <Image
                  source={Mail}
                  style={{width: 20, height: 16}}
                  testID="emailImage"
                  accessibilityLabel="emailImage"
                />
                <TextInput
                  testID="emailTextInput"
                  accessibilityLabel="emailTextInput"
                  placeholder={t('ADD_PATIENT.EMAIL_PLACEHOLDER')}
                  onChangeText={val => {
                    setemail(val);
                  }}
                  style={{
                    padding: 5,
                    bottom: 5,
                    marginLeft: 20,
                    width: '100%',
                  }}
                />
              </View>
              <View
                style={{
                  marginVertical: 20,
                  flexDirection: 'row',
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                  marginTop: wp(-5),
                }}>
                <TouchableOpacity
                  onPress={() => setOpen(true)}
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    paddingBottom: 10,
                  }}
                  testID="callTouch"
                  accessibilityLabel="callTouch">
                  <Image
                    source={Cal}
                    style={{width: 25, height: 22}}
                    testID="callImage"
                    accessibilityLabel="callImage"
                  />
                  <Text style={{marginLeft: 20, color: dob ? 'black' : 'gray'}}>
                    {dob ? dob : t('ADD_PATIENT.DOB_PLACEHOLDER')}
                  </Text>
                  {/* <TextInput
                placeholder={t('ADD_PATIENT.DOB_PLACEHOLDER')}
                showSoftInputOnFocus={false}
                value={dob}
                onFocus={() => setOpen(true)}
                style={{
                  padding: 5,
                  bottom: 5,
                  marginLeft: 40,
                }}
                onChangeText={(val) => {
                  setdob(val);
                }}
              /> */}
                  <DatePicker
                    testID="datePicker"
                    accessibilityLabel="datePicker"
                    modal
                    open={open}
                    mode="date"
                    date={date}
                    maximumDate={date}
                    onConfirm={date => {
                      setOpen(false);
                      setdob(moment(date).format('YYYY-MM-DD'));
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                  marginTop: wp(-5),
                }}>
                <Image
                  source={Person}
                  style={{width: 15, height: 18}}
                  testID="personImage"
                  accessibilityLabel="personImage"
                />
                <SelectDropdown
                  testID="genderDropDown"
                  accessibilityLabel="genderDropDown"
                  data={genderList}
                  // defaultValueByIndex={1}
                  onSelect={(selectedItem, index) => {
                    setgender(selectedItem);
                  }}
                  defaultButtonText={t('ADD_PATIENT.GENDER_PLACEHOLDER')}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
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
              <View
                style={{
                  marginVertical: 10,
                  marginBottom: Platform.OS == 'ios' ? 30 : 0,
                }}>
                <TouchableOpacity
                  style={styles.generate1}
                  onPress={() => {
                    addPatient();
                  }}
                  testID="savePatientTouch"
                  accessibilityLabel="savePatientTouch">
                  <Text
                    style={styles.generatetext1}
                    testID="savePatientText"
                    accessibilityLabel="savePatientText">
                    {t('ADD_PATIENT.SAVE_PATIENT')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  };

  const Vaccination = () => {
    const [dataOf, setdataOf] = useState(vaccineData || []);
    const checkConvert = path1 => {
      Alert.alert(
        t('VACCINATION.ATTACHMENT_ADDED'),
        t('VACCINATION.ADD_MORE'),
        [
          {text: t('COMMON.YES'), onPress: () => setImage()},
          {
            text: t('COMMON.NO'),
            onPress: () => convertPDF(path1),
          },
        ],
        {cancelable: false},
      );
    };
    const convertPDF = async path1 => {
      const encounterid = vaccinepatient.encounter_id;
      const id = vaccineId.current;

      let filename = encounterid + '-' + id + '.pdf';

      try {
        const options = {
          fileCache: true,
          imagePaths: [...mulImg, path1],
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

        let data = [...vaccineData];

        data[indexofVaccine?.current].attachments = [
          {file: filename, path: pdf.filePath},
        ];
        setVaccineData(data);

        setTimeout(() => {
          setdataOf(data);
        }, 100);
      } catch (e) {}
    };

    const uploadFile = file => {
      const path = file.path;
      const encounterid = vaccinepatient.encounter_id;
      console.log(
        'check the file paths ',
        JSON.stringify(file) + '      ' + path + '    ' + encounterid,
      );
      let checkFile = path.split('.');
      console.log('check the file ', checkFile);
      if (checkFile.slice(-1)[0]?.toLowerCase() === 'pdf') {
        let filename;
        filename = encounterid + '-' + vaccineId?.current + '.pdf';
        let data = [...vaccineData];
        data[indexofVaccine?.current].attachments = [
          {file: filename, path: path},
        ];
        console.log('pdf uploded data ', data);
        setdataOf(data);
        setVaccineData(data);
      } else {
        try {
          ImageResizer.createResizedImage(path, 800, 650, 'JPEG', 50, 0)
            .then(({path}) => {
              const path1 = path;
              let source;
              source = {path: path1};
              if (path1.split('.')[1] == 'pdf') {
                let filename = encounterid + '.pdf';
              } else {
                setMulImg([...mulImg, path1]);
                setTimeout(() => {
                  checkConvert(path1);
                }, 250);
              }
            })
            .catch(err => {});
        } catch (error) {}
      }
    };

    const handleSelection = async files => {
      if (files && files.length) {
        uploadFile(files[0]);
      }
    };

    const addBatch = (index, val) => {
      let data = [...vaccineData];
      if (!val.trim()) {
        data[index].batch_no = '';
      } else {
        data[index].batch_no = val;
      }
      setVaccineData(data);
      setdataOf(data);
    };

    const removeFile = index => {
      let data = [...vaccineData];
      data[index].attachments = [];
      setVaccineData(data);
      setdataOf(data);
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View
            style={[
              {
                backgroundColor: DEFAULT_WHITE_COLOR,
                borderRadius: 20,
                padding: 15,
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
              },
              dataOf.length >= 2 ? {height: '75%'} : {},
            ]}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR}}
                  testID="provideVaccineText"
                  accessibilityLabel="provideVaccineText">
                  {t('VACCINATION.PROVIDE_VACCINE')}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setvaccineModal(false);
                  }}
                  testID="closeTouch"
                  accessibilityLabel="closeTouch">
                  <Image
                    source={close}
                    style={{height: 12, width: 12}}
                    testID="closeImage"
                    accessibilityLabel="closeImage"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView scrollEnabled={true} keyboardShouldPersistTaps="always">
              {dataOf
                ? dataOf.map((i, index) => {
                    const [observed, setObserved] = useState(
                      vaccineData[index].expiry_date
                        ? vaccineData[index].expiry_date
                        : '',
                    );
                    const [batch_no, setBatch_No] = useState('');

                    let batchno = !i.batch_no ? true : false;
                    let file = !i.attachments.length > 0 ? true : false;
                    let expiry = !i.expiry_date ? true : false;

                    let isTrue = batchno || expiry;

                    return (
                      <View>
                        {isTrue || file ? (
                          <View
                            key={index}
                            style={{
                              padding: 10,
                              marginBottom: 20,
                              borderWidth: 1,
                              borderColor: STATUS_CARD_BORDER_COLOR,
                              borderRadius: 10,
                              marginVertical: 10,
                            }}>
                            <View>
                              <View style={{flexDirection: 'row'}}>
                                <Image
                                  testID="vaccineImage"
                                  accessibilityLabel="vaccineImage"
                                  source={Vaccine}
                                  style={{height: 18, width: 18}}
                                />
                                <Text
                                  style={{
                                    fontFamily:
                                      FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                                    paddingLeft: 5,
                                  }}
                                  testID={
                                    i.vaccine_details.vaccine_brand_name +
                                    'text'
                                  }
                                  accessibilityLabel={
                                    i.vaccine_details.vaccine_brand_name +
                                    'text'
                                  }>
                                  {i.vaccine_details.vaccine_brand_name}
                                </Text>
                              </View>

                              <Text
                                style={{
                                  paddingLeft: 22,
                                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                                  fontSize: 12,
                                  color: STATUS_CARD_BORDER_COLOR,
                                }}
                                testID={i?.description + 'text'}
                                accessibilityLabel={i?.description + 'text'}>
                                {i?.description}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 20,
                                marginVertical: 10,
                              }}>
                              <View style={{width: '50%'}}>
                                <TextInput
                                  testID={
                                    i?.description + 'batchNumberTextInput'
                                  }
                                  accessibilityLabel={
                                    i?.description + 'batchNumberTextInput'
                                  }
                                  placeholder={t('VACCINATION.BATCH_NO')}
                                  defaultValue={i?.batch_no}
                                  keyboardType="default"
                                  returnKeyType="done"
                                  multiline={true}
                                  blurOnSubmit={true}
                                  onChangeText={val => setBatch_No(val)}
                                  onEndEditing={() => {
                                    addBatch(index, batch_no);
                                    setTimeout(() => {
                                      setBatch_No('');
                                    }, 100);
                                  }}
                                  onBlur={() => {
                                    addBatch(index, batch_no);
                                    setTimeout(() => {
                                      setBatch_No('');
                                    }, 100);
                                  }}
                                  onSubmitEditing={() => {
                                    Keyboard.dismiss();
                                  }}
                                  style={{
                                    borderWidth: 1,
                                    borderColor: STATUS_CARD_BORDER_COLOR,
                                    padding: 5,
                                    height: 40,
                                    width: '95%',
                                  }}
                                />
                              </View>
                              <View style={{width: '50%', borderRadius: 5}}>
                                <TouchableOpacity
                                  onPress={() => {
                                    Keyboard.dismiss(),
                                      setTimeout(() => {
                                        setopenExpiry(true);
                                      }, 100);
                                  }}
                                  style={{
                                    flexDirection: 'row',
                                    width: '95%',
                                    justifyContent: 'center',
                                    height: 40,
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                  }}
                                  testID="expiryDateTouch"
                                  accessibilityLabel="expiryDateTouch">
                                  {/* <Image
                            source={Cal}
                            style={{ width: 25, height: 22 }}
                          /> */}
                                  <Text
                                    style={{
                                      color: i.expiry_date ? 'black' : 'gray',
                                      textAlignVertical: 'center',
                                      textAlign: 'center',
                                    }}
                                    testID="expiryDateText"
                                    accessibilityLabel="expiryDateText">
                                    {i.expiry_date && i.batch_no
                                      ? i.expiry_date
                                      : t('VACCINATION.EXPIRY_DATE')}
                                  </Text>
                                  <DatePicker
                                    testID="datePicker"
                                    accessibilityLabel="datePicker"
                                    modal
                                    open={openExpiry}
                                    mode="date"
                                    date={new Date()}
                                    onConfirm={date => {
                                      let newDate =
                                        moment(date).format('YYYY/MM/DD');
                                      // let data = [...dataof];
                                      // data[index].expiry_date = newDate;
                                      // setOpen(false);
                                      // setdataof(data);
                                      // setdataOf(data);
                                      setopenExpiry(false);
                                      setObserved(newDate);
                                      setopenExpiry(false);
                                      let data = [...vaccineData];
                                      data[index].expiry_date = newDate;
                                      setVaccineData(data);
                                      setdataOf(data);
                                    }}
                                    onCancel={() => {
                                      setopenExpiry(false);
                                    }}
                                  />
                                </TouchableOpacity>
                                {/* <DatePicker1
                                style={[
                                  {
                                    width: "95%",
                                    borderRadius: 5
                                  },
                                  Platform.OS === "ios" ? { height: 20 } : {}
                                ]}
                                date={i?.expiry_date}
                                confirmBtnText={t("VACCINATION.CONFIRM")}
                                cancelBtnText={t("VACCINATION.CANCEL")}
                                mode="date"
                                placeholder={t("VACCINATION.EXPIRY_DATE")}
                                format="YYYY-MM-DD"
                                showIcon={false}
                                iconComponent={<Image source={Cal} />}
                                customStyles={{
                                  dateIcon: {
                                    position: "absolute",
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0,
                                    borderRadius: 5,
                                    width: "100%"
                                  },
                                  borderInput: {
                                    borderRadius: 5
                                  }
                                }}
                                onDateChange={(selectedDate) => {
                                  setObserved(selectedDate);
                                  let data = [...vaccineData];
                                  data[index].expiry_date = selectedDate;
                                  setVaccineData(data);
                                  setdataOf(data);
                                }}
                              /> */}
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 20,
                              }}></View>
                            <View
                              style={{alignItems: 'center', marginLeft: 10}}>
                              <TouchableOpacity
                                onPress={() => {
                                  Keyboard.dismiss();
                                  indexofVaccine.current = index;
                                  vaccineId.current = i.id;
                                  setImage();
                                }}
                                style={{
                                  backgroundColor:
                                    DEFAULT_BACKGROUND_BLUE_COLOR,
                                  margin: 20,
                                  padding: 6,
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  borderColor: APP_PRIMARY_COLOR,
                                  flexDirection: 'row',
                                  alignContent: 'center',
                                  alignSelf: 'center',
                                  width: '95%',
                                }}
                                testID="cameraTouch"
                                accessibilityLabel="cameraTouch">
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    marginLeft: 100,
                                  }}>
                                  <FileSelector
                                    testID="fileSelectortext"
                                    accessibilityLabel="fileSelectortext"
                                    ref={fileSelRef}
                                    onSelection={handleSelection}
                                    selectAny
                                  />

                                  <Image
                                    testID="camerImage"
                                    accessibilityLabel="camerImage"
                                    source={Camera}
                                    style={{width: 18, height: 18}}
                                  />

                                  <Text
                                    style={{
                                      color: APP_PRIMARY_COLOR,
                                      textAlign: 'center',
                                      fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      marginLeft: 5,
                                    }}
                                    testID="uploadText"
                                    accessibilityLabel="uploadText">
                                    {console.log(
                                      'pdfDatapdfData pdfData ',
                                      dataOf[0]?.attachments[0]?.file,
                                    )}
                                    {t('VACCINATION.UPLOAD')}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View
                            key={index}
                            style={{
                              padding: 10,
                              marginBottom: 20,
                              borderWidth: 1,
                              borderColor: STATUS_CARD_BORDER_COLOR,
                              borderRadius: 10,
                              marginVertical: 10,
                            }}>
                            <View>
                              <View style={{flexDirection: 'row'}}>
                                <Image
                                  testID="vaccineImage"
                                  accessibilityLabel="vaccineImage"
                                  source={Vaccine}
                                  style={{height: 18, width: 18}}
                                />
                                <Text
                                  style={{
                                    fontFamily:
                                      FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                                    paddingLeft: 5,
                                  }}
                                  testID={
                                    i.vaccine_details.vaccine_brand_name +
                                    'text'
                                  }
                                  accessibilityLabel={
                                    i.vaccine_details.vaccine_brand_name +
                                    'text'
                                  }>
                                  {i.vaccine_details.vaccine_brand_name}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  paddingLeft: 22,
                                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                                  fontSize: 12,
                                  color: STATUS_CARD_BORDER_COLOR,
                                }}
                                testID={
                                  'batchNoAndExpiry' +
                                  i.batch_no +
                                  i.expiry_date
                                }
                                accessibilityLabel={
                                  'batchNoAndExpiry' +
                                  i.batch_no +
                                  i.expiry_date
                                }>
                                {t('VACCINATION.BATCH')}:{i.batch_no},{' '}
                                {t('VACCINATION.EXPIRY')}:{i.expiry_date}
                              </Text>
                              {i?.description && (
                                <Text
                                  style={{
                                    paddingLeft: 22,
                                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                                    fontSize: 12,
                                    color: STATUS_CARD_BORDER_COLOR,
                                  }}
                                  testID={i?.description + 'descriptionText'}
                                  accessibilityLabel={
                                    i?.description + 'descriptionText'
                                  }>
                                  {i?.description}
                                </Text>
                              )}
                            </View>
                            <View
                              style={{
                                backgroundColor: STATUS_CARD_BORDER_COLOR,
                                height: 1,
                                width: '90%',
                                marginHorizontal: 20,
                                marginVertical: 10,
                              }}
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 20,
                                justifyContent: 'space-between',
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View>
                                  <Image
                                    testID="attachmentImage"
                                    accessibilityLabel="attachmentImage"
                                    source={Attachment}
                                    style={styles.att1}
                                  />
                                </View>

                                <View style={{marginLeft: 10, width: '70%'}}>
                                  <Text
                                    style={{flexWrap: 'wrap'}}
                                    testID={i.attachments[0].file + 'text'}
                                    accessibilityLabel={
                                      i.attachments[0].file + 'text'
                                    }>
                                    {i.attachments[0].file}
                                  </Text>
                                  <Text
                                    style={{color: STATUS_CARD_BORDER_COLOR}}
                                    testID="fileUploadedText"
                                    accessibilityLabel="fileUploadedText">
                                    {t('VACCINATION.FILEUPLOADED')}
                                  </Text>
                                </View>
                              </View>
                              <View>
                                <TouchableOpacity
                                  style={styles.attach}
                                  onPress={() => {
                                    removeFile(index);
                                  }}
                                  testID="closeTouch"
                                  accessibilityLabel="closeTouch">
                                  <Image
                                    testID="closeImage"
                                    accessibilityLabel="closeImage"
                                    source={AttachClose}
                                    style={styles.attach1}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })
                : null}
            </ScrollView>

            <View style={{marginVertical: 5}}>
              <TouchableOpacity
                style={styles.generate1}
                onPress={() => {
                  SaveVaccination();
                }}
                testID="completeTouch"
                accessibilityLabel="completeTouch">
                <Text
                  style={styles.generatetext1}
                  testID="completeText"
                  accessibilityLabel="completeText">
                  {t('VACCINATION.COMPLETE')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
  const DateView = () => {
    return (
      <View style={[styles.datePick]}>
        <View style={{flexDirection: 'row', width: '50%'}}>
          <TouchableOpacity
            onPress={leftPress}
            style={[styles.alignSelf, {marginLeft: wp(15)}]}
            testID="backArrowTouch"
            accessibilityLabel="backArrowTouch">
            <Image
              testID="backArrowImage"
              accessibilityLabel="backArrowImage"
              style={[styles.dropArrow, styles.alignSelf]}
              source={back_arrow}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              actionSheetRef.current?.setModalVisible();
            }}
            style={{alignSelf: 'center'}}
            testID="dateTouch"
            accessibilityLabel="dateTouch">
            <Text
              style={{marginHorizontal: 10}}
              testID={textDate + 'text'}
              accessibilityLabel={textDate + 'text'}>
              {textDate}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={rightPress}
            style={styles.alignSelf}
            testID="backArrowTouch1"
            accessibilityLabel="backArrowTouch">
            <Image
              testID="backArrowImage1"
              accessibilityLabel="backArrowImage1"
              style={[styles.dropArrow, styles.arrowRight]}
              source={back_arrow}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '50%',
            height: '100%',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {show ? (
            <View style={{flexDirection: 'row', paddingLeft: 6}}>
              <Image
                testID="dotImage"
                accessibilityLabel="dotImage"
                source={dot}
                style={{height: 22, width: 25, tintColor: DEFAULT_RED_COLOR}}
              />
              <Text
                style={{
                  height: '100%',
                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                  textAlignVertical: 'center',
                }}
                testID="bookedText"
                accessibilityLabel="bookedText">
                {t('DASHBOARD.SHOWING_BOOKED', {total: `(${count})`})}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const CollapseComponent = () => {
    return (
      <View
        style={[
          styles.dateView,
          {height: statusCount.length > 3 ? hp(220) : hp(180)},
        ]}>
        <View
          style={{
            height: hp(70),
          }}>
          <CalendarProvider
            style={{marginTop: 0}}
            date={selectedDate}
            onDateChanged={date => {
              ChangeDay(date);
            }}>
            <WeekCalendar
              testID="calendar"
              accessibilityLabel="calendar"
              firstDay={1}
              disableWeekScroll={false}
              hideExtraDays={false}
              allowShadow={false}
              onScrollEndDrag={false}
              dayComponent={(date, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      ChangeDay(date.date.dateString);
                    }}
                    testID="dayTouch"
                    accessibilityLabel="dayTouch">
                    <View
                      style={{
                        backgroundColor:
                          date.date.dateString == selectedDate
                            ? APP_PRIMARY_COLOR
                            : DEFAULT_SHADOW_COLOR,
                        width: 35,
                        height: 35,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          color:
                            date.date.dateString == selectedDate
                              ? DEFAULT_WHITE_COLOR
                              : 'black',
                        }}
                        testID={date.date.day + 'text'}
                        accessibilityLabel={date.date.day + 'text'}>
                        {date.date.day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </CalendarProvider>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: Platform.OS == 'ios' ? 10 : 20,
            height: statusCount.length > 3 ? hp(130) : hp(110),
            alignSelf: 'flex-start',
          }}>
          {statusCount && statusCount.length > 0 ? (
            <FlatList
              numColumns={3}
              data={statusCount}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                if (item.count > 0) {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        statusFilter({
                          index: index == statusIndexValue ? null : index,
                          filterKey: index == statusIndexValue ? '' : item.key,
                          filter: true,
                          count: item.count,
                        });
                      }}
                      testID={item.label + 'touch'}
                      accessibilityLabel={item.label + 'touch'}>
                      <View
                        style={[
                          styles.flatView,
                          {
                            backgroundColor: getCardColor(
                              item?.key?.toLocaleLowerCase(),
                            ),
                          },
                          index === statusIndexValue
                            ? styles.statusSelected
                            : null,
                        ]}>
                        <Text
                          style={styles.statusText}
                          testID={item.label + 'text'}
                          accessibilityLabel={item.label + 'text'}>
                          {item.label}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            //backgroundColor: 'red',
                            bottom: 2,
                            // marginTop: 4,
                          }}>
                          <View style={{paddingLeft: 4}}>
                            <Image
                              testID="dotImage"
                              accessibilityLabel="dotImage"
                              source={dot}
                              style={[
                                styles.flatImage,
                                {
                                  tintColor: getColor(item?.key?.toLowerCase()),
                                },
                              ]}
                            />
                          </View>
                          <View style={styles.statusCountView}>
                            <Text
                              style={styles.statusCountText}
                              testID={item.count + 'text'}
                              accessibilityLabel={item.count + 'text'}>
                              {item.count}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }
              }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                marginLeft: wp(120),
              }}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                  fontSize: 16,
                  textAlign: 'center',
                  color: 'red',
                }}
                testID="noAppointmentsText"
                accessibilityLabel="noAppointmentsText">
                {t('DASHBOARD.NOAPPOINTMENTS')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 60;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const AppointmentCard = React.useCallback(({item, index, qr_code_hlp_id}) => {
    const [vaccineTrue, setvaccineTrue] = useState([]);
    // vaccineDataRef;

    useMemo(() => {
      if (
        item.is_provide_vaccine === true &&
        item?.appointment?.appointment_status != 'Booked' &&
        item?.appointment?.appointment_status == 'Completed'
      ) {
        GetVaccineData(item).then(res => {
          setvaccineTrue(res);
        });
        return GetVaccineData;
      }
    }, []);

    let status = item?.appointment?.appointment_status;
    let url = item?.prescription_url;
    return (
      <TouchableOpacity
        key={index}
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          setTimeout(() => {
            dataSourceCords[index] = layout.y;
            setDataSourceCords(dataSourceCords);
          }, 100);
        }}
        onPress={() => {
          item?.appointment?.appointment_status === BOOKED &&
          // item?.appointment?.appointment_status === "Review" &&
          alone == true
            ? (setbookedModal(true),
              setappointmentid(item?.appointment?.id),
              setflag(item?.corporate_flag ? item?.corporate_flag : false),
              setencount_id(item?.encounter_id),
              setapp_type(item?.appointment?.appointment_type),
              setapp_status(item?.appointment?.appointment_status),
              set_virtual_branch(item?.appointment?.virtual_clinic_branch))
            : getPatientCard({
                virtualBranch: item?.appointment?.virtual_clinic_branch,
                appointmentId: item.appointment.id,
                status: item?.appointment?.appointment_status?.toLowerCase(),
                type: item?.appointment?.appointment_type?.toLowerCase(),
              });
        }}>
        <View
          style={[
            qr_code_hlp_id == item?.appointment?.person_details?.hlpid &&
            item?.appointment?.status != 'cancelled'
              ? styles.appointmentViewQrcode
              : styles.appointmentView,
          ]}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                flexDirection: 'row',
                width: '80%',
              }}>
              <Text
                style={styles.appointmentTime}
                testID={item.appointment.date_start + 'text'}>
                {moment(item.appointment.date_start, 'HHmm').format('hh:mm A')}
              </Text>
              <View style={{marginTop: 2}}>
                <View>
                  <View style={[styles.appointmentName, {width: '60%'}]}>
                    <Text
                      style={[styles.textFont]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      testID={
                        item.appointment.person_details.full_name + 'text'
                      }
                      accessibilityLabel={
                        item.appointment.person_details.full_name + 'text'
                      }>
                      {item.appointment.person_details.full_name}
                    </Text>
                    <View
                      style={[
                        styles.liveStatus,
                        {
                          backgroundColor: getColor(
                            item.appointment_type_status,
                          ),
                          padding: 0,
                          margin: 0,
                        },
                      ]}>
                      <Text
                        style={[styles.textCenter, {fontSize: 12}]}
                        testID={item.appointment_type_status + 'text'}
                        accessibilityLabel={
                          item.appointment_type_status + 'text'
                        }>
                        {item.appointment_type_status}
                      </Text>
                    </View>

                    {item.virtual_clinic === true ? (
                      <View
                        style={[
                          styles.liveStatus,
                          {
                            backgroundColor: getColor('online'),
                            padding: 0,
                            margin: 0,
                          },
                        ]}>
                        <Text
                          style={[styles.textCenter, {fontSize: 12}]}
                          testID="virtualText"
                          accessibilityLabel="virtualText">
                          virtual
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View>
                    <Text
                      style={[styles.appointmentType, styles.dayscolor]}
                      testID={item.appointment.appointment_type + 'virtualText'}
                      accessibilityLabel={
                        item.appointment.appointment_type + 'virtualText'
                      }>
                      {item.appointment.appointment_type}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.appointmentStatus}>
              <Image
                testID="dotImage"
                accessibilityLabel="dotImage"
                source={dot}
                key={item}
                style={[
                  styles.flatImage,
                  {
                    tintColor: getColor(
                      // statusNameChange(
                      item.appointment?.appointment_status?.toLowerCase(),
                      // ),
                    ),
                    marginTop: hp(5),
                    // margin: 0
                  },
                ]}
              />
              <Text
                style={[styles.textCenter, {marginTop: hp(2)}]}
                testID={item.appointment.appointment_status + 'text'}
                accessibilityLabel={
                  item.appointment.appointment_status + 'text'
                }>
                {item.appointment.appointment_status}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              padding: 0,
              alignContent: 'flex-start',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent:
                  status === 'Completed' && url && vaccineTrue?.length > 0
                    ? 'center'
                    : 'flex-start',
                width:
                  status === 'Completed' && url && vaccineTrue?.length > 0
                    ? '95%'
                    : '60%',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              {item?.prescription_url ? (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      // ViewPdfFooter
                      // ViewPdfScreen
                      props.navigation.navigate('ViewPdfScreen', {
                        link: getApiUrl() + item?.prescription_url,
                        screenname: t('COMMON.PRISCRIPTION'),
                        share: true,
                      });
                    }}
                    style={{
                      backgroundColor: STATUS_OFFLINE,
                      borderRadius: wp(30),
                      paddingHorizontal: wp(5),
                      paddingVertical: 0,
                    }}
                    testID="viewPrescriptionTouch"
                    accessibilityLabel="viewPrescriptionTouch">
                    <View style={styles.vertical}>
                      <Image
                        source={Pdf}
                        style={styles.historyicon}
                        testID="pdfImage"
                        accessibilityLabel="pdfImage"
                      />
                      <Text
                        style={
                          ([styles.input, styles.textfont],
                          {
                            textAlign: 'center',
                            color: STATUS_BOOKED,
                            fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          })
                        }
                        testID="viewPrescriptionText"
                        accessibilityLabel="viewPrescriptionText">
                        {t('COMMON.VIEWPRISCRIPTION')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              {alone == true ? (
                // && billing == true
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: APP_PRIMARY_BACKGROUND_COLOR,
                      borderRadius: wp(30),
                      paddingHorizontal: wp(5),
                    }}
                    onPress={() => {
                      clearAsync();
                      setTimeout(() => {
                        props.navigation.navigate('PayBill', {
                          appointmentId: item?.appointment?.id,
                        });
                      }, 200);
                    }}
                    testID="billingTouch"
                    accessibilityLabel="billingTouch">
                    <View style={styles.vertical}>
                      <Image
                        source={Bill}
                        style={styles.historyicon}
                        testID="billImage"
                        accessibilityLabel="billImage"
                      />
                      <Text
                        style={
                          ([styles.input, styles.textfont],
                          {
                            textAlign: 'center',
                            color: APP_PRIMARY_COLOR,
                            fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          })
                        }
                        testID="billingText"
                        accessibilityLabel="billingText">
                        {t('COMMON.BILLING')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}

              {status === 'Completed' && vaccineTrue?.length > 0 ? (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setVaccineData(vaccineTrue);
                      vaccineDataRef.current = vaccineTrue;
                      // VaccineRef.current?.setModalVisible(true);
                      setvaccineModal(true);
                      setvaccinepatient(item);
                    }}
                    style={{
                      backgroundColor: STATUS_ONLINE,
                      borderRadius: wp(30),
                      paddingHorizontal: wp(5),
                      paddingVertical: 0,
                    }}
                    testID="provideVaccineTouch"
                    accessibilityLabel="provideVaccineTouch">
                    <View style={styles.vertical}>
                      <Image
                        source={Vaccine}
                        style={styles.historyicon}
                        testID="vaccineImage"
                        accessibilityLabel="vaccineImage"
                      />
                      <Text
                        style={
                          ([styles.input, styles.textfont],
                          {
                            textAlign: 'center',
                            color: STATUS_COMPLETED,
                            fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                          })
                        }
                        testID="provideVaccineText"
                        accessibilityLabel="provideVaccineText">
                        {t('DASHBOARD.PROVIDE_VACCINE')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* <View style={styles.hr} /> */}
        <Divider style={{height: 1, backgroundColor: 'gray'}} />
      </TouchableOpacity>
    );
  });

  const Appointments = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        ref={scrollRef}
        onScroll={({nativeEvent, b}) => {
          if (isCloseToBottom(nativeEvent) && nextOffset) {
            getAppointments(selectedDate);
          }
        }}
        scrollEventThrottle={300}
        style={{
          marginBottom: Platform.OS == 'ios' ? 20 : 0,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
        }>
        <View
          style={{
            flexDirection: 'row',
            height: hp(35),
            paddingHorizontal: 10,
            bottom: 0,
          }}>
          <Text
            style={{
              marginLeft: 10,
              fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
            }}
            testID="timeText"
            accessibilityLabel="timeText">
            {t('DASHBOARD.TIME')}
          </Text>
          <Text
            style={{
              marginLeft: wp(32),
              fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
            }}
            testID="appointmentsText"
            accessibilityLabel="appointmentsText">
            {t('DASHBOARD.APPOINTMENTS', {total: `(${count})`})}
          </Text>
        </View>

        {/* <View
          style={{
            backgroundColor:
              appointmentsList && appointmentsList.length > 0
                ? DEFAULT_WHITE_COLOR
                : '',
          }}> */}

        {appointmentsList && appointmentsList.length > 0 ? (
          appointmentsList && appointmentsList.length > 3 ? (
            appointmentsList.map((item, index) => {
              return (
                <View>
                  <AppointmentCard
                    qr_code_hlp_id={qr_code_hlp_id}
                    item={item}
                    index={index}
                    key={index}
                  />
                </View>
              );
            })
          ) : (
            appointmentsList &&
            appointmentsList.length <= 3 &&
            appointmentsList.map((item, index) => {
              return (
                <View
                  style={
                    index == appointmentsList.length - 1 && {marginBottom: 400}
                  }>
                  <AppointmentCard
                    qr_code_hlp_id={qr_code_hlp_id}
                    item={item}
                    index={index}
                    key={index}
                  />
                </View>
              );
            })
          )
        ) : (
          <View style={{marginTop: hp(100)}}>
            {appointmentloading ? (
              <Loader noBackground={true} />
            ) : (
              <View style={{alignContent: 'center', marginBottom: 300}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                    fontSize: 16,
                  }}
                  testID="noAppointmentsText"
                  accessibilityLabel="noAppointmentsText">
                  {t('DASHBOARD.NOAPPOINTMENTS')}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  const scrollHandler = useCallback(val => {
    let index = val > 0 ? val : 0;

    if (dataSourceCords.length === 0 && scrollRef.current != null) {
      setTimeout(() => {
        scrollHandler(index);
      }, 200);
    } else {
      if (dataSourceCords?.length > index) {
        scrollRef.current?.scrollTo({
          x: 0,
          y: dataSourceCords[index],
          animated: true,
        });
      }
    }
  });

  const renderCalenderModal = () => {
    return (
      <View style={styles.modalPaddingStyles}>
        <View style={styles.closeModal}>
          <View style={styles.headerView}>
            <Text
              style={styles.headerText}
              testID="selectDateText"
              accessibilityLabel="selectDateText">
              {t('COMMON.SELECT_DATE')}
            </Text>
            <View style={styles.closeView}>
              <TouchableOpacity
                onPress={() => actionSheetRef.current?.setModalVisible(false)}
                style={styles.touchableArea}>
                <Close
                  height={14}
                  width={14}
                  style={styles.closeImage}
                  testID="closeImage"
                  accessibilityLabel="closeImage"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Calendar
              testID="calender"
              accessibilityLabel="calender"
              current={selectedDate}
              markedDates={{
                [selectedDate]: {selected: true},
              }}
              hideExtraDays={true}
              onDayPress={day => {
                ChangeDay(day.dateString);
                actionSheetRef.current?.setModalVisible();
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loader />;
  }
  if (statusloading && appointmentloading && !selectedDate) {
    return <Loader />;
  }
  return (
    <View style={{flex: 1, backgroundColor: '#F7F7F8'}}>
      <Header
        testID="appointmentsHeader"
        accessibilityLabel="appointmentsHeader"
        navigation={props.navigation}
        title={t('DASHBOARD.APPOINTMENTS', {total: `(${count})`})}
        hospitallist
        listOfHospitals={doctorDetails.pract_details}
        changeBranch={changeBranch}
        setTextSearch={setTextSearch}
        getAllAppointments={getAllAppointments}
        setalone={setalone}
        checkAuthorization={checkAuthorization}
        searchAppointment={searchAppointment}
        qr_code_hlp_id={qr_code_hlp_id}
      />

      {DateView()}

      <Collapsible collapsed={show}>{CollapseComponent()}</Collapsible>
      <TouchableOpacity onPress={handleToggle}>
        <View
          style={[
            styles.dropOpacity,
            {
              alignSelf: 'center',
              alignItems: 'center',
              alignContent: 'center',
              zIndex: 999,
            },
          ]}>
          <Icon
            type="EvilIcons"
            name={show ? 'chevron-down' : 'chevron-up'}
            style={{
              fontSize: 40,
              position: 'relative',
              right: 4,
            }}
          />
        </View>
      </TouchableOpacity>
      {Appointments()}
      {alone && alone == true ? (
        <View
          style={
            appointmentloading
              ? {
                  flexDirection: 'row',
                  padding: 5,
                  backgroundColor: DEFAULT_WHITE_COLOR,
                  bottom: Platform.OS == 'ios' ? 20 : 0,
                  paddingHorizontal: 10,
                  marginBottom: -280,
                }
              : styles.bottomtab
          }>
          <TouchableOpacity
            style={styles.preview}
            onPress={() => {
              setModal(true);
            }}
            testID="newPatientTouch"
            accessibilityLabel="newPatientTouch">
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  type="Ionicons"
                  name="person"
                  style={{
                    fontSize: 16,
                    color: APP_PRIMARY_COLOR,
                    // marginLeft: 30,
                    marginRight: 5,
                  }}
                />
                <Text
                  style={styles.previewtext}
                  testID="newPatientText"
                  accessibilityLabel="newPatientText">
                  {t('DASHBOARD.ADD_PERSON')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.generate}
            onPress={() => {
              setsearch(true);
            }}
            testID="newAppointmentTouch"
            accessibilityLabel="newAppointmentTouch">
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                testID="appointmentIcon"
                accessibilityLabel="appointmentIcon"
                type="MaterialIcons"
                name="date-range"
                style={{
                  fontSize: 16,
                  color: DEFAULT_WHITE_COLOR,
                  marginRight: 5,
                }}
              />
              <Text
                style={styles.generatetext}
                testID="newAppointmentText"
                accessibilityLabel="newAppointmentText">
                {t('DASHBOARD.NEW_APPOINTMENT')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
      <ActionSheet ref={actionSheetRef}>{renderCalenderModal()}</ActionSheet>
      <Modal
        isVisible={vaccineModal}
        onModalHide={() => {
          vaccineDataRef.current = null;
          setVaccineData([]);
          setvaccinepatient({});
          indexofVaccine.current = null;
          vaccineId.current = null;
        }}
        style={{margin: 0, padding: 0}}>
        {/* <ActionSheet
        ref={VaccineRef}
        onClose={() => {
          setVaccineData([]);
        }}
        > */}
        <Vaccination />
        {/* </ActionSheet> */}
      </Modal>
      <Modal
        isVisible={successModal}
        style={{margin: 0, padding: 0}}
        animationIn="bounceInDown">
        <View
          style={{
            flex: 1,
            height: '25%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 20,
            backgroundColor: DEFAULT_WHITE_COLOR,
            paddingHorizontal: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              margin: 20,
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setsuccessModal(false);
                }}>
                <Image
                  source={close}
                  style={{height: 12, width: 12}}
                  testID="closeImage"
                  accessibilityLabel="closeImage"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={{alignSelf: 'center', justifyContent: 'center'}}>
              <Icon
                name="checkcircle"
                type="AntDesign"
                style={{
                  color: DEFAULT_GREEN_COLOR,
                  fontSize: 80,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                  marginVertical: hp(10),
                }}
                testID="vaccineDataUpdatedText"
                accessibilityLabel="vaccineDataUpdatedText">
                Vaccine data updated
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal backdropOpacity={0.2} isVisible={relationShow}>
        <View
          style={{
            backgroundColor: DEFAULT_WHITE_COLOR,
            height: '50%',
            borderRadius: 20,
            padding: 15,
            justifyContent: 'space-between',
          }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setrelationShow(false);
                onClose();
              }}
              style={{
                width: 20,
                alignSelf: 'flex-end',
              }}>
              <Image
                source={close}
                style={{height: 16, width: 16}}
                testID="closeImage"
                accessibilityLabel="closeImage"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: '40%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
              }}
              testID="alreadyExistText"
              accessibilityLabel="alreadyExistText">
              {t('MESSAGES.ALREADY_EXIST', {
                phone_number: phone_number,
                name: capitalize(registeredName),
              })}
            </Text>
          </View>
          <SelectDropdown
            testID=""
            data={relationList}
            defaultButtonText={t('ADD_PATIENT.SELECT_RELATION')}
            onSelect={(selectedItem, index) => {
              setrelation(selectedItem.key);
            }}
            rowTextForSelection={(relation, index) => {
              return relation?.label;
            }}
            buttonTextAfterSelection={(relation, index) => {
              return relation?.label;
            }}
            dropdownStyle={{borderRadius: 10}}
            buttonStyle={{
              backgroundColor: DEFAULT_WHITE_COLOR,
              borderRadius: 10,
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: 'gray',
            }}
          />

          <View style={{padding: 20}}>
            <Button
              title={t('ADD_PATIENT.SAVE_CREATE')}
              onPress={() => {
                selectRelation();
              }}
              testID="saveAndCreateAccountButton"
              accessibilityLabel="saveAndCreateAccountButton"></Button>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={search}
        onBackdropPress={() => {
          setsearch(false);
          setpatientsList([]);
        }}
        style={{
          padding: 0,
          margin: 0,
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              backgroundColor: DEFAULT_WHITE_COLOR,
              height: hp(500),
              flex: 1,
              borderRadius: 10,
              padding: 5,
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            <View style={[styles.headerView]}>
              <Text
                style={[styles.headerText, {fontWeight: 'normal'}]}
                testID="searchPatientText"
                accessibilityLabel="searchPatientText">
                {t('COMMON.SEARCH_PATIENT')}
              </Text>
              <View style={styles.closeView}>
                <TouchableOpacity
                  onPress={() => {
                    setsearch(false);
                    setpatientsList([]);
                  }}
                  style={{
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 20,
                    marginRight: 20,
                  }}>
                  <Close
                    height={14}
                    width={14}
                    style={styles.closeImage}
                    testID="closeImage"
                    accessibilityLabel="closeImage"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{height: '100%', paddingBottom: hp(50)}}>
              <View style={styles.searchoutside}>
                <View style={styles.search}>
                  <Image
                    source={Search}
                    style={styles.searchimg}
                    testID="searchImage"
                    accessibilityLabel="searchImage"
                  />
                  <TextInput
                    testID="searchPatientsTextInput"
                    accessibilityLabel="searchPatientsTextInput"
                    // value={props.value}
                    placeholder={i18n.t('COMMON.SEARCH_PATIENT')}
                    style={styles.searchmedicine}
                    onChangeText={val => {
                      getPatientData(val);
                    }}
                  />
                </View>
              </View>
              {/* <FlatList 
            data={patientsList}
            numColumns={1}
            renderItem={({item, index})=>}
            /> */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always">
                {patientsList.map((patient, index) => {
                  let age = moment().diff(
                    moment(patient.dob, 'DD MMM YYYY'),
                    'years',
                  );

                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: '100%',
                        alignSelf: 'flex-start',
                      }}
                      onPress={() => {
                        setsearch(false);
                        setpatientsList([]);
                        setAppointmentsList([]);
                        global.hlpid = patient.hlpid;
                        props.navigation.navigate(BOOKAPPOINTMENT, {
                          branchId: branch_id,
                          slot_timing: global.slot_timing,
                          doctorId: doctor_id,
                          personDetails: patient,
                        });
                      }}>
                      <View
                        style={{
                          marginHorizontal: 15,
                          alignItems: 'flex-start',
                          padding: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                            textAlign: 'left',
                            fontSize: 16,
                          }}
                          testID={
                            patient.first_name +
                            patient.last_name +
                            patient.gender +
                            'text'
                          }
                          accessibilityLabel={
                            patient.first_name +
                            patient.last_name +
                            patient.gender +
                            'text'
                          }>
                          {capitalize(patient.first_name) +
                            ' ' +
                            capitalize(patient.last_name) +
                            ' ' +
                            age +
                            'Yrs' +
                            ' ' +
                            capitalize(patient.gender)}
                        </Text>
                      </View>
                      <Divider
                        style={{
                          height: 1,
                          backgroundColor: '#e1e8ee',
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          {/* </ActionSheet> */}
        </View>
      </Modal>
      <Modal
        isVisible={modal}
        onBackButtonPress={() => {
          setModal(false);
          onClose();
        }}
        onBackdropPress={() => {
          setModal(false);
          onClose();
        }}
        backdropOpacity={0.1}
        style={{
          padding: 0,
          margin: 0,
          // flex: 1,
        }}>
        {Newpatients()}
      </Modal>
      <ScrollView>
        <Modal
          isVisible={otpShow}
          transparent={true}
          animationType={'none'}
          style={{
            margin: 0,
            padding: 0,
            marginBottom: Platform.OS == 'ios' ? 250 : 0,
          }}
          backdropOpacity={0.1}>
          {/* <View style={{flex: 1}}> */}
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            onPress={Keyboard.dismiss}>
            <View
              style={{
                backgroundColor: DEFAULT_WHITE_COLOR,
                height: '50%',
                borderTopStartRadius: 20,
                borderTopEndRadius: 20,
                bottom: 0,
                position: 'absolute',
                right: 0,
                left: 0,
              }}>
              <View style={styles.headerView}>
                <Text
                  style={[styles.headerText, {fontWeight: 'normal'}]}
                  testID="otpSentToText"
                  accessibilityLabel="otpSentToText">
                  {t('ADD_PATIENT.OTP_SENT_TO')}
                </Text>
                <View style={styles.closeView}>
                  <TouchableOpacity
                    onPress={() => {
                      setotpShow(false);
                      onClose();
                    }}
                    style={{
                      width: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 20,
                      marginRight: 20,
                    }}>
                    <Close
                      height={14}
                      width={14}
                      style={styles.closeImage}
                      testID="closeImage"
                      accessibilityLabel="closeImage"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{marginTop: 15, backgroundColor: DEFAULT_WHITE_COLOR}}>
                <Text
                  style={{
                    lineHeight: 30,
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginLeft: 12,
                  }}
                  testID={phone_code + phone_number + 'text'}
                  accessibilityLabel={phone_code + phone_number + 'text'}>
                  {phone_code + ' ' + phone_number}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  backgroundColor: DEFAULT_WHITE_COLOR,
                }}>
                <CodeField
                  ref={ref}
                  {...propss}
                  value={value}
                  onChangeText={setValue}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType={'numeric'}
                  onSubmitEditing={Keyboard.dismiss}
                  textContentType="oneTimeCode"
                  renderCell={({index, symbol, isFocused}) => (
                    <View
                      // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                      onLayout={getCellOnLayoutHandler(index)}
                      key={index}
                      style={[styles.cellRoot, isFocused && styles.focusCell]}>
                      <Text style={styles.cellText}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  height: '40%',
                  justifyContent: 'space-evenly',
                  backgroundColor: DEFAULT_WHITE_COLOR,
                }}>
                <Text
                  testID="resendCodeInText"
                  accessibilityLabel="resendCodeInText">
                  {t('ADD_PATIENT.RESEND_CODE_IN')}
                  {timerCount.toString().length == 2
                    ? timerCount
                    : '0' + timerCount}
                </Text>
                {timerCount == 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      resendOTP({resend: true});
                    }}>
                    <Text
                      style={{
                        color: APP_PRIMARY_COLOR,
                        textDecorationLine: 'underline',
                      }}
                      testID="resendOtpText"
                      accessibilityLabel="resendOtpText">
                      {t('ADD_PATIENT.RESEND_OTP')}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <View
                style={{
                  paddingHorizontal: 30,
                  backgroundColor: DEFAULT_WHITE_COLOR,
                }}>
                {value.toString().length == 6 && (
                  <Button
                    title={t('COMMON.CONTINUE')}
                    onPress={verifyotp}
                    testID="continueButton"
                    accessibilityLabel="continueButton"></Button>
                )}
              </View>
              {Platform.OS == 'ios' ? (
                <View
                  style={{
                    marginBottom: 30,
                    backgroundColor: DEFAULT_WHITE_COLOR,
                  }}>
                  <Text> </Text>
                </View>
              ) : null}
            </View>
            {/* </View> */}
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>

      <Modal backdropOpacity={0.2} isVisible={bookedModal}>
        <View
          style={{
            backgroundColor: DEFAULT_WHITE_COLOR,
            height: '25%',
            borderRadius: 20,
            padding: 15,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setbookedModal(false);
                onClose();
              }}
              style={{
                width: 25,
                alignSelf: 'flex-end',

                backgroundColor: DEFAULT_INVERSE_COLOR,
                borderRadius: 25,
                padding: 8,
              }}
              testID="closeTouch"
              accessibilityLabel="closeTouch">
              <Image
                source={close}
                style={{
                  height: 10,
                  width: 10,
                  tintColor: DEFAULT_WHITE_COLOR,
                  alignSelf: 'center',
                }}
                testID="closeImage"
                accessibilityLabel="closeImage"
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
              }}
              testID="PatientArrivedForConsultationText"
              accessibilityLabel="PatientArrivedForConsultationText">
              Has the patient arrived for consultation?
            </Text>
          </View>

          <View>
            <Text
              style={{fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR}}
              testID="ContinueConsultationText"
              accessibilityLabel="ContinueConsultationText">
              Clicking on 'Yes' will generate an encounter to continue the
              consultation
            </Text>
          </View>
          <View style={{flexDirection: 'row-reverse', alignItems: 'flex-end'}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setbookedModal(false);
                  setTimeout(() => {
                    getPatientCard({
                      virtualBranch: virtual_branch,
                      appointmentId: appointmentid,
                      status: app_status?.toLocaleLowerCase(),
                      type: app_type?.toLocaleLowerCase(),
                    });
                  }, 100);
                }}
                style={{
                  backgroundColor: DEFAULT_LIGHT_GREY_COLOR,
                  justifyContent: 'center',
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  marginRight: 10,
                }}
                testID="noTouch"
                accessibilityLabel="noTouch">
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: DEFAULT_WHITE_COLOR,
                    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                  }}
                  testID="noText"
                  accessibilityLabel="noText">
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setbookedModal(false);
                  setTimeout(() => {
                    createEncounter({
                      appointment_id: appointmentid || appointment_id_qr,
                    });
                  }, 100);
                }}
                style={{
                  backgroundColor: APP_PRIMARY_COLOR,
                  justifyContent: 'center',
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                }}
                testID="yesTouch"
                accessibilityLabel="yesTouch">
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: DEFAULT_WHITE_COLOR,
                    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                  }}
                  testID="yesText"
                  accessibilityLabel="yesText">
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    doctorDetails: state.postList.postList,
    patientList: state.patientList.patientList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPatient: data => dispatch(getPatient(data)),
    fetchPatientSuccess: data => dispatch(fetchPatientSuccess(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(HomeScreen));
