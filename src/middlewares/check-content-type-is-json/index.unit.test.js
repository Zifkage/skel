import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import checkContentTypeIsJson from '.';
import { spy, stub } from 'sinon';

describe('checkContentTypeIsJson', function() {
  let req;
  let res;
  let next;

  describe('When the request has a content-type of application/json', function() {
    let clonedRes;

    beforeEach(function() {
      req = {
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'
      };
      res = {};
      next = spy();
      clonedRes = deepClone(res);
      checkContentTypeIsJson(req, res, next);
    });

    it('should not modify res', function() {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next once', function() {
      assert(next.calledOnce);
    });
  });

  describe('When the has not a content-type of application/json', function() {
    let resJsonReturnValue;
    let returnValue;

    beforeEach(function() {
      req = {
        headers: {
          'content-type': 'plain/text'
        },
        method: 'POST'
      };
      resJsonReturnValue = {};
      res = {
        status: spy(),
        set: spy(),
        json: stub().returns(resJsonReturnValue)
      };
      next = spy();
      returnValue = checkContentTypeIsJson(req, res, next);
    });

    describe('should call res.status()', function() {
      it('once', function() {
        assert(res.status.calledOnce);
      });

      it('with the argument 415', function() {
        assert(res.status.calledWithExactly(415));
      });
    });

    describe('should call res.set()', function() {
      it('once', function() {
        assert(res.set.calledOnce);
      });

      it('with the arguments "Content-Type" and "application/json"', function() {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function() {
      it('once', function() {
        assert(res.json.calledOnce);
      });

      it('with the correct error message', function() {
        assert(
          res.json.calledWithExactly({
            message:
              'The "Content-Type" header must always be "application/json"'
          })
        );
      });
    });

    it('should return whatever res.json() returns', function() {
      assert.strictEqual(returnValue, resJsonReturnValue);
    });

    it('should not call next()', function() {
      assert(next.notCalled);
    });
  });
});
