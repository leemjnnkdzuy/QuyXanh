import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {changePassword} from "../../utils/request";
import {useAuth} from "../../utils/authContext";
import styles from "./ChangePassword.module.scss";

const cx = classNames.bind(styles);

function ChangePassword() {
	const navigate = useNavigate();
	const {user} = useAuth();
	const [formData, setFormData] = useState({
		currentPassword: "",
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

		if (!formData.currentPassword) {
			newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc";
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

		if (formData.currentPassword === formData.newPassword) {
			newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
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
			const response = await changePassword(
				formData.currentPassword,
				formData.newPassword
			);

			if (response.success) {
				setIsSuccess(true);
			} else {
				setErrors({
					submit: response.message || "Đổi mật khẩu thất bại",
				});
			}
		} catch (error) {
			console.error("Change password error:", error);
			setErrors({
				submit: "Có lỗi xảy ra, vui lòng thử lại",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className={cx("changePasswordContainer")}>
				<button
					className={cx("backToHome")}
					onClick={() => navigate("/")}
					title='Quay về trang chủ'
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("changePasswordCard")}>
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
						<h1 className={cx("title")}>Mật khẩu đã được thay đổi!</h1>
						<p className={cx("subtitle")}>
							Mật khẩu của bạn đã được cập nhật thành công. Vui lòng sử dụng mật khẩu mới cho
							lần đăng nhập tiếp theo.
						</p>
					</div>

					<div className={cx("successActions")}>
						<button onClick={() => navigate("/")} className={cx("submitButton")}>
							Về trang chủ
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={cx("changePasswordContainer")}>
			<button
				className={cx("backToHome")}
				onClick={() => navigate("/")}
				title='Quay về trang chủ'
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("changePasswordCard")}>
				<div className={cx("changePasswordHeader")}>
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
					<h1 className={cx("title")}>Đổi mật khẩu</h1>
					<p className={cx("subtitle")}>
						Xin chào <strong>{user?.fullName}</strong>, nhập mật khẩu hiện tại và mật khẩu
						mới để thay đổi
					</p>
				</div>

				<form className={cx("changePasswordForm")} onSubmit={handleSubmit}>
					<div className={cx("inputGroup")}>
						<label htmlFor='currentPassword' className={cx("label")}>
							Mật khẩu hiện tại
						</label>
						<input
							type='password'
							id='currentPassword'
							name='currentPassword'
							value={formData.currentPassword}
							onChange={handleChange}
							className={cx("input", {inputError: errors.currentPassword})}
							placeholder='Nhập mật khẩu hiện tại'
							autoFocus
						/>
						{errors.currentPassword && (
							<span className={cx("errorMessage")}>{errors.currentPassword}</span>
						)}
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
								Đang thay đổi...
							</>
						) : (
							"Đổi mật khẩu"
						)}
					</button>
				</form>

				<div className={cx("changePasswordFooter")}>
					<p className={cx("securityTip")}>
						💡 <strong>Lưu ý bảo mật:</strong> Sử dụng mật khẩu mạnh bao gồm chữ hoa, chữ
						thường, số và ký tự đặc biệt
					</p>
				</div>
			</div>
		</div>
	);
}

export default ChangePassword;
