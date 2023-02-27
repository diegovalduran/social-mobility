<script>
	import { onMount, getContext } from "svelte";
	import locate from "$utils/locate.js";
	import Footer from "$components/Footer.svelte";

	const copy = getContext("copy");
	const data = getContext("data");

	let location;
	onMount(async () => {
		location = await locate(true);
	});
</script>

<h1>{copy.title}</h1>
