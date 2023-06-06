import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator, HeaderBackButton} from 'react-navigation-stack';
//import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
// import { Transition } from "react-native-reanimated";
import AuthLoadingScreen from '../screens/Auth/AuthLoadingScreen';
import PatientsDetails from '../screens/HomeScreen/Patients/PatientsDetails';
import Login from '../screens/Auth/Login/Login';
import LandingPage from '../screens/HomeScreen/Checkup/LandingPage';
import ListOfPatients from '../screens/HomeScreen/Patients/ListOfPatients';
import ViewPdfScreen from '../screens/app/patienhistory/timeline/ViewPdfScreen';
import ViewPdfFooter from '../screens/app/common/ViewPdfFooter';
import ViewReceipts from '../screens/app/billing/ViewReceipts';
import HomeScreen from '../screens/app/homescreen/HomeScreen';
import {DeleteAccount} from '../screens/HomeScreen/CustomDrawer/DeleteAccount';
import PatientCard from '../screens/app/patientcard/PatientCard';
import Consultation from '../screens/app/consultation/Consultation';
import PatientHistoryTabs from '../screens/app/patienhistory/PatientHistoryTabs';
import AumTemplate from '../screens/app/consultation/template/aum-template';
import AddMedicine from '../screens/app/consultation/plan/AddMedicine';
import PayBill from '../screens/app/billing/Paybill';
import Billing from '../screens/app/billing/Billing';
import PaymentDetails from '../screens/app/billing/Payment';
import AddLab from '../screens/app/consultation/plan/AddLab';
import AddImg from '../screens/app/consultation/plan/AddImg';
import AddVaccine from '../screens/app/consultation/plan/AddVaccine';
import AddNur from '../screens/app/consultation/plan/AddNur';
import SearchPlans from '../screens/app/consultation/plan/SearchPlans';
import VitalsInput from '../screens/app/consultation/observation/VitalsInput';
import SubjectiveInput from '../screens/app/consultation/observation/SubjectiveInput';
import AddSuppliment from '../screens/app/consultation/plan/AddSuppliment';

// doctot registration screens

import practiceapproval from '../screens/HomeScreen/practiceapproval';
import forums from '../screens/HomeScreen/forums';
import covidmonitor from '../screens/HomeScreen/covidmonitor';
import Example from '../screens/HomeScreen/Example';
import Consult from '../screens/HomeScreen/Consult';
import Settings from '../screens/HomeScreen/Settings';
//import Profile from '../screens/HomeScreen/Profile';
import About from '../screens/HomeScreen/Profile/about';
import Editdetails from '../screens/HomeScreen/Profile/editdetails';
import Profile from '../screens/HomeScreen/Profile/Profile';
import Experience from '../screens/HomeScreen/Profile/experience.js';
import Qualification from '../screens/HomeScreen/Profile/qualification.js';
import Certificates from '../screens/HomeScreen/Profile/certificates.js';
import Awards from '../screens/HomeScreen/Profile/awards.js';
import Publications from '../screens/HomeScreen/Profile/publications.js';
import Research from '../screens/HomeScreen/Profile/research.js';
import Language from '../screens/HomeScreen/Profile/language.js';
import SignatureEdit from '../screens/HomeScreen/Profile/DoctorSign.js';

