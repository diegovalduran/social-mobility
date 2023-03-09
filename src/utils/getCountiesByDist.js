import { ascending, descending } from "d3";
import haversine from "haversine-distance";
import { counties } from "$data/us.js";

export default async function getNearestCounty({ lat, lon }) {
	const data = counties.features.map(({ id, properties }) => ({
		id,
		...properties
	}));
	const withDist = data.map((d) => ({
		...d,
		dist: haversine([+lon, +lat], d.centroid)
	}));

	withDist.sort((a, b) => ascending(a.dist, b.dist));

	const withIndex = withDist.map((d, i) => ({
		...d,
		index: i
	}));

	return withIndex;
}
