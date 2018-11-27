Feature: Retrive User by ID

  Client should be able to retrieve by ID

  Scenario: Retrive No-existing User
    If the client sends a GET request to /users/:userId with an ID that does not exist, it should receive a response with a
    4xx status code.

    When the client creates a GET request to /users/8888
    And sends the request
    Then our API should respond with a 404 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Not Found"

  Scenario: Retrieve Existing User
    Given the client creates a POST request to /users/
    And attaches a valid Create User payload
    And sends the request
    And saves the response text in the context under :userId
    When the client creates a GET request to /users/:userId
    And sends the request
    Then our API should respond with a 200 HTTP status code
    And the payload of the response should be a JSON object
    And the newly-created user should be deleted
