import React, {createContext, useState, useContext, useEffect} from "react";

const ThemeContext = createContext();

const THEME_STORAGE_KEY = "theme";

const setThemeStorage = (value) => {
	try {
		localStorage.setItem(THEME_STORAGE_KEY, value);
	} catch (error) {
		console.warn("Failed to save theme to localStorage:", error);
	}
};

const getThemeStorage = () => {
	try {
		return localStorage.getItem(THEME_STORAGE_KEY);
	} catch (error) {
		console.warn("Failed to get theme from localStorage:", error);
		return null;
	}
};

export function ThemeProvider({children}) {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedTheme = getThemeStorage();
		return savedTheme === "dark";
	});

	useEffect(() => {
		if (isDarkMode) {
			document.body.setAttribute("data-theme", "dark");
			setThemeStorage("dark");
		} else {
			document.body.setAttribute("data-theme", "light");
			setThemeStorage("light");
		}
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	return (
		<ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => useContext(ThemeContext);
