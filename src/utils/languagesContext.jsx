import React, {createContext, useState, useContext, useEffect} from "react";
import {useTranslation} from "react-i18next";

const LanguagesContext = createContext();

const LANGUAGE_STORAGE_KEY = "language";

const setLanguageStorage = (value) => {
	try {
		localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
	} catch (error) {
		console.warn("Failed to save language to localStorage:", error);
	}
};

const getLanguageStorage = () => {
	try {
		return localStorage.getItem(LANGUAGE_STORAGE_KEY);
	} catch (error) {
		console.warn("Failed to get language from localStorage:", error);
		return null;
	}
};

export function LanguagesProvider({children}) {
	const {i18n} = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState(() => {
		const savedLanguage = getLanguageStorage();
		return savedLanguage || "vi";
	});

	useEffect(() => {
		i18n.changeLanguage(currentLanguage);
		setLanguageStorage(currentLanguage);
	}, [currentLanguage, i18n]);

	const changeLanguage = (language) => {
		setCurrentLanguage(language);
	};

	const toggleLanguage = () => {
		const newLanguage = currentLanguage === "vi" ? "en" : "vi";
		setCurrentLanguage(newLanguage);
	};

	return (
		<LanguagesContext.Provider
			value={{
				currentLanguage,
				changeLanguage,
				toggleLanguage,
				isVietnamese: currentLanguage === "vi",
				isEnglish: currentLanguage === "en",
			}}
		>
			{children}
		</LanguagesContext.Provider>
	);
}

export const useLanguages = () => useContext(LanguagesContext);
