require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/vehicles', async function what(req, res, next) {
	const getRealTimeData = async function () {
		// Got these coordinates from https://www.buseireann.ie/inner.php?id=403 network tab. (Search John Paul Center stop).
		const cord = {
			latitude_north: 191848140,
			latitude_south: 191776140,
			longitude_east: -32386968,
			longitude_west: -32458968,
		};

		const timestamp = Date.now();

		const url = `${process.env.BASE}vehicleTdi.php?latitude_north=${cord.latitude_north}&latitude_south=${cord.latitude_south}&longitude_east=${cord.longitude_east}&longitude_west=${cord.longitude_west}&_=${timestamp}`;
		console.log(url);

		return axios
			.get(url)
			.then((ans) => {
				return ans.data;
			})
			.catch((e) => {
				console.log('error', e);
			});
	};
	const moh = await getRealTimeData();
	return res.send(moh);
});

router.get('/trip/:tripid', async function what(req, res, next) {
	const getRealTimeData = async function () {
		const timestamp = Date.now();
		const url = `${process.env.BASE}stopPassageTdi.php?trip=${req.params.tripid}&_=${timestamp}`;

		console.log('Trip url', url);
		return axios
			.get(url)
			.then((ans) => {
				return ans.data;
			})
			.catch((e) => {
				console.log('error', e);
			});
	};
	const moh = await getRealTimeData();
	return res.send(moh);
});

router.get('/routes', async function what(req, res, next) {
	const getRoute = async function () {
		//const sampleRouteDuid = '7338652709907595444';
		const url = `${process.env.BASE}routes.php`;

		console.log('Route url', url);
		return axios
			.get(url)
			.then((ans) => {
				return ans.data;
			})
			.catch((e) => {
				console.log('error', e);
			});
	};

	// routeDets is a string of javascript beginning "var something_obj = {"valid json"}". This is why the parseIt has to happen.
	const routeDets = await getRoute();

	// Get a json object from the response.
	const obj = JSON.parse(parseIt(routeDets));

	// Turn the response obj into an array for convenience.
	const niceArray = makeNice(obj.routeTdi);

	// Filter out everything that isn't Galway related.
	const galway = niceArray.filter((stop) => {
		return ['401', '402', '404', '405', '407', '409'].includes(stop.short_name);
	});

	return res.send(galway);

	// Helper
	function parseIt(str) {
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
