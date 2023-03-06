<script>
	import { format } from "d3";
	export let places;

	const f = format(",d");
</script>

<table>
	<thead>
		<tr>
			<th>Place</th>
			<th>Counties (Probably)</th>
			<th>Counties (Maybe)</th>
			<th>Population</th>
			<th>Wikipedia Length</th>
		</tr>
	</thead>
	<tbody>
		{#each places as { properties }}
			{@const { label, population, wiki, count, countProbably, countMaybe } =
				properties}
			<tr>
				<td>{label}</td>
				<td>{f(countProbably)}</td>
				<td>{f(countMaybe)}</td>
				<td>{population ? f(population) : "-"}</td>
				<td>{wiki ? f(wiki) : "-"}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	th,
	td {
		text-align: right;
	}

	th:first-of-type,
	td:first-of-type {
		text-align: left;
	}
</style>
