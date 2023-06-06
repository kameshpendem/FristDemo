export const isUpper = (str) => {
  return /[A-Z]/.test(str);
};

export const isLower = (str) => {
  return /[a-z]/.test(str);
};

export const isNumber = (str) => {
  return /[0-9]/.test(str);
};

export const specialCharacter = (str) => {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
};

export const passwordLength = (str) => {
  return str.length >= 8 && str.length <= 16;
};
