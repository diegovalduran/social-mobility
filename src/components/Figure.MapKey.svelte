<script>
	import { format } from "d3";
	export let features;

	const max = 5;
	$: top = features.slice(0, max);
	$: bottom = features.slice(max);
	$: others = bottom[0]?.properties;
	$: suffix = others?.name.endsWith("s") ? "" : "s";
	$: summary = `Other ${others?.name}${suffix}`;
</script>

<div class="key">
	<div class="top">
		<ul>
			{#each top as { properties }}
				{@const { level, fill, label, tallyLower } = properties}
				{@const background = fill}
				<li style:color={fill} class={level}>
					<span class="text">{label}</span>
					<span class="fills">
						{#each [1, 0.75] as opacity}
							<span class="fill" style:opacity style:background />
						{/each}
					</span>
					<span class="tally-lower">{format(",")(tallyLower)}</span>
				</li>
			{/each}
		</ul>
	</div>

	{#if others}
		<div class="bottom">
			<details>
				<summary style:color={others.fill}>{summary}</summary>
				<ul>
					{#each bottom as { properties }}
						{@const { level, fill, label } = properties}
						{@const background = fill}
						<li style:color={fill} class={level}>
							<span class="text">{label}</span>
						</li>
					{/each}
				</ul>
			</details>
		</div>
	{/if}
</div>

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		list-style-type: none;
		margin: 0;
		padding: 0;
		justify-content: center;
	}

	li {
		font-weight: bold;
		margin-right: 16px;
		display: flex;
		flex-direction: column;
	}

	span {
		display: flex;
	}

	span.fill {
		display: inline-block;
		flex-grow: 1;
		height: 8px;
	}

	span.tally-lower {
		font-size: var(--32px);
		justify-content: center;
	}

	summary {
		font-weight: bold;
	}

	.bottom ul {
		justify-content: flex-start;
	}
</style>
