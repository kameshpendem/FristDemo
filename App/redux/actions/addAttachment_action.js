import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

// export const getImg = async ({branch_id, hlp_id, val}) => {
//   let url =
//     getBaseUrl() +
//     `v1/appointment/plan/search-list/imaging?branch_id=${branch_id}&search_text=${val}&hlp_id=${hlp_id}`;
//   let res = await ApiCall.get(url);
//   return res.data;
// };

export const createAttachment = async (variables, data) => {
  const header = {
    "Content-Type": "multipart/form-data"
  };

  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${data.enc_id}/doctor/${data.doc_id}/person/${data.hlp_id}/plan/attachment/encounter`;
  let res = await ApiCall.post(url, variables, header);

  console.log(res, "createAttachment");
  return res;
};
export const getAttachment = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/notes`;
  let res = await ApiCall.get(url);
  return res;
};

export const deleteAttachment = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.hlp_id}/plan/attachment/encounter/${variables.id}`;

  console.log(url, variables, "deleteAttachment");

  let res = await ApiCall.delete(url);
  return res;
};
