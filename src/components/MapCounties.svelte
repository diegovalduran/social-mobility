<script>
	import { onMount, tick } from "svelte";

	import { extent, geoPath, geoAlbersUsa } from "d3";

	// TODO auto calculate?
	const ratio = 1.6;

	export let data;
	export let position = "relative";
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;

	let ready;
	let figureWidth;
	let canvasEl;
	let ctx;
	let dpr;
	let contextWidth;
	let contextHeight;
	let canvasWidth;
	let canvasHeight;
	let projection;
	let path;

	$: features = data.features;
	$: projection = geoAlbersUsa().fitSize([contextWidth, contextHeight], data);
	$: path = geoPath().projection(projection);

	$: if (features && ready) {
		console.time("render");
		features.forEach((feature) => {
			ctx.beginPath();
			path.context(ctx);
			path(feature);

			if (stroke) {
				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = feature.properties.stroke || stroke;
				ctx.stroke();
			}

			if (fill || feature.properties.fill) {
				ctx.fillStyle = feature.properties.fill || fill;
				ctx.fill();
			}
		});

		// states.features.forEach((feature) => {
		// 	ctx.beginPath();
		// 	path.context(ctx);
		// 	path(feature);
		// 	ctx.lineWidth = 1;
		// 	ctx.strokeStyle = stroke;
		// 	ctx.stroke();
		// });

		console.timeEnd("render");
	}

	onMount(async () => {
		ctx = canvasEl.getContext("2d");
		dpr = Math.min(2, window.devicePixelRatio || 1);
		const w = figureWidth;
		const h = Math.floor(w / ratio);
		contextWidth = w * dpr;
		contextHeight = h * dpr;
		canvasWidth = `${w}px`;
		canvasHeight = `${h}px`;
		await tick();
		ready = true;
	});
</script>

<figure
	bind:clientWidth={figureWidth}
	style:position
	style:height={canvasHeight}
>
	<canvas width={contextWidth} height={contextHeight} bind:this={canvasEl} />
	<!-- {#if path}
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
	{/if} -->
</figure>

<style>
	figure {
		display: block;
		top: 0;
		left: 0;
		width: 100%;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
