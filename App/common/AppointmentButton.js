import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const AppointmentButton = ({onPress, buttonName}) => {
  const {buttonContainer, buttonText} = styles;
  return (
    <TouchableOpacity style={buttonContainer} onPress={onPress}>
      <Text style={buttonText}>{buttonName}</Text>
    </TouchableOpacity>
  );
};
const styles = {
  // buttonContainer: {
  //     backgroundColor: APP_PRIMARY_COLOR,
  //     paddingVertical: 10,
  //     marginHorizontal:5,
  //     marginVertical:10,
  //     paddingHorizontal:10
  //     },
  buttonContainer: {
    // flex: 1,
    backgroundColor: 'white',
    marginLeft: 5,
    marginRight: 5,
    paddingVertical: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#345D7E',
    borderWidth: 1,
    borderRadius: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#345D7E',
    fontWeight: '700',
  },
};

export {AppointmentButton};
