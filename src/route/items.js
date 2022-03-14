const express = require("express");
const Item = require("../model/item.js");
const User = require("../model/user.js")
const router = new express.Router();
const preExec = require("../middleware/middleware.js");
const uuid = require('uuid');

router.use(preExec);

router.post('/v1/items', async (req, res) => {
	
	if (!uuid.validate(req.body.id)) {
		req.body.id = uuid.v4()
	}

	const apikeyFromRequest = req.headers.authorization.replace("Bearer ", "");
	const ownerUser = await User.findOne({ apikey: apikeyFromRequest })
	
	await new Item({
		id: req.body.id,
		body: req.body.body,
		owner: ownerUser.id
	}).save();

	res.send(req.body.id)
	
});

router.get('/v1/items/:id', async (req, res) => {

	if (!uuid.validate(req.params.id)) {
		res.status(400).send('Bad request')
		return
	}

	const apikeyFromRequest = req.headers.authorization.replace("Bearer ", "");
	const ownerUser = await User.findOne({ apikey: apikeyFromRequest })

	const item = await Item.findOne({ id: req.params.id })
	if (item?.owner === ownerUser.id) {
		res.send({ id: item.id, body: item.body });
		return
	}

	res.status(404).send("No such item found")

});

module.exports = router;