import React from "react";
import classNames from "classnames/bind";
import styles from "./Loading.module.scss";
import {FaTree} from "react-icons/fa";

const cx = classNames.bind(styles);

function Loading({size, showIcon = true}) {
	const style = {};
	let iconStyle = {};

	if (typeof size === "string") {
		style.width = size;
		style.height = size;
		style.minHeight = size;

		// Calculate icon size based on container size
		const sizeValue = parseInt(size);
		const iconSize = Math.max(16, sizeValue * 0.35); // 35% of container, minimum 16px
		iconStyle.fontSize = `${iconSize}px`;
	}

	return (
		<div
			className={cx("loading", {
				size: typeof size === "boolean" ? size : false,
			})}
			style={style}
		>
			{showIcon && <FaTree className={cx("loading-icon")} style={iconStyle} />}
		</div>
	);
}

export default Loading;
