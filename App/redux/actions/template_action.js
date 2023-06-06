import {
  TEMPLET_XP,
  TEMPLET_LOAD,
  TEMPLET_FAIL,
  TEMPLETID_XP
} from "../actionTypes";
import API from "../../services/Api";
import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export function getTemplateList(data) {
  return async (dispatch) => {
    dispatch(getTemplate());
    try {
      const apiReq1 = await API.call("post", "template_list/", data);
      console.log(
        "koldfndkndsvk sdvnvvdsn" +
          JSON.stringify(apiReq1) +
          JSON.stringify(data)
      );
      await dispatch(getTemplateSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getTemplateFailure(error));
    }
  };
}
// https://test.healpha.com//api/doctor_details_by_id
// export function fetchDocFromAPI(docid){
//     return async(dispatch)=>{
//         dispatch(getDoc())
//         const apiReq=await API.call('post','doctor_details_by_id',docid)
//         .then(res =>res.json())
//         .then(json =>dispatch(getDocSuccess(json.results)))
//         .catch(err=>dispatch(getDocFailure(err)))
//     }
// }
function getTemplate() {
  return {
    type: TEMPLET_LOAD
  };
}
function getTemplateSuccess(data) {
  return {
    type: TEMPLET_XP,
    data
  };
}
function getTemplateFailure() {
  return {
    type: TEMPLET_FAIL
  };
}

///MT

export const getMasterTemplates = async (variables) => {
  // let body = {
  //   practice_id: variables.practice_id,
  //   branch_id: variables.branch_id,
  //   doctor_id: variables.doctor_id,
  //   specialization: variables.specialization,
  // };

  // console.log(variables, 'checking search text');

  let url =
    getBaseUrl() +
    `v1/template/master-templates?practice_id=${variables.practice_id},Healpha&branch_id=${variables.branch_id}&search_text=${variables.search_text}`;
  let res = await ApiCall.get(url);

  //console.log(res, 'from template response');

  return res.data;
};

export const selectMicroTemplate = async (id) => {
  let url = getBaseUrl() + `v1/template/master-template/${id}`;

  //console.log(url, "url from selectMicroTemplate");
  let res = await ApiCall.get(url);
  return res.data;
};

export const updateTemplateId = async (body) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${body.enc_id}/doctor/${body.doc_id}/person/${body.healphaId}/template/${body.id}`;
  //console.log(url, "updateurl");
  let res = await ApiCall.put(url);
  return res;
};

export const createPdf = async ({
  enc_id,
  doc_id,
  hlp_id,
  preview,
  template_id
}) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${enc_id}/doctor/${doc_id}/person/${hlp_id}/generate-prescription?template_id=${template_id}`;

  //console.log(url, JSON.stringify(preview), template_id);

  let res = await ApiCall.post(url, {
    is_preview: preview,
    template_id: template_id
  });

  //console.log(JSON.stringify(res), "response from prescription");
  return res;
};

export const fetchMicroTemplatesuccess = (data) => {
  return {
    data: data,
    type: TEMPLET_XP
  };
};

export const storeTemplateId = (data) => {
  return {
    data: data,
    type: TEMPLETID_XP
  };
};
