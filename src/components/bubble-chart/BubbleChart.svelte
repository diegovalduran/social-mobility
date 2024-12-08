<script>
    import { onMount } from 'svelte';
    import { axisBottom, axisLeft, select, scaleLinear } from 'd3';
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

    // New props
    export let containerStyle;
    export let padding = 40;
    export let clampToFrame = true;
    export let forceConfig;
    export let useRectangularLayout = false;
    export let isScatterPlot = false;

    const MAX_BUBBLE_SIZE = 150;
    
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
    
    // Initialize scales
    let xScale = null;
    let yScale = null;
    
    // Initialize layout
    $: layout = createBubbleLayout({
        width: actualWidth,
        height: actualHeight,
        padding,
        isScatterPlot
    });
    
    // Update layout when data or dimensions change
    $: {
        if (data?.length) {
            console.log("Processing data:", data[0]); // Debug log
            const processedData = data.map(d => ({
                ...d,
                size: d[sizeField]
            }));
            const layoutResult = layout.updateLayout(processedData);
            layoutedData = layoutResult.nodes;
            if (layoutResult.scales) {
                xScale = layoutResult.scales.x;
                yScale = layoutResult.scales.y;
                console.log("Scales updated:", { xScale, yScale }); // Debug log
            }
        }
    }
    
    function handleMouseEnter(event, item) {
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
        console.log('Tooltip Data:', tooltipData); // Debug log
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

    function createScales(nodes, width, height, padding) {
        if (!nodes.length) return null;

        const xRange = nodes[0].rawData.xRange || [0, 2];
        const yRange = nodes[0].rawData.yRange || [0, 2];

        // Find the maximum absolute value for each axis to make it symmetric
        const xMax = Math.max(Math.abs(xRange[0]), Math.abs(xRange[1]));
        const yMax = Math.max(Math.abs(yRange[0]), Math.abs(yRange[1]));

        const xScale = scaleLinear()
            .domain([-xMax, xMax])  // Symmetric domain around 0
            .range([padding, width - padding]);

        const yScale = scaleLinear()
            .domain([-yMax, yMax])  // Symmetric domain around 0
            .range([height - padding, padding]);

        return { x: xScale, y: yScale };
    }

    function drawQuadrantLines(svg, xScale, yScale, width, height, padding) {
        // Add x-axis line (horizontal through 0)
        svg.append('line')
            .attr('class', 'reference-line')
            .attr('x1', padding)
            .attr('x2', width - padding)
            .attr('y1', yScale(0))
            .attr('y2', yScale(0))
            .style('stroke', '#666')
            .style('stroke-width', '1px')
            .style('stroke-dasharray', '4,4');

        // Add y-axis line (vertical through 0)
        svg.append('line')
            .attr('class', 'reference-line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', padding)
            .attr('y2', height - padding)
            .style('stroke', '#666')
            .style('stroke-width', '1px')
            .style('stroke-dasharray', '4,4');

        // Add quadrant labels if needed
        svg.append('text')
            .attr('class', 'quadrant-label')
            .attr('x', width - padding - 50)
            .attr('y', padding + 20)
            .text('Q1')
            .style('fill', '#666');

        // Add other quadrant labels as needed
    }

    // Add function to determine if we're in a bias plot mode
    $: isBiasPlot = data[0]?.rawData?.xLabel?.toLowerCase().includes('bias');

    // Modify the axes rendering
    $: if (isScatterPlot && xScale && yScale && svg) {
        const xAxis = axisBottom(xScale).tickFormat(d => d.toFixed(2));
        const yAxis = axisLeft(yScale).tickFormat(d => d.toFixed(2));

        // Select or create axis groups
        let xAxisGroup = select(svg).select(".x-axis");
        let yAxisGroup = select(svg).select(".y-axis");

        if (xAxisGroup.empty()) {
            xAxisGroup = select(svg).append("g").attr("class", "x-axis");
        }
        if (yAxisGroup.empty()) {
            yAxisGroup = select(svg).append("g").attr("class", "y-axis");
        }

        // Position and call axes
        xAxisGroup
            .attr("transform", `translate(0, ${isBiasPlot ? yScale(0) : actualHeight - padding})`)
            .call(xAxis);

        yAxisGroup
            .attr("transform", `translate(${isBiasPlot ? xScale(0) : padding}, 0)`)
            .call(yAxis);

        // Add quadrant labels if in bias plot mode
        if (isBiasPlot) {
            // Remove existing labels first
            select(svg).selectAll(".quadrant-label").remove();

            // Add new labels
            select(svg).append("text")
                .attr("class", "quadrant-label")
                .attr("x", xScale(0) + 10)
                .attr("y", yScale(0) - 10)
                .text("Q1");

            select(svg).append("text")
                .attr("class", "quadrant-label")
                .attr("x", xScale(0) - 30)
                .attr("y", yScale(0) - 10)
                .text("Q2");

            select(svg).append("text")
                .attr("class", "quadrant-label")
                .attr("x", xScale(0) - 30)
                .attr("y", yScale(0) + 20)
                .text("Q3");

            select(svg).append("text")
                .attr("class", "quadrant-label")
                .attr("x", xScale(0) + 10)
                .attr("y", yScale(0) + 20)
                .text("Q4");
        }
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
        {#if isScatterPlot && xScale && yScale}
            <g class="axes">
                <!-- X Axis -->
                <g class="x-axis" transform="translate(0,{isBiasPlot ? yScale(0) : actualHeight - padding})">
                    <path 
                        class="domain" 
                        d={`M${padding},0H${actualWidth - padding}`}
                    />
                    {#each xScale.ticks() as tick}
                        <g class="tick" transform="translate({xScale(tick)},0)">
                            <line y2="6"></line>
                            <text y="9" dy="0.71em">{tick.toFixed(2)}</text>
                        </g>
                    {/each}
                </g>

                <!-- Y Axis -->
                <g class="y-axis" transform="translate({isBiasPlot ? xScale(0) : padding},0)">
                    <path 
                        class="domain" 
                        d={`M0,${padding}V${actualHeight - padding}`}
                    />
                    {#each yScale.ticks() as tick}
                        <g class="tick" transform="translate(0,{yScale(tick)})">
                            <line x2="-6"></line>
                            <text x="-9" dy="0.32em">{tick.toFixed(2)}</text>
                        </g>
                    {/each}
                </g>

                <!-- Quadrant labels for bias plot -->
                {#if isBiasPlot}
                    <text x={xScale(0) + 10} y={yScale(0) - 10} class="quadrant-label">Q1</text>
                    <text x={xScale(0) - 30} y={yScale(0) - 10} class="quadrant-label">Q2</text>
                    <text x={xScale(0) - 30} y={yScale(0) + 20} class="quadrant-label">Q3</text>
                    <text x={xScale(0) + 10} y={yScale(0) + 20} class="quadrant-label">Q4</text>
                {/if}
            </g>
        {/if}

        <g class="bubbles" style:transform={transform}>
            {#each layoutedData as item (item.id)}
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
                        opacity={item.opacity !== undefined ? item.opacity : 0.8}
                    />
                </g>
            {/each}
        </g>

        {#if isScatterPlot && xScale && yScale}
            <!-- Move reference line here (after bubbles) -->
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
        font-size: 12px;
        fill: #666;
    }

    .axes {
        pointer-events: none;  /* Allow clicking through axes */
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

    .quadrant-label {
        font-size: 12px;
        fill: #666;
        pointer-events: none;
    }
    
    .quadrant-line {
        pointer-events: none;
        opacity: 0.5;
    }

    .x-axis path,
    .y-axis path {
        stroke: #666;
        stroke-width: 1.5;
    }

    .tick line {
        stroke: #666;
        stroke-width: 1;
    }

    .tick text {
        fill: #666;
        font-size: 12px;
    }

    .quadrant-label {
        font-size: 12px;
        fill: #666;
        pointer-events: none;
    }

    .domain {
        fill: none;
        stroke: #666;
        stroke-width: 1.5;
    }
</style>