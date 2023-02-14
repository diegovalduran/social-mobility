<script>
	import { onMount } from "svelte";
	// import * as turf from "@turf/turf";
	import * as topojson from "topojson-client";
	import haversine from "haversine-distance";
	import cities from "$data/cities.csv";
	import stateData from "$data/states.json";
	import countyData from "$data/counties.json";
	// import gridPointsUS from "$utils/gridPointsUS.js";
	import {
		Delaunay,
		descending,
		scaleLinear,
		scalePow,
		extent,
		geoPath,
		geoAlbersUsa,
		geoContains,
		polygonCentroid
	} from "d3";

	// console.log(zcta);
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

	const sample = data
		.filter((d) => d.city === "Portland")
		.map((d, i) => ({
			...d,
			color: colors[i] || colors[colors.length - 1]
		}));
	const width = 640;
	const height = 480;
	const spread = 2;
	// const gridPoints = gridPointsUS(spread);

	const continentalUS = {
		...stateData,
		objects: {
			states: {
				...stateData.objects.states,
				geometries: stateData.objects.states.geometries.filter(
					(d) => !["02", "15"].includes(d.properties.STATEFP)
				)
			}
		}
	};

	const statesOuter = topojson.mesh(
		continentalUS,
		continentalUS.objects.states,
		(a, b) => a === b
	);

	const rawStatesGeo = topojson.feature(stateData, stateData.objects.states);
	const statesGeo = {
		...rawStatesGeo,
		features: rawStatesGeo.features.filter((d) => d.properties.STATEFP !== "72")
	};

	const projection = geoAlbersUsa().fitSize([width, height], statesOuter);
	const path = geoPath().projection(projection).pointRadius(2);

	const counties = countyData.features
		.map((d) => {
			const centroid = polygonCentroid(d.geometry.coordinates[0]);
			return {
				...d,
				centroid
			};
		})
		.filter((d) => d.geometry.type === "Polygon");

	const allDists = counties.map((d) => {
		const withDist = sample.map((s) => ({
			...s,
			dist: Math.floor(haversine(d.centroid, [s.longitude, s.latitude]) / 1000)
		}));

		return extent(withDist, (d) => d.dist);
	});

	const extentDist = [
		Math.min(...allDists.map((d) => d[0])),
		Math.max(...allDists.map((d) => d[1]))
	];

	// console.log({ extentDist });
	// // TODO min should only be in bounds
	const scaleDist = scalePow().exponent(0.5).domain(extentDist).range([1, 0]);

	// 1000 = 0.1
	// 10000 = 0.2
	// 100000 = 0.4
	// 1000000 = 0.8
	const scalePopulation = scalePow()
		.exponent(1)
		.domain(extent(sample, (d) => d.population))
		.range([0.05, 0.5]);

	const getCountyData = (d) => {
		const withDist = sample.map((s) => ({
			...s,
			dist: Math.floor(haversine(d.centroid, [s.longitude, s.latitude]) / 1000)
		}));

		const withScore = withDist.map((d) => ({
			...d,
			score: scaleDist(d.dist) + scalePopulation(d.population)
		}));

		withScore.sort((a, b) => descending(a.score, b.score));

		return withScore;
	};

	const countiesWithScore = counties.map((d) => ({
		...d,
		data: getCountyData(d)
	}));

	console.log(countiesWithScore);
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
</script>

<div>
	<!-- <canvas {width} {height} bind:this={canvasEl} /> -->
	<svg>
		<clipPath id="us-clip-path">
			<use xlink:href="#us-path" />
		</clipPath>

		<g class="states-outer">
			<path id="us-path" d={path(statesOuter)} />
		</g>

		<g class="counties" clip-path="url(#us-clip-path)">
			{#each countiesWithScore as d}
				{@const fill = d.data[0].color}
				<path
					d={path(d)}
					style:fill={"red"}
					style:opacity={d.data[0].score < 1 ? 0.5 : 1}
				/>
			{/each}
		</g>

		<g class="sample">
			{#each geojsonSample as d}
				{@const fill = d.properties.data.color}
				<path d={path(d)} style:fill />
			{/each}
		</g>

		<g class="grid-points">
			<!-- {#each geojsonPoints as d}
				<path d={path(d)} style:opacity={0.25} />
			{/each} -->
		</g>

		<!-- <g class="voronoi">
			<path d={voronoi.render()} />
		</g> -->
	</svg>
</div>

<style>
	div {
		padding: 32px;
	}

	svg,
	canvas {
		display: block;
		width: 640px;
		height: 480px;
	}

	.states-outer path {
		fill: none;
		stroke: var(--color-fg);
	}

	.contours path {
		fill: red;
	}

	.grid-points path {
		opacity: 0.25;
	}

	.sample path {
		fill: white;
		stroke: black;
		stroke-width: 4px;
	}

	.counties path {
		fill: none;
		stroke: rgba(0, 0, 0, 0.25);
	}

	.zcta path {
		fill: none;
		stroke: gray;
	}
</style>
