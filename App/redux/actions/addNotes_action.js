import getBaseUrl from '../../config/Config';
import ApiCall from '../../services/ApiCall';

export const getNotesData = async (payload) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${payload.enc_id}/doctor/${payload.doc_id}/person/${payload.hlp_id}/plan/notes`;
  let res = await ApiCall.get(url);

  return res.data;
};
export const createNotes = async (payload) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${payload.encounter_id}/doctor/${payload.doc_id}/person/${payload.hlp_id}/plan/notes`;
  let res = await ApiCall.post(url, payload);
  return res;
};
