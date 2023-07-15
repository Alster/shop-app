import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import {useSearchParams} from "next/navigation";
import * as qs from "qs";
import {usePathname, useRouter} from "next-intl/client";

export default function TextSearchDesktop({ className }: { className?: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const pageQuery = qs.parse(searchParams.toString()) as any;
    const [currentValue, setCurrentValue] = useState<string>(pageQuery.search || '');

    const newQuery = {...pageQuery};
    if (currentValue.length) {
        newQuery.search = currentValue;
    } else {
        delete newQuery.search;
    }
    const newParams = qs.stringify(newQuery);
    const targetHref = `${pathname}?${newParams}`;

    const onSubmit = (e: any) => {
        e.preventDefault();
        router.push(targetHref);
    }

    return (
        <form onSubmit={onSubmit}  className={`${className} flex border-b-2 border-black dark:border-white`}>
            <div className="flex items-center">
                <MagnifyingGlassIcon className="w-6 h-6 mr-2"></MagnifyingGlassIcon>
            </div>
            <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder={"Search"}
                className="font-bold h-10 bg-transparent border-none outline-none w-full placeholder-black dark:placeholder-white"
            ></input>
            <input type="submit" className="hidden"></input>
        </form>
    )
}
