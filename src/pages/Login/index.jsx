import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../utils/authContext";
import {getGoogleAuthUrl} from "../../utils/request";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

function Login() {
	const navigate = useNavigate();
	const {login} = useAuth();
	const {t} = useTranslation();
	const [formData, setFormData] = useState({
		emailOrUsername: "",
		password: "",
		rememberMe: false,
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		const {name, value, type, checked} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		// Clear error when user starts typing
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
			newErrors.emailOrUsername = t("validation.emailOrUsernameRequired");
		}

		if (!formData.password) {
			newErrors.password = t("validation.passwordRequired");
		} else if (formData.password.length < 6) {
			newErrors.password = t("validation.passwordMinLength");
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
				navigate("/");
			} else {
				setErrors({
					submit: result.message || t("messages.error.loginFailed"),
				});
			}
		} catch (error) {
			console.error("Login error:", error);
			setErrors({
				submit: t("messages.error.genericError"),
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = getGoogleAuthUrl();
	};

	return (
		<div className={cx("loginContainer")}>
			{/* Back to Home Button */}
			<button
				className={cx("backToHome")}
				onClick={() => navigate("/")}
				title={t("auth.backToHome")}
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("loginCard")}>
				<div className={cx("loginHeader")}>
					<h1 className={cx("title")}>{t("auth.loginTitle")}</h1>
					<p className={cx("subtitle")}>{t("auth.loginSubtitle")}</p>
				</div>

				<form className={cx("loginForm")} onSubmit={handleSubmit}>
					{" "}
					<div className={cx("inputGroup")}>
						<label htmlFor='emailOrUsername' className={cx("label")}>
							{t("auth.emailOrUsername")}
						</label>
						<input
							type='text'
							id='emailOrUsername'
							name='emailOrUsername'
							value={formData.emailOrUsername}
							onChange={handleChange}
							className={cx("input", {inputError: errors.emailOrUsername})}
							placeholder={t("placeholders.enterEmailOrUsername")}
						/>
						{errors.emailOrUsername && (
							<span className={cx("errorMessage")}>{errors.emailOrUsername}</span>
						)}
					</div>
					<div className={cx("inputGroup")}>
						<label htmlFor='password' className={cx("label")}>
							{t("auth.password")}
						</label>
						<input
							type='password'
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className={cx("input", {inputError: errors.password})}
							placeholder={t("placeholders.enterPassword")}
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
							<span className={cx("checkboxText")}>{t("auth.rememberMe")}</span>
						</label>
						<Link to='/forgot-password' className={cx("forgotLink")}>
							{t("auth.forgotPasswordButton")}
						</Link>
					</div>
					{errors.submit && <div className={cx("submitError")}>{errors.submit}</div>}
					<button
						type='submit'
						className={cx("submitButton", {loading: isLoading})}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<span className={cx("spinner")}></span>
								{t("auth.processing")}
							</>
						) : (
							t("auth.loginButton")
						)}
					</button>
					<div className={cx("divider")}>
						<span>{t("auth.or")}</span>
					</div>
					<button
						type='button'
						className={cx("googleButton")}
						onClick={handleGoogleLogin}
						disabled={isLoading}
					>
						<svg width='20' height='20' viewBox='0 0 24 24'>
							<path
								fill='#4285F4'
								d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
							/>
							<path
								fill='#34A853'
								d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
							/>
							<path
								fill='#FBBC05'
								d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
							/>
							<path
								fill='#EA4335'
								d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
							/>
						</svg>
						{t("auth.googleLogin")}
					</button>
				</form>

				<div className={cx("loginFooter")}>
					<p className={cx("signupText")}>
						{t("auth.noAccount")}{" "}
						<Link to='/register' className={cx("signupLink")}>
							{t("auth.registerNow")}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
