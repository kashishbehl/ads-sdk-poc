// First import the component
import YourComponent from './YourComponent.svelte';

// Then create the components object
const components = {
  YourComponent
};

// Export both named and default exports
export { YourComponent };
export default components;

// You can add more component exports as needed
// export { default as AnotherComponent } from './AnotherComponent.svelte'; 