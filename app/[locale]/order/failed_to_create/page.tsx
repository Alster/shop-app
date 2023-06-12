import {XMarkIcon} from "@heroicons/react/24/outline";
import {useTranslations} from "next-intl";
import * as React from "react";
import Link from "next-intl/link";
import StatusInfo from "@/components/statusInfo";

export default function FailedToCreateOrderPage({ searchParams }: any) {
    const t = useTranslations('FailedToCreateOrderPage');
    return (
        <div className="flex flex-col items-center justify-centent">

            <div className="flex flex-col text-center">
                <StatusInfo
                    iconConfig={{
                        icon: <XMarkIcon></XMarkIcon>,
                        textColor: "text-white-400",
                        backgroundColor: "bg-red-400"
                    }}
                    title={t("failedToCreateOrder")}
                    description={t("failedToCreateOrderDescription")}
                    extraInfo={<div className="text-red-400 font-semibold">{searchParams.reason}</div>}
                ></StatusInfo>

                <Link
                    href="/bag"
                    className="
                    flex justify-center w-full h-12 uppercase font-medium tracking-wider
                     dark:bg-slate-200 dark:text-black
                     bg-slate-800 text-white
                 ">
                    <span className="mt-3 ml-2">
                        {`${t("bGoToBag")}`}
                    </span>
                </Link>
            </div>

            {/*<div className="flex flex-col text-center">*/}
            {/*    <div className="flex justify-center m-8">*/}
            {/*        <div className="rounded-full bg-red-400">*/}
            {/*            <div className={`m-4 h-16 w-16 text-white-400`}>*/}
            {/*                <XMarkIcon></XMarkIcon>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="text-red-400 font-semibold">{searchParams.reason}</div>*/}
            {/*    <div className="py-6 flex flex-col">*/}
            {/*        <div className="flex-auto"></div>*/}
            {/*        <div>*/}
            {/*            <div className="font-extrabold">{t("failedToCreateOrder")}</div>*/}
            {/*            <div>{t("failedToCreateOrderDescription")}</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}
