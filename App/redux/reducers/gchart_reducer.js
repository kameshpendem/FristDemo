import{GCHART_XP,GCHART_LOAD,GCHART_FAIL} from '../actionTypes';
const initialState = {
getGchartList: [],
isFetching10:false,
error:false
};
const gchart_reducer= (state = initialState, action) => {
switch(action.type) {
    case GCHART_LOAD:
    return {
    gchartList:[],
    isFetching29:true,
    error:false

    
    };
    case GCHART_XP:
    return {
        ...state,
        gchartList:action.data,
        isFetching29:false,
    };
    case GCHART_FAIL:
    return {
        ...state,
        isFetching29:false,
        error:true
    };
    default:
return state;
}
}

export default gchart_reducer;