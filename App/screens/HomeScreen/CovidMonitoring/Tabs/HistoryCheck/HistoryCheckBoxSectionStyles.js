import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  temperatureInputFiledWrapper: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 5,
  },

  input: {
    fontSize: 14,
    opacity: 0.5,
  },
  inputSectionHeightAndWidth: {
    height: 20,
    width: 25,
  },
  inputFiledSection: {
    width: '80%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderColor: 'purple',
    borderRadius: 2,
  },
  itemsCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  marginRight: {
    marginRight: 10,
  },
});
