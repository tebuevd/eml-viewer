import { QueryClient } from "@tanstack/react-query";
import { Route, rootRouteWithContext } from "@tanstack/react-router";
import React from "react";

import App from "../App";
import { LoadingScreen } from "../components/LoadingScreen";
import { EmailList } from "../components/email-list";

type RouterContext = {
	queryClient: QueryClient;
};

export const rootRoute = rootRouteWithContext<RouterContext>()({
	component: App,
});

export const indexRoute = new Route({
	component: () => {
		return (
			<React.Suspense fallback={<LoadingScreen />}>
				<EmailList />
			</React.Suspense>
		);
	},
	getParentRoute: () => rootRoute,
	path: "/",
});
