import * as topojson from "topojson-client";
import { geoCentroid } from "d3";
import us from "$data/counties-10m.json";

const countyShapesRaw = topojson.feature(us, us.objects.counties);

const counties = {
	...countyShapesRaw,
	features: countyShapesRaw.features.map((d) => ({
		...d,
		properties: {
			...d.properties,
			centroid: geoCentroid(d)
		}
	}))
};

const states = topojson.feature(us, us.objects.states);
// const nation = topojson.feature(us, us.objects.nation);

export { counties, states };
