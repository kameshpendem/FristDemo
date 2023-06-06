import {NURSING_XP} from '../actionTypes';
const initialState = {
  nursing: [],
};
const Nursing_reducer = (state = initialState, action) => {
  switch (action.type) {
    case NURSING_XP:
      console.log(action.data, 'Hello');
      return {
        nursing: action.data,
      };

    default:
      return state;
  }
};

export {Nursing_reducer};
