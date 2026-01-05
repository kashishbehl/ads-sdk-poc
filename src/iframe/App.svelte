
<script>
  import { onMount } from 'svelte';
  import YourComponent from '../components/YourComponent.svelte';
  import { sendMessageToHost } from './utils'
  
  let visible = true;
  let containerElement;
  let handlerAvailable = false;
  let handlerFunction = null;

  // Function to send height to parent window
  function sendHeightToParent() {
    if (containerElement) {
      const height = containerElement.scrollHeight;
      // window.parent.postMessage({
      //   type: 'resize',
      //   height: height
      // }, '*');
      sendMessageToHost({
        type: 'resize',
        height: height
      });
    }
  }

  // Function to call the parent's handler function
  function callParentHandler(payload) {
    return new Promise((resolve, reject) => {
      if (!handlerAvailable) {
        reject(new Error('Handler not available'));
        return;
      }

      const requestId = `handler-${Date.now()}-${Math.random()}`;
      
      // Set up a one-time listener for the response
      const responseHandler = (event) => {
        if (event.data && event.data.requestId === requestId) {
          window.removeEventListener('message', responseHandler);
          
          if (event.data.type === 'handler-result') {
            resolve(event.data.result);
          } else if (event.data.type === 'handler-error') {
            reject(new Error(event.data.error));
          }
        }
      };
      
      window.addEventListener('message', responseHandler);
      
      // Send the request to parent
      window.parent.postMessage({
        type: 'call-handler',
        requestId: requestId,
        payload: payload
      }, '*');
      
      // Set a timeout to avoid hanging promises
      setTimeout(() => {
        window.removeEventListener('message', responseHandler);
        reject(new Error('Handler call timeout'));
      }, 5000);
    });
  }

  // Create the handler function that YourComponent can use
  handlerFunction = (payload) => {
    if (handlerAvailable) {
      return callParentHandler(payload);
    } else {
      console.warn('Handler not available yet');
      return Promise.reject(new Error('Handler not available'));
    }
  };

  // Message handler for communication with parent window
  function handleParentMessage(event) {
    if (event.data && event.data.type === 'handler-available') {
      handlerAvailable = true;
      console.log('Handler is now available from parent');
    }
  }

  onMount(() => {
    // Listen for messages from parent window
    window.addEventListener('message', handleParentMessage);
    
    // Send initial height
    setTimeout(sendHeightToParent, 100);

    // Create ResizeObserver to watch for content changes
    if (window.ResizeObserver && containerElement) {
      const resizeObserver = new ResizeObserver(() => {
        sendHeightToParent();
      });
      
      resizeObserver.observe(containerElement);
      
      // Cleanup function
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('message', handleParentMessage);
      };
    }

    // Fallback: Watch for DOM mutations
    const mutationObserver = new MutationObserver(() => {
      setTimeout(sendHeightToParent, 50);
    });

    if (containerElement) {
      mutationObserver.observe(containerElement, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Cleanup function
    return () => {
      mutationObserver.disconnect();
      window.removeEventListener('message', handleParentMessage);
    };
  });
</script> 

{#if visible}
  <div class="widget-container" bind:this={containerElement}>
    <YourComponent handler={handlerFunction} />
  </div>
{/if}

<style>
  .widget-container {
    font-family: Arial, sans-serif;
  }
</style>