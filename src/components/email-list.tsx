import { useSuspenseQuery } from "@tanstack/react-query";

import { useKeys } from "../hooks/useKeys";
import { instance as sqlite } from "../workers/sqlite";
import { EmailItemRow } from "./email-item-row";

export function EmailList() {
	useKeys();

	const { data } = useSuspenseQuery({
		queryFn: () => sqlite.getAllEmails(),
		queryKey: ["emails"],
	});

	return (
		<article className="flex h-full flex-col">
			<section className="h-20 flex-none"></section>
			<section className="flex-1 overflow-scroll scrollbar-hide">
				<ul>
					{data.map((email, ix) => (
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
