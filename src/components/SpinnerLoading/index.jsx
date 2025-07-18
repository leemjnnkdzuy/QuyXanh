import React from "react";
import classNames from "classnames/bind";
import styles from "./SpinnerLoading.module.scss";

const cx = classNames.bind(styles);

function SpinnerLoading({size}) {
	const style = {};

	if (typeof size === "string") {
		style.width = size;
		style.height = size;
		style.minHeight = size;
	}

	return (
		<div
			className={cx("loading", {
				small: typeof size === "boolean" ? size : false,
			})}
			style={style}
		/>
	);
}

export default SpinnerLoading;
