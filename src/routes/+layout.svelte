<script>
	import favicon from '$lib/images/favicon.ico';
	import IdleTimeout from '$lib/components/IdleTimeout.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	let { children, data } = $props();

	onMount(() => {
		if (!data?.supabase) return;

		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data?.supabase && data?.user}
	<IdleTimeout supabase={data.supabase} user={data.user} />
{/if}

{@render children()}