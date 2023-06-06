import {NativeModules} from 'react-native';
// const mock = require('../data/input.json');

class ServiceProxy {
  getTemplate() {
    return 'Healpha Template';
  }

  getMockTemplate() {
    return mock;
  }
}

const proxy = new ServiceProxy();
export default proxy;
