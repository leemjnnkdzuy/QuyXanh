import axios from "axios";

const BASE_API_URL = "http://localhost:3001";

const apiClient = axios.create({
	baseURL: BASE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

const externalApiClient = axios.create({
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const makeRequest = async (url, options = {}) => {
	try {
		const config = {
			url,
			method: options.method || "GET",
			data: options.body ? JSON.parse(options.body) : undefined,
			headers: {
				...options.headers,
			},
			withCredentials: options.credentials === "include",
		};

		const response = await apiClient(config);

		return {
			success: true,
			data: response.data,
			message: response.data.message || "Success",
			status: response.status,
		};
	} catch (error) {
		if (error.response) {
			return {
				success: false,
				data: error.response.data,
				message: error.response.data?.message || "Server error occurred",
				status: error.response.status,
			};
		} else if (error.request) {
			return {
				success: false,
				message: "Network error occurred",
				error: error.message,
			};
		} else {
			return {
				success: false,
				message: "An error occurred",
				error: error.message,
			};
		}
	}
};

const makeExternalRequest = async (url, options = {}) => {
	try {
		const config = {
			url,
			method: options.method || "GET",
			data: options.body ? JSON.parse(options.body) : undefined,
			headers: {
				...options.headers,
			},
			withCredentials: options.credentials === "include",
		};

		const response = await externalApiClient(config);

		return {
			success: true,
			data: response.data,
			message: response.data.message || "Success",
			status: response.status,
		};
	} catch (error) {
		if (error.response) {
			return {
				success: false,
				data: error.response.data,
				message: error.response.data?.message || "Server error occurred",
				status: error.response.status,
			};
		} else if (error.request) {
			return {
				success: false,
				message: "Network error occurred",
				error: error.message,
			};
		} else {
			return {
				success: false,
				message: "An error occurred",
				error: error.message,
			};
		}
	}
};

export const healthCheck = () => makeRequest("/health", {method: "GET"});

export const register = (userData) => {
	const {firstName, lastName, username, email, password, phoneNumber} = userData;
	return makeRequest("/api/users/register", {
		method: "POST",
		body: JSON.stringify({
			username,
			email,
			password,
			fullName: `${firstName} ${lastName}`,
			phoneNumber: phoneNumber || "",
		}),
	});
};

export const verifyEmail = (email, code) =>
	makeRequest("/api/users/verify-email", {
		method: "POST",
		body: JSON.stringify({email, code}),
	});

export const login = (emailOrUsername, password) =>
	makeRequest("/api/users/login", {
		method: "POST",
		body: JSON.stringify({emailOrUsername, password}),
	});

export const getProfile = () =>
	makeRequest("api/users/profile", {method: "GET"});

export const forgotPassword = (email) =>
	makeRequest("/api/users/forgot-password", {
		method: "POST",
		body: JSON.stringify({email}),
	});

export const verifyResetCode = (email, code) =>
	makeRequest("/api/users/verify-reset-code", {
		method: "POST",
		body: JSON.stringify({email, code}),
	});

export const resetPassword = (email, code, newPassword) =>
	makeRequest("/api/users/reset-password", {
		method: "POST",
		body: JSON.stringify({email, code, newPassword}),
	});

export const changePassword = (currentPassword, newPassword) =>
	makeRequest("/api/users/change-password", {
		method: "POST",
		body: JSON.stringify({currentPassword, newPassword}),
	});

export const logout = () => makeRequest("/api/users/logout", {method: "POST"});

export const refreshToken = () =>
	makeRequest("/api/users/refresh-token", {
		method: "POST",
		credentials: "include",
	});

export const getGoogleAuthUrl = () => `${BASE_API_URL}/api/users/auth/google`;

export const fetchVietnamMapData = () =>
	makeExternalRequest(
		"https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json",
		{
			method: "GET",
		}
	);
