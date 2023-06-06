import {getEnvironmentObject} from '../config/Config';

export const getCountryCode = async () => {
  let environment = await getEnvironmentObject();

  return environment?.country_code || '';
};
