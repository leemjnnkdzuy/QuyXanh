import React, {createContext, useContext, useState, useEffect} from "react";
import {getHomeData} from "./request";
import {homeDataBackup} from "./homeDataBackup";

const HomeDataContext = createContext();

export const useHomeData = () => {
	const context = useContext(HomeDataContext);
	if (!context) {
		throw new Error("useHomeData must be used within a HomeDataProvider");
	}
	return context;
};

export const HomeDataProvider = ({children}) => {
	const [homeData, setHomeData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isUsingBackup, setIsUsingBackup] = useState(false);

	const fetchHomeData = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await getHomeData();

			if (response.success && response.data) {
				setHomeData(response.data);
				setIsUsingBackup(false);
			} else {
				throw new Error(response.message || "Failed to fetch home data");
			}
		} catch (err) {
			setHomeData(homeDataBackup);
			setIsUsingBackup(true);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHomeData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const value = {
		homeData,
		loading,
		error,
		isUsingBackup,
		refetch: fetchHomeData,
	};

	return (
		<HomeDataContext.Provider value={value}>{children}</HomeDataContext.Provider>
	);
};
