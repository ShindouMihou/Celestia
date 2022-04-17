<script>
  import "../app.css";
  import Header from "$lib/components/header.svelte";
  import Github from "$lib/components/icons/github.svelte";
</script>

<div class="w-full p-4">
  <Header>
    <a href="https://github.com/ShindouMihou/Celestia">
      <Github class="h-6 w-6 hover:text-blue-500 duration-300"></Github>
    </a>
  </Header>
  <slot />
</div>