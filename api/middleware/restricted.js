const jwt = require('jsonwebtoken');
const db = require('../../data/dbConfig');

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, "shh", async (err, decoded) => {
      if (err != null) {
        res.status(401).json({ message: "token invalid" })
        return;
      } 
      const user = await db('users').where("id", decoded.subject).first()
      if (user == null) {
        res.status(401).json({ message: "token invalid" })
        return;
      }
      next()
    })
  } else {
    next({ status: 401, message: "token required" })
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
