"use client"

import Link from "next-intl/link";
import {useEffect} from "react";
import {ShoppingBagIcon} from "@heroicons/react/24/outline";
import {loadBag, useBagStore} from "@/utils/bag/bagItemsStorage";

export default function HeaderBagButton() {
    const bagItems = useBagStore();

    useEffect(() => {
        loadBag();
    },[]);

    return <Link href="/bag"
                 className="
                            m-2 flex-none flex items-center justify-center w-12 h-12 text-slate-300
                        "
    >
        <ShoppingBagIcon className="h-16 w-16" stroke="white" />
        {Object.values(bagItems).length > 0 && <div className="absolute w-6 bg-red-500 rounded-full text-white text-center pb-0.5 mt-2">{Object.values(bagItems).length}</div>}
    </Link>
}
