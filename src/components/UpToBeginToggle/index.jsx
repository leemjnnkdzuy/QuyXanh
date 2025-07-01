import React, {useState, useEffect} from "react";
import classNames from "classnames/bind";
import style from "./UpToBeginToggle.module.scss";
import {FiArrowUp} from "react-icons/fi";

const cx = classNames.bind(style);

function UpToBeginToggle() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset;
			const documentHeight = document.documentElement.scrollHeight;
			const windowHeight = window.innerHeight;

			const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
			setIsVisible(scrollPercentage > 0.8);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.dispatchEvent(new CustomEvent("scrollToTop"));

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			className={cx("up-to-begin-toggle", {visible: isVisible})}
			onClick={scrollToTop}
			title='Về đầu trang'
		>
			<FiArrowUp className={cx("arrow-icon")} />
		</button>
	);
}

export default UpToBeginToggle;
