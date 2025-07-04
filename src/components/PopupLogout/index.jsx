import React from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import styles from "./PopupLogout.module.scss";

const cx = classNames.bind(styles);

function PopupLogout({onConfirm, onCancel}) {
	const {t} = useTranslation();

	return (
		<div className={cx("overlay")}>
			<div className={cx("popup")}>
				<h2 className={cx("title")}>{t("popup.logoutTitle")}</h2>
				<p className={cx("message")}>{t("popup.logoutMessage")}</p>
				<div className={cx("buttons")}>
					<button className={cx("button", "cancel")} onClick={onCancel}>
						{t("popup.cancel")}
					</button>
					<button className={cx("button", "confirm")} onClick={onConfirm}>
						{t("popup.confirm")}
					</button>
				</div>
			</div>
		</div>
	);
}

export default PopupLogout;
