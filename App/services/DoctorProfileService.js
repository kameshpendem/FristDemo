import axios from 'axios';
import ApiCall from './ApiCall';
import getBaseUrl from '../config/Config';

import AsyncStorage from '@react-native-community/async-storage';

async function getApiHeaders() {
  const token = await AsyncStorage.getItem('jwt_token');
  const doctorId = await AsyncStorage.getItem('doctorid');
  const headers = {
    Authorization: 'Bearer' + ' ' + token,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return headers;
}

// put api method

export const doctorPutMethod = async (payload) => {
  const doctorId = await AsyncStorage.getItem('doctorid');
  const doctorPutMethodUrl = getBaseUrl() + 'v1/doctor/' + doctorId;
  const headers = await getApiHeaders();

  return await axios.put(doctorPutMethodUrl, payload, {
    headers: headers,
  });
};
// get method api
export const doctorGetMethod = async () => {
  const doctorId = await AsyncStorage.getItem('doctorid');
  const doctorGetMethodUrl = getBaseUrl() + 'v1/public/doctor/' + doctorId;
  const headers = await getApiHeaders();

  return await axios.get(doctorGetMethodUrl, {
    headers: headers,
  });
};
