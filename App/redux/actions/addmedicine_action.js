import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const getMedicines = async ({ med, branch_id, hlp_id }) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/plan/search-list/medicine?branch_id=${branch_id}&search_text=${med}&hlp_id=${hlp_id}`;
    // console.log(url, "add medicine url");
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {}
};

export const postMedicine = async (payload, valid) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${valid.enc_id}/doctor/${valid.doc_id}/person/${valid.hlp_id}/plan/prescription/medicine?template_id=${valid.template_id}`;
  //console.log(url, "url");
  let res = await ApiCall.post(url, payload);
  return res;
};

export const getDrugTypes = async (type) => {
  let url =
    getBaseUrl() + `v1/appointment/plan/drug-types?drug_type=${type || ""}`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getMedicinesAdded = async (payload) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/encounter/${payload.enc_id}/doctor/${payload.doc_id}/person/${payload.hlp_id}/plan/prescription/medicine`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {}
};

export const updateMedicine = async (payload, valid) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/encounter/${valid.enc_id}/doctor/${valid.doc_id}/person/${valid.hlp_id}/plan/prescription/medicine/${valid.id}`;
    let res = await ApiCall.put(url, payload);
    // console.log(url, payload, "uploadMedicines");
    return res;
  } catch (error) {
    //console.log(error);
  }
};

export const deleteMedicine = async (payload) => {
  try {
    let url =
      getBaseUrl() +
      `v1/appointment/encounter/${payload.enc_id}/doctor/${payload.doc_id}/person/${payload.hlp_id}/plan/prescription/medicine/${payload.id}`;

    // console.log(url, "deleteMedicine");

    let res = await ApiCall.delete(url);
    return res;
  } catch (error) {
    // console.log(error);
  }
};
