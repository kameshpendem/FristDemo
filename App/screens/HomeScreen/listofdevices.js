import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import {
  Row,
  Col,
  Button,
  Item,
  Label,
  Container,
  Content,
  Icon,
} from 'native-base';
import {connect} from 'react-redux';
import {getChangeList} from '../../redux/actions/change_action';
import FlashMessage from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import i18n from '../../../i18n';
import { DEVICE_TYPES } from '../../constants/Device';
import { SELECT } from '../app/common/Constants';
import {Picker} from '@react-native-picker/picker';

export default class listofdevices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosenIndex: 0,
      language: 'Yes',
      Aasha: 'Select Aasha',
      chinese: 'Select Set1',
    };
  }
  componentDidMount = async () => {
    const height_val = await AsyncStorage.getItem('height_val');
    const weight_val = await AsyncStorage.getItem('weight_val');
    const bp_val = await AsyncStorage.getItem('bp_val');
    const PulseOximeter_val = await AsyncStorage.getItem('PulseOximeter_val');
    const Spirometer_val = await AsyncStorage.getItem('Spirometer_val');
    const Temperature_val = await AsyncStorage.getItem('Temperature_val');
    this.setState({
      height_val: height_val,
      weight_val: weight_val,
      bp_val: bp_val,
      PulseOximeter_val: PulseOximeter_val,
      Spirometer_val: Spirometer_val,
      Temperature_val: Temperature_val,
    });
  };
  onValueChangeaasha = async (value, label) => {
    this.setState({
      Aasha: value,
    });
    await AsyncStorage.setItem('deviceaasha', value);
    global.deviceaasha = value;
  };
  onValueChangechinese = async (value, label) => {
    this.setState({
      chinese: value,
    });
    await AsyncStorage.setItem('devicechinese', value);
    global.deviceaasha = value;
  };
  aashaPicker() {
    return (
      <Item picker>
        <Picker
          allowFontScaling={false}
          style={{height: 40, marginTop: 15, color: 'black'}}
          selectedValue={this.state.Aasha}
          onValueChange={this.onValueChangeaasha.bind(this)}>
          <Picker.Item label={'Select Aasha'} value={'Select Aasha'} />
          <Picker.Item label={'Yes'} value={'Yes'} />
          <Picker.Item label={'No'} value={'No'} />
        </Picker>
      </Item>
    );
  }
  chinesePicker() {
    return (
      <Item picker>
        <Picker
          allowFontScaling={false}
          style={{height: 40, marginTop: 15, color: 'black'}}
          selectedValue={this.state.chinese}
          onValueChange={this.onValueChangechinese.bind(this)}>
          <Picker.Item label={'Select Set1'} value={'Select Set1'} />
          <Picker.Item label={'Height'} value={'Height'} />
          <Picker.Item label={'Weight'} value={'Weight'} />
          <Picker.Item label={'BP'} value={'BP'} />
          <Picker.Item label={'PulseOximeter'} value={'PulseOximeter'} />
          <Picker.Item label={'Spirometer'} value={'Spirometer'} />
        </Picker>
      </Item>
    );
  }

  onValueChangeHeight = async (value, label) => {
    if (value && value != '') {
      this.setState({
        height_val: value,
      });
      await AsyncStorage.setItem('height_val', value);
      if(value.toLowerCase()==SELECT){
        await AsyncStorage.setItem('Devices_flg', 'no');
      }
      else{
        await AsyncStorage.setItem('Devices_flg', 'yes');
      }
      global.height_val = value;
    }
  };

  onValueChangeWeight = async (value, label) => {
    if (value && value != '') {
      this.setState({
        weight_val: value,
      });
      await AsyncStorage.setItem('weight_val', value);
      if(value.toLowerCase()==SELECT){
        await AsyncStorage.setItem('Devices_flg', 'no');
      }
      else{
        await AsyncStorage.setItem('Devices_flg', 'yes');
      }      global.weight_val = value;
    }
  };

  onValueChangeBP = async (value, label) => {
    if (value && value != '') {
      this.setState({
        bp_val: value,
      });
      await AsyncStorage.setItem('bp_val', value);
      if(value.toLowerCase()==SELECT){
        await AsyncStorage.setItem('Devices_flg', 'no');
      }
      else{
        await AsyncStorage.setItem('Devices_flg', 'yes');
      }      
      global.bp_val = value;
    }
  };

  onValueChangePulseOximeter = async (value, label) => {
    if (value && value != '') {
      this.setState({
        PulseOximeter_val: value,
      });
      await AsyncStorage.setItem('PulseOximeter_val', value);
      if(value.toLowerCase()==SELECT){
        await AsyncStorage.setItem('Devices_flg', 'no');
      }
      else{
        await AsyncStorage.setItem('Devices_flg', 'yes');
      }      
      global.PulseOximeter_val = value;
    }
  };

  onValueChangeSpirometer = async (value, label) => {
    if (value && value != '') {
      this.setState({
        Spirometer_val: value,
      });
      await AsyncStorage.setItem('Spirometer_val', value);
      if(value.toLowerCase()==SELECT){
        await AsyncStorage.setItem('Devices_flg', 'no');
      }
      else{
        await AsyncStorage.setItem('Devices_flg', 'yes');
      }      
      global.Spirometer_val = value;
    }
  };

  onValueChangeTemperature = async (value, label) => {
    if (value && value != '') {
      this.setState({
        Temperature_val: value,
      });
      await AsyncStorage.setItem('Temperature_val', value);
      if(value.toLowerCase()==SELECT){
        await AsyncStorage.setItem('Devices_flg', 'no');
      }
      else{
        await AsyncStorage.setItem('Devices_flg', 'yes');
      }
      global.Temperature_val = value;
    }
  };
  render() {
    return (
      //   <ScrollView>
      <Container>
        <Content>
          {/* {this.chinesePicker()}
      {this.aashaPicker()} */}

          {/* <Row>
        <Col size={40}>
            <Label style={{margin:10}}>Height</Label>
        </Col>
        <Col size={60}>
        <Item picker>
        
        <Picker
        allowFontScaling={false}
        style={{height:40,marginTop:0,color:"black",marginLeft:0}}
        onValueChange={this.onValueChangeHeight.bind(this)}
        selectedValue={this.state.height_val}
        >
        <Picker.Item label={"Select"} value={""} />
        <Picker.Item label={"Aasha"} value={"Aasha"} />
        {/* <Picker.Item label={"Set1"} value={"Set1"} /> */}
          {/* </Picker>
        </Item>
        </Col>
      </Row> */}

          {/* <Row>
        <Col size={40}>
        <Label style={{margin:10}}>Weight</Label>
        </Col>
        <Col size={60}>
        <Item picker>
          <Picker
          allowFontScaling={false}
          style={{height:40,marginTop:0,color:"black",marginLeft:0}}
          selectedValue={this.state.weight_val}
          onValueChange={this.onValueChangeWeight.bind(this)}
          >
          <Picker.Item label={"Select"} value={""} />
          <Picker.Item label={"Aasha"} value={"Aasha"} />
          {/* <Picker.Item label={"Set1"} value={"Set1"} /> */}
          {/* </Picker>
          </Item>
        </Col>
      </Row> */}

          <Row>
            <Col size={43}>
              <Label style={{margin: 10}}
              testID="bpLabel"
              accessibilityLabel="bpLabel">{i18n.t('DEVICES.BP')}</Label>
            </Col>
            <Col size={60}>
              {/* <Item picker> */}
                <Picker
                  allowFontScaling={false}
                  style={{
                    height: 40,
                    marginTop: 0,
                    color: 'black',
                    marginLeft: 0,
                  }}
                  iosIcon={
                    <Icon2 style={{top: -5}} name="sort-down" color="#a9a9a9" 
                    testID="dropDownIcon1"
                    accessibilityLabel="dropDownIcon1"/>
                  }
                  placeholder={i18n.t('DEVICES.SELECT')}
                  selectedValue={this.state.bp_val}
                  onValueChange={this.onValueChangeBP.bind(this)}
                  testID="selectDropDown"
                  accessibilityLabel="selectDropDown">
                  <Picker.Item label={i18n.t('DEVICES.SELECT')} value={i18n.t('DEVICES.SELECT')} 
                  testID="selectPicker"
                  accessibilityLabel="selectPicker"/>
                  <Picker.Item label={i18n.t('DEVICES.AASHA')} value={i18n.t('DEVICES.AASHA')} 
                  testID="ashaPicker"
                  accessibilityLabel="ashaPicker"/>
                  {/* <Picker.Item label={"Set1"} value={"TEMP030039"} /> */}
                </Picker>
              {/* </Item> */}
            </Col>
          </Row>

          <Row>
            <Col size={43}>
              <Label style={{margin: 10}}
              testID="pulseOxiMeterText"
              accessibilityLabel="pulseOxiMeterText">{i18n.t('DEVICES.PULSEOXIMETER')}</Label>
            </Col>
            <Col size={60}>
              {/* <Item picker> */}
                <Picker
                  allowFontScaling={false}
                  style={{
                    height: 40,
                    marginTop: 0,
                    color: 'black',
                    marginLeft: 0,
                  }}
                  iosIcon={
                    <Icon2 style={{top: -5}} name="sort-down" color="#a9a9a9" />
                  }
                  placeholder={i18n.t('DEVICES.SELECT')}
                  selectedValue={this.state.PulseOximeter_val}
                  onValueChange={this.onValueChangePulseOximeter.bind(this)}
                  testID="pulseOxiMeterDropDown"
                  accessibilityLabel="pulseOxiMeterDropDown">
                  <Picker.Item label={i18n.t('DEVICES.SELECT')} value={i18n.t('DEVICES.SELECT')} />
                  <Picker.Item label={i18n.t('DEVICES.AASHA')} value={i18n.t('DEVICES.AASHA')} />
                  {/* <Picker.Item label={"Set1"} value={"Set1"} /> */}
                </Picker>
              {/* </Item> */}
            </Col>
          </Row>

          {/* <Row>
        <Col size={40}>
        <Label style={{margin:10}}>Spirometer</Label>
        </Col>      
        <Col size={60}>
        <Item picker>
        <Picker
          allowFontScaling={false}
          style={{height:40,marginTop:0,color:"black",marginLeft:0}}
          selectedValue={this.state.Spirometer_val}
          onValueChange={this.onValueChangeSpirometer.bind(this)}>
          <Picker.Item label={"Select"} value={"Select"} />
          <Picker.Item label={"Aasha"} value={"Aasha"} />
          {/* <Picker.Item label={"Set1"} value={"Set1"} /> */}
          {/* </Picker>
      </Item>
        </Col>
      </Row> */}
          <Row>
            <Col size={43}>
              <Label style={{margin: 10}}
              testID="temperatureText"
              accessibilityLabel="temperatureText">{i18n.t('DEVICES.TEMPERATURE')}</Label>
            </Col>
            <Col size={60}>
              {/* <Item picker> */}
                <Picker
                  allowFontScaling={false}
                  style={{
                    height: 40,
                    marginTop: 0,
                    color: 'black',
                    marginLeft: 0,
                  }}
                  iosIcon={
                    <Icon2 style={{top: -5}} name="sort-down" color="#a9a9a9" />
                  }
                  placeholder={i18n.t('DEVICES.SELECT')}
                  selectedValue={this.state.Temperature_val}
                  onValueChange={this.onValueChangeTemperature.bind(this)}
                  testID="temperatureSelectDropDown"
              accessibilityLabel="temperatureSelectDropDown">
                  <Picker.Item label={i18n.t('DEVICES.SELECT')} value={i18n.t('DEVICES.SELECT')} />
                  <Picker.Item label={i18n.t('DEVICES.AASHA')} value={i18n.t('DEVICES.AASHA')} />
                  {/* <Picker.Item label={"TEMP030039"} value={"TEMP030039"} />  */}
                </Picker>
              {/* </Item> */}
            </Col>
          </Row>
          {/* <Button success style={{ height: 40, marginTop: 8, marginRight: 10, width: 80 }} onPress={() => this.write('e')}>
                                <Text allowFontScaling={false} style={{ color: "white", marginLeft: 25 }}>ECG</Text>
      </Button>
      <Button success style={{ height: 40, marginTop: 8, marginRight: 10, width: 80 }} onPress={() => this.write('g')}>
                                <Text allowFontScaling={false} style={{ color: "white", marginLeft: 25 }}>Glucose</Text>
      </Button>
      <Button success style={{ height: 40, marginTop: 8, marginRight: 10, width: 80 }} onPress={() => this.write('s')}>
                                <Text allowFontScaling={false} style={{ color: "white", marginLeft: 25 }}>Stethoscope</Text>
      </Button> */}
        </Content>
      </Container>
    );
  }
}
