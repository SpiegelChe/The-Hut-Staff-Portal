<svelte:options runes={false} />

<script>
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

	export let data;
	let searchText = '';
	let selectedCategory = 'all';
	let selectedDate = 'all';
    /** @type {number | null} */
	let expandedProgramId = null;

	let programs = [
		{
			id: 1,
			name: 'Fun and Fitness',
			category: 'Healthy Living',
			date: '2026-03-24',
			location: 'The Hut Community Centre',
			participants: [
				{ id: 101, name: 'Haoxin Che', checked: true },
				{ id: 102, name: 'Olivia Brown', checked: false },
				{ id: 103, name: 'Jack Wilson', checked: false }
			]
		},
		{
			id: 2,
			name: 'Chi Kung Men’s Moves',
			category: 'Healthy Living',
			date: '2026-03-25',
			location: 'The Hut Community Centre',
			participants: [
				{ id: 104, name: 'Liam Smith', checked: true },
				{ id: 105, name: 'Noah Taylor', checked: false }
			]
		},
		{
			id: 3,
			name: 'Community Shed',
			category: 'Interest & Social',
			date: '2026-03-26',
			location: 'The Hut Community Centre',
			participants: [
				{ id: 106, name: 'Ethan Harris', checked: false },
				{ id: 107, name: 'Mason Lee', checked: true },
				{ id: 108, name: 'Lucas White', checked: false }
			]
		}
	];

	$: categoryOptions = ['all', ...new Set(programs.map((program) => program.category))];
	$: dateOptions = ['all', ...new Set(programs.map((program) => program.date))];

	$: filteredPrograms = programs.filter((program) => {
		const keyword = searchText.trim().toLowerCase();

		const matchesSearch =
			keyword === '' ||
			program.name.toLowerCase().includes(keyword) ||
			program.location.toLowerCase().includes(keyword);

		const matchesCategory =
			selectedCategory === 'all' || program.category === selectedCategory;

		const matchesDate =
			selectedDate === 'all' || program.date === selectedDate;

		return matchesSearch && matchesCategory && matchesDate;
	});

    /** @param {number} programId */
	function toggleProgram(programId) {
		expandedProgramId = expandedProgramId === programId ? null : programId;
	}

    /** @param {string} dateString */
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-AU', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

    /** @param {{ checked: boolean }[]} participants */
	function getCheckedCount(participants) {
		return participants.filter((participant) => participant.checked).length;
	}
</script>

<svelte:head>
	<title>Tick Attendance</title>
</svelte:head>

<Header showLogout={true} />

<section class="attendance-page">
	<SidebarNav currentKey="attendance" staffRole={data?.staff?.staff_role ?? null} />

	<div class="main-content">
		<div class="page-header">
	        <div>
		        <h1>Tick Attendance</h1>
		        <p>Search a program, filter it, and tick the participants who attended.</p>
	        </div>

	        <a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
        </div>

		<div class="controls-card">
			<div class="search-row">
				<input
					type="text"
					placeholder="Search program or location..."
					bind:value={searchText}
				/>
			</div>

			<div class="filter-row">
				<label>
					<span>Program Type</span>
					<select bind:value={selectedCategory}>
						{#each categoryOptions as category}
							<option value={category}>
								{category === 'all' ? 'All program types' : category}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Program Date</span>
					<select bind:value={selectedDate}>
						{#each dateOptions as date}
							<option value={date}>
								{date === 'all' ? 'All dates' : formatDate(date)}
							</option>
						{/each}
					</select>
				</label>
			</div>
		</div>

		<div class="program-list">
			{#if filteredPrograms.length === 0}
				<div class="empty-state">
					<h3>No matching programs found</h3>
					<p>Try another keyword or adjust the filters above.</p>
				</div>
			{:else}
				{#each filteredPrograms as program}
					<div class="program-card">
						<button
							type="button"
							class="program-header"
							on:click={() => toggleProgram(program.id)}
						>
							<div class="program-header-left">
								<h2>{program.name}</h2>
								<div class="meta-row">
									<span class="category-badge">{program.category}</span>
									<span>{formatDate(program.date)}</span>
									<span>{program.location}</span>
								</div>
							</div>

							<div class="program-header-right">
								<div class="attendance-summary">
									{getCheckedCount(program.participants)}/{program.participants.length} ticked
								</div>
								<div class="expand-indicator">
									{expandedProgramId === program.id ? '−' : '+'}
								</div>
							</div>
						</button>

						{#if expandedProgramId === program.id}
							<div class="participant-list">
								{#each program.participants as participant}
									<label class="participant-row">
										<input type="checkbox" bind:checked={participant.checked} />
										<span>{participant.name}</span>
									</label>
								{/each}

								<div class="list-footer">
									<button type="button" class="save-btn">Save Attendance</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
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

	.attendance-page {
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
	    gap: 16px;
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

	.controls-card,
	.program-card,
	.empty-state {
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
		box-sizing: border-box;
	}

	.controls-card {
		margin-top: 28px;
		padding: 24px;
	}

	.search-row input {
		width: 100%;
		padding: 15px 16px;
		font-size: 15px;
		border: 1px solid #d9d9d9;
		border-radius: 14px;
		box-sizing: border-box;
		outline: none;
		color: #152238;
		background: #ffffff;
	}

	.search-row input:focus,
	select:focus {
		border-color: #22c55e;
		box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
	}

	.filter-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
		margin-top: 18px;
	}

	.filter-row label {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-weight: 600;
		color: #152238;
	}

	select {
		padding: 14px 16px;
		font-size: 15px;
		border: 1px solid #d9d9d9;
		border-radius: 14px;
		background: #ffffff;
		outline: none;
		color: #152238;
	}

	.program-list {
		margin-top: 28px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.program-header {
		width: 100%;
		border: none;
		background: transparent;
		padding: 22px 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		text-align: left;
		cursor: pointer;
	}

	.program-header-left h2 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: #152238;
	}

	.meta-row {
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
		background: rgba(34, 197, 94, 0.12);
		color: #15803d;
		font-weight: 700;
	}

	.program-header-right {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-shrink: 0;
	}

	.attendance-summary {
		font-size: 14px;
		font-weight: 600;
		color: #4b5563;
	}

	.expand-indicator {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		background: #ecfdf5;
		color: #15803d;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26px;
		font-weight: 700;
	}

	.participant-list {
		border-top: 1px solid #ececec;
		padding: 10px 24px 24px;
	}

	.participant-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 0;
		border-bottom: 1px solid #f0f0f0;
		font-size: 16px;
		color: #152238;
	}

	.participant-row input {
		width: 20px;
		height: 20px;
		accent-color: #22c55e;
	}

	.list-footer {
		display: flex;
		justify-content: flex-end;
		padding-top: 18px;
	}

	.save-btn {
		padding: 12px 20px;
		border: none;
		border-radius: 14px;
		background: #22c55e;
		color: #ffffff;
		font-weight: 700;
		font-size: 15px;
		cursor: pointer;
	}

	.save-btn:hover {
		background: #16a34a;
	}

	.empty-state {
		padding: 32px;
		text-align: center;
	}

	.empty-state h3 {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 700;
		color: #152238;
	}

	.empty-state p {
		margin: 10px 0 0;
		color: #6b7280;
		font-size: 15px;
	}

	@media (max-width: 1100px) {
		.filter-row {
			grid-template-columns: 1fr;
		}

		.program-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.program-header-right {
			width: 100%;
			justify-content: space-between;
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