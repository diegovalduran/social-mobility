<script>
	import {
		ascending,
		descending,
		format,
		max,
		groups,
		scalePow,
		scaleLog,
		csvFormat,
		sum
	} from "d3";
	import Figure from "$components/Figure.svelte";
	import MapSvg from "$components/Figure.MapSvg.svelte";
	import MapCanvas from "$components/Figure.MapCanvas.svelte";
	import MapPath from "$components/Figure.MapPath.svelte";
	import MapPoints from "$components/Figure.MapPoints.svelte";
	import MapLabels from "$components/Figure.MapLabels.svelte";
	import MapKey from "$components/Map.Key.svelte";
	import CountyTable from "$components/CountyTable.svelte";
	import PlaceTable from "$components/PlaceTable.svelte";
	import { counties, states } from "$data/us.js";
	import addDataToCounties from "$data/addDataToCounties.js";
	import variables from "$data/variables.json";

	const CAT = "cat2";

	const COLORS_RAW = [
		variables[CAT].c0,
		variables[CAT].c1,
		variables[CAT].c2
		// [variables[CAT].c3.b, variables[CAT].c3.text, variables[CAT].c3.text]
	];

	const MAX_COLORS = COLORS_RAW.length;

	const COLOR_OTHER = variables[CAT].other;

	const COLOR_TOSS = variables[CAT].toss;

	const COLOR_BG = variables[CAT].bg;
	const COLOR_FG = variables[CAT].fg;

	const ASPECT_RATIO = "975/610";
	const projectionObject = states;
	const stateFeatures = states.features;

	let colors = [];
	let scalePop;
	let scaleWiki;
	let scaleDist;

	export let location;
	export let placeData;
	export let placeName;

	export let scaleTypePop = "scalePow";
	export let scaleTypeWiki = "scalePow";
	export let scaleTypeDist = "scaleLog";

	export let scaleExpPop = "0.67";
	export let scaleExpWiki = "0.67";
	export let scaleExpDist = "1";

	export let scaleBoundsPop = [0, 490000];
	export let scaleBoundsWiki = [0, 87500];
	export let scaleBoundsDist = [50, 200];

	export let valueWeightDist = "2";
	export let valueWeightPop = "1";
	export let valueWeightWiki = "1";

	export let thresholdLower = 0.5;
	export let thresholdUpper = 0.75;
	export let valueProp = "share";

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

	$: {
		// shuffle around colors
		const i = placeData[0].name.length % MAX_COLORS;
		colors = COLORS_RAW.slice(i).concat(COLORS_RAW.slice(0, i));
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
		// fill: i < MAX_COLORS ? colors[i] : colors[MAX_COLORS]
	}));

	$: placeFeatures = places.map((d) => ({
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [d.longitude, d.latitude]
		},
		properties: d
	}));

	$: userFeatures = location
		? [
				{
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [location.lon, location.lat]
					},
					properties: { className: "user-location", label: "Your Location" }
				}
		  ]
		: undefined;

	$: maxValue = max(
		countiesWithData.features,
		(d) => d.properties.data[0][valueProp]
	);

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
		scaleWiki = sp
			.domain(scaleBoundsWiki)
			.range([0, +valueWeightWiki])
			.clamp(true);
	}

	$: countiesWithData = addDataToCounties({
		valueProp,
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

	// TODO double for strong association?
	$: tally = byLabel.map(([label, values]) => ({
		label,
		count: values.filter((v) => v.tier).length,
		countProbably: values.filter((v) => v.tier === 2).length,
		countMaybe: values.filter((v) => v.tier === 1).length
	}));

	$: {
		tally.sort((a, b) => descending(a.count, b.count));
		tally = [...tally];
	}

	$: order = new Map(tally.map((d, i) => [d.label, i]));

	$: placeFeaturesWithOrder = placeFeatures.map((d) => {
		const o1 = order.get(d.properties.label);
		const o2 = o1 === undefined ? placeFeatures.length : o1;
		const className = o1 > MAX_COLORS - 1 ? "other" : "";
		return {
			...d,
			properties: {
				...d.properties,
				className,
				order: o2
			}
		};
	});

	$: {
		placeFeaturesWithOrder.sort((a, b) =>
			ascending(a.properties.order, b.properties.order)
		);
		placeFeaturesWithOrder = [...placeFeaturesWithOrder];
	}

	$: colorLookup = placeFeaturesWithOrder.reduce((prev, d, i) => {
		prev[d.properties.label] = i < MAX_COLORS ? colors[i] : COLOR_OTHER;
		return prev;
	}, {});

	$: placeFeaturesRender = placeFeaturesWithOrder.map((d) => {
		const match = tally.find((t) => t.label === d.properties.label);
		return {
			...d,
			properties: {
				...d.properties,
				...match,
				fills: colorLookup[d.properties.label],
				fill: colorLookup[d.properties.label].probably
			}
		};
	});

	$: countyFeaturesRender = countyFeatures.map((d) => {
		const fill = d.properties.topTier
			? colorLookup[d.properties.topLabel][
					d.properties.topTier === 2 ? "probably" : "maybe"
			  ]
			: COLOR_TOSS.probably;

		return {
			...d,
			properties: {
				...d.properties,
				fill
			}
		};
	});

	// $: tallyUpper = groups(
	// 	topPlaces.filter((d) => d[valueProp] >= thresholdUpper * maxValue),
	// 	(d) => d.label
	// ).map(([label, values]) => ({
	// 	label,
	// 	count: values.length
	// }));

	// $: tallyLower = groups(
	// 	topPlaces.filter(
	// 		(d) =>
	// 			d[valueProp] >= thresholdLower * maxValue &&
	// 			d[valueProp] < thresholdUpper * maxValue
	// 	),
	// 	(d) => d.label
	// ).map(([label, values]) => ({
	// 	label,
	// 	count: values.length
	// }));

	$: countyRows = countiesWithData.features.map((d) => {
		const a = d.properties.data[0];
		const b = d.properties.data[1];

		return {
			name: d.properties.name,
			state: d.properties.state,
			labelA: a.label,
			valueA: +format(".0f")((a[valueProp] / maxValue) * 100),
			labelB: b.label,
			valueB: +format(".0f")((b[valueProp] / maxValue) * 100)
		};
	});

	$: countyColumns = [
		{ prop: "name", label: "county" },
		{ prop: "state", label: "state" },
		{ prop: "labelA", label: "1st name" },
		{ prop: "valueA", label: "1st score", type: "number" },
		{ prop: "labelB", label: "2nd name" },
		{ prop: "valueB", label: "2nd score", type: "number" }
	];

	$: placeRows = placeFeaturesRender.map((d) => ({
		...d.properties
	}));

	$: placeColumns = [
		{ prop: "label", label: "place" },
		{
			prop: "countProbably",
			label: "Counties (probably)",
			formatFn: format(","),
			type: "number"
		},
		{
			prop: "countMaybe",
			label: "Counties (maybe)",
			formatFn: format(","),
			type: "number"
		},
		{
			prop: "population",
			label: "Population",
			formatFn: format(","),
			type: "number"
		},
		{
			prop: "wiki",
			label: "Wikipedia Length",
			formatFn: format(","),
			type: "number"
		}
	];

	$: keyFeatures = placeFeaturesRender.map((d) => ({
		...d,
		properties: {
			...d.properties
		}
	}));

	$: topPlace = placeFeaturesRender[0].properties;
	$: topLabel = topPlace.label;
	$: topColorMaybe = topPlace.fills.maybe;
	$: topColorProbably = topPlace.fills.probably;
	$: topColorTextProbably = topPlace.fills.textProbably;
	$: topColorTextMaybe = topPlace.fills.textMaybe;
</script>

<div class="info">
	<h2>
		What <strong>{placeName}</strong> means, depending on where you are in the US.
	</h2>

	<h2>
		In the US, <strong style:color={topColorProbably}>{topLabel}</strong> is
		most often what someone means by <strong>{placeName}.</strong>
	</h2>
	<h2>
		In most counties, <strong>{placeName}</strong> means
		<strong style:color={topColorProbably}>{topLabel}.</strong>
		<mark style:background={topColorProbably} style:color={topColorTextProbably}
			>Probably.</mark
		>
		<mark style:background={topColorMaybe} style:color={topColorTextMaybe}
			>Maybe?</mark
		>
	</h2>

	<h2>
		If someone refers to <strong>{placeName}</strong>, they
		<mark style="--bg: {topColorProbably}; --fg:{topColorTextProbably};"
			>probably</mark
		>
		<mark style="--bg: {topColorMaybe}; --fg:{topColorTextMaybe};">(maybe)</mark
		>
		mean
		<strong style:color={topColorProbably}>{topLabel}.</strong>
	</h2>

	<h2>
		In most parts of the US, saying <strong>{placeName}</strong> usually refers
		to
		<strong style:color={topColorProbably}>{topLabel}.</strong>
	</h2>
</div>

<Figure --aspect-ratio={ASPECT_RATIO} custom={{ projectionObject }}>
	<MapCanvas features={countyFeaturesRender} stroke={COLOR_FG} />
	<MapSvg>
		<!-- <MapPath features={featuresCounties} stroke="rgba(0, 0, 0, 0.25)" /> -->
		<MapPath features={stateFeatures} stroke={COLOR_FG} strokeWidth="1" />
		{#key placeName}
			<MapPoints
				features={placeFeaturesRender.filter(
					(d) => d.properties.level === "city-us"
				)}
				stroke={COLOR_FG}
				strokeWidth="2"
			/>
			<!-- <MapPoints features={userFeatures} stroke={COLOR_FG} strokeWidth="2" /> -->

			<MapLabels
				features={placeFeaturesRender.filter(
					(d) => d.properties.level === "city-us"
				)}
				stroke={COLOR_BG}
				strokeWidth="4"
				offsetY={0}
			/>
			<!-- <MapLabels
				features={userFeatures}
				stroke={COLOR_BG}
				strokeWidth="4"
				offsetY={0}
			/> -->
		{/key}
		<!-- <figcaption slot="figcaption"></figcaption> -->
	</MapSvg>
	<!-- svelte-ignore a11y-structure -->
</Figure>
<MapKey
	max={MAX_COLORS}
	features={keyFeatures}
	colorToss={COLOR_TOSS.probably}
	colorTossText={COLOR_TOSS.textProbably}
/>
<PlaceTable rows={placeRows} columns={placeColumns} />
<CountyTable rows={countyRows} columns={countyColumns} />

<style>
	:global(g .other text) {
		display: none;
	}

	mark {
		background: none;
	}

	mark {
		background-image: linear-gradient(
			to bottom,
			transparent 0%,
			var(--bg) 0%,
			var(--bg) 100%
		);
		color: var(--fg);
	}

	.info {
		/* max-width: 40em; */
		margin: 0 auto;
	}

	h2 {
		margin-top: 48px;
		margin-bottom: 0;
		text-align: center;
	}
</style>
