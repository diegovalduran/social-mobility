<script>
	import { getContext, tick } from "svelte";

	import { geoPath, geoAlbersUsa } from "d3";

	export let features;
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;
	export let projection = geoAlbersUsa();
	export let pointerEvents = true;

	const { width, height, dpr, custom } = getContext("Figure");

	let canvasEl;

	$: ctx = canvasEl?.getContext("2d");
	$: mult = mode === "canvas" ? $dpr : 1;
	$: contextWidth = $width * mult;
	$: contextHeight = $height * mult;

	$: $custom.projectionFn = projection.fitSize(
		[contextWidth, contextHeight],
		$custom.projectionObject
	);
	$: $custom.pathFn = geoPath().projection($custom.projectionFn);

	$: if (mode === "canvas" && $custom.pathFn && contextWidth) render();

	function onZoom(event) {
		const { transform } = event;
		console.log(transform);
		// g.attr("transform", transform);
		// g.attr("stroke-width", 1 / transform.k);
	}

	function drawPath({ path, strokeStyle, fillStyle }) {
		ctx.beginPath();
		$custom.pathFn.context(ctx);
		pathFn(path);

		if (strokeStyle) {
			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
		}

		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	}

	async function render() {
		await tick();
		ctx.clearRect(0, 0, contextWidth, contextHeight);
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		features.forEach((feature) => {
			const { properties } = feature;
			const strokeStyle = properties.stroke || stroke;
			const fillStyle = properties.fill || fill;
			const path = feature;
			drawPath({ path, strokeStyle, fillStyle });
		});
	}
</script>

<canvas width={contextWidth} height={contextHeight} bind:this={canvasEl} />
