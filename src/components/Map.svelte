<script>
	import { onMount, tick } from "svelte";
	import { browser } from "$app/environment";
	import resize from "$actions/resize.js";

	import { geoPath, geoAlbersUsa } from "d3";

	export let ratio;
	export let data;
	export let position = "relative";
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;
	export let projection = geoAlbersUsa();

	let canvasEl;
	let figureWidth;

	$: features = data.features;

	$: dpr = browser ? Math.min(2, window.devicePixelRatio || 1) : 1;
	$: width = figureWidth;
	$: height = Math.floor(width / ratio);
	$: ctx = canvasEl?.getContext("2d");
	$: contextWidth = width * dpr;
	$: contextHeight = height * dpr;

	$: projectionFn = projection.fitSize([contextWidth, contextHeight], data);
	$: pathFn = geoPath().projection(projectionFn);

	function render() {
		ctx.clearRect(0, 0, contextWidth, contextHeight);

		features.forEach((feature) => {
			const { properties } = feature;
			const strokeStyle = properties.stroke || stroke;
			const fillStyle = properties.fill || fill;

			ctx.beginPath();
			pathFn.context(ctx);
			pathFn(feature);

			if (strokeStyle) {
				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}

			if (fillStyle) {
				ctx.fillStyle = fillStyle;
				ctx.fill();
			}
		});
	}

	async function onResize() {
		await tick();
		render();
	}

	onMount(async () => {
		await tick();
		render();
	});
</script>

<figure
	bind:clientWidth={width}
	style:position
	style:height="{height}px"
	use:resize={{ debounce: 250 }}
	on:resize={onResize}
>
	<canvas
		width={contextWidth}
		height={contextHeight}
		style:width="{width}px"
		style:height="{height}px"
		bind:this={canvasEl}
	/>
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
</figure>

<style>
	figure {
		display: block;
		top: 0;
		left: 0;
		width: 100%;
	}
</style>
