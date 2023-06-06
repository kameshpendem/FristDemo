import {POST_XP, POST_LOAD, POST_FAIL} from '../actionTypes';
import API from '../../services/Api';

export function getPostList(docid) {
  return async (dispatch) => {
    dispatch(getDoc());
    try {
      console.log('docid', docid);
      const apiReq1 = await API.call('post', 'doctor_details_by_id', docid);
      console.log('PostList' + JSON.stringify(apiReq1));
      await dispatch(getDocSuccess(apiReq1));
    } catch (error) {
      console.error(error, 'error');
      dispatch(getDocFailure(error));
    }
  };
}

export function getPostList2(docid) {
  return async (dispatch) => {
    dispatch(getDoc());
    try {
      console.log('docid', docid);
      const apiReq1 = await API.call(
        'post',
        'doctor_branch_details_by_id',
        docid,
      );
      // console.log("PostList"+JSON.stringify(apiReq1))
      await dispatch(getDocSuccess(apiReq1));
    } catch (error) {
      console.error(error);
      dispatch(getDocFailure(error));
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
function getDoc() {
  return {
    type: POST_LOAD,
  };
}
function getDocSuccess(data) {
  return {
    type: POST_XP,
    data,
  };
}
function getDocFailure() {
  return {
    type: POST_FAIL,
  };
}
