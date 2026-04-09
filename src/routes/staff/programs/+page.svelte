<svelte:options runes={false} />

<script>
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

	export let data;
	let searchText = '';
	let selectedCategory = 'all';
	/** @type {number | null} */
	let expandedProgramId = null;

	const categoryOptions = [
		'all',
		'Healthy Living',
		'Low Income Support',
		'Interest & Social',
		'Young People',
		'Sustainability'
	];

	let programs = [
		{
			id: 1,
			name: 'Fun and Fitness',
			category: 'Healthy Living',
			location: 'The Hut Community Centre',
			facilitator: 'Bernadette Reading',
			isActive: true,
			sessions: [
				{ id: 101, date: '2026-03-24', start: '10:00', end: '11:00', location: 'The Hut Community Centre', capacity: 20 },
				{ id: 102, date: '2026-03-31', start: '10:00', end: '11:00', location: 'The Hut Community Centre', capacity: 20 }
			]
		},
		{
	        id: 2,
	        name: 'Music Makers',
	        category: 'Interest & Social',
        	location: 'The Hut Community Centre',
	        facilitator: 'Deborah Bates',
	        isActive: true,
	        sessions: [
	        	{ id: 103, date: '2026-03-26', start: '13:00', end: '14:30', location: 'The Hut Community Centre', capacity: 15 },
	        	{ id: 104, date: '2026-04-02', start: '13:00', end: '14:30', location: 'The Hut Community Centre', capacity: 15 }
	        ]
        },
		{
			id: 3,
			name: 'Dungeons and Dragons',
			category: 'Young People',
			location: 'The Hut Community Centre',
			facilitator: 'Liz Forsyth',
			isActive: true,
			sessions: [
				{ id: 105, date: '2026-03-27', start: '16:00', end: '18:00', location: 'The Hut Community Centre', capacity: 10 }
			]
		}
	];

	let sessionForm = {
		sessionDate: '',
		startTime: '',
		endTime: '',
		location: '',
		capacity: '',
		notes: ''
	};

	let newProgramForm = {
		programName: '',
		category: '',
		location: '',
		facilitator: '',
		isActive: 'true',
		notes: ''
	};

	$: filteredPrograms = programs.filter((program) => {
		const keyword = searchText.trim().toLowerCase();

		const matchesSearch =
			keyword === '' ||
			program.name.toLowerCase().includes(keyword) ||
			program.location.toLowerCase().includes(keyword) ||
			program.facilitator.toLowerCase().includes(keyword);

		const matchesCategory =
			selectedCategory === 'all' || program.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	/** @param {number} programId */
	function toggleProgram(programId) {
		expandedProgramId = expandedProgramId === programId ? null : programId;

		if (expandedProgramId === programId) {
			const currentProgram = programs.find((program) => program.id === programId);

			sessionForm = {
				sessionDate: '',
				startTime: '',
				endTime: '',
				location: currentProgram?.location || '',
				capacity: '',
				notes: ''
			};
		}
	}

	function resetSessionForm() {
		sessionForm = {
			sessionDate: '',
			startTime: '',
			endTime: '',
			location: '',
			capacity: '',
			notes: ''
		};
	}

	function resetProgramForm() {
		newProgramForm = {
			programName: '',
			category: '',
			location: '',
			facilitator: '',
			isActive: 'true',
			notes: ''
		};
	}

	/** @param {Event} event */
	function handleNewProgramSubmit(event) {
		event.preventDefault();
		console.log('Create new program:', newProgramForm);
	}

	/** @param {Event} event */
	function handleSessionSubmit(event) {
		event.preventDefault();
		console.log('Create new session:', sessionForm, 'for program', expandedProgramId);
	}

	/** @param {string} dateString */
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-AU', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Browse Program</title>
</svelte:head>

<Header showLogout={true} />

<section class="programs-page">
	<SidebarNav currentKey="programs" staffRole={data?.staff?.staff_role ?? null} />

	<div class="main-content">
		<div class="page-header">
			<div>
				<h1>Browse Program</h1>
				<p>Filter existing programs, add new sessions, or register a brand new program.</p>
			</div>

			<a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
		</div>

		<div class="search-card">
			<div class="search-grid">
				<input
					type="text"
					placeholder="Search program, location or facilitator..."
					bind:value={searchText}
				/>

				<select bind:value={selectedCategory}>
					{#each categoryOptions as category}
						<option value={category}>
							{category === 'all' ? 'All program types' : category}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="section-block">
			<h2>Existing Programs</h2>

			{#if filteredPrograms.length === 0}
				<div class="empty-state">
					<h3>No matching programs found</h3>
					<p>Try another keyword or change the category filter.</p>
				</div>
			{:else}
				<div class="program-list">
					{#each filteredPrograms as program}
						<div class="program-card">
							<div class="program-header">
								<div class="program-header-left">
									<h3>{program.name}</h3>

									<div class="program-meta">
										<span class="category-badge">{program.category}</span>
										<span>{program.location}</span>
										<span>Facilitator: {program.facilitator}</span>
										<span>{program.isActive ? 'Active' : 'Inactive'}</span>
									</div>
								</div>

								<div class="program-actions">
									<button
										type="button"
										class="primary-btn"
										on:click={() => toggleProgram(program.id)}
									>
										{expandedProgramId === program.id ? 'Close Session Form' : 'Add Session'}
									</button>

									<button type="button" class="secondary-btn">
										Edit Program
									</button>
								</div>
							</div>

							<div class="session-preview">
								<h4>Recent Sessions</h4>

								{#if program.sessions.length === 0}
									<p class="muted-text">No sessions added yet.</p>
								{:else}
									<div class="session-list">
										{#each program.sessions as session}
											<div class="session-chip">
												{formatDate(session.date)} · {session.start}–{session.end} · {session.location} · capacity {session.capacity}
											</div>
										{/each}
									</div>
								{/if}
							</div>

							{#if expandedProgramId === program.id}
								<form class="session-form" on:submit={handleSessionSubmit}>
									<h4>Add New Session</h4>

									<div class="form-grid">
										<label>
											<span>Session date</span>
											<input type="date" bind:value={sessionForm.sessionDate} required />
										</label>

										<label>
											<span>Start time</span>
											<input type="time" bind:value={sessionForm.startTime} required />
										</label>

										<label>
											<span>End time</span>
											<input type="time" bind:value={sessionForm.endTime} required />
										</label>

										<label>
											<span>Capacity</span>
											<input type="number" min="1" bind:value={sessionForm.capacity} />
										</label>

										<label class="wide">
											<span>Location</span>
											<input bind:value={sessionForm.location} />
										</label>

										<label class="wide">
											<span>Notes</span>
											<textarea rows="3" bind:value={sessionForm.notes}></textarea>
										</label>
									</div>

									<div class="form-actions">
										<button type="button" class="secondary-btn" on:click={resetSessionForm}>
											Clear
										</button>
										<button type="submit" class="primary-btn">
											Save Session
										</button>
									</div>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<form class="new-program-card" on:submit={handleNewProgramSubmit}>
			<div class="section-title-row">
				<h2>New Program Registration</h2>

				<div class="form-actions">
					<button type="button" class="secondary-btn" on:click={resetProgramForm}>
						Clear form
					</button>
					<button type="submit" class="primary-btn">
						Save Program
					</button>
				</div>
			</div>

			<div class="form-grid">
				<label>
					<span>Program name</span>
					<input bind:value={newProgramForm.programName} required />
				</label>

				<label>
					<span>Category</span>
					<select bind:value={newProgramForm.category} required>
						<option value="">Select category</option>
						{#each categoryOptions.filter((item) => item !== 'all') as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Default location</span>
					<input bind:value={newProgramForm.location} />
				</label>

				<label>
					<span>Facilitator</span>
					<input bind:value={newProgramForm.facilitator} />
				</label>

				<label>
					<span>Status</span>
					<select bind:value={newProgramForm.isActive}>
						<option value="true">Active</option>
						<option value="false">Inactive</option>
					</select>
				</label>

				<label class="wide">
					<span>Notes</span>
					<textarea rows="4" bind:value={newProgramForm.notes}></textarea>
				</label>
			</div>
		</form>
	</div>
</section>

<style>
	:global(body) {
		margin: 0;
		background: #f5f7fb;
		font-family: Arial, Helvetica, sans-serif;
		color: #152238;
	}

	.programs-page {
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

	.search-card,
	.program-card,
	.new-program-card,
	.empty-state {
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
		box-sizing: border-box;
	}

	.search-card {
		margin-top: 28px;
		padding: 24px;
	}

	.search-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 16px;
	}

	input:not([type='checkbox']),
	select,
	textarea {
		width: 100%;
		padding: 14px 16px;
		font-size: 15px;
		border: 1px solid #d9d9d9;
		border-radius: 14px;
		box-sizing: border-box;
		outline: none;
		color: #152238;
		background: #ffffff;
	}

	input:focus,
	select:focus,
	textarea:focus {
		border-color: #a855f7;
		box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.12);
	}

	.section-block {
		margin-top: 28px;
	}

	.section-block h2,
	.new-program-card h2 {
		margin: 0 0 16px;
		font-size: 1.8rem;
		font-weight: 700;
		color: #152238;
	}

	.program-list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.program-card {
		padding: 24px;
	}

	.program-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
	}

	.program-header-left h3 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: #152238;
	}

	.program-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 12px;
		color: #4b5563;
		font-size: 15px;
	}

	.category-badge {
		padding: 6px 12px;
		border-radius: 999px;
		background: rgba(168, 85, 247, 0.12);
		color: #7e22ce;
		font-weight: 700;
	}

	.program-actions,
	.form-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.session-preview {
		margin-top: 20px;
		padding-top: 18px;
		border-top: 1px solid #ececec;
	}

	.session-preview h4,
	.session-form h4 {
		margin: 0 0 14px;
		font-size: 1.05rem;
		font-weight: 700;
		color: #152238;
	}

	.session-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.session-chip {
		padding: 12px 14px;
		border-radius: 14px;
		background: #faf7ff;
		border: 1px solid #eadcff;
		font-size: 14px;
		color: #4b5563;
	}

	.muted-text {
		margin: 0;
		font-size: 15px;
		color: #6b7280;
	}

	.session-form {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid #ececec;
	}

	.new-program-card {
		margin-top: 28px;
		padding: 24px;
	}

	.section-title-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 22px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(240px, 1fr));
		gap: 18px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-weight: 600;
		color: #152238;
	}

	.wide {
		grid-column: 1 / -1;
	}

	.primary-btn,
	.secondary-btn {
		padding: 12px 18px;
		border-radius: 14px;
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;
	}

	.primary-btn {
		border: none;
		background: #a855f7;
		color: #ffffff;
	}

	.primary-btn:hover {
		background: #9333ea;
	}

	.secondary-btn {
		border: 1px solid #d9d9d9;
		background: #ffffff;
		color: #152238;
	}

	.secondary-btn:hover,
	.dashboard-btn:hover {
		background: #f9fafb;
	}

	.empty-state {
		padding: 28px;
		text-align: center;
	}

	.empty-state h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 700;
		color: #152238;
	}

	.empty-state p {
		margin: 10px 0 0;
		color: #6b7280;
		font-size: 15px;
	}

	@media (max-width: 1100px) {
		.page-header,
		.program-header,
		.section-title-row {
			flex-direction: column;
			align-items: flex-start;
		}

		.search-grid,
		.form-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 900px) {
		.main-content {
			padding: 26px 18px 28px;
		}

		.page-header h1 {
			font-size: 2.2rem;
		}
	}
</style>