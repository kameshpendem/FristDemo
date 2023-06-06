import {
  TEMPLET_XP,
  TEMPLET_LOAD,
  TEMPLET_FAIL,
  TEMPLETID_XP,
} from '../actionTypes';
const initialState = {
  getTemplateList: [],
  vitalsLabels: {},
  isFetching10: false,
  error: false,
};
const template_reducer = (state = initialState, action) => {
  switch (action.type) {
    case TEMPLET_LOAD:
      return {
        templateList: [],
        isFetching17: true,
        error: false,
      };
    case TEMPLET_XP:
      return {
        ...state,
        templateList: action.data,
        isFetching17: false,
      };
    case TEMPLET_FAIL:
      return {
        ...state,
        isFetching17: false,
        error: true,
      };
    default:
      return state;
  }
};

export default template_reducer;

const initialState2 = {
  getTemplateList: '',
  isFetching10: false,
  error: false,
};

// To store template id for start consultation
const template_store_reducer = (state = initialState2, action) => {
  switch (action.type) {
    case TEMPLETID_XP:
      return {
        ...state,
        templateid: action.data,
        isFetching17: false,
      };
    default:
      return state;
  }
};

export {template_store_reducer};
