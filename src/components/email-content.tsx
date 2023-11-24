import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import IframeRenderer from "./iframe-renderer";

type EmailContentProps = {
	emailHtml: string;
	emailId: string;
};

export function EmailContent({ emailHtml, emailId }: EmailContentProps) {
	const link = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		function EmailContentKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				e.preventDefault();

				link.current?.click();
			}
		}
		document.addEventListener("keydown", EmailContentKeyDown);

		return function EmailContentCleanup() {
			document.removeEventListener("keydown", EmailContentKeyDown);
		};
	}, []);

	return (
		<div
			className="isolate flex h-full"
			onScroll={(e) => {
				e.stopPropagation();
				console.log("Scrolling on higher div", e);
			}}
		>
			<Link className="hidden" id="back" ref={link} to="/" />
			<aside className="w-40 bg-gradient-to-l from-sh-sidebar-start from-0% to-sh-sidebar-end to-40%" />

			<div
				className="z-0 flex flex-1 justify-center pb-4 shadow-2xl shadow-black/10"
				onScroll={(e) => {
					e.stopPropagation();
					console.log("Scrolling on div", e);
				}}
			>
				<article
					className="relative mx-4 mt-20 min-w-[460px] max-w-3xl flex-1 overflow-hidden rounded shadow-2xl shadow-black/50"
					onScroll={(e) => {
						e.stopPropagation();
						console.log("Scrolling on article", e);
					}}
				>
					<div className="absolute bottom-0 left-0 top-0 z-10 w-[3px] bg-sh-highlightbar" />
					<IframeRenderer key={emailId} srcDoc={emailHtml} />
				</article>
			</div>
		</div>
	);
}
