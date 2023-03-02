<script>
	import { browser } from "$app/environment";
	import { base } from "$app/paths";

	import { getContext } from "svelte";
	import { csv } from "d3";
	import Map from "$components/Map.svelte";
	import Scale from "$components/Method.Scale.svelte";
	import Value from "$components/Method.Value.svelte";
	import Threshold from "$components/Method.Threshold.svelte";
	import Footer from "$components/Footer.svelte";
	import options from "$data/options.csv";

	const copy = getContext("copy");
	const data = getContext("data");

	let scaleTypePop = "scalePow";
	let scaleTypeWiki = "scalePow";
	let scaleTypeDist = "scaleLog";

	let scaleExpPop = "0.67";
	let scaleExpWiki = "0.67";
	let scaleExpDist = "1";

	let scaleBoundsPop = [0, 490000];
	let scaleBoundsWiki = [0, 87500];
	let scaleBoundsDist = [50, 200];

	let valueWeightDist = 2;
	let valueWeightPop = 1;
	let valueWeightWiki = 1;

	let thresholdLower = 0.5;
	let thresholdUpper = 0.75;
	let valueProp = "share";

	let phonemeId = options[0].phoneme;
	let placeData;

	$: if (browser)
		(async () =>
			(placeData = await csv(`${base}/assets/places/${phonemeId}.csv`)))();

	// $: bySampleDist = sample.map(({ name, id, state, level, population }) => ({
	// 	name,
	// 	state,
	// 	level,
	// 	id,
	// 	population,
	// 	features: topScoreFeatures.map((d) => ({
	// 		...d,
	// 		properties: {
	// 			...d.properties,
	// 			fill: getSampleFillDist(id, d.properties.data)
	// 		}
	// 	}))
	// }));

	// $: bySampleShare = sample.map(({ name, id, state, level, population }) => ({
	// 	name,
	// 	state,
	// 	level,
	// 	id,
	// 	population,
	// 	features: topScoreFeatures.map((d) => ({
	// 		...d,
	// 		properties: {
	// 			...d.properties,
	// 			fill: getSampleFillShare(id, d.properties.data)
	// 		}
	// 	}))
	// }));
</script>

<div id="title">
	<h1>{@html copy.hed}</h1>
	<p>
		{@html copy.dek}
	</p>
</div>

<article>
	<section id="ui">
		<select bind:value={phonemeId}>
			{#each options as { name, phoneme }}
				<option value={phoneme}>{name}</option>
			{/each}
		</select>
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
					{placeData}
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
	}

	.top-score {
		max-width: 1280px;
	}

	section {
		margin-bottom: 32px;
	}

	#ui {
		width: 16rem;
		display: flex;
		flex-direction: column;
	}

	#maps {
		position: relative;
		width: 1280px;
	}

	:global(g .hide-label) {
		display: none;
	}
</style>
