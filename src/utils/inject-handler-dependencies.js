function injectHandlerDependencies(
  handler,
  db,
  handlerToEngineMap,
  generateErrorMessage
) {
  const engine = handlerToEngineMap.get(handler);

  return (req, res) => {
    handler(req, res, db, engine, generateErrorMessage);
  };
}

export default injectHandlerDependencies;
