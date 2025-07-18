import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {login as loginApi, logout as logoutApi} from "./request";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const handleLogout = useCallback(async () => {
		try {
			await logoutApi();
		} catch (error) {
			console.error("Logout API error:", error);
		}

		localStorage.removeItem("authToken");
		document.cookie =
			"YIF+pxrGp0isUkYUsAWxn3rQH6pBrNY_=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		setIsAuthenticated(false);
		setUser(null);
		setToken(null);
		navigate("/");
	}, [navigate]);

	useEffect(() => {
		const checkAuth = () => {
			const storedToken = localStorage.getItem("authToken");

			if (storedToken) {
				try {
					const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
					if (tokenData.exp * 1000 > Date.now()) {
						setIsAuthenticated(true);
						setToken(storedToken);
						setUser({
							id: tokenData.id,
							fullName: tokenData.fullName || tokenData.name,
							role: tokenData.role,
							email: tokenData.email,
						});
						if (!document.cookie.includes("YIF+pxrGp0isUkYUsAWxn3rQH6pBrNY_")) {
							const expiryDate = new Date(tokenData.exp * 1000);
							document.cookie = `YIF+pxrGp0isUkYUsAWxn3rQH6pBrNY_=true; expires=${expiryDate.toUTCString()}; path=/`;
						}
					} else {
						handleLogout();
					}
				} catch (error) {
					handleLogout();
				}
			}
			setLoading(false);
		};

		checkAuth();
	}, [handleLogout]);

	useEffect(() => {
		if (!loading) {
			if (isAuthenticated) {
				if (location.pathname === "/login") {
					navigate("/");
				}
			} else {
				if (location.pathname === "/") {
					navigate("/");
				}
			}
		}
	}, [isAuthenticated, loading, location.pathname, navigate]);
	const login = async (emailOrUsername, password) => {
		try {
			const response = await loginApi(emailOrUsername, password);
			
			if (response.success && response.data?.data?.accessToken) {
				const token = response.data.data.accessToken;
				const userData = response.data.data.user;

				console.log("Token:", token);
				console.log("User data:", userData);

				const tokenData = JSON.parse(atob(token.split(".")[1]));
				const expiryDate = new Date(tokenData.exp * 1000);

				localStorage.setItem("authToken", token);
				document.cookie = `YIF+pxrGp0isUkYUsAWxn3rQH6pBrNY_=true; expires=${expiryDate.toUTCString()}; path=/`;

				setToken(token);
				setIsAuthenticated(true);
				setUser({
					id: userData._id,
					fullName: userData.fullName,
					email: userData.email,
					username: userData.username,
					role: userData.role,
					avatar: userData.avatar,
					phoneNumber: userData.phoneNumber,
					isVerified: userData.isVerified,
				});

				return {success: true};
			}
			return {
				success: false,
				message: response.message || "Tên đăng nhập hoặc mật khẩu không đúng",
			};
		} catch (error) {
			return {
				success: false,
				message: "Có lỗi xảy ra, vui lòng thử lại",
			};
		}
	};

	const value = {
		isAuthenticated,
		user,
		token,
		loading,
		login,
		logout: handleLogout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
