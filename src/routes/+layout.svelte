<script>
    import "../app.css";
    import PreLoad from "$lib/preload.svelte";

    let { children } = $props();
</script>

<PreLoad />
{@render children()}
