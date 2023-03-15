<script>
	import { getContext } from "svelte";

	const { width, height } = getContext("Figure");
	export let text;
	export let x;
	export let y;

	let clientWidth = 0;
	let clientHeight = 0;

	$: w = clientWidth / 2;
	$: h = clientHeight + 16;
	$: posRightEdge = x + w;
	$: posLeftEdge = x - w;
	$: posTopEdge = y - h;

	$: xRight = $width - posRightEdge < 0;
	$: xLeft = posLeftEdge < 0;
	$: yTop = posTopEdge < 0;
	$: tX = xRight ? "calc(-100% - 16px)" : xLeft ? "16px" : "-50%";
	$: tY = yTop ? "16px" : "calc(-100% - 16px)";
	$: transform = `translate(${tX}, ${tY})`;
</script>

{#if text}
	<div bind:clientWidth bind:clientHeight style:transform>
		<p>{@html text}</p>
	</div>
{/if}

<style>
	div {
		opacity: 0.9;
		width: 20em;
		padding: 8px;
		background: var(--color-fg);
		color: var(--color-bg);
	}

	p {
		margin: 0;
		font-size: var(--14px);
		padding: 0;
		line-height: 1.4;
	}
</style>
