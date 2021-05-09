/* catch all error handling */
function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(500);
  res.json({ error: err });
}

module.exports = errorHandler;
