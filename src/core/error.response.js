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

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatus.CONFICT, statusCode = StatusCode.CONFLIT) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
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

class ForbidenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbidenError
}