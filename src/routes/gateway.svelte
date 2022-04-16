<script>
    import Header from "$lib/components/header.svelte";
</script>

<div class="w-full p-4">
    <Header></Header>
    <div class="py-12 flex flex-col gap-4 w-full">
        <div class="bg-white border-red-600 border-2 rounded drop-shadow-md">
            <div class="flex flex-col p-3">
                <h2 class="text-lg font-bold">Private Gateway</h2>
                <p class="text-md font-light">
                    To access this instance of Celestia, please contact your administrator for an access token that 
                    you can use to authenticate.
                </p>
            </div>
        </div>
        <div class="bg-white rounded drop-shadow-md flex-grow">
            <div class="flex flex-col gap-2 p-4">
                <input 
                    type="text" 
                    class="border-2 p-3 hover:border-blue-500 focus:bg-black focus:text-white focus:border-blue-600 duration-500 outline-none"
                    placeholder="Access Token"
                />
                <button class="p-2 border hover:bg-black hover:text-white duration-500 md:w-36">Authenticate</button>
            </div>
        </div>
    </div>
</div>