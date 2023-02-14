// https://observablehq.com/@efrymire/gridding-map-files
import { range } from "d3";

export default function gridPointsUS(multiplier = 1) {
	// range longitudes from 10 (S) to 55 (N) for every 1 degree
	const longitudes = range(10, 55, multiplier).reverse();

	// range latitudes from -130 (W) to -60 (E) for every 1 degree
	const latitudes = range(-130, -60, multiplier * 2);

	// long / lat points in order from west to east, then north to south, like a wrap
	const flat = longitudes
		.map((lon) => latitudes.map((lat) => [lat, lon]))
		.flat();

	return flat;
}
