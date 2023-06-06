import{TIME_XP,TIME_LOAD,TIME_FAIL} from '../actionTypes';
const initialState = {
getTimeList: [],
isFetching10:false,
error:false
};
const timeline_reducer= (state = initialState, action) => {
switch(action.type) {
    case TIME_LOAD:
    return {
    timeList:[],
    isFetching30:true,
    error:false

    
    };
    case TIME_XP:
    return {
        ...state,
        timeList:action.data,
        isFetching30:false,
    };
    case TIME_FAIL:
    return {
        ...state,
        isFetching30:false,
        error:true
    };
    default:
return state;
}
}

export default timeline_reducer;