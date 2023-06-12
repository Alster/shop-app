import {ReactElement} from "react";

export interface IStatusIconConfig {
    icon: ReactElement;
    textColor: string
    backgroundColor?: string
}

export default function StatusIcon({ ...config }: IStatusIconConfig ){
    return (
        <div className="flex justify-center m-8">
            <div className={`rounded-full ${config.backgroundColor || "bg-gray-100"}`}>
                <div className={`m-4 h-16 w-16 ${config.textColor}`}>
                    {config.icon}
                </div>
            </div>
        </div>
    )
}
