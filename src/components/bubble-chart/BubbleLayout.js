import { scaleLinear } from 'd3';

export function createBubbleLayout({ 
    width = 2200, 
    height = 1000, 
    paddingLeft = 120,
    paddingRight = 40,
    paddingTop = 40,
    paddingBottom = 40,
    maxBubbleSize = 25,
}) {
    let currentPositions = new Map();

    function initializeSimulation(data) {
        data.forEach(d => {
            if (d.x !== undefined && d.y !== undefined) {
                currentPositions.set(d.id, { x: d.x, y: d.y });
            }
        });

        const isRegularBiasPlot = data[0]?.rawData?.xLabel?.toLowerCase().includes('bias') && 
                                 !data[0]?.rawData?.xLabel?.toLowerCase().includes('high');
        
        if (isRegularBiasPlot) {
            const xScale = scaleLinear()
                .domain([-0.2, 0.4]) 
                .range([paddingLeft, width - paddingRight]);
            
            const yScale = scaleLinear()
                .domain([-0.15, 0.25]) 
                .range([height - paddingBottom, paddingTop]);
                
            const processedData = data.map(d => {
                const currentPos = currentPositions.get(d.id);
                const targetX = xScale(d.rawData.xMetric);
                const targetY = yScale(d.rawData.yMetric);
                
                if (currentPos) {
                    return {
                        ...d,
                        x: currentPos.x + (targetX - currentPos.x) * 0.05,
                        y: currentPos.y + (targetY - currentPos.y) * 0.05,
                        fx: targetX,
                        fy: targetY
                    };
                }
                
                return {
                    ...d,
                    x: targetX,
                    y: targetY,
                    fx: targetX,
                    fy: targetY
                };
            });
            
            return {
                nodes: processedData,
                scales: { x: xScale, y: yScale },
                isBiasPlot: true
            };
        } else {
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

            const processedData = data.map(d => {
                const currentPos = currentPositions.get(d.id);
                const targetX = xScale(d.rawData.xMetric);
                const targetY = yScale(d.rawData.yMetric);
                
                if (currentPos) {
                    return {
                        ...d,
                        x: currentPos.x + (targetX - currentPos.x) * 0.05, 
                        y: currentPos.y + (targetY - currentPos.y) * 0.05,
                        fx: targetX,
                        fy: targetY
                    };
                }
                
                return {
                    ...d,
                    x: targetX,
                    y: targetY,
                    fx: targetX,
                    fy: targetY
                };
            });
            
            return {
                nodes: processedData,
                scales: { x: xScale, y: yScale }
            };
        }
    }
    
    return {
        updateLayout: initializeSimulation
    };
}