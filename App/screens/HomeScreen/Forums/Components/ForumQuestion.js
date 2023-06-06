import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Card, CardItem} from 'native-base';
import moment from 'moment';

// custom components
import ViewMoreText from '../../Common/ViewMoreText';
// styles
import styles from './ForumQuestionStyles';

class ForumQuestion extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {item} = this.props,
      {question, created_at, user} = item;

    return (
      <Card style={styles.card}>
        <CardItem style={styles.cardItem}>
          <View style={[styles.questionView, styles.viewPadding]}>
            <ViewMoreText text={question} style={styles.questionText} />
          </View>
          <View
            style={[styles.postedView, styles.viewPadding, styles.paddingTop0]}>
            <Text style={styles.postedText}
            testID={"by"+user?.first_name}
            accessibilityLabel={"by"+user?.first_name}>
              {'By '}
              <Text style={styles.postedByText}
              testID={user?.first_name+"text"}
              accessibilityLabel={user?.first_name+"text"}>
                {`${user?.salutation}. ${user?.first_name} ${user?.last_name}`}
                {', '}
              </Text>

              <Text style={styles.postedOnText}
              testID={moment(created_at).format('LT')+"text"}
              accessibilityLabel={moment(created_at).format('LT')+"text"}>
                {moment(created_at).format('L')},{' '}
                {moment(created_at).format('LT')}
              </Text>
            </Text>
          </View>
        </CardItem>
      </Card>
    );
  }
}

export default withTranslation()(ForumQuestion);
