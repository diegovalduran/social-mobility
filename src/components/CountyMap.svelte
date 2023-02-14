<script>
	import { onMount, tick } from "svelte";
	import * as topojson from "topojson-client";
	import stateData from "$data/states.json";
	import countyTopo from "$data/cb_2021_us_county_20m.json";

	import { geoPath, geoAlbersUsa, geoCentroid } from "d3";

	const ratio = 1.6;
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

	const countyFeature = topojson.feature(
		countyTopo,
		countyTopo.objects.cb_2021_us_county_20m
	);

	const countyShapes = {
		...countyFeature,
		features: countyFeature.features.map((d) => ({
			...d,
			properties: {
				...d.properties,
				centroid: geoCentroid(d)
			}
		}))
	};

	// console.log({ countyTopo, countyShapes });

	function render() {
		console.time("render");
		ctx.fillStyle = "#fff";
		countyShapes.features.forEach((d) => {
			const p = new Path2D(path(d));
			ctx.fillStyle = "#ccc";
			ctx.strokeStyle = "#000";
			ctx.lineWidth = 0.5;
			ctx.stroke(p);
			ctx.fill(p);
		});
		console.timeEnd("render");
	}

	onMount(async () => {
		ctx = canvasEl.getContext("2d");
		dpr = Math.min(2, window.devicePixelRatio || 1);
		width = 960;
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
		render();
	});
</script>

<canvas
	style:width={canvasWidth}
	style:height={canvasHeight}
	width={contextWidth}
	height={contextHeight}
	bind:this={canvasEl}
/>

<style>
	canvas {
		display: block;
	}
</style>
