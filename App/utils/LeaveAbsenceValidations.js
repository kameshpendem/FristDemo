import i18n from 'i18next';

export const leaveAbsenceValidations = (object) => {
  let validationMessage = '';
  if (!object.leave_type_key) {
    return i18n.t('ABSENCE_LEAVE.PLEASE_SELECT_LEAVE_TYPE');
  }
  const leave_type_key = object.leave_type_key;

  if (leave_type_key === 'change_of_time') {
    if (!object.change_from_date) {
      return i18n.t('ABSENCE_LEAVE.PLEASE_SELECT_FROM_DATE');
    }

    if (!object.change_to_date) {
      return i18n.t('ABSENCE_LEAVE.PLEASE_SELECT_TO_DATE');
    }

    if (!object.change_from_time) {
      return i18n.t('ABSENCE_LEAVE.AVAILABLE_FROM_TIME');
    }
    if (!object.change_to_time) {
      return i18n.t('ABSENCE_LEAVE.AVAILABLE_TO_TIME');
    }
  } else {
    if (!object.from_date) {
      return i18n.t('ABSENCE_LEAVE.PLEASE_SELECT_FROM_DATE');
    }

    if (!object.from_time) {
      return i18n.t('ABSENCE_LEAVE.PLEASE_SELECT_FROM_TIME');
    }
    if (!object.to_date) {
      return i18n.t('ABSENCE_LEAVE.PLEASE_SELECT_TO_DATE');
    }
    if (!object.to_time) {
      return i18n.t('ABSENCE_LEAVE.PLEASE_SELECT_TO_TIME');
    }
  }

  if (!object.reason) {
    return i18n.t('ABSENCE_LEAVE.ENTER_REASON');
  }
  if (!object.contact) {
    return i18n.t('ABSENCE_LEAVE.ENTER_CONTACT_DETAILS');
  }
  return validationMessage;
};
