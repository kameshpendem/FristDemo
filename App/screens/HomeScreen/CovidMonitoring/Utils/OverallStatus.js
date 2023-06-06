import {COLOR_CODES} from '../../../../themes/variable';
export function overallStatusColor(checkBoxes, patient, inputs) {
  const checkBoxKeys = Object.keys(checkBoxes);
  const inputKeys = Object.keys(inputs);

  let yellow_count = 0;
  let red_count = 0;
  let ageColor = '';
  if (patient && patient.dob) {
    ageColor = ageColorCode(patient.dob);
  }

  checkBoxKeys.forEach((element) => {
    if (
      checkBoxes[element] === COLOR_CODES.MODERATE_YELLOW ||
      checkBoxes[element] === COLOR_CODES.SEVERE_YELLOW
    ) {
      yellow_count = yellow_count + 1;
    } else if (
      checkBoxes[element] === COLOR_CODES.SEVERE ||
      checkBoxes[element] === COLOR_CODES.SEVERE_RED ||
      checkBoxes[element] === COLOR_CODES.SEVERE_RED_2
    ) {
      red_count = red_count + 1;
    }
  });

  if (ageColor === COLOR_CODES.SEVERE) {
    red_count = red_count + 1;
  } else if (ageColor === COLOR_CODES.MODERATE_YELLOW) {
    yellow_count = yellow_count + 1;
  }

  inputKeys.forEach((element) => {
    let color = '';
    if (element === 'temperature') {
      color = temperatureColorCodes(inputs[element]);
    } else if (element === 'pulse_rate') {
      color = pulseRateColor(inputs[element]);
    } else if (element === 'spo2') {
      color = spo2Color(inputs[element]);
    } else if (element === 'systolic_blood_pressure') {
      color = systolicBloodPressureColor(inputs[element]);
    } else if (element === 'respiratory_rate') {
      color = systolicRateColor(inputs[element]);
    }
    if (color === COLOR_CODES.SEVERE) {
      red_count = red_count + 1;
    } else if (color === COLOR_CODES.MODERATE_YELLOW) {
      yellow_count = yellow_count + 1;
    }
  });

  checkBoxKeys.forEach((element) => {
    if (
      checkBoxes[element] === 'sam' ||
      checkBoxes[element] === 'high_bp' ||
      checkBoxes[element] === 'diabetes' ||
      checkBoxes[element] === 'pregnancy_pre_natal/post_natal' ||
      checkBoxes[element] === 'immune_comprimised' ||
      checkBoxes[element] === 'cancer' ||
      checkBoxes[element] === 'lung' ||
      checkBoxes[element] === 'heart' ||
      checkBoxes[element] === 'Kidney' ||
      checkBoxes[element] === 'liver' ||
      checkBoxes[element] === 'brain/Neuro'
      // checkBoxes[element] === 'yes'
    ) {
      red_count = red_count + 1;
    }
  });

  let maxValue = Math.max(yellow_count, red_count);

  if (red_count !== 0) {
    return COLOR_CODES.RGBA_RED;
  }

  if (maxValue === 0 && yellow_count === 0) {
    return COLOR_CODES.RGBA_GREEN;
  } else {
    return COLOR_CODES.RGBA_YELLOW;
  }
  // if (yellow_count === red_count) {
  //   return COLOR_CODES.RGBA_RED;
  // }
  // if (maxValue === yellow_count) {
  //   return COLOR_CODES.RGBA_YELLOW;
  // } else if (maxValue === red_count) {
  //   return COLOR_CODES.RGBA_RED;
  // }
}

export function temperatureColorCodes(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      Number(text).toFixed(2) >= 96.98 && Number(text).toFixed(2) < 100
        ? COLOR_CODES.NO
        : (Number(text).toFixed(2) > 95 && Number(text).toFixed(2) < 96.97) ||
          (Number(text).toFixed(2) >= 100 && Number(text).toFixed(2) <= 102)
        ? COLOR_CODES.MODERATE_YELLOW
        : COLOR_CODES.SEVERE;
  }
  return colorCode;
}

