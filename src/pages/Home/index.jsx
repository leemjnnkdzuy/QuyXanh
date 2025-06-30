import React, {useState, useEffect} from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import {healthCheck} from "../../utils/request";

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
	const [healthStatus, setHealthStatus] = useState("checking");
	const [hoveredProvince, setHoveredProvince] = useState(null);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	useEffect(() => {
		const checkHealth = async () => {
			try {
				const response = await healthCheck();
				if (response.success) {
					setHealthStatus("healthy");
				} else {
					setHealthStatus("unhealthy");
				}
			} catch (error) {
				setHealthStatus("error");
			}
		};
		checkHealth();
	}, []);
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
	const getTreeColor = () => {
		switch (healthStatus) {
			case "healthy":
				return "var(--primary-color-2)";
			case "unhealthy":
			case "error":
				return "var(--primary-color-5)";
			default:
				return "var(--text-secondary)";
		}
	};

	const getTreeShadow = () => {
		switch (healthStatus) {
			case "healthy":
				return "drop-shadow(0 0 20px rgba(45, 216, 129, 0.3))";
			case "unhealthy":
			case "error":
				return "drop-shadow(0 0 20px rgba(130, 51, 41, 0.3))";
			default:
				return "drop-shadow(0 0 20px rgba(113, 113, 122, 0.2))";
		}
	};
	return (
		<div className={cx("wrapper")}>
			<HomeHeader isVisible={isHeaderVisible} />
			<div className={cx("content")}>
				<HeroSection
					healthStatus={healthStatus}
					getTreeColor={getTreeColor}
					getTreeShadow={getTreeShadow}
				/>
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
