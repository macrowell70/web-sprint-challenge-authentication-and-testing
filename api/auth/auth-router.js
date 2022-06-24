const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../data/dbConfig');

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const newUser = { username, password: hash }
    const [id] = await db('users').insert(newUser)
    const user = await db('users').where({ id }).first()
    res.json(user)
  } catch (err) {
    const { username, password } = req.body
    const users = db('users').where({ username }) 
    if (!username || !password) {
      next({ status: 401, message: "username and password required" })
    }
    if (users.length != 0) {
      next({ status: 401, message: "username taken" })
    }
    next(err)
    
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const [user] = await db('users').where({ username })
    console.log(user)
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user)
      res.json({ token, message: `welcome, ${username}`})
    } else if (!username || !password) {
      next({ status: 401, message: "username and password required" })
    } else {
      next({ status: 401, message: "invalid credentials" })
    }
  } catch (err) {
    const { username, password } = req.body
    if (!username || !password) {
      next({ status: 401, message: "username and password required" })
    }
    next(err)
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '5m'
  }
  return jwt.sign(payload, "shh", options)
}

module.exports = router;
