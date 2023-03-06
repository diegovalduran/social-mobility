<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let rows = [];
	export let columns = [];
</script>

<div class="places">
	<SortTable {rows} {columns} />
</div>
