import React from "react";
import classNames from "classnames/bind";
import style from "./MapSection.module.scss";
import VietnamMap from "../VietnamMap";
import {FaGlobe} from "react-icons/fa";
import {FiTrendingUp, FiUsers} from "react-icons/fi";

const cx = classNames.bind(style);

function MapSection({hoveredProvince, onProvinceHover}) {
	return (
		<section className={cx("map-section")} id='map-section'>
			<div className={cx("map-layout")}>
				<div className={cx("map-container-full")}>
					<VietnamMap onProvinceHover={onProvinceHover} />
				</div>
				<div className={cx("map-content")}>
					<h2 className={cx("map-title")}>Chiến dịch gây quỹ trên toàn quốc</h2>
					<p className={cx("map-description")}>
						Khám phá các chiến dịch gây quỹ từ khắp 63 tỉnh thành Việt Nam. Hãy hover chuột
						lên bản đồ để xem thông tin các tỉnh thành.
					</p>
					<div className={cx("map-stats")}>
						<div className={cx("stat-item")}>
							<div className={cx("stat-content")}>
								<div className={cx("stat-number")}>
									{hoveredProvince ? hoveredProvince.name : "63"}
								</div>
								<div className={cx("stat-label")}>
									{hoveredProvince ? "Tỉnh được chọn" : "Tỉnh thành"}
								</div>
							</div>
							<FaGlobe className={cx("stat-icon")} />
						</div>
						<div className={cx("stat-item")}>
							<div className={cx("stat-content")}>
								<div className={cx("stat-number")}>
									{hoveredProvince ? `${hoveredProvince.campaigns}` : "10K+"}
								</div>
								<div className={cx("stat-label")}>
									{hoveredProvince ? "Chiến dịch tại đây" : "Chiến dịch"}
								</div>
							</div>
							<FiTrendingUp className={cx("stat-icon")} />
						</div>
						<div className={cx("stat-item")}>
							<div className={cx("stat-content")}>
								<div className={cx("stat-number")}>
									{hoveredProvince ? `${Math.floor(hoveredProvince.campaigns * 2.5)}K+` : "2.5M+"}
								</div>
								<div className={cx("stat-label")}>
									{hoveredProvince ? "Người tham gia" : "Người tham gia"}
								</div>
							</div>
							<FiUsers className={cx("stat-icon")} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default MapSection;
