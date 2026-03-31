import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = await locals.safeGetUser();

	if (user) {
		throw redirect(303, '/staff/dashboard');
	}

	return {};
}