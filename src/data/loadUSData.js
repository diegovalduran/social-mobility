import * as topojson from "topojson-client";
import { json, csv, geoCentroid } from "d3";
import { base } from "$app/paths";
import stateLookup from "$data/states.csv";

// Add this function to load social capital data
async function loadSocialCapitalData() {
	const data = await csv(`${base}/src/data/meta/social_capital_county.csv`);
	
	// Add debug logging to verify data structure
	console.log('Raw CSV sample:', data.slice(0, 3));
	
	return new Map(data.map(d => {
		const countyId = d.county.padStart(5, '0');
		return [countyId, {
			ecValue: d.ec_county ? +d.ec_county : 0,
			population: d.pop2018 ? +d.pop2018 : 0
		}];
	}));
}

// Add this function to handle Alaska
function filterAlaska(feature) {
	// Simple pass-through if no geometry
	if (!feature.geometry) return feature;
	
	// Filter out certain Alaska regions we don't want to show
	const coordinates = feature.geometry.coordinates.filter((d, i) => i !== 0);
	
	return {
		...feature,
		geometry: {
			...feature.geometry,
			coordinates
		}
	};
}

export default async function cleanUSData() {
	const [us, socialCapitalData] = await Promise.all([
		json(`${base}/assets/data/counties-10m.json`),
		loadSocialCapitalData()
	]);

	const countiesRaw = topojson.feature(us, us.objects.counties);
	
	let matchCount = 0;
	let noMatchCount = 0;
	const noMatches = [];
	const allAttemptedMatches = [];

	const counties = {
		...countiesRaw,
		features: countiesRaw.features
			.filter((d) => d.geometry)
			.map((d) => {
				const data = socialCapitalData.get(d.id);
				
				// Log each attempt with more detail
				allAttemptedMatches.push({
					countyId: d.id,
					paddedId: d.id.padStart(5, '0'),
					countyName: d.properties.name,
					state: stateLookup.find((s) => s.fips === d.id.substring(0, 2))?.postal,
					hasMatch: data !== undefined,
					ecValue: data?.ecValue || 0,
					population: data?.population || 0
				});

				if (data !== undefined) {
					matchCount++;
				} else {
					noMatchCount++;
					noMatches.push({
						id: d.id,
						paddedId: d.id.padStart(5, '0'),
						name: d.properties.name,
						state: stateLookup.find((s) => s.fips === d.id.substring(0, 2))?.postal
					});
				}

				return {
					...d,
					properties: {
						...d.properties,
						state: stateLookup.find((s) => s.fips === d.id.substring(0, 2))?.postal,
						centroid: geoCentroid(d),
						ecValue: data?.ecValue || 0,
						population: data?.population || 0
					}
				};
			})
			.filter((d) => d.properties.state)
			.filter((d) => d.properties.name !== "Aleutians West")
	};

	console.log('Match statistics:');
	console.log('Total counties processed:', matchCount + noMatchCount);
	console.log('Matches found:', matchCount);
	console.log('No matches found:', noMatchCount);
	
	// Log min and max ec values to verify scale
	const ecValues = counties.features.map(d => d.properties.ecValue).filter(v => v !== undefined);
	console.log('EC Value range:', {
		min: Math.min(...ecValues),
		max: Math.max(...ecValues)
	});

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
