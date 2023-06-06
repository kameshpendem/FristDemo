import React, {Component} from 'react';
import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import {
  Container,
  Header,
  Content,
  Tab,
  Tabs,
  Row,
  Col,
  Footer,
  FooterTab,
  Button,
  Item,
  Label,
  Icon,
  Thumbnail,
} from 'native-base';
import Immun from './Immunization/Immun';
import Gchart from './Immunization/Gchart';
import AsyncStorage from '@react-native-community/async-storage';
import {getPresecList} from '../../redux/actions/presec_action';
import {connect} from 'react-redux';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import i18n from '../../../i18n';
import {Picker} from '@react-native-picker/picker';

class Tab3 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  gen_presec = async () => {
    const docname = await AsyncStorage.getItem('doctorname');
    let obs = {
      docid: global.doctor_id,
      hlp: this.props.screenProps.hlpid,
      enc_id: this.props.screenProps.enc_id,
      doc_name: docname,
      token: global.token,
    };
    await this.props.getPresecList(obs);
    // alert("hi"+this.props.presecList.message)
    if (this.props.presecList.message.trim() == 'Please Save Vitals') {
      alert(i18n.t('PATIENTS.PLS_SAVE_VITALS'));
      this.setState({page: 0, tabs: this.state.tabsdata});
    } else {
      this.props.screenProps.rootNavigation.navigate('ViewPdf2', {
        link: this.props.presecList.message,
        branch_id:
          this.props.screenProps.enc_id.split('-')[0] +
          '-' +
          this.props.screenProps.enc_id.split('-')[1],
        branch_name: this.props.screenProps.hspname,
        profile_pic: this.props.screenProps.profile_pic,
      });
    }
  };
  render() {
    return (
      <Container>
        <View style={{flex: 1}}>
          <Tabs>
            <Tab
              heading={i18n.t('PATIENTS.IMMUNIZATION')}
              tabStyle={{backgroundColor: APP_PRIMARY_COLOR}}
              textStyle={{color: 'white', fontSize: 15}}
              activeTextStyle={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
              }}
              activeTabStyle={{backgroundColor: APP_PRIMARY_COLOR}}>
              <Immun
                myprops={{
                  enc_id: this.props.screenProps.enc_id,
                  rootNavigation: this.props.screenProps.rootNavigation,
                  hlpid: this.props.screenProps.hlpid,
                  docid: this.props.screenProps.docid,
                  token: this.props.screenProps.token,
                  screen: this.props.screenProps.screen,
                  chief: this.props.screenProps.chief,
                  uid: this.props.screenProps.uid,
                  check_status: this.props.screenProps.check_status,
                  template_id: this.props.screenProps.template_id,
                  template_name: this.props.screenProps.template_name,
                  app_type: this.props.screenProps.app_type,
                  patientname: this.props.screenProps.patientname,
                  uid2: this.props.screenProps.uid2,
                  age: this.props.screenProps.age,
                  dob: this.props.screenProps.dob,
                  gender: this.props.screenProps.gender,
                  blood: this.props.screenProps.blood,
                  navigateprops: this.props.navigation,
                }}
              />
            </Tab>
            <Tab
              heading={i18n.t('PATIENTS.HEALTH')}
              tabStyle={{backgroundColor: APP_PRIMARY_COLOR}}
              textStyle={{color: 'white', fontSize: 15}}
              activeTextStyle={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
              }}
              activeTabStyle={{backgroundColor: APP_PRIMARY_COLOR}}>
              <Gchart
                myprops={{
                  enc_id: this.props.screenProps.enc_id,
                  rootNavigation: this.props.screenProps.rootNavigation,
                  hlpid: this.props.screenProps.hlpid,
                  docid: this.props.screenProps.docid,
                  check_status: this.props.screenProps.check_status,
                  token: this.props.screenProps.token,
                  screen: this.props.screenProps.screen,
                  chief: this.props.screenProps.chief,
                  uid: this.props.screenProps.uid,
                  template_id: this.props.screenProps.template_id,
                  template_name: this.props.screenProps.template_name,
                  app_type: this.props.screenProps.app_type,
                  patientname: this.props.screenProps.patientname,
                  uid2: this.props.screenProps.uid2,
                  age: this.props.screenProps.age,
                  dob: this.props.screenProps.dob,
                  gender: this.props.screenProps.gender,
                  blood: this.props.screenProps.blood,
                }}
              />
            </Tab>
          </Tabs>
        </View>
        {/* </Content> */}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  presecList: state.presecList.presecList,
});

export default connect(mapStateToProps, {getPresecList})(Tab3);
