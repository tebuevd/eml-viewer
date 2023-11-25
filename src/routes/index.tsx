import { QueryClient } from "@tanstack/react-query";
import {
	Outlet,
	Route,
	ScrollRestoration,
	rootRouteWithContext,
	useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import App from "../App";
import { DbProvider } from "../providers/db-provider";

type RouterContext = {
	queryClient: QueryClient;
};

export const rootRoute = rootRouteWithContext<RouterContext>()({
	component: function RootRoute() {
		return (
			<>
				<Outlet />
				<TanStackRouterDevtools position="top-right" />
				<ScrollRestoration />
			</>
		);
	},
});

export const providersRoute = new Route({
	component: function ProvidersRoute() {
		return (
			<DbProvider>
				<Outlet />
			</DbProvider>
		);
	},
	getParentRoute: () => rootRoute,
	id: "providers",
});

export const layoutRoute = new Route({
	component: function LayoutRoute() {
		return <App />;
	},
	getParentRoute: () => providersRoute,
	id: "layout",
});

export const indexRoute = new Route({
	component: function IndexRoute() {
		const navigate = useNavigate();
		navigate({ to: "/emails/" }).catch(console.error);

		return null;
	},
	getParentRoute: () => layoutRoute,
	path: "/",
});
