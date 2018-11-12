import assert from 'assert';
import { stub } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';
import create from '.';

describe('User Create Engine', function() {
  let req;
  let db;
  let validator;
  let dbIndexResult = {};

  beforeEach(function() {
    req = {};
    db = {
      index: stub().resolves(dbIndexResult)
    };
  });

  describe('When invoked and validator returns with undefined', function() {
    let promise;

    beforeEach(function() {
      validator = stub().returns(undefined);
      promise = create(req, db, validator, ValidationError);
      return promise;
    });

    describe('should call validator', function() {
      it('once', function() {
        assert(validator.calledOnce);
      });

      it('with req as the only argument', function() {
        assert(validator.calledWithExactly(req));
      });
    });

    it('should relay the promise returned by db.index()', function() {
      promise.then(res => assert.strictEqual(res, dbIndexResult));
    });
  });

  describe('When validator returns with an instance of ValidatorError', function() {
    it('should reject with the ValidatorError returned from validator', function() {
      const validationError = new ValidationError();
      validator = stub().returns(validationError);
      create(req, db, validator, ValidationError).catch(err =>
        assert.strictEqual(err, validationError)
      );
    });
  });
});
