import AsyncStorage from '@react-native-community/async-storage';

class Storage {
  static KEYS = {
    USER_COUNTRY: 'USER_COUNTRY',
  };

  static setItem = (key, value) => {
    AsyncStorage.setItem(key, value);
  };

  static getItem = async (key) => {
    return AsyncStorage.getItem(key);
  };

  static removeItem = (key) => {
    AsyncStorage.removeItem(key);
  };

  static clear = () => {
    AsyncStorage.clear();
  };
}

export default Storage;
