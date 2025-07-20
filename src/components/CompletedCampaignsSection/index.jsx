import React, {useState, useEffect, useRef, useCallback} from "react";
import classNames from "classnames/bind";
import style from "./CompletedCampaignsSection.module.scss";
import assets from "../../assets";
import {MdArrowBack, MdChevronLeft, MdChevronRight, MdClose} from "react-icons/md";
import {HiOutlineSparkles} from "react-icons/hi2";
import {IoMdArrowRoundForward} from "react-icons/io";
import {useTranslation} from "react-i18next";

const cx = classNames.bind(style);

function CompletedCampaignsSection() {
	const {t} = useTranslation();
	const [isExploring, setIsExploring] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);
	const [showFullImage, setShowFullImage] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [morphOrigin, setMorphOrigin] = useState({x: 0, y: 0, width: 0, height: 0});
	const sectionRef = useRef(null);
	const imageRefs = useRef([]);

	const minSwipeDistance = 50;

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

	const handleCloseFullImage = useCallback(() => {
		setShowFullImage(false);
		setTimeout(() => {
			setSelectedImage(null);
		}, 400);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{
				threshold: 0.05,
				rootMargin: "0px 0px 0px 0px",
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

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape' && showFullImage) {
				handleCloseFullImage();
			}
		};

		if (showFullImage) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
		};
	}, [showFullImage, handleCloseFullImage]);

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

	const onTouchStart = (e) => {
		if (!isExploring) return;
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e) => {
		if (!isExploring) return;
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = () => {
		if (!isExploring || !touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			handleNext();
		} else if (isRightSwipe) {
			handlePrev();
		}
	};

	const handleImageClick = (campaign, index) => {
		if (!isExploring || index !== currentIndex) return;
		
		const imageElement = imageRefs.current[index];
		if (imageElement) {
			const rect = imageElement.getBoundingClientRect();
			setMorphOrigin({
				x: rect.left,
				y: rect.top,
				width: rect.width,
				height: rect.height
			});
		}
		
		setSelectedImage(campaign);
		setShowFullImage(true);
	};

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			handleCloseFullImage();
		}
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
						<div
							className={cx("cards-preview")}
							onTouchStart={onTouchStart}
							onTouchMove={onTouchMove}
							onTouchEnd={onTouchEnd}
						>
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
									onClick={() => handleImageClick(campaign, index)}
								>
									<img
										ref={(el) => (imageRefs.current[index] = el)}
										src={campaign.image}
										alt={campaign.title}
										className={cx("preview-image", {
											clickable: isExploring && index === currentIndex
										})}
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

			{selectedImage && (
				<div 
					className={cx("image-overlay", {
						show: showFullImage,
						hide: !showFullImage
					})}
					onClick={handleOverlayClick}
				>
					<div className={cx("overlay-backdrop")} />
					<div 
						className={cx("full-image-container", {
							morphing: showFullImage
						})}
						style={{
							'--morph-x': `${morphOrigin.x}px`,
							'--morph-y': `${morphOrigin.y}px`,
							'--morph-width': `${morphOrigin.width}px`,
							'--morph-height': `${morphOrigin.height}px`,
						}}
					>
						<button 
							className={cx("close-button")}
							onClick={handleCloseFullImage}
						>
							<MdClose />
						</button>
						<img 
							src={selectedImage.image}
							alt={selectedImage.title}
							className={cx("full-image")}
						/>
						<div className={cx("image-info")}>
							<h3 className={cx("image-title")}>{selectedImage.title}</h3>
							<p className={cx("image-description")}>{selectedImage.description}</p>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

export default CompletedCampaignsSection;
