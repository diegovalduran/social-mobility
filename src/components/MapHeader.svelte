<script>
    export let year = "MODE";
    export let size = "EC";
    export let color = "ECONOMIC CONNECTEDNESS";
    export let activeMode = "EC";
  
    const years = ["EC", "POP", "Test"];
    const sizeScale = ["1K", "50K", "1M+"];
    const colorScale = ["0%", "24%", "48%", "71%", "95%"];

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function handleModeClick(mode) {
        console.log("Mode clicked in Header:", mode);
        activeMode = mode;
        if (mode === "EC") {
            size = "EC";
            color = "ECONOMIC CONNECTEDNESS";
        } else if (mode === "POP") {
            size = "POPULATION";
            color = "POPULATION (2018)";
        }
        dispatch('modeChange', mode);
    }
</script>
  
  <div class="header">
    <div class="section year-section">
      <div class="title">Mode</div>
      <div class="years">
        {#each years as mode}
          <button 
            class="year-btn" 
            class:active={mode === activeMode}
            on:click={() => handleModeClick(mode)}
          >
            {mode}
          </button>
        {/each}
      </div>
    </div>

    <div class="section size-section">
      <div class="title">Size: {size}</div>
      <div class="circles">
        {#each sizeScale as s}
          <div class="circle-group">
            <div class="circle" style="width: {s === '1M+' ? '24px' : s === '50K' ? '16px' : '8px'}; height: {s === '1M+' ? '24px' : s === '50K' ? '16px' : '8px'};"></div>
            <span>{s}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="section color-section">
      <div class="title">Color: {color}</div>
      <div class="colors">
        {#each colorScale as c}
          <div class="color-group">
            <div class="color-box" style="background: hsl(240, 100%, {100 - parseInt(c)}%);"></div>
            <span>{c}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <style>
    .header {
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: var(--color-fg);
      display: flex;
      gap: 2rem;
    }
  
    .section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
  
    .year-section {
      width: 300px;
      align-items: flex-start;
    }
  
    .year-section .title {
      text-align: left;
    }
  
    .year-section .years {
      justify-content: flex-start;
    }
  
    .size-section {
      margin-left: 4rem;
      min-width: 200px;
    }
  
    .color-section {
      min-width: 200px;
    }
  
    .title {
      font-size: 0.8rem;
      text-transform: uppercase;
      width: 100%;
      text-align: center;
    }
  
    .years {
      display: flex;
      gap: 0.5rem;
      width: 100%;
    }
  
    .circles, .colors {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      width: 100%;
    }

    .circle-group, .color-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
    }
  
    .circle {
      border: 1px solid var(--color-fg);
      border-radius: 50%;
    }
  
    .color-box {
      width: 16px;
      height: 16px;
    }

    .year-btn.active {
      background: var(--color-fg);
      color: var(--color-bg);
    }
  </style>