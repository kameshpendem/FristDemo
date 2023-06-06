import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const getVaccine = async ({ branch_id, hlp_id, val }) => {
  let url =
    getBaseUrl() +
    `v1/appointment/plan/search-list/vaccine?branch_id=${branch_id}&search_text=${val}&hlp_id=${hlp_id}`;

  let res = await ApiCall.get(url);
  return res.data;
};
export const getVaccineData = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/vaccine?is_pending_vacccines=${variables.pending}`;

  let res = await ApiCall.get(url);

  return res.data;
};

export const createVaccine = async (variables, { template_id }) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables[0].encounter_id}/doctor/${variables[0].doc_id}/person/${variables[0].hlp_id}/plan/vaccine?template_id=${template_id}`;
  let res = await ApiCall.post(url, variables);
  return res;
};
export const UpdateVaccine = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables[0].encounter_id}/doctor/${variables[0].doc_id}/person/${variables[0].hlp_id}/plan/vaccine/${variables[0].id}`;
  let res = await ApiCall.post(url, variables);
  return res;
};
export const deleteVaccine = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/vaccine/${variables.id}`;
  let res = await ApiCall.delete(url, variables);
  return res;
};

export const getSearchVaccine = async ({ hlp_id }) => {
  let url =
    getBaseUrl() +
    // `v1/appointment/plan/search-list/vaccine?branch_id=${branch_id}&search_text=${val}&hlp_id=${hlp_id}`;
    `v1/reference-data/immunization/vaccines/${hlp_id}`;

  let res = await ApiCall.get(url);
  return res.data;
};

export const saveVaccination = async ({ hlp_id, id, vaccine_taken_date }) => {
  let body = {
    id: id,
    vaccine_taken_date: vaccine_taken_date
  };
  let url =
    getBaseUrl() +
    // `v1/appointment/plan/search-list/vaccine?branch_id=${branch_id}&search_text=${val}&hlp_id=${hlp_id}`;
    `v1/person/${hlp_id}/immunization/add-vaccine`;

  let res = await ApiCall.post(url, body);

  return res;
};
export const ProvideVaccine = async (variables, payload) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/vaccine/provide`;

  // console.log(url, JSON.stringify(payload));
  let res = await ApiCall.post(url, payload);
  return res;
};
