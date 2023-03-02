import fs from "fs";
import * as d3 from "d3";
import cleanPlaceData from "../src/data/cleanPlaceData.js";
const raw = d3.csvParse(fs.readFileSync("./src/data/raw.csv", "utf8"));
const stateLookup = d3.csvParse(
	fs.readFileSync("./src/data/state-name-abbr.csv", "utf8")
);

const places = cleanPlaceData({ raw, stateLookup });
const byPhoneme = d3.groups(places, (d) => d.phoneme);

byPhoneme.forEach(([key, values]) => {
	values.forEach((d) => delete d.phoneme);
	fs.writeFileSync(`./static/assets/places/${key}.csv`, d3.csvFormat(values));
});
