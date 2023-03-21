<script>
	import { browser } from "$app/environment";
	import { base } from "$app/paths";
	import { page } from "$app/stores";

	import { onMount, getContext } from "svelte";
	import { csv, descending, format } from "d3";
	import Select from "$components/Select.svelte";
	import Map from "$components/Map.svelte";
	import Scale from "$components/Method.Scale.svelte";
	import Value from "$components/Method.Value.svelte";
	import Threshold from "$components/Method.Threshold.svelte";
	import Footer from "$components/Footer.svelte";
	import Share from "$components/Share.svelte";
	import loadUSData from "$data/loadUSData.js";
	import options from "$data/options.csv";
	import { shareVisible } from "$stores/misc.js";
	import urlParams from "$utils/urlParams.js";

	const copy = getContext("copy");
	const data = getContext("data");

	let fromUrl = false;

	let scaleTypePop = "scalePow";
	let scaleTypeWiki = "scalePow";
	let scaleTypeDist = "scaleLog";

	let scaleExpPop = "0.67";
	let scaleExpWiki = "0.67";
	let scaleExpDist = "1";

	let scaleBoundsPop = [0, 22933531];
	let scaleBoundsWiki = [0, 96911];
	let scaleBoundsDist = [50, 300];

	let valueWeightDist = 2;
	let valueWeightPop = 1;
	let valueWeightWiki = 1;

	let thresholdLower = 0.05;
	let thresholdUpper = 0.2;
	let valueProp = "shareDelta";
	let valueScale = "yes";

	let placeData;
	let counties;
	let states;
	let countiesMesh;
	let statesMesh;
	let nationMesh;
	let currentPhoneme;
	let currentName;
	let showSettings;

	$shareVisible = true;

	$: if (browser && currentPhoneme)
		(async () =>
			(placeData = await csv(
				`${base}/assets/places/${currentPhoneme}.csv?${__TIMESTAMP__}`
			)))();

	$: props = {
		scaleTypePop,
		scaleTypeWiki,
		scaleTypeDist,
		scaleExpPop,
		scaleExpWiki,
		scaleExpDist,
		scaleBoundsPop,
		scaleBoundsWiki,
		scaleBoundsDist,
		valueWeightDist,
		valueWeightPop,
		valueWeightWiki,
		thresholdLower,
		thresholdUpper,
		valueProp,
		valueScale
	};

	$: params = Object.keys(props)
		.map((key) => `${key}=${encodeURIComponent(props[key])}`)
		.join("&");

	$: shareUrl = `${$page.url}?${params}`;

	function onChangePlace({ name, phoneme }) {
		currentPhoneme = phoneme;
		currentName = name;
	}

	function parseParams() {
		Object.keys(props).forEach((p) => {
			const v = urlParams.get(p);
			if (v) {
				fromUrl = true;
				if (p === "scaleTypePop") scaleTypePop = v;
				if (p === "scaleTypeWiki") scaleTypeWiki = v;
				if (p === "scaleTypeDist") scaleTypeDist = v;
				if (p === "scaleExpPop") scaleExpPop = v;
				if (p === "scaleExpWiki") scaleExpWiki = v;
				if (p === "scaleExpDist") scaleExpDist = v;

				if (p === "scaleBoundsPop")
					scaleBoundsPop = v.split(",").map((d) => +d);
				if (p === "scaleBoundsWiki")
					scaleBoundsWiki = v.split(",").map((d) => +d);
				if (p === "scaleBoundsDist")
					scaleBoundsDist = v.split(",").map((d) => +d);

				if (p === "valueWeightDist") valueWeightDist = +v;
				if (p === "valueWeightPop") valueWeightPop = +v;
				if (p === "valueWeightWiki") valueWeightWiki = +v;
				if (p === "thresholdLower") thresholdLower = +v;
				if (p === "thresholdUpper") thresholdUpper = +v;

				if (p === "valueProp") valueProp = v;
				if (p === "valueScale") valueScale = v;
			}
		});
		window.history.replaceState({}, "", `${window.location.pathname}`);
	}

	onMount(async () => {
		try {
			parseParams();

			const us = await loadUSData();
			counties = us.counties;
			states = us.states;
			countiesMesh = us.countiesMesh;
			statesMesh = us.statesMesh;
			nationMesh = us.nationMesh;

			const start = options.find((d) => d.name === "Portland");
			onChangePlace(start);
		} catch (err) {
			console.log(err);
		}
	});
</script>

