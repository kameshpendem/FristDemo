import {
  SAVE_VITALS_SUCCESS,
  SAVE_VITALS_LOAD,
  SAVE_VITALS_FAIL,
  SAVE_SUBJECTIVE_SUCCESS,
  SAVE_SUBJECTIVE_LOAD,
  SAVE_SUBJECTIVE_FAIL,
  SAVE_TEMPLATE_SUCCESS,
  SAVE_TEMPLATE_LOAD,
  SAVE_TEMPLATE_FAIL,
  SAVE_OBJECTIVE_SUCCESS,
  SAVE_OBJECTIVE_LOAD,
  SAVE_OBJECTIVE_FAIL,
  SAVE_ASSESSMENT_SUCCESS,
  SAVE_ASSESSMENT_LOAD,
  SAVE_ASSESSMENT_FAIL,
  SAVE_PLAN_SUCCESS,
  SAVE_PLAN_LOAD,
  SAVE_PLAN_FAIL,
  SAVE_LAB_LOAD,
  SAVE_LAB_SUCCESS,
  SAVE_LAB_FAIL,
  SAVE_IMG_ORDER_LOAD,
  SAVE_IMG_ORDER_SUCCESS,
  SAVE_IMG_ORDER_FAIL,
  SAVE_NURSING_ORDER_LOAD,
  SAVE_NURSING_ORDER_SUCCESS,
  SAVE_NURSING_ORDER_FAIL,
  SAVE_VACCINE_ORDER_LOAD,
  SAVE_VACCINE_ORDER_SUCCESS,
  SAVE_VACCINE_ORDER_FAIL,
  ADD_ALLERGY_FAIL,
  ADD_ALLERGY_LOAD,
  ADD_ALLERGY_XP,
  ADD_SSM_FAIL,
  ADD_SSM_LOAD,
  ADD_SSM_XP,
  UPDATE_ALLERGY_FAIL,
  UPDATE_ALLERGY_LOAD,
  UPDATE_ALLERGY_XP,
  UPDATE_VACCINEBATCH_FAIL,
  UPDATE_VACCINEBATCH_SUCCESS,
  UPDATE_VACCINEBATCH_LOAD,
} from '../actionTypes';
import API from '../../services/Api';

export function saveVitalsData(vitalsdata) {
  console.log('12344');
  return async (dispatch) => {
    dispatch(saveVitalsLoad());
    try {
      console.log('54311' + JSON.stringify(vitalsdata));
      const apiReq2 = await API.call('post', 'save_vitals/', vitalsdata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(vitalsdata),
      );
      await dispatch(saveVitalsSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveVitalsFailure(error));
    }
  };
}

export function saveSubjectiveData(subjectivedata) {
  return async (dispatch) => {
    dispatch(saveSubjectiveLoad());
    try {
      const apiReq2 = await API.call(
        'post',
        'save_subjective/',
        subjectivedata,
      );
      console.log('srikanth' + JSON.stringify(apiReq2) + ' ' + subjectivedata);
      await dispatch(saveSubjectiveSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveSubjectiveFailure(error));
    }
  };
}

export function saveTemplateData(templatedata) {
    console.log("savetemplate")
    return async (dispatch) => {
      dispatch(saveTemplateLoad());
      try {
          console.log("try")
        const apiReq2 = await API.call(
          'post',
          'save_templates_data/',
          templatedata,
        );
        console.log('sandy' + JSON.stringify(apiReq2) + ' ' + templatedata);
        await dispatch(saveTemplateSuccess(apiReq2));
      } catch (error) {
          console.log("catch")
        console.log(error);
        dispatch(saveTemplateFailure(error));
      }
    };
  }

export function saveObjectiveData(objectivedata) {
  return async (dispatch) => {
    dispatch(saveObjectiveLoad());
    try {
      const apiReq2 = await API.call('post', 'save_objective/', objectivedata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(objectivedata),
      );
      await dispatch(saveObjectiveSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveObjectiveFailure(error));
    }
  };
}
export function saveAssessementData(assessmentdata) {
  return async (dispatch) => {
    dispatch(saveAssessmentLoad());
    try {
      const apiReq2 = await API.call('post', 'save_assesment/', assessmentdata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(assessmentdata),
      );
      await dispatch(saveAssessmentSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveAssessmentFailure(error));
    }
  };
}

