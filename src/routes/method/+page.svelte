<script>
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import Meta from "$components/Meta.svelte";
	import Method from "$components/Method.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	version();
	// export let data;
</script>

<!-- <Meta {title} {description} {url} {keywords} /> -->
<Method />
