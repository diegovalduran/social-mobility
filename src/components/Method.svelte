<script>
	import { getContext } from "svelte";
	import { color, ascending } from "d3";
	import WIP from "$components/helpers/WIP.svelte";
	import Map from "$components/Map.svelte";
	import MapPoints from "$components/MapPoints.svelte";
	import places from "$utils/places.js";
	import counties from "$utils/counties.js";
	import states from "$utils/states.js";
	import addDataToCounties from "$utils/addDataToCounties.js";

	// import Footer from "$components/Footer.svelte";

	// const copy = getContext("copy");
	// const data = getContext("data");
	let samplePlace = "Portland";
	let inputWeight = 0;
	let maxDist = 1;
	let maxPop = 1;
	let topScore;
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

	const colors = [
		"#374e8e",
		"#4fbbae",
		"#df7c18",
		"#ac004f",
		"#1b87aa",
		"#e3b13e",
		"#ce4631",
		"#8d7a81"
	];

	const sample = places
		.filter((d) => d.name === samplePlace)
		.map((d, i) => ({
			...d,
			fill: colors[i] || colors[colors.length - 1]
		}));

	const sampleData = {
		states,
		places: sample.map((d, i) => ({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [d.longitude, d.latitude]
			},
			properties: d
		}))
	};

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
		// c.opacity = match.share < 0.5 ? 0.75 : 1;
		if (match.share < 0.75) c.opacity = 0.8;
		else c.opacity = 1;
		return c.toString();
	};

	function updateData() {
		const countiesWithData = addDataToCounties({
			counties,
			sample,
			maxDist,
			maxPop
		});

		topScore = {
			...countiesWithData,
			features: countiesWithData.features.map((d) => ({
				...d,
				properties: {
					...d.properties,
					fill: getTopScoreFill(d.properties.data)
				}
			}))
		};

		bySampleDist = sample.map(({ name, id, state, geo }) => ({
			name,
			state,
			geo,
			id,
			shape: {
				...topScore,
				features: topScore.features.map((d) => ({
					...d,
					properties: {
						...d.properties,
						fill: getSampleFillDist(id, d.properties.data)
					}
				}))
			}
		}));

		bySampleShare = sample.map(({ name, id, state, geo }) => ({
			name,
			state,
			geo,
			id,
			shape: {
				...topScore,
				features: topScore.features.map((d) => ({
					...d,
					properties: {
						...d.properties,
						fill: getSampleFillShare(id, d.properties.data)
					}
				}))
			}
		}));
		// const shares = [...topScore.features.map((d) => d.properties.data[0].share)];
		// const maxShare = Math.max(shares);
		// shares.sort(ascending);
		// 	topScore.features
		// .filter((d) => d.properties.data[0].share === shares[0])
		// .forEach((d, i) => {
		// 	if (i === 0) console.table(d.properties.data);
		// });
	}

	$: ratio = `${maxDist}:${maxPop}`;

	updateData();
</script>

<h1>
	What <strong>{samplePlace}</strong> means depending on where you are in the US
</h1>

<input
	type="range"
	bind:value={inputWeight}
	min="-4"
	max="4"
	step="0.25"
	on:change={onInputChange}
/>

<p>(distance) {ratio} (population)</p>
{#if topScore}
	<div class="all">
		<div class="map">
			<Map data={topScore} />
			<Map data={states} position="absolute" />
			<MapPoints
				data={sampleData}
				position="absolute"
				strokeWidth="2"
				radius="5"
			/>
		</div>
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
	.map {
		position: relative;
	}

	.all .map {
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
