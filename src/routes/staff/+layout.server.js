import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
	const { user } = await locals.safeGetUser();

	const isAuthPage = url.pathname === '/staff/login' || url.pathname === '/staff/register';

	// Allow public access to login and register pages
	// All other /staff/* pages require login
	if (!user) {
		if (isAuthPage) {
			return { user: null, staff: null };
		}
		throw redirect(303, '/staff/login');
	}

	// Check whether login is valid
	const { data: staff, error: staffError } = await locals.supabase
		.from('staff')
		.select('staff_id, full_name, email, is_active, staff_type, staff_role')
		.eq('auth_user_id', user.id)
		.maybeSingle();

	// Check whether account is valid and active
	if (staffError || !staff || !staff.is_active) {
		console.error('Failed to load active staff profile:', staffError);

		if (isAuthPage) {
			return { user, staff: null };
		}
		throw redirect(303, '/staff/login');
	}

	// Logged-in account should not stay on login/register pages
	if (isAuthPage) {
		throw redirect(303, '/staff/dashboard');
	}

	return {
		user,
		staff
	};
}