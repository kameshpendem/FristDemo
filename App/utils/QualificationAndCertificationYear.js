export const compareDobAndQualificationYear = (dob, year) => {
  let flag = false;

  var parts = dob.split('-');
  // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  // January - 0, February - 1, etc.
  var newDate = new Date(parts[0], parts[1] - 1, parts[2]);
  let dob_year = newDate.getFullYear();

  if (dob_year > year) {
    return true;
  }
  return flag;
};
