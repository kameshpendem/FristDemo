import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Row,
  Col,
  Content,
  Container,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
} from 'native-base';
// import MapView,{PROVIDER_GOOGLE} from 'react-native-maps';
import Communications from 'react-native-communications';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import i18n from '../../../i18n';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          color: '#DCDCDC',
          image: require('../../assets/images/youtube.png'),
        },
        {
          id: 2,
          color: '#DCDCDC',
          image: require('../../assets/images/facebook.png'),
        },
        {
          id: 3,
          color: '#DCDCDC',
          image: require('../../assets/images/linkedin.png'),
        },
        {
          id: 4,
          color: '#DCDCDC',
          image: require('../../assets/images/ic_launcher.png'),
        },
      ],
    };
  }

  clickEventListener(item) {
    item == '1'
      ? Linking.openURL(
          'https://www.youtube.com/channel/UCH5zFP396Bv-WxrlbO3O_NQ',
        ).catch(err => console.error('An error occurred', err))
      : item == '2'
      ? Linking.openURL('https://www.facebook.com/Healα-299671177343649').catch(
          err => console.error('An error occurred', err),
        )
      : item == '3'
      ? Linking.openURL('https://www.linkedin.com/company/healpha').catch(err =>
          console.error('An error occurred', err),
        )
      : item == '4'
      ? Linking.openURL('https://web.healpha.com/').catch(err =>
          console.error('An error occurred', err),
        )
      : null;
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, height: 100}}
        style={{flexDirection: 'column', flex: 1}}>
        <Container>
          <Content style={{marginLeft: 15, marginTop: 15}}>
            <View style={styles.comm}>
              <View style={styles.box}>
                <Image
                  style={{height: 50, width: 50}}
                  source={require('../../assets/images/whatsapp.png')}
                  testID="whatsappImage"
                  accessibilityLabel="whatsappImage"
                />
                <View style={{flexDirection: 'column', marginTop: 2}}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'http://api.whatsapp.com/send?phone=91' + 7207928363,
                      );
                    }}>
                    <Text
                      style={styles.htext}
                      testID="messageText"
                      accessibilityLabel="messageText">
                      {i18n.t('CONTACT.MESSAGE')}{' '}
                    </Text>
                    <Text
                      style={{marginLeft: 20, marginTop: -30, fontSize: 12}}
                      testID="mobileNumberText"
                      accessibilityLabel="mobileNumberText">
                      {i18n.t('CONTACT.MOBILE_NO')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.comm}>
              <View style={styles.box}>
                <Image
                  style={{height: 40, width: 40}}
                  source={require('../../assets/images/call.png')}
                  testID="callImage"
                  accessibilityLabel="callImage"
                />
                <View style={{flexDirection: 'column', marginTop: 2}}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL('tel:+91 7207928363', true)}>
                    <Text style={styles.text}
                    testID="callText" accessibilityLabel="callText">{i18n.t('CONTACT.CALL')}</Text>
                    <Text
                      style={{marginLeft: 30, marginTop: -30, fontSize: 12}}
                      testID="mobileNumberText"
                      accessibilityLabel="mobileNumberText">
                      {i18n.t('CONTACT.MOBILE_NO')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.comm}>
              <View style={styles.box}>
                <Image
                  style={{height: 40, width: 40}}
                  source={require('../../assets/images/email.png')}
                 testID="emailImage"
                 accessibilityLabel="emailImage"/>
                <View style={{flexDirection: 'column', marginTop: 2}}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL('mailto:care@healpha.com')}>
                    <Text style={styles.text}
                    testID="emailText"
                    accessibilityLabel="emailText">{i18n.t('CONTACT.EMAIL')}</Text>
                    <Text
                      style={{marginLeft: 30, marginTop: -30, fontSize: 12}}
                      testID="addedEmailText"
                      accessibilityLabel="addedEmailText">
                      {i18n.t('CONTACT.EMAIL_ADD')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.addloc}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(url);
                  }}>
                  <Image
                    style={{height: 40, width: 40}}
                    source={require('../../assets/images/map.jpg')}
                  />
                  <View style={styles.address}>
                    <Text style={styles.Adtext} testID="floorAddressText" accessibilityLabel="floorAddressText">
                      {i18n.t('CONTACT.ADDRESS_FLOOR')}
                    </Text>
                    <Text style={styles.Adtext} testID="placeText" accessibilityLabel="placeText">
                      {i18n.t('CONTACT.ADDRESS_PLACE')}
                    </Text>
                    <Text style={styles.Adtext} testID="areaText" accessibilityLabel="areaText">
                      {i18n.t('CONTACT.ADDRESS_AREA')}
                    </Text>
                    <Text style={styles.Adtext} testID="countryText" accessibilityLabel="countryText">
                      {i18n.t('CONTACT.ADDRESS_COUNTRY')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={styles.addloc}>
      <View style={{flexDirection:"row"}}>
      <TouchableOpacity
          onPress={() => {
            Linking.openURL(url1);
        }}> 
      <Image style={{height:40,width:40}} source={require('../assets/images/map.jpg')}/>
          <View style={styles.address}>
          <Text  style={styles.Adtext}> Windsor F4, 3rd floor, No.75/1b,</Text>
          <Text style={styles.Adtext}>Hulimavu, Bannerghatta Main Road,</Text>
          <Text  style={styles.Adtext}>Bangalore, Karnataka,</Text>
          <Text  style={styles.Adtext}>IN 560078.</Text>
          </View>
          </TouchableOpacity>
          </View>  
      </View>  */}
            <Text
              style={{
                marginLeft: 30,
                marginTop: 35,
                fontSize: 18,
                color: '#345D7E',
                fontWeight: 'bold',
              }} testID="followUsText"
              accessibilityLabel="followUsText">
              {i18n.t('CONTACT.FOLLOW_US_ON')}
            </Text>
            <View style={styles.container}>
              <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContainer}
                data={this.state.data}
                horizontal={false}
                numColumns={2}
                keyExtractor={item => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.card,
                        {
                          backgroundColor: item.color,
                        },
                      ]}
                      onPress={() => {
                        this.clickEventListener(item.id);
                        //Alert.alert(item.title);
                      }}>
                      <Image style={styles.cardImage} source={item.image} 
                      testID={item.image+"text"} accessibilityLabel={item.image+"text"}/>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            {/* <View
            style={{position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            alignItems: 'center',}}
            >
            <MapView
        provider={PROVIDER_GOOGLE}
        style={{height:280,left:0,right:0,top:0,bottom:0,position:"absolute"}}
        region={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
  
         </MapView>
            </View> */}
            {/* <Row>
          <Col>
          <Text style={{fontSize:20}}>Healpha <Text style={{fontSize:10}}>Powered By Concent Solutions</Text></Text>
          </Col>
      </Row>
      <Row><Col>
      <Text style={{}}>
      <Icon name="md-map" style={{fontSize:15}}></Icon> First Floor, 7A,</Text>
      </Col></Row>
      <Row><Col>
      <Text style={{}}>Petbasheerbad, Kompally,</Text>
      </Col></Row>
      <Row><Col>
      <Text style={{}}>Hyderabad, Telangana,</Text>
      </Col></Row>
      <Row><Col>
      <Text style={{}}>IN- 500055.</Text>
      </Col></Row> */}
            {/* <Row>
          <Col>
          <TouchableOpacity
          onPress={() => Communications.email(['naveen@concent.in'],null,null,'Enquiry','Dear Sir,')}>
              <Text>
             <Icon name="mail" style={{fontSize:15}}></Icon> naveen@concent.in
              </Text>
          </TouchableOpacity>
          </Col>
      </Row> */}
            {/* <Row>
          <Col>
          <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'http://api.whatsapp.com/send?phone=91' + 9502504061
            );
        }}> */}
            {/* onPress={() => Communications.text('9502504061', 'Test Text Here')}> */}
            {/* <Text>
              <Icon name="md-send" style={{fontSize:15}}></Icon> 9502504061
              </Text>
          </TouchableOpacity>
          </Col>
          <Col style={{marginLeft:-125}}>
          <TouchableOpacity
          onPress={() => Communications.phonecall('9502504061', true)}>
              <Text>
              <Icon name="call" style={{fontSize:15}}></Icon> 9502504061
              </Text>
          </TouchableOpacity>
          </Col>
      </Row>
      <Row>
      <Col>
          <TouchableOpacity
          onPress={() => Communications.email(['naveen@concent.in'],null,null,'Enquiry','Dear Sir,')}>
              <Text>
             <Icon name="mail" style={{fontSize:15}}></Icon> naveen@concent.in
              </Text>
          </TouchableOpacity>
     </Col>
          <Col style={{marginLeft:-45}}>
          <TouchableOpacity
           onPress={() => Communications.webFlatList('http://healpha.com/')}>
              <Text>
              <Icon name="md-globe" style={{fontSize:15}}></Icon> healpha.com
              </Text>
          </TouchableOpacity>
          </Col>
      </Row> */}
            {/* <Row>
          <Col>
          <TouchableOpacity
           onPress={() => Communications.web('http://healpha.com/')}>
              <Text>
              <Icon name="md-globe" style={{fontSize:15}}></Icon> healpha.com
              </Text>
          </TouchableOpacity>
          </Col>
      </Row> */}
            {/* <Row>
      <Col style={{backgroundColor:"#dcdcdc",height:2,marginRight:15,marginTop:20}}></Col>
      </Row>
      <Row><Col>
      <Text style={{marginTop:20}}><Icon name="md-map" style={{fontSize:15}}></Icon> Windsor F4, 3rd floor, No.75/1b,</Text>
      </Col></Row>
      <Row><Col>
      <Text style={{}}>Hulimavu, Bannerghatta Main Road, </Text>
      </Col></Row>
      <Row><Col>
      <Text style={{}}>Bangalore, Karnataka,</Text>
      </Col></Row>
      <Row><Col>
      <Text style={{}}>IN 560078.</Text>
      </Col></Row>*/}
          </Content>
        </Container>
      </ScrollView>
    );
  }
}
const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
const latLng = `17.524836399999998,78.48322710000001`;
const label =
  'First Floor, 7A, Petbasheerbad, Kompally,Hyderabad, Telangana,IN- 500055';
