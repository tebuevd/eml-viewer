type EmailItemRowProps = {
	from: string;
	subject: string;
};

export function EmailItemRow({ from, subject }: EmailItemRowProps) {
	return (
		<li className="font-sh-adelle hover:bg-sh-highlight group relative h-9 cursor-pointer overflow-hidden py-2.5 pl-14 pr-8 text-xs">
			<span className="before:bg-sh-highlightbar before:absolute before:bottom-0 before:left-0 before:top-0 before:hidden before:w-[3px] group-hover:before:block" />

			<div className="flex h-4">
				<div className="max-w-[22.5%] flex-1 basis-[22.5%] text-xs font-bold text-black/80 antialiased">
					{from}
				</div>
				<div className="flex-1">{subject}</div>
			</div>
		</li>
	);
}
