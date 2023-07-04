import {useEffect, useState} from "react";

let currentVal: string | null = null;

const callbacks: Function[] = [];

function callCallbacks(searchTerm: string) {
    if (currentVal === searchTerm) {
        return;
    }

    currentVal = searchTerm;
    callbacks.forEach((cb) => cb(searchTerm));
    return;
}

export default function useSearchTerm(defaultValue?: string) {
    if (currentVal === null && defaultValue && defaultValue.length) {
        currentVal = defaultValue;
    }

    const [searchTerm, setSearchTerm] = useState(currentVal);

    useEffect(() => {
        callbacks.push(setSearchTerm);

        return () => {
            const index = callbacks.indexOf(setSearchTerm);
            callbacks.splice(index, 1);
        };
    }, []);

    return [searchTerm, callCallbacks] as const;
}
