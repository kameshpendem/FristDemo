import React, {useState, useEffect, createRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import {Icon, Right} from 'native-base';
import {
  APP_PRIMARY_COLOR,
  DEFAULT_SHADOW_COLOR,
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  COLOR_CODES,
} from '../../../themes/variable';
import back_arrow from '../../../assets/images/back_arrow.png';
import close from '../../../assets/images/close.png';
import {wp, hp} from '../../../themes/Scale';
import search_icon from '../../../assets/images/search_patients.png';
import {withTranslation} from 'react-i18next';
//import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage';
import ActionSheet from 'react-native-actions-sheet';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import History from '../../../assets/images/history.png';
import {getApiUrl} from '../../../config/Config';
// import DropDownPicker from 'react-native-dropdown-picker';
import {getColor} from '../../../themes/Theme';
import Modal from 'react-native-modal';
import redial_call from '../../../assets/images/redial_black.png';
import {TwilioConnection} from '../../../redux/actions/TwilioActions';
import {connect} from 'react-redux';
import i18n from '../../../../i18n';
import QrCodeScanner from '../../HomeScreen/QrCodeScanner';
import HomeScreen from '../homescreen/HomeScreen';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

function Header({
  changeBranch,
  getAllAppointments,
  setalone,
  setTextSearch,
  checkAuthorization,
  searchAppointment,
  qr_code_hlp_id,
  ...props
}) {
  const {convert_template_id}=props.navigation.state.params ? props.navigation.state.params : ''
  const [text, setText] = useState();
  const [search, setsearch] = useState(false);
  const [branchId, setbranchId] = useState();
  const [patientList, setpatientList] = useState({});
  const [modal, setmodal] = useState(false);
  // const [appointmentType, setAppointmentType] = useState("");
  const [disable, setdisable] = useState(false);
  const {t} = props;
  const searchBarHandle = () => {
    setsearch(!search);
    setTextSearch('');
    onChangetext('');
  };

  // getAllAppointments();
  //   changeBranch();

  const getBranchId = async () => {
    let Id = await AsyncStorage.getItem('branch_id');
    setbranchId(Id);
  };

  const telemedicinevideocall = async () => {
    await AsyncStorage.setItem('consult', 'false');
    await AsyncStorage.setItem('fromPage', 'consult');
    props.TwilioConnection(true);
  };

  const setBranchId = async val => {
    // setbranchId( val );
    setalone(val.type);
    await checkAuthorization({branch_id: val.branch_id});
    global.standalone = val.type;
    await AsyncStorage.setItem('alone', val.type);
    await AsyncStorage.setItem('branch_id', val.branch_id);
    await AsyncStorage.setItem('practice_id', val.practice_id);
    changeBranch();
    getBranchId();
    setmodal(false);
  };

  const onChangetext = val => {
    // setTextSearch(val);
    if (!val.trim()) {
      getAllAppointments();
    } else {
      searchAppointment(val);
    }
  };
  const navigateBack = async () => {
    {
      global.twilioconnected && props.title == 'Prescription Generated'
        ? Alert.alert(
            t('HEALPHACALL.DISCONNECT_CALL_WITH'),
            global.twiliopatienname,
            [
              {
                text: 'OK',
                onPress: () => {
                  /*console.log("disconnect")*/
                },
              },
            ],
          )
        : global.twilioconnected && props.title != 'Preview Prescription'
        ? Alert.alert(
            t('HEALPHACALL.DISCONNECT_CALL_WITH'),
            global.twiliopatienname,
            [
              {
                text: 'OK',
                onPress: () => {
                  /*console.log("disconnect")*/
                },
              },
            ],
          )
        : backHandlerExit();
    }
  };
  const backHandlerExit = async () => {
    global.nrmlCall = false;
    await AsyncStorage.setItem('nrml_whatsapp_call', 'false');
    if (qr_code_hlp_id) {
      props.navigation.navigate('QrCodeScanner');
    } else {
      if(convert_template_id == true){
        props.navigation.navigate('HomeScreen',{
          qr_code_hlp_id:'' 
        });
      }
      else{
      props.navigation.goBack(null);
      }
    }
    return true;
  };
  useEffect(() => {
    getBranchId();

    if (props.disable) {
      setdisable(true);
    } else {
      setdisable(false);
    }
  }, []);

  return search ? (
    <View style={[styles.header]}>
      {Platform.OS == 'ios' ? (
        <MyStatusBar
          backgroundColor={APP_PRIMARY_COLOR}
          barStyle="light-content"
        />
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: APP_PRIMARY_COLOR,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.straight}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => navigateBack()}>
              <Image source={back_arrow} style={styles.back_button} />
            </TouchableOpacity>
          </View>

          <View>
            <TextInput
              placeholderTextColor={DEFAULT_WHITE_COLOR}
              placeholder={`${t('DASHBOARD.SEARCHBY')}`}
              clearButtonMode="always"
              // clearTextOnFocus={(val) => onChangetext(val)}
              clearTextOnFocus={true}
              style={Platform.OS == 'android' ? styles.input : styles.input1}
              onChangeText={val => onChangetext(val)}
              value={text}
              autoFocus={search ? search : false}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              searchBarHandle();
            }}>
            <Image
              source={close}
              style={{
                width: 14,
                height: 14,
                tintColor: DEFAULT_WHITE_COLOR,
                margin: 25,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : (
    <View
      style={[
        styles.header,
        props.listOfHospitals ? null : {paddingTop: hp(0)},
      ]}>
      {Platform.OS == 'ios' ? (
        <MyStatusBar
          backgroundColor={APP_PRIMARY_COLOR}
          barStyle="light-content"
        />
      ) : null}
      <View style={styles.view}>
        <View style={styles.straight}>
          <TouchableOpacity onPress={() => navigateBack()}>
            <Image source={back_arrow} style={styles.back_button} />
          </TouchableOpacity>
          {props.avator ? (
            <Avatar
              source={{
                uri: `${getApiUrl() + '/' + props.url}`,
              }}
              size="small"
              rounded
              title={props.avatartitle}
              // containerStyle={{marginLeft: 10}}
              onPress={() => console.log('Works!')}
              activeOpacity={0.7}
            />
          ) : null}
          <View style={styles.title}>
            <View>
              <View style={{flexDirection: 'row', width: '60%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: DEFAULT_WHITE_COLOR,
                    fontSize: 20,
                    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                    textTransform: 'capitalize',
                  }}>
                  {props.title}
                </Text>
                <View
                  style={{
                    marginLeft: 10,
                    borderRadius: 20,
                    alignSelf: 'center',
                    // marginTop: 5,
                    backgroundColor: getColor(props.appointmentType),
                  }}>
                  <Text
                    style={{
                      padding: 3,
                      textAlign: 'center',
                      //paddingVertical: 0,
                      fontSize: 12,
                    }}>
                    {props.appointmentType}
                  </Text>
                  {/* <Text>{props.appointmentType}</Text> */}
                </View>
              </View>

              {props.hospitallist ? (
                <TouchableOpacity
                  style={styles.listOfHospitals}
                  onPress={() => {
                    setmodal(true);
                  }}>
                  {props.listOfHospitals
                    ? props.listOfHospitals.map((i, index) => {
                        if (i.branch_id == branchId) {
                          return (
                            <View style={styles.row} key={index}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                  color: DEFAULT_WHITE_COLOR,
                                  width: 100,
                                }}>
                                {i.BRANCH_NAME}
                              </Text>
                              <Icon
                                name="chevron-down"
                                type="Ionicons"
                                style={styles.icon}
                              />
                            </View>
                          );
                        }
                      })
                    : null}
                </TouchableOpacity>
              ) : null}
              {props.subtext ? (
                <Text
                  style={{
                    color: DEFAULT_WHITE_COLOR,
                    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
                  }}>
                  {props.subHeader}
                </Text>
              ) : null}
            </View>
          </View>

          <Right>
            <View style={styles.row}>
              {props.redialhealphacall ? (
                <TouchableOpacity onPress={() => telemedicinevideocall()}>
                  <Image
                    source={redial_call}
                    style={{
                      tintColor: DEFAULT_WHITE_COLOR,
                      width: 25,
                      height: 25,
                      margin: 5,
                    }}
                  />
                </TouchableOpacity>
              ) : null}
              {props.observation ? (
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('PatientHistory');
                  }}>
                  <Image
                    source={History}
                    style={{
                      tintColor: DEFAULT_WHITE_COLOR,
                      margin: 5,
                    }}
                  />
                </TouchableOpacity>
              ) : null}

              {/* <Avatar
                  source={Doctor}
                  size="small"
                  icon={{name: 'user', type: 'font-awesome'}}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={{marginLeft: 10}}
                /> */}
            </View>
          </Right>

          {props.billing ? (
            <Right>
              <View style={styles.row}>
                <TouchableOpacity
                  disabled={disable}
                  onPress={() => {
                    props.navigation.navigate('ViewReceipts');
                  }}>
                  <Image
                    source={History}
                    style={{tintColor: DEFAULT_WHITE_COLOR, margin: 5}}
                  />
                </TouchableOpacity>

                {/* <Avatar
                  source={Doctor}
                  size="small"
                  icon={{name: 'user', type: 'font-awesome'}}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={{marginLeft: 10}}
                /> */}
              </View>
            </Right>
          ) : null}
          {props.listOfHospitals ? (
            <View style={{justifyContent: 'flex-end', left: 20}}>
              <TouchableOpacity
                onPress={() => {
                  searchBarHandle();
                }}>
                <Image source={search_icon} style={styles.search_icon} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>

      <Modal
        isVisible={modal}
        backdropOpacity={0.3}
        onBackButtonPress={() => setmodal(false)}
        onBackdropPress={() => setmodal(false)}
        style={{margin: 0, padding: 0, flex: 1}}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: DEFAULT_WHITE_COLOR,
            borderRadius: 15,
            paddingBottom: hp(20),
          }}>
          <View style={styles.actionpad}>
            <View style={styles.practice}>
              <Text style={styles.select}>
                {i18n.t('COMMON.SELECT_PRACTICE')}
              </Text>
              <TouchableOpacity onPress={() => setmodal(false)}>
                <Icon type="Ionicons" name="close" style={{fontSize: 22}} />
              </TouchableOpacity>
            </View>

            <View>
              {props.listOfHospitals
                ? props.listOfHospitals.map((i, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setBranchId({
                            branch_id: i.branch_id,
                            practice_id: i.practice_id,
                            type: i.is_standalone,
                          });
                        }}>
                        <View
                          style={[
                            {
                              flexDirection: 'row',
                              flex: 1,
                              justifyContent: 'space-between',
                              marginTop: 15,
                              padding: 10,
                              borderRadius: 5,
                            },
                            i.branch_id == branchId
                              ? {
                                  backgroundColor: DEFAULT_SHADOW_COLOR,
                                }
                              : null,
                          ]}>
                          <Text key={index} style={{color: COLOR_CODES.BLACK}}>
                            {i.BRANCH_NAME}
                          </Text>
                          {i.branch_id == branchId ? (
                            <Icon
                              name="check"
                              type="Feather"
                              style={{fontSize: 18}}
                            />
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    TwilioConnection: data => dispatch(TwilioConnection(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Header));

const styles = StyleSheet.create({
  header: {
    backgroundColor: APP_PRIMARY_COLOR,
    height: Platform.OS === 'ios' ? hp(100) : hp(70),
  },
  input: {
    marginLeft: 15,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    color: DEFAULT_WHITE_COLOR,
    marginTop: Platform.OS === 'ios' ? 18 : 8,
    textTransform: 'capitalize',
  },
  input1: {
    marginLeft: 15,
    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
    color: DEFAULT_WHITE_COLOR,
    marginTop: Platform.OS === 'ios' ? 18 : 8,
    textTransform: 'capitalize',
    width: wp(300),
  },
  row: {flexDirection: 'row'},
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  listOfHospitals: {
    flexDirection: 'row',
    // marginTop: hp(2),
    height: hp(25),
    width: wp(100),
    // marginLeft: 10,
  },

  actionpad: {paddingVertical: 20, height: '50%'},
  select: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    fontSize: 16,
    textTransform: 'capitalize',
    color: COLOR_CODES.BLACK,
  },
  practice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  icon: {
    fontSize: 18,
    paddingLeft: 5,
    color: DEFAULT_WHITE_COLOR,
  },
  straight: {flexDirection: 'row', alignItems: 'center'},
  title: {
    width: '80%',
    color: 'white',
    paddingLeft: wp(10),
    alignSelf: 'center',
  },
  back_button: {
    tintColor: DEFAULT_WHITE_COLOR,
    position: 'relative',
    left: 12,
    height: hp(25),
    width: wp(25),
    marginRight: 10,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  search_icon: {
    height: hp(25),
    width: wp(25),
    tintColor: DEFAULT_WHITE_COLOR,
    marginTop: hp(2),
    alignSelf: 'center',
  },
});
