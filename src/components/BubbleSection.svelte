<script>
    import BubbleChart from './bubble-chart/BubbleChart.svelte';
    import { scaleLinear } from 'd3';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    
    export let countyFeatures;
    export let activeMode;
    
    // Log the countyFeatures to check its contents
    console.log('County Features in BubbleSection:', countyFeatures);
    
    // Add transition progress tracker (similar to Map component)
    const transitionProgress = tweened(1, {
        duration: 400,
        easing: cubicOut
    });
    
    // Create color scale with reactive statement
    $: COLOR_SCALE = scaleLinear()
        .domain(activeMode === "HIGH_SCHOOL" ? [0, 5839] : [0, 1000000])
        .range(['#f0f0f0', '#303030'])
        .clamp(true);
    
    // Update transition when mode changes
    $: if (activeMode) {
        transitionProgress.set(0);
        setTimeout(() => transitionProgress.set(1), 25);
    }
    
    // Add size configuration
    const baseSize = 2;  // Even smaller base size
    const scaleFactor = 0.3;  // Increased scale factor for more visible differences
    
    // Process bubble data with transition
    $: bubbleData = countyFeatures?.length ? 
        countyFeatures
            .map((school, index) => {
                const highSchoolName = school.high_school_name || 'Unknown High School';
                const students9To12 = school.students9To12 || 0;
                const ownSES = school.ecOwnSesHs;
                const parentSES = school.ecParentSesHs;
                
                // Split county_name into county and state
                const [countyName, stateName] = (school.county_name || ',').split(', ');
                
                // More dramatic size scaling
                const size = baseSize + Math.sqrt(students9To12 || 1) * scaleFactor;

                return {
                    id: `bubble-${index}`,
                    label: highSchoolName,
                    detail: isScatterPlot ? 
                        `State: ${stateName || 'Unknown'}\n\n` + " | " +
                        `Own SES: ${ownSES?.toFixed(2)}\n\n` + " | " +
                        `Parent SES: ${parentSES?.toFixed(2)}\n\n` + " | " +
                        `Students: ${students9To12.toLocaleString()}` :
                        `Students 9-12: ${students9To12.toLocaleString()}`,
                    size: size,
                    color: COLOR_SCALE(students9To12),
                    opacity: $transitionProgress,
                    rawData: {
                        ...school,
                        countyName: countyName || 'Unknown',
                        state: stateName || 'Unknown',
                        ec_own_ses_hs: ownSES,
                        ec_parent_ses_hs: parentSES
                    }
                };
            })
            .filter(d => {
                if (isScatterPlot) {
                    return d.rawData.ec_own_ses_hs != null && 
                           d.rawData.ec_parent_ses_hs != null &&
                           d.rawData.ec_own_ses_hs !== 0 &&
                           d.rawData.ec_parent_ses_hs !== 0;
                }
                return true;
            }) : [];
        
    // Add these parameters for the force layout
    const forceConfig = {
        forceX: 0.2,
        forceY: 0.2,
        forceCollide: 1,
        forceManyBody: -2,
        alphaDecay: 0.01
    };

    // Force scatter plot mode for development
    let isScatterPlot = true;  // Changed from false to true

    // Add some debug logging to see what's happening
    $: {
        console.log("Current mode:", isScatterPlot ? "Scatter Plot" : "Bubble Chart");
        console.log("Sample bubble data:", bubbleData[0]);
    }

    function toggleLayout() {
        isScatterPlot = !isScatterPlot;
        console.log("Toggled to:", isScatterPlot ? "Scatter Plot" : "Bubble Chart");
        bubbleData = [...bubbleData];
    }

    // Add state filter
    let selectedState = 'ALL STATES';

    // Get unique states from the data and ensure ALL STATES is first
    $: states = ['ALL STATES', ...Array.from(new Set(bubbleData.map(d => d.rawData.state)))
        .filter(state => state !== 'ALL STATES')
        .sort()];

    // Update the filtering logic to match the new value
    $: filteredBubbleData = bubbleData
        .map(d => ({
            ...d,
            opacity: selectedState === 'ALL STATES' || d.rawData.state === selectedState ? 
                1 : 
                0.2
        }))
        .sort((a, b) => {
            const aSelected = selectedState === 'ALL STATES' || a.rawData.state === selectedState;
            const bSelected = selectedState === 'ALL STATES' || b.rawData.state === selectedState;
            return aSelected ? 1 : bSelected ? -1 : 0;
        });
</script>

<div class="bubble-section">
    <div class="controls">
        {#if isScatterPlot}
            <select 
                class="state-select" 
                bind:value={selectedState}
            >
                <option value="ALL STATES" class="all-states-option">ALL STATES ▼</option>
                {#each states.filter(state => state !== 'ALL STATES') as state}
                    <option value={state}>{state}</option>
                {/each}
            </select>
        {/if}
        <button 
            class="toggle-button" 
            on:click={toggleLayout}
        >
            {isScatterPlot ? 'Show Bubble Layout' : 'Show Scatter Plot'}
        </button>
    </div>
    <div class="bubble-container">
        <div class="bubble-frame">
            <BubbleChart
                data={filteredBubbleData}
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
                {isScatterPlot}
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
        height: 100vh;
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

    .controls {
        position: fixed;
        top: 30px;
        left: 80px;
        z-index: 1000;
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .toggle-button {
        padding: 8px 16px;
        background: transparent;
        border: 1px solid #fff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        text-align: center;
    }

    .toggle-button:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .state-select {
        padding: 8px 12px;
        border: 1px solid #fff;
        border-radius: 4px;
        font-size: 14px;
        background: transparent;
        color: #fff;
        cursor: pointer;
        width: 200px;
        text-align: center;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
    }

    .all-states-option {
        font-weight: bold;
    }

    .state-select option {
        background: #303030;
        color: #fff;
        text-align: center;
    }

    .state-select:hover {
        border-color: #fff;
    }

    .state-select:focus {
        outline: none;
        border-color: #fff;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.1);
    }
</style>