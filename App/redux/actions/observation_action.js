import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";
import { GET_VITALS_LABEL } from "../actionTypes";

export const getVitalsLabels = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/vital?template_id=${variables.templateId}`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const fetchVitalLabelssuccess = (data) => {
  return {
    data: data,
    type: GET_VITALS_LABEL
  };
};

export const getVitalCalculation = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/vital/${variables.key}/calculate?value=${variables.input}`;
  let res = await ApiCall.get(url);

  return res.data;
};

export const getBPCalculation = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/vital/${variables.key}/calculate?value=${variables.input}&height=${variables.height}`;
  // console.log(url,'getVitalCalculation' );
  let res = await ApiCall.get(url);
  return res.data;
};

export const getBmi = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/vital/bmi/calculate?height=${variables.height}&weight=${variables.weight}`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const saveVitals = async (variables) => {
  let body = {
    vitals: variables.vitals,
    comments: variables.comments
  };
  let url = "";
  if (variables.template_id == "timeline") {
    url =
      getBaseUrl() +
      `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/vital`;
  } else {
    let template = variables?.template_id
      ? `template_id=${variables?.template_id}`
      : "is_default_template=true";

    url =
      getBaseUrl() +
      `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/vital?${template}'
    }`;
  }

  let res = await ApiCall.post(url, body);
  // console.log(
  //   res,
  //   'console.log(url, JSON.stringify(body), "hello save vitals ");'
  // );
  return res;
};

export const updateVitals = async (variables) => {
  let body = {
    vitals: variables.vitals,
    comments: variables.comments
  };

  let template = variables.vitalsId;

  let template_id = variables?.template_id
    ? `template_id=${variables?.template_id}`
    : "is_default_template=true";

  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${
      variables.doc_id
    }/person/${variables.healphaId}/vital/${+template}?${template_id}`;
  let res = await ApiCall.put(url, body);

  // console.log(
  //   res,
  //   'console.log(url, JSON.stringify(body), "hello save vitals ");'
  // );
  return res;
};

export const createData = async (body, query) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${query.enc_id}/doctor/${query.doc_id}/person/${query.healphaId}/template/answers?template_id=${query.template_id}`;

  console.log(url, JSON.stringify(body), "from observation action");

  let res = await ApiCall.post(url, body);
  return res;
};

export const updateData = async (body) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${body.enc_id}/doctor/${body.doc_id}/person/${body.healphaId}/template/answers/${body.id}`;
  //console.log(url, JSON.stringify(body, "votial jnfkjkjkkjhkjhjkh"));
  let res = await ApiCall.put(url, body);
  return res;
};

export const getTemplateViewData = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/template/answers`;
  let res = await ApiCall.get(url);
  return res.data;
};

// plan page actions
export const getMedicineByTId = async ({ id }) => {
  let url = getBaseUrl() + `v1/template/${id}/plan/prescription/medicine`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getSupplimentByTId = async ({ id }) => {
  let url = getBaseUrl() + `v1/template/${id}/plan/prescription/suppliment`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getLabByTId = async ({ id }) => {
  let url = getBaseUrl() + `v1/template/${id}/plan/service/lab`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getImagingByTId = async ({ id }) => {
  let url = getBaseUrl() + `v1/template/${id}/plan/service/imaging`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const getNursingByTId = async ({ id }) => {
  let url = getBaseUrl() + `v1/template/${id}/plan/service/nursing`;
  let res = await ApiCall.get(url);
  return res.data;
};
