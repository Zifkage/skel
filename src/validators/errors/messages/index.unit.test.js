import assert from 'assert';
import generateValidationError from '.';

describe('generateValidationErrorMessage', function() {
  it('should return the correct string when error.keyword is "required"', function() {
    const errors = [
      {
        keyword: 'required',
        dataPath: '.test.path',
        params: {
          missingProperty: 'property'
        }
      }
    ];
    const actualErrorMessage = generateValidationError(errors);
    const expectedErrorMessage = "The '.test.path.property' field is missing";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
});
