import { useEffect, useState } from "react";

export enum MobileViewScreenEnum {
	Catalog = "catalog",
	Filters = "filters",
	Menu = "menu",
}

let currentValue: MobileViewScreenEnum = MobileViewScreenEnum.Catalog;

const callbacks: ((value: MobileViewScreenEnum) => void)[] = [];

function callCallbacks(newValue: MobileViewScreenEnum) {
	if (currentValue === newValue) {
		return;
	}

	currentValue = newValue;
	for (const callback of callbacks) callback(newValue);
}

export default function useMobileViewScreen(defaultValue?: MobileViewScreenEnum) {
	if (currentValue === null && defaultValue && defaultValue.length > 0) {
		currentValue = defaultValue;
	}

	const [searchTerm, setSearchTerm] = useState<MobileViewScreenEnum>(currentValue);

	useEffect(() => {
		callbacks.push(setSearchTerm);

		return () => {
			const index = callbacks.indexOf(setSearchTerm);
			callbacks.splice(index, 1);
		};
	}, []);

	return [searchTerm, callCallbacks] as const;
}
