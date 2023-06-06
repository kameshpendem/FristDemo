import getBaseUrl from '../../config/Config';
import ApiCall from '../../services/ApiCall';
import {NURSING_XP} from '../actionTypes';

export const getNur = async ({branch_id, hlp_id, val}) => {
  let url =
    getBaseUrl() +
    `v1/appointment/plan/search-list/nursing?branch_id=${branch_id}&search_text=${val}&hlp_id=${hlp_id}`;
  let res = await ApiCall.get(url);
  return res.data;
};
export const createNur = async (variables, {template_id}) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables[0].encounter_id}/doctor/${variables[0].doc_id}/person/${variables[0].hlp_id}/plan/service/nursing?practice_id=${variables[0].practice_id}&template_id=${template_id}`;
  let res = await ApiCall.post(url, variables);
  return res;
};
export const getNursingData = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/nursing`;

  let res = await ApiCall.get(url);
  return res.data;
};

export const UpdateNur = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/nursing/${variables.id}`;
  let res = await ApiCall.put(url);
  return res.data;
};
export const deleteNur = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/service/nursing/${variables.id}`;
  let res = await ApiCall.delete(url);
  return res;
};

export const fetchSuccessNursing = (data) => {
  return {
    data: data,
    type: NURSING_XP,
  };
};
