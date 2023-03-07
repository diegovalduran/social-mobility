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
	let location;
	let options;
	let open = true;

	function onChangePlace({ name, phoneme }) {
		open = false;
		currentPhoneme = phoneme;
		currentName = name;
	}

	onMount(async () => {
		onChangePlace(classics[0]);
		try {
			// TODO remove test
			const test = true;
			const storageLocation = storage.get("pudding_samename");
			location = storageLocation || (await getLocation(test)) || {};
			if (!storageLocation && location?.state)
				storage.set("pudding_samename", location);
			if (location?.state) {
				// location.county = getNearestCounty(location);
				options = await getNearestOptions(location);
			}
			location.lat = +location?.lat;
			location.lon = +location?.lon;
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
	<section id="intro">
		<h1>{copy.title}</h1>
		<p>{copy.intro}</p>
		<div class="discover">
			<details {open}>
				<summary>discover</summary>

				<div class="inner">
					<div class="classic">
						<h4>{copy.classic}:</h4>
						<ul>
							{#each classics as d}
								{@const { name } = d}
								<li>
									<button on:click={() => onChangePlace(d)}>{name}</button>
								</li>
							{/each}
						</ul>
					</div>

					{#if options && options.length}
						<div class="locate">
							<h4>{copy.locate}:</h4>
							<ul>
								{#each options as d}
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
					<Select on:change={({ detail }) => onChangePlace(detail)} />
				</div>
			{/if}
		</div>
	</section>

	<section id="interactive">
		{#if placeData}
			<Map
				{placeData}
				placeName={currentName}
				{location}
				countyTableIntro={copy.countyTableIntro}
			/>
			<p>{@html copy.help}</p>
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
	}

	/* details {
		width: 100%;
	} */

	h4 {
		text-align: center;
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
</style>
