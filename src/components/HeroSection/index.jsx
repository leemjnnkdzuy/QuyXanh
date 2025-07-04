import React from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import style from "./HeroSection.module.scss";
import {FiArrowRight, FiHeart, FiUsers, FiTrendingUp} from "react-icons/fi";
import {FaTree} from "react-icons/fa";

const cx = classNames.bind(style);

function HeroSection() {
	const {t} = useTranslation();

	return (
		<section className={cx("hero")}>
			<div className={cx("hero-content")}>
				<div className={cx("hero-text-wrapper")}>
					<h1 className={cx("hero-title")}>
						<span className={cx("highlight")}>#1</span> {t("hero.title").replace("#1 ", "")}
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
					<h2 className={cx("hero-subtitle")}>{t("hero.subtitle")}</h2>
					<div className={cx("hero-cta-wrapper")}>
						<button className={cx("hero-cta")}>
							<span>{t("hero.cta")}</span>
							<FiArrowRight className={cx("cta-icon")} />
						</button>
					</div>
				</div>
				<div className={cx("hero-image")}>
					<div className={cx("hero-visual")}>
						<FaTree
							className={cx("main-icon")}
							style={{
								color: "var(--primary-color-2)",
								filter: "drop-shadow(0 0 20px rgba(45, 216, 129, 0.3))",
							}}
						/>
						<div className={cx("floating-cards")}>
							<div className={cx("card", "card-1")}>
								<FiHeart />
								<span>{t("hero.community")}</span>
							</div>
							<div className={cx("card", "card-2")}>
								<FiUsers />
								<span>{t("hero.connect")}</span>
							</div>
							<div className={cx("card", "card-3")}>
								<FiTrendingUp />
								<span>{t("hero.spread")}</span>
							</div>
						</div>
					</div>
					<p className={cx("hero-description")}>{t("hero.description")}</p>
				</div>
			</div>
		</section>
	);
}

export default HeroSection;
