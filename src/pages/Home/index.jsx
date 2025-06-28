import React, {useState, useEffect} from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import {healthCheck} from "../../utils/request";

import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import VietnamMap from "../../components/VietnamMap";
import FloatingThemeToggle from "../../components/FloatingThemeToggle";
import HeroSection from "../../components/HeroSection";
import StatsSection from "../../components/StatsSection";
import FeaturesSection from "../../components/FeaturesSection";
import {FiArrowRight, FiShield, FiUsers, FiTrendingUp} from "react-icons/fi";
import {FaGlobe, FaMobile, FaCheck} from "react-icons/fa";

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
				<section className={cx("map-section")} id='map-section'>
					<div className={cx("map-layout")}>
						<div className={cx("map-container-full")}>
							<VietnamMap onProvinceHover={handleProvinceHover} />
						</div>
						<div className={cx("map-content")}>
							<h2 className={cx("map-title")}>Chiến dịch gây quỹ trên toàn quốc</h2>
							<p className={cx("map-description")}>
								Khám phá các chiến dịch gây quỹ từ khắp 63 tỉnh thành Việt Nam. Hãy hover chuột
								lên bản đồ để xem thông tin các tỉnh thành.
							</p>
							<div className={cx("map-stats")}>
								<div className={cx("stat-item")}>
									<div className={cx("stat-content")}>
										<div className={cx("stat-number")}>
											{hoveredProvince ? hoveredProvince.name : "63"}
										</div>
										<div className={cx("stat-label")}>
											{hoveredProvince ? "Tỉnh được chọn" : "Tỉnh thành"}
										</div>
									</div>
									<FaGlobe className={cx("stat-icon")} />
								</div>
								<div className={cx("stat-item")}>
									<div className={cx("stat-content")}>
										<div className={cx("stat-number")}>
											{hoveredProvince ? `${hoveredProvince.campaigns}` : "10K+"}
										</div>
										<div className={cx("stat-label")}>
											{hoveredProvince ? "Chiến dịch tại đây" : "Chiến dịch"}
										</div>
									</div>
									<FiTrendingUp className={cx("stat-icon")} />
								</div>
								<div className={cx("stat-item")}>
									<div className={cx("stat-content")}>
										<div className={cx("stat-number")}>
											{hoveredProvince ? `${Math.floor(hoveredProvince.campaigns * 2.5)}K+` : "2.5M+"}
										</div>
										<div className={cx("stat-label")}>
											{hoveredProvince ? "Người tham gia" : "Người tham gia"}
										</div>
									</div>
									<FiUsers className={cx("stat-icon")} />
								</div>
							</div>
						</div>
					</div>
				</section>
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
				<section className={cx("how-it-works")}>
					<div className={cx("section-content")}>
						<h2 className={cx("section-title")}>
							Gây quỹ trên QuyXanh dễ dàng, mạnh mẽ và đáng tin cậy
						</h2>
						<div className={cx("steps")}>
							<div className={cx("step")}>
								<div className={cx("step-number")}>1</div>
								<div className={cx("step-content")}>
									<h3>Sử dụng công cụ của chúng tôi để tạo chiến dịch</h3>
									<p>
										Bạn sẽ được hướng dẫn thêm chi tiết chiến dịch và đặt mục tiêu. Cập nhật bất cứ
										lúc nào.
									</p>
									<button className={cx("step-link")}>
										Lấy mẹo để bắt đầu chiến dịch của bạn
									</button>
								</div>
								<div className={cx("step-image")}>
									<FaMobile className={cx("step-icon")} />
								</div>
							</div>
							<div className={cx("step")}>
								<div className={cx("step-number")}>2</div>
								<div className={cx("step-content")}>
									<h3>Tiếp cận người ủng hộ bằng cách chia sẻ</h3>
									<p>
										Chia sẻ liên kết chiến dịch của bạn và sử dụng các tài nguyên trong bảng điều
										khiển để tạo động lực.
									</p>
								</div>
								<div className={cx("step-image")}>
									<FaGlobe className={cx("step-icon")} />
								</div>
							</div>
							<div className={cx("step")}>
								<div className={cx("step-number")}>3</div>
								<div className={cx("step-content")}>
									<h3>Nhận tiền một cách an toàn</h3>
									<p>
										Thêm thông tin ngân hàng của bạn hoặc mời người thụ hưởng chiến dịch thêm thông
										tin của họ và bắt đầu nhận tiền.
									</p>
								</div>
								<div className={cx("step-image")}>
									<FiShield className={cx("step-icon")} />
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			<HomeFooter />
			<FloatingThemeToggle isHeaderVisible={isHeaderVisible} />
		</div>
	);
}

export default Home;
