<script>
	import { getContext } from "svelte";

	const { width, height } = getContext("Figure");
	export let text;
	export let rows;
	export let x;
	export let y;

	let clientWidth = 0;
	let clientHeight = 0;

	$: w = clientWidth / 2;
	$: h = clientHeight + 16;
	$: posRightEdge = x + w;
	$: posTopEdge = y - h;

	$: xRight = $width - posRightEdge < 0;
	$: xLeft = posRightEdge < 0;
	$: yTop = posTopEdge < 0;
	$: tX = xRight ? "calc(-100% - 16px)" : xLeft ? "16px" : "-50%";
	$: tY = yTop ? "16px" : "calc(-100% - 16px)";
	$: transform = `translate(${tX}, ${tY})`;
</script>

{#if text}
	<div bind:clientWidth bind:clientHeight style:transform>
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
