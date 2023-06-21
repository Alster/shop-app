import {useState} from "react";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";

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

    return (
        <div className="flex flex-row">
            <div
                className="font-semibold cursor-pointer"
                onClick={() => setShowList(!showList)}
            >{attributeInfo.title}</div>
            <div className="flex gap-2">
                <div>
                    {showList && (
                        <div className="absolute flex flex-col bg-black border-2 border-white">
                            {values.map((v) => (
                                <button
                                    key={v}
                                    onClick={() => onToggle(v)}
                                    className={`p-1 mx-2 ${selected.includes(v) ? 'bg-gray-500' : 'bg-gray-200'}`}
                                >{v}</button>
                            ))}
                        </div>
                    )}
                </div>
                {selected.map((v) => (
                    <button
                        key={v}
                        onClick={() => onToggle(v)}
                        className={`p-1 mx-2 ${selected.includes(v) ? 'bg-gray-500' : 'bg-gray-200'}`}
                    >{v}</button>
                ))}
            </div>
        </div>
    )
}
