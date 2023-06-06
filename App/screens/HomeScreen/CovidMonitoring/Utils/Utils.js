/* eslint-disable radix */
import {Dimensions} from 'react-native';
import moment from 'moment';

export const isPortrait = () => {
  const dim = Dimensions.get('window');
  return dim.height >= dim.width;
};

export function dateFormat(date) {
  if (!date) {
    return '-';
  }

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  date = new Date(moment(date));

  const day = date.getDate(),
    month = monthNames[date.getMonth()],
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes();

  const time =
    hours > 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;

  return `${day}-${month}-${year}' '${time}`;
}

export function calculateAge(dob) {
  dob = new Date(dob);

  let dobMonth = dob.getMonth() + 1;
  let dobDay = dob.getDate() + 1;
  let dobYear = dob.getFullYear();

  const today = new Date();

  let currentDay = today.getDate() + 1;
  let currentMonth = today.getMonth() + 1;
  let currentYear = today.getFullYear();

  if (
    dobMonth === currentMonth &&
    dobDay === currentDay &&
    dobYear === currentYear
  ) {
    dobMonth = dob.getMonth() + 1;
    dobDay = dob.getDate();
    dobYear = dob.getFullYear();
  }

  if (currentMonth < parseInt(dobMonth)) {
    currentMonth += 12;
    currentYear--;
  }

  if (currentDay < parseInt(dobDay)) {
    currentMonth--;
    // currentDay += 30;
  }

  const years = currentYear - parseInt(dobYear),
    months = currentMonth - parseInt(dobMonth);
  // let days = currentDay - parseInt(dobDay);

  return `${years}Y${months}M`;
}

export function calculateYears(dob) {
  dob = new Date(dob);

  let dobMonth = dob.getMonth() + 1;
  let dobDay = dob.getDate() + 1;
  let dobYear = dob.getFullYear();

  const today = new Date();

  let currentDay = today.getDate() + 1;
  let currentMonth = today.getMonth() + 1;
  let currentYear = today.getFullYear();

  if (
    dobMonth === currentMonth &&
    dobDay === currentDay &&
    dobYear === currentYear
  ) {
    dobMonth = dob.getMonth() + 1;
    dobDay = dob.getDate();
    dobYear = dob.getFullYear();
  }

  if (currentMonth < parseInt(dobMonth)) {
    currentMonth += 12;
    currentYear--;
  }

  if (currentDay < parseInt(dobDay)) {
    currentMonth--;
    // currentDay += 30;
  }

  const years = currentYear - parseInt(dobYear),
    months = currentMonth - parseInt(dobMonth);
  // let days = currentDay - parseInt(dobDay);

  return years;
}
