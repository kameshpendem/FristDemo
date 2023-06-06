import ApiCall from './ApiCall';
import getBaseUrl from '../config/Config';

export const loginService = async (values) => {
  const getUsersForIdUrl = getBaseUrl() + 'v1/' + 'auth/login/person';
  return ApiCall.post(getUsersForIdUrl, values);
};
