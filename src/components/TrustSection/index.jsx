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
	const rafRef = useRef(null);

	// Memoized features data
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

	// Optimized scroll handler with requestAnimationFrame
	const handleScroll = useCallback(() => {
		if (rafRef.current) return;

		rafRef.current = requestAnimationFrame(() => {
			if (!containerRef.current) {
				rafRef.current = null;
				return;
			}

			const container = containerRef.current;
			const rect = container.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			// Debug log
			console.log("Scroll detected:", {
				rectTop: rect.top,
				rectBottom: rect.bottom,
				windowHeight,
				rectHeight: rect.height,
			});

			// Tính toán scroll progress với phạm vi mở rộng
			const containerHeight = rect.height;
			const scrollStart = windowHeight; // Khi container bắt đầu vào viewport
			const scrollEnd = -containerHeight + windowHeight; // Khi container gần rời viewport
			const scrollRange = scrollStart - scrollEnd;
			const currentScroll = rect.top;

			// Tính progress
			let progress = (scrollStart - currentScroll) / scrollRange;
			progress = Math.max(0, Math.min(1, progress));

			// Debug progress
			console.log("Progress:", progress);

			// Smooth easing function
			const easeProgress =
				progress < 0.5
					? 2 * progress * progress
					: 1 - Math.pow(-2 * progress + 2, 3) / 2;

			setScrollProgress(easeProgress);

			// Cải thiện logic sticky
			const inStickyZone = rect.top <= 0 && rect.bottom >= windowHeight;
			setIsSticky(inStickyZone);

			// Điều chỉnh các mốc phase để ít nhảy qua
			let newPhase = currentPhase;
			if (progress < 0.3) {
				newPhase = "header";
			} else if (progress < 0.7) {
				newPhase = "features";
			} else {
				newPhase = "cta";
			}

			// Chỉ thay đổi phase khi có sự khác biệt rõ ràng
			if (newPhase !== currentPhase) {
				setCurrentPhase(newPhase);
				console.log("Phase changed to:", newPhase);
			}

			rafRef.current = null;
		});
	}, [currentPhase]);

	useEffect(() => {
		// Intersection Observer for visibility
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					setIsVisible(entry.isIntersecting);
				});
			},
			{threshold: 0.1}
		);

		const currentContainer = containerRef.current; // Copy ref to variable

		if (currentContainer) {
			observer.observe(currentContainer);
		}

		// Throttled scroll listener
		let ticking = false;
		const scrollListener = () => {
			if (!ticking) {
				handleScroll();
				ticking = true;
				setTimeout(() => {
					ticking = false;
				}, 16); // ~60fps
			}
		};

		window.addEventListener("scroll", scrollListener, {passive: true});
		handleScroll(); // Initial call

		return () => {
			window.removeEventListener("scroll", scrollListener);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
			if (currentContainer) {
				observer.unobserve(currentContainer);
			}
		};
	}, [handleScroll]);

	// Calculate phase-specific progress values
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
				style={{
					"--scroll-progress": scrollProgress,
					"--current-phase":
						currentPhase === "header" ? 0 : currentPhase === "features" ? 1 : 2,
				}}
			>
				{/* Background Elements */}
				<div className={cx("parallax-bg")}>
					<div className={cx("bg-shape", "shape-1")}></div>
					<div className={cx("bg-shape", "shape-2")}></div>
					<div className={cx("bg-shape", "shape-3")}></div>
				</div>

				{/* Floating Particles */}
				<div className={cx("floating-particles")}>
					{[...Array(6)].map((_, i) => (
						<div key={i} className={cx("particle", `particle-${i + 1}`)}>
							{i % 3 === 0 ? <FiStar /> : i % 3 === 1 ? <FaHeart /> : <FaUsers />}
						</div>
					))}
				</div>

				{/* Scroll Progress Bar */}
				<div className={cx("scroll-progress-bar")}>
					<div
						className={cx("progress-fill")}
						style={{width: `${scrollProgress * 100}%`}}
					></div>
				</div>

				{/* Trust Header Phase */}
				<div
					className={cx("trust-content-wrapper", {active: currentPhase === "header"})}
					style={{
						"--phase-progress": phaseProgresses.headerProgress,
						opacity: currentPhase === "header" ? 1 : currentPhase === "features" ? 0.3 : 0,
						transform: `translateY(${
							currentPhase === "header" ? 0 : currentPhase === "features" ? -50 : -100
						}px) scale(${currentPhase === "header" ? 1 : 0.9})`,
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

				{/* Features Phase */}
				<div
					className={cx("features-content-wrapper", {
						active: currentPhase === "features",
					})}
					style={{
						"--phase-progress": phaseProgresses.featuresProgress,
						opacity:
							currentPhase === "features"
								? 1
								: currentPhase === "header"
								? 0.3
								: currentPhase === "cta"
								? 0.3
								: 0,
						transform: `translateY(${
							currentPhase === "features" ? 0 : currentPhase === "header" ? 50 : -50
						}px) scale(${currentPhase === "features" ? 1 : 0.95})`,
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

				{/* CTA Phase */}
				<div
					className={cx("cta-content-wrapper", {active: currentPhase === "cta"})}
					style={{
						"--phase-progress": phaseProgresses.ctaProgress,
						opacity: currentPhase === "cta" ? 1 : currentPhase === "features" ? 0.3 : 0,
						transform: `translateY(${currentPhase === "cta" ? 0 : 50}px) scale(${
							currentPhase === "cta" ? 1 : 0.9
						})`,
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
