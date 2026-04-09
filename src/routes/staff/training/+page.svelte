<svelte:options runes={false} />

<script>
	import { tick } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

	export let data;

	/**
	 * @typedef {{
	 *   target: string,
	 *   title: string,
	 *   text: string
	 * }} TrainingStep
	 */

	/** @typedef {'basics' | 'attendance' | 'participants' | 'find' | 'programs' | 'reports'} ModuleKey */
	/**
	 * @typedef {{
	 *   key: ModuleKey,
	 *   title: string,
	 *   icon: string,
	 *   color: string,
	 *   href: string,
	 *   summary: string,
	 *   steps: TrainingStep[]
	 * }} TrainingModule
	 */

	 /** @type {TrainingModule[]} */
	const modules = [
		{
			key: 'basics',
			title: 'Staff Portal Basics',
			icon: 'i',
			color: '#64748b',
			href: '/staff/dashboard',
			summary: 'Learn the overall layout of the staff portal and how to move between the main staff functions.',
			steps: [
				{
					target: 'header-logo',
					title: 'Click the logo to return home',
					text: 'When a staff member is logged in, clicking the The Hut logo returns to the Dashboard. When no one is logged in, the same logo returns to the The Hut Community Staff Portal home page.'
				},
				{
					target: 'header-logout',
					title: 'Use Logout to end the session',
					text: 'Click Logout to sign out of the staff portal and return to the The Hut Community Staff Portal home page.'
				},
				{
					target: 'real-sidebar',
					title: 'Use the left sidebar to move around',
					text: 'Use the left sidebar to move between the main staff functions. The highlighted item shows that you are currently on the training page.'
				},
				{
					target: 'dashboard-cards',
					title: 'Each dashboard card opens a staff function',
					text: 'The six cards on the Dashboard take staff to Tick Attendance, Add Participant, Browse Program, Find Participant, View Reports, and Start Training.'
				}
			]
		},
		{
			key: 'attendance',
			title: 'Tick Attendance',
			icon: '✓',
			color: '#22c55e',
			href: '/staff/attendance',
			summary: 'Search a program, filter the list, open a session, and tick who attended.',
			steps: [
				{
					target: 'attendance-search',
					title: 'Search for the correct program',
					text: 'Use the search bar to quickly find a program by name or location before opening the attendance session.'
				},
				{
					target: 'attendance-filters',
					title: 'Filter by type and date',
					text: 'Filters help staff narrow the list to the right session, especially when multiple programs are running in the same week.'
				},
				{
					target: 'attendance-program-card',
					title: 'Open the program card',
					text: 'Click a program card to open the participant list for the selected session and review the session details first.'
				},
				{
					target: 'attendance-checklist',
					title: 'Tick participants who attended',
					text: 'Use the checklist to mark each participant who attended. This keeps attendance records simple and consistent.'
				},
				{
					target: 'attendance-save',
					title: 'Save the attendance record',
					text: 'Save once the checklist has been reviewed so the attendance data can be used later in participant history and reports.'
				}
			]
		},
		{
			key: 'participants',
			title: 'Add Participant',
			icon: '+',
			color: '#3b82f6',
			href: '/staff/participants',
			summary: 'Register a new participant and capture the main intake information.',
			steps: [
				{
					target: 'participant-search',
					title: 'Search first to avoid duplicates',
					text: 'Search before creating a new participant record so staff do not accidentally register the same person twice.'
				},
				{
					target: 'participant-details',
					title: 'Enter the core participant details',
					text: 'The main details section captures the participant’s basic identity and contact information for future reference.'
				},
				{
					target: 'participant-demographics',
					title: 'Complete the demographic fields',
					text: 'Demographic fields support community reporting and help generate filtered reports by age group, gender, and location.'
				},
				{
					target: 'participant-program',
					title: 'Assign the participant to a program if needed',
					text: 'Use this area when the participant should be linked to a program during registration instead of later.'
				},
				{
					target: 'participant-submit',
					title: 'Save the participant record',
					text: 'Save once the form has been checked. The participant can then be found later from the search page and used in attendance workflows.'
				}
			]
		},
		{
			key: 'find',
			title: 'Find Participant',
			icon: '⌕',
			color: '#f97316',
			href: '/staff/search',
			summary: 'Look up participant records, review details, and manage next actions.',
			steps: [
				{
					target: 'find-search',
					title: 'Search by participant details',
					text: 'Use the search bar to find a participant by name, email, phone number, or other identifying information.'
				},
				{
					target: 'find-results',
					title: 'Review the result cards',
					text: 'The result list helps staff confirm they have selected the correct participant before making any changes.'
				},
				{
					target: 'find-actions',
					title: 'Use the available participant actions',
					text: 'From the participant record, staff can update details, add the participant to a program, or open related information.'
				},
				{
					target: 'find-history',
					title: 'Check the participation history',
					text: 'The history section shows where the participant has been involved and provides a quick attendance overview.'
				}
			]
		},
		{
			key: 'programs',
			title: 'Browse Program',
			icon: 'P',
			color: '#a855f7',
			href: '/staff/programs',
			summary: 'Create a program and record its schedule, facilitator, and main details.',
			steps: [
				{
					target: 'program-details',
					title: 'Enter the program basics',
					text: 'Start with the program name, category, and location so the activity can be clearly identified later.'
				},
				{
					target: 'program-schedule',
					title: 'Record the schedule information',
					text: 'Program dates and times support attendance tracking and help staff find the right session later.'
				},
				{
					target: 'program-facilitator',
					title: 'Set the facilitator and capacity',
					text: 'This section identifies who is responsible for the program and how many participants can attend.'
				},
				{
					target: 'program-submit',
					title: 'Create the program record',
					text: 'Save the new program after reviewing the form so it can be used in attendance and reports.'
				}
			]
		},
		{
			key: 'reports',
			title: 'View Reports',
			icon: '▥',
			color: '#14b8a6',
			href: '/staff/reports',
			summary: 'Build filtered reports, preview the output, and export the final report.',
			steps: [
				{
					target: 'reports-period',
					title: 'Choose a reporting period',
					text: 'Start by choosing a reporting period. Use Weekly, Monthly, Quarterly, Annually, or Custom Range, then confirm the Start date and End date that define the report scope.'
				},
				{
					target: 'reports-program-filters',
					title: 'Choose the program filters',
					text: 'Use Program category and Program to narrow the report to the relevant activities before reviewing the results.'
				},
				{
					target: 'reports-participant-filters',
					title: 'Choose participant filters',
					text: 'Use Age group, Gender, ATSI status, CALD background, Council, and Township to focus the report on the participant group you need.'
				},
				{
					target: 'reports-preview',
					title: 'Preview the report',
					text: 'Use Preview Report to generate the report on the page, then review the summary cards, charts, and report table shown below.'
				},
				{
					target: 'reports-export',
					title: 'Export the report',
					text: 'When the preview looks correct, use Export Report and choose either CSV or PDF depending on the format you need.'
				}
			]
		}
	];

	/** @type {ModuleKey | null} */
	let selectedModuleKey = null;

	let currentStepIndex = 0;

	/** @type {HTMLElement | null} */
	let sidebarWrapper = null;

	let highlightStyle = '';
	let dialogStyle = '';

	/** @type {'right' | 'left' | 'top' | 'bottom'} */
	let dialogPlacement = 'right';

	/** @type {Record<string, HTMLElement>} */
	let targetRefs = {};

	/** @type {TrainingModule | null} */
	let selectedModule = null;

	/** @type {TrainingStep[]} */
	let currentSteps = [];

	/** @type {TrainingStep | null} */
	let activeStep = null;

	/** @typedef {'program_coordinator' | 'data_entry' | 'manager' | 'administrator'} TrainingRole */
	/** @type {Record<TrainingRole, ModuleKey[]>} */
	const roleModuleMap = {
		program_coordinator: ['basics', 'attendance', 'participants', 'programs'],
		data_entry: ['basics', 'participants', 'find', 'programs'],
		manager: ['basics', 'attendance', 'participants', 'find', 'programs', 'reports'],
		administrator: ['basics', 'attendance', 'participants', 'find', 'programs', 'reports']
	};

	$: staffRole = data?.staff?.staff_role ?? null;
	$: allowedModuleKeys = staffRole ? roleModuleMap[staffRole] : [];
	$: visibleModules = modules.filter((module) => allowedModuleKeys.includes(module.key));

	$: if (selectedModuleKey && !allowedModuleKeys.includes(selectedModuleKey)) {
		closeModule();
	}

	$: selectedModule = modules.find((module) => module.key === selectedModuleKey) || null;
	$: currentSteps = selectedModule ? selectedModule.steps : [];
	$: activeStep = currentSteps[currentStepIndex] || null;
	$: if (selectedModule && activeStep) {
		updateTourLayout();
	}

	/**
	 * @param {HTMLElement} node
	 * @param {string} key
	 */
	function registerTarget(node, key) {
		targetRefs[key] = node;

		return {
			/** @param {string} newKey */
			update(newKey) {
				if (newKey === key) return;
				delete targetRefs[key];
				key = newKey;
				targetRefs[key] = node;
			},
			destroy() {
				if (targetRefs[key] === node) {
					delete targetRefs[key];
				}
			}
		};
	}

	function findHeaderLogoTarget() {
		const header = document.querySelector('header') || document.querySelector('[role="banner"]');
		if (!header) return null;

		return (
			header.querySelector('a img')?.closest('a') ||
			header.querySelector('a[href="/"]') ||
			header.querySelector('a[href="/staff/dashboard"]') ||
			header.querySelector('a') ||
			header.querySelector('img')
		);
	}

	function findHeaderLogoutTarget() {
		const nodes = Array.from(document.querySelectorAll('header a, header button, [role="banner"] a, [role="banner"] button'));

		return nodes.find((node) => node.textContent?.trim().toLowerCase().includes('logout')) || null;
	}

	function getActiveTargetNode() {
		if (!activeStep) return null;

		if (activeStep.target === 'real-sidebar') return sidebarWrapper;
		if (activeStep.target === 'header-logo') return findHeaderLogoTarget();
		if (activeStep.target === 'header-logout') return findHeaderLogoutTarget();

		return targetRefs[activeStep.target];
	}

	/** @param {ModuleKey} moduleKey */
	async function openModule(moduleKey) {
		selectedModuleKey = moduleKey;
		currentStepIndex = 0;
		await tick();
		updateTourLayout(true);
	}

	function closeModule() {
		selectedModuleKey = null;
		currentStepIndex = 0;
		highlightStyle = '';
		dialogStyle = '';
		dialogPlacement = 'right';
	}

	async function goPrevious() {
		if (currentStepIndex === 0) return;
		currentStepIndex -= 1;
		await tick();
		updateTourLayout(true);
	}

	async function goNext() {
		if (currentStepIndex >= currentSteps.length - 1) {
			closeModule();
			return;
		}

		currentStepIndex += 1;
		await tick();
		updateTourLayout(true);
	}

	/**
	 * @param {KeyboardEvent} event
	 * @param {ModuleKey} moduleKey
	 */
	function handleModuleCardKeydown(event, moduleKey) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openModule(moduleKey);
		}
	}

	function handleViewportChange() {
		if (selectedModule && activeStep) {
			updateTourLayout();
		}
	}

	async function updateTourLayout(shouldScroll = false) {
		if (!selectedModule || !activeStep) return;

		await tick();

		const target = getActiveTargetNode();
		if (!target) return;

		if (shouldScroll) {
			target.scrollIntoView({ block: 'center', inline: 'nearest' });
		}

		const rect = target.getBoundingClientRect();
		const padding = 10;
		const top = rect.top - padding;
		const left = rect.left - padding;
		const width = rect.width + padding * 2;
		const height = rect.height + padding * 2;

		highlightStyle = `top:${top}px; left:${left}px; width:${width}px; height:${height}px;`;

		const dialogWidth = 360;
		const dialogHeight = 236;
		const gap = 20;
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const overlayTop = 70;
		const lowerBound = viewportHeight - dialogHeight - 18;

		/** @type {'right' | 'left' | 'top' | 'bottom'} */
		let placement = 'right';
		let dialogTop = Math.max(overlayTop + 18, Math.min(top, lowerBound));
		let dialogLeft = left + width + gap;

		if (activeStep.target === 'reports-preview') {
			placement = 'left';
			dialogLeft = 22;
			dialogTop = Math.max(overlayTop + 18, Math.min(top + 8, lowerBound));
		} else {
			if (dialogLeft + dialogWidth > viewportWidth - 18) {
				placement = 'left';
				dialogLeft = left - dialogWidth - gap;
			}

			if (dialogLeft < 18) {
				placement = 'bottom';
				dialogLeft = Math.max(18, Math.min(left, viewportWidth - dialogWidth - 18));
				dialogTop = top + height + gap;
			}

			if (placement === 'bottom' && dialogTop + dialogHeight > viewportHeight - 18) {
				placement = 'top';
				dialogTop = top - dialogHeight - gap;
			}

			dialogTop = Math.max(overlayTop + 18, Math.min(dialogTop, lowerBound));
			dialogLeft = Math.max(18, Math.min(dialogLeft, viewportWidth - dialogWidth - 18));
}

		dialogPlacement = placement;
		dialogStyle = `top:${dialogTop}px; left:${dialogLeft}px;`;
	}
