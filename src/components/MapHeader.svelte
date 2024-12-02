<script>
    export let activeMode = "EC";

    const lowSES = [
        { mode: "EC", label: "EC" },
        { mode: "CHILD_EC", label: "Child" },
        { mode: "EXPOSURE_GRP_MEM", label: "Exposure" },
        { mode: "BIAS_GRP_MEM", label: "Bias" }
    ];

    const highSES = [
        { mode: "EC_HIGH_SE", label: "EC-H" },
        { mode: "CHILD_HIGH_EC", label: "Child-H" },
        { mode: "EXPOSURE_GRP_MEM_HIGH", label: "Exp-H" },
        { mode: "BIAS_GRP_MEM_HIGH", label: "Bias-H" }
    ];

    const countyStats = [
        { mode: "POP2018", label: "Pop." },
        { mode: "NUM_BELOW_P50", label: "Below P50" },
        { mode: "CLUSTERING", label: "Cluster" },
        { mode: "SUPPORT_RATIO", label: "Support" }
    ];

    const sizeScale = ["1K", "50K", "1M+"];
    const colorScale = ['#230e79', '#a6287f', '#ff5500', '#f2cecf', '#fffe04'];

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function handleModeClick(mode) {
        activeMode = mode;
        dispatch('modeChange', mode);
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
                        class:active={mode === activeMode}
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
            <div class="title">Color</div>
            <div class="colors">
                {#each colorScale as color, i}
                    <div class="color-item">
                        <div class="color-circle" style="background-color: {color};"></div>
                        <span class="percentage" style="color: {color};">
                            {i === 0 ? '0%' : 
                             i === 1 ? '24%' : 
                             i === 2 ? '48%' : 
                             i === 3 ? '71%' : 
                             '98%'}
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .header {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 0.5rem;
        padding: 1rem;
        padding-left: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: var(--color-fg);
        width: 100%;
    }

    .sections-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-right: auto;
    }

    .top-sections {
        display: flex;
        gap: 0.5rem;
    }

    .bottom-section {
        margin-left: 9rem;
    }

    .separator {
        width: 2px;
        height: 50px;
        background: black;
        margin: 0 0.5rem;
        align-self: flex-end;
        margin-bottom: 0.5rem;
    }

    .section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .title {
        font-size: 0.8rem;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        text-align: left;
        padding-left: 1rem;
    }

    .buttons {
        display: flex;
        gap: 0.3rem;
    }

    .mode-btn {
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--color-fg);
        background: transparent;
        color: var(--color-fg);
        cursor: pointer;
        font-size: 0.8rem;
        border-radius: 3px;
        min-width: 60px;
        text-align: center;
    }

    .mode-btn.active {
        background: var(--color-fg);
        color: var(--color-bg);
        border-color: var(--color-fg);
    }

    .legend {
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    .size-legend, .color-legend {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 1rem;
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
        background-color: var(--color-fg);
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
        width: 15px;
        height: 15px;
        border-radius: 50%;
    }

    .percentage {
        font-size: 12px;
        font-weight: 500;
    }

    .colors {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
    }
</style>