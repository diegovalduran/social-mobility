<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let rows = [];
	export let columns = [];
</script>

<SortTable {rows} {columns} />
