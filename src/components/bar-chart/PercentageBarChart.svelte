<script>
  import BarRow from './BarRow.svelte';
  import Bar from './Bar.svelte';
  import Icon from '$components/helpers/Icon.svelte';
  
  export let data = [];
  export let activeMode = "COUNTY";
  export let barChartMode;
  export let initialSortField = 0;
  export let initialSortDirection = 'desc';
  
  const config = {
    barHeight: 20,
    colors: ['#333333', '#666666', '#999999'],
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 150
    }
  };

  let sortField = initialSortField;
  let sortDirection = initialSortDirection;

  // Watch for changes in initialSortField and initialSortDirection
  $: {
    if (initialSortField !== undefined) {
      sortField = initialSortField;
    }
    if (initialSortDirection !== undefined) {
      sortDirection = initialSortDirection;
    }
  }

  // Add function to handle external sort changes
  export function handleBarSortChange(field, direction) {
    sortField = field;
    sortDirection = direction;
  }

  // Define metrics based on mode
  $: metrics = barChartMode === "COUNTY" ? [
    { 
      id: 'population', 
      label: 'Population', 
      getValue: (d) => d?.properties?.population || 0,
      showBar: false
    },
    { 
      id: 'clustering_county', 
      label: 'Clustering', 
      getValue: (d) => normalizeValue(d?.properties?.clusteringCounty || 0),
      showBar: true
    },
    { 
      id: 'support_ratio', 
      label: 'Support Ratio', 
      getValue: (d) => normalizeValue(d?.properties?.supportRatioCounty || 0),
      showBar: true
    },
    { 
      id: 'volunteering_rate', 
      label: 'Volunteering Rate', 
      getValue: (d) => normalizeValue(d?.properties?.volunteeringRate || 0),
      showBar: true
    }
  ] : barChartMode === "HIGH_SCHOOL" ? [
    { 
      id: 'students_9_to_12', 
      label: 'Students (9-12)', 
      getValue: (d) => d?.students9To12 || 0,
      showBar: false,
      isStandaloneNumber: true
    },
    { 
      id: 'clustering_hs', 
      label: 'Clustering', 
      getValue: (d) => normalizeValue(d?.clusteringHs || 0),
      showBar: true
    },
    { 
      id: 'volunteering_rate_hs', 
      label: 'Volunteering Rate', 
      getValue: (d) => normalizeValue(d?.volunteeringRateHs || 0),
      showBar: true
    }
  ] : [
    { 
      id: 'students_per_cohort', 
      label: 'Students per Cohort', 
      getValue: (d) => d?.mean_students_per_cohort || 0,
      showBar: false
    },
    { 
      id: 'clustering_college', 
      label: 'Clustering', 
      getValue: (d) => normalizeValue(d?.clustering_college || 0),
      showBar: true
    },
    { 
      id: 'support_ratio_college', 
      label: 'Support Ratio', 
      getValue: (d) => normalizeValue(d?.support_ratio_college || 0),
      showBar: true
    },
    { 
      id: 'volunteering_rate_college', 
      label: 'Volunteering Rate', 
      getValue: (d) => normalizeValue(d?.volunteering_rate_college || 0),
      showBar: true
    }
  ];

  function normalizeValue(value) {
    if (value === undefined || value === null || isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, Number(value) * 100));
  }

  function isStandaloneNumber(metricId) {
    return metricId === 'population' || 
           metricId === 'students_9_to_12' || 
           metricId === 'students_per_cohort';
  }

  // Update the data transformation based on mode
  $: validData = data?.map(item => {
    if (barChartMode === "COUNTY") {
      if (!item?.properties) return null;
      
      const hasValidValues = 
        (item.properties.clusteringCounty > 0) ||
        (item.properties.supportRatioCounty > 0) ||
        (item.properties.volunteeringRate > 0);

      if (!hasValidValues) return null;

      return {
        properties: {
          name: item.properties.name,
          state: item.properties.state,
          population: item.properties.population,
          clusteringCounty: item.properties.clusteringCounty,
          supportRatioCounty: item.properties.supportRatioCounty,
          volunteeringRate: item.properties.volunteeringRate
        }
      };
    } else if (barChartMode === "HIGH_SCHOOL") {
      if (!item) return null;
      
      const hasValidValues = 
        (item.clusteringHs > 0) ||
        (item.volunteeringRateHs > 0);

      if (!hasValidValues) return null;

      return {
        high_school_name: item.high_school_name,
        state: item.state,
        students9To12: item.students9To12,
        clusteringHs: item.clusteringHs,
        volunteeringRateHs: item.volunteeringRateHs
      };
    } else {
      // College mode
      if (!item) return null;
      
      // Format the number to match the display format
      const formattedValue = new Intl.NumberFormat('en-US').format(item.mean_students_per_cohort);
      
      // Check against the formatted string
      if (formattedValue === "26,989.667") {
        console.log('Excluding college:', item.college_name);
        return null;
      }
      
      const hasValidValues = 
        (item.clustering_college > 0) ||
        (item.support_ratio_college > 0) ||
        (item.volunteering_rate_college > 0);

      if (!hasValidValues) return null;

      return item;
    }
  }).filter(Boolean);

  // Update chartData to show top 100 results
  $: chartData = validData
    ?.sort((a, b) => {
      const aValue = metrics[sortField]?.getValue(a) || 0;
      const bValue = metrics[sortField]?.getValue(b) || 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    })
    .slice(0, 100)  // Take top 100 results
    .map(item => {
      const values = metrics.map(metric => {
        const value = metric.getValue(item);
        return value > 0 ? value : null;
      });
      
      return {
        label: barChartMode === "COUNTY" 
          ? `${item.properties.name}, ${item.properties.state}`
          : barChartMode === "HIGH_SCHOOL"
          ? `${item.high_school_name}, ${item.state}`
          : item.college_name,
        values,
        isHighlighted: false
      };
    }) || [];

  function toggleSort(index) {
    if (sortField === index) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = index;
      sortDirection = 'desc';
    }
  }

  let searchTerm = '';
  let searchResult = null;

  // Search function
  $: {
    if (searchTerm.length > 2) {
      const searchLower = searchTerm.toLowerCase();
      const result = validData?.find(item => {
        const name = barChartMode === "COUNTY" 
          ? `${item.properties.name}, ${item.properties.state}`.toLowerCase()
          : barChartMode === "HIGH_SCHOOL"
          ? `${item.high_school_name}, ${item.state}`.toLowerCase()
          : item.college_name.toLowerCase();
        return name.includes(searchLower);
      });
      
      if (result) {
        searchResult = {
          label: barChartMode === "COUNTY" 
            ? `${result.properties.name}, ${result.properties.state}`
            : barChartMode === "HIGH_SCHOOL"
            ? `${result.high_school_name}, ${result.state}`
            : result.college_name,
          values: metrics.map(metric => metric.getValue(result))
        };
      } else {
        searchResult = null;
      }
    } else {
      searchResult = null;
    }
  }
