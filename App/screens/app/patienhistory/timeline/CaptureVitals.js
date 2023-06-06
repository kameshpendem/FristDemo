import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Left,
  Right,
  Body,
  Title,
  Icon,
  Header,
  Card,
  Col,
  Row,
} from 'native-base';
import {
  DEFAULT_WHITE_COLOR,
  FONT_FAMILY,
  APP_PRIMARY_COLOR,
  DEFAULT_GREEN_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREEN_COLOR,
  DEFAULT_SHADOW_COLOR,
} from '../../../../themes/variable';
import {wp, hp} from '../../../../themes/Scale';
// import Header from "../../common/Header";
import Loader from '../../common/Loader';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import calender from '../../../../assets/images/cal.png';
import {
  getTimeline,
  getCaptureVitals,
} from '../../../../redux/actions/timeline_action';
import {getColor} from '../../../../themes/Theme';
import {getVitalsAddButton} from './Utils';
import back_arrow from '../../../../assets/images/back_arrow.png';
import {fetchVitalLabelssuccess} from '../../../../redux/actions/observation_action';
import moment from 'moment';
import {setCategory} from 'react-native-sound';
import Hospital from '../../../../assets/images/hsptl.png';
import Name from '../../../../assets/images/Patient.png';
import {Platform} from 'react-native';

