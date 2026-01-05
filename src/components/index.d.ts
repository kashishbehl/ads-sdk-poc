import { SvelteComponentTyped } from 'svelte';

export class YourComponent extends SvelteComponentTyped<{
  title?: string;
  content?: string;
}> {} 