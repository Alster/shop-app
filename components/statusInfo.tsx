import StatusIcon, {IStatusIconConfig} from "@/components/statusIcon";
import {ReactElement} from "react";

export interface IStatusInfoConfig {
    iconConfig: IStatusIconConfig;
    title: string;
    description: string;
    extraInfo?: ReactElement
}

export default function StatusInfo({ children, ...config }: { children?: any } & IStatusInfoConfig ){
    return (
        <div className="flex flex-col text-center">
            <StatusIcon
                icon={config.iconConfig.icon}
                textColor={config.iconConfig.textColor}
                backgroundColor={config.iconConfig.backgroundColor}
            ></StatusIcon>
            {config.extraInfo && config.extraInfo}
            <div className="py-6 flex flex-col">
                <div className="flex-auto"></div>
                <div>
                    <div className="font-extrabold">{config.title}</div>
                    <div>{config.description}</div>
                </div>
            </div>
        </div>
    )
}
