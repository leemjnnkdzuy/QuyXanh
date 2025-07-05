import React, {useState, useEffect, useCallback} from "react";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import classNames from "classnames/bind";
import {useTranslation} from "react-i18next";
import style from "./VietnamMap.module.scss";
import Loading from "../Loading";
import ProvinceTooltip from "../ProvinceTooltip";
import {fetchVietnamMapData} from "../../utils/request";

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
	const {t} = useTranslation();
	const [mapData, setMapData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Internationalized islands data
	const getIslandsData = useCallback(
		() => ({
			"hoang-sa": {
				name: t("map.islands.hoangSa", "Quần đảo Hoàng Sa"),
				campaigns: 12,
				coordinates: [112.3, 17.5],
				type: "archipelago",
			},
			"truong-sa": {
				name: t("map.islands.truongSa", "Quần đảo Trường Sa"),
				campaigns: 8,
				coordinates: [114.2, 13],
				type: "archipelago",
			},
		}),
		[t]
	);
	useEffect(() => {
		const loadMapData = async () => {
			try {
				const response = await fetchVietnamMapData();
				if (response.success) {
					setMapData(response.data);
				} else {
					console.error("Error loading map data:", response.message);
				}
			} catch (error) {
				console.error("Error loading map data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadMapData();
	}, []);
	const handleProvinceHover = useCallback(
		(geo) => {
			const provinceKey = geo.properties["hc-key"];
			const provinceData = provincesData[provinceKey] || {
				name:
					geo.properties.name || geo.properties["name-vi"] || t("map.unknownProvince"),
				campaigns: Math.floor(Math.random() * 50) + 10,
			};

			if (onProvinceHover) {
				onProvinceHover(provinceData);
			}
		},
		[onProvinceHover, t]
	);

	const handleProvinceLeave = useCallback(() => {
		if (onProvinceHover) {
			onProvinceHover(null);
		}
	}, [onProvinceHover]);
	const getProvinceColor = useCallback((geo) => {
		const provinceKey = geo.properties["hc-key"];
		const data = provincesData[provinceKey];

		if (!data) return "rgba(226, 232, 240, 0.4)";

		if (data.campaigns > 150) return "rgba(59, 130, 246, 0.6)";
		if (data.campaigns > 80) return "rgba(16, 185, 129, 0.5)";
		if (data.campaigns > 40) return "rgba(245, 158, 11, 0.5)";
		return "rgba(148, 163, 184, 0.4)";
	}, []);
	const createTooltipContent = useCallback((provinceData) => {
		return <ProvinceTooltip provinceData={provinceData} />;
	}, []);
	if (isLoading) {
		return (
			<div className={cx("map-loading")}>
				<Loading size='80px' />
			</div>
		);
	}

	if (!mapData) {
		return (
			<div className={cx("map-loading")}>
				<p>{t("map.loadError")}</p>
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
						<Geographies geography={mapData}>
							{({geographies}) =>
								geographies.map((geo) => {
									const provinceKey = geo.properties["hc-key"];
									const provinceData = provincesData[provinceKey] || {
										name:
											geo.properties.name || geo.properties["name-vi"] || t("map.unknownProvince"),
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
														stroke: "rgba(255, 255, 255, 0.4)",
														strokeWidth: 0.8,
														outline: "none",
														transition: "all 0.2s ease",
													},
													hover: {
														fill: getProvinceColor(geo),
														stroke: "rgba(255, 255, 255, 0.7)",
														strokeWidth: 1,
														outline: "none",
														cursor: "pointer",
													},
													pressed: {
														fill: getProvinceColor(geo),
														stroke: "rgba(255, 255, 255, 0.8)",
														strokeWidth: 1,
														outline: "none",
													},
												}}
											/>
										</Tippy>
									);
								})
							}
						</Geographies>{" "}
						{Object.entries(getIslandsData()).map(([key, island]) => {
							const [lon, lat] = island.coordinates;
							const bounds = {
								minLon: 102.0,
								maxLon: 115.0,
								minLat: 8.0,
								maxLat: 24.0,
							};

							const mapWidth = 800;
							const mapHeight = 900;
							const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * mapWidth;
							const y =
								mapHeight -
								((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * mapHeight;

							const offsetX = key === "hoang-sa" ? -10 : -10;
							const offsetY = key === "hoang-sa" ? 10 : 20;

							return (
								<Tippy
									key={key}
									content={createTooltipContent(island)}
									followCursor={false}
									delay={[150, 100]}
									duration={[300, 200]}
									animation='fade'
									theme='modern-vietnam-map'
									placement='top'
									arrow={true}
									interactive={false}
									hideOnClick={false}
									trigger='mouseenter'
									offset={[0, 15]}
									maxWidth={280}
									zIndex={9999}
									appendTo={() => document.body}
								>
									<g
										className={cx("island-marker")}
										transform={`translate(${x + offsetX}, ${y + offsetY})`}
										onMouseEnter={() => onProvinceHover && onProvinceHover(island)}
										onMouseLeave={() => onProvinceHover && onProvinceHover(null)}
									>
										<circle
											cx='0'
											cy='0'
											r='25'
											fill='transparent'
											stroke='none'
											style={{pointerEvents: "all"}}
										/>
										<circle
											cx='0'
											cy='0'
											r='24'
											fill='rgba(255, 215, 0, 0.3)'
											stroke='rgba(255, 165, 0, 0.5)'
											strokeWidth='1.5'
											className={cx("island-background")}
										/>
										<path
											d='M0 -10l3 6L10 -2l-5 5L6 10L0 6L-6 10L-5 3l-5-5L-3 -2L0 -10z'
											fill='#FFD700'
											stroke='#FFA500'
											strokeWidth='1'
											className={cx("island-star")}
										/>
									</g>
								</Tippy>
							);
						})}
					</ComposableMap>
				</div>
			</div>
		</div>
	);
};

export default VietnamMap;
