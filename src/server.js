const express = require('express');
const itemsRouter = require('./route/items.js');
const usersRouter = require('./route/users.js');
const forceHTTPS = require('./middleware/https.js');
const path = require('path');
const prometheus = require('prom-client');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Prometheus monitoring setup
const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });

const httpRequestCounter = new prometheus.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCounter);

// Middleware to count requests for prometheus
app.use((req, res, next) => {
	res.on('finish', () => {
		httpRequestCounter.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
	});
	next();
});

// Serve metrics at /metrics for prometheus
app.get('/metrics', async (req, res) => {
	res.set('Content-Type', register.contentType);
	res.end(await register.metrics());
});

app.use(express.json());
if (process.env.DB_URL) {
	app.use(forceHTTPS);
}

app.use('/api', itemsRouter);
app.use('/api', usersRouter);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.listen(port, () => {
	console.log(`restore listening on port ${port}`);
});
