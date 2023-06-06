export const RandomValues = random_values_flag => async dispatch => {
    dispatch({type: 'RANDOM_VALUES', payload: random_values_flag});
  };
