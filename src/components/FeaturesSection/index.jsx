import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames/bind";
import style from "./FeaturesSection.module.scss";
import {FiBookOpen} from "react-icons/fi";
import {FaHandHoldingHeart, FaLeaf, FaDumbbell} from "react-icons/fa";
import {MdHealthAndSafety, MdCorporateFare} from "react-icons/md";

const cx = classNames.bind(style);

function FeaturesSection() {
	const [isVisible, setIsVisible] = useState(false);
	const [shouldReset, setShouldReset] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const currentSection = sectionRef.current;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !shouldReset) {
					setIsVisible(true);
				} else if (!entry.isIntersecting && shouldReset) {
					setIsVisible(false);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "-100px 0px",
			}
		);

		if (currentSection) {
			observer.observe(currentSection);
		}

		return () => {
			if (currentSection) {
				observer.unobserve(currentSection);
			}
		};
	}, [shouldReset]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset;

			if (scrollTop <= 200 && isVisible) {
				setIsVisible(false);
				setShouldReset(true);

				setTimeout(() => {
					setShouldReset(false);
				}, 200);
			}
		};

		const throttledScroll = handleScroll;
		window.addEventListener("scroll", throttledScroll);
		return () => window.removeEventListener("scroll", throttledScroll);
	}, [isVisible]);

	useEffect(() => {
		const handleScrollToTop = () => {
			setIsVisible(false);
			setShouldReset(true);

			setTimeout(() => {
				setShouldReset(false);
			}, 1200);
		};

		window.addEventListener("scrollToTop", handleScrollToTop);

		return () => {
			window.removeEventListener("scrollToTop", handleScrollToTop);
		};
	}, []);

	return (
		<section ref={sectionRef} className={cx("features", {animate: isVisible})}>
			<div className={cx("section-content")}>
				<div className={cx("features-layout")}>
					<div className={cx("hero-title-section")}>
						<h1 className={cx("main-title")}>Khám Phá Hành Trình Gây Quỹ</h1>
						<p className={cx("subtitle")}>
							Cùng nhau tạo nên những câu chuyện ý nghĩa, thay đổi cuộc sống và lan tỏa yêu
							thương
						</p>
					</div>
					<div className={cx("content-section")}>
						<div className={cx("description-section")}>
							<h2 className={cx("description-title")}>
								Kết nối trái tim, lan tỏa yêu thương
							</h2>
							<p className={cx("description-text")}>
								Hãy trở thành một phần của cộng đồng gây quỹ lớn nhất Việt Nam, nơi mọi đóng góp
								đều mang lại ý nghĩa to lớn và giúp thay đổi cuộc sống của nhiều người.
							</p>
							<div className={cx("stats-grid")}>
								<div className={cx("stat-item")}>
									<div className={cx("stat-number")}>15K+</div>
									<div className={cx("stat-label")}>Chiến dịch</div>
								</div>
								<div className={cx("stat-item")}>
									<div className={cx("stat-number")}>50M+</div>
									<div className={cx("stat-label")}>Đồng quyên góp</div>
								</div>
								<div className={cx("stat-item")}>
									<div className={cx("stat-number")}>100K+</div>
									<div className={cx("stat-label")}>Nhà hảo tâm</div>
								</div>
								<div className={cx("stat-item")}>
									<div className={cx("stat-number")}>95%</div>
									<div className={cx("stat-label")}>Thành công</div>
								</div>
							</div>
						</div>

						<div className={cx("vertical-divider")}></div>

						<div className={cx("cards-section")}>
							<div className={cx("feature-grid")}>
								<div className={cx("grid-row", "row-1")}>
									<div className={cx("feature-card")}>
										<div className={cx("feature-main-content")}>
											<div className={cx("feature-icon-wrapper")}>
												<MdHealthAndSafety className={cx("feature-icon")} />
												<div className={cx("icon-bg")}></div>
												<div className={cx("icon-ring")}></div>
											</div>
											<div className={cx("feature-text")}>
												<h3>Y tế khẩn cấp</h3>
												<p>Hỗ trợ chi phí điều trị, phẫu thuật và chăm sóc sức khỏe</p>
											</div>
										</div>
										<div className={cx("feature-stats")}>
											<span>2.5K+ chiến dịch</span>
										</div>
										<div className={cx("feature-hover-effect")}></div>
									</div>
									<div className={cx("feature-card")}>
										<div className={cx("feature-main-content")}>
											<div className={cx("feature-icon-wrapper")}>
												<FiBookOpen className={cx("feature-icon")} />
												<div className={cx("icon-bg")}></div>
												<div className={cx("icon-ring")}></div>
											</div>
											<div className={cx("feature-text")}>
												<h3>Giáo dục</h3>
												<p>Gây quỹ cho học phí, sách vở và thiết bị học tập</p>
											</div>
										</div>
										<div className={cx("feature-stats")}>
											<span>1.8K+ chiến dịch</span>
										</div>
										<div className={cx("feature-hover-effect")}></div>
									</div>
									<div className={cx("feature-card")}>
										<div className={cx("feature-main-content")}>
											<div className={cx("feature-icon-wrapper")}>
												<FaHandHoldingHeart className={cx("feature-icon")} />
												<div className={cx("icon-bg")}></div>
												<div className={cx("icon-ring")}></div>
											</div>
											<div className={cx("feature-text")}>
												<h3>Từ thiện</h3>
												<p>Ủng hộ các tổ chức phi lợi nhuận và hoạt động cộng đồng</p>
											</div>
										</div>
										<div className={cx("feature-stats")}>
											<span>3.2K+ chiến dịch</span>
										</div>
										<div className={cx("feature-hover-effect")}></div>
									</div>
								</div>

								<div className={cx("grid-row", "row-2")}>
									<div className={cx("feature-card")}>
										<div className={cx("feature-main-content")}>
											<div className={cx("feature-icon-wrapper")}>
												<MdCorporateFare className={cx("feature-icon")} />
												<div className={cx("icon-bg")}></div>
												<div className={cx("icon-ring")}></div>
											</div>
											<div className={cx("feature-text")}>
												<h3>Kinh doanh</h3>
												<p>Hỗ trợ khởi nghiệp và phát triển doanh nghiệp</p>
											</div>
										</div>
										<div className={cx("feature-stats")}>
											<span>1.5K+ chiến dịch</span>
										</div>
										<div className={cx("feature-hover-effect")}></div>
									</div>
									<div className={cx("feature-card")}>
										<div className={cx("feature-main-content")}>
											<div className={cx("feature-icon-wrapper")}>
												<FaLeaf className={cx("feature-icon")} />
												<div className={cx("icon-bg")}></div>
												<div className={cx("icon-ring")}></div>
											</div>
											<div className={cx("feature-text")}>
												<h3>Môi trường</h3>
												<p>Bảo vệ thiên nhiên và phát triển bền vững</p>
											</div>
										</div>
										<div className={cx("feature-stats")}>
											<span>900+ chiến dịch</span>
										</div>
										<div className={cx("feature-hover-effect")}></div>
									</div>
									<div className={cx("feature-card")}>
										<div className={cx("feature-main-content")}>
											<div className={cx("feature-icon-wrapper")}>
												<FaDumbbell className={cx("feature-icon")} />
												<div className={cx("icon-bg")}></div>
												<div className={cx("icon-ring")}></div>
											</div>
											<div className={cx("feature-text")}>
												<h3>Thể thao</h3>
												<p>Hỗ trợ vận động viên và các hoạt động thể thao</p>
											</div>
										</div>
										<div className={cx("feature-stats")}>
											<span>1.1K+ chiến dịch</span>
										</div>
										<div className={cx("feature-hover-effect")}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default FeaturesSection;
