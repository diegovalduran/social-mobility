console.log('[Debug] Module initialization start');

import { json, csv, geoCentroid } from "d3";
import { base } from "$app/paths";
import { dev } from '$app/environment';
import stateLookup from "$data/states.csv";
import * as topojson from "topojson-client";

console.log('[Debug] Initial module load:', {
	base,
	isDev: dev,
	timestamp: new Date().toISOString()
});

async function tryLoadFile(path) {
	console.log(`[Debug] Attempting fetch for: ${path}`);
	try {
		const response = await fetch(path);
		console.log(`[Debug] Fetch response for ${path}:`, {
			status: response.status,
			ok: response.ok,
			contentType: response.headers.get('content-type')
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await csv(path);
		return data;
	} catch (error) {
		console.log(`[Debug] Fetch failed for ${path}:`, {
			error: error.message,
			type: error.name,
			stack: error.stack
		});
		return null;
	}
}

async function loadSocialCapitalData() {
	const path = `${base}/assets/data/meta/social_capital_county.csv`;
	console.log('[Debug] Loading social capital data:', {
		path,
		base,
		fullUrl: typeof window !== 'undefined' ? new URL(path, window.location.href).toString() : path,
		environment: process.env.NODE_ENV
	});

	try {
		const data = await csv(path);
		console.log('[Debug] Successfully loaded social capital data:', {
			path,
			rowCount: data?.length
		});
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
				supportRatioCounty: d.support_ratio_county ? +d.support_ratio_county : 0,
				volunteeringRate: d.volunteering_rate_county ? +d.volunteering_rate_county : 0
			}];
		}));
	} catch (error) {
		console.error('[Debug] Failed to load social capital data:', {
			path,
			error: error.message,
			type: error.name,
			status: error.status
		});
		throw error;
	}
}

async function loadHighSchoolSocialCapitalData() {
	const paths = [
		`${base}/assets/data/meta/social_capital_high_school.csv`
	];
	
	console.log('[Debug] Attempting to load high school data from paths:', paths);
	
	for (const path of paths) {
		try {
			console.log(`[Debug] Trying path: ${path}`);
			const data = await csv(path);
			console.log(`[Debug] Successfully loaded from: ${path}`, {
				rowCount: data?.length,
				firstRow: data?.[0]
			});
			return new Map(data.map(d => {
				const countyId = d.county.padStart(5, '0');
				const stateFips = countyId.substring(0, 2);
				
				return [countyId, {
					high_school_name: d.high_school_name || 'Unknown High School',
					county_id: countyId,
					county: d.county,  
					state_fips: stateFips,  
					ecOwnSesHs: d.ec_own_ses_hs ? +d.ec_own_ses_hs : 0,
					ecParentSesHs: d.ec_parent_ses_hs ? +d.ec_parent_ses_hs : 0,
					ecHighOwnSesHs: d.ec_high_own_ses_hs ? +d.ec_high_own_ses_hs : 0,
					ecHighParentSesHs: d.ec_high_parent_ses_hs ? +d.ec_high_parent_ses_hs : 0,
					exposureOwnSesHs: d.exposure_own_ses_hs ? +d.exposure_own_ses_hs : 0,
					exposureParentSesHs: d.exposure_parent_ses_hs ? +d.exposure_parent_ses_hs : 0,
					students9To12: d.students_9_to_12 ? +d.students_9_to_12 : 0,
					clusteringHs: d.clustering_hs ? +d.clustering_hs : 0,
					volunteeringRateHs: d.volunteering_rate_hs ? +d.volunteering_rate_hs : 0
				}];
			}));
		} catch (error) {
			console.log(`[Debug] Failed to load from: ${path}`, error.message);
		}
	}
	
	throw new Error('Failed to load high school data from all attempted paths');
}

