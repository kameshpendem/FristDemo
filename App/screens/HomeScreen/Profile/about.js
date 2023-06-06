import {
  View,
  Header,
  Left,
  Body,
  Title,
  Right,
  Toast as NativeBaseToast,
} from 'native-base';
import React, {Component} from 'react';
import {Text, TouchableOpacity, TextInput} from 'react-native';
import {Card} from 'react-native-paper';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import Icon3 from 'react-native-vector-icons/Feather';
import {withTranslation} from 'react-i18next';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import getBaseUrl from '../../../config/Config';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: {},
    };
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;
    const {about} = params;
    this.setState({
      about: about.replace(/(<([^>]+)>)/ig, ''),
    });
  }

  handleAboutText = (text) => {
    this.setState({
      about: text,
    });
  };

  init = async () => {
    const {t} = this.props;
    const doctorId = await AsyncStorage.getItem('doctorid');
    const jwt_token = await AsyncStorage.getItem('jwt_token');
    try {
      const url = getBaseUrl() + 'v1/doctor/' + doctorId;
      let aboutObject = this.state.about;
      const payload = {
        about: aboutObject,
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
      NativeBaseToast.show({
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
          <Body style={{marginLeft: -30}}>
            <Title style={{color: DEFAULT_WHITE_COLOR}}
              testID="editAboutTitle"
              accessibilityLabel="editAboutTitle">
              {t('PROFILE.EDITABOUT')}
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

  AboutSection() {
    const {t} = this.props;
    return (
      <View>
        <Card style={{margin: 20}}>
          <TextInput
            testID="aboutDoctorTextInput"
            accessibilityLabel="aboutDoctorTextInput"
            multiline
            style={{margin: 10}}
            placeholder={t('PROFILE.ABOUT_DOCTOR')}
            defaultValue={this.state.about ? this.state.about : ''}
            onChangeText={(text) => this.handleAboutText(text)}
          />
        </Card>

        <Text
          style={{
            marginLeft: 36,
            color: '#939393',
            fontSize: 14,
            fontFamily: 'NunitoSans-Regular',
          }}
          testID="thisWillDisplayInYourProfileText"
          accessibilityLabel="thisWillDisplayInYourProfileText">
          {t('PROFILE.THISWILLDISPLAYINYOURPROFILE')}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.Header()}
        {this.AboutSection()}
      </View>
    );
  }
}

export default withTranslation()(About);
