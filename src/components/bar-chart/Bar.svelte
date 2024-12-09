<script>
    export let percentage = 0;
    export let color = "#333333";
    export let height = 20;
    
    $: safePercentage = Math.max(0, Math.min(100, percentage));
    $: isFull = safePercentage === 100;
    $: formattedPercentage = safePercentage.toFixed(1);
</script>

<div class="bar-container" style="height: {height}px;">
  <div 
    class="bar-fill"
    class:full={isFull}
    style="
      width: {safePercentage}%; 
      background-color: {color};
      height: {height}px;
    "
  />
  <div 
    class="bar-outline" 
    style="
      height: {height}px;
    "
  />
  <div class="percentage-label">
    {formattedPercentage}%
  </div>
</div>

<style>
  .bar-container {
    position: relative;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    position: absolute;
    left: 0;
    top: 0;
    transition: width 0.3s ease;
    border-radius: 4px 0 0 4px;
  }

  .bar-fill.full {
    border-radius: 4px;
  }

  .bar-outline {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .percentage-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-weight: bold;
  }
</style>