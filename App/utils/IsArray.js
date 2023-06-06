function isArray(what) {
  return Object.prototype.toString.call(what) === '[object Array]';
}
export default isArray;
