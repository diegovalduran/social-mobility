<script>
	import { browser } from "$app/environment";
	import { base } from "$app/paths";

	import { onMount, getContext } from "svelte";
	import { csv, descending } from "d3";
	import Select from "$components/Select.svelte";
	import Map from "$components/Map.svelte";
	import Scale from "$components/Method.Scale.svelte";
	import Value from "$components/Method.Value.svelte";
	import Threshold from "$components/Method.Threshold.svelte";
	import Footer from "$components/Footer.svelte";
	import loadUSData from "$data/loadUSData.js";
	import options from "$data/options.csv";
	// import test from "$data/test.csv";

	const copy = getContext("copy");
	const data = getContext("data");

	let scaleTypePop = "scalePow";
	let scaleTypeWiki = "scalePow";
	let scaleTypeDist = "scaleLog";

	let scaleExpPop = "0.5";
	let scaleExpWiki = "0.5";
	let scaleExpDist = "1";

	let scaleBoundsPop = [0, 19677151];
	let scaleBoundsWiki = [0, 95406];
	let scaleBoundsDist = [50, 200];

	let valueWeightDist = 2;
	let valueWeightPop = 1;
	let valueWeightWiki = 1;

	let thresholdLower = 0.5;
	let thresholdUpper = 0.75;
	let valueProp = "share";

	let placeData;
	let counties;
	let states;
	let countiesMesh;
	let statesMesh;
	let nationMesh;
	let currentPhoneme;
	let currentName;

	// const clean = test.map((d) => ({
	// 	population: +d.population,
	// 	wiki: +d.wiki_length
	// }));

	// const pops = clean.map((d) => d.population).filter((d) => d);
	// const wikis = clean.map((d) => d.wiki).filter((d) => d);

	// pops.sort(descending);
	// wikis.sort(descending);

	// const len = pops.length;
	// const one = Math.floor(len * 0.01);
	// const pointone = Math.floor(len * 0.001);
	// console.log(pops[pointone]);
	// console.log(pops[one]);
	// console.log(wikis[pointone]);
	// console.log(wikis[one]);

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

			const start = options.find((d) => d.name === "Georgia");
			onChangePlace(start);
		} catch (err) {
			console.log(err);
		}
	});
</script>

<div id="title">
	<h1><strong>{@html copy.hed}</strong></h1>
	<p>
		{@html copy.dek}
	</p>
</div>

<article>
	<section id="ui">
		<div class="select">
			<Select
				placeholder="Search..."
				{options}
				on:change={({ detail }) => onChangePlace(detail)}
			/>
		</div>

		<Scale
			bind:valueScale={scaleTypeDist}
			bind:valueExp={scaleExpDist}
			bind:valueBounds={scaleBoundsDist}
			legend="Distance Scale (mi)"
		/>

		<Scale
			bind:valueScale={scaleTypePop}
			bind:valueExp={scaleExpPop}
			bind:valueBounds={scaleBoundsPop}
			legend="Population Scale (people)"
		/>

		<Scale
			bind:valueScale={scaleTypeWiki}
			bind:valueExp={scaleExpWiki}
			bind:valueBounds={scaleBoundsWiki}
			legend="Wiki Scale (article length)"
		/>
		<Value
			bind:valueProp
			bind:valueWeightDist
			bind:valueWeightPop
			bind:valueWeightWiki
			legend="Value"
		/>
		<Threshold
			bind:thresholdLower
			bind:thresholdUpper
			legend="Opacity threshold"
		/>
	</section>

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
</article>

<!-- <Footer /> -->
<style>
	#title {
		text-align: center;
	}

	article {
		display: flex;
		margin-top: 32px;
	}

	.top-score {
		max-width: 1280px;
	}

	section {
		margin-bottom: 32px;
	}

	#ui {
		width: 16rem;
		margin: 0 32px;
		display: flex;
		flex-direction: column;
	}

	#maps {
		margin-left: 32px;
		position: relative;
		width: 1280px;
	}
</style>
