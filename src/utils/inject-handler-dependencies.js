function injectHandlerDependencies(
  handler,
  db,
  handlerToEngineMap,
  handlerToValidatorMap,
  ValidationError
) {
  const engine = handlerToEngineMap.get(handler);
  const validator = handlerToValidatorMap
    ? handlerToValidatorMap.get(handler)
    : undefined;

  return (req, res) => {
    handler(req, res, db, engine, validator, ValidationError);
  };
}

export default injectHandlerDependencies;
