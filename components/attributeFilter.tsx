import {ReactElement, useState} from "react";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import * as React from "react";

export default function AttributeFilter({ key, values, selected, attributeInfo, onToggle}: {
    key: string,
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
            className="px-4 py-1"
            key={key}
            onMouseEnter={() => setShowList(true)}
            onMouseLeave={() => setShowList(false)}
        >
            <div
                className="cursor-pointer flex"
                // onClick={() => setShowList(!showList)}
            >
                {showList ? <ChevronUpIcon className="h-7 w-7 text-white inline-block" /> : <ChevronDownIcon className="h-7 w-7 text-white inline-block" />}
                {attributeInfo.title}
                {selected.length > 0 && (<span>:</span>)}
                {
                    selected
                        .map((v) => (
                            <span
                                key={v}
                                className="font-bold pl-1"
                            >{localeValue(v)}</span>
                        ))
                        .reduce((prev, elem) => {
                            if (prev.length > 0) {
                                prev.push(<span key={Math.random()}>,</span>);
                            }
                            prev.push(elem);
                            return prev;
                        }, [] as ReactElement[])
                }
            </div>
            <div className="flex">
                <div>
                    {showList && (
                        <div className="absolute flex flex-col bg-black border-2 border-white">
                            {values.map((v) => (
                                <button
                                    key={v}
                                    onClick={() => onToggle(v)}
                                    className={`px-2 py-1 w-full text-left`}
                                >
                                    <div className="inline-block w-4 h-4 border border-1 border-white mr-2">
                                        {selected.includes(v) && <div className="w-2 h-2 ml-1 mt-1 bg-white"></div>}
                                    </div>
                                    {localeValue(v)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
