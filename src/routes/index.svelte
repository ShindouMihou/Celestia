<script>
    import Header from "$lib/components/header.svelte";
</script>

<div class="w-full p-4">
    <Header></Header>
    <div class="py-32 flex flex-col w-full min-h-screen bg-white rounded drop-shadow-md">
        <div id="_hero1" class="m-auto">
            <img src="/hero1.gif" class="m-auto" alt="Floating Books (by Storyset)"/>
            <div class="flex flex-col gap-6">
                <h2 class="text-5xl font-bold">Simplify the viewing <span class="text-slate-600">experience.</span></h2>
                <p class="text-xl font-light max-w-[720px]">A simple logging client that makes viewing through categorized logs neater, without the need for a complicated tech stack.</p>
            </div>
        </div>
    </div>
</div>