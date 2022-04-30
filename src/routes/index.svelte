<script>
import Header from "$lib/components/header.svelte";
import Github from "$lib/components/icons/github.svelte";

import { Icon, Globe } from "svelte-hero-icons";

</script>
<div class="py-32 px-4 flex flex-col w-full min-h-screen rounded">
    <div id="hero" class="m-auto">
        <div class="flex flex-col gap-6">
            <h2 class="text-5xl font-bold">Hello.</h2>
            <div class="flex flex-col gap-4">
                <p class="text-xl font-light max-w-4xl">
                    If you are part of the people authorized to use this instance, contact your administrator 
                    for guidelines to access the dashboard otherwise consult the documentations from our GitHub.
                </p>
                <p class="font-light">Celestia { new Date().getFullYear() }</p>
            </div>
            <div class="flex flex-row gap-4 items-center">
                <a href="https://github.com/ShindouMihou/Celestia">
                    <Github class="h-6 w-6 hover:text-blue-500 duration-300"></Github>
                </a>
            </div>
        </div>
    </div>
</div>