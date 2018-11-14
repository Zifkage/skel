function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'nazif@bara.il',
        password: 'password'
      };
    default:
      return undefined;
  }
}

function convertStringToArray(string) {
  return string
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');
}

function checkIfFieldExist(object, fields) {
  let exist = false;
  fields.forEach(field => {
    exist = object[field] ? true : false;
  });

  return exist;
}

export { getValidPayload, convertStringToArray, checkIfFieldExist };
