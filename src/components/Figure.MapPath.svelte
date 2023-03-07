<script>
	import { getContext } from "svelte";

	export let features;
	export let fill = "none";
	export let stroke;
	export let strokeWidth = 0.5;
	const { width, height, dpr, custom } = getContext("Figure");
</script>

<g class="g-map-path">
	{#each features as feature (feature.id)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<path
			style:stroke
			style:stroke-width="{strokeWidth}px"
			style:fill={feature.properties.fill || fill}
			d={$custom.pathFn(feature)}
		/>
	{/each}
</g>
