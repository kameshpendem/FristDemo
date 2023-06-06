import{CHANGE_XP,CHANGE_LOAD,CHANGE_FAIL} from '../actionTypes';
const initialState = {
getChangeList: [],
isFetching3:false,
error:false
};
const change_reducer= (state = initialState, action) => {
switch(action.type) {
    case CHANGE_LOAD:
    return {
    changeList:[],
    isFetching3:true,
    error:false

    
    };
    case CHANGE_XP:
    return {
        ...state,
        changeList:action.data,
        isFetching3:false,
    };
    case CHANGE_FAIL:
    return {
        ...state,
        isFetching3:false,
        error:true
    };
    default:
return state;
}
}

export default change_reducer;