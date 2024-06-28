const express = require('express');
const itemsRouter = require("./route/items.js");
const usersRouter = require("./route/users.js");
const forceHTTPS = require("./middleware/https.js")
const path = require('path');
require('./db/mongoose')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
if (process.env.DB_URL) { app.use(forceHTTPS) }
app.use('/api', itemsRouter)
app.use('/api', usersRouter)

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.listen(port, () => {
	console.log(`restore listening on port ${port}`);
});