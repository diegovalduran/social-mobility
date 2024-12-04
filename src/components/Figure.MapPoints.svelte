<script>
	import { getContext } from "svelte";
	import { format } from "d3";
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let features = [];
	export let fill = undefined;
	export let stroke = undefined;
	export let strokeWidth = 0.5;
	export let r = 5;
	export let mode = "POP2018";

	const { width, height, custom } = getContext("Figure");

	const scale = tweened(0, {
		duration: 2000,
		easing: cubicOut
	});

	const opacity = tweened(0, {
		duration: 1500,
		easing: cubicOut
	});

	// Modified reactive statement - ensure animations trigger on mode change
	$: {
		mode;
		// Reset scale and opacity to initial state
		scale.set(0);
		opacity.set(0);

		// Animate scale and opacity
		scale.set(1.2, { duration: 1500 })
			.then(() => scale.set(1, { duration: 500 }));
		
		setTimeout(() => {
			opacity.set(1, { duration: 1500 });
		}, 500);
	}

	function createPointPath(feature) {
		const pointRadius = (feature.properties.pointRadius || r) * $scale;
		$custom.pathFn.pointRadius(pointRadius);
		return $custom.pathFn(feature);
	}

	function formatValue(feature) {
		if (mode === "POP2018") {
			return Math.round(feature.properties.population / 10000);
		} else if (mode === "NUM_BELOW_P50") {
			return Math.round(feature.properties.numBelowP50 / 10000);
		} else if (mode === "CLUSTERING") {
			return feature.properties.clusteringCounty?.toFixed(3) || "N/A";
		} else if (mode === "VOLUNTEERING") {
			return feature.properties.volunteeringRate?.toFixed(3) || "N/A";
		}
		return 0;
	}
</script>

<g class="g-map-points">
	{#each features as feature}
		{@const className = feature.properties.className}
		{@const point = $custom.pathFn.centroid(feature)}
		<path
			class={className}
			style:stroke
			style:stroke-width="{strokeWidth}px"
			style:opacity={$opacity}
			fill={feature.properties.fill || fill}
			d={createPointPath(feature)}
		/>
		<text
			x={point[0]}
			y={point[1]}
			text-anchor="middle"
			dominant-baseline="middle"
			class="population-label"
			style:opacity={$opacity}
			fill="#333333"
		>
			{formatValue(feature)}
		</text>
	{/each}
</g>

<style>
	.g-map-points {
		pointer-events: none;
	}

	.population-label {
		font-size: 10px;
		font-weight: 600;
		paint-order: stroke;
		stroke: white;
		stroke-width: 2px;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>