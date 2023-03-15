import { ascending, descending } from "d3";
import haversine from "haversine-distance";

export default async function getNearestCounty({ counties, location }) {
	const { lon, lat } = location;

	const data = counties.features.map(({ id, properties }) => ({
		id,
		...properties
	}));

	const withDist = data.map((d) => ({
		...d,
		dist: Math.round(haversine([+lon, +lat], d.centroid) / 1000)
	}));

	// STUPID HACK
	withDist.sort((a, b) => descending(a.dist, b.dist));
	withDist.reverse();

	const withIndex = withDist.map((d, i) => ({
		...d,
		index: i
	}));

	return withIndex;
}
