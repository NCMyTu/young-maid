import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider, redirect } from "react-router";
import SignUpPage from "@/page/SignUp/SignUp";
import SignInPage from "@/page/SignIn/SignIn";
import SecondaryTopBar from "@/component/SecondaryTopBar/SecondaryTopBar";
import MainTopBar from "@/component/MainTopBar/MainTopBar";

const requireAuth = async () => {
	try {
		const res = await fetch("http://localhost:19722/api/users/auth/verify", {
			method: "GET",
			credentials: "include"
		});

		if (!res.ok)
			return redirect("/signin");
	} catch {
		throw Error("Something went wrong in requireAuth");
	}
};

const router = createBrowserRouter([
	{
		path: "/",
		Component: MainPage,
		loader: requireAuth,
		errorElement: <h1>This is an error element</h1>
	},
	{
		path: "/signin",
		Component: SignInPage
	},
	{
		path: "/signup",
		Component: SignUpPage
	}
]);

function MainPage(): React.JSX.Element {
	return (
		<>
			<MainTopBar />
			<div>This is the main page</div>
			<SecondaryTopBar />
			<Outlet />
		</>
	);
}

function App(): React.JSX.Element {
	return <RouterProvider router={router} />;
}

export default App;