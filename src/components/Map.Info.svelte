<script>
	export let displayName;
	export let topLabel;
	export let topColorPrimary;

</script>

<div class="info">
	<h2>
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
		line-height: 1.2;
	}

	@media only screen and (max-height: 800px) {
		h2 {
			margin: 16px auto;
			font-size: var(--32px);
		}
	}

	@media only screen and (max-width: 640px) {
		h2 {
			margin: 16px auto;
			font-size: var(--28px);
		}
	}

	@media only screen and (max-width: 420px) {
		h2 {
			margin: 16px auto;
			font-size: var(--24px);
		}
	}
</style>
