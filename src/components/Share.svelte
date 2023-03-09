<script>
	import { SvelteToast, toast } from "@zerodevx/svelte-toast";
	import { copy } from "svelte-copy";
	import Icon from "$components/helpers/Icon.svelte";
	export let url;

	const options = {
		duration: 1500,
		dismissable: false,
		intro: { y: 32 }
	};

	function notify() {
		toast.push("Link copied!");
	}
</script>

<SvelteToast {options} />

<div class="share">
	<button use:copy={url} on:svelte-copy={notify}>
		Share map <Icon name="forward" strokeWidth="3px" /></button
	>
</div>

<style>
	.share {
		position: fixed;
		bottom: 16px;
		right: 16px;
	}

	button {
		text-transform: uppercase;
		font-weight: bold;
		font-size: var(--16px) !important;
	}

	:global(body) {
		--toastBarBackground: transparent;
		--toastWidth: auto;
		--toastMinHeight: auto;
		--toastMsgPadding: 8px;
		--toastBorder: 1px solid var(--color-fg);
		--toastBorderRadius: var(--border-radius);
		--toastBackground: var(--color-bg);
		--toastColor: var(--color-fg);
		--toastContainerTop: auto;
		--toastContainerRight: 16px;
		--toastContainerBottom: 64px;
		--toastContainerLeft: auto;
	}

	:global(._toastMsg) {
		font-family: var(--font-form);
		font-size: var(--14px);
		text-transform: uppercase;
		font-weight: bold;
	}
</style>
