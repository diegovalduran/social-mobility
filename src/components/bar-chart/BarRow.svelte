<script>
    import Bar from './Bar.svelte';
  
    export let row;
    export let metrics;
    export let config;
  
    // Function to format numbers with commas
    function formatNumber(num) {
      if (num === null || num === 0) return '—'; // Em dash for null/zero values
      return new Intl.NumberFormat('en-US').format(num);
    }
  
    // Check if metric should be displayed as a standalone number
    function isStandaloneNumber(metricId) {
      return metricId === 'population' || 
             metricId === 'students_9_to_12' || 
             metricId === 'students_per_cohort';
    }
  </script>
  
  <div 
    class="bar-row" 
    style="height: {config.barHeight}px; margin-bottom: 5px;"
  >
    <div 
      class="row-label" 
      style="width: {config.margins.left}px"
      title={row.label}
    >
      <span class="truncate-text">{row.label}</span>
    </div>
    <div class="metrics">
      {#each row.values as value, i}
        <div class="metric">
          {#if isStandaloneNumber(metrics[i].id)}
            <div class="number-box">
              {#if value !== null && value > 0}
                <span class="number-value">{formatNumber(value)}</span>
              {:else}
                <span class="empty-value">—</span>
              {/if}
            </div>
          {:else}
            {#if value !== null && value > 0}
              <Bar
                percentage={value}
                color={config.colors[i]}
                height={config.barHeight}
              />
            {:else}
              <div class="empty-bar">—</div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  </div>
  
  <style>
    .bar-row {
      display: flex;
      align-items: center;
      transition: background-color 0.2s ease;
    }
  
    .bar-row:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  
    .row-label {
      padding-right: 1rem;
      font-size: 0.9rem;
      text-align: right;
      color: #666;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
    }
  
    .truncate-text {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      direction: ltr;
      text-align: right;
    }
  
    .row-label:hover {
      overflow: visible;
      z-index: 1;
    }
  
    .row-label:hover .truncate-text {
      position: absolute;
      right: 1rem;
      background-color: white;
      padding: 2px 4px;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  
    .metrics {
      flex: 1;
      display: flex;
    }
  
    .metric {
      flex: 1;
      padding-right: 1rem;
    }
  
    .number-box {
      height: 100%;
      background-color: #333;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0;
    }
  
    .number-value {
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-variant-numeric: tabular-nums;
      font-size: 0.9rem;
    }
  
    .empty-value, .empty-bar {
      color: #999;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 0.25rem 0;
    }
  
    .empty-bar {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #ddd;
      border-radius: 4px;
    }
  </style>