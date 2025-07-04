import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import styles from "./HomeHeader.module.scss";
import {useNavigate} from "react-router-dom";
import Toggle from "../Toggle";
import {useAuth} from "../../utils/authContext";
import {FiArrowRight, FiUser, FiLogOut, FiMenu} from "react-icons/fi";
import {FaTree} from "react-icons/fa";

const cx = classNames.bind(styles);

function HomeHeader({isVisible = true}) {
	const navigate = useNavigate();
	const {t} = useTranslation();
	const {isAuthenticated, user, logout} = useAuth();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMapSectionVisible, setIsMapSectionVisible] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			setIsScrolled(scrollPosition > 100);

			const mapSection =
				document.querySelector(".Home_map-section__") ||
				document.querySelector('[class*="map-section"]') ||
				document.querySelector("section:has(.VietnamMap)") ||
				document
					.querySelector("section")
					.parentElement?.querySelector('[class*="map"]');

			if (mapSection) {
				const mapSectionRect = mapSection.getBoundingClientRect();

				if (mapSectionRect.top <= 100) {
					setIsMapSectionVisible(true);
				} else {
					setIsMapSectionVisible(false);
				}
			}
		};

		handleScroll();

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isMobileMenuOpen && !event.target.closest(`.${cx("mobile-menu")}`)) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isMobileMenuOpen]);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isMobileMenuOpen]);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const handleAuthAction = () => {
		if (isAuthenticated) {
			navigate("/dashboard");
		} else {
			navigate("/login");
		}
	};
	return (
		<header
			className={cx("wrapper", {
				scrolled: isScrolled,
				"hide-on-map": isMapSectionVisible,
				hidden: !isVisible,
			})}
		>
			<div className={cx("inner")}>
				<div className={cx("logo")}>
					<div onClick={() => navigate("/")} className={cx("logo-link")}>
						<FaTree className={cx("logo-icon")} />
						<span>QuyXanh</span>
					</div>
				</div>
				<nav className={cx("navigation")}>
					<ul className={cx("nav-list")}>
						<li>
							<button onClick={() => navigate("/features")} className={cx("nav-item")}>
								{t("header.campaigns")}
							</button>
						</li>
						<li>
							<button onClick={() => navigate("/about")} className={cx("nav-item")}>
								{t("header.about")}
							</button>
						</li>
						<li>
							<button onClick={() => navigate("/contact")} className={cx("nav-item")}>
								{t("header.contact")}
							</button>
						</li>
					</ul>
				</nav>
				<div className={cx("actions")}>
					<Toggle />
					{isAuthenticated ? (
						<div className={cx("user-menu")}>
							<button
								className={cx("user-btn")}
								onClick={() => navigate("/dashboard")}
								title={`Welcome, ${user?.fullName}`}
							>
								<FiUser className={cx("icon")} />
								<span className={cx("user-name")}>{user?.fullName}</span>
							</button>
							<button
								className={cx("logout-btn")}
								onClick={logout}
								title={t("tooltip.logout")}
							>
								<FiLogOut className={cx("icon")} />
							</button>
						</div>
					) : (
						<button className={cx("login-btn")} onClick={handleAuthAction}>
							<span>{t("header.login")}</span>
							<FiArrowRight className={cx("icon")} />
						</button>
					)}
					<button className={cx("menu-btn")} onClick={toggleMobileMenu}>
						<FiMenu className={cx("menu-icon")} />
					</button>
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className={cx("mobile-menu", {show: isMobileMenuOpen})}>
					<ul className={cx("mobile-nav-list")}>
						<li>
							<button
								onClick={() => {
									navigate("/features");
									closeMobileMenu();
								}}
								className={cx("mobile-nav-item")}
							>
								{t("header.campaigns")}
							</button>
						</li>
						<li>
							<button
								onClick={() => {
									navigate("/about");
									closeMobileMenu();
								}}
								className={cx("mobile-nav-item")}
							>
								{t("header.about")}
							</button>
						</li>
						<li>
							<button
								onClick={() => {
									navigate("/contact");
									closeMobileMenu();
								}}
								className={cx("mobile-nav-item")}
							>
								{t("header.contact")}
							</button>
						</li>
						<li>
							{isAuthenticated ? (
								<button
									onClick={() => {
										navigate("/dashboard");
										closeMobileMenu();
									}}
									className={cx("mobile-nav-item", "dashboard-btn")}
								>
									<FiUser className={cx("icon")} />
									{t("header.dashboard")}
								</button>
							) : (
								<button
									onClick={() => {
										navigate("/login");
										closeMobileMenu();
									}}
									className={cx("mobile-nav-item", "login-btn-mobile")}
								>
									<span>{t("header.login")}</span>
									<FiArrowRight className={cx("icon")} />
								</button>
							)}
						</li>
					</ul>
				</div>
			)}
		</header>
	);
}

export default HomeHeader;
