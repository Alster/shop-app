"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Fragment, ReactElement, useReducer, useState } from "react";

import { Link, usePathname } from "@/navigation";
import { LanguageEnum } from "@/shop-shared/constants/localization";

interface IDropdownListItem {
	key: LanguageEnum;
	title: string;
	selected: boolean;
	flag: ReactElement;
}

// GET FLAGS HERE: https://github.com/lipis/flag-icons/tree/main/flags/1x1

const LANGUAGES_LIST: IDropdownListItem[] = [
	{
		key: LanguageEnum.ua,
		title: "Українська",
		selected: false,
		flag: (
			<svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-ua" viewBox="0 0 512 512">
				<g fillRule="evenodd" strokeWidth="1pt">
					<path fill="gold" d="M0 0h512v512H0z" />
					<path fill="#0057b8" d="M0 0h512v256H0z" />
				</g>
			</svg>
		),
	},
	{
		key: LanguageEnum.en,
		title: "English",
		selected: false,
		flag: (
			<svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-us" viewBox="0 0 512 512">
				<path fill="#bd3d44" d="M0 0h512v512H0" />
				<path
					stroke="#fff"
					strokeWidth="40"
					d="M0 58h512M0 137h512M0 216h512M0 295h512M0 374h512M0 453h512"
				/>
				<path fill="#192f5d" d="M0 0h390v275H0z" />
				<marker id="a" markerHeight="30" markerWidth="30">
					<path fill="#fff" d="m15 0 9.3 28.6L0 11h30L5.7 28.6" />
				</marker>
				<path
					fill="none"
					markerMid="url(#a)"
					d="m0 0 18 11h65 65 65 65 66L51 39h65 65 65 65L18 66h65 65 65 65 66L51 94h65 65 65 65L18 121h65 65 65 65 66L51 149h65 65 65 65L18 177h65 65 65 65 66L51 205h65 65 65 65L18 232h65 65 65 65 66L0 0"
				/>
			</svg>
		),
	},
	{
		key: LanguageEnum.ru,
		title: "Русский",
		selected: false,
		flag: (
			<svg xmlns="http://www.w3.org/2000/svg" id="flag-icons-ru" viewBox="0 0 512 512">
				<g fillRule="evenodd" strokeWidth="1pt">
					<path fill="#fff" d="M0 0h512v512H0z" />
					<path fill="#0039a6" d="M0 170.7h512V512H0z" />
					<path fill="#d52b1e" d="M0 341.3h512V512H0z" />
				</g>
			</svg>
		),
	},
];

export default function LanguageSelect({ className }: { className?: string }) {
	const pathname = usePathname();
	const query = useSearchParams();
	const url = `${pathname}?${query.toString()}`;

	const locale = useLocale();

	const [isListOpen, toggleList] = useReducer((state) => !state, false);

	const getLanguageByKey = (key: string) => {
		const foundCurrentLanguage = LANGUAGES_LIST.find((item) => item.key === key);
		if (!foundCurrentLanguage) {
			throw new Error(`Language ${locale} not found in LANGUAGES_LIST`);
		}
		return foundCurrentLanguage;
	};

	const initialLanguage = getLanguageByKey(locale);
	initialLanguage.selected = true;
	const [selectedLanguage, setSelectedLanguage] = useState<IDropdownListItem>(initialLanguage);

	const selectLanguage = (key: string) => {
		selectedLanguage.selected = false;
		const foundCurrentLanguage = getLanguageByKey(key);
		foundCurrentLanguage.selected = true;
		setSelectedLanguage(foundCurrentLanguage);
		toggleList();
	};

	const drawItem = (item: IDropdownListItem) => {
		return (
			<Fragment>
				<div className="m-1 mr-2 h-6 w-6">{item.flag}</div>
				<div className="p-1">{item.title}</div>
			</Fragment>
		);
	};

	return (
		<div className={className}>
			{!isListOpen && (
				<button className="" type="button" onClick={toggleList}>
					<div className="flex flex-wrap text-white">
						<ChevronDownIcon className="inline-block h-7 w-7 pt-1 text-white" />{" "}
						{drawItem(selectedLanguage)}
					</div>
				</button>
			)}
			{isListOpen && (
				<div className="absolute border-2 border-black bg-white dark:border-white dark:bg-black">
					{LANGUAGES_LIST.map((item) => (
						<div key={item.key}>
							<Link
								className="flex flex-wrap hover:bg-gray-500"
								href={url}
								locale={item.key}
								onClick={() => selectLanguage(item.key)}
							>
								{drawItem(item)}
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
