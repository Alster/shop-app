import EventEmitter from "events";
import { useEffect, useState } from "react";

const CHANGE_KEY = "change";

type StateType<T> = Record<string, T>;

export class LocalListStorage<T> {
	_state: StateType<T> = {};
	events: EventEmitter = new EventEmitter();

	constructor(
		private readonly _key: string,
		private readonly _createKey: (item: T) => string,
	) {}

	addToStore(...items: T[]) {
		for (const item of items) {
			const key = this._createKey(item);
			if (this._state[key]) {
				throw new Error(`Item with key ${key} already exists in bag`);
			}
			this._state[key] = item;
		}
		this.storeState();
	}

	mergeStore(anotherStore: StateType<T>) {
		this._state = { ...this._state, ...anotherStore };
		this.storeState();
	}

	removeFromStore(...keys: string[]) {
		for (const key of keys) {
			delete this._state[key];
		}
		this.storeState();
	}

	clearStore() {
		this._state = {};
		this.storeState();
	}

	storeState() {
		localStorage.setItem(this._key, JSON.stringify(this._state));
		this.events.emit(CHANGE_KEY, { ...this._state });
	}
}

export function useLocalListStorage<T>(store: LocalListStorage<T>): StateType<T> {
	const [data, setData] = useState({ ...store._state });
	useEffect(() => {
		setData({ ...store._state });

		function listener(newState: StateType<T>) {
			setData(newState);
		}

		store.events.on(CHANGE_KEY, listener);

		return () => {
			store.events.off(CHANGE_KEY, listener);
		};
	}, []);
	return data;
}