</script>

<svelte:head>
	<title>Start Training</title>
</svelte:head>

<svelte:window on:resize={handleViewportChange} on:scroll={handleViewportChange} />

<Header showLogout={true} />

<section class="training-page">
	<div class="sidebar-wrap" bind:this={sidebarWrapper}>
		<SidebarNav currentKey="training" staffRole={data.staff?.staff_role ?? null} />
	</div>

	<div class="main-content">
		<div class="page-header">
			<div>
				<h1>{selectedModule ? selectedModule.title : 'Start Training'}</h1>
				<p>
					{#if selectedModule}
						Follow the guided walkthrough below to learn the main actions staff take on this page.
					{:else}
						Learn how to use each part of the staff portal step by step.
					{/if}
				</p>
			</div>

			<div class="header-actions">
				{#if selectedModule}
					<button type="button" class="secondary-btn" on:click={closeModule}>Back to Modules</button>
				{/if}
				<a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
			</div>
		</div>

		{#if !selectedModule}
			<div class="intro-card">
				<div class="intro-text">
					<h2>Welcome to the training hub</h2>
					<p>
						Choose one training module below to open a guided walkthrough. Each module shows a mock version of the related page and explains the main actions staff should take there.
					</p>
				</div>
			</div>

			<div class="section-block">
				<h2>Training Modules</h2>
				<p class="section-copy">Select a module card to start the guided tour.</p>

				<div class="card-grid">
					{#if visibleModules.length === 0}
						<div class="intro-card empty-training-card">
							<h3>No training modules available</h3>
							<p>Your current role does not have any training modules assigned yet.</p>
						</div>
					{:else}
						{#each visibleModules as module}
							<div
								class="training-card"
								style={`--card-color: ${module.color};`}
								role="button"
								tabindex="0"
								on:click={() => openModule(module.key)}
								on:keydown={(event) => handleModuleCardKeydown(event, module.key)}
							>
								<div class="card-top">
									<div class="card-icon">{module.icon}</div>
									<h3>{module.title}</h3>
								</div>

								<p>{module.summary}</p>

								<div class="card-actions">
									<span class="secondary-btn faux-btn">Open walkthrough</span>
									<a class="primary-btn" href={module.href} on:click|stopPropagation>Open page</a>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{:else}
			<div class="walkthrough-shell">
				<div class="walkthrough-bar">
					<div>
						<h2>{selectedModule.title}</h2>
						<p>{selectedModule.summary}</p>
					</div>
					<div class="step-pill">Step {currentStepIndex + 1} of {currentSteps.length}</div>
				</div>

				<div class="mock-stage">
					{#if selectedModule.key === 'basics'}
						<div class="dashboard-mock">
							<div class="dashboard-heading">
								<h3>Dashboard</h3>
								<p>Welcome back ... Where do we start today?</p>
							</div>

							<div class="dashboard-grid mock-target" use:registerTarget={'dashboard-cards'} class:is-highlighted={activeStep?.target === 'dashboard-cards'}>
								<div class="dashboard-card card-green">
									<h4>Tick Attendance</h4>
									<p>Record attendance for ongoing program.</p>
								</div>
								<div class="dashboard-card card-blue">
									<h4>Add Participant</h4>
									<p>Register new participants or assign them into a program.</p>
								</div>
								<div class="dashboard-card card-purple">
									<h4>Browse Program</h4>
									<p>Register information of new programs.</p>
								</div>
								<div class="dashboard-card card-orange">
									<h4>Find Participant</h4>
									<p>Search and view participant records and history.</p>
								</div>
								<div class="dashboard-card card-teal">
									<h4>View Reports</h4>
									<p>Browse attendance and program statistics.</p>
								</div>
								<div class="dashboard-card card-slate">
									<h4>Start Training</h4>
									<p>Get to know how the system works.</p>
								</div>
							</div>
						</div>
					{:else if selectedModule.key === 'attendance'}
						<div class="page-mock">
							<div class="mock-title-row">
								<div>
									<h3>Tick Attendance</h3>
									<p>Search a program, filter it, and tick the participants who attended.</p>
								</div>
								<div class="mock-link-btn">Back to Dashboard</div>
							</div>
							<div class="mock-panel controls-panel">
								<div class="search-input mock-target" use:registerTarget={'attendance-search'} class:is-highlighted={activeStep?.target === 'attendance-search'}>
									Search program or location...
								</div>
								<div class="two-field-row mock-target" use:registerTarget={'attendance-filters'} class:is-highlighted={activeStep?.target === 'attendance-filters'}>
									<div class="field-box"><span>Program Type</span><strong>All program types</strong></div>
									<div class="field-box"><span>Program Date</span><strong>All dates</strong></div>
								</div>
							</div>
							<div class="program-list-mock mock-target" use:registerTarget={'attendance-program-card'} class:is-highlighted={activeStep?.target === 'attendance-program-card'}>
								<div class="program-mock-header">
									<div>
										<h4>Fun and Fitness</h4>
										<p>Healthy Living · 24 Mar 2026 · The Hut Community Centre</p>
									</div>
									<span>1/3 ticked</span>
								</div>
								<div class="checklist-panel mock-target" use:registerTarget={'attendance-checklist'} class:is-highlighted={activeStep?.target === 'attendance-checklist'}>
									<label><input type="checkbox" checked /> Haoxin Che</label>
									<label><input type="checkbox" /> Olivia Brown</label>
									<label><input type="checkbox" /> Jack Wilson</label>
									<div class="save-row mock-target" use:registerTarget={'attendance-save'} class:is-highlighted={activeStep?.target === 'attendance-save'}>
										<button type="button" class="primary-btn inline-btn">Save Attendance</button>
									</div>
								</div>
							</div>
						</div>
					{:else if selectedModule.key === 'participants'}
						<div class="page-mock">
							<div class="mock-title-row">
								<div>
									<h3>Add Participant</h3>
									<p>Register a participant and capture their main intake information.</p>
								</div>
								<div class="mock-link-btn">Back to Dashboard</div>
							</div>
							<div class="mock-panel stack-gap">
								<div class="search-input mock-target" use:registerTarget={'participant-search'} class:is-highlighted={activeStep?.target === 'participant-search'}>
									Search for an existing participant first...
								</div>
								<div class="three-panel-grid">
									<div class="form-block mock-target" use:registerTarget={'participant-details'} class:is-highlighted={activeStep?.target === 'participant-details'}>
										<h4>Participant Details</h4>
										<div class="form-grid two-cols">
											<div class="input-box">First name</div>
											<div class="input-box">Last name</div>
											<div class="input-box">Birthday</div>
											<div class="input-box">Phone number</div>
											<div class="input-box wide-box">Email address</div>
										</div>
									</div>
									<div class="form-block mock-target" use:registerTarget={'participant-demographics'} class:is-highlighted={activeStep?.target === 'participant-demographics'}>
										<h4>Demographics</h4>
										<div class="form-grid two-cols">
											<div class="input-box">Gender</div>
											<div class="input-box">Age group</div>
											<div class="input-box">Council</div>
											<div class="input-box">Township</div>
										</div>
									</div>
									<div class="form-block mock-target" use:registerTarget={'participant-program'} class:is-highlighted={activeStep?.target === 'participant-program'}>
										<h4>Program Assignment</h4>
										<div class="form-grid one-col">
											<div class="input-box">Select program</div>
											<div class="input-box">Notes</div>
										</div>
									</div>
								</div>
								<div class="submit-bar mock-target" use:registerTarget={'participant-submit'} class:is-highlighted={activeStep?.target === 'participant-submit'}>
									<span>Review the form before saving.</span>
									<button type="button" class="primary-btn inline-btn">Save Participant</button>
								</div>
							</div>
						</div>
					{:else if selectedModule.key === 'find'}
						<div class="page-mock">
							<div class="mock-title-row">
								<div>
									<h3>Find Participant</h3>
									<p>Search existing participants, review detailed records, and manage next actions.</p>
								</div>
								<div class="mock-link-btn">Back to Dashboard</div>
							</div>
							<div class="mock-panel stack-gap">
								<div class="search-input mock-target" use:registerTarget={'find-search'} class:is-highlighted={activeStep?.target === 'find-search'}>
									Search by participant name, email, phone, or township...
								</div>
								<div class="find-grid">
									<div class="result-list mock-target" use:registerTarget={'find-results'} class:is-highlighted={activeStep?.target === 'find-results'}>
										<h4>Matching Participants</h4>
										<div class="result-card selected">Jane Smith · 0412 888 221 · Stirling</div>
										<div class="result-card">Janet Smith · 0400 213 556 · Aldgate</div>
										<div class="result-card">J. Smyth · 0433 876 912 · Crafers</div>
									</div>
									<div class="detail-column">
										<div class="detail-card mock-target" use:registerTarget={'find-actions'} class:is-highlighted={activeStep?.target === 'find-actions'}>
											<h4>Participant Record</h4>
											<p>Email: jane@example.com</p>
											<p>Program: Community Lunch</p>
											<div class="detail-actions">
												<button type="button">Update Details</button>
												<button type="button">Add to Program</button>
											</div>
										</div>
										<div class="detail-card mock-target" use:registerTarget={'find-history'} class:is-highlighted={activeStep?.target === 'find-history'}>
											<h4>Attendance History</h4>
											<div class="history-row"><span>Community Lunch</span><span>5 sessions this month</span></div>
											<div class="history-row"><span>Art Group</span><span>2 sessions this month</span></div>
											<div class="history-row"><span>Walking Club</span><span>1 session this month</span></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{:else if selectedModule.key === 'programs'}
						<div class="page-mock">
							<div class="mock-title-row">
								<div>
									<h3>Browse Program</h3>
									<p>Create a new program and save its main details for future attendance and reporting.</p>
								</div>
								<div class="mock-link-btn">Back to Dashboard</div>
							</div>
							<div class="mock-panel stack-gap">
								<div class="program-form-grid">
									<div class="form-block mock-target" use:registerTarget={'program-details'} class:is-highlighted={activeStep?.target === 'program-details'}>
										<h4>Program Details</h4>
										<div class="form-grid two-cols">
											<div class="input-box">Program name</div>
											<div class="input-box">Category</div>
											<div class="input-box wide-box">Location</div>
											<div class="input-box wide-box">Program summary</div>
										</div>
									</div>
									<div class="form-block mock-target" use:registerTarget={'program-schedule'} class:is-highlighted={activeStep?.target === 'program-schedule'}>
										<h4>Schedule</h4>
										<div class="form-grid two-cols">
											<div class="input-box">Start date</div>
											<div class="input-box">End date</div>
											<div class="input-box">Start time</div>
											<div class="input-box">End time</div>
										</div>
									</div>
									<div class="form-block mock-target" use:registerTarget={'program-facilitator'} class:is-highlighted={activeStep?.target === 'program-facilitator'}>
										<h4>Facilitator and Capacity</h4>
										<div class="form-grid one-col">
											<div class="input-box">Facilitator</div>
											<div class="input-box">Maximum participants</div>
										</div>
									</div>
								</div>
								<div class="submit-bar mock-target" use:registerTarget={'program-submit'} class:is-highlighted={activeStep?.target === 'program-submit'}>
									<span>The new program will appear in attendance and reporting pages after saving.</span>
									<button type="button" class="primary-btn inline-btn">Create Program</button>
								</div>
							</div>
						</div>
					{:else if selectedModule.key === 'reports'}
						<div class="page-mock">
							<div class="mock-title-row">
								<div>
									<h3>View Reports</h3>
									<p>Build attendance and demographic reports by date, program and participant profile fields.</p>
								</div>
								<div class="mock-link-btn">Back to Dashboard</div>
							</div>

							<div class="mock-panel reports-panel">
								<h4>Report Filters</h4>

								<div
									class="reports-period-block mock-target"
									use:registerTarget={'reports-period'}
									class:is-highlighted={activeStep?.target === 'reports-period'}
								>
									<div class="frequency-row">
										<span>Weekly</span>
										<span class="active-pill">Monthly</span>
										<span>Quarterly</span>
										<span>Annually</span>
										<span>Custom Range</span>
									</div>

									<div class="two-field-row">
										<div class="field-box">
											<span>Start date</span>
											<strong>2026/03/11</strong>
										</div>
										<div class="field-box">
											<span>End date</span>
											<strong>2026/04/09</strong>
										</div>
									</div>
								</div>

								<div
									class="two-field-row mock-target"
									use:registerTarget={'reports-program-filters'}
									class:is-highlighted={activeStep?.target === 'reports-program-filters'}
								>
									<div class="field-box">
										<span>Program category</span>
										<strong>All program categories</strong>
									</div>
									<div class="field-box">
										<span>Program</span>
										<strong>All programs</strong>
									</div>
								</div>

								<div
									class="reports-participant-grid mock-target"
									use:registerTarget={'reports-participant-filters'}
									class:is-highlighted={activeStep?.target === 'reports-participant-filters'}
								>
									<div class="field-box">
										<span>Age group</span>
										<strong>All age groups</strong>
									</div>
									<div class="field-box">
										<span>Gender</span>
										<strong>All genders</strong>
									</div>
									<div class="field-box">
										<span>ATSI status</span>
										<strong>All ATSI statuses</strong>
									</div>
									<div class="field-box">
										<span>CALD background</span>
										<strong>All CALD backgrounds</strong>
									</div>
									<div class="field-box">
										<span>Council</span>
										<strong>All councils</strong>
									</div>
									<div class="field-box">
										<span>Township</span>
										<strong>All townships</strong>
									</div>
								</div>

								<div
									class="preview-action mock-target"
									use:registerTarget={'reports-preview'}
									class:is-highlighted={activeStep?.target === 'reports-preview'}
								>
									<div class="preview-action-bar">
										<button type="button" class="secondary-btn preview-mock-btn">Preview Report</button>
									</div>

									<div class="report-preview-mock">
										<div class="preview-top-row">
											<div class="preview-summary-card">
												<h5>Unique Participants</h5>
												<p>28</p>
											</div>
											<div class="preview-summary-card">
												<h5>Total Attendances</h5>
												<p>62</p>
											</div>
											<div class="preview-summary-card">
												<h5>Total Records</h5>
												<p>74</p>
											</div>
											<div class="preview-summary-card">
												<h5>Attendance Rate</h5>
												<p>84%</p>
											</div>
										</div>

										<div class="preview-table-card">
											<h5>Program Summary Table</h5>
											<div class="preview-table">
												<div class="preview-table-head">
													<span>Program</span>
													<span>Category</span>
													<span>Participants</span>
													<span>Attendances</span>
												</div>
												<div class="preview-table-row">
													<span>Walking Groups</span>
													<span>Healthy Living</span>
													<span>10</span>
													<span>24</span>
												</div>
												<div class="preview-table-row">
													<span>Community Shed</span>
													<span>Interest &amp; Social</span>
													<span>8</span>
													<span>18</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div
									class="export-action mock-target"
									use:registerTarget={'reports-export'}
									class:is-highlighted={activeStep?.target === 'reports-export'}
								>
									<div class="export-toolbar">
										<div class="export-split-btn">
											<button type="button" class="export-btn">Export Report</button>
											<button type="button" class="export-arrow-btn">▾</button>
										</div>

										<div class="export-options-mock">
											<div class="export-option">Export as PDF</div>
											<div class="export-option">Export as CSV</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if selectedModule && activeStep && highlightStyle && dialogStyle}
		<div class="tour-overlay" aria-hidden="true">
			<div class="tour-highlight" style={highlightStyle}></div>
		</div>

		<div class="tour-dialog" data-placement={dialogPlacement} style={dialogStyle}>
			<div class="dialog-header">
				<div class="dialog-icon" style={`background: ${selectedModule.color};`}>{currentStepIndex + 1}</div>
				<div>
					<p class="dialog-kicker">{selectedModule.title}</p>
					<h3>{activeStep.title}</h3>
				</div>
			</div>

			<p class="dialog-copy">{activeStep.text}</p>

			<div class="dialog-actions">
				<button type="button" class="secondary-btn small-btn" on:click={goPrevious} disabled={currentStepIndex === 0}>
					Previous
				</button>
				<button type="button" class="primary-btn small-btn" on:click={goNext}>
					{currentStepIndex === currentSteps.length - 1 ? 'Finish' : 'Next'}
				</button>
			</div>
		</div>
	{/if}
</section>

<style>
	:global(body) {
		margin: 0;
		background: #f5f7fb;
		font-family: Arial, Helvetica, sans-serif;
		color: #152238;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.training-page {
		display: flex;
		min-height: calc(100vh - 70px);
		box-sizing: border-box;
		position: relative;
	}

	.sidebar-wrap {
		flex-shrink: 0;
		position: relative;
		z-index: 1;
		align-self: stretch;
		display: flex;
		min-height: 100%;
	}

	.main-content {
		flex: 1;
		padding: 42px 42px 36px;
		box-sizing: border-box;
		position: relative;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
	}

	.page-header > div:first-child {
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

	.header-actions {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.dashboard-btn,
	.secondary-btn,
	.primary-btn,
	.mock-link-btn,
	.detail-actions button {
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
		cursor: pointer;
	}

	.primary-btn,
	.inline-btn {
		background: #20b9b0;
		border-color: #20b9b0;
		color: #ffffff;
	}

	.dashboard-btn:hover,
	.secondary-btn:hover,
	.mock-link-btn:hover,
	.detail-actions button:hover {
		background: #f9fafb;
	}

	.primary-btn:hover,
	.inline-btn:hover {
		background: #17a79e;
	}

	.intro-card,
	.training-card,
	.walkthrough-shell,
	.mock-panel,
	.program-list-mock,
	.dashboard-heading,
	.dashboard-card,
	.result-list,
	.detail-card,
	.form-block,
	.submit-bar {
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
	}

	.intro-card {
		margin-top: 28px;
		padding: 24px;
	}

	.intro-card h2,
	.section-block h2,
	.walkthrough-bar h2 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: 700;
		color: #152238;
	}

	.intro-card p,
	.section-copy,
	.walkthrough-bar p {
		margin: 12px 0 0;
		font-size: 16px;
		line-height: 1.6;
		color: #4b5563;
	}

	.section-block {
		margin-top: 28px;
	}

	.card-grid {
		margin-top: 18px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 20px;
	}

	.training-card {
		padding: 24px;
		text-align: left;
		cursor: pointer;
		transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
	}

	.training-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
		border-color: color-mix(in srgb, var(--card-color) 32%, #d9d9d9);
	}

	.card-top {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	.card-icon {
		width: 60px;
		height: 60px;
		border-radius: 18px;
		background: var(--card-color);
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.9rem;
		font-weight: 700;
	}

	.training-card h3 {
		margin: 0;
		font-size: 2rem;
		line-height: 1.15;
	}

	.training-card p {
		margin: 16px 0 20px;
		font-size: 16px;
		line-height: 1.6;
		color: #4b5563;
	}

	.card-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.faux-btn {
		pointer-events: none;
	}

	.walkthrough-shell {
		margin-top: 28px;
		padding: 24px;
		position: relative;
	}

	.walkthrough-bar {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
		margin-bottom: 20px;
	}

	.step-pill {
		padding: 9px 14px;
		border-radius: 999px;
		background: #edf2f7;
		font-size: 14px;
		font-weight: 700;
		color: #475569;
		white-space: nowrap;
	}

	.mock-stage {
		position: relative;
		min-height: 720px;
		padding: 8px;
	}

	.dashboard-mock,
	.page-mock {
		position: relative;
		z-index: 1;
	}

	.dashboard-heading {
		padding: 24px 26px;
		margin-bottom: 20px;
	}

	.dashboard-heading h3,
	.mock-title-row h3 {
		margin: 0;
		font-size: 2.8rem;
		font-weight: 700;
		color: #152238;
	}

	.dashboard-heading p,
	.mock-title-row p {
		margin: 10px 0 0;
		font-size: 17px;
		color: #4b5563;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(220px, 1fr));
		gap: 18px;
	}

	.dashboard-card {
		padding: 22px;
		min-height: 150px;
	}

	.dashboard-card h4,
	.form-block h4,
	.result-list h4,
	.detail-card h4,
	.reports-panel h4,
	.program-mock-header h4 {
		margin: 0 0 10px;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.dashboard-card p,
	.program-mock-header p,
	.detail-card p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: #4b5563;
	}

	.card-green { border-left: 6px solid #22c55e; }
	.card-blue { border-left: 6px solid #3b82f6; }
	.card-purple { border-left: 6px solid #a855f7; }
	.card-orange { border-left: 6px solid #f97316; }
	.card-teal { border-left: 6px solid #14b8a6; }
	.card-slate { border-left: 6px solid #64748b; }

	.mock-title-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
		margin-bottom: 20px;
	}

	.mock-link-btn {
		background: #ffffff;
	}

	.mock-panel {
		padding: 24px;
	}

	.controls-panel,
	.stack-gap,
	.reports-panel {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.search-input,
	.input-box,
	.field-box,
	.result-card {
		border: 1px solid #d9d9d9;
		border-radius: 16px;
		background: #ffffff;
	}

	.search-input {
		padding: 16px 18px;
		font-size: 15px;
		color: #64748b;
	}

	.two-field-row,
	.three-panel-grid,
	.program-form-grid,
	.find-grid {
		display: grid;
		gap: 18px;
	}

	.two-field-row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.three-panel-grid,
	.program-form-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.field-box {
		padding: 14px 16px;
		min-height: 86px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.field-box span {
		font-size: 14px;
		font-weight: 700;
		color: #152238;
	}

	.field-box strong {
		font-size: 15px;
		font-weight: 500;
		color: #374151;
	}

	.program-list-mock {
		margin-top: 18px;
		padding: 22px;
	}

	.program-mock-header {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		align-items: flex-start;
	}

	.program-mock-header span {
		font-size: 14px;
		font-weight: 700;
		color: #475569;
	}

	.checklist-panel {
		margin-top: 16px;
		padding: 18px;
		border-radius: 20px;
		background: #f8fafc;
		border: 1px solid #d9d9d9;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.checklist-panel label {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 15px;
		color: #374151;
	}

	.save-row {
		padding-top: 8px;
		display: flex;
		justify-content: flex-end;
	}

	.form-block,
	.result-list,
	.detail-card {
		padding: 20px;
	}

	.form-grid {
		display: grid;
		gap: 12px;
		margin-top: 14px;
	}

	.two-cols {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.one-col {
		grid-template-columns: 1fr;
	}

	.input-box {
		min-height: 54px;
		padding: 16px;
		font-size: 14px;
		color: #64748b;
	}

	.wide-box {
		grid-column: 1 / -1;
	}

	.submit-bar {
		padding: 18px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 18px;
	}

	.submit-bar span {
		font-size: 15px;
		color: #475569;
	}

	.find-grid {
		grid-template-columns: 300px minmax(0, 1fr);
	}

	.result-card {
		padding: 14px 16px;
		font-size: 15px;
		color: #374151;
		margin-top: 12px;
	}

	.result-card.selected {
		border-color: #f97316;
		background: #fff7ed;
	}

	.detail-column {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.detail-actions {
		margin-top: 16px;
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.history-row {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		border-top: 1px solid #e5e7eb;
		font-size: 14px;
		color: #374151;
	}

	.history-row:first-of-type {
		margin-top: 8px;
	}

	.reports-panel h4 {
		font-size: 2rem;
	}

	.frequency-row {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.frequency-row span {
		padding: 12px 18px;
		border-radius: 999px;
		border: 1px solid #d9d9d9;
		background: #ffffff;
		font-size: 15px;
		font-weight: 700;
	}

	.frequency-row .active-pill {
		border-color: #20b9b0;
		color: #20b9b0;
		background: #ecfeff;
	}

	.reports-period-block {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.reports-participant-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
	}

	.preview-action {
		border: 1px solid #d9d9d9;
		border-radius: 22px;
		background: #ffffff;
		padding: 18px;
	}

	.preview-action-bar {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 16px;
	}

	.report-preview-mock {
		border: 1px solid #e5e7eb;
		border-radius: 20px;
		background: #f8fafc;
		padding: 18px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.preview-mock-btn {
		padding: 12px 22px;
		min-height: 52px;
		border-radius: 18px;
		font-size: 15px;
		font-weight: 700;
	}

	.preview-top-row {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.preview-summary-card {
		border: 1px solid #d9d9d9;
		border-radius: 18px;
		background: #ffffff;
		padding: 14px;
	}

	.preview-summary-card h5,
	.preview-table-card h5 {
		margin: 0 0 8px;
		font-size: 14px;
		font-weight: 700;
		color: #152238;
	}

	.preview-summary-card p {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #152238;
	}

	.preview-table-card {
		border: 1px solid #d9d9d9;
		border-radius: 18px;
		background: #ffffff;
		padding: 14px;
	}

	.preview-table {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.preview-table-head,
	.preview-table-row {
		display: grid;
		grid-template-columns: 1.4fr 1.2fr 0.8fr 0.8fr;
		gap: 10px;
		font-size: 13px;
	}

	.preview-table-head {
		font-weight: 700;
		color: #152238;
		padding-bottom: 8px;
		border-bottom: 1px solid #e5e7eb;
	}

	.preview-table-row {
		color: #475569;
	}

	.export-action {
		display: inline-block;
		width: fit-content;
		border: 1px solid #d9d9d9;
		border-radius: 22px;
		background: #ffffff;
		padding: 18px;
	}

	.export-toolbar {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
	}

	.export-split-btn {
		display: inline-flex;
		align-items: stretch;
		border-radius: 18px;
		overflow: hidden;
	}

	.export-btn,
	.export-arrow-btn {
		border: none;
		background: #20b9b0;
		color: #ffffff;
		font-size: 15px;
		font-weight: 700;
		padding: 12px 18px;
	}

	.export-arrow-btn {
		padding: 12px 14px;
		border-left: 1px solid rgba(255, 255, 255, 0.35);
	}

	.export-options-mock {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 340px;
		padding: 18px;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
		background: #ffffff;
	}

	.export-option {
		border: 1px solid #d9d9d9;
		border-radius: 18px;
		background: #ffffff;
		padding: 14px 18px;
		font-size: 14px;
		color: #152238;
	}

	@media (max-width: 1100px) {
		.reports-participant-grid,
		.preview-top-row {
			grid-template-columns: 1fr;
		}

		.export-options-mock {
			min-width: 100%;
			width: 100%;
	}
	}

	.mock-target.is-highlighted,
		.is-highlighted {
		position: relative;
		z-index: 26;
	}

	.tour-overlay {
		position: fixed;
		inset: 70px 0 0 0;
		pointer-events: none;
		z-index: 20;
	}

	.tour-highlight {
		position: fixed;
		border-radius: 24px;
		border: 2px solid #ffffff;
		box-shadow:
			0 0 0 9999px rgba(15, 23, 42, 0.48),
			0 18px 36px rgba(15, 23, 42, 0.18);
	}

	.tour-dialog {
		position: fixed;
		width: min(360px, calc(100vw - 36px));
		padding: 20px;
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 22px;
		box-shadow: 0 20px 44px rgba(15, 23, 42, 0.2);
		z-index: 30;
	}

	.dialog-header {
		display: flex;
		gap: 14px;
		align-items: flex-start;
	}

	.dialog-icon {
		width: 42px;
		height: 42px;
		border-radius: 14px;
		color: #ffffff;
		font-size: 18px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.dialog-kicker {
		margin: 0 0 6px;
		font-size: 13px;
		font-weight: 700;
		color: #64748b;
	}

	.dialog-header h3 {
		margin: 0;
		font-size: 1.2rem;
		line-height: 1.35;
	}

	.dialog-copy {
		margin: 16px 0 0;
		font-size: 15px;
		line-height: 1.65;
		color: #4b5563;
	}

	.dialog-actions {
		margin-top: 18px;
		display: flex;
		justify-content: space-between;
		gap: 12px;
	}

	.small-btn {
		padding: 11px 16px;
		min-width: 108px;
	}

	.secondary-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 1100px) {
		.page-header,
		.walkthrough-bar,
		.mock-title-row,
		.submit-bar,
		.find-grid {
			flex-direction: column;
			align-items: stretch;
		}

		.two-field-row,
		.three-panel-grid,
		.program-form-grid,
		.find-grid,
		.dashboard-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.main-content {
			padding: 28px 20px 30px;
		}

		.page-header h1,
		.dashboard-heading h3,
		.mock-title-row h3 {
			font-size: 2.3rem;
		}

		.training-card h3 {
			font-size: 1.6rem;
		}

		.tour-dialog {
			width: calc(100vw - 24px);
		}
	}
</style>
