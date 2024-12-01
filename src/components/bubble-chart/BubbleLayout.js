import { forceSimulation } from 'd3';

export function createBubbleLayout({ 
    width = 800, 
    height = 500, 
    padding = 40
}) {
    function initializeSimulation(data) {
        // Calculate usable area
        const usableWidth = width - (padding * 2);
        const usableHeight = height - (padding * 2);
        
        // Calculate optimal grid dimensions based on aspect ratio
        const aspectRatio = usableWidth / usableHeight;
        const totalNodes = data.length;
        const cols = Math.ceil(Math.sqrt(totalNodes * aspectRatio));
        const rows = Math.ceil(totalNodes / cols);
        
        // Calculate cell size
        const cellWidth = usableWidth / cols;
        const cellHeight = usableHeight / rows;
        
        // Position each node in a grid
        data.forEach((d, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            d.x = padding + (col + 0.5) * cellWidth;
            d.y = padding + (row + 0.5) * cellHeight;
        });
        
        return data;
    }
    
    return {
        updateLayout: initializeSimulation
    };
}