const User = require("../model/user.js");
const crypto = require("crypto")
const getHashFromRequest = require('../helper/helper.js')

const authMiddleware = async function (req, res, next) {
  console.log(`Request received: ${req.method} ${req.url}`);

  if (req.url.includes('/users')) {
    next()
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Received request with missing Authorization header - ignoring");
    res.status(401).send('Missing Authorization header');
    return;
  }

  if (authHeader.startsWith("Bearer ")) {
    const hashedToken = getHashFromRequest(req)

    if(process.env.SLOWMO) {
      const delay = Math.floor(Math.random() * 200) * 10;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    User.find({ apikey: hashedToken }).countDocuments((error, count) => {
      if (count === 0) {
        console.log("Received request with unknown API key - ignoring");
        res.status(401).send('Unknown API key');
      } else {
        next();
      }
    });
  } else {
    res.status(401).send('Unknown format - should be Bearer <API_KEY>');
  }
};

module.exports = authMiddleware;
