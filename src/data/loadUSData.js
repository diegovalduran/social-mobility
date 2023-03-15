import * as topojson from "topojson-client";
import { json, geoCentroid } from "d3";
import { base } from "$app/paths";
import stateLookup from "$data/states.csv";

export default async function cleanUSData() {
	const us = await json(`${base}/assets/data/counties-10m.json`);

	const countiesRaw = topojson.feature(us, us.objects.counties);

	const counties = {
		...countiesRaw,
		features: countiesRaw.features
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

	// const cleanAlaska = (d) => {
	// 	const arcs = d.arcs.filter(([[c]]) => {
	// 		return false;
	// 		return true;
	// 	});
	// 	console.log(arcs);
	// 	return {
	// 		...d,
	// 		arcs: []
	// 	};
	// };

	// const usObjectsStates = {
	// 	...us.objects.states,
	// 	geometries: us.objects.states.geometries.filter((d) => {
	// 		if (d.properties.name === "Alaska") {
	// 			const x = cleanAlaska(d);
	// 			console.log({ x });
	// 			return {
	// 				...d,
	// 				arcs: []
	// 			};
	// 		}
	// 		return true;
	// 	})
	// };

	// const usa = {
	// 	...us,
	// 	objects: {
	// 		...us.objects,
	// 		states: usObjectsStates
	// 	}
	// };

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
