import React, {useEffect, useRef, useState} from "react";
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
	const [scrollY, setScrollY] = useState(0);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [sectionLocked, setSectionLocked] = useState(false);
	const [lockedScrollPosition, setLockedScrollPosition] = useState(0);
	const [userScrollAttempts, setUserScrollAttempts] = useState(0);
	const [hasCompletedSection, setHasCompletedSection] = useState(false);
	const [lastWheelTime, setLastWheelTime] = useState(0);
	const [isInitialized, setIsInitialized] = useState(false);
	const [finalLockActive, setFinalLockActive] = useState(false);
	const [finalScrollAttempts, setFinalScrollAttempts] = useState(0);

	const trustSectionRef = useRef(null);

	useEffect(() => {
		const checkInitialPosition = () => {
			if (trustSectionRef.current) {
				const storyContainer = trustSectionRef.current.parentElement;
				const containerTop = storyContainer.offsetTop;
				const containerHeight = storyContainer.offsetHeight;
				const viewportHeight = window.innerHeight;
				const scrollTop = window.scrollY;

				const relativeScroll = scrollTop - containerTop;
				const containerProgress = relativeScroll / (containerHeight - viewportHeight);

				if (containerProgress >= 0 && containerProgress <= 1) {
					setHasCompletedSection(true);
					setScrollProgress(Math.max(0, Math.min(1, containerProgress)));
				}

				setScrollY(scrollTop);
				setIsInitialized(true);
			}
		};

		const timer = setTimeout(checkInitialPosition, 100);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;

			if (trustSectionRef.current) {
				const storyContainer = trustSectionRef.current.parentElement;
				const containerTop = storyContainer.offsetTop;
				const containerHeight = storyContainer.offsetHeight;
				const viewportHeight = window.innerHeight;

				if (!isInitialized) {
					setIsInitialized(true);
					const relativeScroll = scrollTop - containerTop;
					const containerProgress = relativeScroll / (containerHeight - viewportHeight);

					if (containerProgress >= 0 && containerProgress <= 1) {
						setHasCompletedSection(true);
						setScrollProgress(Math.max(0, Math.min(1, containerProgress)));
						setScrollY(scrollTop);
						return;
					}
				}

				const relativeScroll = scrollTop - containerTop;
				const containerProgress = relativeScroll / (containerHeight - viewportHeight);

				const isScrollingPast = containerProgress > 1.05;
				const hasReachedEnd = scrollProgress >= 1.0;

				const shouldLock =
					containerProgress >= 0 &&
					containerProgress <= 1 &&
					!sectionLocked &&
					!hasCompletedSection &&
					!isScrollingPast &&
					isInitialized;

				const shouldUnlock =
					sectionLocked &&
					((hasReachedEnd &&
						(finalLockActive ? finalScrollAttempts >= 1 : userScrollAttempts >= 2)) ||
						isScrollingPast ||
						hasCompletedSection);

				const shouldAllowPassThrough =
					userScrollAttempts >= 2 || isScrollingPast || hasCompletedSection;

				if (shouldLock) {
					setSectionLocked(true);
					setLockedScrollPosition(scrollTop);
					setUserScrollAttempts(0);
					setScrollProgress(Math.max(0, Math.min(1, containerProgress)));
					document.body.style.overflow = "hidden";
					return;
				}

				if (shouldUnlock) {
					setSectionLocked(false);
					setHasCompletedSection(true);
					setFinalLockActive(false);
					document.body.style.overflow = "auto";
					setScrollY(scrollTop);
					setScrollProgress(1);
					return;
				}

				if (shouldAllowPassThrough) {
					if (sectionLocked) {
						setSectionLocked(false);
						setHasCompletedSection(true);
						document.body.style.overflow = "auto";
					}
					setScrollY(scrollTop);
					setScrollProgress(1);
					return;
				}

				if (sectionLocked) {
					if (window.scrollY !== lockedScrollPosition && scrollProgress < 1.0) {
						window.scrollTo(0, lockedScrollPosition);
					}

					if (scrollProgress >= 1.0 && !finalLockActive && !hasCompletedSection) {
						setFinalLockActive(true);
						setFinalScrollAttempts(0);
					}

					return;
				}

				setScrollY(scrollTop);
				setScrollProgress(Math.max(0, Math.min(1, containerProgress)));
			}
		};

		const handleWheel = (e) => {
			if (sectionLocked) {
				const now = Date.now();
				if (now - lastWheelTime < 150) {
					return;
				}
				setLastWheelTime(now);

				if (e.deltaY > 0) {
					if (scrollProgress >= 1.0) {
						e.preventDefault();
						if (finalLockActive) {
							setFinalScrollAttempts((prev) => {
								const newAttempts = Math.min(prev + 1, 2);
								if (newAttempts >= 1) {
									setSectionLocked(false);
									setHasCompletedSection(true);
									setFinalLockActive(false);
									document.body.style.overflow = "auto";
								}
								return newAttempts;
							});
						} else {
							setUserScrollAttempts((prev) => {
								const newAttempts = Math.min(prev + 1, 3);
								if (newAttempts >= 2) {
									setSectionLocked(false);
									setHasCompletedSection(true);
									document.body.style.overflow = "auto";
								}
								return newAttempts;
							});
						}
					} else {
						e.preventDefault();
						if (finalLockActive) {
							setFinalScrollAttempts((prev) => Math.min(prev + 1, 3));
						} else {
							setUserScrollAttempts((prev) => Math.min(prev + 1, 5));
						}

						setScrollProgress((prev) => {
							const increment = Math.abs(e.deltaY) / 1000;
							const newProgress = Math.min(1.0, prev + increment);
							return newProgress;
						});
					}
				}
			}
		};

		const handleKeyDown = (e) => {
			if (sectionLocked) {
				if (
					["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", "End", "Home"].includes(
						e.code
					)
				) {
					e.preventDefault();
					if (["ArrowDown", "PageDown", "Space", "End"].includes(e.code)) {
						if (scrollProgress >= 1.0) {
							if (finalLockActive) {
								setFinalScrollAttempts((prev) => {
									const newAttempts = Math.min(prev + 1, 2);
									if (newAttempts >= 1) {
										setSectionLocked(false);
										setHasCompletedSection(true);
										setFinalLockActive(false);
										document.body.style.overflow = "auto";
									}
									return newAttempts;
								});
							} else {
								setUserScrollAttempts((prev) => {
									const newAttempts = Math.min(prev + 1, 3);
									if (newAttempts >= 2) {
										setSectionLocked(false);
										setHasCompletedSection(true);
										document.body.style.overflow = "auto";
									}
									return newAttempts;
								});
							}
						} else {
							if (finalLockActive) {
								setFinalScrollAttempts((prev) => Math.min(prev + 1, 3));
							} else {
								setUserScrollAttempts((prev) => Math.min(prev + 1, 5));
							}
							setScrollProgress((prev) => {
								const newProgress = Math.min(1.0, prev + 0.05);
								return newProgress;
							});
						}
					}
				}
			}
		};

		const handleTouchMove = (e) => {
			if (sectionLocked) {
				e.preventDefault();
			}
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.target === trustSectionRef.current) {
						setIsVisible(entry.isIntersecting);
					}
				});
			},
			{threshold: [0.1, 0.5, 0.9]}
		);

		const trustSection = trustSectionRef.current;

		if (trustSection) observer.observe(trustSection);

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("wheel", handleWheel, {passive: false});
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("touchmove", handleTouchMove, {passive: false});

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("touchmove", handleTouchMove);
			document.body.style.overflow = "auto";
			if (trustSection) observer.unobserve(trustSection);
		};
	}, [
		sectionLocked,
		lockedScrollPosition,
		userScrollAttempts,
		scrollProgress,
		hasCompletedSection,
		lastWheelTime,
		isInitialized,
		finalLockActive,
		finalScrollAttempts,
	]);

	const getHeaderTransform = () => {
		if (scrollProgress < 0.1) {
			const fadeProgress = scrollProgress / 0.1;
			const easeInOut =
				fadeProgress < 0.5
					? 2 * fadeProgress * fadeProgress
					: 1 - Math.pow(-2 * fadeProgress + 2, 3) / 2;

			return {
				transform: `translateY(${Math.max(0, (0.1 - scrollProgress) * 80)}px) scale(${
					0.96 + easeInOut * 0.04
				})`,
				opacity: easeInOut,
			};
		} else if (scrollProgress < 0.35) {
			return {
				transform: `translateY(0) scale(1)`,
				opacity: 1,
			};
		} else if (scrollProgress < 0.55) {
			const fadeProgress = (scrollProgress - 0.35) / 0.2;
			const easeInOut =
				fadeProgress < 0.5
					? 2 * fadeProgress * fadeProgress
					: 1 - Math.pow(-2 * fadeProgress + 2, 3) / 2;

			return {
				transform: `translateX(${-easeInOut * 100}vw) translateY(${
					-easeInOut * 30
				}px) scale(${1 - easeInOut * 0.15})`,
				opacity: 1 - easeInOut * 0.9,
			};
		} else {
			return {
				transform: `translateX(-100vw) translateY(-30px) scale(0.85)`,
				opacity: 0.1,
			};
		}
	};

	const getFeaturesTransform = () => {
		if (scrollProgress < 0.3) {
			return {
				transform: `translateX(100vw) scale(0.7)`,
				opacity: 0,
			};
		} else if (scrollProgress < 0.6) {
			const slideProgress = (scrollProgress - 0.3) / 0.3;
			const easeProgress = 1 - Math.pow(1 - slideProgress, 2);
			return {
				transform: `translateX(${(1 - easeProgress) * 100}vw) scale(${
					0.7 + easeProgress * 0.3
				})`,
				opacity: easeProgress,
			};
		} else if (scrollProgress < 0.85) {
			return {
				transform: `translateX(0) scale(1)`,
				opacity: 1,
			};
		} else {
			const fadeProgress = (scrollProgress - 0.85) / 0.15;
			return {
				transform: `translateX(0) scale(${1 - fadeProgress * 0.1})`,
				opacity: 1 - fadeProgress * 0.5,
			};
		}
	};

	const getFeatureCardTransform = (index) => {
		if (scrollProgress < 0.35) {
			return `scale(0.4) translateY(100px)`;
		} else if (scrollProgress < 0.75) {
			const cardProgress = Math.max(0, (scrollProgress - 0.35 - index * 0.03) / 0.4);
			const easeProgress = 1 - Math.pow(1 - Math.min(1, cardProgress), 2);
			const scale = 0.4 + easeProgress * 0.6;
			const translateY = 100 - easeProgress * 100;
			return `scale(${scale}) translateY(${translateY}px)`;
		} else if (scrollProgress < 0.85) {
			return `scale(1) translateY(0)`;
		} else {
			const spreadProgress = (scrollProgress - 0.85) / 0.15;
			const easeSpread = Math.pow(spreadProgress, 1.5);
			const scale = 1 + easeSpread * 0.8;

			const corners = [
				{x: -30, y: -25},
				{x: 30, y: -25},
				{x: -30, y: 25},
				{x: 30, y: 25},
			];

			const corner = corners[index % 4];
			const translateX = easeSpread * corner.x;
			const translateY = easeSpread * corner.y;
			const rotateZ = easeSpread * (index % 2 === 0 ? 10 : -10);

			return `scale(${scale}) translateX(${translateX}vw) translateY(${translateY}vh) rotateZ(${rotateZ}deg)`;
		}
	};

	const getFeatureCardStyle = (index) => {
		if (scrollProgress < 0.85) {
			return {
				background: "rgba(255, 255, 255, 0.05)",
				borderColor: "rgba(255, 255, 255, 0.1)",
			};
		} else {
			const colorProgress = (scrollProgress - 0.85) / 0.15;
			const colors = [
				{bg: "rgba(45, 216, 129, 0.3)", border: "rgba(45, 216, 129, 0.5)"},
				{bg: "rgba(59, 130, 246, 0.3)", border: "rgba(59, 130, 246, 0.5)"},
				{bg: "rgba(168, 85, 247, 0.3)", border: "rgba(168, 85, 247, 0.5)"},
				{bg: "rgba(245, 101, 101, 0.3)", border: "rgba(245, 101, 101, 0.5)"},
			];

			const color = colors[index % 4];
			return {
				background: color.bg,
				borderColor: color.border,
				boxShadow: `0 ${12 + colorProgress * 20}px ${30 + colorProgress * 30}px ${
					color.bg
				}`,
			};
		}
	};
	const getCTATransform = () => {
		if (scrollProgress < 0.9) {
			return {
				transform: `scale(0.1) translateY(250px) rotateX(90deg)`,
				opacity: 0,
			};
		} else if (scrollProgress < 0.98) {
			const ctaProgress = (scrollProgress - 0.9) / 0.08;
			const easeProgress = 1 - Math.pow(1 - ctaProgress, 2);
			const scale = 0.1 + easeProgress * 0.9;
			const translateY = 250 - easeProgress * 250;
			const rotateX = 90 - easeProgress * 90;
			const opacity = easeProgress;

			return {
				transform: `scale(${scale}) translateY(${translateY}px) rotateX(${rotateX}deg)`,
				opacity: opacity,
			};
		} else {
			const finalProgress = Math.min(1, (scrollProgress - 0.98) / 0.02);
			const finalScale = 1 + finalProgress * 0.01;

			return {
				transform: `scale(${finalScale}) translateY(0) rotateX(0deg)`,
				opacity: 1,
			};
		}
	};

	const trustFeatures = [
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
	];

	return (
		<div className={cx("scroll-story-container")}>
			<section
				ref={trustSectionRef}
				className={cx("trust-section", "sticky-section")}
			>
				<div
					className={cx("parallax-bg")}
					style={{transform: `translateY(${scrollY * 0.3}px)`}}
				>
					<div className={cx("bg-shape", "shape-1")}></div>
					<div className={cx("bg-shape", "shape-2")}></div>
					<div className={cx("bg-shape", "shape-3")}></div>
				</div>

				<div className={cx("floating-particles")}>
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className={cx("particle", `particle-${i + 1}`)}
							style={{
								transform: `translateY(${scrollY * (0.1 + i * 0.02)}px) rotate(${
									scrollY * 0.05
								}deg)`,
							}}
						>
							{i % 3 === 0 ? <FiStar /> : i % 3 === 1 ? <FaHeart /> : <FaUsers />}
						</div>
					))}
				</div>

				<div
					className={cx("trust-content-wrapper")}
					style={{
						...getHeaderTransform(),
						transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
					}}
				>
					<div className={cx("section-content")}>
						<div className={cx("trust-header", {visible: isVisible})}>
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

				<div className={cx("features-content-wrapper")} style={getFeaturesTransform()}>
					<div className={cx("features-container")}>
						<div className={cx("features-grid")}>
							{trustFeatures.map((feature, index) => (
								<div
									key={index}
									className={cx("feature-card")}
									style={{
										transform: getFeatureCardTransform(index),
										...getFeatureCardStyle(index),
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
					className={cx("cta-content-wrapper")}
					style={{
						...getCTATransform(),
						transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
						pointerEvents: scrollProgress > 0.95 ? "auto" : "none",
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
