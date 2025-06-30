import React from "react";
import classNames from "classnames/bind";
import style from "./HowItWorksSection.module.scss";

import {FaGlobe, FaMobile} from "react-icons/fa";
import {FiShield} from "react-icons/fi";

const cx = classNames.bind(style);

function HowItWorksSection() {
	return (
		<section className={cx("how-it-works")}>
			<div className={cx("section-content")}>
				<h2 className={cx("section-title")}>
					Gây quỹ trên QuyXanh dễ dàng, mạnh mẽ và đáng tin cậy
				</h2>
				<div className={cx("steps")}>
					<div className={cx("step")}>
						<div className={cx("step-number")}>1</div>
						<div className={cx("step-content")}>
							<h3>Sử dụng công cụ của chúng tôi để tạo chiến dịch</h3>
							<p>
								Bạn sẽ được hướng dẫn thêm chi tiết chiến dịch và đặt mục tiêu. Cập nhật bất cứ
								lúc nào.
							</p>
							<button className={cx("step-link")}>
								Lấy mẹo để bắt đầu chiến dịch của bạn
							</button>
						</div>
						<div className={cx("step-image")}>
							<FaMobile className={cx("step-icon")} />
						</div>
					</div>
					<div className={cx("step")}>
						<div className={cx("step-number")}>2</div>
						<div className={cx("step-content")}>
							<h3>Tiếp cận người ủng hộ bằng cách chia sẻ</h3>
							<p>
								Chia sẻ liên kết chiến dịch của bạn và sử dụng các tài nguyên trong bảng điều
								khiển để tạo động lực.
							</p>
						</div>
						<div className={cx("step-image")}>
							<FaGlobe className={cx("step-icon")} />
						</div>
					</div>
					<div className={cx("step")}>
						<div className={cx("step-number")}>3</div>
						<div className={cx("step-content")}>
							<h3>Nhận tiền một cách an toàn</h3>
							<p>
								Thêm thông tin ngân hàng của bạn hoặc mời người thụ hưởng chiến dịch thêm thông
								tin của họ và bắt đầu nhận tiền.
							</p>
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
