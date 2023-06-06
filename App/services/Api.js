import axios from 'axios';
import getBaseUrl from '../config/Config';
//const base_url = "https://test.healpha.com/api/";
//   export const call= async (method, path, data) => {
//     const response = await axios[method](`${base_url}/${path}`, data);
//     return response.data;
//   };

export const call = async (method, path, data) => {
  console.log("method",method,getBaseUrl()+path,data)
  const response = await axios[method](getBaseUrl() + path, data);
  return response.data;
};
export default {call};
