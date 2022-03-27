import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import store from "../../store";

// actions
import { heroAdd } from "../heroesList/heroesSlice";
import { fetchFilters, selectAll } from "../heroesFilters/filtersSlice";

// random id
import { v4 as uuidv4 } from "uuid";

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
	const [state, setState] = useState({
		name: "",
		text: "",
		element: "",
	});
	const { name, text, element } = state;

	const { filtersLoadingStatus } = useSelector((state) => state.filters);
	const filters = selectAll(store.getState());

	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(fetchFilters());
		// eslint-disable-next-line
	}, []);

	const optionsItems = (filterItems, filterStatus) => {
		if (filterStatus === "loading") {
			return <option style={{ color: "blue" }}>Загрузка элементов...</option>;
		} else if (filterStatus === "error") {
			return <option style={{ color: "red" }}>Ошибка загрузки</option>;
		}

		if (filterItems.length > 0) {
			return filterItems.map(({ name, label }) => {
				// eslint-disable-next-line
				if (name === "all") return;

				return (
					<option key={name} value={name}>
						{label}
					</option>
				);
			});
		}
	};

	const handleChange = (e) => {
		setState((state) => ({
			...state,
			[e.target.name]: e.target.value,
		}));
	};

	const clearInput = (state) => {
		for (let key in state) {
			setState((state) => ({
				...state,
				[key]: "",
			}));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const hero = {
			id: uuidv4(),
			name: name,
			description: text,
			element: element,
		};

		request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
			.then((hero) => dispatch(heroAdd(hero)))
			.catch((error) => console.log(error));

		clearInput(state);
	};

	return (
		<form className="border p-4 shadow-lg rounded" onSubmit={handleSubmit}>
			<div className="mb-3">
				<label htmlFor="name" className="form-label fs-4">
					Имя нового героя
				</label>
				<input
					required
					type="text"
					minLength="3"
					name="name"
					className="form-control"
					id="name"
					placeholder="Как меня зовут?"
					value={name}
					onChange={handleChange}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="text" className="form-label fs-4">
					Описание
				</label>
				<textarea
					required
					minLength="5"
					name="text"
					className="form-control"
					id="text"
					placeholder="Что я умею?"
					value={text}
					onChange={handleChange}
					style={{ height: "130px" }}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="element" className="form-label">
					Выбрать элемент героя
				</label>
				<select required className="form-select" id="element" name="element" onChange={handleChange} value={element}>
					<option value="">Я владею элементом...</option>
					{optionsItems(filters, filtersLoadingStatus)}
				</select>
			</div>

			<button type="submit" className="btn btn-primary">
				Создать
			</button>
		</form>
	);
};

export default HeroesAddForm;
