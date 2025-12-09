import "./App.css";
import { createBrowserRouter, RouterProvider, redirect, useRouteError, isRouteErrorResponse } from "react-router";
import SignUpPage from "@/page/SignUpPage/SignUpPage";
import SignInPage from "@/page/SignInPage/SignInPage";
import MainPage from "@/page/MainPage/MainPage";

// TODO:
// cancel pending request when there's a new request
// TODO:
// destroy other modals when a modal is showing

const requireAuth = async () => {
	try {
		const res = await fetch("http://localhost:19722/api/users/auth/verify", {
			method: "GET",
			credentials: "include"
		});

		const resJson = await res.json();
		console.log(resJson);

		if (!res.ok)
			return redirect("/signin");
	} catch {
		throw Error("Something went wrong in requireAuth");
	}
};

function RootErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error))
		return (
			<div>
				<h1>{error.status} - {error.statusText}</h1>
				<p>{error.data?.message}</p>
			</div>
		);

	return (
		<div>
			<h1>Something went wrong</h1>
			<pre>{String(error)}</pre>
		</div>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		Component: MainPage,
		loader: requireAuth,
		errorElement: <RootErrorBoundary />
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

function App(): React.JSX.Element {
	return <RouterProvider router={router} />;
}

export default App;