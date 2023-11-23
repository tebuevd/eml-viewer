import { Route } from "@tanstack/react-router";

import { rootRoute } from "..";

export const emailsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "emails",
});
