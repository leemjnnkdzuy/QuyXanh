import React from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import style from "./ProvinceTooltip.module.scss";
import {
	MdLocationOn,
	MdLocalFireDepartment,
	MdBolt,
	MdShowChart,
	MdCampaign,
	MdStar,
} from "react-icons/md";

const cx = classNames.bind(style);

const ProvinceTooltip = ({provinceData}) => {
	const {t} = useTranslation();

	const activityLevel =
		provinceData.campaigns > 150
			? "high"
			: provinceData.campaigns > 80
			? "medium"
			: "low";

	const activityText =
		activityLevel === "high"
			? t("map.tooltip.activityHigh", "Rất cao")
			: activityLevel === "medium"
			? t("map.tooltip.activityMedium", "Trung bình")
			: t("map.tooltip.activityLow", "Thấp");

	const ActivityIcon =
		activityLevel === "high"
			? MdLocalFireDepartment
			: activityLevel === "medium"
			? MdBolt
			: MdShowChart;

	const isArchipelago = provinceData.type === "archipelago";
	const displayType = isArchipelago ? t("map.archipelago") : t("map.province");

	return (
		<div className={cx("modern-tooltip")}>
			<div className={cx("tooltip-background")}></div>
			<div className={cx("tooltip-content")}>
				<div className={cx("province-header")}>
					<div className={cx("province-icon", {"archipelago-icon": isArchipelago})}>
						{isArchipelago ? <MdStar /> : <MdLocationOn />}
					</div>
					<div className={cx("province-info")}>
						<h3 className={cx("province-name")}>{provinceData.name}</h3>
						<span className={cx("province-type")}>{displayType}</span>
					</div>
				</div>

				<div className={cx("stats-container")}>
					<div className={cx("stat-item", "primary-stat")}>
						<div className={cx("stat-icon")}>
							<MdCampaign />
						</div>
						<div className={cx("stat-content")}>
							<div className={cx("stat-number")}>{provinceData.campaigns}</div>
							<div className={cx("stat-label")}>{t("map.campaigns")}</div>
						</div>
					</div>
					<div className={cx("stat-item", "activity-stat")}>
						<div className={cx("stat-icon")}>
							<ActivityIcon />
						</div>
						<div className={cx("stat-content")}>
							<div className={cx("stat-value", activityLevel)}>{activityText}</div>
							<div className={cx("stat-label")}>{t("map.activity")}</div>
						</div>
					</div>
				</div>

				<div className={cx("tooltip-footer")}>
					<div className={cx("ranking-info")}>
						<span className={cx("ranking-text")}>
							{t("map.topRanking", {
								rank: Math.ceil((1 - provinceData.campaigns / 400) * 63),
							})}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProvinceTooltip;
