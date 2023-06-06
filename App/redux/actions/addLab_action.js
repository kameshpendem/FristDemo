import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const getLab = async ({ branch_id, hlp_id, val }) => {
  let url =
    getBaseUrl() +
    `v1/appointment/plan/search-list/lab?branch_id=${branch_id}&search_text=${val}&hlp_id=${hlp_id}`;
  let res = await ApiCall.get(url);
  return res.data;
};
export const getLabData = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/lab`;

  let res = await ApiCall.get(url);
  return res.data;
};
export const createLab = async (variables, { template_id }) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables[0].encounter_id}/doctor/${variables[0].doc_id}/person/${variables[0].hlp_id}/plan/service/lab?practice_id=${variables[0].practice_id}&template_id=${template_id}`;
  console.log(url, "urllab");
  let res = await ApiCall.post(url, variables);
  return res;
};
export const UpdateLab = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/lab/${variables.id}`;
  let res = await ApiCall.put(url, variables);
  console.log(url, "response lab");
  return res;
};
export const deleteLab = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/lab/${variables.id}`;
  let res = await ApiCall.delete(url);
  return res;
};
