import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert';
import db from '../../../src/models';
import mongoose from 'mongoose';

import {
  getValidPayload,
  convertStringToArray,
  checkIfFieldExist,
  processPath
} from './utils';

mongoose.Promise = global.Promise;
mongoose.connect(
  `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_USER}:${
    process.env.MONGODB_PASSWORD
  }@${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${
    process.env.MONGODB_DBNAME
  }`,
  { useNewUrlParser: true }
);

When(
  /^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/,
  function(method, path) {
    const processedPath = processPath(this.context, path);
    this.request = superagent(
      method,
      `${process.env.SERVER_HOSTNAME}:${
        process.env.SERVER_PORT
      }${processedPath}`
    );
  }
);

When(/^attaches a generic (.+) payload$/, function(payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{"email": "dan@danyl.com", name: }')
        .set('Content-Type', 'application/json');
      break;
    case 'non-JSON':
      this.request
        .send(
          '<?xml version="1.0" encoding="UTF-8" ?><email>dan@danyll.com</email>'
        )
        .set('Content-Type', 'text/xml');
      break;
    case 'empty':
    default:
  }
});

When(/^sends the request$/, { timeout: 80 * 1000 }, function(callback) {
  this.request
    .then(response => {
      this.response = response.res;
      callback();
    })
    .catch(errResponse => {
      this.response = errResponse.response;
      callback();
    });
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function(
  statusCode
) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/, function(
  payloadType
) {
  // Check Content-Type header
  const contentType =
    this.response.headers['Content-Type'] ||
    this.response.headers['content-type'];

  if (payloadType === 'JSON object') {
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response not of Content-Type application/json');
    }

    try {
      this.responsePayload = JSON.parse(this.response.text);
    } catch (e) {
      throw new Error('Response not a valid JSON object');
    }
  } else if (payloadType === 'string') {
    if (!contentType || !contentType.includes('text/plain')) {
      throw new Error('Response not of Content-Type text/plain');
    }

    this.responsePayload = this.response.text;
    if (typeof this.responsePayload !== 'string') {
      throw new Error('Response is not a string');
    }
  }
});

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function(
  message
) {
  assert.equal(this.responsePayload.message, message);
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function(headerName) {
  this.request.unset(headerName);
});

When(
  /^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/,
  function(payloadType, missingFields) {
    this.requestPayload = getValidPayload(payloadType);

    const fieldsToDelete = convertStringToArray(missingFields);

    fieldsToDelete.forEach(field => delete this.requestPayload[field]);
    this.request
      .send(JSON.stringify(this.requestPayload))
      .set('Content-Type', 'application/json');
  }
);

When(
  /^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/,
  function(payloadType, fields, invert, type) {
    this.requestPayload = getValidPayload(payloadType);

    const typeKey = type.toLowerCase();
    const invertKey = invert ? 'not' : 'is';
    const sampleValues = {
      string: {
        is: 'string',
        not: 10
      }
    };
    const fieldsToModify = convertStringToArray(fields);
    fieldsToModify.forEach(field => {
      this.requestPayload[field] = sampleValues[typeKey][invertKey];
    });
    this.request
      .send(JSON.stringify(this.requestPayload))
      .set('Content-Type', 'application/json');
  }
);

When(
  /^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/,
  function(payloadType, fields, value) {
    this.requestPayload = getValidPayload(payloadType);

    const fieldsToModify = convertStringToArray(fields);
    fieldsToModify.forEach(field => {
      this.requestPayload[field] = value;
    });
    this.request
      .send(JSON.stringify(this.requestPayload))
      .set('Content-Type', 'application/json');
  }
);

When(/^attaches a valid (.+) payload$/, function(payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

Then(/^the payload object should be added to the database$/, function(
  callback
) {
  db.User.findById(this.responsePayload)
    .then(result => {
      assert.deepEqual(String(result._id), this.responsePayload);
      callback();
    })
    .catch(callback);
});

Then('the newly-created user should be deleted', function(callback) {
  db.User.deleteOne({ _id: this.responsePayload })
    .then(function(result) {
      assert.equal(result.n, 1);
      callback();
    })
    .catch(callback);
});

When(/^attaches (.+) as the payload$/, function(payload) {
  this.requestPayload = JSON.parse(payload);
  this.request.send(payload).set('Content-Type', 'application/json');
});

When(/^the client request for user type payload by ID$/, function(callback) {
  this.requestPayload = getValidPayload('create user');
  this.request = superagent(
    'POST',
    `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/users`
  );

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json')
    .then(response => {
      const responsePayload = response.res.text;
      this.request = superagent(
        'GET',
        `${process.env.SERVER_HOSTNAME}:${
          process.env.SERVER_PORT
        }/users/${responsePayload}`
      );
      callback();
    })
    .catch(err => {
      throw err;
    });
});

Then(/^should not contain the ([a-zA-Z0-9, ]+) fields?$/, function(fields) {
  fields = convertStringToArray(fields);
  const fieldsExist = checkIfFieldExist(this.responsePayload, fields);
  assert(!fieldsExist);
});

When(/^saves the response text in the this.context under ([\w.]+)$/, function(
  contextPath
) {
  this.context[contextPath] = this.response.text;
});

When(/^saves the response text in the context under ([:\w.]+)$/, function(
  contextPath
) {
  this.context = {};
  this.context[contextPath] = this.response.text;
});
