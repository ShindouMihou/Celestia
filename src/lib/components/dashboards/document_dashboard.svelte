<script>
    import Document from "$lib/components/document.svelte";
    import Loader from "$lib/components/loaders/loader.svelte";
    import { onMount } from "svelte";
    import axios from 'axios';
    import { fade } from "svelte/transition";
    import { catchAxiosError, reportTelemetry } from "$lib/telemetry";
    import { UrlManipulator } from "$lib/url";

    let glassbox = '...';
    let _id = '...';

    let documents;
    let document;

    const reserved = ["_id", "_message", "_event", "_date"];
    let url;
    
    onMount(async () => {
        url = new UrlManipulator(window);
        if (!(url.get(2) && url.get(3))) setTimeout(() => window.location.href = '/dashboard', 1500);

        glassbox = url.get(2);
        _id = url.get(3);

        axios
            .get(`/api/glassbox/${glassbox}/?last=${_id}&limit=5`)
            .then(response =>  documents = response.data.data)
            .catch(err => catchAxiosError(window, err));
       
        axios
            .get(`/api/glassbox/${glassbox}/${_id}`).then(response => {
                document = response.data;

                if (!document) {
                    reportTelemetry(window, response, 1);
                    setTimeout(() => window.location.reload(), 1500);
                }
            }).catch(err => catchAxiosError(window, err));
    });

    function extras() {
        return Object.entries(document).filter(([key, value]) => {
           return !reserved.includes(key) 
        });
    }
</script>
<svelte:head>
    <title>Celestia | {_id}</title>
</svelte:head>

<div class="py-12 flex flex-col-reverse md:flex-row gap-4 w-full max-w-[3168px] m-auto">
    <div class="bg-white rounded md:w-72 drop-shadow-md">
        <div class="flex flex-col p-3 gap-4">
            <h2 class="text-lg font-bold break-words">{glassbox}</h2>
            <div class="flex flex-col gap-1" id="glassboxes">
                {#if documents == null}
                    {#each { length: 5 } as _, i}
                    <Loader></Loader>
                    {/each}
                {:else}
                    {#each documents as item}
                    <Document glassbox="{glassbox}" event="{item._event}" id="{item._id}" date="{item._date}"></Document>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
    <div class="bg-white rounded drop-shadow-md md:w-96 flex-grow">
        <div class="flex flex-col gap-4 p-4">
            {#if document == null}
            <div class="w-full h-full bg-gray-100 animate-pulse p-32"></div>
            {:else}
            <div class="flex flex-col gap-2" id="document[base]">
                <div class="flex flex-col gap-2" id="document[head]">
                    <div>
                        <h2 class="text-lg font-bold break-words">{document._id}</h2>
                        <p class="text-md font-medium break-words">{document._event} • {new Date(document._date).toString()}</p>
                    </div>
                </div>
                {#if document._message}
                <div class="bg-gray-100 rounded p-4">
                    <p class="break-words">{document._message}</p>
                </div>
                {/if}
                <div class="flex flex-row gap-4 flex-wrap">
                    {#each extras() as item}
                    <div class="bg-gray-100 rounded p-4">
                        <h3 class="text-md font-bold uppercase break-words">{item[0]}</h3>
                        <p class="text-md font-light break-words">{item[1]}</p>
                    </div>
                    {/each}
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>