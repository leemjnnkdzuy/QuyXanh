import React from "react";
import {useNavigate} from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./NotFound.module.scss";
import {useAuth} from "../../utils/authContext";
import {FaTree} from "react-icons/fa";
import {FiArrowLeft, FiHome} from "react-icons/fi";

const cx = classNames.bind(styles);

function NotFound() {
	const navigate = useNavigate();
	const {isAuthenticated} = useAuth();

	const handleBackHome = () => {
		if (isAuthenticated) {
			navigate("/dashboard");
		} else {
			navigate("/");
		}
	};

	const handleGoBack = () => {
		navigate(-1);
	};
	return (
		<div className={cx("wrapper")}>
			<div className={cx("content")}>
				<div className={cx("error-visual")}>
					<div className={cx("error-number")}>
						<span className={cx("four")}>4</span>
						<div className={cx("zero")}>
							<FaTree className={cx("tree-icon")} />
						</div>
						<span className={cx("four")}>4</span>
					</div>
				</div>

				<div className={cx("message")}>
					<h1 className={cx("title")}>Trang không tồn tại</h1>
					<p className={cx("subtitle")}>
						Có vẻ như bạn đã lạc vào một khu rừng chưa được khám phá. Trang bạn đang tìm
						kiếm không tồn tại hoặc đã được di chuyển.
					</p>
				</div>

				<div className={cx("actions")}>
					<button className={cx("back-button")} onClick={handleGoBack} type='button'>
						<FiArrowLeft className={cx("icon")} />
						<span>Quay lại</span>
					</button>
					<button className={cx("home-button")} onClick={handleBackHome} type='button'>
						<FiHome className={cx("icon")} />
						<span>Về trang chủ</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default NotFound;
