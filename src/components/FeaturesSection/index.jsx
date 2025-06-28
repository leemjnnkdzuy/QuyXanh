import React from "react";
import classNames from "classnames/bind";
import style from "./FeaturesSection.module.scss";
import {FiBookOpen} from "react-icons/fi";
import {FaHandHoldingHeart, FaLeaf, FaDumbbell} from "react-icons/fa";
import {MdHealthAndSafety, MdCorporateFare} from "react-icons/md";

const cx = classNames.bind(style);

function FeaturesSection() {
	return (
		<section className={cx("features")}>
			<div className={cx("section-content")}>
				<h2 className={cx("section-title")}>
					Khám phá các chiến dịch gây quỹ được truyền cảm hứng bởi những gì bạn quan tâm
				</h2>
				<div className={cx("feature-grid")}>
					<div className={cx("feature-card")}>
						<div className={cx("feature-icon-wrapper")}>
							<MdHealthAndSafety className={cx("feature-icon")} />
							<div className={cx("icon-bg")}></div>
							<div className={cx("icon-ring")}></div>
						</div>
						<div className={cx("feature-content")}>
							<h3>Y tế khẩn cấp</h3>
							<p>Hỗ trợ chi phí điều trị, phẫu thuật và chăm sóc sức khỏe</p>
							<div className={cx("feature-stats")}>
								<span>2.5K+ chiến dịch</span>
							</div>
						</div>
						<div className={cx("feature-hover-effect")}></div>
					</div>
					<div className={cx("feature-card")}>
						<div className={cx("feature-icon-wrapper")}>
							<FiBookOpen className={cx("feature-icon")} />
							<div className={cx("icon-bg")}></div>
							<div className={cx("icon-ring")}></div>
						</div>
						<div className={cx("feature-content")}>
							<h3>Giáo dục</h3>
							<p>Gây quỹ cho học phí, sách vở và thiết bị học tập</p>
							<div className={cx("feature-stats")}>
								<span>1.8K+ chiến dịch</span>
							</div>
						</div>
						<div className={cx("feature-hover-effect")}></div>
					</div>
					<div className={cx("feature-card")}>
						<div className={cx("feature-icon-wrapper")}>
							<FaHandHoldingHeart className={cx("feature-icon")} />
							<div className={cx("icon-bg")}></div>
							<div className={cx("icon-ring")}></div>
						</div>
						<div className={cx("feature-content")}>
							<h3>Từ thiện</h3>
							<p>Ủng hộ các tổ chức phi lợi nhuận và hoạt động cộng đồng</p>
							<div className={cx("feature-stats")}>
								<span>3.2K+ chiến dịch</span>
							</div>
						</div>
						<div className={cx("feature-hover-effect")}></div>
					</div>
					<div className={cx("feature-card")}>
						<div className={cx("feature-icon-wrapper")}>
							<MdCorporateFare className={cx("feature-icon")} />
							<div className={cx("icon-bg")}></div>
							<div className={cx("icon-ring")}></div>
						</div>
						<div className={cx("feature-content")}>
							<h3>Kinh doanh</h3>
							<p>Hỗ trợ khởi nghiệp và phát triển doanh nghiệp</p>
							<div className={cx("feature-stats")}>
								<span>1.5K+ chiến dịch</span>
							</div>
						</div>
						<div className={cx("feature-hover-effect")}></div>
					</div>
					<div className={cx("feature-card")}>
						<div className={cx("feature-icon-wrapper")}>
							<FaLeaf className={cx("feature-icon")} />
							<div className={cx("icon-bg")}></div>
							<div className={cx("icon-ring")}></div>
						</div>
						<div className={cx("feature-content")}>
							<h3>Môi trường</h3>
							<p>Bảo vệ thiên nhiên và phát triển bền vững</p>
							<div className={cx("feature-stats")}>
								<span>900+ chiến dịch</span>
							</div>
						</div>
						<div className={cx("feature-hover-effect")}></div>
					</div>
					<div className={cx("feature-card")}>
						<div className={cx("feature-icon-wrapper")}>
							<FaDumbbell className={cx("feature-icon")} />
							<div className={cx("icon-bg")}></div>
							<div className={cx("icon-ring")}></div>
						</div>
						<div className={cx("feature-content")}>
							<h3>Thể thao</h3>
							<p>Hỗ trợ vận động viên và các hoạt động thể thao</p>
							<div className={cx("feature-stats")}>
								<span>1.1K+ chiến dịch</span>
							</div>
						</div>
						<div className={cx("feature-hover-effect")}></div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default FeaturesSection;
