import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  DeviceEventEmitter,
  Keyboard,
} from 'react-native';
import {Right, Card, Text, CardItem} from 'native-base';
import {Divider} from 'react-native-elements';
import SimpleHeader from '../../../screens/app/common/SimpleHeader';
import Feather from 'react-native-vector-icons/Feather';
import {
  DEFAULT_WHITE_COLOR,
  DEFAULT_INVERSE_LIGHT,
  FONT_FAMILY,
  DEFAULT_BACKGROUND_BLUE_COLOR,
  DEFAULT_GREY_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
  DEFAULT_BLACK_COLOR,
} from '../../../themes/variable';
import {wp} from '../../../themes/Scale';
import RadioButton from '../common/RadioButton';
import Cash from '../../../assets/images/cash.png';
import Wallet from '../../../assets/images/wallet.png';
import Upi from '../../../assets/images/upi.png';
import Cheque from '../../../assets/images/cash.png';
import Cards from '../../../assets/images/card.png';
import FooterButton from '../common/FooterButton';
import SelectDropdown from 'react-native-select-dropdown';
import Downarrow from '../../../assets/images/downarrow.png';
import {ScrollView} from 'react-native-gesture-handler';
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import HTMLView from 'react-native-htmlview';
import {NativeToastTop} from '../common/Toaster';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  addServices,
  bankNames,
  refundamount,
} from '../../../redux/actions/billing_action';
import {getApiUrl} from '../../../config/Config';

