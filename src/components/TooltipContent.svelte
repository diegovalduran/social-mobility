<script>
	export let text;
	export let rows;
</script>

{#if text}
	<div>
		<p>{text}</p>
		<table>
			<thead>
				<tr>
					<th> Place </th>
					<th> Score </th>
				</tr>
			</thead>
			<tbody>
				{#each rows as { label, value }}
					<tr>
						<td>{label}</td>
						<td>{value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	div {
		opacity: 0.9;
		width: 15em;
		padding: 8px;
		background: var(--color-fg);
		color: var(--color-bg);
		transform: translate(-50%, calc(-100% - 16px));
	}

	p,
	th,
	td {
		margin: 0;
		font-size: var(--14px);
		padding: 0;
		line-height: 1.4;
	}

	thead tr {
		border-bottom: 2px solid var(--color-mark);
	}

	th:last-of-type,
	td:last-of-type {
		text-align: right;
	}

	th,
	td {
		padding: 8px 0;
	}

	tr {
		border-bottom: 1px solid var(--color-mark);
	}

	tbody tr:last-of-type {
		border: none;
	}
</style>
