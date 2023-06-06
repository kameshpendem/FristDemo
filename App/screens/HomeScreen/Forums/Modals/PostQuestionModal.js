import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Linking} from 'react-native';
import {withTranslation} from 'react-i18next';
import { Toast, Textarea, Input, Icon} from 'native-base';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';

// API service
import API from '../../../../services/Api';
// images
import CloseIcon from '../../../../assets/images/close.svg';
// custom components
import FooterButton from '../../Common/FooterButton';
// styles
import styles from './PostQuestionModalStyles';
import AppLoader from '../../Common/AppLoader';
import i18n from '../../../../../i18n';

class PostQuestionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      topicList: [
        {value: 'symptoms', label:i18n.t('COMMON.SYMPTOMS')},
        {value: 'treatment', label: i18n.t('COMMON.TREATMENT')},
        {value: 'info', label: i18n.t('COMMON.INFO')},
      ],
      category: '',
      topic: '',
      question: '',
      loader: false,
    };

    this.onQuestionChangeText = this.onQuestionChangeText.bind(this);
    this.postQuestion = this.postQuestion.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        loader: true,
      },
      () => this.init(),
    );
  }

  init() {
    this.getCategoryList();
  }

  getCategoryList = async () => {
    const {t} = this.props;
    try {
      const response = await API.call(
        'get',
        'v1/public/specialization/search?search_text',
        {},
      );
      this.setState({
        categoryList: response?.data?.specializations || [],
        loader: false,
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        text: error?.message || t('FORUMS.CATEGORY_ERROR_MESSAGE'),
        type: 'danger',
        duration: 5000,
      });
    }
  };

  onCategoryChange(value) {
    this.setState({category: value});
  }

  onTopicChange(value) {
    this.setState({topic: value});
  }

  onQuestionChangeText(text) {
    this.setState({question: text});
  }

  postQuestion = async () => {
    const {t} = this.props;
    try {
      if (!this.state.category || !this.state.topic || !this.state.question) {
        return;
      }
      const payload = {
        category: this.state.category,
        topic: this.state.topic,
        question: this.state.question,
        user_id: global.doctor_id,
        user_type: 'doctor'
      };
      const response = await API.call(
        'post',
        'v1/public/forums/question/create',
        payload,
      );
      Toast.show({
        text: response?.message || t('FORUMS.SUCCESS_POSTED_MESSAGE'),
        type: 'success',
        duration: 5000,
      });
      this.props.onDismiss(true);
    } catch (error) {
      Toast.show({
        text: (error && error.message) || t('FORUMS.POST_ERROR_MESSAGE'),
        type: 'danger',
        duration: 5000,
        position: 'top',
      });
    }
  };

  renderPickerItem(label, value) {
    return <Picker.Item key={value} label={label} value={value}  style={styles.pickerText} />;
  }

  renderModalView() {
    const {t} = this.props;

    return (
      <View>
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalHeaderLabel}
            testID="askYourQuestionText"
            accessibilityLabel="askYourQuestionText">
              {t('FORUMS.ASK_YOUR_QUESTION')}
            </Text>
            <Text style={styles.modalHeaderDescription}
            testID="askYourQuestionText"
            accessibilityLabel="askYourQuestionText">
              {t('FORUMS.GET_ANSWER_FROM_HEALTH_EXPERTS')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.props.onDismiss(false)}
          testID="askYourQuestionText"
          accessibilityLabel="askYourQuestionText">
            <CloseIcon style={styles.cancelIcon} 
            testID="askYourQuestionText"
            accessibilityLabel="askYourQuestionText"/>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={styles.inputFieldsView}>
            <View style={styles.eachInputFieldView}>
              {/* <Text style={styles.inputFieldLabel}>{t('FORUMS.CATEGORY')}</Text> */}
              <View style={[styles.inputField, styles.pickerField]}>
                <Picker
                testID="askYourQuestionText"
                accessibilityLabel="askYourQuestionText"
                  iosIcon={<Icon name="ios-caret-down" />}
                  style={{width: undefined}}
                  selectedValue={this.state.category}
                  onValueChange={this.onCategoryChange.bind(this)}>
                  <Picker.Item label={t('FORUMS.SELECT_CATEGORY')} value="" style={styles.pickerText}/>
                  {this.state.categoryList.map((each) =>
                    this.renderPickerItem(
                      each.specialization_type_name,
                      each.specialization_type_value,
                    ),
                  )}
                </Picker>
              </View>
            </View>
            <View style={styles.eachInputFieldView}>
              {/* <Text style={styles.inputFieldLabel}>{t('FORUMS.TOPIC')}</Text> */}
              <View style={[styles.inputField, styles.pickerField]}>
                <Picker
                testID="askYourQuestionText"
                accessibilityLabel="askYourQuestionText"
                  iosIcon={<Icon name="ios-caret-down" />}
                  style={{width: undefined}}
                  selectedValue={this.state.topic}
                  onValueChange={this.onTopicChange.bind(this)}>
                  <Picker.Item
                    label={t('FORUMS.SELECT_TOPIC')}
                    value=""
                    style={styles.pickerText}
                  />
                  {this.state.topicList.map((each) =>
                    this.renderPickerItem(each.label, each.value),
                  )}
                </Picker>
              </View>
            </View>
            <View style={styles.eachInputFieldView}>
              {/* <Text style={styles.inputFieldLabel}>{t('FORUMS.QUESTION')}</Text> */}
              <Textarea
              testID="askYourQuestionText"
              accessibilityLabel="askYourQuestionText"
                defaultValue={this.state.question}
                style={styles.input}
                onChangeText={(text) => this.onQuestionChangeText(text)}
                placeholder={t('FORUMS.ASK_HERE')}
                placeholderTextColor={'#9D9D9D'}
                rowSpan={4}
                textAlignVertical={'top'}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  navigateToTermsSection = () => {
    const {t} = this.props;
    try {
      Linking.openURL('https://www.healpha.com/terms-of-service/');
    } catch (error) {
      Toast.show({
        text:
          (error && error.message) || t('LOGIN.TERMS_OF_SERVICE_OPEN_ERROR'),
        type: 'warning',
        duration: 3000,
        position: 'top',
      });
    }
  };

  render() {
    const {t} = this.props;
    return (
      <Modal
        isVisible={this.props.visible}
        backdropOpacity={0.5}
        onBackdropPress={() => this.props.onDismiss(false)}
        style={styles.modalMargins}>
        {this.state.loader && <AppLoader />}
        {!this.state.loader && (
          <ScrollView style={styles.modalStyles}>
            {this.renderModalView()}
          </ScrollView>
        )}
        {!this.state.loader && (
          <View style={styles.agreeView}>
            <Text style={styles.agreeText}
            testID="askYourQuestionText"
            accessibilityLabel="askYourQuestionText">
              {t('MESSAGES.BY_SUBMITTING_YOU_AGREE_TO_HEALPHA')}{' '}
              <Text
                style={styles.termsOfService}
                onPress={() => this.navigateToTermsSection()}
                testID="askYourQuestionText"
            accessibilityLabel="askYourQuestionText">
                {t('MESSAGES.TERMS_OF_SERVICE')}
              </Text>
            </Text>
          </View>
        )}

        {!this.state.loader && (
          <FooterButton
            label={t('FORUMS.POST_QUESTION')}
            onPress={this.postQuestion}
          />
        )}
      </Modal>
    );
  }
}

export default withTranslation()(PostQuestionModal);
