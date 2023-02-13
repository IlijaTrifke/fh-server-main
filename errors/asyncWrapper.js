const asyncWrapper = (fn) => {
    return async (res, req, next) => {
      try {
        await fn(res, req, next)
      } catch (e) {
        next(e)
      }
    }
  }
  
  module.exports = asyncWrapper