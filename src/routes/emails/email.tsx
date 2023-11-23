import { Route } from "@tanstack/react-router";

import { emailsRoute } from ".";
import { EmailContent } from "../../components/email-content";

export const emailRoute = new Route({
	component: function EmailRoute({ useParams }) {
		const { emailId } = useParams();
		return <EmailContent emailId={emailId} />;
	},
	getParentRoute: () => emailsRoute,
	path: "$emailId",
});
