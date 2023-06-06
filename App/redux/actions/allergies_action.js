import getBaseUrl from "../../config/Config";
import ApiCall from "../../services/ApiCall";

export const postAllergies = async (payload) => {
  try {
    let url = getBaseUrl() + `v1/person/allergies`;
    let res = await ApiCall.post(url, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateAllergies = async (payload) => {
  console.log(payload, "hello");

  try {
    let url = getBaseUrl() + `v1/person/allergies/${payload.allergies_id}`;
    let res = await ApiCall.put(url, payload);
    return res;
  } catch (error) {
    console.log(error, "eroorrrr");
  }
};
export const updateFamilyHistory = async (payload) => {
  try {
    let url = getBaseUrl() + `v1/person/family-history/${payload.family_id}`;
    let res = await ApiCall.put(url, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const updateHealthEvent = async (payload) => {
  try {
    let url =
      getBaseUrl() +
      `v1/person/${payload.healpha_id}/health-event/${payload.event_id}`;
    let res = await ApiCall.put(url, payload);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const getAllergyTypes = async () => {
  try {
    let url = getBaseUrl() + `v1/reference-data/allergy-types`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getAllergies = async ({ healpha_id }) => {
  try {
    let url = getBaseUrl() + `v1/person/allergies-by/${healpha_id}`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getHealthEvents = async ({ healpha_id }) => {
  try {
    let url = getBaseUrl() + `v1/person/health-event-by/${healpha_id}`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getFamilyHistoryDetails = async ({ healpha_id }) => {
  try {
    let url = getBaseUrl() + `v1/person/family-history-by/${healpha_id}`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteAllergies = async ({ allergies_id }) => {
  try {
    let url = getBaseUrl() + `v1/person/allergies/${allergies_id}`;
    let res = await ApiCall.delete(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteHealthEvent = async ({ event_id }) => {
  try {
    let url = getBaseUrl() + `v1/person/health-event/${event_id}`;
    let res = await ApiCall.delete(url);

    console.log(res, "deleteHealthEvent");

    return res;
  } catch (error) {
    return error;
  }
};
export const deleteFamilyHistory = async ({ family_id }) => {
  try {
    let url = getBaseUrl() + `v1/person/family-history/${family_id}`;
    let res = await ApiCall.delete(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getHealthEventsTypes = async () => {
  try {
    let url = getBaseUrl() + `v1/reference-data/health-event-types`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getSeverityTypes = async () => {
  try {
    let url = getBaseUrl() + `v1/reference-data/severity-types`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const PostHealthEvents = async (payload) => {
  try {
    let url = getBaseUrl() + `v1/person/${payload.healpha_id}/health-event`;
    let res = await ApiCall.post(url, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const postRelationship = async (payload) => {
  try {
    let url = getBaseUrl() + `v1/person/family-history`;
    let res = await ApiCall.post(url, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getRelationshipTypes = async () => {
  try {
    let url = getBaseUrl() + `v1/reference-data/relationship-types`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
