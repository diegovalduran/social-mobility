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
        
        // Create scales for scatter plot
        const xScale = scaleLinear()
            .domain([0.2, 2])
            .range([padding, width - padding]);
        
        const yScale = scaleLinear()
            .domain([0.2, 1.8])
            .range([height - padding, padding]);

        if (isScatterPlot) {
            // For scatter plot, directly set positions without simulation
            const processedData = data.map(d => ({
                ...d,
                x: xScale(d.rawData.ec_own_ses_hs),
                y: yScale(d.rawData.ec_parent_ses_hs),
                fx: xScale(d.rawData.ec_own_ses_hs), // Fixed positions
                fy: yScale(d.rawData.ec_parent_ses_hs)  // Fixed positions
            }));
            
            console.log("Scatter plot data:", processedData[0]); // Debug log
            
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
    
    return {
        updateLayout: initializeSimulation
    };
}