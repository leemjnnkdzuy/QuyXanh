// Layouts
import NoSidebarLayout from "../layouts/NoSidebarLayout";

// Pages
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/FogotPassword";
import Features from "../pages/Features";

const publicRoutes = [
	{
		path: "*",
		component: NotFound,
		layout: NoSidebarLayout,
	},
	{
		path: "/",
		component: Home,
		layout: NoSidebarLayout,
	},
	{
		path: "/login",
		component: Login,
		layout: NoSidebarLayout,
	},
	{
		path: "/register",
		component: Register,
		layout: NoSidebarLayout,
	},
	{
		path: "/forgot-password",
		component: ForgotPassword,
		layout: NoSidebarLayout,
	},
	{
		path: "/features",
		component: Features,
		layout: NoSidebarLayout,
	},
];

const privateRoutes = [];

export {publicRoutes, privateRoutes};
