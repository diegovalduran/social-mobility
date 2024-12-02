<script>
  import BarRow from './BarRow.svelte';
  import Bar from './Bar.svelte';
  import Icon from '$components/helpers/Icon.svelte';
  
  export let data = [];
  export let activeMode = "COUNTY";
  
  // Add console logs to track data and mode changes
  $: {
    console.log("Mode changed to:", activeMode);
    console.log("Current data sample:", data?.[0]);
    console.log("Data length:", data?.length);
  }

  const config = {
    barHeight: 20,
    colors: ['#333333', '#666666', '#999999', '#CCCCCC'],
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 150
    }
  };

  // Define metrics based on mode
  $: metrics = activeMode === "COUNTY" 
    ? [
        { 
          id: 'ec_county', 
          label: 'Electoral College', 
          getValue: (d) => {
            console.log("EC Value for:", d?.properties);  // Debug log
            return normalizeValue(d?.properties?.ecValue);
          }
        },
        { 
          id: 'population', 
          label: 'Population', 
          getValue: (d) => {
            console.log("Population Value for:", d?.properties);  // Debug log
            return normalizeValue(d?.properties?.population);
          }
        }
      ]
    : [
        { 
          id: 'ses_college', 
          label: 'College SES', 
          getValue: (d) => {
            if (!d || !d.properties) return 0;
            const value = d.properties.ec_own_ses_college;
            return value ? normalizeValue(value) : 0;
          }
        }
      ];

  function normalizeValue(value) {
    if (value === undefined || value === null) return 0;
    console.log("Normalizing value:", value);  // Debug log
    if (activeMode === "COUNTY") {
      // For county data, normalize between 0 and 100
      return value * 100;
    } else {
      // For college data, normalize from -2 to 2 range
      return ((value - -2) / (2 - -2)) * 100;
    }
  }

  // Get label based on mode with error handling
  function getLabel(item) {
    if (!item || !item.properties) return 'Unknown';
    return activeMode === "COUNTY" 
      ? `${item.properties.name || 'Unknown'}, ${item.properties.state || ''}`
      : (item.properties.college_name || 'Unknown');
  }

  // Add data validation with logging
  $: validData = data?.filter(d => {
    const isValid = d && d.properties;
    if (!isValid) console.log("Invalid data item:", d);
    return isValid;
  });

  let sortField = 0;  // Track which column is being used for sorting
  let sortDirection = 'desc';

  function toggleSort(index) {
    if (sortField === index) {
      // If clicking the same column, toggle sort direction
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If clicking a new column, set it as sort field and default to desc
      sortField = index;
      sortDirection = 'desc';
    }
  }

  $: chartData = validData
    ?.sort((a, b) => {
      const selectedMetric = selectedMetrics[sortField];
      const aValue = selectedMetric?.getValue(a) || 0;
      const bValue = selectedMetric?.getValue(b) || 0;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    })
    .slice(0, 20)
    .map(item => ({
      label: getLabel(item),
      values: selectedMetrics.map(metric => metric.getValue(item)),
      isHighlighted: false
    })) || [];

  // Add console log to debug data structure
  $: {
    if (activeMode === "COLLEGE" && data?.length > 0) {
      console.log("Sample college data item:", data[0]);
      console.log("Available properties:", data[0]?.properties);
    }
  }

  // Update search placeholder based on mode
  $: searchPlaceholder = activeMode === "COUNTY" 
    ? "Search counties..." 
    : "Search colleges...";

  // Updated search function to handle both modes
  function searchItem(term) {
    if (!term) {
      searchResult = null;
      return;
    }
    
    searchResult = data.find(item => {
      if (activeMode === "COUNTY") {
        const countyName = item.properties.name?.toLowerCase() || '';
        const stateName = item.properties.state?.toLowerCase() || '';
        const searchTerm = term.toLowerCase();
        return countyName.includes(searchTerm) || 
               stateName.includes(searchTerm) ||
               `${countyName}, ${stateName}`.includes(searchTerm);
      } else {
        const collegeName = item.properties.college_name?.toLowerCase() || '';
        return collegeName.includes(term.toLowerCase());
      }
    });
  }

  // Replace the old searchCounty function with searchItem
  $: {
    searchItem(searchTerm);
  }

  // Initialize selectedMetrics with alternating values for counties
  $: selectedMetrics = metrics ? (
    activeMode === "COUNTY" 
      ? [metrics[0], metrics[1], metrics[0], metrics[1]]  // Alternate EC and Population
      : [metrics[0], metrics[0], metrics[0], metrics[0]]  // All College SES for colleges
  ) : [];

  // Update default headers based on mode
  $: headers = activeMode === "COUNTY" 
    ? ['Electoral College', 'Population', 'Electoral College', 'Population']
    : ['College SES', 'College SES', 'College SES', 'College SES'];

  // Initialize selectedHeaders after headers is defined
  $: selectedHeaders = headers ? [...headers] : [];

  let openDropdowns = [false, false, false, false];

  function toggleDropdown(index) {
    openDropdowns = openDropdowns.map((_, i) => i === index ? !openDropdowns[i] : false);
  }

  function selectMetric(columnIndex, metric) {
    selectedMetrics[columnIndex] = metric;
    selectedMetrics = [...selectedMetrics]; // Trigger reactivity
    selectedHeaders[columnIndex] = metric.label;
    selectedHeaders = [...selectedHeaders]; // Trigger reactivity
    openDropdowns[columnIndex] = false;
    openDropdowns = [...openDropdowns]; // Trigger reactivity
  }

  let searchTerm = '';
  let searchResult = null;  // Will hold the matched county data
