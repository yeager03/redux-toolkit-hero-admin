import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

// благодаря createSlice мы в одном файле прописываем reducer и action вместе
// createSlice комбинирует в себе createReducer и createAction, поэтому внутри уже доступен immerJs

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
	heroesLoadingStatus: "idle",
});

export const fetchHeroes = createAsyncThunk("heroes/fetchHeroes", () => {
	// эта функция обязательно должна вернуть промис
	const { request } = useHttp();
	return request("http://localhost:3001/heroes");
});

const heroesSlice = createSlice({
	name: "heroes",
	initialState,
	reducers: {
		heroAdd: (state, action) => {
			heroesAdapter.addOne(state, action.payload);
		},
		heroDelete: (state, action) => {
			heroesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchHeroes.pending, (state) => {
				state.heroesLoadingStatus = "loading";
			})
			.addCase(fetchHeroes.fulfilled, (state, action) => {
				state.heroesLoadingStatus = "idle";
				heroesAdapter.setAll(state, action.payload);
			})
			.addCase(fetchHeroes.rejected, (state) => {
				state.heroesLoadingStatus = "error";
			})
			.addDefaultCase(() => {});
	},
});

const { actions, reducer } = heroesSlice;
export default reducer;

export const { heroAdd, heroDelete } = actions;

const { selectAll } = heroesAdapter.getSelectors((state) => state.heroes);
export const filteredHeroesSelector = createSelector(
	(state) => state.filters.selectedFilter,
	selectAll,
	(selectedFilter, heroes) => {
		if (selectedFilter === "all") {
			// console.log("render");
			return heroes;
		} else {
			return heroes.filter((hero) => hero.element === selectedFilter);
		}
	}
);
