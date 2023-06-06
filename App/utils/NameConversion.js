import moment from 'moment';

export const nameConversion = (string) => {
  if (!string) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const practiceTimings = (element) => {
  if (element.mon_start_time && element.sat_end_time) {
    return (
      'Mon to Sat ● ' +
      moment(element.mon_start_time, 'HH:mm').format('LT') +
      ' to ' +
      moment(element.sat_end_time, 'HH:mm').format('LT')
    );
  }

  return '-';
};
