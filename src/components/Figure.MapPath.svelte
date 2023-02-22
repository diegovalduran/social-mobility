<script>
	import { getContext } from "svelte";

	export let features;
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;
	const { width, height, dpr, custom } = getContext("Figure");
</script>

<g class="g-map-path">
	{#each features as feature}
		<path
			on:click={() => {
				console.table(feature.properties.data);
			}}
			style:stroke
			style:stroke-width="{strokeWidth}px"
			style:fill={feature.properties.fill || "none"}
			d={$custom.pathFn(feature)}
		/>
	{/each}
</g>
