import React from "react";
import classNames from "classnames/bind";
import styles from "./WithHeaderLayout.module.scss";
import Headers from "../../components/HomeHeader";

const cx = classNames.bind(styles);

function WithHeaderLayout({ children }) {
	return (
		<div className={cx("wrapper")}>
			<Headers />
			<div className={cx("container")}>{children}</div>
		</div>
	);
}

export default WithHeaderLayout;
