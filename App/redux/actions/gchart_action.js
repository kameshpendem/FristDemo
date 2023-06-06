import { GCHART_XP, GCHART_LOAD, GCHART_FAIL } from "../actionTypes";
import API from "../../services/Api";

export function getGchartList(data) {
  return async (dispatch) => {
    dispatch(getGchart());
    try {
      const apiReq1 = await API.call("post", "doc_growth_data_react/", data);
      console.log("srikanth1435" + apiReq1 + JSON.stringify(data));
      await dispatch(getGchartSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getGchartFailure(error));
    }
  };
}
function getGchart() {
  return {
    type: GCHART_LOAD
  };
}
function getGchartSuccess(data) {
  return {
    type: GCHART_XP,
    data
  };
}
function getGchartFailure() {
  return {
    type: GCHART_FAIL
  };
}
