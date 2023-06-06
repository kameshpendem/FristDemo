import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const getImg = async ({ branch_id, hlp_id, val }) => {
  let url =
    getBaseUrl() +
    `v1/appointment/plan/search-list/imaging?branch_id=${branch_id}&search_text=${val}&hlp_id=${hlp_id}`;
  let res = await ApiCall.get(url);

  return res.data;
};
export const getImgData = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/imaging`;
  let res = await ApiCall.get(url);
  return res.data;
};
export const createImg = async (variables, { template_id }) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables[0].encounter_id}/doctor/${variables[0].doc_id}/person/${variables[0].hlp_id}/plan/service/imaging?practice_id=${variables[0].practice_id}&template_id=${template_id}`;
  let res = await ApiCall.post(url, variables);
  return res;
};
export const UpdateImg = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/imaging/${variables.id}`;
  let res = await ApiCall.put(url, variables);
  return res.data;
};

export const deleteImg = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/imaging/${variables.id}`;

  let res = await ApiCall.delete(url);
  return res;
};
