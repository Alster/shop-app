import "./multiRangeSlider.css";

import classnames from "classnames";
import React, { Fragment, ReactNode, useCallback, useEffect, useRef, useState } from "react";

import useDebounce from "@/utils/useDebounce";

export default function MultiRangeSlider({
	min,
	max,
	defaultMinVal,
	defaultMaxVal,
	onChange,
	className,
	valueFrom,
	valueTo,
}: {
	min: number;
	max: number;
	defaultMinVal: number;
	defaultMaxVal: number;
	onChange: (range: { min: number; max: number }) => void;
	className?: string;
	valueFrom: (value: number) => ReactNode;
	valueTo: (value: number) => ReactNode;
}) {
	const [minValue, setMinValue] = useState(defaultMinVal);
	const [maxValue, setMaxValue] = useState(defaultMaxVal);
	const minValueReference = useRef<HTMLInputElement>(null);
	const maxValueReference = useRef<HTMLInputElement>(null);
	const range = useRef<HTMLInputElement>(null);

	const debouncedMin = useDebounce(minValue, 500);
	const debouncedMax = useDebounce(maxValue, 500);

	const [firstCall, setFirstCall] = useState(true);
	useEffect(() => {
		if (firstCall) {
			setFirstCall(false);
			return;
		}
		onChange({ min: minValue, max: maxValue });
	}, [debouncedMin, debouncedMax]);

	// Convert to percentage
	const getPercent = useCallback(
		(value: number) => Math.round(((value - min) / (max - min)) * 100),
		[min, max],
	);

	// Set width of the range to decrease from the left side
	useEffect(() => {
		if (maxValueReference.current) {
			const minPercent = getPercent(minValue);
			const maxPercent = getPercent(+maxValueReference.current.value);

			if (range.current) {
				range.current.style.left = `${minPercent}%`;
				range.current.style.width = `${maxPercent - minPercent}%`;
			}
		}
	}, [minValue, getPercent]);

	// Set width of the range to decrease from the right side
	useEffect(() => {
		if (minValueReference.current) {
			const minPercent = getPercent(+minValueReference.current.value);
			const maxPercent = getPercent(maxValue);

			if (range.current) {
				range.current.style.width = `${maxPercent - minPercent}%`;
			}
		}
	}, [maxValue, getPercent]);

	return (
		<Fragment>
			{valueFrom && valueFrom(minValue)}
			<div
				className={`${className} h-4 flex items-center content-center`}
				onMouseLeave={() => onChange({ min: minValue, max: maxValue })}
			>
				<input
					type="range"
					min={min}
					max={max}
					value={minValue}
					ref={minValueReference}
					onChange={(event) => {
						const value = Math.min(+event.target.value, maxValue - 1);
						setMinValue(value);
						event.target.value = value.toString();
					}}
					className={classnames("thumb thumb--zindex-3", {
						"thumb--zindex-5": minValue > max - 100,
					})}
				/>
				<input
					type="range"
					min={min}
					max={max}
					value={maxValue}
					ref={maxValueReference}
					onChange={(event) => {
						const value = Math.max(+event.target.value, minValue + 1);
						setMaxValue(value);
						event.target.value = value.toString();
					}}
					className="thumb thumb--zindex-4"
				/>

				<div className="slider">
					<div className="slider__track" />
					<div ref={range} className="slider__range" />
				</div>
			</div>
			{valueTo && valueTo(maxValue)}
		</Fragment>
	);
}
