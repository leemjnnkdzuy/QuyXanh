import React from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import style from "./StatsSection.module.scss";
import {FiTrendingUp, FiUsers, FiMapPin, FiDollarSign} from "react-icons/fi";
import {useHomeData} from "../../utils/useHomeData";
import {createCurrencyFormatter} from "../../utils/formatterContext";

const cx = classNames.bind(style);

function StatsSection() {
	const {t} = useTranslation();
	const {homeData, loading} = useHomeData();

	const formatStats = createCurrencyFormatter(t);

	const getStatsData = () => {
		if (!homeData || loading) {
			return [
				{
					icon: FiDollarSign,
					number: "...",
					label: t("stats.donatedAmount"),
					delay: "0s",
				},
				{
					icon: FiTrendingUp,
					number: "...",
					label: t("stats.successfulCampaigns"),
					delay: "0.5s",
				},
				{
					icon: FiUsers,
					number: "...",
					label: t("stats.supporters"),
					delay: "1s",
				},
				{
					icon: FiMapPin,
					number: "...",
					label: t("stats.provinces"),
					delay: "1.5s",
				},
			];
		}

		const stats = homeData.stats;
		const odometer = homeData.odometer;

		return [
			{
				icon: FiDollarSign,
				number: formatStats(odometer?.totalAmount || 0),
				label: t("stats.donatedAmount"),
				delay: "0s",
			},
			{
				icon: FiTrendingUp,
				number: formatStats(stats?.successfulCampaigns || 0),
				label: t("stats.successfulCampaigns"),
				delay: "0.5s",
			},
			{
				icon: FiUsers,
				number: formatStats(stats?.supporters || 0),
				label: t("stats.supporters"),
				delay: "1s",
			},
			{
				icon: FiMapPin,
				number: formatStats(stats?.provinces || 0),
				label: t("stats.provinces"),
				delay: "1.5s",
			},
		];
	};

	const stats = getStatsData();

	const duplicatedStats = [...stats, ...stats, ...stats];

	return (
		<section className={cx("stats")}>
			<div className={cx("stats-container")}>
				<div className={cx("stats-track")}>
					{duplicatedStats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<div
								key={index}
								className={cx("stat-item")}
								style={{animationDelay: stat.delay}}
							>
								<div className={cx("stat-icon-wrapper")}>
									<IconComponent className={cx("stat-icon")} />
									<div className={cx("icon-glow")}></div>
								</div>
								<div className={cx("stat-content")}>
									<div className={cx("stat-number")}>{stat.number}</div>
									<div className={cx("stat-label")}>{stat.label}</div>
								</div>
								<div className={cx("stat-particle")}>
									<div className={cx("particle")}></div>
									<div className={cx("particle")}></div>
									<div className={cx("particle")}></div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className={cx("stats-background")}>
				<div className={cx("gradient-orb", "orb-1")}></div>
				<div className={cx("gradient-orb", "orb-2")}></div>
				<div className={cx("gradient-orb", "orb-3")}></div>
			</div>
		</section>
	);
}

export default StatsSection;
