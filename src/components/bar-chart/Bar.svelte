<script>
    export let percentage = 0;
    export let color = "#000000";
    export let height = 20;
</script>

<div class="bar-container" style="height: {height}px;">
  <div 
    class="percentage-bar filled"
    style="
      width: {percentage}%;
      background-color: {color};
      height: {height}px;
    "
  >
    {#if percentage > 5}
      <span class="percentage-label">{Math.round(percentage)}%</span>
    {/if}
  </div>
  <div 
    class="percentage-bar empty"
    style="
      width: {100 - percentage}%;
      height: {height}px;
    "
  />
</div>

<style>
  .bar-container {
    display: flex;
    width: 100%;
    margin-right: 1rem;
    border: 1px solid #000;
  }

  .percentage-bar {
    position: relative;
    transition: opacity 0.2s ease;
  }

  .filled {
    border-right: 1px solid #000;
  }

  .empty {
    background-color: transparent;
  }

  .percentage-label {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    color: #fff;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
</style>