import ChangePassword from '../screens/HomeScreen/ChangePassword';
import OldPatient from '../screens/HomeScreen/OldPateint';
import OldPatientDetails from '../screens/HomeScreen/OldPatientDetails';
import Report from '../screens/HomeScreen/Report';
import TimelineReports from '../screens/app/patienhistory/timeline/Reports';
import CaptureVitals from '../screens/app/patienhistory/timeline/CaptureVitals';
import Remainder from '../screens/app/patienhistory/timeline/Remainder';
import Covid from '../screens/HomeScreen/Covid';
import Covid2 from '../screens/HomeScreen/Covid2';
import MassMailing from '../screens/HomeScreen/MassMailing';
import Vitals2 from '../screens/HomeScreen/Vitals2';
import ViewPdf from '../screens/HomeScreen/ViewPdf';
import ViewPdf3 from '../screens/HomeScreen/ViewPdf3';
import ViewPdf2 from '../screens/HomeScreen/ViewPdf2';
import Icon from 'react-native-vector-icons/FontAwesome';
import EncounterTimeline from '../screens/HomeScreen/EncounterTimeline';
import EncounterTimelineDetails from '../screens/HomeScreen/EncounterTimelineDetails';
import doctorregister from '../screens/HomeScreen/doctorregister';
// // doctor registration screens
import Basicdetails from '../screens/HomeScreen/DoctorRegistration/BasicDetails';
import ImportServices from '../screens/app/billing/ImportServices';
import Otpscreen from '../screens/HomeScreen/DoctorRegistration/OtpScreen';
import ExperienceScreen from '../screens/HomeScreen/DoctorRegistration/ExperienceScreen';
import QualificationScreen from '../screens/HomeScreen/DoctorRegistration/QualificationScreen';
import SignatureScreen from '../screens/HomeScreen/DoctorRegistration/SignatureScreen';
import PasswordScreen from '../screens/HomeScreen/DoctorRegistration/PasswordScreen';

import doctoredit from '../screens/HomeScreen/doctoredit';
import Telemedicine from '../screens/HomeScreen/Checkup/Telemedicine';
import Person_Profile from '../screens/HomeScreen/check-up/Person_Profile';
import ReminderAlarms from '../screens/HomeScreen/ReminderAlarms';
import QrCodeScanner from '../screens/HomeScreen/QrCodeScanner';
import notificationsList from '../screens/HomeScreen/notificationsList';
import Service from '../screens/HomeScreen/Service';
import Forgot from '../screens/Auth/Forgot';
import ForgotPassword from '../screens/Auth/ForgotPassword/ForgotPassword';
import ForgotPasswordInputs from '../screens/Auth/ForgotPassword/ForgotPasswordInputs';
import PersonAppointment from '../screens/HomeScreen/PersonAppointment';
import Booking from '../screens/HomeScreen/Booking';
import FaqScreen from '../screens/HomeScreen/FaqScreen';
import Contact from '../screens/HomeScreen/Contact';
import QrCode from '../screens/HomeScreen/Profile/QrCode';
import Confirmation from '../screens/HomeScreen/Confirmation';
import ValidateEmailPhone from '../screens/HomeScreen/ValidateEmailPhone';
import BookingInfo from '../screens/HomeScreen/BookingInfo';
import QuestionnaireForm from '../screens/Questionnaire/Form';
import listofdevices from '../screens/HomeScreen/listofdevices';
import CovidMonitoringDashboard from '../screens/HomeScreen/CovidMonitoring/CovidMonitoringDashboard';
import CovidMonitoringPatientList from '../screens/HomeScreen/CovidMonitoring/CovidMonitoringPatientList';
import CovidMonitoringPatientView from '../screens/HomeScreen/CovidMonitoring/CovidMonitoringPatientView';
import CovidMonitoringInitialAssessment from '../screens/HomeScreen/CovidMonitoring/IntialsAssessment/CovidMonitoringInitialAssessment';
import ProfileDrawer from '../screens/HomeScreen/CovidMonitoring/ProfileDrawer/ProfileDrawer';
import HeaderBar from '../screens/HomeScreen/CovidMonitoring/HeaderBar/HeaderBar';
import Patients from '../screens/HomeScreen/Patients/Patients';

import i18n from 'i18next';
import {DEFAULT_WHITE_COLOR, APP_PRIMARY_COLOR} from '../themes/variable';

import Forums from '../screens/HomeScreen/Forums/Forums';
import ForumQuestionReplies from '../screens/HomeScreen/Forums/ForumQuestionReplies';
import CustomHeaderBackButton from '../screens/HomeScreen/Common/CustomHeaderBackButton';

// Images
import NotificationIcon from '../assets/images/notification.png';

import {createDrawerNavigator} from 'react-navigation-drawer';

