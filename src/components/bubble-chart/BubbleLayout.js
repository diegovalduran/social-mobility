import { forceSimulation, forceManyBody, forceCenter, forceCollide, forceX, forceY, scaleLinear } from 'd3';

export function createBubbleLayout({ 
    width = 2200, 
    height = 1000, 
    padding = 40,
    maxBubbleSize = 25,
    isScatterPlot = false
}) {
    function initializeSimulation(data) {
        console.log("BubbleLayout - Mode:", isScatterPlot ? "Scatter Plot" : "Bubble Chart");
        console.log("BubbleLayout - Sample data:", data[0]?.rawData);
        
        if (isScatterPlot) {
            // Create scales for scatter plot based on data ranges
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
                .range([padding, width - padding]);
            
            const yScale = scaleLinear()
                .domain([yExtent[0] * 0.9, yExtent[1] * 1.1])
                .range([height - padding, padding]);

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