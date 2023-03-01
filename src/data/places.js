import { groups, descending } from "d3";
import raw from "$data/raw.csv";
import stateLookup from "$data/state-name-abbr.csv";

const getStateAbbr = (str) => stateLookup.find((d) => d.state === str)?.postal;

const cleaned = raw
	.filter((d) => !d.remove)
	.map((d, i) => ({
		id: i,
		name: d.name,
		stateAbbr: getStateAbbr(d.state),
		country: d.country,
		level: d.level,
		population: +d.population,
		latitude: +d.latitude,
		longitude: +d.longitude,
		phoneme: d.phoneme,
		wiki: +d.wiki_length
	}));

const places = groups(cleaned, (d) => d.phoneme)
	.map(([key, values], i) =>
		values.map((v) => ({
			...v,
			phoneme: i
		}))
	)
	.flat();

places.sort((a, b) => descending(a.population, b.population));

export default places;
