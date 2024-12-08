import * as topojson from "topojson-client";
import { json, csv, geoCentroid } from "d3";
import { base } from "$app/paths";
import stateLookup from "$data/states.csv";

// Add this function to load social capital data
async function loadSocialCapitalData() {
	const data = await csv(`${base}/src/data/meta/social_capital_county.csv`);
	console.log('Loaded social capital data:', data.slice(0, 3));
	
	return new Map(data.map(d => {
		const countyId = d.county.padStart(5, '0');
		return [countyId, {
			ecValue: d.ec_county ? +d.ec_county : 0,
			population: d.pop2018 ? +d.pop2018 : 0,
			childEcValue: d.child_ec_county ? +d.child_ec_county : 0,
			exposureGrpMem: d.exposure_grp_mem_county ? +d.exposure_grp_mem_county : 0,
			biasGrpMem: d.bias_grp_mem_county ? +d.bias_grp_mem_county : 0,
			ecHigh: d.ec_high_county ? +d.ec_high_county : 0,
			childHighEc: d.child_high_ec_county ? +d.child_high_ec_county : 0,
			exposureGrpMemHigh: d.exposure_grp_mem_high_county ? +d.exposure_grp_mem_high_county : 0,
			biasGrpMemHigh: d.bias_grp_mem_high_county ? +d.bias_grp_mem_high_county : 0,
			numBelowP50: d.num_below_p50 ? +d.num_below_p50 : 0,
			clusteringCounty: d.clustering_county ? +d.clustering_county : 0,
			volunteeringRate: d.volunteering_rate_county ? +d.volunteering_rate_county : 0
		}];
	}));
}

// Add this function to load high school social capital data
async function loadHighSchoolSocialCapitalData() {
	const data = await csv(`${base}/src/data/meta/social_capital_high_school.csv`);
	console.log('Loaded high school social capital data:', data.slice(0, 3));
	
	return new Map(data.map(d => {
		const countyId = d.county.padStart(5, '0');
		return [countyId, {
			high_school_name: d.high_school_name || 'Unknown High School',
			ecOwnSesHs: d.ec_own_ses_hs ? +d.ec_own_ses_hs : 0,
			ecParentSesHs: d.ec_parent_ses_hs ? +d.ec_parent_ses_hs : 0,
			ecHighOwnSesHs: d.ec_high_own_ses_hs ? +d.ec_high_own_ses_hs : 0,
			ecHighParentSesHs: d.ec_high_parent_ses_hs ? +d.ec_high_parent_ses_hs : 0,
			exposureOwnSesHs: d.exposure_own_ses_hs ? +d.exposure_own_ses_hs : 0,
			exposureParentSesHs: d.exposure_parent_ses_hs ? +d.exposure_parent_ses_hs : 0,
			students9To12: d.students_9_to_12 ? +d.students_9_to_12 : 0,
			clusteringHs: d.clustering_hs ? +d.clustering_hs : 0
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
	const [us, socialCapitalData, highSchoolData] = await Promise.all([
		json(`${base}/assets/data/counties-10m.json`),
		loadSocialCapitalData(),
		loadHighSchoolSocialCapitalData()
	]);

	// Log to verify highSchoolData structure
	console.log('High School Data Loaded:', highSchoolData);

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
				const highSchoolDataEntry = highSchoolData.get(d.id);

				// Log each attempt with more detail
				allAttemptedMatches.push({
					countyId: d.id,
					paddedId: d.id.padStart(5, '0'),
					countyName: d.properties.name,
					state: stateLookup.find((s) => s.fips === d.id.substring(0, 2))?.postal,
					hasMatch: data !== undefined,
					ecValue: data?.ecValue || 0,
					population: data?.population || 0,
					ecOwnSesHs: highSchoolDataEntry?.ecOwnSesHs || 0,
					ecParentSesHs: highSchoolDataEntry?.ecParentSesHs || 0,
					ecHighOwnSesHs: highSchoolDataEntry?.ecHighOwnSesHs || 0,
					ecHighParentSesHs: highSchoolDataEntry?.ecHighParentSesHs || 0,
					exposureOwnSesHs: highSchoolDataEntry?.exposureOwnSesHs || 0,
					exposureParentSesHs: highSchoolDataEntry?.exposureParentSesHs || 0,
					students9To12: highSchoolDataEntry?.students9To12 || 0,
					clusteringHs: highSchoolDataEntry?.clusteringHs || 0
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
						population: data?.population || 0,
						childEcValue: data?.childEcValue || 0,
						exposureGrpMem: data?.exposureGrpMem || 0,
						biasGrpMem: data?.biasGrpMem || 0,
						ecHigh: data?.ecHigh || 0,
						childHighEc: data?.childHighEc || 0,
						exposureGrpMemHigh: data?.exposureGrpMemHigh || 0,
						biasGrpMemHigh: data?.biasGrpMemHigh || 0,
						numBelowP50: data?.numBelowP50 || 0,
						clusteringCounty: data?.clusteringCounty || 0,
						volunteeringRate: data?.volunteeringRate || 0,
						ecOwnSesHs: highSchoolDataEntry?.ecOwnSesHs || 0,
						ecParentSesHs: highSchoolDataEntry?.ecParentSesHs || 0,
						ecHighOwnSesHs: highSchoolDataEntry?.ecHighOwnSesHs || 0,
						ecHighParentSesHs: highSchoolDataEntry?.ecHighParentSesHs || 0,
						exposureOwnSesHs: highSchoolDataEntry?.exposureOwnSesHs || 0,
						exposureParentSesHs: highSchoolDataEntry?.exposureParentSesHs || 0,
						students9To12: highSchoolDataEntry?.students9To12 || 0,
						clusteringHs: highSchoolDataEntry?.clusteringHs || 0
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

	return { counties, states, countiesMesh, statesMesh, nationMesh, highSchoolData };
}