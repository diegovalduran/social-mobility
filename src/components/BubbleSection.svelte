<script>
    import BubbleChart from './bubble-chart/BubbleChart.svelte';
    import { scaleLinear } from 'd3';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';
    
    export let countyFeatures;
    export let activeMode;
    export let highSchoolData = [];
    export let collegeData = [];
    export let onSettingsChange = () => {};
    
    // Log the data to check its contents
    $: console.log('High School Data:', highSchoolData);
    $: console.log('College Data:', collegeData);
    
    // Single declaration of transition progress tracker
    const transitionProgress = tweened(1, {
        duration: 400,
        easing: cubicOut
    });
    
    // Institution and plot type selection
    let selectedInstitution = 'HIGH_SCHOOL';
    let selectedPlotType = 'SES';
    let selectedState = 'ALL STATES';

    // Declare states variable
    let states = ['ALL STATES'];

    // Process bubble data first
    $: bubbleData = (selectedInstitution === 'HIGH_SCHOOL' ? highSchoolData : collegeData)?.length ?
        (selectedInstitution === 'HIGH_SCHOOL' ? highSchoolData : collegeData)
            .map((institution, index) => {
                const metrics = getMetricsConfig(selectedPlotType, selectedInstitution);
                const xValue = institution[metrics.xMetric];
                const yValue = institution[metrics.yMetric];
                
                if (xValue === undefined || yValue === undefined || 
                    xValue === 0 || yValue === 0) {
                    return null;
                }

                const name = selectedInstitution === 'HIGH_SCHOOL' ? 
                    institution.high_school_name : 
                    institution.college_name;
                const size = selectedInstitution === 'HIGH_SCHOOL' ? 
                    Math.min(Math.sqrt(institution.students9To12) / 3, 30) : 
                    Math.min(Math.sqrt(institution.mean_students_per_cohort) / 4, 20);
                
                // Calculate opacity based on state selection
                const isSelectedState = selectedState === 'ALL STATES' || 
                    institution.state === selectedState;
                const stateOpacity = isSelectedState ? 1 : 0.1;
                
                return {
                    id: `bubble-${index}`,
                    label: name,
                    size: size,
                    color: COLOR_SCALE(selectedInstitution === 'HIGH_SCHOOL' ? 
                        institution.students9To12 : 
                        institution.mean_students_per_cohort),
                    opacity: $transitionProgress * stateOpacity,
                    zIndex: isSelectedState ? 2 : 1, // Bring selected state points to front
                    rawData: {
                        ...institution,
                        xMetric: xValue,
                        yMetric: yValue,
                        xLabel: metrics.xLabel,
                        yLabel: metrics.yLabel
                    }
                };
            })
            .filter(d => d !== null) : [];

    // Update states based on bubble data
    $: {
        const stateSet = new Set(bubbleData.map(d => d.rawData.state));
        states = ['ALL STATES', ...Array.from(stateSet)
            .filter(Boolean)
            .filter(state => state !== 'ALL STATES')
            .sort()];
        console.log('Generated states:', states);
    }

    // Log the countyFeatures to check its contents
    console.log('County Features in BubbleSection:', countyFeatures);
    
    // Create color scale with reactive statement
    $: COLOR_SCALE = scaleLinear()
        .domain(selectedInstitution === "HIGH_SCHOOL" ? [0, 5839] : [0, 1000000])
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
    
    const institutionTypes = [
        { id: 'HIGH_SCHOOL', label: 'High Schools' },
        { id: 'COLLEGE', label: 'Colleges' }
    ];

    // Update plot types to include college metrics
    $: plotTypes = selectedInstitution === 'HIGH_SCHOOL' ? [
        { id: 'SES', label: 'Own SES vs. Parent SES' },
        { id: 'HIGH_SES', label: 'High Own SES vs. High Parent SES' },
        { id: 'EXPOSURE', label: 'Exposure Own SES vs. Exposure Parent SES' }
    ] : [
        { id: 'SES', label: 'Own SES vs. Parent SES' },
        { id: 'HIGH_SES', label: 'High Own SES vs. High Parent SES' },
        { id: 'BIAS', label: 'Bias Own SES vs. Bias Parent SES' },
        { id: 'BIAS_HIGH', label: 'Bias High Own SES vs. Bias High Parent SES' }
    ];

    // Add a reactive statement to update selectedPlotType when institution changes
    $: {
        if (selectedInstitution === 'COLLEGE' && selectedPlotType === 'EXPOSURE') {
            selectedPlotType = 'SES';  // Reset to default if switching to college and current type isn't available
        }
    }

    // Function to get metrics and labels based on plot type
    function getMetricsConfig(plotType, institution) {
        if (institution === 'COLLEGE') {
            switch(plotType) {
                case 'HIGH_SES':
                    return {
                        xMetric: 'ec_high_own_ses_college',
                        yMetric: 'ec_high_parent_ses_college',
                        xLabel: 'High Own SES',
                        yLabel: 'High Parent SES'
                    };
                case 'BIAS':
                    return {
                        xMetric: 'bias_own_ses_college',
                        yMetric: 'bias_parent_ses_college',
                        xLabel: 'Bias Own SES',
                        yLabel: 'Bias Parent SES'
                    };
                case 'BIAS_HIGH':
                    return {
                        xMetric: 'bias_high_own_ses_college',
                        yMetric: 'bias_high_parent_ses_college',
                        xLabel: 'Bias High Own SES',
                        yLabel: 'Bias High Parent SES'
                    };
                default: // 'SES'
                    return {
                        xMetric: 'ec_own_ses_college',
                        yMetric: 'ec_parent_ses_college',
                        xLabel: 'Own SES',
                        yLabel: 'Parent SES'
                    };
            }
        } else {
            switch(plotType) {
                case 'HIGH_SES':
                    return {
                        xMetric: 'ecHighOwnSesHs',
                        yMetric: 'ecHighParentSesHs',
                        xLabel: 'High Own SES',
                        yLabel: 'High Parent SES'
                    };
                case 'EXPOSURE':
                    return {
                        xMetric: 'exposureOwnSesHs',
                        yMetric: 'exposureParentSesHs',
                        xLabel: 'Exposure Own SES',
                        yLabel: 'Exposure Parent SES'
                    };
                default: // 'SES'
                    return {
                        xMetric: 'ecOwnSesHs',
                        yMetric: 'ecParentSesHs',
                        xLabel: 'Own SES',
                        yLabel: 'Parent SES'
                    };
            }
        }
    }
    
    // Update detail string for tooltip
    $: tooltipDetail = (item) => isScatterPlot ? 
        selectedInstitution === 'HIGH_SCHOOL' ?
            // High School tooltip
            `${item.label}\n` +
            `State: ${item.rawData.state}\n` +
            `${item.rawData.xLabel}: ${item.rawData.xMetric.toFixed(2)}\n` +
            `${item.rawData.yLabel}: ${item.rawData.yMetric.toFixed(2)}\n` +
            `Students 9-12: ${item.rawData.students9To12.toLocaleString()}` :
            // College tooltip (without college name)
            `State: ${item.rawData.state}\n\n` +
            `${item.rawData.xLabel}: ${item.rawData.xMetric.toFixed(2)}\n` +
            `${item.rawData.yLabel}: ${item.rawData.yMetric.toFixed(2)}\n` +
            `Students per Cohort: ${item.rawData.mean_students_per_cohort.toLocaleString()}` :
        selectedInstitution === 'HIGH_SCHOOL' ?
            `Students 9-12: ${item.rawData.students9To12.toLocaleString()}` :
            `Students per Cohort: ${item.rawData.mean_students_per_cohort.toLocaleString()}`;

    // Add these parameters for the force layout
    const forceConfig = {
        forceX: 0.2,
        forceY: 0.2,
        forceCollide: 1,
        forceManyBody: -2,
        alphaDecay: 0.01
    };

    // Add state for initial animation
    let initialTransitionComplete = false;
    
    // Start in bubble layout
    let isScatterPlot = false;

    onMount(() => {
        // No need for any delay or mode switching
        initialTransitionComplete = true;
    });

    // Add some debug logging to see what's happening
    $: {
        console.log("Current mode:", isScatterPlot ? "Scatter Plot" : "Bubble Chart");
        console.log("Sample bubble data:", bubbleData[0]);
    }

    // Add reactive statement to handle preset mode changes
    $: {
        if (activeMode) {
            switch (activeMode) {
                case "BIAS_GRP_MEM":
                    if (initialTransitionComplete) {
                        selectedInstitution = "COLLEGE";
                        selectedPlotType = "BIAS";
                        selectedState = "ALL STATES";
                    }
                    break;
                case "BIAS_GRP_MEM_HIGH":
                    if (initialTransitionComplete) {
                        selectedInstitution = "COLLEGE";
                        selectedPlotType = "BIAS_HIGH";
                        selectedState = "ALL STATES";
                    }
                    break;
                case "EXPOSURE_GRP_MEM":
                    if (initialTransitionComplete) {
                        selectedInstitution = "HIGH_SCHOOL";
                        selectedPlotType = "HIGH_SES";
                        selectedState = "ALL STATES";
                    }
                    break;
                case "EXPOSURE_GRP_MEM_HIGH":
                    if (initialTransitionComplete) {
                        selectedInstitution = "HIGH_SCHOOL";
                        selectedPlotType = "EXPOSURE";
                        selectedState = "ALL STATES";
                    }
                    break;
                default:
                    // Keep current selection or set default
                    break;
            }
        }
    }

    // Add a reactive variable to determine if we should use vertical layout
    $: useVerticalLayout = selectedInstitution === 'COLLEGE' && 
        (selectedPlotType === 'BIAS' || selectedPlotType === 'BIAS_HIGH');
