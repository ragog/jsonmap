const User = require("../model/user.js");

const preExec = async function (req, res, next) {
  console.log(`Request received: ${req.method} ${req.url}`);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Received request with missing Authorization header - ignoring");
    res.status(401).send('Missing Authorization header');
    return;
  }

  let token;

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
    User.find({ apikey: token }).countDocuments((error, count) => {
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

module.exports = preExec;
