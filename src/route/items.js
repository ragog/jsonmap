const express = require("express");
const Item = require("../model/item.js");
const User = require("../model/user.js")
const router = new express.Router();
const preExec = require("../middleware/middleware.js");
const uuid = require('uuid');
const crypto = require('crypto')
const getHashFromRequest = require('../helper/helper.js')

router.use(preExec);

router.get('/v1/items', async (req, res) => {

	const hashedToken = getHashFromRequest(req)

	const ownerUser = await User.findOne({ apikey: hashedToken })

	const items = await Item.find({ owner: ownerUser.id })
	const formatItems = items.map((x) => ({ id: x.id, value: x.body, owner: x.owner }))

	res.send(formatItems);

});

router.post('/v1/items', async (req, res) => {
	
	if (!req.body.key) {
		req.body.key = uuid.v4()
	}

    const hashedToken = getHashFromRequest(req)

	const ownerUser = await User.findOne({ apikey: hashedToken })

	const existingItemWithKey = await Item.findOne({ key: req.body.key })
	if (existingItemWithKey) {
		res.status(400).send('Bad request: key already in use')
		return
	}

	try {
		await new Item({
			id: uuid.v4(),
			key: req.body.key,
			value: req.body.value,
			owner: ownerUser.id
		}).save();
	} catch (error) {
		res.status(400).send('Bad request: '+ error)
		return
	}
	
	res.send(req.body.key)
	
});

router.get('/v1/items/:key', async (req, res) => {

	if (!req.params.key) {
		res.status(400).send('Bad request')
		return
	}

	const hashedToken = getHashFromRequest(req)

	const ownerUser = await User.findOne({ apikey: hashedToken })

	const item = await Item.findOne({ key: req.params.key })
	if (item?.owner === ownerUser?.id) {
		res.send({ key: item.key, value: item.value });
		return
	}

	res.status(404).send("No such item found")

});

module.exports = router;