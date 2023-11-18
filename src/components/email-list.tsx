import { useFiles } from "../hooks/useFiles";
import { EmailItemRow } from "./email-item-row";

export function EmailList() {
	const { files, loading } = useFiles();

	if (loading) {
		return null;
	}

	return (
		<section className="z-10 row-span-full overflow-scroll pt-20 shadow-[0_0_30px_0] shadow-black/10">
			{files.map((name, ix) => (
				<EmailItemRow from={"Favour Nerrise"} key={ix} subject={name} />
			))}
		</section>
	);
}
