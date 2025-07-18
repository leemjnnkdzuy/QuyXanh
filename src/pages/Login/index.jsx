import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft, FiUser} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {useAuth} from "../../utils/authContext";
import {useTheme} from "../../utils/themeContext";
import {getGoogleAuthUrl} from "../../utils/request";
import PopupNotification from "../../components/PopupNotification";
import SpinnerLoading from "../../components/SpinnerLoading";
import styles from "./Login.module.scss";
import assets from "../../assets";

const cx = classNames.bind(styles);

function Login() {
	const navigate = useNavigate();
	const {login, isAuthenticated} = useAuth();
	const {isDarkMode} = useTheme();
	const [formData, setFormData] = useState({
		emailOrUsername: "",
		password: "",
		rememberMe: false,
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "error",
	});

	// Redirect to home if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/home");
		}
	}, [isAuthenticated, navigate]);

	const showNotification = (message, type = "error") => {
		setNotification({
			show: true,
			message,
			type,
		});
	};

	const hideNotification = () => {
		setNotification((prev) => ({
			...prev,
			show: false,
		}));
	};

	const handleChange = (e) => {
		const {name, value, type, checked} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};
	const validateForm = () => {
		const newErrors = {};

		if (!formData.emailOrUsername) {
			newErrors.emailOrUsername = "Email hoặc tên đăng nhập là bắt buộc";
		}

		if (!formData.password) {
			newErrors.password = "Mật khẩu là bắt buộc";
		} else if (formData.password.length < 6) {
			newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});

		try {
			const result = await login(formData.emailOrUsername, formData.password);

			if (result.success) {
				showNotification("Đăng nhập thành công!", "success");
				setTimeout(() => {
					navigate("/home");
				}, 1500);
			} else {
				setErrors({
					submit: result.message || "Tên đăng nhập hoặc mật khẩu không đúng",
				});
			}
		} catch (error) {
			console.error("Login error:", error);
			setErrors({
				submit: "Có lỗi xảy ra, vui lòng thử lại",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = getGoogleAuthUrl();
	};

	return (
		<div
			className={cx("loginContainer")}
			data-theme={isDarkMode ? "dark" : "light"}
		>
			<button
				className={cx("backToHome")}
				onClick={() => navigate("/")}
				title='Quay về trang chủ'
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("loginCard")}>
				<div className={cx("loginHeader")}>
					<div className={cx("iconContainer")}>
						<FiUser size={48} color='#667eea' />
					</div>
					<h1 className={cx("title")}>Chào mừng bạn trở lại!</h1>
					<p className={cx("subtitle")}>Đăng nhập vào tài khoản của bạn để tiếp tục</p>
				</div>

				<form className={cx("loginForm")} onSubmit={handleSubmit}>
					<div className={cx("inputGroup")}>
						<label htmlFor='emailOrUsername' className={cx("label")}>
							Email hoặc tên đăng nhập
						</label>
						<input
							type='text'
							id='emailOrUsername'
							name='emailOrUsername'
							value={formData.emailOrUsername}
							onChange={handleChange}
							className={cx("input", {inputError: errors.emailOrUsername})}
							placeholder='Nhập email hoặc tên đăng nhập'
							autoFocus
						/>
						{errors.emailOrUsername && (
							<span className={cx("errorMessage")}>{errors.emailOrUsername}</span>
						)}
					</div>

					<div className={cx("inputGroup")}>
						<label htmlFor='password' className={cx("label")}>
							Mật khẩu
						</label>
						<input
							type='password'
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className={cx("input", {inputError: errors.password})}
							placeholder='Nhập mật khẩu'
						/>
						{errors.password && (
							<span className={cx("errorMessage")}>{errors.password}</span>
						)}
					</div>

					<div className={cx("formOptions")}>
						<label className={cx("checkboxLabel")}>
							<input
								type='checkbox'
								name='rememberMe'
								checked={formData.rememberMe}
								onChange={handleChange}
								className={cx("checkbox")}
							/>
							<span className={cx("checkboxText")}>Ghi nhớ đăng nhập</span>
						</label>
						<button
							type='button'
							onClick={() => navigate("/forgot-password")}
							className={cx("forgotLink")}
						>
							Quên mật khẩu?
						</button>
					</div>

					{errors.submit && <div className={cx("submitError")}>{errors.submit}</div>}

					<button
						type='submit'
						className={cx("submitButton", {loading: isLoading})}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<SpinnerLoading size='16px' />
								Đang đăng nhập...
							</>
						) : (
							"Đăng nhập"
						)}
					</button>

					<div className={cx("divider")}>
						<span>Hoặc</span>
					</div>

					<button
						type='button'
						className={cx("googleButton")}
						onClick={handleGoogleLogin}
						disabled={isLoading}
					>
						<img className={cx("google-icon")} src={assets.google_icon} alt='Google Icon' />
						Đăng nhập với Google
					</button>
				</form>

				<div className={cx("loginFooter")}>
					<p className={cx("signupText")}>
						Chưa có tài khoản?{" "}
						<button
							type='button'
							onClick={() => navigate("/register")}
							className={cx("signupLink")}
						>
							Đăng ký ngay
						</button>
					</p>
				</div>
			</div>

			{notification.show && (
				<PopupNotification
					message={notification.message}
					type={notification.type}
					onClose={hideNotification}
					duration={4000}
				/>
			)}
		</div>
	);
}

export default Login;
