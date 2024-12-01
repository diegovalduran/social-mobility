<script>
    import BubbleChart from './bubble-chart/BubbleChart.svelte';
    import { scaleLinear } from 'd3';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    
    export let countyFeatures;
    export let activeMode;
    
    // Add transition progress tracker (similar to Map component)
    const transitionProgress = tweened(1, {
        duration: 400,
        easing: cubicOut
    });
    
    // Create color scale with reactive statement
    $: COLOR_SCALE = scaleLinear()
        .domain(activeMode === "EC" ? [0, 1.36] : [0, 1000000])
        .range(['#f0f0f0', '#303030'])
        .clamp(true);
    
    // Update transition when mode changes
    $: if (activeMode) {
        transitionProgress.set(0);
        setTimeout(() => transitionProgress.set(1), 25);
    }
    
    // Process bubble data with transition
    $: bubbleData = countyFeatures?.length ? 
        countyFeatures
            .map((county, index) => ({
                id: `bubble-${index}`,
                label: county.properties.name ? 
                    `${county.properties.name}, ${county.properties.state}` : 
                    'Unknown County',
                detail: activeMode === "EC" ?
                    `EC Score: ${(county.properties.ecValue || 0).toFixed(2)}` :
                    `Population: ${(county.properties.population || 0).toLocaleString()}`,
                size: Math.sqrt((activeMode === "EC" ? 
                    (county.properties.ecValue || 0) * 15 : 
                    (county.properties.population || 0) / 60000)),
                color: COLOR_SCALE(activeMode === "EC" ? 
                    county.properties.ecValue || 0 : 
                    county.properties.population || 0),
                opacity: $transitionProgress,
                rawData: county.properties
            }))
            .filter(d => d.size > 0)
        : [];
    
    // Add these parameters for the force layout
    const forceConfig = {
        forceX: 0.2,    // Increased horizontal force
        forceY: 0.2,    // Increased vertical force
        forceCollide: 1.2, // Increased collision force
        forceManyBody: -30, // Stronger repulsion
        alphaDecay: 0.01 // Slower settling for better distribution
    };
</script>

<div class="bubble-section">
    <div class="bubble-container">
        <div class="bubble-frame">
            <BubbleChart
                data={bubbleData}
                width={1400}
                height={700}
                backgroundColor="transparent"
                bubbleColor="#cccccc"
                textColor="#333333"
                containerStyle="background: transparent;"
                padding={40}
                clampToFrame={true}
                {forceConfig}
                useRectangularLayout={true}
            />
        </div>
    </div>
</div>

<style>
    .bubble-section {
        margin: -64px 0 0 0;
        max-width: 100%;
        padding: 0;
        background: transparent;
        position: relative;
        height: 100vh;
    }

    .bubble-container {
        width: 100%;
        height: 100vh;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        position: relative;
        padding-top: 32px;
    }

    .bubble-frame {
        width: 1400px;
        height: 90vh;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        position: relative;
    }

    :global(.bubble-chart-container),
    :global(.bubble-chart-svg) {
        background: transparent !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
    }
</style>