import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";
import GlobalStyles from "./GlobalStyles";
import {ThemeProvider} from "./utils/themeContext";
import {AuthProvider, useAuth} from "./utils/authContext";
import {LanguagesProvider} from "./utils/languagesContext";
import {publicRoutes} from "./routes";
import AppLoader from "./components/AppLoader";
import {healthCheck} from "./utils/request";

const routerOptions = {
	future: {
		v7_startTransition: true,
		v7_relativeSplatPath: true,
	},
};

function AppContent() {
	const {loading: authLoading} = useAuth();
	const [appLoading, setAppLoading] = useState(true);

	useEffect(() => {
		const initializeApp = async () => {
			try {
				await healthCheck();
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (error) {
				console.log("Health check failed, continuing anyway:", error);
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} finally {
				setAppLoading(false);
			}
		};

		initializeApp();
	}, []);

	if (appLoading || authLoading) {
		return <AppLoader />;
	}

	return (
		<GlobalStyles>
			<Routes>
				{publicRoutes.map((route, index) => {
					const Page = route.component;
					const Layout = route.layout;

					return (
						<Route
							key={index}
							path={route.path}
							element={
								<Layout>
									<Page />
								</Layout>
							}
						/>
					);
				})}
			</Routes>
		</GlobalStyles>
	);
}

function App() {
	return (
		<I18nextProvider i18n={i18n}>
			<Router future={routerOptions.future}>
				<ThemeProvider>
					<AuthProvider>
						<LanguagesProvider>
							<AppContent />
						</LanguagesProvider>
					</AuthProvider>
				</ThemeProvider>
			</Router>
		</I18nextProvider>
	);
}

export default App;
