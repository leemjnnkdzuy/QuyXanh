// Layouts
import NoSidebarLayout from "../layouts/NoSidebarLayout";

// Pages
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/FogotPassword";
import EmailVerification from "../pages/EmailVerification";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";

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
		path: "/verify-email",
		component: EmailVerification,
		layout: NoSidebarLayout,
	},
	{
		path: "/reset-password",
		component: ResetPassword,
		layout: NoSidebarLayout,
	},
];

const privateRoutes = [
	{
		path: "/change-password",
		component: ChangePassword,
		layout: NoSidebarLayout,
	},
];

export {publicRoutes, privateRoutes};
