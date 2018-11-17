import assert from 'assert';
import elasticsearch from 'elasticsearch';
import retrieve from '.';

const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOLE}://${
    process.env.ELASTICSEARCH_HOSTNAME
  }:${process.env.ELASTICSEARCH_PORT}`
});

describe('Retrieve User Engine', function() {
  let req;

  describe('When the user does not exist', function() {
    beforeEach(function() {
      req = {
        params: {
          userId: 'not-exist'
        }
      };
    });

    it('should relay a error with a message property set to "Not Found"', function() {
      retrieve(req, db).catch(err => assert.equal(err.message, 'Not Found'));
    });
  });

  describe('When the user exist', function() {
    let promise;

    beforeEach(function() {
      promise = db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        body: { email: 'ejd@df.com', password: 'abcd' }
      });

      return promise;
    });

    it('should relay the user document without the password field', function() {
      promise.then(result => {
        req = {
          params: {
            userId: result._id
          }
        };

        retrieve(req, db).then(user => {
          assert(
            JSON.stringify(user) === JSON.stringify({ email: 'ejd@df.com' })
          );
        });
      });
    });
  });
});
