<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { supabase, user } = $props();

	const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
	const STORAGE_KEY = 'thehut_last_activity_at';

	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timeoutId;

	async function forceLogout() {
		clearTimeout(timeoutId);
		localStorage.removeItem(STORAGE_KEY);

		try {
			await supabase.auth.signOut();
		} catch (error) {
			console.error('Auto sign out failed:', error);
		}

		await goto('/staff/login?timeout=1', { replaceState: true });
	}

	function resetTimer() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			forceLogout();
		}, IDLE_TIMEOUT_MS);
	}

	function recordActivity() {
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
		resetTimer();
	}

	onMount(() => {
		if (!user || !supabase) {
			localStorage.removeItem(STORAGE_KEY);
			return;
		}

		const lastActivity = Number(localStorage.getItem(STORAGE_KEY) || 0);

		if (lastActivity && Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
			forceLogout();
			return;
		}

		const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

		const handleActivity = () => {
			recordActivity();
		};

		events.forEach((eventName) => {
			window.addEventListener(eventName, handleActivity, { passive: true });
		});

		window.addEventListener('focus', handleActivity);

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				handleActivity();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		recordActivity();

		return () => {
			clearTimeout(timeoutId);

			events.forEach((eventName) => {
				window.removeEventListener(eventName, handleActivity);
			});

			window.removeEventListener('focus', handleActivity);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>