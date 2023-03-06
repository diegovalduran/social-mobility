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
					<span class="fill" style:background={colorToss}>toss-up</span>
				</span>
				<span class="label">&nbsp;</span>
			</li>
			{#each top as { properties }}
				{@const { fills, label } = properties}
				<li style:color={fills.probably}>
					<span class="fills">
						<span
							class="fill"
							style:background={fills.probably}
							style:color={fills.textProbably}
							><span class="text">probably</span></span
						>
						<span
							class="fill"
							style:background={fills.maybe}
							style:color={fills.textMaybe}
							><span class="text">maybe</span></span
						>
					</span>
					<span class="label">{label}</span>
				</li>
			{/each}
			<!-- others -->
			{#if others}
				<li style:color={others.fills.probably}>
					<span class="fills">
						<span
							class="fill"
							style:background={others.fills.probably}
							style:color={others.fills.textProbably}
							><span class="text">probably</span></span
						>
						<span
							class="fill"
							style:background={others.fills.maybe}
							style:color={others.fills.textMaybe}
							><span class="text">maybe</span></span
						>
					</span>
					<span class="label">{summary}</span>
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
		width: calc(22.22% - 16px);
	}

	span {
		display: flex;
		justify-content: center;
	}

	span.fills {
		display: flex;
	}

	span.fill {
		display: inline-flex;
		flex-grow: 1;
		height: 24px;
		align-items: center;
		font-size: var(--16px);
	}

	summary {
		font-weight: bold;
	}

	.bottom ul {
		justify-content: flex-start;
	}

	.top li {
		position: relative;
	}

	.top li:first-of-type {
		width: calc(11.11% - 16px);
	}

	span.fills {
		border: 1px solid currentColor;
	}

	span.text {
		display: none;
	}

	.top li:nth-of-type(2) span.text {
		display: inline-block;
	}

	/* .top li:first-of-type:before {
		content: "toss-up";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 0.75em;
		border: 1px solid currentColor;
	} */

	/* .top li:nth-of-type(2):before {
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
	} */

	@media only screen and (min-width: 960px) {
		.key {
			font-size: var(--20px);
		}
	}
</style>
