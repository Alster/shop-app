import * as React from 'react'
import { KeyboardEvent} from 'react'
import { TCityListItem, CityData } from './TCityListItem'

export default function Autocomplete({
    cityName,
    setCityName,
    searchData,
    onUserInput
}: {
    cityName: string,
    setCityName: (name: string) => void,
    searchData: CityData[],
    onUserInput: (name: string) => void
}) {
    const [cities, setCities] = React.useState<CityData[]>([])

    function filterOptions() {
        if (cityName.length) {
            const filtered = searchData.filter(e =>
                e.title.toLocaleLowerCase().startsWith(cityName.toLocaleLowerCase())
            )
            setCities(filtered)
        } else {
            setCities([])
        }
    }

    function onKeyUp(e: KeyboardEvent<HTMLInputElement>) {
        const key = e.key
        if (key === 'Enter') {
            const selected = cities.find(e => e.selected)
            if (selected) {
                setCityName(selected.title)
            }
            setCities([])
            return
        }

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            const isUp = key === 'ArrowUp'
            const idx = cities.findIndex(e => e.selected)
            const next = isUp ? idx - 1 : idx + 1

            cities.map(e => (e.selected = false))
            if (next >= 0 && next <= cities.length - 1) {
                cities[next].selected = true
            } else {
                if (isUp) {
                    cities[cities.length - 1].selected = true
                } else {
                    cities[0].selected = true
                }
            }
        }

        filterOptions()
    }

    function onBlur() {
        setCities([])
    }

    function onItemClick(name: string) {
        setCityName(name)
        setCities([])
    }

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
                    value={cityName}
                    onInput={e => {
                        setCityName(e.currentTarget.value);
                        onUserInput(cityName);
                    }}
                    onKeyUp={onKeyUp}
                    onBlur={onBlur}
                    onFocus={filterOptions}
                />

                {cities.length ? (
                    <div className="w-full absolute">
                        <div style={{height: "185px", overflowY: "scroll"}} className="max-w-md bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flow-root">
                                <ul
                                    role="list"
                                    className="divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                    {cities.map(e => (
                                        <TCityListItem
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
