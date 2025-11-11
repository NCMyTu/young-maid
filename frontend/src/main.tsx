import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpPage from "./component/SignUpPage/SignUpPage.tsx";
import SignInPage from "./component/SignInPage/SignInPage.tsx";
import { redirect } from "react-router";

const requireAuth = async () => {
	try {
		const res = await fetch("http://localhost:19722/api/users/auth/verify", {
			method: "GET",
			credentials: "include"
		});

		if (!res.ok)
			return redirect("/signin");

	} catch {
		throw Error("Something wrong in requireAuth");
	}
};

const router = createBrowserRouter([
	{
		element: <App />,
		children: [
			{
				path: "/",
				element: <div> Main page</div> ,
				loader: requireAuth,
			},
			{ path: "/signin", element: <SignInPage /> },
			{ path: "/signup", element: <SignUpPage /> },
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);