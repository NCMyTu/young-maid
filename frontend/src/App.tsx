import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider, redirect } from "react-router";
import SignUpPage from "./page/SignUp/SignUp.tsx";
import SignInPage from "./page/SignIn/SignIn.tsx";
import DiamondBadge from "./component/CurrencyBadge/DiamonBadge.tsx";

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
			<div>This is the main page</div>
			<DiamondBadge
				amount={222222222}
			/>
			<Outlet />
		</>
	);
}

function App(): React.JSX.Element {
	return <RouterProvider router={router} />;
}

export default App;