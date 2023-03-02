import { format, groups, descending } from "d3";

export default function cleanPlaceData({ raw, stateLookup }) {
	const getStateAbbr = (str) =>
		stateLookup.find((d) => d.state === str)?.postal;

	const cleaned = raw
		.filter((d) => !d.remove)
		.map((d, i) => ({
			id: i,
			name: d.name,
			state: getStateAbbr(d.state),
			country: d.level === "city-us" ? "" : d.country,
			level: d.level,
			population: +d.population,
			latitude: (+d.latitude).toFixed(2),
			longitude: (+d.longitude).toFixed(2),
			phoneme: d.phoneme,
			wiki: +d.wiki_length
		}));

	const grouped = groups(cleaned, (d) => d.phoneme);
	const digits = grouped.length.toString().length;
	const f = format(`0${digits}d`);

	const places = grouped
		.filter((d) => d[1].length > 1)
		.map(([key, values], i) => {
			return values.map((v) => ({
				...v,
				phoneme: f(i)
			}));
		})
		.flat();

	places.sort((a, b) => descending(a.population, b.population));

	return places;
}
