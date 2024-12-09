<script>
    import { onMount } from 'svelte';
    import { axisBottom, axisLeft, select, scaleLinear } from 'd3';
    import BubbleTooltip from './BubbleTooltip.svelte';
    import { createBubbleLayout } from './BubbleLayout.js';
    import { createTransitions } from './BubbleTransition.js';
    
    export let width = 800;
    export let height = 500;
    export let data = [];
    export let sizeField = 'size';
    export let labelField = 'label';
    export let subtitleField = 'subtitle';
    export let detailField = 'detail';
    
    export let backgroundColor = '#fafafa';
    export let bubbleColor = '#ccc';
    export let textColor = '#333';

    export let containerStyle;
    export let padding = 40;
    export let clampToFrame = true;
    export let forceConfig;
    export let useRectangularLayout = false;
    export let isScatterPlot = false;
    export let paddingLeft = 120;  
    export let paddingRight = 40;
    export let paddingTop = 40;
    export let paddingBottom = 40;

    const MAX_BUBBLE_SIZE = 150;
    
    let svg;
    let container;
    let layoutedData = [];
    
    let containerWidth;
    let containerHeight;
    
    $: actualWidth = containerWidth || width;
    $: actualHeight = containerHeight || height;
    
    let tooltipData = null;
    let tooltipX = 0;
    let tooltipY = 0;
    let tooltipVisible = false;
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    
    let xScale = null;
    let yScale = null;
    
    $: layout = createBubbleLayout({
        width: actualWidth,
        height: actualHeight,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        isScatterPlot
    });
    
    let transitionTimer;
    
    $: {
        if (data?.length) {
            const processedData = data.map(d => ({
                ...d,
                size: d[sizeField]
            }));
            const layoutResult = layout.updateLayout(processedData);
            layoutedData = layoutResult.nodes;
            if (layoutResult.scales) {
                xScale = layoutResult.scales.x;
                yScale = layoutResult.scales.y;
            }
            
            if (isScatterPlot) {
                clearInterval(transitionTimer);
                transitionTimer = setInterval(() => {
                    const layoutUpdate = layout.updateLayout(processedData);
                    layoutedData = layoutUpdate.nodes;
                }, 16); 
                
                setTimeout(() => clearInterval(transitionTimer), 2000); 
            }
        }
    }
    
    onMount(() => {
        return () => clearInterval(transitionTimer);
    });
    
    let hoveredBubbleId = null;

    function handleMouseEnter(event, item) {
        hoveredBubbleId = item.id; 
        const rect = container.getBoundingClientRect();
        tooltipData = {
            ...item,
            detail: typeof detailField === 'function' ? 
                detailField(item) : 
                item[detailField]
        };
        tooltipX = event.clientX;
        tooltipY = event.clientY - 10;
        tooltipVisible = true;
    }
    
    function handleMouseLeave() {
        hoveredBubbleId = null;  
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

    $: isBiasPlot = data[0]?.rawData?.xLabel?.toLowerCase().includes('bias');

    $: if (xScale && yScale && svg) {
        const xAxis = axisBottom(xScale).tickFormat(d => d.toFixed(2));
        const yAxis = axisLeft(yScale).tickFormat(d => d.toFixed(2));

        let xAxisGroup = select(svg).select(".x-axis");
        let yAxisGroup = select(svg).select(".y-axis");

        if (xAxisGroup.empty()) {
            xAxisGroup = select(svg).append("g").attr("class", "x-axis");
        }
        if (yAxisGroup.empty()) {
            yAxisGroup = select(svg).append("g").attr("class", "y-axis");
        }

        xAxisGroup
            .attr("transform", `translate(0, ${isBiasPlot ? yScale(0) : actualHeight - paddingBottom})`)
            .call(xAxis);

        yAxisGroup
            .attr("transform", `translate(${isBiasPlot ? xScale(0) : paddingLeft}, 0)`)
            .call(yAxis);
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
        {#if xScale && yScale}
            <g class="axes">
                {#if isBiasPlot}
                    {#if layoutedData[0]?.rawData?.xLabel?.toLowerCase().includes('high')}
                        <line
                            class="diagonal-line"
                            x1={xScale(0)}
                            y1={yScale(0)}
                            x2={xScale(Math.min(xScale.domain()[0], yScale.domain()[0]))}
                            y2={yScale(Math.min(xScale.domain()[0], yScale.domain()[0]))}
                            stroke="#FF69B4"
                            stroke-width="1.5"
                            stroke-dasharray="4,4"
                            opacity="0.7"
                        />
                    {:else}
                        <line
                            class="diagonal-line"
                            x1={xScale(Math.min(xScale.domain()[0], yScale.domain()[0]))}
                            y1={yScale(Math.min(xScale.domain()[0], yScale.domain()[0]))}
                            x2={xScale(Math.max(xScale.domain()[1], yScale.domain()[1]))}
                            y2={yScale(Math.max(xScale.domain()[1], yScale.domain()[1]))}
                            stroke="#FF69B4"
                            stroke-width="1.5"
                            stroke-dasharray="4,4"
                            opacity="0.7"
                        />
                    {/if}
                {/if}

                <g class="x-axis" transform="translate(0,{isBiasPlot ? yScale(0) : actualHeight - paddingBottom})">
                    <path 
                        class="domain" 
                        d={`M${paddingLeft},0H${actualWidth - paddingRight}`}
                    />
                    {#each xScale.ticks() as tick}
                        <g class="tick" transform="translate({xScale(tick)},0)">
                            <line y2="6"></line>
                            <text y="9" dy="0.71em">{tick.toFixed(2)}</text>
                        </g>
                    {/each}
                    {#if isBiasPlot}
                        {#if layoutedData[0]?.rawData?.xLabel?.toLowerCase().includes('high')}
                            <text
                                class="axis-label"
                                x={xScale(-0.7)}
                                y="35"
                                text-anchor="middle"
                            >
                                {layoutedData[0]?.rawData?.xLabel || ''}
                            </text>
                        {:else}
                            <text
                                class="axis-label"
                                x={xScale(0.37)}
                                y="35"
                                text-anchor="middle"
                            >
                                {layoutedData[0]?.rawData?.xLabel || ''}
                            </text>
                        {/if}
                    {:else}
                        <text
                            class="axis-label"
                            x={actualWidth / 2}
                            y="40"
                            text-anchor="middle"
                        >
                            {layoutedData[0]?.rawData?.xLabel || ''}
                        </text>
                    {/if}
                </g>

                <g class="y-axis" transform="translate({isBiasPlot ? xScale(0) : paddingLeft},0)">
                    <path 
                        class="domain" 
                        d={`M0,${paddingTop}V${actualHeight - paddingBottom}`}
                    />
                    {#each yScale.ticks() as tick}
                        <g class="tick" transform="translate(0,{yScale(tick)})">
                            <line x2="-6"></line>
                            <text x="-9" dy="0.32em">{tick.toFixed(2)}</text>
                        </g>
                    {/each}
                    {#if isBiasPlot}
                        {#if layoutedData[0]?.rawData?.yLabel?.toLowerCase().includes('high')}
                            <text
                                class="axis-label y-axis-label"
                                x="-40"
                                y={yScale(-0.3)}
                                text-anchor="end"
                                dominant-baseline="middle"
                            >
                                {layoutedData[0]?.rawData?.yLabel || ''}
                            </text>
                        {:else}
                            <text
                                class="axis-label y-axis-label"
                                x="-40"
                                y={yScale(0.25)}
                                text-anchor="end"
                                dominant-baseline="middle"
                            >
                                {layoutedData[0]?.rawData?.yLabel || ''}
                            </text>
                        {/if}
                    {:else}
                        <text
                            class="axis-label y-axis-label"
                            x={-actualHeight / 2}
                            y={-80}
                            text-anchor="middle"
                            transform="rotate(-90)"
                        >
                            {layoutedData[0]?.rawData?.yLabel || ''}
                        </text>
                    {/if}
                </g>
            </g>
        {/if}

        <g class="bubbles">
            {#each layoutedData.filter(item => item.id !== hoveredBubbleId) as item (item.id)}
                <g 
                    class="bubble-group"
                    transform="translate({item.x || 0}, {item.y || 0})"
                    on:mouseenter={(e) => handleMouseEnter(e, item)}
                    on:mouseleave={handleMouseLeave}
                    use:createTransitions
                >
                    <circle
                        r={item.size}
                        fill={item.color || bubbleColor}
                        stroke="black"
                        stroke-width="1"
                        opacity={item.opacity === 1 ? 0.8 : 0.1}
                    />
                </g>
            {/each}

            {#if hoveredBubbleId}
                {#each layoutedData.filter(item => item.id === hoveredBubbleId) as item (item.id)}
                    <g 
                        class="bubble-group"
                        transform="translate({item.x || 0}, {item.y || 0})"
                        on:mouseenter={(e) => handleMouseEnter(e, item)}
                        on:mouseleave={handleMouseLeave}
                        use:createTransitions
                    >
                        <circle
                            r={item.size}
                            fill={item.color || bubbleColor}
                            stroke="black"
                            stroke-width="1"
                            opacity={1}
                        />
                    </g>
                {/each}
            {/if}
        </g>

        {#if xScale && yScale}
            <line
                class="reference-line"
                x1={xScale(0.2)}
                y1={yScale(0.2)}
                x2={xScale(1.8)}
                y2={yScale(1.8)}
                stroke="#FF1493"  
                stroke-width="2.5"
                stroke-dasharray="8,8"
                opacity="0.6"
            />
        {/if}
    </svg>
    
    <BubbleTooltip
        visible={tooltipVisible}
        data={tooltipData}
        x={tooltipX}
        y={tooltipY}
    />
</div>

<style>
    .bubble-chart-container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        touch-action: none; 
    }
    
    svg {
        width: 100%;
        height: 100%;
    }
    
    .bubble-group circle {
        transition: opacity 0.2s;
    }
    
    .bubble-group:hover circle {
        opacity: 1 !important;
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
    
    .axis-label {
        font-size: 14px;
        fill: #666;
        font-weight: 500;
    }

    .axes {
        pointer-events: none;  
    }
    
    .x-axis path,
    .y-axis path,
    .x-axis line,
    .y-axis line {
        stroke: #666;
        shape-rendering: crispEdges;
    }
    
    .reference-line {
        pointer-events: none;
        opacity: 0.5;
    }

    .domain {
        fill: none;
        stroke: #666;
        stroke-width: 1.5;
    }

    .y-axis-label {
        dominant-baseline: hanging;
    }

    .diagonal-line {
        pointer-events: none;
    }
</style>