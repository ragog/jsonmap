const express = require('express');
const Item = require('./model/item')
const preExec = require("./middleware/middleware.js");
const mongoose = require('./db/mongoose')
const uuid = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(preExec);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/items', async (req, res) => {
	
	if (!uuid.validate(req.body.id)) {
		req.body.id = uuid.v4()
	}
	
	await new Item({
		id: req.body.id,
		body: req.body.body
	}).save();

	res.send(req.body.id)
	
});

app.get('/items/:id', async (req, res) => {

	if (!uuid.validate(req.params.id)) {
		res.status(400).send('that looks fucked up')
		return
	}

	const item = await Item.findOne({ id: req.params.id })
	res.send({ id: item.id, body: item.body });
	return

});

app.listen(port, () => {
	console.log(`restore listening on port ${port}`);
});
