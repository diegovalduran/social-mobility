<script>
	import { getContext, tick } from "svelte";

	import { geoPath, geoAlbersUsa } from "d3";

	export let topojson;
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;
	export let projection = geoAlbersUsa();

	const { width, height, dpr } = getContext("Figure");

	let canvasEl;

	$: features = topojson.features;
	$: isCollection = topojson.type === "FeatureCollection";

	$: ctx = canvasEl?.getContext("2d");
	$: contextWidth = $width * $dpr;
	$: contextHeight = $height * $dpr;

	$: projectionFn = projection.fitSize([contextWidth, contextHeight], topojson);
	$: pathFn = geoPath().projection(projectionFn);

	$: if (pathFn && contextWidth) render();

	function drawPath({ path, strokeStyle, fillStyle }) {
		ctx.beginPath();
		pathFn.context(ctx);
		pathFn(path);

		if (strokeStyle) {
			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
		}

		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	}

	async function render() {
		await tick();
		ctx.clearRect(0, 0, contextWidth, contextHeight);
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		if (isCollection) {
			features.forEach((feature) => {
				const { properties } = feature;
				const strokeStyle = properties.stroke || stroke;
				const fillStyle = properties.fill || fill;
				drawPath({ path: feature, strokeStyle, fillStyle });
			});
		} else drawPath({ path: topojson, strokeStyle: stroke, fillStyle: fill });
	}
</script>

<div class="figure-map">
	<canvas width={contextWidth} height={contextHeight} bind:this={canvasEl} />
</div>

<!-- {#if path && width}
		<svg {width} {height}>
			{#each features as feature}
				<path
					style:stroke
					style:stroke-width="{strokeWidth}px"
					style:fill={feature.properties.fill || "none"}
					d={path(feature)}
				/>
			{/each}
		</svg>
	{/if} -->
<style>
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
