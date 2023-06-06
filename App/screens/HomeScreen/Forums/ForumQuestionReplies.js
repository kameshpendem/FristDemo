import React, {Component} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Container, Content} from 'native-base';
import {withTranslation} from 'react-i18next';
import styles from './ForumQuestionRepliesStyle';
import FooterButton from '../Common/FooterButton';
import PostReplyModal from './Modals/PostReplyModal';
import ForumQuestion from './Components/ForumQuestion';
import ForumReply from './Components/ForumReply';
import AppLoader from '../Common/AppLoader';
import API from '../../../services/Api';

class ForumQuestionReplies extends Component {
  constructor() {
    super();
    this.state = {
      question: {},
      visible: false,
      isLoading: true,
      refreshing: false,
    };

    this.replyToThisPost = this.replyToThisPost.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.replyTo = this.replyTo.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const {params} = this.props.navigation.state;

    if (!params) {
      return;
    }

    const {question} = params;

    this.setState(
      {
        question: question,
      },
      () => this.getQuestionReplies(),
    );
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getQuestionReplies().then(() => {
      this.setState({refreshing: false});
    });
  };

  getQuestionReplies = async () => {
    try {
      this.setState({isLoading: true});
      const response = await API.call(
        'get',
        'v1/public/forums/question/' + this.state.question.id,
        {},
      );
      this.setState({
        question: response?.data || {},
      });
    } catch (error) {
      console.error('error', error);
    } finally {
      this.setState({isLoading: false});
    }
    this.getQuestionRepliesCount();
  };
  getQuestionRepliesCount=async()=>{
    try {
      this.setState({isLoading: true});
      const response = await API.call(
        'get',
        'v1/public/forums/question/'+this.state.question.id+'/replies/count',
        {},
      );
      this.setState({
        reply_count: response?.data || {},
      });
    } catch (error) {
      console.error('error', error);
    } finally {
      this.setState({isLoading: false});
    }
  };

  replyToThisPost() {
    this.setState({visible: true});
  }

  closeModal(value) {
    if (value) {
      this.getQuestionReplies();
    }
    this.setState({visible: false, reply: null});
  }

  replyTo(item) {
    this.setState({visible: true, reply: item});
  }

  renderPostReplyModal() {
    return (
      <PostReplyModal
        visible={this.state.visible}
        onDismiss={this.closeModal}
        token={this.props.token}
        question={this.state.question}
        reply={this.state.reply}
      />
    );
  }

  renderForumQuestion() {
    return <ForumQuestion item={this.state.question} />;
  }

  renderForumRepliesCount() {
    const {t} = this.props;
    return (
      <Text style={styles.repliesCountText} key={'replies-count'}
      testID="countText"
      accessibilityLabel="countText">
        {`${this.state.reply_count?.replies_count} ${t('FORUMS.REPLIES')}`}
      </Text>
    );
  }

  renderForumReplies() {
    return (
      <SafeAreaView style={styles.safeAreaView} key={'replies-list'}>
        <FlatList
          data={this.state.question.replies}
          renderItem={({item}) => (
            <ForumReply item={item} replyTo={this.replyTo} />
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    );
  }

  render() {
    const {t} = this.props;
    return (
      <Container style={styles.container}>
        {this.state.isLoading && <AppLoader />}
        <View style={styles.forumQuestion}>
          {!this.state.isLoading &&
            this.state.question &&
            this.renderForumQuestion()}
        </View>
        <Content style={styles.repliesContent}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            {!this.state.isLoading && [
              this.renderForumRepliesCount(),
              this.renderForumReplies(),
            ]}
          </ScrollView>
        </Content>
        <FooterButton
          label={t('FORUMS.REPLY_TO_THIS_POST')}
          onPress={this.replyToThisPost}
        />
        {this.state.visible && this.renderPostReplyModal()}
      </Container>
    );
  }
}

export default withTranslation()(ForumQuestionReplies);
