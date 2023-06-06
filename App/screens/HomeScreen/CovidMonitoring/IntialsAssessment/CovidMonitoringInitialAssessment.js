import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Button,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Container,
  Footer,
  Header,
  Button as NativeButton,
  Toast,
  Icon,
} from 'native-base';
import {Picker} from '@react-native-picker/picker';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import CountDown from 'react-native-countdown-component';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ChangeDateIcon from '../../../../assets/images/dateIcon.png';
// styles
import styles from './CovidMonitoringInitialAssessmentStyles';
import {
  COLOR_CODES,
  DEFAULT_GREY_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_WHITE_COLOR,
  DEFAULT_LIGHT_GREY_COLOR,
} from '../../../../themes/variable';

// components
import InitialAssessmentInputComponent from './InitialAssessmentInputComponent/InitialAssessmentInputComponent';
import InitialAssessmentCheckBoxComponent from './InitialAssessmentCheckBoxComponent/InitialAssessmentCheckBoxComponent';

// Api Services and methods
import API from '../../../../services/Api';
import {
  populateInitialAssessmentInputSection,
  populateInitialAssessmentCheckBoxSection,
  generateInitialAssessmentData,
  ageColorCode,
  generateRecordVitalPayload,
  overallStatusColor,
  handleBreathingSectionColor,
  recordVitalsInputSections,
  recordVitalCheckBoxes,
  updateTemperatureColorCodes,
  updatePulseRateColor,
  updatedSpo2Color,
  updatedSystolicBloodPressureColor,
  updatedSystolicRateColor,
  updatedActivitySpo2Color,
} from '../Utils/OverallStatus';
import {dateDDMMYYYY} from '../Utils/DateTimeUtil';
import {calculateAge} from '../Utils/Utils';

