import fs from "fs";
import {
	color,
	groups,
	scalePow,
	scaleLog,
	csvParse,
	geoPath,
	geoAlbersUsa
} from "d3";
import { createCanvas } from "canvas";

import cleanPlaceData from "../src/data/cleanPlaceData.js";
import addDataToCounties from "../src/data/addDataToCounties.js";
import cleanUSData from "../src/data/cleanUSData.js";

const us = JSON.parse(fs.readFileSync("./src/data/counties-10m.json", "utf8"));
const raw = csvParse(fs.readFileSync("./src/data/raw.csv", "utf8"));
const stateLookup = csvParse(
	fs.readFileSync("./src/data/state-name-abbr.csv", "utf8")
);
const colors = JSON.parse(fs.readFileSync("./src/data/colors2.json", "utf8"));
const { counties, states } = cleanUSData(us);

const places = cleanPlaceData({ raw, stateLookup });

const placeNames = groups(places, (d) => d.name).map((d) => d[0]);

const projectionObject = states;
const statesFeatures = states.features;

let scaleTypePop = "scalePow";
let scaleTypeWiki = "scalePow";
let scaleTypeDist = "scaleLog";
let scaleExpPop = "0.5";
let scaleExpWiki = "0.5";
let scaleExpDist = "1";
let scaleBoundsPop = [0, 1000000];
let scaleBoundsWiki = [0, 150000];
let scaleBoundsDist = [80, 320];
let valueWeightDist = 3;
let valueWeightPop = 1;
let valueWeightWiki = 1;
let scalePop;
let scaleWiki;
let scaleDist;
let valueProp = "share";
let thresholdLower = 0.5;
let thresholdUpper = 0.75;

const sd =
	scaleTypeDist === "scaleLog"
		? scaleLog()
		: scalePow().exponent(+scaleExpDist);
scaleDist = sd.domain(scaleBoundsDist).range([+valueWeightDist, 0]).clamp(true);

const sp =
	scaleTypePop === "scaleLog" ? scaleLog() : scalePow().exponent(+scaleExpPop);
scalePop = sp.domain(scaleBoundsPop).range([0, +valueWeightPop]).clamp(true);

const sw =
	scaleTypeWiki === "scaleLog"
		? scaleLog()
		: scalePow().exponent(+scaleExpWiki);
scaleWiki = sp.domain(scaleBoundsWiki).range([0, +valueWeightWiki]).clamp(true);

const maxValue =
	valueProp === "share"
		? 1
		: +valueWeightDist + +valueWeightPop + +valueWeightWiki;

const w = 975 * 4;
const h = 610 * 4;

const canvas = createCanvas(w, h);
const ctx = canvas.getContext("2d");

const fill = "none";
const stroke = "rgba(0, 0, 0, 0.25)";
const strokeWidth = 1;
const projection = geoAlbersUsa();

const projectionFn = projection.fitSize([w, h], projectionObject);
const pathFn = geoPath().projection(projectionFn);

function getTopScoreFill(data) {
	const match = data[0];
	let c = color(match.fill);
	if (match[valueProp] < thresholdLower * maxValue) {
		c = color("#666");
	}
	if (match[valueProp] < thresholdUpper * maxValue) c.opacity = 0.75;
	else c.opacity = 1;
	// else if (match[valueProp] < thresholdUpper * maxValue) c.opacity = 0.75;
	return c.toString();
}

function getLabel(d) {
	const post =
		d.level === "city-us"
			? `, ${d.stateAbbr}`
			: d.level === "city-international"
			? ` (${d.country})`
			: ` (${d.level})`;
	return `${d.name}${post}`;
}

function drawPath({ path, strokeStyle, fillStyle }) {
	ctx.beginPath();
	pathFn.context(ctx);
	pathFn(path);

	if (strokeStyle) {
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}

	if (fillStyle) {
		ctx.fillStyle = fillStyle;
		ctx.fill();
	}
}

function render(place) {
	return new Promise((resolve, reject) => {
		const samplePhoneme = places.find((d) => d.name === place).phoneme;

		const sample = places
			.filter((d) => d.phoneme === samplePhoneme)
			.map((d, i) => ({
				...d,
				label: getLabel(d),
				className: i > colors.length - 2 ? "hide-label" : "",
				fill: colors[i] || colors[colors.length - 1]
			}));

		const sampleFeatures = sample.map((d, i) => ({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [d.longitude, d.latitude]
			},
			properties: d
		}));

		const countiesWithData = addDataToCounties({
			valueProp,
			counties,
			sample,
			scaleDist,
			scalePop,
			scaleWiki
		});

		const topScoreFeatures = countiesWithData.features.map((d) => ({
			...d,
			properties: {
				...d.properties,
				fill: getTopScoreFill(d.properties.data)
			}
		}));

		ctx.clearRect(0, 0, w, h);
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		// const x = topScoreFeatures.find(
		// 	(d) => d.properties.name === "Berkshire"
		// ).properties;
		// console.log(x);

		topScoreFeatures.forEach((feature) => {
			const { properties } = feature;
			const strokeStyle = properties.stroke || stroke;
			const fillStyle = properties.fill || fill;
			// const fillStyle = randomFill();
			const path = feature;
			drawPath({ path, strokeStyle, fillStyle });
		});

		ctx.font = "24px -apple-system";
		const label = "Holliston, MA";
		ctx.fillStyle = "#000";
		// ctx.fillText(label, 50, 100);

		// Draw line under text
		const {
			actualBoundingBoxAscent,
			actualBoundingBoxDescent,
			actualBoundingBoxLeft,
			actualBoundingBoxRight
		} = ctx.measureText(label);

		const labelW = actualBoundingBoxRight + actualBoundingBoxLeft;
		const labelH = actualBoundingBoxAscent + actualBoundingBoxDescent;
		// console.log(labelW, labelH);

		// replace all non letters with dashes
		const filename = place.toLowerCase().replace(/[^a-z]/gi, "-");
		const out = fs.createWriteStream(`./static/assets/maps/${filename}.png`);
		const stream = canvas.createPNGStream();
		stream.pipe(out);
		out.on("finish", resolve);
	});
}

// loop through placeNames sync, and render each one
console.log(placeNames.length);
for (const place of placeNames.slice(0, 0)) {
	console.time(place);
	await render(place);
	console.timeEnd(place);
}
