<script>
	import { onMount, tick } from "svelte";
	import * as topojson from "topojson-client";
	import haversine from "haversine-distance";
	import stateData from "$data/states.json";
	import countyTopo from "$data/cb_2021_us_county_20m.json";
	import cities from "$data/cities.csv";

	import {
		extent,
		scalePow,
		descending,
		geoPath,
		geoAlbersUsa,
		geoCentroid
	} from "d3";

	const ratio = 1.6;
	let figureWidth;
	let width;
	let height;
	let canvasEl;
	let ctx;
	let dpr;
	let contextWidth;
	let contextHeight;
	let canvasWidth;
	let canvasHeight;
	let projection;
	let path;
	let inputWeight = 0;
	let maxScore = 0;

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

	const data = cities.map((d) => ({
		...d,
		population: +d.population,
		latitude: +d.latitude,
		longitude: +d.longitude
	}));

	data.forEach((d) => {
		delete d.town_matches;
		delete d.state_matches;
		delete d.city_matches;
		delete d.country_matches;
	});
	const sample = data
		.filter((d) => d.city === "Portland")
		.map((d, i) => ({
			...d,
			fill: colors[i] || colors[colors.length - 1]
		}));

	const countyShapesRaw = topojson.feature(
		countyTopo,
		countyTopo.objects.cb_2021_us_county_20m
	);

	const countyShapes = {
		...countyShapesRaw,
		features: countyShapesRaw.features.map((d) => ({
			...d,
			properties: {
				...d.properties,
				centroid: geoCentroid(d)
			}
		}))
	};

	const allDists = countyShapes.features.map((d) => {
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

	let counties = {
		...countyShapes,
		features: countyShapes.features.map((d) => ({
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

	// const continentalUS = {
	// 	...stateData,
	// 	objects: {
	// 		states: {
	// 			...stateData.objects.states,
	// 			geometries: stateData.objects.states.geometries.filter(
	// 				(d) => !["02", "15"].includes(d.properties.STATEFP)
	// 			)
	// 		}
	// 	}
	// };

	// const statesOuter = topojson.mesh(
	// 	continentalUS,
	// 	continentalUS.objects.states,
	// 	(a, b) => a === b
	// );

	const stateShapesRaw = topojson.feature(stateData, stateData.objects.states);
	const states = {
		...stateShapesRaw,
		features: stateShapesRaw.features.filter(
			(d) => d.properties.STATEFP !== "72"
		)
	};

	function getRandomFill() {
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function render(random) {
		console.time("render");
		counties.features.forEach((feature) => {
			ctx.beginPath();
			path.context(ctx);
			path(feature);
			ctx.lineWidth = 0.5;
			ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
			ctx.fillStyle = random
				? getRandomFill()
				: feature.properties.data[0].fill;
			ctx.fill();
			ctx.stroke();
		});

		states.features.forEach((feature) => {
			ctx.beginPath();
			path.context(ctx);
			path(feature);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#fff";
			ctx.stroke();
		});

		// console.timeEnd("render");
	}

	onMount(async () => {
		ctx = canvasEl.getContext("2d");
		// dpr = Math.min(2, window.devicePixelRatio || 1);
		dpr = 1;
		width = figureWidth;
		height = Math.floor(width / ratio);
		contextWidth = width * dpr;
		contextHeight = height * dpr;
		canvasWidth = `${width}px`;
		canvasHeight = `${height}px`;
		await tick();
		projection = geoAlbersUsa().fitSize(
			[contextWidth, contextHeight],
			countyShapes
		);
		path = geoPath().projection(projection);
		// render();
	});

	let ahoy;
	function swapA() {
		// render(true);
		ahoy = true;
	}

	function swapB() {
		ahoy = false;
		// render();
	}

	function onInputChange() {
		const weight = +inputWeight;
		let maxD = 1;
		let maxP = 1;
		if (weight > 0) maxD = 1 + weight;
		if (weight < 0) maxP = 1 + -weight;
		scaleDist.range([maxD, 0]);
		scalePopulation.range([0.01, maxP]);
		maxScore = maxD + maxP;

		counties = {
			...countyShapes,
			features: countyShapes.features.map((d) => ({
				...d,
				properties: {
					...d.properties,
					data: getCountyData(d.properties.centroid)
				}
			}))
		};
	}
</script>

<input
	type="range"
	bind:value={inputWeight}
	min="-4"
	max="4"
	step="0.25"
	on:change={onInputChange}
/>
<figure bind:clientWidth={figureWidth}>
	<canvas
		style:width={canvasWidth}
		style:height={canvasHeight}
		width={contextWidth}
		height={contextHeight}
		bind:this={canvasEl}
	/>
	{#if path}
		<svg style:width={canvasWidth} style:height={canvasHeight}>
			{#each counties.features as feature}
				<path
					on:mouseenter={() => console.table(feature.properties.data)}
					class="feature-path"
					style:opacity={feature.properties.data[0].score < maxScore * 0.67
						? 0.5
						: 1}
					fill={ahoy ? getRandomFill() : feature.properties.data[0].fill}
					d={path(feature)}
				/>
			{/each}
		</svg>
	{/if}
	<button on:click={swapA}>A</button>
	<button on:click={swapB}>B</button>
</figure>

<style>
	figure {
		max-width: 1200px;
		margin: 0 auto;
	}

	canvas {
		display: none;
	}

	svg {
		display: block;
	}

	path {
		stroke: #fff;
		stroke-width: 0.125px;
	}
</style>
