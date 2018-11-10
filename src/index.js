import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import errorHandler from './middlewares/error-handler';
import createUserHandler from './handlers/users/create';
import injectHandlerDependencies from './utils/inject-handler-dependencies';
import ValidationError from './validators/errors/validation-error';
import createUserEngine from './engines/users/create';

const handlerToEngineMap = new Map([[createUserHandler, createUserEngine]]);

const app = express();

import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOLE}://${
    process.env.ELASTICSEARCH_HOSTNAME
  }:${process.env.ELASTICSEARCH_PORT}`
});

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

app.use(bodyParser.json({ limit: 1e6 }));

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

app.post(
  '/users',
  injectHandlerDependencies(
    createUserHandler,
    client,
    handlerToEngineMap,
    ValidationError
  )
);

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Hobnod API server listening on port ${process.env.SERVER_PORT}!`
  );
});
