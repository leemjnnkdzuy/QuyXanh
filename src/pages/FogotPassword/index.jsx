import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {
	forgotPassword,
	verifyResetCode,
	resetPassword,
} from "../../utils/request";
import PopupNotification from "../../components/PopupNotification";
import styles from "./FogetPassword.module.scss";

const cx = classNames.bind(styles);

function ForgotPassword() {
	const navigate = useNavigate();
	const [step, setStep] = useState("email"); // "email", "code", "password", "success"
	const [formData, setFormData] = useState({
		email: "",
		code: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "error",
	});

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
		const {name, value} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateEmail = () => {
		const newErrors = {};
		if (!formData.email) {
			newErrors.email = "Email là bắt buộc";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email không hợp lệ";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateCode = () => {
		const newErrors = {};
		if (!formData.code) {
			newErrors.code = "Mã xác thực là bắt buộc";
		} else if (formData.code.length !== 6) {
			newErrors.code = "Mã xác thực phải có 6 chữ số";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validatePassword = () => {
		const newErrors = {};
		if (!formData.newPassword) {
			newErrors.newPassword = "Mật khẩu mới là bắt buộc";
		} else if (formData.newPassword.length < 8) {
			newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
			newErrors.newPassword =
				"Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
		} else if (formData.newPassword !== formData.confirmPassword) {
			newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleEmailSubmit = async (e) => {
		e.preventDefault();
		if (!validateEmail()) return;

		setIsLoading(true);
		setErrors({});

		try {
			const response = await forgotPassword(formData.email);

			if (response.success && response.userExists && response.emailSent) {
				// Email tồn tại và gửi thành công
				setStep("code");
			} else if (response.userExists === false) {
				// Email không tồn tại
				showNotification("Email không tồn tại trong hệ thống", "error");
			} else if (response.userExists && !response.emailSent) {
				// Email tồn tại nhưng không gửi được
				showNotification("Có lỗi khi gửi email, vui lòng thử lại", "error");
			} else {
				// Trường hợp khác
				showNotification(response.message || "Gửi email thất bại", "error");
			}
		} catch (error) {
			console.error("Forgot password error:", error);
			showNotification("Có lỗi xảy ra, vui lòng thử lại", "error");
		} finally {
			setIsLoading(false);
		}
	};
	const handleCodeSubmit = async (e) => {
		e.preventDefault();
		if (!validateCode()) return;

		setIsLoading(true);
		setErrors({});

		try {
			const response = await verifyResetCode(formData.email, formData.code);
			if (response.success) {
				setStep("password");
			} else {
				showNotification(response.message || "Mã xác thực không đúng", "error");
			}
		} catch (error) {
			console.error("Verify code error:", error);
			showNotification("Có lỗi xảy ra, vui lòng thử lại", "error");
		} finally {
			setIsLoading(false);
		}
	};
	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		if (!validatePassword()) return;

		setIsLoading(true);
		setErrors({});

		try {
			const response = await resetPassword(
				formData.email,
				formData.code,
				formData.newPassword
			);
			if (response.success) {
				setStep("success");
			} else {
				showNotification(response.message || "Đặt lại mật khẩu thất bại", "error");
			}
		} catch (error) {
			console.error("Reset password error:", error);
			showNotification("Có lỗi xảy ra, vui lòng thử lại", "error");
		} finally {
			setIsLoading(false);
		}
	};
	const handleResend = async () => {
		setIsLoading(true);
		try {
			const response = await forgotPassword(formData.email);

			if (response.success && response.userExists && response.emailSent) {
				// Email tồn tại và gửi thành công
				showNotification("Mã xác thực đã được gửi lại", "success");
			} else if (response.userExists === false) {
				// Email không tồn tại
				showNotification("Email không tồn tại trong hệ thống", "error");
			} else if (response.userExists && !response.emailSent) {
				// Email tồn tại nhưng không gửi được
				showNotification("Có lỗi khi gửi email, vui lòng thử lại", "error");
			} else {
				// Trường hợp khác
				showNotification(response.message || "Gửi lại email thất bại", "error");
			}
		} catch (error) {
			console.error("Resend error:", error);
			showNotification("Có lỗi xảy ra, vui lòng thử lại", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToEmail = () => {
		setStep("email");
		setFormData((prev) => ({...prev, code: ""}));
		setErrors({});
	};

	const handleBackToCode = () => {
		setStep("code");
		setFormData((prev) => ({...prev, newPassword: "", confirmPassword: ""}));
		setErrors({});
	};
	// Success step
	if (step === "success") {
		return (
			<div className={cx("forgotContainer")}>
				<button
					className={cx("backToHome")}
					onClick={() => navigate("/")}
					title='Quay về trang chủ'
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("forgotCard")}>
					<div className={cx("successIcon")}>
						<svg
							width='64'
							height='64'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<circle cx='12' cy='12' r='10' fill='#2dd881' />
							<path
								d='M9 12l2 2 4-4'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</div>

					<div className={cx("successHeader")}>
						<h1 className={cx("title")}>Mật khẩu đã được đặt lại!</h1>
						<p className={cx("subtitle")}>
							Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể đăng nhập với mật khẩu
							mới ngay bây giờ.
						</p>
					</div>

					<div className={cx("successActions")}>
						<Link to='/login' className={cx("submitButton")}>
							Đăng nhập ngay
						</Link>
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

	// Password step
	if (step === "password") {
		return (
			<div className={cx("forgotContainer")}>
				<button
					className={cx("backToHome")}
					onClick={() => navigate("/")}
					title='Quay về trang chủ'
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("forgotCard")}>
					<div className={cx("forgotHeader")}>
						<div className={cx("iconContainer")}>
							<svg
								width='48'
								height='48'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M12 1a3 3 0 0 0-3 3v8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2V4a3 3 0 0 0-3-3zM10 4a2 2 0 1 1 4 0v8h-4V4z'
									fill='var(--primary-color-1)'
								/>
							</svg>
						</div>
						<h1 className={cx("title")}>Đặt mật khẩu mới</h1>
						<p className={cx("subtitle")}>Nhập mật khẩu mới cho tài khoản của bạn</p>
						<p className={cx("emailText")}>
							<strong>{formData.email}</strong>
						</p>
					</div>
					<form className={cx("forgotForm")} onSubmit={handlePasswordSubmit}>
						<div className={cx("inputGroup")}>
							<label htmlFor='newPassword' className={cx("label")}>
								Mật khẩu mới
							</label>
							<input
								type='password'
								id='newPassword'
								name='newPassword'
								value={formData.newPassword}
								onChange={handleChange}
								className={cx("input", {inputError: errors.newPassword})}
								placeholder='Nhập mật khẩu mới'
								autoFocus
							/>
							{errors.newPassword && (
								<span className={cx("errorMessage")}>{errors.newPassword}</span>
							)}
						</div>

						<div className={cx("inputGroup")}>
							<label htmlFor='confirmPassword' className={cx("label")}>
								Xác nhận mật khẩu
							</label>
							<input
								type='password'
								id='confirmPassword'
								name='confirmPassword'
								value={formData.confirmPassword}
								onChange={handleChange}
								className={cx("input", {inputError: errors.confirmPassword})}
								placeholder='Nhập lại mật khẩu mới'
							/>
							{errors.confirmPassword && (
								<span className={cx("errorMessage")}>{errors.confirmPassword}</span>
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
									Đang đặt lại mật khẩu...
								</>
							) : (
								"Đặt lại mật khẩu"
							)}
						</button>
					</form>{" "}
					<div className={cx("forgotFooter")}>
						<button onClick={handleBackToCode} className={cx("backLink")}>
							<svg
								width='16'
								height='16'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M19 12H5M12 19L5 12L12 5'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Quay lại nhập mã
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

	// Code verification step
	if (step === "code") {
		return (
			<div className={cx("forgotContainer")}>
				<button
					className={cx("backToHome")}
					onClick={() => navigate("/")}
					title='Quay về trang chủ'
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("forgotCard")}>
					<div className={cx("forgotHeader")}>
						<div className={cx("iconContainer")}>
							<svg
								width='48'
								height='48'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V17C3 18.1 3.9 19 5 19H11C11.6 19 12 18.6 12 18S11.6 17 11 17H5V3H14V8C14 8.6 14.4 9 15 9H21ZM19 11.5C19 10.7 18.3 10 17.5 10S16 10.7 16 11.5V12H15.5C14.7 12 14 12.7 14 13.5V18.5C14 19.3 14.7 20 15.5 20H19.5C20.3 20 21 19.3 21 18.5V13.5C21 12.7 20.3 12 19.5 12H19V11.5Z'
									fill='var(--primary-color-1)'
								/>
							</svg>
						</div>
						<h1 className={cx("title")}>Nhập mã xác thực</h1>
						<p className={cx("subtitle")}>Chúng tôi đã gửi mã 6 chữ số đến email của bạn</p>
						<p className={cx("emailText")}>
							<strong>{formData.email}</strong>
						</p>
					</div>

					<form className={cx("forgotForm")} onSubmit={handleCodeSubmit}>
						<div className={cx("inputGroup")}>
							<label htmlFor='code' className={cx("label")}>
								Mã xác thực
							</label>
							<input
								type='text'
								id='code'
								name='code'
								value={formData.code}
								onChange={handleChange}
								className={cx("input", "codeInput", {inputError: errors.code})}
								placeholder='Nhập mã 6 chữ số'
								maxLength={6}
								autoFocus
							/>{" "}
							{errors.code && <span className={cx("errorMessage")}>{errors.code}</span>}
						</div>

						<button
							type='submit'
							className={cx("submitButton", {loading: isLoading})}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span className={cx("spinner")}></span>
									Đang xác thực...
								</>
							) : (
								"Xác thực mã"
							)}
						</button>
					</form>

					<div className={cx("forgotFooter")}>
						<button onClick={handleBackToEmail} className={cx("backLink")}>
							<svg
								width='16'
								height='16'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M19 12H5M12 19L5 12L12 5'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Quay lại nhập email
						</button>{" "}
						<div className={cx("helpText")}>
							<p>
								Không nhận được mã?{" "}
								<button
									onClick={handleResend}
									className={cx("contactLink")}
									style={{background: "none", border: "none", cursor: "pointer"}}
									disabled={isLoading}
								>
									{isLoading ? "Đang gửi lại..." : "Gửi lại"}
								</button>
							</p>
						</div>
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

	// Email step (default)
	return (
		<div className={cx("forgotContainer")}>
			<button
				className={cx("backToHome")}
				onClick={() => navigate("/")}
				title='Quay về trang chủ'
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("forgotCard")}>
				<div className={cx("forgotHeader")}>
					<div className={cx("iconContainer")}>
						<svg
							width='48'
							height='48'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V17C3 18.1 3.9 19 5 19H11C11.6 19 12 18.6 12 18S11.6 17 11 17H5V3H14V8C14 8.6 14.4 9 15 9H21ZM19 11.5C19 10.7 18.3 10 17.5 10S16 10.7 16 11.5V12H15.5C14.7 12 14 12.7 14 13.5V18.5C14 19.3 14.7 20 15.5 20H19.5C20.3 20 21 19.3 21 18.5V13.5C21 12.7 20.3 12 19.5 12H19V11.5Z'
								fill='var(--primary-color-1)'
							/>
						</svg>
					</div>
					<h1 className={cx("title")}>Quên mật khẩu?</h1>
					<p className={cx("subtitle")}>
						Không sao! Nhập email của bạn và chúng tôi sẽ gửi mã xác thực để đặt lại mật
						khẩu.
					</p>
				</div>

				<form className={cx("forgotForm")} onSubmit={handleEmailSubmit}>
					<div className={cx("inputGroup")}>
						<label htmlFor='email' className={cx("label")}>
							Địa chỉ Email
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className={cx("input", {inputError: errors.email})}
							placeholder='Nhập email đã đăng ký'
							autoFocus
						/>
						{errors.email && <span className={cx("errorMessage")}>{errors.email}</span>}
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
								Đang gửi mã...
							</>
						) : (
							"Gửi mã xác thực"
						)}
					</button>
				</form>

				<div className={cx("forgotFooter")}>
					<Link to='/login' className={cx("backLink")}>
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M19 12H5M12 19L5 12L12 5'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
						Quay lại đăng nhập
					</Link>{" "}
					<div className={cx("helpText")}>
						<p>
							Cần trợ giúp?{" "}
							<a href='mailto:support@example.com' className={cx("contactLink")}>
								Liên hệ hỗ trợ
							</a>
						</p>
					</div>
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

export default ForgotPassword;
