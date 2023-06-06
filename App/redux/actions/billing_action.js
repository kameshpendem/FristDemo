import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const getPaymentCriteria = async ({
  healpha_id,
  branch_id,
  doc_id,
  is_appointment,
  appointment_type,
  is_consult,
  is_review
}) => {
  let url =
    getBaseUrl() +
    `v1/billing/patient/${healpha_id}/branch/${branch_id}/payment-criteria?doctor_id=${doc_id}&is_appointment=${is_appointment}&appointment_type=${appointment_type}&is_consult=${is_consult}&is_review=${is_review}`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getServiceGroups = async ({ healpha_id, branch_id, group_id }) => {
  let url =
    getBaseUrl() +
    // `v1/billing/patient/${healpha_id}/branch/${branch_id}/payment-criteria?doctor_id=${doc_id}&is_appointment=${is_appointment}&appointment_type=${appointment_type}`;
    `v1/billing/patient/${healpha_id}/branch/${branch_id}/service-groups?group_id=${
      group_id || ""
    }`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getServicesByEncounter = async ({
  healpha_id,
  branch_id,
  encounter_id
}) => {
  let url =
    getBaseUrl() +
    `v1/billing/patient/${healpha_id}/branch/${branch_id}/encounter/${encounter_id}/services`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getConsultationData = async (hlp, branch_id, payload) => {
  let url =
    getBaseUrl() +
    `v1/billing/patient/${hlp}/branch/${branch_id}/consultation-line-item?appointment_type=${payload.appointment_type}&doctor_id=${payload.doctor_id}&encounter_id=${payload.encounter_id}&appointment_date=${payload.appointment_date}&patient_category=${payload.patient_category}`;

  let res = await ApiCall.get(url);

  return res.data;
};

export const addServices = async (payload, validation) => {
  let url =
    getBaseUrl() +
    `v1/billing/patient/${validation.hlp_id}/branch/${validation.branchid}/add-services`;

  let res = await ApiCall.post(url, payload);

  return res;
};

export const cancelService = async (variables, payload) => {
  let url =
    getBaseUrl() +
    `v1/billing/patient/${variables.healpha_id}/encounter/${variables.enc_id}/cancel-services`;

  let res = await ApiCall.post(url, payload);

  return res;
};

export const getAuthorizations = async ({ branch_id }) => {
  let url =
    getBaseUrl() + `v1/billing/branch/${branch_id}/service-authorization`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const refundamount = async (variables, payload) => {
  let url =
    getBaseUrl() +
    `v1/billing/patient/${variables.hlp_id}/encounter/${variables.encounter_id}/refund-amount`;

  let res = await ApiCall.post(url, payload);
  return res;
};

export const bankNames = async () => {
  let url = getBaseUrl() + `v1/reference-data/bank-names/all`;

  let res = await ApiCall.get(url);

  return res;
};