import CustomDrawer from '../screens/HomeScreen/CustomDrawer/CustomDrawer';
import MyPractice from '../screens/HomeScreen/MyPractice/MyPractice';
import DoctorTimings from '../screens/HomeScreen/MyPractice/DoctorTimings/DoctorTimings';
import PracticeSettings from '../screens/HomeScreen/MyPractice/PracticeSettings/PracticeSettings';
import EditTimings from '../screens/HomeScreen/MyPractice/DoctorEditTimings/EditTimings';
import LeaveOrAbsence from '../screens/HomeScreen/LeaveOrAbsence/LeaveOrAbsence';
import LeaveOrAbsenceHistory from '../screens/HomeScreen/LeaveOrAbsenceHistory/LeaveOrAbsenceHistory';
import BookAppointment from '../screens/app/bookappointment/BookAppointment';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// navigation routes
// navigation routes

// import NavRoutes from "../constants/NavRoutes";
import {wp} from '../themes/Scale';
import Plan from '../screens/app/consultation/plan/Plan';
import i18next from 'i18next';

export const touchableRef = React.createRef();

const AuthStackNavigator = createStackNavigator({
  SignIn: {
    screen: Login,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
      headerBackTitle: '',
    }),
  },
  doctorregister: {
    screen: doctorregister,
    navigationOptions: ({navigation}) => ({
      // title: 'Home Screen',
      // headerStyle: {
      //     backgroundColor: APP_PRIMARY_COLOR
      // },
      // headerTintColor: DEFAULT_WHITE_COLOR,
      // headerTitleStyle: {
      //     color: DEFAULT_WHITE_COLOR,
      //     fontWeight: '400'
      // }
      headerShown: false,
      headerBackTitle: '',
    }),
  },

  Basicdetails: {
    screen: Basicdetails,
    navigationOptions: ({navigation}) => ({
      // title: 'Home Screen',
      // headerStyle: {
      //     backgroundColor: APP_PRIMARY_COLOR
      // },
      // headerTintColor: DEFAULT_WHITE_COLOR,
      // headerTitleStyle: {
      //     color: DEFAULT_WHITE_COLOR,
      //     fontWeight: '400'
      // },
      headerShown: false,
      headerBackTitle: '',
    }),
  },

  Otpscreen: {
    screen: Otpscreen,
    navigationOptions: ({navigation}) => ({
      // title: 'Home Screen',
      // headerStyle: {
      //     backgroundColor: APP_PRIMARY_COLOR
      // },
      // headerTintColor: DEFAULT_WHITE_COLOR,
      // headerTitleStyle: {
      //     color: DEFAULT_WHITE_COLOR,
      //     fontWeight: '400'
      // },
      headerShown: false,
      headerBackTitle: '',
    }),
  },
  ExperienceScreen: {
    screen: ExperienceScreen,
    navigationOptions: ({navigation}) => ({
      // title: 'Home Screen',
      // headerStyle: {
      //     backgroundColor: APP_PRIMARY_COLOR
      // },
      // headerTintColor: DEFAULT_WHITE_COLOR,
      // headerTitleStyle: {
      //     color: DEFAULT_WHITE_COLOR,
      //     fontWeight: '400'
      // },
      headerShown: false,
      headerBackTitle: '',
    }),
  },

  QualificationScreen: {
    screen: QualificationScreen,
    navigationOptions: ({navigation}) => ({
      // title: 'Home Screen',
      // headerStyle: {
      //     backgroundColor: APP_PRIMARY_COLOR
      // },
      // headerTintColor: DEFAULT_WHITE_COLOR,
      // headerTitleStyle: {
      //     color: DEFAULT_WHITE_COLOR,
      //     fontWeight: '400'
      // },
      headerShown: false,
      headerBackTitle: '',
    }),
  },
  SignatureScreen: {
    screen: SignatureScreen,
    navigationOptions: ({navigation}) => ({
      // title: 'Home Screen',
      // headerStyle: {
      //     backgroundColor: APP_PRIMARY_COLOR
      // },
      // headerTintColor: DEFAULT_WHITE_COLOR,
      // headerTitleStyle: {
      //     color: DEFAULT_WHITE_COLOR,
      //     fontWeight: '400'
      // },
      headerShown: false,
      headerBackTitle: '',
    }),
  },
  PasswordScreen: {
    screen: PasswordScreen,
    navigationOptions: ({navigation}) => ({
      // title: 'Home Screen',
      // headerStyle: {
      //     backgroundColor: APP_PRIMARY_COLOR
      // },
      // headerTintColor: DEFAULT_WHITE_COLOR,
      // headerTitleStyle: {
      //     color: DEFAULT_WHITE_COLOR,
      //     fontWeight: '400'
      // },
      headerShown: false,
      headerBackTitle: '',
    }),
  },

  Forgot: {
    screen: ForgotPassword,
    navigationOptions: ({navigation}) => ({
      title: 'Forgot Password',
      headerStyle: {
        backgroundColor: APP_PRIMARY_COLOR,
      },
      headerTintColor: DEFAULT_WHITE_COLOR,
      headerTitleStyle: {
        color: DEFAULT_WHITE_COLOR,
        fontWeight: '400',
      },
      headerBackTitle: '',
    }),
  },

  ForgotPasswordInputs: {
    screen: ForgotPasswordInputs,
    navigationOptions: ({navigation}) => ({
      title: 'Forgot Password',
      headerStyle: {
        backgroundColor: APP_PRIMARY_COLOR,
      },
      headerTintColor: DEFAULT_WHITE_COLOR,
      headerTitleStyle: {
        color: DEFAULT_WHITE_COLOR,
        fontWeight: '400',
      },
      headerBackTitle: '',
    }),
  },
});

