import { useSuspenseQuery } from "@tanstack/react-query";
import { Route } from "@tanstack/react-router";

import { emailsRoute } from ".";
import { EmailContent } from "../../components/email-content";
import { sqliteWorker } from "../../workers/sqlite";

export const emailRoute = new Route({
	beforeLoad(opts) {
		const { emailId } = opts.params;
		const queryOptions = {
			enabled: !!emailId,
			queryFn: () =>
				sqliteWorker.getEmailById(emailId).then(([email]) => email),
			queryKey: ["emails", emailId],
		};

		return { queryOptions };
	},
	component: function EmailRoute({ useRouteContext }) {
		const { queryOptions } = useRouteContext();
		const emailQuery = useSuspenseQuery(queryOptions);
		const emailData = emailQuery.data;

		return (
			<EmailContent emailHtml={emailData.html ?? ""} emailId={emailData.id} />
		);
	},
	getParentRoute: () => emailsRoute,
	async load(opts) {
		await opts.context.queryClient.ensureQueryData(opts.context.queryOptions);
	},
	path: "$emailId",
});
