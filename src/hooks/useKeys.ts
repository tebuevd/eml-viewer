import { useCallback, useEffect } from "react";

export function useKeys() {
	const onKeyDown = useCallback(function onKeyDown(e: KeyboardEvent) {
		if (e.key === "j") {
			e.preventDefault();
			const next = document.activeElement?.nextElementSibling;

			if (next instanceof HTMLElement) {
				next.focus();
				next.scrollIntoView({ block: "center" });
			} else {
				const first = document.querySelector("li");

				if (first instanceof HTMLElement) {
					first.focus();
				}
			}
		} else if (e.key === "k") {
			e.preventDefault();
			const prev = document.activeElement?.previousElementSibling;

			if (prev instanceof HTMLElement && prev.tagName.toLowerCase() === "li") {
				prev.focus();
				prev.scrollIntoView({ block: "center" });
			} else {
				const first = document.querySelector("li");

				if (first instanceof HTMLElement) {
					first.focus();
				}
			}
		} else if (e.key === "Tab") {
			e.preventDefault();
		}
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);

		return function cleanup() {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown]);

	return {};
}
