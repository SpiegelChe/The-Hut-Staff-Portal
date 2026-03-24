<svelte:options runes={false} />

<script>
	// @ts-nocheck
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

	let selectedModuleKey = 'basics';

	const modules = [
		{
			key: 'basics',
			title: 'Staff Portal Basics',
			icon: '⌂',
			color: '#64748b',
			href: '/staff/dashboard',
			summary: 'Learn the overall structure of the staff portal and how to move between modules.',
			steps: [
				'Use the left sidebar to move between the main staff functions.',
				'Use the button in the top-right corner of each page to return to the dashboard.',
				'Look for the highlighted menu item in the sidebar to know which page you are currently on.',
				'Use the search bars and filters on each page to narrow down records quickly.'
			]
		},
		{
			key: 'attendance',
			title: 'Tick Attendance',
			icon: '✓',
			color: '#22c55e',
			href: '/staff/attendance',
			summary: 'Search a program, filter by date or type, then tick who attended.',
			steps: [
				'Open Tick Attendance from the dashboard or the left sidebar.',
				'Use the search bar to find a program by name or location.',
				'Use the program type and date filters to narrow the list.',
				'Click a program card to expand its participant list.',
				'Tick the checkbox next to each participant who attended.',
				'Select Save Attendance to record the session attendance.'
			]
		},
		{
			key: 'participants',
			title: 'Add Participant',
			icon: '+',
			color: '#3b82f6',
			href: '/staff/participants',
			summary: 'Register a new participant and capture their common intake information.',
			steps: [
				'Use the search box first to check whether the participant already exists.',
				'If no matching participant is found, complete the registration form below.',
				'Enter personal details, contact details, and demographic information.',
				'Fill in emergency contacts and any guardian or medical notes if required.',
				'Review the consent section and tick the required consent boxes.',
				'Select Save Participant to create the participant record.'
			]
		},
		{
			key: 'find',
			title: 'Find Participant',
			icon: '⌕',
			color: '#f97316',
			href: '/staff/search',
			summary: 'Search existing participants, view detailed records, and manage next actions.',
			steps: [
				'Use the search box to find a participant by name, email, phone, postcode, or township.',
				'Optionally filter by program to narrow the results further.',
				'Click a participant card to expand and view more detailed information.',
				'Use Update Participant Info to edit their details.',
				'Use Add to Program to register them into another program.',
				'Use View Attendance History to review their participation records.'
			]
		},
		{
			key: 'programs',
			title: 'Add Program',
			icon: 'P',
			color: '#a855f7',
			href: '/staff/programs',
			summary: 'Create new programs or add new sessions to existing programs.',
			steps: [
				'Use the top search and category filter to find an existing program.',
				'To add a session, select Add Session on the relevant program card.',
				'Enter the session date, time, location, capacity, and any notes.',
				'Save the session so it can be used later for attendance and reporting.',
				'To create a completely new program, use the New Program Registration form below.',
				'Enter the program name, category, facilitator, location, and status, then save.'
			]
		},
		{
			key: 'reports',
			title: 'View Reports',
			icon: '▥',
			color: '#14b8a6',
			href: '/staff/reports',
			summary: 'Build reports by date range, demographic filters, and program selection.',
			steps: [
				'Choose a reporting mode such as weekly, monthly, quarterly, annually, or custom range.',
				'Set the date range you want to review.',
				'Apply filters such as program type, program, age group, and gender.',
				'Select Preview Report to generate the report layout.',
				'Review the summary cards, charts, and tables in the preview.',
				'Select Export Report when you are ready to save or share the report.'
			]
		}
	];

	const quickStartKeys = ['attendance', 'participants', 'reports'];

	$: selectedModule =
		modules.find((module) => module.key === selectedModuleKey) || modules[0];

	$: quickStartModules = modules.filter((module) => quickStartKeys.includes(module.key));

	function showSteps(moduleKey) {
		selectedModuleKey = moduleKey;
	}
</script>

<svelte:head>
	<title>Start Training</title>
</svelte:head>

<Header showLogout={true} />

