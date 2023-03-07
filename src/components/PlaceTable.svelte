<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let rows = [];
	export let columns = [];
	export let caption;
</script>

<div class="place-table">
	<SortTable {caption} {rows} {columns} scrollable={true} --height={"360px"} />
</div>

<style>
	div {
		margin: 32px auto;
		max-width: 800px;
	}
</style>
