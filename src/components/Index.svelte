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
	import loadUSData from "$data/loadUSData.js";
	import Footer from "$components/Footer.svelte";
	import Map from "$components/Map.svelte";
	import Select from "$components/Select.svelte";
	import Share from "$components/Share.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import Tip from "$components/Tip.svelte";
	import options from "$data/options.csv";
	import classics from "$data/classics.csv";

	const removeStorage = true;
	const testLocate = true;

	const copy = getContext("copy");
	const data = getContext("data");

	let currentPhoneme;
	let currentName;
	let placeData;
	let location;
	let nearestOptions;
	let countiesByDist;
	let open = false;
	let counties;
	let states;
	let countiesMesh;
	let statesMesh;
	let nationMesh;

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

	async function customLocation() {
		if (removeStorage) storage.remove("pudding_samename");

		const storageLocation = storage.get("pudding_samename");
		location = storageLocation || (await getLocation(testLocate)) || {};
		if (!storageLocation && location?.state)
			storage.set("pudding_samename", location);
		if (location?.state) {
			nearestOptions = await getNearestOptions(location);
			countiesByDist = await getCountiesByDist({ counties, location });
		}
		location.lat = +location?.lat;
		location.lon = +location?.lon;
	}

	onMount(async () => {
		try {
			const us = await loadUSData();
			counties = us.counties;
			states = us.states;
			countiesMesh = us.countiesMesh;
			statesMesh = us.statesMesh;
			nationMesh = us.nationMesh;

			const initialPlace = getPlaceFromUrl();
			onChangePlace(initialPlace);

			await customLocation();
		} catch (err) {
			console.log(err);
		}
	});

	$: shareUrl = `${$page.url}?place=${encodeURIComponent(currentName)}`;
	$: summarySuffix = location?.state ? "places near you" : "curated places.";

	$: if (browser && currentPhoneme)
		(async () =>
			(placeData = await csv(
				`${base}/assets/places/${currentPhoneme}.csv?${__TIMESTAMP__}`
			)))();
</script>

<article>
	<section id="intro">
		<div class="hero">
			<p class="overline"><strong>{copy.title}</strong></p>
			<h1 class="hed">{copy.hed}</h1>
			<!-- <p class="dek">{copy.dek}</p> -->
		</div>

		<div class="ui" class:visible={!!placeData}>
			<div class="select">
				<Select {options} on:change={({ detail }) => onChangePlace(detail)} />
			</div>

			<div class="discover">
				<details bind:open>
					<summary
						>{copy.discoverySummary}
						{summarySuffix}{#if location?.state}<Icon
								name="map-pin"
								strokeWidth="3px"
							/>{/if}</summary
					>

					<div class="inner">
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
					</div>
				</details>
			</div>
		</div>
	</section>

	<section id="interactive">
		{#if placeData}
			<Map
				{counties}
				{states}
				{countiesMesh}
				{statesMesh}
				{nationMesh}
				{placeData}
				placeName={currentName}
				{location}
				{countiesByDist}
			/>
		{:else}
			<p class="loading">loading...</p>
		{/if}

		{#if shareUrl}
			<Share url={shareUrl} />
		{/if}
	</section>

	<section id="outro">
		{#each copy.info as { value }}
			<p>{@html value}</p>
		{/each}
		<p>{@html copy.outro}</p>
		<p><Tip text="Send a tip to The Pudding" href="" /></p>
	</section>
</article>

<Footer />

<style>
	article {
		padding: 0 16px;
		max-width: 1280px;
		margin: 0 auto;
	}

	section {
		margin: 64px auto;
	}

	#intro {
		max-width: 42em;
		margin: 0 auto;
	}

	.overline {
		margin: 0;
	}

	.hed {
		margin-top: 8px;
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

	.ui {
		margin: 32px 0;
		visibility: hidden;
	}

	.ui.visible {
		visibility: visible;
	}

	.select {
		margin: 16px 0;
	}

	#interactive {
		min-height: 480px;
		margin: 64px auto;
	}

	#outro p {
		max-width: var(--col-width);
		margin: 16px auto;
	}

	.loading {
		text-align: center;
	}

	:global(summary svg) {
		margin-left: 4px;
		display: inline-block;
		vertical-align: baseline;
	}
</style>
