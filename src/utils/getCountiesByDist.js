import { ascending } from "d3";
import haversine from "haversine-distance";

export default async function getNearestCounty({ counties, location }) {
	const { lon, lat } = location;
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
