import { useHttp } from "../../hooks/http.hook";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// actions
import { fetchHeroes, heroDelete, filteredHeroesSelector } from "./heroesSlice";

// components
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

const HeroesList = () => {
	const filteredHeroes = useSelector(filteredHeroesSelector);
	const heroesLoadingStatus = useSelector((state) => state.heroes.heroesLoadingStatus);

	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(fetchHeroes());
		// eslint-disable-next-line
	}, []);

	const deleteItem = useCallback(
		(id) => {
			request(`http://localhost:3001/heroes/${id}`, "DELETE")
				.then((res) => console.log(res))
				.then(dispatch(heroDelete(id)))
				.catch((err) => console.log(err));
		},
		// eslint-disable-next-line
		[request]
	);

	if (heroesLoadingStatus === "loading") {
		return <Spinner />;
	} else if (heroesLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
	}

	const renderHeroesList = (arr) => {
		// console.log("rendered hero list");
		if (arr.length === 0) {
			return <h5 className="text-center mt-5">Героев пока нет</h5>;
		}

		return arr.map(({ id, ...props }) => {
			return <HeroesListItem key={id} {...props} onDelete={() => deleteItem(id)} />;
		});
	};

	const elements = renderHeroesList(filteredHeroes);

	return (
		<>
			<ul>{elements}</ul>
		</>
	);
};

export default HeroesList;
