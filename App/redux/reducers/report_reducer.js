import{REPORT_XP,REPORT_LOAD,REPORT_FAIL} from '../actionTypes';
const initialState = {
getReportList: [],
isFetching10:false,
error:false
};
const report_reducer= (state = initialState, action) => {
switch(action.type) {
    case REPORT_LOAD:
    return {
    reportList:[],
    isFetching16:true,
    error:false

    
    };
    case REPORT_XP:
    return {
        ...state,
        reportList:action.data,
        isFetching16:false,
    };
    case REPORT_FAIL:
    return {
        ...state,
        isFetching16:false,
        error:true
    };
    default:
return state;
}
}

export default report_reducer;