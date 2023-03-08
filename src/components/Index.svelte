<script>
	import { browser } from "$app/environment";
	import { base } from "$app/paths";
	import { onMount, getContext } from "svelte";
	import { csv } from "d3";
	import storage from "$utils/localStorage.js";
	import getNearestOptions from "$utils/getNearestOptions.js";
	import getCountiesByDist from "$utils/getCountiesByDist.js";
	import getLocation from "$utils/getLocation.js";
	import Footer from "$components/Footer.svelte";
	import classics from "$data/classics.csv";
	import Map from "$components/Map.svelte";
	import Select from "$components/Select.svelte";
	import Icon from "$components/helpers/Icon.svelte";

	const copy = getContext("copy");
	const data = getContext("data");

	let currentPhoneme;
	let currentName;
	let placeData;
	let location;
	let options;
	let countiesByDist;
	let open = false;

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
			if (test) storage.remove("pudding_samename");
			const storageLocation = storage.get("pudding_samename");
			location = storageLocation || (await getLocation(test)) || {};
			if (!storageLocation && location?.state)
				storage.set("pudding_samename", location);
			if (location?.state) {
				options = await getNearestOptions(location);
				countiesByDist = await getCountiesByDist(location, options[0].county);
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

					{#if options && options.length}
						<div class="locate">
							<p>{copy.locate}</p>
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
			<Map {placeData} placeName={currentName} {location} {countiesByDist} />
			<p>{@html copy.help}</p>
		{:else}
			<p class="loading">loading...</p>
		{/if}

		<div class="share">
			<button>Share this map <Icon name="forward" strokeWidth="3px" /></button>
		</div>
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

	.share {
		position: fixed;
		bottom: 16px;
		right: 16px;
	}

	.share button {
		text-transform: uppercase;
		font-weight: bold;
		font-size: var(--16px) !important;
	}

	.loading {
		text-align: center;
	}
</style>
