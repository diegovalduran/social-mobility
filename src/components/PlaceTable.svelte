<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let mobile;
	export let scrollable = true;
	export let rows = [];
	export let columns = [];
	export let caption;
	export let note;
</script>

<div class="place-table">
	<SortTable
		{caption}
		{rows}
		{columns}
		{mobile}
		{scrollable}
		--height={mobile ? "360px" : "640px"}
	/>
	<p>
		Note: {@html note}
	</p>
</div>

<style>
	div {
		margin: 32px auto;
		max-width: var(--col-width);
	}

	p {
		font-size: var(--14px);
	}

	/* :global(.place-table th:nth-of-type(1), .place-table td:nth-of-type(1)) {
		width: 37%;
	} */
	:global(.place-table th:nth-of-type(2), .place-table td:nth-of-type(2)) {
		width: 17%;
	}
	:global(.place-table th:nth-of-type(3), .place-table td:nth-of-type(3)) {
		width: 17%;
	}
	:global(.place-table th:nth-of-type(4), .place-table td:nth-of-type(4)) {
		width: 22%;
	}
</style>