export function updateTemperatureColorCodes(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      Number(text).toFixed(2) >= 96.98 && Number(text).toFixed(2) < 100
        ? COLOR_CODES.NO
        : (Number(text).toFixed(2) > 95 && Number(text).toFixed(2) < 96.97) ||
          (Number(text).toFixed(2) >= 100 && Number(text).toFixed(2) <= 102)
        ? COLOR_CODES.ORANGE
        : COLOR_CODES.SEVERE;
  }
  return colorCode;
}

export function pulseRateColor(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      Number(parseInt(text)).toFixed(2) >= 51 &&
      Number(parseInt(text)).toFixed(2) <= 90
        ? COLOR_CODES.NO
        : (Number(parseInt(text)).toFixed(2) >= 41 &&
            Number(parseInt(text)).toFixed(2) <= 50) ||
          (parseInt(text) >= 91 && parseInt(text) <= 130)
        ? COLOR_CODES.MODERATE_YELLOW
        : COLOR_CODES.SEVERE;
  }
  return colorCode;
}

export function updatePulseRateColor(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      Number(parseInt(text)).toFixed(2) >= 51 &&
      Number(parseInt(text)).toFixed(2) <= 90
        ? COLOR_CODES.NO
        : (Number(parseInt(text)).toFixed(2) >= 41 &&
            Number(parseInt(text)).toFixed(2) <= 50) ||
          (parseInt(text) >= 91 && parseInt(text) <= 130)
        ? COLOR_CODES.ORANGE
        : COLOR_CODES.SEVERE;
  }
  return colorCode;
}

export function spo2Color(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) >= 96
        ? COLOR_CODES.NO
        : parseInt(text) >= 90 && parseInt(text) <= 95
        ? COLOR_CODES.MODERATE_YELLOW
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function updatedSpo2Color(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) >= 96
        ? COLOR_CODES.NO
        : parseInt(text) >= 90 && parseInt(text) <= 95
        ? COLOR_CODES.ORANGE
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function systolicBloodPressureColor(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) >= 111 && parseInt(text) <= 210
        ? COLOR_CODES.NO
        : parseInt(text) >= 91 && parseInt(text) <= 100
        ? COLOR_CODES.MODERATE_YELLOW
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function updatedSystolicBloodPressureColor(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) >= 111 && parseInt(text) <= 210
        ? COLOR_CODES.NO
        : parseInt(text) >= 91 && parseInt(text) <= 100
        ? COLOR_CODES.ORANGE
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function systolicRateColor(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) >= 12 && parseInt(text) < 20
        ? COLOR_CODES.NO
        : (parseInt(text) >= 9 && parseInt(text) <= 11) ||
          (parseInt(text) >= 21 && parseInt(text) <= 24)
        ? COLOR_CODES.MODERATE_YELLOW
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function updatedSystolicRateColor(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) >= 12 && parseInt(text) < 20
        ? COLOR_CODES.NO
        : (parseInt(text) >= 9 && parseInt(text) <= 11) ||
          (parseInt(text) >= 21 && parseInt(text) <= 24)
        ? COLOR_CODES.ORANGE
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function activitySpo2Color(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) > 95
        ? COLOR_CODES.NO
        : parseInt(text) >= 91 && parseInt(text) <= 95
        ? COLOR_CODES.MODERATE_YELLOW
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function updatedActivitySpo2Color(text) {
  let colorCode = COLOR_CODES.BLACK;
  if (text) {
    colorCode =
      parseInt(text) > 95
        ? COLOR_CODES.NO
        : parseInt(text) >= 91 && parseInt(text) <= 95
        ? COLOR_CODES.ORANGE
        : COLOR_CODES.SEVERE;
  }

  return colorCode;
}

