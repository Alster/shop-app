"use client";

import "./checkoutView.css";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { Fragment } from "react";

import AutoComplete from "@/components/autoComplete";
import HorizontalLine from "@/components/horizontalLine";
import { ItemData } from "@/components/TListItem";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { NOVA_POSHTA_DELIVERY_TYPE } from "@/shop-shared/constants/checkout";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { CreateOrderItemDataDto } from "@/shop-shared/dto/order/createOrder.dto";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { useBagStore } from "@/utils/bag/bagItemsStorage";
import { fetchNovaPoshta } from "@/utils/fetchNovaPoshta";

const sum = (array: number[]) => array.reduce((a, b) => a + b, 0);

export default function CheckoutView({
	exchangeState,
	currency,
}: {
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
}) {
	const t = useTranslations("CheckoutPage");
	const locale = useLocale();
	const bagItems = useBagStore();

	const drawStepTitle = (number_: number, text: string) => {
		return (
			<div className="flex p-2">
				<div className="rounded-full bg-purple-500 px-2 text-white">{number_}</div>
				<div className="pl-4">{text}</div>
			</div>
		);
	};

	const [cityName, setCityName] = React.useState("");
	const [searchDataCity, setSearchDataCity] = React.useState<ItemData[]>([]);

	const [officeName, setOfficeName] = React.useState("");
	const [searchDataOffice, setSearchDataOffice] = React.useState<ItemData[]>([]);

	const [selectedNovaPoshtaDeliveryType, setSelectedNovaPoshtaDeliveryType] = React.useState("");

	const drawLabel = (text: string) => {
		return (
			<label
				htmlFor="last_name"
				className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>
				{text}
			</label>
		);
	};

	const drawCityInput = () => {
		return (
			<div className="py-1">
				{drawLabel(t("deliveryCity"))}
				<AutoComplete
					id="city_name"
					placeholder={t("cityPlaceholder")}
					itemName={cityName}
					setItemName={setCityName}
					searchData={searchDataCity}
					minLength={3}
					maxLength={300}
					className="inputField"
					onUserInput={async (input) => {
						const result: {
							data: {
								Description: string;
								AreaDescription: string;
							}[];
						} = await fetchNovaPoshta({
							modelName: "Address",
							calledMethod: "getSettlements",
							methodProperties: {
								FindByString: input,
								Warehouse: "1",
							},
						});
						setSearchDataCity(
							result.data.map((item) => ({
								title: `${item.Description}, ${item.AreaDescription}`,
								selected: false,
							})),
						);
					}}
				></AutoComplete>
			</div>
		);
	};

	return (
		<form
			className="flex flex-col lg:flex-row"
			action={`${process.env.NEXT_PUBLIC_APP_API_URL}order/create`}
			method="get"
		>
			<div className="flex-auto px-2 lg:px-8">
				{drawStepTitle(1, t("contactInfo"))}
				<div className="">
					<div className="py-1">
						{drawLabel(t("firstName"))}
						<input
							type="text"
							id="first_name"
							name="first_name"
							className="inputField"
							placeholder=""
							required
							minLength={3}
						></input>
					</div>
					<div className="py-1">
						{drawLabel(t("lastName"))}
						<input
							type="text"
							id="last_name"
							name="last_name"
							className="inputField"
							placeholder=""
							required
							minLength={3}
						></input>
					</div>
					<div className="py-1">
						{drawLabel(t("phoneNumber"))}
						<input
							type="tel"
							id="phone_number"
							name="phone_number"
							className="inputField"
							placeholder="0937562957"
							pattern="[0-9]{10}"
							required
						></input>
					</div>
					<input
						className="hidden"
						type="text"
						id="items_data"
						name="items_data"
						value={JSON.stringify(
							Object.entries(bagItems).map(
								([, value]) =>
									({
										productId: value.productId,
										sku: value.item.sku,
										attributes: value.item.attributes,
										images: value.item.images,
									}) as CreateOrderItemDataDto,
							),
						)}
						onChange={() => {}}
					></input>
					<input
						className="hidden"
						type="text"
						id="lang"
						name="lang"
						value={locale}
						onChange={() => {}}
					></input>
					<input
						className="hidden"
						type="text"
						id="currency"
						name="currency"
						value="USD"
						onChange={() => {}}
					></input>
				</div>
				<HorizontalLine></HorizontalLine>
				{drawStepTitle(2, t("delivery"))}
				<div>
					<div className="flex gap-4">
						<Image
							className="h-5 w-5"
							src="/img/novaPoshta.png"
							alt="Nova Poshta"
							width="20"
							height="20"
						></Image>
						{(
							[
								{
									value: NOVA_POSHTA_DELIVERY_TYPE.OFFICE,
									title: "whereToDeliver:office",
								},
								{
									value: NOVA_POSHTA_DELIVERY_TYPE.COURIER,
									title: "whereToDeliver:courier",
								},
							] as const
						).map((item) => (
							<label
								key={item.value}
								className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>
								<input
									name="where_to_deliver"
									type="radio"
									value={item.value}
									onChange={() => setSelectedNovaPoshtaDeliveryType(item.value)}
									checked={item.value === selectedNovaPoshtaDeliveryType}
									required
								/>{" "}
								{t(item.title)}
							</label>
						))}
					</div>
					{selectedNovaPoshtaDeliveryType === NOVA_POSHTA_DELIVERY_TYPE.OFFICE && (
						<Fragment>
							{drawCityInput()}
							<div className="py-1">
								{drawLabel(t("deliveryOffice"))}
								<AutoComplete
									id="office_name"
									placeholder={t("officePlaceholder")}
									itemName={officeName}
									setItemName={setOfficeName}
									searchData={searchDataOffice}
									minLength={1}
									maxLength={300}
									className="inputField"
									onUserInput={async (input) => {
										const result: {
											data: {
												Description: string;
												ShortAddress: string;
												Number: string;
											}[];
										} = await fetchNovaPoshta({
											modelName: "Address",
											calledMethod: "getWarehouses",
											methodProperties: {
												WarehouseId: input,
											},
										});
										setSearchDataOffice(
											result.data.map((item) => ({
												title: `${item.Description}`,
												selected: false,
											})),
										);
									}}
								></AutoComplete>
							</div>
						</Fragment>
					)}
					{selectedNovaPoshtaDeliveryType === NOVA_POSHTA_DELIVERY_TYPE.COURIER && (
						<Fragment>
							{drawCityInput()}
							<div className="py-1">
								{drawLabel(t("street"))}
								<input
									type="text"
									id="street"
									name="street"
									className="inputField"
									placeholder={t("streetPlaceholder")}
									required
									minLength={3}
									maxLength={30}
								></input>
							</div>
							<div className="flex gap-2 py-1">
								<div className="w-1/2">
									{drawLabel(t("building"))}
									<input
										type="text"
										id="building"
										name="building"
										className="inputField"
										placeholder={t("buildingPlaceholder")}
										required
										minLength={1}
										maxLength={10}
									></input>
								</div>
								<div className="w-1/2">
									{drawLabel(t("room"))}
									<input
										type="text"
										id="room"
										name="room"
										className="inputField"
										placeholder={t("roomPlaceholder")}
										required
										minLength={1}
										maxLength={10}
									></input>
								</div>
							</div>
						</Fragment>
					)}
				</div>
			</div>
			<div className="m-2 bg-gray-100 p-2 lg:w-1/3 dark:bg-gray-900">
				<div className="flex text-lg">
					<div className="flex-auto">{t("totalPrice")}:</div>
					<div className="font-bold">
						{formatPrice(
							moneySmallToBig(
								doExchange(
									CurrencyEnum.UAH,
									currency,
									sum(
										Object.values(bagItems).map((item) => item.price as number),
									),
									exchangeState,
								),
							),
							currency,
						)}
					</div>
				</div>
				<hr className="m-4 border-gray-300 dark:border-gray-700" />
				<button
					type="submit"
					className="
                                flex h-12 w-full justify-center bg-slate-800 font-medium uppercase
                                 tracking-wider text-white
                                 dark:bg-slate-200 dark:text-black
                             "
				>
					<span className="ml-2 mt-3">{`${t("bCheckout")}`}</span>
				</button>
			</div>
		</form>
	);
}
