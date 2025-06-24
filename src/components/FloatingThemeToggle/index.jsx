import React, {useState, useEffect} from "react";
import classNames from "classnames/bind";
import styles from "./FloatingThemeToggle.module.scss";
import {FiSun, FiMoon} from "react-icons/fi";
import {useTheme} from "../../utils/themeContext";

const cx = classNames.bind(styles);

function FloatingThemeToggle({isHeaderVisible = true}) {
	const {isDarkMode, toggleTheme} = useTheme();
	const [isVisible, setIsVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		const shouldShow = !isHeaderVisible;

		if (shouldShow) {
			setShouldRender(true);
			setTimeout(() => setIsVisible(true), 10);
		} else {
			setIsVisible(false);
			setTimeout(() => setShouldRender(false), 400);
		}
	}, [isHeaderVisible]);

	if (!shouldRender) return null;

	return (
		<div
			className={cx("floating-theme-toggle", {
				visible: isVisible,
				hidden: !isVisible,
			})}
		>
			<button
				className={cx("theme-toggle-btn", {"dark-mode": isDarkMode})}
				onClick={toggleTheme}
				aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
			>
				<div className={cx("icon-wrapper")}>
					{isDarkMode ? (
						<FiSun className={cx("theme-icon", "sun-icon")} />
					) : (
						<FiMoon className={cx("theme-icon", "moon-icon")} />
					)}
				</div>
			</button>
		</div>
	);
}

export default FloatingThemeToggle;
