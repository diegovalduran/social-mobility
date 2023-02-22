import { descending } from "d3";
import placesRaw from "$data/places-mult.csv";
import stateLookup from "$data/state-name-abbr.csv";

const getStateAbbr = (str) =>
	stateLookup.find((d) => d.state === str)?.standard;

const places = placesRaw.map((d) => ({
	...d,
	stateAbbr: getStateAbbr(d.state),
	latitude: +d.latitude,
	longitude: +d.longitude,
	population: +d.population
}));

places.sort((a, b) => descending(a.population, b.population));

export default places;
