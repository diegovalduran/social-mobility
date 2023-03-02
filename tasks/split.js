import fs from "fs";
import * as d3 from "d3";
import cleanPlaceData from "../src/data/cleanPlaceData.js";
const raw = d3.csvParse(fs.readFileSync("./src/data/raw.csv", "utf8"));
const stateLookup = d3.csvParse(
	fs.readFileSync("./src/data/state-name-abbr.csv", "utf8")
);

const places = cleanPlaceData({ raw, stateLookup });
const byPhoneme = d3.groups(places, (d) => d.phoneme);

// byPhoneme.forEach(([key, values]) => {
// 	values.forEach((d) => delete d.phoneme);
// 	fs.writeFileSync(`./static/assets/places/${key}.csv`, d3.csvFormat(values));
// });

const us = places
	.filter((d) => d.level === "city-us")
	.map((d) => ({
		phoneme: d.phoneme,
		name: d.name,
		state: d.state,
		latitude: d.latitude,
		longitude: d.longitude
	}));

const options = d3
	.groups(
		places.filter((d) => d.level === "city-us"),
		(d) => d.name
	)
	.map(([name, values]) => ({
		name,
		phoneme: values[0].phoneme
	}));

options.sort((a, b) => d3.ascending(a.name, b.name));

// geolocation files (by state?)

fs.writeFileSync("./src/data/options.csv", d3.csvFormat(options));
