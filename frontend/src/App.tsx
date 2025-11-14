import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider, redirect } from "react-router";
import SignUpPage from "./component/SignUpPage/SignUpPage.tsx";
import SignInPage from "./component/SignInPage/SignInPage.tsx";

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

function MainPage() {
	return (
		<>
		<div>This is the main page</div>
		<Outlet />
		</>
	);
}

function App() {
	return <RouterProvider router={router} />;
}

export default App;