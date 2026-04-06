<svelte:options runes={false} />

<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {any} */
	let supabase;
	$: supabase = data?.supabase;

	
	/**
	 * @typedef {{
	 * 	township_id: string,
	 * 	township_name: string,
	 * 	postcode: string | null,
	 * 	sort_order: number | null
	 * }} Township
	 */

	/**
	 * @typedef {{
	 * 	program_id: string,
	 * 	program_name: string,
	 * 	category: string | null,
	 * 	location: string | null,
	 * 	start_date: string | null,
	 * 	end_date: string | null,
	 * 	is_active: boolean
	 * }} ProgramRecord
	 */

	/**
	 * @typedef {{
	 * 	participant_id: string,
	 * 	first_name: string,
	 * 	last_name: string | null,
	 * 	preferred_name: string | null,
	 * 	email: string | null,
	 * 	mobile: string | null,
	 * 	postcode: string | null,
	 * 	township_id: string | null,
	 * 	township_other: string | null,
	 * 	council_other: string | null
	 * }} SearchParticipant
	 */

	/**
	 * @typedef {{
	 * 	membershipType: string,
	 * 	status: string,
	 * 	programParticipationConsent: boolean,
	 * 	parentGuardianConsent: boolean,
	 * 	medicalRiskAcknowledged: boolean,
	 * 	ambulanceAuthorisation: boolean,
	 * 	photoConsentForProgram: boolean,
	 * 	programNotes: string,
	 * 	additionalInfo: string
	 * }} ProgramDetails
	 */

	/**
	 * @typedef {{
	 * 	title: string,
	 * 	firstName: string,
	 * 	lastName: string,
	 * 	preferredName: string,
	 * 	gender: string,
	 * 	birthDay: string,
	 * 	birthMonth: string,
	 * 	birthYear: string,
	 * 	homePhone: string,
	 * 	mobile: string,
	 * 	email: string,
	 * 	addressLine1: string,
	 * 	addressLine2: string,
	 * 	council: string,
	 * 	councilOther: string,
	 * 	townshipId: string,
	 * 	townshipOther: string,
	 * 	postcode: string,
	 * 	isAtsi: string,
	 * 	countryOfBirth: string,
	 * 	languageOtherThanEnglish: string,
	 * 	languageDetails: string,
	 * 	isCald: string,
	 * 	additionalSupportRequired: string,
	 * 	additionalSupportDetails: string,
	 * 	transportRequired: string,
	 * 	transportDetails: string,
	 * 	emergency1Name: string,
	 * 	emergency1Relationship: string,
	 * 	emergency1Phone: string,
	 * 	emergency2Name: string,
	 * 	emergency2Relationship: string,
	 * 	emergency2Phone: string,
	 * 	guardianName: string,
	 * 	guardianPhone: string,
	 * 	medicalNotes: string,
	 * 	notes: string,
	 * 	consentInfoCorrect: boolean,
	 * 	consentPrivacy: boolean,
	 * 	consentInfoSharing: boolean,
	 * 	consentEmergencyContact: boolean,
	 * 	consentPhotoGeneral: boolean,
	 * 	selectedProgramIds: string[],
	 * 	programSpecificData: Record<string, ProgramDetails>
	 * }} FormData
	 */

	const TITLE_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Mx', 'Other'];
	const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'];
	const YES_NO_OPTIONS = [
		{ value: '', label: 'Select' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const ATSI_OPTIONS = [
		{ value: '', label: 'Select' },
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'prefer_not_to_say', label: 'Prefer not to say' }
	];
	const COUNCIL_OPTIONS = ['Adelaide Hills Council', 'Others'];
	const MEMBERSHIP_OPTIONS = ['standard', 'supported', 'other'];
	const COUNTRY_OPTIONS = [
		'Australia', 'Afghanistan', 'Argentina', 'Bangladesh', 'Brazil', 'Cambodia', 'Canada', 'China', 'Colombia',
		'Egypt', 'Fiji', 'France', 'Germany', 'Greece', 'Hong Kong', 'India', 'Indonesia', 'Iran', 'Iraq',
		'Ireland', 'Italy', 'Japan', 'Kenya', 'Lebanon', 'Malaysia', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand',
		'Nigeria', 'Pakistan', 'Papua New Guinea', 'Philippines', 'Poland', 'Singapore', 'South Africa', 'South Korea',
		'Sri Lanka', 'Sudan', 'Syria', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States',
		'Vietnam', 'Zimbabwe'
	];
	const REGISTRATION_STATUS_OPTIONS = ['active', 'waitlist', 'withdrawn', 'completed'];
	const dayOptions = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
	const monthOptions = [
		{ value: '01', label: 'January' },
		{ value: '02', label: 'February' },
		{ value: '03', label: 'March' },
		{ value: '04', label: 'April' },
		{ value: '05', label: 'May' },
		{ value: '06', label: 'June' },
		{ value: '07', label: 'July' },
		{ value: '08', label: 'August' },
		{ value: '09', label: 'September' },
		{ value: '10', label: 'October' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'December' }
	];
	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
	const TOTAL_STEPS = 3;

	/** @returns {ProgramDetails} */
	function emptyProgramDetails() {
		return {
			membershipType: '',
			status: 'active',
			programParticipationConsent: false,
			parentGuardianConsent: false,
			medicalRiskAcknowledged: false,
			ambulanceAuthorisation: false,
			photoConsentForProgram: false,
			programNotes: '',
			additionalInfo: ''
		};
	}

	/** @returns {FormData} */
	function emptyForm() {
		return {
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
			council: 'Adelaide Hills Council',
			councilOther: '',
			townshipId: '',
			townshipOther: '',
			postcode: '',
			isAtsi: '',
			countryOfBirth: '',
			languageOtherThanEnglish: '',
			languageDetails: '',
			isCald: '',
			additionalSupportRequired: '',
			additionalSupportDetails: '',
			transportRequired: '',
			transportDetails: '',
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
			consentEmergencyContact: false,
			consentPhotoGeneral: false,
			selectedProgramIds: [],
			programSpecificData: {}
		};
	}

	/**
	 * @param {unknown} err
	 * @param {string} fallback
	 */
	function getErrorMessage(err, fallback) {
		if (err instanceof Error && err.message) return err.message;
		if (typeof err === 'object' && err !== null && 'message' in err) {
			const maybeMessage = /** @type {{ message?: unknown }} */ (err).message;
			if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage;
		}
		return fallback;
	}

	/** @param {string} value */
	function toBoolean(value) {
		if (value === 'yes') return true;
		if (value === 'no') return false;
		return null;
	}

	/** @param {string} value */
	function escapeSearch(value) {
		return value.replace(/,/g, '\\,').replace(/\./g, '%');
	}



	/** @param {Event} event */
	function getControlValue(event) {
		return /** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} */ (event.currentTarget).value;
	}

	/** @param {Event} event */
	function getControlChecked(event) {
		return /** @type {HTMLInputElement} */ (event.currentTarget).checked;
	}

	/** @param {SearchParticipant} participant */
	function getTownshipLabel(participant) {
		if (participant.township_other) return participant.township_other;
		const match = townships.find((item) => item.township_id === participant.township_id);
		return match ? match.township_name : '';
	}

	/** @type {string} */
	let searchText = '';
	/** @type {SearchParticipant[]} */
	let searchResults = [];
	/** @type {Township[]} */
	let townships = [];
	/** @type {ProgramRecord[]} */
	let programs = [];
	/** @type {ProgramRecord[]} */
	let selectedPrograms = [];
	/** @type {number | undefined} */
	let searchDebounce = undefined;
	/** @type {FormData} */
	let formData = emptyForm();
	let isLoadingReferenceData = true;
	let isSearching = false;
	let loading = false;
	let showSuccess = false;
	let currentStep = 1;
	let error = '';
	let successMessage = '';
	let stepPercent = '33.333%';
	let stepTitle = 'General Information';
	let isOtherCouncil = false;
	let showLanguageDetails = false;
	let showSupportDetails = false;
	let showTransportDetails = false;

	$: stepPercent = `${(currentStep / TOTAL_STEPS) * 100}%`;
	$: stepTitle = currentStep === 1
		? 'General Information'
		: currentStep === 2
			? 'Program Selection'
			: 'Program Registration Details';
	$: isOtherCouncil = formData.council === 'Others';
	$: showLanguageDetails = formData.languageOtherThanEnglish === 'yes';
	$: showSupportDetails = formData.additionalSupportRequired === 'yes';
	$: showTransportDetails = formData.transportRequired === 'yes';
	$: if (isOtherCouncil) {
		formData.townshipId = '';
	} else {
		formData.councilOther = '';
		formData.townshipOther = '';
	}
	$: selectedPrograms = programs.filter((program) => formData.selectedProgramIds.includes(program.program_id));

	function resetForm() {
		formData = emptyForm();
		currentStep = 1;
		showSuccess = false;
		error = '';
		successMessage = '';
	}

	/** @param {string} programId */
	function toggleProgram(programId) {
		const exists = formData.selectedProgramIds.includes(programId);
		/** @type {Record<string, ProgramDetails>} */
		const nextProgramSpecificData = { ...formData.programSpecificData };

		if (exists) {
			delete nextProgramSpecificData[programId];
		} else {
			nextProgramSpecificData[programId] = nextProgramSpecificData[programId] || emptyProgramDetails();
		}

		formData = {
			...formData,
			selectedProgramIds: exists
				? formData.selectedProgramIds.filter((id) => id !== programId)
				: [...formData.selectedProgramIds, programId],
			programSpecificData: nextProgramSpecificData
		};
	}

	/**
	 * @param {string} programId
	 * @param {keyof ProgramDetails} field
	 * @param {string | boolean} value
	 */
	function updateProgramData(programId, field, value) {
		const currentDetails = formData.programSpecificData[programId] || emptyProgramDetails();
		formData = {
			...formData,
			programSpecificData: {
				...formData.programSpecificData,
				[programId]: {
					...currentDetails,
					[field]: value
				}
			}
		};
	}

	/** @param {number} step */
	function validateStep(step) {
		error = '';

		if (step === 1) {
			if (!formData.firstName.trim()) return (error = 'First name is required.'), false;
			if (!formData.lastName.trim()) return (error = 'Last name is required.'), false;
			if (!formData.gender) return (error = 'Gender is required.'), false;
			if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
				return (error = 'Please enter a complete date of birth.'), false;
			}
			if (!formData.mobile.trim() && !formData.homePhone.trim()) {
				return (error = 'Please provide at least one contact number.'), false;
			}
			if (!formData.addressLine1.trim()) return (error = 'Address line 1 is required.'), false;
			if (!formData.postcode.trim()) return (error = 'Postcode is required.'), false;
			if (!formData.council) return (error = 'Council is required.'), false;
			if (isOtherCouncil) {
				if (!formData.councilOther.trim()) return (error = 'Please enter the council name.'), false;
				if (!formData.townshipOther.trim()) return (error = 'Please enter the township name.'), false;
			} else if (!formData.townshipId) {
				return (error = 'Please select an Adelaide Hills township.'), false;
			}
			if (showTransportDetails && !formData.transportDetails.trim()) {
				return (error = 'Please enter transport details.'), false;
			}
			if (!formData.emergency1Name.trim()) return (error = 'Emergency contact 1 name is required.'), false;
			if (!formData.emergency1Phone.trim()) return (error = 'Emergency contact 1 phone is required.'), false;
		}

		if (step === 2 && formData.selectedProgramIds.length === 0) {
			return (error = 'Please select at least one program.'), false;
		}

		if (step === 3) {
			for (const programId of formData.selectedProgramIds) {
				const details = formData.programSpecificData[programId] || emptyProgramDetails();
				if (!details.status) {
					return (error = 'Please select a registration status for each chosen program.'), false;
				}
			}
		}

		return true;
	}

	function goNext() {
		if (validateStep(currentStep)) {
			currentStep = Math.min(currentStep + 1, TOTAL_STEPS);
		}
	}

	function goBack() {
		error = '';
		currentStep = Math.max(currentStep - 1, 1);
	}

	async function loadReferenceData() {
		isLoadingReferenceData = true;
		error = '';

		try {
			const [{ data: townshipData, error: townshipError }, { data: programData, error: programError }] =
				await Promise.all([
					supabase
						.from('ref_township')
						.select('township_id, township_name, postcode, sort_order')
						.eq('is_active', true)
						.order('sort_order', { ascending: true })
						.order('township_name', { ascending: true }),
					supabase
						.from('program')
						.select('program_id, program_name, category, location, start_date, end_date, is_active')
						.eq('is_active', true)
						.order('category', { ascending: true })
						.order('program_name', { ascending: true })
				]);

			if (townshipError) throw townshipError;
			if (programError) throw programError;

			townships = /** @type {Township[]} */ (townshipData || []);
			programs = /** @type {ProgramRecord[]} */ (programData || []);
		} catch (err) {
			error = getErrorMessage(err, 'Failed to load page reference data.');
		} finally {
			isLoadingReferenceData = false;
		}
	}

	/** @param {string} keyword */
	async function searchParticipants(keyword) {
		if (keyword.trim().length < 2) {
			searchResults = [];
			return;
		}

		isSearching = true;

		try {
			const safeKeyword = escapeSearch(keyword.trim());
			const { data: participantRows, error: searchError } = await supabase
				.from('participant')
				.select(
					'participant_id, first_name, last_name, preferred_name, email, mobile, postcode, township_id, township_other, council_other'
				)
				.or(
					`first_name.ilike.%${safeKeyword}%,last_name.ilike.%${safeKeyword}%,preferred_name.ilike.%${safeKeyword}%,email.ilike.%${safeKeyword}%`
				)
				.order('last_name', { ascending: true })
				.limit(12);

			if (searchError) throw searchError;
			searchResults = /** @type {SearchParticipant[]} */ (participantRows || []);
		} catch (err) {
			error = getErrorMessage(err, 'Failed to search participants.');
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	$: {
		clearTimeout(searchDebounce);
		const keyword = searchText.trim();
		if (keyword.length < 2) {
			searchResults = [];
		} else {
			searchDebounce = window.setTimeout(() => {
				searchParticipants(keyword);
			}, 250);
		}
	}

	onMount(async () => {
		await loadReferenceData();
	});

	onDestroy(() => {
		clearTimeout(searchDebounce);
	});

	/** @param {SubmitEvent} event */
	async function handleSubmit(event) {
		event.preventDefault();
		if (!validateStep(3)) return;

		loading = true;
		error = '';
		successMessage = '';
		showSuccess = false;

		/** @type {string | null} */
		let participantId = null;

		try {
			const dob = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`;
			const participantInsert = {
				title: formData.title || null,
				first_name: formData.firstName.trim(),
				last_name: formData.lastName.trim(),
				preferred_name: formData.preferredName.trim() || null,
				dob,
				gender: formData.gender || null,
				home_phone: formData.homePhone.trim() || null,
				mobile: formData.mobile.trim() || null,
				email: formData.email.trim() || null,
				address_line1: formData.addressLine1.trim(),
				address_line2: formData.addressLine2.trim() || null,
				township_id: isOtherCouncil ? null : formData.townshipId,
				township_other: isOtherCouncil ? formData.townshipOther.trim() : null,
				council_other: isOtherCouncil ? formData.councilOther.trim() : null,
				postcode: formData.postcode.trim(),
				atsi: formData.isAtsi === 'prefer_not_to_say' ? null : toBoolean(formData.isAtsi),
				cald: formData.isCald === 'prefer_not_to_say' ? null : toBoolean(formData.isCald),
				country_of_birth: formData.countryOfBirth.trim() || null,
				language_other_than_english: toBoolean(formData.languageOtherThanEnglish),
				language_details: showLanguageDetails ? formData.languageDetails.trim() || null : null,
				additional_support_required: toBoolean(formData.additionalSupportRequired),
				additional_support_details: showSupportDetails ? formData.additionalSupportDetails.trim() || null : null,
				transport_required: toBoolean(formData.transportRequired),
				medical_notes: formData.medicalNotes.trim() || null,
				notes: formData.notes.trim() || null,
				emergency_contact_1_name: formData.emergency1Name.trim(),
				emergency_contact_1_relationship: formData.emergency1Relationship.trim() || null,
				emergency_contact_1_phone: formData.emergency1Phone.trim(),
				emergency_contact_2_name: formData.emergency2Name.trim() || null,
				emergency_contact_2_relationship: formData.emergency2Relationship.trim() || null,
				emergency_contact_2_phone: formData.emergency2Phone.trim() || null,
				guardian_name: formData.guardianName.trim() || null,
				guardian_phone: formData.guardianPhone.trim() || null,
				consent_info_correct: formData.consentInfoCorrect,
				consent_privacy: formData.consentPrivacy,
				consent_info_sharing: formData.consentInfoSharing,
				consent_emergency_contact: formData.consentEmergencyContact,
				consent_photo_general: formData.consentPhotoGeneral,
				consent_at:
					formData.consentInfoCorrect ||
					formData.consentPrivacy ||
					formData.consentInfoSharing ||
					formData.consentEmergencyContact ||
					formData.consentPhotoGeneral
						? new Date().toISOString()
						: null,
				consent_by_role: 'staff'
			};

			const { data: participantRow, error: participantError } = await supabase
				.from('participant')
				.insert([participantInsert])
				.select('participant_id')
				.single();

			if (participantError) throw participantError;
			participantId = participantRow.participant_id;

			const registrations = formData.selectedProgramIds.map((programId) => {
				const details = formData.programSpecificData[programId] || emptyProgramDetails();
				return {
					participant_id: participantId,
					program_id: programId,
					status: details.status || 'active',
					membership_type: details.membershipType || null,
					program_participation_consent: details.programParticipationConsent,
					parent_guardian_consent: details.parentGuardianConsent,
					medical_risk_acknowledged: details.medicalRiskAcknowledged,
					ambulance_authorisation: details.ambulanceAuthorisation,
					photo_consent_for_program: details.photoConsentForProgram,
					registration_consent_at:
						details.programParticipationConsent ||
						details.parentGuardianConsent ||
						details.medicalRiskAcknowledged ||
						details.ambulanceAuthorisation ||
						details.photoConsentForProgram
							? new Date().toISOString()
							: null,
					registration_consent_by_role: 'staff',
					notes: details.programNotes.trim() || null,
					program_specific_data: details.additionalInfo.trim()
						? { additional_info: details.additionalInfo.trim() }
						: null
				};
			});

			const { error: registrationError } = await supabase.from('registration').insert(registrations);
			if (registrationError) throw registrationError;

			showSuccess = true;
			successMessage = `Participant saved and enrolled in ${registrations.length} program${registrations.length > 1 ? 's' : ''}.`;
			setTimeout(() => {
				goto('/staff/dashboard');
			}, 1800);
		} catch (err) {
			if (participantId) {
				await supabase.from('participant').delete().eq('participant_id', participantId);
			}
			error = getErrorMessage(err, 'Failed to save the participant registration.');
		} finally {
			loading = false;
		}
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
				<p>
					Search existing records, capture common participant details, then register the participant
					into one or more programs.
				</p>
			</div>

			<a class="dashboard-btn" href="/staff/dashboard">Back to Dashboard</a>
		</div>

		<div class="search-card">
			<input
				type="text"
				placeholder="Search participant by name or email..."
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
					<p>Existing participant records from the database will appear here.</p>
				</div>
			{:else if isSearching}
				<div class="empty-state compact">
					<h3>Searching…</h3>
					<p>Please wait a moment.</p>
				</div>
			{:else if searchResults.length === 0}
				<div class="empty-state compact">
					<h3>No matching participants found</h3>
					<p>You can continue with the registration form below.</p>
				</div>
			{:else}
				<div class="result-list">
					{#each searchResults as participant}
						<div class="result-card simple-card">
							<div class="result-simple-header">
								<h3>{participant.first_name} {participant.last_name ?? ''}</h3>
								{#if participant.preferred_name}
									<p class="preferred-name">Preferred name: {participant.preferred_name}</p>
								{/if}
							</div>

							<div class="result-meta simple-meta">
								<span>{participant.email || 'No email'}</span>
								<span>{participant.mobile || 'No mobile'}</span>
								<span>{getTownshipLabel(participant) || 'No township'}</span>
								<span>{participant.postcode || 'No postcode'}</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<form class="form-card" on:submit={handleSubmit}>
			<div class="section-title-row">
				<div>
					<h2>Participant Registration</h2>
					<p class="step-copy">Step {currentStep} of {TOTAL_STEPS}: {stepTitle}</p>
				</div>
				<div class="form-actions-top">
					<button type="button" class="secondary-btn" on:click={resetForm}>Clear form</button>
				</div>
			</div>

			<div class="progress-shell" aria-hidden="true">
				<div class="progress-labels">
					<span class:active-step={currentStep >= 1}>1. General Info</span>
					<span class:active-step={currentStep >= 2}>2. Select Programs</span>
					<span class:active-step={currentStep >= 3}>3. Program Details</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style={`width: ${stepPercent}`}></div>
				</div>
			</div>

			{#if error}
				<div class="message-box error-box">
					<strong>Error</strong>
					<p>{error}</p>
				</div>
			{/if}

			{#if showSuccess}
				<div class="message-box success-box">
					<strong>Success</strong>
					<p>{successMessage}</p>
				</div>
			{/if}

			{#if isLoadingReferenceData}
				<div class="empty-state compact form-loading">
					<h3>Loading form data…</h3>
					<p>Fetching programs and Adelaide Hills township options from the database.</p>
				</div>
			{:else if currentStep === 1}
				<div class="step-section">
					<div class="subsection">
						<h3>Personal Information</h3>
						<div class="form-grid two-col-grid">
							<label>
								<span>First name</span>
								<input bind:value={formData.firstName} required />
							</label>

							<label>
								<span>Last name</span>
								<input bind:value={formData.lastName} required />
							</label>

							<label>
								<span>Preferred name</span>
								<input bind:value={formData.preferredName} />
							</label>

							<label>
								<span>Gender</span>
								<select bind:value={formData.gender}>
									<option value="">Select gender</option>
									{#each GENDER_OPTIONS as gender}
										<option value={gender}>{gender}</option>
									{/each}
								</select>
							</label>
						</div>

						<div class="form-grid three-col-grid top-gap">
							<label>
								<span>Day of birth</span>
								<select bind:value={formData.birthDay}>
									<option value="">Day</option>
									{#each dayOptions as day}
										<option value={day}>{day}</option>
									{/each}
								</select>
							</label>

							<label>
								<span>Month of birth</span>
								<select bind:value={formData.birthMonth}>
									<option value="">Month</option>
									{#each monthOptions as month}
										<option value={month.value}>{month.label}</option>
									{/each}
								</select>
							</label>

							<label>
								<span>Year of birth</span>
								<select bind:value={formData.birthYear}>
									<option value="">Year</option>
									{#each yearOptions as year}
										<option value={year}>{year}</option>
									{/each}
								</select>
							</label>
						</div>

						<div class="form-grid three-col-grid top-gap">
							<label>
								<span>Mobile</span>
								<input bind:value={formData.mobile} />
							</label>

							<label>
								<span>Home phone</span>
								<input bind:value={formData.homePhone} />
							</label>

							<label>
								<span>Email</span>
								<input type="email" bind:value={formData.email} />
							</label>
						</div>
					</div>

					<div class="subsection">
						<h3>Contact and Address</h3>
						<div class="form-grid two-col-grid">
							<label>
								<span>Address line 1</span>
								<input bind:value={formData.addressLine1} />
							</label>

							<label>
								<span>Address line 2</span>
								<input bind:value={formData.addressLine2} />
							</label>
						</div>

						<div class="form-grid three-col-grid top-gap">
							<label>
								<span>Council</span>
								<select bind:value={formData.council}>
									{#each COUNCIL_OPTIONS as council}
										<option value={council}>{council}</option>
									{/each}
								</select>
							</label>

							<label>
								<span>Township</span>
								{#if isOtherCouncil}
									<input bind:value={formData.townshipOther} placeholder="Enter township" />
								{:else}
									<select bind:value={formData.townshipId}>
										<option value="">Select township</option>
										{#each townships as township}
											<option value={township.township_id}>{township.township_name}</option>
										{/each}
									</select>
								{/if}
							</label>

							<label>
								<span>Postcode</span>
								<input bind:value={formData.postcode} />
							</label>
						</div>

						{#if isOtherCouncil}
							<div class="form-grid one-col-grid top-gap">
								<label>
									<span>Other council name</span>
									<input bind:value={formData.councilOther} placeholder="Enter council" />
								</label>
							</div>
						{/if}
					</div>

					<div class="subsection">
						<h3>Demographics and Support</h3>
						<div class="form-grid three-col-grid">
							<label>
								<span>Aboriginal or Torres Strait Islander</span>
								<select bind:value={formData.isAtsi}>
									{#each ATSI_OPTIONS as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</label>

							<label>
								<span>Country of birth</span>
								<select bind:value={formData.countryOfBirth}>
									<option value="">Select country</option>
									{#each COUNTRY_OPTIONS as country}
										<option value={country}>{country}</option>
									{/each}
								</select>
							</label>

							<label>
								<span>Language other than English at home</span>
								<select bind:value={formData.languageOtherThanEnglish}>
									{#each YES_NO_OPTIONS as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</label>
						</div>

						{#if showLanguageDetails}
							<div class="form-grid one-col-grid top-gap">
								<label>
									<span>Please specify the language spoken at home</span>
									<input bind:value={formData.languageDetails} />
								</label>
							</div>
						{/if}

						<div class="form-grid three-col-grid top-gap">
							<label>
								<span>Culturally and Linguistically Diversity</span>
								<select bind:value={formData.isCald}>
									{#each ATSI_OPTIONS as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</label>

							<label>
								<span>Additional support required</span>
								<select bind:value={formData.additionalSupportRequired}>
									{#each YES_NO_OPTIONS as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</label>

							<label>
								<span>Transport required</span>
								<select bind:value={formData.transportRequired}>
									{#each YES_NO_OPTIONS as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</label>
						</div>

						<div class="form-grid two-col-grid top-gap">
							{#if showSupportDetails}
								<label>
									<span>Please describe the additional support required</span>
									<input bind:value={formData.additionalSupportDetails} />
								</label>
							{/if}

							{#if showTransportDetails}
								<label>
									<span>Please describe the transport required</span>
									<input bind:value={formData.transportDetails} />
								</label>
							{/if}
						</div>
					</div>

					<div class="subsection">
						<h3>Emergency and Additional Notes</h3>
						<div class="form-grid three-col-grid">
							<label>
								<span>Emergency contact 1 name</span>
								<input bind:value={formData.emergency1Name} />
							</label>
							<label>
								<span>Emergency contact 1 relationship</span>
								<input bind:value={formData.emergency1Relationship} />
							</label>
							<label>
								<span>Emergency contact 1 phone</span>
								<input bind:value={formData.emergency1Phone} />
							</label>

							<label>
								<span>Emergency contact 2 name</span>
								<input bind:value={formData.emergency2Name} />
							</label>
							<label>
								<span>Emergency contact 2 relationship</span>
								<input bind:value={formData.emergency2Relationship} />
							</label>
							<label>
								<span>Emergency contact 2 phone</span>
								<input bind:value={formData.emergency2Phone} />
							</label>

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
								<span>General notes</span>
								<textarea rows="3" bind:value={formData.notes}></textarea>
							</label>
						</div>
					</div>

					<div class="subsection">
						<h3>Member Consent</h3>
						<div class="consent-list">
							<label class="checkbox-row consent-row"><input type="checkbox" bind:checked={formData.consentInfoCorrect} /> <span>I confirm that the information provided in this form is true and correct.</span></label>
							<label class="checkbox-row consent-row"><input type="checkbox" bind:checked={formData.consentPrivacy} /> <span>I have read and understood The Hut's privacy information and agree to my personal information being collected and stored.</span></label>
							<label class="checkbox-row consent-row"><input type="checkbox" bind:checked={formData.consentInfoSharing} /> <span>I understand The Hut's Information Sharing Guidelines and consent to relevant information being shared when necessary to provide services safely.</span></label>
							<label class="checkbox-row consent-row"><input type="checkbox" bind:checked={formData.consentEmergencyContact} /> <span>I consent to The Hut contacting and using the emergency contact details provided if required.</span></label>
							<label class="checkbox-row consent-row"><input type="checkbox" bind:checked={formData.consentPhotoGeneral} /> <span>I consent to general photographs and/or video being taken and used by The Hut for its website, social media, brochures, annual reports, and local media.</span></label>
						</div>
					</div>
				</div>
{:else if currentStep === 2}
				<div class="step-section">
					<div class="subsection">
						<h3>Select Programs</h3>
						<p class="sub-copy">Choose one or more programs for this participant.</p>
						<div class="program-grid">
							{#if programs.length === 0}
								<div class="empty-state compact">
									<h3>No active programs available</h3>
									<p>Add active program records in the database first.</p>
								</div>
							{:else}
								{#each programs as program}
									<button
										type="button"
										class:selected-card={formData.selectedProgramIds.includes(program.program_id)}
										class="program-card"
										on:click={() => toggleProgram(program.program_id)}
									>
										<h4>{program.program_name}</h4>
										<p>{program.category || 'Uncategorised'}</p>
										<span>{program.location || 'No location set'}</span>
									</button>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<div class="step-section">
					<div class="subsection">
						<h3>Program Registration Details</h3>
						<p class="sub-copy">Capture any extra details needed for each selected program.</p>
						{#each selectedPrograms as program}
							{@const details = formData.programSpecificData[program.program_id] || emptyProgramDetails()}
							<div class="program-detail-card">
								<div class="program-detail-header">
									<h4>{program.program_name}</h4>
									<p>{program.category || 'Uncategorised'} · {program.location || 'No location'}</p>
								</div>

								<div class="form-grid">
									<label>
										<span>Membership type</span>
										<select value={details.membershipType} on:change={(event) => updateProgramData(program.program_id, 'membershipType', getControlValue(event))}>
											<option value="">Select membership type</option>
											{#each MEMBERSHIP_OPTIONS as membership}
												<option value={membership}>{membership}</option>
											{/each}
										</select>
									</label>

									<label>
										<span>Registration status</span>
										<select value={details.status} on:change={(event) => updateProgramData(program.program_id, 'status', getControlValue(event))}>
											{#each REGISTRATION_STATUS_OPTIONS as statusOption}
												<option value={statusOption}>{statusOption}</option>
											{/each}
										</select>
									</label>

									<label class="wide">
										<span>Program notes</span>
										<textarea rows="3" value={details.programNotes} on:input={(event) => updateProgramData(program.program_id, 'programNotes', getControlValue(event))}></textarea>
									</label>

									<label class="wide">
										<span>Additional program-specific information</span>
										<textarea rows="3" value={details.additionalInfo} on:input={(event) => updateProgramData(program.program_id, 'additionalInfo', getControlValue(event))}></textarea>
									</label>
								</div>

								<div class="checkbox-grid">
									<label class="checkbox-row"><input type="checkbox" checked={details.programParticipationConsent} on:change={(event) => updateProgramData(program.program_id, 'programParticipationConsent', getControlChecked(event))} /> <span>Program participation consent</span></label>
									<label class="checkbox-row"><input type="checkbox" checked={details.parentGuardianConsent} on:change={(event) => updateProgramData(program.program_id, 'parentGuardianConsent', getControlChecked(event))} /> <span>Parent/guardian consent</span></label>
									<label class="checkbox-row"><input type="checkbox" checked={details.medicalRiskAcknowledged} on:change={(event) => updateProgramData(program.program_id, 'medicalRiskAcknowledged', getControlChecked(event))} /> <span>Medical risk acknowledged</span></label>
									<label class="checkbox-row"><input type="checkbox" checked={details.ambulanceAuthorisation} on:change={(event) => updateProgramData(program.program_id, 'ambulanceAuthorisation', getControlChecked(event))} /> <span>Ambulance authorisation</span></label>
									<label class="checkbox-row"><input type="checkbox" checked={details.photoConsentForProgram} on:change={(event) => updateProgramData(program.program_id, 'photoConsentForProgram', getControlChecked(event))} /> <span>Photo consent for program</span></label>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<div class="action-row">
				{#if currentStep > 1}
					<button type="button" class="secondary-btn" on:click={goBack}>Back</button>
				{/if}

				{#if currentStep < TOTAL_STEPS}
					<button type="button" class="primary-btn" on:click={goNext}>Next</button>
				{:else}
					<button type="submit" class="primary-btn" disabled={loading}>
						{loading ? 'Saving...' : 'Complete Registration'}
					</button>
				{/if}

				<button type="button" class="secondary-btn" on:click={() => goto('/staff/dashboard')}>
					Cancel
				</button>
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

	.page-header p,
	.step-copy,
	.sub-copy {
		margin: 12px 0 0;
		font-size: 17px;
		color: #4b5563;
	}

	.section-title-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
	}

	.section-title-row h2,
	.results-header h2,
	.subsection h3 {
		margin: 0;
		color: #152238;
	}

	.section-title-row h2 {
		font-size: 1.9rem;
	}

	.subsection h3 {
		font-size: 1.35rem;
		margin-bottom: 18px;
	}

	.subsection + .subsection {
		margin-top: 26px;
	}

	.search-card,
	.results-section,
	.form-card {
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
		box-sizing: border-box;
	}

	.search-card,
	.results-section,
	.form-card {
		margin-top: 28px;
	}

	.search-card,
	.results-section,
	.form-card {
		padding: 24px;
	}

	input,
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
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14);
	}

	textarea {
		resize: vertical;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-weight: 600;
		color: #152238;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(220px, 1fr));
		gap: 18px;
	}

	.two-col-grid {
		grid-template-columns: repeat(2, minmax(240px, 1fr));
	}

	.three-col-grid {
		grid-template-columns: repeat(3, minmax(200px, 1fr));
	}

	.one-col-grid {
		grid-template-columns: 1fr;
	}

	.top-gap {
		margin-top: 18px;
	}

	.wide {
		grid-column: span 2;
	}

	.dashboard-btn,
	.primary-btn,
	.secondary-btn,
	.program-card {
		transition: 0.18s ease;
	}

	.dashboard-btn,
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
	}

	.dashboard-btn,
	.secondary-btn {
		border: 1px solid #d9d9d9;
		background: #ffffff;
		color: #152238;
	}

	.primary-btn {
		border: none;
		background: #3b82f6;
		color: #ffffff;
	}

	.primary-btn:hover {
		background: #2563eb;
	}

	.secondary-btn:hover,
	.dashboard-btn:hover {
		background: #f8fafc;
	}

	.primary-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.result-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.result-card {
		border: 1px solid #e5e7eb;
		background: #fafafa;
		border-radius: 18px;
		padding: 16px 18px;
	}

	.result-simple-header h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.preferred-name {
		margin: 6px 0 0;
		color: #64748b;
		font-size: 14px;
	}

	.result-meta {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.result-meta span {
		padding: 8px 12px;
		background: #eef2f7;
		border-radius: 999px;
		font-size: 13px;
		color: #475569;
	}

	.empty-state {
		text-align: center;
		padding: 20px 14px;
		background: #fafafa;
		border: 1px dashed #d9d9d9;
		border-radius: 18px;
	}

	.empty-state h3 {
		margin: 0 0 8px;
	}

	.empty-state p {
		margin: 0;
		color: #64748b;
	}

	.progress-shell {
		margin-top: 18px;
		padding: 18px;
		background: #f8fafc;
		border-radius: 18px;
		border: 1px solid #e5e7eb;
	}

	.progress-labels {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 14px;
		font-weight: 700;
		margin-bottom: 10px;
		color: #94a3b8;
	}

	.active-step {
		color: #2563eb;
	}

	.progress-bar {
		height: 14px;
		background: #e5e7eb;
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #3b82f6;
		border-radius: 999px;
	}

	.message-box {
		margin-top: 18px;
		padding: 16px 18px;
		border-radius: 18px;
		border: 1px solid;
	}

	.message-box strong {
		display: block;
		margin-bottom: 8px;
	}

	.message-box p {
		margin: 0;
	}

	.error-box {
		background: #fff1f2;
		border-color: #fda4af;
		color: #881337;
	}

	.success-box {
		background: #ecfdf5;
		border-color: #6ee7b7;
		color: #065f46;
	}

	.step-section {
		margin-top: 24px;
	}

	.program-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(220px, 1fr));
		gap: 16px;
	}

	.program-card {
		text-align: left;
		padding: 18px;
		border: 1px solid #d9d9d9;
		background: #ffffff;
		border-radius: 18px;
		cursor: pointer;
	}

	.program-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
	}

	.selected-card {
		border-color: #3b82f6;
		background: rgba(59, 130, 246, 0.08);
	}

	.program-card h4,
	.program-detail-header h4 {
		margin: 0;
		font-size: 1.08rem;
		color: #152238;
	}

	.program-card p,
	.program-detail-header p {
		margin: 8px 0 0;
		font-size: 14px;
		color: #475569;
	}

	.program-card span {
		display: block;
		margin-top: 10px;
		font-size: 13px;
		color: #64748b;
	}

	.program-detail-card {
		margin-top: 18px;
		padding: 20px;
		background: #fafafa;
		border: 1px solid #e5e7eb;
		border-radius: 20px;
	}

	.program-detail-header {
		margin-bottom: 18px;
	}

	.checkbox-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(250px, 1fr));
		gap: 12px 18px;
	}

	.consent-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 14px;
	}

	.checkbox-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 14px;
		background: #f8fafc;
		border: 1px solid #e5e7eb;
		font-weight: 600;
	}

	.consent-row {
		align-items: flex-start;
		padding: 16px 18px;
		font-weight: 500;
		line-height: 1.55;
	}

	.consent-row span {
		flex: 1;
	}

	.checkbox-row input {
		width: auto;
		margin: 0;
		box-shadow: none;
	}

	.action-row {
		display: flex;
		gap: 12px;
		margin-top: 28px;
	}

	@media (max-width: 1200px) {
		.form-grid,
		.program-grid,
		.checkbox-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 1000px) {
		.page-header,
		.section-title-row,
		.action-row,
		.progress-labels {
			flex-direction: column;
			align-items: flex-start;
		}

		.form-grid,
		.program-grid,
		.checkbox-grid {
			grid-template-columns: 1fr;
		}

		.wide {
			grid-column: span 1;
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
