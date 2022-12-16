require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/vehicles', async function what(req, res, next) {
	const getRealTimeData = async function () {
		// Got these coordinates from https://www.buseireann.ie/inner.php?id=403 network tab. (Search John Paul Center stop).

		// try opp tonerys
		// https://www.buseireann.ie/inc/proto/stopPointTdi.php?latitude_north=191838996&latitude_south=191766996&longitude_east=-32526432&longitude_west=-32598432&_=1671185254977
		// const cord = {
		// 	latitude_north: 191838996,
		// 	latitude_south: 191766996,
		// 	longitude_east: -32526432,
		// 	longitude_west: -32598432,
		// };

		const timestamp = Date.now();

		const url = `${process.env.BASE}vehicleTdi.php?latitude_north=${latitude_north}&latitude_south=${latitude_south}&longitude_east=${longitude_east}&longitude_west=${longitude_west}&_=${timestamp}`;

		return axios
			.get(url)
			.then((ans) => {
				return ans.data;
			})
			.catch((e) => {
				console.log('error', e);
				return res
					.status(500)
					.json({ error: 'Something went wrong with the vehicle request.' });
			});
	};
	// console.log(req.query)
	const { latitude_north, latitude_south, longitude_east, longitude_west } =
		req.query;

	if (
		!latitude_north ||
		!latitude_south ||
		!longitude_east ||
		!longitude_west
	) {
		return res.status(400).json({ error: 'Bad URL params...' });
	}

	const realTimeData = await getRealTimeData();

	return res.send(realTimeData);
});

router.get('/trip/:tripid', async function what(req, res, next) {
	const getRealTimeData = async function () {
		const timestamp = Date.now();
		const url = `${process.env.BASE}stopPassageTdi.php?trip=${req.params.tripid}&_=${timestamp}`;

		// console.log('Trip url', url);
		return axios
			.get(url)
			.then((ans) => {
				return ans.data;
			})
			.catch((e) => {
				console.log('error', e);
				console.log('trip error', req.params);
				return res
					.status(500)
					.json({ error: 'Something went wrong with the trip request.' });
			});
	};
	const trip = await getRealTimeData();
	return res.send(trip);
});

router.get('/routes', async function what(req, res, next) {
	const getRoute = async function () {
		//const sampleRouteDuid = '7338652709907595444';
		const url = `${process.env.BASE}routes.php`;

		// console.log('Route url', url);
		return axios
			.get(url)
			.then((ans) => {
				return ans.data;
			})
			.catch((e) => {
				// console.log('error', e);
				console.log('routes error', url);
				return res
					.status(500)
					.json({ error: 'Something went wrong with the routes request.' });
			});
	};

	// routeDets is a string of javascript beginning "var something_obj = {"valid json"}". This is why the parseIt has to happen.
	const routeDets = await getRoute();

	// Get a json object from the response.
	const obj = JSON.parse(parseIt(routeDets));

	if (!obj) {
		return res
			.status(500)
			.json({ error: 'Something went wrong with the routes request(2).' });
	}
	// Turn the response obj into an array for convenience.
	const niceArray = makeNice(obj.routeTdi);

	// Filter out everything that isn't Galway related.
	const galway = niceArray.filter((stop) => {
		return ['401', '402', '404', '405', '407', '409'].includes(stop.short_name);
	});

	return res.send(galway);

	// Helper
	function parseIt(str) {
		if (!str) return false;
		const end = str.lastIndexOf('}');
		const start = str.indexOf('{');
		const ans = str.substring(start, end + 1);
		return ans;
	}

	// Helper
	function makeNice(obj) {
		const nice = [];
		for (const i in obj) {
			nice.push(obj[i]);
		}
		return nice;
	}
});

module.exports = router;
