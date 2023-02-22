<script>
	export let features;

	function getLabel(properties) {
		console.log(properties);
		return "hi";
	}
</script>

<div class="key">
	<ul>
		{#each features as { properties }}
			{@const { level, fill, label } = properties}
			<!-- {@const label = getLabel(properties)} -->
			<li style:color={fill} class={level}>
				{label}
			</li>
		{/each}
	</ul>
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
	}
</style>
