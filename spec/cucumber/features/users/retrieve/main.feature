Feature: Retrive User

  Client should be able to retrieve by ID

  Scenario: No existing User
    If the client sends a GET to users/:userId with an ID that does not exist, it should receive a response with a
    4xx status code;

    When the client creates a GET request to /users/8888
    And sends the request
    Then our API should respond with a 404 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Not found"
