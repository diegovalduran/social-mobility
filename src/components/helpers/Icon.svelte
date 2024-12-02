<script>
	import { onMount } from "svelte";
	import { 
		X, 
		MapPin, 
		DollarSign, 
		Forward, 
		ChevronDown, 
		ChevronUp,
		ArrowUp,
		ArrowDown 
	} from "lucide-svelte";
	export const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

	export let name;
	export let direction = "n";
	export let size = "1em";
	export let color = undefined;
	export let strokeWidth = undefined;

	const components = { 
		X, 
		MapPin, 
		DollarSign, 
		Forward,
		ChevronDown,
		ChevronUp,
		ArrowUp,
		ArrowDown
	};

	const nameToComponent = (str) => {
		const camel = str.replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase());
		const upper = str.charAt(0).toUpperCase();
		const sliced = camel.slice(1);
		return `${upper}${sliced}`;
	};

	$: component = components[nameToComponent(name)];

	$: rotation = directions.indexOf(direction) * 45;
</script>

{#if component}
	<span class="icon" style="transform: rotate({rotation}deg);">
		<svelte:component this={component} {size} {color} {strokeWidth} />
	</span>
{/if}

<style>
	span {
		display: inline-block;
	}
</style>
