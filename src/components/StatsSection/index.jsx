import React from "react";
import classNames from "classnames/bind";
import style from "./StatsSection.module.scss";
import {FiTrendingUp, FiUsers, FiMapPin, FiDollarSign} from "react-icons/fi";

const cx = classNames.bind(style);

function StatsSection() {
	const stats = [
		{
			icon: FiDollarSign,
			number: "500Tr+",
			label: "VNĐ được quyên góp",
			delay: "0s",
		},
		{
			icon: FiTrendingUp,
			number: "1K+",
			label: "Chiến dịch thành công",
			delay: "0.5s",
		},
		{
			icon: FiUsers,
			number: "100K+",
			label: "Người ủng hộ",
			delay: "1s",
		},
		{
			icon: FiMapPin,
			number: "63",
			label: "Tỉnh thành",
			delay: "1.5s",
		},
	];

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
