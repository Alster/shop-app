import * as React from 'react'
import classNames from 'classnames'

export type CityData = {
    title: string
    selected: boolean
}

export type CityDataAsProps = CityData & {
    onItemClick: (name: string) => void
}

export function TCityListItem({
                                  title,
                                  selected,
                                  onItemClick
                              }: CityDataAsProps) {
    return (
        <li className="p-3 sm:py-2 cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-700" onMouseDown={() => onItemClick(title)}>
            <div
                className={classNames('flex items-center space-x-4 rounded-md', {
                    'bg-sky-100': selected
                })}
            >
                {/*<div className="flex-shrink-0">*/}
                {/*    <Image src={url} className="w-8 h-8 rounded-full" alt="Item icon" width="24" height="24"/>*/}
                {/*</div>*/}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {title}
                    </p>
                    {/*<p className="text-sm text-gray-500 truncate dark:text-gray-400">*/}
                    {/*    {population}*/}
                    {/*</p>*/}
                </div>
            </div>
        </li>
    )
}
