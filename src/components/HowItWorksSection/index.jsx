import React from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import style from "./HowItWorksSection.module.scss";

import {FaGlobe, FaMobile} from "react-icons/fa";
import {FiShield} from "react-icons/fi";

const cx = classNames.bind(style);

function HowItWorksSection() {
	const {t} = useTranslation();

	return (
		<section className={cx("how-it-works")}>
			<div className={cx("section-content")}>
				<h2 className={cx("section-title")}>{t("howItWorks.title")}</h2>
				<div className={cx("steps")}>
					<div className={cx("step")}>
						<div className={cx("step-number")}>1</div>
						<div className={cx("step-content")}>
							<h3>{t("howItWorks.step1Title")}</h3>
							<p>{t("howItWorks.step1Desc")}</p>
							<button className={cx("step-link")}>{t("howItWorks.step1Button")}</button>
						</div>
						<div className={cx("step-image")}>
							<FaMobile className={cx("step-icon")} />
						</div>
					</div>
					<div className={cx("step")}>
						<div className={cx("step-number")}>2</div>
						<div className={cx("step-content")}>
							<h3>{t("howItWorks.step2Title")}</h3>
							<p>{t("howItWorks.step2Desc")}</p>
						</div>
						<div className={cx("step-image")}>
							<FaGlobe className={cx("step-icon")} />
						</div>
					</div>
					<div className={cx("step")}>
						<div className={cx("step-number")}>3</div>
						<div className={cx("step-content")}>
							<h3>{t("howItWorks.step3Title")}</h3>
							<p>{t("howItWorks.step3Desc")}</p>
						</div>
						<div className={cx("step-image")}>
							<FiShield className={cx("step-icon")} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default HowItWorksSection;
