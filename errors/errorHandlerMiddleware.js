const mongoose = require('mongoose')
const customError = require('./customError')
const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let errMessage =
    err.message || 'Doslo je do greske sa serverom, pokusajte ponovo!'

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    errMessage = Object.values(err.errors)
      .map((item) => item.message)
      .join(' i ')
  }

  res.status(statusCode).json({ success: false, msg: errMessage, data: null })
}

module.exports = errorHandlerMiddleware