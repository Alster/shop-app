import * as React from 'react'
import Image from "next/image";
import { KeyboardEvent} from 'react'
import { TCityListItem, CityData } from './TCityListItem'

const searchData = [
    {
        url: '/img/item-icon.svg',
        city: 'Tokyo',
        population: '37,468,000',
        selected: false
    },
    {
        url: '/img/item-icon.svg',
        city: 'Delhi',
        population: '28,514,000',
        selected: false
    },
    {
        url: '/img/item-icon.svg',
        city: 'Shanghai',
        population: '25,582,000',
        selected: false
    },
    {
        url: '/img/item-icon.svg',
        city: 'São Paulo',
        population: '21,650,000',
        selected: false
    },
    {
        url: '/img/item-icon.svg',
        city: 'Mexico City',
        population: '21,581,000',
        selected: false
    },
    {
        url: '/img/item-icon.svg',
        city: 'Mumbai',
        population: '19,980,000',
        selected: false
    },
    {
        url: '/img/item-icon.svg',
        city: 'Beijing',
        population: '19,618,000',
        selected: false
    }
]

export default function Autocomplete({
    cityName, setCityName
                                     }: any) {
    const [cities, setCities] = React.useState<CityData[]>([])

    function filterOptions() {
        if (cityName.length) {
            const filtered = searchData.filter(e =>
                e.city.toLocaleLowerCase().startsWith(cityName.toLocaleLowerCase())
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
                setCityName(selected.city)
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

            <div className="relative">
                <input
                    className="outline-4 p-2.5 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 block dark:bg-gray-200 dark:border-gray-200 dark:placeholder-gray-200 dark:text-white"
                    id="cityName"
                    type="text"
                    placeholder="City name"
                    autoComplete="off"
                    value={cityName}
                    onInput={e => setCityName(e.currentTarget.value)}
                    onKeyUp={onKeyUp}
                    onBlur={onBlur}
                    onFocus={filterOptions}
                />

                {cities.length ? (
                    <div className="w-full absolute">
                        <div className="max-w-md bg-white p-2 rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flow-root">
                                <ul
                                    role="list"
                                    className="divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                    {cities.map(e => (
                                        <TCityListItem
                                            key={`${e.city}-${e.population}`}
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
