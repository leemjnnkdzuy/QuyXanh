import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FiArrowLeft, FiUser, FiMail, FiCheckCircle} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../utils/authContext";
import {useTheme} from "../../utils/themeContext";
import {
	register as registerApi,
	verifyRegistrationPin,
	resendVerification,
} from "../../utils/request";
import PopupNotification from "../../components/PopupNotification";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

function Register() {
	const navigate = useNavigate();
	const {t} = useTranslation();
	const {isAuthenticated} = useAuth();
	const {isDarkMode} = useTheme();
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
	const [verificationData, setVerificationData] = useState({
		email: "",
		code: ["", "", "", "", "", ""],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState("register");
	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "error",
	});

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
	};

	const handleCodeChange = (index, value) => {
		if (!/^\d*$/.test(value) || value.length > 1) return;

		const newCode = [...verificationData.code];
		newCode[index] = value;

		setVerificationData((prev) => ({
			...prev,
			code: newCode,
		}));

		if (value && index < 5) {
			const nextInput = document.querySelector(`#verification-code-${index + 1}`);
			if (nextInput) nextInput.focus();
		}
	};

	const handleCodeKeyDown = (index, e) => {
		if (e.key === "Backspace" && !verificationData.code[index] && index > 0) {
			const prevInput = document.querySelector(`#verification-code-${index - 1}`);
			if (prevInput) prevInput.focus();
		}

		if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			navigator.clipboard.readText().then((text) => {
				const digits = text.replace(/\D/g, "").slice(0, 6);
				if (digits.length === 6) {
					const newCode = digits.split("");
					setVerificationData((prev) => ({
						...prev,
						code: newCode,
					}));
					const lastInput = document.querySelector(`#verification-code-5`);
					if (lastInput) lastInput.focus();
				}
			});
		}
	};

	const validateForm = () => {
		if (!formData.firstName.trim()) {
			showNotification(t("validation.firstNameRequired"), "error");
			return false;
		}

		if (!formData.lastName.trim()) {
			showNotification(t("validation.lastNameRequired"), "error");
			return false;
		}

		if (!formData.username.trim()) {
			showNotification(t("validation.usernameRequired"), "error");
			return false;
		} else if (formData.username.length < 3) {
			showNotification(t("validation.usernameMinLength"), "error");
			return false;
		} else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
			showNotification(t("validation.usernameFormat"), "error");
			return false;
		}

		if (!formData.phoneNumber.trim()) {
			showNotification(t("validation.phoneNumberRequired"), "error");
			return false;
		} else if (!/^[\d+\-() ]+$/.test(formData.phoneNumber)) {
			showNotification(t("validation.phoneNumberInvalid"), "error");
			return false;
		}

		if (!formData.email) {
			showNotification(t("validation.emailRequired"), "error");
			return false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			showNotification(t("validation.emailInvalid"), "error");
			return false;
		}

		if (!formData.password) {
			showNotification(t("validation.passwordRequired"), "error");
			return false;
		} else if (formData.password.length < 8) {
			showNotification(t("validation.passwordMinLength8"), "error");
			return false;
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			showNotification(t("validation.passwordComplexity"), "error");
			return false;
		}

		if (!formData.confirmPassword) {
			showNotification(t("validation.confirmPasswordRequired"), "error");
			return false;
		} else if (formData.password !== formData.confirmPassword) {
			showNotification(t("validation.passwordMismatch"), "error");
			return false;
		}

		if (!formData.agreeToTerms) {
			showNotification(t("validation.mustAgreeToTerms"), "error");
			return false;
		}

		return true;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const registerData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				username: formData.username,
				email: formData.email,
				password: formData.password,
				phoneNumber: formData.phoneNumber,
			};

			console.log("Register data:", registerData);
			const response = await registerApi(registerData);
			console.log("Register response:", response);

			if (response.success && (response.emailSent || response.data?.emailSent)) {
				setVerificationData((prev) => ({
					...prev,
					email: formData.email,
				}));
				setCurrentStep("verification");

				if (response.userExists || response.data?.userExists) {
					showNotification(t("auth.verificationCodeResent"), "success");
				} else {
					showNotification(t("auth.verificationCodeSent"), "success");
				}
			} else if (response.success) {
				console.log(
					"Success response without emailSent flag, proceeding to verification"
				);
				setVerificationData((prev) => ({
					...prev,
					email: formData.email,
				}));
				setCurrentStep("verification");
				showNotification(t("auth.verificationCodeSent"), "success");
			} else if (!response.success) {
				if (
					(response.userExists || response.data?.userExists) &&
					!(response.emailSent || response.data?.emailSent)
				) {
					if (
						response.message?.includes("Email") ||
						response.message?.includes("email")
					) {
						showNotification(
							response.message || t("validation.emailAlreadyExists"),
							"error"
						);
					} else if (
						response.message?.includes("Tên người dùng") ||
						response.message?.includes("username")
					) {
						showNotification(
							response.message || t("validation.usernameAlreadyExists"),
							"error"
						);
					} else {
						showNotification(
							response.message || t("messages.error.registrationFailed"),
							"error"
						);
					}
				} else if (!(response.emailSent || response.data?.emailSent)) {
					showNotification(
						response.message || t("messages.error.emailSendFailed"),
						"error"
					);
				} else {
					showNotification(
						response.message || t("messages.error.registrationFailed"),
						"error"
					);
				}
			} else {
				showNotification(response.message || t("messages.error.genericError"), "error");
			}
		} catch (error) {
			console.error("Registration error:", error);
			showNotification(t("messages.error.genericError"), "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerificationSubmit = async (e) => {
		e.preventDefault();

		const codeString = verificationData.code.join("");
		if (!codeString || codeString.length !== 6) {
			showNotification(t("validation.verificationCodeRequired"), "error");
			return;
		}

		setIsLoading(true);

		try {
			const result = await verifyRegistrationPin(verificationData.email, codeString);

			if (result.success) {
				setCurrentStep("success");
				showNotification(result.message || t("auth.verificationSuccess"), "success");

				if (result.data?.accessToken) {
					localStorage.setItem("accessToken", result.data.accessToken);
				}
				if (result.data?.user) {
					localStorage.setItem("user", JSON.stringify(result.data.user));
				}
			} else {
				showNotification(
					result.message || t("validation.verificationCodeInvalid"),
					"error"
				);
			}
		} catch (error) {
			console.error("Verification error:", error);
			showNotification(t("messages.error.genericError"), "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendCode = async () => {
		setIsLoading(true);

		try {
			const result = await resendVerification(verificationData.email);

			if (result.success) {
				showNotification(t("auth.verificationCodeResent"), "success");
				setVerificationData((prev) => ({
					...prev,
					code: ["", "", "", "", "", ""],
				}));
			} else {
				showNotification(result.message || t("messages.error.resendFailed"), "error");
			}
		} catch (error) {
			console.error("Resend error:", error);
			showNotification(t("messages.error.genericError"), "error");
		} finally {
			setIsLoading(false);
		}
	};

	if (currentStep === "verification") {
		return (
			<div
				className={cx("registerContainer")}
				data-theme={isDarkMode ? "dark" : "light"}
			>
				<button
					className={cx("backToHome")}
					onClick={() => {
						setCurrentStep("register");
					}}
					title={t("auth.backToRegister")}
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("registerCard")}>
					<div className={cx("registerHeader")}>
						<div className={cx("iconContainer")}>
							<FiMail size={48} color='#667eea' />
						</div>
						<h1 className={cx("title")}>{t("auth.verifyEmail")}</h1>
						<p className={cx("subtitle")}>
							{t("auth.verificationCodeSent", {email: verificationData.email})}
						</p>
					</div>

					<form className={cx("verificationForm")} onSubmit={handleVerificationSubmit}>
						<div className={cx("codeInputContainer")}>
							{verificationData.code.map((digit, index) => (
								<input
									key={index}
									id={`verification-code-${index}`}
									type='text'
									inputMode='numeric'
									pattern='[0-9]*'
									maxLength='1'
									value={digit}
									onChange={(e) => handleCodeChange(index, e.target.value)}
									onKeyDown={(e) => handleCodeKeyDown(index, e)}
									className={cx("codeDigitInput")}
									placeholder='0'
								/>
							))}
						</div>

						<button
							type='submit'
							className={cx("submitButton", {loading: isLoading})}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span className={cx("spinner")}></span>
									{t("auth.verifying")}
								</>
							) : (
								t("auth.verifyCode")
							)}
						</button>
					</form>

					<div className={cx("registerFooter")}>
						<p className={cx("resendText")}>
							{t("auth.didntReceiveCode")}{" "}
							<button
								type='button'
								className={cx("resendLink")}
								onClick={handleResendCode}
								disabled={isLoading}
							>
								{isLoading ? t("auth.resending") : t("auth.resendCode")}
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

	if (currentStep === "success") {
		return (
			<div
				className={cx("registerContainer")}
				data-theme={isDarkMode ? "dark" : "light"}
			>
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
						<div className={cx("iconContainer")}>
							<FiCheckCircle size={48} color='#16a34a' />
						</div>
						<h1 className={cx("title")}>{t("auth.welcomeTitle")}</h1>
						<p className={cx("subtitle")}>{t("auth.registrationSuccess")}</p>
					</div>
					<div className={cx("successActions")}>
						<button className={cx("submitButton")} onClick={() => navigate("/login")}>
							Đăng nhập ngay
						</button>
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

	return (
		<div
			className={cx("registerContainer")}
			data-theme={isDarkMode ? "dark" : "light"}
		>
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
					<div className={cx("iconContainer")}>
						<FiUser size={48} color='#667eea' />
					</div>
					<h1 className={cx("title")}>{t("auth.registerTitle")}</h1>
					<p className={cx("subtitle")}>{t("auth.registerSubtitle")}</p>
				</div>

				<form className={cx("registerForm")} onSubmit={handleSubmit}>
					<div className={cx("threeColumnRow")}>
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
								className={cx("input")}
								placeholder={t("placeholders.enterFirstName")}
							/>
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
								className={cx("input")}
								placeholder={t("placeholders.enterLastName")}
							/>
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
								className={cx("input")}
								placeholder={t("placeholders.enterUsername")}
							/>
						</div>
					</div>

					<div className={cx("twoColumnRow")}>
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
								className={cx("input")}
								placeholder={t("placeholders.enterPhone")}
							/>
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
								className={cx("input")}
								placeholder={t("placeholders.enterEmail")}
							/>
						</div>
					</div>

					<div className={cx("twoColumnRow")}>
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
								className={cx("input")}
								placeholder={t("placeholders.createStrongPassword")}
							/>
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
								className={cx("input")}
								placeholder={t("placeholders.reenterPassword")}
							/>
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
				</form>

				<div className={cx("registerFooter")}>
					<p className={cx("loginText")}>
						{t("auth.haveAccount")}{" "}
						<Link to='/login' className={cx("loginLink")}>
							{t("auth.loginNow")}
						</Link>
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

export default Register;
