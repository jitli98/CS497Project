# Submission Testing service
This services runs tests on submitted solutions to check if they are correct.

# API Documentation
The API uses HTTP Request METHODS to communicate and HTTP [response codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) to indicate status and errors.
All responses come in standard JSON.

## Response Codes 
### Response Codes
```
200: Success
400: Invalid request
404: Cannot be found
```

## Submit Solution
**You send:** the challenge ID, user ID, and programming language (in the query parameters), and the solution code (in the body).

**You get:** A submission ID for querying the status of the tests.

### Request
```
POST 127.0.0.1:8000/submitSolution?challengeId=123&programmingLanguage=python3&userId=123
Accept: application/json
Content-Type: text/plain

def submission(array):
    array.sort()
    return array
```
### Successful Response
```
200 OK
Content-Type: application/json

{
    "submissionId": "346d7a92-116b-4318-8ecd-02eb886a39cc"
}
```
### Failed Responses
#### Missing submission code 
```
400 Bad Request
Content-Type: application/json

{
    "message": "Code must be specified in request body."
}
```
#### Missing query parameter 
```
400 Bad Request
Content-Type: application/json

{
    "message": "<parameter> was not specified."
}
```

## Get Submission Status
**You send:** A submission ID.

**You get:** The status of the tests for the specified submission. 

### Request
```
GET 127.0.0.1:8000/getSubmissionStatus?submissionId=346d7a92-116b-4318-8ecd-02eb886a39cc
Accept: application/json
Content-Type: application/json
```
### Successful Response
```
200 OK
Content-Type: application/json

{
    "status": "RUNNING"
}
```
`status` will be one of `"QUEUED"`,`"RUNNING"`, `"PASSED"`, `"FAILED"`, or `"ERRORED"`.  

### Failed Responses
#### Invalid submission ID 
```
404 Not Found
Content-Type: application/json

{
    "message": "Submission not found"
}
```

# Implementation details
The service creates a new Docker container for each submission.
The container will run all inputs specified in the testcases.
The container prints the output for each testcase to stdout, and the service compares them against the expected output.

# Build instructions
Prerequisites: [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/)
0. Checkout files with `git clone https://github.com/jitli98/CS497Project.git && cd CS497Project`
0. Build and run the service with `docker-compose up --build submission-testing`