export function savePlanData(plandata) {
  return async (dispatch) => {
    dispatch(savePlanLoad());
    try {
      const apiReq2 = await API.call('post', 'save_plan/', plandata);
      console.log('srikanth' + JSON.stringify(apiReq2) + ' ' + plandata);
      await dispatch(savePlanSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(savePlanFailure(error));
    }
  };
}
export function saveLabOrderData(laborderdata) {
  return async (dispatch) => {
    dispatch(saveLabOrderLoad());
    try {
      const apiReq2 = await API.call('post', 'insert_laborders/', laborderdata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(laborderdata),
      );
      await dispatch(saveLabOrderSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveLabOrderFailure(error));
    }
  };
}

export function saveImagingOrderData(imgorderdata) {
  return async (dispatch) => {
    dispatch(saveImagingOrderLoad());
    try {
      const apiReq2 = await API.call('post', 'insert_imgorders/', imgorderdata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(imgorderdata),
      );
      await dispatch(saveImagingOrderSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveImagingOrderFailure(error));
    }
  };
}

export function saveNursingOrderData(nursingorderdata) {
  return async (dispatch) => {
    dispatch(saveNursingOrderLoad());
    try {
      const apiReq2 = await API.call(
        'post',
        'nurse_service_insert/',
        nursingorderdata,
      );
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(nursingorderdata),
      );
      await dispatch(saveNursingOrderSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveNursingOrderFailure(error));
    }
  };
}

export function saveVaccineOrderData(vaccineorderdata) {
  return async (dispatch) => {
    dispatch(saveVaccineOrderLoad());
    try {
      const apiReq2 = await API.call(
        'post',
        '/vaccine_insert',
        vaccineorderdata,
      );
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(vaccineorderdata),
      );
      await dispatch(saveVaccineOrderSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveVaccineOrderFailure(error));
    }
  };
}

export function saveAllergyData(allergydata) {
  return async (dispatch) => {
    dispatch(saveAllergyLoad());
    try {
      const apiReq2 = await API.call('post', '/insert_allergies', allergydata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(allergydata),
      );
      await dispatch(saveAllergySuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveAllergyFailure(error));
    }
  };
}

