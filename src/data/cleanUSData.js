import * as topojson from "topojson-client";
import { geoCentroid } from "d3";

export default function cleanUSData(us) {
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

	return { counties, states };
}
