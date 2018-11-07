class ValidatorError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidatorError);
    }
  }
}

export default ValidatorError;
