<script>
  let { title, authors, currentStep } = $props();
</script>

<article class="scroll-section">
  <h1>{title}</h1>
  
  <div class="credits">
    <div class="credit-line">
      Slavery Data/Mapping: <span class="author">{authors.data}</span>
    </div>
    <div class="credit-line">
      Code/Story: <span class="author">{authors.story}</span>
    </div>
  </div>

  <p class="stat-highlight">
    Of all the stats about US prisons, Louisiana's incarceration rate is among the most shocking. For every 100,000 residents, 868 are in state prison. That's 0.86% of Louisiana's population, or nearly 1 in 100 (the worst among all states).
  </p>

  <p>This is what people must mean by mass incarceration.</p>

  <p>
    Instead of debating drug reform or systemic police discrimination, we want to understand prison rates historically. Inspired by Ava DuVernay's documentary <em>13th</em>, we began with the idea that the South's approach to incarceration has its roots in slavery. Or more specifically, in the <em>Jim Crow</em> laws that targeted former slaves after the Civil War. These laws were eventually abolished, but we know that their legacy continues to the present day. Louisiana's tragic incarceration rate is just one example among many.
  </p>

  <p>
    To take this one step further, we wanted to take a geographic angle: how do historic incarceration rates differ between slave states (the Deep South) and non-slave states (the North)? Working with cartographer Bill Rankin, we dug up 150 years of census and incarceration data to find out.
  </p>

  <p>First, let's take a look at the data for slavery.</p>

  <div class="separator-container">
    <div class="separator"></div>
  </div>
</article>

<style>
  .scroll-section {
    font-family: Georgia, serif;
    line-height: 1.6;
    color: #333;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .credits {
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }

  .credit-line {
    margin-bottom: 0.25rem;
  }

  .author {
    text-decoration: underline;
  }

  .stat-highlight {
    font-size: 1.1rem;
    margin: 2rem 0;
    text-align: left;
  }

  p {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  em {
    font-style: italic;
  }

  .separator-container {
    display: flex;
    justify-content: center;
    margin: 3rem 0;
  }

  .separator {
    width: 150px;
    height: 4px;
    background-color: #4a4a4a;
    border-radius: 2px;
    opacity: 0.3;
  }
</style>