async function loadCollegeSocialCapitalData() {
	const dataPath = `${base}/assets/data/meta/social_capital_college.csv`;
	console.log('[Debug] Loading college data:', {
		path: dataPath,
		base: base,
		fullUrl: typeof window !== 'undefined' ? new URL(dataPath, window.location.href).href : dataPath
	});
	
	try {
		const data = await csv(dataPath);
		console.log('[Debug] Successfully loaded college data:', {
			rowCount: data?.length,
			firstRow: data?.[0]
		});
		return new Map(data.map(d => {
			const countyId = d.county.padStart(5, '0');
			const stateFips = countyId.substring(0, 2);
			
			return [countyId, {
				college_name: d.college_name || 'Unknown College',
				county_id: countyId,
				county: d.county,
				state_fips: stateFips,
				ec_own_ses_college: d.ec_own_ses_college ? +d.ec_own_ses_college : 0,
				ec_parent_ses_college: d.ec_parent_ses_college ? +d.ec_parent_ses_college : 0,
				ec_high_own_ses_college: d.ec_high_own_ses_college ? +d.ec_high_own_ses_college : 0,
				ec_high_parent_ses_college: d.ec_high_parent_ses_college ? +d.ec_high_parent_ses_college : 0,
				bias_own_ses_college: d.bias_own_ses_college ? +d.bias_own_ses_college : 0,
				bias_parent_ses_college: d.bias_parent_ses_college ? +d.bias_parent_ses_college : 0,
				bias_high_own_ses_college: d.bias_high_own_ses_college ? +d.bias_high_own_ses_college : 0,
				bias_high_parent_ses_college: d.bias_high_parent_ses_college ? +d.bias_high_parent_ses_college : 0,
				clustering_college: d.clustering_college ? +d.clustering_college : 0,
				support_ratio_college: d.support_ratio_college ? +d.support_ratio_college : 0,
				volunteering_rate_college: d.volunteering_rate_college ? +d.volunteering_rate_college : 0,
				mean_students_per_cohort: d.mean_students_per_cohort ? +d.mean_students_per_cohort : 0
			}];
		}));
	} catch (error) {
		console.error('[Debug] Error loading college data:', {
			path: dataPath,
			error: error.message,
			fullUrl: typeof window !== 'undefined' ? new URL(dataPath, window.location.href).href : dataPath
		});
		throw error;
	}
}

function filterAlaska(feature) {
	if (!feature.geometry) return feature;
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
	console.log('[Debug] cleanUSData called');
	try {
		throw new Error('Trace error location');
	} catch (e) {
		console.log('[Debug] Call stack:', e.stack);
	}
	
	console.log('[Debug] Starting cleanUSData');
	console.log('[Debug] Base path:', base);
	console.log('[Debug] Attempting to load from:', `${base}/assets/data/counties-10m.json`);
	
	try {
		const [us, socialCapitalData, highSchoolData, collegeData] = await Promise.all([
			json(`${base}/assets/data/counties-10m.json`),
			loadSocialCapitalData(),
			loadHighSchoolSocialCapitalData(),
			loadCollegeSocialCapitalData()
		]);
		
		console.log('[Debug] Successfully loaded:', {
			us: !!us,
			socialCapitalData: !!socialCapitalData,
			highSchoolData: !!highSchoolData,
			collegeData: !!collegeData
		});

		const processedHighSchoolData = Array.from(highSchoolData.values()).map(school => {
			const state = stateLookup.find(s => s.fips === school.state_fips);
			return {
				...school,
				state: state?.postal || 'Unknown',
				state_name: state?.name || 'Unknown',
				institution_type: 'high_school'
			};
		});

		const processedCollegeData = Array.from(collegeData.values()).map(college => {
			const state = stateLookup.find(s => s.fips === college.state_fips);
			return {
				...college,
				state: state?.postal || 'Unknown',
				state_name: state?.name || 'Unknown',
				institution_type: 'college'
			};
		});

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
					const highSchoolDataEntry = processedHighSchoolData.find(s => s.county_id === d.id);

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
						clusteringHs: highSchoolDataEntry?.clusteringHs || 0,
						volunteeringRateHs: highSchoolDataEntry?.volunteeringRateHs || 0
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
							supportRatioCounty: data?.supportRatioCounty || 0,
							volunteeringRate: data?.volunteeringRate || 0,
							ecOwnSesHs: highSchoolDataEntry?.ecOwnSesHs || 0,
							ecParentSesHs: highSchoolDataEntry?.ecParentSesHs || 0,
							ecHighOwnSesHs: highSchoolDataEntry?.ecHighOwnSesHs || 0,
							ecHighParentSesHs: highSchoolDataEntry?.ecHighParentSesHs || 0,
							exposureOwnSesHs: highSchoolDataEntry?.exposureOwnSesHs || 0,
							exposureParentSesHs: highSchoolDataEntry?.exposureParentSesHs || 0,
							students9To12: highSchoolDataEntry?.students9To12 || 0,
							clusteringHs: highSchoolDataEntry?.clusteringHs || 0,
							volunteeringRateHs: highSchoolDataEntry?.volunteeringRateHs || 0
						}
					};
				})
				.filter((d) => d.properties.state)
				.filter((d) => d.properties.name !== "Aleutians West")
		};

		const ecValues = counties.features.map(d => d.properties.ecValue).filter(v => v !== undefined);

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

		return { 
			counties, 
			states, 
			countiesMesh, 
			statesMesh, 
			nationMesh, 
			highSchoolData: processedHighSchoolData,
			collegeData: processedCollegeData 
		};
	} catch (error) {
		console.error('[Debug] Error in cleanUSData:', {
			error,
			message: error.message,
			stack: error.stack
		});
		throw error;
	}
}