const CaptureVitals = ({
  navigation,
  patientList,
  vitallabels,
  route,
  t,
  fetchVitalLabelssuccess,
}) => {
  const [capturedata, setCaptureData] = useState('');
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(true);
  const [currentdate, setCurrentDate] = useState('');
  const [currenttime, setCurrentTime] = useState('');
  const [categoriesvalues, setCategoryValues] = useState([]);
  const id = navigation.getParam('id') || '';
  const filterData =
    data.find(i => i.op_details.id === navigation.state.params.Id) || {};

  const dataFil = data.find(i => i.op_details.id === id);

  useEffect(() => {
    const navFocusListener = navigation.addListener('didFocus', () => {
      init();
    });
    return () => {
      navFocusListener.remove();
    };
  }, []);

  const getVitalLabels = async () => {
    const variables = {
      enc_id: navigation.state.params.enc_id,
      doc_id: navigation.state.params.doc_id,
      healpha_id: navigation.state.params.person_details?.hlp_id
        ? navigation.state.params.person_details?.hlp_id
        : navigation.state.params.healpha_id,
      template_id: navigation.state.params.template_id,
      data: 'all',
    };

    await getCaptureVitals(variables).then(res => {
      let categoriesvalues1 = [];
      setCaptureData(res);
      res['categories'].map((item3, i1) => {
        if (item3?.data === undefined) {
          categoriesvalues1.push(item3?.value);
        } else {
          item3.data.map((item4, i1) => {
            categoriesvalues1.push(item4?.value);
          });
        }
      });
      setCategoryValues(categoriesvalues1);
      setloading(false);
    });
  };

  const init = () => {
    const templateId = navigation.state.params.template_id;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setCurrentDate(
      date + '/' + month + '/' + year,
      // + ' ' + hours + ':' + min + ':' + sec
    );
    setCurrentTime(hours + ':' + min + ':' + sec);
    // const vitallabels1 = global.vitalspage ? global.vitalspageres : vitallabels;
    // if (vitallabels1) {
    //   let categoriesvalues1 = [];
    //   setCaptureData(vitallabels);
    //   vitallabels["categories"].map((item3, i1) => {
    //     if (item3?.data === undefined) {
    //       categoriesvalues1.push(item3?.value);
    //     } else {
    //       item3.data.map((item4, i1) => {
    //         categoriesvalues1.push(item4?.value);
    //       });
    //     }
    //   });
    //   setCategoryValues(categoriesvalues1);
    //   setloading(false);
    // }
    getVitalLabels();
    const getData = async () => {
      setloading(true);
      const variables = {
        healpha_id: navigation.state.params.person_details?.hlp_id
          ? navigation.state.params.person_details?.hlp_id
          : patientList?.appointment?.healpha_id,
      };
      let data = await getTimeline(variables);
      setData(data.appointment_details);
      setloading(false);
    };
    getData();
  };
  if (!capturedata && loading) {
    return <Loader />;
  }
  return (
    <ScrollView style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
      <View style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
        {/* <Header title="Vitals" navigation={navigation} /> */}
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Left>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              testID="backArrowTouch"
              accessibilityLabel="backArrowTouch">
              {/* <Icon name="md-arrow-back" style={{ color: '#FFF' }} /> */}
              <Image
                source={back_arrow}
                style={styles.back_button}
                testID="backArrowImage"
                accessibilityLabel="backArrowImage"
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title
              style={{color: '#FFF', fontSize: 17}}
              testID="vitalsText"
              accessibilityLabel="vitalsText">
              Vitals
            </Title>
          </Body>
          <Right>
            {/* <View>{this.renderButton()}</View> */}
            {
              // navigation.state.params.enc_status == 'undergoing' ||
              // navigation.state.params.enc_status == 'completed' ||
              // navigation.state.params.enc_status == 'Completed' ||
              getVitalsAddButton(navigation.state.params.enc_status) ||
              navigation.state.params?.is_editable == '1' ? (
                <TouchableOpacity
                  style={{backgroundColor: 'white'}}
                  onPress={() =>
                    navigation.navigate('VitalsInput', {
                      from: 'my_records',
                      appointment: {
                        encounter_id: navigation.state.params.enc_id,
                        doc_id: navigation.state.params.doc_id,
                        // token: this.props.myprops.token,
                        templateId: navigation.state.params.template_id,

                        healpha_id: navigation.state.params.healpha_id,
                        Id: navigation.state.params.Id,
                      },
                    })
                  }
                  testID="addTouch"
                  accessibilityLabel="addTouch">
                  <Text
                    allowFontScaling={false}
                    style={{
                      color: APP_PRIMARY_COLOR,
                      fontSize: 12,
                      margin: 5,
                    }}
                    testID="addText"
                    accessibilityLabel="addText">
                    {t('PATIENTS.ADD')}
                  </Text>
                </TouchableOpacity>
              ) : null
            }
          </Right>
        </Header>
        <View style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
          <ScrollView>
            <View style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
              <View style={{backgroundColor: DEFAULT_WHITE_COLOR}}>
                <Card style={styles.card} borderRadius={10}>
                  {/* {data.filter()((i, idx) => {
                return ( */}
                  <View
                    style={{
                      marginVertical: 10,
                      backgroundColor: DEFAULT_WHITE_COLOR,
                    }}>
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
                          testID={
                            filterData.appointment?.doctor_details?.full_name +
                            'text'
                          }
                          accessibilityLabel={
                            filterData.appointment?.doctor_details?.full_name +
                            'text'
                          }
                          style={{fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD}}>
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
                        {/* {filterData.specialization.replace(
                      /^./,
                      filterData.specialization[0].toUpperCase()
                    )} */}
                      </Text>
                      <View style={styles.details}>
                        <Image
                          source={Hospital}
                          style={styles.imagesize}
                          testID="hospitalImage"
                          accessibilityLabel="hospitalImage"
                        />
                        <Text
                          style={styles.alignment1}
                          testID={
                            filterData.appointment?.branch_details
                              ?.branch_name + 'text'
                          }
                          accessibilityLabel={
                            filterData.appointment?.branch_details
                              ?.branch_name + 'text'
                          }>
                          {' '}
                          {filterData.appointment?.branch_details?.branch_name +
                            ' - ' +
                            navigation.state.params.enc_id.split('-')[2]}
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
                          style={styles.alignment1}
                          testID={
                            'oupPatient' +
                            filterData.appointment?.appointment_type
                          }
                          accessibilityLabel={
                            'oupPatient' +
                            filterData.appointment?.appointment_type
                          }>
                          {'OutPatient - ' +
                            filterData.appointment?.appointment_type}
                        </Text>
                      </View>
                      <View style={styles.details}>
                        <Text
                          style={styles.alignment1}
                          testID={
                            'oupPatient' + patientList?.appointment?.description
                          }
                          accessibilityLabel={
                            'oupPatient' + patientList?.appointment?.description
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
              </View>
              {/* <View>
            <Text
              style={{
                marginHorizontal: wp(20),
                fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                textAlign: "center"
              }}>
              {dataFil?.appointment?.doctor_details?.full_name.toUpperCase()}
            </Text>
            <Text
              style={{
                marginHorizontal: wp(20),
                textAlign: "center",
                fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD
              }}>
              Visit ID: {navigation.state.params.enc_id}
            </Text>
            {/* <View
              style={{
                flexDirection: "row",
                marginVertical: wp(30),
                // textAlign: 'center',
                marginLeft: wp(235)
              }}>
              <Text
                style={{
                  // marginHorizontal: wp(20),
                  // textAlign: 'center',
                  fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                  transform: [{ rotate: "90deg" }]
                }}>
                {currentdate}
              </Text>
              <Text
                style={{
                  // marginHorizontal: wp(20),
                  // textAlign: 'center',
                  fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,
                  transform: [{ rotate: "90deg" }],
                  marginLeft: wp(-30)
                }}>
                {currenttime}
              </Text>
            </View> */}
              {/* </View> */}
            </View>
            {capturedata && capturedata.vitals.length > 0 ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={true}>
                <View style={{margin: wp(10)}}>
                  <Row style={{marginHorizontal: 5}}>
                    <Col size={32} style={{marginTop: 95}}>
                      <Card
                        style={{
                          backgroundColor: DEFAULT_SHADOW_COLOR,
                        }}>
                        <FlatList
                          data={capturedata.categories}
                          // keyExtractor={(item) => item.op_details.id.toString()}
                          showsVerticalScrollIndicator={false}
                          initialNumToRender={4}
                          renderItem={({item, i}) => {
                            if (item?.data === undefined) {
                              return (
                                // <Left>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginLeft: -15,
                                    margin: wp(10),
                                    alignSelf: 'flex-start',
                                  }}>
                                  <Text
                                    style={styles.alignment}
                                    testID={item?.label + 'text'}
                                    accessibilityLabel={item?.label + 'text'}>
                                    {item?.label}
                                    <Text
                                      note
                                      testID={item?.unit + 'text'}
                                      accessibilityLabel={item?.unit + 'text'}>
                                      {' '}
                                      ({item?.unit})
                                    </Text>
                                  </Text>
                                </View>
                              );
                            } else {
                              return (
                                <View style={{margin: wp(10)}}>
                                  <View style={{marginLeft: wp(-25)}}>
                                    <Text
                                      style={styles.bpalignment}
                                      testID={item?.label + 'text'}
                                      accessibilityLabel={item?.label + 'text'}>
                                      {item?.label}
                                    </Text>
                                  </View>
                                  {item.data.map((item2, i1) => {
                                    return (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          marginLeft: -25,
                                          margin: wp(10),
                                          alignSelf: 'flex-start',
                                        }}>
                                        <Text
                                          style={styles.alignment}
                                          testID={item2?.label + 'text'}
                                          accessibilityLabel={
                                            item2?.label + 'text'
                                          }>
                                          {item2?.label}
                                          <Text
                                            note
                                            testID={item2?.unit + 'text'}
                                            accessibilityLabel={
                                              item2?.unit + 'text'
                                            }>
                                            {' '}
                                            ({item2?.unit})
                                          </Text>
                                        </Text>
                                      </View>
                                    );
                                  })}
                                </View>
                              );
                            }
                          }}
                        />
                      </Card>
                    </Col>
                    <View>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}>
                        {capturedata?.vitals.map((item1, i1) => {
                          return (
                            //       <Row>
                            // <Col>
                            <View>
                              <Card
                                style={{
                                  // margin: wp(15),
                                  backgroundColor: '#ebfbff',
                                  width: 50,
                                  height: 82,
                                  // textAlign: "center",
                                  // marginBottom: wp(-90)
                                }}
                                borderRadius={2}
                                containerStyle={{padding: 0}}>
                                <View
                                  style={{marginLeft: -23, marginTop: -15}}
                                  size={-30}>
                                  <Text
                                    style={[styles.welcome]}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[9]
                                    }
                                  </Text>
                                  <Text
                                    style={styles.welcome}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[8]
                                    }
                                  </Text>
                                  <Text
                                    style={styles.welcome}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[7]
                                    }
                                  </Text>
                                  <Text
                                    style={styles.welcome}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[6]
                                    }
                                  </Text>
                                  <Text style={styles.welcome}>/</Text>
                                  <Text
                                    style={styles.welcome}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[4]
                                    }
                                  </Text>
                                  <Text
                                    style={styles.welcome}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[3]
                                    }
                                  </Text>
                                  <Text style={styles.welcome}>/</Text>
                                  <Text
                                    style={styles.welcome}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[1]
                                    }
                                  </Text>
                                  <Text
                                    style={styles.welcome}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date.split(' ')[0]
                                          : item1.updated_date.split(' ')[0],
                                      )
                                        .format('DD-MM-YYYY')
                                        .split('')[0]
                                    }
                                  </Text>
                                  {/* </TouchableOpacity> */}

                                  {/* {Platform.OS === 'ios' ? (
                      <Text style={{marginTop: 15, width: 50}}></Text>
                    ) : (
                      <Text style={{width: 50}}></Text>
                    )} */}
                                  {/* {capturedata?.vitals.map((item3, i1) => {
                      console.log('item11',item3)
                      return( */}

                                  {/* //   )
                    // })} */}
                                </View>

                                <Col
                                  size={10}
                                  style={{
                                    marginTop: Platform.OS == 'ios' ? -26 : -50,
                                    marginLeft: 8,
                                  }}>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date
                                          : item1.updated_date,
                                      )
                                        .format('hh:mm A')
                                        .split('')[7]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date
                                          : item1.updated_date,
                                      )
                                        .format('hh:mm A')
                                        .split('')[6]
                                    }
                                  </Text>
                                  {/* <Text style={{fontWeight:"bold",marginTop:-10,transform: [{ rotate: '-90deg'}]}}>{moment(item.created_date).format('hh:mm A').split("")[5]}</Text> */}
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date
                                          : item1.updated_date,
                                      )
                                        .format('hh:mm A')
                                        .split('')[4]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date
                                          : item1.updated_date,
                                      )
                                        .format('hh:mm A')
                                        .split('')[3]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date
                                          : item1.updated_date,
                                      )
                                        .format('hh:mm A')
                                        .split('')[2]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date
                                          : item1.updated_date,
                                      )
                                        .format('hh:mm A')
                                        .split('')[1]
                                    }
                                  </Text>
                                  <Text
                                    style={{
                                      fontWeight: 'bold',
                                      marginTop: -10,
                                      fontSize: 12,
                                      transform: [{rotate: '-90deg'}],
                                    }}
                                    testID={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }
                                    accessibilityLabel={
                                      item1.created_date +
                                      item1.updated_date +
                                      'text'
                                    }>
                                    {
                                      moment(
                                        item1.updated_date == ''
                                          ? item1.created_date
                                          : item1.updated_date,
                                      )
                                        .format('hh:mm A')
                                        .split('')[0]
                                    }
                                  </Text>
                                </Col>
                              </Card>
                              <Col>
                                <Card
                                  style={{
                                    textAlign: 'center',
                                    marginTop: wp(9),
                                    // paddingTop: wp(5),
                                    backgroundColor: '#ebfbff',
                                    width: 50,
                                    // height: 530
                                  }}>
                                  {categoriesvalues.map((item4, i2) => {
                                    let item5 = item1[item4];
                                    if (Object.keys(item5).length > 1) {
                                      if (item4 == 'systolic') {
                                        return (
                                          <Text
                                            style={{
                                              color: getColor(item5['color']),
                                              textAlign: 'center',
                                              marginTop: wp(65),
                                            }}
                                            testID={item5['value'] + 'text'}
                                            accessibilityLabel={
                                              item5['value'] + 'text'
                                            }>
                                            {item5['value']}
                                          </Text>
                                        );
                                      } else {
                                        <Text
                                          style={{
                                            color: getColor(item5['color']),
                                            textAlign: 'center',
                                            marginTop: wp(21),
                                          }}
                                          testID={item5['value'] + 'text'}
                                          accessibilityLabel={
                                            item5['value'] + 'text'
                                          }>
                                          {item5['value']}
                                        </Text>;
                                      }

                                      return (
                                        <Text
                                          style={{
                                            color: getColor(item5['color']),
                                            textAlign: 'center',
                                            marginTop: wp(21),
                                          }}
                                          testID={item5['value'] + 'text'}
                                          accessibilityLabel={
                                            item5['value'] + 'text'
                                          }>
                                          {item5['value']}
                                        </Text>
                                      );
                                    } else {
                                      return (
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            // marginLeft: wp(50),
                                            marginTop: wp(21),
                                            // marginBottom: wp(100)
                                          }}
                                          testID={item5['value'] + 'text'}
                                          accessibilityLabel={
                                            item5['value'] + 'text'
                                          }>
                                          {item5['value']}
                                        </Text>
                                      );
                                    }
                                  })}
                                  <Text></Text>
                                </Card>
                              </Col>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </Row>
                </View>
              </ScrollView>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};
// export default CaptureVitals;
const mapStateToProps = state => {
  return {
    patientList: state.patientList.patientList,
    // vitallabels: state.vitalLabels.vitalsLabels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // fetchVitalLabelssuccess: (data) => dispatch(fetchVitalLabelssuccess(data))
  };
};

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(withTranslation()(CaptureVitals));

const styles = StyleSheet.create({
  index: {
    marginVertical: wp(5),
  },
  vital: {
    flexDirection: 'row',
    padding: wp(10),
  },
  alignment: {
    // textAlign: 'center',
    marginHorizontal: wp(20),
    width: wp(150),
    marginLeft: wp(30),
  },
  bpalignment: {
    backgroundColor: '#d9d9d9',
    marginHorizontal: wp(20),
    width: wp(150),
    marginLeft: wp(30),
    paddingRight: wp(10),
  },
  back_button: {
    tintColor: DEFAULT_WHITE_COLOR,
    position: 'relative',
    left: 12,
    height: hp(25),
    width: wp(25),
    marginRight: 10,
  },
  welcome: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -10,
    transform: [{rotate: '-90deg'}],
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
  alignment1: {
    textAlign: 'center',
    marginHorizontal: wp(8),
  },
});
