const express = require("express");
const User = require("../model/user.js")
const router = new express.Router();
const uuid = require('uuid');
const crypto = require('crypto')

router.post('/v1/users', async (req, res) => {
    
    const apikey = uuid.v4()
    let hash = crypto.createHash('sha512');
    hash.update(apikey);

    await new User({
		id: uuid.v4(),
		apikey: hash.digest('hex'),
	}).save();

    res.send({ id: apikey })
    
})

module.exports = router;