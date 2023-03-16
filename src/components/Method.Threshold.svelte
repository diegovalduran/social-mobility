<script>
	import ButtonSet from "$components/helpers/ButtonSet.svelte";
	export let legend;
	export let thresholdLower;
	export let thresholdUpper;
</script>

<div class="method-threshold">
	<fieldset>
		<legend>{legend}</legend>
		<div class="threshold">
			<p>Score &gt;= {thresholdUpper} is 1</p>
			<input
				type="range"
				step={0.01}
				min={0.01}
				max={0.99}
				bind:value={thresholdUpper}
			/>
			<p>Score &gt;= {thresholdLower} is 0.75</p>
			<input
				type="range"
				step={0.01}
				min={0.01}
				max={0.99}
				bind:value={thresholdLower}
			/>
			<!-- <p>Score &lt;= {thresholdLower} is 0.75</p> -->
		</div>
	</fieldset>
</div>

<style>
	.method-threshold {
		width: 15rem;
	}

	div {
		margin-top: 16px;
	}

	fieldset {
		background: var(--color-fg);
		color: var(--color-bg);
		max-width: 480px;
	}

	legend {
		background: var(--color-bg);
		color: var(--color-fg);
		padding: 8px;
		border: 1px solid var(--color-fg);
	}

	input {
		width: 10rem;
	}

	p {
		margin: 0;
	}
</style>
