<script>
	import { browser } from "$app/environment";
	import { base } from "$app/paths";
	import { onMount, getContext } from "svelte";
	import { csv } from "d3";
	import storage from "$utils/localStorage.js";
	import getNearestOptions from "$utils/getNearestOptions.js";
	import getLocation from "$utils/getLocation.js";
	import Footer from "$components/Footer.svelte";
	import classics from "$data/classics.csv";
	import Map from "$components/Map.svelte";
	import Select from "$components/Select.svelte";

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
		try {
			// TODO remove test
			const test = true;
			const storageLocation = storage.get("pudding_samename");
			const location = storageLocation || (await getLocation(test)) || {};
			if (!storageLocation && location?.state)
				storage.set("pudding_samename", location);
			if (location?.state) options = await getNearestOptions(location);
		} catch (err) {
			console.log(err);
		}
	});

	$: if (browser && currentPhoneme)
		(async () =>
			(placeData = await csv(
				`${base}/assets/places/${currentPhoneme}.csv?${__TIMESTAMP__}`
			)))();
</script>

<article>
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
			<li>
				<button on:click={() => onChangePlace(d)}>{name}, {state}</button>
			</li>
		{/each}
	</ul>

	<section id="interactive">
		{#if placeData}
			<Select on:change={({ detail }) => onChangePlace(detail)} />
			<Map {placeData} placeName={currentName} />
			<p>{@html copy.help}</p>
		{/if}
	</section>
</article>

<style>
	article {
		padding: 0 16px;
	}

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
