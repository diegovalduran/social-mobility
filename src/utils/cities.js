import { descending } from "d3";
import cityData from "$data/cities.csv";

const cities = cityData.map((d) => ({
	...d,
	population: +d.population,
	latitude: +d.latitude,
	longitude: +d.longitude
}));

cities.sort((a, b) => descending(a.population, b.population));

cities.forEach((d) => {
	delete d.town_matches;
	delete d.state_matches;
	delete d.city_matches;
	delete d.country_matches;
});

export default cities;
