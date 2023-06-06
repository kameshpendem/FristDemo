import AsyncStorage from '@react-native-community/async-storage';
import getBaseUrl from '../../config/Config';
import ApiCall from '../../services/ApiCall';
import {PATIENT_XP, PATIENT_LOAD} from '../actionTypes';
async function getApiHeaders() {
  const token = await AsyncStorage.getItem('jwt_token');
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return headers;
}

export const fetchLoadingPatient = () => {
  return {
    type: PATIENT_LOAD,
  };
};

export const getAppointmentsCount = async variables => {
  let body = {
    appointment_checked: variables.appointment_checked,
    search_text: variables.search_text,
  };
  let url =
    getBaseUrl() +
    `v1/appointment/status/all?doctor_id=${variables.doctor_id}&branch_id=${variables.branch_id}&date=${variables.date}`;
  // `v1/appointment/doctor/${variables.doctor_id}/branch/${variables.branch_id}/appointment-status/${variables.date}`;

  let res = await ApiCall.get(url, body);

  return res.data;
};

export const getAppointmentsList = async variables => {
  let body = {
    appointment_checked: variables.appointment_checked,
    search_text: variables.search_text,
  };
  let url =
    getBaseUrl() +
    `v1/appointment/list/all?date=${variables.date}&branch_id=${variables.branch_id}&doctor_id=${variables.doctor_id}&appointment_checked=${variables.appointment_checked}&search_text=${variables.search_text}&limit=${variables.limit}&offset=${variables.offset}`;
  // `v1/appointment/doctor/${variables.doctor_id}/branch/${variables.branch_id}/appointment-details/${variables.date}?appointment_checked=${variables.appointment_checked}&search_text=${variables.search_text}`;
  let res = await ApiCall.get(url, body);

  return res.data;
};

export const fetchPatientSuccess = data => {
  return {
    data: data,
    type: PATIENT_XP,
  };
};

export const getPatient = variables => {
  let body = {branch_id: variables.branch_id};
  return function (dispatch) {
    // dispatch(fetchLoadingPatient());
    let url =
      getBaseUrl() +
      `v1/appointment/${variables.id}?branch_id=${variables.branch_id}`;
    return ApiCall.get(url, body)
      .then(res => {
        // console.log(JSON.stringify(res), 'from appointment actions');
        dispatch(fetchPatientSuccess(res?.data?.person_appointment_details));
        return res.data;
      })
      .catch(res => {
        return res;
      });
  };
};

// export const getPatient = async (variables) => {
//   let body = {id: variables.id};
//   let url =
//     getBaseUrl() +
//     `v1/appointment/doctor/${variables.doctor_id}/branch/${variables.branch_id}/person-appointment/${variables.date}`;
//   let res = await ApiCall.get(url, body);
//   return res.data;
// };

export const getAppointmnetsLogs = async variables => {
  let url =
    getBaseUrl() +
    `v1/appointment/doctor/${variables.doc_id}/person/${variables.healphaId}/logs/${variables.userId}`;

  let res = await ApiCall.get(url);
  return res.data;
};

export const getExistingUsers = async variables => {
  let url =
    getBaseUrl() + `v1/public/person/all-users?phone_number=${variables}`;
  let res = await ApiCall.get(url);
  return res.data;
};

export const sendOTP = async ({phone_code, phone_number, email,first_name,last_name}) => {
  let url = getBaseUrl() + `v1/auth/send-otp`;

  //console.log(url, JSON.stringify({ phone_code, phone_number }));

  let res = await ApiCall.post(url, {phone_code, phone_number, email,first_name,last_name});

  return res;
};
export const verifyOTP = async ({phone_code, phone_number, code}) => {
  let url = getBaseUrl() + `v1/auth/verify-otp`;
  let res = await ApiCall.post(url, {phone_code, phone_number, code});
  return res;
};
export const createPerson = async ({
  first_name,
  last_name,
  phone_code,
  phone_number,
  email,
  dob,
  gender,
  salutation,
  relation,
  family_head_id,
  doctor_id,
  branch_id,
}) => {
  let url = getBaseUrl() + `v1/person/create`;
  const headers = await getApiHeaders();
  let res = await ApiCall.post(url, {
    first_name,
    last_name,
    phone_code,
    phone_number,
    email,
    dob,
    gender,
    salutation,
    relation,
    family_head_id,
    doctor_id,
    branch_id,
  },{headers:headers});

  return res;
};

export const searchPatient = async val => {
  let url = getBaseUrl() + `v1/reference-data/patients/all?search_text=${val}`;
  console.log(url, 'searchPatient');
  let res = ApiCall.get(url);
  return res;
};

export const unavailablePatient = async variables => {
  let body = {
    comment: variables.comment,
    is_appointment_cancelled: variables.cancelled,
    appointment_id: variables.appointment_id,
  };
  let url =
    getBaseUrl() +
    `v1/appointment/encounter/${variables.enc_id}/doctor/${variables.doc_id}/person/${variables.healphaId}/comment/${variables.type}`;

  let res = await ApiCall.post(url, body);

  return res;
};

export const getOptions = async () => {
  let url = getBaseUrl() + `v1/reference-data/patient-unavailable-options`;

  let res = await ApiCall.get(url);

  return res;
};

export const createAppointment = async (hlpid, payload) => {
  let url = getBaseUrl() + `v1/person/${hlpid}/book-appointment`;

  let res = await ApiCall.post(url, payload);

  return res;
};

export const generateEncounter = async ({appointment_id}, payload) => {
  let url = getBaseUrl() + `v1/appointment/${appointment_id}/encounter/create`;

  let res = await ApiCall.post(url, payload);

  return res;
};