export function handleHealthHistory(checkBoxValues, healthDisease) {
  if (healthDisease && healthDisease !== undefined) {
    const health_history = healthDisease.split(',');
    health_history.forEach((element) => {
      if (element.trim() === 'liver') {
        checkBoxValues.liver = 'liver';
      } else if (element.trim() === 'lung') {
        checkBoxValues.lungs = 'lung';
      } else if (element.trim() === 'heart') {
        checkBoxValues.heart = 'heart';
      } else if (element.trim() === 'Kidney') {
        checkBoxValues.kidney = 'Kidney';
      } else if (element.trim() === 'brain/Neuro') {
        checkBoxValues.brain_neuro = 'brain/Neuro';
      }
    });
  }
}

export function handleOtherMedicalConditions(checkBoxValues, healthDisease) {
  if (healthDisease && healthDisease !== undefined) {
    const health_history = healthDisease.split(',');
    health_history.forEach((element) => {
      if (element.trim() === 'sam') {
        checkBoxValues.sam = 'sam';
      } else if (element.trim() === 'pregnancy_pre_natal/post_natal') {
        checkBoxValues.pregnancy_prenatal_post_natal =
          'pregnancy_pre_natal/post_natal';
      } else if (element.trim() === 'high_bp') {
        checkBoxValues.high_bp = 'high_bp';
      } else if (element.trim() === 'diabetes') {
        checkBoxValues.diabetes = 'diabetes';
      } else if (element.trim() === 'immune_comprimised') {
        checkBoxValues.immune_compromised = 'immune_comprimised';
      } else if (element.trim() === 'cancer') {
        checkBoxValues.cancer = 'cancer';
      }
    });
  }
}

export function populateInitialAssessmentInputSection(
  inputs,
  initial_assessment_detail,
) {
  inputs.temperature = initial_assessment_detail.fever;
  inputs.pulse_rate = initial_assessment_detail.pulse_rate;
  inputs.spo2 = initial_assessment_detail.sp02;
  inputs.systolic_blood_pressure = initial_assessment_detail.sbp;
  inputs.respiratory_rate = initial_assessment_detail.rrv;
  inputs.temperature_border = temperatureColorCodes(
    initial_assessment_detail.fever,
  );
  inputs.pulse_rate_border = pulseRateColor(
    initial_assessment_detail.pulse_rate,
  );
  inputs.spo2_border = spo2Color(initial_assessment_detail.sp02);
  inputs.systolic_blood_pressure_border = systolicBloodPressureColor(
    initial_assessment_detail.sbp,
  );
  inputs.respiratory_rate_border = systolicRateColor(
    initial_assessment_detail.rrv,
  );
  return inputs;
}