// images
import trash from '../../../../assets/images/trash.png';
import plusImage from '../../../../assets/images/plus.png';
import close from '../../../../assets/images/cancel.png';
import Activity from '../../../../assets/images/activity_blue.svg';
import DateIcon from '../../../../assets/images/dateIcon.png';
import DateActivity from '../../../../assets/images/date.svg';
class CovidMonitoringInitialAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {
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
      },
      checkBoxes: {
        cough: COLOR_CODES.MILD,
        running_nose: COLOR_CODES.MILD,
        sore_throat: COLOR_CODES.MILD,
        body_pain: COLOR_CODES.MILD,
        loss_of_appetite: COLOR_CODES.MILD,
        diarrhea: COLOR_CODES.MILD,
        lost_sense_of_smell_taste: COLOR_CODES.MILD,
        difficulty_in_breathing: COLOR_CODES.MILD,
        persistent_pain_pressure_in_chest: COLOR_CODES.MILD,
        bluish_lips_and_face: COLOR_CODES.MILD,
        confusion_fatigue: COLOR_CODES.MILD,
        rtpcr: COLOR_CODES.GREY,
        rapid_antigen: COLOR_CODES.GREY,
        antibody_lgg: COLOR_CODES.GREY,
        hrct: COLOR_CODES.GREY,
        contacted_covid_person: COLOR_CODES.NO,
        travelled_covid_areas: COLOR_CODES.NO,
        taken_vaccine: '',
        doses_token: '',
        medical_conditions: '',
        health_history: '',
        first_dose_date: new Date(),
        second_dose_date: new Date(),
        lungs: '',
        heart: '',
        kidney: '',
        liver: '',
        brain_neuro: '',
        sam: '',
        pregnancy_prenatal_post_natal: '',
        high_bp: '',
        diabetes: '',
        immune_compromised: '',
        cancer: '',
        diff_no: COLOR_CODES.MILD,
        diff_mild: '',
        diff_moderate: '',
        diff_severe: '',
        pr_no: COLOR_CODES.MILD,
        pr_mild: '',
        pr_moderate: '',
        pr_severe: '',
        bl_no: COLOR_CODES.MILD,
        bl_mild: '',
        bl_moderate: '',
        bl_severe: '',
        cf_no: COLOR_CODES.MILD,
        cf_mild: '',
        cf_moderate: '',
        cf_severe: '',
      },
      doctor_name: '',
      flag: false,
      vaccination_detail: [],
      modal: false,
      vaccinationDate: new Date(),
      vaccinationName: '',
      doseNumber: '1',
      selectedValue: 'Covishield',
      initialAlert: false,
      initialAssessmentDate: new Date(),
      brArray: ['diff_no', 'diff_mild', 'diff_moderate', 'diff_severe'],
      prArray: ['pr_no', 'pr_mild', 'pr_moderate', 'pr_severe'],
      blArray: ['bl_no', 'bl_mild', 'bl_moderate', 'bl_severe'],
      cfArray: ['cf_no', 'cf_mild', 'cf_moderate', 'cf_severe'],
      patient: {},
      from: '',
      mode: 'date',
      show: false,
      show_alert_popup: false,
      activityModal: false,
      save: false,
      start_activity: true,
      activity_inputs: true,
      date: new Date(),
      loader: false,
    };
    this.borderActions = {
      temperature_border: 'temperature_border',
      pulse_rate_border: 'pulse_rate_border',
      spo2_border: 'spo2_border',
      systolic_blood_pressure_border: 'systolic_blood_pressure_border',
      respiratory_rate_border: 'respiratory_rate_border',
      rPulseRate_border: 'rPulseRate_border',
      rSpo2_border: 'rSpo2_border',
    };

    this.handleBackPress = this.handleBackPress.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
    this.handleVaccinationDate = this.handleVaccinationDate.bind(this);
  }

  componentDidMount() {
    this.init();
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress() {
    this.props.navigation.goBack(null);
    return true;
  }

  toggleDatePicker() {
    this.setState(prevState => ({
      show: !prevState.show,
    }));
  }

  init = async () => {
    try {
      const doctor_name = await AsyncStorage.getItem('doctorname');
      this.setState({doctor_name});
      const {doctor_id, patient, token, from} =
        this.props?.navigation?.state?.params;
      if (from === 'initial_assessment') {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      }
      // updating screen from to state

      this.setState({
        from: from,
        patient: patient,
      });
      const payload = {
        id: doctor_id,
        token: token,
        hlp_id: patient.hlpid,
        enc_id: patient.enc_id,
        doctor_flag: '1',
        role: await AsyncStorage.getItem('role'),
      };

      if (patient?.is_initial_assessment && from === 'initial_assessment') {
        this.setState({
          flag: true,
        });
        const response = await API.call(
          'post',
          'get_covid_initial_assessment_record/',
          payload,
        );
        if (
          response &&
          response?.data &&
          response?.data?.initial_assessment_detail &&
          response?.data?.vaccination_detail
        ) {
          //initial assessment input section.
          const initial_assessment_detail =
            response?.data?.initial_assessment_detail;

          const vaccination_detail = response?.data?.vaccination_detail;

          const inputs = this.state.input;
          // populating initial assessment input section
          const populatingInputs = populateInitialAssessmentInputSection(
            inputs,
            initial_assessment_detail,
          );

          // populating initial assessment checkBox section
          const checkBoxValues = this.state.checkBoxes;

          const newCheckBoxValues = populateInitialAssessmentCheckBoxSection(
            checkBoxValues,
            initial_assessment_detail,
          );
          newCheckBoxValues.taken_vaccine = vaccination_detail?.length
            ? 'yes'
            : 'no';

          this.setState({
            input: populatingInputs,
            checkBoxes: newCheckBoxValues,
            vaccination_detail: vaccination_detail,
            initialAssessmentDate: initial_assessment_detail.date,
            patient: patient,
          });
        }
      } else {
        this.setState({
          flag: false,
        });
      }
    } catch (error) {
      const {t} = this.props;
      Toast.show({
        text:
          (error && error.message) ||
          t('INITIAL_ASSESSMENT.INITIAL_ASSESSMENT_ERROR_MESSAGE'),
        type: 'danger',
        duration: 3000,
      });
    }
  };

  renderHorizontalLine() {
    return <View style={styles.horizontalLine} />;
  }

  handleInput(input, lowest, highest, type) {
    const {t} = this.props;
    if (input >= lowest && input <= highest) {
      return true;
    } else {
      Toast.show({
        text: t('PROFILE.FIELD_INPUT', {
          name: type,
          lowest: lowest,
          highest: highest,
        }),
        type: 'warning',
        duration: 3000,
      });
      return false;
    }
  }

  handleInputRestrictions(section, text) {
    const input = parseInt(text);
    if (section === 'temperature') {
      return this.handleInput(input, 0, 120, 'temperature');
    } else if (section === 'pulse_rate' || section === 'rPulseRate') {
      return this.handleInput(input, 0, 175, 'pulse rate');
    } else if (section === 'spo2' || section === 'rSpo2') {
      return this.handleInput(input, 0, 100, 'spo2');
    } else if (section === 'systolic_blood_pressure') {
      return this.handleInput(input, 0, 300, 'systolic blood pressure');
    } else if (section === 'respiratory_rate') {
      return this.handleInput(input, 0, 75, 'respiratory rate');
    }
  }

  handleInputTextEnterSection(text, section, borderSection) {
    const inputs = this.state.input;
    // restrict input sections
    const inputFlag = this.handleInputRestrictions(section, text);
    if (inputFlag) {
      inputs[section] = text;
      if (text !== '') {
        if (borderSection === this.borderActions.temperature_border) {
          inputs[borderSection] = updateTemperatureColorCodes(text);
        } else if (borderSection === this.borderActions.pulse_rate_border) {
          inputs[borderSection] = updatePulseRateColor(text);
        } else if (borderSection === this.borderActions.spo2_border) {
          inputs[borderSection] = updatedSpo2Color(text);
        } else if (
          borderSection === this.borderActions.systolic_blood_pressure_border
        ) {
          inputs[borderSection] = updatedSystolicBloodPressureColor(text);
        } else if (
          borderSection === this.borderActions.respiratory_rate_border
        ) {
          inputs[borderSection] = updatedSystolicRateColor(text);
        } else if (borderSection === this.borderActions.rSpo2_border) {
          inputs[borderSection] = updatedActivitySpo2Color(text);
        } else if (borderSection === this.borderActions.rPulseRate_border) {
          inputs[borderSection] = updatePulseRateColor(text);
        }
        this.setState({
          input: inputs,
        });
      } else {
        inputs[borderSection] = '';
        this.setState({
          input: inputs,
        });
      }
    } else {
      inputs[section] = '';
      inputs[borderSection] = '';
      this.setState({
        input: inputs,
      });
    }
  }

  ageSection(t, patient) {
    const colorCode = ageColorCode(patient.dob);
    return (
      <View style={styles.inputSectionMainView}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID="ageText"
          accessibilityLabel="ageText">{t('INITIAL_ASSESSMENT.AGE')}</Text>
        </View>
        <View style={styles.width60}>
          <View
            style={[
              styles.ageStyles,
              {
                backgroundColor: colorCode,
              },
            ]}></View>
        </View>
      </View>
    );
  }

  renderTemperatureSection(t) {
    return (
      <View style={styles.inputSectionMainView}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID="temperatureText"
          accessibilityLabel="temperatureText">{t('HISTORY.TEMPERATURE')}</Text>
        </View>
        <View style={styles.width60}>
          <InitialAssessmentInputComponent
          testID="temperarureTextinput"
          accessibilityLabel="temperarureTextinput"
            defaultValue={this.state.input.temperature}
            borderColor={
              this.state.input.temperature_border === ''
                ? COLOR_CODES.BLACK
                : this.state.input.temperature_border
            }
            onChangeText={text =>
              this.handleInputTextEnterSection(
                text,
                'temperature',
                this.borderActions.temperature_border,
              )
            }
          />
        </View>
      </View>
    );
  }

  renderPulseRateSection(t) {
    return (
      <View style={styles.inputSectionMainView}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID="pulseRateText"
          accessibilityLabel="pulseRateText">{t('HISTORY.PULSE_RATE')}</Text>
        </View>
        <View style={styles.width60}>
          <InitialAssessmentInputComponent
         testID="pulseRateTextInput"
         accessibilityLabel="pulseRateTextInput"
            defaultValue={this.state.input.pulse_rate}
            borderColor={
              this.state.input.pulse_rate_border === ''
                ? COLOR_CODES.BLACK
                : this.state.input.pulse_rate_border
            }
            onChangeText={text =>
              this.handleInputTextEnterSection(
                text,
                'pulse_rate',
                this.borderActions.pulse_rate_border,
              )
            }
          />
        </View>
      </View>
    );
  }

  renderSpo2Section(t) {
    return (
      <View style={styles.inputSectionMainView}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID="spoText"
          accessibilityLabel="spoText">{t('HISTORY.SPO2')}</Text>
        </View>
        <View style={styles.width60}>
          <InitialAssessmentInputComponent
          testID="spoTextInput"
          accessibilityLabel="spoTextInput"
            borderColor={
              this.state.input.spo2_border === ''
                ? COLOR_CODES.BLACK
                : this.state.input.spo2_border
            }
            defaultValue={this.state.input.spo2}
            onChangeText={text =>
              this.handleInputTextEnterSection(
                text,
                'spo2',
                this.borderActions.spo2_border,
              )
            }
          />
        </View>
      </View>
    );
  }

  renderSystolicBloodPressure(t) {
    return (
      <View style={styles.inputSectionMainView}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID="bloodPressureText"
          accessibilityLabel="bloodPressureText">
            {t('HISTORY.SYSTOLIC_BLOOD_PRESSURE')}
          </Text>
        </View>
        <View style={styles.width60}>
          <InitialAssessmentInputComponent
          testID="bloodPressuuretextinput"
          accessibilityLabel="bloodPressuuretextinput"
            defaultValue={this.state.input.systolic_blood_pressure}
            borderColor={
              this.state.input.systolic_blood_pressure_border === ''
                ? COLOR_CODES.BLACK
                : this.state.input.systolic_blood_pressure_border
            }
            onChangeText={text =>
              this.handleInputTextEnterSection(
                text,
                'systolic_blood_pressure',
                this.borderActions.systolic_blood_pressure_border,
              )
            }
          />
        </View>
      </View>
    );
  }

  renderRespiratoryRate(t) {
    return (
      <View style={styles.inputSectionMainView}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID="respiratoryText"
          accessibilityLabel="respiratoryText">{t('HISTORY.RESPIRATORY_RATE')}</Text>
        </View>
        <View style={styles.width60}>
          <InitialAssessmentInputComponent
          testID="respiratorytextInput"
          accessibilityLabel="respiratorytextInput"
            defaultValue={this.state.input.respiratory_rate}
            borderColor={
              this.state.input.respiratory_rate_border === ''
                ? COLOR_CODES.BLACK
                : this.state.input.respiratory_rate_border
            }
            onChangeText={text =>
              this.handleInputTextEnterSection(
                text,
                'respiratory_rate',
                this.borderActions.respiratory_rate_border,
              )
            }
          />
        </View>
      </View>
    );
  }

  renderInitialAssessmentInputSection(t, patient) {
    return (
      <View>
        {/* Headers section */}
        <View style={styles.flexDirectionRow}>
          <View style={styles.width40}>
            <Text style={styles.headersText}
            testID="vitalSignsText"
            accessibilityLabel="vitalSignsText">
              {t('INITIAL_ASSESSMENT.VITAL_SIGNS')}
            </Text>
          </View>
          <View style={styles.width60}>
            <Text style={styles.headersText}
            testID="vitalSignsText"
            accessibilityLabel="vitalSignsText">
              {t('INITIAL_ASSESSMENT.VALUES')}
            </Text>
          </View>
        </View>
        {/* headers Section end */}
        {this.renderHorizontalLine()}

        {/* Input section */}
        {this.state.from === 'initial_assessment' &&
          this.ageSection(t, patient)}
        {this.renderTemperatureSection(t)}
        {this.renderPulseRateSection(t)}
        {this.renderSpo2Section(t)}
        {this.renderSystolicBloodPressure(t)}
        {this.renderRespiratoryRate(t)}
      </View>
    );
  }

  handleCheckBoxSection(section, value) {
    let checkBoxesValues = this.state.checkBoxes;
    checkBoxesValues[section] = value;
    this.setState({
      checkBoxes: checkBoxesValues,
    });
  }

  handleHealthHistoryCheckBoxes(section, value) {
    let checkBoxesValues = this.state.checkBoxes;
    if (checkBoxesValues[section] !== '') {
      checkBoxesValues[section] = '';
    } else {
      checkBoxesValues[section] = value;
    }
    this.setState({
      checkBoxes: checkBoxesValues,
    });
  }

  renderAllCheckBoxSections(t, text, section) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID={text+"text"}
          accessibilityLabel={text+"text"}>{text}</Text>
        </View>
        <View style={[styles.width60, styles.flexDirectionRow]}>
          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.MILD
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NO')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.MILD)
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.NO
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.MILD')}
            onPress={() => this.handleCheckBoxSection(section, COLOR_CODES.NO)}
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.MODERATE_YELLOW
                ? COLOR_CODES.ORANGE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.MODERATE')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.MODERATE_YELLOW)
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.SEVERE
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.SEVERE')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.SEVERE)
            }
          />
        </View>
      </View>
    );
  }

  renderAllCovidTestCheckBoxes(t, text, section) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID={text+"text"}
          accessibilityLabel={text+"texr"}>{text}</Text>
        </View>
        <View style={[styles.width60, styles.flexDirectionRow]}>
          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.GREY
                ? COLOR_CODES.GREY
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NOT_TESTED')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.GREY)
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.NO
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.POSITIVE')}
            onPress={() => this.handleCheckBoxSection(section, COLOR_CODES.NO)}
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.SEVERE
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NEGATIVE')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.SEVERE)
            }
          />
        </View>
      </View>
    );
  }

  rapidAntiGen(t, text, section) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
          testID={text+"text"}
          accessibilityLabel={text+"text"}>{text}</Text>
        </View>
        <View style={[styles.width60, styles.flexDirectionRow]}>
          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.GREY
                ? COLOR_CODES.GREY
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NOT_TESTED')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.GREY)
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.SEVERE
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.POSITIVE')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.SEVERE)
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.NO
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NEGATIVE')}
            onPress={() => this.handleCheckBoxSection(section, COLOR_CODES.NO)}
          />
        </View>
      </View>
    );
  }

  renderTravelHistoryCheckBoxes(t, text, section) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
           testID={text+"text"}
           accessibilityLabel={text+"text"}>{text}</Text>
        </View>
        <View style={[styles.width60, styles.flexDirectionRow]}>
          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.NO
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NO')}
            onPress={() => this.handleCheckBoxSection(section, COLOR_CODES.NO)}
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.MODERATE_YELLOW
                ? COLOR_CODES.ORANGE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.MORE_THAN_14DAYS')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.MODERATE_YELLOW)
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === COLOR_CODES.SEVERE
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.LESS_THAN_14DAYS')}
            onPress={() =>
              this.handleCheckBoxSection(section, COLOR_CODES.SEVERE)
            }
          />
        </View>
      </View>
    );
  }

  handleDifficultyInBreathingCheckBoxes(section, value, sectionArray) {
    let newCheckBoxes = this.state.checkBoxes;
    sectionArray.forEach(element => {
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

  handleDifficultyInBreathingSection(t, text, section) {
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
           testID={text+"text"}
           accessibilityLabel={text+"text"}>{text}</Text>
        </View>
        <View style={[styles.width60, styles.flexDirectionRow]}>
          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes.diff_no === COLOR_CODES.MILD
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NO')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                'diff_no',
                COLOR_CODES.MILD,
                this.state.brArray,
              )
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes.diff_mild === COLOR_CODES.SEVERE_YELLOW
                ? COLOR_CODES.ORANGE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.MILD')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                'diff_mild',
                COLOR_CODES.SEVERE_YELLOW,
                this.state.brArray,
              )
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes.diff_moderate === COLOR_CODES.SEVERE_RED
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.MODERATE')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                'diff_moderate',
                COLOR_CODES.SEVERE_RED,
                this.state.brArray,
              )
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes.diff_severe === COLOR_CODES.SEVERE
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.SEVERE')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                'diff_severe',
                COLOR_CODES.SEVERE,
                this.state.brArray,
              )
            }
          />
        </View>
      </View>
    );
  }

  handlingPressureInChest(
    t,
    section1,
    section2,
    section3,
    section4,
    text,
    sectionArray,
  ) {
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
           testID={text+"text"}
           accessibilityLabel={text+"text"}>{text}</Text>
        </View>
        <View style={[styles.width60, styles.flexDirectionRow]}>
          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes[section1] === COLOR_CODES.MILD
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NO')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                section1,
                COLOR_CODES.MILD,
                sectionArray,
              )
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes[section2] === COLOR_CODES.SEVERE_RED_2
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.MILD')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                section2,
                COLOR_CODES.SEVERE_RED_2,
                sectionArray,
              )
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes[section3] === COLOR_CODES.SEVERE_RED
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.MODERATE')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                section3,
                COLOR_CODES.SEVERE_RED,
                sectionArray,
              )
            }
          />

          <InitialAssessmentCheckBoxComponent
            color={
              this.state.checkBoxes[section4] === COLOR_CODES.SEVERE
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.SEVERE')}
            onPress={() =>
              this.handleDifficultyInBreathingCheckBoxes(
                section4,
                COLOR_CODES.SEVERE,
                sectionArray,
              )
            }
          />
        </View>
      </View>
    );
  }

  renderInitialAssessmentSymptomsSections(t) {
    return (
      <View style={(styles.marginTop15, styles.marginBottom10)}>
        <View style={styles.flexDirectionRow}>
          <View style={styles.width40}>
            <Text style={styles.headersText}
             testID="symptomsText"
             accessibilityLabel="syptomsText">{t('RECORD_VITAL.SYMPTOMS')}</Text>
          </View>
        </View>
        {this.renderHorizontalLine()}

        {this.renderAllCheckBoxSections(t, t('HISTORY.COUGH'), 'cough')}
        {this.renderAllCheckBoxSections(
          t,
          t('HISTORY.RUNNING_NOSE'),
          'running_nose',
        )}
        {this.renderAllCheckBoxSections(
          t,
          t('HISTORY.SORE_THROAT'),
          'sore_throat',
        )}
        {this.renderAllCheckBoxSections(t, t('HISTORY.BODY_PAIN'), 'body_pain')}
        {this.renderAllCheckBoxSections(
          t,
          t('HISTORY.LOSS_OF_APPETITE'),
          'loss_of_appetite',
        )}
        {this.renderAllCheckBoxSections(t, t('HISTORY.DIARRHEA'), 'diarrhea')}
        {this.renderAllCheckBoxSections(
          t,
          t('HISTORY.LOST_SENSE_OF_SMELL_AND_TASTE'),
          'lost_sense_of_smell_taste',
        )}

        {this.handleDifficultyInBreathingSection(
          t,
          // 'Difficulty In Breathing',
          t('HISTORY.DIFFICULTY_IN_BREATHING'),
          'difficulty_in_breathing',
        )}

        {this.handlingPressureInChest(
          t,
          'pr_no',
          'pr_mild',
          'pr_moderate',
          'pr_severe',
          t('RECORD_VITAL.PERSISTENT_PAIN_PRESSURE_IN_CHEST'),
          this.state.prArray,
        )}

        {this.handlingPressureInChest(
          t,
          'bl_no',
          'bl_mild',
          'bl_moderate',
          'bl_severe',
          t('RECORD_VITAL.BLUISH_LIPS_AND_FACE'),
          this.state.blArray,
        )}

        {this.handlingPressureInChest(
          t,
          'cf_no',
          'cf_mild',
          'cf_moderate',
          'cf_severe',
          t('RECORD_VITAL.CONFUSION_FATIGUE'),
          this.state.cfArray,
        )}
      </View>
    );
  }

  renderInitialAssessmentVovidTextSections(t) {
    return (
      <View style={(styles.marginTop15, {marginBottom: 10})}>
        <View style={styles.flexDirectionRow}>
          <View style={styles.width40}>
            <Text style={styles.headersText}
             testID="covidText"
             accessibilityLabel="covidText">
              {t('INITIAL_ASSESSMENT.COVID_TEST')}
            </Text>
          </View>
        </View>
        {this.renderHorizontalLine()}

        {this.rapidAntiGen(t, t('HISTORY.RTPCR'), 'rtpcr')}
        {this.rapidAntiGen(t, t('HISTORY.RAPID_ANTIGEN'), 'rapid_antigen')}
        {this.renderAllCovidTestCheckBoxes(
          t,
          t('HISTORY.ANTIBODY_IGG'),
          'antibody_lgg',
        )}
        {this.rapidAntiGen(t, t('RECORD_VITAL.HRCT'), 'hrct')}
      </View>
    );
  }

  renderTravelHistorySection(t) {
    return (
      <View style={(styles.marginTop15, {marginBottom: 10})}>
        <View style={styles.flexDirectionRow}>
          <View style={styles.width40}>
            <Text style={styles.headersText}
            testID="travelHistoryText">
              {t('INITIAL_ASSESSMENT.TRAVEL_HISTORY')}
            </Text>
          </View>
        </View>
        {this.renderHorizontalLine()}

        {this.renderTravelHistoryCheckBoxes(
          t,
          t('INITIAL_ASSESSMENT.CONTACTED_COVID_PERSON'),
          'contacted_covid_person',
        )}
        {this.renderTravelHistoryCheckBoxes(
          t,
          t('INITIAL_ASSESSMENT.COVID_AREAS'),
          'travelled_covid_areas',
        )}
      </View>
    );
  }

  renderVaccinationTakenCheckBox(t, text, section) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}
           testID={text+"text"}
           accessibilityLabel={text+"text"}>{text}</Text>
        </View>
        <View style={[styles.width60, styles.flexDirectionRow]}>
          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === 'no'
                ? COLOR_CODES.SEVERE
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.NO')}
            onPress={() => this.handleCheckBoxSection(section, 'no')}
          />

          <InitialAssessmentCheckBoxComponent
            color={
              checkBoxValues[section] === 'yes'
                ? COLOR_CODES.NO
                : COLOR_CODES.WHITE
            }
            text={t('INITIAL_ASSESSMENT.YES')}
            onPress={() => this.handleCheckBoxSection(section, 'yes')}
          />
        </View>
      </View>
    );
  }

  deleteVaccinationHistory(index) {
    const vaccinationDetail = this.state.vaccination_detail;
    vaccinationDetail.splice(index, 1);
    this.setState({
      vaccination_detail: vaccinationDetail,
    });
  }
  renderHistoryCard(vaccinationHistory, t) {
    return vaccinationHistory.map((element, index) => (
      <View style={styles.vaccineHistoryCard} key={index}>
        <View style={styles.width80}>
          <View style={[styles.flexDirectionRow, styles.width100]}>
            <Text style={styles.vaccinationHistoryHeaderText}
            testID="vaccineNameText"
            accessibilityLabel="vaccineNameText">
              {t('INITIAL_ASSESSMENT.VACCINE_NAME')}:
              <Text style={styles.vaccinationHistoryValuesText}
              testID={element.vaccination_name+"text"}
              accessibilityLabel={element.vaccination_name+"text"}>
                {element.vaccination_name}
              </Text>
            </Text>
          </View>

          <View style={styles.flexDirectionRow}>
            <Text style={styles.vaccinationHistoryHeaderText}
            testID="doseNumberText"
            accessibilityLabel="doseNumberText">
              {t('INITIAL_ASSESSMENT.DOSE_NUMBER')}:
              <Text style={styles.vaccinationHistoryValuesText}
              testID={element.dose+"text"}
              accessibilityLabel={element.dose+"text"}>
                {element.dose}
              </Text>
            </Text>
          </View>
          <View style={styles.flexDirectionRow}>
            <Text style={styles.vaccinationHistoryHeaderText}
            testID="dateText"
            accessibilityLabel="dateText">
              {t('INITIAL_ASSESSMENT.DATE')}:
              <Text style={styles.vaccinationHistoryValuesText}
              testID={dateDDMMYYYY(new Date(element.vaccination_date))+"text"}
              accessibilityLabel={dateDDMMYYYY(new Date(element.vaccination_date))+"text"}>
                {dateDDMMYYYY(new Date(element.vaccination_date))}
              </Text>
            </Text>
          </View>
        </View>

        {/* action sections */}
        <View style={styles.flex1}>
          <TouchableOpacity
            style={[styles.flex1, styles.contentCenter]}
            onPress={() => this.deleteVaccinationHistory(index)}
            testID="trashTouch"
            accessibilityLabel="trashTouch">
            <Image source={trash} style={styles.delete}
            testID="trashImage"
            accessibilityLabel="trashImage"></Image>
          </TouchableOpacity>
        </View>
      </View>
    ));
  }

  renderAllVaccinationHistory(vaccinationHistory, t) {
    return (
      <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}>{''}</Text>
        </View>

        <View style={[styles.width60]}>
          {this.renderHistoryCard(vaccinationHistory, t)}
        </View>
      </View>
    );
  }

  enableVaccinationPopup() {
    this.setState({
      modal: true,
    });
  }

  renderAddVaccination() {
    return (
      <View
        style={[
          styles.flexDirectionRow,
          styles.checkBoxMainView,
          styles.marginBottom10,
        ]}>
        <View style={styles.width40}>
          <Text style={styles.fontSize12}>{''}</Text>
        </View>

        <View style={[styles.width60]}>
          <TouchableOpacity onPress={() => this.enableVaccinationPopup()}
           testID="plusTouch"
           accessibilityLabel="plusTouch">
            <Image source={plusImage} style={styles.addImage}
            testID="plusImage"
            accessibilityLabel="plusImage"></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  vaccinationHistory(t) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View style={(styles.marginTop15, {marginBottom: 10})}>
        <View style={styles.flexDirectionRow}>
          <View style={styles.width40}>
            <Text style={styles.headersText}
            testID="vaccinationHistoryText"
            accessibilityLabel="vaccinationHistoryText">
              {t('INITIAL_ASSESSMENT.VACCINATION_HISTORY')}
            </Text>
          </View>
        </View>
        {this.renderHorizontalLine()}

        {this.renderVaccinationTakenCheckBox(
          t,
          t('INITIAL_ASSESSMENT.TAKEN_VACCINATION'),
          'taken_vaccine',
        )}

        {this.state.vaccination_detail &&
          this.state.vaccination_detail.length > 0 &&
          this.renderAllVaccinationHistory(this.state.vaccination_detail, t)}

        {checkBoxValues.taken_vaccine === 'yes' && this.renderAddVaccination()}
      </View>
    );
  }

  renderMedicalConditions(t, text, section) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View>
        <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
          <View style={styles.width40}>
            <Text style={styles.fontSize12}
            testID={text+"text"}
            accessibilityLabe={text+"text"}>{text}</Text>
          </View>
          <View style={[styles.width60, styles.flexDirectionRow]}>
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.sam === 'sam'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.SAM')}
              onPress={() => this.handleHealthHistoryCheckBoxes('sam', 'sam')}
            />

            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.high_bp === 'high_bp'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.HIGH_BP')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('high_bp', 'high_bp')
              }
            />

            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.diabetes === 'diabetes'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.DIABETES')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('diabetes', 'diabetes')
              }
            />
          </View>
        </View>

        <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
          <View style={styles.width40}>
            <Text style={styles.fontSize12}>{''}</Text>
          </View>
          <View style={[styles.width60, styles.flexDirectionRow]}>
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.pregnancy_prenatal_post_natal ===
                'pregnancy_pre_natal/post_natal'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.PREGNANCY')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes(
                  'pregnancy_prenatal_post_natal',
                  'pregnancy_pre_natal/post_natal',
                )
              }
            />
          </View>
        </View>
        <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
          <View style={styles.width40}>
            <Text style={styles.fontSize12}>{''}</Text>
          </View>
          <View style={[styles.width60, styles.flexDirectionRow]}>
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.immune_compromised === 'immune_comprimised'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.IMMUNE')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes(
                  'immune_compromised',
                  'immune_comprimised',
                )
              }
            />
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.cancer === 'cancer'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.CANCER')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('cancer', 'cancer')
              }
            />
          </View>
        </View>
      </View>
    );
  }

  renderHealthHistory(t, text, section) {
    const checkBoxValues = this.state.checkBoxes;
    return (
      <View>
        <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
          <View style={styles.width40}>
            <Text style={styles.fontSize12}
            testID={text+"text"}
            accessibilityLabe={text+"text"}>{text}</Text>
          </View>
          <View style={[styles.width60, styles.flexDirectionRow]}>
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.lungs === 'lung'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.LUNGE_DISEASE')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('lungs', 'lung')
              }
            />

            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.heart === 'heart'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.HEART_DISEASE')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('heart', 'heart')
              }
            />
          </View>
        </View>

        <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
          <View style={styles.width40}>
            <Text style={styles.fontSize12}>{''}</Text>
          </View>
          <View style={[styles.width60, styles.flexDirectionRow]}>
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.kidney === 'Kidney'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.KIDNEY_DISEASE')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('kidney', 'Kidney')
              }
            />
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.liver === 'liver'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.LIVER_DISEASE')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('liver', 'liver')
              }
            />
          </View>
        </View>
        <View style={[styles.flexDirectionRow, styles.checkBoxMainView]}>
          <View style={styles.width40}>
            <Text style={styles.fontSize12}>{''}</Text>
          </View>
          <View style={[styles.width60, styles.flexDirectionRow]}>
            <InitialAssessmentCheckBoxComponent
              color={
                checkBoxValues.brain_neuro === 'brain/Neuro'
                  ? COLOR_CODES.SEVERE
                  : COLOR_CODES.WHITE
              }
              text={t('INITIAL_ASSESSMENT.BRAIN_NEURO_DISEASE')}
              onPress={() =>
                this.handleHealthHistoryCheckBoxes('brain_neuro', 'brain/Neuro')
              }
            />
          </View>
        </View>
      </View>
    );
  }

  otherMedicalConditions(t) {
    return (
      <View style={(styles.marginTop15, {marginBottom: 10})}>
        <View style={styles.flexDirectionRow}>
          <View style={styles.width60}>
            <Text style={styles.headersText}
            testID="otherMedicalConditionsText"
            accessibilityLabel="otherMedicalConditionText">
              {t('INITIAL_ASSESSMENT.OTHER_MEDICAL_CONDITIONS')}
            </Text>
          </View>
        </View>
        {this.renderHorizontalLine()}

        {this.renderMedicalConditions(
          t,
          t('INITIAL_ASSESSMENT.MEDICAL_CONDITIONS'),
          'medical_conditions',
        )}
      </View>
    );
  }

  renderHealthHistorySection(t) {
    return (
      <View style={(styles.marginTop15, {marginBottom: 10})}>
        <View style={styles.flexDirectionRow}>
          <View style={styles.width40}>
            <Text style={styles.headersText}
            testID="healthHistoryText"
            accessibilityLabel="healthHistoryText">
              {t('INITIAL_ASSESSMENT.HEALTH_HISTORY')}
            </Text>
          </View>
        </View>
        {this.renderHorizontalLine()}

        {this.renderHealthHistory(
          t,
          t('INITIAL_ASSESSMENT.HEALTH_HISTORY'),
          'health_history',
        )}
      </View>
    );
  }
  saveInitialAssessments = async () => {
    const {t} = this.props;
    this.setState({
      loader: true,
    });
    try {
      const {doctor_id, patient, token} = this.props?.navigation?.state?.params;

      let saveData = generateInitialAssessmentData(
        this.state.input,
        this.state.checkBoxes,
        patient,
      );
      saveData.id = doctor_id;
      saveData.token = token;
      saveData.hlp_id = patient.hlpid;
      saveData.enc_id = patient.enc_id;
      saveData.name = this.state.doctor_name;
      saveData.doctor_flag = '1';
      saveData.role = await AsyncStorage.getItem('role');
      // saveData.vaccination_detail = this.state.vaccination_detail;
      const vaccines = this.state.vaccination_detail;
      if (vaccines.length === 2) {
        saveData.vaccination_name_one = vaccines[0].vaccination_name;
        saveData.date_of_first_dose = vaccines[0].vaccination_date;
        saveData.vaccination_name_two = vaccines[1].vaccination_name;
        saveData.date_of_second_dose = vaccines[1].vaccination_date;
        saveData.no_of_doses = 'two';
        saveData.taken_vaccination = 'yes';
      } else if (vaccines.length === 1) {
        saveData.vaccination_name_one = vaccines[0].vaccination_name;
        saveData.date_of_first_dose = vaccines[0].vaccination_date;
        saveData.vaccination_name_two = '';
        saveData.date_of_second_dose = '';
        saveData.no_of_doses = 'one';
        saveData.taken_vaccination = 'yes';
      } else {
        saveData.vaccination_name_one = '';
        saveData.date_of_first_dose = '';
        saveData.vaccination_name_two = '';
        saveData.date_of_second_dose = '';
        saveData.no_of_doses = '';
        saveData.taken_vaccination = 'no';
      }
      if (this.state.flag) {
        saveData.is_flag = 'update';
        saveData.date = this.state.initialAssessmentDate;
      } else {
        saveData.is_flag = 'insert';
        saveData.date = new Date();
      }

      const response = await API.call(
        'post',
        'save_covid_vitals_data/',
        saveData,
      );
      if (response && response?.message) {
        Toast.show({
          text:
            t('INITIAL_ASSESSMENT.INITIAL_ASSESSMENT_SUCCESS_MESSAGE') ||
            response?.message,

          type: 'success',
          duration: 3000,
        });
        this.props.navigation.goBack(null);
      }
    } catch (error) {
      Toast.show({
        text:
          (error && error.message) ||
          t('INITIAL_ASSESSMENT.INITIAL_ASSESSMENT_ERROR_MESSAGE'),
        type: 'danger',
        duration: 3000,
      });
    } finally {
      this.setState({
        loader: false,
      });
    }
  };

  checkRecordVitals() {
    if (
      this.state.input.temperature !== '' ||
      this.state.input.pulse_rate !== '' ||
      this.state.input.spo2 !== '' ||
      this.state.input.systolic_blood_pressure !== '' ||
      this.state.input.respiratory_rate !== '' ||
      this.state.input.rPulseRate !== '' ||
      this.state.input.rSpo2 !== ''
    ) {
      return true;
    }
    return false;
  }

  saveRecordVital = async t => {
    try {
      this.setState({
        activityModal: false,
        isLoading: true,
      });
      if (this.checkRecordVitals()) {
        let recordVitalPayload = generateRecordVitalPayload(
          this.state.input,
          this.state.checkBoxes,
        );

        recordVitalPayload.Difficulty_breathing = handleBreathingSectionColor(
          this.state.checkBoxes.diff_no,
          this.state.checkBoxes.diff_mild,
          this.state.checkBoxes.diff_moderate,
          this.state.checkBoxes.diff_severe,
        );

        recordVitalPayload.Persistent_pain_pressure_chest =
          handleBreathingSectionColor(
            this.state.checkBoxes.pr_no,
            this.state.checkBoxes.pr_mild,
            this.state.checkBoxes.pr_moderate,
            this.state.checkBoxes.pr_severe,
          );

        recordVitalPayload.Bluish_lips_face = handleBreathingSectionColor(
          this.state.checkBoxes.bl_no,
          this.state.checkBoxes.bl_mild,
          this.state.checkBoxes.bl_moderate,
          this.state.checkBoxes.bl_severe,
        );

        recordVitalPayload.Confusion_fatigue = handleBreathingSectionColor(
          this.state.checkBoxes.cf_no,
          this.state.checkBoxes.cf_mild,
          this.state.checkBoxes.cf_moderate,
          this.state.checkBoxes.cf_severe,
        );

        recordVitalPayload.overall_status = overallStatusColor(
          this.state.checkBoxes,
          {},
          this.state.input,
        );

        recordVitalPayload.id = this.props.doctor_id;
        recordVitalPayload.token = this.props.token;
        recordVitalPayload.hlp_id = this.props.patient.hlpid;
        recordVitalPayload.enc_id = this.props.patient.enc_id;
        recordVitalPayload.name = this.state.doctor_name;
        recordVitalPayload.date = this.state.date;
        recordVitalPayload.doctor_flag = '1';
        recordVitalPayload.role = await AsyncStorage.getItem('role');

        const response = await API.call(
          'post',
          'save_covid_vitals_data/',
          recordVitalPayload,
        );
        if (response && response?.status_code === 200) {
          Toast.show({
            text: t('RECORD_VITAL.SAVE_MESSAGE'),
            type: 'success',
            position: 'top',
            duration: 3000,
          });
          this.setState(
            {
              input: recordVitalsInputSections(),
              checkBoxes: recordVitalCheckBoxes(),
              show: false,
              show_alert_popup: false,
              activityModal: false,
              save: false,
              start_activity: true,
              activity_inputs: true,
              date: new Date(),
            },
            () => this.props.updateActiveTab(0),
          );
        } else {
          Toast.show({
            text: t('RECORD_VITAL.WARNING_MESSAGE'),
            type: 'warning',
            position: 'top',
            duration: 3000,
          });
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

  renderFooterSection(t) {
    return (
      <Footer style={styles.footerSection}>
        <View style={styles.footerSectionView}>
          <NativeButton
          testID="saveOrUpdateButton"
          accessibilityLabel="saveOrUpdateButton"
            style={styles.footerButtonStyles}
            onPress={() => this.saveInitialAssessments()}>
            <Text style={styles.saveButtonText}
            testID="saveOrUpdateText"
            accessibilityLabel="saveOrUpdateText">
              {this.state.loader ? (
                <ActivityIndicator size="large" color={DEFAULT_WHITE_COLOR} />
              ) : this.state.flag ? (
                t('INITIAL_ASSESSMENT.UPDATE')
              ) : (
                t('RECORD_VITAL.SAVE')
              )}
            </Text>
          </NativeButton>
        </View>
      </Footer>
    );
  }

  enableAlertPopUp() {
    this.setState({
      show_alert_popup: true,
    });
  }

  renderRecordVitalFooterSection(t) {
    const {patient} = this.props?.navigation?.state?.params;
    let minDate = new Date(moment(patient.schedule_date));

    return (
      <Footer style={styles.footerTotalSection}>
        {/* FOOTER MAIN VIEW */}
        <View style={styles.viewFlexAndRow}>
          {/* ACTIVITY SECTION START */}
          <View style={styles.activityMainView}>
            <View style={styles.buttonMainView}>
              <NativeButton
               testID="activityButton"
               accessibilityLabel="activityButton"
                onPress={() =>
                  this.setState({activityModal: true, show_alert_popup: false})
                }
                rounded
                androidRippleColor={DEFAULT_LIGHT_GREY_COLOR}
                style={styles.activityButtonStyles}>
                <Activity height={20} width={20} />
                <Text style={styles.activityTextStyles}
                testID="activityText"
                accessibilityLabel="activityText">
                  {t('PROFILE.ACTIVITY')}
                </Text>
              </NativeButton>
            </View>
          </View>

          {/* ACTIVITY SECTION END */}

          {/* SAVE SECTION START */}
          <View style={[styles.viewFlexAndRow]}>
            <View style={styles.dateComponentStyles}>
              <Text style={styles.asOfText}
              testID="asOfText"
              accessibilityLabel="asOfText">{t('RECORD_VITAL.AS_OF')}</Text>
              <View style={styles.dateSelect}>
                <NativeButton
                testID="dateButton"
                accessibilityLabel="dateButton"
                  style={[styles.dateButton]}
                  onPress={() => {
                    this.setState({show: true});
                  }}>
                  <Text
                  testID={moment(this.state.date).format('DD-MMM-YYYY')+"text"}
                  accessibilityLabel={moment(this.state.date).format('DD-MMM-YYYY')+"text"}>{moment(this.state.date).format('DD-MMM-YYYY')}</Text>
                  <DateActivity width={20} height={20} />
                </NativeButton>
                <DateTimePickerModal
                testID="dateTimePicker"
                accessibilityLabel="dateTimePicker"
                  isVisible={this.state.show}
                  mode="datetime"
                  date={new Date(this.state.date)}
                  minimumDate={minDate}
                  maximumDate={new Date()}
                  onConfirm={confDate => {
                    this.setState({
                      date: confDate,
                      show: false,
                    });
                  }}
                  onCancel={this.toggleDatePicker}
                />
              </View>
            </View>
            <View style={[styles.footerView]}>
              <NativeButton
              testID="saveButton"
              accessibilityLabel="saveButton"
                style={styles.saveButtonStyles}
                onPress={() => this.enableAlertPopUp()}>
                {this.state.isLoading ? (
                  <View style={styles.inputMain}>
                    <ActivityIndicator
                      size="large"
                      color={DEFAULT_WHITE_COLOR}
                    />
                  </View>
                ) : (
                  <Text style={[styles.fontSize14, styles.textColor]}
                  testID="saveText"
                  accessibilityLabel="saveText">
                    {t('RECORD_VITAL.SAVE')}
                  </Text>
                )}
              </NativeButton>
            </View>
          </View>
          {/* SAVE SECTION END */}
        </View>
      </Footer>
    );
  }

  closeModal() {
    this.setState({
      modal: false,
    });
  }

  handleVaccineInputSection(text) {
    this.setState({
      vaccinationName: text,
    });
  }
  handleDoseNumber(text) {
    this.setState({
      doseNumber: text,
    });
  }

  handleVaccinationDate(date) {
    this.setState({
      vaccinationDate: date,
      show: false,
    });
  }

  saveVaccinationDetails() {
    let vaccinationDetails = this.state.vaccination_detail;
    let vaccinationObject = {
      vaccination_name: this.state.selectedValue,
      dose: this.state.doseNumber,
      vaccination_date: this.state.vaccinationDate,
    };
    vaccinationDetails.push(vaccinationObject);
    this.setState({
      vaccination_detail: vaccinationDetails,
      modal: false,
      vaccinationDate: new Date(),
      vaccinationName: '',
      doseNumber: '',
      selectedValue: 'Covishield',
    });
  }

  setSelectedValue(itemValue) {
    this.setState({
      selectedValue: itemValue,
    });
  }

  renderAddVaccinePopup(t) {
    return (
      <Modal
        // animationType="slide"
        // transparent={true}
        isVisible={this.state.modal}
        backdropOpacity={0.5}
        // visible={this.state.modal}
        onBackdropPress={() => {
          this.setModalVisible();
        }}
        style={styles.modalPaddingStyles}>
        <View style={styles.halfModalStyles}>
          <View style={styles.modalCloseView}>
            {/* <TouchableOpacity onPress={() => this.closeModal()}> */}
            <TouchableOpacity onPress={() => this.setState({modal: false})}
             testID="closeTouch"
             accessibilityLabel="closeTouch">
              <Image source={close} style={styles.closeIconStyles}
              testID="closeImage"
              accessibilityLabel="closeImage"></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.flex1}>
            {/* vaccine name section */}
            <View style={styles.vaccinationDetailsMainView}>
              <View style={styles.width40}>
                <Text style={styles.vaccinationHistoryHeaderText}
                testID="vaccineNameText"
                accessibilityLabel="vaccineNameText">
                  {t('INITIAL_ASSESSMENT.VACCINE_NAME')}:
                </Text>
              </View>
              <View style={styles.covidDropDownMainView}>
                <Picker
                testID="vaccinePicker"
                accessibilityLabel="vaccinePiker"
                  iosIcon={<Icon name="ios-caret-down" fontSize={12} />}
                  placeholderStyle={{width: '100%'}}
                  selectedValue={this.state.selectedValue}
                  style={styles.pickerStyles}
                  mode={'dropdown'}
                  textStyle={{fontSize: 14}}
                  onValueChange={itemValue => this.setSelectedValue(itemValue)}>
                  <Picker.Item label="Covishield" value="Covishield" />
                  <Picker.Item label="Covaxin" value="Covaxin" />
                  <Picker.Item label="Sputnik" value="Sputnik" />
                </Picker>
              </View>
            </View>

            <View style={styles.vaccinationDetailsMainView}>
              <View style={styles.width40}>
                <Text style={styles.vaccinationHistoryHeaderText}
                testID="doseNumberText"
                accessibilityLabel="doseNumberText">
                  {t('INITIAL_ASSESSMENT.DOSE_NUMBER')}:
                </Text>
              </View>
              <View style={styles.covidDropDownMainView}>
                <Picker
                testID="dosePicker"
                accessibilityLabel="dosePicker"
                  iosIcon={<Icon name="ios-caret-down" fontSize={12} 
                  testID="arrowIcon"
                  accessibilityLabel="arrowIcon"/>}
                  placeholderStyle={{width: '100%'}}
                  selectedValue={this.state.doseNumber}
                  style={styles.pickerStyles}
                  textStyle={{fontSize: 14}}
                  mode={'dropdown'}
                  onValueChange={itemValue => this.handleDoseNumber(itemValue)}>
                  <Picker.Item label="One" value="1" />
                  <Picker.Item label="Two" value="2" />
                </Picker>
              </View>
            </View>

            <View style={styles.vaccinationDetailsMainView}>
              <View style={styles.width40}>
                <Text style={styles.vaccinationHistoryHeaderText}
                testID="vaccinationDateText"
                accessibilityLabel="vaccinationDateText">
                  {t('INITIAL_ASSESSMENT.VACCINATION_DATE')}:
                </Text>
              </View>
              <View style={styles.vacDateSelectorView}>
                <TouchableOpacity
                testID="dateTouch"
                accessibilityLabel="dateTouch"
                  onPress={() => this.setState({show: true})}
                  style={styles.changeDateTouchableView}>
                  <Text
                  testID={moment(this.state.vaccinationDate).format('DD-MMM-YYYY')+"text"}
                  accessibilityLabel={moment(this.state.vaccinationDate).format('DD-MMM-YYYY')+"text"}>
                    {moment(this.state.vaccinationDate).format('DD-MMM-YYYY')}
                  </Text>
                  <Image
                  testID="dateImage"
                  accessibilityLabel="dateImage"
                    source={ChangeDateIcon}
                    style={styles.dateIconStyles}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                testID="dateTimePicker"
                accessibilityLabel="dateTimePicker"
                  isVisible={this.state.show}
                  mode="date"
                  date={new Date(this.state.vaccinationDate)}
                  onConfirm={this.handleVaccinationDate}
                  onCancel={this.toggleDatePicker}
                />
              </View>
            </View>
          </View>
          {/* save button view */}
          <View>
            <NativeButton
             testID="saveButton"
             accessibilityLabel="saveButton"
              style={styles.nativeButtonStyles}
              onPress={event => this.saveVaccinationDetails()}>
              <Text style={styles.vaccinationSaveText}
              testID="saveText"
              accessibilityLabel="saveText">
                {t('RECORD_VITAL.SAVE')}
              </Text>
            </NativeButton>
          </View>
        </View>
      </Modal>
    );
  }

  alertCancel(t) {
    this.setState({
      show_alert_popup: false,
    });
    this.saveRecordVital(t);
  }

  alertAccepted() {
    this.setState({
      activityModal: true,
      show_alert_popup: false,
    });
  }

  setModalVisible() {
    this.setState({activityModal: false});
  }

  closeModal() {
    this.setState({
      activityModal: false,
      save: false,
      activity_inputs: false,
      start_activity: false,
    });
  }

  startActivity() {
    this.setState({
      start_activity: true,
      activity_inputs: true,
    });
  }

  additionalRecordVital(value, key, borderSection) {
    return (
      <View style={[styles.additionalRecordVitalView, styles.marginBottom10]}>
        <View style={styles.textSection}>
          <Text style={styles.inputText}
          testID={value+"text"}
          accessibilityLabel={value+"text"}>{value}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.vitalRecordInputSection}>
            <InitialAssessmentInputComponent
              borderColor={
                this.state.input[borderSection] === ''
                  ? 'black'
                  : this.state.input[borderSection]
              }
              defaultValue={this.state.input[key]}
              onChangeText={text =>
                this.handleInputTextEnterSection(text, key, borderSection)
              }
            />
          </View>
        </View>
      </View>
    );
  }

  recordModalSection(t) {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Modal
          isVisible={this.state.activityModal}
          backdropOpacity={0.5}
          style={styles.modalMargins}>
            <SafeAreaView style={{flex: 5,marginTop:-80}}>
      <KeyboardAvoidingView
        behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
        style={{flex: 5,marginTop:-10 }}
        >
          <View style={styles.modalStyles}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <View style={styles.modalClose}>
                <TouchableOpacity onPress={() => this.closeModal()}
                testID="closeTouch"
                accessibilityLabel="closeTouch">
                  <Image source={close} style={styles.closeIcon}
                  testID="closeImage"
                  accessibilityLabel="closeImage"></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.footer}>
                <Text style={styles.modalText}
                testID="vitalModalText"
                accessibilityLabel="vitalModalText">
                  {t('RECORD_VITAL.VITAL_MODAL_TEXT')}
                </Text>
              </View>
              {/* countdown timer Section start*/}
              {!this.state.start_activity && !this.state.activity_inputs && (
                <View
                  style={[
                    styles.recordVitalButtonMainView,
                    styles.bottomLevelView,
                  ]}>
                  <NativeButton
                  testID="vitalStartButton"
                  accessibilityLabel="vitalStartButton"
                    large
                    style={styles.recordVitalSaveButton}
                    onPress={() => this.startActivity()}
              >
                    <Text style={styles.startText}
                    testID="vitalStartText"
                    accessibilityLabel="vitalStartText">
                      {t('RECORD_VITAL.START')}
                    </Text>
                  </NativeButton>
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
                <Text style={styles.doctorInstructionsText}
                testID="instructionsText"
                accessibilityLabel="instructionsText">
                  {t('RECORD_VITAL.DC_INSTRUCTIONS')}
                </Text>
                <View style={styles.doctorSectionMainView}>
                  <View style={styles.flex}>
                    <Text style={styles.instText}
                    testID="doctorNoteText"
                    accessibilityLabel="doctorNoteText">
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
                  "spoText"
                )}

              {this.state.activity_inputs &&
                this.additionalRecordVital(
                  t('RECORD_VITAL.PULSE_RATE'),
                  'rPulseRate',
                  this.borderActions.rPulseRate_border,
                  "spoText"
                )}
              <View>
                <Text></Text>
                <Text></Text>
              </View>
            </ScrollView>
            {/* save Button View  start*/}
          </View>
          {this.state.activity_inputs && (
            <View
              style={[
                styles.recordVitalButtonMainView,
                styles.bottomLevelView,
              ]}>
              <NativeButton
                large
                style={styles.recordVitalSaveButton}
                onPress={() => this.saveRecordVital(t)}
                testID="saveButton"
                accessibilityLabel="saveButton">
                <Text style={styles.startText}
                testID="saveText"
                accessibilityLabel="saveText">{t('RECORD_VITAL.SAVE')}</Text>
              </NativeButton>
            </View>
          )}
          </KeyboardAvoidingView>
          </SafeAreaView>
          {/* save button view end */}
        </Modal>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const {t} = this.props;

    const {patient} = this.props?.navigation?.state?.params;

    return (
      <Container>
        {this.state.from === 'initial_assessment' && (
          <Header
            androidStatusBarColor={APP_PRIMARY_COLOR}
            style={[styles.headerStyles]}>
            <View style={styles.flex1}>
              <Text style={[styles.headersText]} numberOfLines={1}
              testID="nameText"
              accessibilityLabel="nameText">
                {patient &&
                  `${
                    patient.patient_name ? patient.patient_name : patient.Name
                  } / ${
                    patient?.gender
                      ? patient?.gender?.charAt(0).toUpperCase() +
                        patient?.gender?.slice(1)
                      : patient?.person_gender?.charAt(0).toUpperCase() +
                        patient?.person_gender?.slice(1)
                  } / ${calculateAge(patient?.dob)}`}
              </Text>
            </View>
          </Header>
        )}
        <ScrollView>
          <View style={styles.wrapper}>
            {/* render initial Assessment input section */}
            {this.renderInitialAssessmentInputSection(t, patient)}
            {this.renderInitialAssessmentSymptomsSections(t)}
            {this.renderInitialAssessmentVovidTextSections(t)}
            {this.state.from === 'initial_assessment' &&
              this.renderTravelHistorySection(t)}
            {this.state.from === 'initial_assessment' &&
              this.vaccinationHistory(t)}
            {this.state.from === 'initial_assessment' &&
              this.otherMedicalConditions(t)}
            {this.state.from === 'initial_assessment' &&
              this.renderHealthHistorySection(t)}
          </View>
          {this.state.show_alert_popup &&
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
        </ScrollView>
        {this.state.from === 'initial_assessment' &&
          this.renderFooterSection(t)}
        {this.state.from !== 'initial_assessment' &&
          this.renderRecordVitalFooterSection(t)}
        {this.state.from === 'initial_assessment' &&
          this.renderAddVaccinePopup(t)}
        {this.recordModalSection(t)}
      </Container>
    );
  }
}

export default withTranslation()(CovidMonitoringInitialAssessment);
