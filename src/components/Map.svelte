<script>
	import {
		ascending,
		descending,
		format,
		max,
		color,
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
	import MapTable from "$components/Map.Table.svelte";
	import { counties, states } from "$data/us.js";
	import addDataToCounties from "$data/addDataToCounties.js";
	import colors from "$data/colors3.json";

	// 3,4 (1,5)
	// 6

	const MAX_COLORS = 4;
	const DEFAULT_FILL = "#4a4a4a";
	const ASPECT_RATIO = "975/610";
	const projectionObject = states;
	const stateFeatures = states.features;

	let scalePop;
	let scaleWiki;
	let scaleDist;

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
		const post =
			d.level === "city-us"
				? `, ${d.state}`
				: d.level === "city-international"
				? ` (${d.country})`
				: ` (${d.level})`;
		return `${d.name}${post}`;
	}

	$: places = placeData.map((d, i) => ({
		...d,
		population: +d.population,
		wiki: +d.wiki,
		latitude: +d.latitude,
		longitude: +d.longitude,
		label: getLabel(d),
		className: i > MAX_COLORS ? "hide-label" : ""
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

	// $: maxValue =
	// 	valueProp === "share"
	// 		? 1
	// 		: +valueWeightDist + +valueWeightPop + +valueWeightWiki;

	$: maxValue = max(
		countiesWithData.features,
		(d) => d.properties.data[0][valueProp]
	);

	$: getTopOpacity = (d) => {
		if (d[valueProp] < thresholdLower * maxValue) return 0;
		else if (d[valueProp] < thresholdUpper * maxValue) return 0.75;
		return 1;
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

	$: rows = countiesWithData.features.map((d) => {
		const a = d.properties.data[0];
		const b = d.properties.data[1];

		return {
			name: d.properties.name,
			state: d.properties.state,
			labelA: a.label,
			valueA: format(".0f")((a[valueProp] / maxValue) * 100),
			labelB: b.label,
			valueB: format(".0f")((b[valueProp] / maxValue) * 100)
		};
	});

	$: columns = [
		{ key: "name", title: "county" },
		{ key: "state", title: "state" },
		{ key: "labelA", title: "1st name" },
		{ key: "valueA", title: "1st score" },
		{ key: "labelB", title: "2nd name" },
		{ key: "valueB", title: "2nd score" }
	];

	// $: if (countiesWithData) {
	// 	const x = countiesWithData.features.find(
	// 		(d) => d.properties.name === "Berkshire"
	// 	).properties.data;
	// 	// window.output = csvFormat(x);
	// 	console.table(
	// 		x.map((d) => {
	// 			return {
	// 				label: d.label,
	// 				dist: d.dist,
	// 				population: d.population,
	// 				wiki: d.wiki,
	// 				scoreD: +d.scoreD.toFixed(2),
	// 				scoreP: +d.scoreP.toFixed(2),
	// 				scoreW: +d.scoreW.toFixed(2),
	// 				score: +d.score.toFixed(2),
	// 				share: +d.share.toFixed(2)
	// 			};
	// 		})
	// 	);
	// }

	// let c = color(match.fill);
	// return c.toString();

	$: countyFeatures = countiesWithData.features.map((d) => ({
		...d,
		properties: {
			...d.properties,
			topLabel: d.properties.data[0].label,
			topOpacity: getTopOpacity(d.properties.data[0])
		}
	}));

	$: topPlaces = countyFeatures.map((d) => ({
		label: d.properties.topLabel,
		opacity: d.properties.topOpacity
	}));

	// TODO double for strong association?
	$: tally = groups(
		topPlaces.filter((d) => d.opacity),
		(d) => d.label
	).map(([label, values]) => ({
		label,
		// count: sum(values.map((d) => (d.opacity === 1 ? 2 : 1)))
		count: values.length
	}));

	$: tally.sort((a, b) => descending(a.count, b.count));

	$: order = new Map(tally.map((d, i) => [d.label, i]));

	$: placeFeatures.sort((a, b) =>
		ascending(order.get(a.properties.label), order.get(b.properties.label))
	);

	$: colorMap = placeFeatures.reduce((prev, d, i) => {
		const fill = i < MAX_COLORS ? colors[i] : colors[MAX_COLORS];
		prev[d.properties.label] = fill;
		return prev;
	}, {});

	$: placeFeaturesRender = placeFeatures.map((d) => ({
		...d,
		properties: {
			...d.properties,
			fill: colorMap[d.properties.label]
		}
	}));

	$: countyFeaturesRender = countyFeatures.map((d) => {
		let fill = DEFAULT_FILL;
		if (d.properties.topOpacity) {
			const f = colorMap[d.properties.topLabel];
			const c = color(f);
			c.opacity = d.properties.topOpacity;
			fill = c.toString();
		}
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

	$: keyFeatures = placeFeaturesRender.map((d) => ({
		...d,
		properties: {
			...d.properties
		}
	}));

	$: topPlace = placeFeaturesRender[0].properties;
	$: topLabel = topPlace.label;
	$: topMaybe = color(topPlace.fill).copy({ opacity: 0.75 }).toString();
	$: topProbably = topPlace.fill;
</script>

<h2>
	In the US, <strong style:color={topProbably}>{topLabel}</strong> is most often
	what someone means by <strong>{placeName}.</strong>
</h2>
<h2>
	In most counties, <strong>{placeName}</strong> means
	<strong style:color={topProbably}>{topLabel}.</strong>
	<mark style:background={topProbably}>Probably.</mark>
	<mark style:background={topMaybe}>Maybe?</mark>
</h2>

<h2>
	If someone in the US refers to <strong>{placeName}</strong>, they
	<mark style="--fill: {topProbably};">probably</mark>
	<mark style="--fill: {topMaybe};">(maybe)</mark> mean
	<strong style:color={topProbably}>{topLabel}.</strong>
</h2>

<h2>
	In most parts of the US, saying <strong>{placeName}</strong> usually refers to
	<strong style:color={topProbably}>{topLabel}.</strong>
</h2>

<Figure --aspect-ratio={ASPECT_RATIO} custom={{ projectionObject }}>
	<MapCanvas features={countyFeaturesRender} stroke="rgba(0, 0, 0, 1)" />
	<MapSvg>
		<!-- <MapPath features={featuresCounties} stroke="rgba(0, 0, 0, 0.25)" /> -->
		<MapPath
			features={stateFeatures}
			stroke="rgba(0, 0, 0, 1)"
			strokeWidth="1"
		/>
		{#key placeName}
			<MapPoints
				features={placeFeaturesRender.filter(
					(d) => d.properties.level === "city-us"
				)}
				stroke="#000"
				strokeWidth="2"
				radius="5"
			/>

			<MapLabels
				features={placeFeaturesRender.filter(
					(d) => d.properties.level === "city-us"
				)}
				stroke="#000"
				strokeWidth="4"
				offsetY={-12}
			/>
		{/key}
		<!-- <figcaption slot="figcaption"></figcaption> -->
	</MapSvg>
	<!-- svelte-ignore a11y-structure -->
</Figure>
<MapKey features={keyFeatures} />
<MapTable {rows} {columns} />

<style>
	:global(g .hide-label) {
		display: none;
	}

	mark {
		background: none;
	}

	mark {
		background-image: linear-gradient(
			to bottom,
			transparent 0%,
			var(--fill) 0%,
			var(--fill) 100%
		);
	}

	h2 {
		margin: 48px auto;
	}
</style>
