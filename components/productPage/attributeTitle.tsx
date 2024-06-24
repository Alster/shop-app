import * as React from "react";

export default function AttributeTitle({
	title,
	highlightMustSelect,
	highlightText,
}: {
	title: string;
	highlightMustSelect: boolean;
	highlightText: string;
}) {
	return (
		<div className="text-slate-600 dark:text-slate-300">
			{title}
			{highlightMustSelect && <span className="pl-3 text-red-500">{highlightText}</span>}
		</div>
	);
}
