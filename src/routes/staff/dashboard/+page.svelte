<script>
	import Header from '$lib/components/Header.svelte';

	/** @typedef {import('./$types').PageData} PageData */
	/** @typedef {'program_coordinator' | 'data_entry' | 'manager' | 'administrator'} StaffRole */
	/** @typedef {'attendance' | 'participants' | 'programs' | 'search' | 'reports' | 'training'} CardKey */
	/**
	 * @typedef {{
	 *   key: CardKey,
	 *   className: string,
	 *   href: string,
	 *   title: string,
	 *   description: string
	 * }} DashboardCard
	 */

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	const firstName = $derived(data?.staff?.full_name?.split(' ')[0] || 'there');

	/** @type {DashboardCard[]} */
	const allCards = [
		{
			key: 'attendance',
			className: 'attendance',
			href: '/staff/attendance',
			title: 'Tick Attendance',
			description: 'Record attendance for ongoing program.'
		},
		{
			key: 'participants',
			className: 'add-participant',
			href: '/staff/participants',
			title: 'Add Participant',
			description: 'Register new participants or assign them into a program.'
		},
		{
			key: 'programs',
			className: 'add-program',
			href: '/staff/programs',
			title: 'Browse Program',
			description: 'Browse existing programs and view program details.'
		},
		{
			key: 'search',
			className: 'record',
			href: '/staff/search',
			title: 'Find Participant',
			description: 'Search and view participant records and history.'
		},
		{
			key: 'reports',
			className: 'report',
			href: '/staff/reports',
			title: 'View Reports',
			description: 'Browse attendance and program statistics.'
		},
		{
			key: 'training',
			className: 'training',
			href: '/staff/training',
			title: 'Start Training',
			description: 'Get to know how the system works.'
		}
	];

	/** @type {Record<StaffRole, CardKey[]>} */
	const allowedCardKeysByRole = {
		program_coordinator: ['attendance', 'participants', 'programs', 'training'],
		data_entry: ['participants', 'programs', 'search', 'training'],
		manager: ['attendance', 'participants', 'programs', 'search', 'reports', 'training'],
		administrator: ['attendance', 'participants', 'programs', 'search', 'reports', 'training']
	};

	const visibleCards = $derived.by(() => {
		/** @type {StaffRole | null} */
		const staffRole = data?.staff?.staff_role ?? null;

		if (!staffRole) return [];

		const allowedKeys = allowedCardKeysByRole[staffRole];
		return allCards.filter((card) => allowedKeys.includes(card.key));
	});
</script>

<svelte:head>
    <title>Staff Dashboard | The Hut Event Managing System</title>
    <meta name="description" content="Staff dashboard" />
</svelte:head>

<Header
    showLogout={true}
/>

<section class="dashboard-page">
    <div class="titles">
        <h1>Dashboard</h1>
        <p>Welcome back {firstName}! Where do we start today?</p>
    </div>

    {#each visibleCards as card}
        <a class={`card ${card.className}`} href={card.href}>
            <h1>{card.title}</h1>
            <p>{card.description}</p>
        </a>
    {/each}
</section>

<style>
    :global(body) {
        margin: 0;
        background: #f8fafc;
        font-family: Arial, Helvetica, sans-serif;
        color: #0f172a;
    }

    .dashboard-page {
        min-height: calc(100vh - 112px);
        background: #f8fafc;
        padding: 40px 64px 56px;
        box-sizing: border-box;

        display: grid;
        grid-template-columns: repeat(3, minmax(280px, 1fr));
        gap: 28px;
    }

    .titles {
        grid-column: 1 / -1;
        margin-bottom: 4px;
    }

    .titles h1 {
        margin: 0 0 10px;
        font-size: clamp(30px, 4vw, 40px);
        font-weight: 700;
        line-height: 1.1;
        color: #0f172a;
    }

    .titles p {
        margin: 0;
        font-size: 15px;
        line-height: 1.5;
        color: #475569;
    }

    .card {
        position: relative;
        min-height: 220px;
        padding: 112px 30px 30px;
        background: #ffffff;
        border: 2px solid #e5e7eb;
        border-radius: 22px;
        box-sizing: border-box;
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        text-decoration: none;
        display: block;
    }

    .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        border-color: #cbd5e1;
    }

    .card h1 {
        margin: 0 0 12px;
        font-size: clamp(20px, 2vw, 25px);
        font-weight: 600;
        line-height: 1.2;
        color: #0f172a;
    }

    .card p {
        margin: 0;
        font-size: 14px;
        line-height: 1.55;
        color: #475569;
    }

    .card::before {
        position: absolute;
        top: 28px;
        left: 30px;
        width: 68px;
        height: 68px;
        border-radius: 14px;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #ffffff;
        font-size: 30px;
        font-weight: 800;
        line-height: 1;
    }

    .attendance::before {
        content: '✓';
        background: #22c55e;
    }

    .add-participant::before {
        content: '+';
        background: #3b82f6;
    }

    .add-program::before {
        content: 'P';
        background: #a855f7;
    }

    .record::before {
        content: '⌕';
        background: #f97316;
    }

    .report::before {
        content: '▥';
        background: #14b8a6;
    }

    .training::before {
        content: 'i';
        background: #64748b;
    }

    @media (max-width: 1200px) {
        .dashboard-page {
            grid-template-columns: repeat(2, minmax(280px, 1fr));
            padding: 36px 32px 48px;
        }
    }

    @media (max-width: 760px) {
        .dashboard-page {
            grid-template-columns: 1fr;
            padding: 28px 16px 40px;
            gap: 20px;
        }

        .card {
            min-height: 190px;
            padding: 102px 24px 24px;
        }

        .card::before {
            top: 24px;
            left: 24px;
            width: 60px;
            height: 60px;
            font-size: 26px;
        }
    }
</style>
