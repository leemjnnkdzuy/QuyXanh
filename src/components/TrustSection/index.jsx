import React from "react";
import classNames from "classnames/bind";
import style from "./TrustSection.module.scss";
import {FiArrowRight} from "react-icons/fi";
import {FaCheck} from "react-icons/fa";

const cx = classNames.bind(style);

function TrustSection() {
	return (
		<>
			<section className={cx("trust")}>
				<div className={cx("section-content")}>
					<div className={cx("trust-content")}>
						<div className={cx("trust-text")}>
							<h2>Chúng tôi sẽ hỗ trợ bạn</h2>
							<p>
								QuyXanh là một nền tảng gây quỹ trực tuyến đáng tin cậy. Với
								<strong>mức phí đơn giản</strong> và đội ngũ chuyên gia
								<strong>Tin cậy & An toàn</strong> hỗ trợ bạn, bạn có thể gây quỹ hoặc quyên góp
								với sự an tâm.
							</p>
							<button className={cx("trust-link")}>Đọc Cam kết Bảo đảm QuyXanh</button>
						</div>
						<div className={cx("trust-features")}>
							<div className={cx("trust-feature")}>
								<span>Không phí để bắt đầu</span>
								<FaCheck className={cx("check-icon")} />
							</div>
							<div className={cx("trust-feature")}>
								<span>Bảo mật thông tin 100%</span>
								<FaCheck className={cx("check-icon")} />
							</div>
							<div className={cx("trust-feature")}>
								<span>Hỗ trợ 24/7</span>
								<FaCheck className={cx("check-icon")} />
							</div>
							<div className={cx("trust-feature")}>
								<span>Minh bạch tài chính</span>
								<FaCheck className={cx("check-icon")} />
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className={cx("cta-section")}>
				<div className={cx("section-content")}>
					<h2 className={cx("cta-title")}>Sẵn sàng bắt đầu chiến dịch của bạn?</h2>
					<p className={cx("cta-description")}>
						Tham gia cùng hàng nghìn người đã tin tưởng QuyXanh để thực hiện những ước mơ và
						mục tiêu của họ.
					</p>
					<button className={cx("cta-button")}>
						<span>Tạo chiến dịch ngay</span>
						<FiArrowRight className={cx("cta-icon")} />
					</button>
				</div>
			</section>
		</>
	);
}

export default TrustSection;
