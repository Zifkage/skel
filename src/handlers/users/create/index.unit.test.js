import { stub, spy } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';
import createUser from '.';
import assert from 'assert';

const createStubs = {
  success: () => stub().resolves({ _id: 'foo' }),
  validationError: () => stub().rejects(new ValidationError('error message')),
  otherError: () => stub().rejects(new Error())
};

describe('Create User request handler', function() {
  let req;
  let res;
  let db;
  let validator;

  describe("When create resolves with the new user's ID", function() {
    beforeEach(function() {
      db = {};
      req = {};
      validator = {};
      res = {
        status: spy(),
        set: spy(),
        send: spy()
      };

      return createUser(
        req,
        res,
        db,
        createStubs.success(),
        validator,
        ValidationError
      );
    });

    describe('should call res.status() once', function() {
      it('once', function() {
        assert(res.status.calledOnce);
      });

      it('with the arguments 200', function() {
        assert(res.status.calledWithExactly(201));
      });
    });

    describe('should call res.set()', function() {
      it('once', function() {
        assert(res.set.calledOnce);
      });

      it('with the arguments "Content-tyoe" and "text/plain"', function() {
        assert(res.set.calledWithExactly('Content-Type', 'text/plain'));
      });
    });

    describe('should call res.send()', function() {
      it('once', function() {
        assert(res.send.calledOnce);
      });

      it('with the user id as paramater', function() {
        assert(res.send.calledWithExactly('foo'));
      });
    });
  });

  describe('When create reject with ValidationError instance', function() {
    beforeEach(function() {
      db = {};
      req = {};
      validator = {};
      res = {
        status: spy(),
        set: spy(),
        json: spy()
      };

      return createUser(
        req,
        res,
        db,
        createStubs.validationError(),
        validator,
        ValidationError
      );
    });

    describe('should call res.status() once', function() {
      it('once', function() {
        assert(res.status.calledOnce);
      });

      it('with the arguments 400', function() {
        assert(res.status.calledWithExactly(400));
      });
    });

    describe('should call res.set()', function() {
      it('once', function() {
        assert(res.set.calledOnce);
      });

      it('with the arguments "Content-tyoe" and "application/json"', function() {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function() {
      it('once', function() {
        assert(res.json.calledOnce);
      });

      it('with the correct error object', function() {
        assert(res.json.calledWithExactly({ message: 'error message' }));
      });
    });
  });

  describe('When create catch other error', function() {
    beforeEach(function() {
      db = {};
      req = {};
      validator = {};
      res = {
        status: spy(),
        set: spy(),
        json: spy()
      };

      return createUser(
        req,
        res,
        db,
        createStubs.otherError(),
        validator,
        ValidationError
      );
    });

    describe('should call res.status() once', function() {
      it('once', function() {
        assert(res.status.calledOnce);
      });

      it('with the arguments 500', function() {
        assert(res.status.calledWithExactly(500));
      });
    });

    describe('should call res.set()', function() {
      it('once', function() {
        assert(res.set.calledOnce);
      });

      it('with the arguments "Content-tyoe" and "application/json"', function() {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function() {
      it('once', function() {
        assert(res.json.calledOnce);
      });

      it('with the correct error object', function() {
        assert(
          res.json.calledWithExactly({ message: 'Internal Server Error' })
        );
      });
    });
  });
});
