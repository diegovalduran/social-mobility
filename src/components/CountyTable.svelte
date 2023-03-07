<script>
	import SortTable from "$components/helpers/SortTable.svelte";
	export let rows = [];
	export let columns = [];
	export let caption;
	export let countyTableIntro;
</script>

<div class="county-table">
	<p>{@html countyTableIntro}</p>
	<SortTable {caption} {rows} {columns} scrollable={true} --height={"360px"} />
</div>

<style>
	p {
		margin: 48px 0;
	}

	div {
		margin: 32px auto;
		max-width: var(--col-width);
	}
</style>
