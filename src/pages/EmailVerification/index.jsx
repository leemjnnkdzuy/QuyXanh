import React, {useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import classNames from "classnames/bind";
import {verifyEmail} from "../../utils/request";
import styles from "./EmailVerification.module.scss";

const cx = classNames.bind(styles);

function EmailVerification() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [formData, setFormData] = useState({
		email: searchParams.get("email") || "",
		code: "",
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

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});

		try {
			const response = await verifyEmail(formData.email, formData.code);

			if (response.success) {
				setIsSuccess(true);
			} else {
				setErrors({
					submit: response.message || "Xác thực thất bại",
				});
			}
		} catch (error) {
			console.error("Email verification error:", error);
			setErrors({
				submit: "Có lỗi xảy ra, vui lòng thử lại",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isSuccess) {
		return (
			<div className={cx("verificationContainer")}>
				<button
					className={cx("backToHome")}
					onClick={() => navigate("/")}
					title='Quay về trang chủ'
				>
					<FiArrowLeft className={cx("backIcon")} />
					<FaTree className={cx("logoIcon")} />
				</button>

				<div className={cx("verificationCard")}>
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
						<h1 className={cx("title")}>Email đã được xác thực!</h1>
						<p className={cx("subtitle")}>
							Tài khoản của bạn đã được kích hoạt thành công. Bạn có thể đăng nhập ngay bây
							giờ.
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
		<div className={cx("verificationContainer")}>
			<button
				className={cx("backToHome")}
				onClick={() => navigate("/")}
				title='Quay về trang chủ'
			>
				<FiArrowLeft className={cx("backIcon")} />
				<FaTree className={cx("logoIcon")} />
			</button>

			<div className={cx("verificationCard")}>
				<div className={cx("verificationHeader")}>
					<div className={cx("iconContainer")}>
						<svg
							width='48'
							height='48'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'
								stroke='var(--primary-color-1)'
								strokeWidth='2'
								fill='none'
							/>
							<path
								d='m22 6-10 7L2 6'
								stroke='var(--primary-color-1)'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</div>
					<h1 className={cx("title")}>Xác thực Email</h1>
					<p className={cx("subtitle")}>
						Nhập mã xác thực 6 chữ số đã được gửi đến email của bạn
					</p>
				</div>

				<form className={cx("verificationForm")} onSubmit={handleSubmit}>
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
							autoFocus
						/>
						{errors.code && <span className={cx("errorMessage")}>{errors.code}</span>}
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
								Đang xác thực...
							</>
						) : (
							"Xác thực Email"
						)}
					</button>
				</form>

				<div className={cx("verificationFooter")}>
					<p className={cx("resendText")}>
						Không nhận được mã?{" "}
						<Link to='/register' className={cx("resendLink")}>
							Gửi lại mã
						</Link>
					</p>

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

export default EmailVerification;
