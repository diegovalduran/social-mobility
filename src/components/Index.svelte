<script>
	import { browser } from "$app/environment";
	import { base } from "$app/paths";
	import { onMount, getContext } from "svelte";
	import { csv } from "d3";
	import getNearestOptions from "$utils/getNearestOptions.js";
	import Footer from "$components/Footer.svelte";
	import classics from "$data/classics.csv";
	import Map from "$components/Map.svelte";

	const copy = getContext("copy");
	const data = getContext("data");

	let currentPhoneme;
	let currentName;
	let placeData;
	let options = [];

	function onChangePlace({ name, phoneme }) {
		currentPhoneme = phoneme;
		currentName = name;
	}

	onMount(async () => {
		const test = true;
		options = await getNearestOptions(test);
	});

	$: if (browser && currentPhoneme)
		(async () =>
			(placeData = await csv(
				`${base}/assets/places/${currentPhoneme}.csv?${__TIMESTAMP__}`
			)))();
</script>

<h1>{copy.title}</h1>
<p>{copy.intro}</p>
<details>
	<summary>{copy.summary}</summary>
	<p>
		{@html copy.details}
	</p>
</details>

<h3>{copy.classic}</h3>
<ul>
	{#each classics as d}
		{@const { name, phone } = d}
		<li><button on:click={() => onChangePlace(d)}>{name}</button></li>
	{/each}
</ul>

<h3>{copy.locate}</h3>
<ul>
	{#each options as d}
		{@const { name, phone, state } = d}
		<li><button on:click={() => onChangePlace(d)}>{name}, {state}</button></li>
	{/each}
</ul>

<section id="interactive">
	{#if placeData}
		<Map {placeData} />
		<p>{@html copy.help}</p>
	{/if}
</section>

<style>
	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
	}

	li {
		margin: 8px;
	}

	#interactive {
		max-width: 1280px;
	}
</style>
