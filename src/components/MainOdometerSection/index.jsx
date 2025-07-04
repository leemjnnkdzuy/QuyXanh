import React, {useEffect, useState, useCallback} from "react";
import classNames from "classnames/bind";
import style from "./MainOdometerSection.module.scss";

const cx = classNames.bind(style);

const OdometerDigit = ({targetDigit, startSpin, delay = 0}) => {
	const [position, setPosition] = useState(0);
	const [isSpinning, setIsSpinning] = useState(false);

	useEffect(() => {
		if (startSpin && targetDigit !== null) {
			setTimeout(() => {
				setIsSpinning(true);

				const totalSpins = 1 + Math.random() * 1;
				const targetPosition = parseInt(targetDigit) + totalSpins * 10;

				let currentPos = 0;
				const increment = 0.2;

				const smoothSpin = () => {
					if (currentPos < targetPosition) {
						currentPos += increment;
						setPosition(currentPos % 10);
						requestAnimationFrame(smoothSpin);
					} else {
						setPosition(parseInt(targetDigit));
						setIsSpinning(false);
					}
				};

				requestAnimationFrame(smoothSpin);
			}, delay);
		}
	}, [startSpin, targetDigit, delay]);

	const renderDigitStack = () => {
		const digits = [];
		for (let i = 0; i < 10; i++) {
			digits.push(
				<div
					key={i}
					className={cx("digit-item")}
					style={{
						transform: `translateY(${(i - position) * 100}%)`,
					}}
				>
					{i}
				</div>
			);
		}
		return digits;
	};

	return (
		<div className={cx("odometer-digit", {"is-spinning": isSpinning})}>
			<div className={cx("digit-stack")}>{renderDigitStack()}</div>
		</div>
	);
};

const MainOdometer = ({targetValue, isVisible}) => {
	const [digits, setDigits] = useState([]);
	const [shouldStartSpin, setShouldStartSpin] = useState(false);

	const formatCurrency = (num) => {
		return new Intl.NumberFormat("vi-VN").format(num);
	};

	const getTargetDigits = useCallback((value) => {
		const formatted = formatCurrency(value);
		return formatted.split("").map((char, index) => ({
			value: char,
			position: index,
			isNumber: !isNaN(char) && char !== " ",
		}));
	}, []);

	useEffect(() => {
		const targetDigits = getTargetDigits(targetValue);
		setDigits(targetDigits);
	}, [targetValue, getTargetDigits]);

	useEffect(() => {
		if (isVisible && digits.length > 0) {
			const initialDelay = Math.random() * 500;
			setTimeout(() => {
				setShouldStartSpin(true);
			}, initialDelay);
		}
	}, [isVisible, digits.length]);

	return (
		<div className={cx("main-odometer")}>
			<div className={cx("main-odometer-display")}>
				{digits.map((digit, index) => {
					if (!digit.isNumber) {
						return (
							<div key={`separator-${index}`} className={cx("separator")}>
								{digit.value}
							</div>
						);
					}

					const digitDelay = Math.random() * 800;

					return (
						<OdometerDigit
							key={`digit-${index}`}
							targetDigit={digit.value}
							startSpin={shouldStartSpin}
							delay={digitDelay}
						/>
					);
				})}
			</div>
			<div className={cx("currency-symbol")}>₫</div>
		</div>
	);
};

function MainOdometerSection({isVisible}) {
	return (
		<div className={cx("main-odometer-section", {animate: isVisible})}>
			<div className={cx("odometer-header")}>
				<h2 className={cx("odometer-title")}>Tổng số tiền đã quyên góp</h2>
				<p className={cx("odometer-subtitle")}>Trên nền tảng QuyXanh</p>
			</div>
			<MainOdometer targetValue={125750000000} isVisible={isVisible} />
			<div className={cx("odometer-footer")}>
				<p className={cx("odometer-note")}>
					Cảm ơn sự đóng góp của hơn 100,000 nhà hảo tâm đã giúp thực hiện 15,000+ chiến
					dịch thành công
				</p>
			</div>
		</div>
	);
}

export default MainOdometerSection;
