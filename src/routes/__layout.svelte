<script>
  import "../app.css";
  import Header from "$lib/components/header.svelte";
</script>

<div class="w-full p-4">
  <Header></Header>
  <slot />
</div>