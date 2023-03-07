import { base } from "$app/paths";
import { ascending, csv } from "d3";
import haversine from "haversine-distance";

export default async function getNearestOptions({ lat, lon, state }) {
	try {
		const places = await csv(
			`${base}/assets/coordinates/${state}.csv?${__TIMESTAMP__}`
		);

		const withDist = places.map((p) => ({
			...p,
			state,
			dist: haversine([+lon, +lat], [+p.longitude, +p.latitude])
		}));
		withDist.sort((a, b) => ascending(a.dist, b.dist));
		return withDist.slice(0, 5);
	} catch (err) {
		console.log(err);
		return;
	}
}
