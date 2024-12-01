<script>
    export let scale = 1;
    export let minScale = 0.5;
    export let maxScale = 4;
    
    function handleZoomIn() {
        scale = Math.min(maxScale, scale * 1.2);
    }
    
    function handleZoomOut() {
        scale = Math.max(minScale, scale / 1.2);
    }
    
    function handleReset() {
        scale = 1;
    }
</script>

<div class="zoom-controls">
    <button on:click={handleZoomIn} aria-label="Zoom in">
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
    </button>
    
    <button on:click={handleReset} aria-label="Reset zoom">
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
    </button>
    
    <button on:click={handleZoomOut} aria-label="Zoom out">
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 13H5v-2h14v2z"/>
        </svg>
    </button>
</div>

<style>
    .zoom-controls {
        position: absolute;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: white;
        padding: 8px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    button {
        width: 32px;
        height: 32px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    button:hover {
        background: #f5f5f5;
    }
    
    svg {
        fill: currentColor;
    }
</style>