export function populateInitialAssessmentCheckBoxSection(
  checkBoxValues,
  initial_assessment_detail,
) {
  checkBoxValues.cough = initial_assessment_detail.cough;
  checkBoxValues.running_nose = initial_assessment_detail.running_nose;
  checkBoxValues.sore_throat = initial_assessment_detail.sore_throat;
  checkBoxValues.body_pain = initial_assessment_detail.body_pain;
  checkBoxValues.loss_of_appetite = initial_assessment_detail.loss_appetite;
  checkBoxValues.diarrhea = initial_assessment_detail.diarrhea;
  checkBoxValues.lost_sense_of_smell_taste =
    initial_assessment_detail.lost_sense;
  checkBoxValues.difficulty_in_breathing =
    initial_assessment_detail.diff_breath;
  checkBoxValues.persistent_pain_pressure_in_chest =
    initial_assessment_detail.presure_chest;
  checkBoxValues.bluish_lips_and_face = initial_assessment_detail.bluish_lips;
  checkBoxValues.confusion_fatigue = initial_assessment_detail.confusion;
  checkBoxValues.rtpcr = initial_assessment_detail.rtpcr;
  checkBoxValues.rapid_antigen = initial_assessment_detail.antigen;
  checkBoxValues.antibody_lgg = initial_assessment_detail.antibody;
  checkBoxValues.hrct = initial_assessment_detail.hrct;

  checkBoxValues.contacted_covid_person =
    initial_assessment_detail.have_travelled_covid_affected_areas;
  checkBoxValues.travelled_covid_areas =
    initial_assessment_detail.have_contacted_covid_person;

  checkBoxValues.taken_vaccine = initial_assessment_detail.taken_vaccination;
  checkBoxValues.doses_token = initial_assessment_detail.no_of_doses;

  checkBoxValues.diff_no =
    initial_assessment_detail.diff_breath === COLOR_CODES.MILD
      ? COLOR_CODES.MILD
      : '';
  checkBoxValues.diff_mild =
    initial_assessment_detail.diff_breath === COLOR_CODES.SEVERE_YELLOW
      ? COLOR_CODES.SEVERE_YELLOW
      : '';
  checkBoxValues.diff_moderate =
    initial_assessment_detail.diff_breath === COLOR_CODES.SEVERE_RED
      ? COLOR_CODES.SEVERE_RED
      : '';
  checkBoxValues.diff_severe =
    initial_assessment_detail.diff_breath === COLOR_CODES.SEVERE
      ? COLOR_CODES.SEVERE
      : '';

  checkBoxValues.pr_no =
    initial_assessment_detail.presure_chest === COLOR_CODES.MILD
      ? COLOR_CODES.MILD
      : '';
  checkBoxValues.pr_mild =
    initial_assessment_detail.presure_chest === COLOR_CODES.SEVERE_RED_2
      ? COLOR_CODES.SEVERE_RED_2
      : '';
  checkBoxValues.pr_moderate =
    initial_assessment_detail.presure_chest === COLOR_CODES.SEVERE_RED
      ? COLOR_CODES.SEVERE_RED
      : '';
  checkBoxValues.pr_severe =
    initial_assessment_detail.presure_chest === COLOR_CODES.SEVERE
      ? COLOR_CODES.SEVERE
      : '';

  checkBoxValues.bl_no =
    initial_assessment_detail.bluish_lips === COLOR_CODES.MILD
      ? COLOR_CODES.MILD
      : '';
  checkBoxValues.bl_mild =
    initial_assessment_detail.bluish_lips === COLOR_CODES.SEVERE_RED_2
      ? COLOR_CODES.SEVERE_RED_2
      : '';
  checkBoxValues.bl_moderate =
    initial_assessment_detail.bluish_lips === COLOR_CODES.SEVERE_RED
      ? COLOR_CODES.SEVERE_RED
      : '';
  checkBoxValues.bl_severe =
    initial_assessment_detail.bluish_lips === COLOR_CODES.SEVERE
      ? COLOR_CODES.SEVERE
      : '';

  checkBoxValues.cf_no =
    initial_assessment_detail.confusion === COLOR_CODES.MILD
      ? COLOR_CODES.MILD
      : '';
  checkBoxValues.cf_mild =
    initial_assessment_detail.confusion === COLOR_CODES.SEVERE_RED_2
      ? COLOR_CODES.SEVERE_RED_2
      : '';
  checkBoxValues.cf_moderate =
    initial_assessment_detail.confusion === COLOR_CODES.SEVERE_RED
      ? COLOR_CODES.SEVERE_RED
      : '';
  checkBoxValues.cf_severe =
    initial_assessment_detail.confusion === COLOR_CODES.SEVERE
      ? COLOR_CODES.SEVERE
      : '';

  checkBoxValues.first_dose_date = new Date(
    initial_assessment_detail.date_of_first_dose,
  )
    ? new Date(initial_assessment_detail.date_of_first_dose)
    : '';
  checkBoxValues.second_dose_date = new Date(
    initial_assessment_detail.date_of_second_dose,
  )
    ? new Date(initial_assessment_detail.date_of_second_dose)
    : new Date();

  // handling other medical conditions
  if (
    initial_assessment_detail.med_condition &&
    initial_assessment_detail.med_condition !== undefined
  ) {
    handleOtherMedicalConditions(
      checkBoxValues,
      initial_assessment_detail.med_condition,
    );
  }

  // handling other Health History
  if (
    initial_assessment_detail.chronic_disease &&
    initial_assessment_detail.chronic_disease !== undefined
  ) {
    handleHealthHistory(
      checkBoxValues,
      initial_assessment_detail.chronic_disease,
    );
  }

  return checkBoxValues;
}

