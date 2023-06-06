import axios from 'axios';
import ApiCall from './ApiCall';
import getBaseUrl from '../config/Config';

export const getUsersForAccountService = async (params) => {
  const getUsersForIdUrl = getBaseUrl() + 'v1/' + 'public/person/all-users';
  return await ApiCall.get(
    `${getUsersForIdUrl}?phone_number=${params.phoneNumber}`,
  );
};

// Do no replicate or use this function anywhere else, only meant for use while login
// This will be changed
export const getUserByIdForLoginService = async (params) => {
  try {
    const getUserByIdUrl = getBaseUrl() + 'v1/' + 'person';
    const response = await axios.get(`${getUserByIdUrl}/${params.personId}`, {
      headers: {
        Authorization: 'Bearer' + ' ' + params.token,
      },
    });
    return response.data;
  } catch (err) {
    if (err && err.response && err.response.data) {
      throw err.response.data;
    } else {
      throw err;
    }
  }
};
