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

function processPath(context, path) {
  const contextPaths = path.match(/:\w+(?=\/?)/g);
  if (!contextPaths) return path;
  for (let i = 0; i < contextPaths.length; i++) {
    path = path.replace(/:\w+(?=\/?)/, context[contextPaths[i]]);
  }

  return path;
}

export {
  getValidPayload,
  convertStringToArray,
  checkIfFieldExist,
  processPath
};
