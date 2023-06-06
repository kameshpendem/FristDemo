import {View, Header, Left, Body, Title, Right, Toast} from 'native-base';
import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity,KeyboardAvoidingView,Keyboard} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import {withTranslation} from 'react-i18next';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {YearYYYY} from '../CovidMonitoring/Utils/DateTimeUtil';
import getBaseUrl from '../../../config/Config';

const researchObject = {
  res_name: '',
  res_along_with: '',
  year: '',
  published_in: '',
};
class Research extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: [],
      inputData: [],
      researchArray: [],
      researchId: [],
      researchObject: researchObject,
    };
  }

  componentDidMount() {
    const {researchArray, details} = this.props?.navigation?.state?.params;
    this.setState({
      researchArray: researchArray,
      details: details,
    });
  }

  addTextInput = () => {
    const researchObject = {
      res_name: '',
      res_along_with: '',
      year: '',
      published_in: '',
    };
    let researchArray = this.state.researchArray;
    researchArray.push(researchObject);
    this.setState({
      researchArray: researchArray,
    });
  };
  //function to remove TextInput dynamically
  removeIndexObject = (index) => {
    let inputData = [...this.state.researchArray];
    let researchId = this.state.researchId;
    let researchObject = inputData[index];
    if (researchObject.id) {
      researchId.push(researchObject.id);
    }
    inputData.splice(index, 1);
    this.setState({
      researchArray: inputData,
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

  handleTextInput = (text, index, type) => {
    const researchArray = this.state.researchArray;
    const editObject = researchArray[index];

    if (type === 'year' || type === 'published_in') {
      const dobYear = YearYYYY(this.state?.details?.dob);
      if (text.length >= 4) {
        if (parseInt(text) > dobYear) {
          editObject[type] = parseInt(text);
        } else {
          Toast.show({
            text: 'Please Enter Year > Date Of Birth',
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } else {
      editObject[type] = text;
    }

    researchArray[index] = editObject;
    this.setState({
      researchArray: researchArray,
    });
  };

  init = async () => {
    const {t} = this.props;
    const doctorId = await AsyncStorage.getItem('doctorid');
    const jwt_token = await AsyncStorage.getItem('jwt_token');
    try {
      const url = getBaseUrl() + 'v1/doctor/' + doctorId;
      let researchObject = this.state.researchArray;
      const delete_research = this.state.researchId;
      const payload = {
        research: researchObject,
        delete_research: delete_research,
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
             testID="editResearchTitle"
             accessibilityLabel="editResearchTitle">
              {t('PROFILE.EDITRESEARCH')}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.init()}>
              <Title style={{color: DEFAULT_WHITE_COLOR}}
               testID="saveTitle"
               accessibilityLabel="saveTitle">
                {' '}
                {t('PROFILE.SAVE')}
              </Title>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }

  AddResearchSection() {
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
                  color: APP_PRIMARY_COLOR,
                }}
                testID="addResearchText"
                accessibilityLabel="addResearchText">
                {t('PROFILE.ADDRESEARCH')}
              </Text>
            </View>

            <View style={{justifyContent: 'flex-end', marginRight: 16}}>
              <TouchableOpacity onPress={() => this.addTextInput()}>
                <Icon2
                testID="plusIcon"
                accessibilityLabel="plusIcon"
                  name="squared-plus"
                  style={{padding: 5, color: APP_PRIMARY_COLOR}}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    );
  }

  ResearchNameSection(element, index) {
    const {t} = this.props;
    return (
      <View style={{backgroundColor: 'white', marginTop: 10}}>
        <Card style={{paddingBottom: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text style={{marginLeft: 16, fontSize: 14}}
               testID="researchNameText"
               accessibilityLabel="researchNameText">
                {t('PROFILE.RESEARCHNAME')}
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
             testID="researchNameTextInput"
             accessibilityLabel="researchNameTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder={t('PROFILE.RESEARCHNAME')}
              defaultValue={element.res_name}
              onChangeText={(text) =>
                this.handleTextInput(text, index, 'res_name')
              }
            />
          </View>

          <View>
            <Text style={{marginLeft: 16, fontSize: 14, padding: 10}}
             testID="researchAlongWithText"
             accessibilityLabel="researchAlongWithText">
              {t('PROFILE.RESEARCHALONGWITH')}
            </Text>
          </View>

          <View style={{marginLeft: 16, marginRight: 16}}>
            <TextInput
             testID="researchAlongWithTextInput"
             accessibilityLabel="researchAlongWithTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder={t('PROFILE.RESEARCHALONGWITH')}
              defaultValue={element.res_along_with}
              onChangeText={(text) =>
                this.handleTextInput(text, index, 'res_along_with')
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
              maxLength={8}
              defaultValue={element.year}
              onChangeText={(text) => this.handleTextInput(text, index, 'year')}
            />
          </View>

          <View>
            <Text style={{marginLeft: 16, fontSize: 14, padding: 10}}
             testID="researchPublishedInText"
             accessibilityLabel="researchPublishedInText">
              {t('PROFILE.RESEARCHOUBLISHEDIN')}
            </Text>
          </View>

          <View style={{marginLeft: 16, marginRight: 16}}>
            <TextInput
             testID="researchPublishedInTextInput"
             accessibilityLabel="researchPublishedInTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder={t('PROFILE.RESEARCHOUBLISHEDIN')}
              keyboardType="phone-pad"
              defaultValue={element.published_in}
              onChangeText={(text) =>
                this.handleTextInput(text, index, 'published_in')
              }
            />
          </View>
        </Card>
        {(this.state.researchArray?.length==index+1)&&(
          <View style={{height:Platform.OS=='ios'?100:0}}></View>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={{paddingBottom: 100}}>
        {this.Header()}
        {this.AddResearchSection()}
        {/* <ScrollView style={{ marginBottom: Platform.OS == "ios" ? 110: 0 }}> */}
        <ScrollView>
        <KeyboardAvoidingView
            behavior={"padding"}
            // style={{ flex: 1 }}
            onPress={Keyboard.dismiss}>
          {!!this.state.researchArray?.length &&
            this.state.researchArray.map((element, index) => {
              return this.ResearchNameSection(element, index);
            })}
        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default withTranslation()(Research);
