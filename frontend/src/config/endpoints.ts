export const API_BASE_URL = "http://localhost:19722";

export const ENDPOINTS = {
	GET: {
		shopItems: `${API_BASE_URL}/api/items/shop`
	},

	ADMIN: {
		GET: {
			shopItems: `${API_BASE_URL}/admin/api/items/shop`
		},
		POST: {
			shopItem: `${API_BASE_URL}/admin/api/items/shop`,
		}
	},

	AUTH: {
		verify: `${API_BASE_URL}/api/users/auth/verify`,
		signIn: `${API_BASE_URL}/api/users/auth/signin`,
		signUp: `${API_BASE_URL}/api/users/auth/signup`,
		signOut: `${API_BASE_URL}/api/users/auth/signout`,
	}
};