</script>

<div class="chart-container">
  <div class="chart-header">
    <div class="county-header" style="width: {config.margins.left}px">
      {barChartMode === "COUNTY" ? "County" : barChartMode === "HIGH_SCHOOL" ? "High School" : "College"}
    </div>
    <div class="metric-labels">
      {#each metrics as metric, i}
        <div class="header-section">
          <button 
            class="header-button" 
            class:active={sortField === i}
            on:click={() => toggleSort(i)}
          >
            <span>{metric.label}</span>
            {#if sortField === i}
              <Icon 
                name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} 
                size="14"
              />
            {/if}
          </button>
        </div>
      {/each}
    </div>
  </div>
  
  <div class="search-section">
    <input
      type="text"
      class="search-input"
      placeholder={barChartMode === "COUNTY" 
        ? "Search counties..." 
        : barChartMode === "HIGH_SCHOOL"
        ? "Search high schools..."
        : "Search colleges..."}
      bind:value={searchTerm}
    />
  </div>

  {#if searchResult}
    <div class="search-result">
      <h4>Search Result:</h4>
      <BarRow row={searchResult} {metrics} {config} />
    </div>
  {/if}

  <div class="separator" />

  <div class="rows-container-wrapper">
    <div class="rows-container">
      <div class="rows">
        {#each chartData as row}
          <BarRow {row} {metrics} {config} />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .chart-container {
    margin: 2rem 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .chart-header {
    display: flex;
    margin-bottom: 1rem;
    font-weight: bold;
    font-size: 0.9rem;
    color: #333;
  }

  .county-header {
    padding-right: 1rem;
    text-align: right;
    border-bottom: 2px solid #333;
  }
  
  .metric-labels {
    flex: 1;
    display: flex;
  }

  .header-section {
    position: relative;
    flex: 1;
    padding-right: 1rem;
  }

  .header-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    background: none;
    border: none;
    border-bottom: 2px solid #333;
    font-weight: bold;
    font-size: 0.9rem;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .header-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .header-button.active {
    background-color: #f0f0f0;
  }
  
  .rows-container-wrapper {
    padding-top: 1.25rem;  /* Consistent top spacing */
  }

  .rows-container {
    height: calc(25 * (28px + 4px));
    overflow-y: auto;
    border-radius: 4px;
    scrollbar-width: thin;
    scrollbar-color: #999 #f0f0f0;
    padding-top: 12px;  /* Consistent padding for all views */
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .search-section {
    margin: 0.5rem 0;
    padding: 0;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .search-input:focus {
    outline: none;
    border-color: #666;
  }

  .search-result {
    margin: 0.5rem 0;
    padding: 0.5rem 0;
    background-color: transparent;
  }

  .search-result h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    color: #666;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .separator {
    height: 1px;
    background-color: #ddd;
    margin: 0.75rem 0;
  }
</style>

