import * as topojson from "topojson-client";
import { geoCentroid } from "d3";

export default function cleanUSData({ us, stateLookup }) {
	const countyShapesRaw = topojson.feature(us, us.objects.counties);

	const counties = {
		...countyShapesRaw,
		features: countyShapesRaw.features
			.map((d) => ({
				...d,
				properties: {
					...d.properties,
					state: stateLookup.find((s) => s.fips === d.id.substring(0, 2))
						?.postal,
					centroid: geoCentroid(d)
				}
			}))
			.filter((d) => d.properties.state)
			.filter((d) => d.properties.name !== "Aleutians West")
	};

	const states = topojson.feature(us, us.objects.states);
	// const nation = topojson.feature(us, us.objects.nation);

	return { counties, states };
}
