import React from "react";
import classNames from "classnames/bind";
import style from "./HeroSection.module.scss";
import Loading from "../Loading";
import {FiArrowRight, FiHeart, FiUsers, FiTrendingUp} from "react-icons/fi";
import {FaTree} from "react-icons/fa";
import {useEffect, useState} from "react";
import {healthCheck} from "../../utils/request";

const cx = classNames.bind(style);

function HeroSection() {
	const [healthStatus, setHealthStatus] = useState("checking");

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
		<section className={cx("hero")}>
			<div className={cx("hero-content")}>
				<div className={cx("hero-text-wrapper")}>
					<h1 className={cx("hero-title")}>
						<span className={cx("highlight")}>#1</span> Nền tảng gây quỹ tại Việt Nam
						<div className={cx("floating-dots")}>
							<div className={cx("dot", "dot-1")}>
								<div className={cx("dot-tail")}></div>
							</div>
							<div className={cx("dot", "dot-2")}>
								<div className={cx("dot-tail")}></div>
							</div>
							<div className={cx("dot", "dot-3")}>
								<div className={cx("dot-tail")}></div>
							</div>
							<div className={cx("dot", "dot-4")}>
								<div className={cx("dot-tail")}></div>
							</div>
						</div>
					</h1>
					<h2 className={cx("hero-subtitle")}>
						Những chiến dịch gây quỹ thành công bắt đầu từ đây
					</h2>
					<div className={cx("hero-cta-wrapper")}>
						<button className={cx("hero-cta")}>
							<span>Bắt đầu với QuyXanh</span>
							<FiArrowRight className={cx("cta-icon")} />
						</button>
					</div>
				</div>
				<div className={cx("hero-image")}>
					<div className={cx("hero-visual")}>
						{healthStatus === "checking" ? (
							<Loading size='120px' />
						) : (
							<FaTree
								className={cx("main-icon")}
								style={{
									color: getTreeColor(),
									filter: getTreeShadow(),
								}}
							/>
						)}
						<div className={cx("floating-cards")}>
							<div className={cx("card", "card-1")}>
								<FiHeart />
								<span>Giúp đỡ cộng đồng</span>
							</div>
							<div className={cx("card", "card-2")}>
								<FiUsers />
								<span>Kết nối yêu thương</span>
							</div>
							<div className={cx("card", "card-3")}>
								<FiTrendingUp />
								<span>Lan tỏa tích cực</span>
							</div>
						</div>
					</div>
					<p className={cx("hero-description")}>
						Hơn <strong>500 triệu VNĐ</strong> được quyên góp mỗi tuần trên QuyXanh.*
					</p>
				</div>
			</div>
		</section>
	);
}

export default HeroSection;
