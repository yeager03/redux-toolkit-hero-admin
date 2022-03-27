import { configureStore } from "@reduxjs/toolkit";

// reducers
import heroes from "../components/heroesList/heroesSlice";
import filters from "../components/heroesFilters/filtersSlice";

const stringMiddleware = () => (next) => (action) => {
	if (typeof action === "string") {
		return next({
			type: action,
		});
	}

	return next(action);
};

const enhancer =
	(createStore) =>
	(...args) => {
		const store = createStore(...args);

		const oldDispatch = store.dispatch;
		store.dispatch = (action) => {
			if (typeof action === "string") {
				return oldDispatch({
					type: action,
				});
			}

			return oldDispatch(action);
		};

		return store;
	};

const store = configureStore({
	reducer: { heroes, filters },
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware), //используем встроенные middleWare
	devTools: process.env.NODE_ENV !== "production",
	enhancers: [enhancer],
});

export default store;
