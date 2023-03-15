import fs from "fs";
import * as d3 from "d3";
import cleanPlaceData from "./cleanPlaceData.js";
const copy = JSON.parse(fs.readFileSync("./src/data/copy-main.json", "utf8"));

const places = cleanPlaceData();

function makePlaces() {
	const byPhoneme = d3.groups(places, (d) => d.phoneme);

	byPhoneme.forEach(([key, values]) => {
		const copy = values.map((d) => ({ ...d }));
		copy.forEach((d) => delete d.phoneme);
		fs.writeFileSync(`./static/assets/places/${key}.csv`, d3.csvFormat(copy));
	});
}

function makeOptions() {
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
	fs.writeFileSync("./src/data/options.csv", d3.csvFormat(options));
}

function makeCoordinates() {
	const us = places
		.filter((d) => d.level === "city-us")
		.map((d) => ({
			phoneme: d.phoneme,
			name: d.name,
			state: d.state,
			county: d.county,
			latitude: d.latitude,
			longitude: d.longitude
		}));

	d3.groups(us, (d) => d.state).forEach(([state, values]) => {
		const filename = `${state}.csv`;
		const copy = values.map((d) => ({ ...d }));
		copy.forEach((d) => delete d.state);
		fs.writeFileSync(
			`./static/assets/coordinates/${filename}`,
			d3.csvFormat(copy)
		);
	});

	// const gridPoints = gridPointsUS(1).map((d, i) => ({
	// 	id: i,
	// 	latitude: d[0],
	// 	longitude: d[1]
	// }));

	// const nearest = us.map((d) => {
	// 	const distances = gridPoints.map((p) => ({
	// 		...p,
	// 		distance: haversine([d.latitude, d.longitude], [p.latitude, p.longitude])
	// 	}));

	// 	const grid = distances.sort((a, b) =>
	// 		d3.ascending(a.distance, b.distance)
	// 	)[0];

	// 	return {
	// 		...d,
	// 		grid
	// 	};
	// });

	// d3.groups(nearest, (d) => d.grid.id).forEach(([grid, values]) => {
	// 	const filename = `lat${values[0].latitude}lon${values[0].longitude}.csv`;
	// 	const copy = values.map((d) => ({ ...d }));
	// 	copy.forEach((d) => delete d.grid);
	// 	fs.writeFileSync(
	// 		`./static/assets/coordinates/${filename}`,
	// 		d3.csvFormat(copy)
	// 	);
	// });
}

function makeClassics() {
	const classics = copy.classics
		.filter((d) => d)
		.map((name) => ({
			name,
			phoneme: places.find((d) => d.name === name).phoneme
		}));

	fs.writeFileSync("./src/data/classics.csv", d3.csvFormat(classics));
}

function makeStats() {
	const pops = places.map((d) => d.population);
	const wikis = places.map((d) => d.wiki);

	pops.sort(d3.descending);
	wikis.sort(d3.descending);
	const iP = Math.floor(pops.length * 0.001);
	const iW = Math.floor(wikis.length * 0.001);
	console.log(".1 pop all", pops[iP]);
	console.log(".1 wiki all", wikis[iW]);

	// const popsF = pops.filter((d) => d);
	// const wikisF = wikis.filter((d) => d);

	// const indexPA = Math.floor(pops.length * 0.01);
	// const indexWA = Math.floor(wikis.length * 0.01);

	// const indexPC = Math.floor(popsF.length * 0.01);
	// const indexPD = Math.floor(popsF.length * 0.001);
	// const indexWC = Math.floor(wikisF.length * 0.01);
	// const indexWD = Math.floor(wikisF.length * 0.001);

	// console.log("1 pop all", format(",")(pops[indexPA]));
	// console.log("1 pop filtered", format(",")(popsF[indexPC]));
	// console.log(".1 pop filtered", format(",")(popsF[indexPD]));
	// console.log("1 wiki all", format(",")(wikis[indexWA]));
	// console.log("1 wiki filtered", format(",")(wikisF[indexWC]));
	// console.log(".1 wiki filtered", format(",")(wikisF[indexWD]));
}

// makePlaces();
// makeOptions();
// makeCoordinates();
// makeClassics();
makeStats();
