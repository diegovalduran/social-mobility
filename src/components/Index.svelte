<script>
	import { csv, groups, descending } from "d3";
	import { onMount, getContext } from "svelte";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import { assets, base } from "$app/paths";
	import storage from "$utils/localStorage.js";
	import getNearestOptions from "$utils/getNearestOptions.js";
	import getCountiesByDist from "$utils/getCountiesByDist.js";
	import getLocation from "$utils/getLocation.js";
	import loadUSData from "$data/loadUSData.js";
	import viewport from "$stores/viewport.js";
	import Footer from "$components/Footer.svelte";
	import Map from "$components/Map.svelte";
	import Select from "$components/Select.svelte";
	import Share from "$components/Share.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import Tip from "$components/Tip.svelte";
	import options from "$data/options.csv";
	import classics from "$data/classics.csv";
	import changelog from "$data/places-changelog.csv";

	const copy = getContext("copy");
	const data = getContext("data");

	const ASPECT_RATIO = 975 / 610;

	const changelogByDate = groups(changelog, (d) => d.date).map(
		([date, values]) => ({
			date,
			values
		})
	);

	changelogByDate.sort((a, b) => descending(a.date, b.date));

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
	let clientWidth;

	function onChangePlace({ name, phoneme }) {
		open = false;
		currentPhoneme = phoneme;
		currentName = name;
	}

	function getRandom() {
		const starters = options.filter((d) => d.starter);
		const random = Math.floor(Math.random() * starters.length);
		return starters[random];
	}

	function getPlaceFromUrl() {
		const param = browser ? $page.url.search.split("place=")[1] : undefined;
		const clean = decodeURIComponent(param);
		window.history.replaceState({}, "", `${window.location.pathname}`);
		const match = options.find((d) => d.name === clean) || getRandom();
		return match;
	}

	async function customLocation() {
		const removeStorage = false;
		const testLocate = window.location.href.includes("localhost");

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

	$: interactiveHeight = (clientWidth / ASPECT_RATIO) * 1.25;
	$: shrink = interactiveHeight > $viewport.height;

	$: if (browser && currentPhoneme)
		(async () =>
			(placeData = await csv(
				`${base}/assets/places/${currentPhoneme}.csv?${__TIMESTAMP__}`
			)))();
</script>

<div class="layout">
	<div class="map-container">
		<section id="interactive" bind:clientWidth class:shrink>
			{#if placeData}
				<Map
					story={true}
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
				<Share text="Share map" url={shareUrl} />
			{/if}
		</section>
	</div>

	<div class="article-container">
		<article>
			<section id="intro">
				<div class="hero">
					<p class="overline"><strong>{@html copy.overline}</strong></p>
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

			<section id="outro">
				{#each copy.info as { value }}
					<p>{@html value}</p>
				{/each}
				<p>{@html copy.outro}</p>
				<p>
					<Tip
						text="Send a tip to The Pudding"
						href="https://donate.stripe.com/00g03oaJRggE3zqeUW"
					/>
				</p>
			</section>

			<section id="changelog">
				<details>
					<summary>Data Changelog</summary>
					<div class="inner">
						{#if changelogByDate.length === 0}
							<p>No changes to the data.</p>
						{:else}
							{#each changelogByDate as { date, values }}
								<p><strong>{date}</strong></p>
								<ul>
									{#each values as { text }}
										<li>{@html text}</li>
									{/each}
								</ul>
							{/each}
						{/if}
					</div>
				</details>
			</section>
		</article>
		<Footer />
	</div>
</div>

<style>
	/* Prevent scrolling on the body */
	:global(body) {
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.layout {
		display: flex;
		height: 100vh;
		position: relative;
	}

	.map-container {
		flex: 0 0 75%;
		height: 100vh;
		overflow-y: auto;
		padding: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.article-container {
		flex: 0 0 25%;
		height: 100vh;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 16px;
		border-left: 1px solid #ddd;
		background: white;
	}

	#interactive {
		height: 100%;
		margin: 0;
		min-height: 0;
		position: relative;
		width: 100%;
	}

	.overline {
		margin: 0;
		line-height: 1.2;
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
		font-weight: 900;
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

	#outro,
	#changelog {
		max-width: var(--col-width);
		margin: 32px auto;
	}

	#changelog {
		margin-top: 64px;
	}

	#changelog .inner {
		flex-direction: column;
	}

	#changelog p {
		text-align: left;
	}

	#changelog li {
		list-style-type: disc;
		margin-left: 24px;
	}

	.loading {
		text-align: center;
	}

	:global(summary svg) {
		margin-left: 4px;
		display: inline-block;
		vertical-align: baseline;
	}

	:global(.overline br) {
		display: none;
	}

	@media only screen and (max-width: 640px) {
		.hed {
			font-size: var(--32px);
		}

		.overline {
			font-size: var(--14px);
		}

		:global(.overline br) {
			display: block;
		}
	}

	@media only screen and (max-height: 800px) {
		#interactive {
			max-width: 500px;
			margin-top: 32px;
		}
	}

	@media only screen and (max-height: 700px) {
		#interactive {
			max-width: 400px;
			margin-top: 32px;
		}
	}
</style>
