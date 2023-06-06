import API from './Api';

export const LoginService = async (payload) => {
  // const response = await API.call('post', 'v1/auth/login/doctor', payload);
  const response = await API.call('post', 'v1/auth/login/non-healpha-user', payload);
  return response;
};
