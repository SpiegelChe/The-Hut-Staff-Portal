<svelte:options runes={false} />

<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';

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
	 * 	key: string,
	 * 	label: string,
	 * 	type: 'text' | 'textarea' | 'select' | 'checkboxGroup' | 'date',
	 * 	required?: boolean,
	 * 	helpText?: string,
	 * 	introText?: string,
	 * 	options?: string[],
	 * 	showWhen?: string,
	 * 	fullWidth?: boolean
	 * }} ProgramFieldConfig
	 */

	/**
	 * @typedef {{
	 * 	field: 'programParticipationConsent' | 'parentGuardianConsent' | 'medicalRiskAcknowledged' | 'ambulanceAuthorisation' | 'photoConsentForProgram',
	 * 	label: string,
	 * 	required?: boolean,
	 * 	fullWidth?: boolean
	 * }} ProgramConsentConfig
	 */

	/**
	 * @typedef {{
	 * 	title?: string,
	 * 	text?: string,
	 * 	bullets?: string[]
	 * }} ProgramInfoSection
	 */

	/**
	 * @typedef {{
	 * 	membershipType: string,
	 * 	programParticipationConsent: boolean,
	 * 	parentGuardianConsent: boolean,
	 * 	medicalRiskAcknowledged: boolean,
	 * 	ambulanceAuthorisation: boolean,
	 * 	photoConsentForProgram: boolean,
	 * 	programNotes: string,
	 * 	customData: Record<string, string | string[]>
	 * }} ProgramDetails
	 */

	/**
	 * @typedef {{
	 * 	key: string,
	 * 	membershipLabel?: string,
	 * 	membershipOptions?: string[],
	 * 	infoSections?: ProgramInfoSection[],
	 * 	consentItems?: ProgramConsentConfig[],
	 * 	fields: ProgramFieldConfig[]
	 * }} ProgramFormConfig
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
	const COUNTRY_OPTIONS = [
		'Australia', 'Afghanistan', 'Argentina', 'Bangladesh', 'Brazil', 'Cambodia', 'Canada', 'China', 'Colombia',
		'Egypt', 'Fiji', 'France', 'Germany', 'Greece', 'Hong Kong', 'India', 'Indonesia', 'Iran', 'Iraq',
		'Ireland', 'Italy', 'Japan', 'Kenya', 'Lebanon', 'Malaysia', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand',
		'Nigeria', 'Pakistan', 'Papua New Guinea', 'Philippines', 'Poland', 'Singapore', 'South Africa', 'South Korea',
		'Sri Lanka', 'Sudan', 'Syria', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States',
		'Vietnam', 'Zimbabwe'
	];
	const DEFAULT_MEMBERSHIP_OPTIONS = ['Annual Membership', 'Quarterly'];
	const PROGRAM_FORM_CONFIGS = {
		community_shed: {
			key: 'community_shed',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			infoSections: [
				{
					title: 'Privacy and Personal Information Protection Act 1998',
					text: 'Your personal information is being collected to process this application. If you cannot provide or do not wish to provide this information The Hut may not be able to process your application. The Hut is to be regarded as the agency that holds the information. You may make application for access or amendment of the information held by The Hut.'
				}
			],
			consentItems: [
				{ field: 'programParticipationConsent', label: "The details provided by me are correct and I have read and understand the 'Privacy information'.", required: true, fullWidth: true }
			],
			fields: [
				{ key: 'motivation', label: 'What motivates you to become a shed member?', type: 'textarea' },
				{ key: 'supervisory_interest', label: 'Are you interested in being involved in supervisory roles or WHS Officer?', type: 'select', options: ['yes', 'no'] },
				{ key: 'desired_days', label: 'Please indicate which day or days you wish to join', type: 'checkboxGroup', options: ['Tuesday', 'Thursday'], required: true },
				{ key: 'skills_hobbies', label: 'Please list your work skills, interests and hobbies', type: 'textarea' },
				{ key: 'medical_conditions', label: 'Medical Conditions', type: 'textarea' }
			]
		},
		dungeons_and_dragons: {
			key: 'dungeons_and_dragons',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			infoSections: [
				{
					title: 'Behaviour Code',
					text: 'In order to ensure your safety within the program we ask you to agree to the following behaviour code:',
					bullets: [
						'Follow all reasonable requests given by the DM.',
						'Only leave The Hut Community Centre building with the person authorised to collect me, unless I have an alternative arrangement made.',
						'Treat every person with respect and consideration, free from discrimination or harassment.',
						'Work in a safe manner.',
						'Raise any issues or concerns with the DM or Community Development Team.',
						'Notify The Hut by calling 8339 4400 if not attending a session.'
					]
				}
			],
			consentItems: [
				{ field: 'programParticipationConsent', label: "I agree to follow the Dungeon and Dragon's behaviour code.", required: true },
				{ field: 'parentGuardianConsent', label: 'I consent to the participation of my child in Dungeon and Dragons to be conducted at The Hut Community Centre. I understand that transport is not provided for this activity and that pick up by an authorised person is mandatory unless advised in the section above. I also understand that I must notify The Hut Community Centre if the participant is not attending a session.', required: true }
			],
			fields: [
				{ key: 'leave_without_collection_permission', label: 'Do you give permission for your child to leave the centre after the session without being collected by a parent/guardian?', type: 'select', options: ['yes', 'no'], required: true },
				{ key: 'leave_without_collection_details', label: 'If yes, please provide details', type: 'textarea', showWhen: 'field:leave_without_collection_permission=yes' },
				{ key: 'photo_use_permissions', label: 'Photo consent options', type: 'checkboxGroup', options: ['The Hut website', "The Hut's Social media page", "The Hut's annual report", 'Brochures', 'Local media including The Courier & Weekend Herald', 'I do not allow my child to be photographed'], required: true }
			]
		},
		fun_fitness: {
			key: 'fun_fitness',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			consentItems: [
				{ field: 'ambulanceAuthorisation', label: 'In the event of an emergency, I authorise the instructor to seek medical advice and call an ambulance if required, at my own expense.', required: true, fullWidth: true }
			],
			fields: [
				{ key: 'health_conditions', label: 'Health conditions', type: 'checkboxGroup', options: ['Asthma', 'Back Problems', 'Sight impairment', 'High Blood pressure', 'Arthritis', 'Joint Replacement', 'Stroke', 'Epilepsy', 'Other'] },
				{ key: 'current_activity_level', label: 'Current level of activity', type: 'select', options: ['No regular exercise', 'Small amount of exercise', 'Regular Exercise'], required: true },
				{ key: 'gp_clearance_comments', label: 'GP clearance comments', type: 'textarea', fullWidth: true, introText: 'Would you please confirm that there are no significant medical reasons that may exclude his/her participation in the above course. If in your opinion there are any special limitations would you, with the permission of the applicant, please comment below.' },
				{ key: 'gp_name', label: 'GP name', type: 'text' },
				{ key: 'gp_phone', label: 'GP phone', type: 'text' },
				{ key: 'gp_clinic', label: 'Clinic', type: 'text' },
				{ key: 'gp_date', label: 'Date', type: 'date' }
			]
		},
		chi_kung_mens_moves: {
			key: 'chi_kung_mens_moves',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			consentItems: [
				{ field: 'medicalRiskAcknowledged', label: 'I understand that my Chi Kung teacher will make every effort to ensure that I work safely during classes, but also understand that it is my responsibility to be careful and to keep my teacher informed of any changes in health.', required: true, fullWidth: true },
				{ field: 'programParticipationConsent', label: 'If you are being treated for any health conditions or have a concern, you are advised to obtain medical consent from your doctor or specialist before undertaking this class.', required: true, fullWidth: true }
			],
			fields: [
				{ key: 'health_conditions', label: 'Health conditions', type: 'checkboxGroup', fullWidth: true, options: ['Asthma', 'Back Problems', 'Diabetes', 'High blood pressure', 'Arthritis', 'Recent fracture', 'Insomnia', 'Menopause', 'Difficulty Hearing', 'Low Blood pressure', 'Repetitive Strain injury', 'Hernia', 'Recent Surgery', 'Osteoporosis', 'Heart Issues', 'MS', 'Detached Retina', 'Other'] },
				{ key: 'medication_affecting_ability', label: 'Are you taking any medication that will affect your ability to do Chi Kung?', type: 'select', fullWidth: true, options: ['yes', 'no'] },
				{ key: 'medication_affecting_ability_details', label: 'If yes, please provide details', type: 'textarea', fullWidth: true, showWhen: 'field:medication_affecting_ability=yes' },
				{ key: 'recent_medical_procedures', label: 'Have you had any medical procedures in the last 12 months?', type: 'select', fullWidth: true, options: ['yes', 'no'] },
				{ key: 'recent_medical_procedures_details', label: 'If yes, please provide details', type: 'textarea', fullWidth: true, showWhen: 'field:recent_medical_procedures=yes' },
				{ key: 'first_chi_kung_experience', label: 'Is this your first experience of Chi Kung?', type: 'select', fullWidth: true, options: ['yes', 'no'] },
				{ key: 'first_chi_kung_experience_details', label: 'If yes, please provide details', type: 'textarea', fullWidth: true, showWhen: 'field:first_chi_kung_experience=yes' }
			]
		},
		music_makers: {
			key: 'music_makers',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			fields: [
				{ key: 'heard_about_program', label: 'How did you hear about Music Makers?', type: 'select', options: ['Brochure', 'Referral', 'Family/Friend', 'Media', 'Web', 'Other'] },
				{ key: 'heard_about_program_other', label: 'If Other, please provide details', type: 'text', showWhen: 'field:heard_about_program=Other' },
				{ key: 'newsletter_opt_in', label: 'Would you like to receive The Hut monthly newsletter?', type: 'select', options: ['yes', 'no'] }
			]
		},
		strength_balance: {
			key: 'strength_balance',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			consentItems: [
				{ field: 'medicalRiskAcknowledged', label: 'I understand that all safety precautions will be observed but agree to accept full responsibility for any loss or damage to personal property or any injury which may be sustained while taking part in the class.', required: true, fullWidth: true },
				{ field: 'ambulanceAuthorisation', label: "I'm aware that in the event of a medical emergency an ambulance may be called for me at my expense.", required: true, fullWidth: true }
			],
			fields: [
				{ key: 'health_conditions', label: 'Health conditions', type: 'checkboxGroup', fullWidth: true, options: ['Asthma', 'Back Problems', 'Sight impairment', 'High Blood pressure', 'Arthritis', 'Joint Replacement', 'Stroke', 'Epilepsy', 'Other'] },
				{ key: 'condition_medication', label: 'Medication taken for these conditions', type: 'textarea' },
				{ key: 'current_activity_level', label: 'Current level of activity', type: 'select', options: ['No regular exercise', 'Small amount of exercise', 'Regular Exercise'], required: true },
				{ key: 'gp_clearance_comments', label: 'GP clearance comments', type: 'textarea', fullWidth: true, introText: 'Would you please confirm that there are no significant medical reasons that may exclude his/her participation in the above course. If in your opinion there are any special limitations would you, with the permission of the applicant, please comment below.' },
				{ key: 'gp_name', label: 'GP name', type: 'text' },
				{ key: 'gp_phone', label: 'GP phone', type: 'text' },
				{ key: 'gp_clinic', label: 'Clinic', type: 'text' },
				{ key: 'gp_date', label: 'Date', type: 'date' }
			]
		},
		walking_group: {
			key: 'walking_group',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			infoSections: [
				{
					title: 'Medical Requirements',
					text: 'If you have a history of HIGH BLOOD PRESSURE or any HEART CONDITION, BACK PROBLEM, ARTHRITIS or other medical condition that might be aggravated by walking you are advised to obtain a MEDICAL CLEARANCE from your GP before walking with The Hut.'
				}
			],
			consentItems: [
				{ field: 'programParticipationConsent', label: 'I understand that all safety precautions will be observed and that I am to adhere to the safety directions of the Walk Leader.', required: true, fullWidth: true },
				{ field: 'medicalRiskAcknowledged', label: "I acknowledge that I undertake walks at my own risk and that The Hut accepts no responsibility for loss or injury to any person taking part in The Hut's Walking Program.", required: true, fullWidth: true },
				{ field: 'ambulanceAuthorisation', label: 'In the event of an emergency, I authorise the Walk leader to seek medical advice and call an ambulance if required, at my own expense.', required: true, fullWidth: true }
			],
			fields: [
				{ key: 'ambulance_fund_member', label: 'Are you a member of an Ambulance Fund?', type: 'select', options: ['yes', 'no'] },
				{ key: 'walk_leader_interest', label: 'Would you like to be a Hut Walk Leader?', type: 'select', options: ['yes', 'no'] },
				{ key: 'first_aid_certificate', label: 'Do you have a current First Aid Certificate?', type: 'select', options: ['yes', 'no'] },
				{ key: 'first_aid_expiry', label: 'If yes, when does it expire?', type: 'text' },
				{ key: 'walking_days', label: 'Preferred walking days', type: 'checkboxGroup', options: ['Monday (same walk as Wednesday)', 'Tuesday', 'Wednesday (same walk as Monday)', 'Friday'], required: true },
				{ key: 'walking_registration_fee', label: 'Registration fees', type: 'select', required: true, options: ['Annual Single Member', 'Annual Family', 'Casual (up to four weeks)'], helpText: 'Annual Single Member $10.00\nAnnual Family $15.00\nCasual (up to four weeks) $5.00' }
			]
		},
		default_program: {
			key: 'default_program',
			membershipLabel: 'Membership type',
			membershipOptions: DEFAULT_MEMBERSHIP_OPTIONS,
			fields: [
				{ key: 'program_form_notes', label: 'Additional program-specific information', type: 'textarea' }
			]
		}
	};
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
	const POSTCODE_REGEX = /^\d{4}$/;
	const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	/** @returns {ProgramDetails} */
	function emptyProgramDetails() {
		return {
			membershipType: '',
			programParticipationConsent: false,
			parentGuardianConsent: false,
			medicalRiskAcknowledged: false,
			ambulanceAuthorisation: false,
			photoConsentForProgram: false,
			programNotes: '',
			customData: {}
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

	/** @param {string} programName */
	function resolveProgramConfigKey(programName) {
		const name = programName.trim().toLowerCase();
		if (name.includes('community shed')) return 'community_shed';
		if (name.includes('dungeons') || name.includes('dragon')) return 'dungeons_and_dragons';
		if (name.includes('fun') && name.includes('fitness')) return 'fun_fitness';
		if (name.includes('chi kung') || (name.includes('men') && name.includes('moves'))) return 'chi_kung_mens_moves';
		if (name.includes('music makers')) return 'music_makers';
		if (name.includes('strength') && name.includes('balance')) return 'strength_balance';
		if (name.includes('walking')) return 'walking_group';
		return 'default_program';
	}

	/** @param {string} programName */
	function getProgramFormConfig(programName) {
		const key = resolveProgramConfigKey(programName);
		return /** @type {ProgramFormConfig} */ (PROGRAM_FORM_CONFIGS[key] || PROGRAM_FORM_CONFIGS.default_program);
	}

	/** @param {string} programName */
	function getMembershipOptions(programName) {
		const config = getProgramFormConfig(programName);
		return config.membershipOptions || DEFAULT_MEMBERSHIP_OPTIONS;
	}

	/** @param {string} programName */
	function getMembershipLabel(programName) {
		const config = getProgramFormConfig(programName);
		return config.membershipLabel || 'Membership type';
	}

	/**
	 * @param {ProgramFieldConfig} field
	 * @param {string} programId
	 */
	function shouldShowProgramField(field, programId) {
		if (!field.showWhen || field.showWhen === 'always') return true;
		if (field.showWhen === 'under18') return isParticipantUnder18();
		if (field.showWhen.startsWith('field:')) {
			const expression = field.showWhen.slice(6);
			const [fieldKey, expectedValue] = expression.split('=');
			if (!fieldKey) return true;
			return getProgramCustomValue(programId, fieldKey) === (expectedValue || 'yes');
		}
		return true;
	}

	/** @param {string} programName */
	function getProgramConsentItems(programName) {
		const config = getProgramFormConfig(programName);
		return config.consentItems || [];
	}

	/** @param {string} programName */
	function getProgramInfoSections(programName) {
		const config = getProgramFormConfig(programName);
		return config.infoSections || [];
	}

	/**
	 * @param {string} programId
	 * @param {string} fieldKey
	 */
	function getProgramCustomSelectionCount(programId, fieldKey) {
		return getProgramCustomList(programId, fieldKey).length;
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
	/** @type {Record<string, boolean>} */
	let touchedFields = {};
	let attemptedStepValidation = false;

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
		touchedFields = {};
		attemptedStepValidation = false;
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

	/**
	 * @param {string} programId
	 * @param {string} fieldKey
	 * @param {string | string[]} value
	 */
	function updateProgramCustomField(programId, fieldKey, value) {
		const currentDetails = formData.programSpecificData[programId] || emptyProgramDetails();
		formData = {
			...formData,
			programSpecificData: {
				...formData.programSpecificData,
				[programId]: {
					...currentDetails,
					customData: {
						...currentDetails.customData,
						[fieldKey]: value
					}
				}
			}
		};
	}

	/**
	 * @param {string} programId
	 * @param {string} fieldKey
	 * @param {string} option
	 */
	function toggleProgramCustomCheckbox(programId, fieldKey, option) {
		const currentDetails = formData.programSpecificData[programId] || emptyProgramDetails();
		const currentValue = currentDetails.customData[fieldKey];
		const selected = Array.isArray(currentValue) ? currentValue : [];
		let nextValue = selected.includes(option)
			? selected.filter((item) => item !== option)
			: [...selected, option];

		if (fieldKey === 'photo_use_permissions') {
			const noPhotoOption = 'I do not allow my child to be photographed';
			if (option === noPhotoOption && !selected.includes(option)) {
				nextValue = [noPhotoOption];
			} else if (option !== noPhotoOption && nextValue.includes(noPhotoOption)) {
				nextValue = nextValue.filter((item) => item !== noPhotoOption);
			}
		}

		updateProgramCustomField(programId, fieldKey, nextValue);
	}

	/**
	 * @param {ProgramDetails} details
	 */
	function derivePhotoConsentValue(details) {
		const selections = Array.isArray(details.customData.photo_use_permissions)
			? details.customData.photo_use_permissions
			: [];
		if (selections.length === 0) return details.photoConsentForProgram;
		return !selections.includes('I do not allow my child to be photographed');
	}

	/**
	 * @param {string} programId
	 * @param {string} fieldKey
	 */
	function getProgramCustomValue(programId, fieldKey) {
		const details = formData.programSpecificData[programId] || emptyProgramDetails();
		const value = details.customData[fieldKey];
		return typeof value === 'string' ? value : '';
	}

	/**
	 * @param {string} programId
	 * @param {string} fieldKey
	 */
	function getProgramCustomList(programId, fieldKey) {
		const details = formData.programSpecificData[programId] || emptyProgramDetails();
		const value = details.customData[fieldKey];
		return Array.isArray(value) ? value : [];
	}

	/** @param {string} field */
	function touchField(field) {
		touchedFields = { ...touchedFields, [field]: true };
	}

	/** @param {string[]} fields */
	function touchFields(fields) {
		/** @type {Record<string, boolean>} */
		const nextTouched = { ...touchedFields };
		for (const field of fields) nextTouched[field] = true;
		touchedFields = nextTouched;
	}

	function getDateOfBirthValue() {
		if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) return null;
		const dob = new Date(`${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}T00:00:00`);
		if (Number.isNaN(dob.getTime())) return null;
		if (
			dob.getFullYear() !== Number(formData.birthYear) ||
			dob.getMonth() + 1 !== Number(formData.birthMonth) ||
			dob.getDate() !== Number(formData.birthDay)
		) {
			return null;
		}
		return dob;
	}

	function isParticipantUnder18() {
		const dob = getDateOfBirthValue();
		if (!dob) return false;
		const today = new Date();
		let age = today.getFullYear() - dob.getFullYear();
		const monthDiff = today.getMonth() - dob.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
			age -= 1;
		}
		return age < 18;
	}

	/** @param {string} field */
	function getFieldError(field) {
		const dob = getDateOfBirthValue();
		switch (field) {
			case 'firstName':
				return formData.firstName.trim() ? '' : 'First name is required.';
			case 'lastName':
				return formData.lastName.trim() ? '' : 'Last name is required.';
			case 'gender':
				return formData.gender ? '' : 'Gender is required.';
			case 'birthDate':
				if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
					return 'Please enter a complete date of birth.';
				}
				if (!dob) return 'Please enter a valid date of birth.';
				if (dob > new Date()) return 'Date of birth cannot be in the future.';
				return '';
			case 'mobile':
			case 'homePhone':
				return formData.mobile.trim() || formData.homePhone.trim()
					? ''
					: 'Please provide at least one contact number.';
			case 'email':
				return !formData.email.trim() || SIMPLE_EMAIL_REGEX.test(formData.email.trim())
					? ''
					: 'Please enter a valid email address.';
			case 'addressLine1':
				return formData.addressLine1.trim() ? '' : 'Address line 1 is required.';
			case 'postcode':
				if (!formData.postcode.trim()) return 'Postcode is required.';
				return POSTCODE_REGEX.test(formData.postcode.trim()) ? '' : 'Postcode must be 4 digits.';
			case 'council':
				return formData.council ? '' : 'Council is required.';
			case 'councilOther':
				return !isOtherCouncil || formData.councilOther.trim() ? '' : 'Please enter the council name.';
			case 'townshipId':
				return isOtherCouncil || formData.townshipId ? '' : 'Please select an Adelaide Hills township.';
			case 'townshipOther':
				return !isOtherCouncil || formData.townshipOther.trim() ? '' : 'Please enter the township name.';
			case 'transportDetails':
				return !showTransportDetails || formData.transportDetails.trim() ? '' : 'Please enter transport details.';
			case 'emergency1Name':
				return formData.emergency1Name.trim() ? '' : 'Emergency contact 1 name is required.';
			case 'emergency1Phone':
				return formData.emergency1Phone.trim() ? '' : 'Emergency contact 1 phone is required.';
			default:
				return '';
		}
	}

	/** @param {string} field */
	function shouldShowFieldError(field) {
		if (!getFieldError(field)) return false;
		if (field === 'mobile' || field === 'homePhone') {
			return attemptedStepValidation || touchedFields.mobile || touchedFields.homePhone;
		}
		if (field === 'birthDate') {
			return attemptedStepValidation || touchedFields.birthDay || touchedFields.birthMonth || touchedFields.birthYear;
		}
		return attemptedStepValidation || !!touchedFields[field];
	}

	/** @param {number} step */
	function touchStepFields(step) {
		if (step === 1) {
			touchFields([
				'firstName',
				'lastName',
				'gender',
				'birthDay',
				'birthMonth',
				'birthYear',
				'mobile',
				'homePhone',
				'email',
				'addressLine1',
				'postcode',
				'council',
				'townshipId',
				'townshipOther',
				'councilOther',
				'transportDetails',
				'emergency1Name',
				'emergency1Phone'
			]);
		}
	}

	/** @param {number} step */
	function validateStep(step) {
		error = '';
		attemptedStepValidation = true;
		touchStepFields(step);

		if (step === 1) {
			const fieldsToCheck = [
				'firstName',
				'lastName',
				'gender',
				'birthDate',
				'mobile',
				'email',
				'addressLine1',
				'postcode',
				'council',
				isOtherCouncil ? 'councilOther' : 'townshipId',
				isOtherCouncil ? 'townshipOther' : 'townshipId',
				'transportDetails',
				'emergency1Name',
				'emergency1Phone'
			];

			for (const field of fieldsToCheck) {
				const fieldError = getFieldError(field);
				if (fieldError) {
					error = fieldError;
					return false;
				}
			}
		}

		if (step === 2 && formData.selectedProgramIds.length === 0) {
			error = 'Please select at least one program.';
			return false;
		}

		if (step === 3) {
			for (const programId of formData.selectedProgramIds) {
				const program = programs.find((item) => item.program_id === programId);
				const details = formData.programSpecificData[programId] || emptyProgramDetails();
				if (!program) continue;
				const config = getProgramFormConfig(program.program_name);

				if (!details.membershipType) {
					error = `Please select a membership type for ${program.program_name}.`;
					return false;
				}

				for (const consentItem of config.consentItems || []) {
					if (consentItem.required && !details[consentItem.field]) {
						error = `Please complete the required consent for ${program.program_name}.`;
						return false;
					}
				}

				for (const field of config.fields) {
					if (!shouldShowProgramField(field, programId) || !field.required) continue;
					const value = details.customData[field.key];
					if (field.type === 'checkboxGroup') {
						if (!Array.isArray(value) || value.length === 0) {
							error = `Please complete ${field.label} for ${program.program_name}.`;
							return false;
						}
					} else if (typeof value !== 'string' || !value.trim()) {
						error = `Please complete ${field.label} for ${program.program_name}.`;
						return false;
					}
				}
			}
		}

		return true;
	}

	function goNext() {
		if (validateStep(currentStep)) {
			currentStep = Math.min(currentStep + 1, TOTAL_STEPS);
			error = '';
			attemptedStepValidation = false;
		}
	}

	function goBack() {
		error = '';
		attemptedStepValidation = false;
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

		attemptedStepValidation = true;

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
				const program = programs.find((item) => item.program_id === programId);
				const programConfig = getProgramFormConfig(program?.program_name || '');
				const photoConsentForProgram = derivePhotoConsentValue(details);
				return {
					participant_id: participantId,
					program_id: programId,
					status: 'active',
					membership_type: details.membershipType || null,
					program_participation_consent: details.programParticipationConsent,
					parent_guardian_consent: details.parentGuardianConsent,
					medical_risk_acknowledged: details.medicalRiskAcknowledged,
					ambulance_authorisation: details.ambulanceAuthorisation,
					photo_consent_for_program: photoConsentForProgram,
					registration_consent_at:
						details.programParticipationConsent ||
						details.parentGuardianConsent ||
						details.medicalRiskAcknowledged ||
						details.ambulanceAuthorisation ||
						photoConsentForProgram
							? new Date().toISOString()
							: null,
					registration_consent_by_role: 'staff',
					notes: details.programNotes.trim() || null,
					program_specific_data: {
						form_key: programConfig.key,
						values: details.customData
					}
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
	<SidebarNav currentKey="participants" staffRole={data?.staff?.staff_role ?? null} />

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
								<span class="field-label">Title</span>
								<select bind:value={formData.title}>
									<option value="">Select title</option>
									{#each TITLE_OPTIONS as title}
										<option value={title}>{title}</option>
									{/each}
								</select>
							</label>

							<label>
								<span class="field-label">First name <span class="required-marker">*</span></span>
								<input bind:value={formData.firstName} class:invalid-field={shouldShowFieldError('firstName')} on:blur={() => touchField('firstName')} />
							</label>

							<label>
								<span class="field-label">Last name <span class="required-marker">*</span></span>
								<input bind:value={formData.lastName} class:invalid-field={shouldShowFieldError('lastName')} on:blur={() => touchField('lastName')} />
							</label>

							<label>
								<span class="field-label">Preferred name</span>
								<input bind:value={formData.preferredName} />
							</label>

							<label>
								<span class="field-label">Gender <span class="required-marker">*</span></span>
								<select bind:value={formData.gender} class:invalid-field={shouldShowFieldError('gender')} on:blur={() => touchField('gender')}>
									<option value="">Select gender</option>
									{#each GENDER_OPTIONS as gender}
										<option value={gender}>{gender}</option>
									{/each}
								</select>
							</label>
						</div>

						<div class="form-grid three-col-grid top-gap">
							<label>
								<span class="field-label">Day of birth <span class="required-marker">*</span></span>
								<select bind:value={formData.birthDay} class:invalid-field={shouldShowFieldError('birthDate')} on:blur={() => touchField('birthDay')}>
									<option value="">Day</option>
									{#each dayOptions as day}
										<option value={day}>{day}</option>
									{/each}
								</select>
							</label>

							<label>
								<span class="field-label">Month of birth <span class="required-marker">*</span></span>
								<select bind:value={formData.birthMonth} class:invalid-field={shouldShowFieldError('birthDate')} on:blur={() => touchField('birthMonth')}>
									<option value="">Month</option>
									{#each monthOptions as month}
										<option value={month.value}>{month.label}</option>
									{/each}
								</select>
							</label>

							<label>
								<span class="field-label">Year of birth <span class="required-marker">*</span></span>
								<select bind:value={formData.birthYear} class:invalid-field={shouldShowFieldError('birthDate')} on:blur={() => touchField('birthYear')}>
									<option value="">Year</option>
									{#each yearOptions as year}
										<option value={year}>{year}</option>
									{/each}
								</select>
							</label>
						</div>

						<div class="form-grid three-col-grid top-gap">
							<label>
								<span class="field-label">Mobile <span class="required-marker">*</span></span>
								<input bind:value={formData.mobile} class:invalid-field={shouldShowFieldError('mobile')} on:blur={() => touchField('mobile')} />
								<small class="field-note">Enter mobile or home phone.</small>
							</label>

							<label>
								<span class="field-label">Home phone <span class="required-marker">*</span></span>
								<input bind:value={formData.homePhone} class:invalid-field={shouldShowFieldError('homePhone')} on:blur={() => touchField('homePhone')} />
								<small class="field-note">At least one contact number is required.</small>
							</label>

							<label>
								<span class="field-label">Email</span>
								<input type="email" bind:value={formData.email} class:invalid-field={shouldShowFieldError('email')} on:blur={() => touchField('email')} />
							</label>
						</div>
					</div>

					<div class="subsection">
						<h3>Contact and Address</h3>
						<div class="form-grid two-col-grid">
							<label>
								<span class="field-label">Address line 1 <span class="required-marker">*</span></span>
								<input bind:value={formData.addressLine1} class:invalid-field={shouldShowFieldError('addressLine1')} on:blur={() => touchField('addressLine1')} />
							</label>

							<label>
								<span class="field-label">Address line 2</span>
								<input bind:value={formData.addressLine2} />
							</label>
						</div>

						<div class="form-grid three-col-grid top-gap">
							<label>
								<span class="field-label">Council <span class="required-marker">*</span></span>
								<select bind:value={formData.council} class:invalid-field={shouldShowFieldError('council')} on:blur={() => touchField('council')}>
									{#each COUNCIL_OPTIONS as council}
										<option value={council}>{council}</option>
									{/each}
								</select>
							</label>

							<label>
								<span class="field-label">Township <span class="required-marker">*</span></span>
								{#if isOtherCouncil}
									<input bind:value={formData.townshipOther} placeholder="Enter township" class:invalid-field={shouldShowFieldError('townshipOther')} on:blur={() => touchField('townshipOther')} />
								{:else}
									<select bind:value={formData.townshipId} class:invalid-field={shouldShowFieldError('townshipId')} on:blur={() => touchField('townshipId')}>
										<option value="">Select township</option>
										{#each townships as township}
											<option value={township.township_id}>{township.township_name}</option>
										{/each}
									</select>
								{/if}
							</label>

							<label>
								<span class="field-label">Postcode <span class="required-marker">*</span></span>
								<input bind:value={formData.postcode} inputmode="numeric" maxlength="4" class:invalid-field={shouldShowFieldError('postcode')} on:blur={() => touchField('postcode')} />
							</label>
						</div>

						{#if isOtherCouncil}
							<div class="form-grid one-col-grid top-gap">
								<label>
									<span class="field-label">Other council name <span class="required-marker">*</span></span>
									<input bind:value={formData.councilOther} placeholder="Enter council" class:invalid-field={shouldShowFieldError('councilOther')} on:blur={() => touchField('councilOther')} />
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
									<span class="field-label">Please describe the transport required <span class="required-marker">*</span></span>
									<input bind:value={formData.transportDetails} class:invalid-field={shouldShowFieldError('transportDetails')} on:blur={() => touchField('transportDetails')} />
								</label>
							{/if}
						</div>
					</div>

					<div class="subsection">
						<h3>Emergency and Additional Notes</h3>
						<div class="form-grid three-col-grid">
							<label>
								<span class="field-label">Emergency contact 1 name <span class="required-marker">*</span></span>
								<input bind:value={formData.emergency1Name} class:invalid-field={shouldShowFieldError('emergency1Name')} on:blur={() => touchField('emergency1Name')} />
							</label>
							<label>
								<span>Emergency contact 1 relationship</span>
								<input bind:value={formData.emergency1Relationship} />
							</label>
							<label>
								<span class="field-label">Emergency contact 1 phone <span class="required-marker">*</span></span>
								<input bind:value={formData.emergency1Phone} class:invalid-field={shouldShowFieldError('emergency1Phone')} on:blur={() => touchField('emergency1Phone')} />
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
						<p class="sub-copy">Choose one or more programs for this participant. <span class="required-marker">*</span></p>
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
						<p class="sub-copy">Step 3 now changes based on the program selected in Step 2.</p>
						{#each selectedPrograms as program}
							{@const details = formData.programSpecificData[program.program_id] || emptyProgramDetails()}
							{@const config = getProgramFormConfig(program.program_name)}
							<div class="program-detail-card">
								<div class="program-detail-header">
									<h4>{program.program_name}</h4>
									<p>{program.category || 'Uncategorised'} · {program.location || 'No location'}</p>
								</div>

								<div class="form-grid">
									<label>
										<span>{getMembershipLabel(program.program_name)} <span class="required-marker">*</span></span>
										<select value={details.membershipType} on:change={(event) => updateProgramData(program.program_id, 'membershipType', getControlValue(event))}>
											<option value="">Select option</option>
											{#each getMembershipOptions(program.program_name) as membership}
												<option value={membership}>{membership}</option>
											{/each}
										</select>
									</label>

									<label class="wide">
										<span>Program notes</span>
										<textarea rows="3" value={details.programNotes} on:input={(event) => updateProgramData(program.program_id, 'programNotes', getControlValue(event))}></textarea>
									</label>
								</div>

								{#if getProgramInfoSections(program.program_name).length > 0}
									<div class="program-info-sections">
										{#each getProgramInfoSections(program.program_name) as infoSection}
											<div class="info-box">
												{#if infoSection.title}<h5>{infoSection.title}</h5>{/if}
												{#if infoSection.text}<p>{infoSection.text}</p>{/if}
												{#if infoSection.bullets && infoSection.bullets.length > 0}
													<ul>
														{#each infoSection.bullets as bullet}
															<li>{bullet}</li>
														{/each}
													</ul>
												{/if}
											</div>
										{/each}
									</div>
								{/if}

								{#if config.fields.length > 0}
									<div class="dynamic-program-fields">
										{#each config.fields.filter((field) => shouldShowProgramField(field, program.program_id)) as field}
											<div class="dynamic-field-card" class:full-width-card={field.fullWidth}>
												{#if field.type === 'checkboxGroup'}
													<div>
														<span class="field-label">{field.label}{#if field.required} <span class="required-marker">*</span>{/if}</span>
														<div class="option-chip-group top-gap">
															{#each field.options || [] as option}
																<label class="option-chip">
																	<input
																		type="checkbox"
																		checked={getProgramCustomList(program.program_id, field.key).includes(option)}
																		on:change={() => toggleProgramCustomCheckbox(program.program_id, field.key, option)}
																	/>
																	<span>{option}</span>
																</label>
															{/each}
														</div>
														{#if field.helpText}
															<small class="field-note">{field.helpText}</small>
														{/if}
													</div>
												{:else}
													<label>
														{#if field.introText}
															<p class="field-intro">{field.introText}</p>
														{/if}
														<span class="field-label">{field.label}{#if field.required} <span class="required-marker">*</span>{/if}</span>
														{#if field.type === 'textarea'}
															<textarea rows="3" value={getProgramCustomValue(program.program_id, field.key)} on:input={(event) => updateProgramCustomField(program.program_id, field.key, getControlValue(event))}></textarea>
														{:else if field.type === 'select'}
															<select value={getProgramCustomValue(program.program_id, field.key)} on:change={(event) => updateProgramCustomField(program.program_id, field.key, getControlValue(event))}>
																<option value="">Select option</option>
																{#each field.options || [] as option}
																	<option value={option}>{option}</option>
																{/each}
															</select>
														{:else if field.type === 'date'}
															<input type="date" value={getProgramCustomValue(program.program_id, field.key)} on:input={(event) => updateProgramCustomField(program.program_id, field.key, getControlValue(event))} />
														{:else}
															<input value={getProgramCustomValue(program.program_id, field.key)} on:input={(event) => updateProgramCustomField(program.program_id, field.key, getControlValue(event))} />
														{/if}
														{#if field.helpText}
															<small class="field-note">{field.helpText}</small>
														{/if}
													</label>
												{/if}
											</div>
										{/each}
									</div>
								{/if}

								{#if getProgramConsentItems(program.program_name).length > 0}
									<div class="checkbox-grid">
										{#each getProgramConsentItems(program.program_name) as consentItem}
											<label class="checkbox-row consent-row" class:full-width-card={consentItem.fullWidth}>
												<input type="checkbox" checked={details[consentItem.field]} on:change={(event) => updateProgramData(program.program_id, consentItem.field, getControlChecked(event))} />
												<span>{consentItem.label}{#if consentItem.required} <span class="required-marker">*</span>{/if}</span>
											</label>
										{/each}
									</div>
								{/if}
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

	.field-label {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.required-marker {
		color: #dc2626;
		font-weight: 700;
	}

	.field-note {
		font-size: 12px;
		font-weight: 500;
		color: #64748b;
	}

	.invalid-field {
		border-color: #dc2626 !important;
		background: #fff7f7;
	}

	.invalid-field:focus {
		border-color: #dc2626 !important;
		box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15) !important;
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

	.dynamic-program-fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(240px, 1fr));
		gap: 16px;
		margin: 20px 0;
	}

	.dynamic-field-card {
		padding: 16px;
		border: 1px solid #e5e7eb;
		border-radius: 18px;
		background: #f8fafc;
	}

	.full-width-card {
		grid-column: 1 / -1;
	}

	.option-chip-group {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.program-info-sections {
		display: grid;
		gap: 12px;
		margin: 18px 0 6px;
	}

	.info-box {
		padding: 14px 16px;
		border-radius: 16px;
		background: #fff7ed;
		border: 1px solid #fdba74;
		color: #7c2d12;
	}

	.info-box h5 {
		margin: 0 0 8px;
		font-size: 14px;
	}

	.info-box p,
	.info-box ul {
		margin: 0;
		font-size: 14px;
		line-height: 1.55;
	}

	.field-intro {
		margin: 0 0 12px;
		font-size: 14px;
		line-height: 1.6;
		color: #475569;
	}

	.info-box ul {
		padding-left: 18px;
		margin-top: 8px;
	}

	.option-chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border-radius: 999px;
		background: #ffffff;
		border: 1px solid #dbe3ef;
		font-weight: 500;
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

	.field-note {
		display: block;
		margin-top: 8px;
		white-space: pre-line;
		color: #64748b;
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