<article class="method">
	<section id="title">
		<h1><strong>{@html copy.hed}</strong></h1>
		<p>
			{@html copy.dek}
		</p>
		{#if fromUrl}
			<p>
				<strong>Note:</strong> Not showing our defaults settings, but those shared
				in the link you clicked.
			</p>
		{/if}
		<p class="small">
			<!-- Increase your screen size or visit on desktop to customize the settings. -->
			<button on:click={() => (showSettings = !showSettings)}
				>{showSettings ? "Hide" : "Show"} settings</button
			>
		</p>
	</section>

	<section id="ui" class:visible={showSettings}>
		<div class="select">
			<Select {options} on:change={({ detail }) => onChangePlace(detail)} />
		</div>

		<div class="play">
			<h2>Introduction</h2>
			<details open>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.introExplanation as { value }}
						<p>{@html value}</p>
					{/each}
				</div>
			</details>
		</div>

		<div class="play">
			<h2>Value</h2>
			<div class="customize">
				<Value
					bind:valueProp
					bind:valueScale
					bind:valueWeightDist
					bind:valueWeightPop
					bind:valueWeightWiki
					legend="Value"
				/>
			</div>
			<details>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.valueExplanation as { value }}
						<p>{@html value}</p>
					{/each}
				</div>
			</details>
		</div>
		<div class="play">
			<h2>Opacity Threshold</h2>
			<div class="customize">
				<Threshold
					bind:thresholdLower
					bind:thresholdUpper
					legend="Opacity threshold"
				/>
			</div>
			<details>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.thresholdExplanation as { value }}
						<p>{@html value}</p>
					{/each}
				</div>
			</details>
		</div>

		<div class="play">
			<h2>Distance Scale</h2>
			<div class="customize">
				<Scale
					bind:valueScale={scaleTypeDist}
					bind:valueExp={scaleExpDist}
					bind:valueBounds={scaleBoundsDist}
					legend="Distance Scale (mi)"
				/>
			</div>
			<details>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.distanceExplanation as { value }}
						<p>{@html value}</p>
					{/each}
				</div>
			</details>
		</div>

		<div class="play">
			<h2>Population Scale</h2>
			<div class="customize">
				<Scale
					bind:valueScale={scaleTypePop}
					bind:valueExp={scaleExpPop}
					bind:valueBounds={scaleBoundsPop}
					legend="Population Scale (people)"
				/>
			</div>
			<details>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.populationExplanation as { value }}
						<p>{@html value}</p>
					{/each}
				</div>
			</details>
		</div>

		<div class="play">
			<h2>Wikipedia Article Scale</h2>
			<div class="customize">
				<Scale
					bind:valueScale={scaleTypeWiki}
					bind:valueExp={scaleExpWiki}
					bind:valueBounds={scaleBoundsWiki}
					legend="Wiki Scale (article length)"
				/>
			</div>
			<details>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.wikiExplanation as { value }}
						<p>{@html value}</p>
					{/each}
				</div>
			</details>
		</div>

		<div class="play">
			<h2>Miscellaneous Details</h2>
			<details open>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.miscExplanation as { value }}
						<p>{@html value}</p>
					{/each}
				</div>
			</details>
		</div>
	</section>
</article>

<div class="figure method">
	<section id="maps">
		{#if placeData}
			<div class="top-score">
				<Map
					{counties}
					{states}
					{countiesMesh}
					{statesMesh}
					{nationMesh}
					{placeData}
					placeName={currentName}
					{scaleTypePop}
					{scaleTypeWiki}
					{scaleTypeDist}
					{scaleExpPop}
					{scaleExpWiki}
					{scaleExpDist}
					{scaleBoundsPop}
					{scaleBoundsWiki}
					{scaleBoundsDist}
					{valueWeightDist}
					{valueWeightPop}
					{valueWeightWiki}
					{thresholdLower}
					{thresholdUpper}
					{valueProp}
					{valueScale}
				/>
			</div>
			<Share text="Share your settings" url={shareUrl} />
		{/if}
	</section>
</div>

<!-- <Footer /> -->
<style>
	article {
		font-size: var(--16px);
		padding: 16px;
	}

	#title {
		text-align: center;
	}

	h1 {
		font-size: var(--36px);
	}

	.top-score {
		max-width: 1280px;
	}

	#ui {
		width: calc(100% - 32px);
		position: absolute;
		display: flex;
		flex-direction: column;
		background: var(--color-bg);
		padding: 32px;
		transform: translate(-125%, 0);
		transition: transform 0.5s ease-in-out;
		z-index: var(--z-top);
	}

	#ui.visible {
		transform: translate(0, 0);
	}

	.figure {
		position: relative;
		padding: 0 32px;
		max-width: 1280px;
		min-height: 101vh;
	}

	#maps {
		width: 100%;
	}

	.play {
		margin-top: 32px;
		max-width: 22rem;
	}

	h2 {
		font-size: var(--24px);
	}

	details div {
		border: 2px solid var(--color-mark);
		padding: 16px;
		background: var(--color-bg);
	}

	:global(.play details p:first-of-type) {
		margin-top: 0;
	}

	:global(.play details p:last-of-type) {
		margin-bottom: 0;
	}

	.inner {
		transform: translate(0, -4px);
		z-index: var(--z-middle);
	}

	summary {
		z-index: var(--z-top);
	}

	@media only screen and (min-width: 960px) {
		.small {
			display: none;
		}

		article {
			width: 22rem;
		}

		.figure {
			position: fixed;
			top: 0;
			left: 22rem;
			width: calc(100% - 22rem);
			display: flex;
			align-items: center;
		}

		#ui {
			position: relative;
			width: 100%;
			transform: translate(0, 0);
			background: none;
			padding: 0;
		}

		#title {
			text-align: left;
		}
	}

	@media only screen and (min-width: 1280px) {
		:global(.method p, .method details, .method li) {
			font-size: var(--16px) !important;
		}

		:global(.method input) {
			font-size: var(--16px) !important;
		}

		article {
			width: 24rem;
		}

		.figure {
			left: 24rem;
			width: calc(100% - 24rem);
		}
	}
</style>
