import { stub, spy } from 'sinon';
import retrieveUser from '.';
import assert from 'assert';

const createStubs = {
  success: () =>
    stub().resolves({ email: 'eg@kk.com', password: 'abc', profile: {} }),
  notFoundError: () => stub().rejects({ message: 'Not Found' }),
  otherError: () => stub().rejects(new Error('Internal Server Error'))
};

describe('Retrieve User request handler', function() {
  let req;
  let res;
  let db;

  describe("When retrieve resolves with the new user's ID", function() {
    beforeEach(function() {
      db = {};
      req = {};
      res = {
        status: spy(),
        set: spy(),
        json: spy()
      };
      return retrieveUser(req, res, db, createStubs.success());
    });

    describe('should call res.status()', function() {
      it('once', function() {
        assert(res.status.calledOnce);
      });

      it('with the arguments 200', function() {
        assert(res.status.calledWithExactly(200));
      });
    });

    describe('should call res.set()', function() {
      it('once', function() {
        assert(res.set.calledOnce);
      });

      it('with the arguments "Content-Tyoe" and "application/json"', function() {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function() {
      it('once', function() {
        assert(res.json.calledOnce);
      });

      it('with the user object as paramater', function() {
        assert(
          res.json.calledWithExactly({
            email: 'eg@kk.com',
            password: 'abc',
            profile: {}
          })
        );
      });
    });
  });

  describe('When retrieve rejects with a not found error', function() {
    beforeEach(function() {
      req = {};
      res = {
        status: spy(),
        set: spy(),
        json: spy()
      };
      db = {};
      return retrieveUser(req, res, db, createStubs.notFoundError());
    });

    describe('should call res.status()', function() {
      it('once', function() {
        assert(res.status.calledOnce);
      });

      it('with the arguments 404', function() {
        assert(res.status.calledWithExactly(404));
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

      it('with the user object as paramater', function() {
        assert(
          res.json.calledWithExactly({
            message: 'Not Found'
          })
        );
      });
    });
  });

  describe('When retrieve rejects with a internal server error', function() {
    beforeEach(function() {
      req = {};
      res = {
        status: spy(),
        set: spy(),
        json: spy()
      };
      db = {};
      return retrieveUser(req, res, db, createStubs.otherError());
    });

    describe('should call res.status()', function() {
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

      it('with the user object as paramater', function() {
        assert(
          res.json.calledWithExactly({
            message: 'Internal Server Error'
          })
        );
      });
    });
  });
});
