<script>
    import Header from '$lib/components/Header.svelte';
    /*import bgPortrait from '$lib/images/staff_portal.png';*/
    import bgLandscape from '$lib/images/staff_portal_horizontal.png';
</script>

<svelte:head>
    <title>The Hut Community Staff Portal</title>
    <meta name="description" content="THCC data managing home page" />
</svelte:head>

<Header showLogout={false}/>

<section class="page landscape" style={`--bg-url: url(${bgLandscape});`}>
    <div class="content">
        <h1>STAFF</h1>
        <p class="hint">Welcome back!</p>
        <a class="btn btn_staff" href="/staff/login">LOGIN</a>
    </div>
</section>

<style>
	:global(html),
    :global(body) {
        margin: 0;
        height: 100%;
    }

	.page {
		position: fixed;
		top: 75px;   /* same as header height */
		left: 0;
		right: 0;
		bottom: 0;

		display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

		color: rgb(6, 99, 92);

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

	.landscape {
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0.38)),
        var(--bg-url);
	}

	.content {
		text-align: center;
		width: min(720px, 92%);
		padding: 20px;
		box-sizing: border-box;
	}

	h1 {
		margin: 0;
		font-size: clamp(60px, 8vw, 110px);
        font-weight: 900;
		letter-spacing: 0.03em;
		line-height: 1;
		white-space: nowrap;     /* keep one line */
		text-align: center;
		text-shadow:
            1px 0 0 #ffffff,
            -1px 0 0 #ffffff,
            0 1px 0 #ffffff,
            0 -1px 0 #ffffff,
            1px 1px 0 #ffffff,
            -1px 1px 0 #ffffff,
            1px -1px 0 #ffffff,
            -1px -1px 0 #ffffff;
	}

	.hint {
		margin: 22px 0 0;
		font-size: 26px;
		font-weight: 400;
		letter-spacing: 0.02em;
		text-shadow:
            0.6px 0 0 #ffffff,
            -0.6px 0 0 #ffffff,
            0 0.6px 0 #ffffff,
            0 -0.6px 0 #ffffff;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 120px;
		height: 44px;
		padding: 0 18px;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 900;
		letter-spacing: 0.06em;
		transition: transform 0.18s ease, box-shadow 0.18s ease;
	}

	.btn_staff {
		background: #c55a1b;
		color: #fff;
		margin-top: 26px;
		box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
	}

	.btn_staff:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
	}

	.btn_staff:active {
		transform: translateY(0);
		box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
	}

	@media (max-width: 900px) {
		h1 {
			font-size: 78px;
		}

		.hint {
		font-size: 22px;
		}
	}

</style>