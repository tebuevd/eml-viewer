import { QueryClientProvider } from "@tanstack/react-query";
import { Router, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { queryClient } from "./queryclient.ts";
import { emailRoute } from "./routes/emails/email.tsx";
import { emailsIndexRoute, emailsRoute } from "./routes/emails/index.tsx";
import {
	indexRoute,
	layoutRoute,
	providersRoute,
	rootRoute,
} from "./routes/index.tsx";

const routeTree = rootRoute.addChildren([
	providersRoute.addChildren([
		layoutRoute.addChildren([
			indexRoute,
			emailsRoute.addChildren([emailsIndexRoute, emailRoute]),
		]),
	]),
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
