"use client"

import {IBagItem} from "@/utils/bag/IBagItem";
import {LOCAL_STORAGE_BAG_KEY} from "@/utils/bag/constants";
import Link from "next-intl/link";
import {useEffect} from "react";
import {ShoppingBagIcon} from "@heroicons/react/24/outline";
import {useBagStore, mergeBagStore} from "@/utils/bag/staticStore";

export default function HeaderBagButton() {
    const bagItems = useBagStore('HEADER');

    useEffect(() => {
        const newBagItems: Record<string, IBagItem> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BAG_KEY) || "{}");
        mergeBagStore(newBagItems);
    },[]);

    return <Link href="/bag"
                 className="
                            m-2 flex-none flex items-center justify-center w-12 h-12 text-slate-300
                        "
    >
        {/*<svg width="3rem" height="3rem" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">*/}
        {/*    <path d="M19,7H16V6A4,4,0,0,0,8,6V7H5A1,1,0,0,0,4,8V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V8A1,1,0,0,0,19,7ZM10,6a2,2,0,0,1,4,0V7H10Zm8,13a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V9H8v1a1,1,0,0,0,2,0V9h4v1a1,1,0,0,0,2,0V9h2Z"></path>*/}
        {/*</svg>*/}
        <ShoppingBagIcon className="h-16 w-16" stroke="white" />
        {Object.values(bagItems).length > 0 && <div className="absolute w-6 bg-red-500 rounded-full text-white text-center pb-0.5 mt-2">{Object.values(bagItems).length}</div>}
    </Link>
}
