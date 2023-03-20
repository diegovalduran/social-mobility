<script>
	import Typeahead from "svelte-typeahead";
	import { createEventDispatcher } from "svelte";

	export let options;
	export let placeholder = "Look up a city or town in the US...";

	const dispatch = createEventDispatcher();
	const extract = (item) => item.name;

	function onSelect(e) {
		const { name, phoneme } = e.detail.original;
		dispatch("change", { name, phoneme });
	}
</script>

<Typeahead
	hideLabel
	label="Look up a city or town in the US"
	data={options}
	{extract}
	on:select={onSelect}
	inputAfterSelect="clear"
	limit={10}
	{placeholder}
/>

<style>
	:global([data-svelte-typeahead]) {
		background: none !important;
		color: var(--color-fg) !important;
	}

	:global([data-svelte-typeahead] ul) {
		background: var(--color-bg) !important;
	}

	:global([data-svelte-typeahead] li) {
		border-color: var(--color-mark) !important;
	}

	:global([data-svelte-typeahead] li.selected) {
		background: var(--color-mark) !important;
		color: var(--color-fg) !important;
	}

	:global([data-svelte-typeahead] mark) {
		padding: 0;
	}

	:global([data-svelte-typeahead] [data-svelte-search] input) {
		padding: 8px;
		line-height: 1.4;
		outline-color: var(--color-fg);
		border-radius: var(--border-radius);
	}

	:global([data-svelte-typeahead] [data-svelte-search] input:focus) {
		outline-color: var(--color-focus);
	}

	:global([data-svelte-typeahead] [data-svelte-search] input::placeholder) {
		opacity: 0.75;
	}
</style>
