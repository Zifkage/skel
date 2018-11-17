import assert from 'assert';
import { stub } from 'sinon';
import retrieve from '.';

describe('Retrieve User engine', function() {
  let req;
  let db;
  let dbGetResult;
  let promise;

  beforeEach(function() {
    req = {
      params: {
        userId: 'abc'
      }
    };
  });

  describe('When db resolves with user type document', function() {
    beforeEach(function() {
      dbGetResult = { _source: { email: 'ee@l.j', password: 'abc' } };
      db = {
        get: stub().resolves(dbGetResult)
      };
      promise = retrieve(req, db);
      return promise;
    });

    it('should relay user object without the password field', function() {
      promise.then(result => {
        dbGetResult = dbGetResult._source;
        assert.strictEqual(result, dbGetResult);
      });
    });
  });

  describe('When db rejects with not found error', function() {
    it('should relay not found error object', function() {
      db = {
        get: stub().rejects({ status: 404 })
      };
      retrieve(req, db).catch(err => {
        assert.equal(err.message, 'Not Found');
      });
    });
  });
});
