import React, {Component} from 'react';
import {View, Text, ActivityIndicator, BackHandler} from 'react-native';
import {
  Container,
  Content,
  Icon,
  // Text,
  Col,
  Row,
  Thumbnail,
  ScrollView,
  TabHeading,
  Footer,
  FooterTab,
  Button,
  Badge,
  Header,
  Left,
  Body,
  Right,
  Title,
  TouchableOpacity,
  Label,
  Item,
  Tab,
  Tabs,
  List,
  ListItem,
  Separator,
} from 'native-base';
import {APP_PRIMARY_COLOR} from '../../../themes/variable';
import getBaseUrl, {getApiUrl} from '../../../config/Config';
import i18next from 'i18next';
import {Picker} from '@react-native-picker/picker';

export default class Person_Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hlpid: this.props.navigation.state.params.hlpid,
      personImage: require('../../../assets/images/user.png'),
    };
    this.handleBackPress = this.handleBackPress.bind(this);
  }

  componentDidMount = () => {
    this.details();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // alert("hi"+ base_url)
  };
  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  };
  handleBackPress() {
    this.props.navigation.goBack(null);
    return true;
  }
  details = async () => {
    // alert(global.token+global.doctor_id+"ll"+this.state.hlpid)
    let obk = JSON.stringify({
      token: global.token,
      role_type: 'doc_app',
      hlp: this.state.hlpid,
      doc: global.doctor_id,
    });
    //   console.log(obs)
    let url = getBaseUrl() + 'profile_edit';
    // console.log("gug"+ob)p
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: obk,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(
          'hfkjqkfwkejhkjwefkjwekjebfkwjebjeb' +
            JSON.stringify(response.message),
        );
        //  alert("hfkjqkfwkejhkjwefkjwekjebfkwjebjeb"+JSON.stringify(response.message["0"]))

        this.setState({
          isLoading: false,
          data: response.message['0'],
          data1: response.message,
        });
        if (
          response.message['0'].person_image != '' &&
          response.message['0'].person_image != undefined &&
          response.message['0'].person_image != null
        ) {
          this.setState({
            personImage: {
              uri:
                getApiUrl() + '/' + response.message['0'].person_image.trim(),
            },
          });
        }
        //
        //  alert(this.state.data.middle_name)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
        </View>
      );
    }
    const {rowStyle, docName, docDetails, values, listNameStyle} = Styles;
    return (
      <Container>
        <Content>
          <Row style={rowStyle}>
            <Col style={docName}>
              <Thumbnail
                style={{height: 150, width: 150}}
                large
                source={this.state.personImage}
              />
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col style={docDetails}>
              {/* <Text>{this.state.data.middle_name}</Text> */}
              <Text style={{fontSize: 14, color: '#4F575C'}}>
                {this.state.data.middle_name != null &&
                this.state.data.middle_name != '' &&
                this.state.data.middle_name != undefined
                  ? this.state.data.salutation +
                    '. ' +
                    this.state.data.first_name.charAt(0).toUpperCase() +
                    this.state.data.first_name.slice(1).toLowerCase() +
                    ' ' +
                    this.state.data.middle_name.charAt(0).toUpperCase() +
                    this.state.data.middle_name.slice(1).toLowerCase() +
                    ' ' +
                    this.state.data.last_name.charAt(0).toUpperCase() +
                    this.state.data.last_name.slice(1).toLowerCase()
                  : this.state.data.salutation +
                    '. ' +
                    this.state.data.first_name.charAt(0).toUpperCase() +
                    this.state.data.first_name.slice(1).toLowerCase() +
                    ' ' +
                    this.state.data.last_name.charAt(0).toUpperCase() +
                    this.state.data.last_name.slice(1).toLowerCase()}
              </Text>
            </Col>
          </Row>
          <Row style={rowStyle}>
            <Col style={docDetails}>
              <Text
                style={{fontSize: 12, color: '#345D7E', fontWeight: 'bold'}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: APP_PRIMARY_COLOR,
                    fontWeight: 'bold',
                  }}>
                  α
                </Text>{' '}
                : {this.state.hlpid}
              </Text>
            </Col>
          </Row>

          <Row>
            <Col>
              <Tabs>
                <Tab
                  heading={i18next.t('PERSONAL_PROFILE.TITLE')}
                  tabStyle={{backgroundColor: '#DCDCDC'}}
                  textStyle={{color: '#4F575C'}}
                  activeTextStyle={{color: '#345D7E', fontWeight: 'bold'}}
                  activeTabStyle={{backgroundColor: '#DCDCDC'}}>
                  <List>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.BIRTH')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>{this.state.data.dob}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.GENDER')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {this.state.data.gender.charAt(0).toUpperCase() +
                            this.state.data.gender.slice(1).toLowerCase()}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.BLOOD_GROUP')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {this.state.data.blood_group != null &&
                            this.state.data.blood_group != undefined &&
                            this.state.data.blood_group != '' &&
                            this.state.data.blood_group
                              .charAt(0)
                              .toUpperCase() +
                              this.state.data.blood_group
                                .slice(1)
                                .toLowerCase()}{' '}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.EMAIL_ID')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data.email != null &&
                            this.state.data.email != undefined &&
                            this.state.data.email != '' &&
                            this.state.data.email}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.PHONE_NUM')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data.phone_code != null &&
                            this.state.data.phone_code != undefined &&
                            this.state.data.phone_code != '' &&
                            this.state.data.phone_code}
                          {this.state.data.phone_no != null &&
                            this.state.data.phone_no != undefined &&
                            this.state.data.phone_no != '' &&
                            this.state.data.phone_no}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ALT_NUM')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {this.state.data.alternative_phone_no != '' && (
                          <Text style={values}>
                            {this.state.data.alternative_phone_code !=
                              undefined &&
                              this.state.data.alternative_phone_code != null &&
                              this.state.data.alternative_phone_code != '' &&
                              this.state.data.alternative_phone_code}
                            {this.state.data.alternative_phone_no != null &&
                              this.state.data.alternative_phone_no !=
                                undefined &&
                              this.state.data.alternative_phone_no != '' &&
                              this.state.data.alternative_phone_no}
                          </Text>
                        )}
                      </Right>
                    </ListItem>

                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ID_TYPE')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {this.state.data.id_type != '' &&
                          this.state.data.id_type != null && (
                            <Text style={listNameStyle}>
                              {this.state.data.id_type.charAt(0).toUpperCase() +
                                this.state.data.id_type.slice(1).toLowerCase()}
                            </Text>
                          )}
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ID_NUM')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>{this.state.data.id_number}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.FAM_TYPE')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data.family_type != '' &&
                            this.state.data.family_type != null &&
                            this.state.data.family_type != undefined &&
                            this.state.data.family_type != 'select' &&
                            this.state.data.family_type
                              .charAt(0)
                              .toUpperCase() +
                              this.state.data.family_type
                                .slice(1)
                                .toLowerCase()}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.FAM_SIZE')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data.family_size}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ADDRESS')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.address[0].address1
                            .charAt(0)
                            .toUpperCase() +
                            this.state.data1.address[0].address1
                              .slice(1)
                              .toLowerCase()}
                        </Text>
                        <Text style={values}>
                          {this.state.data1.address[0].address2
                            .charAt(0)
                            .toUpperCase() +
                            this.state.data1.address[0].address2
                              .slice(1)
                              .toLowerCase()}
                        </Text>
                        <Text style={values}>
                          {this.state.data1.address[0].landmark
                            .charAt(0)
                            .toUpperCase() +
                            this.state.data1.address[0].landmark
                              .slice(1)
                              .toLowerCase()}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.CITY')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.address[0].city
                            .charAt(0)
                            .toUpperCase() +
                            this.state.data1.address[0].city
                              .slice(1)
                              .toLowerCase()}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.STATE')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.address[0].state}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.COUNTRY')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.address[0].country}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.PINCODE')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.address[0].postal_code}
                        </Text>
                      </Right>
                    </ListItem>
                  </List>
                </Tab>
                <Tab
                  heading={i18next.t('PERSONAL_PROFILE.PARENT')}
                  tabStyle={{backgroundColor: '#DCDCDC'}}
                  textStyle={{color: '#4F575C'}}
                  activeTextStyle={{color: '#345D7E', fontWeight: 'bold'}}
                  activeTabStyle={{backgroundColor: '#DCDCDC'}}>
                  <List>
                    <Separator bordered>
                      <Text>{i18next.t('PERSONAL_PROFILE.PARENT1_INF')}</Text>
                    </Separator>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.RELATION')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {this.state.data1.person_parent_detail[0]
                            .p1_relation != 'select' &&
                            this.state.data1.person_parent_detail[0]
                              .p1_relation}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.NAME')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.person_parent_detail[0]
                            .p1_salutation != 'select' &&
                            this.state.data1.person_parent_detail[0]
                              .p1_salutation +
                              '. ' +
                              this.state.data1.person_parent_detail[0].p1_name
                                .charAt(0)
                                .toUpperCase() +
                              this.state.data1.person_parent_detail[0].p1_name
                                .slice(1)
                                .toLowerCase()}
                        </Text>
                      </Right>
                    </ListItem>

                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.GENDER')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {this.state.data1.person_parent_detail[0].p1_gender !=
                            'select' &&
                            this.state.data1.person_parent_detail[0].p1_gender
                              .charAt(0)
                              .toUpperCase() +
                              this.state.data1.person_parent_detail[0].p1_gender
                                .slice(1)
                                .toLowerCase()}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.BLOOD_GROUP')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {
                            this.state.data1.person_parent_detail[0]
                              .p1_blood_group
                          }
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.EMAIL_ID')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.person_parent_detail[0].p1_email}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.PHONE_NUM')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {this.state.data1.person_parent_detail[0].p1_phone_no !=
                          null && (
                          <Text style={values}>
                            {this.state.data1.person_parent_detail[0]
                              .p1_phone_code +
                              this.state.data1.person_parent_detail[0]
                                .p1_phone_no}
                          </Text>
                        )}
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ADDRESS')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {this.state.data1 &&
                          this.state.data1.address[1] &&
                          this.state.data1.address[1].address1 != '' && (
                            <Text style={values}>
                              {this.state.data1.address[1].address1
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.address[1].address1
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          )}
                        {this.state.data1 &&
                          this.state.data1.address[1] &&
                          this.state.data1.address[1].address2 != '' && (
                            <Text style={values}>
                              {this.state.data1.address[1].address2
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.address[1].address2
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          )}
                        {this.state.data1 &&
                          this.state.data1.address[1] &&
                          this.state.data1.address[1].landmark != '' && (
                            <Text style={values}>
                              {this.state.data1.address[1].landmark}
                            </Text>
                          )}
                        {this.state.data1 &&
                          this.state.data1.address[1] &&
                          this.state.data1.address[1].state != '' && (
                            <Text style={values}>
                              {this.state.data1.address[1].city +
                                ' ' +
                                this.state.data1.address[1].state}
                            </Text>
                          )}
                        {this.state.data1 &&
                          this.state.data1.address[1] &&
                          this.state.data1.address[1].postal_code != '' && (
                            <Text style={values}>
                              {this.state.data1.address[1].country +
                                ' ' +
                                this.state.data1.address[1].postal_code}
                            </Text>
                          )}
                        {/* <Text style={values}>{this.state.parentOneAddLineOne.charAt(0).toUpperCase() + this.state.parentOneAddLineOne.slice(1).toLowerCase()}</Text> */}
                        {/* <Text style={values}>{this.state.parentOneAddLineOne.charAt(0).toUpperCase() + this.state.parentOneAddLineOne.slice(1).toLowerCase()}</Text> */}
                      </Right>
                    </ListItem>
                    <Separator bordered>
                      <Text>{i18next.t('PERSONAL_PROFILE.PARENT2_INF')}</Text>
                    </Separator>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.RELATION')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {this.state.data1.person_parent_detail[0]
                            .p1_relation != 'select' &&
                            this.state.data1.person_parent_detail[0]
                              .p1_relation}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.NAME')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {this.state.data1 &&
                          this.state.data1.person_parent_detail[0] &&
                          this.state.data1.person_parent_detail[0].p2_name !=
                            '' &&
                          this.state.data1.person_parent_detail[0].p2_name !=
                            null && (
                            <Text style={values}>
                              {this.state.data1.person_parent_detail[0]
                                .p2_salutation != 'select' &&
                                this.state.data1.person_parent_detail[0]
                                  .p2_salutation +
                                  '. ' +
                                  this.state.data1.person_parent_detail[0].p2_name
                                    .charAt(0)
                                    .toUpperCase() +
                                  this.state.data1.person_parent_detail[0].p2_name
                                    .slice(1)
                                    .toLowerCase()}
                            </Text>
                          )}
                      </Right>
                    </ListItem>

                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.GENDER')}</Text>
                      </Left>
                      <Right>
                        {this.state.data1 &&
                          this.state.data1.person_parent_detail[0] &&
                          this.state.data1.person_parent_detail[0].p2_gender !=
                            null &&
                          this.state.data1.person_parent_detail[0].p2_gender !=
                            '' && (
                            <Text style={values}>
                              {this.state.data1.person_parent_detail[0]
                                .p2_gender != 'select' &&
                                this.state.data1.person_parent_detail[0].p2_gender
                                  .charAt(0)
                                  .toUpperCase() +
                                  this.state.data1.person_parent_detail[0].p2_gender
                                    .slice(1)
                                    .toLowerCase()}
                            </Text>
                          )}
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.BLOOD_GROUP')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {
                            this.state.data1.person_parent_detail[0]
                              .p2_blood_group
                          }
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.EMAIL_ID')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.person_parent_detail[0].p2_email}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.PHONE_NUM')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {this.state.data1.person_parent_detail[0].p2_phone_no !=
                          null && (
                          <Text style={values}>
                            {this.state.data1.person_parent_detail[0]
                              .p2_phone_code +
                              this.state.data1.person_parent_detail[0]
                                .p2_phone_no}
                          </Text>
                        )}
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ADDRESS')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {/* {this.state.parentTwoAddLineOne === "" ? null : <Text style={values}>{this.state.parentTwoAddLineOne.charAt(0).toUpperCase() + this.state.parentTwoAddLineOne.slice(1).toLowerCase()}</Text>}
{this.state.parentTwoAddLineTwo === "" ? null : <Text style={values}>{this.state.parentTwoAddLineTwo.charAt(0).toUpperCase() + this.state.parentTwoAddLineTwo.slice(1).toLowerCase()}</Text>}
{this.state.parentTwoLandmark === ""? null : <Text style={values}>{this.state.parentTwoLandmark.charAt(0).toUpperCase() + this.state.parentTwoLandmark.slice(1).toLowerCase()}</Text>}
<Text style={values}>{this.state.parentTwoCity.charAt(0).toUpperCase() + this.state.parentTwoCity.slice(1).toLowerCase()}</Text>
<Text style={values}>{this.getParentTwoCountryDetails()}</Text>
<Text style={values}>{this.state.parentTwoCountry+" - "+this.state.parentTwoPostal}</Text> */}
                        {this.state.data1 && this.state.data1.address[2] && (
                          <Text style={values}>
                            {this.state.data1.address[2].address1
                              .charAt(0)
                              .toUpperCase() +
                              this.state.data1.address[2].address1
                                .slice(1)
                                .toLowerCase()}
                          </Text>
                        )}
                        {this.state.data1 && this.state.data1.address[2] && (
                          <Text style={values}>
                            {this.state.data1.address[2].address2
                              .charAt(0)
                              .toUpperCase() +
                              this.state.data1.address[2].address2
                                .slice(1)
                                .toLowerCase()}
                          </Text>
                        )}
                        {this.state.data1 && this.state.data1.address[2] && (
                          <Text style={values}>
                            {this.state.data1.address[2].landmark}
                          </Text>
                        )}
                        {this.state.data1 && this.state.data1.address[2] && (
                          <Text style={values}>
                            {this.state.data1.address[2].city +
                              ' ' +
                              this.state.data1.address[2].state}
                          </Text>
                        )}
                        {this.state.data1 && this.state.data1.address[2] && (
                          <Text style={values}>
                            {this.state.data1.address[2].country +
                              ' ' +
                              this.state.data1.address[2].postal_code}
                          </Text>
                        )}
                      </Right>
                    </ListItem>
                  </List>
                </Tab>
                <Tab
                  heading={i18next.t('PERSONAL_PROFILE.OTHERS')}
                  tabStyle={{backgroundColor: '#DCDCDC'}}
                  textStyle={{color: '#4F575C'}}
                  activeTextStyle={{color: '#345D7E', fontWeight: 'bold'}}
                  activeTabStyle={{backgroundColor: '#DCDCDC'}}>
                  <List>
                    <Separator bordered>
                      <Text>{i18next.t('PERSONAL_PROFILE.EMERGENCY_CON')}</Text>
                    </Separator>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.RELATION')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {this.state.data1.person_emergency_details[0]
                            .relation_patient != 'select' &&
                            this.state.data1.person_emergency_details[0]
                              .relation_patient}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.NAME')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.person_emergency_details[0].emg_name
                            .charAt(0)
                            .toUpperCase() +
                            this.state.data1.person_emergency_details[0].emg_name
                              .slice(1)
                              .toLowerCase()}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.BLOOD_GROUP')}</Text>
                      </Left>
                      <Right>
                        <Text style={values}>
                          {
                            this.state.data1.person_emergency_details[0]
                              .emg_blood_group
                          }
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.EMAIL_ID')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {
                            this.state.data1.person_emergency_details[0]
                              .emg_email
                          }
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.PHONE_NUM')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {
                            this.state.data1.person_emergency_details[0]
                              .emg_phone_no
                          }
                        </Text>
                      </Right>
                    </ListItem>
                    <Separator bordered>
                      <Text>{i18next.t('PERSONAL_PROFILE.FAMILY_DOC')}</Text>
                    </Separator>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.DOC_NAME')}</Text>
                      </Left>
                      <Right>
                        {this.state.data1 &&
                          this.state.data1.person_doc_details[0] &&
                          this.state.data1.person_doc_details[0].doc_name !=
                            '' &&
                          this.state.data1.person_doc_details[0].doc_name !=
                            null && (
                            <Text style={values}>
                              {this.state.data1.person_doc_details[0].doc_name
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_doc_details[0].doc_name
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          )}
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.EMAIL_ID')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.person_doc_details[0].doc_email}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.PHONE_NUM')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        <Text style={values}>
                          {this.state.data1.person_doc_details[0].doc_phone_no}
                        </Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ADDRESS')}</Text>
                      </Left>
                      <Right style={{marginLeft: -560}}>
                        {this.state.data1 &&
                          this.state.data1.person_doc_details[0] &&
                          this.state.data1.person_doc_details[0].doc_address !=
                            '' &&
                          this.state.data1.person_doc_details[0].doc_address !=
                            null && (
                            <Text style={values}>
                              {this.state.data1.person_doc_details[0].doc_address
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_doc_details[0].doc_address
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          )}
                      </Right>
                    </ListItem>
                    {this.state.data1.person_person_type != null &&
                    this.state.data1.person_person_type != '' ? (
                      <View>
                        <Separator bordered>
                          <Text>{i18next.t('PERSONAL_PROFILE.SUBSCRIPTIONS')}</Text>
                        </Separator>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.SCHOOL_NAME')}</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_person_type[0].school_name
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_person_type[0].school_name
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.BRANCH')}</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_person_type[0].branch_name
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_person_type[0].branch_name
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.CLASS')}</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_person_type[0].class_name
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_person_type[0].class_name
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.SECTION')}</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_person_type[0].section}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>{i18next.t('PERSONAL_PROFILE.ROLL_NO')}</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_person_type[0].roll_no}
                            </Text>
                          </Right>
                        </ListItem>
                      </View>
                    ) : null}
                    {this.state.data1.person_haj_type != null &&
                    this.state.data1.person_haj_type != '' ? (
                      <View>
                        <Separator bordered>
                          <Text>Subscriptions</Text>
                        </Separator>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>Haj Name</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_haj_type[0].practice_name
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_haj_type[0].practice_name
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>Branch</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_haj_type[0].branch_name
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_haj_type[0].branch_name
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>Cover Number</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_haj_type[0].cover_no}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>Passport Number</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_haj_type[0].passport_no}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>
                              Identification Number
                            </Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {
                                this.state.data1.person_haj_type[0]
                                  .identification_no
                              }
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>Marital Status</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_haj_type[0].marital_status
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_haj_type[0].marital_status
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>Guardian</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {this.state.data1.person_haj_type[0].gaurdian
                                .charAt(0)
                                .toUpperCase() +
                                this.state.data1.person_haj_type[0].gaurdian
                                  .slice(1)
                                  .toLowerCase()}
                            </Text>
                          </Right>
                        </ListItem>
                        <ListItem>
                          <Left>
                            <Text style={listNameStyle}>Travel Date</Text>
                          </Left>
                          <Right style={{marginLeft: -560}}>
                            <Text style={values}>
                              {
                                this.state.data1.person_haj_type[0]
                                  .traveling_date
                              }
                            </Text>
                          </Right>
                        </ListItem>
                      </View>
                    ) : null}
                  </List>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Content>
      </Container>
    );
  }
}

const Styles = {
  rowStyle: {
    backgroundColor: '#DCDCDC',
  },
  docName: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginVertical: 20,
  },
  docDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingBottom: 10,
  },
  values: {
    fontSize: 15,
    color: '#4F575C',
  },
  listNameStyle: {
    fontSize: 15,
    color: '#345D7E',
  },
};
