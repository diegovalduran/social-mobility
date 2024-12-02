<script>
    import Bar from './Bar.svelte';
  
    export let row;
    export let config;
  
    function handleClick() {
      row.isHighlighted = !row.isHighlighted;
    }
  </script>
  
  <div 
    class="bar-row" 
    class:highlighted={row.isHighlighted}
    on:click={handleClick}
    style="height: {config.barHeight}px; margin-bottom: 5px;"
  >
    <div class="row-label" style="width: {config.margins.left}px">
      {row.label}
    </div>
    <div class="bars">
      {#each row.values as value, i}
        <div class="bar-section">
          <Bar
            percentage={value}
            color={config.colors[i]}
            height={config.barHeight}
          />
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .bar-row {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
  
    .bar-row:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  
    .bar-row.highlighted {
      background-color: rgba(0, 0, 0, 0.1);
    }
  
    .row-label {
      padding-right: 1rem;
      font-size: 0.9rem;
      text-align: right;
    }
  
    .bars {
      display: flex;
      flex: 1;
      height: 100%;
    }
  
    .bar-section {
      flex: 1;
      padding-right: 1rem;
    }
  </style>