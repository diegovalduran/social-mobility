<script>
    export let x = 0;
    export let y = 0;
    export let visible = false;
    export let data = {};
    export let backgroundColor = "white";
    export let textColor = "#333";
    
    // Modify the style calculation to use fixed positioning and ensure visibility
    $: style = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background-color: ${backgroundColor};
        color: ${textColor};
        opacity: ${visible ? 1 : 0};
        pointer-events: ${visible ? 'auto' : 'none'};
        z-index: 1000;
    `;
</script>

<div 
    class="tooltip"
    style={style}
    class:visible
>
    <div class="tooltip-content">
        {#if data?.label}
            <div class="label">{data.label}</div>
        {/if}
        {#if data?.detail}
            <div class="detail">{data.detail}</div>
        {/if}
    </div>
</div>

<style>
    .tooltip {
        padding: 8px 12px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        min-width: 150px;
        transform: translate(-50%, -100%);
        margin-top: -10px;
        transition: opacity 0.2s ease-out;
    }
    
    .tooltip-content {
        max-width: 350px;
    }
    
    .label {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 4px;
        white-space: nowrap;
    }
    
    .detail {
        font-size: 12px;
        opacity: 0.8;
    }

    /* Add a small arrow at the bottom */
    .tooltip::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid white;
    }
</style>