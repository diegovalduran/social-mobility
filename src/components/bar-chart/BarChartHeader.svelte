<script>
    export let activeMode = "COUNTY";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
  
    const modes = [
      { id: "COUNTY", label: "Counties" },
      { id: "COLLEGE", label: "Colleges" }
    ];
  
    function handleModeChange(mode) {
      activeMode = mode;
      dispatch("modeChange", mode);
    }
  </script>
  
  <div class="header">
    <div class="mode-toggles">
      {#each modes as mode}
        <button
          class="mode-button"
          class:active={activeMode === mode.id}
          on:click={() => handleModeChange(mode.id)}
        >
          {mode.label}
        </button>
      {/each}
    </div>
  </div>
  
  <style>
    .header {
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;
    }
  
    .mode-toggles {
      display: flex;
      gap: 1rem;
      background: #e0e0e0;
      padding: 0.5rem;
      border-radius: 2rem;
    }
  
    .mode-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 1.5rem;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      color: #333;
    }
  
    .mode-button:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  
    .mode-button.active {
      background: #007bff;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  </style>