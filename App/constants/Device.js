export const DEVICE_TYPES = {
  SM_BASE_MOB: 'SM_BASE_MOB',
  BASE_MOB: 'BASE_MOB',
  MD_BASE_MOB: 'MD_BASE_MOB',
  LG_BASE_MOB: 'LG_BASE_MOB',
  XL_BASE_MOB: 'XL_BASE_MOB',
};

export const DEVICE_PROPERTIES = {
  [DEVICE_TYPES.SM_BASE_MOB]: {
    width: 360,
    height: 740,
    gutterWidth: 15,
    columnWidth: 26,
    sideMargin: 12,
    fontFactor: -1,
  },
  [DEVICE_TYPES.BASE_MOB]: {
    width: 375,
    height: 812,
    gutterWidth: 15,
    columnWidth: 28,
    sideMargin: 13,
    fontFactor: -1,
  },
  [DEVICE_TYPES.MD_BASE_MOB]: {
    width: 393,
    height: 851,
    gutterWidth: 15,
    columnWidth: 30,
    sideMargin: 14,
    fontFactor: 0,
  },
  [DEVICE_TYPES.LG_BASE_MOB]: {
    width: 412,
    height: 870,
    gutterWidth: 15,
    columnWidth: 32,
    sideMargin: 15,
    fontFactor: 0,
  },
  [DEVICE_TYPES.XL_BASE_MOB]: {
    width: 414,
    height: 896,
    gutterWidth: 15,
    columnWidth: 32,
    sideMargin: 26,
    fontFactor: 0,
  },
};

export const SPEC_DESIGN_DIMENSIONS = {
  SPEC_DESIGN_BASE_WIDTH: 412,
  SPEC_DESIGN_BASE_HEIGHT: 870,
};
