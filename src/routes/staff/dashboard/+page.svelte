<script>
    import Header from '$lib/components/Header.svelte';

    let { data } = $props();

	const firstName = $derived(data?.staff?.full_name?.split(' ')[0] || 'there');
</script>

<svelte:head>
    <title>Staff Dashboard | The Hut Event Managing System</title>
    <meta name="description" content="Staff dashboard" />
</svelte:head>

<Header
    showLogout={true}
/>

<section class="dashboard-page">
    <div class="titles">
        <h1>Dashboard</h1>
        <p>Welcome back {firstName}! Where do we start today?</p>
    </div>

    <a class="card attendance" href="/staff/attendance">
        <h1>Tick Attendance</h1>
        <p>Record attendance for ongoing program.</p>
    </a>

    <a class="card add-participant" href="/staff/participants">
        <h1>Add Participant</h1>
        <p>Register new participants or assign them into a program.</p>
    </a>

    <a class="card add-program" href="/staff/programs">
        <h1>Add Program</h1>
        <p>Register information of new programs.</p>
    </a>

    <a class="card record" href="/staff/search">
        <h1>Find Participant</h1>
        <p>Search and view participant records and history.</p>
    </a>

    <a class="card report" href="/staff/reports">
        <h1>View Reports</h1>
        <p>Browse attendance and program statistics.</p>
    </a>

    <a class="card training" href="/staff/training">
        <h1>Start training</h1>
        <p>Get to know how the system works.</p>
    </a>
</section>

<style>
    :global(body) {
        margin: 0;
        background: #f8fafc;
        font-family: Arial, Helvetica, sans-serif;
        color: #0f172a;
    }

    .dashboard-page {
        min-height: calc(100vh - 112px);
        background: #f8fafc;
        padding: 40px 64px 56px;
        box-sizing: border-box;

        display: grid;
        grid-template-columns: repeat(3, minmax(280px, 1fr));
        gap: 28px;
    }

    .titles {
        grid-column: 1 / -1;
        margin-bottom: 4px;
    }

    .titles h1 {
        margin: 0 0 10px;
        font-size: clamp(30px, 4vw, 40px);
        font-weight: 700;
        line-height: 1.1;
        color: #0f172a;
    }

    .titles p {
        margin: 0;
        font-size: 15px;
        line-height: 1.5;
        color: #475569;
    }

    .card {
        position: relative;
        min-height: 220px;
        padding: 112px 30px 30px;
        background: #ffffff;
        border: 2px solid #e5e7eb;
        border-radius: 22px;
        box-sizing: border-box;
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        text-decoration: none;
        display: block;
    }

    .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        border-color: #cbd5e1;
    }

    .card h1 {
        margin: 0 0 12px;
        font-size: clamp(20px, 2vw, 25px);
        font-weight: 600;
        line-height: 1.2;
        color: #0f172a;
    }

    .card p {
        margin: 0;
        font-size: 14px;
        line-height: 1.55;
        color: #475569;
    }

    .card::before {
        position: absolute;
        top: 28px;
        left: 30px;
        width: 68px;
        height: 68px;
        border-radius: 14px;

        display: flex;
        align-items: center;
        justify-content: center;

        color: #ffffff;
        font-size: 30px;
        font-weight: 800;
        line-height: 1;
    }

    .attendance::before {
        content: '✓';
        background: #22c55e;
    }

    .add-participant::before {
        content: '+';
        background: #3b82f6;
    }

    .add-program::before {
        content: 'P';
        background: #a855f7;
    }

    .record::before {
        content: '⌕';
        background: #f97316;
    }

    .report::before {
        content: '▥';
        background: #14b8a6;
    }

    .training::before {
        content: 'i';
        background: #64748b;
    }

    @media (max-width: 1200px) {
        .dashboard-page {
            grid-template-columns: repeat(2, minmax(280px, 1fr));
            padding: 36px 32px 48px;
        }
    }

    @media (max-width: 760px) {
        .dashboard-page {
            grid-template-columns: 1fr;
            padding: 28px 16px 40px;
            gap: 20px;
        }

        .card {
            min-height: 190px;
            padding: 102px 24px 24px;
        }

        .card::before {
            top: 24px;
            left: 24px;
            width: 60px;
            height: 60px;
            font-size: 26px;
        }
    }
</style>