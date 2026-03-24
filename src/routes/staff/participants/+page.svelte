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
     *   medicalNotes?: string,
     *   notes?: string
     * }} Participant
     */

	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

	let searchText = '';

	const councilOptions = ['Adelaide Hills Council', 'Other'];

	const townshipOptions = [
		'Aldgate',
		'Balhannah',
		'Birdwood',
		'Bridgewater',
		'Carey Gully',
		'Cherryville',
		'Crafers',
		'Cudlee Creek',
		'Echunga',
		'Forest Range',
		'Gumeracha',
		'Hahndorf',
		'Heathfield',
		'Ironbank',
		'Kersbrook',
		'Lenswood',
		'Lobethal',
		'Longwood',
		'Macclesfield',
		'Mylor',
		'Nairne',
		'Norton Summit',
		'Oakbank',
		'Piccadilly',
		'Scott Creek',
		'Stirling',
		'Summertown',
		'Uraidla',
		'Verdun',
		'Woodside',
		'Other'
	];

	const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
	const monthOptions = [
		'01', '02', '03', '04', '05', '06',
		'07', '08', '09', '10', '11', '12'
	];
	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

	let formData = {
		title: '',
		firstName: '',
		lastName: '',
		preferredName: '',
		gender: '',
		birthDay: '',
		birthMonth: '',
		birthYear: '',

		homePhone: '',
		mobile: '',
		email: '',

		addressLine1: '',
		addressLine2: '',
		council: '',
		councilOther: '',
		township: '',
		townshipOther: '',
		postcode: '',

		membershipType: '',

		isAtsi: '',
		countryOfBirth: '',
		languageOtherThanEnglish: '',
		isCald: '',
		additionalSupportRequired: '',
		additionalSupportDetails: '',

		emergency1Name: '',
		emergency1Relationship: '',
		emergency1Phone: '',
		emergency2Name: '',
		emergency2Relationship: '',
		emergency2Phone: '',

		guardianName: '',
		guardianPhone: '',
		medicalNotes: '',
		notes: '',

		consentInfoCorrect: false,
		consentPrivacy: false,
		consentInfoSharing: false,
		consentDataUse: false
	};

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
			township: 'Mount Barker',
			postcode: '5251',
			medicalNotes: 'N/A',
			notes: 'Initial seed participant'
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
			medicalNotes: 'Knee injury history',
			notes: 'Interested in Healthy Living programs'
		},
		{
			id: 3,
			firstName: 'Jack',
			lastName: 'Wilson',
			preferredName: 'Jack',
			gender: 'Male',
			dob: '1975-11-20',
			phone: '08 7000 2222',
			mobile: '0400 000 003',
			email: 'jack.wilson@example.com',
			council: 'Other',
			township: 'Other',
			postcode: '5157',
			medicalNotes: '',
			notes: 'Requires transport assistance'
		}
	];

	$: filteredParticipants = participants.filter((participant) => {
		const keyword = searchText.trim().toLowerCase();

		if (keyword === '') return [];

		const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
		const preferredName = (participant.preferredName || '').toLowerCase();
		const email = (participant.email || '').toLowerCase();
		const township = (participant.township || '').toLowerCase();

		return (
			fullName.includes(keyword) ||
			preferredName.includes(keyword) ||
			email.includes(keyword) ||
			township.includes(keyword)
		);
	});

	function resetForm() {
		formData = {
			title: '',
		firstName: '',
		lastName: '',
		preferredName: '',
		gender: '',
		birthDay: '',
		birthMonth: '',
		birthYear: '',

		homePhone: '',
		mobile: '',
		email: '',

		addressLine1: '',
		addressLine2: '',
		council: '',
		councilOther: '',
		township: '',
		townshipOther: '',
		postcode: '',

		membershipType: '',

		isAtsi: '',
		countryOfBirth: '',
		languageOtherThanEnglish: '',
		isCald: '',
		additionalSupportRequired: '',
		additionalSupportDetails: '',

		emergency1Name: '',
		emergency1Relationship: '',
		emergency1Phone: '',
		emergency2Name: '',
		emergency2Relationship: '',
		emergency2Phone: '',

		guardianName: '',
		guardianPhone: '',
		medicalNotes: '',
		notes: '',

		consentInfoCorrect: false,
		consentPrivacy: false,
		consentInfoSharing: false,
		consentDataUse: false
		};
	}

    /** @param {Event} event */
	function handleSubmit(event) {
		event.preventDefault();
		console.log('Form submitted:', formData);
	}
