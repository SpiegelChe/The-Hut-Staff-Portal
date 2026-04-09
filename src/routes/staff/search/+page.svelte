<svelte:options runes={false} />

<script>
    /**
     * @typedef {{
     *   id: number,
     *   firstName: string,
     *   lastName: string,
     *   preferredName?: string,
     *   gender?: string,
     *   dob?: string,
     *   phone?: string,
     *   mobile?: string,
     *   email?: string,
     *   council?: string,
     *   township?: string,
     *   postcode?: string,
     *   address?: string,
     *   medicalNotes?: string,
     *   notes?: string,
     *   programs: string[],
     *   attendanceHistory: string[]
     * }} SearchParticipant
     */

    import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

	export let data;
	let searchText = '';
    /** @type {number | null} */
	let expandedParticipantId = null;
	let selectedProgramFilter = 'all';

	let participants = [
		{
			id: 1,
			firstName: 'Haoxin',
			lastName: 'Che',
			preferredName: 'Haoxin',
			gender: 'Male',
			dob: '2000-05-16',
			phone: '',
			mobile: '0400 000 001',
			email: 'haoxin@example.com',
			council: 'Adelaide Hills Council',
			township: 'Woodside',
			postcode: '5244',
			address: '12 Example Street',
			medicalNotes: 'N/A',
			notes: 'Initial seed participant',
			programs: ['Fun and Fitness', 'Community Shed'],
			attendanceHistory: ['24 Mar 2026 - Present', '26 Mar 2026 - Present']
		},
		{
			id: 2,
			firstName: 'Olivia',
			lastName: 'Brown',
			preferredName: '',
			gender: 'Female',
			dob: '1989-08-04',
			phone: '08 7000 1111',
			mobile: '0400 000 002',
			email: 'olivia.brown@example.com',
			council: 'Adelaide Hills Council',
			township: 'Hahndorf',
			postcode: '5245',
			address: '45 Sample Road',
			medicalNotes: 'Knee injury history',
			notes: 'Interested in Healthy Living programs',
			programs: ['Chi Kung Men’s Moves'],
			attendanceHistory: ['25 Mar 2026 - Present']
		}
	];

	$: programOptions = [
		'all',
		...new Set(participants.flatMap((participant) => participant.programs))
	];

	$: filteredParticipants = participants.filter((participant) => {
		const keyword = searchText.trim().toLowerCase();

		const matchesSearch =
			keyword === '' ||
			`${participant.firstName} ${participant.lastName}`.toLowerCase().includes(keyword) ||
			(participant.preferredName || '').toLowerCase().includes(keyword) ||
			(participant.email || '').toLowerCase().includes(keyword) ||
			(participant.mobile || '').toLowerCase().includes(keyword) ||
			(participant.township || '').toLowerCase().includes(keyword) ||
			(participant.postcode || '').toLowerCase().includes(keyword);

		const matchesProgram =
			selectedProgramFilter === 'all' ||
			participant.programs.includes(selectedProgramFilter);

		return matchesSearch && matchesProgram;
	});

    /** @param {number} participantId */
	function toggleParticipant(participantId) {
		expandedParticipantId = expandedParticipantId === participantId ? null : participantId;
	}

    /** @param {string | null | undefined} dateString */
	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-AU', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	}

    /** @param {SearchParticipant} participant */
	function handleUpdateParticipant(participant) {
		console.log('Update participant:', participant);
	}

    /** @param {SearchParticipant} participant */
	function handleAddToProgram(participant) {
		console.log('Add to program:', participant);
	}

    /** @param {SearchParticipant} participant */
	function handleViewHistory(participant) {
		console.log('View attendance history:', participant);
	}
</script>

<svelte:head>
	<title>Find Participant</title>
</svelte:head>

<Header showLogout={true} />

