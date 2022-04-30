<script>
    export let glassbox;
    export let id;
    export let event;
    export let date;

    const _date = new Date(date)
</script>
<a href="/dashboard/{encodeURI(glassbox)}/{encodeURI(id)}" class="h-full" rel="external">
    <div class="component-box">
        <div>
            <h3 class="font-bold uppercase break-words hidden">{id}</h3>
            <p class="font-medium uppercase break-words">{event}</p>
        </div>
        <p class="font-light break-words">{_date.toLocaleString('en-US', { dateStyle: "long" })} {_date.toLocaleTimeString('en-US', { timeStyle: 'medium' })}</p>
    </div>
</a>