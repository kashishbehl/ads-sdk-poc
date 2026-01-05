<script>
  import rewardsUnlocked from './assets/rewards_unlocked.png';
  import OfferCard from './OfferCard.svelte';
  import claimBtn from './assets/claim.png';

  let isExpanded = false;
  // export let title = 'Free Swiggy Coupon! 🎉';
</script>

<div class="component">
  <img src={rewardsUnlocked} />
  <OfferCard
    isExpanded={isExpanded}
  />
  {#if isExpanded}
    <p class="disclaimer">Voucher details will be sent to you on Whatsapp </p>
  {:else}
    <button on:click={() => {
      isExpanded = true;
    }} class="claim-btn">
      <img src={claimBtn} />
    </button>
  {/if}
</div>

<style>
  .component {
    padding: 24px 24px;
    border-radius: 12px;
    background-color: hsla(155, 91%, 22%, 1);
    background-image: url('./assets/bg.svg');
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .claim-btn {
    background: none;
    border: none;
    cursor: pointer;
  }

  .disclaimer {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.48);
  }
</style> 