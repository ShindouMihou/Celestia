<script lang="ts">
    import Document from "$lib/components/document.svelte";
    import Loader from "$lib/components/loaders/loader.svelte";
    import { onMount } from "svelte";
    import axios, { type AxiosResponse } from 'axios';
    import { fade } from "svelte/transition";
    import decoder from '$lib/decoder'
    import { catchAxiosError, reportTelemetry } from "$lib/telemetry";
    import { UrlManipulator } from '$lib/url'
    import { Icon, LightningBolt, QuestionMarkCircle } from "svelte-hero-icons";

    let glassboxes: any[];
    let glassbox: string;
    let next: string;
    let loading: boolean = false
    let scroller;
    let documents: any[];
    let url: UrlManipulator;
    let page = 0

    let destinationPage = 0

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

        scroller = new IntersectionObserver(async (entries) => {
            if (entries[0].intersectionRatio <= 0) return

            if (next) {
                if (loading) return

                loadMore()
            }
        })

        scroller.observe(document.querySelector('#__tunnelVision'))
    })

    function loadMoreUntilDestinationPage() {
        if (page < destinationPage) {
            loadMore(loadMoreUntilDestinationPage)
        }
    }

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
        loading = true
        glassbox = glassBoxName;
        page = 0;
        destinationPage = 0;


        documents = null;
        url.searchParams.delete('query')
        document.querySelector('#_filter').value = ''
        window.history.pushState({}, '', `/dashboard/${glassbox}`);
        url.searchParams.set('page', '0')

        load();
    }

    /**
     * Loads the data from the glassbox and allow Svelte to display the results 
     * into the page.
     */
    async function load() {        
        if (url.searchParams.get('query')) {
            document.querySelector('#_filter').value = atob(url.searchParams.get('query'))
            filter()
            return
        }

        loading = true
        return request(`/api/glassbox/${glassbox}`, (response) => {
            documents = response.data.data;
            next = response.data.next;

            if (url.searchParams.get('page')) {
                destinationPage = Number.parseInt(url.searchParams.get('page'))

                loadMore(loadMoreUntilDestinationPage)
            }
            loading = false
        }).then(() => document.querySelector('#documents').scrollIntoView({
            behavior: 'smooth'
        }));
    }

    /**
     * Loads more results of the current result, this requires the next variable 
     * to be instiated and of a non-faulty value.
     */
    async function loadMore(onFulfilled = () => {}) {
        if (next) {
            loading = true
            scroller.unobserve(document.querySelector('#__tunnelVision'))

            request(next, (response) => {
                documents = documents.concat(response.data.data);
                next = response.data.next;

                page += 1
                url.searchParams.set('page', page.toString())
                window.history.pushState({}, '', `/dashboard/${glassbox}${url.stringify(url.searchParams)}`);

                loading = false
                scroller.observe(document.querySelector('#__tunnelVision'))
                onFulfilled()
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
        loading = true
        if (!query.value) {
            url.searchParams.delete('query')
            window.history.pushState({}, '', `/dashboard/${glassbox}${url.stringify(url.searchParams)}`);

            load();
            return;
        }
        
        if (glassbox) {            
            request(`/api/glassbox/${glassbox}?json=${btoa(JSON.stringify(decoder(query)))}`, (response) => {
                documents = response.data.data;
                next = response.data.next;

                url.searchParams.set('query', btoa(JSON.stringify(decoder(query))))
                window.history.pushState({}, '', `/dashboard/${glassbox}${url.stringify(url.searchParams)}`);
                loading = false
            }).then(() => document.querySelector('#documents').scrollIntoView({
                behavior: 'smooth'
            }));
            return
        }

        loading = false
    }
</script>
<svelte:head>
    <title>Celestia | Dashboard</title>
</svelte:head>

<div class="py-12 flex flex-col gap-4 w-full max-w-[3168px] m-auto">
    <div class="rounded w-full border">
        <div class="flex flex-col p-3 gap-2">
            <div class="flex flex-row gap-1 items-center">
                <h2 class="text-lg font-bold">Filter</h2>
                <a href="https://github.com/ShindouMihou/Celestia/blob/master/documentations/filters.md" rel="external" target="_blank">
                    <Icon src={QuestionMarkCircle} class="h-4 w-4 hover:text-blue-500 duration-300"></Icon>
                </a>
            </div>
            <textarea class="p-4 text-md font-light bg-gray-100 rounded outline-none" placeholder="FIELD=VALUE" id="_filter"></textarea>
            <button class="cursor-pointer" on:click={filter} transition:fade>
                <div class="bg-slate-100 border text-black rounded p-2 flex flex-col hover:opacity-80 gap-4 lg:w-32">
                    <h3 class="font-medium ">Filter</h3>
                </div>
            </button>
        </div>
    </div>
    <div class="flex flex-col md:flex-row gap-4 w-full">
        <div class="rounded md:w-72 border">
            <div class="flex flex-col p-3 gap-4">
                <h2 class="text-lg font-bold">Glassboxes</h2>
                <div class="flex flex-col gap-1" id="glassboxes">
                    {#if glassboxes == null}
                        {#each { length: 5 } as _, i}
                        <Loader></Loader>
                        {/each}
                    {:else}
                        {#each glassboxes as item}
                        <div class="cursor-pointer h-full" on:click={move(item.name)} transition:fade>
                            <div class="component-box">
                                <h3 class="font-bold ">{item.name}</h3>
                                <p>{Intl.NumberFormat().format(item.count)} documents</p>
                            </div>
                        </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
        <div class="border rounded md:w-96 flex-grow">
            <div class="flex flex-col gap-4 p-4">
                <h2 class="text-lg font-bold">Documents</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-2" id="documents">
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
                <div id="__tunnelVision"/>
                {#if loading}
                <div class="w-full align-middle justify-center flex flex-row gap-4 m-auto py-6 animate-bounce">
                    <Icon src={LightningBolt} class="h-6 w-6" solid/>
                    <p>Loading...</p>
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>
