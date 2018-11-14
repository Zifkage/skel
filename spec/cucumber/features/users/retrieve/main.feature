Feature: Retrive User by ID

  Client should be able to retrieve by ID

  Scenario: No existing User
    If the client sends a GET request to /users/:userId with an ID that does not exist, it should receive a response with a
    4xx status code.

    When the client creates a GET request to /users/8888
    And sends the request
    Then our API should respond with a 404 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Not found"

  Scenario: The user exist
    If client sends a GET request to /users/:userId with an ID that does exist, it should receive a response with a 2xx status code

    When the client request for user type payload by ID
    And sends the request
    Then our API should respond with a 200 HTTP status code
    And the payload of the response should be a JSON object
    And should not contain the passoword field