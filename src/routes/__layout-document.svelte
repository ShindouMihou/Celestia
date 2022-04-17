<script>
    import "../app.css";
    import Header from "$lib/components/header.svelte";
    import {ChevronLeft, CubeTransparent, Icon} from 'svelte-hero-icons';

    function history() {
        window.history.back();
    }

    function glassbox() {
        window.location.href = "/dashboard/" + window.location.pathname.split('/')[2];
    }
</script>

<div class="w-full p-4">
    <Header>
        <button class="cursor-pointer" on:click={history}>
            <Icon src={ChevronLeft} class="h-6 w-6 hover:text-blue-500 duration-300"></Icon>
        </button>
        <button class="cursor-pointer" on:click={glassbox}>
            <Icon src={CubeTransparent} class="h-6 w-6 hover:text-blue-500 duration-300"></Icon>
        </button>
    </Header>
    <slot/>
</div>