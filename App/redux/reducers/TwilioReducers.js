// Defining the initial state for the reducer
const initState = {
  twilio_connection: false,
};

export default function (state = initState, action) {
  const {type, payload} = action;
  switch (type) {
    case 'TWILIO_CONNECTION':
      return {
        ...state,
        twilio_connection: payload.twilio_connection_flag,
      };

    default:
      return state;
  }
}
