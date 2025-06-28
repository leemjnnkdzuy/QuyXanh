import React from "react";
import classNames from "classnames/bind";
import style from "./StatsSection.module.scss";

const cx = classNames.bind(style);

function StatsSection() {
	return (
		<section className={cx("stats")}>
			<div className={cx("stats-content")}>
				<div className={cx("stat-item")}>
					<div className={cx("stat-number")}>500Tr+</div>
					<div className={cx("stat-label")}>VNĐ được quyên góp</div>
				</div>
				<div className={cx("stat-item")}>
					<div className={cx("stat-number")}>1K+</div>
					<div className={cx("stat-label")}>Chiến dịch thành công</div>
				</div>
				<div className={cx("stat-item")}>
					<div className={cx("stat-number")}>100K+</div>
					<div className={cx("stat-label")}>Người ủng hộ</div>
				</div>
				<div className={cx("stat-item")}>
					<div className={cx("stat-number")}>63</div>
					<div className={cx("stat-label")}>Tỉnh thành</div>
				</div>
			</div>
		</section>
	);
}

export default StatsSection;
