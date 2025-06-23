import React, { useState } from "react";
import classNames from "classnames/bind";
import { HiMenu } from "react-icons/hi";
import { useAuth } from "../../utils/authContext";
import Sidebar from "../../components/Sidebar";
import PopupLogout from "../../components/PopupLogout";
import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
	const { logout } = useAuth();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showLogoutPopup, setShowLogoutPopup] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleOverlayClick = () => {
		setIsSidebarOpen(false);
	};

	const handleLogout = () => {
		setShowLogoutPopup(false);
		logout();
	};

	return (
		<div className={cx("wrapper")}>
			<button className={cx("toggle-btn")} onClick={toggleSidebar}>
				<HiMenu size={24} />
			</button>
			<div
				className={cx("overlay", { active: isSidebarOpen })}
				onClick={handleOverlayClick}
			/>
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				onLogout={() => setShowLogoutPopup(true)}
			/>
			<div className={cx("container")}>{children}</div>
			{showLogoutPopup && (
				<PopupLogout
					onConfirm={handleLogout}
					onCancel={() => setShowLogoutPopup(false)}
				/>
			)}
		</div>
	);
}

export default DefaultLayout;
