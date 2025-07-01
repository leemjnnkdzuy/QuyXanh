import React from "react";
import classNames from "classnames/bind";
import styles from "./AppLoader.module.scss";
import Loading from "../Loading";

const cx = classNames.bind(styles);

function AppLoader() {
	return (
		<div className={cx("app-loader")}>
			<div className={cx("loader-content")}>
				<Loading size='120px' />
			</div>
		</div>
	);
}

export default AppLoader;
