<script>
	import { csv } from "d3";
	import { onMount, getContext } from "svelte";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import { assets, base } from "$app/paths";
	import storage from "$utils/localStorage.js";
	import getNearestOptions from "$utils/getNearestOptions.js";
	import getCountiesByDist from "$utils/getCountiesByDist.js";
	import getLocation from "$utils/getLocation.js";
	import Footer from "$components/Footer.svelte";
	import classics from "$data/classics.csv";
	import Map from "$components/Map.svelte";
	import Select from "$components/Select.svelte";
	import Share from "$components/Share.svelte";
	import options from "$data/options.csv";

	const removeStorage = true;
	const testLocate = false;

	const copy = getContext("copy");
	const data = getContext("data");

	let currentPhoneme;
	let currentName;
	let placeData;
	let location;
	let nearestOptions;
	let countiesByDist;
	let open = false;

	function onChangePlace({ name, phoneme }) {
		open = false;
		currentPhoneme = phoneme;
		currentName = name;
	}

	function getPlaceFromUrl() {
		const param = browser ? $page.url.search.split("place=")[1] : undefined;
		const clean = decodeURIComponent(param);
		window.history.replaceState({}, "", `${window.location.pathname}`);
		const match = options.find((d) => d.name === clean) || classics[0];
		return match;
	}

	onMount(async () => {
		const initialPlace = getPlaceFromUrl();
		onChangePlace(initialPlace);

		try {
			if (removeStorage) storage.remove("pudding_samename");

			const storageLocation = storage.get("pudding_samename");
			location = storageLocation || (await getLocation(testLocate)) || {};
			if (!storageLocation && location?.state)
				storage.set("pudding_samename", location);
			if (location?.state) {
				nearestOptions = await getNearestOptions(location);
				countiesByDist = await getCountiesByDist(
					location,
					nearestOptions[0].county
				);
			}
			location.lat = +location?.lat;
			location.lon = +location?.lon;
		} catch (err) {
			console.log(err);
		}
	});

	$: shareUrl = `${$page.url}?place=${encodeURIComponent(currentName)}`;

	$: if (browser && currentPhoneme)
		(async () =>
			(placeData = await csv(
				`${base}/assets/places/${currentPhoneme}.csv?${__TIMESTAMP__}`
			)))();
</script>

<article>
	<section id="intro">
		<h1>{copy.title}</h1>
		<p>{copy.intro}</p>

		<div class="discover">
			<details {open}>
				<summary>{copy.discoverySummary}</summary>

				<div class="inner">
					<div class="classic">
						<p>{copy.classic}</p>
						<ul>
							{#each classics as d}
								{@const { name } = d}
								<li>
									<button on:click={() => onChangePlace(d)}>{name}</button>
								</li>
							{/each}
						</ul>
					</div>

					{#if nearestOptions && nearestOptions.length}
						<div class="locate">
							<p>{copy.locate}</p>
							<ul>
								{#each nearestOptions as d}
									{@const { name, state } = d}
									<li>
										<button on:click={() => onChangePlace(d)}
											>{name}, {state}</button
										>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</details>

			{#if (location && !location.state) || placeData}
				<div class="select">
					<Select {options} on:change={({ detail }) => onChangePlace(detail)} />
				</div>
			{/if}
		</div>
	</section>

	<section id="interactive">
		{#if placeData}
			<Map {placeData} placeName={currentName} {location} {countiesByDist} />
			<p>{@html copy.help}</p>
		{:else}
			<p class="loading">loading...</p>
		{/if}

		{#if shareUrl}
			<Share url={shareUrl} />
		{/if}
	</section>
</article>

<style>
	article {
		padding: 0 16px;
		max-width: 1280px;
		margin: 0 auto;
	}

	#intro {
		max-width: 40em;
		margin: 0 auto;
	}

	h1 {
		line-height: 1.2;
	}

	.inner {
		display: flex;
		justify-content: center;
	}

	.inner > div {
		width: 50%;
	}

	.inner p {
		text-align: center;
		font-weight: bold;
		text-transform: uppercase;
		font-size: var(--16px);
		margin-bottom: 0;
	}

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	li {
		margin: 8px;
		flex: 1;
	}

	button {
		width: 100%;
	}

	.select {
		margin-top: 16px;
	}

	#interactive {
		margin: 64px auto;
	}

	#interactive p {
		max-width: var(--col-width);
		margin: 0 auto;
	}

	.loading {
		text-align: center;
	}
</style>
