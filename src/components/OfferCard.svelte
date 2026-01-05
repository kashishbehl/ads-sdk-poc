<script lang='ts'>
  import zomatoLogo from './assets/zomato.png';

  export let isExpanded;
</script>

<div class="card">
  <div class="offer-card">
    <div class={`offer-card-container ${isExpanded ? 'expanded' : ''}`}>
      <img src={zomatoLogo} />
      <p class="offer-title">Get ₹100 off on your next Zomato order </p>
    </div>
    <div class={isExpanded ? 'pill-hidden' : 'pill'}>
      Only for new users
    </div>
    {#if isExpanded}
      <div class='expanded-details'>
        <ul>
          <li>Applicable on orders above ₹500</li>
          <li>Offer valid till 30th November 2031</li>
          <li>Only valid for new users</li>
        </ul>
        <div class="copy-code">
          <div>XJSL WISJ WP24 IWOE</div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .card {
    background-color: hsla(0, 0%, 100%, 1);
    border-radius: 12px;
  }
  .offer-card {
    padding: 12px;
    
    display: flex;
    align-items: center;
    flex-direction: column;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(226, 55, 68, 0.2));
  }

  .offer-card-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    transition: all 0.3s ease-in-out;
    gap: 8px;
  }

  .offer-card-container.expanded {
    flex-direction: row;
    gap: 12px;
  }
  
  .offer-title {
    color: hsla(212, 39%, 16%, 1);
    font-weight: 600;
    transition: all 0.3s ease-in-out;
  }

  img {
    transition: all 0.3s ease-in-out;
  }

  .pill {
    color: hsla(0, 0%, 0%, 1);
    font-size: 12px;
    background-color: hsla(356, 74%, 95%, 1);
    padding: 4px 12px;
    border-radius: 24px;
  }

  .pill-hidden {
    display: none;
  }

  .expanded-details {
    width: 100%;
  }

  .expanded-details li{
    color: rgba(0, 0, 0, 0.56);
    font-size: 12px;
    margin-bottom: 10px;
  }

  .copy-code {
    padding: 20px;
    color: rgba(25, 40, 57, 1);
    background: #fff;
    border-radius: 24px;
    font-weight: 600;
    font-size: 16px;
  }
</style>