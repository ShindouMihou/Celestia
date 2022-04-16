<script lang="ts">
    import axios from 'axios';

    let error;

    async function authenticate() {
        try {
            const token = document.querySelector('#token').value;

            const response = await axios.post('/api/auth', { token: token });

            setTimeout(() => window.location.href = '/dashboard', 1000)
        } catch (svelteCuteError) {
            if (svelteCuteError.response) {
                console.log(svelteCuteError.response)
                error = svelteCuteError.response.data.errors[0];
            } else {
                console.log(svelteCuteError)
                error = "I don't know as well, may want to check console?";
            }
        }
    }
</script>

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
            {#if error}
            <div class="bg-white border-red-600 border-2 rounded drop-shadow-md">
                <div class="flex flex-col p-3">
                    <h2 class="text-lg font-bold">Something questionable happened.</h2>
                    <p class="text-md font-light">
                        {error}
                    </p>
                </div>
            </div>
            {/if}
            <input 
                class="border-2 p-3 hover:border-blue-500 focus:bg-black focus:text-white focus:border-blue-600 duration-500 outline-none"
                placeholder="Access Token"
                id="token"
            />
            <button class="p-2 border hover:bg-black hover:text-white duration-500 md:w-36" on:click={authenticate}>Authenticate</button>
        </div>
    </div>
</div>