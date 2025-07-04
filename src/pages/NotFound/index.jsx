import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import classNames from "classnames/bind";
import styles from "./NotFound.module.scss";
import {useAuth} from "../../utils/authContext";
import {FaTree} from "react-icons/fa";
import {FiArrowLeft, FiHome} from "react-icons/fi";

const cx = classNames.bind(styles);

function NotFound() {
	const navigate = useNavigate();
	const {t} = useTranslation();
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
					<h1 className={cx("title")}>{t("notfound.title")}</h1>
					<p className={cx("subtitle")}>{t("notfound.subtitle")}</p>
				</div>

				<div className={cx("actions")}>
					<button className={cx("back-button")} onClick={handleGoBack} type='button'>
						<FiArrowLeft className={cx("icon")} />
						<span>{t("notfound.backButton")}</span>
					</button>
					<button className={cx("home-button")} onClick={handleBackHome} type='button'>
						<FiHome className={cx("icon")} />
						<span>{t("notfound.homeButton")}</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default NotFound;
