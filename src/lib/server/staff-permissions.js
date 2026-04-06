import { redirect } from '@sveltejs/kit';

/**
 * @typedef {'program_coordinator' | 'data_entry' | 'manager' | 'administrator'} StaffRole
 */

/**
 * @typedef {'employee' | 'volunteer' | null} StaffType
 */

/**
 * @typedef {{
 *   staff_id: string,
 *   full_name: string,
 *   email: string,
 *   is_active: boolean,
 *   staff_type: StaffType,
 *   staff_role: StaffRole | null
 * }} StaffProfile
 */

/** @type {{
 *   PROGRAM_COORDINATOR: StaffRole,
 *   DATA_ENTRY: StaffRole,
 *   MANAGER: StaffRole,
 *   ADMINISTRATOR: StaffRole
 * }}
 */
export const STAFF_ROLES = {
	PROGRAM_COORDINATOR: 'program_coordinator',
	DATA_ENTRY: 'data_entry',
	MANAGER: 'manager',
	ADMINISTRATOR: 'administrator'
};

/**
 * @param {App.Locals} locals
 * @returns {Promise<{ user: import('@supabase/supabase-js').User, staff: StaffProfile }>}
 */
export async function requireActiveStaff(locals) {
	const { user } = await locals.safeGetUser();

	if (!user) {
		throw redirect(303, '/staff/login');
	}

	const { data: staff, error: staffError } = await locals.supabase
		.from('staff')
		.select('staff_id, full_name, email, is_active, staff_type, staff_role')
		.eq('auth_user_id', user.id)
		.maybeSingle();

	if (staffError || !staff || !staff.is_active) {
		console.error('Failed to load active staff profile:', staffError);
		throw redirect(303, '/staff/login');
	}

	return { user, staff };
}

/**
 * @param {StaffProfile | null | undefined} staff
 * @param {StaffRole[]} allowedRoles
 */
export function requireRole(staff, allowedRoles) {
	if (!staff?.staff_role || !allowedRoles.includes(staff.staff_role)) {
		throw redirect(303, '/staff/dashboard');
	}
}

/**
 * @param {StaffRole | null | undefined} staffRole
 * @returns {boolean}
 */
export function isManagerLike(staffRole) {
	return (
		staffRole === STAFF_ROLES.MANAGER ||
		staffRole === STAFF_ROLES.ADMINISTRATOR
	);
}