'use strict'

const StatusCode = {
  OK: 200,
  CREATED: 201
}

const ReasonStatusCode = {
  CREATED: 'Created!',
  OK: 'Success'
}

class SuccessResponse {
  constructor({ message, StatusCode = StatusCode.OK, ReasonStatusCode = ReasonStatusCode.OK, metadata: { } }) {
    this.message = !message ? ReasonStatusCode : message;
    this.status = StatusCode;
    this.metadata = this.metadata
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata })
  }
 
}

class CREATED extends SuccessResponse {
  constructor({ options = {}, message, StatusCode = StatusCode.CREATED, ReasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
    this.options = options
    super({ message, StatusCode, ReasonStatusCode, metadata })
  }

}

module.exports = {
  OK, CREATED
}