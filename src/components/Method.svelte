<script>
	import { getContext } from "svelte";
	import { color, groups, ascending } from "d3";
	import WIP from "$components/helpers/WIP.svelte";
	import Figure from "$components/Figure.svelte";
	import Map from "$components/Figure.Map.svelte";
	import MapPoints from "$components/Figure.MapPoints.svelte";
	import MapLabels from "$components/Figure.MapLabels.svelte";
	// import ButtonSet from "$components/helpers/ButtonSet.svelte";
	import { counties, states } from "$data/us.js";
	import addDataToCounties from "$utils/addDataToCounties.js";
	import colors from "$data/colors4.json";
	// import Footer from "$components/Footer.svelte";

	// const copy = getContext("copy");
	// const data = getContext("data");

	export let places;

	const placeNames = groups(places, (d) => d.name)
		.filter((d) => d[1].length > 1)
		.map((d) => d[0]);
	placeNames.sort(ascending);

	const projectionObject = states;
	const statesFeatures = states.features;

	const aspectRatio = "975/610";
	let samplePlace = placeNames[0];
	let inputWeight = 0;
	let maxDist = 1;
	let maxPop = 1;
	let topScoreFeatures;
	let bySampleDist = [];
	let bySampleShare = [];

	function onInputChange() {
		const weight = +inputWeight;
		maxPop = 1;
		maxDist = 1;
		if (weight > 0) maxPop = 1 + weight;
		if (weight < 0) maxDist = 1 + -weight;
		updateData();
	}

	function getLabel(d) {
		const post = d.level === "town" ? `, ${d.stateAbbr}` : "";
		return `${d.name}${post}`;
	}

	$: sample = places
		.filter((d) => d.name === samplePlace)
		.map((d, i) => ({
			...d,
			label: getLabel(d),
			fill: colors[i] || colors[colors.length - 1]
		}));

	$: sampleFeatures = sample.map((d, i) => ({
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: [d.longitude, d.latitude]
		},
		properties: d
	}));

	const getSampleFillDist = (id, data) => {
		const match = data.find((d) => d.id === id);
		const c = color(match.fill);
		c.opacity = Math.floor(match.scoreD * 10) / 10;
		return c.toString();
	};

	const getSampleFillShare = (id, data) => {
		const match = data.find((d) => d.id === id);
		const c = color(match.fill);
		c.opacity = Math.floor(match.share * 10) / 10;
		return c.toString();
	};

	const getTopScoreFill = (data) => {
		const match = data[0];
		const c = color(match.fill);
		if (match.share < 0.51) c.opacity = 0.6;
		else if (match.share < 0.76) c.opacity = 0.8;
		else c.opacity = 1;
		// if (match.score < 0.5) c.opacity = 0.6;
		// else if (match.score < 1) c.opacity = 0.8;
		// else c.opacity = 1;
		return c.toString();
	};

	$: countiesWithData = addDataToCounties({
		counties,
		sample,
		maxDist,
		maxPop
	});

	$: topScoreFeatures = countiesWithData.features.map((d) => ({
		...d,
		properties: {
			...d.properties,
			fill: getTopScoreFill(d.properties.data)
		}
	}));

	$: bySampleDist = sample.map(({ name, id, state, level, population }) => ({
		name,
		state,
		level,
		id,
		population,
		features: topScoreFeatures.map((d) => ({
			...d,
			properties: {
				...d.properties,
				fill: getSampleFillDist(id, d.properties.data)
			}
		}))
	}));

	$: bySampleShare = sample.map(({ name, id, state, level, population }) => ({
		name,
		state,
		level,
		id,
		population,
		features: topScoreFeatures.map((d) => ({
			...d,
			properties: {
				...d.properties,
				fill: getSampleFillShare(id, d.properties.data)
			}
		}))
	}));

	// $: console.log(bySampleShare);
	// const shares = [...topScore.features.map((d) => d.properties.data[0].share)];
	// const maxShare = Math.max(shares);
	// shares.sort(ascending);
	// 	topScore.features
	// .filter((d) => d.properties.data[0].share === shares[0])
	// .forEach((d, i) => {
	// 	if (i === 0) console.table(d.properties.data);
	// });
