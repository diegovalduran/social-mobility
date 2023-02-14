<script>
	import { onMount } from "svelte";
	import * as topojson from "topojson-client";
	import haversine from "haversine-distance";
	import cities from "$data/cities.csv";
	import states from "$data/states.json";
	import gridPointsUS from "$utils/gridPointsUS.js";
	import {
		Delaunay,
		descending,
		scaleLinear,
		scalePow,
		extent,
		geoPath,
		geoAlbersUsa,
		geoContains,
		range
	} from "d3";
	import { hexbin } from "d3-hexbin";

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
	data.sort((a, b) => descending(a.population, b.population));

	const sample = data
		.filter((d) => d.city === "Paris")
		.map((d, i) => ({
			...d,
			color: colors[i] || colors[colors.length - 1]
		}));

	const width = 640;
	const height = 480;
	const radius = 10;
	const gridPoints = gridPointsUS(radius);

	const continentalUS = {
		...states,
		objects: {
			states: {
				...states.objects.states,
				geometries: states.objects.states.geometries.filter(
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

	const rawStatesGeo = topojson.feature(states, states.objects.states);
	const statesGeo = {
		...rawStatesGeo,
		features: rawStatesGeo.features.filter((d) => d.properties.STATEFP !== "72")
	};

	const projection = geoAlbersUsa().fitSize([width, height], statesOuter);
	const path = geoPath().projection(projection).pointRadius(5);

	const rows = Math.ceil(height / radius);
	const cols = Math.ceil(width / radius);

	const usPoints = range(rows * cols)
		.map((d) => ({
			x: Math.floor(d % cols) * radius,
			y: Math.floor(d / cols) * radius,
			datapoints: 0
		}))
		.map((d) => {
			const [longitude, latitude] = projection.invert([d.x, d.y]);
			return { ...d, latitude, longitude };
		});

	// const pathContour = geoPath();

	const gridPointsInBounds = gridPoints.filter((d) => {
		// geoContains(statesGeo, d)
		return true;
	});

	// const gridPointsInBounds = gridPointsInBounds.concat(
	// 	sample.map((d) => [d.longitude, d.latitude])
	// );

	// const allDists = gridPointsInBounds.map((d) => {
	const allDists = usPoints.map((d) => {
		const withDist = sample.map((s) => ({
			...s,
			dist: Math.floor(
				haversine([d.longitude, d.latitude], [s.longitude, s.latitude]) / 1000
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

	// TODO ahhhhh redo everything
	const scalePopulation = scalePow()
		.exponent(1)
		.domain([0, 10000000])
		// .domain(extent(sample, (d) => d.population))
		.range([0.01, 0.5])
		.clamp(true);

	console.log(scalePopulation(10));
	console.log(scalePopulation(100));
	console.log(scalePopulation(1000));

	const getPointData = (point) => {
		const withDist = sample.map((s) => ({
			...s,
			dist: Math.floor(
				haversine(
					[point.longitude, point.latitude],
					[s.longitude, s.latitude]
				) / 1000
			)
		}));

		const withScore = withDist.map((d) => ({
			...d,
			score: scaleDist(d.dist) + scalePopulation(d.population)
		}));

		withScore.sort((a, b) => descending(a.score, b.score));

		return withScore;
	};

	const gridPointsWithScore = usPoints.map((point) => ({
		...point,
		// centroid: projection(point),
		data: getPointData(point)
	}));

	// .filter((d) => d.data && d.centroid);
	// console.log(gridPointsWithScore);

	// const scaleScore = scaleLinear()
	// 	.domain(extent(gridPointsWithScore, (d) => d.data.score))
	// 	.range([0, 1]);

	// const geojsonPoints = gridPointsWithScore.map((d, i) => {
	// 	return {
	// 		type: "Feature",
	// 		geometry: {
	// 			type: "Point",
	// 			coordinates: d
	// 		},
	// 		properties: {
	// 			index: i,
	// 			data: d.data
	// 		}
	// 	};
	// });

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

	// console.log(gridPointsWithScore[0].data);

	// console.table(x);
	// const contourData = gridPointsWithScore.reduce((prev, cur) => {
	// 	const numPoints = Math.floor(scaleScore(cur.data.score));
	// 	const arr = new Array(numPoints).fill(cur.centroid, 0, numPoints);
	// 	return [...prev, ...arr];
	// }, []);

	// const contour = contourDensity()
	// 	.x((d) => d[0])
	// 	.y((d) => d[1])
	// 	.size([width, height])
	// 	.thresholds(8)
	// 	.cellSize(4);

	// const contours = contour(contourData);
	// console.log(contourData);

	// const densityThresholds = contours.map(d => Math.floor(+d.value * 100000)/100000);
	// console.log(densityThresholds);

	// const colorScale = d3.scaleOrdinal()
	// .domain(densityThresholds)
	// .range(quantz.slice(-.length))
	// // console.log(gridPointsWithScore);
	// console.log(contours.length);

	// const points = gridPointsWithScore.map((d) => d.centroid);

	// const delaunay = Delaunay.from(points);
	// const voronoi = delaunay.voronoi([0, 0, width, height]);

	// const radius = 24;

	const hexbinner = hexbin()
		.x((d) => d.x)
		.y((d) => d.y)
		.radius(radius)
		.extent([
			[0, 0],
			[width, height]
		]);

	const bins = hexbinner(gridPointsWithScore);
	// console.log(gridPointsWithScore);

	// onMount(() => {
	// 	const context = canvasEl.getContext("2d");
	// 	const pr = geoAlbersUsa().fitSize([width, height], statesOuter);
	// 	const pather = geoPath().projection(pr).context(context);

	// 	const { features } = subs;

	// 	const feats = features.map((f) => turf.rewind(f, { reverse: true }));

	// 	for (let i = 0; i < feats.length; i++) {
	// 		const feature = feats[i];
	// 		context.beginPath();
	// 		context.lineWidth = 0.2;
	// 		context.strokeStyle = "black";
	// 		context.fillStyle = "red";
	// 		// context.fillStyle = data.has(feature.id)
	// 		//   ? colour(data.get(feature.id))
	// 		//   : traseGreys[7][2];
	// 		pather(feature);
	// 		context.fill();
	// 		context.stroke();
	// 	}
	// });
</script>

<ul>
	{#each sample as { city, state, population, color }}
		{@const background = color}
		<li style:background>{city}, <strong>{state}</strong> ({population})</li>
	{/each}
</ul>
<div>
	<!-- <canvas {width} {height} bind:this={canvasEl} /> -->
	<svg>
		<clipPath id="us-clip-path">
			<use xlink:href="#us-path" />
		</clipPath>

		<!-- <g class="voronoi">
			{#each gridPointsWithScore as { data }, i}
				{@const fill = data[0].color}
				{@const opacity = data[0].score < 0.9 ? 0.5 : 1}
				<path
					data-score={data[0].score}
					clip-path="url(#us-clip-path)"
					d={voronoi.renderCell(i)}
					style:fill
					style:opacity
				/>
			{/each}
		</g> -->

		<g class="hexbin" clip-path="url(#us-clip-path)">
			{#each bins as d}
				{@const fill = d[0].data[0].color}
				{@const opacity = d[0].data[0].score < 0.9 ? 0.5 : 1}
				<path
					d={hexbinner.hexagon()}
					style:fill
					style:opacity
					transform="translate({d.x}, {d.y})"
				/>
			{/each}
		</g>

		<g class="states-outer">
			<path id="us-path" d={path(statesOuter)} />
		</g>

		<!-- <g class="contours">
			{#each contours as d, i}
				<path
					clip-path="url(#us-clip-path)"
					d={pathContour(d)}
					style:fill={colors[i]}
				/>
			{/each}
		</g> -->

		<g class="sample">
			{#each geojsonSample as d}
				{@const fill = d.properties.data.color}
				<path d={path(d)} style:fill />
			{/each}
		</g>
		<!-- {#if spread > 1}
			<g class="grid-points">
				{#each geojsonPoints as d}
					<path
						data-score={d.properties.data.score}
						data-dist={d.properties.data.dist}
						d={path(d)}
						style:opacity={d.value}
					/>
				{/each}
			</g>
		{/if} -->
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

	.voronoi path {
		fill: none;
		/* stroke: rgba(255, 255, 255, 0.25); */
	}

	.zcta path {
		fill: none;
		stroke: gray;
	}

	.hexbin path {
		stroke: rgba(255, 255, 255, 0.25);
	}

	ul {
		list-style-type: none;
		width: 15rem;
	}
	li {
		padding: 4px;
		margin-bottom: 2px;
		color: white;
	}
</style>