<section class="training-page">
	<SidebarNav currentKey="training" />

	<div class="main-content">
		<div class="page-header">
			<div>
				<h1>Start Training</h1>
				<p>Learn how to use each part of the staff portal step by step.</p>
			</div>

			<a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
		</div>

		<div class="intro-card">
			<div class="intro-text">
				<h2>Welcome to the training hub</h2>
				<p>
					Use the quick start modules below if you want to learn the most common staff tasks
					first, or browse all training modules for a full overview of the system.
				</p>
			</div>
		</div>

		<div class="section-block">
			<h2>Quick Start</h2>

			<div class="card-grid quick-grid">
				{#each quickStartModules as module}
					<div class="training-card" style={`--card-color: ${module.color};`}>
						<div class="card-top">
							<div class="card-icon">{module.icon}</div>
							<h3>{module.title}</h3>
						</div>

						<p>{module.summary}</p>

						<div class="card-actions">
							<button type="button" class="secondary-btn" on:click={() => showSteps(module.key)}>
								View steps
							</button>

							<a class="primary-btn" href={module.href}>Open page</a>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="section-block">
			<h2>All Training Modules</h2>

			<div class="card-grid">
				{#each modules as module}
					<div class="training-card" style={`--card-color: ${module.color};`}>
						<div class="card-top">
							<div class="card-icon">{module.icon}</div>
							<h3>{module.title}</h3>
						</div>

						<p>{module.summary}</p>

						<div class="card-actions">
							<button type="button" class="secondary-btn" on:click={() => showSteps(module.key)}>
								View steps
							</button>

							<a class="primary-btn" href={module.href}>Open page</a>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="steps-card" style={`--steps-color: ${selectedModule.color};`}>
			<div class="steps-header">
				<div class="steps-title-wrap">
					<div class="steps-icon">{selectedModule.icon}</div>
					<div>
						<h2>{selectedModule.title}</h2>
						<p>{selectedModule.summary}</p>
					</div>
				</div>

				<a class="primary-btn" href={selectedModule.href}>Open this module</a>
			</div>

			<div class="steps-list">
				{#each selectedModule.steps as step, index}
					<div class="step-row">
						<div class="step-number">{index + 1}</div>
						<div class="step-text">{step}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	:global(body) {
		margin: 0;
		background: #f5f7fb;
		font-family: Arial, Helvetica, sans-serif;
		color: #152238;
	}

	.training-page {
		display: flex;
		min-height: calc(100vh - 70px);
		box-sizing: border-box;
	}

	.main-content {
		flex: 1;
		padding: 42px 42px 36px;
		box-sizing: border-box;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
	}

	.page-header > div {
		flex: 1;
		min-width: 0;
	}

	.page-header h1 {
		margin: 0;
		font-size: 3rem;
		font-weight: 700;
		color: #152238;
	}

	.page-header p {
		margin: 12px 0 0;
		font-size: 17px;
		color: #4b5563;
	}

	.dashboard-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 12px 18px;
		border: 1px solid #d9d9d9;
		border-radius: 14px;
		background: #ffffff;
		color: #152238;
		text-decoration: none;
		font-size: 15px;
		font-weight: 700;
		white-space: nowrap;
		flex-shrink: 0;
		margin-top: 8px;
	}

	.dashboard-btn:hover {
		background: #f9fafb;
	}

	.intro-card,
	.training-card,
	.steps-card {
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
		box-sizing: border-box;
	}

	.intro-card {
		margin-top: 28px;
		padding: 24px;
	}

	.intro-card h2 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: 700;
		color: #152238;
	}

	.intro-card p {
		margin: 12px 0 0;
		font-size: 16px;
		line-height: 1.6;
		color: #4b5563;
		max-width: 900px;
	}

	.section-block {
		margin-top: 28px;
	}

	.section-block h2 {
		margin: 0 0 16px;
		font-size: 1.8rem;
		font-weight: 700;
		color: #152238;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(240px, 1fr));
		gap: 18px;
	}

	.quick-grid {
		grid-template-columns: repeat(3, minmax(240px, 1fr));
	}

	.training-card {
		padding: 22px;
		border-color: color-mix(in srgb, var(--card-color) 18%, #d9d9d9);
		background: color-mix(in srgb, var(--card-color) 4%, white);
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 14px;
	}

	.card-icon {
		width: 52px;
		height: 52px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--card-color);
		color: #ffffff;
		font-size: 28px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.training-card h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: #152238;
	}

	.training-card p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: #4b5563;
		min-height: 72px;
	}

	.card-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-top: 18px;
	}

	.primary-btn,
	.secondary-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 12px 18px;
		border-radius: 14px;
		font-size: 15px;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		box-sizing: border-box;
	}

	.primary-btn {
		border: none;
		background: #64748b;
		color: #ffffff;
	}

	.primary-btn:hover {
		background: #475569;
	}

	.secondary-btn {
		border: 1px solid #d9d9d9;
		background: #ffffff;
		color: #152238;
	}

	.secondary-btn:hover {
		background: #f9fafb;
	}

	.steps-card {
		margin-top: 28px;
		padding: 24px;
		border-color: color-mix(in srgb, var(--steps-color) 30%, #d9d9d9);
	}

	.steps-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid #ececec;
	}

	.steps-title-wrap {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.steps-icon {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--steps-color);
		color: #ffffff;
		font-size: 30px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.steps-header h2 {
		margin: 0;
		font-size: 1.7rem;
		font-weight: 700;
		color: #152238;
	}

	.steps-header p {
		margin: 8px 0 0;
		font-size: 15px;
		color: #4b5563;
		line-height: 1.6;
	}

	.steps-list {
		margin-top: 22px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.step-row {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 14px 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.step-number {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--steps-color) 15%, white);
		color: var(--steps-color);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step-text {
		font-size: 15px;
		line-height: 1.6;
		color: #334155;
		padding-top: 2px;
	}

	@media (max-width: 1200px) {
		.card-grid,
		.quick-grid {
			grid-template-columns: repeat(2, minmax(240px, 1fr));
		}
	}

	@media (max-width: 1000px) {
		.page-header,
		.steps-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (max-width: 900px) {
		.main-content {
			padding: 26px 18px 28px;
		}

		.page-header h1 {
			font-size: 2.2rem;
		}

		.card-grid,
		.quick-grid {
			grid-template-columns: 1fr;
		}

		.steps-title-wrap {
			align-items: flex-start;
		}
	}
</style>