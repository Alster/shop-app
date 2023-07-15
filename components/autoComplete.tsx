import * as React from "react";
import { Fragment, KeyboardEvent, useEffect } from "react";

import { ItemData, TListItem } from "./TListItem";

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
	itemName: string;
	setItemName: (name: string) => void;
	searchData: ItemData[];
	onUserInput: (name: string) => void;
	placeholder: string;
	minLength: number;
	maxLength: number;
	className: string;
	id: string;
}) {
	const [isListVisible, setIsListVisible] = React.useState<boolean>(true);

	function onKeyUp(event: KeyboardEvent<HTMLInputElement>) {
		const key = event.key;
		if (key === "Enter") {
			const selected = searchData.find((data) => data.selected);
			if (selected) {
				setItemName(selected.title);
			}
			setIsListVisible(false);
			return;
		}

		if (key === "ArrowDown" || key === "ArrowUp") {
			const isUp = key === "ArrowUp";
			const index = searchData.findIndex((data) => data.selected);
			const next = isUp ? index - 1 : index + 1;

			for (const data of searchData) data.selected = false;
			if (next >= 0 && next <= searchData.length - 1) {
				searchData[next].selected = true;
			} else {
				if (isUp) {
					const data = searchData.at(-1);
					if (data) {
						data.selected = true;
					}
				} else {
					searchData[0].selected = true;
				}
			}
		}
	}

	function onItemClick(name: string) {
		setItemName(name);
		setIsListVisible(false);
	}

	useEffect(() => {
		if (
			itemName === undefined ||
			!itemName.trim() ||
			itemName.length < minLength ||
			itemName.length > maxLength
		) {
			// skip initial useEffect
			return;
		}

		const timeoutId = setTimeout(() => {
			onUserInput(itemName);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [itemName]);

	return (
		<Fragment>
			<input
				id={id}
				required
				name={id}
				className={className}
				type="text"
				placeholder={placeholder}
				autoComplete="off"
				value={itemName}
				onChange={(event) => {
					setItemName(event.currentTarget.value);
				}}
				onKeyUp={onKeyUp}
				onBlur={() => setIsListVisible(false)}
				onFocus={() => setIsListVisible(true)}
				minLength={minLength}
				maxLength={maxLength}
			/>

			{searchData.length > 0 && isListVisible ? (
				<div className="w-full absolute">
					<div
						style={{ maxHeight: "185px", overflowY: "scroll" }}
						className="max-w-md bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700"
					>
						<div className="flow-root">
							<ul className="divide-y divide-gray-200 dark:divide-gray-700">
								{searchData.map((data) => (
									<TListItem
										key={data.title}
										{...data}
										onItemClick={onItemClick}
									/>
								))}
							</ul>
						</div>
					</div>
				</div>
			) : undefined}
		</Fragment>
	);
}
