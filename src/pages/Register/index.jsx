import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {register as registerApi} from "../../utils/request";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);

function Register() {
	const navigate = useNavigate();
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
			newErrors.firstName = "Họ là bắt buộc";
		}
		if (!formData.lastName.trim()) {
			newErrors.lastName = "Tên là bắt buộc";
		}

		if (!formData.username.trim()) {
			newErrors.username = "Tên người dùng là bắt buộc";
		} else if (formData.username.length < 3) {
			newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
		} else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
			newErrors.username =
				"Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới";
		}

		if (!formData.email) {
			newErrors.email = "Email là bắt buộc";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email không hợp lệ";
		}

		if (!formData.password) {
			newErrors.password = "Mật khẩu là bắt buộc";
		} else if (formData.password.length < 8) {
			newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password =
				"Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
		}

		if (!formData.agreeToTerms) {
			newErrors.agreeToTerms = "Bạn phải đồng ý với điều khoản sử dụng";
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
				setSuccessMessage(
					"Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
				);
			} else {
				setErrors({
					submit: response.message || "Đăng ký thất bại",
				});
			}
		} catch (error) {
			console.error("Registration error:", error);
			setErrors({
				submit: "Có lỗi xảy ra, vui lòng thử lại",
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
					title='Quay về trang chủ'
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("registerCard")}>
					<div className={cx("registerHeader")}>
						<h1 className={cx("title")}>Đăng ký thành công!</h1>
						<p className={cx("subtitle")}>
							Chúng tôi đã gửi mã xác thực đến email <strong>{formData.email}</strong>. Vui
							lòng kiểm tra email và làm theo hướng dẫn để xác thực tài khoản.
						</p>
					</div>
					<div className={cx("verificationActions")}>
						<Link
							to={`/verify-email?email=${encodeURIComponent(formData.email)}`}
							className={cx("submitButton")}
						>
							Xác thực email ngay
						</Link>
						<Link to='/login' className={cx("loginLink")}>
							Đến trang đăng nhập
						</Link>
						<p className={cx("resendText")}>
							Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
							<button
								type='button'
								className={cx("resendLink")}
								onClick={() => setShowVerification(false)}
							>
								đăng ký lại
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
				title='Quay về trang chủ'
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("registerCard")}>
				<div className={cx("registerHeader")}>
					<h1 className={cx("title")}>Tạo tài khoản</h1>
					<p className={cx("subtitle")}>
						Đăng ký để bắt đầu hành trình của bạn với chúng tôi
					</p>
				</div>

				<form className={cx("registerForm")} onSubmit={handleSubmit}>
					<div className={cx("nameRow")}>
						<div className={cx("inputGroup")}>
							<label htmlFor='firstName' className={cx("label")}>
								Họ
							</label>
							<input
								type='text'
								id='firstName'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								className={cx("input", {inputError: errors.firstName})}
								placeholder='Nhập họ của bạn'
							/>
							{errors.firstName && (
								<span className={cx("errorMessage")}>{errors.firstName}</span>
							)}
						</div>

						<div className={cx("inputGroup")}>
							<label htmlFor='lastName' className={cx("label")}>
								Tên
							</label>
							<input
								type='text'
								id='lastName'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								className={cx("input", {inputError: errors.lastName})}
								placeholder='Nhập tên của bạn'
							/>
							{errors.lastName && (
								<span className={cx("errorMessage")}>{errors.lastName}</span>
							)}
						</div>
					</div>

					<div className={cx("inputGroup")}>
						<label htmlFor='username' className={cx("label")}>
							Tên người dùng
						</label>
						<input
							type='text'
							id='username'
							name='username'
							value={formData.username}
							onChange={handleChange}
							className={cx("input", {inputError: errors.username})}
							placeholder='Chọn tên người dùng duy nhất'
						/>
						{errors.username && (
							<span className={cx("errorMessage")}>{errors.username}</span>
						)}
					</div>

					<div className={cx("inputGroup")}>
						<label htmlFor='email' className={cx("label")}>
							Email
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className={cx("input", {inputError: errors.email})}
							placeholder='Nhập email của bạn'
						/>
						{errors.email && <span className={cx("errorMessage")}>{errors.email}</span>}
					</div>

					<div className={cx("inputGroup")}>
						<label htmlFor='phoneNumber' className={cx("label")}>
							Số điện thoại (Không bắt buộc)
						</label>
						<input
							type='tel'
							id='phoneNumber'
							name='phoneNumber'
							value={formData.phoneNumber}
							onChange={handleChange}
							className={cx("input", {inputError: errors.phoneNumber})}
							placeholder='Nhập số điện thoại'
						/>
						{errors.phoneNumber && (
							<span className={cx("errorMessage")}>{errors.phoneNumber}</span>
						)}
					</div>

					<div className={cx("passwordRow")}>
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
								placeholder='Tạo mật khẩu mạnh'
							/>
							{errors.password && (
								<span className={cx("errorMessage")}>{errors.password}</span>
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
								placeholder='Nhập lại mật khẩu'
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
							<span className={cx("checkboxText")}>
								Tôi đồng ý với{" "}
								<button type='button' className={cx("termsLink")}>
									Điều khoản sử dụng
								</button>{" "}
								và{" "}
								<button type='button' className={cx("termsLink")}>
									Chính sách bảo mật
								</button>
							</span>
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
								Đang tạo tài khoản...
							</>
						) : (
							"Tạo tài khoản"
						)}
					</button>

					{errors.submit && <div className={cx("submitError")}>{errors.submit}</div>}
				</form>

				{successMessage && <div className={cx("successMessage")}>{successMessage}</div>}

				<div className={cx("registerFooter")}>
					<p className={cx("loginText")}>
						Đã có tài khoản?{" "}
						<Link to='/login' className={cx("loginLink")}>
							Đăng nhập ngay
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Register;
