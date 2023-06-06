import axios from 'axios';
import getBaseUrl from '../config/Config';

async function getApiHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

export const getAndVerifyForgotPasswordOTp = async (payload) => {
  const url = getBaseUrl() + `v1/auth/forgot-password`;
  const headers = await getApiHeaders();
  const response = await axios.post(url, payload, {headers: headers});
  return response?.data;
};

export const createNewPassword = async (payload) => {
  const url = getBaseUrl() + `v1/auth/create-password`;
  const headers = await getApiHeaders();
  const response = await axios.put(url, payload, {headers: headers});
  return response?.data;
};
