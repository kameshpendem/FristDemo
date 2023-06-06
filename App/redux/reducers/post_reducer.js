import {POST_XP, POST_LOAD, POST_FAIL} from '../actionTypes';
// const initialState = {
// postList: []
// };
// const  post_reducer= (state = initialState, action) => {
// switch(action.type) {
// case POST_XP:
// return {
// ...state,
// postList:action.payload

// };
// default:
// return state;
// }
// }
const initialState = {
  postList: [],
  isFetching: false,
  error: false,
};
const post_reducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LOAD:
      return {
        postList: [],
        isFetching: true,
        error: false,
      };
    case POST_XP:
      return {
        ...state,
        isFetching: false,
        postList: action.data,
      };
    case POST_FAIL:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return state;
  }
};
export default post_reducer;
