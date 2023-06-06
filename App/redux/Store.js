import { createStore, combineReducers } from "redux";

import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import post_reducer from "./reducers/post_reducer";
import patient_reducer from "./reducers/patient_reducer";
import forgot_reducer from "./reducers/forgot_reducer";
import for_reducer from "./reducers/for_reducer";
import chnange_reducer from "./reducers/chenge_reducer";
import {
  vitals_reducer,
  save_plan_reducer,
  vital_labels_reducer
} from "./reducers/vitals_reducer";
import consult_reducer from "./reducers/consult_reducer";
import validate_reducer from "./reducers/validate_reducer";
import report_reducer from "./reducers/report_reducer";
import oldpatient_reducer from "./reducers/oldpatient_reducer";
import enc_reducer from "./reducers/enc_reducer";
import template_reducer, {
  template_store_reducer
} from "./reducers/template_reducer";
import tempapply_reducer from "./reducers/tempapply_reducer";
import subjective_reducer from "./reducers/subjective_reducer";
import insight_template_reducer from "./reducers/insight_template";
import objective_reducer from "./reducers/objective_reducer";
import assessment_reducer from "./reducers/assessment_reducer";
import medicine_reducer from "./reducers/medicine_reducer";
import tele_reducer from "./reducers/tele_reducer";
import medicine_reducer1 from "./reducers/medicine_reducer1";
import {
  addmed_reducer,
  delete_temp_img_reducer,
  delete_temp_lab_reducer,
  delete_temp_med_reducer,
  delete_temp_nursing_reducer,
  delete_temp_sup_reducer
} from "./reducers/addmed_reducer";
import addmed_reducer1 from "./reducers/addmed_reducer1";
import deletemed_reducer from "./reducers/deletemed_reducer";
import deletesup_reducer from "./reducers/deletesup_reducer";
import presec_reducer from "./reducers/presec_reducer";
import immunreact_reducer from "./reducers/immunreact_reducer";
import immunupdate_reducer from "./reducers/immunupdate_reducer";
import immunimg_reducer from "./reducers/immunimg_reducer";
import gchart_reducer from "./reducers/gchart_reducer";
import timeline_reducer from "./reducers/timeline_reducer";
import nonhealpha_reducer from "./reducers/nonhealpha_reducer";
import {
  save_allergy_reducer,
  save_ssm_reducer,
  delete_allergy_reducer,
  update_allergy_reducer,
  history_reducer,
  doctor_reducer
} from "./reducers/history_reducer";
import {
  services_reducer,
  save_lab_reducer,
  save_imaging_reducer,
  save_nursing_reducer,
  delete_lab_reducer,
  delete_imaging_reducer,
  delete_nursing_reducer,
  retrieve_timeline_reducer,
  repeat_all_imaging_reducer,
  repeat_imaging_reducer,
  repeat_lab_reducer,
  repeat_all_lab_reducer,
  save_vaccine_reducer,
  delete_vaccine_reducer,
  retrieve_vaccine_reducer,
  update_vaccinebatch_reducer
} from "./reducers/services_reducer";
import updatems_reducer from "./reducers/updatems_reducer";
import { change_tab_reducer } from "./reducers/change_tab";
import {
  practice_branch_list_reducer,
  doctor_list_reducer,
  covid_monitor_counts_reducer,
  covid_monitor_list_reducer,
  covid_monitor_patient_reducer,
  covid_notes_reducer,
  standard_notes_reducer,
  save_covid_notes_data_reducer,
  close_encounter_status_reducer,
  reopen_encounter_status_reducer,
  save_patient_consent_reducer
} from "./reducers/covidmonitoring_reducer";
import { Nursing_reducer } from "./reducers/nursing_reducer";

import twilio_reducer from "./reducers/TwilioReducers";
import random_reducer from "./reducers/random_reducer";
const rootReducer = combineReducers({
  nursingData: Nursing_reducer,
  postList: post_reducer,
  patientList: patient_reducer,
  forgotList: forgot_reducer,
  forList: for_reducer,
  teleList: tele_reducer,
  changeList: chnange_reducer,
  vitals: vitals_reducer,
  consultList: consult_reducer,
  validateList: validate_reducer,
  reportList: report_reducer,
  oldList: oldpatient_reducer,
  encList: enc_reducer,
  templateList: template_reducer,
  template_store_reducer: template_store_reducer,
  applyList: tempapply_reducer,
  subjective: subjective_reducer,
  insight_template: insight_template_reducer,
  objective: objective_reducer,
  assessment: assessment_reducer,
  medicineList: medicine_reducer,
  medicineList1: medicine_reducer1,
  addmedList: addmed_reducer,
  addmedList1: addmed_reducer1,
  delList: deletemed_reducer,
  delList1: deletesup_reducer,
  services: services_reducer,
  savelab: save_lab_reducer,
  saveimaging: save_imaging_reducer,
  savenursing: save_nursing_reducer,
  deletelab: delete_lab_reducer,
  deleteimaging: delete_imaging_reducer,
  deletenursing: delete_nursing_reducer,
  persontimeline: retrieve_timeline_reducer,
  repeatalllab: repeat_all_lab_reducer,
  repeatallimaging: repeat_all_imaging_reducer,
  repeatlab: repeat_lab_reducer,
  repeatimaging: repeat_imaging_reducer,
  savevaccine: save_vaccine_reducer,
  deletevaccine: delete_vaccine_reducer,
  retrievevaccine: retrieve_vaccine_reducer,
  saveplan: save_plan_reducer,
  vitalLabels: vital_labels_reducer,
  presecList: presec_reducer,
  immunimgList: immunimg_reducer,
  immunupdateList: immunupdate_reducer,
  immunreactList: immunreact_reducer,
  gchartList: gchart_reducer,
  timeList: timeline_reducer,
  add_allergy: save_allergy_reducer,
  add_ssm: save_ssm_reducer,
  delete_allergy: delete_allergy_reducer,
  update_allergy: update_allergy_reducer,
  history: history_reducer,
  nonList: nonhealpha_reducer,
  doctor_reducer: doctor_reducer,
  updatemsList: updatems_reducer,
  delete_temp_img_reducer: delete_temp_img_reducer,
  delete_temp_lab_reducer: delete_temp_lab_reducer,
  delete_temp_nursing_reducer: delete_temp_nursing_reducer,
  delete_temp_med_reducer: delete_temp_med_reducer,
  delete_temp_sup_reducer: delete_temp_sup_reducer,
  change_tab_reducer: change_tab_reducer,
  update_vaccinebatch_reducer: update_vaccinebatch_reducer,
  practiceBranchList: practice_branch_list_reducer,
  doctorList: doctor_list_reducer,
  covidMonitorCounts: covid_monitor_counts_reducer,
  covidMonitorList: covid_monitor_list_reducer,
  covidMonitorPatient: covid_monitor_patient_reducer,
  covidNotes: covid_notes_reducer,
  standardNotes: standard_notes_reducer,
  savedCovidNotes: save_covid_notes_data_reducer,
  closeEncounterStatusData: close_encounter_status_reducer,
  reopenEncounterStatusData: reopen_encounter_status_reducer,
  savePatientConsentData: save_patient_consent_reducer,
  app_twilio: twilio_reducer,
  random_value: random_reducer
});
const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};
export default configureStore;