export function saveSsmData(ssmdata) {
  return async (dispatch) => {
    dispatch(saveSsmLoad());
    try {
      const apiReq2 = await API.call('post', '/insert_ssm', ssmdata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(ssmdata),
      );
      await dispatch(saveSsmSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(saveSsmFailure(error));
    }
  };
}
export function updateVaccineBatchData(vaccinebatchdata) {
  return async (dispatch) => {
    dispatch(updateVaccineBatchLoad());
    try {
      const apiReq2 = await API.call(
        'post',
        '/update_vaccinebatch',
        vaccinebatchdata,
      );
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(vaccinebatchdata),
      );
      await dispatch(updateVaccineBatchSuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(updateVaccineBatchFailure(error));
    }
  };
}

function updateVaccineBatchLoad() {
  return {
    type: UPDATE_VACCINEBATCH_LOAD,
  };
}
function updateVaccineBatchSuccess(data) {
  return {
    type: UPDATE_VACCINEBATCH_SUCCESS,
    data,
  };
}
function updateVaccineBatchFailure() {
  return {
    type: UPDATE_VACCINEBATCH_FAIL,
  };
}

function saveVitalsLoad() {
  return {
    type: SAVE_VITALS_LOAD,
  };
}
function saveVitalsSuccess(data) {
  return {
    type: SAVE_VITALS_SUCCESS,
    data,
  };
}
function saveVitalsFailure() {
  return {
    type: SAVE_VITALS_FAIL,
  };
}

function saveSubjectiveLoad() {
  return {
    type: SAVE_SUBJECTIVE_LOAD,
  };
}
function saveSubjectiveSuccess(data) {
  return {
    type: SAVE_SUBJECTIVE_SUCCESS,
    data,
  };
}
function saveSubjectiveFailure() {
  return {
    type: SAVE_SUBJECTIVE_FAIL,
  };
}
function saveTemplateLoad() {
    console.log("load")
    return {
      type: SAVE_TEMPLATE_LOAD,
    };
  }
  function saveTemplateSuccess(data) {
      console.log("success")
      console.log(data)
    return {
      type: SAVE_TEMPLATE_SUCCESS,
      data,
    };
  }
  function saveTemplateFailure() {
      console.log("failure")
    return {
      type: SAVE_TEMPLATE_FAIL,
    };
  }
function saveObjectiveLoad() {
  return {
    type: SAVE_OBJECTIVE_LOAD,
  };
}
function saveObjectiveSuccess(data) {
  return {
    type: SAVE_OBJECTIVE_SUCCESS,
    data,
  };
}
function saveObjectiveFailure() {
  return {
    type: SAVE_OBJECTIVE_FAIL,
  };
}

function saveAssessmentLoad() {
  return {
    type: SAVE_ASSESSMENT_LOAD,
  };
}
function saveAssessmentSuccess(data) {
  return {
    type: SAVE_ASSESSMENT_SUCCESS,
    data,
  };
}
function saveAssessmentFailure() {
  return {
    type: SAVE_ASSESSMENT_FAIL,
  };
}

function savePlanLoad() {
  return {
    type: SAVE_PLAN_LOAD,
  };
}
function savePlanSuccess(data) {
  return {
    type: SAVE_PLAN_SUCCESS,
    data,
  };
}
function savePlanFailure() {
  return {
    type: SAVE_PLAN_FAIL,
  };
}

function saveLabOrderLoad() {
  return {
    type: SAVE_LAB_LOAD,
  };
}
function saveLabOrderSuccess(data) {
  return {
    type: SAVE_LAB_SUCCESS,
    data,
  };
}
function saveLabOrderFailure() {
  return {
    type: SAVE_LAB_FAIL,
  };
}

function saveImagingOrderLoad() {
  return {
    type: SAVE_IMG_ORDER_LOAD,
  };
}
function saveImagingOrderSuccess(data) {
  return {
    type: SAVE_IMG_ORDER_SUCCESS,
    data,
  };
}
function saveImagingOrderFailure() {
  return {
    type: SAVE_IMG_ORDER_FAIL,
  };
}

function saveNursingOrderLoad() {
  return {
    type: SAVE_NURSING_ORDER_LOAD,
  };
}
function saveNursingOrderSuccess(data) {
  return {
    type: SAVE_NURSING_ORDER_SUCCESS,
    data,
  };
}
function saveNursingOrderFailure() {
  return {
    type: SAVE_NURSING_ORDER_FAIL,
  };
}

function saveVaccineOrderLoad() {
  return {
    type: SAVE_VACCINE_ORDER_LOAD,
  };
}
function saveVaccineOrderSuccess(data) {
  return {
    type: SAVE_VACCINE_ORDER_SUCCESS,
    data,
  };
}
function saveVaccineOrderFailure() {
  return {
    type: SAVE_VACCINE_ORDER_FAIL,
  };
}

function saveAllergyFailure() {
  return {
    type: ADD_ALLERGY_FAIL,
  };
}

function saveAllergyLoad() {
  return {
    type: ADD_ALLERGY_LOAD,
  };
}
function saveAllergySuccess(data) {
  return {
    type: ADD_ALLERGY_XP,
    data,
  };
}

function saveSsmFailure() {
  return {
    type: ADD_SSM_FAIL,
  };
}

function saveSsmLoad() {
  return {
    type: ADD_SSM_LOAD,
  };
}
function saveSsmSuccess(data) {
  return {
    type: ADD_SSM_XP,
    data,
  };
}

export function updateAllergyData(allergydata) {
  return async (dispatch) => {
    dispatch(updateAllergyLoad());
    try {
      const apiReq2 = await API.call('post', '/update_allergies', allergydata);
      console.log(
        'srikanth' + JSON.stringify(apiReq2) + JSON.stringify(allergydata),
      );
      await dispatch(updateAllergySuccess(apiReq2));
    } catch (error) {
      console.error(error);
      dispatch(updateAllergyFailure(error));
    }
  };
}

function updateAllergyFailure() {
  return {
    type: UPDATE_ALLERGY_FAIL,
  };
}

function updateAllergyLoad() {
  return {
    type: UPDATE_ALLERGY_LOAD,
  };
}
function updateAllergySuccess(data) {
  return {
    type: UPDATE_ALLERGY_XP,
    data,
  };
}
