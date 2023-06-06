import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Toast} from 'native-base';
import Modal from 'react-native-modal';

// api service
import API from '../../../../services/Api';
// images
import CloseIcon from '../../../../assets/images/close.svg';
// custom components
import FooterButton from '../../Common/FooterButton';
// styles
import styles from './PostReplyModalStyles';

class PostReplyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: '',
      user: {},
      isReplyToPost: false,
    };

    this.onReplyChangeText = this.onReplyChangeText.bind(this);
    this.postReply = this.postReply.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const user = this.props.reply?.user || this.props.question?.user;
    const isReplyToPost = !this.props.reply?.id;
    this.setState({user, isReplyToPost});
  }

  onReplyChangeText(text) {
    this.setState({reply: text});
  }

  postReply = async () => {
    const {t} = this.props;
    try {
      if (!this.state.reply) {
        return;
      }

      const payload = {
        question_id: this.props.question.id,
        reply: this.state.reply,
        parent_reply_id: null,
        user_id: global.doctor_id,
        user_type: 'doctor'
      };
      if (!this.state.isReplyToPost && this.props.reply?.id) {
        payload.parent_reply_id = this.props.reply.id;
      }

      const response = await API.call(
        'post',
        'v1/public/forums/reply/create',
        payload,
      );
      Toast.show({
        text: response?.message || t('FORUMS.REPLY_SUCCESS'),
        type: 'success',
        duration: 5000,
      });
      this.props.onDismiss(true);
    } catch (error) {
      Toast.show({
        text: error?.message || t('FORUMS.REPLY_ERROR'),
        type: 'danger',
        duration: 5000,
        position: 'top',
      });
    }
  };

  renderModalView() {
    const {t} = this.props;
    return (
      <View>
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalHeaderLabel}
            testID={"replyTo"+this.state.user.first_name}
            accessibilityLabel={"replyTo"+this.state.user.first_name}>
              {t('FORUMS.REPLY_TO_NAME', {
                name: `${this.state.user.salutation}. ${this.state.user.first_name} ${this.state.user.last_name}`,
              })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.props.onDismiss(false)}
          testID="closeTouch"
          accessibilityLabel="closeTouch">
            <CloseIcon style={styles.cancelIcon} 
            testID="closeIcon"
            accessibilityLabel="closeIcon"/>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <View style={styles.inputFieldsView}>
            <View style={styles.eachInputFieldView}>
              {/* <Text style={styles.inputFieldLabel}>{t('FORUMS.REPLY')}</Text> */}
              <TextInput
              testID="typeYourReplyTextInput"
              accessibilityLabel="typeYourReplyTextInput"
                defaultValue={this.state.reply}
                style={styles.inputField}
                onChangeText={(text) => this.onReplyChangeText(text)}
                placeholder={t('FORUMS.TYPE_YOUR_REPLY')}
                multiline
                numberOfLines={5}
                textAlignVertical={'top'}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {t} = this.props;
    return (
      <Modal
        avoidKeyboard
        isVisible={this.props.visible}
        backdropOpacity={0.5}
        onBackdropPress={() => this.props.onDismiss(false)}
        style={styles.modalMargins}>
        <ScrollView style={styles.modalStyles}>
          {this.renderModalView()}
        </ScrollView>
        <FooterButton label={t('FORUMS.POST_REPLY')} onPress={this.postReply} />
      </Modal>
    );
  }
}

export default withTranslation()(PostReplyModal);