</script>

<div class="chart-container">
  <div class="chart-header">
    <div class="county-header" style="width: {config.margins.left}px">
      {activeMode === "COUNTY" ? "County" : "College"}
    </div>
    <div class="metric-labels">
      {#each selectedHeaders as header, i}
        <div class="header-section">
          <button 
            class="header-button" 
            class:active={sortField === i}
            on:click={() => toggleSort(i)}
          >
            <span>{header}</span>
            <div class="header-icons">
              {#if sortField === i}
                <span class="sort-icon">
                  <Icon 
                    name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} 
                    size="14"
                  />
                </span>
              {/if}
              <span class="dropdown-icon" on:click|stopPropagation={() => toggleDropdown(i)}>
                <Icon name={openDropdowns[i] ? 'chevron-up' : 'chevron-down'} size="14" />
              </span>
            </div>
          </button>
          
          {#if openDropdowns[i]}
            <div class="dropdown-menu">
              {#each metrics as metric}
                {#if metric.label !== selectedMetrics[i].label}
                  <div class="dropdown-item" on:click={() => selectMetric(i, metric)}>
                    {metric.label}
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  
  <div class="rows">
    <!-- Search row -->
    <div class="search-row" style="height: {config.barHeight}px;">
      <div class="row-label" style="width: {config.margins.left}px">
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          class="search-input"
          bind:value={searchTerm}
          on:input={() => searchItem(searchTerm)}
        />
      </div>
      <div class="bars">
        {#each selectedMetrics as metric, i}
          <div class="bar-section">
            {#if searchResult}
              <Bar
                percentage={metric.getValue(searchResult)}
                color={config.colors[i]}
                height={config.barHeight}
              />
            {:else}
              <div class="empty-bar" style="height: {config.barHeight}px;" />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="separator" />
    
    {#each chartData as row}
      <BarRow {row} {config} />
    {/each}
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
    font-weight: bold;
  }

  .header-icons {
    display: flex;
    align-items: center;
  }

  .sort-icon,
  .dropdown-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
  }

  .dropdown-icon {
    margin-left: 4px;
    cursor: pointer;
  }
  
  .rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0.5rem;
    right: 1.5rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 10;
    font-size: 0.9rem;
    font-weight: normal;
  }

  .dropdown-item {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .dropdown-item:first-child {
    border-radius: 4px 4px 0 0;
  }

  .dropdown-item:last-child {
    border-radius: 0 0 4px 4px;
  }

  .dropdown-item:hover {
    background-color: rgba(0,0,0,0.05);
  }

  .search-input {
    width: 90%;
    height: 100%;
    padding: 0 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #666;
  }

  .empty-bar {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f5f5f5;
  }

  .search-row {
    display: flex;
    align-items: center;
  }

  .search-row .bars {
    display: flex;
    flex: 1;
    height: 100%;
  }

  .search-row .bar-section {
    flex: 1;
    padding-right: 1rem;
  }

  .separator {
    height: 1px;
    background-color: #ddd;
    margin: 1rem 0;
    width: 100%;
  }

  .sort-icon {
    margin-right: 4px;
    display: flex;
    align-items: center;
  }
</style>
