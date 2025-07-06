import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import style from "./FeaturesSection.module.scss";
import {FiBookOpen} from "react-icons/fi";
import {FaHandHoldingHeart, FaLeaf, FaDumbbell} from "react-icons/fa";
import {MdHealthAndSafety, MdCorporateFare} from "react-icons/md";

const cx = classNames.bind(style);

function FeaturesSection() {
	const {t} = useTranslation();
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
						<h1 className={cx("main-title")}>{t("features.title")}</h1>
						<p className={cx("subtitle")}>{t("features.subtitle")}</p>
					</div>
					<div className={cx("content-section")}>
						<div className={cx("cards-section")}>
							<div className={cx("feature-grid")}>
								<div className={cx("feature-card")}>
									<div className={cx("feature-main-content")}>
										<div className={cx("feature-icon-wrapper")}>
											<MdHealthAndSafety className={cx("feature-icon")} />
											<div className={cx("icon-bg")}></div>
											<div className={cx("icon-ring")}></div>
										</div>
										<div className={cx("feature-text")}>
											<h3>{t("features.healthEmergency")}</h3>
											<p>{t("features.healthEmergencyDesc")}</p>
										</div>
									</div>
									<div className={cx("feature-stats")}>
										<span>2.5K+ {t("features.campaigns")}</span>
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
											<h3>{t("features.education")}</h3>
											<p>{t("features.educationDesc2")}</p>
										</div>
									</div>
									<div className={cx("feature-stats")}>
										<span>1.8K+ {t("features.campaigns")}</span>
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
											<h3>{t("features.charity")}</h3>
											<p>{t("features.charityDesc")}</p>
										</div>
									</div>
									<div className={cx("feature-stats")}>
										<span>3.2K+ {t("features.campaigns")}</span>
									</div>
									<div className={cx("feature-hover-effect")}></div>
								</div>

								<div className={cx("feature-card")}>
									<div className={cx("feature-main-content")}>
										<div className={cx("feature-icon-wrapper")}>
											<MdCorporateFare className={cx("feature-icon")} />
											<div className={cx("icon-bg")}></div>
											<div className={cx("icon-ring")}></div>
										</div>
										<div className={cx("feature-text")}>
											<h3>{t("features.business")}</h3>
											<p>{t("features.businessDesc")}</p>
										</div>
									</div>
									<div className={cx("feature-stats")}>
										<span>1.5K+ {t("features.campaigns")}</span>
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
											<h3>{t("features.environment")}</h3>
											<p>{t("features.environmentDesc")}</p>
										</div>
									</div>
									<div className={cx("feature-stats")}>
										<span>900+ {t("features.campaigns")}</span>
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
											<h3>{t("features.sports")}</h3>
											<p>{t("features.sportsDesc")}</p>
										</div>
									</div>
									<div className={cx("feature-stats")}>
										<span>1.1K+ {t("features.campaigns")}</span>
									</div>
									<div className={cx("feature-hover-effect")}></div>
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
