function isEmpty(object) {
  for (const property in object) {
    return false;
  }
  return true;
}

export { isEmpty };
