import React, {Component} from 'react';
import {
  FlatList,
  View,
  ScrollView,
  RefreshControl,
  Text,
  Image,
} from 'react-native';
import {Container, Toast, Icon, Input, Content, Item} from 'native-base';
import {withTranslation} from 'react-i18next';
import styles from './ForumsStyle';
import {Picker} from '@react-native-picker/picker';
import {
  APP_PRIMARY_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  INPUT_BORDER_COLOR,
  DEFAULT_WHITE_COLOR,
} from '../../../themes/variable';
import PostQuestionModal from './Modals/PostQuestionModal';
import Forum from './Components/Forum';
import AppLoader from '../Common/AppLoader';
import API from '../../../services/Api';
import {hp, wp} from '../../../themes/Scale';
// images
import ForumsIllustration from '../../../assets/images/forums_illustration.png';
import i18n from '../../../../i18n';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
class Forums extends Component {
  constructor() {
    super();
    this.state = {
      categoryList: [],
      topicList: [
        {value: 'symptoms', label:i18n.t('COMMON.SYMPTOMS')},
        {value: 'treatment', label: i18n.t('COMMON.TREATMENT')},
        {value: 'info', label: i18n.t('COMMON.INFO')},
      ],
      forums: [],
      visible: false,
      isLoading: true,
      limit: 0,
      offset: 0,
      topic: '',
      category: '',
      refreshing: false,
      opacity: 1,
    };

    this.askAQuestion = this.askAQuestion.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.getCategoryList();
    this.getForumsData();
  }

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        limit: 0,
        offset: 0,
        topic: '',
        category: '',
      },
      () =>
        this.getForumsData().then(() => {
          this.setState({refreshing: false});
        }),
    );
    // this.getForumsData().then(() => {
    //   this.setState({refreshing: false});
    // });
  };

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
      });
    } catch (error) {
      Toast.show({
        text: (error && error.message) || t('FORUMS.CATEGORY_ERROR_MESSAGE'),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  getForumsData = async () => {
    const {t} = this.props;
    try {
      this.setState({isLoading: true});
      const queryParams = {
        category: this.state.category,
        topic: this.state.topic,
        question: this.state.question,
        limit: this.state.limit,
        offset: this.state.offset,
      };
      let url = 'v1/public/forums/question/all';
      const params = [];
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          value && params.push(key + '=' + encodeURIComponent(value));
        });
      }
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const response = await API.call('get', url, {});
      this.setState({
        forums: response?.data?.questions || [],
        opacity: 1,
      });
    } catch (error) {
      Toast.show({
        text: (error && error.message) || t('FORUMS.FORUMS_DATA_ERROR_MESSAGE'),
        type: 'danger',
        duration: 3000,
      });
    } finally {
      this.setState({isLoading: false});
    }
  };

  askAQuestion() {
    this.setState({visible: true});
  }

  closeModal(value) {
    if (value) {
      this.getForumsData();
    }
    this.setState({visible: false});
  }

  onCategoryChange(value) {
    this.setState({category: value}, () => this.getForumsData());
  }

  onTopicChange(value) {
    this.setState({topic: value}, () => this.getForumsData());
  }

  onQuestionChangeText(text) {
    this.setState({question: text}, () => this.getForumsData());
  }

  renderPickerItem(label, value) {
    return <Picker.Item key={value} label={label} value={value} />;
  }

  renderFilters() {
    const {t} = this.props;
    return (
      <View style={styles.inputFieldsView}>
        <View style={[styles.eachInputFieldView]}>
          {/* <View style={[styles.inputField, styles.pickerField]}> */}
          {Platform.OS == 'android' ? (
          <View
            style={{
              borderColor: INPUT_BORDER_COLOR,
              borderWidth: 1,
              borderRadius: wp(8),
              backgroundColor: DEFAULT_WHITE_COLOR,
              height: hp(55),
            }}>
            <Picker
            testID="selectCategoryDropDown"
            accessibilityLabel="selectCategoryDropDown"
              iosIcon={<Icon name="ios-caret-down" />}
              placeholderStyle={{width: '100%'}}
              style={{width: undefined}}
              selectedValue={this.state.category}
              onValueChange={this.onCategoryChange.bind(this)}>
              <Picker.Item
                label={t('FORUMS.SELECT_CATEGORY')}
                value=""
                style={styles.pickerText}
              />
              {this.state.categoryList.map((each) =>
                this.renderPickerItem(
                  each.specialization_type_name,
                  each.specialization_type_value,
                ),
              )}
            </Picker>
          </View>
          ) : (
            <View>
            <SelectDropdown
              data={this.state.categoryList}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem.id, index);
                this.onCategoryChange.bind(this);
              }}
              defaultButtonText={t('FORUMS.SELECT_CATEGORY')}
              buttonTextAfterSelection={(selectedItem, index) => {
                console.log('selectedItem selectedItem 555', selectedItem);
                return selectedItem?.specialization_type_name
              }}
              rowTextForSelection={(item, index) => {
                return item.specialization_type_name;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return (
                  <Feather
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
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
            </View>
          )}
        </View>
        <View style={styles.eachInputFieldView}>
          {/* <View style={[styles.inputField, styles.pickerField]}> */}
          {Platform.OS == 'android' ? (
          <View
            style={{
              borderColor: INPUT_BORDER_COLOR,
              borderWidth: 1,
              borderRadius: wp(8),
              backgroundColor: DEFAULT_WHITE_COLOR,
              height: hp(55),
            }}>
            <Picker
            testID="selectTopoicPicker"
            accessibilityLabel="selectTopoicPicker"
              iosIcon={<Icon name="ios-caret-down" 
              testID="arrowIcon"
            accessibilityLabel="arrowIcon"/>}
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
          ) : (
            <SelectDropdown
              data={this.state.topicList}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem.id, index);
                this.onTopicChange.bind(this);
              }}
              defaultButtonText={t('FORUMS.SELECT_TOPIC')}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              buttonStyle={styles.dropdown4BtnStyle}
              buttonTextStyle={styles.dropdown4BtnTxtStyle}
              renderDropdownIcon={isOpened => {
                return (
                  <Feather
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
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
          )}
        </View>
        <View style={styles.eachInputFieldView}>
          <Input
          testID="searchQuestionInput"
          accessibilityLabel="searchQuestionInput"
            defaultValue={this.state.question}
            style={styles.searchField}
            onChangeText={(text) => this.onQuestionChangeText(text)}
            placeholder={t('FORUMS.SEARCH_QUESTION')}
            placeholderTextColor={'#9A9A9A'}
          />
        </View>
      </View>
    );
  }

  renderForums() {
    return (
      <View>
        <FlatList
          data={this.state.forums}
          renderItem={({item}) => (
            <Forum item={item} navigation={this.props.navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }

  renderPostQuestionModal() {
    return (
      <PostQuestionModal
        visible={this.state.visible}
        onDismiss={this.closeModal}
        token={this.props.token}
      />
    );
  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    this.setState({
      opacity: 0.5,
    });
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  render() {
    const {t} = this.props;
    return (
      <Container style={styles.flex}>
        <View>
          <View
            style={[
              styles.forumsIllustrationView,
              this.state.forums.length > 0 ? {} : styles.height75,
            ]}>
            <View style={styles.forumIllustrationImageView}>
              <Image source={ForumsIllustration}
              testID="forumsImage"
              accessibilityLabel="forumsImage"></Image>
              <Text style={styles.heAlphaHealthForumsText}
              testID="healphaHealthForumsText"
              accessibilityLabel="healphaHealthForumsText">
                {t('FORUMS.HE_ALPHA_HEALTH_FORUMS')}
              </Text>
              <Text style={styles.subText}
              testID="healphaHealthForumsDiscussText"
              accessibilityLabel="healphaHealthForumsDiscussText">
                {t('FORUMS.HE_ALPHA_HEALTH_FORUMS_DISCUSS')}
              </Text>
              <Text style={styles.subText}
              testID="chatWithDoctorText"
              accessibilityLabel="chatWithDoctorText">
                {t('FORUMS.HE_ALPHA_HEALTH_FORUMS_CHAT_WITH_DOCTOR')}
              </Text>
            </View>
          </View>

          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            onMomentumScrollBegin={() => {
              this.setState({
                opacity: 0.3,
              });
            }}
            onMomentumScrollEnd={() => {
              this.setState({
                opacity: 1,
              });
            }}
            onScroll={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent)) {
                this.setState(
                  {
                    limit: this.state.limit,
                    offset: this.state.offset + 1,
                    isLoading: true,
                  },
                  () => this.getForumsData(),
                );
              }
            }}
            scrollEventThrottle={4000}>
            <View style={[styles.linearGradient, styles.forumSectionMarginTop]}>
              {this.renderFilters()}
              {this.state.isLoading && <AppLoader />}
              {!this.state.isLoading && this.renderForums()}
            </View>
          </ScrollView>

          {this.state.visible && this.renderPostQuestionModal()}
        </View>
        {/* <FooterButton
          label={t('FORUMS.ASK_A_QUESTION')}
          onPress={this.askAQuestion}
        /> */}
        {this.state.visible && this.renderPostQuestionModal()}
      </Container>
    );
  }
}

export default withTranslation()(Forums);
