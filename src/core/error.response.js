"use strict"

const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode")

const StatusCode = {
  FOREBIDEN: 403,
  CONFLIT: 409
}

const ReasonStatus = {
  FOREBIDEN: 'Bad request error',
  CONFICT: 'Conflict error'
}

class ErrorResponse extends Error {
  constructor(message, status){
    super(message)
    this.status = status
  }
}

class ConfictRequestError extends ErrorResponse {
  constructor(message = ReasonStatus.CONFICT, statusCode = StatusCode.CONFLIT) {
    super(message, statusCode)
  }
}

class BadResquestError extends ErrorResponse {
  constructor(message = ReasonStatus.FOREBIDEN, statusCode = StatusCode.FOREBIDEN) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED){
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND){
    super(message, statusCode)
  }
}

module.exports = {
  ConfictRequestError,
  BadResquestError,
  AuthFailureError,
  NotFoundError
}