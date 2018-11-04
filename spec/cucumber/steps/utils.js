function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'e@m.il',
        password: 'password',
      };
    default:
      return undefined;
  }
}

function convertStringToArray(string) {
  return string
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

export { getValidPayload, convertStringToArray };
