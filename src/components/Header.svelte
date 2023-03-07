<script>
	import wordmark from "$svg/wordmark.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding">{@html wordmark}</a>
	</div>

	<div class="info">
		<p>
			By <a
				href="https://pudding.cool/author/russell-samora"
				target="_blank"
				rel="noreferrer">Russell</a
			>
			+
			<a
				href="https://pudding.cool/author/michelle-mcghee"
				target="_blank"
				rel="noreferrer">Michelle</a
			>
		</p>
		<button>Info</button>
	</div>
</header>

<style>
	.wordmark {
		max-width: 12em;
		padding: 1em;
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}

	:global(.wordmark svg path) {
		fill: currentColor;
	}

	.info {
		position: absolute;
		top: 16px;
		right: 16px;
		text-align: right;
		display: flex;
		align-items: center;
	}

	.info button {
		font-size: var(--16px) !important;
		text-transform: uppercase;
		font-weight: bold;
	}

	.info p {
		margin: 0;
		margin-right: 12px;
		font-size: var(--16px) !important;
		line-height: 1;
	}
</style>
