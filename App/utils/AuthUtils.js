import Storage from './Storage';

class AuthUtils {
  static getUserCountry() {
    return Storage.getItem(Storage.KEYS.USER_COUNTRY);
  }

  static setUserCountry(country) {
    Storage.setItem(Storage.KEYS.USER_COUNTRY, country);
  }

  static clearUserCountry() {
    Storage.removeItem(Storage.KEYS.USER_COUNTRY);
  }
}

export default AuthUtils;
