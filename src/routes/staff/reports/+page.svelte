<svelte:options runes={false} />

<script>
	// @ts-nocheck
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';
	import hutLogo from '$lib/images/The-Hut-Logo-150px.png';

	const REPORT_SOURCE = 'report_records';

	let reportMode = 'monthly';
	let startDate = '';
	let endDate = '';
	let selectedCategory = 'all';
	let selectedProgram = 'all';
	let selectedAgeGroup = 'all';
	let selectedGender = 'all';
	let selectedAtsiStatus = 'all';
	let selectedCaldBackground = 'all';
	let selectedCouncil = 'all';
	let selectedTownship = 'all';

	let reportGenerated = false;
	let pdfPreviewUrl = '';
	let loadingRecords = true;
	let previewLoading = false;
	let exporting = false;
	let loadError = '';
	let exportMenuOpen = false;
	let lastGeneratedAt = '';
	let hutLogoDataUrl = '';

	let rawRecords = [];
	let records = [];

	const reportModes = [
		{ key: 'weekly', label: 'Weekly' },
		{ key: 'monthly', label: 'Monthly' },
		{ key: 'quarterly', label: 'Quarterly' },
		{ key: 'annually', label: 'Annually' },
		{ key: 'custom', label: 'Custom Range' }
	];

	const MASTER_AGE_GROUPS = ['Under 18', '18-24', '25-44', '45-64', '65+'];
	const MASTER_GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say', 'Other'];
	const MASTER_BINARY_STATUS = ['Yes', 'No', 'Unknown'];
	const MASTER_PROGRAM_CATEGORIES = [
		'Healthy Living',
		'Low Income Support',
		'Interest & Social',
		'Young People',
		'Sustainability'
	];

	let masterCategories = [...MASTER_PROGRAM_CATEGORIES];
	let masterPrograms = [];
	let masterCouncils = [];
	let masterTownships = [];


	function initialiseDateRange() {
		setPresetRange('monthly');
	}

	function formatDateInput(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function normaliseDate(value) {
		if (!value) return '';

		if (typeof value === 'string') {
			if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
				return value;
			}

			const parsed = new Date(value);
			return Number.isNaN(parsed.getTime()) ? '' : formatDateInput(parsed);
		}

		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? '' : formatDateInput(parsed);
	}

	function startOfWeek(date) {
		const copy = new Date(date);
		const day = copy.getDay();
		const diff = day === 0 ? -6 : 1 - day;
		copy.setDate(copy.getDate() + diff);
		copy.setHours(0, 0, 0, 0);
		return copy;
	}

	function endOfWeek(date) {
		const copy = startOfWeek(date);
		copy.setDate(copy.getDate() + 6);
		return copy;
	}

	function startOfMonth(date) {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function endOfMonth(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0);
	}

	function startOfQuarter(date) {
		const month = Math.floor(date.getMonth() / 3) * 3;
		return new Date(date.getFullYear(), month, 1);
	}

	function endOfQuarter(date) {
		const start = startOfQuarter(date);
		return new Date(start.getFullYear(), start.getMonth() + 3, 0);
	}

	function startOfYear(date) {
		return new Date(date.getFullYear(), 0, 1);
	}

	function endOfYear(date) {
		return new Date(date.getFullYear(), 11, 31);
	}

	function setPresetRange(modeKey) {
		reportMode = modeKey;

		const today = new Date();
		const todayValue = formatDateInput(today);

		if (modeKey === 'custom') {
			if (!endDate) {
				endDate = todayValue;
			}
			return;
		}

		const daysByMode = {
			weekly: 7,
			monthly: 30,
			quarterly: 90,
			annually: 365
		};

		const days = daysByMode[modeKey] ?? 30;
		const from = new Date(today);
		from.setDate(from.getDate() - (days - 1));

		startDate = formatDateInput(from);
		endDate = todayValue;
	}

	function handleManualDateChange() {
		reportMode = 'custom';
	}

	function getValue(source, keys, fallback = '') {
		for (const key of keys) {
			const value = source?.[key];
			if (value !== undefined && value !== null && value !== '') {
				return value;
			}
		}
		return fallback;
	}

	function toTitleCase(value) {
		if (!value) return 'Unknown';
		return String(value)
			.replace(/[_-]+/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.split(' ')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
			.join(' ');
	}

	function normaliseYesNo(value, unknownLabel = 'Unknown') {
		if (value === true) return 'Yes';
		if (value === false) return 'No';
		if (value === null || value === undefined || value === '') return unknownLabel;

		const text = String(value).trim().toLowerCase();
		if (['yes', 'y', 'true', '1'].includes(text)) return 'Yes';
		if (['no', 'n', 'false', '0'].includes(text)) return 'No';
		if (text.includes('not') && text.includes('applicable')) return 'Not applicable';
		return toTitleCase(text);
	}

	function getAgeFromDateOfBirth(dateOfBirth) {
		if (!dateOfBirth) return null;
		const dob = new Date(dateOfBirth);
		if (Number.isNaN(dob.getTime())) return null;

		const today = new Date();
		let age = today.getFullYear() - dob.getFullYear();
		const monthDiff = today.getMonth() - dob.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
			age -= 1;
		}

		return age >= 0 ? age : null;
	}

	function getAgeGroupFromAge(age) {
		if (age === null || age === undefined || age === '') return 'Unknown';
		const numericAge = Number(age);
		if (Number.isNaN(numericAge)) return 'Unknown';
		if (numericAge < 18) return 'Under 18';
		if (numericAge <= 24) return '18-24';
		if (numericAge <= 44) return '25-44';
		if (numericAge <= 64) return '45-64';
		return '65+';
	}

	function normaliseOptionValue(value) {
		if (value === null || value === undefined) return '';
		return String(value).trim();
	}

	function uniqueValues(values) {
		return [...new Set(values.map(normaliseOptionValue).filter(Boolean).filter((value) => value !== 'Unknown'))];
	}

	function buildDisabledAwareOptions({ allLabel, allValues = [], availableValues = [], preferredOrder = null }) {
		const universe = uniqueValues([...allValues, ...availableValues]);
		const availableSet = new Set(uniqueValues(availableValues));

		let ordered = universe;
		if (preferredOrder?.length) {
			const preferred = preferredOrder.filter((value) => universe.includes(value));
			const remaining = universe
				.filter((value) => !preferredOrder.includes(value))
				.sort((a, b) => a.localeCompare(b));
			ordered = [...preferred, ...remaining];
		} else {
			ordered = [...universe].sort((a, b) => a.localeCompare(b));
		}

		const enabled = ordered.filter((value) => availableSet.has(value));
		const disabled = ordered.filter((value) => !availableSet.has(value));

		return [
			{ value: 'all', label: allLabel, disabled: false },
			...enabled.map((value) => ({ value, label: value, disabled: false })),
			...disabled.map((value) => ({ value, label: value, disabled: true }))
		];
	}

	function buildParticipantName(row) {
		const preferredName = getValue(row, ['preferred_name', 'preferredName']);
		const firstName = getValue(row, ['first_name', 'firstName']);
		const lastName = getValue(row, ['last_name', 'lastName']);
		const fullName = getValue(row, ['participant_name', 'participantName', 'full_name', 'fullName']);

		if (fullName) return fullName;
		if (preferredName && lastName) return `${preferredName} ${lastName}`.trim();
		return `${firstName} ${lastName}`.trim() || 'Unknown Participant';
	}

	function normaliseStatus(value) {
		const text = String(value || '').trim().toLowerCase();
		if (!text) return 'Unknown';
		if (['present', 'attended', 'yes', 'checked in'].includes(text)) return 'Present';
		if (['absent', 'no show', 'no', 'missed'].includes(text)) return 'Absent';
		return toTitleCase(text);
	}

	function isPresentStatus(status) {
		return String(status || '').trim().toLowerCase() === 'present';
	}

	function mapReportRow(row, index) {
		const ageGroupFromRecord = getValue(row, ['age_group', 'ageGroup']);
		const explicitAge = getValue(row, ['age_years', 'age']);
		const dateOfBirth = getValue(row, ['date_of_birth', 'dob', 'birthday']);
		const derivedAge = explicitAge !== '' ? explicitAge : getAgeFromDateOfBirth(dateOfBirth);
		const normalisedDate = normaliseDate(
			getValue(row, ['record_date', 'attendance_date', 'registration_date', 'date', 'session_date', 'program_date', 'created_at'])
		);

		return {
			id: getValue(row, ['attendance_id', 'registration_id', 'id', 'record_id'], index + 1),
			participantName: buildParticipantName(row),
			program: getValue(row, ['program_name', 'program', 'event_name', 'program_title'], 'Unassigned Program'),
			category: getValue(row, ['category', 'program_category', 'program_type'], 'Unknown'),
			date: normalisedDate,
			ageGroup: ageGroupFromRecord || getAgeGroupFromAge(derivedAge),
			gender: normaliseGender(getValue(row, ['gender'], 'Unknown')),
			atsiStatus: normaliseYesNo(
				getValue(row, [
					'atsi',
					'atsi_status',
					'aboriginal_or_torres_strait_islander',
					'aboriginal_torres_strait_islander'
				]),
				'Unknown'
			),
			caldBackground: normaliseYesNo(
				getValue(row, [
					'cald',
					'cald_background',
					'culturally_and_linguistically_diverse',
					'culturally_and_linguistically_diversity'
				]),
				'Unknown'
			),
			council: getValue(row, ['council', 'council_region'], 'Unknown'),
			township: getValue(row, ['township', 'suburb'], 'Unknown'),
			status: normaliseStatus(getValue(row, ['attendance_status', 'status'], 'Unknown'))
		};
	}

	function formatDateDisplay(dateString) {
		if (!dateString) return 'N/A';
		const date = new Date(`${dateString}T00:00:00`);
		if (Number.isNaN(date.getTime())) return dateString;
		return date.toLocaleDateString('en-AU', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	async function loadImageAsDataUrl(url) {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Unable to load image asset: ${response.status}`);
		}
		const blob = await response.blob();
		return await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	}

	async function getHutLogoDataUrl() {
		if (!hutLogoDataUrl) {
			hutLogoDataUrl = await loadImageAsDataUrl(hutLogo);
		}
		return hutLogoDataUrl;
	}

	const PREVIEW_DONUT_COLORS = ['#14b8a6', '#3b82f6', '#f97316', '#a855f7', '#22c55e', '#ef4444'];

	function getDonutChartBackground(summary) {
		const rows = summary.filter((item) => Number(item.value) > 0);
		const total = rows.reduce((sum, item) => sum + Number(item.value || 0), 0);

		if (total === 0) {
			return 'conic-gradient(#e5e7eb 0deg 360deg)';
		}

		let current = 0;
		const parts = rows.map((item, index) => {
			const portion = (Number(item.value || 0) / total) * 360;
			const start = current;
			const end = current + portion;
			current = end;
			return `${PREVIEW_DONUT_COLORS[index % PREVIEW_DONUT_COLORS.length]} ${start}deg ${end}deg`;
		});

		return `conic-gradient(${parts.join(', ')})`;
	}

	function getSummaryValue(summaryRows, label) {
		return summaryRows.find((row) => row.label === label)?.value || 0;
	}

	function getBarWidth(value, summaryRows) {
		const maxValue = Math.max(...summaryRows.map((row) => Number(row.value || 0)), 1);
		if (maxValue <= 0) return 0;
		return (Number(value || 0) / maxValue) * 100;
	}

	function normaliseGender(value) {
		if (value === null || value === undefined || value === '') return 'Unknown';
		const text = String(value).trim().toLowerCase();

		if (['female', 'f'].includes(text)) return 'Female';
		if (['male', 'm'].includes(text)) return 'Male';
		if (['non-binary', 'non binary', 'nonbinary'].includes(text)) return 'Non-binary';
		if (['prefer not to say', 'prefer not say', 'prefer_not_to_say'].includes(text)) return 'Prefer not to say';
		if (['other'].includes(text)) return 'Other';
		return toTitleCase(value);
	}

	function clearPreviewUrl() {
		if (pdfPreviewUrl) {
			URL.revokeObjectURL(pdfPreviewUrl);
			pdfPreviewUrl = '';
		}
	}

	async function fetchMasterOptions() {
		const supabase = page.data?.supabase;
		if (!supabase) return;

		try {
			const [programResponse, councilResponse, townshipResponse] = await Promise.all([
				supabase.from('program').select('program_name, category').order('category').order('program_name'),
				supabase.from('ref_council').select('council_name').order('council_name'),
				supabase.from('ref_township').select('township_name').order('township_name')
			]);

			if (!programResponse.error) {
				masterPrograms = (programResponse.data || [])
					.map((row) => ({
						program: normaliseOptionValue(row.program_name),
						category: normaliseOptionValue(row.category)
					}))
					.filter((row) => row.program);
			}

			if (!councilResponse.error) {
				masterCouncils = uniqueValues((councilResponse.data || []).map((row) => row.council_name));
			}

			if (!townshipResponse.error) {
				masterTownships = uniqueValues((townshipResponse.data || []).map((row) => row.township_name));
			}
		} catch (error) {
			console.warn('Unable to load full dropdown reference data:', error);
		}
	}

	async function fetchReportRecords() {
		loadingRecords = true;
		loadError = '';

		try {
			const supabase = page.data?.supabase;
			if (!supabase) {
				throw new Error('Supabase client is not available on this page.');
			}

			const { data, error } = await supabase.from(REPORT_SOURCE).select('*');
			if (error) throw error;

			rawRecords = data || [];
			records = rawRecords
				.map((row, index) => mapReportRow(row, index))
				.filter((row) => row.date)
				.sort((a, b) => b.date.localeCompare(a.date));
		} catch (error) {
			console.error('Failed to load report data:', error);
			loadError =
				error?.message ||
				`Unable to load report data from Supabase. Check that the ${REPORT_SOURCE} view exists and exposes report fields.`;
			records = [];
		} finally {
			loadingRecords = false;
		}
	}

	function createSummary(items, accessor) {
		const counts = new Map();

		for (const item of items) {
			const key = accessor(item) || 'Unknown';
			counts.set(key, (counts.get(key) || 0) + 1);
		}

		return [...counts.entries()]
			.map(([label, value]) => ({ label, value }))
			.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
	}

	function buildCsvContent() {
		const headers = [
			'Date',
			'Program category',
			'Program',
			'Participant',
			'Age group',
			'Gender',
			'ATSI status',
			'CALD background',
			'Council',
			'Township',
			'Status'
		];

		const rows = filteredRecords.map((record) => [
			record.date,
			record.category,
			record.program,
			record.participantName,
			record.ageGroup,
			record.gender,
			record.atsiStatus,
			record.caldBackground,
			record.council,
			record.township,
			record.status
		]);

		return [headers, ...rows]
			.map((row) =>
				row
					.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
					.join(',')
			)
			.join('\n');
	}

	function downloadBlob(blob, filename) {
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	function getTimestampSuffix() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		return `${year}${month}${day}-${hours}${minutes}`;
	}

	function getAppliedFiltersList() {
		return [
			['Date range', `${formatDateDisplay(startDate)} to ${formatDateDisplay(endDate)}`],
			['Program category', selectedCategory === 'all' ? 'All program categories' : selectedCategory],
			['Program', selectedProgram === 'all' ? 'All programs' : selectedProgram],
			['Age group', selectedAgeGroup === 'all' ? 'All age groups' : selectedAgeGroup],
			['Gender', selectedGender === 'all' ? 'All genders' : selectedGender],
			['ATSI status', selectedAtsiStatus === 'all' ? 'All ATSI statuses' : selectedAtsiStatus],
			['CALD background', selectedCaldBackground === 'all' ? 'All CALD backgrounds' : selectedCaldBackground],
			['Council', selectedCouncil === 'all' ? 'All councils' : selectedCouncil],
			['Township', selectedTownship === 'all' ? 'All townships' : selectedTownship]
		];
	}

	function ensurePdfSpace(doc, currentY, requiredHeight = 120) {
		const pageHeight = doc.internal.pageSize.getHeight();
		if (currentY + requiredHeight > pageHeight - 40) {
			doc.addPage();
			return 50;
		}
		return currentY;
	}

	function drawBarChart(doc, title, rows, startY) {
		let y = ensurePdfSpace(doc, startY, 180);
		const pageWidth = doc.internal.pageSize.getWidth();
		const left = 40;
		const right = pageWidth - 40;
		const chartLeft = 180;
		const chartRight = right - 30;
		const maxValue = Math.max(...rows.map((row) => row.value), 1);

		doc.setFontSize(13);
		doc.setTextColor(21, 34, 56);
		doc.text(title, left, y);
		y += 18;

		rows.forEach((row) => {
			y = ensurePdfSpace(doc, y, 26);
			const width = ((chartRight - chartLeft) * row.value) / maxValue;
			doc.setFontSize(10);
			doc.setTextColor(71, 85, 105);
			doc.text(String(row.label).slice(0, 28), left, y + 10);
			doc.setFillColor(229, 231, 235);
			doc.roundedRect(chartLeft, y, chartRight - chartLeft, 12, 6, 6, 'F');
			doc.setFillColor(20, 184, 166);
			doc.roundedRect(chartLeft, y, width, 12, 6, 6, 'F');
			doc.setTextColor(21, 34, 56);
			doc.text(String(row.value), chartRight + 8, y + 10);
			y += 24;
		});

		return y + 8;
	}


	const PIE_CHART_COLORS = [
		'#2563eb',
		'#14b8a6',
		'#f59e0b',
		'#ef4444',
		'#8b5cf6',
		'#10b981',
		'#f97316',
		'#6366f1'
	];

	function buildPieChartSeries(rows, limit = 6) {
		const filtered = rows.filter((row) => Number(row.value) > 0);
		if (filtered.length <= limit) return filtered;

		const primary = filtered.slice(0, limit - 1);
		const otherValue = filtered.slice(limit - 1).reduce((sum, row) => sum + Number(row.value || 0), 0);
		return [...primary, { label: 'Other', value: otherValue }];
	}

	function createPieChartImage(rows) {
		const chartRows = buildPieChartSeries(rows);
		const canvas = document.createElement('canvas');
		canvas.width = 900;
		canvas.height = 520;
		const ctx = canvas.getContext('2d');

		if (!ctx) return '';

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		if (chartRows.length === 0) {
			ctx.fillStyle = '#64748b';
			ctx.font = '24px Arial';
			ctx.fillText('No data available', 80, 120);
			return canvas.toDataURL('image/png');
		}

		const total = chartRows.reduce((sum, row) => sum + Number(row.value || 0), 0) || 1;
		const centerX = 235;
		const centerY = 250;
		const radius = 140;
		let startAngle = -Math.PI / 2;

		chartRows.forEach((row, index) => {
			const sliceAngle = ((Number(row.value || 0) || 0) / total) * Math.PI * 2;
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
			ctx.closePath();
			ctx.fillStyle = PIE_CHART_COLORS[index % PIE_CHART_COLORS.length];
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#ffffff';
			ctx.stroke();
			startAngle += sliceAngle;
		});

		ctx.beginPath();
		ctx.arc(centerX, centerY, 62, 0, Math.PI * 2);
		ctx.fillStyle = '#ffffff';
		ctx.fill();

		ctx.fillStyle = '#0f172a';
		ctx.font = 'bold 30px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(String(total), centerX, centerY - 2);
		ctx.font = '20px Arial';
		ctx.fillStyle = '#64748b';
		ctx.fillText('records', centerX, centerY + 24);

		ctx.textAlign = 'left';
		ctx.font = '22px Arial';
		chartRows.forEach((row, index) => {
			const legendY = 110 + index * 54;
			const percent = Math.round(((Number(row.value || 0) || 0) / total) * 100);
			ctx.fillStyle = PIE_CHART_COLORS[index % PIE_CHART_COLORS.length];
			ctx.fillRect(470, legendY - 18, 22, 22);
			ctx.fillStyle = '#0f172a';
			ctx.fillText(`${row.label} (${row.value}, ${percent}%)`, 506, legendY);
		});

		return canvas.toDataURL('image/png');
	}

	function addPieChartsPage(doc, chartItems) {
		doc.addPage();
		doc.setFontSize(18);
		doc.setTextColor(21, 34, 56);
		doc.text('Demographic Pie Charts', 40, 46);
		doc.setFontSize(10);
		doc.setTextColor(71, 85, 105);
		doc.text('These charts highlight the selected attendance records by key demographic fields.', 40, 62);

		const positions = [
			{ x: 40, y: 84 },
			{ x: 305, y: 84 },
			{ x: 40, y: 400 },
			{ x: 305, y: 400 }
		];

		chartItems.forEach((item, index) => {
			const position = positions[index];
			if (!position) return;
			doc.setFontSize(12);
			doc.setTextColor(21, 34, 56);
			doc.text(item.title, position.x, position.y);
			const imageData = createPieChartImage(item.rows);
			if (imageData) {
				doc.addImage(imageData, 'PNG', position.x, position.y + 10, 240, 210);
			}
		});
	}

	async function buildPdfBlob() {
		const { jsPDF } = await import('jspdf');
		const autoTableModule = await import('jspdf-autotable');
		const autoTable = autoTableModule.default || autoTableModule;

		const doc = new jsPDF({ unit: 'pt', format: 'a4' });
		const pageWidth = doc.internal.pageSize.getWidth();
		const rightEdge = pageWidth - 40;
		let y = 48;

		try {
			const logoDataUrl = await getHutLogoDataUrl();
			if (logoDataUrl) {
				doc.addImage(logoDataUrl, 'PNG', 40, 42, 74, 42);
			}
		} catch (error) {
			console.warn('Unable to include The Hut logo in PDF header:', error);
		}

		doc.setTextColor(21, 34, 56);
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(24);
		doc.text('The Hut Community Centre', 126, 66);

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(14);
		doc.setTextColor(71, 85, 105);
		doc.text(reportTitle, 126, 92);

		doc.setFont('helvetica', 'bold');
		doc.setFontSize(11);
		doc.setTextColor(51, 65, 85);
		doc.text('From:', rightEdge - 120, 60);
		doc.text('To:', rightEdge - 120, 84);
		doc.setFont('helvetica', 'normal');
		doc.text(startDate || 'N/A', rightEdge, 60, { align: 'right' });
		doc.text(endDate || 'N/A', rightEdge, 84, { align: 'right' });

		y = 116;
		doc.setDrawColor(226, 232, 240);
		doc.line(40, y, pageWidth - 40, y);
		y += 18;

		autoTable(doc, {
			startY: y,
			head: [['Applied filter', 'Selection']],
			body: getAppliedFiltersList(),
			theme: 'grid',
			headStyles: {
				fillColor: [21, 34, 56],
				textColor: 255,
				fontSize: 10
			},
			styles: {
				fontSize: 9,
				cellPadding: 6
			},
			columnStyles: {
				0: { cellWidth: 120 },
				1: { cellWidth: 'auto' }
			},
			margin: { left: 40, right: 40 }
		});

		y = doc.lastAutoTable.finalY + 22;

		autoTable(doc, {
			startY: y,
			head: [['Metric', 'Value']],
			body: [
				['Unique participants', String(uniqueParticipants.length)],
				['Total attendances', String(totalAttendances)],
				['Total records', String(totalRegistrations)],
				['Attendance rate', `${attendanceRate}%`]
			],
			theme: 'grid',
			headStyles: {
				fillColor: [20, 184, 166],
				textColor: 255,
				fontSize: 10
			},
			styles: {
				fontSize: 10,
				cellPadding: 7
			},
			margin: { left: 40, right: 40 }
		});

		y = doc.lastAutoTable.finalY + 22;
		y = drawBarChart(
			doc,
			'Attendance by program',
			programSummary.slice(0, 8).map((row) => ({ label: row.program, value: row.attendances })),
			y
		);
		y = drawBarChart(
			doc,
			'Attendance by date',
			attendanceByDateSummary.slice(0, 8).map((row) => ({ label: row.date, value: row.attendances })),
			y + 4
		);

		y = ensurePdfSpace(doc, y, 200);
		autoTable(doc, {
			startY: y,
			head: [['Program', 'Category', 'Unique participants', 'Attendances', 'Attendance rate']],
			body:
				programSummary.length > 0
					? programSummary.map((row) => [
							row.program,
							row.category,
							String(row.uniqueParticipants),
							String(row.attendances),
							`${row.attendanceRate}%`
						])
					: [['No data available for the selected filters.', '', '', '', '']],
			theme: 'grid',
			headStyles: {
				fillColor: [21, 34, 56],
				textColor: 255,
				fontSize: 10
			},
			styles: {
				fontSize: 9,
				cellPadding: 6
			},
			margin: { left: 40, right: 40 }
		});

		y = doc.lastAutoTable.finalY + 20;
		autoTable(doc, {
			startY: y,
			head: [['Date', 'Programs held', 'Unique participants', 'Attendances']],
			body:
				attendanceByDateSummary.length > 0
					? attendanceByDateSummary.map((row) => [
							row.date,
							String(row.programCount),
							String(row.uniqueParticipants),
							String(row.attendances)
						])
					: [['No data available for the selected filters.', '', '', '']],
			theme: 'grid',
			headStyles: {
				fillColor: [20, 184, 166],
				textColor: 255,
				fontSize: 10
			},
			styles: {
				fontSize: 9,
				cellPadding: 6
			},
			margin: { left: 40, right: 40 }
		});

		y = doc.lastAutoTable.finalY + 20;
		autoTable(doc, {
			startY: y,
			head: [['Dimension', 'Value', 'Count']],
			body:
				demographicBreakdownRows.length > 0
					? demographicBreakdownRows.map((row) => [row.dimension, row.label, String(row.value)])
					: [['No data available for the selected filters.', '', '']],
			theme: 'grid',
			headStyles: {
				fillColor: [21, 34, 56],
				textColor: 255,
				fontSize: 10
			},
			styles: {
				fontSize: 9,
				cellPadding: 6
			},
			margin: { left: 40, right: 40 }
		});

		addPieChartsPage(doc, [
			{ title: 'Age group', rows: ageSummary },
			{ title: 'Gender', rows: genderSummary },
			{ title: 'ATSI status', rows: atsiSummary },
			{ title: 'CALD background', rows: caldSummary }
		]);

		doc.addPage();
		autoTable(doc, {
			startY: 50,
			head: [[
				'Date',
				'Program category',
				'Program',
				'Participant',
				'Age group',
				'Gender',
				'ATSI',
				'CALD',
				'Council',
				'Township',
				'Status'
			]],
			body:
				filteredRecords.length > 0
					? filteredRecords.map((record) => [
							record.date,
							record.category,
							record.program,
							record.participantName,
							record.ageGroup,
							record.gender,
							record.atsiStatus,
							record.caldBackground,
							record.council,
							record.township,
							record.status
						])
					: [['No data available for the selected filters.', '', '', '', '', '', '', '', '', '', '']],
			theme: 'grid',
			headStyles: {
				fillColor: [20, 184, 166],
				textColor: 255,
				fontSize: 8
			},
			styles: {
				fontSize: 7,
				cellPadding: 4,
				overflow: 'linebreak'
			},
			margin: { left: 24, right: 24 }
		});

		return doc.output('blob');
	}

	async function handlePreview() {
		previewLoading = true;
		exportMenuOpen = false;

		try {
			reportGenerated = true;
			lastGeneratedAt = new Date().toLocaleString('en-AU');
		} finally {
			previewLoading = false;
		}
	}

	async function exportPdf() {
		exporting = true;
		exportMenuOpen = false;

		try {
			const blob = await buildPdfBlob();
			downloadBlob(blob, `the-hut-report-${getTimestampSuffix()}.pdf`);
		} catch (error) {
			console.error('Failed to export PDF:', error);
			alert('Unable to export the PDF. Make sure jspdf and jspdf-autotable are installed.');
		} finally {
			exporting = false;
		}
	}

	function exportCsv() {
		exportMenuOpen = false;
		exporting = true;

		try {
			const content = buildCsvContent();
			const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
			downloadBlob(blob, `the-hut-report-${getTimestampSuffix()}.csv`);
		} catch (error) {
			console.error('Failed to export CSV:', error);
			alert('Unable to export the CSV report.');
		} finally {
			exporting = false;
		}
	}

	function toggleExportMenu() {
		exportMenuOpen = !exportMenuOpen;
	}

	$: ageGroupOptions = buildDisabledAwareOptions({
		allLabel: 'All age groups',
		allValues: MASTER_AGE_GROUPS,
		availableValues: records.map((record) => record.ageGroup),
		preferredOrder: MASTER_AGE_GROUPS
	});
	$: categoryOptions = buildDisabledAwareOptions({
		allLabel: 'All program categories',
		allValues: MASTER_PROGRAM_CATEGORIES,
		availableValues: records.map((record) => record.category),
		preferredOrder: MASTER_PROGRAM_CATEGORIES
	});
	$: programOptions = [
		{ value: 'all', label: 'All programs', disabled: false },
		...uniqueValues(
			records
				.filter((record) => selectedCategory === 'all' || record.category === selectedCategory)
				.map((record) => record.program)
		)
			.sort((a, b) => a.localeCompare(b))
			.map((value) => ({ value, label: value, disabled: false }))
	];
	$: genderOptions = buildDisabledAwareOptions({
		allLabel: 'All genders',
		allValues: MASTER_GENDERS,
		availableValues: records.map((record) => record.gender),
		preferredOrder: MASTER_GENDERS
	});
	$: atsiOptions = buildDisabledAwareOptions({
		allLabel: 'All ATSI statuses',
		allValues: MASTER_BINARY_STATUS,
		availableValues: records.map((record) => record.atsiStatus),
		preferredOrder: MASTER_BINARY_STATUS
	});
	$: caldOptions = buildDisabledAwareOptions({
		allLabel: 'All CALD backgrounds',
		allValues: MASTER_BINARY_STATUS,
		availableValues: records.map((record) => record.caldBackground),
		preferredOrder: MASTER_BINARY_STATUS
	});
	$: councilOptions = buildDisabledAwareOptions({
		allLabel: 'All councils',
		allValues: [...masterCouncils, ...records.map((record) => record.council)],
		availableValues: records.map((record) => record.council)
	});
	$: townshipOptions = buildDisabledAwareOptions({
		allLabel: 'All townships',
		allValues: [...masterTownships, ...records.map((record) => record.township)],
		availableValues: records.map((record) => record.township)
	});

	$: if (!programOptions.some((option) => option.value === selectedProgram && !option.disabled)) {
		selectedProgram = 'all';
	}

	$: filteredRecords = records.filter((record) => {
		const matchesDate = (!startDate || record.date >= startDate) && (!endDate || record.date <= endDate);
		const matchesCategory = selectedCategory === 'all' || record.category === selectedCategory;
		const matchesProgram = selectedProgram === 'all' || record.program === selectedProgram;
		const matchesAge = selectedAgeGroup === 'all' || record.ageGroup === selectedAgeGroup;
		const matchesGender = selectedGender === 'all' || record.gender === selectedGender;
		const matchesAtsi = selectedAtsiStatus === 'all' || record.atsiStatus === selectedAtsiStatus;
		const matchesCald = selectedCaldBackground === 'all' || record.caldBackground === selectedCaldBackground;
		const matchesCouncil = selectedCouncil === 'all' || record.council === selectedCouncil;
		const matchesTownship = selectedTownship === 'all' || record.township === selectedTownship;

		return (
			matchesDate &&
			matchesCategory &&
			matchesProgram &&
			matchesAge &&
			matchesGender &&
			matchesAtsi &&
			matchesCald &&
			matchesCouncil &&
			matchesTownship
		);
	});

	$: uniqueParticipants = [
		...new Set(filteredRecords.map((record) => record.participantName).filter(Boolean))
	];
	$: totalAttendances = filteredRecords.filter((record) => isPresentStatus(record.status)).length;
	$: totalRegistrations = filteredRecords.length;
	$: attendanceRate = totalRegistrations === 0 ? 0 : Math.round((totalAttendances / totalRegistrations) * 100);

	$: ageSummary = createSummary(
		filteredRecords.filter((record) => isPresentStatus(record.status)),
		(record) => record.ageGroup
	);
	$: genderSummary = createSummary(
		filteredRecords.filter((record) => isPresentStatus(record.status)),
		(record) => record.gender
	);
	$: atsiSummary = createSummary(
		filteredRecords.filter((record) => isPresentStatus(record.status)),
		(record) => record.atsiStatus
	);
	$: caldSummary = createSummary(
		filteredRecords.filter((record) => isPresentStatus(record.status)),
		(record) => record.caldBackground
	);
	$: councilSummary = createSummary(
		filteredRecords.filter((record) => isPresentStatus(record.status)),
		(record) => record.council
	);
	$: townshipSummary = createSummary(
		filteredRecords.filter((record) => isPresentStatus(record.status)),
		(record) => record.township
	);

	$: programSummary = [...new Set(filteredRecords.map((record) => record.program))].map((program) => {
		const programRows = filteredRecords.filter((record) => record.program === program);
		const presentRows = programRows.filter((record) => isPresentStatus(record.status));

		return {
			program,
			category: programRows[0]?.category || 'N/A',
			uniqueParticipants: new Set(programRows.map((record) => record.participantName)).size,
			attendances: presentRows.length,
			attendanceRate: programRows.length === 0 ? 0 : Math.round((presentRows.length / programRows.length) * 100)
		};
	});

	$: attendanceByDateSummary = [...new Set(filteredRecords.map((record) => record.date))]
		.sort((a, b) => a.localeCompare(b))
		.map((date) => {
			const dateRows = filteredRecords.filter((record) => record.date === date);
			return {
				date,
				programCount: new Set(dateRows.map((record) => record.program)).size,
				uniqueParticipants: new Set(dateRows.map((record) => record.participantName)).size,
				attendances: dateRows.filter((record) => isPresentStatus(record.status)).length
			};
		});

	$: demographicBreakdownRows = [
		...ageSummary.map((row) => ({ dimension: 'Age group', ...row })),
		...genderSummary.map((row) => ({ dimension: 'Gender', ...row })),
		...atsiSummary.map((row) => ({ dimension: 'ATSI status', ...row })),
		...caldSummary.map((row) => ({ dimension: 'CALD background', ...row })),
		...councilSummary.map((row) => ({ dimension: 'Council', ...row })),
		...townshipSummary.map((row) => ({ dimension: 'Township', ...row }))
	];

	$: reportTitle = buildReportTitle(reportMode, selectedCategory, selectedProgram);

	function buildReportTitle(modeKey, categoryValue, programValue) {
		const modeLabel = reportModes.find((mode) => mode.key === modeKey)?.label || 'Custom Range';
		const categoryLabel = categoryValue === 'all' ? 'All program categories' : categoryValue;
		const programLabel = programValue === 'all' ? 'All programs' : programValue;
		return `${modeLabel} Report – ${categoryLabel} – ${programLabel}`;
	}

	onMount(async () => {
		initialiseDateRange();
		await Promise.all([fetchMasterOptions(), fetchReportRecords()]);
	});

	onDestroy(() => {
		clearPreviewUrl();
	});
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
				<p>
					Build attendance and demographic reports by date, program and participant profile fields.
				</p>
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

			<div class="filter-row four-columns">
				<label>
					<span>Start date</span>
					<input type="date" bind:value={startDate} on:change={handleManualDateChange} />
				</label>

				<label>
					<span>End date</span>
					<input type="date" bind:value={endDate} on:change={handleManualDateChange} />
				</label>

				<label>
					<span>Program category</span>
					<select bind:value={selectedCategory}>
						{#each categoryOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Program</span>
					<select bind:value={selectedProgram}>
						{#each programOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="filter-row four-columns">
				<label>
					<span>Age group</span>
					<select bind:value={selectedAgeGroup}>
						{#each ageGroupOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Gender</span>
					<select bind:value={selectedGender}>
						{#each genderOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>ATSI status</span>
					<select bind:value={selectedAtsiStatus}>
						{#each atsiOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>CALD background</span>
					<select bind:value={selectedCaldBackground}>
						{#each caldOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="filter-row two-columns">
				<label>
					<span>Council</span>
					<select bind:value={selectedCouncil}>
						{#each councilOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Township</span>
					<select bind:value={selectedTownship}>
						{#each townshipOptions as option}
							<option value={option.value} disabled={option.disabled}>
								{option.label}
							</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="action-row">
				<button
					type="button"
					class="secondary-btn"
					on:click={handlePreview}
					disabled={loadingRecords || previewLoading || exporting}
				>
					{previewLoading ? 'Generating Preview…' : 'Preview Report'}
				</button>

				<div class="export-group">
					<button
						type="button"
						class="primary-btn export-main"
						on:click={exportPdf}
						disabled={loadingRecords || previewLoading || exporting}
					>
						{exporting ? 'Exporting…' : 'Export Report'}
					</button>
					<button
						type="button"
						class="primary-btn export-toggle"
						on:click={toggleExportMenu}
						aria-label="Choose export format"
						disabled={loadingRecords || previewLoading || exporting}
					>
						▾
					</button>

					{#if exportMenuOpen}
						<div class="export-menu">
							<button type="button" on:click={exportPdf}>Export as PDF</button>
							<button type="button" on:click={exportCsv}>Export as CSV</button>
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if loadingRecords}
			<div class="status-card">Loading report data from Supabase…</div>
		{:else if loadError}
			<div class="status-card error-card">
				<strong>Could not load report data.</strong>
				<p>{loadError}</p>
			</div>
		{:else}
			<div class="status-bar">
				<div>
					<strong>{filteredRecords.length}</strong> filtered records ready for preview/export.
				</div>
				<div>{reportTitle}</div>
			</div>
		{/if}

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
							{#if lastGeneratedAt}
								<div class="report-generated">Generated: {lastGeneratedAt}</div>
							{/if}
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
								<div class="donut-chart" style={`background: ${getDonutChartBackground(ageSummary)};`}>
									<div class="donut-hole"></div>
								</div>

								<div class="legend-list">
									{#if ageSummary.length === 0}
										<div class="legend-item empty-row">No age data available</div>
									{:else}
										{#each ageSummary as item}
											<div class="legend-item">
												<span>{item.label}</span>
												<strong>{item.value}</strong>
											</div>
										{/each}
									{/if}
								</div>
							</div>
						</div>

						<div class="viz-card">
							<h3>Gender Summary</h3>

							<div class="bar-list">
								{#if genderSummary.length === 0}
									<div class="empty-row">No gender data available</div>
								{:else}
									{#each genderSummary as item}
										<div class="bar-row">
											<div class="bar-label">{item.label}</div>
											<div class="bar-track">
												<div class="bar-fill" style={`width: ${getBarWidth(item.value, genderSummary)}%;`}></div>
											</div>
											<div class="bar-value">{item.value}</div>
										</div>
									{/each}
								{/if}
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
	.report-sheet,
	.status-card {
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 24px;
		box-sizing: border-box;
	}

	.filters-card {
		margin-top: 28px;
		padding: 24px;
	}

	.filters-card h2,
	.report-brand h2 {
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

	.filter-row {
		display: grid;
		gap: 18px;
		margin-bottom: 18px;
	}

	.four-columns {
		grid-template-columns: repeat(4, minmax(180px, 1fr));
	}

	.two-columns {
		grid-template-columns: repeat(2, minmax(180px, 1fr));
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
		align-items: center;
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

	.primary-btn:disabled,
	.secondary-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.primary-btn {
		border: none;
		background: #14b8a6;
		color: #ffffff;
	}

	.primary-btn:hover:enabled {
		background: #0f9b8e;
	}

	.secondary-btn {
		border: 1px solid #d9d9d9;
		background: #ffffff;
		color: #152238;
	}

	.secondary-btn:hover:enabled,
	.dashboard-btn:hover {
		background: #f9fafb;
	}

	.export-group {
		position: relative;
		display: inline-flex;
	}

	.export-main {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.export-toggle {
		padding: 12px 14px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: 1px solid rgba(255, 255, 255, 0.4);
	}

	.export-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 170px;
		background: #ffffff;
		border: 1px solid #d9d9d9;
		border-radius: 16px;
		box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
		overflow: hidden;
		z-index: 20;
	}

	.export-menu button {
		display: block;
		width: 100%;
		padding: 12px 14px;
		border: none;
		background: #ffffff;
		text-align: left;
		font-size: 14px;
		cursor: pointer;
		color: #152238;
	}

	.export-menu button:hover {
		background: #f8fafc;
	}

	.status-card,
	.status-bar,
	.report-preview {
		margin-top: 24px;
	}

	.status-card {
		padding: 20px 24px;
		font-size: 15px;
		color: #334155;
	}

	.error-card {
		border-color: #f2c4c4;
		background: #fff7f7;
	}

	.error-card p {
		margin: 8px 0 0;
	}

	.status-bar {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 18px;
		border: 1px solid #d9d9d9;
		border-radius: 18px;
		background: #ffffff;
		color: #475569;
		font-size: 14px;
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

	.report-generated {
		color: #64748b;
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
		min-width: 180px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		font-size: 15px;
		color: #475569;
	}

	.empty-row {
		font-size: 15px;
		color: #64748b;
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

	@media (max-width: 1280px) {
		.four-columns {
			grid-template-columns: repeat(2, minmax(180px, 1fr));
		}
	}

	@media (max-width: 1200px) {
		.summary-grid,
		.viz-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 1000px) {
		.page-header,
		.report-top,
		.status-bar {
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

		.four-columns,
		.two-columns {
			grid-template-columns: 1fr;
		}

		.action-row {
			flex-direction: column;
			align-items: stretch;
		}

		.export-group {
			width: 100%;
		}

		.export-main {
			flex: 1;
		}

		.summary-grid,
		.viz-grid {
			grid-template-columns: 1fr;
		}

		.bar-row {
			grid-template-columns: 120px 1fr 40px;
		}
	}
</style>
