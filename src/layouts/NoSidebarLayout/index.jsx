import React from "react";
import classNames from "classnames/bind";
import styles from "./NoSidebarLayout.module.scss";

const cx = classNames.bind(styles);

function NoSidebarLayout({ children }) {
	return (
		<div className={cx("wrapper")}>
			<div className={cx("container")}>{children}</div>
		</div>
	);
}

export default NoSidebarLayout;
