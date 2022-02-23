require('dotenv').config();
const port = process.env.PORT || 5000;

const express = require('express');
const app = express();

const cors = require('cors');

const api = require('./api/api.js');

app.use(cors());
app.use('/api', api);

app.get('/', async (req, res) => {
	return res.send('use /api');
});

app.listen(port, () => console.log('started on 5001'));
module.exports = app;
