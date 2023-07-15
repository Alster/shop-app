import { CSSProperties } from "react";

export function getStyleByColorCode(code: string) {
	const style: CSSProperties = {};
	if (code === "multicolor") {
		style["background"] =
			"linear-gradient(45deg, red 25%, orange 25%, yellow 50%, green 50%, blue 75%, purple 75%, pink 100%)";
	} else {
		style["backgroundColor"] = code;
	}
	return style;
}