<section class="find-page">
	<SidebarNav currentKey="search" staffRole={data?.staff?.staff_role ?? null} />

	<div class="main-content">
		<div class="page-header">
			<div>
				<h1>Find Participant</h1>
				<p>Search existing participants and view detailed records.</p>
			</div>

			<a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
		</div>

		<div class="search-card">
			<div class="search-grid">
				<input
					type="text"
					placeholder="Search by name, email, phone, postcode or township..."
					bind:value={searchText}
				/>

				<select bind:value={selectedProgramFilter}>
					{#each programOptions as program}
						<option value={program}>
							{program === 'all' ? 'All programs' : program}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="result-list">
			{#if filteredParticipants.length === 0}
				<div class="empty-state">
					<h3>No matching participants found</h3>
					<p>Try another keyword or change the program filter.</p>
				</div>
			{:else}
				{#each filteredParticipants as participant}
					<div class="result-card">
						<button
							type="button"
							class="result-header"
							on:click={() => toggleParticipant(participant.id)}
						>
							<div class="result-header-left">
								<h3>{participant.firstName} {participant.lastName}</h3>
								<div class="result-meta">
									<span>{participant.email || 'No email'}</span>
									<span>{participant.mobile || 'No mobile'}</span>
									<span>{participant.township || 'No township'}</span>
									<span>{participant.postcode || 'No postcode'}</span>
								</div>
							</div>

							<div class="expand-indicator">
								{expandedParticipantId === participant.id ? '−' : '+'}
							</div>
						</button>

						{#if expandedParticipantId === participant.id}
							<div class="result-body">
								<div class="detail-grid">
									<div><strong>Preferred name:</strong> {participant.preferredName || 'N/A'}</div>
									<div><strong>Gender:</strong> {participant.gender || 'N/A'}</div>
									<div><strong>Date of birth:</strong> {formatDate(participant.dob)}</div>
									<div><strong>Phone:</strong> {participant.phone || 'N/A'}</div>
									<div><strong>Mobile:</strong> {participant.mobile || 'N/A'}</div>
									<div><strong>Email:</strong> {participant.email || 'N/A'}</div>
									<div><strong>Council:</strong> {participant.council || 'N/A'}</div>
									<div><strong>Township:</strong> {participant.township || 'N/A'}</div>
									<div><strong>Postcode:</strong> {participant.postcode || 'N/A'}</div>
									<div><strong>Address:</strong> {participant.address || 'N/A'}</div>
									<div class="wide-detail"><strong>Programs:</strong> {participant.programs.join(', ') || 'N/A'}</div>
									<div class="wide-detail"><strong>Medical notes:</strong> {participant.medicalNotes || 'N/A'}</div>
									<div class="wide-detail"><strong>Notes:</strong> {participant.notes || 'N/A'}</div>
									<div class="wide-detail"><strong>Attendance history:</strong> {participant.attendanceHistory.join(' | ')}</div>
								</div>

								<div class="card-actions">
									<button
										type="button"
										class="secondary-btn"
										on:click={() => handleUpdateParticipant(participant)}
									>
										Update participant info
									</button>

									<button
										type="button"
										class="primary-btn"
										on:click={() => handleAddToProgram(participant)}
									>
										Add to program
									</button>

									<button
										type="button"
										class="secondary-btn"
										on:click={() => handleViewHistory(participant)}
									>
										View attendance history
									</button>
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

	.find-page {
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
	.result-card,
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

	input,
	select {
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

	.result-list {
		margin-top: 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.result-header {
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

	.result-header-left h3 {
		margin: 0;
		font-size: 1.45rem;
		font-weight: 700;
		color: #152238;
	}

	.result-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 12px;
		color: #4b5563;
		font-size: 15px;
	}

	.expand-indicator {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		background: #fff7ed;
		color: #f97316;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.result-body {
		border-top: 1px solid #ececec;
		padding: 20px 24px 24px;
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(240px, 1fr));
		gap: 14px 18px;
		font-size: 15px;
		color: #4b5563;
	}

	.wide-detail {
		grid-column: 1 / -1;
	}

	.card-actions {
		margin-top: 18px;
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
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
		background: #f97316;
		color: #ffffff;
	}

	.secondary-btn {
		border: 1px solid #d9d9d9;
		background: #ffffff;
		color: #152238;
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
		.search-grid,
		.detail-grid {
			grid-template-columns: 1fr;
		}

		.result-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (max-width: 900px) {
		.page-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.main-content {
			padding: 26px 18px 28px;
		}

		.page-header h1 {
			font-size: 2.2rem;
		}
	}
</style>