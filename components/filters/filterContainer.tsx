import {ReactNode, useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import * as React from "react";

export default function FilterContainer({ title, selectedCount, children, className }: { title: string, selectedCount: number, children: ReactNode, className?: string }) {
    const [showList, setShowList] = useState<boolean>(false);

    return (
        <div
            className="px-2 py-1"
            onMouseEnter={() => setShowList(true)}
            onMouseLeave={() => setShowList(false)}
        >
            <div
                className="cursor-pointer flex"
                onClick={() => setShowList(!showList)}
            >
                {showList ? <ChevronUpIcon className="h-7 w-7 inline-block" /> : <ChevronDownIcon className="h-7 w-7 inline-block" />}
                {title}
                {selectedCount > 0 && (
                    <span><span className="ml-1 inline-block unicorn-background w-5 text-sm rounded-full text-white text-center pb-0.5">{selectedCount}</span> </span>
                )}
                {selectedCount === 0 && (
                    <span><span className="ml-1 inline-block w-5 pb-0.5"></span></span>
                )}
            </div>
            <div className="flex">
                <div>
                    {showList && (
                        <div className={`${className} md:absolute flex flex-wrap bg-white dark:bg-black border-2 border-gray-500 p-2 max-w-sm`}>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
