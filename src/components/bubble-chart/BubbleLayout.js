import { forceSimulation, forceCollide, forceCenter, forceManyBody } from 'd3';

export function createBubbleLayout({ 
    width = 800, 
    height = 500, 
    padding = 4,
    centerStrength = 0.1,
    collideStrength = 1
}) {
    let simulation = null;
    
    function initializeSimulation(data) {
        // Stop any existing simulation
        if (simulation) simulation.stop();
        
        // Create new simulation
        simulation = forceSimulation(data)
            .force('charge', forceManyBody().strength(5))
            .force('center', forceCenter(width / 2, height / 2).strength(centerStrength))
            .force('collision', forceCollide().radius(d => d.size + padding).strength(collideStrength))
            .stop(); // Don't start automatically
        
        // Run the simulation synchronously
        simulation.tick(300);
        
        // Return the positioned data
        return data;
    }
    
    function updateLayout(data) {
        return initializeSimulation(data);
    }
    
    return {
        updateLayout
    };
}