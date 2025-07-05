import {useState, useEffect} from "react";
import {getHomeData} from "./request";

export const useHomeData = () => {
	const [homeData, setHomeData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isBackup, setIsBackup] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await getHomeData();

				setHomeData(response.data);
				setIsBackup(response.isBackup || false);
			} catch (error) {
				console.error("Error fetching home data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return {
		homeData,
		loading,
		isBackup,
	};
};
