type EmailItemRowProps = {
	from: string;
	subject: string;
};

export function EmailItemRow({ from, subject }: EmailItemRowProps) {
	return (
		<div className="font-sh-adelle hover:bg-sh-highlight h-9 cursor-pointer overflow-hidden py-[10px] pl-14 pr-8 text-xs">
			<div className="flex h-4">
				<div className="max-w-[22.5%] flex-1 basis-[22.5%] text-xs font-bold text-black/80 antialiased">
					{from}
				</div>
				<div className="flex-1">{subject}</div>
			</div>
		</div>
	);
}
