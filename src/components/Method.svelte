<script>
	import { getContext } from "svelte";
	import { color, ascending } from "d3";
	import WIP from "$components/helpers/WIP.svelte";
	import MapCounties from "$components/MapCounties.svelte";
	import cities from "$utils/cities.js";
	import counties from "$utils/counties.js";
	import states from "$utils/states.js";
	import addDataToCounties from "$utils/addDataToCounties.js";

	// import Footer from "$components/Footer.svelte";

	// const copy = getContext("copy");
	// const data = getContext("data");
	let sampleCity = "Portland";
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
		// updateData();
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

	const sample = cities
		.filter((d) => d.city === sampleCity)
		.map((d, i) => ({
			...d,
			fill: colors[i] || colors[colors.length - 1]
		}));

	// console.time("addDataToCounties");
	// console.timeEnd("addDataToCounties");

	const geojsonSample = sample.map((d, i) => {
		return {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [d.longitude, d.latitude]
			},
			properties: {
				index: i,
				data: d
			}
		};
	});

	const getSampleFillDist = (state, data) => {
		const match = data.find((d) => d.state === state);
		const c = color(match.fill);
		c.opacity = Math.floor(match.scoreD * 10) / 10;
		return c.toString();
	};

	const getSampleFillShare = (state, data) => {
		const match = data.find((d) => d.state === state);
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

		bySampleDist = sample.map(({ city, state }) => ({
			city,
			state,
			shape: {
				...topScore,
				features: topScore.features.map((d) => ({
					...d,
					properties: {
						...d.properties,
						fill: getSampleFillDist(state, d.properties.data)
					}
				}))
			}
		}));

		bySampleShare = sample.map(({ city, state }) => ({
			city,
			state,
			shape: {
				...topScore,
				features: topScore.features.map((d) => ({
					...d,
					properties: {
						...d.properties,
						fill: getSampleFillShare(state, d.properties.data)
					}
				}))
			}
		}));

		// const shares = [...topScore.features.map((d) => d.properties.data[0].share)];
		// const maxShare = Math.max(shares);
		// shares.sort(ascending);
	}
	// console.table(shares);

	// console.log({ maxShare });
	// topScore.features
	// 	.filter((d) => d.properties.data[0].share === shares[0])
	// 	.forEach((d, i) => {
	// 		if (i === 0) console.table(d.properties.data);
	// 	});

	$: ratio = `${maxDist}:${maxPop}`;

	updateData();
</script>

<h1>
	What <strong>{sampleCity}</strong> means depending on where you are in the US
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
			<MapCounties data={topScore} fill="#ccc" />
			<MapCounties data={states} position="absolute" stroke="#fff" />
		</div>
	</div>
{/if}

<section>
	<h2>Dist by city</h2>
	<div class="cities">
		{#each bySampleDist as { city, state, shape }}
			<div class="inner">
				<p>{city}, {state}</p>
				<div class="map">
					<MapCounties data={shape} stroke="#fff" />
					<MapCounties data={states} position="absolute" stroke="#000" />
				</div>
			</div>
		{/each}
	</div>
</section>

<section>
	<h2>Share by city</h2>
	<div class="cities">
		{#each bySampleShare as { city, state, shape }}
			<div class="inner">
				<p>{city}, {state}</p>
				<div class="map">
					<MapCounties data={shape} stroke="#fff" />
					<MapCounties data={states} position="absolute" stroke="#000" />
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- <Footer /> -->
<style>
	.map {
		position: relative;
	}

	.all .map {
		max-width: 1280px;
	}

	.cities .map {
		width: 500px;
		margin-bottom: 32px;
	}

	.cities {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}

	.inner {
	}

	.cities p {
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
