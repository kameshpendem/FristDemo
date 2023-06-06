import {Toast} from 'native-base';

import {environment as indianEnvironment} from '../environment/ind/environment.ind';
import {environment as sriLankanEnvironment} from '../environment/sl/environment.sl';
import {environment as mexicoEnvironment} from '../environment/mx/environment.mx';
import AuthUtils from '../utils/AuthUtils';

export default function getBaseUrl() {
  return global.country_base_url;
}

export const getApiUrl = () => {
  return global.country_api_url;
};

export const getInstanceType = () => {
  return global.instanceType;
};

export const getDevelopmentUrl = () => {
  return global.country_development_url;
};

export const getTimezone = () => {
  return global.timezone;
};

export const getEnvironmentObject = async () => {
  const countryCode = await AuthUtils.getUserCountry();

  let environment;
  switch (countryCode) {
    case 'in':
      environment = indianEnvironment;
      break;
    case 'sl':
      environment = sriLankanEnvironment;
      break;
    case 'mx':
      environment = mexicoEnvironment;
      break;
  }

  if (environment?.base_url) {
    global.country_base_url = environment.base_url;
    global.country_api_url = environment.API_URL;
    global.instanceType = environment.instanceType;
    global.country_development_url = environment.development_url;
    global.phonecode = environment.country_code;
    global.phone = environment.country_code;
    global.timezone = environment.timezone;
    return environment;
  } else if (countryCode) {
    Toast.show({
      text: 'Instance is not enabled for selected country',
      type: 'warning',
      duration: 6000,
    });
  }
};

export const base_document_url = global.country_api_url+'/';
