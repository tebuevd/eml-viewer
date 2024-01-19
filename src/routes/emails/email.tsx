import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Route } from "@tanstack/react-router";

import { emailsRoute } from ".";
import { EmailContent } from "../../components/email-content";
import { sqliteWorker } from "../../workers/sqlite";

const emailQuery = (emailId: string) =>
	queryOptions({
		enabled: !!emailId,
		queryFn: () => sqliteWorker.getEmailById(emailId).then(([email]) => email),
		queryKey: ["emails", emailId],
	});

export const emailRoute = new Route({
	component: function EmailRoute() {
		const { emailId } = emailRoute.useParams();
		const queryResult = useSuspenseQuery(emailQuery(emailId));
		const emailData = queryResult.data;

		return (
			<EmailContent emailHtml={emailData.html ?? ""} emailId={emailData.id} />
		);
	},
	getParentRoute: () => emailsRoute,
	loader({ context: { queryClient }, params: { emailId } }) {
		return queryClient.ensureQueryData(emailQuery(emailId));
	},
	path: "$emailId",
});
