import{UPDATEMS_XP,UPDATEMS_LOAD,UPDATEMS_FAIL} from '../actionTypes';
const initialState = {
getUpdatemsList: [],
isFetching102:false,
error:false
};
const updatems_reducer= (state = initialState, action) => {
switch(action.type) {
case UPDATEMS_LOAD:
return {
updatemsList:[],
isFetching10:true,
error:false


};
case UPDATEMS_XP:
return {
...state,
updatemsList:action.data,
isFetching102:false,
};
case UPDATEMS_FAIL:
return {
...state,
isFetching102:false,
error:true
};
default:
return state;
}
}

export default updatems_reducer;