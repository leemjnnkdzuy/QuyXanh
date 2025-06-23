import React, {useState} from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useLanguages} from "../../utils/languagesContext";
import styles from "./HomeFooter.module.scss";
import HomePopupLanguages from "../HomePopupLanguages";
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaYoutube,
	FaLinkedin,
	FaTree,
} from "react-icons/fa";
import {FiMail, FiPhone, FiGlobe} from "react-icons/fi";
import VN from "country-flag-icons/react/3x2/VN";
import US from "country-flag-icons/react/3x2/US";

const cx = classNames.bind(styles);

function HomeFooter() {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const {currentLanguage} = useLanguages();
	const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);

	const handleNavigation = (path) => {
		navigate(path);
	};

	const handleLanguageClick = () => {
		setIsLanguagePopupOpen(true);
	};

	const handleCloseLanguagePopup = () => {
		setIsLanguagePopupOpen(false);
	};

	const getCurrentLanguageName = () => {
		return currentLanguage === "vi" ? "Tiếng Việt" : "English";
	};
	const getLanguageFlag = () => {
		const FlagComponent = currentLanguage === "vi" ? VN : US;
		return <FlagComponent style={{width: "16px", height: "12px"}} />;
	};

	return (
		<footer className={cx("footer")}>
			<div className={cx("footer-content")}>
				<div className={cx("footer-main")}>
					<div className={cx("footer-brand")}>
						<div className={cx("logo")}>
							<FaTree className={cx("logo-icon")} />
							<span className={cx("logo-text")}>QuyXanh</span>
						</div>
						<p className={cx("brand-description")}>{t("footer.description")}</p>
						<div className={cx("social-links")}>
							<a
								href='https://facebook.com'
								target='_blank'
								rel='noopener noreferrer'
								className={cx("social-link")}
							>
								<FaFacebook />
							</a>
							<a
								href='https://twitter.com'
								target='_blank'
								rel='noopener noreferrer'
								className={cx("social-link")}
							>
								<FaTwitter />
							</a>
							<a
								href='https://instagram.com'
								target='_blank'
								rel='noopener noreferrer'
								className={cx("social-link")}
							>
								<FaInstagram />
							</a>
							<a
								href='https://youtube.com'
								target='_blank'
								rel='noopener noreferrer'
								className={cx("social-link")}
							>
								<FaYoutube />
							</a>{" "}
							<a
								href='https://linkedin.com'
								target='_blank'
								rel='noopener noreferrer'
								className={cx("social-link")}
							>
								<FaLinkedin />
							</a>
						</div>{" "}
						<button className={cx("language-selector")} onClick={handleLanguageClick}>
							<FiGlobe className={cx("language-icon")} />
							<span>{getCurrentLanguageName()}</span>
							<span className={cx("language-flag")}>{getLanguageFlag()}</span>
						</button>
					</div>

					<div className={cx("footer-links")}>
						<div className={cx("footer-section")}>
							<h3 className={cx("section-title")}>{t("footer.donate.title")}</h3>
							<ul className={cx("section-links")}>
								<li>
									<button
										onClick={() => handleNavigation("/discover")}
										className={cx("footer-link")}
									>
										{t("footer.donate.categories")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/crisis-relief")}
										className={cx("footer-link")}
									>
										{t("footer.donate.crisis")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/social-impact")}
										className={cx("footer-link")}
									>
										{t("footer.donate.social")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/supporter-space")}
										className={cx("footer-link")}
									>
										{t("footer.donate.supporter")}
									</button>
								</li>
							</ul>
						</div>

						<div className={cx("footer-section")}>
							<h3 className={cx("section-title")}>{t("footer.fundraise.title")}</h3>
							<ul className={cx("section-links")}>
								<li>
									<button
										onClick={() => handleNavigation("/start")}
										className={cx("footer-link")}
									>
										{t("footer.fundraise.howto")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/categories")}
										className={cx("footer-link")}
									>
										{t("footer.fundraise.categories")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/team-fundraising")}
										className={cx("footer-link")}
									>
										{t("footer.fundraise.team")}
									</button>
								</li>
								<li>
									<button onClick={() => handleNavigation("/blog")} className={cx("footer-link")}>
										{t("footer.fundraise.blog")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/charity")}
										className={cx("footer-link")}
									>
										{t("footer.fundraise.charity")}
									</button>
								</li>
							</ul>
						</div>

						<div className={cx("footer-section")}>
							<h3 className={cx("section-title")}>{t("footer.about.title")}</h3>
							<ul className={cx("section-links")}>
								<li>
									<button
										onClick={() => handleNavigation("/how-it-works")}
										className={cx("footer-link")}
									>
										{t("footer.about.howworks")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/guarantee")}
										className={cx("footer-link")}
									>
										{t("footer.about.guarantee")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/pricing")}
										className={cx("footer-link")}
									>
										{t("footer.about.pricing")}
									</button>
								</li>
								<li>
									<button onClick={() => handleNavigation("/help")} className={cx("footer-link")}>
										{t("footer.about.help")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/about-us")}
										className={cx("footer-link")}
									>
										{t("footer.about.aboutus")}
									</button>
								</li>
								<li>
									<button
										onClick={() => handleNavigation("/careers")}
										className={cx("footer-link")}
									>
										{t("footer.about.careers")}
									</button>
								</li>
							</ul>
						</div>

						<div className={cx("footer-section")}>
							<h3 className={cx("section-title")}>{t("footer.contact.title")}</h3>
							<div className={cx("contact-info")}>
								<div className={cx("contact-item")}>
									<FiMail className={cx("contact-icon")} />
									<span>support@quyxanh.com</span>
								</div>
								<div className={cx("contact-item")}>
									<FiPhone className={cx("contact-icon")} />
									<span>+84 123 456 789</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={cx("footer-bottom")}>
					<div className={cx("footer-bottom-content")}>
						<div className={cx("copyright")}>
							<span>© 2024 QuyXanh. {t("footer.copyright")}</span>
						</div>
						<div className={cx("legal-links")}>
							<button onClick={() => handleNavigation("/terms")} className={cx("legal-link")}>
								{t("footer.legal.terms")}
							</button>
							<button
								onClick={() => handleNavigation("/privacy")}
								className={cx("legal-link")}
							>
								{t("footer.legal.privacy")}
							</button>
							<button onClick={() => handleNavigation("/legal")} className={cx("legal-link")}>
								{t("footer.legal.legal")}
							</button>
							<button
								onClick={() => handleNavigation("/accessibility")}
								className={cx("legal-link")}
							>
								{t("footer.legal.accessibility")}
							</button>
							<button
								onClick={() => handleNavigation("/cookies")}
								className={cx("legal-link")}
							>
								{t("footer.legal.cookies")}
							</button>
						</div>
					</div>{" "}
				</div>
			</div>

			<HomePopupLanguages
				isOpen={isLanguagePopupOpen}
				onClose={handleCloseLanguagePopup}
			/>
		</footer>
	);
}

export default HomeFooter;
