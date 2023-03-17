<script>
	import { browser } from "$app/environment";
	import { base } from "$app/paths";

	import { onMount, getContext } from "svelte";
	import { csv, descending, format } from "d3";
	import Select from "$components/Select.svelte";
	import Map from "$components/Map.svelte";
	import Scale from "$components/Method.Scale.svelte";
	import Value from "$components/Method.Value.svelte";
	import Threshold from "$components/Method.Threshold.svelte";
	import Footer from "$components/Footer.svelte";
	import loadUSData from "$data/loadUSData.js";
	import options from "$data/options.csv";

	const copy = getContext("copy");
	const data = getContext("data");

	let scaleTypePop = "scalePow";
	let scaleTypeWiki = "scalePow";
	let scaleTypeDist = "scaleLog";

	let scaleExpPop = "0.5";
	let scaleExpWiki = "0.5";
	let scaleExpDist = "1";

	let scaleBoundsPop = [0, 22933531];
	let scaleBoundsWiki = [0, 96911];
	let scaleBoundsDist = [50, 300];

	let valueWeightDist = 2;
	let valueWeightPop = 1;
	let valueWeightWiki = 1;

	let thresholdLower = 0.02;
	let thresholdUpper = 0.05;
	let valueProp = "shareDelta";
	let valueScale = "no";

	let placeData;
	let counties;
	let states;
	let countiesMesh;
	let statesMesh;
	let nationMesh;
	let currentPhoneme;
	let currentName;

	$: if (browser && currentPhoneme)
		(async () =>
			(placeData = await csv(
				`${base}/assets/places/${currentPhoneme}.csv?${__TIMESTAMP__}`
			)))();

	function onChangePlace({ name, phoneme }) {
		currentPhoneme = phoneme;
		currentName = name;
	}

	onMount(async () => {
		try {
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
		<p class="small">
			Increase your screen size or visit on desktop to customize the settings.
		</p>
	</section>

	<section id="ui">
		<div class="select">
			<Select {options} on:change={({ detail }) => onChangePlace(detail)} />
		</div>

		<div class="play">
			<h2>Introduction</h2>
			<details open>
				<summary>Explanation</summary>
				<div class="inner">
					{#each copy.miscExplanation as { value }}
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
		{/if}

		<!-- {#if bySampleDist}
			<div class="by-dist">
				<h2>Dist by place</h2>
				<div class="places">
					{#each bySampleDist as { name, state, level, features }}
						<div class="inner">
							<p>{name}, {state} ({level})</p>
							<div class="map">
								<Figure
									--aspect-ratio={aspectRatio}
									custom={{ projectionObject }}
								>
									<MapCanvas {features} stroke="rgba(0, 0, 0, 0.25)" />
									<MapSvg>
										<MapPath
											features={statesFeatures}
											stroke="rgba(0, 0, 0, 0.5)"
										/>
									</MapSvg>
								</Figure>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if bySampleShare}
			<div class="by-share">
				<h2>Share by place</h2>
				<div class="places">
					{#each bySampleShare as { name, state, level, features }}
						<div class="inner">
							<p>{name}, {state} ({level})</p>
							<div class="map">
								<Figure
									--aspect-ratio={aspectRatio}
									custom={{ projectionObject }}
								>
									<MapCanvas {features} stroke="rgba(0, 0, 0, 0.25)" />
									<MapSvg>
										<MapPath
											features={statesFeatures}
											stroke="rgba(0, 0, 0, 0.5)"
										/>
									</MapSvg>
								</Figure>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if} -->
	</section>
</div>

<!-- <Footer /> -->
<style>
	article {
		font-size: var(--16px);
		width: 22rem;
		padding: 16px 16px;
	}

	h1 {
		font-size: var(--36px);
	}

	.top-score {
		max-width: 1280px;
	}

	#ui {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.figure {
		position: fixed;
		top: 0;
		left: 22rem;
		width: calc(100% - 22rem);
		padding: 0 32px;
		max-width: 1280px;
		height: 100vh;
		display: flex;
		align-items: center;
	}

	#maps {
		width: 100%;
	}

	.play {
		margin-top: 32px;
	}

	h2 {
		font-size: var(--24px);
	}

	.customize {
		display: none;
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

	@media only screen and (min-width: 1280px) {
		:global(.method p, .method details, .method li) {
			font-size: var(--16px) !important;
		}

		:global(.method input) {
			font-size: var(--16px) !important;
		}
	}

	@media only screen and (min-width: 960px) {
		.customize {
			display: block;
		}

		.small {
			display: none;
		}
	}
</style>
