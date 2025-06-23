import React from "react";
import classNames from "classnames/bind";
import styles from "./PopupLogout.module.scss";

const cx = classNames.bind(styles);

function PopupLogout({ onConfirm, onCancel }) {
	return (
		<div className={cx("overlay")}>
			<div className={cx("popup")}>
				<h2 className={cx("title")}>Xác nhận đăng xuất</h2>
				<p className={cx("message")}>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
				<div className={cx("buttons")}>
					<button className={cx("button", "cancel")} onClick={onCancel}>
						Hủy
					</button>
					<button className={cx("button", "confirm")} onClick={onConfirm}>
						Đăng xuất
					</button>
				</div>
			</div>
		</div>
	);
}

export default PopupLogout;