const PaymentDetails = ({navigation, patientList, doctorDetails, t}) => {
  const [payment, setPayment] = useState('');
  // const [payment, setPayment] = useState('');
  const [upi, setUpi] = useState('');
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [cardDigit, setCardDigit] = useState('');
  const [expirydate, setExpirydate] = useState('');
  const [transactionid, setTransactionid] = useState('');
  const [cheaqueNo, setCheaqueNo] = useState('');
  const [loading, setloading] = useState(true);
  const [goHome, setgoHome] = useState(false);
  const [previousAmount, setpreviousAmount] = useState(0);
  const [currentAmount, setcurrentAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [allservicesTotal, setallservicesTotal] = useState(0);
  const [enc_id, setenc_id] = useState('');
  const [doc_id, setdoc_id] = useState('');
  const [hlp_id, sethlp_id] = useState('');
  const [branchid, setbranchid] = useState('');
  const [is_appointment] = useState(true);
  const [discount, setdiscount] = useState(0);
  const [appointment_details, setappointment_details] = useState({
    appointment_id: '',
    appointment_type: '',
  });
  const [services, setservices] = useState([]);
  const [criteria, setcriteria] = useState({});
  const [refund, setrefund] = useState(false);
  const [banksList, setbanksList] = useState([]);

  const paymentOptions = [
    {
      id: 1,
      type: t('BILLING.PAYMENT.CASHTYPE'),
      value: 'Cash',
      note: t('BILLING.PAYMENT.CASH'),
      image: Cash,
    },
    {
      id: 2,
      type: t('BILLING.PAYMENT.CARDSTYPE'),
      value: 'Cards',
      note: t('BILLING.PAYMENT.CARDS'),
      image: Cards,
    },
    {
      id: 3,
      type: t('BILLING.PAYMENT.UPITYPE'),
      value: 'UPI',
      note: t('BILLING.PAYMENT.UPI'),
      image: Upi,
    },
    {
      id: 4,
      type: t('BILLING.PAYMENT.CHEQUETYPE'),
      value: 'Cheque',
      note: t('BILLING.PAYMENT.CHEQUE'),
      image: Cheque,
    },
    {
      id: 5,
      type: t('BILLING.PAYMENT.WALLETTYPE'),
      value: 'Wallet',
      note: t('BILLING.PAYMENT.WALLETMODE'),
      image: Wallet,
    },
  ];

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

  const upioptions = [
    {
      id: 1,
      name: 'Phonepay',
    },
    {
      id: 2,
      name: 'GPay',
    },
    {
      id: 3,
      name: 'Paytm',
    },
    {
      id: 4,
      name: 'BHIM',
    },
    {
      id: 5,
      name: 'Others',
    },
  ];

  const walletoptions = [
    {
      id: 1,
      name: 'Phonepay',
    },
    {
      id: 2,
      name: 'GPay',
    },
    {
      id: 3,
      name: 'Paytm',
    },
    {
      id: 4,
      name: 'BHIM',
    },
    {
      id: 5,
      name: 'Others',
    },
  ];

  const clearState = () => {
    setUpi('');
    setWallet('');
    setAmount('');
    setBankName('');
    setCardDigit('');
    setExpirydate('');
    setTransactionid('');
    setCheaqueNo('');
  };

  const getServices = async () => {
    await bankNames().then(res => {
      setbanksList(res?.data?.bank_names || []);
    });

    let data = (await AsyncStorage.getItem('AddService')) || [];
    let criteriadata = await AsyncStorage.getItem('paymentCriteria');
    let encounterpayment = await AsyncStorage.getItem('encounterpayment');
    let branchId = await AsyncStorage.getItem('branch_id');
    setbranchid(branchId);
    encounterpayment = JSON.parse(encounterpayment);

    data = JSON.parse(data);

    let isNotRegistered = data?.filter(i => i?.isRegistered === false) || [];

    if (isNotRegistered?.length > 0) {
      setrefund(false);
    } else if (Math.sign(encounterpayment?.tot_due) == -1) {
      setrefund(true);
    }
    setservices(data);

    const sumallamount = data
      ?.map(service => +service?.amount)
      .reduce((prev, curr) => prev + curr, 0);

    setallservicesTotal(isNaN(sumallamount) ? 0 : sumallamount);

    const sumallrate = data
      ?.map(service => +service?.rate)
      .reduce((prev, curr) => prev + curr, 0);

    const sumalldiscount = data
      ?.map(service =>
        service?.percentage_discount !== 0
          ? (+service?.rate * +service?.qty * service?.percentage_discount) /
            100
          : Number(service?.discount_given),
      )
      .reduce((prev, curr) => prev + curr, 0);

    setdiscount(isNaN(+sumalldiscount) ? 0 : +sumalldiscount);

    setcriteria(JSON.parse(criteriadata));

    // setpreviousAmount(+encounterpayment.tot_due)

    let dueStatus = data?.filter(i => i?.pay_status == 'Due');

    let sumallDue = dueStatus
      ?.map(service => +service?.amount)
      .reduce((prev, curr) => prev + curr, 0);

    setpreviousAmount(
      isNaN(encounterpayment?.tot_due) ? 0 : +encounterpayment?.tot_due,
    );

    let currStatus = data?.filter(i => i?.service_consult == 'consult');

    let currStatusDiscount = currStatus
      ?.map(service => +service?.discount_given)
      .reduce((prev, curr) => prev + curr, 0);

    let curTotal = currStatus
      ?.map(service => +service?.rate * +service?.qty)
      .reduce((prev, curr) => prev + curr, 0);

    setcurrentAmount(
      Number(curTotal ? curTotal : 0) -
        Number(currStatusDiscount ? currStatusDiscount : 0),
    );

    let grand =
      Number(curTotal ? curTotal : 0) -
      Number(currStatusDiscount ? currStatusDiscount : 0);

    setTotal(
      grand + Number(encounterpayment?.tot_due ? encounterpayment?.tot_due : 0),
    );

    let inputAmount;

    if (isNotRegistered?.length > 0) {
      inputAmount =
        Math.sign(
          isNaN(encounterpayment?.tot_due) ? 0 : +encounterpayment?.tot_due,
        ) ===
        Math.sign(
          grand +
            Number(
              isNaN(encounterpayment?.tot_due) ? 0 : +encounterpayment?.tot_due,
            ),
        )
          ? 0
          : grand +
            Number(
              isNaN(encounterpayment?.tot_due) ? 0 : encounterpayment?.tot_due,
            );
    } else {
      let due = encounterpayment?.tot_due
        ? Number(encounterpayment?.tot_due ? encounterpayment?.tot_due : 0)
        : 0;
      inputAmount = grand + +due;
    }

    setAmount(`${inputAmount}`);
  };

  // to add services
  const addPaymentServices = async () => {
    let mode = payment.toLocaleLowerCase();

    let paymentObj = {};
    paymentObj.doctor_id = doc_id;
    paymentObj.is_appointment = true;
    paymentObj.encounter_id = enc_id;
    paymentObj.appointment_details = appointment_details;
    paymentObj.payment_details = {
      paid_amount: global.discount_by == 'employer' ? 0 : Number(amount),
      total_amount: Number(allservicesTotal),
      over_all_discount: Number(discount),
    };
    paymentObj.payment_criteria = criteria;
    paymentObj.services = services;

    let allOkay;

    if (global.discount_by === 'employer') {
      paymentObj.bank_details = {
        mode_of_payment: mode,
        provider: global?.discount_by,
      };
      allOkay = true;
    } else {
      if (!payment.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.SELECT_METHOD'),
          type: 'warning',
        });
      if (!amount.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.ENTER_AMOUNT', {
            method: `${payment.toLocaleLowerCase()}`,
          }),
          type: 'warning',
        });
    }

    if (mode === 'cash') {
      paymentObj.bank_details = {
        mode_of_payment: mode,
        provider: global?.discount_by ? global.discount_by : 'me',
      };
      allOkay = true;
    }

    if (mode === 'cards') {
      if (!bankName.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.WRITE_BANK_NAME'),
          type: 'warning',
        });
      if (!cardDigit.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.WRITE_CARD_NUMBER'),
          type: 'warning',
        });
      if (!expirydate.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.WRITE_CARD_EXPIRY'),
          type: 'warning',
        });

      paymentObj.bank_details = {
        mode_of_payment: payment.toLocaleLowerCase(),
        card_number: cardDigit,
        bank_name: bankName,
        expiry_date: expirydate,
        provider: global?.discount_by ? global.discount_by : 'me',
      };
      allOkay = true;
    }
    if (mode === 'upi') {
      if (!upi.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.WRITE_UPI'),
          type: 'warning',
        });
      if (!transactionid.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.WRITE_UPI_TRANSACTION'),
          type: 'warning',
        });
      paymentObj.bank_details = {
        mode_of_payment: payment.toLocaleLowerCase(),
        bank_name: upi,
        trans_id: transactionid,
        provider: global?.discount_by ? global.discount_by : 'me',
      };
      allOkay = true;
    }
    if (mode === 'cheque') {
      if (!bankName.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.WRITE_BANK_NAME'),
          type: 'warning',
        });
      if (!cheaqueNo.trim())
        return NativeToastTop({
          text: t('BILLING.PAYMENT.WRITE_CHEQUE_NO'),
          type: 'warning',
        });
      paymentObj.bank_details = {
        mode_of_payment: payment.toLocaleLowerCase(),
        bank_name: bankName,
        trans_id: transactionid,
        cheque_no: cheaqueNo,
        provider: global?.discount_by ? global.discount_by : 'me',
      };
      allOkay = true;
    }

    let validation = {
      branchid,
      hlp_id,
    };

    if (allOkay) {
      setloading(true);
      await addServices(paymentObj, validation)
        .then(res => {
          if (res) {
            NativeToastTop({
              text: 'Service added Successfully',
              type: 'success',
            });
            setgoHome(true);
            setTimeout(() => {
              DeviceEventEmitter.emit('updateHomeScreen', {date: ''});
              navigation.navigate('ViewPdfFooter', {
                link: getApiUrl() + `${res.data.encounter_path}`,
                screenname: 'Receipt',
                patientList: patientList,
              });
            }, 300);
          }
        })
        .catch(res => {
          NativeToastTop({text: res.message, type: 'warning'});
          if (res) {
            setloading(false);
          }
        });
    }
  };

  const refundAmount = async () => {
    let mode = payment.toLocaleLowerCase();

    if (!payment.trim())
      return NativeToastTop({
        text: t('BILLING.PAYMENT.SELECT_METHOD'),
        type: 'warning',
      });
    if (!amount.trim())
      return NativeToastTop({
        text: t('BILLING.PAYMENT.ENTER_AMOUNT', {
          method: `${payment.toLocaleLowerCase()}`,
        }),
        type: 'warning',
      });

    let payingamount;

    if (Math.sign(amount) === -1) {
      let stringamount = amount.toString();

      payingamount = stringamount.substring(1);
    } else {
      payingamount = amount;
    }

    let variables = {
      hlp_id: hlp_id,
      encounter_id: enc_id,
    };
    let payload = {
      refund_amount: +payingamount,
      payment_mode: mode,
    };

    setloading(true);
    await refundamount(variables, payload)
      .then(res => {
        if (res) {
          NativeToastTop({text: res.message, type: 'success'});
          setgoHome(true);
          setTimeout(() => {
            DeviceEventEmitter.emit('updateHomeScreen', {date: ''});
            navigation.navigate('ViewPdfFooter', {
              link: getApiUrl() + `${res.data.path}`,
              screenname: 'Refund Receipt',
            });

            setloading(false);
          }, 300);
        }
      })
      .catch(err => {
        NativeToastTop({text: err.message, type: 'danger'});
        setloading(false);
      });
  };

  useEffect(() => {
    getServices();

    let patient = patientList;
    let doctor = doctorDetails;

    if (patient && doctor) {
      setdoc_id(patient?.appointment?.doc_id);
      setenc_id(patient?.encounter_id);
      sethlp_id(patient?.appointment?.healpha_id);
      setappointment_details({
        appointment_id: patient?.appointment?.id,
        appointment_type:
          patient?.appointment?.appointment_type.toLocaleLowerCase(),
      });

      setTimeout(() => {
        setloading(false);
      }, 300);
    }
  }, []);

  const fixCardText = e => {
    if (e.toString().length === 2 && expirydate.toString().length === 1) {
      e += '/';
    } else if (
      e?.toString()?.length === 2 &&
      expirydate?.toString()?.length === 3
    ) {
      e = e.substring(0, e?.toString()?.length - 1);
    }
    setExpirydate(e);
    if (e?.toString()?.length === 7) {
      Keyboard.dismiss();
    }
  };

  if (goHome) {
    navigation.navigate('HomeScreen', {qr_code_hlp_id: ''});
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <View style={{flex: 1}}>
      <SimpleHeader
        testID="paymentDetailsText"
        accessibilityLabel="paymentDetailsText"
        title={t('BILLING.PAYMENT.TITLE')}
        navigation={navigation}
      />

      <ScrollView>
        <View
          style={{
            // flex: 1,
            backgroundColor: DEFAULT_WHITE_COLOR,
            marginBottom: wp(100),
          }}>
          <View>
            <View
              style={{
                //   flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Text
                style={{
                  marginLeft: 15,
                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                }}
                testID="previuousDueText"
                accessibilityLabel="previuousDueText">
                {t('BILLING.PAYMENT.PREVIOUS_DUE')}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <HTMLView value={'<h4>&#2352;</h4>'} />
                <Text
                  style={{paddingTop: 2}}
                  testID={previousAmount + 'text'}
                  accessibilityLabel={previousAmount + 'text'}>
                  {' '}
                  {previousAmount}
                </Text>
                <TouchableOpacity
                  style={{width: '10%'}}
                  testID="downArrowTouch"
                  accessibilityLabel="downArrowTouch">
                  <Image
                    testID="downArrowImage"
                    accessibilityLabel="downArrowImage"
                    source={Downarrow}
                    style={{width: 25, height: 25, marginLeft: wp(10)}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Divider style={styles.lineStyle} />
            <View
              style={{
                //   flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Text
                style={{
                  marginLeft: 15,
                  fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                }}
                testID="currentBillText"
                accessibilityLabel="currentBillText">
                {t('BILLING.PAYMENT.CURRENT_BILL')}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <HTMLView value={'<h4>&#2352;</h4>'} />
                <Text
                  style={{paddingTop: 2}}
                  testID={currentAmount + 'text'}
                  accessibilityLabel={currentAmount + 'text'}>
                  {' ' + currentAmount}
                </Text>
                <TouchableOpacity style={{width: '10%'}}>
                  <Image
                    testID="downArrowImage"
                    accessibilityLabel="downArrowImage"
                    source={Downarrow}
                    style={{width: 25, height: 25, marginLeft: wp(10)}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Divider style={styles.lineStyle} />
            <View
              style={{
                backgroundColor: DEFAULT_BACKGROUND_BLUE_COLOR,
              }}>
              <View
                style={{
                  //   flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.NUNITO_SANS_REGULAR,
                    marginLeft: 15,
                  }}
                  testID="totalText"
                  accessibilityLabel="totalText">
                  {t('BILLING.PAYMENT.TOTAL')}
                </Text>
                <HTMLView
                  testID={total + 'text'}
                  accessibilityLabel={total + 'text'}
                  value={`<h4>&#2352; ${total}</h4>`}
                  style={{marginRight: wp(35)}}
                />
              </View>
            </View>
            <Divider style={styles.lineStyle} />
            <Text
              style={{margin: wp(15)}}
              testID="selectModeText"
              accessibilityLabel="selectModeText">
              {t('BILLING.PAYMENT.SELECT_MODE')}
            </Text>
            {/* <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}> */}
            {paymentOptions.map(i => {
              return (
                <Card
                  key={i.id}
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: wp(5),
                  }}>
                  <View>
                    <CardItem
                      style={{
                        borderRadius: 5,
                        flexDirection: 'row',
                      }}>
                      <Image
                        testID="cardImage"
                        accessibilityLabel="cardImage"
                        source={i.image}
                        style={{width: 25, height: 25, marginRight: 10}}
                      />
                      <View style={{width: '75%'}}>
                        <Text
                          testID={i.type + 'text'}
                          accessibilityLabel={i.type + 'text'}>
                          {i.type}
                        </Text>
                        <Text
                          note
                          style={{width: '100%'}}
                          testID={i.note + 'text'}
                          accessibilityLabel={i.note + 'text'}>
                          {i.note}
                        </Text>
                      </View>
                      <Right
                        style={{
                          // flex: 1,
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            height: 20,
                          }}>
                          <RadioButton
                            testID="radioButton"
                            accessibilityLabel="radioButton"
                            disable={
                              global.discount_by == 'employer' ? true : false
                            }
                            onPress={() => {
                              // clearState();
                              payment === i.value
                                ? setPayment('')
                                : setPayment(i.value);
                            }}
                            value={payment}
                            name={i.value}
                          />
                        </View>
                      </Right>
                    </CardItem>
                    {payment === i.value && (
                      <View>
                        {(payment === 'Cards' || payment === 'Cheque') && (
                          <View style={{marginHorizontal: wp(50)}}>
                            {/* <Text style={{ color: DEFAULT_GREY_COLOR }}>
                              {t("BILLING.PAYMENT.BANKNAME")}
                            </Text> */}
                            <SelectDropdown
                              testID="selectBankDropDown"
                              accessibilityLabel="selectBankDropDown"
                              data={banksList}
                              dropdownStyle={{borderRadius: 10}}
                              buttonStyle={{
                                backgroundColor: DEFAULT_WHITE_COLOR,
                                borderRadius: 10,
                                borderColor: DEFAULT_BLACK_COLOR,
                                borderWidth: 1,
                              }}
                              defaultValue={t('BILLING.PAYMENT.SELECTBANK')}
                              defaultButtonText={t(
                                'BILLING.PAYMENT.SELECTBANK',
                              )}
                              rowTextForSelection={(bank, index) => {
                                return bank.bank_name;
                              }}
                              buttonTextAfterSelection={bank => {
                                return bank.bank_name;
                              }}
                              onSelect={bank => {
                                setBankName(bank.bank_name);
                              }}
                              renderDropdownIcon={isOpened => {
                                return (
                                  <Feather
                                    testID="arrowIcon"
                                    accessibilityLabel="arrowIcon"
                                    name={
                                      isOpened ? 'chevron-up' : 'chevron-down'
                                    }
                                    color={'#444'}
                                    size={18}
                                  />
                                );
                              }}
                            />

                            {/* <TextInput
                              value={bankName}
                              onChangeText={(val) => {
                                setBankName(val);
                              }}
                              placeholder={}
                              style={{
                                borderBottomWidth: 1,
                                borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                                // margin: wp(10),
                                marginTop: wp(5),
                                marginBottom: wp(15),
                                width: "80%"
                              }}
                            /> */}
                          </View>
                        )}
                        {payment === 'Cards' && (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginHorizontal: wp(50),
                              marginBottom: wp(10),
                            }}>
                            <View style={{width: '60%'}}>
                              <Text
                                style={{
                                  color: DEFAULT_GREY_COLOR,
                                  fontSize: 14,
                                  paddingTop: 5,
                                }}
                                testID="cardDetailsText"
                                accessibilityLabel="cardDetailsText">
                                {t('BILLING.PAYMENT.CARDDETAILS')}
                              </Text>
                              <TextInput
                                testID="cardDetailsTextInput"
                                accessibilityLabel="cardDetailsTextInput"
                                value={cardDigit}
                                maxLength={4}
                                keyboardType="numeric"
                                onChangeText={val => setCardDigit(val)}
                                placeholder="0000"
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                                  paddingTop: 5,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                marginLeft: wp(15),
                                marginBottom: wp(10),
                              }}>
                              <Text
                                style={{
                                  color: DEFAULT_GREY_COLOR,
                                  fontSize: 14,
                                  // marginTop: 5
                                }}
                                testID="cardExpiryText"
                                accessibilityLabel="cardExpiryText">
                                {t('BILLING.PAYMENT.CARDEXPIRY')}
                              </Text>
                              <TextInput
                                testID="cardExpiryTextInput"
                                accessibilityLabel="cardExpiryTextInput"
                                value={expirydate}
                                maxLength={7}
                                keyboardType="numeric"
                                onChangeText={val => fixCardText(val)}
                                blurOnSubmit={true}
                                placeholder="MM/YYYY"
                                style={{
                                  borderBottomWidth: 1,
                                  // marginTop: 5,
                                  borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                                }}
                              />
                            </View>
                          </View>
                        )}
                        {payment === 'UPI' && (
                          <View style={{marginHorizontal: wp(50)}}>
                            <Text
                              style={styles.text}
                              testID="provideUpiText"
                              accessibilityLabel="provideUpiText">
                              {t('BILLING.PAYMENT.PROVIDE_UPI')}
                            </Text>
                            <SelectDropdown
                              testID="upiDropDown"
                              accessibilityLabel="upiDropDown"
                              data={upioptions}
                              defaultButtonText="Paytm"
                              defaultValue={upi}
                              onSelect={val => {
                                setUpi(val.name);
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index,
                              ) => {
                                return selectedItem.name;
                              }}
                              rowTextForSelection={(item, index) => {
                                return item.name;
                              }}
                              buttonStyle={styles.dropdown4BtnStyle}
                              buttonTextStyle={styles.dropdown4BtnTxtStyle}
                              renderDropdownIcon={isOpened => {
                                return (
                                  <Feather
                                    testID="arrowIcon"
                                    accessibilityLabel="arrowIcon"
                                    name={
                                      isOpened ? 'chevron-up' : 'chevron-down'
                                    }
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
                            <View style={{marginTop: wp(10)}}>
                              <Text
                                style={{color: DEFAULT_GREY_COLOR}}
                                testID="transactionIdText"
                                accessibilityLabel="transactionIdText">
                                {t('BILLING.PAYMENT.TRANSACTION_ID')}
                              </Text>
                              <TextInput
                                testID="transactionIdTextInput"
                                accessibilityLabel="transactionIdTextInput"
                                value={transactionid}
                                onChangeText={val => setTransactionid(val)}
                                placeholder={t(
                                  'BILLING.PAYMENT.ENTER_TRANSACTION_ID',
                                )}
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                                  // margin: wp(10),
                                  marginTop: wp(5),
                                  marginBottom: wp(15),
                                  width: '70%',
                                }}
                              />
                            </View>
                          </View>
                        )}
                        {payment === 'Cheque' && (
                          <View style={{marginHorizontal: wp(50)}}>
                            <Text
                              style={{color: DEFAULT_GREY_COLOR}}
                              testID="chequeNoText"
                              accessibilityLabel="chequeNoText">
                              {t('BILLING.PAYMENT.CHEQUE_NO')}
                            </Text>
                            <TextInput
                              testID="chequeNoTextInput"
                              accessibilityLabel="chequeNoTextInput"
                              value={cheaqueNo}
                              onChangeText={val => setCheaqueNo(val)}
                              placeholder={t('BILLING.PAYMENT.ENTER_CHEQUE_NO')}
                              style={{
                                borderBottomWidth: 1,
                                borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                                // margin: wp(10),
                                marginTop: wp(5),
                                marginBottom: wp(15),
                                width: '70%',
                              }}
                            />
                          </View>
                        )}
                        {payment === 'Wallet' && (
                          <View style={{marginHorizontal: wp(50)}}>
                            <Text
                              style={styles.text}
                              testID="walletText"
                              accessibilityLabel="walletText">
                              {t('BILLING.PAYMENT.WALLET')}
                            </Text>
                            <SelectDropdown
                              testID="walletDropDown"
                              accessibilityLabel="walletDropDown"
                              data={walletoptions}
                              defaultButtonText={wall => {
                                return wall.name;
                              }}
                              defaultValue={t('BILLING.PAYMENT.WALLET')}
                              onSelect={val => {
                                setWallet(val.name);
                              }}
                              buttonTextAfterSelection={(
                                selectedItem,
                                index,
                              ) => {
                                return selectedItem.name;
                              }}
                              rowTextForSelection={(item, index) => {
                                return item.name;
                              }}
                              buttonStyle={styles.dropdown4BtnStyle}
                              buttonTextStyle={styles.dropdown4BtnTxtStyle}
                              renderDropdownIcon={isOpened => {
                                return (
                                  <Feather
                                    testID="arrowIcon"
                                    accessibilityLabel="arrowIcon"
                                    name={
                                      isOpened ? 'chevron-up' : 'chevron-down'
                                    }
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
                            <View style={{marginTop: wp(10)}}>
                              <Text
                                style={{color: DEFAULT_GREY_COLOR}}
                                testID="transactionIdText"
                                accessibilityLabel="transactionIdText">
                                {t('BILLING.PAYMENT.TRANSACTION_ID')}
                              </Text>
                              <TextInput
                                testID="transactionIdTextInput"
                                accessibilityLabel="transactionIdTextInput"
                                value={transactionid}
                                onChangeText={val => setTransactionid(val)}
                                placeholder={t(
                                  'BILLING.PAYMENT.ENTER_TRANSACTION_ID',
                                )}
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                                  // margin: wp(10),
                                  marginTop: wp(5),
                                  // marginBottom: wp(30),
                                  width: '70%',
                                }}
                              />
                            </View>
                          </View>
                        )}
                        <View style={{marginHorizontal: wp(50), marginTop: 10}}>
                          <Text
                            style={{color: DEFAULT_GREY_COLOR}}
                            testID="amountText"
                            accessibilityLabel="amountText">
                            {t('BILLING.PAYMENT.AMOUNT')}
                          </Text>
                          <TextInput
                            testID={amount + 'text'}
                            accessibilityLabel={amount + 'text'}
                            value={amount}
                            onChangeText={val => setAmount(val)}
                            //placeholder="0.00"
                            defaultValue={amount}
                            style={{
                              borderBottomWidth: 1,
                              borderBottomColor: DEFAULT_LIGHT_GREY_COLOR,
                              // margin: wp(10),
                              marginTop: wp(5),
                              marginBottom: wp(15),
                              width: '40%',
                            }}
                          />
                        </View>
                      </View>
                    )}
                    <Divider style={styles.lineStyle} />
                  </View>
                </Card>
              );
            })}
            {/* </View> */}
          </View>
        </View>
      </ScrollView>
      <View>
        <FooterButton
          label={
            t('BILLING.PAYMENT.SAVE')
            // refund ? t("BILLING.PAYMENT.REFUND") : t("BILLING.PAYMENT.SAVE")
          }
          onPress={() => {
            refund ? refundAmount() : addPaymentServices();
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    patientList: state.patientList.patientList,
    doctorDetails: state.postList.postList,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(PaymentDetails));
const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: DEFAULT_INVERSE_LIGHT,
  },
  dropdown4BtnStyle: {
    width: 'auto',
    height: 'auto',
    backgroundColor: '#FFF',

    borderBottomWidth: 1,
    borderColor: DEFAULT_LIGHT_GREY_COLOR,
    fontFamily: FONT_FAMILY.NUNITO_SANS_BOLD,

    height: 35,
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left', marginLeft: -8},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
  text: {
    fontFamily: FONT_FAMILY.NUNITO_SANS_SEMI_BOLD,
    color: DEFAULT_GREY_COLOR,
    // marginHorizontal: wp(10)
  },
});
