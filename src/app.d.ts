// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, User} from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			supabase: SupabaseClient;
			safeGetUser: () => Promise<{ user: User | null }>;
		}

		interface PageData {
			supabase?: SupabaseClient;
			user?: User | null;
			cookies?: { name: string; value: string }[];
			staff?: {
				staff_id: string;
				full_name: string;
				email: string;
				staff_type: 'employee' | 'volunteer' | null;
				staff_role:
					| 'program_coordinator'
					| 'data_entry'
					| 'manager'
					| 'administrator'
					| null;
				is_active: boolean;
			} | null;
		}
	}
}

export {};
