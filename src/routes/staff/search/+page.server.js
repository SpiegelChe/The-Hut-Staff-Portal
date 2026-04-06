import { requireActiveStaff, requireRole, STAFF_ROLES } from '$lib/server/staff-permissions';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { staff } = await requireActiveStaff(locals);

	requireRole(staff, [
		STAFF_ROLES.DATA_ENTRY,
		STAFF_ROLES.MANAGER,
		STAFF_ROLES.ADMINISTRATOR
	]);

	return {
		staff
	};
}