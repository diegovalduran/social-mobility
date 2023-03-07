<script>
	import Typeahead from "svelte-typeahead";
	import { createEventDispatcher } from "svelte";
	import options from "$data/options.csv";

	const dispatch = createEventDispatcher();
	const extract = (item) => item.name;

	function onSelect(e) {
		const { name, phoneme } = e.detail.original;
		dispatch("change", { name, phoneme });
	}
</script>

<Typeahead
	label="Find a town/city"
	data={options}
	{extract}
	on:select={onSelect}
	inputAfterSelect="clear"
	limit={10}
/>

<style>
	:global([data-svelte-typeahead]) {
		background: var(--color-bg);
		color: var(--color-fg);
	}

	:global([data-svelte-typeahead] mark) {
		padding: 0;
	}

	:global([data-svelte-typeahead]) {
		background: none !important;
	}

	:global([data-svelte-typeahead] ul) {
		background: var(--color-bg) !important;
	}

	:global([data-svelte-typeahead] label) {
		font-size: var(--16px) !important;
	}

	:global([data-svelte-typeahead] input:focus) {
		outline-color: var(--color-focus) !important;
	}

	:global([data-svelte-typeahead] li) {
		border-color: var(--color-mark) !important;
	}

	:global([data-svelte-typeahead] li.selected) {
		background: var(--color-mark) !important;
		color: var(--color-fg) !important;
	}
</style>
