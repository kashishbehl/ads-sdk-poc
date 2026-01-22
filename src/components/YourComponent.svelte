<script>
  import ScratchCard from './ScratchCard.svelte';
  import { sendMessageToHost } from '../iframe/utils.js';
  
  let isRevealed = false;
  let showConfetti = false;

  // Coupon data that will be sent to native app
  const couponData = {
    couponCode: 'NIKE10OFF',
    discount: '10%',
    brand: 'Nike',
    validTill: '2026-12-31',
    minPurchase: null
  };

  function handleReveal() {
    isRevealed = true;
    showConfetti = true;
    
    // Notify native app that coupon was revealed
    sendMessageToHost({
      type: 'COUPON_REVEALED',
      data: couponData
    });
    
    setTimeout(() => {
      showConfetti = false;
    }, 3000);
  }

  function handleBuyNow() {
    // Send message to Swift/RN native app
    sendMessageToHost({
      type: 'BUY_NOW_CLICKED',
      data: {
        ...couponData,
        action: 'navigate_to_store',
        timestamp: new Date().toISOString()
      }
    });
  }
</script>

<div class="scratch-widget">
  <!-- Header -->
  <div class="header">
    <div class="payment-badge">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#10B981"/>
        <path d="M8 12l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Payment Successful!</span>
    </div>
    <h1 class="title">You've unlocked a reward!</h1>
    <p class="subtitle">Scratch below to reveal your exclusive offer</p>
  </div>

  <!-- Scratch Card -->
  <ScratchCard on:reveal={handleReveal} {isRevealed} />

  <!-- Footer -->
  <div class="footer">
    {#if isRevealed}
      <p class="revealed-text">🎉 Coupon code sent to your registered email!</p>
      <button class="buy-now-btn" on:click={handleBuyNow}>
        <span class="btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </span>
        <span class="btn-text">Buy Now</span>
        <span class="btn-arrow">→</span>
      </button>
    {:else}
      <p class="hint-text">Use your finger or cursor to scratch</p>
    {/if}
  </div>

  <!-- Confetti Effect -->
  {#if showConfetti}
    <div class="confetti-container">
      {#each Array(50) as _, i}
        <div 
          class="confetti" 
          style="
            left: {Math.random() * 100}%;
            animation-delay: {Math.random() * 0.5}s;
            background-color: {['#FF6B35', '#F7931E', '#FFD23F', '#3D9970', '#FF4136', '#0074D9'][Math.floor(Math.random() * 6)]};
          "
        ></div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

  .scratch-widget {
    font-family: 'Outfit', sans-serif;
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    border-radius: 20px;
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .scratch-widget::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(247, 147, 30, 0.1) 0%, transparent 40%);
    pointer-events: none;
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  .payment-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 8px 16px;
    border-radius: 50px;
    margin-bottom: 16px;
  }

  .payment-badge span {
    color: #10B981;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .title {
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    margin: 0;
    font-weight: 400;
  }

  .footer {
    text-align: center;
    margin-top: 16px;
    position: relative;
    z-index: 1;
  }

  .hint-text {
    color: rgba(255, 255, 255, 0.4);
    font-size: 12px;
    margin: 0;
    animation: pulse 2s ease-in-out infinite;
  }

  .revealed-text {
    color: #10B981;
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 16px 0;
    animation: fadeInUp 0.5s ease-out;
  }

  .buy-now-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    border: none;
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 4px 15px rgba(255, 107, 53, 0.4),
      0 0 0 0 rgba(255, 107, 53, 0.5);
    animation: fadeInUp 0.5s ease-out 0.2s both;
    position: relative;
    overflow: hidden;
  }

  .buy-now-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  .buy-now-btn:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px rgba(255, 107, 53, 0.5),
      0 0 0 0 rgba(255, 107, 53, 0.5);
  }

  .buy-now-btn:hover::before {
    left: 100%;
  }

  .buy-now-btn:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 10px rgba(255, 107, 53, 0.4),
      0 0 0 0 rgba(255, 107, 53, 0.5);
  }

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-text {
    letter-spacing: 0.5px;
  }

  .btn-arrow {
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  .buy-now-btn:hover .btn-arrow {
    transform: translateX(4px);
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Confetti */
  .confetti-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 100;
  }

  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    top: -10px;
    animation: confetti-fall 3s ease-out forwards;
  }

  .confetti:nth-child(odd) {
    border-radius: 50%;
  }

  .confetti:nth-child(even) {
    border-radius: 2px;
    transform: rotate(45deg);
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(400px) rotate(720deg);
      opacity: 0;
    }
  }
</style>
