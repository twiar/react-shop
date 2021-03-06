import React, { useState } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import AppContext from "./context";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

function App() {
	const [items, setItems] = React.useState([]);
	const [cartItems, setCartItems] = React.useState([]);
	const [favorites, setFavorites] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState("");
	const [cartOpened, setCartOpened] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	const [width, setWidth] = useState(4000);

	React.useEffect(() => {
		setWidth(document.querySelector("html").clientWidth);
		(async () => {
			try {
				setIsLoading(true);
				const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
					axios.get("https://62e2ce15b54fc209b880c2ac.mockapi.io/cart"),
					axios.get("https://62e2ce15b54fc209b880c2ac.mockapi.io/favorites"),
					axios.get("https://62e2ce15b54fc209b880c2ac.mockapi.io/items"),
				]);
				setIsLoading(false);

				setCartItems(cartResponse.data);
				setFavorites(favoritesResponse.data);
				setItems(itemsResponse.data);
			} catch (error) {
				alert("Ошибка при запросе данных ;(");
				console.error(error);
			}
		})();
	}, []);

	const onAddToCart = async (obj) => {
		try {
			const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
			if (findItem) {
				setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
				await axios.delete(`https://62e2ce15b54fc209b880c2ac.mockapi.io/cart/${findItem.id}`);
			} else {
				setCartItems((prev) => [...prev, obj]);
				const { data } = await axios.post("https://62e2ce15b54fc209b880c2ac.mockapi.io/cart", obj);
				setCartItems((prev) =>
					prev.map((item) => {
						if (item.parentId === data.parentId) {
							return {
								...item,
								id: data.id,
							};
						}
						return item;
					}),
				);
			}
		} catch (error) {
			alert("Ошибка при добавлении в корзину");
			console.error(error);
		}
	};

	const onRemoveItem = (id) => {
		try {
			axios.delete(`https://62e2ce15b54fc209b880c2ac.mockapi.io/cart/${id}`);
			setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
		} catch (error) {
			alert("Ошибка при удалении из корзины");
			console.error(error);
		}
	};

	const onAddToFavorite = async (obj) => {
		try {
			if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
				axios.delete(`https://62e2ce15b54fc209b880c2ac.mockapi.io/favorites/${obj.id}`);
				setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
			} else {
				const { data } = await axios.post(
					"https://62e2ce15b54fc209b880c2ac.mockapi.io/favorites",
					obj,
				);
				setFavorites((prev) => [...prev, data]);
			}
		} catch (error) {
			alert("Не удалось добавить в закладки");
			console.error(error);
		}
	};

	const onChangeSearchInput = (event) => {
		setSearchValue(event.target.value);
	};

	const isItemAdded = (id) => {
		return cartItems.some((obj) => Number(obj.parentId) === Number(id));
	};

	return (
		<AppContext.Provider
			value={{
				items,
				cartItems,
				favorites,
				isItemAdded,
				onAddToFavorite,
				onAddToCart,
				setCartOpened,
				setCartItems,
			}}>
			<div className={width > 768 ? "wrapper clear" : "wrapper clear ml-15 mr-15"}>
				<Drawer
					items={cartItems}
					onClose={() => setCartOpened(false)}
					onRemove={onRemoveItem}
					opened={cartOpened}
				/>
				<Header onClickCart={() => setCartOpened(true)} />
				<Route path={process.env.PUBLIC_URL + "/"} exact>
					<Home
						items={items}
						cartItems={cartItems}
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						onChangeSearchInput={onChangeSearchInput}
						onAddToFavorite={onAddToFavorite}
						onAddToCart={onAddToCart}
						isLoading={isLoading}
						favorites={favorites}
					/>
				</Route>
				<Route path={process.env.PUBLIC_URL + "/favorites"} exact>
					<Favorites />
				</Route>

				<Route path={process.env.PUBLIC_URL + "/orders"} exact>
					<Orders />
				</Route>
			</div>
		</AppContext.Provider>
	);
}

export default App;
