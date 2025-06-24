import React, {useState, useEffect, useCallback} from "react";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import classNames from "classnames/bind";
import style from "./VietnamMap.module.scss";
import Loading from "../Loading";
import {
	MdLocationOn,
	MdLocalFireDepartment,
	MdBolt,
	MdShowChart,
	MdCampaign,
} from "react-icons/md";

const cx = classNames.bind(style);

const provincesData = {
	"vn-3655": {name: "Hà Nội", campaigns: 245},
	"vn-sg": {name: "TP. Hồ Chí Minh", campaigns: 387},
	"vn-hp": {name: "Hải Phòng", campaigns: 89},
	"vn-dn": {name: "Đà Nẵng", campaigns: 156},
	"vn-hg": {name: "Hà Giang", campaigns: 23},
	"vn-cb": {name: "Cao Bằng", campaigns: 18},
	"vn-lc": {name: "Lai Châu", campaigns: 15},
	"vn-lo": {name: "Lào Cai", campaigns: 34},
	"vn-tq": {name: "Tuyên Quang", campaigns: 21},
	"vn-ls": {name: "Lạng Sơn", campaigns: 28},
	"vn-qn": {name: "Quảng Ninh", campaigns: 67},
	"vn-bg": {name: "Bắc Giang", campaigns: 43},
	"vn-pt": {name: "Phú Thọ", campaigns: 52},
	"vn-vp": {name: "Vĩnh Phúc", campaigns: 38},
	"vn-bn": {name: "Bắc Ninh", campaigns: 56},
	"vn-hd": {name: "Hải Dương", campaigns: 49},
	"vn-hy": {name: "Hưng Yên", campaigns: 35},
	"vn-tb": {name: "Thái Bình", campaigns: 41},
	"vn-hn": {name: "Hà Nam", campaigns: 32},
	"vn-nd": {name: "Nam Định", campaigns: 46},
	"vn-nb": {name: "Ninh Bình", campaigns: 29},
	"vn-th": {name: "Thanh Hóa", campaigns: 78},
	"vn-na": {name: "Nghệ An", campaigns: 85},
	"vn-ht": {name: "Hà Tĩnh", campaigns: 54},
	"vn-qb": {name: "Quảng Bình", campaigns: 38},
	"vn-qt": {name: "Quảng Trị", campaigns: 31},
	"vn-hue": {name: "Thừa Thiên Huế", campaigns: 63},
	"vn-qm": {name: "Quảng Nam", campaigns: 72},
	"vn-qg": {name: "Quảng Ngãi", campaigns: 47},
	"vn-bd": {name: "Bình Định", campaigns: 58},
	"vn-py": {name: "Phú Yên", campaigns: 36},
	"vn-kh": {name: "Khánh Hòa", campaigns: 94},
	"vn-nt": {name: "Ninh Thuận", campaigns: 25},
	"vn-bt": {name: "Bình Thuận", campaigns: 42},
	"vn-kt": {name: "Kon Tum", campaigns: 19},
	"vn-gl": {name: "Gia Lai", campaigns: 33},
	"vn-dl": {name: "Đắk Lắk", campaigns: 51},
	"vn-dn-1": {name: "Đắk Nông", campaigns: 22},
	"vn-ld": {name: "Lâm Đồng", campaigns: 48},
	"vn-bp": {name: "Bình Phước", campaigns: 37},
	"vn-tn": {name: "Tây Ninh", campaigns: 29},
	"vn-bu": {name: "Bình Dương", campaigns: 147},
	"vn-dn-2": {name: "Đồng Nai", campaigns: 93},
	"vn-vt": {name: "Bà Rịa - Vũng Tàu", campaigns: 76},
	"vn-la": {name: "Long An", campaigns: 54},
	"vn-tg": {name: "Tiền Giang", campaigns: 61},
	"vn-be": {name: "Bến Tre", campaigns: 39},
	"vn-tv": {name: "Trà Vinh", campaigns: 32},
	"vn-vl": {name: "Vĩnh Long", campaigns: 41},
	"vn-dt": {name: "Đồng Tháp", campaigns: 48},
	"vn-ag": {name: "An Giang", campaigns: 56},
	"vn-kg": {name: "Kiên Giang", campaigns: 67},
	"vn-ct": {name: "Cần Thơ", campaigns: 89},
	"vn-hg-1": {name: "Hậu Giang", campaigns: 28},
	"vn-st": {name: "Sóc Trăng", campaigns: 43},
	"vn-bl": {name: "Bạc Liêu", campaigns: 31},
	"vn-cm": {name: "Cà Mau", campaigns: 35},
	"vn-db": {name: "Điện Biên", campaigns: 16},
	"vn-hb": {name: "Hòa Bình", campaigns: 34},
	"vn-sl": {name: "Sơn La", campaigns: 21},
	"vn-yb": {name: "Yên Bái", campaigns: 27},
	"vn-300": {name: "Thái Nguyên", campaigns: 45},
};

