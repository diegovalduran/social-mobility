<script>
    export let activeMode = "EC";
    export let activeCountyMode = "OFF";

    const lowSES = [
        { mode: "EC", label: "EC" },
        { mode: "CHILD_EC", label: "Child" },
        { mode: "EXPOSURE_GRP_MEM", label: "Exposure" },
        { mode: "BIAS_GRP_MEM", label: "Bias" }
    ];

    const highSES = [
        { mode: "EC_HIGH", label: "EC-H" },
        { mode: "CHILD_HIGH_EC", label: "Child-H" },
        { mode: "EXPOSURE_GRP_MEM_HIGH", label: "Exp-H" },
        { mode: "BIAS_GRP_MEM_HIGH", label: "Bias-H" }
    ];

    const countyStats = [
        { mode: "OFF", label: "Off" },
        { mode: "POP2018", label: "Pop." },
        { mode: "NUM_BELOW_P50", label: "Below P50" },
        { mode: "CLUSTERING", label: "Cluster" },
        { mode: "VOLUNTEERING", label: "Volunteer" }
    ];

    const sizeScale = ["1K", "50K", "1M+"];
    const colorScale = ['#2D1160', '#7B2F8F', '#B7367A', '#E34B60', '#FFD700'];
    const undefinedColor = '#CCCCCC';  // Changed to light grey

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function handleModeClick(mode) {
        if (countyStats.some(item => item.mode === mode)) {
            activeCountyMode = mode;
            dispatch('modeChange', { mode, type: 'county' });
        } else {
            activeMode = mode;
            dispatch('modeChange', { mode, type: 'ses' });
        }
    }

    // Add the scale ranges (copy from Map.svelte)
    const scaleRanges = {
        // Low SES
        "EC": [0.2946900, 1.3597],
        "CHILD_EC": [0.22188, 1.61136],
        "EXPOSURE_GRP_MEM": [0.2552, 1.48628],
        "BIAS_GRP_MEM": [-0.10809, 0.33456999],
        
        // High SES
        "EC_HIGH": [0.70062, 1.71507],
        "CHILD_HIGH_EC": [0.24529999, 1.69122],
        "EXPOSURE_GRP_MEM_HIGH": [0.51012999, 1.66616],
        "BIAS_GRP_MEM_HIGH": [-0.53618002, -0.043249998]
    };

    // Function to get scale values based on active mode
    function getScaleValues(mode) {
        if (mode in scaleRanges) {
            const [min, max] = scaleRanges[mode];
            const range = max - min;
            return [
                min.toFixed(2),
                (min + range * 0.2).toFixed(2),
                (min + range * 0.4).toFixed(2),
                (min + range * 0.6).toFixed(2),
                (min + range * 0.8).toFixed(2),
                'N/A'  // Changed from 'undefined'
            ];
        }
        return ['0%', '20%', '40%', '60%', '80%', 'N/A']; // Changed in fallback as well
    }

    $: scaleValues = getScaleValues(activeMode);

    function getMetricLabel(mode, countyMode) {
        // Always show the SES metric label (from lowSES or highSES)
        const sesLabel = lowSES.concat(highSES).find(item => item.mode === mode)?.label || "Unknown Metric";
        return sesLabel;
    }
</script>

<div class="header">
    <div class="sections-container">
        <div class="top-sections">
            <div class="section">
                <div class="title">LOW SES</div>
                <div class="buttons">
                    {#each lowSES as { mode, label }}
                        <button 
                            class="mode-btn" 
                            class:active={mode === activeMode}
                            on:click={() => handleModeClick(mode)}
                        >
                            {label}
                        </button>
                    {/each}
                </div>
            </div>
            <div class="separator"></div>
            <div class="section">
                <div class="title">HIGH SES</div>
                <div class="buttons">
                    {#each highSES as { mode, label }}
                        <button 
                            class="mode-btn" 
                            class:active={mode === activeMode}
                            on:click={() => handleModeClick(mode)}
                        >
                            {label}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
        <div class="bottom-section">
            <div class="title">COUNTY STATS</div>
            <div class="buttons">
                {#each countyStats as { mode, label }}
                    <button 
                        class="mode-btn" 
                        class:active={mode === activeCountyMode}
                        on:click={() => handleModeClick(mode)}
                    >
                        {label}
                    </button>
                {/each}
            </div>
        </div>
    </div>
    <div class="legend">
        <div class="size-legend">
            <div class="title">Size</div>
            <div class="circles">
                {#each sizeScale as s}
                    <div class="circle-group">
                        <div class="circle-container">
                            <div class="circle" style="width: {s === '1M+' ? '24px' : s === '50K' ? '16px' : '8px'}; height: {s === '1M+' ? '24px' : s === '50K' ? '16px' : '8px'};"></div>
                        </div>
                        <span>{s}</span>
                    </div>
                {/each}
            </div>
        </div>
        <div class="color-legend">
            <div class="title">
                <span style="color: lightgrey;">Color:</span> 
                <span style="color: white;">{getMetricLabel(activeMode, activeCountyMode)} as percentage of max value</span>
            </div>
            <div class="colors">
                {#each colorScale as color, i}
                    <div class="color-item">
                        <div class="color-circle" style="background-color: {color};"></div>
                        <span class="percentage" style="color: {color};">
                            {scaleValues[i]}
                            <br/>
                            ({i * 25}%)
                        </span>
                    </div>
                {/each}
                <div class="color-item">
                    <div class="color-circle" style="background-color: {undefinedColor};"></div>
                    <span class="percentage" style="color: {undefinedColor};">
                        N/A
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 0.7rem;
        padding-left: 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: var(--color-fg);
        width: 100%;
    }

    .sections-container {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        margin-right: auto;
    }

    .top-sections {
        display: flex;
        gap: 0.3rem;
    }

    .bottom-section {
        margin-left: 7rem;
    }

    .separator {
        width: 1px;
        height: 55px;
        background: white;
        margin: 0 0.3rem;
        align-self: flex-end;
        margin-bottom: 0.3rem;
    }

    .section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .title {
        font-size: 0.7rem;
        text-transform: uppercase;
        margin-bottom: 0.3rem;
        text-align: left;
        padding-left: 0.7rem;
        color: white;
        display: flex;
        gap: 0.2rem;
    }

    .buttons {
        display: flex;
        gap: 0.2rem;
    }

    .mode-btn {
        padding: 0.2rem 0.4rem;
        border: 1px solid white;
        background: transparent;
        color: white;
        cursor: pointer;
        font-size: 0.7rem;
        border-radius: 3px;
        min-width: 50px;
        text-align: center;
    }

    .mode-btn.active {
        background: white;
        color: #000019;
        border-color: white;
    }

    .legend {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        position: relative;
        left: -150px;
    }

    .size-legend, .color-legend {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.7rem;
        min-height: 100px;
    }

    .size-legend .title, .color-legend .title {
        margin-bottom: 0.7rem;
        align-self: center;
        min-width: 50px;
        text-align: center;
    }

    .circles, .colors {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .circle-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 40px;
    }

    .circle {
        border-radius: 50%;
        background-color: white;
        margin-bottom: 4px;
    }

    .circle-container {
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .color-circle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }

    .percentage {
        font-size: 10px;
        font-weight: 500;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        height: 60px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .colors {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .circle-group span {
        color: white;
        font-size: 0.7rem;
    }
</style>