</script>

<div class="bubble-section">
    <div class="controls" class:vertical={useVerticalLayout}>
        <div class="select-wrapper">
            <select 
                class="institution-select" 
                bind:value={selectedInstitution}
                on:change={() => {
                    onSettingsChange();
                }}
                disabled={!initialTransitionComplete}
            >
                {#each institutionTypes as type}
                    <option value={type.id}>{type.label}</option>
                {/each}
            </select>
        </div>

        <div class="select-wrapper">
            <select 
                class="state-select" 
                bind:value={selectedState}
                disabled={!initialTransitionComplete}
            >
                <option value="ALL STATES" class="all-states-option">ALL STATES</option>
                {#each states as state}
                    <option value={state}>{state}</option>
                {/each}
            </select>
        </div>
        
        <div class="select-wrapper">
            <select 
                class="plot-type-select" 
                bind:value={selectedPlotType}
                on:change={() => {
                    onSettingsChange();
                }}
                disabled={!initialTransitionComplete}
            >
                {#each plotTypes as type}
                    <option value={type.id}>{type.label}</option>
                {/each}
            </select>
        </div>
    </div>
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
                sizeField="size"
                labelField="label"
                detailField={tooltipDetail}
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
        left: 160px;
        z-index: 1000;
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
    }

    /* Add new styles for vertical layout */
    .controls.vertical {
        left: 80px;
        flex-direction: column;
        align-items: flex-start;
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

    .select-wrapper {
        position: relative;
        display: inline-block;
    }

    .select-wrapper::after {
        content: "▼";
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #fff;  /* Default white chevron */
        pointer-events: none;
        font-size: 12px;
    }

    /* Special styling for institution selector wrapper */
    .select-wrapper:has(.institution-select)::after {
        color: #000019;  /* Dark chevron only for institution selector */
    }

    /* Default styling for all selectors */
    .institution-select,
    .state-select,
    .plot-type-select {
        padding: 8px 12px;
        border: 1px solid #fff;
        border-radius: 4px;
        font-size: 14px;
        background: transparent;
        color: #fff;
        cursor: pointer;
        text-align: center;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        padding-right: 30px;
        width: 350px;
    }

    /* Special styling just for institution selector */
    .institution-select {
        width: 200px;
        background: #fff;
        color: #000019;
    }

    .state-select {
        width: 200px;
    }

    .plot-type-select {
        width: 350px;
    }

    .institution-select option,
    .state-select option,
    .plot-type-select option {
        background: #303030;
        color: #fff;
        text-align: center;
    }

    .all-states-option {
        font-weight: bold;
    }

    .state-select:focus {
        outline: none;
        border-color: #fff;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.1);
    }

    .plot-type-select {
        padding: 8px 12px;
        border: 1px solid #fff;
        border-radius: 4px;
        font-size: 14px;
        background: transparent;
        color: #fff;
        cursor: pointer;
        width: 350px;
        text-align: center;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
    }

    .plot-type-select option {
        background: #303030;
        color: #fff;
        text-align: center;
    }

    /* Add disabled state styling */
    select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>