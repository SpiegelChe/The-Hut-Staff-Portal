<script>
    import Header from '$lib/components/Header.svelte';

	/** @param {SubmitEvent} event */
	function handleSubmit(event) {
        event.preventDefault();
        window.location.href = '/staff/dashboard';
    }
</script>

<Header
    showLogout={false}
/>

<svelte:head>
	<title>Staff Login</title>
</svelte:head>

<section class="login-box">
    <h1>Staff Login</h1>
	<p class="sub">Enter your account/password</p>

	<form class="card" on:submit={handleSubmit}>
		<label>
			Email
			<input placeholder="name@thehut.org.au" />
		</label>

		<label>
			Password
			<input type="password" placeholder="••••••••" />
		</label>

		<button class="btn" type="submit">Sign in</button>
	</form>
</section>

<style>
	.login-box {
		max-width: 720px;
		margin: 0 auto;
		padding: calc(80px + 24px) 16px 0;
	}
	.sub { opacity: 0.8; }
	.card {
		margin-top: 18px;
		padding: 18px;
		border: 1px solid rgba(0,0,0,0.2);
		border-radius: 12px;
		background: rgba(255,255,255,0.7);
	}
	label { display:block; margin-bottom: 12px; font-weight: 700; }
	input {
		display:block;
		width: 95%;
		margin-top: 6px;
		padding: 10px 12px;
		border-radius: 8px;
		border: 1px solid rgba(0,0,0,0.25);
	}
	.btn {
		display: inline-flex;
		margin-top: 10px;
		padding: 10px 14px;
		border-radius: 10px;
		background: #c55a1b;
		color: #fff;
		text-decoration: none;
		font-weight: 800;
		border: none;
		cursor: pointer;
	}
</style>