// Defining the initial state for the reducer
const initState = {
    random_values: 10,
  };
  
  export default function(state = initState, action) {
    const {type, payload} = action;
    switch (type) {
      case 'RANDOM_VALUES':
        return {
          ...state,
          random_values: payload,
        };
  
      default:
        return state;
    }
  }
  