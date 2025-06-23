import React from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import {useLanguages} from "../../utils/languagesContext";
import {FiGlobe, FiCheck} from "react-icons/fi";
import VN from "country-flag-icons/react/3x2/VN";
import US from "country-flag-icons/react/3x2/US";
import styles from "./HomePopupLanguages.module.scss";

const cx = classNames.bind(styles);

function HomePopupLanguages({isOpen, onClose}) {
	const {t} = useTranslation();
	const {currentLanguage, changeLanguage} = useLanguages();
	const languages = [
		{
			code: "vi",
			name: "Tiếng Việt",
			flag: VN,
		},
		{
			code: "en",
			name: "English",
			flag: US,
		},
	];

	const handleLanguageSelect = (languageCode) => {
		changeLanguage(languageCode);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={cx("overlay")} onClick={onClose}>
			<div className={cx("popup")} onClick={(e) => e.stopPropagation()}>
				<div className={cx("header")}>
					<div className={cx("title")}>
						<FiGlobe className={cx("globe-icon")} />
						<span>{t("footer.language.selectLanguage")}</span>
					</div>
					<button className={cx("close-btn")} onClick={onClose}>
						×
					</button>
				</div>

				<div className={cx("content")}>
					<div className={cx("language-list")}>
						{languages.map((language) => (
							<button
								key={language.code}
								className={cx("language-item", {
									active: currentLanguage === language.code,
								})}
								onClick={() => handleLanguageSelect(language.code)}
							>
								{" "}
								<div className={cx("language-info")}>
									<span className={cx("flag")}>
										<language.flag style={{width: "20px", height: "15px"}} />
									</span>
									<span className={cx("name")}>{language.name}</span>
								</div>
								{currentLanguage === language.code && <FiCheck className={cx("check-icon")} />}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default HomePopupLanguages;
