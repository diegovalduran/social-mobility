<script>
	import {
		ascending,
		descending,
		format,
		max,
		groups,
		scalePow,
		scaleLog,
		color,
		scaleLinear,
		geoPath,
		interpolateRgb
	} from "d3";
	import { getContext } from "svelte";
	import Figure from "$components/Figure.svelte";
	import MapSvg from "$components/Figure.MapSvg.svelte";
	import MapPath from "$components/Figure.MapPath.svelte";
	import MapPoints from "$components/Figure.MapPoints.svelte";
	import Tooltip from "$components/Figure.Tooltip.svelte";
	import TooltipContent from "$components/TooltipContent.svelte";
	import addDataToCounties from "$data/addDataToCounties.js";
	import mq from "$stores/mq.js";

	export let story = false;
	export let counties;
	export let states;
	export let countiesMesh;
	export let statesMesh;
	export let nationMesh;

	export let placeData;
	export let placeName;

	export let scaleTypePop = "scalePow";
	export let scaleTypeWiki = "scalePow";
	export let scaleTypeDist = "scaleLog";

	export let scaleExpPop = "0.67";
	export let scaleExpWiki = "0.67";
	export let scaleExpDist = "1";

	export let scaleBoundsPop = [0, 22244823];
	export let scaleBoundsWiki = [0, 96685];
	export let scaleBoundsDist = [50, 300];

	export let valueWeightDist = "2";
	export let valueWeightPop = "1";
	export let valueWeightWiki = "1";

	export let thresholdLower = 0.05;
	export let thresholdUpper = 0.2;
	export let valueProp = "shareDelta";
	export let valueScale = "yes";

	export let countiesByDist = [];

	const ASPECT_RATIO = "2600/1400";
	const projectionObject = states;

	const countyStroke = color(COLOR_FG).copy({ opacity: 0.5 }).toString();

	let colors = [];
	let scalePop;
	let scaleWiki;
	let scaleDist;
	let tooltipDatum = { text: null, x: 0, y: 0 };
	let waiting;
	let displayName;
	let activeFeatures = [];


	const COLOR_BG = "#ffffff";
	const COLOR_FG = "#333333";
	const COLOR_OTHER = "#cccccc"; 
	const MAX_COLORS = 3; 

	const colorScale = ['#2D1160', '#7B2F8F', '#B7367A', '#E34B60', '#FFD700'];

	export let activeMode = "EC";  
	export let activeCountyMode = "OFF";  


	const scaleRanges = {
		"EC": [0.2946900, 1.3597],
		"CHILD_EC": [0.22188, 1.61136],
		"EXPOSURE_GRP_MEM": [0.2552, 1.48628],
		"BIAS_GRP_MEM": [-0.10809, 0.33456999],
		
		"EC_HIGH": [0.70062, 1.71507],
		"CHILD_HIGH_EC": [0.24529999, 1.69122],
		"EXPOSURE_GRP_MEM_HIGH": [0.51012999, 1.66616],
		"BIAS_GRP_MEM_HIGH": [-0.53618002, -0.043249998]
	};

	$: COLOR_SCALE = (value) => {
		if (!value || isNaN(value)) return '#cccccc'; 
		
		const [min, max] = scaleRanges[activeMode] || [0, 1];
		const normalizedValue = (value - min) / (max - min);
		
		return scaleLinear()
			.domain([0, 0.25, 0.5, 0.75, 1])
			.range(colorScale)
			.interpolate(interpolateRgb) 
			.clamp(true)
			(normalizedValue);
	};

	$: CENTROID_SCALE = (() => {
		if (!stateAggregations) return scaleLog().domain([1, 100]).range([4, 25]);
		
		const values = Object.values(stateAggregations)
			.map(d => {
				if (activeCountyMode === "POP2018") return d.population || 1;
				if (activeCountyMode === "NUM_BELOW_P50") return d.numBelowP50 || 1;
				if (activeCountyMode === "CLUSTERING") return d.clusteringAvg || 0;
				if (activeCountyMode === "VOLUNTEERING") return d.volunteeringAvg || 0;
				return 1;
			})
			.filter(v => v > 0);
		
		const minVal = Math.min(...values);
		const maxVal = Math.max(...values);
		
		if (activeCountyMode === "CLUSTERING" || activeCountyMode === "VOLUNTEERING") {
			return scaleLinear()
				.domain([minVal, maxVal])
				.range([4, 25])
				.clamp(true);
		} else {
			return scaleLog()
				.domain([minVal, maxVal])
				.range([2, 25])
				.clamp(true);
		}
	})();

	const stateNameToAbbrev = {
		'Alabama': 'AL',
		'Alaska': 'AK',
		'Arizona': 'AZ',
		'Arkansas': 'AR',
		'California': 'CA',
		'Colorado': 'CO',
		'Connecticut': 'CT',
		'Delaware': 'DE',
		'District of Columbia': 'DC',
		'Florida': 'FL',
		'Georgia': 'GA',
		'Hawaii': 'HI',
		'Idaho': 'ID',
		'Illinois': 'IL',
		'Indiana': 'IN',
		'Iowa': 'IA',
		'Kansas': 'KS',
		'Kentucky': 'KY',
		'Louisiana': 'LA',
		'Maine': 'ME',
		'Maryland': 'MD',
		'Massachusetts': 'MA',
		'Michigan': 'MI',
		'Minnesota': 'MN',
		'Mississippi': 'MS',
		'Missouri': 'MO',
		'Montana': 'MT',
		'Nebraska': 'NE',
		'Nevada': 'NV',
		'New Hampshire': 'NH',
		'New Jersey': 'NJ',
		'New Mexico': 'NM',
		'New York': 'NY',
		'North Carolina': 'NC',
		'North Dakota': 'ND',
		'Ohio': 'OH',
		'Oklahoma': 'OK',
		'Oregon': 'OR',
		'Pennsylvania': 'PA',
		'Rhode Island': 'RI',
		'South Carolina': 'SC',
		'South Dakota': 'SD',
		'Tennessee': 'TN',
		'Texas': 'TX',
		'Utah': 'UT',
		'Vermont': 'VT',
		'Virginia': 'VA',
		'Washington': 'WA',
		'West Virginia': 'WV',
		'Wisconsin': 'WI',
		'Wyoming': 'WY'
	};

	function getLabel(d) {
		const isCity = d.level === "city-us";
		const county =
			isCity && stateLookup[`${d.name}${d.state}`] > 1 ? ` (${d.county})` : "";
		const post = isCity
			? `, ${d.state}${county}`
			: d.level === "city-international"
			? ` (${d.country})`
			: ` (${d.level})`;

		return `${d.name}${post}`;
	}

	function onMouseLeave() {
		activeFeatures = [];
		tooltipDatum.text = undefined;
	}

	function onMouseMove(e) {
		tooltipDatum.x = e.offsetX;
		tooltipDatum.y = e.offsetY;
	}

	function onMouseEnter({ detail }) {
		const { feature } = detail;
		const { name, state } = feature.properties;
		
		let displayValue;
		if (activeMode === "EC") {
			displayValue = `EC Score: ${(feature.properties.ecValue || 0).toFixed(2)}`;
		} else if (activeMode === "CHILD_EC") {
			displayValue = `Child EC: ${(feature.properties.childEcValue || 0).toFixed(2)}`;
		} else if (activeMode === "EXPOSURE_GRP_MEM") {
			displayValue = `Exposure Group: ${(feature.properties.exposureGrpMem || 0).toFixed(2)}`;
		} else if (activeMode === "BIAS_GRP_MEM") {
			displayValue = `Bias Group: ${(feature.properties.biasGrpMem || 0).toFixed(2)}`;
		} else if (activeMode === "EC_HIGH") {
			displayValue = `EC High: ${(feature.properties.ecHigh || 0).toFixed(2)}`;
		} else if (activeMode === "CHILD_HIGH_EC") {
			displayValue = `Child High EC: ${(feature.properties.childHighEc || 0).toFixed(2)}`;
		} else if (activeMode === "EXPOSURE_GRP_MEM_HIGH") {
			displayValue = `Exposure Group High: ${(feature.properties.exposureGrpMemHigh || 0).toFixed(2)}`;
		} else if (activeMode === "BIAS_GRP_MEM_HIGH") {
			displayValue = `Bias Group High: ${(feature.properties.biasGrpMemHigh || 0).toFixed(2)}`;
		} else if (activeMode === "NUM_BELOW_P50") {
			displayValue = `Below P50: ${(feature.properties.numBelowP50 || 0).toLocaleString()}`;
		} else if (activeMode === "CLUSTERING") {
			displayValue = `Clustering: ${(feature.properties.clusteringCounty || 0).toFixed(3)}`;
		} else if (activeMode === "VOLUNTEERING") {
			displayValue = `Volunteering Rate: ${(feature.properties.volunteering_rate_county || 0).toFixed(3)}`;
		} else {
			displayValue = `Population: ${(feature.properties.population || 0).toLocaleString()}`;
		}
		
		tooltipDatum.text = `${name}, ${state} (${displayValue})`;
		activeFeatures = [feature];
	}

	$: stateTally = groups(
		placeData.filter((d) => d.level === "city-us"),
		(d) => `${d.name}${d.state}`
	).map(([key, values]) => ({
		key,
		count: values.length
	}));

	$: stateLookup = stateTally.reduce((prev, d) => {
		prev[d.key] = d.count;
		return prev;
	}, {});

	$: places = placeData.map((d, i) => ({
		...d,
		i,
		population: +d.population,
		wiki: +d.wiki,
		latitude: +d.latitude,
		longitude: +d.longitude,
		label: getLabel(d)
	}));

	$: placeFeatures = places.map((d) => ({
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [d.longitude, d.latitude]
		},
		properties: d
	}));

	$: maxValue =
		valueScale === "no"
			? 1
			: max(countiesWithData.features, (d) => d.properties.data[0][valueProp]);

	$: getTier = (d) => {
		if (d[valueProp] < thresholdLower * maxValue) return 0;
		else if (d[valueProp] < thresholdUpper * maxValue) return 1;
		return 2;
	};

	$: {
		const sd =
			scaleTypeDist === "scaleLog"
				? scaleLog()
				: scalePow().exponent(+scaleExpDist);
		scaleDist = sd
			.domain(scaleBoundsDist)
			.range([+valueWeightDist, 0])
			.clamp(true);

		const sp =
			scaleTypePop === "scaleLog"
				? scaleLog()
				: scalePow().exponent(+scaleExpPop);
		scalePop = sp
			.domain(scaleBoundsPop)
			.range([0, +valueWeightPop])
			.clamp(true);

		const sw =
			scaleTypeWiki === "scaleLog"
				? scaleLog()
				: scalePow().exponent(+scaleExpWiki);
		scaleWiki = sw
			.domain(scaleBoundsWiki)
			.range([0, +valueWeightWiki])
			.clamp(true);
	}

	$: countiesWithData = addDataToCounties({
		counties,
		places,
		scaleDist,
		scalePop,
		scaleWiki
	});

	$: countyFeatures = countiesWithData.features.map((d) => ({
		...d,
		properties: {
			...d.properties,
			topLabel: d.properties.data[0].label,
			topTier: getTier(d.properties.data[0])
		}
	}));

	$: topPlaces = countyFeatures.map((d) => ({
		label: d.properties.topLabel,
		tier: d.properties.topTier
	}));

	$: byLabel = groups(topPlaces, (d) => d.label);

	$: tally = byLabel.map(([label, values]) => ({
		label,
		count: values.filter((v) => v.tier).length,
		countPrimary: values.filter((v) => v.tier === 2).length,
		countSecondary: values.filter((v) => v.tier === 1).length
	}));

	$: {
		tally.sort((a, b) => descending(a.count, b.count));
		tally = [...tally];
	}

	$: order = new Map(tally.map((d, i) => [d.label, i]));

	$: placeFeaturesWithOrder = placeFeatures.map((d) => ({
		...d,
		properties: {
			...d.properties,
			order: order.get(d.properties.label) || Infinity
		}
	}));

	$: {
		placeFeaturesWithOrder.sort((a, b) =>
			ascending(a.properties.order, b.properties.order)
		);
		placeFeaturesWithOrder = [...placeFeaturesWithOrder];
	}

	$: placeFeaturesRender = placeFeaturesWithOrder.map((d) => {
		const match = tally.find((t) => t.label === d.properties.label);
		return {
			...d,
			properties: {
				...d.properties,
				...match,
				fills: {
					primary: COLOR_BG,
					secondary: COLOR_BG,
					textPrimary: COLOR_FG,
					textSecondary: COLOR_FG
				},
				fill: COLOR_BG
			}
		};
	});

	$: if (activeMode) {
		countyFeaturesRender = countyFeatures.map(d => {
			let value;
			
			if (activeCountyMode !== "OFF") {
				value = activeCountyMode === "POP2018" 
					? d.properties.population
					: activeCountyMode === "NUM_BELOW_P50"
					? d.properties.numBelowP50
					: activeCountyMode === "CLUSTERING"
					? d.properties.clusteringCounty
					: activeCountyMode === "VOLUNTEERING"
					? d.properties.volunteering_rate_county
					: null;
			} else {
				value = activeMode === "EC" 
					? d.properties.ecValue
					: activeMode === "CHILD_EC"
					? d.properties.childEcValue
					: activeMode === "EXPOSURE_GRP_MEM"
					? d.properties.exposureGrpMem
					: activeMode === "BIAS_GRP_MEM"
					? d.properties.biasGrpMem
					: activeMode === "EC_HIGH"
					? d.properties.ecHigh
					: activeMode === "CHILD_HIGH_EC"
					? d.properties.childHighEc
					: activeMode === "EXPOSURE_GRP_MEM_HIGH"
					? d.properties.exposureGrpMemHigh
					: activeMode === "BIAS_GRP_MEM_HIGH"
					? d.properties.biasGrpMemHigh
					: activeMode === "NUM_BELOW_P50"
					? d.properties.numBelowP50
					: activeMode === "CLUSTERING"
					? d.properties.clusteringCounty
					: activeMode === "VOLUNTEERING"
					? d.properties.volunteering_rate_county
					: d.properties.population;
			}

			return {
				...d,
				properties: {
					...d.properties,
					fill: COLOR_SCALE(value || 0)
				}
			};
		});
	}

	$: countyRows = countyFeaturesRender.map((d) => {
		const a = d.properties.data[0];
		const b = d.properties.data[1];

		const match = countiesByDist.find((c) => c.id === d.id);
		const index = match?.index;
		const style =
			match?.index === 0 ? "background: var(--cat-toss-primary);" : "";
		return {
			name: d.properties.name,
			state: d.properties.state,
			label1: a.label,
			label2: b.label,
			margin: +format(".0f")((a[valueProp] - b[valueProp]) * 100),
			index,
			style
		};
	});

	$: {
		countyRows.sort(
			(a, b) => ascending(a.index, b.index) || ascending(a.name, b.name)
		);
		countyRows = [...countyRows];
	}

	$: topPlace = placeFeaturesRender[0].properties;
	$: figcaption = ``;

	$: topLabel = topPlace.label;
	$: placeName, (waiting = true);
	$: topLabel, (waiting = false);
	$: if (!waiting) displayName = placeName;

	$: {
		if (activeMode) {
			countyFeaturesRender = countyFeatures.map(d => ({
				...d,
				properties: {
					...d.properties,
					fill: activeMode === "EC" 
						? COLOR_SCALE(d.properties.ecValue || 0)
						: activeMode === "CHILD_EC"
						? COLOR_SCALE(d.properties.childEcValue || 0)
						: activeMode === "EXPOSURE_GRP_MEM"
						? COLOR_SCALE(d.properties.exposureGrpMem || 0)
						: activeMode === "BIAS_GRP_MEM"
						? COLOR_SCALE(d.properties.biasGrpMem || 0)
						: activeMode === "EC_HIGH"
						? COLOR_SCALE(d.properties.ecHigh || 0)
						: activeMode === "CHILD_HIGH_EC"
						? COLOR_SCALE(d.properties.childHighEc || 0)
						: activeMode === "EXPOSURE_GRP_MEM_HIGH"
						? COLOR_SCALE(d.properties.exposureGrpMemHigh || 0)
						: activeMode === "BIAS_GRP_MEM_HIGH"
						? COLOR_SCALE(d.properties.biasGrpMemHigh || 0)
						: activeMode === "NUM_BELOW_P50"
						? COLOR_SCALE(d.properties.numBelowP50 || 0)
						: activeMode === "CLUSTERING"
						? COLOR_SCALE(d.properties.clusteringCounty || 0)
						: activeMode === "VOLUNTEERING"
						? COLOR_SCALE(d.properties.volunteering_rate_county || 0)
						: COLOR_SCALE(d.properties.population || 0)
				}
			}));
		}
	}

	let countyFeaturesRender = []; 

	const path = geoPath();

	$: stateCentroids = states.features
		.filter(feature => stateNameToAbbrev[feature.properties.name])
		.map(feature => {
			const centroid = path.centroid(feature);
			const fullName = feature.properties.name;
			const abbrev = stateNameToAbbrev[fullName];
			const population = stateAggregations[abbrev]?.population;
		
			return {
				state: abbrev,
				fullName,
				coordinates: centroid,
				longitude: centroid[0],
				latitude: centroid[1],
				population
			};
		});

	$: stateAggregations = computed();

	function computed() {
		if (!counties?.features) return {};
		
		const aggregations = {};
		
		counties.features.forEach(county => {
			const stateName = county.properties.state;
			if (!aggregations[stateName]) {
				aggregations[stateName] = {
					totalCounties: 0,
					population: 0,
					numBelowP50: 0,
					clusteringSum: 0,
					clusteringCount: 0,
					volunteeringSum: 0,
					volunteeringCount: 0
				};
			}

			aggregations[stateName].totalCounties++;
			
			if (county.properties.population) {
				aggregations[stateName].population += county.properties.population;
			}
			if (county.properties.numBelowP50) {
				aggregations[stateName].numBelowP50 += county.properties.numBelowP50;
			}
			if (county.properties.clusteringCounty != null) {
				aggregations[stateName].clusteringSum += county.properties.clusteringCounty;
				aggregations[stateName].clusteringCount++;
			}
			if (county.properties.volunteeringRate != null) {
				aggregations[stateName].volunteeringSum += county.properties.volunteeringRate;
				aggregations[stateName].volunteeringCount++;
			}
		});

		Object.entries(aggregations).forEach(([state, data]) => {
			data.clusteringAvg = data.clusteringCount > 0 
				? data.clusteringSum / data.clusteringCount 
				: 0;
			data.volunteeringAvg = data.volunteeringCount > 0 
				? data.volunteeringSum / data.volunteeringCount 
				: 0;
		});

		return aggregations;
	}

	function computed2() {
		if (!counties?.features) return {};
		
		const metrics = {
			population: [],
			belowP50: [],
			clustering: [],
			volunteering: []
		};

		counties.features.forEach(county => {
			if (county.properties.population) metrics.population.push(county.properties.population);
			if (county.properties.numBelowP50) metrics.belowP50.push(county.properties.numBelowP50);
			if (county.properties.clusteringCounty) metrics.clustering.push(county.properties.clusteringCounty);
			if (county.properties.volunteeringRate) metrics.volunteering.push(county.properties.volunteeringRate);
		});

		return metrics;
	}

	$: {
		if (stateAggregations && stateCentroids) {
			Object.entries(stateAggregations).slice(0, 5).forEach(([state, data]) => {
			});
			
			stateCentroids.slice(0, 5).forEach(centroid => {
				const pop = stateAggregations[centroid.state]?.population;
			});
		}
	}
