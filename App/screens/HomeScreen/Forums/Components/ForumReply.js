import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Card, CardItem} from 'native-base';
import moment from 'moment';

// custom components
import ViewMoreText from '../../Common/ViewMoreText';
//  images
import AvatarIcon from '../../../../assets/images/avatar.svg';
import ReplyIcon from '../../../../assets/images/reply.svg';
// styles
import styles from './ForumReplyStyles';

class ForumReply extends Component {
  constructor() {
    super();
    this.state = {
      showMore: false,
    };

    this.toggleExpandCollapse = this.toggleExpandCollapse.bind(this);
  }

  toggleExpandCollapse() {
    this.setState((prevState) => ({
      showMore: !prevState.showMore,
    }));
  }

  renderReplyCard(item, isChildReply) {
    const {t, replyTo} = this.props,
      {id, reply, user, created_at, child_replies} = item;

    return (
      <Card
        style={[styles.card, isChildReply ? styles.childReplyCard : {}]}
        key={id + created_at}>
        <CardItem
          style={[
            styles.replyCard,
            isChildReply ? styles.childReplyCardItem : {},
          ]}>
          <View style={[styles.postedView, styles.viewPadding]}>
            <View>
              <AvatarIcon width={20} height={20} />
            </View>
            <View style={styles.postedText}>
              <Text style={styles.postedByText}>
                {`${user?.salutation}. ${user?.first_name} ${user?.last_name}`},
              </Text>
              <Text style={styles.postedOnText}>
                {moment(created_at).format('L')}
                {','} {moment(created_at).format('LT')}
              </Text>
            </View>
          </View>

          <View style={[styles.replyView, styles.viewPadding]}>
            <ViewMoreText text={reply} style={styles.replyText} />
          </View>

          <View style={[styles.actionsView, styles.viewPadding]}>
            <View style={styles.replyActionView}>
              {!isChildReply && (
                <TouchableOpacity
                  style={styles.replyTouchableOpacity}
                  onPress={() => replyTo(item)}>
                  <ReplyIcon width={18} height={18} />
                  <Text style={styles.actionText}>{t('FORUMS.REPLY')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CardItem>

        {child_replies?.length > 0 && (
          <CardItem
            style={[
              styles.cardItem,
              !this.state.showMore ? styles.expandCollapseCardItem : {},
            ]}>
            <View style={styles.expandCollapseView}>
              <TouchableOpacity
                style={[
                  styles.expandCollapseTouchable,
                  this.state.showMore ? styles.expandedTouchable : {},
                ]}
                onPress={() => this.toggleExpandCollapse()}>
                <Text style={styles.expandCollapseText}>
                  {this.state.showMore
                    ? t('FORUMS.HIDE_REPLIES', {count: child_replies.length})
                    : t('FORUMS.SHOW_REPLIES', {count: child_replies.length})}
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.showMore &&
              child_replies.map((each) => this.renderReplyCard(each, true))}
          </CardItem>
        )}
      </Card>
    );
  }

  render() {
    const {item} = this.props;
    return <>{this.renderReplyCard(item, false)}</>;
  }
}

export default withTranslation()(ForumReply);
