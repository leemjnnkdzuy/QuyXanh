import React, {useEffect} from "react";
import classNames from "classnames/bind";
import styles from "./PopupNotification.module.scss";
import {useTheme} from "../../utils/themeContext";
import {AiFillCloseCircle, AiFillWarning} from "react-icons/ai";
import {BiErrorCircle} from "react-icons/bi";
import {BsCheckCircleFill} from "react-icons/bs";

const cx = classNames.bind(styles);

const icons = {
	error: <BiErrorCircle />,
	success: <BsCheckCircleFill />,
	warning: <AiFillWarning />,
};

function PopupNotification({
	message,
	type = "error",
	onClose,
	duration = 3000,
}) {
	const {isDarkMode} = useTheme();

	useEffect(() => {
		if (duration) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	return (
		<div className={cx("popup-container")}>
			<div className={cx("popup-overlay")} onClick={onClose}></div>
			<div
				className={cx("popup", type)}
				onClick={(e) => e.stopPropagation()}
				data-theme={isDarkMode ? "dark" : "light"}
			>
				<div className={cx("icon")}>{icons[type]}</div>
				<p className={cx("message")}>{message}</p>
				<button className={cx("close-button")} onClick={onClose}>
					<AiFillCloseCircle size={24} />
				</button>
			</div>
		</div>
	);
}

export default PopupNotification;
