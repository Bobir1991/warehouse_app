class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

module.exports = { ValidationError, NetworkError };
