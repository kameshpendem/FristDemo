import React, {Component} from 'react';
import {BackHandler, Alert} from 'react-native';
import {
  Image,
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Thumbnail,
  Row,
  Col,
  Item,
  Icon,
  Input,
  Footer,
  FooterTab,
  Button,
} from 'native-base';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import i18n from '../../../i18n';

class BookingInfo extends Component {
  static navigationOptions = {
    headerLeft: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.state.params.data,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    let mydata = JSON.parse(this.state.data);
    Alert.alert(
      i18n.t('BOOKING.SUCCESS'),
      i18n.t('BOOKING.YOUR_APPOINTMENT_BOOKED'),
      [
        {
          text: i18n.t('BOOKING.OKAY'),
          onPress: () =>
            this.props.navigation.navigate('LandingPage', {
              branch_id: mydata.branchid,
              branch_name: mydata.branchname,
            }),
        },
      ],
      {cancelable: false},
    );
    return true;
  };

  render() {
    //    const {} = Styles;
    let mydata = JSON.parse(this.state.data);
    // alert(mydata.date);
    return (
      <Container>
        <Content style={{backgroundColor: '#EEEEEE'}}>
          <Row style={{justifyContent: 'center', marginTop: 70}}>
            <Thumbnail
              source={require('../../assets/images/calendar.png')}
              style={{height: 150, width: 150}}
            />
          </Row>
          <Body style={{justifyContent: 'center', paddingTop: 100}}>
            <Row>
              <Text
                style={{
                  fontSize: 14,
                  paddingHorizontal: 60,
                  textAlign: 'center',
                }}>
                {i18n.t('BOOKING.APPOINTMENT_BOOKED_WITH')}{' '}
              </Text>
            </Row>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginRight: 3}}>
              {mydata.salutation +
                '.' +
                mydata.first_name.replace(
                  /^./,
                  mydata.first_name[0].toUpperCase(),
                ) +
                ' ' +
                mydata.last_name.replace(
                  /^./,
                  mydata.last_name[0].toUpperCase(),
                )}
            </Text>
            <Text style={{fontSize: 14}}>{i18n.t('BOOKING.AT')}</Text>
            <Text style={{fontSize: 18}}>
              {mydata.branchname.replace(
                /^./,
                mydata.branchname[0].toUpperCase(),
              ) +
                ',' +
                mydata.city}
            </Text>
            <Text style={{fontSize: 14}}>{i18n.t('BOOKING.ON')}</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginRight: 3}}>
              {mydata.date}
            </Text>
          </Body>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              style={{backgroundColor: APP_PRIMARY_COLOR}}
              onPress={() =>
                this.props.navigation.navigate('HomeScreen', {
                  branch_id: mydata.branchid,
                  branch_name: mydata.branchname,
                })
              }>
              <Text style={{color: 'white', fontSize: 15}}>{i18n.t('BOOKING.OK')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default BookingInfo;
