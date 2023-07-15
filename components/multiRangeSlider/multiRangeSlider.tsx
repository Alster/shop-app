import React, {useCallback, useEffect, useState, useRef, ReactNode, Fragment} from "react";
import classnames from "classnames";
import "./multiRangeSlider.css";
import useDebounce from "@/utils/useDebounce";

export default function MultiRangeSlider({ min, max, defaultMinVal, defaultMaxVal, onChange, className, valueFrom, valueTo }: {
    min: number,
    max: number,
    defaultMinVal: number,
    defaultMaxVal: number,
    onChange: (range: { min: number, max: number }) => void,
    className?: string,
    valueFrom: (val: number) => ReactNode,
    valueTo: (val: number) => ReactNode
}) {
    const [minVal, setMinVal] = useState(defaultMinVal);
    const [maxVal, setMaxVal] = useState(defaultMaxVal);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLInputElement>(null);

    const debouncedMin = useDebounce(minVal, 500);
    const debouncedMax = useDebounce(maxVal, 500);

    const [firstCall, setFirstCall] = useState(true);
    useEffect(() => {
        console.log(firstCall)
        if (firstCall) {
            setFirstCall(false);
            return;
        }
        onChange({ min: minVal, max: maxVal });
    }, [debouncedMin, debouncedMax]);

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    return (
        <Fragment>
            {valueFrom && valueFrom(minVal)}
            <div className={`${className} h-4 flex items-center content-center`} onMouseLeave={() => onChange({ min: minVal, max: maxVal })}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValRef}
                    onChange={(event) => {
                        const value = Math.min(+event.target.value, maxVal - 1);
                        setMinVal(value);
                        event.target.value = value.toString();
                    }}
                    className={classnames("thumb thumb--zindex-3", {
                        "thumb--zindex-5": minVal > max - 100
                    })}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    ref={maxValRef}
                    onChange={(event) => {
                        const value = Math.max(+event.target.value, minVal + 1);
                        setMaxVal(value);
                        event.target.value = value.toString();
                    }}
                    className="thumb thumb--zindex-4"
                />

                <div className="slider">
                    <div className="slider__track" />
                    <div ref={range} className="slider__range" />
                </div>
            </div>
            {valueTo && valueTo(maxVal)}
        </Fragment>
    );
};
