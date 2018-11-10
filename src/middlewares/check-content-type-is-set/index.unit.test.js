import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import checkContentTypeIsSet from '.';
import { spy, stub } from 'sinon';

describe('checkContentTypeIsSet', function() {
  let res;
  let req;
  let next;

  describe('When the request have a empty payload', function() {
    let clonedRes;

    beforeEach(function() {
      req = {
        headers: {
          'content-length': '0'
        }
      };
      res = {};
      clonedRes = deepClone(res);
      next = spy();
      checkContentTypeIsSet(req, res, next);
    });

    it('should not modify res', function() {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next once', function() {
      assert(next.calledOnce);
    });
  });

  describe('When the request have a non-empty', function() {
    describe('And the content-type is set', function() {
      let clonedRes;

      beforeEach(function() {
        req = {
          headers: {
            'content-length': '5',
            'content-type': 'application/json'
          }
        };
        res = {};
        clonedRes = deepClone(res);
        next = spy();
        checkContentTypeIsSet(req, res, next);
      });

      it('should not modify res', function() {
        assert(deepEqual(res, clonedRes));
      });

      it('should call next once', function() {
        assert(next.calledOnce);
      });
    });

    describe('And the content-type is not set', function() {
      let resJsonReturnValue;
      let returnValue;

      beforeEach(function() {
        req = {
          headers: {
            'content-length': '5'
          }
        };
        resJsonReturnValue = {};
        res = {
          status: spy(),
          set: spy(),
          json: stub().returns(resJsonReturnValue)
        };
        next = spy();
        returnValue = checkContentTypeIsSet(req, res, next);
      });

      describe('should call res.status()', function() {
        it('once', function() {
          assert(res.status.calledOnce);
        });

        it('with the argument 400', function() {
          assert(res.status.calledWithExactly(400));
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

        it('with the correct error object', function() {
          assert(
            res.json.calledWithExactly({
              message:
                'The "Content-Type" header must be set for requests with a non-empty payload'
            })
          );
        });
      });

      it('should return whatever res.json() return', function() {
        assert.strictEqual(returnValue, resJsonReturnValue);
      });

      it('should not call next()', function() {
        assert(next.notCalled);
      });
    });
  });
});
