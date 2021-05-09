var isAuthenticated = function (req, res, next) {
  if (!req.userid) return res.status(401).json({ error: "access denied" });
  next();
};

module.exports = isAuthenticated;
