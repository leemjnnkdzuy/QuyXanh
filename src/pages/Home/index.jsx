import React, {useState, useEffect} from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import {healthCheck} from "../../utils/request";

import {FiArrowRight} from "react-icons/fi";
import {FaCheck} from "react-icons/fa";

import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import FloatingThemeToggle from "../../components/FloatingThemeToggle";
import HeroSection from "../../components/HeroSection";
import StatsSection from "../../components/StatsSection";
import FeaturesSection from "../../components/FeaturesSection";
import MapSection from "../../components/MapSection";
import HowItWorksSection from "../../components/HowItWorksSection";

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
				<section className={cx("trust")}>
					<div className={cx("section-content")}>
						<div className={cx("trust-content")}>
							<div className={cx("trust-text")}>
								<h2>Chúng tôi sẽ hỗ trợ bạn</h2>
								<p>
									QuyXanh là một nền tảng gây quỹ trực tuyến đáng tin cậy. Với
									<strong>mức phí đơn giản</strong> và đội ngũ chuyên gia
									<strong>Tin cậy & An toàn</strong> hỗ trợ bạn, bạn có thể gây quỹ hoặc quyên góp
									với sự an tâm.
								</p>
								<button className={cx("trust-link")}>Đọc Cam kết Bảo đảm QuyXanh</button>
							</div>
							<div className={cx("trust-features")}>
								<div className={cx("trust-feature")}>
									<span>Không phí để bắt đầu</span>
									<FaCheck className={cx("check-icon")} />
								</div>
								<div className={cx("trust-feature")}>
									<span>Bảo mật thông tin 100%</span>
									<FaCheck className={cx("check-icon")} />
								</div>
								<div className={cx("trust-feature")}>
									<span>Hỗ trợ 24/7</span>
									<FaCheck className={cx("check-icon")} />
								</div>
								<div className={cx("trust-feature")}>
									<span>Minh bạch tài chính</span>
									<FaCheck className={cx("check-icon")} />
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className={cx("cta-section")}>
					<div className={cx("section-content")}>
						<h2 className={cx("cta-title")}>Sẵn sàng bắt đầu chiến dịch của bạn?</h2>
						<p className={cx("cta-description")}>
							Tham gia cùng hàng nghìn người đã tin tưởng QuyXanh để thực hiện những ước mơ và
							mục tiêu của họ.
						</p>
						<button className={cx("cta-button")}>
							<span>Tạo chiến dịch ngay</span>
							<FiArrowRight className={cx("cta-icon")} />
						</button>
					</div>
				</section>
				<HowItWorksSection />
			</div>
			<HomeFooter />
			<FloatingThemeToggle isHeaderVisible={isHeaderVisible} />
		</div>
	);
}

export default Home;
