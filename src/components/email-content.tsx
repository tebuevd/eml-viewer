import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

type EmailContentProps = {
	emailId: string;
};

export function EmailContent({ emailId }: EmailContentProps) {
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
		<article className="grid h-full place-content-center">
			<Link className="hidden" id="back" ref={link} to="/" />
			TODO: render email with id {emailId}
		</article>
	);
}
