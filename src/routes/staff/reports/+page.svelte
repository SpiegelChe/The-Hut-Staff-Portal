<svelte:options runes={false} />

<script>
	// @ts-nocheck
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';
	import hutLogo from '$lib/images/The-Hut-Logo-150px.png';

	let reportMode = 'monthly';
	let startDate = '2026-01-01';
	let endDate = '2026-03-31';
	let selectedCategory = 'all';
	let selectedProgram = 'all';
	let selectedAgeGroup = 'all';
	let selectedGender = 'all';
	let reportGenerated = false;

	const reportModes = [
		{ key: 'weekly', label: 'Weekly' },
		{ key: 'monthly', label: 'Monthly' },
		{ key: 'quarterly', label: 'Quarterly' },
		{ key: 'annually', label: 'Annually' },
		{ key: 'custom', label: 'Custom Range' }
	];

	const categoryOptions = [
		'all',
		'Healthy Living',
		'Low Income Support',
		'Interest & Social',
		'Young People',
		'Sustainability'
	];

	const ageGroupOptions = [
		'all',
		'0-17',
		'18-29',
		'30-44',
		'45-59',
		'60+'
	];

	const genderOptions = [
		'all',
		'Female',
		'Male',
		'Non-binary',
		'Prefer not to say'
	];

	let records = [
		{
			id: 1,
			participantName: 'Haoxin Che',
			program: 'Fun and Fitness',
			category: 'Healthy Living',
			date: '2026-03-24',
			ageGroup: '18-29',
			gender: 'Male',
			status: 'present'
		},
		{
			id: 2,
			participantName: 'Olivia Brown',
			program: 'Fun and Fitness',
			category: 'Healthy Living',
			date: '2026-03-24',
			ageGroup: '30-44',
			gender: 'Female',
			status: 'present'
		},
		{
			id: 3,
			participantName: 'Jack Wilson',
			program: 'Fun and Fitness',
			category: 'Healthy Living',
			date: '2026-03-24',
			ageGroup: '45-59',
			gender: 'Male',
			status: 'absent'
		},
		{
			id: 4,
			participantName: 'Ella Martin',
			program: 'Dungeons and Dragons',
			category: 'Young People',
			date: '2026-03-27',
			ageGroup: '0-17',
			gender: 'Female',
			status: 'present'
		},
		{
			id: 5,
			participantName: 'Sophie Green',
			program: 'Dungeons and Dragons',
			category: 'Young People',
			date: '2026-03-27',
			ageGroup: '0-17',
			gender: 'Female',
			status: 'present'
		},
		{
			id: 6,
			participantName: 'Benjamin Scott',
			program: 'Music Makers',
			category: 'Interest & Social',
			date: '2026-03-26',
			ageGroup: '60+',
			gender: 'Male',
			status: 'present'
		},
		{
			id: 7,
			participantName: 'Mason Lee',
			program: 'Music Makers',
			category: 'Interest & Social',
			date: '2026-03-26',
			ageGroup: '60+',
			gender: 'Male',
			status: 'present'
		},
		{
			id: 8,
			participantName: 'Olivia Brown',
			program: 'Chi Kung Men’s Moves',
			category: 'Healthy Living',
			date: '2026-03-25',
			ageGroup: '30-44',
			gender: 'Female',
			status: 'present'
		},
		{
			id: 9,
			participantName: 'Haoxin Che',
			program: 'Music Makers',
			category: 'Interest & Social',
			date: '2026-03-26',
			ageGroup: '18-29',
			gender: 'Male',
			status: 'present'
		},
		{
			id: 10,
			participantName: 'James Young',
			program: 'Repair Café',
			category: 'Sustainability',
			date: '2026-03-28',
			ageGroup: '45-59',
			gender: 'Male',
			status: 'present'
		},
		{
			id: 11,
			participantName: 'Noah Taylor',
			program: 'Chi Kung Men’s Moves',
			category: 'Healthy Living',
			date: '2026-03-25',
			ageGroup: '60+',
			gender: 'Male',
			status: 'present'
		},
		{
			id: 12,
			participantName: 'Olivia Brown',
			program: 'Fun and Fitness',
			category: 'Healthy Living',
			date: '2026-03-31',
			ageGroup: '30-44',
			gender: 'Female',
			status: 'present'
		}
	];

	$: programOptions = [
		'all',
		...new Set(
			records
				.filter((record) => selectedCategory === 'all' || record.category === selectedCategory)
				.map((record) => record.program)
		)
	];

	$: filteredRecords = records.filter((record) => {
		const matchesDate =
			(!startDate || record.date >= startDate) &&
			(!endDate || record.date <= endDate);

		const matchesCategory =
			selectedCategory === 'all' || record.category === selectedCategory;

		const matchesProgram =
			selectedProgram === 'all' || record.program === selectedProgram;

		const matchesAge =
			selectedAgeGroup === 'all' || record.ageGroup === selectedAgeGroup;

		const matchesGender =
			selectedGender === 'all' || record.gender === selectedGender;

		return matchesDate && matchesCategory && matchesProgram && matchesAge && matchesGender;
	});

	$: uniqueParticipants = [...new Set(filteredRecords.map((record) => record.participantName))];
	$: totalAttendances = filteredRecords.filter((record) => record.status === 'present').length;
	$: totalRegistrations = filteredRecords.length;
	$: attendanceRate = totalRegistrations === 0
		? 0
		: Math.round((totalAttendances / totalRegistrations) * 100);

	$: ageSummary = ageGroupOptions
		.filter((group) => group !== 'all')
		.map((group) => ({
			label: group,
			value: filteredRecords.filter((record) => record.ageGroup === group && record.status === 'present').length
		}));

	$: genderSummary = genderOptions
		.filter((group) => group !== 'all')
		.map((group) => ({
			label: group,
			value: filteredRecords.filter((record) => record.gender === group && record.status === 'present').length
		}));

	$: programSummary = [...new Set(filteredRecords.map((record) => record.program))].map((program) => {
		const programRows = filteredRecords.filter((record) => record.program === program);
		const presentRows = programRows.filter((record) => record.status === 'present');

		return {
			program,
			category: programRows[0]?.category || 'N/A',
			uniqueParticipants: new Set(programRows.map((record) => record.participantName)).size,
			attendances: presentRows.length,
			attendanceRate: programRows.length === 0 ? 0 : Math.round((presentRows.length / programRows.length) * 100)
		};
	});

	$: reportTitle = buildReportTitle();

	function buildReportTitle() {
		const modeLabel = reportModes.find((mode) => mode.key === reportMode)?.label || 'Custom Report';
		const categoryLabel = selectedCategory === 'all' ? 'All Program Types' : selectedCategory;
		const programLabel = selectedProgram === 'all' ? 'All Programs' : selectedProgram;

		return `${modeLabel} Report – ${categoryLabel} – ${programLabel}`;
	}

	function handlePreview() {
		reportGenerated = true;
	}

	function handleExport() {
		console.log('Export report:', {
			reportMode,
			startDate,
			endDate,
			selectedCategory,
			selectedProgram,
			selectedAgeGroup,
			selectedGender
		});
	}

	function setPresetRange(modeKey) {
		reportMode = modeKey;

		if (modeKey === 'weekly') {
			startDate = '2026-03-24';
			endDate = '2026-03-31';
		} else if (modeKey === 'monthly') {
			startDate = '2026-03-01';
			endDate = '2026-03-31';
		} else if (modeKey === 'quarterly') {
			startDate = '2026-01-01';
			endDate = '2026-03-31';
		} else if (modeKey === 'annually') {
			startDate = '2025-04-01';
			endDate = '2026-03-31';
		}
	}

	function getAgeChartBackground(summary) {
		const total = summary.reduce((sum, item) => sum + item.value, 0);

		if (total === 0) {
			return 'conic-gradient(#e5e7eb 0deg 360deg)';
		}

		const colors = ['#14b8a6', '#3b82f6', '#f97316', '#a855f7', '#22c55e'];
		let current = 0;

		const parts = summary.map((item, index) => {
			const portion = (item.value / total) * 360;
			const start = current;
			const end = current + portion;
			current = end;
			return `${colors[index]} ${start}deg ${end}deg`;
		});

		return `conic-gradient(${parts.join(', ')})`;
	}
