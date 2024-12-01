<script>
    import { onMount } from 'svelte';
    import BubbleTooltip from './BubbleTooltip.svelte';
    import { createBubbleLayout } from './BubbleLayout.js';
    import BubbleZoom from './BubbleZoom.svelte';
    import { createTransitions } from './BubbleTransition.js';
    
    // Props for customization
    export let width = 800;
    export let height = 500;
    export let data = [];
    export let sizeField = 'size';
    export let labelField = 'label';
    export let subtitleField = 'subtitle';
    export let detailField = 'detail';
    
    // Customization options with defaults
    export let backgroundColor = '#fafafa';
    export let bubbleColor = '#ccc';
    export let textColor = '#333';
    
    let svg;
    let container;
    let layoutedData = [];
    
    // Basic responsive handling
    let containerWidth;
    let containerHeight;
    
    $: actualWidth = containerWidth || width;
    $: actualHeight = containerHeight || height;
    
    // Add tooltip state
    let tooltipData = null;
    let tooltipX = 0;
    let tooltipY = 0;
    let tooltipVisible = false;
    
    // Add zoom state
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    
    $: transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    
    // Add pan functionality
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    
    // Initialize layout
    $: layout = createBubbleLayout({
        width: actualWidth,
        height: actualHeight
    });
    
    // Update layout when data or dimensions change
    $: {
        console.log('Raw data received:', data.slice(0, 3));
        const processedData = data.map(d => ({
            ...d,
            size: d[sizeField] || 10 // Default size if not specified
        }));
        console.log('Processed data:', processedData.slice(0, 3));
        layoutedData = layout.updateLayout(processedData);
        console.log('Layouted data:', layoutedData.slice(0, 3));
    }
    
    function handleMouseEnter(event, item) {
        const rect = container.getBoundingClientRect();
        tooltipData = item;
        tooltipX = event.clientX;
        tooltipY = event.clientY - 10; // Offset slightly above cursor
        tooltipVisible = true;
    }
    
    function handleMouseLeave() {
        tooltipVisible = false;
    }
    
    function handleMouseDown(event) {
        isDragging = true;
        startX = event.clientX - translateX;
        startY = event.clientY - translateY;
    }
    
    function handleMouseMove(event) {
        if (!isDragging && tooltipVisible) {
            tooltipX = event.clientX;
            tooltipY = event.clientY - 10;
        }
        if (isDragging) {
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
        }
    }
    
    function handleMouseUp() {
        isDragging = false;
    }
</script>

<div 
    class="bubble-chart-container" 
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    bind:this={container}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
>
    <svg 
        {width}
        {height}
        bind:this={svg}
    >
        <g class="bubbles" style:transform={transform}>
            {#each layoutedData as item (item.id)}
                <g 
                    class="bubble-group"
                    transform="translate({item.x}, {item.y})"
                    on:mouseenter={(e) => handleMouseEnter(e, item)}
                    on:mouseleave={handleMouseLeave}
                    use:createTransitions
                >
                    <circle
                        r={item.size}
                        fill={item.color || bubbleColor}
                        stroke="black"
                        stroke-width="1"
                    />
                </g>
            {/each}
        </g>
    </svg>
    
    <BubbleTooltip
        visible={tooltipVisible}
        data={tooltipData}
        x={tooltipX}
        y={tooltipY}
    />
    
    <BubbleZoom bind:scale />
</div>

<style>
    .bubble-chart-container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        touch-action: none; /* Prevents default touch behaviors */
    }
    
    svg {
        width: 100%;
        height: 100%;
    }
    
    .bubble-group circle {
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .bubble-group:hover circle {
        opacity: 1;
    }
    
    .label {
        font-weight: bold;
        font-size: 14px;
    }
    
    .subtitle {
        font-size: 12px;
        opacity: 0.8;
    }
    
    .detail {
        font-size: 11px;
        opacity: 0.6;
    }
    
    text {
        fill: var(--text-color, #333);
    }
    
    .bubble-group {
        cursor: pointer;
    }
    
    .bubbles {
        transition: transform 0.1s ease-out;
    }
</style>