export function getStyleByColorCode(code: string) {
    const style: any = {};
    if (code === "multicolor") {
        style["background"] = "linear-gradient(45deg, red 25%, yellow 25%, green 50%, blue 50%, purple 75%, pink 75%, white 100%)";
    } else {
        style["backgroundColor"] = code;
    }
    return style;
}
