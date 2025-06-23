import React, {useState, useEffect} from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import {healthCheck} from "../../utils/request";

import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import {
	FiArrowRight,
	FiShield,
	FiUsers,
	FiTrendingUp,
	FiHeart,
	FiBookOpen,
} from "react-icons/fi";
import {
	FaTree,
	FaHandHoldingHeart,
	FaGlobe,
	FaMobile,
	FaCheck,
	FaLeaf,
	FaDumbbell,
} from "react-icons/fa";
import {MdHealthAndSafety, MdCorporateFare} from "react-icons/md";

const cx = classNames.bind(style);

function Home() {
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
		<div className={cx("wrapper")}>
			<HomeHeader />
			<div className={cx("content")}>
				<section className={cx("hero")}>
					{" "}
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
						</div>{" "}
						<div className={cx("hero-image")}>
							<div className={cx("hero-visual")}>
								{" "}
								<FaTree
									className={cx("main-icon")}
									style={{
										color: getTreeColor(),
										filter: getTreeShadow(),
									}}
								/>
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
				<section className={cx("stats")}>
					<div className={cx("stats-content")}>
						<div className={cx("stat-item")}>
							<div className={cx("stat-number")}>500Tr+</div>
							<div className={cx("stat-label")}>VNĐ được quyên góp</div>
						</div>
						<div className={cx("stat-item")}>
							<div className={cx("stat-number")}>1K+</div>
							<div className={cx("stat-label")}>Chiến dịch thành công</div>
						</div>
						<div className={cx("stat-item")}>
							<div className={cx("stat-number")}>100K+</div>
							<div className={cx("stat-label")}>Người ủng hộ</div>
						</div>
						<div className={cx("stat-item")}>
							<div className={cx("stat-number")}>63</div>
							<div className={cx("stat-label")}>Tỉnh thành</div>
						</div>
					</div>
				</section>{" "}
				<section className={cx("features")}>
					<div className={cx("section-content")}>
						<h2 className={cx("section-title")}>
							Khám phá các chiến dịch gây quỹ được truyền cảm hứng bởi những gì bạn quan tâm
						</h2>
						<div className={cx("feature-grid")}>
							<div className={cx("feature-card")}>
								<div className={cx("feature-icon-wrapper")}>
									<MdHealthAndSafety className={cx("feature-icon")} />
									<div className={cx("icon-bg")}></div>
									<div className={cx("icon-ring")}></div>
								</div>
								<div className={cx("feature-content")}>
									<h3>Y tế khẩn cấp</h3>
									<p>Hỗ trợ chi phí điều trị, phẫu thuật và chăm sóc sức khỏe</p>
									<div className={cx("feature-stats")}>
										<span>2.5K+ chiến dịch</span>
									</div>
								</div>
								<div className={cx("feature-hover-effect")}></div>
							</div>
							<div className={cx("feature-card")}>
								<div className={cx("feature-icon-wrapper")}>
									<FiBookOpen className={cx("feature-icon")} />
									<div className={cx("icon-bg")}></div>
									<div className={cx("icon-ring")}></div>
								</div>
								<div className={cx("feature-content")}>
									<h3>Giáo dục</h3>
									<p>Gây quỹ cho học phí, sách vở và thiết bị học tập</p>
									<div className={cx("feature-stats")}>
										<span>1.8K+ chiến dịch</span>
									</div>
								</div>
								<div className={cx("feature-hover-effect")}></div>
							</div>
							<div className={cx("feature-card")}>
								<div className={cx("feature-icon-wrapper")}>
									<FaHandHoldingHeart className={cx("feature-icon")} />
									<div className={cx("icon-bg")}></div>
									<div className={cx("icon-ring")}></div>
								</div>
								<div className={cx("feature-content")}>
									<h3>Từ thiện</h3>
									<p>Ủng hộ các tổ chức phi lợi nhuận và hoạt động cộng đồng</p>
									<div className={cx("feature-stats")}>
										<span>3.2K+ chiến dịch</span>
									</div>
								</div>
								<div className={cx("feature-hover-effect")}></div>
							</div>
							<div className={cx("feature-card")}>
								<div className={cx("feature-icon-wrapper")}>
									<MdCorporateFare className={cx("feature-icon")} />
									<div className={cx("icon-bg")}></div>
									<div className={cx("icon-ring")}></div>
								</div>
								<div className={cx("feature-content")}>
									<h3>Kinh doanh</h3>
									<p>Hỗ trợ khởi nghiệp và phát triển doanh nghiệp</p>
									<div className={cx("feature-stats")}>
										<span>1.5K+ chiến dịch</span>
									</div>
								</div>
								<div className={cx("feature-hover-effect")}></div>
							</div>
							<div className={cx("feature-card")}>
								<div className={cx("feature-icon-wrapper")}>
									<FaLeaf className={cx("feature-icon")} />
									<div className={cx("icon-bg")}></div>
									<div className={cx("icon-ring")}></div>
								</div>
								<div className={cx("feature-content")}>
									<h3>Môi trường</h3>
									<p>Bảo vệ thiên nhiên và phát triển bền vững</p>
									<div className={cx("feature-stats")}>
										<span>900+ chiến dịch</span>
									</div>
								</div>
								<div className={cx("feature-hover-effect")}></div>
							</div>
							<div className={cx("feature-card")}>
								<div className={cx("feature-icon-wrapper")}>
									<FaDumbbell className={cx("feature-icon")} />
									<div className={cx("icon-bg")}></div>
									<div className={cx("icon-ring")}></div>
								</div>
								<div className={cx("feature-content")}>
									<h3>Thể thao</h3>
									<p>Hỗ trợ vận động viên và các hoạt động thể thao</p>
									<div className={cx("feature-stats")}>
										<span>1.1K+ chiến dịch</span>
									</div>
								</div>
								<div className={cx("feature-hover-effect")}></div>
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
									QuyXanh là một nền tảng gây quỹ trực tuyến đáng tin cậy. Với{" "}
									<strong>mức phí đơn giản</strong> và đội ngũ chuyên gia{" "}
									<strong>Tin cậy & An toàn</strong> hỗ trợ bạn, bạn có thể gây quỹ hoặc quyên góp
									với sự an tâm.
								</p>
								<button className={cx("trust-link")}>Đọc Cam kết Bảo đảm QuyXanh</button>
							</div>{" "}
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
				</section>{" "}
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
						</div>{" "}
					</div>
				</section>
			</div>
			<HomeFooter />
		</div>
	);
}

export default Home;