export function otherMedicalHistoryConditions(value) {
  if (value) {
    return true;
  }
  return false;
}

export function generateInitialAssessmentData(inputs, checkBoxes, patient) {
  let payload = {};

  // initial assessment input sections
  payload.Temperature = inputs.temperature;
  payload.Pulse_rate = inputs.pulse_rate;
  payload.SPO2 = inputs.spo2;
  payload.Systolic_blood_pressure = inputs.systolic_blood_pressure;
  payload.Respiratory_rate = inputs.respiratory_rate;
  payload.activity_spo2 = '';
  payload.activity_pulse_rate = '';
  // initial assessment check box sections
  payload.Cough = checkBoxes.cough;
  payload.Running_nose = checkBoxes.running_nose;
  payload.Sore_throat = checkBoxes.sore_throat;
  payload.Body_pain = checkBoxes.body_pain;
  payload.Loss_appetite = checkBoxes.loss_of_appetite;
  payload.Diarrhea = checkBoxes.diarrhea;
  payload.Lost_sense = checkBoxes.lost_sense_of_smell_taste;

  payload.Difficulty_breathing = handleBreathingSectionColor(
    checkBoxes.diff_no,
    checkBoxes.diff_mild,
    checkBoxes.diff_moderate,
    checkBoxes.diff_severe,
  );

  payload.Persistent_pain_pressure_chest = handleBreathingSectionColor(
    checkBoxes.pr_no,
    checkBoxes.pr_mild,
    checkBoxes.pr_moderate,
    checkBoxes.pr_severe,
  );
  payload.Bluish_lips_face = handleBreathingSectionColor(
    checkBoxes.bl_no,
    checkBoxes.bl_mild,
    checkBoxes.bl_moderate,
    checkBoxes.bl_severe,
  );

  payload.Confusion_fatigue = handleBreathingSectionColor(
    checkBoxes.cf_no,
    checkBoxes.cf_mild,
    checkBoxes.cf_moderate,
    checkBoxes.cf_severe,
  );

  payload.overall_status = overallStatusColor(checkBoxes, patient, inputs);
  // initial assessment covid test sections
  payload.RTPCR = checkBoxes.rtpcr;
  payload.Rapid_antigen = checkBoxes.rapid_antigen;
  payload.Antibody_IgG = checkBoxes.antibody_lgg;
  payload.hrct = checkBoxes.hrct;

  // Travel history section
  payload.have_contacted_covid_person = checkBoxes.contacted_covid_person;
  payload.have_travelled_covid_affected_areas =
    checkBoxes.travelled_covid_areas;

  payload.vaccination_name = '';

  // payload.medical_conditions = [
  //   checkBoxes.sam,
  //   checkBoxes.pregnancy_prenatal_post_natal,
  //   checkBoxes.high_bp,
  //   checkBoxes.diabetes,
  //   checkBoxes.immune_compromised,
  //   checkBoxes.cancer,
  // ].toString();

  let medical_conditions = [];
  let history_conditions = [];

  const medicalConditionInputs = [
    checkBoxes.sam,
    checkBoxes.pregnancy_prenatal_post_natal,
    checkBoxes.high_bp,
    checkBoxes.diabetes,
    checkBoxes.immune_compromised,
    checkBoxes.cancer,
  ];

  const healthHistoryInputs = [
    checkBoxes.lungs,
    checkBoxes.heart,
    checkBoxes.kidney,
    checkBoxes.liver,
    checkBoxes.brain_neuro,
  ];

  medicalConditionInputs.forEach((ele) => {
    let flag = otherMedicalHistoryConditions(ele);
    if (flag) {
      medical_conditions.push(ele);
    }
  });

  healthHistoryInputs.forEach((ele) => {
    let flag = otherMedicalHistoryConditions(ele);
    if (flag) {
      history_conditions.push(ele);
    }
  });

  // forEach.medicalConditionInputs((ele) => {
  //   let flag = otherMedicalHistoryConditions(ele);
  // if (flag) {
  //   medical_conditions.push(ele);
  // }
  // });

  // payload.health_history = [
  //   checkBoxes.lungs,
  //   checkBoxes.heart,
  //   checkBoxes.kidney,
  //   checkBoxes.liver,
  //   checkBoxes.brain_neuro,
  // ].toString();

  payload.medical_conditions = medical_conditions.toString();

  payload.health_history = history_conditions.toString();

  return payload;
}

