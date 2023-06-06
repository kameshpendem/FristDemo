import {
  widthPercentageToDP as wp2dp,
  heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';

import {fontFactor} from '../utils/DeviceUtils';
import {SPEC_DESIGN_DIMENSIONS} from '../constants/Device';
/**
 * Width-Percentage
 * Converts width dimension to percentage
 * Based on the dimensions used for spec design creation
 * @param dimension directly taken from design wireframes
 * @returns {string} percentage string e.g. '25%'
 * Uses - [for margins, paddings, width, minWidth]
 */
export const wp = (dimension) => {
  return wp2dp(
    (dimension / SPEC_DESIGN_DIMENSIONS.SPEC_DESIGN_BASE_WIDTH) * 100 + '%',
  );
};

/**
 * Height-Percentage
 * Converts width dimension to percentage
 * * Based on the dimensions used for spec design creation
 * @param dimension directly taken from design wireframes
 * @returns {string} percentage string e.g. '25%'
 * Uses - [for height, minHeight]
 */
export const hp = (dimension) => {
  return hp2dp(
    (dimension / SPEC_DESIGN_DIMENSIONS.SPEC_DESIGN_BASE_HEIGHT) * 100 + '%',
  );
};

// Used for line height
export const lh = (dimension) => {
  return dimension + fontFactor();
};