</script>

<svelte:head>
	<title>View Reports</title>
</svelte:head>

<Header showLogout={true} />

<section class="reports-page">
	<SidebarNav currentKey="reports" />

	<div class="main-content">
		<div class="page-header">
			<div>
				<h1>View Reports</h1>
				<p>Build and preview reports by date range, program type, age group and gender.</p>
			</div>

			<a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
		</div>

		<div class="filters-card">
			<h2>Report Filters</h2>

			<div class="mode-row">
				{#each reportModes as mode}
					<button
						type="button"
						class:active={reportMode === mode.key}
						class="mode-btn"
						on:click={() => setPresetRange(mode.key)}
					>
						{mode.label}
					</button>
				{/each}
			</div>

			<div class="form-grid">
				<label>
					<span>Start date</span>
					<input type="date" bind:value={startDate} />
				</label>

				<label>
					<span>End date</span>
					<input type="date" bind:value={endDate} />
				</label>

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
					<span>Program</span>
					<select bind:value={selectedProgram}>
						{#each programOptions as program}
							<option value={program}>
								{program === 'all' ? 'All programs' : program}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Age Group</span>
					<select bind:value={selectedAgeGroup}>
						{#each ageGroupOptions as ageGroup}
							<option value={ageGroup}>
								{ageGroup === 'all' ? 'All age groups' : ageGroup}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Gender</span>
					<select bind:value={selectedGender}>
						{#each genderOptions as gender}
							<option value={gender}>
								{gender === 'all' ? 'All genders' : gender}
							</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="action-row">
				<button type="button" class="secondary-btn" on:click={handlePreview}>
					Preview Report
				</button>
				<button type="button" class="primary-btn" on:click={handleExport}>
					Export Report
				</button>
			</div>
		</div>

		{#if reportGenerated}
			<div class="report-preview">
				<div class="report-sheet">
					<div class="report-top">
						<div class="report-brand">
							<img src={hutLogo} alt="The Hut logo" />
							<div>
								<h2>The Hut Community Centre</h2>
								<p>{reportTitle}</p>
							</div>
						</div>

						<div class="report-period">
							<div><strong>From:</strong> {startDate || 'N/A'}</div>
							<div><strong>To:</strong> {endDate || 'N/A'}</div>
						</div>
					</div>

					<div class="summary-grid">
						<div class="summary-card">
							<h3>Unique Participants</h3>
							<p>{uniqueParticipants.length}</p>
						</div>

						<div class="summary-card">
							<h3>Total Attendances</h3>
							<p>{totalAttendances}</p>
						</div>

						<div class="summary-card">
							<h3>Total Records</h3>
							<p>{totalRegistrations}</p>
						</div>

						<div class="summary-card">
							<h3>Attendance Rate</h3>
							<p>{attendanceRate}%</p>
						</div>
					</div>

					<div class="viz-grid">
						<div class="viz-card">
							<h3>Age Distribution</h3>

							<div class="donut-wrap">
								<div
									class="donut-chart"
									style={`background: ${getAgeChartBackground(ageSummary)};`}
								>
									<div class="donut-hole"></div>
								</div>

								<div class="legend-list">
									{#each ageSummary as item}
										<div class="legend-item">
											<span>{item.label}</span>
											<strong>{item.value}</strong>
										</div>
									{/each}
								</div>
							</div>
						</div>

						<div class="viz-card">
							<h3>Gender Summary</h3>

							<div class="bar-list">
								{#each genderSummary as item}
									<div class="bar-row">
										<div class="bar-label">{item.label}</div>
										<div class="bar-track">
											<div
												class="bar-fill"
												style={`width: ${
													Math.max(
														item.value,
														genderSummary.reduce((max, row) => Math.max(max, row.value), 1)
													) === 0
														? 0
														: (item.value / genderSummary.reduce((max, row) => Math.max(max, row.value), 1)) * 100
												}%;`}
											></div>
										</div>
										<div class="bar-value">{item.value}</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="table-card">
						<h3>Program Summary Table</h3>

						<div class="table-wrap">
							<table>
								<thead>
									<tr>
										<th>Program</th>
										<th>Category</th>
										<th>Unique Participants</th>
										<th>Attendances</th>
										<th>Attendance Rate</th>
									</tr>
								</thead>
								<tbody>
									{#if programSummary.length === 0}
										<tr>
											<td colspan="5">No data available for the selected filters.</td>
										</tr>
									{:else}
										{#each programSummary as row}
											<tr>
												<td>{row.program}</td>
												<td>{row.category}</td>
												<td>{row.uniqueParticipants}</td>
												<td>{row.attendances}</td>
												<td>{row.attendanceRate}%</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	:global(body) {
		margin: 0;
		background: #f5f7fb;
		font-family: Arial, Helvetica, sans-serif;
		color: #152238;
	}

	.reports-page {
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

	.filters-card,
	.report-sheet {
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
		box-sizing: border-box;
	}

	.filters-card {
		margin-top: 28px;
		padding: 24px;
	}

	.filters-card h2 {
		margin: 0 0 16px;
		font-size: 1.8rem;
		font-weight: 700;
		color: #152238;
	}

	.mode-row {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 20px;
	}

	.mode-btn {
		padding: 10px 16px;
		border: 1px solid #d9d9d9;
		border-radius: 999px;
		background: #ffffff;
		color: #152238;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
	}

	.mode-btn.active {
		background: rgba(20, 184, 166, 0.12);
		border-color: #14b8a6;
		color: #0f766e;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(220px, 1fr));
		gap: 18px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-weight: 600;
		color: #152238;
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

	input:focus,
	select:focus {
		border-color: #14b8a6;
		box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.12);
	}

	.action-row {
		display: flex;
		gap: 12px;
		margin-top: 24px;
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
		background: #14b8a6;
		color: #ffffff;
	}

	.primary-btn:hover {
		background: #0f9b8e;
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

	.report-preview {
		margin-top: 28px;
	}

	.report-sheet {
		padding: 28px;
	}

	.report-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid #ececec;
	}

	.report-brand {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.report-brand img {
		width: 90px;
		height: auto;
		object-fit: contain;
		flex-shrink: 0;
	}

	.report-brand h2 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: #152238;
	}

	.report-brand p {
		margin: 8px 0 0;
		font-size: 15px;
		color: #4b5563;
	}

	.report-period {
		font-size: 14px;
		color: #4b5563;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.summary-grid {
		margin-top: 24px;
		display: grid;
		grid-template-columns: repeat(4, minmax(180px, 1fr));
		gap: 16px;
	}

	.summary-card,
	.viz-card,
	.table-card {
		background: #fafafa;
		border: 1px solid #ececec;
		border-radius: 20px;
		padding: 20px;
		box-sizing: border-box;
	}

	.summary-card h3 {
		margin: 0;
		font-size: 15px;
		color: #475569;
	}

	.summary-card p {
		margin: 12px 0 0;
		font-size: 2rem;
		font-weight: 800;
		color: #152238;
	}

	.viz-grid {
		margin-top: 24px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.viz-card h3,
	.table-card h3 {
		margin: 0 0 16px;
		font-size: 1.2rem;
		font-weight: 700;
		color: #152238;
	}

	.donut-wrap {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	.donut-chart {
		width: 180px;
		height: 180px;
		border-radius: 50%;
		position: relative;
		flex-shrink: 0;
	}

	.donut-hole {
		position: absolute;
		inset: 32px;
		background: #ffffff;
		border-radius: 50%;
	}

	.legend-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		font-size: 15px;
		color: #475569;
	}

	.bar-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 150px 1fr 50px;
		gap: 12px;
		align-items: center;
	}

	.bar-label,
	.bar-value {
		font-size: 14px;
		color: #475569;
	}

	.bar-track {
		height: 16px;
		background: #e5e7eb;
		border-radius: 999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		background: #14b8a6;
		border-radius: 999px;
	}

	.table-card {
		margin-top: 24px;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	th,
	td {
		padding: 12px 14px;
		border-bottom: 1px solid #e5e7eb;
		text-align: left;
	}

	th {
		background: #f8fafc;
		color: #334155;
		font-weight: 700;
	}

	td {
		color: #475569;
	}

	@media (max-width: 1200px) {
		.form-grid,
		.summary-grid,
		.viz-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 1000px) {
		.page-header,
		.report-top {
			flex-direction: column;
			align-items: flex-start;
		}

		.form-grid,
		.summary-grid,
		.viz-grid {
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

		.bar-row {
			grid-template-columns: 1fr;
		}
	}
</style>