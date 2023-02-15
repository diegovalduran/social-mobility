import * as topojson from "topojson-client";
import stateData from "$data/states.json";

const stateShapesRaw = topojson.feature(stateData, stateData.objects.states);
const states = {
	...stateShapesRaw,
	features: stateShapesRaw.features.filter((d) => d.properties.STATEFP !== "72")
};

export default states;