const AppStackNavigator = createStackNavigator(
  {
    LandingPage: {
      screen: LandingPage,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
        headerBackTitle: '',
      }),
    },
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: ({navigation}) => ({headerShown: false}),
    },
    PatientCard: {
      screen: PatientCard,
      navigationOptions: ({navigation}) => ({headerShown: false}),
    },
    Consultation: {
      screen: Consultation,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    Plan: {
      screen: Plan,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddMedicine: {
      screen: AddMedicine,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddLab: {
      screen: AddLab,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddImg: {
      screen: AddImg,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddVaccine: {
      screen: AddVaccine,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddSuppliment: {
      screen: AddSuppliment,
      navigationOptions: {
        headerShown: false,
      },
    },
    AddNur: {
      screen: AddNur,
      navigationOptions: {
        headerShown: false,
      },
    },
    SearchPlans: {
      screen: SearchPlans,
      navigationOptions: {
        headerShown: false,
      },
    },
    VitalsInput: {
      screen: VitalsInput,
      navigationOptions: {
        headerShown: false,
      },
    },
    SubjectiveInput: {
      screen: SubjectiveInput,
      navigationOptions: {
        headerShown: false,
      },
    },
    PatientHistory: {
      screen: PatientHistoryTabs,
      navigationOptions: {
        headerShown: false,
      },
    },
    ViewPdfScreen: {
      screen: ViewPdfScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ViewPdfFooter: {
      screen: ViewPdfFooter,
      navigationOptions: {
        headerShown: false,
      },
    },
    ViewReceipts: {
      screen: ViewReceipts,
      navigationOptions: {
        headerShown: false,
      },
    },
    TimelineReports: {
      screen: TimelineReports,
      navigationOptions: {
        headerShown: false,
      },
    },
    CaptureVitals: {
      screen: CaptureVitals,
      navigationOptions: {
        headerShown: false,
      },
    },
    Remainder: {
      screen: Remainder,
      navigationOptions: {
        headerShown: false,
      },
    },
    PayBill: {
      screen: PayBill,
      navigationOptions: {
        headerShown: false,
      },
    },
    Billing: {
      screen: Billing,
      navigationOptions: {
        headerShown: false,
      },
    },
    ImportServices: {
      screen: ImportServices,
      navigationOptions: {
        headerShown: false,
      },
    },
    PaymentDetails: {
      screen: PaymentDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    Template: {
      screen: AumTemplate,
      navigationOptions: {
        headerShown: false,
      },
    },
    BookAppointment: {
      screen: BookAppointment,
      navigationOptions: {
        headerShown: false,
      },
    },
    doctoredit: {
      screen: doctoredit,
      navigationOptions: ({navigation}) => ({
        title: 'Edit Profile',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    practiceapproval: {
      screen: practiceapproval,
      navigationOptions: ({navigation}) => ({
        title: 'Practice Approval',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    forums: {
      screen: forums,
      navigationOptions: ({navigation}) => ({
        title: 'Forums',
        headerStyle: {
          fontWeight: '400',
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
      }),
    },
    questionnaireform: {
      screen: QuestionnaireForm,
      navigationOptions: ({navigation}) => ({
        title: 'Questionnaire',
        headerStyle: {
          fontWeight: '400',
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
      }),
    },
    covidmonitor: {
      screen: covidmonitor,
      navigationOptions: ({navigation}) => ({
        title: 'Covid Monitor',
        headerStyle: {
          fontWeight: '400',
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
      }),
    },
    PersonAppointment: {
      screen: PersonAppointment,
      navigationOptions: ({navigation}) => ({
        title: 'Person Registration',
        headerStyle: {
          fontWeight: '400',
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
      }),
    },
    listofdevices: {
      screen: listofdevices,
      navigationOptions: ({navigation}) => ({
        title: 'Devices',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
      }),
    },
    Booking: {
      screen: Booking,
      navigationOptions: ({navigation}) => ({
        title: 'Booking',
        headerStyle: {
          fontWeight: '400',
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
      }),
    },
    Confirmation: {
      screen: Confirmation,
      navigationOptions: ({navigation}) => ({
        title: 'Book Appointment',
        headerStyle: {
          fontWeight: '400',
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
      }),
    },
    Example: {
      screen: Example,
      navigationOptions: ({navigation}) => ({
        title: 'Example',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Consult: {
      screen: Consult,
      navigationOptions: ({navigation}) => ({
        title: 'Consult',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Telemedicine: {
      screen: Telemedicine,
      navigationOptions: ({navigation}) => ({
        title: 'Telemedicine',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    // Tabs:{
    //     screen:Tabs,
    //     navigationOptions: ({navigation}) => ({
    //         header:null,
    //         title: '',
    //         headerStyle: {
    //             backgroundColor: APP_PRIMARY_COLOR
    //         },
    //         headerTintColor: DEFAULT_WHITE_COLOR,
    //         headerTitleStyle: {
    //             color: DEFAULT_WHITE_COLOR,
    //             fontWeight: '400'
    //         }
    //     })
    // },
    Person_Profile: {
      screen: Person_Profile,
      navigationOptions: ({navigation}) => ({
        title: 'Person Profile',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    About: {
      screen: About,
      navigationOptions: {
        headerShown: false,
      },
    },
    Editdetails: {
      screen: Editdetails,
      navigationOptions: {
        headerShown: false,
      },
    },
    Experience: {
      screen: Experience,
      navigationOptions: {
        headerShown: false,
      },
    },
    Qualification: {
      screen: Qualification,
      navigationOptions: {
        headerShown: false,
      },
    },
    Certificates: {
      screen: Certificates,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignatureEdit: {
      screen: SignatureEdit,
      navigationOptions: {
        headerShown: false,
      },
    },
    Awards: {
      screen: Awards,
      navigationOptions: {
        headerShown: false,
      },
    },
    Publications: {
      screen: Publications,
      navigationOptions: {
        headerShown: false,
      },
    },
    Research: {
      screen: Research,
      navigationOptions: {
        headerShown: false,
      },
    },
    Language: {
      screen: Language,
      navigationOptions: {
        headerShown: false,
      },
    },
    Vitals2: {
      screen: Vitals2,
      navigationOptions: ({navigation}) => ({
        title: ' Vitals History',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    ReminderAlarms: {
      screen: ReminderAlarms,
      navigationOptions: ({navigation}) => ({
        title: ' Medicine Monitoring',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Covid: {
      screen: Covid,
      navigationOptions: ({navigation}) => ({
        title: 'Covid Monitoring',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    MassMailing: {
      screen: MassMailing,
      navigationOptions: ({navigation}) => ({
        title: 'Mass Mailing',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Covid2: {
      screen: Covid2,
      navigationOptions: ({navigation}) => ({
        title: 'Initial Assesment',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Service: {
      screen: Service,
      navigationOptions: ({navigation}) => ({
        title: 'Service Registration',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({navigation}) => ({
        title: 'Settings',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    EncounterTimelineDetails: {
      screen: EncounterTimelineDetails,
      navigationOptions: ({navigation}) => ({
        title: 'Encounter Timeline',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    FaqScreen: {
      screen: FaqScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Help',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Contact: {
      screen: Contact,
      navigationOptions: ({navigation}) => ({
        title: 'Contact',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    QrCode: {
      screen: QrCode,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COMMON.QRCODE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    ValidateEmailPhone: {
      screen: ValidateEmailPhone,
      navigationOptions: ({navigation}) => ({
        title: 'ValidateEmailPhone',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    BookingInfo: {
      screen: BookingInfo,
      navigationOptions: ({navigation}) => ({
        title: 'BookingInfo',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        headerShown: false,
      },
      headerBackTitle: '',
      // navigationOptions: ({navigation}) => ({
      //     title: 'Profile',
      //     headerStyle: {
      //         backgroundColor: APP_PRIMARY_COLOR
      //     },
      //     headerTintColor: DEFAULT_WHITE_COLOR,
      //     headerTitleStyle: {
      //         color: DEFAULT_WHITE_COLOR,
      //         fontWeight: '400'
      //     }
      // })
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COMMON.CHANGE_PASSWORD'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    DeleteAccount: {
      screen: DeleteAccount,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('DELETE.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    OldPatient: {
      screen: Patients,
      // screen: OldPatient,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('PATIENTS.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    PatientsDetails: {
      screen: PatientsDetails,
      navigationOptions: ({navigation}) => ({headerShown: false}),
    },
    ListOfPatients: {
      screen: ListOfPatients,
      navigationOptions: ({navigation}) => ({headerShown: false}),
      // screen: OldPatient,
      // navigationOptions: ({navigation}) => ({
      //   title: i18n.t('PATIENTS.TITLE'),
      //   // headerStyle: {
      //   //   backgroundColor: APP_PRIMARY_COLOR,
      //   // },
      //   // headerTintColor: DEFAULT_WHITE_COLOR,
      //   // headerTitleStyle: {
      //   //   color: DEFAULT_WHITE_COLOR,
      //   //   fontWeight: '400',
      //   // },
      //   // headerBackTitle: '',
      // }),
    },

    OldPatientDetails: {
      screen: OldPatientDetails,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COMMON.PATIENTS_DETAILS'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    Report: {
      screen: Report,
      navigationOptions: ({navigation}) => ({
        title: 'Report',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    notificationsList: {
      screen: notificationsList,
      navigationOptions: ({navigation}) => ({
        title: 'Notifications',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    QrCodeScanner: {
      screen: QrCodeScanner,
      navigationOptions: ({navigation}) => ({
        title: 'Notifications',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    ViewPdf: {
      screen: ViewPdf,
      navigationOptions: ({navigation}) => ({
        title: navigation.state.params.title,
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    ViewPdf3: {
      screen: ViewPdf3,
      navigationOptions: ({navigation}) => ({
        title: '',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    ViewPdf2: {
      screen: ViewPdf2,
      navigationOptions: ({navigation}) => ({
        title: '',
        headerLeft: () => {
          return (
            <Icon
              testID="arrowLeftIcon"
              accessibilityLabel="arrowLeftIcon"
              onPress={() => {
                navigation.pop(2);
              }}
              type="FontAwesome"
              name="arrow-left"
              style={{fontSize: 20, margin: 10}}
            />
          );
        },
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    CovidMonitoringDashboard: {
      screen: CovidMonitoringDashboard,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COVID_MONITORING.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
        headerShown: true,
        headerRight: () => {
          const redirectToNotifications = navigation.getParam(
            'redirectToNotifications',
            () => {},
          );
          return (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => redirectToNotifications()}
                testID="notificationTouch"
                accessibilityLabel="notificationTouch">
                <Image
                  testID="notificationIcon"
                  accessibilityLabel="notificationIcon"
                  source={NotificationIcon}
                  style={styles.notificationIcon}></Image>
              </TouchableOpacity>
            </View>
          );
        },
      }),
    },
    CovidMonitoringPatientList: {
      screen: CovidMonitoringPatientList,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COVID_MONITORING.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
        headerShown: true,
        headerRight: () => {
          const redirectToNotifications = navigation.getParam(
            'redirectToNotifications',
            () => {},
          );
          return (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => redirectToNotifications()}
                testID="notificationTouch"
                accessibilityLabel="notificationTouch">
                <Image
                  testID="notificationImage"
                  accessibilityLabel="notificationImage"
                  source={NotificationIcon}
                  style={styles.notificationIcon}></Image>
              </TouchableOpacity>
            </View>
          );
        },
      }),
    },
    CovidMonitoringPatientView: {
      screen: CovidMonitoringPatientView,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COVID_MONITORING.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
        headerShown: true,
        headerLeft: () => (
          <HeaderBackButton
            testID="backButton"
            accessibilityLabel="backButton"
            tintColor={DEFAULT_WHITE_COLOR}
            onPress={navigation.getParam('handleBackPress', () => {})}
          />
        ),
        headerRight: () => {
          const togglePopover = navigation.getParam('togglePopover', () => {});
          const toggleUploadFileModal = navigation.getParam(
            'toggleUploadFileModal',
            () => {},
          );
          const toggleCallModal = navigation.getParam(
            'toggleCallModal',
            () => {},
          );
          return (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => toggleCallModal()}
                testID="phoneIconTouch"
                accessibilityLabel="phoneIconTouch">
                <MaterialIcon
                  name="phone"
                  style={styles.materialIcons}
                  testID="phoneIcon"
                  accessibilityLabel="phoneIcon"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleUploadFileModal()}
                testID="attachmentIconTouch"
                accessibilityLabel="attachmentIconTouch">
                <MaterialIcon
                  name="attachment"
                  style={styles.materialIcons}
                  testID="attachmentIcon"
                  accessibilityLabel="attachmentIcon"
                />
              </TouchableOpacity>
              <TouchableOpacity
                testID="dotsIconTouch"
                accessibilityLabel="dotsIconTouch"
                ref={touchableRef}
                onPress={() => togglePopover(touchableRef)}>
                <MaterialIcon
                  testID="dotsIcon"
                  accessibilityLabel="dotsIcon"
                  name="dots-vertical"
                  style={styles.materialIcons}
                />
              </TouchableOpacity>
            </View>
          );
        },
      }),
    },
    CovidMonitoringInitialAssessment: {
      screen: CovidMonitoringInitialAssessment,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COVID_MONITORING.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerBackTitle: '',
        headerShown: true,
      }),
    },
    ProfileDrawer: {
      screen: ProfileDrawer,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COVID_MONITORING.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        headerShown: false,
        headerBackTitle: '',
      }),
    },
    HeaderBar: {
      screen: HeaderBar,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('COVID_MONITORING.TITLE'),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
        },
        // headerShown: false,
        headerBackTitle: '',
        headerLeft: () => (
          <HeaderBackButton
            tintColor={DEFAULT_WHITE_COLOR}
            onPress={navigation.getParam('handleBackPress', () => {})}
            testID="backButton"
            accessibilityLabel="backButton"
          />
        ),
      }),
    },
    Forums: {
      screen: Forums,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('FORUMS.TITLE'),
        headerLeft: (
          <CustomHeaderBackButton
            onPress={() => navigation.goBack()}
            testID="backButton"
            accessibilityLabel="backButton"
          />
        ),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
      }),
    },
    ForumQuestionReplies: {
      screen: ForumQuestionReplies,
      navigationOptions: ({navigation}) => ({
        title: i18n.t('FORUMS.TITLE'),
        headerLeft: (
          <CustomHeaderBackButton onPress={() => navigation.goBack()} />
        ),
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
      }),
    },
    MyPractice: {
      screen: MyPractice,
      navigationOptions: ({navigation}) => ({
        title: 'My Practice',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
        headerRight: () => {
          const redirectToNotifications = navigation.getParam(
            'redirectToNotifications',
            () => {},
          );
          return (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => redirectToNotifications()}
                testID="notificationTouch"
                accessibilityLabel="notificationTouch">
                <Image
                  testID="notificationImage"
                  accessibilityLabel="notificationImage"
                  source={NotificationIcon}
                  style={[styles.notificationIcon, styles.marginRight]}
                />
              </TouchableOpacity>
              <Image
                source={global.profile_image}
                style={styles.profileIcon}
                testID="profileImage"
                accessibilityLabel="profileImage"
              />
            </View>
          );
        },
      }),
    },
    DoctorTimings: {
      screen: DoctorTimings,
      navigationOptions: ({navigation}) => ({
        title: 'Edit Timings',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    PracticeSettings: {
      screen: PracticeSettings,
      navigationOptions: ({navigation}) => ({
        title: 'Practice Settings',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    EditTimings: {
      screen: EditTimings,
      navigationOptions: ({navigation}) => ({
        title: navigation.state.params.title,
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
          fontSize: 16,
        },
        headerBackTitle: '',
      }),
    },
    LeaveOrAbsence: {
      screen: LeaveOrAbsence,
      navigationOptions: ({navigation}) => ({
        title: 'Leave / Absence',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
    LeaveOrAbsenceHistory: {
      screen: LeaveOrAbsenceHistory,
      navigationOptions: ({navigation}) => ({
        title: 'Leave / Absence History',
        headerStyle: {
          backgroundColor: APP_PRIMARY_COLOR,
        },
        headerTintColor: DEFAULT_WHITE_COLOR,
        headerTitleStyle: {
          color: DEFAULT_WHITE_COLOR,
          fontWeight: '400',
        },
        headerBackTitle: '',
      }),
    },
  },
  // {
  //   // headerMode: "none",
  //   defaultNavigationOptions: {
  //     ...TransitionPresets.SlideFromRightIOS
  //   }
  // },
  {
    initialRouteName: 'LandingPage',
    drawerPosition: 'right',
    contentComponent: CustomDrawer,
    contentOptions: {
      activeBackgroundColor: DEFAULT_WHITE_COLOR,
      activeTintColor: DEFAULT_WHITE_COLOR,
    },
  },
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    LandingPage: {
      screen: AppStackNavigator,
      navigationOptions: {
        drawerLabel: ' ',
      },
    },
    SignIn: {
      screen: Login,
      navigationOptions: {
        drawerLabel: ' ',
      },
    },
    Auth: {
      screen: AuthLoadingScreen,
      navigationOptions: {
        drawerLabel: ' ',
      },
    },
  },
  {
    initialRouteName: 'LandingPage',
    drawerPosition: 'right',
    contentComponent: CustomDrawer,
    contentOptions: {
      activeBackgroundColor: DEFAULT_WHITE_COLOR,
      activeTintColor: DEFAULT_WHITE_COLOR,
    },
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStackNavigator,
      App: AppDrawerNavigator, // AppDrawerNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialIcons: {
    marginLeft: 5,
    fontSize: 28,
    color: DEFAULT_WHITE_COLOR,
  },
  notificationIcon: {
    height: 18,
    width: 18,
    marginRight: 10,
  },
  profileIcon: {
    height: wp(40),
    width: wp(40),
    borderRadius: 50,
  },
  marginRight: {
    marginRight: wp(20),
  },
});
