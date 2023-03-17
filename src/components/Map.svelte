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
		sum,
		color
	} from "d3";
	import { getContext, beforeUpdate, afterUpdate } from "svelte";
	import Figure from "$components/Figure.svelte";
	import MapSvg from "$components/Figure.MapSvg.svelte";
	import MapCanvas from "$components/Figure.MapCanvas.svelte";
	import MapPath from "$components/Figure.MapPath.svelte";
	import MapPoints from "$components/Figure.MapPoints.svelte";
	import MapLabels from "$components/Figure.MapLabels.svelte";
	import Tooltip from "$components/Figure.Tooltip.svelte";
	import TooltipContent from "$components/TooltipContent.svelte";
	import MapInfo from "$components/Map.Info.svelte";
	import MapKey from "$components/Map.Key.svelte";
	import CountyTable from "$components/CountyTable.svelte";
	import PlaceTable from "$components/PlaceTable.svelte";
	import addDataToCounties from "$data/addDataToCounties.js";
	import mq from "$stores/mq.js";
	import viewport from "$stores/viewport.js";
	import variables from "$data/variables.json";

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

	export let scaleExpPop = "0.5";
	export let scaleExpWiki = "0.5";
	export let scaleExpDist = "1";

	export let scaleBoundsPop = [0, 22933531];
	export let scaleBoundsWiki = [0, 96911];
	export let scaleBoundsDist = [50, 300];

	export let valueWeightDist = "2";
	export let valueWeightPop = "1";
	export let valueWeightWiki = "1";

	export let thresholdLower = 0.02;
	export let thresholdUpper = 0.05;
	export let valueProp = "shareDelta";
	export let valueScale = "no";

	export let countiesByDist = [];

	const copy = getContext("copy");

	const CAT = "cat";

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
	// const stateFeatures = states.features;
	const countyStroke = color(COLOR_FG).copy({ opacity: 0.5 }).toString();

	let colors = [];
	let scalePop;
	let scaleWiki;
	let scaleDist;
	let tooltipDatum = { text: null, x: 0, y: 0 };
	let waiting;
	let displayName;
	let activeFeatures = [];

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
		const { event, feature } = detail;

		const { data, name, state } = feature.properties;
		const county = `${name} ${state === "LA" ? "Parish" : "County"}, ${state}`;

		const label1 = data[0]?.label;
		const label2 = data[1]?.label;
		const score = data[0][valueProp] / maxValue;
		const toss = score < thresholdLower;
		const maybe = score >= thresholdLower && score < thresholdUpper;
		const probably = score >= thresholdUpper;
		const likelihood = toss ? "could" : maybe ? "maybe" : "probably";
		const post = toss ? ` or ${label2}` : ".";
		const s = toss ? "" : "s";

		const madlib = `In <strong>${county},</strong> ${placeName} ${likelihood} refer${s} to ${label1}${post}`;

		tooltipDatum.text = madlib;
		activeFeatures = [feature];
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

	$: maxValue =
		valueScale === "no"
			? 1
			: max(countiesWithData.features, (d) => d.properties.data[0][valueProp]);

	// $: maxGrowth = max(
	// 	countiesWithData.features,
	// 	(d) => d.properties.data[0].growth
	// );

	// $: maxShareDelta = max(
	// 	countiesWithData.features,
	// 	(d) => d.properties.data[0].shareDelta
	// );

	// $: console.log({ valueProp, maxValue, maxGrowth, maxShareDelta });

	// $: console.table(
	// 	countiesWithData.features.find((d) => d.properties.name === "Berkshire")
	// 		.properties.data
	// );

	// $: console.table(
	// 	countiesWithData.features.find((d) => d.properties.name === "Wasco")
	// 		.properties.data
	// );

	// $: console.table(
	// 	countiesWithData.features.find((d) => d.properties.name === "Lamoille")
	// 		.properties.data
	// );

	// $: console.table(
	// 	countiesWithData.features.find((d) => d.properties.name === "Androscoggin")
	// 		.properties.data
	// );

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
		countPrimary: values.filter((v) => v.tier === 2).length,
		countSecondary: values.filter((v) => v.tier === 1).length
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
				fill: colorLookup[d.properties.label].primary
			}
		};
	});

	$: countyFeaturesRender = countyFeatures.map((d) => {
		const fill = d.properties.topTier
			? colorLookup[d.properties.topLabel][
					d.properties.topTier === 2 ? "primary" : "secondary"
			  ]
			: COLOR_TOSS.primary;

		return {
			...d,
			properties: {
				...d.properties,
				fill
			}
		};
	});

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

	$: countyColumns = [
		{ prop: "name", label: "County" },
		{ prop: "state", label: "State" },
		{ prop: "label1", label: "Rank #1" },
		{ prop: "label2", label: "Rank #2" },
		{ prop: "margin", label: "Share Margin", type: "number" }
	];

	$: placeRows = placeFeaturesRender.map((d) => ({
		count: 0,
		...d.properties,
		style: `background-color: ${d.properties.fills.secondary}; color: ${d.properties.fills.textSecondary};`
	}));

	$: placeColumns = [
		{ prop: "label", label: "Place" },
		{
			prop: "count",
			label: "# of Counties",
			formatFn: format(","),
			type: "number",
			dir: "desc"
		},
		{
			prop: "population",
			label: "Population",
			formatFn: (d) => (d ? format(",")(d) : "n/a"),
			type: "number"
		},
		{
			prop: "wiki",
			label: "Wikipedia Length",
			formatFn: (d) => (d ? format(",")(d) : "n/a"),
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
	$: figcaption = `A choropleth map of US counties that shows which place named ${placeName} that county is most likely to refer to based on a combination of proximity, population, and Wikipedia article length. The most commonly referred to place is ${topPlace.label}.`;

	$: topLabel = topPlace.label;
	$: topColorPrimary = topPlace.fills.primary;
	$: placeName, (waiting = true);
	$: topLabel, (waiting = false);
	$: if (!waiting) displayName = placeName;
</script>

{#if story}
	<MapInfo {displayName} {topLabel} {topColorPrimary} />
{/if}

<div class="figure">
	<Figure --aspect-ratio={ASPECT_RATIO} custom={{ projectionObject }}>
		<!-- <MapCanvas features={countyFeaturesRender} stroke={COLOR_FG} /> -->
		<MapSvg on:mousemove={onMouseMove} pointRadius={$mq["60rem"] ? 4 : 2}>
			<MapPath
				features={countyFeaturesRender}
				stroke={undefined}
				pointerEvents={$mq.desktop}
				on:mouseleave={onMouseLeave}
				on:mouseenter={onMouseEnter}
			/>
			<MapPath
				features={countiesMesh}
				stroke={countyStroke}
				strokeWidth="0.5"
			/>
			<MapPath features={statesMesh} stroke={COLOR_FG} strokeWidth="0.5" />
			<MapPath features={nationMesh} stroke={COLOR_FG} strokeWidth="0.5" />
			<MapPath features={activeFeatures} stroke={COLOR_FG} strokeWidth="2" />
			{#key displayName}
				<MapPoints
					features={placeFeaturesRender.filter(
						(d) => d.properties.level === "city-us"
					)}
					stroke={COLOR_FG}
					strokeWidth="2"
				/>

				{#if $mq["50rem"]}
					<MapLabels
						features={placeFeaturesRender
							.slice(0, MAX_COLORS)
							.filter((d) => d.properties.level === "city-us")}
						stroke={COLOR_BG}
						strokeWidth="4"
						offsetY={0}
					/>
				{/if}
			{/key}
		</MapSvg>
		<Tooltip x={tooltipDatum.x} y={tooltipDatum.y}>
			<TooltipContent {...tooltipDatum} x={tooltipDatum.x} y={tooltipDatum.y} />
		</Tooltip>
		<!-- svelte-ignore a11y-structure -->
		<figcaption class="sr-only">{figcaption}</figcaption>
	</Figure>
</div>

<MapKey
	max={MAX_COLORS}
	features={keyFeatures}
	colorToss={COLOR_TOSS.primary}
	colorTossText={COLOR_TOSS.textPrimary}
/>

{#if story}
	<p class="table-intro">
		{@html copy.tableIntro}
		<span class="table-intro-note">*{@html copy.tableIntroNote}</span>
	</p>
{/if}

{#if story}
	<PlaceTable
		caption="Every place named {placeName}, ranked"
		rows={placeRows}
		columns={placeColumns}
		note={copy.placeNote}
	/>
{/if}

{#if story}
	<CountyTable
		caption="Each county’s most likely {placeName} reference"
		rows={countyRows}
		columns={countyColumns}
		note={copy.countyNote}
	/>
{/if}

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
	}
</style>
