<script>
	import { getContext } from "svelte";

	import { geoPath, geoAlbersUsa, zoom, select, pointer } from "d3";

	export let projection = geoAlbersUsa();
	export let pointRadius = 2;

	let svgEl;
	let transform = "translate(0, 0) scale(1)";

	const { width, height, _, custom } = getContext("Figure");

	$: $custom.projectionFn = projection.fitSize(
		[$width, $height],
		$custom.projectionObject
	);

	$: $custom.pathFn = geoPath()
		.projection($custom.projectionFn)
		.pointRadius(pointRadius);
	$: if (svgEl) select(svgEl).call(zoomFn);

</script>

{#if $custom.pathFn && $width}
	<svg width={$width} height={$height} on:mousemove>
		<g {transform}>
			<slot />
		</g>
	</svg>
{/if}