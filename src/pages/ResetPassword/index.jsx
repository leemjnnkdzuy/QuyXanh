import React, {useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {resetPassword} from "../../utils/request";
import styles from "./ResetPassword.module.scss";

const cx = classNames.bind(styles);

function ResetPassword() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [formData, setFormData] = useState({
		email: searchParams.get("email") || "",
		code: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
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

		if (!formData.email) {
			newErrors.email = "Email là bắt buộc";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email không hợp lệ";
		}

		if (!formData.code) {
			newErrors.code = "Mã xác thực là bắt buộc";
		} else if (formData.code.length !== 6) {
			newErrors.code = "Mã xác thực phải có 6 chữ số";
		}

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

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});

		try {
			const response = await resetPassword(
				formData.email,
				formData.code,
				formData.newPassword
			);

			if (response.success) {
				setIsSuccess(true);
			} else {
				setErrors({
					submit: response.message || "Đặt lại mật khẩu thất bại",
				});
			}
		} catch (error) {
			console.error("Reset password error:", error);
			setErrors({
				submit: "Có lỗi xảy ra, vui lòng thử lại",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className={cx("resetContainer")}>
				<button
					className={cx("backToHome")}
					onClick={() => navigate("/")}
					title='Quay về trang chủ'
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("resetCard")}>
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
			</div>
		);
	}

	return (
		<div className={cx("resetContainer")}>
			<button
				className={cx("backToHome")}
				onClick={() => navigate("/")}
				title='Quay về trang chủ'
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("resetCard")}>
				<div className={cx("resetHeader")}>
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
					<h1 className={cx("title")}>Đặt lại mật khẩu</h1>
					<p className={cx("subtitle")}>
						Nhập mã xác thực và mật khẩu mới để hoàn tất việc đặt lại
					</p>
				</div>

				<form className={cx("resetForm")} onSubmit={handleSubmit}>
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
						/>
						{errors.code && <span className={cx("errorMessage")}>{errors.code}</span>}
					</div>

					<div className={cx("passwordRow")}>
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
								Đang đặt lại mật khẩu...
							</>
						) : (
							"Đặt lại mật khẩu"
						)}
					</button>
				</form>

				<div className={cx("resetFooter")}>
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
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ResetPassword;
