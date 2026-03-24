<script>
	import hutLogo from '$lib/images/The-Hut-Logo-150px.png';

	let {
		showLogout = false
	} = $props();
</script>

<header class="site-header">
	<div class="left">
		<a class="logo-link" href="/">
			<img class="logo" src={hutLogo} alt="The Hut Community Centre logo" />
		</a>

		<div class="titles">
			<h1>The Hut Community Staff Portal</h1>
		</div>
	</div>

	<div class="right">
		{#if showLogout}
			<a class="logout-btn" href="/">
        		<span class="icon">↪</span>
        		Logout
    		</a>
		{:else}
			<div class="logout-placeholder"></div>
		{/if}
	</div>
</header>

<style>
	.site-header {
		height: 70px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 28px;
		background: #ffffff;
		border-bottom: 1px solid #d9d9d9;
		box-sizing: border-box;
		gap: 20px;
	}

	.left {
		display: flex;
		align-items: center;
		gap: 18px;
		min-width: 0;
		flex: 1;
		margin-left: 30px;
	}

	.logo-link {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		flex-shrink: 0;
	}

	.logo {
		height: 54px;
		width: auto;
		object-fit: contain;
		flex-shrink: 0;
	}

	.titles {
		min-width: 0;
		flex: 1; /* flexible title */
	}

	.titles h1 {
		margin: 0;
		font-size: clamp(10px, 3.2vw, 25px); /* flexible font size */
		font-weight: 700;
		line-height: 1.4;
		color: #152238;
		white-space: nowrap;   /* no return */
		overflow: hidden;      /* if words overflow */
		text-overflow: ellipsis;
		}

	.right {
		flex-shrink: 0;
		margin-right: 30px;
	}

	.logout-btn,
	.logout-placeholder {
		width: 120px;
		height: 35px;
		border-radius: 15px;
		box-sizing: border-box;
	}

	.logout-btn {
		border: 1px solid #d9d9d9;
		background: #fff;
		color: #111827;
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;

		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.logout-btn:hover {
		background: #f9fafb;
	}

	.logout-placeholder {
		visibility: hidden;
	}

	.icon {
		font-size: 15px;
		line-height: 1;
	}
</style>