const VietnamMap = ({onProvinceHover}) => {
	const [mapData, setMapData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch("https://code.highcharts.com/mapdata/countries/vn/vn-all.topo.json")
			.then((response) => response.json())
			.then((data) => {
				setMapData(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Error loading map data:", error);
				setIsLoading(false);
			});
	}, []);
	const handleProvinceHover = useCallback(
		(geo) => {
			const provinceKey = geo.properties["hc-key"];
			const provinceData = provincesData[provinceKey] || {
				name: geo.properties.name || geo.properties["name-vi"] || "Tỉnh không xác định",
				campaigns: Math.floor(Math.random() * 50) + 10,
			};

			if (onProvinceHover) {
				onProvinceHover(provinceData);
			}
		},
		[onProvinceHover]
	);

	const handleProvinceLeave = useCallback(() => {
		if (onProvinceHover) {
			onProvinceHover(null);
		}
	}, [onProvinceHover]);
	const getProvinceColor = useCallback((geo) => {
		const provinceKey = geo.properties["hc-key"];
		const data = provincesData[provinceKey];

		if (!data) return "#e2e8f0";

		if (data.campaigns > 150) return "var(--primary-color-1)";
		if (data.campaigns > 80) return "var(--primary-color-2)";
		if (data.campaigns > 40) return "#f59e0b";
		return "#94a3b8";
	}, []);
	const createTooltipContent = useCallback((provinceData) => {
		const activityLevel =
			provinceData.campaigns > 150
				? "high"
				: provinceData.campaigns > 80
				? "medium"
				: "low";
		const activityText =
			activityLevel === "high"
				? "Rất cao"
				: activityLevel === "medium"
				? "Trung bình"
				: "Thấp";
		const ActivityIcon =
			activityLevel === "high"
				? MdLocalFireDepartment
				: activityLevel === "medium"
				? MdBolt
				: MdShowChart;

		return (
			<div className={cx("modern-tooltip")}>
				<div className={cx("tooltip-background")}></div>
				<div className={cx("tooltip-content")}>
					<div className={cx("province-header")}>
						<div className={cx("province-icon")}>
							<MdLocationOn />
						</div>
						<div className={cx("province-info")}>
							<h3 className={cx("province-name")}>{provinceData.name}</h3>
							<span className={cx("province-type")}>Tỉnh/Thành phố</span>
						</div>
					</div>

					<div className={cx("stats-container")}>
						<div className={cx("stat-item", "primary-stat")}>
							<div className={cx("stat-icon")}>
								<MdCampaign />
							</div>
							<div className={cx("stat-content")}>
								<div className={cx("stat-number")}>{provinceData.campaigns}</div>
								<div className={cx("stat-label")}>Chiến dịch</div>
							</div>
						</div>
						<div className={cx("stat-item", "activity-stat")}>
							<div className={cx("stat-icon")}>
								<ActivityIcon />
							</div>
							<div className={cx("stat-content")}>
								<div className={cx("stat-value", activityLevel)}>{activityText}</div>
								<div className={cx("stat-label")}>Hoạt động</div>
							</div>
						</div>
					</div>

					<div className={cx("tooltip-footer")}>
						<div className={cx("ranking-info")}>
							<span className={cx("ranking-text")}>
								Top {Math.ceil((1 - provinceData.campaigns / 400) * 63)} trên 63 tỉnh
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}, []);
	if (isLoading) {
		return (
			<div className={cx("map-loading")}>
				<Loading size='80px' />
				<p>Đang tải bản đồ Việt Nam...</p>
			</div>
		);
	}

	if (!mapData) {
		return (
			<div className={cx("map-loading")}>
				<p>Không thể tải bản đồ. Vui lòng thử lại sau.</p>
			</div>
		);
	}

	return (
		<div className={cx("vietnam-map")}>
			<div className={cx("map-container")}>
				<div className={cx("map-wrapper")}>
					<ComposableMap
						data-tip=''
						projection='geoMercator'
						projectionConfig={{
							scale: 2800,
							center: [108, 16.5],
						}}
						width={800}
						height={900}
						className={cx("map-svg")}
					>
						{" "}
						<Geographies geography={mapData}>
							{({geographies}) =>
								geographies.map((geo) => {
									const provinceKey = geo.properties["hc-key"];
									const provinceData = provincesData[provinceKey] || {
										name: geo.properties.name || geo.properties["name-vi"] || "Tỉnh không xác định",
										campaigns: Math.floor(Math.random() * 50) + 10,
									};

									return (
										<Tippy
											key={geo.rsmKey}
											content={createTooltipContent(provinceData)}
											followCursor={true}
											delay={[100, 50]}
											duration={[200, 150]}
											animation='shift-away'
											theme='modern-vietnam-map'
											placement='top'
											arrow={false}
											interactive={false}
											hideOnClick={false}
											trigger='mouseenter'
											offset={[0, 12]}
											maxWidth={300}
											zIndex={9999}
										>
											<Geography
												geography={geo}
												onMouseEnter={() => handleProvinceHover(geo)}
												onMouseLeave={() => handleProvinceLeave()}
												style={{
													default: {
														fill: getProvinceColor(geo),
														stroke: "rgba(71, 85, 105, 0.3)",
														strokeWidth: 0.8,
														outline: "none",
														transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
													},
													hover: {
														fill: "var(--primary-color-1)",
														stroke: "var(--primary-color-2)",
														strokeWidth: 2,
														outline: "none",
														filter: "brightness(1.1) saturate(1.2)",
														cursor: "pointer",
														transform: "scale(1.002)",
													},
													pressed: {
														fill: "var(--primary-color-2)",
														stroke: "var(--primary-color-1)",
														strokeWidth: 2,
														outline: "none",
													},
												}}
											/>
										</Tippy>
									);
								})
							}
						</Geographies>
					</ComposableMap>{" "}
				</div>
			</div>
		</div>
	);
};

export default VietnamMap;
