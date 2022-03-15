const express = require('express');
const itemsRouter = require("./route/items.js");
const path = require('path');
require('./db/mongoose')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use('/api', itemsRouter)

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.listen(port, () => {
	console.log(`restore listening on port ${port}`);
});