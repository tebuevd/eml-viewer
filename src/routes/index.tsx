import { QueryClient } from "@tanstack/react-query";
import { Route, rootRouteWithContext } from "@tanstack/react-router";

import App from "../App";
import { EmailList } from "../components/email-list";

type RouterContext = {
	queryClient: QueryClient;
};

export const rootRoute = rootRouteWithContext<RouterContext>()({
	component: App,
});

export const indexRoute = new Route({
	component: EmailList,
	getParentRoute: () => rootRoute,
	path: "/",
});
