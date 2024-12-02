<script>
	import { scaleLinear } from 'd3';
	export let features;
	export let max;
	export let colorToss;
	export let colorTossText;
	export let activeMode;

	$: top = features.slice(0, max);
	$: bottom = features.slice(max);
	$: others = bottom[0]?.properties;
	$: suffix = others?.name.endsWith("s") ? "" : "s";
	$: otherLabel = `Other ${others?.name}${suffix}`;

	// Define the color scale
	$: colorScale = scaleLinear()
		.domain(activeMode === "EC" ? [0, 1.36] : [0, 1000000])
		.range(['#0000ff', '#ff00ff', '#ff8000', '#ffcc99', '#ffff00']);

	// Create gradient stops with unique IDs
	$: gradientStops = colorScale.range().map((color, i) => ({
		color,
		offset: `${(i / (colorScale.range().length - 1)) * 100}%`
	}));

	// Format values based on mode
	$: formatValue = (value) => {
		if (activeMode === "POP") {
			return value.toLocaleString();
		}
		return value.toFixed(2);
	};
</script>

<div class="key">
	<div class="gradient-legend">
		<p class="legend-title">Legend</p>
		<svg width="100%" height="20">
			<defs>
				<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
					{#each gradientStops as {color, offset}}
						<stop stop-color={color} offset={offset}/>
					{/each}
				</linearGradient>
			</defs>
			<rect width="100%" height="20" fill="url(#gradient)"/>
		</svg>
		<div class="ticks">
			<span>{formatValue(colorScale.domain()[0])}</span>
			<span>{formatValue(colorScale.domain()[1])}</span>
		</div>
	</div>

	<div class="top">
		<ul class:others={!!others}>
			{#each top as { properties }}
				{@const { fills, label } = properties}
				<li style:color={fills.primary}>
					<span class="fills">
						<span
							class="fill"
							style:background={fills.primary}
							style:color={fills.textPrimary}
							><span class="text">probably</span></span
						>
						<span
							class="fill"
							style:background={fills.secondary}
							style:color={fills.textSecondary}
							><span class="text">maybe</span></span
						>
					</span>
					<span class="label">{label}</span>
				</li>
			{/each}
			<!-- others -->
			{#if others}
				<li style:color={others.fills.primary}>
					<span class="fills">
						<span
							class="fill"
							style:background={others.fills.primary}
							style:color={others.fills.textPrimary}
							><span class="text">primary</span></span
						>
						<span
							class="fill"
							style:background={others.fills.secondary}
							style:color={others.fills.textSecondary}
							><span class="text">secondary</span></span
						>
					</span>
					<span class="label">{otherLabel}</span>
				</li>
			{/if}

			<li style:color={colorTossText}>
				<span class="fills">
					<span class="fill" style:background={colorToss}>toss-up</span>
				</span>
				<span class="label">&nbsp;</span>
			</li>
		</ul>
	</div>
</div>

<style>
	.key {
		margin-top: 32px;
	}

	.gradient-legend {
		margin-bottom: 16px;
		text-align: center;
	}

	.legend-title {
		font-weight: bold;
		margin-bottom: 8px;
	}

	.ticks {
		display: flex;
		justify-content: space-between;
		margin-top: 4px;
		font-size: 0.8rem;
	}

	.ticks span {
		color: #666;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		list-style-type: none;
		margin: 0;
		padding: 0;
		justify-content: center;
	}

	.top li {
		font-weight: 700;
		margin-right: 16px;
		margin-bottom: 8px;
		display: flex;
		flex-direction: column;
		letter-spacing: 0.02em;
		width: calc(22.22% - 16px);
		min-width: 10em;
		font-size: var(--14px);
		position: relative;
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
		flex: 1;
		height: 24px;
		align-items: center;
		width: 50%;
	}

	span.label {
		margin-top: 4px;
		text-align: center;
		line-height: 1.2;
		font-size: var(--14px);
		font-weight: 900;
	}

	.top li:last-of-type {
		width: calc(11.11% - 8px);
		margin-right: 0;
		min-width: 5em;
	}

	span.fills {
		border: 1px solid currentColor;
	}

	span.text {
		visibility: hidden;
	}

	.top li:first-of-type span.text {
		visibility: visible;
	}

	@media only screen and (min-width: 960px) {
		span.label {
			font-size: var(--18px);
		}

		.top li {
			font-size: var(--16px);
		}
	}

	@media only screen and (min-width: 1280px) {
		span.label {
			font-size: var(--20px);
		}
	}
</style>
