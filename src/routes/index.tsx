import { RootRoute, Route } from "@tanstack/react-router";

import App from "../App";
import { EmailList } from "../components/email-list";

export const rootRoute = new RootRoute({
	component: App,
});

export const indexRoute = new Route({
	component: EmailList,
	getParentRoute: () => rootRoute,
	path: "/",
});
