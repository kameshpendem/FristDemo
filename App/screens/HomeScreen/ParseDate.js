export default parseDate = (rawDate) => {
    let hours;
    let day;
    let month;

    if (rawDate.getHours().toString().length === 1) {
        hours = `0${rawDate.getHours()}`;
    } else {
        hours = `${rawDate.getHours()}`;
    }

    if (rawDate.getDate().toString().length === 1) {
        day = `0${rawDate.getDate()}`;
    } else {
        day = `${rawDate.getDate()}`;
    }

    if (rawDate.getMonth().toString().length === 1) {
        month = `0${rawDate.getMonth() + 1}`;
    } else {
        month = `${rawDate.getMonth() + 1}`;
    }
    console.log("min="+rawDate.getMinutes());

    return `${day}-${month}-${rawDate.getFullYear()} ${hours}:${rawDate.getMinutes()}:${rawDate.getSeconds()}`;
};