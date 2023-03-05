<script>
	import { format } from "d3";
	export let features;

	export let max;
	export let colorToss;
	export let colorTossText;

	$: top = features.slice(0, max);
	$: bottom = features.slice(max);
	$: others = bottom[0]?.properties;
	$: suffix = others?.name.endsWith("s") ? "" : "s";
	$: summary = `Other ${others?.name}${suffix}`;
</script>

<div class="key">
	<div class="top">
		<ul>
			<li style:color={colorTossText}>
				<span class="fills">
					<span class="fill" style:background={colorToss} />
				</span>
				<span class="text">&nbsp;</span>
			</li>
			{#each top as { properties }}
				{@const { level, fills, label } = properties}
				{@const color = fills[0]}
				<li style:color class={level}>
					<span class="fills">
						{#each fills.slice(0, -1) as background}
							<span class="fill" style:background />
						{/each}
					</span>
					<span class="text">{label}</span>
				</li>
			{/each}
			<!-- others -->
			{#if others}
				<li style:color={others.fills[0]}>
					<span class="fills">
						{#each others.fills.slice(0, -1) as background}
							<span class="fill" style:background />
						{/each}
					</span>
					<span class="text">{summary}</span>
				</li>
			{/if}
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
	}

	li {
		font-weight: bold;
		margin-right: 16px;
		margin-bottom: 8px;
		display: flex;
		flex-direction: column;
		font-weight: 700;
		letter-spacing: 0.02em;
		width: calc(20% - 16px);
	}

	span {
		display: flex;
		justify-content: center;
	}

	span.fills {
		display: flex;
		flex-direction: row-reverse;
	}

	span.fill {
		display: inline-block;
		flex-grow: 1;
		height: 24px;
	}

	summary {
		font-weight: bold;
	}

	.bottom ul {
		justify-content: flex-start;
	}

	.top li {
		position: relative;
		/* width: 10em; */
	}

	.top li:first-of-type {
		/* width: 5em; */
		/* margin-right: 16px; */
	}

	.top li:first-of-type:before {
		content: "toss-up";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 0.75em;
		border: 1px solid currentColor;
	}

	.top li:nth-of-type(2):before {
		content: "probably";
		display: block;
		position: absolute;
		top: 0;
		left: 25%;
		transform: translate(-50%, 0);
		color: var(--color-bg);
		font-size: 0.75em;
	}

	.top li:nth-of-type(2):after {
		content: "maybe";
		display: block;
		position: absolute;
		top: 0;
		left: 75%;
		transform: translate(-50%, 0);
		color: var(--color-bg);
		font-size: 0.75em;
	}

	@media only screen and (min-width: 960px) {
		.key {
			font-size: var(--20px);
		}
	}
</style>
