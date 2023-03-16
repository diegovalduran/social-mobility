<script>
	import { setContext } from "svelte";
	import Meta from "$components/Meta.svelte";
	import Method from "$components/Method.svelte";
	import copy from "$data/copy-method.json";
	import version from "$utils/version.js";

	version();

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
</script>

<Meta {title} {description} {url} {keywords} />
<Method />
