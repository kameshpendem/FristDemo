import {
  View,
  Header,
  Left,
  Body,
  Title,
  Right,
  Toast as nativeBaseToast,
} from 'native-base';
import React, {Component} from 'react';
import {Text, TouchableOpacity, ScrollView,KeyboardAvoidingView,Keyboard} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Feather';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {YearYYYY} from '../CovidMonitoring/Utils/DateTimeUtil';
import getBaseUrl from '../../../config/Config';
const awardsObject = {
  name: '',
  description: '',
  year: '',
};
class Awards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      textInput: [],
      inputData: [],
      text: '',
      loader: false,
      awardsArray: [],
      awardsObject: awardsObject,
      awardIds: [],
      details: {},
    };
  }

  componentDidMount() {
    const {awardsArray, details} = this.props?.navigation?.state?.params;
    this.setState({
      awardsArray: awardsArray,
      details: details,
    });
  }

  addTextInput = () => {
    const awardsObject = {
      name: '',
      description: '',
      year: '',
    };
    const obj = awardsObject;
    const awardsArray = this.state.awardsArray;
    awardsArray.push(obj);
    this.setState({
      awardsArray: awardsArray,
    });
  };

  //function to remove TextInput dynamically
  // removeTextInput = () => {
  //   let textInput = this.state.textInput;
  //   let inputData = this.state.inputData;
  //   textInput.pop();
  //   inputData.pop();
  //   this.setState({textInput, inputData});
  // };

  removeIndexObject = (index) => {
    let inputData = [...this.state.awardsArray];
    let awardIds = this.state.awardIds;
    let awardsObject = inputData[index];
    if (awardsObject.id) {
      awardIds.push(awardsObject.id);
    }
    inputData.splice(index, 1);
    this.setState({
      awardsArray: inputData,
      loader: false,
    });
  };

  removeTextInput = (index) => {
    this.setState(
      {
        loader: true,
      },
      () => this.removeIndexObject(index),
    );
  };

  addValues = (text, index) => {
    let dataArray = this.state.inputData;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach((element) => {
        if (element.index === index) {
          element.text = text;
          checkBool = true;
        }
      });
    }
    if (checkBool) {
      this.setState({
        inputData: dataArray,
      });
    } else {
      dataArray.push({text: text, index: index});
      this.setState({
        inputData: dataArray,
      });
    }
  };

  handleInputSections = (text, index, type) => {
    let awardArray = this.state.awardsArray;
    let obj = awardArray[index];

    if (type === 'year' || type === 'description') {
      const dobYear = YearYYYY(this.state?.details?.dob);
      if (text.length >= 4) {
        if (parseInt(text) > dobYear) {
          obj[type] = parseInt(text);
        } else {
          nativeBaseToast.show({
            text: 'Please Enter Year > Date Of Birth',
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } else {
      obj[type] = text;
    }

    awardArray[index] = obj;

    this.setState({
      awardsArray: awardArray,
    });
  };

  init = async () => {
    const {t} = this.props;
    const doctorId = await AsyncStorage.getItem('doctorid');
    const jwt_token = await AsyncStorage.getItem('jwt_token');
    try {
      // const url = 'https://dev.rxconcent.com/api/v1/doctor/' + doctorId;
      const url = getBaseUrl() + 'v1/doctor/' + doctorId;
      let awardObject = this.state.awardsArray;
      const delete_awardsrecognisation = this.state.awardIds;
      const payload = {
        awards_recognisation: awardObject,
        delete_awardsrecognisation: delete_awardsrecognisation,
      };
      let Response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (Response) {
        this.props.navigation.goBack();
      }
    } catch (error) {
      nativeBaseToast.show({
        text: t('PROFILE.DATANOTSAVED'),
        type: 'danger',
        duration: 5000,
      });
    }
  };

  Header() {
    const {t} = this.props;
    return (
      <View>
        <Header
          androidStatusBarColor={APP_PRIMARY_COLOR}
          style={{backgroundColor: APP_PRIMARY_COLOR}}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon3
              testID="goBackIcon"
              accessibilityLabel="goBackIcon"
                name="chevron-left"
                size={30}
                style={{color: DEFAULT_WHITE_COLOR}}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={{color: DEFAULT_WHITE_COLOR}}
             testID="editAwardsTitle"
             accessibilityLabel="editAwardsTitle">
              {' '}
              {t('PROFILE.EDITAWARDS')}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.init()}>
              <Title style={{color: DEFAULT_WHITE_COLOR}}
               testID="saveTitle"
               accessibilityLabel="saveTitle">
                {t('PROFILE.SAVE')}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }

  AddAwardsRecoginization() {
    const {t} = this.props;
    return (
      <View>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text
                style={{
                  marginLeft: 16,
                  fontSize: 18,
                  padding: 5,
                  color: APP_PRIMARY_COLOR,
                }}
                testID="addAwardsAndRecognizationText"
                accessibilityLabel="addAwardsAndRecognizationText">
                {t('PROFILE.ADDAWARDSRECOGNIZATION')}
              </Text>
            </View>

            <View style={{justifyContent: 'flex-end', marginRight: 6}}>
              <TouchableOpacity
                onPress={() => this.addTextInput(this.state.textInput.length)}>
                <Icon2
                 testID="plusIcon"
                 accessibilityLabel="plusIcon"
                  name="squared-plus"
                  style={{padding: 5, color: APP_PRIMARY_COLOR}}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    );
  }

  AwardsRecoginizationSection(element, index) {
    const {t} = this.props;
    return (
      <View style={{backgroundColor: 'white', marginTop: 10}}>
        <Card style={{paddingBottom: 20, paddingTop: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text style={{marginLeft: 16, fontSize: 14}}
               testID="awardsAndRecognizationText"
               accessibilityLabel="awardsAndRecognizationText">
                {t('PROFILE.AWARDSRECOGNIZATION')}
              </Text>
            </View>

            <View style={{justifyContent: 'flex-end', marginRight: 16}}>
              <TouchableOpacity onPress={() => this.removeTextInput(index)}>
                <Icon2 name="cross" size={20} 
                 testID="crossIcon"
                 accessibilityLabel="crossIcon"/>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginLeft: 16, marginRight: 16}}>
            <TextInput
             testID="awardsAndRecognizationTextInput"
             accessibilityLabel="awardsAndRecognizationTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder={t('PROFILE.AWARDSRECOGNIZATION')}
              defaultValue={element.name}
              onChangeText={(text) =>
                this.handleInputSections(text, index, 'name')
              }
            />
          </View>

          <View>
            <Text style={{marginLeft: 16, fontSize: 14, padding: 10}}
             testID="fromText"
             accessibilityLabel="fromText">
              {t('PROFILE.FROM')}
            </Text>
          </View>

          <View style={{marginLeft: 16, marginRight: 16}}>
            <TextInput
             testID="fromTextInput"
             accessibilityLabel="fromTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder={t('PROFILE.FROM')}
              defaultValue={element.description}
              onChangeText={(text) =>
                this.handleInputSections(text, index, 'description')
              }
            />
          </View>

          <View>
            <Text style={{marginLeft: 16, fontSize: 14, padding: 10}}
             testID="yearText"
             accessibilityLabel="yearText">
              {t('PROFILE.YEAR')}
            </Text>
          </View>

          <View style={{marginLeft: 16, marginRight: 16}}>
            <TextInput
             testID="yearTextInput"
             accessibilityLabel="yearTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder={t('PROFILE.YEAR')}
              keyboardType="phone-pad"
              maxLength={4}
              defaultValue={element.year}
              onChangeText={(text) =>
                this.handleInputSections(text, index, 'year')
              }
            />
          </View>
        </Card>
        {(this.state.awardsArray?.length==index+1)&&(
          <View style={{height:Platform.OS=='ios'?100:0}}></View>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{paddingBottom: 110}}>
        {this.Header()}
        {this.AddAwardsRecoginization()}
        {/* <ScrollView style={{ marginBottom: Platform.OS == "ios" ? 200: 0 }}> */}
        <ScrollView>
        <KeyboardAvoidingView
            behavior={"padding"}
            // style={{marginBottom:-50}}
            onPress={Keyboard.dismiss}>
          {!!this.state.awardsArray?.length &&
            this.state.awardsArray.map((element, index) => {
              return this.AwardsRecoginizationSection(element, index);
            })}
        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default withTranslation()(Awards);
