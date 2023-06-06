import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Card, CardItem} from 'native-base';
import moment from 'moment';
import i18n from 'i18next';

// custom components
import ViewMoreText from '../../Common/ViewMoreText';
// images
import AvatarIcon from '../../../../assets/images/avatar.svg';
import ReplyIcon from '../../../../assets/images/reply.svg';
import DoctorIcon from '../../../../assets/images/doctor_icon.svg';
import API from '../../../../services/Api';
// styles
import styles from './ForumStyles';
class Forum extends Component {
  constructor() {
    super();
    this.state = {};
    this.navigateTo = this.navigateTo.bind(this);
  }

  navigateTo() {
    this.props.navigation?.navigate('ForumQuestionReplies', {
      question: this.props.item,
    });
  }

  getCount = async (id) => {
    try {
      const response = await API.call(
        'get',
        'v1/public/forums/question/' + id + '/replies/count',
        {},
      );
      let reply_count = response?.data.replies_count || 0;
      return reply_count;
    } catch (error) {
      console.error('error', error);
    }
  };
  componentDidMount = async () => {
    const {item} = this.props,
      {id} = item;
    if (id) {
      let rep_cnt = await this.getCount(id);
      this.setState({rep_count: rep_cnt});
    }
  };

  render() {
    const {item} = this.props,
      {question, created_at, replies, replies_count, user} = item,
      [reply] = replies;

    return (
      <Card style={styles.card}>
        <CardItem
          style={styles.cardItem}
          button
          onPress={() => this.navigateTo()}>
          <View style={[styles.questionView, styles.viewPadding]}>
            <ViewMoreText text={question} style={styles.questionText} 
            testID={question+"text"}
            accessibilityLabel={question+"text"}/>
          </View>

          <View
            style={[styles.postedView, styles.viewPadding, styles.paddingTop0]}>
            <Text style={styles.postedText}
            testID={user?.first_name+"byText"}
            accessibilityLabel={user?.first_name+"byText"}>
              {i18n.t('FORUMS.BY') + ' '}
              <Text style={styles.postedRepliedByText}
              testID={user?.first_name+"text"}
              accessibilityLabel={user?.first_name+"text"}>
                {`${user?.salutation}. ${user?.first_name} ${user?.last_name}`}
                {', '}
              </Text>

              <Text style={styles.postedRepliedOnText}
              testID={moment(created_at).format('L')+"text"}
              accessibilityLabel={moment(created_at).format('L')+"text"}>
                {moment(created_at).format('L')}
                {', '}
                {moment(created_at).format('LT')}
              </Text>
            </Text>
          </View>

          {reply?.id && (
            <>
              <View style={[styles.replyView, styles.viewPadding]}>
                <ViewMoreText text={reply.reply} style={styles.replyText} 
                testID={reply.reply+"text"}
                accessibilityLabel={reply.reply+"text"}/>
              </View>

              <View style={[styles.repliedView, styles.viewPadding]}>
                <View style={styles.repliedDetailsView}>
                  <View style={styles.repliedDetailsIconView}>
                    <DoctorIcon width={25} height={25} 
                    testID="doctorIcon"
                    accessibilityLabel="doctorIcon"/>
                  </View>
                  <View>
                    <Text style={styles.postedRepliedByText}
                    testID={reply.user?.first_name+"text"}
                    accessibilityLabel={reply.user?.first_name+"text"}>
                      {`${reply.user?.salutation}. ${reply.user?.first_name} ${reply.user?.last_name}`}
                    </Text>
                    <Text style={styles.postedRepliedOnText}
                    testID={moment(created_at).format('L')+"text"}
                    accessibilityLabel={moment(created_at).format('L')+"text"}>
                      {moment(created_at).format('L')}
                      {', '}
                      {moment(created_at).format('LT')}
                    </Text>
                  </View>
                </View>
                <View style={styles.totalRepliesView}>
                  <ReplyIcon width={18} height={18} 
                  testID="replyIcon"
                  accessibilityLabel="replyIcon"/>
                  <Text style={styles.totalRepliesText}
                  testID="countText"
                  accessibilityLabel="countText">
                    {this.state.rep_count ? this.state.rep_count : 0}
                  </Text>
                </View>
              </View>
            </>
          )}
        </CardItem>
      </Card>
    );
  }
}

export default withTranslation()(Forum);
