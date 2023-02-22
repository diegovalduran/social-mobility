<script>
	import { getContext } from "svelte";
	import { color, groups, ascending, scalePow, scaleLog } from "d3";
	import WIP from "$components/helpers/WIP.svelte";
	import Figure from "$components/Figure.svelte";
	import Map from "$components/Figure.MapSvg.svelte";
	import MapPath from "$components/Figure.MapPath.svelte";
	import MapPoints from "$components/Figure.MapPoints.svelte";
	import MapLabels from "$components/Figure.MapLabels.svelte";
	import Scale from "$components/Method.Scale.svelte";
	import Value from "$components/Method.Value.svelte";
	import Threshold from "$components/Method.Threshold.svelte";
	import { counties, states } from "$data/us.js";
	import addDataToCounties from "$utils/addDataToCounties.js";
	import colors from "$data/colors.json";
	// import Footer from "$components/Footer.svelte";

	// const copy = getContext("copy");
	// const data = getContext("data");

	export let places;

	const placeNames = groups(places, (d) => d.name).map((d) => d[0]);
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

	let scaleTypePop = "scalePow";
	let scaleTypeDist = "scaleLog";
	let scaleExpPop = "0.67";
	let scaleExpDist = "1";
	let scaleBoundsPop = [0, 1000000];
	let scaleBoundsDist = [100, 500];
	let valueProp = "share";
	let valueWeightDist = 1;
	let valueWeightPop = 1;
	let thresholdLower = 0.5;
	let thresholdUpper = 0.75;
	let scaleDist;
	let scalePop;

	function onInputChange() {
		const weight = +inputWeight;
		maxPop = 1;
		maxDist = 1;
		if (weight > 0) maxPop = 1 + weight;
		if (weight < 0) maxDist = 1 + -weight;
		updateData();
	}

	function getLabel(d) {
		const post = d.level === "city-us" ? `, ${d.stateAbbr}` : "";
		return `${d.name}${post}`;
	}

	$: samplePhoneme = places.find((d) => d.name === samplePlace).phoneme;

	$: sample = places
		.filter((d) => d.phoneme === samplePhoneme)
		.map((d, i) => ({
			...d,
			label: getLabel(d),
			fill: colors[i] || colors[colors.length - 1]
		}));

	$: console.log(sample);
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

	$: getTopScoreFill = (data) => {
		const match = data[0];
		const c = color(match.fill);
		if (match[valueProp] < thresholdLower * maxValue) c.opacity = 0.5;
		else if (match[valueProp] < thresholdUpper * maxValue) c.opacity = 0.75;
		else c.opacity = 1;
		return c.toString();
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
	}

	$: maxValue = valueProp === "share" ? 1 : +valueWeightDist + +valueWeightPop;

	$: countiesWithData = addDataToCounties({
		valueProp,
		counties,
		sample,
		scaleDist,
		scalePop
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

<!-- <h1>
	What <strong>{samplePlace}</strong> means depending on where you are in the US
</h1> -->

<!-- select dropdown for sample -->

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

<article>
	<section id="ui">
		<select bind:value={samplePlace}>
			{#each placeNames as name}
				<option value={name}>{name}</option>
			{/each}
		</select>
		<Scale
			bind:valueScale={scaleTypeDist}
			bind:valueExp={scaleExpDist}
			bind:valueBounds={scaleBoundsDist}
			legend="Distance Scale"
		/>

		<Scale
			bind:valueScale={scaleTypePop}
			bind:valueExp={scaleExpPop}
			bind:valueBounds={scaleBoundsPop}
			legend="Population Scale"
		/>
		<Value
			bind:valueProp
			bind:valueWeightDist
			bind:valueWeightPop
			legend="Value"
		/>
		<Threshold
			bind:thresholdLower
			bind:thresholdUpper
			legend="Opacity threshold"
		/>
	</section>

	<section id="maps">
		{#if topScoreFeatures}
			<div class="top-score">
				<Figure --aspect-ratio={aspectRatio} custom={{ projectionObject }}>
					<Map>
						<MapPath features={topScoreFeatures} stroke="rgba(0, 0, 0, 0.25)" />
						<MapPath features={statesFeatures} stroke="rgba(0, 0, 0, 0.5)" />
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
					</Map>
					<div class="not-towns">
						{#each sampleFeatures.filter((d) => !["city-us", "state"].includes(d.properties.level)) as feature}
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
	</section>
</article>

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
	article {
		display: flex;
	}

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

	#ui {
		width: 16rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	#maps {
		position: relative;
		width: 1280px;
		/* position: sticky;
		top: 0;
		left: 17rem; */
	}
</style>
