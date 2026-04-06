import {
	requireActiveStaff,
	requireRole,
	STAFF_ROLES,
	isManagerLike
} from '$lib/server/staff-permissions';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { staff } = await requireActiveStaff(locals);

	requireRole(staff, [
		STAFF_ROLES.PROGRAM_COORDINATOR,
		STAFF_ROLES.DATA_ENTRY,
		STAFF_ROLES.MANAGER,
		STAFF_ROLES.ADMINISTRATOR
	]);

	return {
		staff,
		permissions: {
			ownProgramsOnly: staff.staff_role === STAFF_ROLES.PROGRAM_COORDINATOR,
			canViewAllPrograms:
				staff.staff_role === STAFF_ROLES.DATA_ENTRY || isManagerLike(staff.staff_role)
		}
	};
}