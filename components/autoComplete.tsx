import * as React from 'react'
import {KeyboardEvent, useEffect} from 'react'
import { TListItem, ItemData } from './TListItem'

export default function Autocomplete({
    itemName,
    setItemName,
    searchData,
    onUserInput
}: {
    itemName: string,
    setItemName: (name: string) => void,
    searchData: ItemData[],
    onUserInput: (name: string) => void
}) {
    const [items, setItems] = React.useState<ItemData[]>([])

    function filterOptions() {
        if (itemName.length) {
            const filtered = searchData.filter(e =>
                e.title.toLocaleLowerCase().startsWith(itemName.toLocaleLowerCase())
            )
            setItems(filtered)
        } else {
            setItems([])
        }
    }

    function onKeyUp(e: KeyboardEvent<HTMLInputElement>) {
        const key = e.key
        if (key === 'Enter') {
            const selected = items.find(e => e.selected)
            if (selected) {
                setItemName(selected.title)
            }
            setItems([])
            return
        }

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            const isUp = key === 'ArrowUp'
            const idx = items.findIndex(e => e.selected)
            const next = isUp ? idx - 1 : idx + 1

            items.map(e => (e.selected = false))
            if (next >= 0 && next <= items.length - 1) {
                items[next].selected = true
            } else {
                if (isUp) {
                    items[items.length - 1].selected = true
                } else {
                    items[0].selected = true
                }
            }
        }

        filterOptions()
    }

    function onBlur() {
        setItems([])
    }

    function onItemClick(name: string) {
        setItemName(name)
        setItems([])
    }

    useEffect(() => {
        if (itemName === undefined || !itemName.trim() || itemName.length < 3) { // skip initial useEffect
            return
        }

        const timeoutId = setTimeout(() => {
            onUserInput(itemName);
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [itemName])

    return (
        <div className="px-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                City
            </label>

            <div className="">
                <input
                    className="
                    bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                        "
                    id="cityName"
                    type="text"
                    placeholder="City name"
                    autoComplete="off"
                    value={itemName}
                    onInput={e => {
                        setItemName(e.currentTarget.value);
                    }}
                    onKeyUp={onKeyUp}
                    onBlur={onBlur}
                    onFocus={filterOptions}
                />

                {items.length ? (
                    <div className="w-full absolute">
                        <div style={{maxHeight: "185px", overflowY: "scroll"}} className="max-w-md bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flow-root">
                                <ul
                                    role="list"
                                    className="divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                    {items.map(e => (
                                        <TListItem
                                            key={e.title}
                                            {...e}
                                            onItemClick={onItemClick}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
