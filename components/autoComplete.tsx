import * as React from 'react'
import {Fragment, KeyboardEvent, useEffect} from 'react'
import { TListItem, ItemData } from './TListItem'

export default function Autocomplete({
    itemName,
    setItemName,
    searchData,
    onUserInput,
    placeholder,
    minLength,
    maxLength,
    className,
    id,
}: {
    itemName: string,
    setItemName: (name: string) => void,
    searchData: ItemData[],
    onUserInput: (name: string) => void,
    placeholder: string,
    minLength: number,
    maxLength: number,
    className: string,
    id: string,
}) {
    const [isListVisible, setIsListVisible] = React.useState<boolean>(true)

    function onKeyUp(e: KeyboardEvent<HTMLInputElement>) {
        const key = e.key
        if (key === 'Enter') {
            const selected = searchData.find(e => e.selected)
            if (selected) {
                setItemName(selected.title)
            }
            setIsListVisible(false);
            return
        }

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            const isUp = key === 'ArrowUp'
            const idx = searchData.findIndex(e => e.selected)
            const next = isUp ? idx - 1 : idx + 1

            searchData.map(e => (e.selected = false))
            if (next >= 0 && next <= searchData.length - 1) {
                searchData[next].selected = true
            } else {
                if (isUp) {
                    searchData[searchData.length - 1].selected = true
                } else {
                    searchData[0].selected = true
                }
            }
        }
    }

    function onItemClick(name: string) {
        setItemName(name)
        setIsListVisible(false);
    }

    useEffect(() => {
        if (itemName === undefined || !itemName.trim() || itemName.length < minLength || itemName.length > maxLength) { // skip initial useEffect
            return
        }

        const timeoutId = setTimeout(() => {
            onUserInput(itemName);
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [itemName])

    return (<Fragment>
        <input
            id={id}
            required
            name={id}
            className={className}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            value={itemName}
            onChange={e => {
                setItemName(e.currentTarget.value);
            }}
            onKeyUp={onKeyUp}
            onBlur={() => setIsListVisible(false)}
            onFocus={() => setIsListVisible(true)}
            minLength={minLength}
            maxLength={maxLength}
        />

        {(searchData.length && isListVisible) ? (
            <div className="w-full absolute">
                <div style={{maxHeight: "185px", overflowY: "scroll"}} className="max-w-md bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="flow-root">
                        <ul
                            role="list"
                            className="divide-y divide-gray-200 dark:divide-gray-700"
                        >
                            {searchData.map(e => (
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
    </Fragment>)
}
