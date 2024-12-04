<script>
    import ScrollSection from './ScrollSection.svelte';
    let { currentStep } = $props();
</script>
  
  <div class="scroll-panel">
    <div class="scroll-content">
      <ScrollSection 
        title="The Shape of Slavery" 
        authors={{
          data: "Bill Rankin",
          story: "Matt Daniels"
        }}
        {currentStep} 
      />
    </div>
  </div>
  
  <style>
    .scroll-panel {
      position: absolute;
      right: 0;
      top: 0;
      width: 25%;
      min-height: 100vh;
      background-color: white;
      padding: 2rem;
    }
  
    .scroll-content {
      max-width: 600px;
      margin: 0 auto;
    }
  </style>