<script>
	export let placeName;
	export let topPlace;

	let waiting;
	let displayName;

	$: topLabel = topPlace.label;
	$: topColorPrimary = topPlace.fills.primary;
	$: placeName, (waiting = true);
	$: topLabel, (waiting = false);
	$: if (!waiting) displayName = placeName;
</script>

<div class="info">
	<h2>
		In most US counties, <strong>{displayName}</strong> usually refers to
		<strong style:color={topColorPrimary}>{topLabel}.</strong>
	</h2>
</div>

<style>
	.info {
		margin: 0 auto;
	}

	h2 {
		margin: 32px auto;
		text-align: center;
	}
</style>
