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
		<div className="isolate flex h-full">
			<Link className="hidden" id="back" ref={link} to="/emails/" />
			<aside className="w-40 bg-gradient-to-l from-sh-sidebar-start from-0% to-sh-sidebar-end to-40%" />

			<div
				className="z-0 flex flex-1 justify-center pb-4"
				style={{
					boxShadow: "0 0 30px 0 rgba(0,0,0,.1), 0 0 0.5px 0 rgba(0,0,0,.05)",
				}}
			>
				<article className="shadow-highlight relative mx-4 mt-20 min-w-[460px] max-w-3xl flex-1 overflow-hidden rounded">
					<div className="absolute bottom-0 left-0 top-0 z-10 w-[3px] bg-sh-highlightbar" />
					<IframeRenderer key={emailId} srcDoc={emailHtml} />
				</article>
			</div>
		</div>
	);
}
