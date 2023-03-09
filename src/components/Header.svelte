<script>
	import Icon from "$components/helpers/Icon.svelte";
	import { modal } from "$stores/misc.js";
	import wordmark from "$svg/wordmark.svg";
	import copy from "$data/copy-main.json";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding">{@html wordmark}</a>
	</div>

	<div class="info">
		<button on:click={() => ($modal = true)}>Info</button>
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal" class:visible={$modal} on:click={() => ($modal = false)}>
		<div class="bg" />
		<div class="content">
			<div class="inner" on:click|stopPropagation={() => {}}>
				{#each copy.info as { value }}
					<p>{@html value}</p>
				{/each}
			</div>
			<button><Icon name="x" strokeWidth="3px" /></button>
		</div>
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

	.modal {
		display: none;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: fixed;
		z-index: var(--z-overlay);
		cursor: pointer;
	}

	.bg {
		background: var(--color-fg);
		opacity: 0.9;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.content {
		position: absolute;
		padding: 16px;
		width: 90%;
		max-width: 30em;
		left: 50%;
		top: 50%;
		background: var(--color-bg);
		transform: translate(-50%, -50%);
		cursor: default;
	}

	.content button {
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(50%, -50%);
	}

	.modal.visible {
		display: block;
	}
</style>
