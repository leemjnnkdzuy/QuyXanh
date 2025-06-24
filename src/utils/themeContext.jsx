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
		const systemDarkMode = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		const initialDarkMode =
			savedTheme === "dark" || (!savedTheme && systemDarkMode);

		if (initialDarkMode) {
			document.documentElement.setAttribute("data-theme", "dark");
		} else {
			document.documentElement.setAttribute("data-theme", "light");
		}

		return initialDarkMode;
	});
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.setAttribute("data-theme", "dark");
			setThemeStorage("dark");
		} else {
			document.documentElement.setAttribute("data-theme", "light");
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
