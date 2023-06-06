import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const changePassword1 = async (variables) => {
  let url =
    getBaseUrl() +
    `v1/user/change-password`;
  let res = await ApiCall.put(url,variables);
  return res;
};