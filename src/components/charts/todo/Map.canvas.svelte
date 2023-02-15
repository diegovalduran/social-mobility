<script>
	import { getContext } from "svelte";
	import { scaleCanvas } from "layercake";
	import { geoPath } from "d3";

	const { data, width, height, zGet } = getContext("LayerCake");

	const { ctx } = getContext("canvas");

	export let projection;
	export let stroke = "#ccc";
	export let strokeWidth = 1;
	export let fill = undefined;

	$: projectionFn = projection().fitSize([$width, $height], $data);

	$: geoPathFn = geoPath(projectionFn);

	$: features = $data.features;

	$: {
		if ($ctx && geoPath) {
			scaleCanvas($ctx, $width, $height);
			$ctx.clearRect(0, 0, $width, $height);

			featuresToDraw.forEach((feature) => {
				$ctx.beginPath();
				// Set the context here since setting it in `$: geoPath` is a circular reference
				geoPathFn.context($ctx);
				geoPathFn(feature);

				$ctx.fillStyle = fill || $zGet(feature.properties);
				$ctx.fill();

				$ctx.lineWidth = strokeWidth;
				$ctx.strokeStyle = stroke;
				$ctx.stroke();
			});
		}
	}
</script>
