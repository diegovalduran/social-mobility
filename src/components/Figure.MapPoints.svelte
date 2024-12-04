<script>
	import { getContext } from "svelte";

	export let features = [];
	export let fill = undefined;
	export let stroke = undefined;
	export let strokeWidth = 0.5;
	export let r = 5;

	const { width, height, custom } = getContext("Figure");

	function createPointPath(feature) {
		const pointRadius = feature.properties.pointRadius || r;
		console.log(`Point: ${feature.properties.name}, Population: ${feature.properties.population}, Radius: ${pointRadius}`);
		$custom.pathFn.pointRadius(pointRadius);
		return $custom.pathFn(feature);
	}
</script>

<g class="g-map-points">
	{#each features as feature}
		{@const className = feature.properties.className}
		<path
			class={className}
			style:stroke
			style:stroke-width="{strokeWidth}px"
			fill={feature.properties.fill || fill}
			d={createPointPath(feature)}
		/>
	{/each}
</g>

<style>
	.g-map-points {
		pointer-events: none;
	}
</style>