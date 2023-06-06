import {View, Header, Left, Body, Title, Right, Toast} from 'native-base';
import React, {Component} from 'react';
import {Text, TouchableOpacity, KeyboardAvoidingView,Keyboard} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Feather';
import {ScrollView} from 'react-native-gesture-handler';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {YearYYYY} from '../CovidMonitoring/Utils/DateTimeUtil';
import getBaseUrl from '../../../config/Config';

const publicationsObject = {
  name: '',
  publication_by: '',
  year: '',
};
class Publications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: 'true',
      textInput: [],
      inputData: [],
      text: '',
      loader: false,
      publicationsArray: [],
      publicationIds: [],
      publicationsObject: publicationsObject,
      details: {},
    };
  }

  componentDidMount() {
    const {publicationsArray, details} = this.props?.navigation?.state?.params;
    this.setState({
      publicationsArray: publicationsArray,
      details: details,
    });
  }

  addTextInput = () => {
    const publicationsObject = {
      name: '',
      publication_by: '',
      year: '',
    };
    const publicationsArray = this.state.publicationsArray;
    const obj = publicationsObject;
    publicationsArray.push(obj);
    this.setState({
      publicationsArray: publicationsArray,
    });
  };

  //function to remove TextInput dynamically
  removeIndexObject = (index) => {
    let inputData = [...this.state.publicationsArray];
    let publicationIds = this.state.publicationIds;
    let publicationObject = inputData[index];
    if (publicationObject.id) {
      publicationIds.push(publicationObject.id);
    }
    inputData.splice(index, 1);
    this.setState({
      publicationsArray: inputData,
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

  handleInputText = (text, index, type) => {
    let publicationsArray = this.state.publicationsArray;
    let object = publicationsArray[index];

    if (type === 'year') {
      const dobYear = YearYYYY(this.state?.details?.dob);
      if (text.length >= 4) {
        if (parseInt(text) > dobYear) {
          object[type] = parseInt(text);
        } else {
          Toast.show({
            text: 'Please Enter Year > Date Of Birth',
            type: 'danger',
            duration: 3000,
          });
        }
      }
    } else {
      object[type] = text;
    }
    publicationsArray[index] = object;
    this.setState({
      publicationsArray: publicationsArray,
    });
  };

  init = async () => {
    const {t} = this.props;
    const doctorId = await AsyncStorage.getItem('doctorid');
    const jwt_token = await AsyncStorage.getItem('jwt_token');
    try {
      // const url = 'https://dev.rxconcent.com/api/v1/doctor/' + doctorId;
      const url = getBaseUrl() + 'v1/doctor/' + doctorId;
      let publicationObject = this.state.publicationsArray;
      const delete_publications = this.state.publicationIds;
      const payload = {
        publications: publicationObject,
        delete_publications: delete_publications,
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
             testID="editPublicationsTitle"
             accessibilityLabel="editPublicationsTitle">
              {t('PROFILE.EDITPUBLICATIONS')}
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

  AddPublications() {
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
                testID="addPublicationsText"
                accessibilityLabel="addPublicationsText">
                {t('PROFILE.ADDPUBLICATIONS')}
              </Text>
            </View>

            <View style={{justifyContent: 'flex-end', marginRight: 16}}>
              <TouchableOpacity
                onPress={() =>
                  this.addTextInput(this.state.publicationsArray.length)
                }>
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

  PublicationsSections(element, index) {
    const {t} = this.props;
    return (
      <View style={{backgroundColor: 'white', marginTop: 10}}>
        <Card style={{paddingBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
            }}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text style={{marginLeft: 16, fontSize: 14}}
               testID="publicationNameText"
               accessibilityLabel="publicationNameText">
                {t('PROFILE.PUBLICATIONNAME')}
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
             testID="publicationNameTextInput"
             accessibilityLabel="publicationNameTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder= {t('PROFILE.PUBLICATIONNAME')}
              defaultValue={element.name}
              onChangeText={(text) => this.handleInputText(text, index, 'name')}
            />
          </View>

          <View>
            <Text style={{marginLeft: 16, fontSize: 14, padding: 10}}
             testID="publishedByText"
             accessibilityLabel="publishedByText">
              {t('PROFILE.PUBLISHEDBY')}
            </Text>
          </View>

          <View style={{marginLeft: 16, marginRight: 16}}>
            <TextInput
             testID="publishedByTextInput"
             accessibilityLabel="publishedByTextInput"
              style={{height: 30, backgroundColor: 'white'}}
              placeholder={t('PROFILE.PUBLISHEDBY')}
              defaultValue={element.publication_by}
              onChangeText={(text) =>
                this.handleInputText(text, index, 'publication_by')
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
              placeholder= {t('PROFILE.YEAR')}
              maxLength={4}
              returnKeyType="done"
              keyboardType="phone-pad"
              defaultValue={element.year}
              onChangeText={(text) => this.handleInputText(text, index, 'year')}
            />
          </View>
        </Card>
        {(this.state.publicationsArray?.length==index+1)&&(
          <View style={{height:Platform.OS=='ios'?100:0}}></View>
        )}
      </View>
    );
  }
  render() {
    return (
      <View style={{paddingBottom: 110}}>
        {this.Header()}
        {this.AddPublications()}
        {/* <ScrollView style={{ marginBottom: Platform.OS == "ios" ? 260: 0 }}> */}
        <ScrollView>
        <KeyboardAvoidingView
            behavior={"padding"}
            // style={{ flex: 1 }}
            onPress={Keyboard.dismiss}>
          {!!this.state.publicationsArray?.length &&
            !this.state.loader &&
            this.state.publicationsArray.map((element, index) => {
              return this.PublicationsSections(element, index);
            })}
        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}
export default withTranslation()(Publications);
