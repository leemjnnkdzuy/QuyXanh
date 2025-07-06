import React, {useEffect, useRef, useState, useCallback, useMemo} from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import style from "./TrustSection.module.scss";
import {
	FiArrowRight,
	FiShield,
	FiClock,
	FiDollarSign,
	FiTrendingUp,
	FiStar,
} from "react-icons/fi";
import {FaCheck, FaHeart, FaUsers} from "react-icons/fa";

const cx = classNames.bind(style);

function TrustSection() {
	const {t} = useTranslation();
	const [scrollProgress, setScrollProgress] = useState(0);
	const [currentPhase, setCurrentPhase] = useState("header");
	const [isVisible, setIsVisible] = useState(false);
	const [isSticky, setIsSticky] = useState(false);
	const containerRef = useRef(null);

	const trustFeatures = useMemo(
		() => [
			{
				icon: <FiDollarSign />,
				title: t("trust.features.free.title"),
				description: t("trust.features.free.description"),
			},
			{
				icon: <FiShield />,
				title: t("trust.features.secure.title"),
				description: t("trust.features.secure.description"),
			},
			{
				icon: <FiClock />,
				title: t("trust.features.support.title"),
				description: t("trust.features.support.description"),
			},
			{
				icon: <FiTrendingUp />,
				title: t("trust.features.transparent.title"),
				description: t("trust.features.transparent.description"),
			},
		],
		[t]
	);

	const handleScroll = useCallback(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const rect = container.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		const containerHeight = rect.height;
		const scrollStart = windowHeight;
		const scrollEnd = -containerHeight;
		const scrollRange = scrollStart - scrollEnd;
		const currentScroll = rect.top;

		let progress = (scrollStart - currentScroll) / scrollRange;
		progress = Math.max(0, Math.min(1, progress));

		setScrollProgress(progress);

		let newPhase;
		if (progress < 0.25) {
			newPhase = "header";
		} else if (progress < 0.75) {
			newPhase = "features";
		} else {
			newPhase = "cta";
		}

		if (newPhase !== currentPhase) {
			setCurrentPhase(newPhase);
		}

		const isInSticky = rect.top <= 0 && rect.bottom >= windowHeight;
		setIsSticky(isInSticky);
	}, [currentPhase]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					setIsVisible(entry.isIntersecting);
				});
			},
			{
				threshold: 0.1,
				rootMargin: "0px 0px -100px 0px",
			}
		);

		const currentContainer = containerRef.current;
		if (currentContainer) {
			observer.observe(currentContainer);
		}

		const scrollListener = () => {
			handleScroll();
		};

		window.addEventListener("scroll", scrollListener, {passive: true});
		handleScroll();

		return () => {
			window.removeEventListener("scroll", scrollListener);
			if (currentContainer) {
				observer.unobserve(currentContainer);
			}
		};
	}, [handleScroll]);

	const phaseProgresses = useMemo(() => {

		const headerProgress = Math.min(1, Math.max(0, scrollProgress / 0.25));

		const featuresProgress = Math.min(
			1,
			Math.max(0, (scrollProgress - 0.25) / 0.5)
		);

		const ctaProgress = Math.min(1, Math.max(0, (scrollProgress - 0.75) / 0.25));

		return {headerProgress, featuresProgress, ctaProgress};
	}, [scrollProgress]);

	return (
		<div ref={containerRef} className={cx("scroll-story-container")}>
			<section
				className={cx("trust-section", {"sticky-section": isSticky})}
				data-phase={currentPhase}
				style={{
					"--scroll-progress": scrollProgress,
					"--current-phase":
						currentPhase === "header" ? 0 : currentPhase === "features" ? 1 : 2,
				}}
			>
				<div className={cx("parallax-bg")}>
					<div className={cx("bg-shape", "shape-1")}></div>
					<div className={cx("bg-shape", "shape-2")}></div>
					<div className={cx("bg-shape", "shape-3")}></div>
				</div>

				<div className={cx("floating-particles")}>
					{[...Array(6)].map((_, i) => (
						<div key={i} className={cx("particle", `particle-${i + 1}`)}>
							{i % 3 === 0 ? <FiStar /> : i % 3 === 1 ? <FaHeart /> : <FaUsers />}
						</div>
					))}
				</div>

				<div className={cx("scroll-progress-bar")}>
					<div
						className={cx("progress-fill")}
						style={{width: `${scrollProgress * 100}%`}}
					></div>
				</div>

				<div
					className={cx("trust-content-wrapper", {active: currentPhase === "header"})}
					style={{
						"--phase-progress": phaseProgresses.headerProgress,
					}}
				>
					<div className={cx("section-content")}>
						<div
							className={cx("trust-header", {
								visible: isVisible && currentPhase === "header",
							})}
						>
							<span className={cx("trust-badge")}>
								<FaCheck />
								{t("trust.badge")}
							</span>
							<h2 className={cx("trust-title")}>
								{t("trust.title").split(t("trust.titleHighlight"))[0]}
								<span className={cx("highlight")}>{t("trust.titleHighlight")}</span>
								{t("trust.title").split(t("trust.titleHighlight"))[1]}
							</h2>
							<p className={cx("trust-subtitle")}>{t("trust.subtitle")}</p>
						</div>
					</div>
				</div>

				<div
					className={cx("features-content-wrapper", {
						active: currentPhase === "features",
					})}
					style={{
						"--phase-progress": phaseProgresses.featuresProgress,
					}}
				>
					<div className={cx("features-container")}>
						<div className={cx("features-grid")}>
							{trustFeatures.map((feature, index) => (
								<div
									key={index}
									className={cx("feature-card")}
									style={{
										"--card-index": index,
										animationDelay: `${index * 0.1}s`,
									}}
								>
									<div className={cx("feature-icon")}>{feature.icon}</div>
									<div className={cx("feature-content")}>
										<h3 className={cx("feature-title")}>{feature.title}</h3>
										<p className={cx("feature-description")}>{feature.description}</p>
									</div>
									<div className={cx("feature-check")}>
										<FaCheck />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div
					className={cx("cta-content-wrapper", {active: currentPhase === "cta"})}
					style={{
						"--phase-progress": phaseProgresses.ctaProgress,
					}}
				>
					<div className={cx("cta-inner")}>
						<h2 className={cx("cta-title")}>
							{t("trust.ctaTitle").split(t("trust.ctaHighlight"))[0]}
							<span className={cx("cta-highlight")}>{t("trust.ctaHighlight")}</span>
							{t("trust.ctaTitle").split(t("trust.ctaHighlight"))[1]}
						</h2>
						<p className={cx("cta-description")}>{t("trust.ctaDescription")}</p>
						<div className={cx("cta-buttons")}>
							<button className={cx("cta-button", "primary")}>
								<span>{t("trust.createCampaign")}</span>
								<FiArrowRight className={cx("cta-icon")} />
							</button>
							<button className={cx("cta-button", "secondary")}>
								<span>{t("trust.learnMore")}</span>
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default TrustSection;
