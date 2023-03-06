<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let rows = [];
	export let columns = [];
	export let caption;
</script>

<div class="places">
	<SortTable {caption} {rows} {columns} />
</div>
