import { requireActiveStaff } from '$lib/server/staff-permissions';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { staff } = await requireActiveStaff(locals);

	return {
		staff
	};
}