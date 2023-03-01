import fs from "fs";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { createCanvas } from "canvas";

const colors = [
	"#d9636c",
	"#869e80",
	"#dec367",
	"#85aab1",
	"#ed8238",
	"#ab90a4"
];

const us = JSON.parse(fs.readFileSync("./src/data/counties-10m.json", "utf8"));

const countyShapesRaw = topojson.feature(us, us.objects.counties);

const counties = {
	...countyShapesRaw,
	features: countyShapesRaw.features.map((d) => ({
		...d,
		properties: {
			...d.properties,
			centroid: d3.geoCentroid(d)
		}
	}))
};

const states = topojson.feature(us, us.objects.states);

const w = 975 * 1;
const h = 610 * 1;

const canvas = createCanvas(w, h);
const ctx = canvas.getContext("2d");

const features = [];
const fill = "none";
const stroke = "#000";
const strokeWidth = 1;
const projection = d3.geoAlbersUsa();

const projectionFn = projection.fitSize([w, h], states);
const pathFn = d3.geoPath().projection(projectionFn);

function randomFill() {
	return colors[Math.floor(Math.random() * colors.length)];
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

ctx.lineJoin = "round";
ctx.lineCap = "round";

counties.features.forEach((feature) => {
	const { properties } = feature;
	const strokeStyle = properties.stroke || stroke;
	// const fillStyle = properties.fill || fill;
	const fillStyle = randomFill();
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
console.log(labelW, labelH);

const out = fs.createWriteStream("test.png");
const stream = canvas.createPNGStream({ compressionLevel: 1 });
stream.pipe(out);
out.on("finish", async () => {
	// Convert any input to lossless WebP output
});
