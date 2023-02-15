import * as topojson from "topojson-client";
import { geoCentroid } from "d3";
import countyData from "$data/cb_2021_us_county_20m.json";

const countyShapesRaw = topojson.feature(
	countyData,
	countyData.objects.cb_2021_us_county_20m
);

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
export default counties;
