/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, cookies }) {
	const { user } = await locals.safeGetUser();

	return {
		user,
		cookies: cookies.getAll()
	};
}