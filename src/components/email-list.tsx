import { useEffect, useState } from "react";

import type { EmailRow } from "../types/email";

import { useKeys } from "../hooks/useKeys";
import { instance as sqlite } from "../workers/sqlite";
import { EmailItemRow } from "./email-item-row";

export function EmailList() {
	const [emails, setEmails] = useState<EmailRow[]>([]);

	useKeys();

	useEffect(() => {
		console.log("running query");
		sqlite
			.getAllEmails()
			.then((emails) => {
				setEmails(emails);
			})
			.catch((e) => {
				console.error(e);
			});
	}, []);

	return (
		<article className="flex h-full flex-col">
			<section className="h-20 flex-none"></section>
			<section className="no-scrollbar flex-1 overflow-scroll">
				<ul>
					{emails.map((email, ix) => (
						<EmailItemRow
							date={email.date}
							emailId={email.id}
							from={email.from_name ?? email.from_address}
							key={email.id}
							subject={email.subject ?? "(no subject)"}
							tabindex={ix + 1}
						/>
					))}
				</ul>
			</section>
			<section className="h-4 flex-none" />
		</article>
	);
}