const url = Platform.select({
  ios: `${scheme}${label}@${latLng}`,
  android: `${scheme}${latLng}(${label})`,
});

const scheme1 = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
const latLng1 = `12.909650,77.572020`;
const label1 =
  'Windsor F4, 3rd floor, No.75/1b,Hulimavu, Bannerghatta Main Road,Bangalore, Karnataka,IN 560078.';
const url1 = Platform.select({
  ios: `${scheme1}${label1}@${latLng1}`,
  android: `${scheme1}${latLng1}(${label1})`,
});

export default Contact;

const styles = StyleSheet.create({
  head: {
    alignItems: 'center',
    marginLeft: 60,
  },
  comm: {
    marginLeft: 20,
    marginTop: 20,
  },
  addloc: {
    marginLeft: 20,
    marginTop: 40,
  },
  box: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  address: {
    flexDirection: 'column',
    backgroundColor: 'white',
    marginLeft: 70,
    marginTop: -50,
  },
  text: {
    fontSize: 16,
    marginLeft: 30,
    fontWeight: 'bold',
    height: 50,
  },
  htext: {
    fontSize: 16,
    marginLeft: 20,
    fontWeight: 'bold',
    height: 50,
  },

  Adtext: {
    fontSize: 14,
  },
  container: {
    height: 300,
    marginTop: 10,
  },
  list: {
    //paddingHorizontal: 5,
    height: 50,
    backgroundColor: 'white',
  },
  listContainer: {
    alignItems: 'center',
  },
  /******** card **************/
  card: {
    marginHorizontal: 2,
    marginVertical: 2,
    flexBasis: '40%',
    marginTop: 10,
    height: 100,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: -2,
    },
    elevation: 4,
  },

  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    color: '#345D7E',
    fontWeight: '500',
    alignSelf: 'center',
  },
  cardImage: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
});
