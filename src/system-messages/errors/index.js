function generateErrorMessage(error) {
  if (error.name === 'ValidationError') {
    return error.message
      .split(':')
      .pop()
      .trim();
  }

  // duplicate key error code
  if (error.code === 11000) {
    const field = error.errmsg
      .split(':')[1]
      .trim()
      .split('$')
      .pop()
      .split('_')[0];
    return `${field} already exist`;
  }

  return 'Tis object is invalid';
}

export default generateErrorMessage;