</script>

<svelte:head>
	<title>Add Participant</title>
</svelte:head>

<Header showLogout={true} />

<section class="participants-page">
	<SidebarNav currentKey="participants" />

	<div class="main-content">
		<div class="page-header">
			<div>
				<h1>Add Participant</h1>
				<p>Search participants instantly, register a new participant, or update an existing profile.</p>
			</div>

			<a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
		</div>

		<div class="search-card">
			<input
				type="text"
				placeholder="Search participant by name, email or township..."
				bind:value={searchText}
			/>
		</div>

		<div class="results-section">
	        <div class="results-header">
		        <h2>Search Results</h2>
	        </div>

	        {#if searchText.trim() === ''}
		        <div class="empty-state compact">
			        <h3>Start typing to search participants</h3>
			        <p>Basic matching records will appear here.</p>
		        </div>
	        {:else if filteredParticipants.length === 0}
		        <div class="empty-state compact">
			        <h3>No matching participants found</h3>
			        <p>You can continue with the registration form below.</p>
		        </div>
	        {:else}
		        <div class="result-list">
			        {#each filteredParticipants as participant}
				        <div class="result-card simple-card">
					        <div class="result-simple-header">
						        <h3>{participant.firstName} {participant.lastName}</h3>
						        {#if participant.preferredName}
							        <p class="preferred-name">Preferred name: {participant.preferredName}</p>
						        {/if}
					        </div>

					        <div class="result-meta simple-meta">
						        <span>{participant.email || 'No email'}</span>
						        <span>{participant.mobile || 'No mobile'}</span>
						        <span>{participant.township || 'No township'}</span>
						        <span>{participant.postcode || 'No postcode'}</span>
					        </div>
				        </div>
			        {/each}
		        </div>
	        {/if}
        </div>

		<form class="form-card" on:submit={handleSubmit}>
			<div class="section-title-row">
				<h2>Participant Registration</h2>
				<div class="form-actions-top">
					<button type="button" class="secondary-btn" on:click={resetForm}>Clear form</button>
					<button type="submit" class="primary-btn">Save participant</button>
				</div>
			</div>

			<div class="form-grid">
				<label>
					<span>Title</span>
					<select bind:value={formData.title}>
						<option value="">Select title</option>
						<option value="Mr">Mr</option>
						<option value="Mrs">Mrs</option>
						<option value="Ms">Ms</option>
						<option value="Miss">Miss</option>
						<option value="Dr">Dr</option>
						<option value="Mx">Mx</option>
						<option value="Other">Other</option>
					</select>
				</label>

				<label>
					<span>First name</span>
					<input bind:value={formData.firstName} required />
				</label>

				<label>
					<span>Last name</span>
					<input bind:value={formData.lastName} />
				</label>

				<label>
					<span>Preferred name</span>
					<input bind:value={formData.preferredName} />
				</label>

				<label>
					<span>Gender</span>
					<select bind:value={formData.gender}>
						<option value="">Select gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Non-binary">Non-binary</option>
						<option value="Prefer not to say">Prefer not to say</option>
						<option value="Other">Other</option>
					</select>
				</label>
			</div>

			<div class="dob-block">
				<span class="block-label">Date of birth</span>
				<div class="dob-row">
					<select bind:value={formData.birthDay}>
						<option value="">Day</option>
						{#each dayOptions as day}
							<option value={day}>{day}</option>
						{/each}
					</select>

					<select bind:value={formData.birthMonth}>
						<option value="">Month</option>
						{#each monthOptions as month}
							<option value={month}>{month}</option>
						{/each}
					</select>

					<select bind:value={formData.birthYear}>
						<option value="">Year</option>
						{#each yearOptions as year}
							<option value={year}>{year}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="form-grid">
				<label>
					<span>Home Phone</span>
					<input bind:value={formData.homePhone} />
				</label>

				<label>
					<span>Mobile</span>
					<input bind:value={formData.mobile} />
				</label>

				<label class="wide">
					<span>Email</span>
					<input type="email" bind:value={formData.email} />
				</label>
			</div>

			<div class="form-grid">
				<label class="wide">
					<span>Address line 1</span>
					<input bind:value={formData.addressLine1} />
				</label>

				<label class="wide">
					<span>Address line 2</span>
					<input bind:value={formData.addressLine2} />
				</label>
			</div>

			<div class="form-grid">
				<label>
					<span>Council</span>
					<select bind:value={formData.council}>
						<option value="">Select council</option>
						{#each councilOptions as council}
							<option value={council}>{council}</option>
						{/each}
					</select>
				</label>

				{#if formData.council === 'Other'}
					<label>
						<span>Other council</span>
						<input bind:value={formData.councilOther} />
					</label>
				{/if}

				<label>
					<span>Township</span>
					<select bind:value={formData.township}>
						<option value="">Select township</option>
						{#each townshipOptions as township}
							<option value={township}>{township}</option>
						{/each}
					</select>
				</label>

				{#if formData.township === 'Other'}
					<label>
						<span>Other township</span>
						<input bind:value={formData.townshipOther} />
					</label>
				{/if}

				<label>
					<span>Postcode</span>
					<input bind:value={formData.postcode} />
				</label>
			</div>

			<div class="subsection">
				<h3>Demographic / Background</h3>

				<div class="form-grid">
					<label>
						<span>Aboriginal or Torres Strait Islander</span>
						<select bind:value={formData.isAtsi}>
							<option value="">Select</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
							<option value="prefer_not_to_say">Prefer not to say</option>
						</select>
					</label>

					<label>
						<span>Country of birth</span>
						<input bind:value={formData.countryOfBirth} />
					</label>

					<label>
						<span>Language other than English</span>
						<select bind:value={formData.languageOtherThanEnglish}>
							<option value="">Select</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
					</label>

					<label>
						<span>CALD background</span>
						<select bind:value={formData.isCald}>
							<option value="">Select</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
							<option value="prefer_not_to_say">Prefer not to say</option>
						</select>
					</label>

					<label>
						<span>Additional support required</span>
						<select bind:value={formData.additionalSupportRequired}>
							<option value="">Select</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
					</label>

					{#if formData.additionalSupportRequired === 'yes'}
						<label class="wide">
							<span>Additional support details</span>
							<textarea rows="3" bind:value={formData.additionalSupportDetails}></textarea>
						</label>
					{/if}
				</div>
			</div>

			<div class="subsection">
				<h3>Membership / Registration</h3>

				<div class="form-grid">
					<label>
						<span>Membership type</span>
						<select bind:value={formData.membershipType}>
							<option value="">Select membership type</option>
							<option value="annual">Annual Membership</option>
							<option value="quarterly">Quarterly – 3 months</option>
							<option value="other">Other</option>
						</select>
					</label>
				</div>
			</div>

			<div class="subsection">
				<h3>Emergency Contact 1</h3>
				<div class="form-grid">
					<label>
						<span>Name</span>
						<input bind:value={formData.emergency1Name} />
					</label>

					<label>
						<span>Relationship</span>
						<input bind:value={formData.emergency1Relationship} />
					</label>

					<label>
						<span>Phone</span>
						<input bind:value={formData.emergency1Phone} />
					</label>
				</div>
			</div>

			<div class="subsection">
				<h3>Emergency Contact 2</h3>
				<div class="form-grid">
					<label>
						<span>Name</span>
						<input bind:value={formData.emergency2Name} />
					</label>

					<label>
						<span>Relationship</span>
						<input bind:value={formData.emergency2Relationship} />
					</label>

					<label>
						<span>Phone</span>
						<input bind:value={formData.emergency2Phone} />
					</label>
				</div>
			</div>

			<div class="subsection">
				<h3>Guardian / Additional Info</h3>
				<div class="form-grid">
					<label>
						<span>Guardian name</span>
						<input bind:value={formData.guardianName} />
					</label>

					<label>
						<span>Guardian phone</span>
						<input bind:value={formData.guardianPhone} />
					</label>

					<label class="wide">
						<span>Medical notes</span>
						<textarea rows="3" bind:value={formData.medicalNotes}></textarea>
					</label>

					<label class="wide">
						<span>Notes</span>
						<textarea rows="3" bind:value={formData.notes}></textarea>
					</label>
				</div>
			</div>

			<div class="subsection">
				<h3>Member Consent</h3>

				<div class="consent-list">
					<label class="checkbox-row">
						<input type="checkbox" bind:checked={formData.consentInfoCorrect} />
						<span>I confirm the information provided is true and correct.</span>
					</label>

					<label class="checkbox-row">
						<input type="checkbox" bind:checked={formData.consentPrivacy} />
						<span>I have read and understood the privacy information.</span>
					</label>

					<label class="checkbox-row">
						<input type="checkbox" bind:checked={formData.consentInfoSharing} />
						<span>I understand the Information Sharing Guidelines.</span>
					</label>

					<label class="checkbox-row">
						<input type="checkbox" bind:checked={formData.consentDataUse} />
						<span>I consent to The Hut storing and using this information to process my registration and provide services safely.</span>
					</label>
				</div>
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

	.participants-page {
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

	.search-card,
	.form-card,
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

	.search-card input,
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

	.search-card input:focus,
	input:focus,
	select:focus,
	textarea:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
	}

	.results-section {
		margin-top: 20px;
	}

	.results-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 16px;
	}

	.results-header h2,
	.form-card h2 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: 700;
		color: #152238;
	}

	.result-list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.result-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 12px;
		color: #4b5563;
		font-size: 15px;
	}

    .simple-card {
	    padding: 22px 24px;
    }

    .result-simple-header h3 {
	    margin: 0;
	    font-size: 1.45rem;
    	font-weight: 700;
    	color: #152238;
    }

    .preferred-name {
	    margin: 10px 0 0;
	    font-size: 15px;
	    color: #4b5563;
    }

    .simple-meta {
	    margin-top: 14px;
    }

	.empty-state {
		padding: 28px;
		text-align: center;
	}

	.empty-state.compact h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 700;
		color: #152238;
	}

	.empty-state.compact p {
		margin: 10px 0 0;
		color: #6b7280;
		font-size: 15px;
	}

	.form-card {
		margin-top: 28px;
		padding: 24px;
	}

	.section-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 22px;
	}

	.form-actions-top {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(240px, 1fr));
		gap: 18px;
		margin-bottom: 18px;
	}

	.wide {
		grid-column: 1 / -1;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-weight: 600;
		color: #152238;
	}

	.dob-block {
		margin-bottom: 18px;
	}

	.block-label {
		display: block;
		font-weight: 600;
		margin-bottom: 8px;
		color: #152238;
	}

	.dob-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	.subsection {
		margin-top: 10px;
		padding-top: 18px;
		border-top: 1px solid #ececec;
	}

	.subsection h3 {
		margin: 0 0 16px;
		font-size: 1.15rem;
		font-weight: 700;
		color: #152238;
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
		background: #3b82f6;
		color: #ffffff;
	}

	.primary-btn:hover {
		background: #2563eb;
	}

	.secondary-btn {
		border: 1px solid #d9d9d9;
		background: #ffffff;
		color: #152238;
	}

	.secondary-btn:hover {
		background: #f9fafb;
	}

	.consent-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-top: 8px;
	}

	.checkbox-row {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 12px;
		font-weight: 500;
		line-height: 1.5;
		cursor: pointer;
	}

	.checkbox-row input[type='checkbox'] {
		width: 18px;
		height: 18px;
		margin: 2px 0 0 0;
		padding: 0;
		flex-shrink: 0;
		accent-color: #3b82f6;
	}

	.checkbox-row span {
		flex: 1;
	}

	@media (max-width: 1100px) {
	    .page-header,
    	.results-header,
    	.section-title-row {
		    flex-direction: column;
		    align-items: flex-start;
	    }

	    .form-grid {
	    	grid-template-columns: 1fr;
	    }

	    .dob-row {
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