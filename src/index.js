const express = require('express');
const Item = require('./model/item')
const User = require('./model/user')
const preExec = require("./middleware/middleware.js");
const mongoose = require('./db/mongoose')
const uuid = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(preExec);

app.get('/', (req, res) => {
	res.send('You have reached restore!');
});

app.post('/items', async (req, res) => {
	
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

app.post('/users', async (req, res) => {
	
	if (!uuid.validate(req.body.id)) {
		req.body.id = uuid.v4()
	}
	
	await new User({
		id: req.body.id,
		apikey: req.body.apikey
	}).save();

	res.send(req.body.id)
	
});

app.get('/items/:id', async (req, res) => {

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

app.listen(port, () => {
	console.log(`restore listening on port ${port}`);
});