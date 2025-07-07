import React, {useState, useEffect, useRef} from "react";
import classNames from "classnames/bind";
import style from "./CompletedCampaignsSection.module.scss";
import assets from "../../assets";
import {MdArrowBack, MdChevronLeft, MdChevronRight} from "react-icons/md";
import {HiOutlineSparkles} from "react-icons/hi2";
import {IoMdArrowRoundForward} from "react-icons/io";
import {useTranslation} from "react-i18next";

const cx = classNames.bind(style);

function CompletedCampaignsSection() {
	const {t} = useTranslation();
	const [isExploring, setIsExploring] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	const campaignsData = t("completedCampaigns.campaigns", {
		returnObjects: true,
	}).map((campaign, index) => ({
		id: index + 1,
		image: [
			assets.completedCampaigns_pic1,
			assets.completedCampaigns_pic2,
			assets.completedCampaigns_pic3,
			assets.completedCampaigns_pic4,
			assets.completedCampaigns_pic5,
		][index],
		...campaign,
	}));

	// Intersection Observer để detect khi section vào viewport
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{
				threshold: 0.05, // Trigger khi chỉ 5% section visible
				rootMargin: "0px 0px 0px 0px", // Không có margin
			}
		);

		const currentRef = sectionRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, []);

	const handleExplore = () => {
		console.log("Explore button clicked!");
		setIsExploring(true);
	};

	const handleBack = () => {
		setIsExploring(false);
		setCurrentIndex(0);
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % campaignsData.length);
	};

	const handlePrev = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + campaignsData.length) % campaignsData.length
		);
	};

	const handleDotClick = (index) => {
		setCurrentIndex(index);
	};

	return (
		<section ref={sectionRef} className={cx("wrapper", {visible: isVisible})}>
			<div className={cx("container")}>
				<div className={cx("initial-view")}>
					<div className={cx("left-panel", {interactive: isExploring})}>
						<div className={cx("content")}>
							{isExploring && (
								<button className={cx("back-btn", {active: isExploring})} onClick={handleBack}>
									<MdArrowBack /> {t("completedCampaigns.backButton")}
								</button>
							)}

							<h2 className={cx("title")}>
								{isExploring
									? campaignsData[currentIndex].title
									: t("completedCampaigns.title")}
							</h2>

							<p className={cx("subtitle")}>
								{isExploring
									? campaignsData[currentIndex].description
									: t("completedCampaigns.subtitle")}
							</p>

							{!isExploring && (
								<div className={cx("question-section")}>
									<p className={cx("question")}>{t("completedCampaigns.question")}</p>
									<p className={cx("description")}>{t("completedCampaigns.description")}</p>
								</div>
							)}

							{isExploring && (
								<div className={cx("campaign-info", {active: isExploring})}>
									<div className={cx("campaign-details")}>
										<p className={cx("details-text")}>{campaignsData[currentIndex].details}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className={cx("right-panel")}>
						<div className={cx("cards-preview")}>
							{campaignsData.map((campaign, index) => (
								<div
									key={campaign.id}
									className={cx("preview-card", `card-${index + 1}`, {
										clear: isExploring && index === currentIndex,
									})}
									style={{
										zIndex: isExploring && index === currentIndex ? 10 : index + 1,
										opacity: isExploring ? (index === currentIndex ? 1 : 0.3) : 0.7,
									}}
								>
									<img
										src={campaign.image}
										alt={campaign.title}
										className={cx("preview-image")}
									/>
								</div>
							))}

							{!isExploring && (
								<div
									className={cx("overlay-blur", {
										"fade-out": isExploring,
									})}
								>
									<button className={cx("explore-btn")} onClick={handleExplore}>
										<HiOutlineSparkles className={cx("btn-icon-left")} />
										<span className={cx("btn-text")}>{t("completedCampaigns.exploreButton")}</span>
										<IoMdArrowRoundForward className={cx("btn-icon")} />
									</button>
								</div>
							)}

							{isExploring && (
								<>
									<div className={cx("cards-navigation", {active: isExploring})}>
										<button className={cx("nav-button")} onClick={handlePrev}>
											<MdChevronLeft />
										</button>
										<button className={cx("nav-button")} onClick={handleNext}>
											<MdChevronRight />
										</button>
									</div>

									<div className={cx("cards-dots", {active: isExploring})}>
										{campaignsData.map((_, index) => (
											<button
												key={index}
												className={cx("dot", {active: index === currentIndex})}
												onClick={() => handleDotClick(index)}
											/>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default CompletedCampaignsSection;
