import React, {useState, useEffect} from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";

import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import FloatingThemeToggle from "../../components/FloatingThemeToggle";
import HeroSection from "../../components/HeroSection";
import StatsSection from "../../components/StatsSection";
import FeaturesSection from "../../components/FeaturesSection";
import MapSection from "../../components/MapSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import TrustSection from "../../components/TrustSection";
import UpToBeginToggle from "../../components/UpToBeginToggle";

const cx = classNames.bind(style);

function Home() {
	const [hoveredProvince, setHoveredProvince] = useState(null);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);

	useEffect(() => {
		let ticking = false;
		const updateHeaderVisibility = () => {
			const mapSection = document.getElementById("map-section");
			if (mapSection) {
				const mapSectionTop = mapSection.offsetTop;
				const scrollY = window.scrollY;
				const windowHeight = window.innerHeight;

				if (scrollY + windowHeight / 2 >= mapSectionTop) {
					setIsHeaderVisible(false);
				} else {
					setIsHeaderVisible(true);
				}
			}

			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateHeaderVisibility);
				ticking = true;
			}
		};

		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const handleProvinceHover = (provinceData) => {
		setHoveredProvince(provinceData);
	};

	return (
		<div className={cx("wrapper")}>
			<HomeHeader isVisible={isHeaderVisible} />
			<div className={cx("content")}>
				<HeroSection/>
				<StatsSection />
				<FeaturesSection />
				<MapSection
					hoveredProvince={hoveredProvince}
					onProvinceHover={handleProvinceHover}
				/>
				<TrustSection />
				<HowItWorksSection />
			</div>
			<HomeFooter />
			<FloatingThemeToggle isHeaderVisible={isHeaderVisible} />
			<UpToBeginToggle />
		</div>
	);
}

export default Home;
