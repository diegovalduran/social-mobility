import fs from "fs";
import * as d3 from "d3";
const raw = d3.csvParse(fs.readFileSync("./src/data/raw.csv", "utf8"));
const stateLookup = d3.csvParse(
	fs.readFileSync("./src/data/states.csv", "utf8")
);

export default function cleanPlaceData() {
	const getStateAbbr = (str) =>
		stateLookup.find((d) => d.state === str)?.postal;

	const cleanCounty = (str) =>
		str
			.split(" / ")[0]
			.replace("Census Area", "")
			.replace("Planning Region", "");

	const cleaned = raw
		.filter((d) => !d.remove)
		.map((d, i) => ({
			id: i,
			name: d.name,
			state: getStateAbbr(d.state),
			county: cleanCounty(d.county),
			country: d.level === "city-us" ? "" : d.country,
			level: d.level,
			population: Math.round(+d.population),
			latitude: (+d.latitude).toFixed(3),
			longitude: (+d.longitude).toFixed(3),
			phoneme: d.phoneme,
			wiki: +d.wiki_length
		}));

	const grouped = d3.groups(cleaned, (d) => d.phoneme);
	const digits = grouped.length.toString().length;
	const f = d3.format(`0${digits}d`);

	const places = grouped
		.filter((d) => d[1].length > 1)
		.map(([key, values], i) => {
			return values.map((v) => ({
				...v,
				phoneme: f(i)
			}));
		})
		.flat();

	places.sort((a, b) => d3.descending(a.population, b.population));

	return places;
}
