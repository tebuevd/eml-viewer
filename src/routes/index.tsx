import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
				<div className="fixed right-0 top-0" id="devtools-menu">
					<TanStackRouterDevtools
						position="top-right"
						toggleButtonProps={{
							style: {
								translate: "-60px 10px",
							},
						}}
					/>
					<ReactQueryDevtools
						buttonPosition="top-right"
						initialIsOpen={false}
					/>
				</div>
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
