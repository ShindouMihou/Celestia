<script lang="ts">
    import Document from "$lib/components/document.svelte";
    import GlassboxLoader from "$lib/components/loaders/glassbox_loader.svelte";
    import { onMount } from "svelte";
    import axios from 'axios';
    import { fade } from "svelte/transition";
    import decoder from '$lib/decoder'

    let glassboxes;
    let glassbox;
    let next;
    let documents: any[];

    onMount(async () => {
        axios.get('/api/glassboxes').then(response => {
            glassboxes = response.data;
        }).catch(err => {
            if (err.response) {
                switch(err.response.status) {
                    case 401: setTimeout(() => window.location.href = '/gateway', 1500);
                    case 500: {
                        console.error(err.response)
                    };
                }
            } else {
                console.error(err);
            }
        });

        if (window.location.pathname.split('/')[2]) {
            glassbox = window.location.pathname.split('/')[2];
        }

        if (!glassbox) {
            documents = [];
        } else {
            load();
        }
    })

    async function move(glassBoxName) {
        glassbox = glassBoxName;
        documents = null;
        window.history.pushState({}, '', `/dashboard/${glassbox}`);
        load();
    }

    async function load() {
        axios.get(`/api/${glassbox}`).then(response => {
            documents = response.data.data;
            next = response.data.next;
        }).catch(err => {
            if (err.response) {
                switch(err.response.status) {
                    case 401: setTimeout(() => window.location.href = '/gateway', 1500);
                    case 500: {
                        console.error(err.response)
                    };
                }
            } else {
                console.error(err);
            }
        });
    }

    async function loadMore() {
        if (next) {
            axios.get(`${next}`).then(response => {
                documents = documents.concat(response.data.data);
                next = response.data.next;
            }).catch(err => {
                if (err.response) {
                    switch(err.response.status) {
                        case 401: setTimeout(() => window.location.href = '/gateway', 1500);
                        case 500: {
                            console.error(err.response)
                        };
                    }
                } else {
                    console.error(err);
                }
            });
        }
    }

    async function filter() {
        if (glassbox) {
            axios.get(`/api/${glassbox}?json=${btoa(JSON.stringify(decoder(document.querySelector('#_filter'))))}`).then(response => {
            documents = response.data.data;
            next = response.data.next;
        }).catch(err => {
            if (err.response) {
                switch(err.response.status) {
                    case 401: setTimeout(() => window.location.href = '/gateway', 1500);
                    case 500: {
                        console.error(err.response)
                    };
                }
            } else {
                console.error(err);
            }
        });
        }
    }
</script>
<svelte:head>
    <title>Celestia | Dashboard</title>
</svelte:head>

<div class="py-12 flex flex-col gap-4 w-full">
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
                        <GlassboxLoader></GlassboxLoader>
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
                        <GlassboxLoader></GlassboxLoader>
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