import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {
  Container,
  Footer,
  Button as NativeBaseButton,
  Toast,
  Icon,
} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import CountDown from 'react-native-countdown-component';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

// component
import TextInputComponent from '../Tabs/TextInput/TextInputComponent';
import CustomCheckBox from '../Tabs/CustomCheckBox/CustomCheckBox';

// styles,
import styles from './RecordVitalsStyles';
// images
import close from '../../../../assets/images/cancel.png';

import {
  overallStatusColor,
  temperatureColorCodes,
  pulseRateColor,
  spo2Color,
  systolicBloodPressureColor,
  systolicRateColor,
  activitySpo2Color,
  handleBreathingSectionColor,
} from '../Utils/OverallStatus';

import {recordVitalInputs} from './Utils/StateObjects';

import {APP_PRIMARY_COLOR} from '../../../../themes/variable';
// API service

import API from '../../../../services/Api';

const initialCheckBoxes = {
  cough: 'green1',
  running_nose: 'green1',
  sore_throat: 'green1',
  body_pain: 'green1',
  loss_of_appetite: 'green1',
  diarrhea: 'green1',
  lost_sense_of_smell_taste: 'green1',
  difficulty_in_breathing: 'green1',
  persistent_pain_pressure_in_chest: 'green1',
  bluish_lips_and_face: 'green1',
  confusion_fatigue: 'green1',
  rtpcr: 'grey',
  rapid_antigen: 'grey',
  antibody_lgg: 'grey',
  hrct: 'grey',
  diff_no: 'green1',
  diff_mild_: '',
  diff_moderate: '',
  diff_severe: '',
  pr_no: 'green1',
  pr_mild: '',
  pr_moderate: '',
  pr_severe: '',
  bl_no: 'green1',
  bl_mild: '',
  bl_moderate: '',
  bl_severe: '',
  cf_no: 'green1',
  cf_mild: '',
  cf_moderate: '',
  cf_severe: '',
};

const initialInputs = {
  temperature: '',
  pulse_rate: '',
  spo2: '',
  systolic_blood_pressure: '',
  respiratory_rate: '',
  rPulseRate: '',
  rSpo2: '',
  temperature_border: '',
  pulse_rate_border: '',
  spo2_border: '',
  systolic_blood_pressure_border: '',
  respiratory_rate_border: '',
  rSpo2_border: '',
  rPulseRate_border: '',
};

class CovidMonitoringRecordVitalsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      modal: false,
      save: false,
      start_activity: false,
      activity_inputs: false,
      doctor_name: '',
      show_alert_popup: false,
      checkBoxes: initialCheckBoxes,
      inputs: initialInputs,
      brArray: ['diff_no', 'diff_mild', 'diff_moderate', 'diff_severe'],
      prArray: ['pr_no', 'pr_mild', 'pr_moderate', 'pr_severe'],
      blArray: ['bl_no', 'bl_mild', 'bl_moderate', 'bl_severe'],
      cfArray: ['cf_no', 'cf_mild', 'cf_moderate', 'cf_severe'],
      patient: {},
      mode: 'date',
      show: false,
      isLoading: false,
    };

    this.borderActions = {
      temperature_border: 'temperature_border',
      pulse_rate_border: 'pulse_rate_border',
      spo2_border: 'spo2_border',
      systolic_blood_pressure_border: 'systolic_blood_pressure_border',
      respiratory_rate_border: 'respiratory_rate_border',
      rSpo2_border: 'rSpo2_border',
      rPulseRate_border: 'rPulseRate_border',
    };

    this.handleTemperatureSection = this.handleTemperatureSection.bind(this);
    this.renderHorizontalLine = this.renderHorizontalLine.bind(this);
    this.handleCheckBoxSection = this.handleCheckBoxSection.bind(this);
    this.saveRecordVital = this.saveRecordVital.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    this.init();
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  init = async () => {
    const doctor_name = await AsyncStorage.getItem('doctorname');
    this.setState({
      doctor_name,
      patient: this.props.patient,
    });
  };

  handleInputTextEnterSection(text, section, borderSection) {
    let inputs = this.state.inputs;
    inputs[section] = text;
    if (text !== '') {
      if (borderSection === this.borderActions.temperature_border) {
        inputs[borderSection] = temperatureColorCodes(text);
      } else if (
        borderSection === this.borderActions.pulse_rate_border ||
        borderSection === this.borderActions.rPulseRate_border
      ) {
        inputs[borderSection] = pulseRateColor(text);
      } else if (borderSection === this.borderActions.spo2_border) {
        inputs[borderSection] = spo2Color(text);
      } else if (
        borderSection === this.borderActions.systolic_blood_pressure_border
      ) {
        inputs[borderSection] = systolicBloodPressureColor(text);
      } else if (borderSection === this.borderActions.respiratory_rate_border) {
        inputs[borderSection] = systolicRateColor(text);
      } else if (borderSection === this.borderActions.rSpo2_border) {
        inputs[borderSection] = activitySpo2Color(text);
      }
      this.setState({
        inputs: inputs,
      });
    } else {
      inputs[borderSection] = '';
      this.setState({
        input: inputs,
      });
    }
  }

  onDateChange(event, selectedDate) {
    if (event.type === 'dismissed') {
      this.setState({show: false, mode: 'date'});
      return;
    }
    this.setState(
      {
        date: selectedDate,
        show: false,
      },
      () => {
        if (this.state.mode === 'date') {
          this.setState({show: true, mode: 'time'});
        } else {
          this.setState({show: false, mode: 'date'});
        }
      },
    );
  }

  renderHorizontalLine() {
    return <View style={styles.horizontalLine} />;
  }

  handleTemperatureSection(value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.vitalRecordInputSection}>
            <TextInputComponent
              borderColor={
                this.state.inputs.temperature_border === ''
                  ? 'black'
                  : this.state.inputs.temperature_border
              }
              defaultValue={this.state.inputs.temperature}
              onChangeText={(text) =>
                this.handleInputTextEnterSection(
                  text,
                  'temperature',
                  this.borderActions.temperature_border,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }

  handlePulseRateSection(value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.vitalRecordInputSection}>
            <TextInputComponent
              borderColor={
                this.state.inputs.pulse_rate_border === ''
                  ? 'black'
                  : this.state.inputs.pulse_rate_border
              }
              defaultValue={this.state.inputs.pulse_rate}
              onChangeText={(text) =>
                this.handleInputTextEnterSection(
                  text,
                  'pulse_rate',
                  this.borderActions.pulse_rate_border,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }

  handleSpo2Section(value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.vitalRecordInputSection}>
            <TextInputComponent
              borderColor={
                this.state.inputs.spo2_border === ''
                  ? 'black'
                  : this.state.inputs.spo2_border
              }
              defaultValue={this.state.inputs.spo2}
              onChangeText={(text) =>
                this.handleInputTextEnterSection(
                  text,
                  'spo2',
                  this.borderActions.spo2_border,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }

  handleSystolicBloodPressureSection(value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.vitalRecordInputSection}>
            <TextInputComponent
              borderColor={
                this.state.inputs.systolic_blood_pressure_border === ''
                  ? 'black'
                  : this.state.inputs.systolic_blood_pressure_border
              }
              defaultValue={this.state.inputs.systolic_blood_pressure}
              onChangeText={(text) =>
                this.handleInputTextEnterSection(
                  text,
                  'systolic_blood_pressure',
                  this.borderActions.systolic_blood_pressure_border,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }

  handleRespiratoryRateSection(value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.vitalRecordInputSection}>
            <TextInputComponent
              borderColor={
                this.state.inputs.respiratory_rate_border === ''
                  ? 'black'
                  : this.state.inputs.respiratory_rate_border
              }
              defaultValue={this.state.inputs.respiratory_rate}
              onChangeText={(text) =>
                this.handleInputTextEnterSection(
                  text,
                  'respiratory_rate',
                  this.borderActions.respiratory_rate_border,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }

  handleCheckBoxSection(section, value) {
    let newCheckBoxes = this.state.checkBoxes;
    newCheckBoxes[section] = value;
    this.setState({
      checkBoxes: newCheckBoxes,
    });
  }

  handleCheckBoxesSection(section, value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.checkBoxMainView}>
            <CustomCheckBox
              color={
                this.state.checkBoxes[section] === 'green1' ? 'green' : 'white'
              }
              onPress={() => this.handleCheckBoxSection(section, 'green1')}
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes[section] === 'green' ? 'green' : 'white'
              }
              onPress={() => this.handleCheckBoxSection(section, 'green')}
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes[section] === 'yellow' ? 'yellow' : 'white'
              }
              onPress={() => this.handleCheckBoxSection(section, 'yellow')}
            />

            <CustomCheckBox
              color={this.state.checkBoxes[section] === 'red' ? 'red' : 'white'}
              onPress={() => this.handleCheckBoxSection(section, 'red')}
            />
          </View>
        </View>
      </View>
    );
  }

  handleDifficultyInBreathingCheckBoxes(section, value, sectionArray) {
    let newCheckBoxes = this.state.checkBoxes;
    sectionArray.forEach((element) => {
      if (element === section) {
        newCheckBoxes[section] = value;
      } else {
        newCheckBoxes[element] = '';
      }
    });

    this.setState({
      checkBoxes: newCheckBoxes,
    });
  }

  handleDifficultyInBreathingSection(section, value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.checkBoxMainView}>
            <CustomCheckBox
              color={
                this.state.checkBoxes.diff_no === 'green1' ? 'green' : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  'diff_no',
                  'green1',
                  this.state.brArray,
                )
              }
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes.diff_mild === 'yellow1'
                  ? 'yellow'
                  : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  'diff_mild',
                  'yellow1',
                  this.state.brArray,
                )
              }
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes.diff_moderate === 'red1' ? 'red' : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  'diff_moderate',
                  'red1',
                  this.state.brArray,
                )
              }
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes.diff_severe === 'red' ? 'red' : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  'diff_severe',
                  'red',
                  this.state.brArray,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }

  handlingPressureInChest(
    section1,
    section2,
    section3,
    section4,
    value,
    sectionArray,
  ) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.checkBoxMainView}>
            <CustomCheckBox
              color={
                this.state.checkBoxes[section1] === 'green1' ? 'green' : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  section1,
                  'green1',
                  sectionArray,
                )
              }
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes[section2] === 'red2' ? 'red' : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  section2,
                  'red2',
                  sectionArray,
                )
              }
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes[section3] === 'red2' ? 'red' : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  section3,
                  'red2',
                  sectionArray,
                )
              }
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes[section4] === 'red' ? 'red' : 'white'
              }
              onPress={() =>
                this.handleDifficultyInBreathingCheckBoxes(
                  section4,
                  'red',
                  sectionArray,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }

  handleCovidTestCheckBoxSection(section, value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.checkBoxMainView}>
            <CustomCheckBox
              color={
                this.state.checkBoxes[section] === 'grey' ? 'grey' : 'white'
              }
              onPress={() => this.handleCheckBoxSection(section, 'grey')}
            />
            <CustomCheckBox
              color={
                this.state.checkBoxes[section] === 'green' ? 'green' : 'white'
              }
              onPress={() => this.handleCheckBoxSection(section, 'green')}
            />

            <CustomCheckBox
              color={this.state.checkBoxes[section] === 'red' ? 'red' : 'white'}
              onPress={() => this.handleCheckBoxSection(section, 'red')}
            />
          </View>
        </View>
      </View>
    );
  }

  handleCovidTestHrtc(section, value) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.checkBoxMainView}>
            <CustomCheckBox
              color={
                this.state.checkBoxes[section] === 'grey' ? 'grey' : 'white'
              }
              onPress={() => this.handleCheckBoxSection(section, 'grey')}
            />
            <CustomCheckBox
              color={this.state.checkBoxes[section] === 'red' ? 'red' : 'white'}
              onPress={() => this.handleCheckBoxSection(section, 'red')}
            />

            <CustomCheckBox
              color={
                this.state.checkBoxes[section] === 'green' ? 'green' : 'white'
              }
              onPress={() => this.handleCheckBoxSection(section, 'green')}
            />
          </View>
        </View>
      </View>
    );
  }

  renderSymptomsText(text) {
    return (
      <View style={styles.textSectionMainView}>
        <View style={[styles.textView]}>
          <Text numberOfLines={1} style={styles.textFontAndColor}>
            {text}
          </Text>
        </View>
      </View>
    );
  }
  renderSymptomsSectionHeaders(t) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.leftHeaderTextAndColor}>
            {t('RECORD_VITAL.SYMPTOMS')}
          </Text>
        </View>

        <View style={styles.flex}>
          <View style={styles.checkBoxMainView}>
            {this.renderSymptomsText(t('RECORD_VITAL.NO'))}

            {this.renderSymptomsText(t('RECORD_VITAL.MILD'))}

            {this.renderSymptomsText(t('RECORD_VITAL.MODERATE'))}

            {this.renderSymptomsText(t('RECORD_VITAL.SEVERE'))}
          </View>
        </View>
      </View>
    );
  }

  renderCovidTestHeaders(t) {
    return (
      <View style={[styles.inputSectionView]}>
        <View style={styles.vitalRecordInputSection}>
          <Text style={styles.leftHeaderTextAndColor}>
            {t('RECORD_VITAL.COVID_TEST')}
          </Text>
        </View>

        <View style={styles.flex}>
          <View style={styles.checkBoxMainView}>
            {this.renderSymptomsText(t('RECORD_VITAL.NOT_TESTED'))}

            {this.renderSymptomsText(t('RECORD_VITAL.POSITIVE'))}

            {this.renderSymptomsText(t('RECORD_VITAL.NEGATIVE'))}
          </View>
        </View>
      </View>
    );
  }

  checkRecordVitals() {
    if (
      this.state.inputs.temperature !== '' ||
      this.state.inputs.pulse_rate !== '' ||
      this.state.inputs.spo2 !== '' ||
      this.state.inputs.systolic_blood_pressure !== '' ||
      this.state.inputs.respiratory_rate !== '' ||
      this.state.inputs.rPulseRate !== '' ||
      this.state.inputs.rSpo2 !== ''
    ) {
      return true;
    }
    return false;
  }
  saveRecordVital = async (t) => {
    try {
      this.setState({
        isLoading: true,
      });
      const payload = {
        nh_id: this.props.doctor_id,
        token: this.props.token,
        hlp_id: this.props.patient.hlpid,
        enc_id: this.props.patient.enc_id,
        doctor_name: this.state.doctor_name,
        date: this.state.date,
      };

      if (this.checkRecordVitals()) {
        // preparing input section
        payload.Temperature = this.state.inputs.temperature;
        payload.Pulse_rate = this.state.inputs.pulse_rate;
        payload.SPO2 = this.state.inputs.spo2;
        payload.Systolic_blood_pressure = this.state.inputs.systolic_blood_pressure;
        payload.Respiratory_rate = this.state.inputs.respiratory_rate;
        payload.activity_spo2 = this.state.inputs.rSpo2;
        payload.activity_pulse_rate = this.state.inputs.rPulseRate;

        // Preparing check box section;
        payload.Cough = this.state.checkBoxes.cough;
        payload.Running_nose = this.state.checkBoxes.running_nose;
        payload.Sore_throat = this.state.checkBoxes.sore_throat;
        payload.Sore_throat = this.state.checkBoxes.sore_throat;
        payload.Body_pain = this.state.checkBoxes.body_pain;
        payload.Loss_appetite = this.state.checkBoxes.loss_of_appetite;
        payload.Diarrhea = this.state.checkBoxes.diarrhea;
        payload.Lost_sense = this.state.checkBoxes.lost_sense_of_smell_taste;

        
        // payload.Difficulty_breathing = this.state.checkBoxes.difficulty_in_breathing;
        payload.Difficulty_breathing = handleBreathingSectionColor(
          this.state.checkBoxes.diff_no,
          this.state.checkBoxes.diff_mild,
          this.state.checkBoxes.diff_moderate,
          this.state.checkBoxes.diff_severe,
        );
        // payload.Persistent_pain_pressure_chest = this.state.checkBoxes.persistent_pain_pressure_in_chest;

        payload.Persistent_pain_pressure_chest = handleBreathingSectionColor(
          this.state.checkBoxes.pr_no,
          this.state.checkBoxes.pr_mild,
          this.state.checkBoxes.pr_moderate,
          this.state.checkBoxes.pr_severe,
        );
        // payload.Bluish_lips_face = this.state.checkBoxes.bluish_lips_and_face;

        payload.Bluish_lips_face = handleBreathingSectionColor(
          this.state.checkBoxes.bl_no,
          this.state.checkBoxes.bl_mild,
          this.state.checkBoxes.bl_moderate,
          this.state.checkBoxes.bl_severe,
        );

        // payload.Confusion_fatigue = this.state.checkBoxes.confusion_fatigue;

        payload.Confusion_fatigue = handleBreathingSectionColor(
          this.state.checkBoxes.cf_no,
          this.state.checkBoxes.cf_mild,
          this.state.checkBoxes.cf_moderate,
          this.state.checkBoxes.cf_severe,
        );

        payload.RTPCR = this.state.checkBoxes.rtpcr;
        payload.Rapid_antigen = this.state.checkBoxes.rapid_antigen;
        payload.Antibody_IgG = this.state.checkBoxes.antibody_lgg;

        payload.overall_status = overallStatusColor(
          this.state.checkBoxes,
          {},
          this.state.inputs,
        );
        payload.hrct = this.state.checkBoxes.hrct;

        // covid History
        payload.have_contacted_covid_person = '';
        payload.have_travelled_covid_affected_areas = '';
        payload.taken_vaccination = '';
        payload.vaccination_name = '';
        payload.is_flag = 'insert';
        payload.have_contacted_covid_person = '';
        payload.have_travelled_covid_affected_areas = '';
        payload.taken_vaccination = '';
        payload.vaccination_name_one = '';
        payload.vaccination_name_two = '';
        payload.no_of_doses = '';
        payload.date_of_first_dose = '';
        payload.date_of_second_dose = '';
        payload.medical_conditions = '';
        payload.health_history = '';
        const response = await API.call(
          'post',
          'save_covid_vitals_data/',
          payload,
        );
        if (response && response?.status_code === 200) {
          Toast.show({
            text: t('RECORD_VITAL.SAVE_MESSAGE'),
            type: 'success',
            position: 'top',
            duration: 3000,
          });
          let inputs = {
            pulse_rate: '',
            pulse_rate_border: '',
            rPulseRate: '',
            rPulseRate_border: '',
            rSpo2: '',
            rSpo2_border: '',
            respiratory_rate: '',
            respiratory_rate_border: '',
            spo2: '',
            spo2_border: '',
            systolic_blood_pressure: '',
            systolic_blood_pressure_border: '',
            temperature: '',
            temperature_border: '',
          };

          let checkBoxes = {
            cough: 'green1',
            running_nose: 'green1',
            sore_throat: 'green1',
            body_pain: 'green1',
            loss_of_appetite: 'green1',
            diarrhea: 'green1',
            lost_sense_of_smell_taste: 'green1',
            difficulty_in_breathing: 'green1',
            persistent_pain_pressure_in_chest: 'green1',
            bluish_lips_and_face: 'green1',
            confusion_fatigue: 'green1',
            rtpcr: 'grey',
            rapid_antigen: 'grey',
            antibody_lgg: 'grey',
            hrct: 'grey',
            diff_no: 'green1',
            diff_mild_: '',
            diff_moderate: '',
            diff_severe: '',
            pr_no: 'green1',
            pr_mild: '',
            pr_moderate: '',
            pr_severe: '',
            bl_no: 'green1',
            bl_mild: '',
            bl_moderate: '',
            bl_severe: '',
            cf_no: 'green1',
            cf_mild: '',
            cf_moderate: '',
            cf_severe: '',
          };

          this.setState(
            {
              checkBoxes: checkBoxes,
              inputs: inputs,
              show_alert_popup: false,
              date: new Date(),
              start_activity: false,
              activity_inputs: false,
              modal: false,
              save: false,
            },
            () => this.props.updateActiveTab(0),
          );
        }
      } else {
        Toast.show({
          text: t('RECORD_VITAL.WARNING_MESSAGE'),
          type: 'warning',
          position: 'top',
          duration: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        text: t('RECORD_VITAL.ERROR_MESSAGE'),
        type: 'danger',
        position: 'top',
        duration: 3000,
      });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  setModalVisible() {
    this.setState({modal: false});
  }

  closeModal() {
    this.setState({
      modal: false,
      save: false,
      activity_inputs: false,
      start_activity: false,
    });
  }

  enableAlertPopUp() {
    this.setState({
      show_alert_popup: true,
    });
  }

  alertCancel(t) {
    this.setState({
      show_alert_popup: false,
    });
    this.saveRecordVital(t);
  }

  alertAccepted() {
    this.setState({
      modal: true,
      show_alert_popup: false,
    });
  }

  renderExtraRecordVitals(t) {
    return (
      <View style={styles.extraRecordingVitalMainView}>
        <View style={styles.textInfoView}>
          <Text style={styles.recordText}>
            {t('RECORD_VITAL.EXTRA_RECORD_VITAL_TEXT')}
          </Text>
        </View>
        <View style={styles.recordButtonMainView}>
          <NativeBaseButton
            large
            style={styles.nativeButton}
            onPress={() =>
              this.setState({modal: true, show_alert_popup: false})
            }>
            <Text style={styles.text}>{t('RECORD_VITAL.START')}</Text>
          </NativeBaseButton>
        </View>
      </View>
    );
  }

  renderFooterSection(t) {
    return (
      <Footer style={styles.footerTotalSection}>
        <View style={styles.dateComponentStyles}>
          <Text style={styles.asOfText}>{t('RECORD_VITAL.AS_OF')}</Text>
          <View style={styles.dateSelect}>
            <TouchableOpacity
              onPress={() => this.setState({show: true})}
              style={styles.dateField}>
              <Text>
                {moment(this.state.date).format('DD-MMM-YYYY hh:mm A')}
              </Text>
              <Icon
                name="calendar"
                type="MaterialCommunityIcons"
                style={styles.dateIcon}
              />
            </TouchableOpacity>
            {this.state.show && (
              <DateTimePicker
                testID="dateTimePicker"
                accessibilityLabel="dateTimePicker"
                mode={this.state.mode}
                value={new Date(this.state.date)}
                display="default"
                onChange={this.onDateChange}
                minimumDate={new Date('01-01-2019')}
                maximumDate={new Date()}
              />
            )}
          </View>
        </View>
        <View style={styles.footerView}>
          <Button
            disabled={this.state.isLoading}
            title={t('RECORD_VITAL.SAVE')}
            color="#808080"
            onPress={() => this.enableAlertPopUp()}
          />
        </View>
      </Footer>
    );
  }

  additionalRecordVital(value, key, borderSection) {
    return (
      <View style={[styles.additionalRecordVitalView, styles.marginBottom10]}>
        <View style={styles.textSection}>
          <Text style={styles.inputText}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.vitalRecordInputSection}>
            <TextInputComponent
              borderColor={
                this.state.inputs[borderSection] === ''
                  ? 'black'
                  : this.state.inputs[borderSection]
              }
              defaultValue={this.state.inputs[key]}
              onChangeText={(text) =>
                this.handleInputTextEnterSection(text, key, borderSection)
              }
            />
          </View>
        </View>
      </View>
    );
  }

  startActivity() {
    this.setState({
      start_activity: true,
      activity_inputs: true,
    });
  }

  enableActivityVitals() {
    this.setState({
      start_activity: false,
      activity_inputs: true,
    });
  }

  recordModalSection(t) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modal}
        onRequestClose={() => {
          this.setModalVisible();
        }}>
      <SafeAreaView style={{flex: 5,marginTop:-80}}>
      <KeyboardAvoidingView
        behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
        style={{flex: 5,marginTop:-10 }}
        >
        <View style={styles.halfModalStyles}>
          <View style={styles.modalCloseView}>
            <TouchableOpacity onPress={() => this.closeModal()}>
              <Image source={close} style={styles.closeIconStyles}></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.modalText}>
              {t('RECORD_VITAL.VITAL_MODAL_TEXT')}
            </Text>
          </View>
          {/* countdown timer Section start*/}
          {!this.state.start_activity && !this.state.activity_inputs && (
            <View style={styles.recordVitalButtonMainView}>
              <NativeBaseButton
                large
                style={styles.recordVitalSaveButton}
                onPress={() => this.startActivity()}>
                <Text style={styles.startText}>{t('RECORD_VITAL.START')}</Text>
              </NativeBaseButton>
            </View>
          )}
          {this.state.start_activity && (
            <View style={styles.marginTop15}>
              <CountDown
                until={6 * 60}
                size={20}
                digitStyle={styles.digitStyle}
                digitTxtStyle={styles.digitTxtStyle}
                timeToShow={['M', 'S']}
                timeLabels={{m: 'MM', s: 'SS'}}
              />
            </View>
          )}
          {/*  count down timer section  */}

          {/* Doctor Instructions section */}

          <View style={styles.doctorInstructionsMainView}>
            <Text style={styles.doctorInstructionsText}>
              {t('RECORD_VITAL.DC_INSTRUCTIONS')}
            </Text>
            <View style={styles.doctorSectionMainView}>
              <View style={styles.flex}>
                <Text style={styles.instText}>
                  {t('RECORD_VITAL.DOCTOR_NOTE')}
                </Text>
              </View>
            </View>
          </View>

          {this.state.activity_inputs &&
            this.additionalRecordVital(
              t('RECORD_VITAL.SPO2'),
              'rSpo2',
              this.borderActions.rSpo2_border,
            )}

          {this.state.activity_inputs &&
            this.additionalRecordVital(
              t('RECORD_VITAL.PULSE_RATE'),
              'rPulseRate',
              this.borderActions.rPulseRate_border,
            )}

          {/* save Button View  start*/}
          {this.state.activity_inputs && (
            <View style={styles.recordVitalButtonMainView}>
              <NativeBaseButton
                large
                primary
                style={styles.recordVitalSaveButton}
                onPress={() => this.saveRecordVital(t)}>
                <Text style={styles.startText}>{t('RECORD_VITAL.SAVE')}</Text>
              </NativeBaseButton>
            </View>
          )}
          {/* save button view end */}
        </View>
        </KeyboardAvoidingView>
          </SafeAreaView>

      </Modal>
    );
  }
  render() {
    const {t} = this.props;
    const state = this.state;
    return (
      <Container>
        <ScrollView>
          {this.state.isLoading && (
            <View style={styles.inputMain}>
              <ActivityIndicator size="large" color={APP_PRIMARY_COLOR} />
            </View>
          )}

          {this.props.status === 'closed' && (
            <View style={[styles.inputMain, styles.marginTop45]}>
              <Text style={styles.patientClosedTextStyles}>
                {t('RECORD_VITAL.PATIENT_CLOSED')}
              </Text>
            </View>
          )}

          {!this.state.isLoading && this.props.status !== 'closed' && (
            <View style={styles.wrapper}>
              {/* input section start */}
              <View style={styles.inputSectionMainView}>
                {/* temperature section */}
                {this.handleTemperatureSection(t('RECORD_VITAL.TEMPERATURE'))}
                {/* Pulse Rate section */}
                {this.handlePulseRateSection(t('RECORD_VITAL.PULSE_RATE'))}
                {/* spo2 section */}
                {this.handleSpo2Section(t('RECORD_VITAL.SPO2'))}

                {/* Systolic Blood Pressure section */}
                {this.handleSystolicBloodPressureSection(
                  t('RECORD_VITAL.SYSTOLIC_BLOOD_PRESSURE'),
                )}

                {/* Systolic Blood Pressure section */}
                {this.handleRespiratoryRateSection(
                  t('RECORD_VITAL.RESPIRATORY_RATE'),
                )}
              </View>
              {/* input Section end */}

              {/*  horizontal line */}
              {this.renderHorizontalLine()}

              {/* Symptoms section start */}
              {this.renderSymptomsSectionHeaders(t)}
              {this.renderHorizontalLine()}

              {/* handle cough section */}
              {this.handleCheckBoxesSection('cough', t('RECORD_VITAL.COUGH'))}

              {/* running nose section */}
              {this.handleCheckBoxesSection(
                'running_nose',
                t('RECORD_VITAL.RUNNING_NOSE'),
              )}

              {/* Sore throat */}
              {this.handleCheckBoxesSection(
                'sore_throat',
                t('RECORD_VITAL.SORE_THROAT'),
              )}

              {/* Body Pain section*/}
              {this.handleCheckBoxesSection(
                'body_pain',
                t('RECORD_VITAL.BODY_PAIN'),
              )}

              {/* Loss Of Appetite section*/}
              {this.handleCheckBoxesSection(
                'loss_of_appetite',
                t('RECORD_VITAL.LOSS_OF_APPETITE'),
              )}

              {/* Diarrhea section*/}
              {this.handleCheckBoxesSection(
                'diarrhea',
                t('RECORD_VITAL.DIARRHEA'),
              )}

              {/*  Lost sense of smell & taste section*/}
              {this.handleCheckBoxesSection(
                'lost_sense_of_smell_taste',
                t('RECORD_VITAL.LOST_SENSE_OF_SMELL_TASTE'),
              )}

              {/*  Difficulty in breathing section*/}
              {this.handleDifficultyInBreathingSection(
                'difficulty_in_breathing',
                t('RECORD_VITAL.DIFFICULTY_IN_BREATHING'),
              )}

              {/*  Persistent pain /pressure in chest section*/}
              {this.handlingPressureInChest(
                'pr_no',
                'pr_mild',
                'pr_moderate',
                'pr_severe',
                t('RECORD_VITAL.PERSISTENT_PAIN_PRESSURE_IN_CHEST'),
                state.prArray,
              )}

              {/*  Bluish lips and face section*/}
              {this.handlingPressureInChest(
                'bl_no',
                'bl_mild',
                'bl_moderate',
                'bl_severe',
                t('RECORD_VITAL.BLUISH_LIPS_AND_FACE'),
                state.blArray,
              )}

              {/*  Confusion/Fatigue section*/}
              {this.handlingPressureInChest(
                'cf_no',
                'cf_mild',
                'cf_moderate',
                'cf_severe',
                t('RECORD_VITAL.CONFUSION_FATIGUE'),
                state.cfArray,
              )}

              {this.renderHorizontalLine()}

              {/* Symptoms section start */}
              {this.renderCovidTestHeaders(t)}
              {this.renderHorizontalLine()}

              {/* covid test Section check boxes */}
              {this.handleCovidTestHrtc('rtpcr', t('RECORD_VITAL.RTPCR'))}
              {this.handleCovidTestHrtc(
                'rapid_antigen',
                t('RECORD_VITAL.RAPID_ANTIGEN'),
              )}
              {this.handleCovidTestCheckBoxSection(
                'antibody_lgg',
                t('RECORD_VITAL.ANTIBODY_LLG'),
              )}
              {this.handleCovidTestHrtc('hrct', t('RECORD_VITAL.HRCT'))}
              {/* 

            {/* Extra recording vitals  start */}
              {!this.state.save && this.renderExtraRecordVitals(t)}

              {/* alert section */}
              {this.state.show_alert_popup &&
                !this.state.save &&
                Alert.alert(
                  t('RECORD_VITAL.TAKE_ACTIVITY'),
                  t('RECORD_VITAL.TAKE_ACTIVITY_MESSAGE'),
                  [
                    {
                      text: t('RECORD_VITAL.NO'),
                      onPress: () => this.alertCancel(t),
                      style: 'cancel',
                    },
                    {
                      text: t('RECORD_VITAL.OK'),
                      onPress: () => this.alertAccepted(),
                      style: 'ok',
                    },
                  ],
                )}
            </View>
          )}
        </ScrollView>

        {/* footer section */}
        {!this.state.save &&
          this.props.status !== 'closed' &&
          this.renderFooterSection(t)}

        {/* record model section */}
        {!this.state.isLoading && this.recordModalSection(t)}
      </Container>
    );
  }
}

export default withTranslation()(CovidMonitoringRecordVitalsTab);
