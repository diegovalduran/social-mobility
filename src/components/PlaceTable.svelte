<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let rows = [];
	export let columns = [];
	export let caption;
	export let note;
</script>

<div class="place-table">
	<SortTable {caption} {rows} {columns} scrollable={true} --height={"360px"} />
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
</style>
