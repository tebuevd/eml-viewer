import { useEffect, useState } from "react";

import type { EmailRow } from "../types/email";

import { instance as sqlite } from "../workers/sqlite";
import { EmailItemRow } from "./email-item-row";

export function EmailList() {
	const [emails, setEmails] = useState<EmailRow[]>([]);

	useEffect(() => {
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
		<main className="z-10 row-span-full flex flex-col shadow-[0_0_30px_0] shadow-black/10">
			<section className="h-20"></section>
			<section className="no-scrollbar overflow-scroll">
				<ul>
					{emails.map((email, ix) => (
						<EmailItemRow
							date={email.date}
							from={email.from_name ?? email.from_address}
							idx={ix}
							key={email.id}
							subject={email.subject ?? "(no subject)"}
						/>
					))}
				</ul>
			</section>
			<section className="h-0" />
		</main>
	);
}
