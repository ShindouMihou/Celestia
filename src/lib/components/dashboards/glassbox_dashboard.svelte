<script lang="ts">
    import Document from "$lib/components/document.svelte";
    import Loader from "$lib/components/loaders/loader.svelte";
    import { onMount } from "svelte";
    import axios, { type AxiosResponse } from 'axios';
    import { fade } from "svelte/transition";
    import decoder from '$lib/decoder'
    import { catchAxiosError, reportTelemetry } from "$lib/telemetry";
    import { UrlManipulator } from '$lib/url'

    let glassboxes: any[];
    let glassbox: string;
    let next: string;
    let documents: any[];
    let url;

    onMount(async () => {
        url =  new UrlManipulator(window);
        axios.get('/api/glassboxes')
            .then(response => glassboxes = response.data)
            .catch(err => catchAxiosError(window, err));

        url.ifPresent(2, (value: string) => glassbox = value);

        if (!glassbox) {
            documents = [];
            return;
        }

        load();
    })

    /**
     * Performs a GET request to the specified URI and performs the given function if the 
     * request is fulfilled otherwise catches the error and passes into telemetry.
     * 
     * @param uri   The URI resource to request.
     * @param onFulfilled   The function to perform on successful.
     */
    async function request(uri: string, onFulfilled: (value: AxiosResponse<any, any>) => any) {
        return axios.get(uri)
            .then(value => onFulfilled(value))
            .catch(err => catchAxiosError(window, err));
    }

    /**
     * Transitions into the given glassbox.
     * 
     * @param glassBoxName  The name of the glassbox to move into.
     */
    async function move(glassBoxName) {
        glassbox = glassBoxName;
        documents = null;
        window.history.pushState({}, '', `/dashboard/${glassbox}`);

        load();
    }

    /**
     * Loads the data from the glassbox and allow Svelte to display the results 
     * into the page.
     */
    async function load() {
        return request(`/api/${glassbox}`, (response) => {
            documents = response.data.data;
            next = response.data.next;
        }).then(() => document.querySelector('#documents').scrollIntoView({
            behavior: 'smooth'
        }));
    }

    /**
     * Loads more results of the current result, this requires the next variable 
     * to be instiated and of a non-faulty value.
     */
    async function loadMore() {
        if (next) {
            request(next, (response) => {
                documents = documents.concat(response.data.data);
                next = response.data.next;
            });
        }
    }

    /**
     * Loads the results of the glassbox with a specific query given to filter out the results. 
     * This method accepts JSON and the simple Celebi-decoded which is a little modified variant of Dotenv files.
     * - You can use Number(value) as a value to a property to translate the value into a number.
     * - You can use Date(value) as a value to a property to translate the value into a date.
     * - Those decoders are case-sensitive.
     */
    async function filter() {
        const query = document.querySelector('#_filter');
        if (!query.value) {
            load();
            return;
        }
        
        if (glassbox) {
            request(`/api/${glassbox}?json=${btoa(JSON.stringify(decoder(query)))}`, (response) => {
                documents = response.data.data;
                next = response.data.next;
            }).then(() => document.querySelector('#documents').scrollIntoView({
                behavior: 'smooth'
            }));
        }
    }
</script>
<svelte:head>
    <title>Celestia | Dashboard</title>
</svelte:head>

<div class="py-12 flex flex-col gap-4 w-full max-w-[3168px] m-auto">
    <div class="bg-white rounded w-full drop-shadow-md">
        <div class="flex flex-col p-3 gap-2">
            <h2 class="text-lg font-bold">Filter</h2>
            <textarea class="p-4 text-md font-light bg-gray-100 rounded outline-none" placeholder="FIELD=VALUE" id="_filter"></textarea>
            <button class="cursor-pointer" on:click={filter} transition:fade>
                <div class="bg-black text-white rounded p-2 flex flex-col hover:opacity-80 gap-4 lg:w-32">
                    <h3 class="font-bold ">Filter</h3>
                </div>
            </button>
        </div>
    </div>
    <div class="flex flex-col md:flex-row gap-4 w-full">
        <div class="bg-white rounded md:w-72 drop-shadow-md">
            <div class="flex flex-col p-3 gap-4">
                <h2 class="text-lg font-bold">Glassboxes</h2>
                <div class="flex flex-col gap-1" id="glassboxes">
                    {#if glassboxes == null}
                        {#each { length: 5 } as _, i}
                        <Loader></Loader>
                        {/each}
                    {:else}
                        {#each glassboxes as item}
                        <div class="cursor-pointer" on:click={move(item.name)} transition:fade>
                            <div class="bg-black text-white rounded p-4 flex flex-col hover:opacity-80 gap-4">
                                <h3 class="font-bold ">{item.name}</h3>
                                <p>{Intl.NumberFormat().format(item.count)} documents</p>
                            </div>
                        </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
        <div class="bg-white rounded drop-shadow-md md:w-96 flex-grow">
            <div class="flex flex-col gap-4 p-4">
                <h2 class="text-lg font-bold">Documents</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2" id="documents">
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
                {#if next != null}
                    <button class="cursor-pointer" on:click={loadMore} transition:fade>
                        <div class="bg-black text-white rounded p-4 flex flex-col hover:opacity-80 gap-4 lg:w-32">
                            <h3 class="font-bold ">Load More</h3>
                        </div>
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>