import { useFiles } from "../hooks/useFiles";
import { EmailItemRow } from "./email-item-row";

export function EmailList() {
	const { files, loading } = useFiles();

	if (loading) {
		return null;
	}

	return (
		<main className="z-10 row-span-full flex flex-col shadow-[0_0_30px_0] shadow-black/10">
			<section className="h-20"></section>
			<section className="no-scrollbar overflow-scroll">
				<ul>
					{files.map((name, ix) => (
						<EmailItemRow
							from={"Favour Nerrise"}
							idx={ix}
							key={ix}
							subject={name}
						/>
					))}
				</ul>
			</section>
			<section className="h-0" />
		</main>
	);
}
