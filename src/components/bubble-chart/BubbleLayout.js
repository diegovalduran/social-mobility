import { forceSimulation, forceManyBody, forceCenter, forceCollide, forceX, forceY, scaleLinear } from 'd3';

export function createBubbleLayout({ 
    width = 2200, 
    height = 1000, 
    paddingLeft = 120,
    paddingRight = 40,
    paddingTop = 40,
    paddingBottom = 40,
    maxBubbleSize = 25,
    isScatterPlot = false
}) {
    function initializeSimulation(data) {
        console.log("BubbleLayout - Mode:", isScatterPlot ? "Scatter Plot" : "Bubble Chart");
        
        if (isScatterPlot) {
            // Check specifically for the regular bias plot (not bias high)
            const isRegularBiasPlot = data[0]?.rawData?.xLabel?.toLowerCase().includes('bias') && 
                                     !data[0]?.rawData?.xLabel?.toLowerCase().includes('high');
            
            if (isRegularBiasPlot) {
                // Set specific ranges for regular bias plots only
                const xScale = scaleLinear()
                    .domain([-0.2, 0.4])  // specific x-axis range
                    .range([paddingLeft, width - paddingRight]);
                
                const yScale = scaleLinear()
                    .domain([-0.15, 0.25])  // specific y-axis range
                    .range([height - paddingBottom, paddingTop]);
                    
                const processedData = data.map(d => ({
                    ...d,
                    x: xScale(d.rawData.xMetric),
                    y: yScale(d.rawData.yMetric),
                    fx: xScale(d.rawData.xMetric),
                    fy: yScale(d.rawData.yMetric),
                    size: d.size * 0.8  // Reduce size by 20%
                }));
                
                return {
                    nodes: processedData,
                    scales: { x: xScale, y: yScale },
                    isBiasPlot: true
                };
            } else {
                // Use data-driven ranges for all other plots (including bias high)
                const xExtent = [
                    Math.min(...data.map(d => d.rawData.xMetric)),
                    Math.max(...data.map(d => d.rawData.xMetric))
                ];
                
                const yExtent = [
                    Math.min(...data.map(d => d.rawData.yMetric)),
                    Math.max(...data.map(d => d.rawData.yMetric))
                ];

                const xScale = scaleLinear()
                    .domain([xExtent[0] * 0.9, xExtent[1] * 1.1])
                    .range([paddingLeft, width - paddingRight]);
                
                const yScale = scaleLinear()
                    .domain([yExtent[0] * 0.9, yExtent[1] * 1.1])
                    .range([height - paddingBottom, paddingTop]);

                const processedData = data.map(d => ({
                    ...d,
                    x: xScale(d.rawData.xMetric),
                    y: yScale(d.rawData.yMetric),
                    fx: xScale(d.rawData.xMetric),
                    fy: yScale(d.rawData.yMetric)
                }));
                
                return {
                    nodes: processedData,
                    scales: { x: xScale, y: yScale }
                };
            }
        } else {
            // Remove any fixed positions from previous scatter plot
            data.forEach(d => {
                delete d.fx;
                delete d.fy;
            });
            
            // Bubble chart simulation
            const simulation = forceSimulation(data)
                .force("x", forceX(width / 2).strength(0.15))
                .force("y", forceY(height / 2).strength(0.15))
                .force("charge", forceManyBody().strength(-10))
                .force("collide", forceCollide().radius(d => d.size + 1))
                .stop();

            // Run the simulation synchronously
            for (let i = 0; i < 300; ++i) simulation.tick();
            
            return {
                nodes: simulation.nodes(),
                scales: null
            };
        }
    }
    
    function createScales(nodes, width, height, padding) {
        if (!nodes.length) return null;

        const xRange = nodes[0].rawData.xRange || [0, 2];
        const yRange = nodes[0].rawData.yRange || [0, 2];

        const xScale = scaleLinear()
            .domain(xRange)
            .range([padding, width - padding]);

        const yScale = scaleLinear()
            .domain(yRange)
            .range([height - padding, padding]);  // Inverted for SVG coordinates

        return { x: xScale, y: yScale };
    }
    
    return {
        updateLayout: initializeSimulation
    };
}