
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  else if (req.method === "GET") {
    res.redirect('/');
  }
  else {
    res.status(401).send();
  }
}

module.exports = {
  isLoggedIn,
}