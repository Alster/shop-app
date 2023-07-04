import {ReactElement, useState} from "react";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import * as React from "react";
import {ATTRIBUTES} from "@/app/constants";
import {CheckCircleIcon} from "@heroicons/react/20/solid";
import {getStyleByColorCode} from "@/utils/products/getStyleByColorCode";

export default function AttributeFilter({ values, selected, attributeInfo, onToggle}: {
    values: string[],
    selected: string[],
    attributeInfo?: AttributeDto,
    onToggle: (value: string) => void,
}) {
    const [showList, setShowList] = useState<boolean>(false)

    if (!attributeInfo) {
        return null
    }

    const localeValue = (key: string) => {
        return attributeInfo.values.find((v) => v.key === key)?.title || key;
    };

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
                {showList ? <ChevronUpIcon className="h-7 w-7 text-white inline-block" /> : <ChevronDownIcon className="h-7 w-7 text-white inline-block" />}
                {attributeInfo.title}
                {selected.length > 0 && (
                    <span><span className="ml-1 inline-block unicorn-background w-5 text-sm rounded-full text-white text-center pb-0.5">{selected.length}</span> </span>
                )}
                {selected.length === 0 && (
                    <span><span className="ml-1 inline-block w-5 pb-0.5"></span></span>
                )}
            </div>
            <div className="flex">
                <div>
                    {showList && (
                        <div className="absolute flex flex-wrap bg-white dark:bg-black border-2 border-gray-500 p-2 max-w-sm">
                            {values.map((value) => {
                                if (attributeInfo.key === ATTRIBUTES.COLOR) {
                                    const style = getStyleByColorCode(value);
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => onToggle(value)}
                                            className={`
                                            px-2 py-2 m-1 w-8 h-8 
                                            border border-black dark:border-white 
                                            ${selected.includes(value) ? "border-4" : ""}
                                            ${selected.includes(value) ? "outline outline-white outline-2" : ""}
                                            `}
                                            style={style}
                                        >
                                        </button>
                                    )
                                }

                                return (
                                    <button
                                        key={value}
                                        onClick={() => onToggle(value)}
                                        className={`px-2 py-1 m-1 border border-black dark:border-white ${selected.includes(value) ? "unicorn-background" : ""}`}
                                    >
                                        {localeValue(value)}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
