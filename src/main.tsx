import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { emailRoute } from "./routes/emails/email.tsx";
import { emailsRoute } from "./routes/emails/index.tsx";
import { indexRoute, rootRoute } from "./routes/index.tsx";

const queryClient = new QueryClient();

const routeTree = rootRoute.addChildren([
	indexRoute.addChildren([emailsRoute.addChildren([emailRoute])]),
]);
const router = new Router({ context: { queryClient }, routeTree });

declare module "@tanstack/react-router" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		router: typeof router;
	}
}

const root = document.getElementById("root");
if (root && !root.innerHTML) {
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</React.StrictMode>,
	);
}