export function handleBreathingSectionColor(color1, color2, color3, color4) {
  if (color1 !== '' && color1 !== undefined) {
    return color1;
  } else if (color2 !== '' && color2 !== undefined) {
    return color2;
  } else if (color3 !== '' && color3 !== undefined) {
    return color3;
  } else if (color4 !== '' && color4 !== undefined) {
    return color4;
  } else {
    return '';
  }
}

export function calculateYears(dob) {
  dob = new Date(dob);

  let dobMonth = dob.getMonth() + 1;
  let dobDay = dob.getDate() + 1;
  let dobYear = dob.getFullYear();

  const today = new Date();

  let currentDay = today.getDate() + 1;
  let currentMonth = today.getMonth() + 1;
  let currentYear = today.getFullYear();

  if (
    dobMonth === currentMonth &&
    dobDay === currentDay &&
    dobYear === currentYear
  ) {
    dobMonth = dob.getMonth() + 1;
    dobDay = dob.getDate();
    dobYear = dob.getFullYear();
  }

  if (currentMonth < parseInt(dobMonth)) {
    currentMonth += 12;
    currentYear--;
  }

  if (currentDay < parseInt(dobDay)) {
    currentMonth--;
    // currentDay += 30;
  }

  const years = currentYear - parseInt(dobYear),
    months = currentMonth - parseInt(dobMonth);
  // let days = currentDay - parseInt(dobDay);

  return years;
}

export function ageColorCode(dob) {
  const ageColor =
    (calculateYears(dob) >= 0 && calculateYears(dob) < 5) ||
    calculateYears(dob) >= 50
      ? COLOR_CODES.SEVERE
      : (calculateYears(dob) >= 5 && calculateYears(dob)) < 15
      ? COLOR_CODES.MODERATE_YELLOW
      : (calculateYears(dob) >= 15 && calculateYears(dob)) <= 50
      ? COLOR_CODES.NO
      : '';
  return ageColor;
}

export function generateRecordVitalPayload(inputs, checkBoxes) {
  let payload = {};
  payload.Temperature = inputs.temperature;
  payload.Pulse_rate = inputs.pulse_rate;
  payload.SPO2 = inputs.spo2;
  payload.Systolic_blood_pressure = inputs.systolic_blood_pressure;
  payload.Respiratory_rate = inputs.respiratory_rate;
  payload.activity_spo2 = inputs.rSpo2;
  payload.activity_pulse_rate = inputs.rPulseRate;

  // Preparing check box section;
  payload.Cough = checkBoxes.cough;
  payload.Running_nose = checkBoxes.running_nose;
  payload.Sore_throat = checkBoxes.sore_throat;
  payload.Body_pain = checkBoxes.body_pain;
  payload.Loss_appetite = checkBoxes.loss_of_appetite;
  payload.Diarrhea = checkBoxes.diarrhea;
  payload.Lost_sense = checkBoxes.lost_sense_of_smell_taste;

  // covid Test checkboxes
  payload.RTPCR = checkBoxes.rtpcr;
  payload.Rapid_antigen = checkBoxes.rapid_antigen;
  payload.Antibody_IgG = checkBoxes.antibody_lgg;
  payload.hrct = checkBoxes.hrct;

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

  return payload;
}

export function recordVitalsInputSections() {
  let inputs = {
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
  return inputs;
}

export function recordVitalCheckBoxes() {
  let checkBoxes = {
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
  };
  return checkBoxes;
}
