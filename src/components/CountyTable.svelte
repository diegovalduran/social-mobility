<script>
	import { ascending, descending } from "d3";
	export let rows = [];
	export let columns = [];

	$: rows.sort((a, b) => ascending(a.state, b.state));
</script>

<table>
	<thead>
		{#each columns as { key, title }}
			<th>{title}</th>
		{/each}
	</thead>
	<tbody>
		{#each rows as row}
			<tr>
				{#each columns as { key }}
					<td>{row[key]}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
