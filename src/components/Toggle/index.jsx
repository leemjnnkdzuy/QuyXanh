import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Toggle.module.scss";
import { useTheme } from "../../utils/themeContext";
import { BsMoonStars, BsSun } from "react-icons/bs";

const cx = classNames.bind(styles);

function Toggle() {
	const { isDarkMode, toggleTheme } = useTheme();
	const [isTransitioning, setIsTransitioning] = useState(false);

	const handleToggle = () => {
		if (!isTransitioning) {
			setIsTransitioning(true);
			toggleTheme();
			setTimeout(() => setIsTransitioning(false), 300);
		}
	};

	return (
		<button
			className={cx("theme-toggle", { active: isDarkMode })}
			onClick={handleToggle}
			disabled={isTransitioning}
		>
			<span className={cx("toggle-slider")}>
				{isDarkMode ? <BsMoonStars /> : <BsSun />}
			</span>
		</button>
	);
}

export default Toggle;
