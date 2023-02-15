<script>
	import { onMount, tick } from "svelte";
	import { browser } from "$app/environment";

	import { extent, geoPath, geoAlbersUsa } from "d3";

	// TODO auto calculate?
	const ratio = 1.6;

	export let data;
	export let position = "relative";
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;

	let mounted;
	let canvasEl;
	let figureWidth;

	$: features = data.features;

	$: dpr = browser ? Math.min(2, window.devicePixelRatio || 1) : 1;
	$: width = figureWidth;
	$: height = Math.floor(width / ratio);
	$: ctx = canvasEl?.getContext("2d");
	$: contextWidth = width * dpr;
	$: contextHeight = height * dpr;

	$: projection = geoAlbersUsa().fitSize([contextWidth, contextHeight], data);
	$: path = geoPath().projection(projection);

	$: if (mounted) {
		console.time("render");
		ctx.clearRect(0, 0, contextWidth, contextHeight);
		console.log(ctx);
		features.forEach((feature) => {
			ctx.beginPath();
			path.context(ctx);
			path(feature);

			const { properties } = feature;

			const strokeStyle = properties.stroke || stroke;
			if (strokeStyle) {
				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}

			const fillStyle = properties.fill || fill;
			if (fillStyle) {
				ctx.fillStyle = fillStyle;
				ctx.fill();
			}
		});

		console.timeEnd("render");
	}

	onMount(async () => {
		await tick();
		mounted = true;
	});
</script>

<figure bind:clientWidth={width} style:position style:height="{height}px">
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
