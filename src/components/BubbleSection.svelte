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
            .map((county, index) => {
                const highSchoolName = county.high_school_name || 'Unknown High School';
                const students9To12 = county.students9To12 || 0;
                const ownSES = county.ecOwnSesHs;
                const parentSES = county.ecParentSesHs;

                // More dramatic size scaling
                const size = baseSize + Math.sqrt(students9To12 || 1) * scaleFactor;

                return {
                    id: `bubble-${index}`,
                    label: highSchoolName,
                    detail: isScatterPlot ? 
                        `Own SES: ${ownSES?.toFixed(2)}\nParent SES: ${parentSES?.toFixed(2)}\nStudents: ${students9To12.toLocaleString()}` :
                        `Students 9-12: ${students9To12.toLocaleString()}`,
                    size: size,  // Don't apply additional scaling in BubbleChart
                    color: COLOR_SCALE(students9To12),
                    opacity: $transitionProgress,
                    rawData: {
                        ...county,
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
                {isScatterPlot}
            />
        </div>
    </div>
    <div class="controls">
        <button 
            class="toggle-button" 
            on:click={toggleLayout}
        >
            {isScatterPlot ? 'Show Bubble Layout' : 'Show Scatter Plot'}
        </button>
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
        top: 100px;
        right: 40px;
        z-index: 1000;
    }

    .toggle-button {
        padding: 8px 16px;
        background: #fff;
        border: 1px solid #333;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toggle-button:hover {
        background: #f0f0f0;
    }
</style>