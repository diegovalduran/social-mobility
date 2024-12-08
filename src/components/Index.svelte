<script>
	import { csv, groups, descending } from "d3";
	import { onMount, getContext, onDestroy } from "svelte";
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
	import Map from "./Map.svelte";
	import Select from "$components/Select.svelte";
	import Share from "$components/Share.svelte";
	import Icon from "$components/helpers/Icon.svelte";
	import Tip from "$components/Tip.svelte";
	import options from "$data/options.csv";
	import classics from "$data/classics.csv";
	import changelog from "$data/places-changelog.csv";
	import MapHeader from "$components/MapHeader.svelte";
	import BubbleSection from "./BubbleSection.svelte";
	import PercentageBarChart from "./bar-chart/PercentageBarChart.svelte";
	import BarChartHeader from "./bar-chart/BarChartHeader.svelte";

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
	let highSchoolData;
	let clientWidth;
	let activeMode = "EC";
	let activeCountyMode = "OFF";
	let mounted = false;
	let visualizationMode = "bubbles";
	let showBarChart = true;
	let collegeData;
	let countyData;
	let isLoading = true;

	onMount(() => {
		mounted = true;
		return () => {
			mounted = false;
		};
	});

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

	function handleModeChange(event) {
		if (mounted) {
			const { mode, type } = event.detail;
			if (type === 'county') {
				activeCountyMode = mode;
			} else {
				activeMode = mode;
			}
			console.log("Mode changed in Index:", { activeMode, activeCountyMode });
			placeData = [...placeData];
		}
	}

	onMount(async () => {
		try {
			const us = await loadUSData();
			if (mounted) {
				counties = us.counties;
				states = us.states;
				countiesMesh = us.countiesMesh;
				statesMesh = us.statesMesh;
				nationMesh = us.nationMesh;
				highSchoolData = Array.from(us.highSchoolData.values());
				isLoading = false;

				const initialPlace = getPlaceFromUrl();
				onChangePlace(initialPlace);

				await customLocation();
			}
		} catch (err) {
			console.log(err);
		}
	});

	onDestroy(() => {
		mounted = false;
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
			{#if placeData && mounted}
				{#if visualizationMode === "map"}
					<MapHeader 
						{activeMode}
						{activeCountyMode}
						on:modeChange={handleModeChange}
					/>
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
						{activeMode}
						{activeCountyMode}
					/>
				{:else if visualizationMode === "bubbles"}
					{#if !isLoading}
						{#if highSchoolData}
							<BubbleSection 
								countyFeatures={highSchoolData}
								{activeMode}
							/>
						{:else}
							<p>Loading high school data...</p>
						{/if}
					{:else}
						<p>Loading...</p>
					{/if}
				{:else if visualizationMode === "bars"}
					<div class="bar-chart-container">
						<BarChartHeader 
							{activeMode}
							on:modeChange={handleModeChange}
						/>
						<PercentageBarChart 
							data={activeMode === "COUNTY" ? counties.features : collegeData}
							{activeMode}
						/>
					</div>
				{/if}
			{:else}
				<p class="loading">loading...</p>
			{/if}
			
			{#if shareUrl && visualizationMode === "map"}
				<Share text="Share map" url={shareUrl} />
			{/if}
		</section>
	</div>

	<div class="article-container">
		<article>
			<section id="intro">
				<div class="hero">
					<h1 class="hed">{copy.hed}</h1>
					<p class="overline"><strong>{@html copy.overline}</strong></p>
					<!-- <p class="dek">{copy.dek}</p> -->
				</div>

				<div class="ui" class:visible={!!placeData}>
					<div class="select">
						<Select {options} on:change={({ detail }) => onChangePlace(detail)} />
					</div>
				</div>
			</section>

			<section id="body">
				{#each copy.overview as { value }}
					<p>{@html value}</p>
				{/each}
				<hr class="separator" />
				
				{#each copy.map1 as { value }}
					<p>{@html value}</p>
				{/each}
				<hr class="separator" />

				<!-- First preset button -->
				<div class="preset-section">
					<h3 class="click-me">Click Me!</h3>
					<div class="preset-buttons">
						<button 
							class="preset-btn"
							class:active={activeMode === "EC" && activeCountyMode === "OFF"}
							on:click={() => {
								activeMode = "EC";
								activeCountyMode = "OFF";
							}}
						>
							Economic Connectedness
						</button>
					</div>
				</div>

				{#each copy.map2 as { value }}
					<p>{@html value}</p>
				{/each}
				<hr class="separator" />

				<!-- Second preset button -->
				<div class="preset-section">
					<h3 class="click-me">Click Me!</h3>
					<div class="preset-buttons">
						<button 
							class="preset-btn"
							class:active={activeMode === "EXPOSURE_GRP_MEM" && activeCountyMode === "POP2018"}
							on:click={() => {
								activeMode = "EXPOSURE_GRP_MEM";
								activeCountyMode = "POP2018";
							}}
						>
							Exposure & Population
						</button>
					</div>
				</div>

				{#each copy.map3 as { value }}
					<p>{@html value}</p>
				{/each}
				<hr class="separator" />

				<!-- Third preset button -->
				<div class="preset-section">
					<h3 class="click-me">Click Me!</h3>
					<div class="preset-buttons">
						<button 
							class="preset-btn"
							class:active={activeMode === "EXPOSURE_GRP_MEM_HIGH" && activeCountyMode === "POP2018"}
							on:click={() => {
								activeMode = "EXPOSURE_GRP_MEM_HIGH";
								activeCountyMode = "POP2018";
							}}
						>
							Exposure for High SES
						</button>
					</div>
				</div>

				{#each copy.map4 as { value }}
					<p>{@html value}</p>
				{/each}
				<hr class="separator" />

				<div class="preset-section">
					<h3 class="click-me">Click Me!</h3>
					<div class="preset-buttons">
						<button 
							class="preset-btn"
							class:active={activeMode === "EXPOSURE_GRP_MEM_HIGH" && activeCountyMode === "CLUSTERING"}
							on:click={() => {
								activeMode = "EXPOSURE_GRP_MEM_HIGH";
								activeCountyMode = "CLUSTERING";
								handleModeChange({ 
									detail: { 
										mode: "CLUSTERING", 
										type: "county" 
									}
								});
							}}
						>
							Clustering Percentage
						</button>
					</div>
				</div>

				{#each copy.map5 as { value }}
					<p>{@html value}</p>
				{/each}

				<div class="preset-section">
					<h3 class="click-me">Click Me!</h3>
					<div class="preset-buttons">
						<button 
							class="preset-btn"
							class:active={activeMode === "EXPOSURE_GRP_MEM_HIGH" && activeCountyMode === "VOLUNTEERING"}
							on:click={() => {
								activeMode = "EXPOSURE_GRP_MEM_HIGH";
								activeCountyMode = "VOLUNTEERING";
								handleModeChange({ 
									detail: { 
										mode: "VOLUNTEERING", 
										type: "county" 
									}
								});
							}}
						>
							Volunteering Rate
						</button>
					</div>
				</div>

				{#each copy.map6 as { value }}
					<p>{@html value}</p>
				{/each}

				<hr class="separator" />

				<div class="preset-section">
					<h3 class="click-me">Click Me!</h3>
					<div class="preset-buttons">
						<button 
							class="preset-btn"
							class:active={activeMode === "BIAS_GRP_MEM" && activeCountyMode === "VOLUNTEERING"}
							on:click={() => {
								activeMode = "BIAS_GRP_MEM";
								activeCountyMode = "VOLUNTEERING";
							}}
						>
							LOW SES Bias
						</button>
					</div>
				</div>

				{#each copy.map7 as { value }}
					<p>{@html value}</p>
				{/each}

				<div class="preset-section">
					<h3 class="click-me">Click Me!</h3>
					<div class="preset-buttons">
						<button 
							class="preset-btn"
							class:active={activeMode === "BIAS_GRP_MEM_HIGH" && activeCountyMode === "VOLUNTEERING"}
							on:click={() => {
								activeMode = "BIAS_GRP_MEM_HIGH";
								activeCountyMode = "VOLUNTEERING";
							}}
						>
							HIGH SES Bias
						</button>
					</div>
				</div>


				{#each copy.map8 as { value }}
					<p>{@html value}</p>
				{/each}
				<hr class="separator" />
			</section>
		</article>
	</div>
</div>

<style>
	:global(body) {
		overflow: hidden;
		margin: 0;
		padding: 0;
		background-color: #000019;
	}

	.layout {
		display: flex;
		height: 100vh;
		position: relative;
		background-color: #000019;
	}

	.map-container {
		flex: 0 0 75%;
		height: 100vh;
		overflow-y: auto;
		padding: 16px;
		display: block;
		background: transparent;
	}

	.article-container {
		flex: 0 0 25%;
		height: 100vh;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 16px 24px;
		border-left: 1px solid #ddd;
		background: white;
		font-family: "Times New Roman", Times, serif;
	}

	#interactive {
		height: auto;
		margin: 0;
		min-height: 0;
		position: relative;
		width: 100%;
		background: transparent;
	}

	.hero {
		margin-bottom: 48px;
		text-align: center;
	}

	.hed {
		font-size: 28px;
		line-height: 1.2;
		margin: 0 0 12px 0;
		font-weight: bold;
		text-align: center;
		font-family: "Times New Roman", Times, serif;
	}

	.overline {
		font-size: 12px;
		color: #666;
		margin: 0;
		font-style: italic;
		font-family: "Times New Roman", Times, serif;
	}

	p {
		font-size: 14px;
		line-height: 1.5;
		margin-bottom: 14px;
		font-family: "Times New Roman", Times, serif;
	}

	a {
		color: #000;
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	/* Style for bylines/credits */
	.credits {
		font-size: 12px;
		color: #666;
		margin: 24px 0;
		text-align: center;
	}

	.inner {
		display: flex;
		justify-content: center;
	}

	.inner > div {
		width: 50%;
	}

	.inner p {
		font-size: 14px;
		text-align: center;
		font-weight: 900;
		text-transform: uppercase;
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

	.bar-chart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		border-radius: 4px;
	}

	.bar-chart-container h2 {
		margin-bottom: 1rem;
		font-size: 1.5rem;
		text-align: center;
	}

	.separator {
		margin: 24px 0;
		border: none;
		height: 1px;
		background-color: #ddd; /* light grey color - you can adjust this */
		width: 100%;
	}

	.additional-content {
		margin-top: 24px;
	}

	.additional-content p {
		font-size: 14px;
		line-height: 1.5;
		margin-bottom: 14px;
		font-family: "Times New Roman", Times, serif;
	}

	.preset-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 0;
		justify-content: center;
	}

	.preset-btn {
		padding: 8px 16px;
		border: 1px solid #333;
		background: white;
		color: #333;
		cursor: pointer;
		border-radius: 20px;
		font-size: 14px;
		transition: all 0.2s ease;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
	}

	.preset-btn:hover {
		background: #f0f0f0;
	}

	.preset-btn.active {
		background: #333;
		color: white;
	}

	.preset-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 12px 0;
	}

	.click-me {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		font-size: 12px;
		margin-bottom: 4px;
		color: #333;
		font-weight: 600;
	}
</style>