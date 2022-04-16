<script>
    import Document from "$lib/components/document.svelte";
    import Glassbox from "$lib/components/glassbox.svelte";
    import GlassboxLoader from "$lib/components/loaders/glassbox_loader.svelte";

    let glassboxes;
    let glassbox;
    let documents;
</script>
<div class="py-12 flex flex-col md:flex-row gap-4 w-full">
    <div class="bg-white rounded md:w-72 drop-shadow-md">
        <div class="flex flex-col p-3 gap-4">
            <h2 class="text-lg font-bold">Glassboxes</h2>
            <div class="flex flex-col gap-1" id="$glassboxes">
                {#if glassboxes == null}
                    {#each { length: 5 } as _, i}
                    <GlassboxLoader></GlassboxLoader>
                    {/each}
                {:else}
                    {#each glassboxes as item}
                    <Glassbox name={item.name} count={item.count}></Glassbox>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
    <div class="bg-white rounded drop-shadow-md md:w-96 flex-grow">
        <div class="flex flex-col gap-4 p-4">
            <h2 class="text-lg font-bold">Documents</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2" id="$glassboxes">
                {#if documents == null}
                    {#each { length: 5 } as _, i}
                    <GlassboxLoader></GlassboxLoader>
                    {/each}
                {:else}
                    {#each documents as item}
                    <Document glassbox="{glassbox}" event="{item._event}" id="{item._id}" date="{item._date}"></Document>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>