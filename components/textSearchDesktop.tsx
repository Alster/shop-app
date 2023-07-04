import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import useSearchTerm from "@/utils/seearch/useSearchTerm";
import {useState} from "react";

export default function TextSearchDesktop({ className }: { className?: string }) {
    const [searchTerm, setSearchTerm] = useSearchTerm();
    const [currentValue, setCurrentValue] = useState<string>(searchTerm || '');

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            setSearchTerm(e.target.value);
        }
    }

    return (
        <div className={`${className} flex border-b-2 border-black dark:border-white`}>
            <div className="flex items-center">
                <MagnifyingGlassIcon className="w-6 h-6 mr-2"></MagnifyingGlassIcon>
            </div>
            <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={"Search"}
                className="font-bold h-10 bg-transparent border-none outline-none w-full placeholder-black dark:placeholder-white"
            ></input>
        </div>
    )
}
