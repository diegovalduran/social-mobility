<script>
	import { getContext } from "svelte";
	import { extent, scalePow, descending, geoCentroid, color } from "d3";
	import haversine from "haversine-distance";
	import WIP from "$components/helpers/WIP.svelte";
	import MapCounties from "$components/MapCounties.svelte";
	import cities from "$utils/cities.js";
	import counties from "$utils/counties.js";
	import states from "$utils/states.js";

	// import Footer from "$components/Footer.svelte";

	// const copy = getContext("copy");
	// const data = getContext("data");

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
		.filter((d) => d.city === "Portland")
		.map((d, i) => ({
			...d,
			fill: colors[i] || colors[colors.length - 1]
		}));

	const allDists = counties.features.map((d) => {
		const withDist = sample.map((s) => ({
			...s,
			dist: Math.floor(
				haversine(d.properties.centroid, [s.longitude, s.latitude]) / 1000
			)
		}));

		return extent(withDist, (d) => d.dist);
	});

	const extentDist = [
		Math.min(...allDists.map((d) => d[0])),
		Math.max(...allDists.map((d) => d[1]))
	];

	// TODO min should only be in bounds
	const scaleDist = scalePow().exponent(0.5).domain(extentDist).range([1, 0]);

	// TODO
	// 1000 = 0.1
	// 10000 = 0.2
	// 100000 = 0.4
	// 1000000 = 0.8
	const scalePopulation = scalePow()
		.exponent(1)
		.domain(extent(sample, (d) => d.population))
		.range([0.01, 1]);

	const getCountyData = (centroid) => {
		const withDist = sample.map((s) => ({
			...s,
			dist: Math.floor(haversine(centroid, [s.longitude, s.latitude]) / 1000)
		}));

		const withScore = withDist.map((d) => ({
			...d,
			scoreD: scaleDist(d.dist),
			scoreP: scalePopulation(d.population),
			score: scaleDist(d.dist) + scalePopulation(d.population)
		}));

		withScore.sort((a, b) => descending(a.score, b.score));

		return withScore;
	};

	const countiesWithData = {
		...counties,
		features: counties.features.map((d) => ({
			...d,
			properties: {
				...d.properties,
				data: getCountyData(d.properties.centroid)
			}
		}))
	};

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

	// get fill color of the matching city and using d3-color reduce the opacity based on the distance
	const getSampleFill = (state, data) => {
		const match = data.find((d) => d.state === state);
		const c = color(match.fill);
		c.opacity = Math.floor(match.scoreD * 10) / 10;
		return c.toString();
	};

	const bySample = sample.map(({ city, state }) => ({
		city,
		state,
		shape: {
			...countiesWithData,
			features: countiesWithData.features.map((d) => ({
				...d,
				properties: {
					...d.properties,
					fill: getSampleFill(state, d.properties.data)
				}
			}))
		}
	}));
	console.log(bySample);
</script>

<h1>
	What <strong>Portland</strong> means depending on where you are in the US
</h1>

<div class="all">
	<div class="map">
		<MapCounties data={countiesWithData} fill="#ccc" />
		<MapCounties data={states} position="absolute" stroke="#fff" />
	</div>
</div>

<div class="cities">
	{#each bySample as { city, state, shape }}
		<div class="map">
			<p>{city}, {state}</p>
			<MapCounties data={shape} stroke="#fff" />
		</div>
	{/each}
</div>

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

	.cities p {
		text-align: center;
	}

	h1 {
		text-align: center;
		line-height: 1.2;
	}
</style>
