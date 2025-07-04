import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import {register as registerApi} from "../../utils/request";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

function Register() {
	const navigate = useNavigate();
	const {t} = useTranslation();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		phoneNumber: "",
		agreeToTerms: false,
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showVerification, setShowVerification] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

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

		if (!formData.firstName.trim()) {
			newErrors.firstName = t("validation.firstNameRequired");
		}
		if (!formData.lastName.trim()) {
			newErrors.lastName = t("validation.lastNameRequired");
		}

		if (!formData.username.trim()) {
			newErrors.username = t("validation.usernameRequired");
		} else if (formData.username.length < 3) {
			newErrors.username = t("validation.usernameMinLength");
		} else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
			newErrors.username = t("validation.usernameFormat");
		}

		if (!formData.email) {
			newErrors.email = t("validation.emailRequired");
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = t("validation.emailInvalid");
		}

		if (!formData.password) {
			newErrors.password = t("validation.passwordRequired");
		} else if (formData.password.length < 8) {
			newErrors.password = t("validation.passwordMinLength8");
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password = t("validation.passwordComplexity");
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = t("validation.confirmPasswordRequired");
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = t("validation.passwordMismatch");
		}

		if (!formData.agreeToTerms) {
			newErrors.agreeToTerms = t("validation.mustAgreeToTerms");
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
			const response = await registerApi(formData);

			if (response.success) {
				setShowVerification(true);
				setSuccessMessage(t("auth.successMessage", {email: formData.email}));
			} else {
				setErrors({
					submit: response.message || t("messages.error.registrationFailed"),
				});
			}
		} catch (error) {
			console.error("Registration error:", error);
			setErrors({
				submit: t("messages.error.genericError"),
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Email verification success component
	if (showVerification) {
		return (
			<div className={cx("registerContainer")}>
				<button
					className={cx("backToHome")}
					onClick={() => navigate("/")}
					title={t("auth.backToHome")}
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("registerCard")}>
					<div className={cx("registerHeader")}>
						<h1 className={cx("title")}>{t("auth.successTitle")}</h1>
						<p className={cx("subtitle")}>
							{t("auth.successMessage", {email: formData.email})}
						</p>
					</div>
					<div className={cx("verificationActions")}>
						<Link
							to={`/verify-email?email=${encodeURIComponent(formData.email)}`}
							className={cx("submitButton")}
						>
							{t("auth.verifyEmailNow")}
						</Link>
						<Link to='/login' className={cx("loginLink")}>
							{t("auth.goToLogin")}
						</Link>
						<p className={cx("resendText")}>
							{t("resendNotReceived")}{" "}
							<button
								type='button'
								className={cx("resendLink")}
								onClick={() => setShowVerification(false)}
							>
								{t("auth.changeEmail")}
							</button>
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={cx("registerContainer")}>
			{/* Back to Home Button */}
			<button
				className={cx("backToHome")}
				onClick={() => navigate("/")}
				title={t("auth.backToHome")}
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("registerCard")}>
				<div className={cx("registerHeader")}>
					<h1 className={cx("title")}>{t("auth.registerTitle")}</h1>
					<p className={cx("subtitle")}>{t("auth.registerSubtitle")}</p>
				</div>

				<form className={cx("registerForm")} onSubmit={handleSubmit}>
					<div className={cx("nameRow")}>
						<div className={cx("inputGroup")}>
							<label htmlFor='firstName' className={cx("label")}>
								{t("auth.firstName")}
							</label>
							<input
								type='text'
								id='firstName'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								className={cx("input", {inputError: errors.firstName})}
								placeholder={t("placeholders.enterFirstName")}
							/>
							{errors.firstName && (
								<span className={cx("errorMessage")}>{errors.firstName}</span>
							)}
						</div>

						<div className={cx("inputGroup")}>
							<label htmlFor='lastName' className={cx("label")}>
								{t("auth.lastName")}
							</label>
							<input
								type='text'
								id='lastName'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								className={cx("input", {inputError: errors.lastName})}
								placeholder={t("placeholders.enterLastName")}
							/>
							{errors.lastName && (
								<span className={cx("errorMessage")}>{errors.lastName}</span>
							)}
						</div>
					</div>

					<div className={cx("inputGroup")}>
						<label htmlFor='username' className={cx("label")}>
							{t("auth.username")}
						</label>
						<input
							type='text'
							id='username'
							name='username'
							value={formData.username}
							onChange={handleChange}
							className={cx("input", {inputError: errors.username})}
							placeholder={t("placeholders.enterUsername")}
						/>
						{errors.username && (
							<span className={cx("errorMessage")}>{errors.username}</span>
						)}
					</div>

					<div className={cx("inputGroup")}>
						<label htmlFor='email' className={cx("label")}>
							{t("auth.email")}
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className={cx("input", {inputError: errors.email})}
							placeholder={t("placeholders.enterEmail")}
						/>
						{errors.email && <span className={cx("errorMessage")}>{errors.email}</span>}
					</div>

					<div className={cx("inputGroup")}>
						<label htmlFor='phoneNumber' className={cx("label")}>
							{t("auth.phone")}
						</label>
						<input
							type='tel'
							id='phoneNumber'
							name='phoneNumber'
							value={formData.phoneNumber}
							onChange={handleChange}
							className={cx("input", {inputError: errors.phoneNumber})}
							placeholder={t("placeholders.enterPhone")}
						/>
						{errors.phoneNumber && (
							<span className={cx("errorMessage")}>{errors.phoneNumber}</span>
						)}
					</div>

					<div className={cx("passwordRow")}>
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
								placeholder={t("placeholders.createStrongPassword")}
							/>
							{errors.password && (
								<span className={cx("errorMessage")}>{errors.password}</span>
							)}
						</div>

						<div className={cx("inputGroup")}>
							<label htmlFor='confirmPassword' className={cx("label")}>
								{t("auth.confirmPassword")}
							</label>
							<input
								type='password'
								id='confirmPassword'
								name='confirmPassword'
								value={formData.confirmPassword}
								onChange={handleChange}
								className={cx("input", {inputError: errors.confirmPassword})}
								placeholder={t("placeholders.reenterPassword")}
							/>
							{errors.confirmPassword && (
								<span className={cx("errorMessage")}>{errors.confirmPassword}</span>
							)}
						</div>
					</div>

					<div className={cx("termsGroup")}>
						<label className={cx("checkboxLabel")}>
							<input
								type='checkbox'
								name='agreeToTerms'
								checked={formData.agreeToTerms}
								onChange={handleChange}
								className={cx("checkbox")}
							/>
							<span className={cx("checkboxText")}>{t("auth.agreeToTerms")}</span>
						</label>
						{errors.agreeToTerms && (
							<span className={cx("errorMessage")}>{errors.agreeToTerms}</span>
						)}
					</div>

					<button
						type='submit'
						className={cx("submitButton", {loading: isLoading})}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<span className={cx("spinner")}></span>
								{t("auth.creating")}
							</>
						) : (
							t("auth.registerButton")
						)}
					</button>

					{errors.submit && <div className={cx("submitError")}>{errors.submit}</div>}
				</form>

				{successMessage && <div className={cx("successMessage")}>{successMessage}</div>}

				<div className={cx("registerFooter")}>
					<p className={cx("loginText")}>
						{t("auth.haveAccount")}{" "}
						<Link to='/login' className={cx("loginLink")}>
							{t("auth.loginNow")}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Register;
