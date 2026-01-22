<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let isRevealed = false;
  
  const dispatch = createEventDispatcher();
  
  let canvas;
  let ctx;
  let isDrawing = false;
  let scratchCount = 0;
  let hasTriggeredReveal = false;
  
  const SCRATCHES_TO_REVEAL = 2; // Number of scratches needed to reveal

  onMount(() => {
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    initScratchLayer();
    
    return () => {
      // Cleanup
    };
  });

  function initScratchLayer() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Create gradient scratch layer
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#2d3748');
    gradient.addColorStop(0.5, '#4a5568');
    gradient.addColorStop(1, '#2d3748');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Add texture pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < rect.width; i += 4) {
      for (let j = 0; j < rect.height; j += 4) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }
    
    // Add scratch instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE ✨', rect.width / 2, rect.height / 2 - 10);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px Outfit, sans-serif';
    ctx.fillText('Reveal your exclusive offer', rect.width / 2, rect.height / 2 + 15);
    
    // Draw decorative coins
    drawCoin(30, 30, 15);
    drawCoin(rect.width - 30, 30, 12);
    drawCoin(30, rect.height - 30, 12);
    drawCoin(rect.width - 30, rect.height - 30, 15);
  }

  function drawCoin(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(e) {
    if (!isDrawing || isRevealed) return;
    
    const pos = getPosition(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  function revealCard() {
    // Animate the remaining scratch off
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    dispatch('reveal');
  }

  function startDrawing(e) {
    if (isRevealed || hasTriggeredReveal) return;
    isDrawing = true;
    scratchCount++;
    scratch(e);
    
    // Check if we've reached the scratch threshold
    if (scratchCount >= SCRATCHES_TO_REVEAL && !hasTriggeredReveal) {
      hasTriggeredReveal = true;
      // Small delay to let the user see their last scratch before revealing
      setTimeout(() => {
        revealCard();
      }, 300);
    }
  }

  function stopDrawing() {
    isDrawing = false;
  }
</script>

<div class="scratch-card-container">
  <!-- Coupon underneath (always visible, covered by canvas) -->
  <div class="coupon" class:revealed={isRevealed}>
    <!-- Coupon Left Side -->
    <div class="coupon-left">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24" fill="currentColor" class="nike-swoosh">
          <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.197.597.292.968.292.556 0 1.193-.183 1.886-.543L21 8.719z"/>
        </svg>
      </div>
      <div class="discount-text">
        <span class="discount-amount">10%</span>
        <span class="discount-label">OFF</span>
      </div>
    </div>
    
    <!-- Coupon Divider -->
    <div class="coupon-divider">
      <div class="divider-line"></div>
    </div>
    
    <!-- Coupon Right Side -->
    <div class="coupon-right">
      <div class="offer-details">
        <h3 class="offer-title">Nike Store</h3>
        <p class="offer-description">On your next purchase</p>
        <div class="coupon-code">
          <span class="code-label">CODE:</span>
          <span class="code-value">NIKE10OFF</span>
        </div>
      </div>
      <div class="validity">
        Valid till Dec 31, 2026
      </div>
    </div>
    
    <!-- Decorative elements -->
    <div class="punch-hole left"></div>
    <div class="punch-hole right"></div>
  </div>

  <!-- Scratch layer canvas -->
  {#if !isRevealed}
    <canvas
      bind:this={canvas}
      class="scratch-canvas"
      on:mousedown={startDrawing}
      on:mousemove={scratch}
      on:mouseup={stopDrawing}
      on:mouseleave={stopDrawing}
      on:touchstart|preventDefault={startDrawing}
      on:touchmove|preventDefault={scratch}
      on:touchend={stopDrawing}
    ></canvas>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

  .scratch-card-container {
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .coupon {
    position: absolute;
    inset: 0;
    display: flex;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    font-family: 'Outfit', sans-serif;
    transition: transform 0.5s ease;
  }

  .coupon.revealed {
    animation: reveal-bounce 0.5s ease;
  }

  @keyframes reveal-bounce {
    0% { transform: scale(0.95); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .coupon-left {
    flex: 0 0 35%;
    background: linear-gradient(145deg, #111111 0%, #1a1a1a 50%, #0d0d0d 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
  }

  .coupon-left::after {
    content: '';
    position: absolute;
    top: 10%;
    right: 0;
    bottom: 10%;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
  }

  .brand-logo {
    margin-bottom: 8px;
  }

  .nike-swoosh {
    width: 48px;
    height: 48px;
    color: #ffffff;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .discount-text {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .discount-amount {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }

  .discount-label {
    font-size: 14px;
    font-weight: 700;
    color: #FF6B35;
    letter-spacing: 1px;
  }

  .coupon-divider {
    position: relative;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divider-line {
    width: 2px;
    height: 80%;
    background: repeating-linear-gradient(
      to bottom,
      #e0e0e0,
      #e0e0e0 8px,
      transparent 8px,
      transparent 16px
    );
  }

  .coupon-right {
    flex: 1;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .offer-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .offer-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111111;
    letter-spacing: -0.3px;
  }

  .offer-description {
    margin: 0;
    font-size: 13px;
    color: #666666;
    font-weight: 400;
  }

  .coupon-code {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    border-radius: 6px;
    width: fit-content;
  }

  .code-label {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 0.5px;
  }

  .code-value {
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }

  .validity {
    font-size: 11px;
    color: #999999;
    font-weight: 500;
  }

  .punch-hole {
    position: absolute;
    width: 24px;
    height: 24px;
    background: #1a1a2e;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
  }

  .punch-hole.left {
    left: -12px;
    box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.2);
  }

  .punch-hole.right {
    right: -12px;
    box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.2);
  }

  .scratch-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    touch-action: none;
  }
</style>

