import { base } from "$app/paths";
import { ascending, csv } from "d3";
import haversine from "haversine-distance";
import locate from "$utils/locate.js";
import states from "$data/state-name-abbr.csv";

async function getLocation(test) {
	let location;
	try {
		const { country, region, loc } = await locate(test);
		if (country === "US") {
			const [lat, lon] = loc.split(",");
			const state = states.find((s) => s.state === region)?.postal;
			location = { lat, lon, state };
		}
	} catch (err) {
		console.log(err);
	} finally {
		return location;
	}
}

export default async function getNearestOptions(test) {
	try {
		const { lat, lon, state } = await getLocation(test);
		const places = await csv(`${base}/assets/coordinates/${state}.csv`);

		const withDist = places.map((p) => ({
			...p,
			state,
			dist: haversine([+lat, +lon], [+p.latitude, +p.longitude])
		}));
		withDist.sort((a, b) => ascending(a.dist, b.dist));
		return withDist.slice(0, 5);
	} catch (err) {
		console.log(err);
		return;
	}
}
