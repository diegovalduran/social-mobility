import * as topojson from "topojson-client";
import { json, geoCentroid, csv, scaleLinear } from "d3";
import { base } from "$app/paths";
import stateLookup from "$data/states.csv";

export default async function cleanUSData() {
	const [us, countyData] = await Promise.all([
		json(`${base}/assets/data/counties-10m.json`),
		csv(`${base}src/data/meta/social_capital_county.csv`)
	]);

	const countyLookup = new Map(countyData.map(d => [d.county, {
		...d,
		pop2018: +d.pop2018
	}]));

	const countiesRaw = topojson.feature(us, us.objects.counties);

	const popExtent = [0, Math.max(...countiesRaw.features.map(d => d.properties.population))];
	const popScale = scaleLinear()
		.domain(popExtent)
		.range(["#ffffff", "#333333"]); // Light gray to dark gray

	const counties = {
		...countiesRaw,
		features: countiesRaw.features
			.filter((d) => d.geometry)
			.map((d) => {
				const countyMetrics = countyLookup.get(d.id);
				const population = countyMetrics?.pop2018 || 0;
				return {
					...d,
					properties: {
						...d.properties,
						state: stateLookup.find((s) => s.fips === d.id.substring(0, 2))?.postal,
						centroid: geoCentroid(d),
						population,
						popFill: popScale(population),
						num_below: countyMetrics?.num_below,
						county_name: countyMetrics?.county_name,
					}
				};
			})
			.filter((d) => d.properties.state)
			.filter((d) => d.properties.name !== "Aleutians West")
	};

	const filterAlaska = (feature) => {
		const coordinates = feature.geometry.coordinates.filter(([coords]) => {
			if (coords[0][0] <= -166 && coords[0][1] <= 54) return false;
			else if (coords[0][0] > 0) return false;
			return true;
		});
		return {
			...feature,
			geometry: {
				...feature.geometry,
				coordinates
			}
		};
	};

	const statesRaw = topojson.feature(us, us.objects.states);
	const states = {
		...statesRaw,
		features: statesRaw.features.map((d) => {
			if (d.properties.name === "Alaska") return filterAlaska(d);
			return d;
		})
	};

	const statesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
	const countiesMesh = topojson.mesh(
		us,
		us.objects.counties,
		(a, b) => a !== b && ((a.id / 1000) | 0) === ((b.id / 1000) | 0)
	);

	const nationMesh = topojson.mesh(us, us.objects.nation);

	return { counties, states, countiesMesh, statesMesh, nationMesh };
}
