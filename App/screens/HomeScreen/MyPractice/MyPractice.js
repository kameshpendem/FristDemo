import React, {Component} from 'react';
import {Container, Tab, Tabs, DefaultTabBar} from 'native-base';
import {withTranslation} from 'react-i18next';

// components
import Requests from './Requests/Requests';
import Practices from './Practices/Practices';

// styles
import styles from './MyPracticeStyles';

class MyPractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: 0,
      activePage: 0,
    };
    this.onChangeTab = this.onChangeTab.bind(this);
    this.updateActiveTab = this.updateActiveTab.bind(this);
    this.redirectToNotifications = this.redirectToNotifications.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      redirectToNotifications: this.redirectToNotifications,
    });
  }

  redirectToNotifications() {
    this.props.navigation.navigate('notificationsList');
  }

  updateTab(value) {
    if (value === 0) {
      this.Practices.init();
    }
    setTimeout(() => {
      if (value === 0) {
        this.Practices.init();
      } else if (value === 1) {
        this.Requests.init();
      }
    }, 1000);
  }

  updateActiveTab(value) {
    this.setState({activePage: value}, () => this.updateTab(value));
  }

  renderEachTab(heading, TabComponent, refId,testID) {
    return (
      <Tab
      testID={testID}
      accessibilityLabel={testID}
        heading={heading}
        tabStyle={styles.tabStyle}
        textStyle={styles.textStyle}
        activeTabStyle={styles.activeTabStyles}
        activeTextStyle={styles.activeTextStyles}>
        <TabComponent
          onRef={(ref) => (this[refId] = ref)}
          navigation={this.props.navigation}
          updateActiveTab={this.updateActiveTab}
        />
      </Tab>
    );
  }

  onChangeTab({i, from, ref}) {
    if (i === this.state.activePage) {
      return;
    }
    this.setState({activePage: i});
  }

  renderTabBar(props) {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  }

  renderTabs() {
    const {t} = this.props;
    return (
      <Container>
        <Tabs
          initialPage={this.state.initialPage}
          page={this.state.activePage}
          onChangeTab={(e) => {
            this.onChangeTab(e);
          }}
          locked={true}
          tabBarUnderlineStyle={styles.indicatorStyles}
          renderTabBar={this.renderTabBar.bind(this)}>
          {this.renderEachTab(
            t('MY_PRACTICES.PRACTICES_TITLE'),
            Practices,
            'Practices',
            "practicesTab"
          )}
          {this.renderEachTab(
            t('MY_PRACTICES.REQUESTS_TITLE'),
            Requests,
            'Requests',
            "requestsTab"
          )}
        </Tabs>
      </Container>
    );
  }

  render() {
    return <Container>{this.renderTabs()}</Container>;
  }
}

export default withTranslation()(MyPractice);
