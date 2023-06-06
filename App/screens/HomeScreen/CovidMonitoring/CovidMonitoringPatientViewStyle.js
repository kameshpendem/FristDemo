import {StyleSheet} from 'react-native';

import {
  DEFAULT_WHITE_COLOR,
  APP_PRIMARY_COLOR,
  DEFAULT_GREY_COLOR,
} from '../../../themes/variable';

export default StyleSheet.create({
  tabStyle: {
    backgroundColor: APP_PRIMARY_COLOR,
  },
  textStyle: {
    color: DEFAULT_WHITE_COLOR,
  },
  detailsView: {
    flexDirection: 'row',
    padding: 15,
  },
  detailsLeftView: {
    flex: 6,
  },
  eachDetailView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eachDetailLabel: {
    flex: 2,
    fontWeight: 'bold',
  },
  eachDetailValue: {
    flex: 4,
    textTransform: 'capitalize',
  },
  ageValue: {
    textTransform: 'uppercase',
  },
  visitIdValue: {
    textTransform: 'uppercase',
  },
  eachDetailIcon: {
    marginRight: 15,
  },
  popoverMenuView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  popoverMenuItem: {
    padding: 10,
  },
  confirmButtons: {
    backgroundColor: DEFAULT_WHITE_COLOR,
    margin: 10,
    padding: 10,
  },
  callModal: {
    height: '25%',
    marginTop: 'auto',
    backgroundColor: DEFAULT_WHITE_COLOR,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    shadowColor: DEFAULT_WHITE_COLOR,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderColor: DEFAULT_GREY_COLOR,
  },

  callModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  callOption: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    marginLeft: 0,
    marginBottom: 10,
  },
  callIcons: {
    marginRight: 20,
  },
  modalMargins: {
    padding: 0,
    margin: 0,
  },
  closeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIconStyles: {
    height: 18,
    width: 18,
  },
  callOptionStyles: {
    height: 22,
    width: 22,
  },
});
