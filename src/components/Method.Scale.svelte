<script>
	import ButtonSet from "$components/helpers/ButtonSet.svelte";
	import Range from "$components/helpers/Range.svelte";
	export let legend;
	export let valueScale;
	export let valueExp;
	export let valueLower;
	export let valueUpper;
</script>

<div>
	<fieldset>
		<legend>{legend}</legend>
		<!-- <p>Scale Type</p>
		<ButtonSet bind:value={valueScale} options={[{ value: "scalePow" }]} /> -->
		<p>Exponent</p>
		<Range min="0.1" max="4" step="0.1" bind:value={valueExp} />
		<p>
			<strong
				>{valueScale}().exponent({valueExp}).domain([{valueLower}, {valueUpper}])</strong
			>
		</p>

		<div class="bound">
			Lower Bound
			<input bind:value={valueLower} />
		</div>

		<div class="bound">
			Upper Bound
			<input bind:value={valueUpper} />
		</div>
	</fieldset>
</div>

<style>
	div {
		padding: 16px 0;
		margin: 16px 0;
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

	.bound input {
		display: flex;
	}

	input {
		width: 10rem;
	}
</style>
