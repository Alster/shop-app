import { useEffect, useState } from "react";

type SelectedCategories = string[] | undefined;
let currentSelectedCategories: SelectedCategories = undefined;
type Listener = (selectedCategories: SelectedCategories) => void;

const listeners: Listener[] = [];

function updateSelectedCategories(selectedCategories: SelectedCategories) {
	if (!isCategoriesDifferent(selectedCategories, currentSelectedCategories)) {
		return;
	}

	currentSelectedCategories = selectedCategories;
	for (const listener of listeners) listener(selectedCategories);
}

function updateSelectedCategoriesIfNeeded(selectedCategories: SelectedCategories) {
	if (currentSelectedCategories) return;

	updateSelectedCategories(selectedCategories);
}

export default function useSelectedCategories(sc?: SelectedCategories) {
	if (sc && isCategoriesDifferent(sc, currentSelectedCategories)) {
		currentSelectedCategories = sc;
	}

	const [selectedCategories, setSelectedCategories] =
		useState<SelectedCategories>(currentSelectedCategories);

	useEffect(() => {
		listeners.push(setSelectedCategories);
		return () => {
			const index = listeners.indexOf(setSelectedCategories);
			listeners.splice(index, 1);
		};
	});

	return [
		selectedCategories,
		updateSelectedCategories,
		updateSelectedCategoriesIfNeeded,
	] as const;
}

function isCategoriesDifferent(categories1: SelectedCategories, categories2: SelectedCategories) {
	if (categories1 === undefined && categories2 === undefined) {
		return false;
	}

	if (categories1 === undefined || categories2 === undefined) {
		return true;
	}

	return !isArraySame(categories1, categories2);
}

function isArraySame(array1: string[], array2: string[]) {
	if (array1.length !== array2.length) {
		return false;
	}

	for (const [i, element] of array1.entries()) {
		if (element !== array2[i]) {
			return false;
		}
	}

	return true;
}
