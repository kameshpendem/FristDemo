import {Dimensions} from 'react-native';
import {DEVICE_PROPERTIES, DEVICE_TYPES} from '../constants/Device';
const DEV_WIDTH = Dimensions.get('window').width;
const DEV_HEIGHT = Dimensions.get('window').height;

export const getDeviceType = () => {
  switch (true) {
    case DEV_WIDTH <= 375:
      if (DEV_WIDTH <= 360) {
        return DEVICE_TYPES.SM_BASE_MOB;
      } else {
        // The device dimension for which style specs are created.
        return DEVICE_TYPES.BASE_MOB;
      }
    case DEV_WIDTH <= 400:
      return DEVICE_TYPES.MD_BASE_MOB;
    case DEV_WIDTH <= 412 && DEV_HEIGHT <= 870:
      return DEVICE_TYPES.LG_BASE_MOB;
    case DEV_WIDTH <= 414 && DEV_HEIGHT <= 896:
      return DEVICE_TYPES.XL_BASE_MOB;
    default:
      // If none of the above is satisfied for some weird reason!
      if (DEV_HEIGHT <= 870) {
        return DEVICE_TYPES.LG_BASE_MOB;
      }
      return DEVICE_TYPES.XL_BASE_MOB;
  }
};

export const getDeviceSpecsForTheme = () => {
  const deviceType = getDeviceType();
  const properties = DEVICE_PROPERTIES[deviceType];
  return {
    sideMargin: properties.sideMargin,
    gutterWidth: properties.gutterWidth,
    columnWidth: properties.columnWidth,
    fontFactor: properties.fontFactor,
  };
};

export const fontFactor = () => {
  switch (getDeviceType()) {
    case DEVICE_TYPES.SM_BASE_MOB:
      return DEVICE_PROPERTIES[DEVICE_TYPES.SM_BASE_MOB].fontFactor;
    case DEVICE_TYPES.MD_BASE_MOB:
      return DEVICE_PROPERTIES[DEVICE_TYPES.MD_BASE_MOB].fontFactor;
    case DEVICE_TYPES.LG_BASE_MOB:
      return DEVICE_PROPERTIES[DEVICE_TYPES.LG_BASE_MOB].fontFactor;
    case DEVICE_TYPES.XL_BASE_MOB:
      return DEVICE_PROPERTIES[DEVICE_TYPES.XL_BASE_MOB].fontFactor;
    default:
      return DEVICE_PROPERTIES[DEVICE_TYPES.BASE_MOB].fontFactor;
  }
};
