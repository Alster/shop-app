import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

export default function TextSearchMobile({ className }: { className?: string }) {
    return (
        <div className={`${className} flex`}>
            <div className="flex items-center">
                <MagnifyingGlassIcon className="w-6 h-6 mr-2"></MagnifyingGlassIcon>
            </div>
            <input
                type="text"
                // value={value}
                placeholder={"Search"}
                className="h-14 bg-transparent border-none outline-none w-full placeholder-black dark:placeholder-white"
            ></input>
        </div>
    )
}
