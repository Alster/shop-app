'use client'

import useMobileViewScreen, {CurrentMobileViewScreen} from "@/utils/seearch/useMobileViewScreen";
import {Bars3Icon} from "@heroicons/react/24/solid";
import * as React from "react";

export default function MobileMenuButton({ className }: { className?: string }) {
    const [currentViewScreen, setCurrentViewScreen] = useMobileViewScreen();

    return (
        <Bars3Icon className="h-16 w-16 lg:hidden text-white cursor-pointer" onClick={() => setCurrentViewScreen(CurrentMobileViewScreen.Menu)}></Bars3Icon>
    )
}