</script>

<h1>
	What <strong>{samplePlace}</strong> means depending on where you are in the US
</h1>

<!-- select dropdown for sample -->
<select bind:value={samplePlace}>
	{#each placeNames as name}
		<option value={name}>{name}</option>
	{/each}
</select>

<!-- <ButtonSet bind:value={scalePop} options={[{value: "scalePow"}, {value: "scaleLog"}, {value: "scaleLinear"}]}></ButtonSet> -->
<!-- <ButtonSet bind:value={scaleDist} options={[{value: "scalePow"}, {value: "scaleLog"}, {value: "scaleLinear"}]}></ButtonSet> -->
<!-- <input
	type="range"
	bind:value={inputWeight}
	min="-4"
	max="4"
	step="0.25"
	on:change={onInputChange}
/> -->

<!-- <p>
	(distance) {maxDist}:{maxPop} (population)
</p> -->
{#if topScoreFeatures}
	<div class="top-score">
		<Figure --aspect-ratio={aspectRatio} custom={{ projectionObject }}>
			<Map features={topScoreFeatures} stroke="rgba(0, 0, 0, 0.25)" />
			<Map
				features={statesFeatures}
				stroke="rgba(0, 0, 0, 0.5)"
				pointerEvents={false}
			/>
			<MapPoints
				features={sampleFeatures}
				stroke="#000"
				strokeWidth="2"
				radius="5"
			/>
			<MapLabels
				features={sampleFeatures}
				stroke="#000"
				strokeWidth="4"
				offsetY={-12}
			/>
			<div class="not-towns">
				{#each sampleFeatures.filter((d) => d.properties.level !== "town") as feature}
					<p style:color={feature.properties.fill}>
						{feature.properties.name} ({feature.properties.level})
					</p>
				{/each}
			</div>
			<!-- svelte-ignore a11y-structure -->
			<!-- <figcaption slot="figcaption"></figcaption> -->
		</Figure>
		<!-- <div class="map">			
			<Map data={states} position="absolute" />
			<MapPoints
				data={sampleData}
				position="absolute"
		
			/>
		</div> -->
	</div>
{/if}

<!-- <section>
	<h2>Dist by place</h2>
	<div class="places">
		{#each bySampleDist as { name, state, geo, shape }}
			<div class="inner">
				<p>{name}, {state} ({geo})</p>
				<div class="map">
					<Map data={shape} stroke="#fff" />
					<Map data={states} position="absolute" stroke="#000" />
					<MapPoints data={sampleData} position="absolute" />
				</div>
			</div>
		{/each}
	</div>
</section>

<section>
	<h2>Share by place</h2>
	<div class="places">
		{#each bySampleShare as { name, state, geo, shape }}
			<div class="inner">
				<p>{name}, {state} ({geo})</p>
				<div class="map">
					<Map data={shape} stroke="#fff" />
					<Map data={states} position="absolute" stroke="#000" />
					<MapPoints data={sampleData} position="absolute" stroke="#fff" />
				</div>
			</div>
		{/each}
	</div>
</section> -->

<!-- <Footer /> -->
<style>
	.not-towns {
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.not-towns p {
		margin-right: 16px;
		font-weight: bold;
	}

	.map {
		position: relative;
	}

	.top-score {
		max-width: 1280px;
	}

	.places .map {
		width: 500px;
		margin-bottom: 32px;
	}

	.places {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}

	.inner {
	}

	.places p {
		text-align: center;
	}

	h1 {
		text-align: center;
		line-height: 1.2;
	}

	h2 {
		text-align: center;
	}

	section {
		margin-bottom: 32px;
	}
</style>
