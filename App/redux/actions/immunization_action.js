import getBaseUrl from '../../config/Config';
import ApiCall from '../../services/ApiCall';

export const getImmunization = async ({healpha_id, category, search_text}) => {
  try {
    let url =
      getBaseUrl() +
      `v1/person/${healpha_id}/immunization/${category}?search_text=${
        search_text || ''
      }`;
    let res = await ApiCall.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateActualdate = async ({hlp_id, id, actual_date}) => {
  try {
    // let url = getBaseUrl() + `v1/person/${healpha_id}/immunization/${category}`;
    let url = getBaseUrl() + `v1/person/${hlp_id}/immunization/${id}`;
    let res = await ApiCall.put(url, {actual_date});
    return res;
  } catch (error) {
    console.log(error);
  }
};
