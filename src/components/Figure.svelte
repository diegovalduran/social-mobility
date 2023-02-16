<!--
Usage:
	<Figure>
		<svg></svg>
	</Figure>

Pass style prop directives to set dimensions (defaults are all "auto")
	<Figure aspect-ratio="1"></Figure> 
	<Figure height="500px"></Figure>
-->
<script>
	import { writable } from "svelte/store";
	import { onMount, setContext, tick } from "svelte";
	import { browser } from "$app/environment";
	import resize from "$actions/resize.js";

	export let debounce = 250;
	export let exclude = "height";

	const width = writable(0);
	const height = writable(0);
	const dpr = writable(1);
	const custom = writable({});

	setContext("Figure", { width, height, dpr, custom });

	let clientWidth;
	let clientHeight;

	async function onResize() {
		await tick();
		$width = clientWidth;
		$height = clientHeight;
	}

	$: $dpr = browser ? Math.min(2, window.devicePixelRatio || 1) : 1;

	onMount(() => {
		onResize();
	});
</script>

<figure
	class="figure-slot"
	bind:clientWidth
	bind:clientHeight
	use:resize={{ exclude, debounce }}
	on:resize={onResize}
>
	<p>{$width}x{$height}</p>
	<slot />
</figure>

<style>
	figure {
		position: relative;
		display: block;
		width: var(--width, "auto");
		height: var(--height, "auto");
		aspect-ratio: var(--aspect-ratio, "auto");
		overflow: hidden;
	}

	:global(.figure-slot > *) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
