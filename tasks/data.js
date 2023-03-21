import fs from "fs";
import * as d3 from "d3";
import cleanPlaceData from "./cleanPlaceData.js";
const copy = JSON.parse(fs.readFileSync("./src/data/copy-main.json", "utf8"));

const places = cleanPlaceData();

function makeChangelog() {
	const prevChangelog = d3.csvParse(
		fs.readFileSync("./src/data/places-changelog.csv", "utf8")
	);

	const prevPlaces = JSON.parse(
		fs.readFileSync("./src/data/places-latest.json", "utf8")
	);

	const changed = places
		.map((newD) => {
			const oldD = prevPlaces.find((p) => p.id === newD.id) || {};
			const diffs = Object.keys(newD)
				.filter((d) => d !== "phoneme")
				.filter((prop) => newD[prop] !== oldD[prop]);
			return diffs.length ? { newD, oldD, diffs } : undefined;
		})
		.filter((d) => d);

	const getPlaceName = ({ name, county, state, country }) => {
		const parts = [name];
		if (county) parts.push(county);
		if (state) parts.push(state);
		if (country) parts.push(country);
		return parts.join(", ");
	};

	const date = new Date().toISOString().slice(0, 10);

	const newChangelog = changed.map(({ newD, oldD, diffs }) => {
		const place = getPlaceName(newD);
		const changes = oldD
			? diffs.map((d) => {
					const old = oldD[d];
					const new_ = newD[d];
					return `[${d}] ${old} => ${new_}`;
			  })
			: ["place added"];

		const changeText = diffs.length > 4 ? "place added" : changes.join(" | ");

		return { date, text: `${place}:  ${changeText}` };
	});

	const removedChangelog = prevPlaces
		.filter((d) => !places.find((p) => p.id === d.id))
		.map((d) => {
			const place = getPlaceName(d);
			return { date, text: `${place}: place removed` };
		});

	const changelog = [...prevChangelog, ...newChangelog, ...removedChangelog];

	fs.writeFileSync("./src/data/places-latest.json", JSON.stringify(places));
	fs.writeFileSync("./src/data/places-changelog.csv", d3.csvFormat(changelog));
}

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
}

makeChangelog();
makePlaces();
makeOptions();
makeCoordinates();
makeClassics();
makeStats();
