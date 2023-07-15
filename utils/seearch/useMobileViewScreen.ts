import {useEffect, useState} from "react";

export enum CurrentMobileViewScreen {
    Catalog = 'catalog',
    Filters = 'filters',
    Menu = 'menu',
}

let currentVal: CurrentMobileViewScreen = CurrentMobileViewScreen.Catalog;

const callbacks: Function[] = [];

function callCallbacks(newValue: CurrentMobileViewScreen) {
    if (currentVal === newValue) {
        return;
    }

    currentVal = newValue;
    callbacks.forEach((cb) => cb(newValue));
    return;
}

export default function useMobileViewScreen(defaultValue?: CurrentMobileViewScreen) {
    if (currentVal === null && defaultValue && defaultValue.length) {
        currentVal = defaultValue;
    }

    const [searchTerm, setSearchTerm] = useState<CurrentMobileViewScreen>(currentVal);

    useEffect(() => {
        callbacks.push(setSearchTerm);

        return () => {
            const index = callbacks.indexOf(setSearchTerm);
            callbacks.splice(index, 1);
        };
    }, []);

    return [searchTerm, callCallbacks] as const;
}
