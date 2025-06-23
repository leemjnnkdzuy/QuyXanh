import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";
import GlobalStyles from "./GlobalStyles";
import {ThemeProvider} from "./utils/themeContext";
import {AuthProvider} from "./utils/authContext";
import {LanguagesProvider} from "./utils/languagesContext";
import {publicRoutes} from "./routes";

const routerOptions = {
	future: {
		v7_startTransition: true,
		v7_relativeSplatPath: true,
	},
};

function App() {
	return (
		<I18nextProvider i18n={i18n}>
			<Router future={routerOptions.future}>
				<ThemeProvider>
					<AuthProvider>
						<LanguagesProvider>
							<GlobalStyles>
								<div className='App'>
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
								</div>
							</GlobalStyles>
						</LanguagesProvider>
					</AuthProvider>
				</ThemeProvider>
			</Router>
		</I18nextProvider>
	);
}

export default App;
