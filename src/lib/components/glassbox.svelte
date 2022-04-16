<script>
    export let name;
    export let count;
</script>
<a href="/dashboard/{encodeURI(name)}">
    <div class="bg-black text-white rounded p-4 flex flex-col hover:opacity-80 gap-4">
        <h3 class="font-bold ">{name}</h3>
        <p>{Intl.NumberFormat().format(count)} documents</p>
    </div>
</a>