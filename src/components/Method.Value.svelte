<script>
	import ButtonSet from "$components/helpers/ButtonSet.svelte";
	export let legend;
	export let valueProp;
	export let valueWeightDist;
	export let valueWeightPop;
	export let valueWeightWiki;
</script>

<div class="method-value">
	<fieldset>
		<legend>{legend}</legend>
		<div class="prop">
			<ButtonSet
				bind:value={valueProp}
				options={[{ value: "share" }, { value: "score" }]}
			/>

			<div class="weight">
				<p>Distance (weight: {valueWeightDist})</p>
				<input
					type="range"
					step={0.25}
					min={0}
					max={5}
					bind:value={valueWeightDist}
				/>

				<p>Population (weight: {valueWeightPop})</p>
				<input
					type="range"
					step={0.25}
					min={0}
					max={5}
					bind:value={valueWeightPop}
				/>

				<p>Wiki Length (weight: {valueWeightWiki})</p>
				<input
					type="range"
					step={0.25}
					min={0}
					max={5}
					bind:value={valueWeightWiki}
				/>
			</div>
		</div>
	</fieldset>
</div>

<style>
	.method-value {
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

	.bound input {
		display: flex;
	}

	input {
		width: 10rem;
	}

	p {
		margin: 0;
	}
</style>
