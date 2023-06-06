import{CHANGE_TAB_SUCCESS} from '../actionTypes';
const initialState = {
changetab: "",
};
export const change_tab_reducer= (state = initialState, action) => {
switch(action.type) {
    case CHANGE_TAB_SUCCESS:
        return {
            ...state,
            changetab:action.data,
            //isFetching22:false,
        };
    default:
return state;
}
}

