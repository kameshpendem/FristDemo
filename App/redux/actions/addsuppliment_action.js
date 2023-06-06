import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const getSuppliments = async ({ sup, branch_id, hlp_id }) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/plan/search-list/suppliment?branch_id=${branch_id}&search_text=${sup}&hlp_id=${hlp_id}`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {}
};
export const getUnits = async ({ unit }) => {
  try {
    let url = getBaseUrl() + `v1/appointment/plan/drug-types?drug_type=${unit}`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {}
};

export const postSuppliment = async (payload, valid) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/encounter/${valid.enc_id}/doctor/${valid.doc_id}/person/${valid.hlp_id}/plan/prescription/suppliment?template_id=${valid.template_id}`;
    let res = await ApiCall.post(url, payload);
    return res;
  } catch (error) {}
};

export const getSupplimentsAdded = async (payload) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/encounter/${payload.enc_id}/doctor/${payload.doc_id}/person/${payload.hlp_id}/plan/prescription/suppliment`;

    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {}
};

export const updateSuppliment = async (payload, valid) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/encounter/${valid.enc_id}/doctor/${valid.doc_id}/person/${valid.hlp_id}/plan/prescription/suppliment/${valid.id}`;
    let res = await ApiCall.put(url, payload);
    return res;
  } catch (error) {}
};

export const deleteSuppliment = async (payload) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/encounter/${payload.enc_id}/doctor/${payload.doc_id}/person/${payload.hlp_id}/plan/prescription/suppliment/${payload.id}`;
    let res = await ApiCall.delete(url);
    return res;
  } catch (error) {}
};
