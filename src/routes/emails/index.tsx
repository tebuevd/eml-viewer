import { Outlet, Route } from "@tanstack/react-router";
import React from "react";

import { layoutRoute } from "..";
import { LoadingScreen } from "../../components/LoadingScreen";
import { EmailList } from "../../components/email-list";

export const emailsIndexRoute = new Route({
	component: function EmailsIndexRoute() {
		return (
			<React.Suspense fallback={<LoadingScreen />}>
				<EmailList />
			</React.Suspense>
		);
	},
	getParentRoute: () => emailsRoute,
	path: "/",
});

export const emailsRoute = new Route({
	component: function EmailsRoute() {
		return <Outlet />;
	},
	getParentRoute: () => layoutRoute,
	path: "emails",
});
