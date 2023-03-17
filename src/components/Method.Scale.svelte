<script>
	import ButtonSet from "$components/helpers/ButtonSet.svelte";
	export let legend;
	export let valueScale;
	export let valueExp;
	export let valueBounds;
	$: expStr = valueScale === "scaleLog" ? "" : `.exponent(${valueExp})`;
</script>

<div class="method-scale">
	<fieldset>
		<legend class="sr-only">{legend}</legend>
		<div class="scale">
			<ButtonSet
				legend="scale type"
				bind:value={valueScale}
				options={[{ value: "scalePow" }, { value: "scaleLog" }]}
			/>
		</div>

		<div class="a exponent">
			<p>Exponent</p>
			<select bind:value={valueExp} disabled={valueScale === "scaleLog"}>
				<option>0.1</option>
				<option>0.25</option>
				<option>0.5</option>
				<option>0.67</option>
				<option>0.75</option>
				<option>1</option>
				<option>2</option>
			</select>
		</div>

		<div class="a bound">
			<p>Min</p>
			<input type="number" bind:value={valueBounds[0]} />
		</div>

		<div class="a bound">
			<p>Max</p>
			<input type="number" bind:value={valueBounds[1]} />
		</div>
	</fieldset>
</div>

<style>
	div {
		margin-top: 16px;
	}

	.a {
		display: flex;
		justify-content: space-between;
	}

	fieldset {
		background: var(--color-fg);
		color: var(--color-bg);
	}

	legend {
		background: var(--color-bg);
		color: var(--color-fg);
		padding: 8px;
		border: 1px solid var(--color-fg);
	}

	.exponent,
	.bound {
		display: flex;
		align-items: center;
	}

	select,
	input {
		width: 7rem;
		margin-left: 16px;
	}

	p {
		margin: 0;
	}

	select {
		background-color: var(--color-bg);
		color: var(--color-fg);
	}
</style>
