import * as React from 'react'
import classNames from 'classnames'

export type ItemData = {
    title: string
    selected: boolean
}

export type ItemDataAsProps = ItemData & {
    onItemClick: (name: string) => void
}

export function TListItem({
                                  title,
                                  selected,
                                  onItemClick
                              }: ItemDataAsProps) {
    return (
        <li className="p-3 sm:py-2 cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-700" onMouseDown={() => onItemClick(title)}>
            <div
                className={classNames('flex items-center space-x-4 rounded-md', {
                    'bg-sky-100': selected
                })}
            >
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {title}
                    </p>
                </div>
            </div>
        </li>
    )
}
