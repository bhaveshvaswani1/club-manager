module.exports.handleError = function (err, req, res, next) {
  var output = {
    message: err.message,
  };
  var statusCode = err.status || 500;
  res.status(statusCode).json(output);
};
