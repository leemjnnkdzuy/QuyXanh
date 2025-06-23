import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import classNames from "classnames/bind";
import {
	HiBell,
	HiAcademicCap,
	HiCalendar,
	HiClipboardList,
	HiDocumentText,
	HiCurrencyDollar,
	HiLogout,
	HiBookOpen,
	HiClipboardCheck,
	HiPencilAlt,
	HiGift,
	HiChartBar,
	HiIdentification,
	HiTemplate,
	HiChat,
	HiHeart,
	HiCollection,
	HiLightBulb,
	HiArrowLeft,
} from "react-icons/hi";
import {MdSmartToy} from "react-icons/md";

import assets from "../../assets";
import Toggle from "../../components/Toggle";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

function Sidebar({isOpen, onClose, onLogout}) {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedPath, setSelectedPath] = useState(location.pathname);
	const [isRegistrationMode, setIsRegistrationMode] = useState(false);

	useEffect(() => {
		setSelectedPath(location.pathname);

		if (location.pathname.includes("/student/RegistScheduleUnit")) {
			setIsRegistrationMode(true);
		} else {
			setIsRegistrationMode(false);
		}
	}, [location.pathname]);

	const registrationMenuData = [
		{
			TenChucNang: "Đăng ký học phần",
			ThuTu: 1,
			childMenu: [
				{
					TenChucNang: "Đăng ký học phần",
					LienKet: "/student/RegistScheduleUnit",
					Icon: HiPencilAlt,
				},
				{
					TenChucNang: "Đăng ký ghi danh",
					LienKet: "/student/RegistScheduleUnitPlan",
					Icon: HiClipboardList,
				},
				{
					TenChucNang: "Tra cứu học phần",
					LienKet: "/student/RegistScheduleUnit/search",
					Icon: HiBookOpen,
				},
				{
					TenChucNang: "Học phần tương đương",
					LienKet: "/student/RegistScheduleUnit/equivalent",
					Icon: HiCollection,
				},
				{
					TenChucNang: "Lịch sử đăng ký học phần",
					LienKet: "/student/RegistScheduleUnit/history",
					Icon: HiClipboardCheck,
				},
				{
					TenChucNang: "Chương trình đào tạo",
					LienKet: "/student/RegistScheduleUnit/program",
					Icon: HiTemplate,
				},
			],
		},
	];

	const menuData = [
		{
			TenChucNang: "Thông tin cá nhân",
			ThuTu: 1,
			childMenu: [
				{
					TenChucNang: "Thông tin cá nhân",
					LienKet: "/",
					Icon: HiIdentification,
				},
				{
					TenChucNang: "Thông báo",
					LienKet: "/student/Notifications",
					Icon: HiBell,
				},
			],
		},
		{
			TenChucNang: "Tra cứu thông tin",
			ThuTu: 2,
			childMenu: [
				{
					TenChucNang: "Chương trình đào tạo",
					LienKet: "/student/EducationalProgram",
					Icon: HiTemplate,
				},
				{
					TenChucNang: "Thời khóa biểu",
					LienKet: "/student/ClassSchedule",
					Icon: HiCalendar,
				},
				{
					TenChucNang: "Lịch thi",
					LienKet: "/student/ExamSchedule",
					Icon: HiClipboardList,
				},
				{
					TenChucNang: "Quyết định sinh viên",
					LienKet: "/student/Decision",
					Icon: HiDocumentText,
				},
				{
					TenChucNang: "Điểm danh",
					LienKet: "/student/Attendance",
					Icon: HiClipboardCheck,
				},
				{
					TenChucNang: "Điểm rèn luyện",
					LienKet: "/student/ConductScore",
					Icon: HiChartBar,
				},
				{
					TenChucNang: "Kết quả học tập",
					LienKet: "/student/AcademicResults",
					Icon: HiBookOpen,
				},
				{
					TenChucNang: "Tài chính sinh viên",
					LienKet: "/student/Finance",
					Icon: HiCurrencyDollar,
				},
				{
					TenChucNang: "Kết quả đăng ký học phần",
					LienKet: "/student/CourseRegistrationResults",
					Icon: HiPencilAlt,
				},
				{
					TenChucNang: "Chính sách miễn giảm",
					LienKet: "/student/ScholarshipPolicy",
					Icon: HiLightBulb,
				},
				{
					TenChucNang: "Tương đương học phần",
					LienKet: "/student/CourseEquivalency",
					Icon: HiCollection,
				},
			],
		},
		{
			TenChucNang: "Chức năng trực tuyến",
			ThuTu: 3,
			childMenu: [
				{
					TenChucNang: "AI Chatbot",
					LienKet: "/student/BotChat",
					Icon: MdSmartToy,
				},
				{
					TenChucNang: "Đăng ký học phần",
					LienKet: "",
					Icon: HiPencilAlt,
					specialAction: () => {
						setIsRegistrationMode(true);
						navigate("/student/RegistScheduleUnit");
					},
				},
				{
					TenChucNang: "Xét tốt nghiệp",
					LienKet: "/student/GraduationConsideration",
					Icon: HiAcademicCap,
				},
				{
					TenChucNang: "Ý kiến thảo luận",
					LienKet: "/student/DiscussionOpinion",
					Icon: HiChat,
				},
				{
					TenChucNang: "Đánh giá điểm rèn luyện",
					LienKet: "/student/AssessmentOfConductScore",
					Icon: HiChartBar,
				},
				{
					TenChucNang: "Hoạt động cộng đồng",
					LienKet: "/student/CommunityService",
					Icon: HiHeart,
				},
				{
					TenChucNang: "Nộp chứng chỉ",
					LienKet: "/student/SubmitCertificate",
					Icon: HiCollection,
				},
				{
					TenChucNang: "Học bổng",
					LienKet: "/student/Scholarship",
					Icon: HiGift,
				},
			],
		},
	];

	const handleNavigation = (path, specialAction) => {
		if (specialAction) {
			specialAction();
			return;
		}

		if (path.startsWith("http")) {
			window.open(path, "_blank");
			onClose();
			return;
		}

		if (path && path !== selectedPath) {
			setSelectedPath(path);
			navigate(path);
			onClose();
		}
	};

	const handleLogoutClick = () => {
		onLogout();
	};

	const handleBackToNormalSidebar = () => {
		setIsRegistrationMode(false);
		navigate("/");
	};

	const renderMenuItem = (item) => {
		return (
			<div key={item.ThuTu} className={cx("menu-item")}>
				<div className={cx("menu-header")} style={{opacity: 0.8}}>
					<span>{item.TenChucNang}</span>
				</div>
				{item.childMenu?.length > 0 && (
					<div className={cx("submenu")}>
						{item.childMenu.map((child, childIndex) => {
							const ChildIcon = child.Icon;
							const isSelected = child.LienKet === selectedPath;
							return (
								<div
									key={childIndex}
									className={cx("submenu-item", {active: isSelected})}
									onClick={() => handleNavigation(child.LienKet, child.specialAction)}
								>
									{ChildIcon && <ChildIcon className={cx("icon")} />}
									<span>{child.TenChucNang}</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className={cx("sidebar", {active: isOpen})}>
			<div className={cx("header")}>
				<img
					src={assets.image_logo}
					alt='VHU Logo'
					className={cx("logo")}
					onClick={() => handleNavigation("/home")}
				/>
				<div className={cx("title-container")}>
					<h1 className={cx("title")} onClick={() => handleNavigation("/home")}>
						Trường Đại Học Văn Hiến
					</h1>
					<h4 className={cx("sub-title")}>Cổng thông tin sinh viên</h4>
					<h4
						className={cx("sub-title-2")}
						onClick={() => handleNavigation("https://www.facebook.com/leemjnnkdzuy/")}
					>
						Remake by LeeMjnnkDzuy
					</h4>
				</div>
			</div>

			{isRegistrationMode && (
				<div className={cx("back-navigation")}>
					<button className={cx("back-button")} onClick={handleBackToNormalSidebar}>
						<HiArrowLeft className={cx("back-icon")} />
						<span>Trở về trang chính</span>
					</button>
				</div>
			)}

			<div className={cx("menu-container")}>
				{isRegistrationMode
					? registrationMenuData.map((item, index) => renderMenuItem(item, index))
					: menuData.map((item, index) => renderMenuItem(item, index))}
			</div>

			<div className={cx("footer")}>
				<div className={cx("theme-container")}>
					<span className={cx("theme-text")}>Giao diện</span>
					<Toggle />
				</div>
				<button className={cx("logout-button")} onClick={handleLogoutClick}>
					<HiLogout className={cx("logout-icon")} />
					<span>Đăng xuất</span>
				</button>
			</div>
		</div>
	);
}
export default Sidebar;
