<script>
	import { getContext, createEventDispatcher } from "svelte";

	export let features;
	export let fill = "none";
	export let stroke;
	export let strokeWidth = 0.5;
	export let pointerEvents = false;

	let active;

	const { custom } = getContext("Figure");

	const dispatch = createEventDispatcher();

	function onMouseEnter(event, feature) {
		active = feature.id;
		dispatch("mouseenter", { event, feature });
	}

	$: mesh = !!features.type;
</script>

<g
	class="g-map-path"
	class:interactive={pointerEvents}
	style="--stroke-width: {strokeWidth};"
>
	{#if mesh}
		<path
			style:stroke
			style:stroke-width="{strokeWidth}px"
			style:fill
			d={$custom.pathFn(features)}
		/>
	{:else}
		{#each features as feature (feature.id)}
			<path
				style:stroke
				style:stroke-width={strokeWidth}
				style:fill={feature.properties.fill || fill}
				style:opacity={feature.properties.opacity}
				class:active={active === feature.id}
				d={$custom.pathFn(feature)}
				on:mouseleave={() => dispatch("mouseleave")}
				on:mouseenter={(e) => onMouseEnter(e, feature)}
			/>
		{/each}
	{/if}
</g>

<style>
	path {
		z-index: var(--z-middle);
		transition: fill 0.3s ease-out, opacity 0.3s ease-out;
	}

	.g-map-path {
		pointer-events: none;
	}

	.interactive {
		pointer-events: auto;
		cursor: crosshair;
	}
</style>
