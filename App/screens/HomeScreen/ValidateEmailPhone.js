import React, {Component} from 'react';
import {
  Button,
  Row,
  Col,
  Container,
  Content,
  List,
  Accordion,
  Text,
  View,
  Icon,
  Header,
} from 'native-base';
import {TouchableOpacity, Linking, FlatList, StyleSheet} from 'react-native';
import {Overlay, Input} from 'react-native-elements';
import RadioGroup from 'react-native-radio-buttons-group';
import {APP_PRIMARY_COLOR} from '../../themes/variable';
import getBaseUrl from '../../config/Config';
import {Picker} from '@react-native-picker/picker';

class ValidateEmailPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person_data: this.props.navigation.state.params.person_data,
      phone: this.props.navigation.state.params.phone,
      email: this.props.navigation.state.params.email,
      first_name: this.props.navigation.state.params.first_name,
      middle_name: this.props.navigation.state.params.middle_name,
      last_name: this.props.navigation.state.params.last_name,
      salutation: this.props.navigation.state.params.salutation,
      person_image: this.props.navigation.state.params.person_image,
      chosenDate: this.props.navigation.state.params.chosenDate,
      blood_group: this.props.navigation.state.params.blood_group,
      gender: this.props.navigation.state.params.gender,
      phone_code: this.props.navigation.state.params.phone_code,
      father_name: this.props.navigation.state.params.father_name,
      doctor_name: this.props.navigation.state.params.doctor_name,
      school_name: this.props.navigation.state.params.school_name,
      branch_id: this.props.navigation.state.params.branch_id,
      brn_id: this.props.navigation.state.params.brn_id,
      brn_name: this.props.navigation.state.params.brn_name,
      confirm_modal: false,
      confirm_modal1: false,
      confirm_modal1_flg: false,
      temp_to_perm: this.props.navigation.state.params.temp_to_perm,
      uid_temp: this.props.navigation.state.params.uid_temp,
      id_type: this.props.navigation.state.params.id_type,
      id_number: this.props.navigation.state.params.id_number,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    let m_name = this.state.middle_name;
    if (!m_name) {
      m_name = '';
    }
    let email_id;
    if (this.state.email == '') {
      email_id = 'no';
    } else {
      email_id = this.state.email;
    }
    let ob = JSON.stringify({
      phone: this.state.phone,
      email: email_id,
      fname: this.state.first_name,
      mname: m_name,
      lname: this.state.last_name,
      rel_hlp: '',
      relation: '',
      master_slave_flag: '',
      salutation: this.state.salutation,
    });
    console.log(ob);
    let getdataurl = getBaseUrl() + 'insert_temp_user/';
    fetch(getdataurl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: ob,
    })
      .then((response) => response.json())
      .then(async (response) => {
        console.log('insert_temp_user_res=' + JSON.stringify(response));
        if (response.length >= 2) {
          console.log('person_data===', this.state.person_data);

          let newdata = this.state.person_data.filter((item) => {
            return item.master == 1;
          });
          console.log(newdata);
          if (newdata == '') {
            let ob2 = [];
            response.map((item) => {
              ob2.push(item);
            });
            this.setState({type: ob2});
          } else {
            this.setState({
              rel_name:
                newdata[0].first_name +
                ' ' +
                newdata[0].middle_name +
                ' ' +
                newdata[0].last_name,
            });
            this.setState({rel_hlp: newdata[0].hlpid});
            this.setState({
              radio_data: [
                {
                  label:
                    newdata[0].first_name +
                    ' ' +
                    newdata[0].middle_name +
                    ' ' +
                    newdata[0].last_name,
                  value: '0',
                  size: 20,
                },
                {
                  label:
                    this.state.first_name +
                    ' ' +
                    m_name +
                    ' ' +
                    this.state.last_name,
                  value: '1',
                  size: 20,
                },
              ],
            });
            this.setState({confirm_modal1_flg: true});
            this.setState({confirm_modal1: true});
          }
        } else {
          let ob2 = [];
          response.map((item) => {
            ob2.push(item);
          });
          this.setState({type: ob2});
        }
      });
  };
  updateUser = (user) => {
    this.setState({relation_patients: user});
  };

  onSubmit = () => {
    const relation_patients = this.state.relation_patients;
    let selectedButton;
    if (this.state.confirm_modal1_flg) {
      selectedButton = 0;
    } else {
      selectedButton = this.state.radio_data.find((e) => e.selected == true);
      selectedButton = selectedButton
        ? selectedButton.value
        : this.state.radio_data[0].label;
    }

    console.log(
      relation_patients,
      selectedButton,
      this.state.rel_name,
      this.state.rel_hlp,
    );
    if (!relation_patients) {
      alert('Please select the Relationship');
    } else {
      let m_name = this.state.middle_name;
      if (!m_name) {
        m_name = '';
      }
      let f_name = this.state.father_name;
      if (!f_name) {
        f_name = '';
      }

      let temp_to_perm1 = this.state.temp_to_perm;
      if (!temp_to_perm1) {
        temp_to_perm1 = '';
      }
      let uid_temp1 = this.state.uid_temp;
      if (!uid_temp1) {
        uid_temp1 = '';
      }

      const image = this.state.person_image?.uri;
      let ob1 = JSON.stringify({
        salutation: this.state.salutation,
        // person_image: this.state.person_image,
        person_image: image,
        first_name: this.state.first_name,
        middle_name: m_name,
        last_name: this.state.last_name,
        id_type: this.state.id_type,
        id_number: this.state.id_number,
        dob: this.state.chosenDate,
        age: '',
        gender: this.state.gender,
        family_type: '',
        family_size: '',
        alternative_phone_code: '',
        alternative_phone_no: '',
        phone_no: this.state.phone,
        phone_code: this.state.phone_code,
        blood_group: this.state.blood_group,
        email: this.state.email,
        password: '',
        p1_salutation: '',
        p1_name: f_name,
        p1_relation: '',
        p1_gender: '',
        p1_phone_code: '',
        p1_phone_no: '',
        p1_email: '',
        p1_blood_group: '',
        p2_salutation: '',
        p2_name: '',
        p2_relation: '',
        p2_gender: '',
        p2_phone_code: '',
        p2_phone_no: '',
        p2_email: '',
        p2_blood_group: '',
        emg_phone_no: '',
        emg_name: '',
        emg_blood_group: '',
        emg_email: '',
        doc_name: '',
        doc_email: '',
        doc_address: '',
        doc_phone_no: '',
        health_monitor: '',
        school_name: this.state.school_name,
        branch_id: this.state.branch_id,
        class_name: '',
        section: '',
        roll_no: '',
        office_name: '',
        branch: '',
        dept: '',
        employee_id: '',
        general: '1',
        paddress1: '',
        paddress2: '',
        landmark: '',
        pcity: '',
        pstate: '',
        pcountry: '',
        ppostal_code: '',
        paddress_of: '',
        p1address1: '',
        p1address2: '',
        p1city: '',
        p1country: '',
        p1state: '',
        p1postal_code: '',
        p1address_of: '',
        p2address1: '',
        p2address2: '',
        p2city: '',
        p2country: '',
        p2state: '',
        p2postal_code: '',
        relation_patient: '',
        rel_name: this.state.rel_name,
        rel_hlp: this.state.rel_hlp,
        rel_val: this.state.relation_patients,
        master_slave: selectedButton,
        doctor_name: this.state.doctor_name,
        temp_to_perm: temp_to_perm1,
        uid_temp: uid_temp1,
      });
      console.log(ob1);
      let getdataurl = getBaseUrl() + 'person_save/';
      fetch(getdataurl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: ob1,
      })
        .then((response) => response.json())
        .then(async (response) => {
          console.log('person inserted res=' + JSON.stringify(response));
          if (response['message']) {
            alert(response['message']);
            this.props.navigation.navigate('HomeScreen', {
              branch_id: this.state.brn_id,
              branch_name: this.state.brn_name,
            });
          }
          //this.props.navigation.pop(2)
          return response;
        });
    }
  };

  onPress = (radio_data) => this.setState({radio_data});
  render() {
    if (this.state.confirm_modal == true) {
      return (
        <Overlay isVisible height={250}>
          <Row>
            <Col>
              <Text style={{textAlign: 'center'}}>
                Who to {this.state.rel_name}
              </Text>
            </Col>
          </Row>

          <Row>
            <Col>
              <Picker
                placeholder="Select Relation"
                label="relation"
                name="relation"
                selectedValue={this.state.relation_patients}
                style={{marginTop: -80, marginLeft: 50, height: 50, width: 150}}
                onValueChange={this.updateUser}>
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Mother" value="Mother" />
                <Picker.Item label="Father" value="Father" />
                <Picker.Item label="Brother" value="Brother" />
                <Picker.Item label="Sister" value="Sister" />
                <Picker.Item label="Wife" value="Wife" />
                <Picker.Item label="Son" value="Son" />
                <Picker.Item label="Daughter" value="Daughter" />
                <Picker.Item label="Guardian" value="Guardian" />
              </Picker>
            </Col>
          </Row>

          <Row>
            <Col>
              <Text style={{textAlign: 'center', marginTop: -35}}>
                Relationship Head
              </Text>
            </Col>
          </Row>

          <Row style={{textAlign: 'center', marginTop: -70}}>
            <Col>
              <RadioGroup
                radioButtons={this.state.radio_data}
                onPress={this.onPress}
                // flexDirection='row'
              />
            </Col>
          </Row>

          <Row style={{marginTop: -10, justifyContent: 'center'}}>
            <Col>
              <Button
                small
                onPress={() => this.onSubmit()}
                style={{
                  textAlign: 'center',
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 20,
                  alignSelf: 'center',
                  width: 90,
                }}>
                <Text style={{color: 'white', marginLeft: 20, fontSize: 14}}>
                  OK
                </Text>
              </Button>
            </Col>
            <Col>
              <Button
                small
                onPress={() => {
                  this.setState({confirm_modal: false});
                }}
                style={{
                  textAlign: 'center',
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 20,
                  alignSelf: 'center',
                  width: 90,
                }}>
                <Text style={{color: 'white', marginLeft: 18, fontSize: 14}}>
                  Back
                </Text>
              </Button>
            </Col>
          </Row>
        </Overlay>
      );
    }

    if (this.state.confirm_modal1 == true) {
      return (
        <Overlay isVisible height="auto">
          <Row style={{height: 50}}>
            <Col>
              <Text style={{textAlign: 'center'}}>
                Who to {this.state.rel_name}
              </Text>
            </Col>
          </Row>

          <Row style={{height: 50}}>
            <Col>
              <Picker
                placeholder="Select Relation"
                label="relation"
                name="relation"
                selectedValue={this.state.relation_patients}
                style={{marginLeft: 50, height: 50, width: 150}}
                onValueChange={this.updateUser}>
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Mother" value="Mother" />
                <Picker.Item label="Father" value="Father" />
                <Picker.Item label="Brother" value="Brother" />
                <Picker.Item label="Sister" value="Sister" />
                <Picker.Item label="Wife" value="Wife" />
                <Picker.Item label="Son" value="Son" />
                <Picker.Item label="Daughter" value="Daughter" />
                <Picker.Item label="Guardian" value="Guardian" />
              </Picker>
            </Col>
          </Row>

          <Row style={{justifyContent: 'center', height: 50}}>
            <Col>
              <Button
                small
                onPress={() => this.onSubmit()}
                style={{
                  textAlign: 'center',
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 20,
                  alignSelf: 'center',
                  width: 90,
                }}>
                <Text style={{color: 'white', marginLeft: 20, fontSize: 14}}>
                  OK
                </Text>
              </Button>
            </Col>
            <Col>
              <Button
                small
                onPress={() => {
                  this.props.navigation.pop(1);
                }}
                style={{
                  textAlign: 'center',
                  backgroundColor: APP_PRIMARY_COLOR,
                  marginTop: 20,
                  alignSelf: 'center',
                  width: 90,
                }}>
                <Text style={{color: 'white', marginLeft: 18, fontSize: 14}}>
                  Back
                </Text>
              </Button>
            </Col>
          </Row>
        </Overlay>
      );
    }
    let m_name = this.state.middle_name;
    if (!m_name) {
      m_name = '';
    }
    return (
      <Container>
        <Content>
          <Text style={{padding: 10}}>
            This Email or phone already in use. Please select a related person
          </Text>
          <List>
            <FlatList
              data={this.state.type}
              renderItem={({item}) => (
                <View style={styles.card}>
                  <Row>
                    <Col>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({confirm_modal: true}),
                            this.setState({
                              rel_name:
                                item.first_name +
                                ' ' +
                                item.middle_name +
                                ' ' +
                                item.last_name,
                            }),
                            this.setState({rel_hlp: item.hlpid}),
                            this.setState({
                              radio_data: [
                                {
                                  label:
                                    item.first_name +
                                    ' ' +
                                    item.middle_name +
                                    ' ' +
                                    item.last_name,
                                  value: '0',
                                  size: 20,
                                },
                                {
                                  label:
                                    this.state.first_name +
                                    ' ' +
                                    m_name +
                                    ' ' +
                                    this.state.last_name,
                                  value: '1',
                                  size: 20,
                                },
                              ],
                            });
                        }}>
                        <Text>
                          {item.hlpid} - {item.first_name} {item.middle_name}{' '}
                          {item.last_name} {item.phone_no} {item.email}
                        </Text>
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </View>
              )}
            />
          </List>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    marginHorizontal: 10,
    marginVertical: 5,
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 5,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 8,
  },
});
export default ValidateEmailPhone;
