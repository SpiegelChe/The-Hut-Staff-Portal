<svelte:options runes={false} />

<script>
	export let currentKey = '';

	let sidebarCollapsed = false;

	const menuItems = [
		{ key: 'attendance', label: 'Tick Attendance', short: '✓', color: '#22c55e', href: '/staff/attendance' },
		{ key: 'participants', label: 'Add Participant', short: '+', color: '#3b82f6', href: '/staff/participants' },
		{ key: 'programs', label: 'Browse Program', short: 'P', color: '#a855f7', href: '/staff/programs' },
		{ key: 'search', label: 'Find Participant', short: '⌕', color: '#f97316', href: '/staff/search' },
		{ key: 'reports', label: 'View Reports', short: '▥', color: '#14b8a6', href: '/staff/reports' },
		{ key: 'training', label: 'Start Training', short: 'i', color: '#64748b', href: '/staff/training' }
	];

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<aside class:collapsed={sidebarCollapsed} class="sidebar">
	<div class="sidebar-top">
		<button class="collapse-btn" type="button" on:click={toggleSidebar}>
			{#if sidebarCollapsed}›{:else}‹{/if}
		</button>
	</div>

	<nav class="menu">
		{#each menuItems as item}
			<a
				class="menu-item"
				class:active={currentKey === item.key}
				href={item.href}
				style={`--item-color: ${item.color};`}
			>
				<div class="menu-icon">{item.short}</div>
				{#if !sidebarCollapsed}
					<div class="menu-text">{item.label}</div>
				{/if}
			</a>
		{/each}
	</nav>
</aside>

<style>
	.sidebar {
		width: 250px;
		background: #ffffff;
		border-right: 1px solid #d9d9d9;
		padding: 22px 16px;
		box-sizing: border-box;
		transition: width 0.25s ease, padding 0.25s ease;
		flex-shrink: 0;
	}

	.sidebar.collapsed {
		width: 90px;
		padding: 22px 10px;
	}

	.sidebar-top {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 18px;
	}

	.collapse-btn {
		width: 36px;
		height: 36px;
		border: 1px solid #d9d9d9;
		border-radius: 12px;
		background: #ffffff;
		color: #152238;
		font-size: 22px;
		cursor: pointer;
	}

	.collapse-btn:hover {
		background: #f9fafb;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px;
		border-radius: 18px;
		text-decoration: none;
		color: #152238;
		border: 1px solid #d9d9d9;
		background: #ffffff;
		transition: 0.2s ease;
	}

	.menu-item:hover {
		background: #f9fafb;
	}

	.menu-item.active {
		border-color: var(--item-color);
		background: color-mix(in srgb, var(--item-color) 10%, white);
	}

	.menu-icon {
		width: 48px;
		height: 48px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--item-color);
		color: #ffffff;
		font-size: 28px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.menu-text {
		font-size: 18px;
		font-weight: 700;
		line-height: 1.2;
	}

	.sidebar.collapsed .menu-item {
		justify-content: center;
		padding: 10px;
	}

	@media (max-width: 900px) {
		.sidebar {
			width: 90px;
			padding: 22px 10px;
		}

		.menu-item {
			justify-content: center;
			padding: 10px;
		}

		.menu-text {
			display: none;
		}
	}
</style>