import * as topojson from "topojson-client";
import { json, csv, geoCentroid } from "d3";
import { base } from "$app/paths";
import stateLookup from "$data/states.csv";

// Add this function to load social capital data
async function loadSocialCapitalData() {
	const data = await csv(`${base}/src/data/meta/social_capital_county.csv`);
	
	// Log sample of raw data to see structure
	console.log('Raw CSV sample:', data.slice(0, 5));
	
	return new Map(data.map(d => {
		const countyId = d.county.padStart(5, '0');
		const ecValue = d.ec_county ? +d.ec_county : 0; // Use ec_county field
		
		// Log any rows with missing ec_county
		if (!d.ec_county) {
			console.log('Row with missing ec_county:', d);
		}
		
		return [countyId, ecValue];
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
				const ecValue = socialCapitalData.get(d.id);
				
				// Log each attempt with more detail
				allAttemptedMatches.push({
					countyId: d.id,
					paddedId: d.id.padStart(5, '0'),
					countyName: d.properties.name,
					state: stateLookup.find((s) => s.fips === d.id.substring(0, 2))?.postal,
					hasMatch: ecValue !== undefined,
					ecValue: ecValue
				});

				if (ecValue !== undefined) {
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
						ecValue: ecValue || 0  // Store ec_county value instead of population
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
