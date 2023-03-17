<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let rows = [];
	export let columns = [];
	export let caption;
	export let note;
</script>

<div class="county-table">
	<SortTable {caption} {rows} {columns} scrollable={true} --height={"450px"} />
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

	:global(.county-table th:nth-of-type(1), .county-table td:nth-of-type(1)) {
		width: 18%;
	}
	:global(.county-table th:nth-of-type(2), .county-table td:nth-of-type(2)) {
		width: 11%;
	}
	:global(.county-table th:nth-of-type(5), .county-table td:nth-of-type(5)) {
		width: 12%;
	}
</style>
