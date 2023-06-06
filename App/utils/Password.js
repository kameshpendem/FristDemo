import i18n from "../../i18n";

function isUpper(str) {
  return /[A-Z]/.test(str);
}

function isLower(str) {
  return /[a-z]/.test(str);
}

function specialCharacter(str) {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
}

export const checkPasswordSpecifications = (text) => {
  const passwordObject = {
    flag: false,
    message: '',
  };
  if (!text) {
    return flag;
  }

  if (text.length < 8 || text.length > 16) {
    passwordObject.flag = true;
    passwordObject.message = i18n.t('DEVICES.PASSWORD_8TO16');
    return passwordObject;
  }

  if (!isUpper(text)) {
    passwordObject.flag = true;
    passwordObject.message = i18n.t('DEVICES.PASSWORD_ONE_UPPERCASE');
    return passwordObject;
  }

  if (!isLower(text)) {
    passwordObject.flag = true;
    passwordObject.message = i18n.t('DEVICES.PASSWORD_ONE_LOWERCASE');
    return passwordObject;
  }

  if (!specialCharacter(text)) {
    passwordObject.flag = true;
    passwordObject.message =
    i18n.t('DEVICES.PASSWORD_SPECIAL');
    return passwordObject;
  }

  return passwordObject;
};
