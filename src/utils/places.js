import { descending } from "d3";
import townData from "$data/towns.csv";
import cityData from "$data/cities.csv";
import stateData from "$data/states.csv";
import countryData from "$data/countries.csv";

const towns = townData.map((d) => ({
	geo: "town",
	name: d.city,
	state: d.state,
	population: +d.population,
	latitude: +d.latitude,
	longitude: +d.longitude
}));

// TODO other population threshold?
const cities = cityData
	.map((d) => ({
		geo: "city",
		name: d.city,
		population: +d.population,
		latitude: +d.lat,
		longitude: +d.lng
	}))
	.filter((d) => d.population > 500000);

const states = stateData.map((d) => ({
	geo: "state",
	name: d.NAME,
	population: +d.POPESTIMATE2022,
	latitude: +d.Latitude,
	longitude: +d.Longitude
}));

const countries = countryData.map((d) => ({
	geo: "country",
	name: d.country,
	latitude: +d.latitude,
	longitude: +d.longitude
}));

const places = [...towns, ...cities, ...states, ...countries].map((d, id) => ({
	...d,
	id
}));

places.sort((a, b) => descending(a.population, b.population));

export default places;
