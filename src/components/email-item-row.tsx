import { format } from "date-fns";

type EmailItemRowProps = {
	date: null | string;
	from: string;
	subject: string;
	tabindex: number;
};

export function EmailItemRow({
	date,
	from,
	subject,
	tabindex,
}: EmailItemRowProps) {
	const dateString = date ? format(new Date(date), "MMM dd").toUpperCase() : "";
	return (
		<li
			className="group relative h-9 cursor-pointer overflow-hidden py-2.5 pl-14 pr-8 font-sh-adelle text-xs antialiased hover:bg-sh-highlight focus:bg-sh-highlight focus:outline-none"
			tabIndex={tabindex}
		>
			<span className="before:absolute before:bottom-0 before:left-0 before:top-0 before:hidden before:w-[3px] before:bg-sh-highlightbar group-hover:before:block group-focus:before:block" />

			<div className="flex h-4 gap-4 align-baseline">
				<div className="max-w-[22.5%] flex-1 basis-[22.5%] overflow-hidden whitespace-nowrap text-xs font-bold text-black/80">
					{from}
				</div>
				<div className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
					{subject}
				</div>
				<div className="max-w-[20%] basis-1/12 whitespace-nowrap text-right">
					{dateString}
				</div>
			</div>
		</li>
	);
}
