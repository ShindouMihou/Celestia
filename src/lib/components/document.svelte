<script>
    import { fade } from "svelte/transition";
    export let glassbox;
    export let id;
    export let event;
    export let date;

    const _date = new Date(date)
</script>
<a href="/dashboard/{encodeURI(glassbox)}/{encodeURI(id)}" class="h-full" rel="external" transition:fade>
    <div class="bg-black w-full h-full text-white rounded p-4 flex flex-col gap-4 hover:opacity-80">
        <div>
            <h3 class="font-bold uppercase break-words">{id}</h3>
            <p class="font-medium uppercase break-words">{event}</p>
        </div>
        <p class="uppercase font-light break-words">{_date.toLocaleString('en-US', { dateStyle: "long" })} {_date.toLocaleTimeString('en-US', { timeStyle: 'medium' })}</p>
    </div>
</a>