import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import getBaseUrl from '../config/Config';

async function getApiHeaders() {
  const token = await AsyncStorage.getItem('jwt_token');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

export const getDoctorApprovedPracticeList = async (doc_id) => {
  const url = getBaseUrl() + `v1/doctor/${doc_id}/approved-practices`;
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response?.data;
};

export const getDoctorDeclinedList = async (doc_id) => {
  const url = getBaseUrl() + `v1/doctor/${doc_id}/declined-practices`;
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response?.data;
};

export const getDoctorNewPracticeList = async (doc_id) => {
  const url = getBaseUrl() + `v1/doctor/${doc_id}/new-request-practices`;
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response?.data;
};

export const acceptNewPractice = async (doc_id, work_timings_id, payload) => {
  const url =
    getBaseUrl() + `v1/doctor/${doc_id}/accept-new-practice/${work_timings_id}`;
  const headers = await getApiHeaders();

  const response = await axios.put(url, payload, {headers: headers});

  return response.data;
};

export const declineNewPractice = async (doc_id, work_timings_id, payload) => {
  const url =
    getBaseUrl() +
    `v1/doctor/${doc_id}/decline-new-practice/${work_timings_id}`;
  const headers = await getApiHeaders();

  const response = await axios.put(url, payload, {headers: headers});

  return response.data;
};

export const consultationFees = async (doc_id, branch_id) => {
  const url =
    getBaseUrl() + `v1/doctor/${doc_id}/branch/${branch_id}/consultation-fees`;
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response.data;
};

export const setConsultationFees = async (
  doc_id,
  branch_id,
  price_list_id,
  payload,
) => {
  const url =
    getBaseUrl() +
    `v1/doctor/${doc_id}/branch/${branch_id}/consultation-fees/${price_list_id}`;
  const headers = await getApiHeaders();

  const response = await axios.put(url, payload, {headers: headers});

  return response.data;
};

export const getSessionsOfBranch = async (doc_id, branch_id) => {
  const url =
    // getBaseUrl() + `v1/doctor/${doc_id}/branch/${branch_id}/practice-timings`;
    getBaseUrl() + `v1/doctor/${doc_id}/session-timing?branch_id=${branch_id}`;
  const headers = await getApiHeaders();
  const response = await axios.get(url, {headers: headers});

  return response.data;
};

export const updateSessionTimings = async (
  doc_id,
  branch_id,
  weekly_timing_id,
  payload,
) => {
  const url =
    getBaseUrl() +
    // `v1/doctor/${doc_id}/branch/${branch_id}/practice-timings/${weekly_timing_id}`;
    `v1/doctor/${doc_id}/session-timing/${weekly_timing_id}`;
  const headers = await getApiHeaders();

  const response = await axios.put(url, payload, {headers: headers});

  return response.data;
};

export const getSessionTimings = async (session_id, weekly_timing_id, day) => {
  const url =
    getBaseUrl() + `v1/doctor/session/${session_id}/${day}/${weekly_timing_id}`;
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response.data;
};

export const doctorAbsentAndLeaves = async (doctor_id) => {
  const url = getBaseUrl() + `v1/doctor/${doctor_id}/absent-leave`;
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response.data;
};

export const createAppointments = async (payload) => {
  const url = getBaseUrl() + `v1/doctor/${payload?.doctor_id}/absent-leave`;
  const headers = await getApiHeaders();

  const response = await axios.post(url, payload, {headers: headers});

  return response.data;
};

export const cancelAppointments = async (payload) => {
  const url = getBaseUrl() + `appointment_cancel`;
  const headers = await getApiHeaders();

  const response = await axios.post(url, payload, {headers: headers});

  return response.data;
};

export const getDoctorAvailableSlots = async (date, doctor_id, branch_id) => {
  const url =
    getBaseUrl() +
    `v1/public/doctor/${doctor_id}/branch/${branch_id}/appointment/available-timings?date=${date}`;
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response.data;
};

export const rescheduleDoctorAppointment = async (payload) => {
  const url = getBaseUrl() + 'reschedule';
  const headers = await getApiHeaders();

  const response = await axios.post(url, payload, {headers: headers});

  return response.data;
};

export const getAllVirtualClinicUsers = async (url) => {
  const headers = await getApiHeaders();

  const response = await axios.get(url, {headers: headers});

  return response.data;
};

export const sendNotificationToVirtualClinicUsers = async (url, payload) => {
  const headers = await getApiHeaders();

  const response = await axios.post(url, payload, {headers: headers});

  return response.data;
};

export const getAppointmentTypes = async (branch_id, practice_id, doc_id) => {
  const url =
    getBaseUrl() + `v1/doctor/${doc_id}/practice/${practice_id}/branch/${branch_id}/appointment-prices`;
  const headers = await getApiHeaders();
  const response = await axios.get(url, {headers: headers});

  return response.data;
};