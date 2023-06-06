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
import {Text, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';
import {APP_PRIMARY_COLOR, DEFAULT_WHITE_COLOR} from '../../../themes/variable';
import Icon3 from 'react-native-vector-icons/Feather';
import {CheckBox} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import {doctorPutMethod} from '../../../services/DoctorProfileService.js';
import Toast from 'react-native-simple-toast';
class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageArray: [],
      languages: {},
      deleteIds: [],
      newLanguages: [],
    };
  }
  componentDidMount() {
    let {languages} = this.props?.navigation?.state?.params;

    languages = languages.filter(
      (element, index, self) =>
        index === self.findIndex((object) => object.label === element.label),
    );

    this.setState({
      languageArray: languages,
    });
  }

  init = async () => {
    // if (this.state.newLanguages.length === 0) {
    //   Toast.show('Please Select Atlest One Language', Toast.SHORT);
    // } else {
    const {t} = this.props;
    let newLanguages = this.state.newLanguages;
    const deleteIds = this.state.deleteIds;
    const languages = this.state.languageArray;

    if (languages.length === deleteIds.length) {
      Toast.show(t('PROFILE.SELECT_LANGUAGE_ERROR'), Toast.SHORT);
    } else {
      try {
        newLanguages = newLanguages.filter(
          (element, index, self) =>
            index ===
            self.findIndex((object) => object.label === element.label),
        );
        const payload = {
          languages: newLanguages,
          delete_languages: deleteIds,
        };
        let Response = await doctorPutMethod(payload);
        if (Response) {
          this.props.navigation.goBack();
        }
      } catch (error) {
        nativeBaseToast.show({
          text: (error && error.message) || t('PROFILE.DATANOTSAVED'),
          duration: 5000,
        });
      }
    }
    // }
  };

  handleLanguages = (label) => {
    const languages = this.state.languageArray;

    let deleteIds = this.state.deleteIds;

    let newLanguages = this.state.newLanguages;

    let objIndex = null;

    let newLanguageIndex = null;

    // index of language label
    languages.forEach((element, index) => {
      if (element.label.toLowerCase() === label) {
        objIndex = index;
      }
    });

    newLanguages.forEach((element, index) => {
      if (element.label.toLowerCase() === label) {
        newLanguageIndex = index;
      }
    });

    if (objIndex !== null) {
      // language object
      let obj = languages[objIndex];
      // if object has id
      if (obj.id) {
        if (obj.value) {
          obj.label = '';
          deleteIds.push(obj.id);
          // need to add language id to delete array
        } else {
          obj.value = label;
          deleteIds.splice(objIndex, 1);
          // need to remove language id from array
        }
        languages[objIndex] = obj;
      } else {
        newLanguages.splice(newLanguageIndex, 1);
        languages.splice(objIndex, 1);
      }
      this.setState({
        languageArray: languages,
        deleteIds: deleteIds,
        newLanguages: newLanguages,
      });
    } else {
      let newObj = {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value: label,
        category: 'doctor',
      };
      languages.push(newObj);
      newLanguages.push(newObj);
      this.setState({
        languageArray: languages,
        newLanguages: newLanguages,
        deleteIds: deleteIds,
      });
    }
    return;
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
            testID="editLanguageTitle"
            accessibilityLabel="editLanguageTitle">
              {' '}
              {t('PROFILE.EDITLANGUAGE')}
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
  handleCheck = (value) => {
    const languages = this.state.languageArray;
    let flag = false;
    languages.forEach((element) => {
      if (element?.label?.toLowerCase() === value) {
        flag = true;
      }
    });
    return flag;
  };

  LanguageSection() {
    const {t} = this.props;
    return (
      <View>
        <Card>
          <Text
            style={{
              marginTop: 18,
              marginLeft: 16,
              marginRight: 36,
              color: '#a9a9a9',
              fontSize: 14,
            }}
            testID="selectLanguageWhichYouCanSpeakText"
              accessibilityLabel="selectLanguageWhichYouCanSpeakText">
            {t(
              'PROFILE.SELECTLANGUAGEWHICHYOUCANSPEAKTHESELANGUAGESWILLAPPEARONYOURPROFILE',
            )}
          </Text>

          <CheckBox
           testID="englishTextBox"
           accessibilityLabel="englishTextBox"
            title={t('LANGUAGE.ENGLISH')}
            checked={this.handleCheck('english')}
            onPress={() => this.handleLanguages('english')}
          />
          <CheckBox
           testID="hindiTextBox"
           accessibilityLabel="hindiTextBox"
            title={t('LANGUAGE.HINDI')}
            checked={this.handleCheck('hindi')}
            onPress={() => this.handleLanguages('hindi')}
          />
          <CheckBox
           testID="teluguTextBox"
           accessibilityLabel="teluguTextBox"
            title={t('LANGUAGE.TELUGU')}
            checked={this.handleCheck('telugu')}
            onPress={() => this.handleLanguages('telugu')}
          />
          <CheckBox
            testID="tamilTextBox"
            accessibilityLabel="tamilTextBox"
            title={t('LANGUAGE.TAMIL')}
            checked={this.handleCheck('tamil')}
            onPress={() => this.handleLanguages('tamil')}
          />
        </Card>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.Header()}
        {!!this.state.languageArray && this.LanguageSection()}
        {/* {!!this.state.languageArray?.length && this.LanguageSection()} */}
      </View>
    );
  }
}

export default withTranslation()(Language);
