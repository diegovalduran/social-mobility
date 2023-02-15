<script>
	import { onMount, tick } from "svelte";

	import { extent, geoPath, geoAlbersUsa } from "d3";

	// TODO auto calculate?
	const ratio = 1.6;

	export let data;
	export let position = "relative";
	export let radius = 3;
	export let strokeWidth = 1;

	let width;
	let height;
	let projection;
	let path;

	$: features = data.features;
	$: projection = geoAlbersUsa().fitSize([width, height], data.states);
	$: path = geoPath().projection(projection).pointRadius(radius);

	onMount(async () => {
		height = Math.floor(width / ratio);
	});
</script>

<figure bind:clientWidth={width} style:position style:height="{height}px">
	{#if path}
		<svg {width} {height}>
			{#each data.places as feature}
				<path
					style:stroke-width="{strokeWidth}px"
					class="place-path"
					fill={feature.properties.fill}
					d={path(feature)}
				/>
			{/each}
		</svg>
	{/if}
</figure>

<style>
	figure {
		display: block;
		top: 0;
		left: 0;
		width: 100%;
	}

	path {
		stroke: #000;
	}
</style>
