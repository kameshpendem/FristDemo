import moment from 'moment';
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

export function dateFormat(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    // let month = monthNames[dateObject.getMonth()];
    let year = dateObject.getFullYear().toString().substr(-2);
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();

    let time =
      hours > 12
        ? hours - 12 + `:` + `${minutes}` + 'PM'
        : hours + `:` + `${minutes}` + 'AM';

    return day + `/` + month + `/` + year + ' ' + time;
  } else {
    return '-';
  }
}

export function dateDDMMYYYY(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    let day = dateObject.getDate();
    let month = monthNames[dateObject.getMonth()];
    let year = dateObject.getFullYear();

    return day + `-` + month + `-` + year;
  } else {
    return '-';
  }
}

export function dateOfBirthFormat(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    let day = dateObject.getDate();
    let month = monthNames[dateObject.getMonth()];
    let year = dateObject.getFullYear().toString();

    return day + '-' + month + '-' + year;
  } else {
    return '-';
  }
}

export function convert24To12Hrs(date) {
  if (date) {
    return moment(date, 'hh:mm').format('LT');
  }

  return '';
}

export function convert12To24Hrs(date) {
  if (date) {
    return moment(date, 'hh:mm A').format('HH:mm');
  }

  return '';
}

export function dateYYYYMMDD(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear();

    if (month <= 9) {
      month = '0' + month;
    }
    if (day <= 9) {
      day = '0' + day;
    }
    return year + `-` + month + `-` + day;
  } else {
    return '-';
  }
}

export function timeHHMM(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    let hr = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    if (hr <= 9) {
      hr = '0' + hr;
    }
    if (minutes <= 9) {
      minutes = '0' + minutes;
    }

    return hr + `:` + minutes;
  } else {
    return '-';
  }
}

export function timeHHMMSS(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    let hr = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    let seconds = dateObject.getSeconds();
    if (hr <= 9) {
      hr = '0' + hr;
    }
    if (minutes <= 9) {
      minutes = '0' + minutes;
    }

    if (seconds <= 9) {
      seconds = '0' + seconds;
    }

    return hr + `:` + minutes + `:` + seconds;
  }
  return '-';
}

export function YearYYYY(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    return dateObject.getFullYear();
  } else {
    return '';
  }
}

export function dateOfBirthFormatWeb(date) {
  let momentDate = moment(date);
  let dateObject = new Date(momentDate);
  if (dateObject) {
    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear();

    return day + `/` + month + `/` + year;
  } else {
    return '-';
  }
}