</script>

<div class="figure">
	<Figure --aspect-ratio={ASPECT_RATIO} custom={{ projectionObject }}>
		<MapSvg on:mousemove={onMouseMove} pointRadius={$mq["60rem"] ? 4 : 2}>
			<MapPath
				features={countyFeaturesRender}
				stroke={undefined}
				pointerEvents={$mq.desktop ? "all" : "none"}
				on:mouseleave={onMouseLeave}
				on:mouseenter={onMouseEnter}
			/>
			<MapPath
				features={countiesMesh}
				stroke={countyStroke}
				strokeWidth={$mq["30rem"] ? 0.5 : 0.25}
			/>
			<MapPath
				features={statesMesh}
				stroke="white"
				strokeWidth={$mq["30rem"] ? 2 : 1}
			/>
			<MapPath
				features={statesMesh}
				stroke={COLOR_FG}
				strokeWidth={$mq["30rem"] ? 0.5 : 0.25}
			/>
			<MapPath features={nationMesh} stroke={COLOR_FG} strokeWidth="0.5" />
			<MapPath features={activeFeatures} stroke={COLOR_FG} strokeWidth="2" />
			<MapPoints 
				features={activeCountyMode === "POP2018" || activeCountyMode === "NUM_BELOW_P50" || 
						  activeCountyMode === "CLUSTERING" || activeCountyMode === "VOLUNTEERING"
					? stateCentroids.map(centroid => {
						let value;
						if (activeCountyMode === "POP2018") {
							value = stateAggregations[centroid.state]?.population;
						} else if (activeCountyMode === "NUM_BELOW_P50") {
							value = stateAggregations[centroid.state]?.numBelowP50;
						} else if (activeCountyMode === "CLUSTERING") {
							value = stateAggregations[centroid.state]?.clusteringAvg;
						} else if (activeCountyMode === "VOLUNTEERING") {
							value = stateAggregations[centroid.state]?.volunteeringAvg;
						}
						
						const radius = CENTROID_SCALE(value || 1);
						
						return {
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [centroid.longitude, centroid.latitude]
							},
							properties: {
								name: centroid.state,
								fill: "white",
								pointRadius: radius,
								population: stateAggregations[centroid.state]?.population,
								numBelowP50: stateAggregations[centroid.state]?.numBelowP50,
								clusteringCounty: stateAggregations[centroid.state]?.clusteringAvg,
								volunteeringRate: stateAggregations[centroid.state]?.volunteeringAvg
							}
						};
					}) 
					: []}
				stroke="white"
				strokeWidth={1}
				pathGenerator={path}
				mode={activeCountyMode}
			/>
		</MapSvg>
		<Tooltip x={tooltipDatum.x} y={tooltipDatum.y}>
			<TooltipContent {...tooltipDatum} x={tooltipDatum.x} y={tooltipDatum.y} />
		</Tooltip>
		<!-- svelte-ignore a11y-structure -->
		<figcaption class="sr-only">{figcaption}</figcaption>
	</Figure>
</div>

<style>
	:global(g .other text) {
		display: none;
	}

	p.table-intro {
		margin: 32px auto;
		max-width: var(--col-width);
	}

	p.table-intro span {
		display: block;
		font-size: var(--14px);
		margin-top: 16px;
		padding-top: 4px;
		border-top: 1px solid var(--color-mark);
	}

	.figure {
		user-select: none;
		max-width: 100vw;
		width: 100%;
		margin: 0 auto;
		padding: 0;
		position: relative;
	}

	:global(.g-map-path path) {
		transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
					fill 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
