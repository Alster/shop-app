"use client"

import {useAppDispatch, useAppSelector} from "@/utils/store/store";
import Image from "next/image";
import {useFormatter, useTranslations} from "next-intl";
import HorizontalLine from "@/components/horizontalLine";
import AutoComplete from "@/components/autoComplete";
import * as React from "react";
import {ItemData} from "@/components/TListItem";
import {fetchNovaPoshta} from "@/utils/fetchNovaPoshta";

export default function CheckoutView() {
    const t = useTranslations('CheckoutPage');
    const format = useFormatter();
    const dispatch = useAppDispatch();
    const reducers = useAppSelector(state => state);
    const bagItems = reducers.bag;

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

    const drawStepTitle = (num: number, text: string) => {
        return (
            <div className="flex p-2">
                <div className="bg-purple-500 rounded-full pl-2 pr-2 text-white">{num}</div>
                <div className="pl-4">{text}</div>
            </div>
        );
    };

    const [cityName, setCityName] = React.useState('');
    const [searchDataCity, setSearchDataCity] = React.useState<ItemData[]>([]);

    const [officeName, setOfficeName] = React.useState('');
    const [searchDataOffice, setSearchDataOffice] = React.useState<ItemData[]>([]);

    return <form className="flex flex-col lg:flex-row" action="/api/" method="post">
        <div className="px-2 lg:px-8 flex-auto">
            {drawStepTitle(1, t("contactInfo"))}
            <div className="">
                <div className="py-1">
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {t("firstName")}
                    </label>
                    <input type="text" id="first_name" name="first_name"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="" required minLength={3}>
                    </input>
                </div>
                <div className="py-1">
                    <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {t("lastName")}
                    </label>
                    <input type="text" id="last_name" name="last_name"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                           placeholder="" required minLength={3}>
                    </input>
                </div>
                <div className="py-1">
                    <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {t("phoneNumber")}
                    </label>
                    <input type="tel" id="phone_number" name="phone_number"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                           placeholder="0937562957" pattern="[0-9]{10}" required>
                    </input>
                </div>
                <input className="hidden" type="text" id="hidden" name="hidden" value={
                    JSON.stringify(Object.entries(bagItems).map(([key, value]) => ({
                        id: value.id,
                        attrs: value.attributes,
                        qty: value.quantity,
                    })))
                }></input>
            </div>
            <HorizontalLine></HorizontalLine>
            {drawStepTitle(2, t("delivery"))}
            <div>
                <div className="flex gap-4">
                    <Image
                        className="w-5 h-5"
                        src="/img/novaPoshta.png"
                        alt="Nova Poshta"
                        width="20"
                        height="20"
                    ></Image>
                    {[
                        { value: "office", title: "whereToDeliver:office" },
                        { value: "subOffice", title: "whereToDeliver:subOffice" },
                        { value: "courier", title: "whereToDeliver:courier" },
                    ].map(item => (
                        <label key={item.value} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <input
                                name="whereToDeliver"
                                type="radio"
                                value={item.value}
                                required
                            /> {t(item.title)}
                        </label>
                    ))}
                </div>
                <div className="py-1">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        City
                    </label>
                    <AutoComplete
                        placeholder={t("cityPlaceholder")}
                        itemName={cityName}
                        setItemName={setCityName}
                        searchData={searchDataCity}
                        minLength={3}
                        onUserInput={async (input) => {
                            console.log(input);
                            const result: {
                                data: {
                                    Description: string,
                                    AreaDescription: string,
                                }[]
                            } = await fetchNovaPoshta({
                                modelName: "Address",
                                calledMethod: "getSettlements",
                                methodProperties: {
                                    FindByString: cityName,
                                    Warehouse: "1",
                                }
                            });
                            setSearchDataCity(result.data.map(item => ({
                                title: `${item.Description}, ${item.AreaDescription}`,
                                selected: false,
                            })));
                            console.log(result);
                        }}
                    ></AutoComplete>
                    <input required className="hidden" type="text" id="city_name" name="city_name" value={cityName}></input>
                </div>
                <div className="py-1">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Office
                    </label>
                    <AutoComplete
                        placeholder={t("officePlaceholder")}
                        itemName={officeName}
                        setItemName={setOfficeName}
                        searchData={searchDataOffice}
                        minLength={1}
                        onUserInput={async (input) => {
                            console.log(input);
                            const result: {
                                data: {
                                    Description: string,
                                    ShortAddress: string,
                                    Number: string,
                                }[]
                            } = await fetchNovaPoshta({
                                modelName: "Address",
                                calledMethod: "getWarehouses",
                                methodProperties: {
                                    WarehouseId: officeName
                                }
                            });
                            setSearchDataOffice(result.data.map(item => ({
                                title: `${item.Description}`,
                                selected: false,
                            })));
                            console.log(result);
                        }}
                    ></AutoComplete>
                    <input required className="hidden" type="text" id="office_name" name="office_name" value={officeName}></input>
                </div>
            </div>
        </div>
        <div className="m-2 p-2 bg-gray-100 dark:bg-gray-900 lg:w-1/3">
            <div className="text-lg flex">
                <div className="flex-auto">{t("totalPrice")}:</div>
                <div className="font-bold">{
                    format.number(
                        sum(Object.values(bagItems).map(item => item.price)),
                        {style: 'currency', currency: 'USD'})
                }</div>
            </div>
            <hr className="border-gray-300 dark:border-gray-700 m-4" />
            <button
                type="submit"
                className="
                                flex justify-center w-full h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             ">
                <span className="mt-3 ml-2">
                    {`${t("bCheckout")}`}
                </span>
            </button>
        </div>
    </form>
}
